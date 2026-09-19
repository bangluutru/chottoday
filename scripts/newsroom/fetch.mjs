/**
 * Newsroom — lấy tin từ các nguồn đã khai báo.
 *
 * Không dùng thư viện parse XML/HTML nào: định dạng cần đọc ở đây rất hẹp
 * (<item>/<entry> của RSS, danh sách <a> của trang thông báo), nên thêm một
 * dependency chỉ để làm việc đó là đổi rủi ro nhỏ lấy rủi ro lớn hơn.
 *
 * Nguyên tắc: KHÔNG được để một nguồn chết làm hỏng cả buổi sáng. Mỗi nguồn
 * fetch độc lập, lỗi được ghi lại và trả về cùng kết quả, chứ không ném ra
 * ngoài. Báo cáo cuối nói rõ nguồn nào sống, nguồn nào chết — đó là cách duy
 * nhất để biết URL trong sources.js có còn đúng hay không, vì môi trường dựng
 * pipeline bị chặn outbound nên không kiểm chứng trước được.
 */

import { SOURCES } from './sources.js';

/**
 * CHỈ ASCII. Header HTTP là ByteString (Latin-1), nên một chữ cái tiếng Việt
 * có dấu làm fetch() ném lỗi TRƯỚC khi gửi request — và vì mọi nguồn dùng
 * chung header này, cả sáu cùng chết với một thông báo không hề nhắc tới
 * encoding. Đừng "Việt hoá" dòng này cho thân thiện.
 */
const USER_AGENT =
  'ChottoNewsBot/0.1 (+https://chottoday.com; news digest for Vietnamese residents in Japan)';

export { USER_AGENT };

const FETCH_TIMEOUT_MS = 20_000;
const MAX_ITEMS_PER_SOURCE = 40;

/** Gỡ thẻ HTML và giải mã các entity hay gặp. */
export function stripHtml(html = '') {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function firstTag(xml, ...names) {
  for (const name of names) {
    // CDATA hoặc text thường, thẻ có thể mang thuộc tính.
    const match = xml.match(
      new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i')
    );
    if (match) {
      const raw = match[1].replace(/^<!\[CDATA\[([\s\S]*?)\]\]>$/, '$1');
      const value = stripHtml(raw);
      if (value) return value;
    }
  }
  return '';
}

function firstAttr(xml, tag, attr) {
  const match = xml.match(new RegExp(`<${tag}\\b[^>]*\\b${attr}="([^"]+)"`, 'i'));
  return match ? match[1] : '';
}

/** Chuẩn hoá ngày về ISO; trả null nếu không đọc được, để rank tự hạ điểm. */
export function normalizeDate(value) {
  if (!value) return null;
  const parsed = new Date(value);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();

  // Định dạng Nhật hay gặp trên trang bộ ngành: 令和8年9月19日 / 2026年9月19日
  const jp = value.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (jp) {
    const [, y, m, d] = jp;
    return new Date(Date.UTC(+y, +m - 1, +d)).toISOString();
  }
  return null;
}

/** Tách <item> (RSS) và <entry> (Atom). */
export function parseFeed(xml) {
  const blocks = [
    ...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi),
    ...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi),
  ];

  return blocks.map(([, block]) => {
    const link = firstTag(block, 'link') || firstAttr(block, 'link', 'href');
    return {
      title: firstTag(block, 'title'),
      summary: firstTag(block, 'description', 'summary', 'content'),
      url: link,
      publishedAt: normalizeDate(
        firstTag(block, 'pubDate', 'published', 'updated', 'dc:date')
      ),
    };
  });
}

/**
 * Rút ngày từ một đoạn chữ. Trả null nếu không thấy.
 *
 * Nhận cả niên hiệu Nhật (令和8年9月19日) lẫn dương lịch. 令和 bắt đầu từ 2019
 * nên 令和N = 2018 + N.
 */
export function extractDate(text = '') {
  const reiwa = text.match(/令和\s*(\d{1,2})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (reiwa) {
    const [, era, m, d] = reiwa;
    return new Date(Date.UTC(2018 + Number(era), Number(m) - 1, Number(d))).toISOString();
  }
  const jp = text.match(/(\d{4})\s*年\s*(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
  if (jp) {
    const [, y, m, d] = jp;
    return new Date(Date.UTC(+y, +m - 1, +d)).toISOString();
  }
  const slash = text.match(/(\d{4})[/.-](\d{1,2})[/.-](\d{1,2})/);
  if (slash) {
    const [, y, m, d] = slash;
    return new Date(Date.UTC(+y, +m - 1, +d)).toISOString();
  }
  return null;
}

/**
 * Ngày nằm gần cuối chuỗi nhất. Dùng cho phần chữ đứng TRƯỚC một link, nơi
 * ngày đúng là ngày sát link nhất, còn ngày xa hơn là của mục khác.
 */
export function lastDateIn(text = '') {
  const all = [...text.matchAll(/令和\s*\d{1,2}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日|\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日|\d{4}[/.-]\d{1,2}[/.-]\d{1,2}/g)];
  if (all.length === 0) return null;
  return extractDate(all[all.length - 1][0]);
}

/**
 * Dọn tiêu đề lấy từ anchor.
 *
 * Lần chạy thật thứ tư đẻ ra tiêu đề `2026年9月18日 政策分野 労災レセプト電算処理
 * システム 労災コメント関連テーブル NEW` — ngày và nhãn "mới" nằm ngay trong chữ
 * của link. Tiêu đề đó đi thẳng vào prompt và vào trường `title` của nguồn
 * trong bản ghi, nên rác ở đây chảy tới tận bài viết.
 *
 * CHỈ cắt ngày ở ĐẦU và nhãn "mới" ở CUỐI. Không đụng vào phần giữa: nhãn
 * phân loại như 政策分野 trông cũng thừa, nhưng đoán xem chữ nào là nhãn chữ
 * nào là tên thật thì sẽ có ngày cắt nhầm tiêu đề.
 */
export function cleanTitle(raw = '') {
  return raw
    .replace(
      /^\s*(?:令和\s*\d{1,2}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日|\d{4}\s*年\s*\d{1,2}\s*月\s*\d{1,2}\s*日|\d{4}[/.-]\d{1,2}[/.-]\d{1,2})\s*[)\]）】:：|｜–—-]*\s*/,
      ''
    )
    .replace(/[\s　]*(?:NEW|New|new|新着|NEW!|新規)\s*$/, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Đọc danh sách thông báo trên trang cơ quan nhà nước.
 *
 * CHỈ giữ link có ngày đăng ở gần. Đây là ranh giới phân biệt tin với điều
 * hướng, và nó đến từ một lần sai thật: sau khi đổi URL của 入管庁 sang trang
 * chủ để tránh 404, parser quét luôn mọi link menu, rồi pipeline soạn hai
 * "bài" từ trang "Giới thiệu tổ chức" và "Danh sách cơ quan vùng". Cả hai đều
 * là văn xuôi thật nên cổng đủ chất không chặn được — cổng đó đo độ đầy,
 * không đo tính thời sự.
 *
 * Một mục tin bao giờ cũng có ngày bên cạnh. Menu thì không.
 */
export function parseNoticeList(html, baseUrl, stats = null) {
  const items = [];
  const anchorRe = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

  // Đếm từng lý do loại. Lần chạy #4 làm 国税庁 và 年金機構 rơi từ 19 và 37 tin
  // xuống 0 — bộ lọc ngày xoá trắng hai cơ quan — mà log chỉ in "✓ 0 tin", y
  // hệt một nguồn hôm nay không có tin. Không có mấy con số này thì đứng
  // ngoài không thể biết trang đó không có link nào có ngày, hay nó chết vì
  // lý do khác.
  const counts = { anchors: 0, shortTitle: 0, badUrl: 0, noDate: 0, duplicate: 0, kept: 0 };

  // Con trỏ tới chỗ link TRƯỚC kết thúc. Ngày của một mục chỉ có thể nằm
  // trong khoảng giữa link trước và link này — nếu quét quá ranh giới đó thì
  // một link điều hướng đứng ngay sau một tin sẽ thừa hưởng ngày của tin ấy,
  // và lại lọt vào danh sách.
  let prevEnd = 0;

  for (const match of html.matchAll(anchorRe)) {
    const [whole, href, inner] = match;
    counts.anchors++;
    const rawTitle = stripHtml(inner);
    if (rawTitle.length < 8) { counts.shortTitle++; continue; }
    if (href.startsWith('#') || href.startsWith('javascript:')) { counts.badUrl++; continue; }

    let url;
    try {
      url = new URL(href, baseUrl).toString();
    } catch {
      counts.badUrl++;
      continue;
    }
    if (!url.startsWith('https://')) { counts.badUrl++; continue; }

    // Ngày thường nằm ngay TRƯỚC link (dạng <li>ngày<a>tiêu đề</a></li>).
    //
    // Phải lấy ngày GẦN NHẤT về phía trái, không phải ngày đầu tiên tìm thấy:
    // cửa sổ quét ngược vươn qua cả mục liền trước, nên "khớp đầu tiên từ trái
    // sang" sẽ gán cho mục này ngày của mục trước đó. Một lỗi im lặng — ngày
    // vẫn hợp lệ, chỉ là sai mục — và nó làm hỏng cả xếp hạng theo độ mới lẫn
    // ngày ghi trong bài.
    const at = match.index ?? 0;
    const end = at + whole.length;

    // Cửa sổ ngược: chỉ lấy chữ kể từ chỗ link trước kết thúc, tối đa 160 ký tự.
    const windowStart = Math.max(prevEnd, at - 160);
    const before = stripHtml(html.slice(windowStart, at));

    // Cửa sổ xuôi chỉ dùng khi KHÔNG còn link nào phía sau.
    //
    // Đoạn chữ nằm giữa hai link là nhập nhằng: nó có thể là ngày đứng sau
    // link trái, hoặc ngày đứng trước link phải. Danh sách thông báo của cơ
    // quan Nhật gần như luôn đặt ngày TRƯỚC tiêu đề, nên đoạn đó thuộc về link
    // bên phải. Nếu cho cả hai cùng đọc thì một link điều hướng đứng ngay
    // trước một tin sẽ vớ luôn ngày của tin ấy.
    //
    // Giữ cửa sổ xuôi cho mục CUỐI danh sách, nơi không còn link nào tranh
    // chấp — đủ để bắt dạng <a>tiêu đề</a>（2026年9月19日）.
    const nextAnchor = html.indexOf('<a', end);
    const after = nextAnchor === -1 ? stripHtml(html.slice(end, end + 80)) : '';

    prevEnd = end;

    // Đọc ngày từ tiêu đề THÔ, trước khi dọn: ở trang 厚労省 ngày nằm ngay
    // trong chữ của link, nên dọn trước là tự tay vứt mất dấu hiệu.
    const publishedAt = lastDateIn(before) || extractDate(`${rawTitle} ${after}`);
    if (!publishedAt) { counts.noDate++; continue; }

    const title = cleanTitle(rawTitle);
    if (title.length < 8) { counts.shortTitle++; continue; }

    counts.kept++;
    items.push({ title, summary: '', url, publishedAt });
  }

  const seen = new Set();
  const unique = items.filter((item) => {
    if (seen.has(item.url)) { counts.duplicate++; return false; }
    seen.add(item.url);
    return true;
  });
  counts.kept = unique.length;

  if (stats) Object.assign(stats, counts);
  return unique;
}

async function fetchText(url, { timeout = FETCH_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, {
      headers: { 'user-agent': USER_AGENT, accept: '*/*' },
      signal: controller.signal,
      redirect: 'follow',
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.text();
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Lấy phần chữ của một thông báo, để bước soạn draft có nguyên liệu thật thay
 * vì chỉ có mỗi tiêu đề. Giới hạn độ dài: cái cần là nội dung thông báo, không
 * phải cả trang kèm menu và chân trang.
 */
export async function fetchArticleBody(url, { maxChars = 6000 } = {}) {
  const html = await fetchText(url);
  const main =
    html.match(/<main\b[\s\S]*?<\/main>/i)?.[0] ||
    html.match(/<article\b[\s\S]*?<\/article>/i)?.[0] ||
    html.match(/<body\b[\s\S]*?<\/body>/i)?.[0] ||
    html;
  return stripHtml(main).slice(0, maxChars);
}

/**
 * Đo xem một đoạn chữ có đủ chất để soạn bài hay không.
 *
 * Vì sao cần: lần chạy thật đầu tiên soạn một bài từ trang MỤC LỤC của
 * 年金機構. Model không bịa — nó trung thực viết rằng nguồn không nêu chi tiết
 * — nhưng kết quả là một bài bảo người đọc đi đọc trang gốc. Caption cũng vậy.
 * Vòng tròn, và vô dụng với người đang cần biết phải làm gì.
 *
 * Trang mục lục và trang thông báo thật khác nhau ở chỗ dễ đo: trang mục lục
 * là một đống nhãn link ngắn, gần như không có câu hoàn chỉnh. Văn xuôi thật
 * thì có dấu kết câu. Nên đếm câu đáng tin hơn đếm ký tự — một trang menu dài
 * vẫn có thể vượt ngưỡng ký tự mà không có lấy một câu nào.
 */

/**
 * Số câu hoàn chỉnh tối thiểu — tín hiệu CHÍNH.
 *
 * Đếm câu, không đếm ký tự, vì tiếng Nhật đặc thông tin hơn hẳn: một thông báo
 * đầy đủ có thể chỉ hơn trăm ký tự mà vẫn nói hết việc. Ngưỡng ký tự đặt theo
 * cảm giác tiếng Việt sẽ loại nhầm đúng những thông báo ngắn gọn nhất, vốn là
 * loại dễ đọc nhất.
 */
export const MIN_BODY_SENTENCES = 3;

/**
 * Sàn ký tự — chỉ để chặn đầu vào bệnh hoạn như "。。。", thứ đếm ra ba "câu"
 * mà không có chữ nào. Đặt rất thấp là cố ý: một thông báo tiếng Nhật ba câu
 * chỉ hơn trăm ký tự vẫn là thông báo đầy đủ, và sàn cao sẽ loại đúng những
 * bản ngắn gọn nhất — loại dễ đọc nhất.
 */
export const MIN_BODY_CHARS = 60;

export function measureSubstance(text = '') {
  const clean = text.trim();
  // 。！？ cho tiếng Nhật, .!? cho phần còn lại. Yêu cầu sau dấu chấm phương
  // Tây là khoảng trắng hoặc hết chuỗi, để không đếm nhầm "index.html".
  const sentences = (clean.match(/[。！？]|[.!?](?=\s|$)/g) || []).length;
  return { chars: clean.length, sentences };
}

/**
 * Có đáng gọi model cho đoạn chữ này không.
 * Trả về lý do cụ thể khi không, để ghi vào bảng kê cho người duyệt đọc.
 */
export function hasEnoughSubstance(text = '') {
  const { chars, sentences } = measureSubstance(text);

  // Xét câu trước: đây là thứ phân biệt trang mục lục với văn xuôi thật.
  if (sentences < MIN_BODY_SENTENCES) {
    return {
      ok: false,
      reason: `chỉ ${sentences} câu hoàn chỉnh (cần ${MIN_BODY_SENTENCES}) — nhiều nhãn link, ít văn xuôi`,
      chars,
      sentences,
    };
  }
  if (chars < MIN_BODY_CHARS) {
    return {
      ok: false,
      reason: `thân bài chỉ ${chars} ký tự (cần ${MIN_BODY_CHARS}) — gần như rỗng`,
      chars,
      sentences,
    };
  }
  return { ok: true, reason: null, chars, sentences };
}

/** Lấy một nguồn. Không bao giờ ném — lỗi trả về trong kết quả. */
export async function fetchSource(source) {
  const stats = source.format === 'rss' ? null : {};
  try {
    const text = await fetchText(source.url);
    const items =
      source.format === 'rss' ? parseFeed(text) : parseNoticeList(text, source.url, stats);

    const usable = items
      .filter((item) => item.title && item.url)
      .slice(0, MAX_ITEMS_PER_SOURCE);

    return { source, items: usable, ok: true, error: null, stats, bytes: text.length };
  } catch (error) {
    return { source, items: [], ok: false, error: error.message || String(error), stats, bytes: 0 };
  }
}

/**
 * Lấy toàn bộ nguồn song song và in báo cáo sống/chết.
 * Báo cáo này là thứ xác nhận URL trong sources.js còn đúng hay không.
 */
export async function fetchAllSources(sources = SOURCES) {
  const results = await Promise.all(sources.map((source) => fetchSource(source)));

  const alive = results.filter((r) => r.ok);
  const dead = results.filter((r) => !r.ok);

  // Một nguồn trả 0 tin KHÔNG phải chuyện bình thường.
  //
  // Lần chạy #4 in "✓ nta-news 0 tin" và "✓ nenkin-news 0 tin" — dấu tick,
  // coi như thành công — trong khi thật ra bộ lọc ngày vừa xoá trắng hai cơ
  // quan (19 và 37 tin ở lần trước). Một nguồn hỏng trông y hệt một nguồn
  // hôm nay không có tin, và cái nhìn giống nhau ấy để lỗi sống nguyên một
  // vòng. Tách riêng nhóm này ra, kèm số liệu nói rõ trang tải về được bao
  // nhiêu và link bị loại vì lý do gì.
  const empty = alive.filter((r) => r.items.length === 0);

  console.log('Thu thập tin');
  for (const result of results) {
    const mark = !result.ok ? '✗' : result.items.length === 0 ? '⚠' : '✓';
    const detail = result.ok ? `${result.items.length} tin` : result.error;
    const st = result.stats;
    const why = st
      ? `  (${result.bytes} byte, ${st.anchors} link: ` +
        `${st.noDate} thiếu ngày, ${st.shortTitle} tiêu đề ngắn, ` +
        `${st.badUrl} link hỏng, ${st.duplicate} trùng)`
      : '';
    console.log(`  ${mark} ${result.source.id.padEnd(16)} ${detail}${why}`);
  }
  console.log(`  ${alive.length}/${results.length} nguồn trả lời`);

  if (dead.length) {
    console.warn(
      `  ⚠ Nguồn chết: ${dead.map((d) => d.source.id).join(', ')} — sửa URL trong sources.js`
    );
  }
  if (empty.length) {
    console.warn(
      `  ⚠ Nguồn tải được nhưng KHÔNG ra tin nào: ${empty.map((e) => e.source.id).join(', ')}\n` +
      '    Xem số trong ngoặc ở trên. "thiếu ngày" cao mà "link" cũng cao nghĩa là\n' +
      '    trang đó đặt ngày ở chỗ parseNoticeList chưa với tới — sửa parser, đừng\n' +
      '    nới lỏng bộ lọc, vì nới lỏng là mời link điều hướng quay lại.'
    );
  }

  // Trải phẳng thành dạng rankItems nhận.
  const flattened = [];
  for (const result of alive) {
    for (const item of result.items) {
      flattened.push({ item, source: result.source });
    }
  }
  return { entries: flattened, results, empty };
}
