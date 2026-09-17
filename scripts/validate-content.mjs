/**
 * Content Validation Script (Phase 4)
 * 
 * Validates:
 * - Article schema integrity
 * - Unique, URL-safe slugs
 * - Valid category associations
 * - Date consistency (publishedAt, updatedAt)
 * - Structured sources for published regulatory articles
 * - Internal link and reference integrity (relatedArticleIds -> 0 broken refs)
 */

import { ALL_ARTICLES } from '../src/content/articles/articlesList.js';
import { CATEGORY_DEFINITIONS } from '../src/content/categories/categoryMap.js';
import { ARTICLE_STATUSES, SOURCE_TYPES } from '../src/services/content/articleModel.js';

const validCategoryIds = new Set(CATEGORY_DEFINITIONS.map((c) => c.id));
const validStatuses = new Set(Object.values(ARTICLE_STATUSES));
const validSourceTypes = new Set(Object.values(SOURCE_TYPES));

const allSlugs = new Set();
const allIds = new Set();
const errors = [];
const warnings = [];

let publishedCount = 0;
let reviewCount = 0;

for (const article of ALL_ARTICLES) {
  const identifier = article.slug || article.id || 'unknown';

  // 1. ID & Slug
  if (!article.id) {
    errors.push(`[${identifier}] Missing 'id'`);
  } else if (allIds.has(article.id)) {
    errors.push(`[${identifier}] Duplicate 'id': "${article.id}"`);
  } else {
    allIds.add(article.id);
  }

  if (!article.slug) {
    errors.push(`[${identifier}] Missing 'slug'`);
  } else if (!/^[a-z0-9-]+$/.test(article.slug)) {
    errors.push(`[${identifier}] Slug "${article.slug}" must be URL-safe lowercase kebab-case`);
  } else if (allSlugs.has(article.slug)) {
    errors.push(`[${identifier}] Duplicate slug "${article.slug}"`);
  } else {
    allSlugs.add(article.slug);
  }

  // 2. Title & Excerpt
  if (!article.title || typeof article.title !== 'string') {
    errors.push(`[${identifier}] Missing or invalid 'title'`);
  }
  if (!article.excerpt || typeof article.excerpt !== 'string') {
    errors.push(`[${identifier}] Missing or invalid 'excerpt'`);
  }

  // 3. Category
  if (!article.category || !validCategoryIds.has(article.category)) {
    errors.push(`[${identifier}] Invalid category: "${article.category}"`);
  }

  // 4. Status
  if (!article.status) {
    errors.push(`[${identifier}] Missing 'status'`);
  } else if (!validStatuses.has(article.status)) {
    errors.push(`[${identifier}] Invalid status "${article.status}"`);
  }

  if (article.status === ARTICLE_STATUSES.PUBLISHED) {
    publishedCount++;
  } else if (article.status === ARTICLE_STATUSES.REVIEW) {
    reviewCount++;
  }

  // 5. Dates
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!article.publishedAt || !dateRegex.test(article.publishedAt)) {
    errors.push(`[${identifier}] Invalid or missing 'publishedAt' (expected YYYY-MM-DD): "${article.publishedAt}"`);
  }
  if (article.updatedAt) {
    if (!dateRegex.test(article.updatedAt)) {
      errors.push(`[${identifier}] Invalid 'updatedAt' format: "${article.updatedAt}"`);
    } else if (article.publishedAt && article.updatedAt < article.publishedAt) {
      errors.push(`[${identifier}] updatedAt (${article.updatedAt}) cannot precede publishedAt (${article.publishedAt})`);
    }
  }

  // 6. Published Article Requirements
  if (article.status === ARTICLE_STATUSES.PUBLISHED) {
    // Must have sources
    if (!Array.isArray(article.sources) || article.sources.length === 0) {
      errors.push(`[${identifier}] Published article must have at least one authoritative source in 'sources'`);
    } else {
      for (const src of article.sources) {
        if (!src.id || !src.organization || !src.title || !src.url) {
          errors.push(`[${identifier}] Incomplete source object: ${JSON.stringify(src)}`);
        }
        if (src.type && !validSourceTypes.has(src.type)) {
          errors.push(`[${identifier}] Invalid source type "${src.type}"`);
        }
        if (src.url && !src.url.startsWith('https://') && !src.url.startsWith('http://')) {
          errors.push(`[${identifier}] Source URL must be valid HTTP/HTTPS: "${src.url}"`);
        }
      }
    }

    // Must have SEO meta
    if (!article.seo || !article.seo.metaTitle || !article.seo.metaDescription) {
      errors.push(`[${identifier}] Published article must have valid 'seo' metadata (metaTitle, metaDescription)`);
    }
  }

  // 7. Internal Reference Integrity (relatedArticleIds)
  if (Array.isArray(article.relatedArticleIds)) {
    for (const relSlug of article.relatedArticleIds) {
      const exists = ALL_ARTICLES.some((a) => a.slug === relSlug);
      if (!exists) {
        errors.push(`[${identifier}] Broken internal reference in relatedArticleIds: "${relSlug}"`);
      }
    }
  }
}

// 8. Output Report
console.log('====================================');
console.log('CHOTTO CONTENT VALIDATION REPORT');
console.log('====================================');
console.log(`Total Articles:      ${ALL_ARTICLES.length}`);
console.log(`Published Articles:  ${publishedCount}`);
console.log(`In Review / Draft:   ${reviewCount}`);
console.log(`Unique Slugs:        ${allSlugs.size}`);
console.log(`Errors:              ${errors.length}`);
console.log(`Warnings:            ${warnings.length}`);

if (errors.length > 0) {
  console.error('\n❌ Content Validation FAILED:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log('\n✅ Content Validation PASS: All articles, sources, and references are valid.');
  process.exit(0);
}
