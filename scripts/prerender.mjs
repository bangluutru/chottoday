/**
 * Build-Time Prerender & SEO Static Generator (Phase 4)
 * 
 * Objectives:
 * 1. Generates static metadata in raw HTML for crawler/social preview compatibility:
 *    <title>, <meta name="description">, <link rel="canonical">,
 *    <meta property="og:...">, <meta name="twitter:...">, and JSON-LD structured data.
 * 2. Generates production sitemap.xml with real canonical URLs.
 * 3. Generates production robots.txt referencing sitemap.xml.
 * 4. Generates 404.html.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

const SITE_URL = 'https://chottoday.com';

// 1. Load Data
const { ALL_ARTICLES } = await import('../src/content/articles/articlesList.js');
const { CATEGORY_DEFINITIONS } = await import('../src/content/categories/categoryMap.js');
const { isArticlePublished } = await import('../src/services/content/articleModel.js');
const { getInternalTools } = await import('../src/data/tools.js');
const { TOOL_PAGES } = await import('../src/data/toolPages.js');

if (!fs.existsSync(distDir)) {
  console.error('❌ dist/ directory not found. Run "vite build" before prerendering.');
  process.exit(1);
}

const templatePath = path.join(distDir, 'index.html');
const baseHtml = fs.readFileSync(templatePath, 'utf8');

function injectMeta(html, meta) {
  let result = html;

  // Clean out any previously injected tags so each page has strictly its own metadata
  result = result.replace(/<link\s+rel="canonical"[\s\S]*?\/>/gi, '');
  result = result.replace(/<meta\s+name="description"[\s\S]*?\/>/gi, '');
  result = result.replace(/<meta\s+name="robots"[\s\S]*?\/>/gi, '');
  result = result.replace(/<meta\s+property="og:[^"]*"[\s\S]*?\/>/gi, '');
  result = result.replace(/<meta\s+name="twitter:[^"]*"[\s\S]*?\/>/gi, '');
  result = result.replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');

  // Title
  if (meta.title) {
    result = result.replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeHtml(meta.title)}</title>`);
  }

  // Head tags to inject
  const tags = [];

  if (meta.description) {
    tags.push(`<meta name="description" content="${escapeHtml(meta.description)}" />`);
  }

  if (meta.canonical) {
    tags.push(`<link rel="canonical" href="${meta.canonical}" />`);
  }

  if (meta.robots) {
    tags.push(`<meta name="robots" content="${meta.robots}" />`);
  }

  // OpenGraph
  if (meta.ogTitle) tags.push(`<meta property="og:title" content="${escapeHtml(meta.ogTitle)}" />`);
  if (meta.ogDescription) tags.push(`<meta property="og:description" content="${escapeHtml(meta.ogDescription)}" />`);
  if (meta.ogImage) tags.push(`<meta property="og:image" content="${meta.ogImage}" />`);
  if (meta.ogUrl) tags.push(`<meta property="og:url" content="${meta.ogUrl}" />`);
  if (meta.ogType) tags.push(`<meta property="og:type" content="${meta.ogType}" />`);
  tags.push(`<meta property="og:site_name" content="Chotto" />`);

  // Twitter
  tags.push(`<meta name="twitter:card" content="summary_large_image" />`);
  if (meta.ogTitle) tags.push(`<meta name="twitter:title" content="${escapeHtml(meta.ogTitle)}" />`);
  if (meta.ogDescription) tags.push(`<meta name="twitter:description" content="${escapeHtml(meta.ogDescription)}" />`);
  if (meta.ogImage) tags.push(`<meta name="twitter:image" content="${meta.ogImage}" />`);

  // Structured Data (JSON-LD)
  if (meta.structuredData) {
    tags.push(`<script type="application/ld+json" id="chotto-structured-data">${JSON.stringify(meta.structuredData)}</script>`);
  }

  // Inject before </head>
  result = result.replace('</head>', `  ${tags.join('\n    ')}\n  </head>`);

  return result;
}


function escapeHtml(str = '') {
  return str
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function writePage(subPath, html) {
  const targetDir = path.join(distDir, subPath);
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, 'index.html'), html, 'utf8');

  // Also write <subPath>.html for static hosts & clean URL resolution
  const cleanFilePath = path.join(distDir, `${subPath}.html`);
  const parentDir = path.dirname(cleanFilePath);
  fs.mkdirSync(parentDir, { recursive: true });
  fs.writeFileSync(cleanFilePath, html, 'utf8');
}

// 2. Build Prerendered Pages
console.log('⚡ Starting static route prerendering for crawlers and SEO...');

// A. Homepage (/)
const homeMeta = {
  title: 'Chotto — Vấn đề nhỏ, có Chotto giúp một chút.',
  description: 'Thông tin, hướng dẫn và công cụ hữu ích cho người Việt sống tại Nhật Bản. Từ thủ tục hành chính, thuế, việc làm đến cuộc sống thường ngày.',
  canonical: `${SITE_URL}/`,
  ogTitle: 'Chotto — Vấn đề nhỏ, có Chotto giúp một chút.',
  ogDescription: 'Thông tin, hướng dẫn và công cụ hữu ích cho người Việt sống tại Nhật Bản.',
  ogImage: `${SITE_URL}/images/og/og-default.png`,
  ogUrl: `${SITE_URL}/`,
  ogType: 'website',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Chotto',
    url: SITE_URL,
    description: 'Thông tin, hướng dẫn và công cụ hữu ích cho người Việt sống tại Nhật Bản.',
    publisher: {
      '@type': 'Organization',
      name: 'Chotto',
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/chotto-logo-full.svg`,
      },
    },
  },
};
const homeHtml = injectMeta(baseHtml, homeMeta);
fs.writeFileSync(templatePath, homeHtml, 'utf8'); // Update dist/index.html
console.log('  ✓ Prerendered: / (dist/index.html)');

// B. Articles Index (/articles)
const articlesMeta = {
  title: 'Tất cả bài viết & hướng dẫn | Chotto',
  description: 'Tổng hợp tất cả các bài viết hướng dẫn thủ tục hành chính, thuế, bảo hiểm, visa và đời sống tại Nhật Bản.',
  canonical: `${SITE_URL}/articles`,
  ogTitle: 'Tất cả bài viết & hướng dẫn | Chotto',
  ogDescription: 'Tổng hợp tất cả các bài viết hướng dẫn thủ tục hành chính, thuế, bảo hiểm, visa và đời sống tại Nhật Bản.',
  ogImage: `${SITE_URL}/images/og/og-default.png`,
  ogUrl: `${SITE_URL}/articles`,
  ogType: 'website',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tất cả bài viết & hướng dẫn',
    url: `${SITE_URL}/articles`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Chotto',
      url: SITE_URL,
    },
  },
};
writePage('articles', injectMeta(baseHtml, articlesMeta));
console.log('  ✓ Prerendered: /articles');

// B2. Problem Discovery Index (/problems)
const problemsMeta = {
  title: 'Tra cứu tình huống đời sống tại Nhật | Chotto',
  description: 'Tổng hợp các tình huống thực tế thường gặp khi sinh sống, học tập và làm việc tại Nhật Bản: mất thẻ ngoại kiều, thủ tục chuyển nhà, thuế, bảo hiểm...',
  canonical: `${SITE_URL}/problems`,
  ogTitle: 'Tra cứu tình huống đời sống tại Nhật | Chotto',
  ogDescription: 'Tổng hợp các tình huống thực tế thường gặp khi sinh sống, học tập và làm việc tại Nhật Bản.',
  ogImage: `${SITE_URL}/images/og/og-default.png`,
  ogUrl: `${SITE_URL}/problems`,
  ogType: 'website',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tra cứu tình huống đời sống tại Nhật',
    url: `${SITE_URL}/problems`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Chotto',
      url: SITE_URL,
    },
  },
};
writePage('problems', injectMeta(baseHtml, problemsMeta));
console.log('  ✓ Prerendered: /problems');

// B3. Tools Index (/tools)
const toolsMeta = {
  title: 'Công cụ tiện ích | Chotto',
  description:
    'Nhập vài thông tin, có ngay con số. Công cụ tính lương thực nhận, thuế, nenkin, chi phí chuyển nhà và thủ tục hành chính tại Nhật — miễn phí, không cần đăng ký.',
  canonical: `${SITE_URL}/tools`,
  ogTitle: 'Công cụ tiện ích | Chotto',
  ogDescription:
    'Công cụ tính lương, thuế, nenkin và thủ tục hành chính tại Nhật, miễn phí và không lưu dữ liệu.',
  ogImage: `${SITE_URL}/images/og/og-default.png`,
  ogUrl: `${SITE_URL}/tools`,
  ogType: 'website',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Công cụ tiện ích Chotto',
    url: `${SITE_URL}/tools`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Chotto',
      url: SITE_URL,
    },
  },
};
writePage('tools', injectMeta(baseHtml, toolsMeta));
console.log('  ✓ Prerendered: /tools');

// B4. Chotto-hosted tools (/tools/:slug)
// Only catalogue entries ChottoDay renders itself get a page; Toolio entries
// live on toolio.chottoday.com and are never indexed from here.
const internalTools = getInternalTools();
for (const entry of internalTools) {
  const page = TOOL_PAGES[entry.slug] || {};
  const toolTitle = page.seo?.title || entry.name;
  const toolDescription = page.seo?.description || entry.description;
  const toolMeta = {
    title: `${toolTitle} | Chotto`,
    description: toolDescription,
    canonical: `${SITE_URL}/tools/${entry.slug}`,
    ogTitle: `${toolTitle} | Chotto`,
    ogDescription: toolDescription,
    ogImage: `${SITE_URL}/images/og/og-default.png`,
    ogUrl: `${SITE_URL}/tools/${entry.slug}`,
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: toolTitle,
      description: toolDescription,
      url: `${SITE_URL}/tools/${entry.slug}`,
      applicationCategory: 'FinanceApplication',
      operatingSystem: 'Web',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'JPY',
      },
    },
  };
  writePage(`tools/${entry.slug}`, injectMeta(baseHtml, toolMeta));
  console.log(`  ✓ Prerendered: /tools/${entry.slug}`);
}

// B5. About (/about)
const aboutMeta = {
  title: 'Về Chotto | Chotto',
  description:
    'Chotto tập hợp thông tin, hướng dẫn và công cụ nhỏ dành cho người Việt sống tại Nhật — viết lại bằng tiếng Việt, ngắn gọn và dễ làm theo.',
  canonical: `${SITE_URL}/about`,
  ogTitle: 'Về Chotto | Chotto',
  ogDescription:
    'Chotto tập hợp thông tin, hướng dẫn và công cụ nhỏ dành cho người Việt sống tại Nhật.',
  ogImage: `${SITE_URL}/images/og/og-default.png`,
  ogUrl: `${SITE_URL}/about`,
  ogType: 'website',
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Về Chotto',
    url: `${SITE_URL}/about`,
    isPartOf: {
      '@type': 'WebSite',
      name: 'Chotto',
      url: SITE_URL,
    },
  },
};
writePage('about', injectMeta(baseHtml, aboutMeta));
console.log('  ✓ Prerendered: /about');

// B6. Search (/search)
// Result views carry the visitor's raw query, so the page ships noindex and
// stays out of the sitemap; the canonical is always the bare /search URL.
const searchMeta = {
  title: 'Tìm kiếm & khám phá | Chotto',
  description:
    'Tìm bài viết, công cụ và chủ đề trên Chotto: thuế, nenkin, thủ tục hành chính, nhà ở, sức khoẻ và cuộc sống tại Nhật.',
  canonical: `${SITE_URL}/search`,
  robots: 'noindex, follow',
  ogTitle: 'Tìm kiếm & khám phá | Chotto',
  ogDescription: 'Tìm bài viết, công cụ và chủ đề trên Chotto.',
  ogImage: `${SITE_URL}/images/og/og-default.png`,
  ogUrl: `${SITE_URL}/search`,
  ogType: 'website',
};
writePage('search', injectMeta(baseHtml, searchMeta));
console.log('  ✓ Prerendered: /search (noindex)');

// C. Categories (/topics/:category)
for (const cat of CATEGORY_DEFINITIONS) {
  const catMeta = {
    title: `${cat.name} | Chotto`,
    description: cat.description,
    canonical: `${SITE_URL}${cat.path}`,
    ogTitle: `${cat.name} | Chotto`,
    ogDescription: cat.description,
    ogImage: `${SITE_URL}/images/og/og-default.png`,
    ogUrl: `${SITE_URL}${cat.path}`,
    ogType: 'website',
    structuredData: {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: cat.name,
      description: cat.description,
      url: `${SITE_URL}${cat.path}`,
    },
  };
  // Route is /topics/life, /topics/documents, etc.
  const routeSub = cat.path.replace(/^\/+/, '');
  writePage(routeSub, injectMeta(baseHtml, catMeta));
  console.log(`  ✓ Prerendered: ${cat.path}`);
}

// D. Published Articles (/articles/:slug)
const publishedArticles = ALL_ARTICLES.filter(isArticlePublished);
for (const article of publishedArticles) {
  const cat = CATEGORY_DEFINITIONS.find((c) => c.id === article.category);
  const ogImgPath = article.socialImage || '/images/og/og-default.png';
  const ogImgUrl = ogImgPath.startsWith('http') ? ogImgPath : `${SITE_URL}${ogImgPath}`;

  const articleMeta = {
    title: `${article.title} | Chotto`,
    description: article.seo?.metaDescription || article.excerpt,
    canonical: `${SITE_URL}/articles/${article.slug}`,
    ogTitle: article.seo?.metaTitle || `${article.title} | Chotto`,
    ogDescription: article.seo?.metaDescription || article.excerpt,
    ogImage: ogImgUrl,
    ogUrl: `${SITE_URL}/articles/${article.slug}`,
    ogType: 'article',
    structuredData: [
      {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt || article.publishedAt,
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${SITE_URL}/articles/${article.slug}`,
        },
        author: {
          '@type': 'Organization',
          name: article.author?.name || 'Ban Biên Tập Chotto',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Chotto',
          logo: {
            '@type': 'ImageObject',
            url: `${SITE_URL}/chotto-logo-full.svg`,
          },
        },
        image: ogImgUrl,
      },
      {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Trang chủ',
            item: `${SITE_URL}`,
          },
          ...(cat
            ? [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: cat.name,
                  item: `${SITE_URL}${cat.path}`,
                },
                {
                  '@type': 'ListItem',
                  position: 3,
                  name: article.title,
                  item: `${SITE_URL}/articles/${article.slug}`,
                },
              ]
            : [
                {
                  '@type': 'ListItem',
                  position: 2,
                  name: article.title,
                  item: `${SITE_URL}/articles/${article.slug}`,
                },
              ]),
        ],
      },
    ],
  };

  writePage(`articles/${article.slug}`, injectMeta(baseHtml, articleMeta));
  console.log(`  ✓ Prerendered: /articles/${article.slug}`);
}

// E. 404 Page (dist/404.html)
const notFoundMeta = {
  title: 'Không tìm thấy trang | Chotto',
  description: 'Trang bạn tìm kiếm không tồn tại hoặc đã được di chuyển.',
  robots: 'noindex, nofollow',
};
const notFoundHtml = injectMeta(baseHtml, notFoundMeta);
fs.writeFileSync(path.join(distDir, '404.html'), notFoundHtml, 'utf8');
console.log('  ✓ Generated: dist/404.html');

// 3. Generate sitemap.xml
console.log('🗺️ Generating sitemap.xml...');
const latestArticleDate = publishedArticles.reduce(
  (latest, a) => ((a.updatedAt || a.publishedAt) > latest ? (a.updatedAt || a.publishedAt) : latest),
  '2026-09-01'
);

const sitemapUrls = [
  { loc: `${SITE_URL}/`, changefreq: 'daily', priority: '1.0', lastmod: latestArticleDate },
  { loc: `${SITE_URL}/articles`, changefreq: 'daily', priority: '0.9', lastmod: latestArticleDate },
  { loc: `${SITE_URL}/problems`, changefreq: 'weekly', priority: '0.9', lastmod: latestArticleDate },
  { loc: `${SITE_URL}/tools`, changefreq: 'weekly', priority: '0.9', lastmod: latestArticleDate },
  ...internalTools.map((entry) => ({
    loc: `${SITE_URL}/tools/${entry.slug}`,
    changefreq: 'monthly',
    priority: '0.8',
    lastmod: latestArticleDate,
  })),
  { loc: `${SITE_URL}/about`, changefreq: 'monthly', priority: '0.6', lastmod: latestArticleDate },
  ...CATEGORY_DEFINITIONS.map((c) => {
    const catArticles = publishedArticles.filter((a) => a.category === c.id);
    const catLastmod = catArticles.reduce(
      (latest, a) => ((a.updatedAt || a.publishedAt) > latest ? (a.updatedAt || a.publishedAt) : latest),
      latestArticleDate
    );
    return {
      loc: `${SITE_URL}${c.path}`,
      changefreq: 'weekly',
      priority: '0.8',
      lastmod: catLastmod,
    };
  }),
  ...publishedArticles.map((a) => ({
    loc: `${SITE_URL}/articles/${a.slug}`,
    changefreq: 'weekly',
    priority: '0.8',
    lastmod: a.updatedAt || a.publishedAt,
  })),
];

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');
console.log(`  ✓ dist/sitemap.xml generated with ${sitemapUrls.length} indexable URLs`);

// 4. Generate robots.txt
console.log('🤖 Generating robots.txt...');
const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;
fs.writeFileSync(path.join(distDir, 'robots.txt'), robotsTxt, 'utf8');
console.log('  ✓ dist/robots.txt generated pointing to sitemap.xml');

console.log('🎉 Prerender and SEO generation completed successfully!');
