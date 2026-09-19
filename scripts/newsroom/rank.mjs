/**
 * Newsroom — chấm điểm và xếp hạng tin.
 *
 * Đây là bộ LỌC THÔ, không phải bộ phán xét. Việc của nó là đẩy 5–10 tin đáng
 * đọc nhất lên đầu để bước sau (viết draft) và con người không phải lội qua
 * hàng trăm thông báo hành chính mỗi sáng. Nó cố tình không quyết định tin nào
 * được đăng.
 *
 * Điểm = (liên quan tới người nước ngoài) × (chủ đề Chotto) × (tính hành động)
 *        × (uy tín nguồn) × (độ mới)
 *
 * Mọi từ khoá để lộ ra ngoài thành hằng số có tên, vì đây là thứ sẽ phải chỉnh
 * liên tục theo thực tế tin tức — chỉnh ở đây, đừng rải vào logic.
 */

/**
 * Dấu hiệu tin có dính tới người nước ngoài. Thiếu hẳn nhóm này thì tin gần
 * như chắc chắn không phải việc của Chotto, dù nó là tin lớn tới đâu.
 */
const FOREIGNER_MARKERS = [
  '在留', '外国人', '入管', '出入国', 'ビザ', '査証', '永住', '帰化', '難民',
  '技能実習', '特定技能', '留学生', '日本語学校', '再入国', '在留カード',
  'マイナンバー', '国際', '多文化',
  'foreign', 'foreigner', 'resident', 'visa', 'immigration', 'residency',
];

/**
 * Từ khoá theo 9 chủ đề của categoryMap.js. Giữ đúng id chủ đề để tin xếp
 * được thẳng vào taxonomy sẵn có, không đẻ ra hệ phân loại thứ hai.
 */
const TOPIC_KEYWORDS = {
  doc: ['在留', '入管', '出入国', 'ビザ', '査証', '手続', '申請', '届出', 'マイナンバー', '住民票', 'visa', 'residence'],
  work: ['税', '所得', '確定申告', '年末調整', '年金', '給与', '最低賃金', '雇用', 'tax', 'pension', 'salary', 'wage'],
  health: ['保険', '医療', '健康', '予防接種', '診療', 'ワクチン', 'health', 'insurance', 'medical'],
  life: ['住宅', '賃貸', '引越', 'ごみ', '電気', 'ガス', '水道', '運転免許', 'housing', 'rent'],
  study: ['日本語', '教育', '学校', '試験', '留学', 'japanese language', 'education'],
  newcomer: ['来日', '入国', '初めて', '新規', 'arrival', 'newcomer'],
  job: ['求人', '転職', '失業', '労災', '解雇', 'employment', 'job'],
  family: ['子育て', '育児', '保育', '児童手当', '出産', 'childcare', 'maternity'],
  tool: [],
};

/**
 * Tin "làm được gì đó" quan trọng hơn tin "biết cho vui". Một thay đổi thủ tục
 * có hạn chót đáng lên page hơn một bản thống kê.
 */
const ACTIONABLE_MARKERS = [
  '開始', '変更', '改正', '施行', '締切', '期限', '受付', '募集', '延長',
  '新設', '廃止', '義務', '必要', '注意', 'お知らせ',
  'deadline', 'change', 'require', 'start', 'apply',
];

/**
 * Dấu hiệu tin THỰC SỰ nói về Nhật.
 *
 * Cần vì nguồn báo chí đưa tin toàn cầu. Lần chạy thật đầu tiên đẩy lên đầu
 * bảng tin "Trump extends push for $100,000 H-1B visas" — nó khớp 'visa' và
 * 'foreign' nên qua được bộ lọc, nhưng H-1B là visa Mỹ, hoàn toàn vô nghĩa với
 * người Việt ở Nhật. Bộ lọc bắt đúng chữ mà trượt đúng ý.
 */
const JAPAN_MARKERS = [
  '日本', '在留', '入管', '出入国', '厚生労働', '法務省', '国税庁', '年金機構',
  '市役所', '区役所', '都道府県', '東京', '大阪', '愛知', '在日',
  'japan', 'japanese', 'tokyo', 'osaka', 'nhật', 'nhat ban',
];

/**
 * Hệ thống nhập cư của nước khác. Cùng từ vựng với Nhật nhưng khác hẳn việc.
 */
const OTHER_COUNTRY_MARKERS = [
  'h-1b', 'h1b', 'green card', 'uscis', 'schengen', 'eu blue card',
  'k-eta', 'visa mỹ', 'visa my', 'visa úc', 'visa canada',
];

/** Tin trong nước không liên quan — loại thẳng để đỡ nhiễu. */
const NOISE_MARKERS = [
  '芸能', 'スポーツ', '野球', 'サッカー', '相撲', '天気', '株価', '為替',
  'entertainment', 'sports', 'baseball', 'soccer',
];

const WEIGHT = {
  foreignerMarker: 3.0,
  topicKeyword: 1.5,
  actionable: 1.0,
  topicHint: 2.0,
  noisePenalty: -5.0,
};

/** Tin cũ hơn ngần này ngày thì coi như hết thời sự. */
const MAX_AGE_DAYS = 7;

function countMatches(haystack, needles) {
  const lower = haystack.toLowerCase();
  let hits = 0;
  for (const needle of needles) {
    if (lower.includes(needle.toLowerCase())) hits++;
  }
  return hits;
}

/**
 * Độ mới: 1.0 cho tin hôm nay, giảm tuyến tính về 0 ở mốc MAX_AGE_DAYS.
 * Tin không rõ ngày được cho 0.5 — không loại, nhưng không ưu ái.
 */
export function recencyFactor(publishedAt, now = new Date()) {
  if (!publishedAt) return 0.5;
  const published = publishedAt instanceof Date ? publishedAt : new Date(publishedAt);
  if (Number.isNaN(published.getTime())) return 0.5;

  const ageDays = (now.getTime() - published.getTime()) / 86_400_000;
  if (ageDays < 0) return 1.0; // lệch múi giờ, coi như mới
  if (ageDays >= MAX_AGE_DAYS) return 0;
  return 1 - ageDays / MAX_AGE_DAYS;
}

/**
 * Chủ đề khớp nhất với một tin, hoặc null nếu không tin chắc.
 * Dùng để gợi ý phân loại, không phải để khẳng định.
 */
export function inferTopic(item, source = null) {
  const text = `${item.title || ''} ${item.summary || ''}`;
  let best = null;
  let bestHits = 0;

  for (const [topicId, keywords] of Object.entries(TOPIC_KEYWORDS)) {
    const hits = countMatches(text, keywords);
    if (hits > bestHits) {
      best = topicId;
      bestHits = hits;
    }
  }

  // Nguồn chuyên trách thắng khi nội dung không đủ rõ.
  if (!best && source?.topicHints?.length) {
    return source.topicHints[0];
  }
  return best;
}

/**
 * Chấm điểm một tin. Trả về cả điểm lẫn lý do, để khi draft sai còn truy được
 * vì sao tin đó lọt vào.
 */
export function scoreItem(item, source, now = new Date()) {
  const text = `${item.title || ''} ${item.summary || ''}`;

  const foreignerHits = countMatches(text, FOREIGNER_MARKERS);
  const actionableHits = countMatches(text, ACTIONABLE_MARKERS);
  const noiseHits = countMatches(text, NOISE_MARKERS);

  const topic = inferTopic(item, source);
  const topicHits = topic ? countMatches(text, TOPIC_KEYWORDS[topic] || []) : 0;

  const hintBonus =
    source?.topicHints?.length && topic && source.topicHints.includes(topic)
      ? WEIGHT.topicHint
      : 0;

  const raw =
    foreignerHits * WEIGHT.foreignerMarker +
    topicHits * WEIGHT.topicKeyword +
    actionableHits * WEIGHT.actionable +
    hintBonus +
    noiseHits * WEIGHT.noisePenalty;

  const recency = recencyFactor(item.publishedAt, now);
  const sourceWeight = source?.weight ?? 0.5;
  const score = Math.max(0, raw) * recency * sourceWeight;

  return {
    score: Number(score.toFixed(3)),
    topic,
    signals: { foreignerHits, topicHits, actionableHits, noiseHits, recency: Number(recency.toFixed(3)), sourceWeight },
  };
}

/**
 * Xếp hạng toàn bộ tin thu được.
 *
 * Loại bỏ: tin hết thời sự, tin dính nhiễu, và tin không có một dấu hiệu nào
 * liên quan tới người nước ngoài — nhóm cuối là bộ lọc quan trọng nhất, vì
 * không có nó thì mỗi sáng sẽ toàn tin nội địa chung chung.
 */
export function rankItems(items, { now = new Date(), limit = 10, minScore = 1.0 } = {}) {
  const scored = [];

  for (const { item, source } of items) {
    const text = `${item.title || ''} ${item.summary || ''}`;
    const result = scoreItem(item, source, now);

    if (result.signals.noiseHits > 0) continue;
    if (result.signals.recency === 0) continue;
    if (result.signals.foreignerHits === 0 && !source?.topicHints?.length) continue;

    // Thủ tục nhập cư của nước khác dùng đúng từ vựng như của Nhật nhưng là
    // việc hoàn toàn khác. Loại thẳng, bất kể nguồn nào.
    if (countMatches(text, OTHER_COUNTRY_MARKERS) > 0) continue;

    // Nguồn báo chí đưa tin toàn cầu nên phải tự chứng minh tin này nói về
    // Nhật. Nguồn cơ quan nhà nước Nhật thì hiển nhiên, không bắt chứng minh.
    if (source?.kind === 'media' && countMatches(text, JAPAN_MARKERS) === 0) continue;

    if (result.score < minScore) continue;

    scored.push({ ...item, sourceId: source?.id ?? null, ...result });
  }

  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit);
}

export const __testing = { TOPIC_KEYWORDS, FOREIGNER_MARKERS, JAPAN_MARKERS, OTHER_COUNTRY_MARKERS, MAX_AGE_DAYS };
