/**
 * Tool Reference Validation Script
 *
 * Requirements:
 * Inspects:
 * - articles (relatedToolIds and toolCTA sections)
 * - categories (relatedToolIds)
 * - problems (relatedToolIds and recommendedToolId)
 * - homepage featured tools (src/data/homepage.js)
 *
 * Asserts zero orphan IDs against the Toolio compatibility snapshot.
 */


// 1. Load Toolio Snapshot
const { TOOLIO_SNAPSHOT } = await import('../src/services/toolRegistry/toolioSnapshot.js');
const validToolIds = new Set(TOOLIO_SNAPSHOT.map((t) => t.id));

// 2. Load Articles
const { ALL_ARTICLES } = await import('../src/content/articles/articlesList.js');
const articleRefs = [];
for (const article of ALL_ARTICLES) {
  if (Array.isArray(article.relatedToolIds)) {
    for (const id of article.relatedToolIds) {
      articleRefs.push({ source: `article:${article.slug}`, toolId: id });
    }
  }
  if (Array.isArray(article.sections)) {
    for (const section of article.sections) {
      if (section.type === 'toolCTA' && section.toolId) {
        articleRefs.push({ source: `article:${article.slug} (toolCTA)`, toolId: section.toolId });
      }
    }
  }
}

// 3. Load Categories
const { CATEGORY_DEFINITIONS } = await import('../src/content/categories/categoryMap.js');
const categoryRefs = [];
for (const category of CATEGORY_DEFINITIONS) {
  if (Array.isArray(category.relatedToolIds)) {
    for (const id of category.relatedToolIds) {
      categoryRefs.push({ source: `category:${category.slug}`, toolId: id });
    }
  }
}

// 4. Load Problems
const { USER_PROBLEMS } = await import('../src/content/problems/problemsList.js');
const problemRefs = [];
for (const problem of USER_PROBLEMS) {
  if (problem.recommendedToolId) {
    problemRefs.push({ source: `problem:${problem.id}`, toolId: problem.recommendedToolId });
  }
  if (Array.isArray(problem.relatedToolIds)) {
    for (const id of problem.relatedToolIds) {
      if (id !== problem.recommendedToolId) {
        problemRefs.push({ source: `problem:${problem.id}`, toolId: id });
      }
    }
  }
}

// 5. Load Homepage Featured Tools
// Imported rather than regex-scraped: the homepage tile list is plain data,
// so a stale selector can no longer silently skip every reference.
const { HOME_TOOL_TILES } = await import('../src/data/homepage.js');
const homepageRefs = HOME_TOOL_TILES.map((tile) => ({
  source: 'homepage:tool-tiles',
  toolId: tile.toolId,
}));

// 5b. Load Tool Catalogue (/tools and /tools/:slug)
// Entries with a `calculator` run on chottoday.com itself and reference no
// Toolio tool; everything else must resolve against the snapshot.
const { TOOL_CATALOGUE } = await import('../src/data/tools.js');
const { TOOL_PAGES } = await import('../src/data/toolPages.js');

// Chotto-hosted calculators and not-yet-built tools reference no Toolio tool.
const catalogueRefs = TOOL_CATALOGUE.filter(
  (entry) => !entry.calculator && !entry.comingSoon
).map((entry) => ({
  source: `tools:${entry.slug}`,
  toolId: entry.toolId,
}));

// Sidebar picks on a tool page point at catalogue slugs, not Toolio IDs, so
// they are checked against the catalogue rather than the snapshot.
const catalogueSlugs = new Set(TOOL_CATALOGUE.map((entry) => entry.slug));
const brokenSlugRefs = [];

// A catalogue entry must be exactly one kind, and the kinds that carry no
// Toolio tool must supply their own name and description.
const malformedEntries = [];
for (const entry of TOOL_CATALOGUE) {
  const kinds = [entry.toolId, entry.calculator, entry.comingSoon].filter(Boolean).length;
  if (kinds !== 1) {
    malformedEntries.push({
      slug: entry.slug,
      why: `phải có đúng một trong toolId / calculator / comingSoon (đang có ${kinds})`,
    });
  }
  if ((entry.calculator || entry.comingSoon) && !(entry.name && entry.description)) {
    malformedEntries.push({ slug: entry.slug, why: 'thiếu name hoặc description' });
  }
}

// Articles a catalogue entry claims must actually exist.
const articleSlugs = new Set(ALL_ARTICLES.map((article) => article.slug));
for (const entry of TOOL_CATALOGUE) {
  for (const claimed of entry.articleSlugs || []) {
    if (!articleSlugs.has(claimed)) {
      brokenSlugRefs.push({ source: `tools:${entry.slug} (articleSlugs)`, slug: claimed });
    }
  }
}
for (const [pageSlug, page] of Object.entries(TOOL_PAGES)) {
  if (!catalogueSlugs.has(pageSlug)) {
    brokenSlugRefs.push({ source: 'toolPages', slug: pageSlug });
  }
  for (const relatedSlug of page.relatedToolSlugs || []) {
    if (!catalogueSlugs.has(relatedSlug)) {
      brokenSlugRefs.push({ source: `toolPages:${pageSlug}`, slug: relatedSlug });
    }
  }
}

// 6. Validation Execution
const allRefs = [
  ...articleRefs.map((r) => ({ ...r, group: 'Articles' })),
  ...categoryRefs.map((r) => ({ ...r, group: 'Categories' })),
  ...problemRefs.map((r) => ({ ...r, group: 'Problems' })),
  ...homepageRefs.map((r) => ({ ...r, group: 'Homepage' })),
  ...catalogueRefs.map((r) => ({ ...r, group: 'Tool catalogue' })),
];

const orphans = [];
let resolvedCount = 0;

for (const ref of allRefs) {
  if (validToolIds.has(ref.toolId)) {
    resolvedCount++;
  } else {
    orphans.push(ref);
  }
}

console.log('Tool Reference Validation');
console.log(`Articles:    ${String(articleRefs.length).padStart(2)} references`);
console.log(`Categories:  ${String(categoryRefs.length).padStart(2)} references`);
console.log(`Problems:    ${String(problemRefs.length).padStart(2)} references`);
console.log(`Homepage:    ${String(homepageRefs.length).padStart(2)} references`);
console.log(`Tools:       ${String(catalogueRefs.length).padStart(2)} references (${TOOL_CATALOGUE.length} mục trong danh mục)`);
console.log(`Total:       ${String(allRefs.length).padStart(2)}`);
console.log(`Resolved:    ${String(resolvedCount).padStart(2)}`);
console.log(`Orphan:      ${String(orphans.length).padStart(2)}`);

if (orphans.length > 0 || brokenSlugRefs.length > 0 || malformedEntries.length > 0) {
  if (orphans.length > 0) {
    console.error('\n❌ Validation FAILED: Found orphan tool IDs:');
    for (const o of orphans) {
      console.error(`  - ${o.toolId} (in ${o.source})`);
    }
  }
  if (brokenSlugRefs.length > 0) {
    console.error('\n❌ Validation FAILED: Found catalogue slugs with no entry:');
    for (const o of brokenSlugRefs) {
      console.error(`  - ${o.slug} (in ${o.source})`);
    }
  }
  if (malformedEntries.length > 0) {
    console.error('\n❌ Validation FAILED: Malformed catalogue entries:');
    for (const o of malformedEntries) {
      console.error(`  - ${o.slug}: ${o.why}`);
    }
  }
  process.exit(1);
} else {
  console.log('PASS');
  process.exit(0);
}
