/**
 * Cloudflare Pages middleware — refuses scrapers before a page is served.
 *
 * robots.txt only asks; this answers 403. It runs on every request to the
 * site, so two rules govern it:
 *
 *   1. It fails open. Any error at all falls through to `next()`, because a
 *      bug here would take the whole site down, and a scraper getting through
 *      is a far smaller problem than readers seeing a 500.
 *   2. It never guesses. Only user agents that name themselves as an AI
 *      crawler, an SEO crawler or an unattended HTTP library are refused. A
 *      scraper sending Chrome's user agent is indistinguishable from a reader
 *      and is left to Cloudflare's bot management (README §"Chống crawl dữ liệu").
 *
 * The lists below mirror src/config/crawlerPolicy.js. They are duplicated on
 * purpose — a Pages Function that imports nothing cannot fail to build — and
 * scripts/test-crawler-policy.mjs fails the CI gate if the two ever drift.
 */

/** Search engines and link-preview fetchers. Checked first; never refused. */
const ALLOWED = [
  'googlebot',
  'googlebot-image',
  'bingbot',
  'duckduckbot',
  'coccocbot',
  'coccocbot-web',
  'yeti',
  'applebot',
  'facebookexternalhit',
  'twitterbot',
  'linkedinbot',
  'slackbot',
  'slackbot-linkexpanding',
  'telegrambot',
  'whatsapp',
  'zalo',
  'discordbot',
];

/** AI training crawlers, SEO crawlers and bulk-download tools. */
const BLOCKED = [
  'gptbot',
  'oai-searchbot',
  'chatgpt-user',
  'claudebot',
  'claude-web',
  'claude-searchbot',
  'anthropic-ai',
  'ccbot',
  'google-extended',
  'applebot-extended',
  'facebookbot',
  'meta-externalagent',
  'meta-externalfetcher',
  'bytespider',
  'perplexitybot',
  'perplexity-user',
  'amazonbot',
  'cohere-ai',
  'youbot',
  'diffbot',
  'imagesiftbot',
  'omgilibot',
  'omgili',
  'webzio-extended',
  'ai2bot',
  'ai2bot-dolma',
  'timpibot',
  'pangubot',
  'duckassistbot',
  'img2dataset',
  'friendlycrawler',
  'isscyberriskcrawler',
  'ahrefsbot',
  'semrushbot',
  'mj12bot',
  'dotbot',
  'rogerbot',
  'dataforseobot',
  'blexbot',
  'serpstatbot',
  'barkrowler',
  'zoominfobot',
  'siteauditbot',
  'screaming frog seo spider',
  'petalbot',
  'seekportbot',
  'scrapy',
  'httrack',
  'wget',
  'python-requests',
  'python-urllib',
  'aiohttp',
  'node-fetch',
  'axios/',
  'go-http-client',
  'okhttp',
  'libwww-perl',
  'apache-httpclient',
  'java/',
  'postmanruntime',
  'firecrawl',
];

/**
 * Same rule as isBlockedUserAgent() in src/config/crawlerPolicy.js: a
 * recognised good client wins, unless the blocked token is the more specific
 * one ("applebot-extended" contains "applebot", and only that one is refused).
 */
function isBlocked(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();

  const blocked = BLOCKED.filter((token) => ua.includes(token));
  if (blocked.length === 0) return false;

  const allowed = ALLOWED.filter((token) => ua.includes(token));
  if (allowed.length === 0) return true;

  return blocked.some((b) => allowed.some((a) => b !== a && b.includes(a)));
}

const REFUSAL_BODY = `403 — Chotto không phục vụ trình thu thập dữ liệu tự động.

Nội dung trên chottoday.com thuộc bản quyền của ChottoDay.
Bạn được phép trích dẫn ngắn kèm liên kết về bài gốc.
Thu thập hàng loạt để huấn luyện mô hình hoặc đăng lại thì không.

Nếu bạn cho rằng đây là nhầm lẫn: hello@chottoday.com
Điều khoản: https://chottoday.com/policy
`;

export async function onRequest(context) {
  let refuse = false;

  // Only the decision is guarded. next() stays outside the try so a failure
  // inside the site itself is never retried, and never mistaken for a bug here.
  try {
    refuse = isBlocked(context.request.headers.get('user-agent') || '');
  } catch (err) {
    // Fail open: a reader always gets the page, even if this file is broken.
    console.error('crawler middleware error', err);
  }

  if (!refuse) return context.next();

  return new Response(REFUSAL_BODY, {
    status: 403,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      // Nothing here is worth caching, and the refusal must never be handed to
      // a reader who happens to land on the same edge node afterwards.
      'cache-control': 'no-store',
      'x-robots-tag': 'noindex, nofollow',
    },
  });
}
