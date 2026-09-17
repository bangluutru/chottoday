import { ALL_ARTICLES } from './articlesList.js';
import { isArticlePublished } from '../../services/content/articleModel.js';

/**
 * Normalizes text for search: lowercase, removes Vietnamese diacritics
 * e.g. "Tiền lương" -> "tien luong", "住民税" -> "住民税"
 */
export function normalizeSearchText(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .trim();
}

export function getAllArticles() {
  return ALL_ARTICLES;
}

export function getPublishedArticles() {
  return ALL_ARTICLES.filter(isArticlePublished);
}

export function getArticleBySlug(slug) {
  return ALL_ARTICLES.find((a) => a.slug === slug) || null;
}

export function getArticlesByCategory(categoryKey) {
  if (!categoryKey || categoryKey === 'all') return ALL_ARTICLES;
  return ALL_ARTICLES.filter((a) => a.category === categoryKey);
}

/**
 * Resolves related articles for an article.
 * Supports both relatedArticleIds (array of slugs) and legacy relatedArticles object arrays.
 */
export function getRelatedArticles(article) {
  if (!article) return [];
  if (Array.isArray(article.relatedArticleIds) && article.relatedArticleIds.length > 0) {
    return article.relatedArticleIds
      .map((slug) => getArticleBySlug(slug))
      .filter(Boolean);
  }
  if (Array.isArray(article.relatedArticles)) {
    return article.relatedArticles;
  }
  return [];
}

export function getFeaturedArticles() {
  return [
    ALL_ARTICLES.find((a) => a.slug === 'mat-the-zairyu-thi-lam-gi'),
    ALL_ARTICLES.find((a) => a.slug === 'luong-30-man-thuc-nhan-bao-nhieu'),
  ].filter(Boolean);
}

/**
 * Client-side search across title, excerpt, tags, category, and Japanese terms
 */
export function searchArticles(query = '') {
  const normQuery = normalizeSearchText(query);
  if (!normQuery) return [];

  const rawQuery = query.toLowerCase().trim();

  return ALL_ARTICLES.filter((article) => {
    const normTitle = normalizeSearchText(article.title);
    const normExcerpt = normalizeSearchText(article.excerpt);
    const normTags = (article.tags || []).map((t) => normalizeSearchText(t)).join(' ');

    // Match normalized Vietnamese
    if (
      normTitle.includes(normQuery) ||
      normExcerpt.includes(normQuery) ||
      normTags.includes(normQuery)
    ) {
      return true;
    }

    // Match raw Japanese terms or English acronyms (e.g. "zairyu", "nenkin", "juminzei", "在留カード")
    const rawContentString = JSON.stringify(article).toLowerCase();
    return rawContentString.includes(rawQuery);
  });
}
