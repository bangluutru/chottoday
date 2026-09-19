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

const USER_AGENT =
  'ChottoNewsBot/0.1 (+https://chottoday.com; soạn tin cho cộng đồng người Việt tại Nhật)';

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
 * Trang thông báo của bộ ngành Nhật: mỗi dòng là một <a> kèm ngày ở gần.
 * Cách đọc này cố tình thô — nó chỉ cần đủ tốt để rank có cái mà xếp; phần
 * nội dung thật được lấy riêng ở fetchArticleBody.
 */
export function parseNoticeList(html, baseUrl) {
  const items = [];
  const anchorRe = /<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;

  for (const [, href, inner] of html.matchAll(anchorRe)) {
    const title = stripHtml(inner);
    // Bỏ link điều hướng, link rỗng, link neo.
    if (title.length < 8) continue;
    if (href.startsWith('#') || href.startsWith('javascript:')) continue;

    let url;
    try {
      url = new URL(href, baseUrl).toString();
    } catch {
      continue;
    }
    if (!url.startsWith('https://')) continue;

    items.push({ title, summary: '', url, publishedAt: null });
  }

  // Trang thông báo hay lặp link (menu, breadcrumb). Giữ lần xuất hiện đầu.
  const seen = new Set();
  return items.filter((item) => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });
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

/** Lấy một nguồn. Không bao giờ ném — lỗi trả về trong kết quả. */
export async function fetchSource(source) {
  try {
    const text = await fetchText(source.url);
    const items =
      source.format === 'rss' ? parseFeed(text) : parseNoticeList(text, source.url);

    const usable = items
      .filter((item) => item.title && item.url)
      .slice(0, MAX_ITEMS_PER_SOURCE);

    return { source, items: usable, ok: true, error: null };
  } catch (error) {
    return { source, items: [], ok: false, error: error.message || String(error) };
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

  console.log('Thu thập tin');
  for (const result of results) {
    const mark = result.ok ? '✓' : '✗';
    const detail = result.ok ? `${result.items.length} tin` : result.error;
    console.log(`  ${mark} ${result.source.id.padEnd(16)} ${detail}`);
  }
  console.log(`  ${alive.length}/${results.length} nguồn trả lời`);

  if (dead.length) {
    console.warn(
      `  ⚠ Nguồn chết: ${dead.map((d) => d.source.id).join(', ')} — sửa URL trong sources.js`
    );
  }

  // Trải phẳng thành dạng rankItems nhận.
  const flattened = [];
  for (const result of alive) {
    for (const item of result.items) {
      flattened.push({ item, source: result.source });
    }
  }
  return { entries: flattened, results };
}
