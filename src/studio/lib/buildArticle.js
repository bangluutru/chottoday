/**
 * Ghép những mảnh rời (meta + sections + lựa chọn của người dùng) thành một
 * bản ghi bài viết đúng khuôn, rồi soát lại xem còn thiếu gì.
 *
 * Hai ranh giới cứng, cùng lý do như ở pipeline đã gỡ:
 *   - `status` luôn là 'review'. Studio KHÔNG xuất bản.
 *   - `reviewer` luôn là chỗ trống có nhãn, không bao giờ điền sẵn tên ai.
 *
 * Người duyệt đổi hai thứ đó bằng tay, sau khi đã mở từng link nguồn. Đó là
 * điểm duy nhất quyết định bài có lên site hay không, và nó phải là một hành
 * động có chủ ý.
 */

import { ARTICLE_STATUSES, SOURCE_TYPES } from '../../services/content/articleModel.js';
import { CATEGORY_DEFINITIONS } from '../../content/categories/categoryMap.js';

/** 12 kiểu ArticleRenderer thật sự hiểu. Ngoài danh sách này = render trống. */
export const VALID_SECTION_TYPES = new Set([
  'intro', 'heading', 'paragraph', 'list', 'steps', 'term',
  'note', 'warning', 'example', 'quote', 'toolCTA', 'sources',
]);

const VALID_CATEGORY_IDS = new Set(CATEGORY_DEFINITIONS.map((c) => c.id));

export function slugify(title = '') {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

function addMonths(isoDate, months) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}

/** Ước lượng phút đọc, tối thiểu 2. Đếm từ trong mọi chỗ có chữ. */
export function estimateReadingTime(sections = []) {
  let words = 0;
  for (const s of sections) {
    const bits = [s.content, s.text, s.title, s.caption, s.meaning];
    for (const item of s.items || []) {
      bits.push(typeof item === 'string' ? item : `${item.title || ''} ${item.text || ''} ${item.label || ''} ${item.value || ''}`);
    }
    words += bits.filter(Boolean).join(' ').split(/\s+/).filter(Boolean).length;
  }
  return Math.max(2, Math.round(words / 200));
}

/**
 * Dựng bản ghi hoàn chỉnh.
 * `input` gom từ parser; `choices` là những gì người dùng chỉnh trong studio.
 */
export function buildArticle(input = {}, choices = {}) {
  const now = choices.today || today();
  const title = (choices.title || input.title || '').trim();
  const slug = (choices.slug || input.slug || slugify(title)).trim();
  const category = VALID_CATEGORY_IDS.has(choices.category) ? choices.category : (input.category || 'doc');

  const sections = (input.sections || []).filter((s) => s && VALID_SECTION_TYPES.has(s.type));

  const sources = (choices.sources || input.sources || []).map((src, i) => ({
    id: src.id || `src-${i + 1}`,
    organization: src.organization || '',
    title: src.title || '',
    url: src.url || '',
    accessedAt: src.accessedAt || now,
    type: Object.values(SOURCE_TYPES).includes(src.type) ? src.type : SOURCE_TYPES.OFFICIAL,
  }));

  const excerpt = (choices.excerpt || input.excerpt || '').trim();

  return {
    id: choices.id || input.id || slug,
    slug,
    title,
    excerpt,
    category,
    tags: choices.tags || input.tags || [],
    publishedAt: now,
    updatedAt: now,
    readingTime: estimateReadingTime(sections),
    // Không bao giờ 'published'. Studio soạn bản nháp, người duyệt xuất bản.
    status: ARTICLE_STATUSES.REVIEW,
    coverImage: choices.coverImage || input.coverImage || '/images/hero-everyday-japan.jpg',
    socialImage: choices.socialImage || `/images/og/og-${slug}.png`,
    author: {
      name: 'Ban Biên Tập Chotto',
      role: choices.authorRole || input.authorRole || 'Nội dung hướng dẫn',
    },
    ...(input.shortAnswer ? { shortAnswer: input.shortAnswer } : {}),
    ...(input.keyTakeaways ? { keyTakeaways: input.keyTakeaways } : {}),
    ...(input.applicability ? { applicability: input.applicability } : {}),
    sections,
    sources,
    review: {
      lastVerifiedAt: now,
      reviewAfter: addMonths(now, 6),
      reviewer: 'CHƯA DUYỆT',
    },
    relatedArticleIds: choices.relatedArticleIds || [],
    relatedToolIds: choices.relatedToolIds || [],
    seo: {
      metaTitle: (choices.metaTitle || `${title} | Chotto`).slice(0, 70),
      metaDescription: (choices.metaDescription || excerpt).slice(0, 160),
      canonical: `https://chottoday.com/articles/${slug}`,
      structuredDataType: 'Article',
    },
  };
}

/**
 * Soát bản ghi và trả về danh sách việc còn thiếu.
 *
 * Chia làm hai mức, vì `validate-content.mjs` chỉ siết bài `published`:
 *   blocking — sẽ làm CI đỏ ngay khi đổi sang published
 *   advisory — máy không chặn, nhưng thiếu thì ba khối lớn trong bố cục bài
 *              biến mất và bài tụt thành mảng chữ chạy dài
 */
export function reviewArticle(article = {}) {
  const blocking = [];
  const advisory = [];

  if (!article.title) blocking.push('Thiếu `title`');
  if (!article.excerpt) blocking.push('Thiếu `excerpt`');
  if (!article.slug || !/^[a-z0-9-]+$/.test(article.slug)) {
    blocking.push('`slug` phải là chữ thường, số và dấu gạch ngang');
  }
  if (!VALID_CATEGORY_IDS.has(article.category)) blocking.push(`Chuyên mục không hợp lệ: "${article.category}"`);
  if (!article.sections || article.sections.length === 0) blocking.push('Bài không có nội dung nào');

  for (const [i, s] of (article.sections || []).entries()) {
    if (!VALID_SECTION_TYPES.has(s.type)) {
      blocking.push(`Section ${i + 1} dùng kiểu "${s.type}" — sẽ render ra TRỐNG`);
    }
  }

  if (!article.sources || article.sources.length === 0) {
    blocking.push('Chưa có nguồn nào — bài không đăng được nếu thiếu');
  } else {
    for (const [i, src] of article.sources.entries()) {
      if (!src.url.startsWith('https://')) blocking.push(`Nguồn ${i + 1}: URL phải bắt đầu bằng https://`);
      if (!src.organization) blocking.push(`Nguồn ${i + 1}: thiếu tên cơ quan`);
      if (!src.title) blocking.push(`Nguồn ${i + 1}: thiếu tiêu đề trang nguồn`);
    }
  }

  if (!article.shortAnswer) advisory.push('Thiếu `shortAnswer` — mất khối "Tóm tắt giải pháp nhanh"');
  if (!article.keyTakeaways?.length) advisory.push('Thiếu `keyTakeaways` — mất khối "Bạn sẽ biết sau bài này"');
  if (!article.applicability) advisory.push('Thiếu `applicability` — mất khối "Phạm vi áp dụng"');
  if (!article.tags?.length) advisory.push('Chưa có thẻ (tags)');

  return { blocking, advisory, ok: blocking.length === 0 };
}
