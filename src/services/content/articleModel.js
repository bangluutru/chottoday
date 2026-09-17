/**
 * Production Content Schema & Governance Constants
 * 
 * Phase 4 Core Content Model:
 * id, slug, title, excerpt, category, tags, publishedAt, updatedAt,
 * readingTime, author, coverImage, socialImage, status,
 * applicability, review, shortAnswer, keyTakeaways, sections, sources,
 * relatedArticleIds, relatedToolIds, seo
 */

export const ARTICLE_STATUSES = {
  DRAFT: 'draft',
  REVIEW: 'review',
  VERIFIED: 'verified',
  PUBLISHED: 'published',
  REVIEW_DUE: 'review_due',
  NEEDS_UPDATE: 'needs_update',
  ARCHIVED: 'archived',
};

export const SOURCE_TYPES = {
  OFFICIAL: 'official',   // Japanese government, municipal offices, national ministries
  PRIMARY: 'primary',     // Legal texts, statutory forms, official documentation
  REFERENCE: 'reference', // Established professional guides, institutional analyses
};

/**
 * Checks whether an article has a public status meant for readers.
 * Reader-facing indexable articles must have status === 'published'.
 */
export function isArticlePublished(article) {
  return article && article.status === ARTICLE_STATUSES.PUBLISHED;
}

/**
 * Checks whether an article has passed official source verification.
 */
export function isArticleVerified(article) {
  return (
    article &&
    (article.status === ARTICLE_STATUSES.PUBLISHED || article.status === ARTICLE_STATUSES.VERIFIED) &&
    Array.isArray(article.sources) &&
    article.sources.some((s) => s.type === SOURCE_TYPES.OFFICIAL || s.type === SOURCE_TYPES.PRIMARY)
  );
}
