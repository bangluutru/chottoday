/**
 * Tool Reference Validation Script
 *
 * Requirements:
 * Inspects:
 * - articles (relatedToolIds and toolCTA sections)
 * - categories (relatedToolIds)
 * - problems (relatedToolIds and recommendedToolId)
 * - homepage featured tools (ToolShowcase & UsefulToday)
 *
 * Asserts zero orphan IDs against the Toolio compatibility snapshot.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

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
const homepageRefs = [];

// Parse ToolShowcase.jsx
const toolShowcasePath = path.join(rootDir, 'src/components/sections/ToolShowcase.jsx');
const toolShowcaseContent = fs.readFileSync(toolShowcasePath, 'utf8');
const featuredMatch = toolShowcaseContent.match(/FEATURED_TOOL_IDS\s*=\s*\[([\s\S]*?)\];/);
if (featuredMatch) {
  const ids = [...featuredMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  for (const id of ids) {
    homepageRefs.push({ source: 'homepage:tool-showcase', toolId: id });
  }
}

// Parse UsefulToday.jsx
const usefulTodayPath = path.join(rootDir, 'src/components/sections/UsefulToday.jsx');
const usefulTodayContent = fs.readFileSync(usefulTodayPath, 'utf8');
const usefulMatch = usefulTodayContent.match(/getToolById\(['"]([^'"]+)['"]\)/);
if (usefulMatch) {
  homepageRefs.push({ source: 'homepage:useful-today', toolId: usefulMatch[1] });
}

// 6. Validation Execution
const allRefs = [
  ...articleRefs.map((r) => ({ ...r, group: 'Articles' })),
  ...categoryRefs.map((r) => ({ ...r, group: 'Categories' })),
  ...problemRefs.map((r) => ({ ...r, group: 'Problems' })),
  ...homepageRefs.map((r) => ({ ...r, group: 'Homepage' })),
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
console.log(`Total:       ${String(allRefs.length).padStart(2)}`);
console.log(`Resolved:    ${String(resolvedCount).padStart(2)}`);
console.log(`Orphan:      ${String(orphans.length).padStart(2)}`);

if (orphans.length > 0) {
  console.error('\n❌ Validation FAILED: Found orphan tool IDs:');
  for (const o of orphans) {
    console.error(`  - ${o.toolId} (in ${o.source})`);
  }
  process.exit(1);
} else {
  console.log('PASS');
  process.exit(0);
}
