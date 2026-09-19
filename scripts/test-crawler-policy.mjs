/**
 * Tests for the crawler policy behind robots.txt and the Pages middleware.
 *
 * Two things are load-bearing and easy to get wrong:
 *
 *   1. A user-agent substring match that catches a search engine by accident
 *      would cost the site its traffic, silently, with a 403 nobody sees.
 *   2. functions/_middleware.js carries its own copy of the blocklist so the
 *      Pages Function has no imports to fail on. Copies drift; this test is
 *      what stops them.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import {
  ALLOWED_CRAWLERS,
  BLOCKED_CRAWLERS,
  ROBOTS_DISALLOWED,
  buildRobotsTxt,
  isBlockedUserAgent,
} from '../src/config/crawlerPolicy.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${message}`);
    failCount++;
  }
}

console.log('\n========================================================');
console.log('CRAWLER POLICY TESTS');
console.log('========================================================\n');

// 1. Real browsers are never refused. A false positive here is invisible in
//    testing and fatal in production, so every engine gets its own case.
console.log('--- GROUP 1: READERS ARE NEVER REFUSED ---');
const BROWSERS = [
  ['Chrome on Windows', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36'],
  ['Safari on iPhone', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1'],
  ['Chrome on Android', 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36'],
  ['Firefox on macOS', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:133.0) Gecko/20100101 Firefox/133.0'],
  ['Edge on Windows', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0'],
  ['Cốc Cốc browser', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) coc_coc_browser/131.0.0.0 Chrome/125.0.0.0 Safari/537.36'],
];
for (const [label, ua] of BROWSERS) {
  assert(!isBlockedUserAgent(ua), `${label} is served`);
}
assert(!isBlockedUserAgent(''), 'An empty user agent is served, not refused');
assert(!isBlockedUserAgent(undefined), 'A missing user agent is served, not refused');

// 2. Search engines and link previews — the site's traffic and its share cards.
console.log('\n--- GROUP 2: SEARCH ENGINES AND LINK PREVIEWS ARE SERVED ---');
const MUST_PASS = [
  ['Googlebot', 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'],
  ['Googlebot smartphone', 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 5X Build/MMB29P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Mobile Safari/537.36 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'],
  ['Bingbot', 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'],
  ['Cốc Cốc bot', 'Mozilla/5.0 (compatible; coccocbot-web/1.0; +http://help.coccoc.com/searchengine)'],
  ['DuckDuckGo', 'DuckDuckBot/1.1; (+http://duckduckgo.com/duckduckbot.html)'],
  ['Applebot (Siri, Spotlight)', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Safari/605.1.15 (Applebot/0.1; +http://www.apple.com/go/applebot)'],
  ['Facebook share card', 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)'],
  ['X/Twitter card', 'Twitterbot/1.0'],
  ['Telegram preview', 'TelegramBot (like TwitterBot)'],
  ['WhatsApp preview', 'WhatsApp/2.23.20.0'],
  ['Zalo preview on okhttp', 'ZaloPC-win32-24.3.1 okhttp/4.9.3'],
  ['Slack unfurl', 'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)'],
];
for (const [label, ua] of MUST_PASS) {
  assert(!isBlockedUserAgent(ua), `${label} is served`);
}

// 3. The crawlers the policy exists for.
console.log('\n--- GROUP 3: AI AND SCRAPER CRAWLERS ARE REFUSED ---');
const MUST_BLOCK = [
  ['OpenAI GPTBot', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko); compatible; GPTBot/1.2; +https://openai.com/gptbot'],
  ['ChatGPT browsing', 'Mozilla/5.0 (compatible; ChatGPT-User/1.0; +https://openai.com/bot)'],
  ['ClaudeBot', 'Mozilla/5.0 (compatible; ClaudeBot/1.0; +claudebot@anthropic.com)'],
  ['Common Crawl', 'CCBot/2.0 (https://commoncrawl.org/faq/)'],
  ['Apple Intelligence training', 'Mozilla/5.0 (compatible; Applebot-Extended/0.1; +http://www.apple.com/go/applebot)'],
  ['Meta AI', 'meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)'],
  ['ByteDance', 'Mozilla/5.0 (compatible; Bytespider; spider-feedback@bytedance.com)'],
  ['Perplexity', 'Mozilla/5.0 (compatible; PerplexityBot/1.0; +https://perplexity.ai/perplexitybot)'],
  ['Ahrefs', 'Mozilla/5.0 (compatible; AhrefsBot/7.0; +http://ahrefs.com/robot/)'],
  ['Semrush', 'Mozilla/5.0 (compatible; SemrushBot/7~bl; +http://www.semrush.com/bot.html)'],
  ['Majestic', 'Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)'],
  ['Scrapy', 'Scrapy/2.11.0 (+https://scrapy.org)'],
  ['python-requests', 'python-requests/2.32.3'],
  ['Go http client', 'Go-http-client/2.0'],
  ['HTTrack mirror', 'Mozilla/4.5 (compatible; HTTrack 3.0x; Windows 98)'],
  ['wget', 'Wget/1.21.4'],
];
for (const [label, ua] of MUST_BLOCK) {
  assert(isBlockedUserAgent(ua), `${label} is refused`);
}

// 4. The one pair where a blocked name contains an allowed one.
console.log('\n--- GROUP 4: SPECIFIC NAME WINS OVER GENERAL ---');
assert(
  isBlockedUserAgent('Mozilla/5.0 (compatible; Applebot-Extended/0.1)') &&
    !isBlockedUserAgent('Mozilla/5.0 (compatible; Applebot/0.1)'),
  'Applebot-Extended is refused while plain Applebot is served'
);
assert(
  isBlockedUserAgent('FacebookBot/1.0') && !isBlockedUserAgent('facebookexternalhit/1.1'),
  'FacebookBot is refused while facebookexternalhit is served'
);
assert(
  isBlockedUserAgent('DuckAssistBot/1.0') && !isBlockedUserAgent('DuckDuckBot/1.1'),
  'DuckAssistBot is refused while DuckDuckBot is served'
);

// 5. No entry may shadow another: a blocked token must never be a substring of
//    an allowed crawler's own name, or that engine could never be served.
console.log('\n--- GROUP 5: THE LISTS DO NOT CONTRADICT EACH OTHER ---');
for (const allowed of ALLOWED_CRAWLERS) {
  const shadow = BLOCKED_CRAWLERS.find(
    (b) => allowed.ua.toLowerCase().includes(b.ua.toLowerCase()) && b.ua.toLowerCase() !== allowed.ua.toLowerCase()
  );
  assert(!shadow, `"${allowed.ua}" is not shadowed by a blocked entry`);
}
assert(
  new Set(BLOCKED_CRAWLERS.map((e) => e.ua.toLowerCase())).size === BLOCKED_CRAWLERS.length,
  'The blocklist has no duplicate entries'
);
assert(
  BLOCKED_CRAWLERS.every((e) => typeof e.why === 'string' && e.why.length > 0),
  'Every blocked entry says why it is blocked'
);

// 6. robots.txt renders what the policy says.
console.log('\n--- GROUP 6: robots.txt ---');
const robots = buildRobotsTxt('https://chottoday.com');
assert(robots.includes('Sitemap: https://chottoday.com/sitemap.xml'), 'The sitemap is referenced');
assert(robots.includes('User-agent: *\nAllow: /'), 'Unlisted crawlers are still allowed');
assert(!/User-agent: \*\n(?:.*\n)*?Disallow: \/$/m.test(robots), 'No blanket Disallow: / for everyone');
for (const entry of ALLOWED_CRAWLERS) {
  assert(
    robots.includes(`User-agent: ${entry.ua}\nAllow: /`),
    `robots.txt allows ${entry.ua}`
  );
}
for (const entry of ROBOTS_DISALLOWED) {
  assert(
    robots.includes(`User-agent: ${entry.ua}\nDisallow: /`),
    `robots.txt disallows ${entry.ua}`
  );
}
assert(
  !ROBOTS_DISALLOWED.some((e) => e.ua === 'Scrapy' || e.ua === 'python-requests'),
  'Scraping libraries stay out of robots.txt — publishing them only names the disguise'
);

// 7. The committed public/robots.txt is the same file the builder produces.
console.log('\n--- GROUP 7: public/robots.txt IS IN SYNC ---');
const committedRobots = fs.readFileSync(path.join(rootDir, 'public', 'robots.txt'), 'utf8');
assert(
  committedRobots === robots,
  'public/robots.txt matches buildRobotsTxt() — regenerate it if this fails'
);

// 8. The middleware's inlined copy matches the policy module.
console.log('\n--- GROUP 8: functions/_middleware.js IS IN SYNC ---');
const middleware = fs.readFileSync(path.join(rootDir, 'functions', '_middleware.js'), 'utf8');

function readArray(name) {
  const match = middleware.match(new RegExp(`const ${name} = \\[([\\s\\S]*?)\\];`));
  if (!match) return null;
  return [...match[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
}

const mwAllowed = readArray('ALLOWED');
const mwBlocked = readArray('BLOCKED');

assert(Array.isArray(mwAllowed), 'The middleware exposes an ALLOWED list');
assert(Array.isArray(mwBlocked), 'The middleware exposes a BLOCKED list');

const expectedAllowed = ALLOWED_CRAWLERS.map((e) => e.ua.toLowerCase());
const expectedBlocked = BLOCKED_CRAWLERS.map((e) => e.ua.toLowerCase());

if (mwAllowed && mwAllowed.join('|') !== expectedAllowed.join('|')) {
  console.error('     middleware ALLOWED should be:\n' + expectedAllowed.map((t) => `       '${t}',`).join('\n'));
}
if (mwBlocked && mwBlocked.join('|') !== expectedBlocked.join('|')) {
  console.error('     middleware BLOCKED should be:\n' + expectedBlocked.map((t) => `       '${t}',`).join('\n'));
}

assert(
  mwAllowed && mwAllowed.join('|') === expectedAllowed.join('|'),
  'The middleware allowlist matches crawlerPolicy.js'
);
assert(
  mwBlocked && mwBlocked.join('|') === expectedBlocked.join('|'),
  'The middleware blocklist matches crawlerPolicy.js'
);
assert(
  /catch \(err\)/.test(middleware) && /console\.error\('crawler middleware error'/.test(middleware),
  'The middleware still fails open on an error'
);
assert(
  /return context\.next\(\);/.test(middleware),
  'The middleware still passes unblocked requests through'
);

console.log('\n========================================================');
console.log(`TOTAL CRAWLER POLICY TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('========================================================');

if (failCount > 0) {
  process.exit(1);
}
console.log('🎉 ALL CRAWLER POLICY TESTS PASSED!\n');
process.exit(0);
