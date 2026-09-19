/**
 * Who may crawl chottoday.com, and who may not.
 *
 * Two layers use this list, and they do different jobs:
 *
 *   1. robots.txt (generated from `buildRobotsTxt`) is a *request*. Well-behaved
 *      crawlers honour it; a scraper that wants the content simply ignores it.
 *   2. functions/_middleware.js is the *enforcement* — it answers 403 at the
 *      Cloudflare edge before the page is ever served. It carries its own copy
 *      of the blocklist so the Pages Function stays dependency-free; the two
 *      copies are held together by scripts/test-crawler-policy.mjs.
 *
 * Neither layer stops someone determined: a scraper can send Chrome's exact
 * user agent and look identical to a reader. What these do stop is the bulk,
 * honest-about-itself traffic — AI training crawlers and SEO scrapers — which
 * is nearly all of it. The rest is a job for Cloudflare's bot management
 * (see README §"Chống crawl dữ liệu").
 *
 * The site lives on search traffic, so blocking is deliberately narrow:
 * search engines and social link previews stay allowed, always.
 */

/**
 * Crawlers that must keep working. Blocking any of these would cost the site
 * either its search traffic or its share cards, so they are checked first and
 * never fall through to the blocklist.
 */
export const ALLOWED_CRAWLERS = [
  // Search engines — the site's audience arrives through these.
  { ua: 'Googlebot', why: 'Google Search' },
  { ua: 'Googlebot-Image', why: 'Google Images' },
  { ua: 'Bingbot', why: 'Bing Search' },
  { ua: 'DuckDuckBot', why: 'DuckDuckGo' },
  { ua: 'coccocbot', why: 'Cốc Cốc — a large share of Vietnamese search' },
  { ua: 'coccocbot-web', why: 'Cốc Cốc web crawler' },
  { ua: 'Yeti', why: 'Naver — reaches readers in Japan and Korea' },
  { ua: 'Applebot', why: 'Siri and Spotlight suggestions' },

  // Link previews — these render the share cards on the platforms readers use.
  { ua: 'facebookexternalhit', why: 'Facebook and Messenger share cards' },
  { ua: 'Twitterbot', why: 'X/Twitter share cards' },
  { ua: 'LinkedInBot', why: 'LinkedIn share cards' },
  { ua: 'Slackbot', why: 'Slack unfurls' },
  { ua: 'Slackbot-LinkExpanding', why: 'Slack unfurls' },
  { ua: 'TelegramBot', why: 'Telegram previews' },
  { ua: 'WhatsApp', why: 'WhatsApp previews' },
  { ua: 'Zalo', why: 'Zalo previews — widely used by the Vietnamese audience' },
  { ua: 'Discordbot', why: 'Discord previews' },
];

/**
 * AI training and answer-engine crawlers. Every one of these publishes the
 * token below as the way to opt out; they are listed in robots.txt for the
 * ones that honour it and blocked at the edge for the ones that do not.
 */
export const BLOCKED_AI_CRAWLERS = [
  { ua: 'GPTBot', why: 'OpenAI training crawler' },
  { ua: 'OAI-SearchBot', why: 'OpenAI search index' },
  { ua: 'ChatGPT-User', why: 'ChatGPT browsing on a user prompt' },
  { ua: 'ClaudeBot', why: 'Anthropic crawler' },
  { ua: 'Claude-Web', why: 'Anthropic crawler' },
  { ua: 'Claude-SearchBot', why: 'Anthropic search index' },
  { ua: 'anthropic-ai', why: 'Anthropic crawler' },
  { ua: 'CCBot', why: 'Common Crawl — the corpus most models are trained on' },
  { ua: 'Google-Extended', why: 'Gemini training (does not affect Google Search)' },
  { ua: 'Applebot-Extended', why: 'Apple Intelligence training (Applebot stays allowed)' },
  { ua: 'FacebookBot', why: 'Meta language-model training' },
  { ua: 'Meta-ExternalAgent', why: 'Meta AI crawler' },
  { ua: 'Meta-ExternalFetcher', why: 'Meta AI fetcher' },
  { ua: 'Bytespider', why: 'ByteDance/TikTok training crawler, notoriously aggressive' },
  { ua: 'PerplexityBot', why: 'Perplexity index' },
  { ua: 'Perplexity-User', why: 'Perplexity fetch on a user prompt' },
  { ua: 'Amazonbot', why: 'Amazon/Alexa crawler' },
  { ua: 'cohere-ai', why: 'Cohere crawler' },
  { ua: 'YouBot', why: 'You.com crawler' },
  { ua: 'Diffbot', why: 'Commercial content-extraction service' },
  { ua: 'ImagesiftBot', why: 'Image dataset crawler' },
  { ua: 'Omgilibot', why: 'Resells crawled text as training data' },
  { ua: 'Omgili', why: 'Resells crawled text as training data' },
  { ua: 'Webzio-Extended', why: 'Webz.io dataset crawler' },
  { ua: 'AI2Bot', why: 'Allen Institute dataset crawler' },
  { ua: 'Ai2Bot-Dolma', why: 'Allen Institute Dolma corpus' },
  { ua: 'Timpibot', why: 'Dataset crawler' },
  { ua: 'PanguBot', why: 'Huawei PanGu training crawler' },
  { ua: 'DuckAssistBot', why: 'DuckDuckGo AI answers (DuckDuckBot stays allowed)' },
  { ua: 'img2dataset', why: 'Bulk image-dataset tool' },
  { ua: 'FriendlyCrawler', why: 'Undisclosed dataset crawler' },
  { ua: 'ISSCyberRiskCrawler', why: 'Undisclosed dataset crawler' },
];

/**
 * SEO and market-intelligence crawlers. They bring the site nothing and read
 * every page repeatedly to resell the result.
 */
export const BLOCKED_SEO_CRAWLERS = [
  { ua: 'AhrefsBot', why: 'Ahrefs backlink index' },
  { ua: 'SemrushBot', why: 'Semrush index' },
  { ua: 'MJ12bot', why: 'Majestic index' },
  { ua: 'DotBot', why: 'Moz index' },
  { ua: 'rogerbot', why: 'Moz site crawler' },
  { ua: 'DataForSeoBot', why: 'DataForSEO resells crawl results' },
  { ua: 'BLEXBot', why: 'WebMeUp backlink index' },
  { ua: 'serpstatbot', why: 'Serpstat index' },
  { ua: 'Barkrowler', why: 'Babbar backlink index' },
  { ua: 'ZoominfoBot', why: 'Contact-data harvester' },
  { ua: 'SiteAuditBot', why: 'Semrush audit crawler' },
  { ua: 'Screaming Frog SEO Spider', why: 'Desktop site-mirroring crawler' },
  { ua: 'PetalBot', why: 'Huawei Petal index' },
  { ua: 'SeekportBot', why: 'Seekport index' },
];

/**
 * Bulk-download tools and unattended HTTP libraries. These never identify a
 * reader — a browser sends none of them — so a hit is a script, and a script
 * reading whole articles is scraping.
 *
 * `curl` is deliberately absent: it is how the site gets debugged.
 */
export const BLOCKED_SCRAPING_TOOLS = [
  { ua: 'Scrapy', why: 'Python scraping framework' },
  { ua: 'HTTrack', why: 'Whole-site mirroring tool' },
  { ua: 'Wget', why: 'Recursive download tool' },
  { ua: 'python-requests', why: 'Unattended script' },
  { ua: 'python-urllib', why: 'Unattended script' },
  { ua: 'aiohttp', why: 'Unattended script' },
  { ua: 'node-fetch', why: 'Unattended script' },
  { ua: 'axios/', why: 'Unattended script' },
  { ua: 'Go-http-client', why: 'Unattended script' },
  { ua: 'okhttp', why: 'Unattended script' },
  { ua: 'libwww-perl', why: 'Unattended script' },
  { ua: 'Apache-HttpClient', why: 'Unattended script' },
  { ua: 'Java/', why: 'Unattended script' },
  { ua: 'PostmanRuntime', why: 'API client hitting page routes' },
  { ua: 'firecrawl', why: 'Hosted scraping-as-a-service' },
];

/** Everything the edge refuses, in one list. */
export const BLOCKED_CRAWLERS = [
  ...BLOCKED_AI_CRAWLERS,
  ...BLOCKED_SEO_CRAWLERS,
  ...BLOCKED_SCRAPING_TOOLS,
];

/**
 * Only the named crawlers go in robots.txt. The scraping tools are left out on
 * purpose: none of them reads robots.txt, and listing them would only publish
 * the blocklist to anyone deciding which user agent to imitate next.
 */
export const ROBOTS_DISALLOWED = [...BLOCKED_AI_CRAWLERS, ...BLOCKED_SEO_CRAWLERS];

/**
 * True when a user agent is one this site turns away.
 *
 * Recognising an allowed crawler wins over the blocklist, because a good client
 * may legitimately carry a generic library in its user agent — Zalo's preview
 * fetcher ships "okhttp", and refusing it would break every Zalo share card.
 *
 * The one exception is a blocked token that *contains* the allowed one, which
 * means it is the more specific name of the two: "Applebot-Extended" is the
 * Apple Intelligence training crawler and is refused, while plain "Applebot"
 * still feeds Siri and Spotlight and is not.
 *
 * @param {string} userAgent - Raw User-Agent header.
 * @returns {boolean}
 */
export function isBlockedUserAgent(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();

  const blocked = BLOCKED_CRAWLERS.map((e) => e.ua.toLowerCase()).filter((t) => ua.includes(t));
  if (blocked.length === 0) return false;

  const allowed = ALLOWED_CRAWLERS.map((e) => e.ua.toLowerCase()).filter((t) => ua.includes(t));
  if (allowed.length === 0) return true;

  return blocked.some((b) => allowed.some((a) => b !== a && b.includes(a)));
}

/**
 * Renders the robots.txt served at the site root.
 *
 * @param {string} siteUrl - Origin without a trailing slash, e.g. https://chottoday.com
 * @returns {string}
 */
export function buildRobotsTxt(siteUrl) {
  const header = [
    '# ChottoDay — https://chottoday.com',
    '#',
    '# Nội dung trên site do Ban Biên Tập Chotto biên soạn và đối chiếu với tài',
    '# liệu của cơ quan chức năng Nhật Bản. Bạn được phép trích dẫn kèm liên kết',
    '# về bài gốc. Sao chép toàn văn hoặc thu thập dữ liệu hàng loạt để huấn',
    '# luyện mô hình hoặc bán lại thì không.',
    '#',
    '# Chi tiết: https://chottoday.com/policy',
    '',
    '# --- Các bot tìm kiếm và xem trước liên kết được phép ---',
  ].join('\n');

  const allowBlocks = ALLOWED_CRAWLERS.map(
    (entry) => `User-agent: ${entry.ua}\nAllow: /`
  ).join('\n\n');

  const disallowBlocks = ROBOTS_DISALLOWED.map(
    (entry) => `# ${entry.why}\nUser-agent: ${entry.ua}\nDisallow: /`
  ).join('\n\n');

  return [
    header,
    '',
    allowBlocks,
    '',
    '# --- Bot huấn luyện AI và bot thu thập SEO: không được phép ---',
    '',
    disallowBlocks,
    '',
    '# --- Mọi bot khác ---',
    '',
    'User-agent: *',
    'Allow: /',
    '# Xin đọc chậm lại, site này do một nhóm nhỏ vận hành.',
    'Crawl-delay: 5',
    '',
    `Sitemap: ${siteUrl}/sitemap.xml`,
    '',
  ].join('\n');
}
