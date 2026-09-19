/**
 * Unit tests for the newsroom ranking pass.
 *
 * The daily workflow cannot be trusted with a fetch it never verified, so the
 * scoring logic is pinned here against fixed items instead. Live fetching is a
 * separate concern: sources.js carries the URLs, and the first CI run reports
 * which of them actually answer.
 *
 * What matters most is the exclusions. A ranker that lets domestic sports news
 * through, or that keeps a notice from three weeks ago, quietly wastes the
 * reviewer's attention every single morning.
 */

import { inferTopic, rankItems, recencyFactor, scoreItem } from './newsroom/rank.mjs';
import { SOURCES, SOURCE_KIND, getOfficialSources, getSourceById } from './newsroom/sources.js';
import {
  extractDate,
  hasEnoughSubstance,
  lastDateIn,
  measureSubstance,
  MIN_BODY_CHARS,
  MIN_BODY_SENTENCES,
  normalizeDate,
  parseFeed,
  parseNoticeList,
  stripHtml,
  USER_AGENT,
} from './newsroom/fetch.mjs';
import { DRAFT_MODEL, DRAFT_SCHEMA, buildCaption, createClient, slugify, toArticleRecord } from './newsroom/draft.mjs';

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

const NOW = new Date('2026-09-19T00:00:00Z');
const daysAgo = (n) => new Date(NOW.getTime() - n * 86_400_000).toISOString();

const isa = getSourceById('isa-news');
const nhk = getSourceById('nhk-news');

console.log('\n========================================================');
console.log('NEWSROOM RANKING TESTS');
console.log('========================================================\n');

// 1. Source registry ------------------------------------------------------
console.log('1. Source registry');
assert(SOURCES.length > 0, 'At least one source is registered');
assert(
  SOURCES.every((s) => s.url.startsWith('https://')),
  'Every source URL is HTTPS, matching the content trust rules'
);
assert(
  SOURCES.every((s) => s.id && s.organization && s.kind && s.format),
  'Every source carries id, organization, kind and format'
);
assert(
  new Set(SOURCES.map((s) => s.id)).size === SOURCES.length,
  'Source ids are unique'
);
assert(getOfficialSources().length > 0, 'At least one official (government) source exists');
assert(
  getOfficialSources().every((s) => s.kind === SOURCE_KIND.OFFICIAL),
  'getOfficialSources returns only official sources'
);
assert(
  SOURCES.filter((s) => s.kind === SOURCE_KIND.OFFICIAL).every((s) => s.weight >= 0.9),
  'Official sources outweigh media, so a ministry notice beats a newspaper write-up'
);
assert(getSourceById('khong-ton-tai') === null, 'An unknown source id resolves to null');

// 2. Recency --------------------------------------------------------------
console.log('\n2. Recency decay');
assert(recencyFactor(daysAgo(0), NOW) === 1, 'Today scores a full 1.0');
assert(recencyFactor(daysAgo(7), NOW) === 0, 'Exactly seven days old has decayed to zero');
assert(recencyFactor(daysAgo(30), NOW) === 0, 'A month old is zero, not negative');
assert(recencyFactor(null, NOW) === 0.5, 'An undated item is neither favoured nor dropped');
assert(recencyFactor('khong-phai-ngay', NOW) === 0.5, 'An unparseable date falls back to 0.5');
const midweek = recencyFactor(daysAgo(3), NOW);
assert(midweek > 0 && midweek < 1, 'Three days old sits between the extremes');

// 3. Topic inference ------------------------------------------------------
console.log('\n3. Topic inference');
assert(
  inferTopic({ title: '在留カードの申請手続が変わります' }) === 'doc',
  'A residence-card procedure lands in "doc"'
);
assert(
  inferTopic({ title: '年金の保険料が改正されます' }) !== null,
  'A pension notice resolves to some topic'
);
assert(
  inferTopic({ title: '子育て世帯への児童手当について' }) === 'family',
  'A child-allowance notice lands in "family"'
);
assert(
  inferTopic({ title: 'まったく無関係な見出し' }, isa) === 'doc',
  'An unclear headline falls back to the source topic hint'
);
assert(
  inferTopic({ title: 'まったく無関係な見出し' }, nhk) === null,
  'A hintless source with an unclear headline stays unclassified'
);

// 4. Scoring --------------------------------------------------------------
console.log('\n4. Scoring');
const visaItem = {
  title: '在留資格の変更申請手続きの受付開始について',
  summary: '外国人の在留手続に関する重要なお知らせ。期限に注意してください。',
  publishedAt: daysAgo(0),
};
const visaScore = scoreItem(visaItem, isa, NOW);
assert(visaScore.score > 0, 'A fresh immigration notice scores above zero');
assert(visaScore.signals.foreignerHits > 0, 'It is recognised as foreigner-relevant');
assert(visaScore.signals.actionableHits > 0, 'Its deadline wording registers as actionable');

const staleScore = scoreItem({ ...visaItem, publishedAt: daysAgo(10) }, isa, NOW);
assert(staleScore.score === 0, 'The same notice ten days later scores zero');

const mediaScore = scoreItem(visaItem, nhk, NOW);
assert(
  mediaScore.score < visaScore.score,
  'Identical wording scores lower from a media source than from the ministry'
);

// 5. Ranking and its exclusions -------------------------------------------
console.log('\n5. Ranking and exclusions');
const feed = [
  { item: visaItem, source: isa },
  {
    item: {
      title: 'プロ野球の試合結果',
      summary: 'スポーツのニュースです',
      publishedAt: daysAgo(0),
    },
    source: nhk,
  },
  {
    item: {
      title: '外国人労働者の雇用保険について',
      summary: '雇用に関する手続の変更',
      publishedAt: daysAgo(1),
    },
    source: nhk,
  },
  {
    item: {
      title: '在留カードに関する古いお知らせ',
      summary: '外国人向けの手続',
      publishedAt: daysAgo(20),
    },
    source: isa,
  },
];

const ranked = rankItems(feed, { now: NOW, limit: 10 });
const titles = ranked.map((r) => r.title);

assert(titles.includes(visaItem.title), 'The immigration notice survives ranking');
assert(
  !titles.some((t) => t.includes('野球')),
  'Domestic sports news is filtered out, not merely ranked low'
);
assert(
  !titles.some((t) => t.includes('古いお知らせ')),
  'A twenty-day-old notice is dropped'
);
assert(
  ranked.every((r) => r.sourceId),
  'Every ranked item keeps the source it came from, so a draft can cite it'
);
assert(
  ranked.every((r) => r.signals),
  'Every ranked item keeps its scoring signals, so a bad pick can be traced'
);
assert(
  ranked[0].score >= ranked[ranked.length - 1].score,
  'Results come back sorted, highest score first'
);

const limited = rankItems(feed, { now: NOW, limit: 1 });
assert(limited.length === 1, 'The limit is respected');

assert(rankItems([], { now: NOW }).length === 0, 'An empty feed ranks to an empty list');

// 6. Feed and notice-list parsing --------------------------------------
console.log('\n6. Feed parsing');
const rss = `<rss><channel>
  <item><title>在留カードの手続が変わります</title><description><![CDATA[<p>外国人の方へ</p>]]></description><link>https://www.moj.go.jp/a.html</link><pubDate>Fri, 19 Sep 2026 01:00:00 GMT</pubDate></item>
</channel></rss>`;
const parsed = parseFeed(rss);
assert(parsed.length === 1, 'One <item> parses to one entry');
assert(parsed[0].title === '在留カードの手続が変わります', 'The Japanese title survives intact');
assert(parsed[0].summary === '外国人の方へ', 'CDATA and inner HTML are unwrapped');
assert(parsed[0].publishedAt.startsWith('2026-09-19'), 'pubDate normalises to ISO');

assert(
  normalizeDate('2026年9月19日').startsWith('2026-09-19'),
  'A Japanese-format date on a ministry page parses'
);
assert(normalizeDate('hôm qua') === null, 'An unparseable date returns null, not a wrong date');
assert(normalizeDate(null) === null, 'A missing date returns null');
assert(stripHtml('<p>a &amp; b</p>') === 'a & b', 'Entities decode after tags are stripped');

// Every entry carries a date, because an undated link is navigation and is
// dropped outright — see section 14.
const noticeHtml =
  '<li>令和8年9月19日<a href="/isa/news/01.html">在留資格の変更について</a></li>' +
  '<li>令和8年9月19日<a href="#top">↑</a></li>' +
  '<li>令和8年9月18日<a href="/isa/news/01.html">cùng một link</a></li>' +
  '<li>令和8年9月17日<a href="http://insecure.example/x">link http</a></li>';
const notices = parseNoticeList(noticeHtml, 'https://www.moj.go.jp/isa/');
assert(notices.length === 1, 'Anchors, duplicates and non-HTTPS links are all dropped');
assert(
  notices[0].url === 'https://www.moj.go.jp/isa/news/01.html',
  'A relative href resolves against the source URL'
);
assert(
  notices[0].publishedAt.startsWith('2026-09-19'),
  'The surviving entry carries the date that sat next to it'
);

// 7. Draft record — the part validate-content.mjs will judge ------------
console.log('\n7. Draft record shape');
const drafted = {
  title: 'Thủ tục gia hạn tư cách lưu trú đổi từ tháng 10',
  excerpt: 'Từ tháng 10, đơn gia hạn nộp online được cho phần lớn tư cách lưu trú.',
  category: 'doc',
  shortAnswer: 'Nộp online được từ 1/10.',
  keyTakeaways: ['Nộp online', 'Từ 1/10', 'Không mất phí thêm'],
  body: [{ heading: 'Đổi những gì', paragraphs: ['Một đoạn nội dung mẫu để tính thời gian đọc.'] }],
  applicability: 'Người có tư cách lưu trú đang còn hiệu lực.',
  needsVerification: ['Xác nhận lại ngày hiệu lực chính xác'],
  fanpageCaption: 'Từ tháng 10 bạn nộp đơn gia hạn online được.',
};
const sourceItem = {
  title: '在留資格変更許可申請のオンライン化について',
  url: 'https://www.moj.go.jp/isa/news/01.html',
  publishedAt: daysAgo(0),
};
const record = toArticleRecord(drafted, sourceItem, isa, '2026-09-19T00:00:00Z');

assert(record.status === 'review', 'A generated draft is never published outright');
assert(record.status !== 'published', 'status is explicitly not "published"');
assert(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.slug),
  'The slug is URL-safe kebab-case, as validate-content.mjs demands'
);
assert(!/[àáâãèéêìíòóôõùúăđĩũơưăạảấầ]/i.test(record.slug), 'Vietnamese diacritics are stripped from the slug');
assert(record.sources.length === 1, 'The record carries exactly the source it came from');
assert(record.sources[0].url === sourceItem.url, 'The source URL is the real fetched URL');
assert(record.sources[0].url.startsWith('https://'), 'The source URL is HTTPS');
assert(record.sources[0].organization === isa.organization, 'The organization comes from sources.js, not the model');
assert(/^\d{4}-\d{2}-\d{2}$/.test(record.sources[0].accessedAt), 'accessedAt is a plain YYYY-MM-DD date');
assert(record.sources[0].type === 'government', 'An official source is typed as government');
assert(record.review.lastVerifiedAt <= record.review.reviewAfter, 'lastVerifiedAt never follows reviewAfter');
assert(
  record.review.reviewer.includes('CHƯA DUYỆT'),
  'The reviewer field names itself as unfilled, so nobody publishes it by accident'
);
assert(record.seo.metaDescription.length <= 160, 'The meta description stays within 160 characters');
assert(record.readingTime >= 2, 'Reading time has a sane floor');

assert(slugify('Lương 30 man thực nhận?') === 'luong-30-man-thuc-nhan', 'slugify handles diacritics and punctuation');
assert(slugify('Đổi bằng lái xe').startsWith('doi-bang-lai'), 'slugify maps đ to d');

// 8. Caption --------------------------------------------------------------
console.log('\n8. Fanpage caption');
const caption = buildCaption(record);
assert(caption.includes(record.slug), 'The caption links back to the article on the site');
assert(caption.includes(isa.organization), 'The caption credits the source organisation');
assert(
  caption.includes('CHƯA ĐĂNG ĐƯỢC NGAY'),
  'Unverified points are shouted in the caption file, not buried'
);
assert(
  caption.includes('Xác nhận lại ngày hiệu lực chính xác'),
  'Each unverified point is listed for the reviewer'
);

const cleanRecord = toArticleRecord(
  { ...drafted, needsVerification: [] }, sourceItem, isa, '2026-09-19T00:00:00Z'
);
assert(
  !buildCaption(cleanRecord).includes('CHƯA ĐĂNG ĐƯỢC NGAY'),
  'With nothing to verify, the caption carries no warning block'
);

// 9. Model configuration --------------------------------------------------
console.log('\n9. Model configuration');
assert(typeof DRAFT_MODEL === 'string' && DRAFT_MODEL.length > 0, 'A model id is always resolved');
assert(
  DRAFT_MODEL === (process.env.NEWSROOM_MODEL || 'gpt-5.6-luna'),
  'The model comes from NEWSROOM_MODEL, falling back to gpt-5.6-luna'
);

// The OpenAI SDK refuses to construct without a key, which is the behaviour we
// want in CI: a missing key fails loudly here rather than silently at call time.
const priorKey = process.env.OPENAI_API_KEY;
const priorBase = process.env.OPENAI_BASE_URL;
process.env.OPENAI_API_KEY = 'test-key-not-real';

delete process.env.OPENAI_BASE_URL;
assert(
  createClient().baseURL.includes('openai.com'),
  'With no OPENAI_BASE_URL the client talks to OpenAI directly'
);

process.env.OPENAI_BASE_URL = 'https://gateway.example/v1';
assert(
  createClient().baseURL === 'https://gateway.example/v1',
  'OPENAI_BASE_URL redirects the client to a compatible gateway'
);

if (priorKey === undefined) delete process.env.OPENAI_API_KEY;
else process.env.OPENAI_API_KEY = priorKey;
if (priorBase === undefined) delete process.env.OPENAI_BASE_URL;
else process.env.OPENAI_BASE_URL = priorBase;

// 10. Structured-output schema -------------------------------------------
console.log('\n10. Structured-output schema');
// strict mode rejects any object that allows extra keys or leaves a declared
// property optional, and the failure only shows up at call time — so pin it.
function auditSchema(node, path = 'root') {
  const problems = [];
  if (node.type === 'object') {
    if (node.additionalProperties !== false) {
      problems.push(`${path}: thiếu additionalProperties:false`);
    }
    const declared = Object.keys(node.properties || {});
    const required = node.required || [];
    for (const key of declared) {
      if (!required.includes(key)) problems.push(`${path}.${key}: khai báo nhưng không nằm trong required`);
      problems.push(...auditSchema(node.properties[key], `${path}.${key}`));
    }
  }
  if (node.type === 'array' && node.items) {
    problems.push(...auditSchema(node.items, `${path}[]`));
  }
  return problems;
}
const schemaProblems = auditSchema(DRAFT_SCHEMA);
if (schemaProblems.length) console.error('   ', schemaProblems.join('\n    '));
assert(schemaProblems.length === 0, 'Every object in the schema satisfies strict mode');
assert(
  DRAFT_SCHEMA.properties.category.enum.includes('doc'),
  'The category enum matches the site taxonomy'
);
assert(
  DRAFT_SCHEMA.required.includes('needsVerification'),
  'The model cannot omit what it is unsure about'
);

// 11. Request headers ------------------------------------------------------
console.log('\n11. Request headers');
// A Vietnamese character in the User-Agent made fetch() throw before sending
// anything, so all six sources died at once with a message that never
// mentioned encoding. Headers are ByteString; pin that.
const wideChars = [...USER_AGENT].filter((ch) => ch.charCodeAt(0) > 255);
if (wideChars.length) console.error('   ', wideChars.join(' '));
assert(wideChars.length === 0, 'The User-Agent is pure ASCII, as HTTP headers require');

let headersBuilt = true;
try {
  new Headers({ 'user-agent': USER_AGENT, accept: '*/*' });
} catch {
  headersBuilt = false;
}
assert(headersBuilt, 'The request headers actually construct without throwing');

// 12. Japan relevance — regressions from the first real run ---------------
console.log('\n12. Japan relevance');
// The first real run put "Trump extends push for $100,000 H-1B visas" at the
// top of the morning list. It matched 'visa' and 'foreign', so it cleared the
// filter — but H-1B is a US visa and means nothing to a Vietnamese resident in
// Japan. The filter caught the words and missed the point.
const freshISO = daysAgo(0);
const worldFeed = [
  {
    item: {
      title: 'Trump extends push for $100,000 H-1B visas by another year',
      summary: 'foreign workers visa policy',
      publishedAt: freshISO,
    },
    source: nhk,
  },
  {
    item: {
      title: 'US tightens green card rules for foreign residents',
      summary: 'immigration reform',
      publishedAt: freshISO,
    },
    source: nhk,
  },
  {
    item: {
      title: 'Japan eases visa rules for foreign residents',
      summary: '在留 手続 変更',
      publishedAt: freshISO,
    },
    source: nhk,
  },
  {
    item: {
      title: '「特定技能」にかかる社会保険関係の書類交付',
      summary: '外国人 手続 開始',
      publishedAt: freshISO,
    },
    source: isa,
  },
];
const worldRanked = rankItems(worldFeed, { now: NOW, limit: 10 });
const worldTitles = worldRanked.map((r) => r.title);

assert(
  !worldTitles.some((t) => /H-1B/i.test(t)),
  'US H-1B news is dropped, not merely ranked low'
);
assert(
  !worldTitles.some((t) => /green card/i.test(t)),
  "Another country's immigration news is dropped too"
);
assert(
  worldTitles.some((t) => /Japan eases/.test(t)),
  'Japan-related news from a media source survives'
);
assert(
  worldTitles.some((t) => /特定技能/.test(t)),
  'A Japanese ministry notice survives without needing a Japan keyword'
);

// An official Japanese source is Japan-scoped by definition, so it must not be
// asked to prove it — that would drop notices written in pure bureaucratese.
const terseOfficial = rankItems(
  [{ item: { title: '手続の変更について（外国人の方へ）', summary: '申請 開始', publishedAt: freshISO }, source: isa }],
  { now: NOW, limit: 5 }
);
assert(
  terseOfficial.length === 1,
  'A terse ministry notice with no explicit "Japan" word is still kept'
);

// 13. Substance gate — the second lesson from the first real run ----------
console.log('\n13. Substance gate');
// The run drafted an article from a table-of-contents page. The model was
// honest about it — it said the source gave no detail — but the result told
// the reader to go read the source, and so did the caption. An empty draft is
// worse than none: it costs a model call, costs review time, and costs trust
// if it ever reaches the page.
const menuPage =
  'Trang chủ Dịch vụ 特定技能 外国人本人の方 所属機関の方 適用事業所 お問い合わせ サイトマップ 年金について 手続き 各種様式';
const longMenuPage = Array(12)
  .fill('年金について 手続き 各種様式 よくある質問 関連リンク 特定技能 外国人本人の方 所属機関の方')
  .join(' ');
const realNoticeJa =
  '日本年金機構は、特定技能の在留資格を持つ外国人に関する社会保険の書類交付について手続きを変更すると発表しました。' +
  '申請は令和8年10月1日から受け付けます。必要な書類は在留カードの写しと雇用契約書です。';
const realNoticeEn =
  'The ministry announced a change to the procedure. Applications open on October 1. ' +
  'Required documents include a copy of the residence card.';

assert(!hasEnoughSubstance(menuPage).ok, 'A table-of-contents page is rejected');
assert(
  !hasEnoughSubstance(longMenuPage).ok,
  'A LONG menu page is rejected too — length alone never earns a draft'
);
assert(hasEnoughSubstance(realNoticeJa).ok, 'A short but complete Japanese notice is accepted');
assert(hasEnoughSubstance(realNoticeEn).ok, 'An English notice is accepted');
assert(!hasEnoughSubstance('').ok, 'Empty text is rejected');
assert(
  !hasEnoughSubstance('。。。。。').ok,
  'Bare punctuation counts as sentences but is still rejected by the character floor'
);

// Japanese carries far more meaning per character than Vietnamese or English.
// A character threshold set by Vietnamese intuition would reject exactly the
// shortest, clearest notices — so sentences are the primary signal.
assert(
  measureSubstance(realNoticeJa).chars < MIN_BODY_CHARS * 2,
  'The accepted Japanese notice is genuinely short, which is why chars cannot lead'
);
assert(
  measureSubstance(realNoticeJa).sentences >= MIN_BODY_SENTENCES,
  'It passes on sentence count, not on length'
);
assert(
  measureSubstance(longMenuPage).chars > MIN_BODY_CHARS * 4 &&
    measureSubstance(longMenuPage).sentences === 0,
  'And the long menu proves the point in reverse: many characters, no sentences'
);

assert(
  typeof hasEnoughSubstance(menuPage).reason === 'string',
  'A rejection explains itself, so the summary can tell the reviewer why'
);
assert(
  hasEnoughSubstance(realNoticeEn).reason === null,
  'An accepted body carries no rejection reason'
);

// "index.html" must not read as a sentence boundary.
assert(
  measureSubstance('see index.html and page.html for more').sentences === 0,
  'A dot inside a filename is not counted as a sentence'
);

// 14. A news entry has a date; a menu link does not -----------------------
console.log('\n14. Dates separate news from navigation');
// Changing the ISA source to its top page fixed a 404 and created a worse
// problem: the parser scraped every nav link, and the pipeline drafted two
// "articles" from the agency's "About the organisation" and "Regional offices"
// pages. Both are real prose, so the substance gate passed them — that gate
// measures fullness, not newsworthiness. A news entry carries a date beside
// it. Navigation does not.
assert(extractDate('令和8年9月19日').startsWith('2026-09-19'), 'A Reiwa-era date converts (令和8 = 2026)');
assert(extractDate('2026年9月19日').startsWith('2026-09-19'), 'A Western-year Japanese date parses');
assert(extractDate('2026/09/19').startsWith('2026-09-19'), 'A slash date parses');
assert(extractDate('組織について') === null, 'Text with no date returns null');
assert(extractDate('') === null, 'Empty text returns null');

const navOnly =
  '<li><a href="/isa/about/organization/index.html">組織について</a></li>' +
  '<li><a href="/isa/about/region/index.html">地方出入国在留管理官署</a></li>';
assert(
  parseNoticeList(navOnly, 'https://www.moj.go.jp/isa/').length === 0,
  'A page of pure navigation yields no items at all'
);

const datedList =
  '<li>令和8年9月19日<a href="/isa/news/01.html">在留資格の変更申請のオンライン化について</a></li>' +
  '<li>令和8年9月10日<a href="/isa/news/02.html">在留カードの記載事項変更の届出</a></li>' +
  '<li>令和8年8月1日<a href="/isa/news/03.html">特定技能制度の運用状況について</a></li>';
const dated = parseNoticeList(datedList, 'https://www.moj.go.jp/isa/');
assert(dated.length === 3, 'Every dated entry is kept');

// The date nearest the link wins. Scanning left-to-right would hand each entry
// the previous entry's date — a silent corruption: the date is valid, just
// attached to the wrong item, which skews both recency and the article date.
assert(dated[0].publishedAt.startsWith('2026-09-19'), 'The first entry keeps its own date');
assert(dated[1].publishedAt.startsWith('2026-09-10'), "The second entry is not given the first entry's date");
assert(dated[2].publishedAt.startsWith('2026-08-01'), 'The third entry keeps its own date');

assert(
  lastDateIn('令和8年9月19日 ... 令和8年9月10日').startsWith('2026-09-10'),
  'lastDateIn returns the nearest date, not the earliest in the string'
);
assert(lastDateIn('không có ngày') === null, 'lastDateIn returns null when there is no date');

const mixed =
  '<li><a href="/isa/about/organization/index.html">組織について</a></li>' +
  '<li>令和8年9月19日<a href="/isa/news/01.html">在留資格の変更申請について</a></li>' +
  '<li><a href="/isa/about/region/index.html">地方出入国在留管理官署</a></li>';
const mixedOut = parseNoticeList(mixed, 'https://www.moj.go.jp/isa/');
assert(mixedOut.length === 1, 'Navigation around a real notice is stripped, the notice survives');
assert(mixedOut[0].url.includes('/news/'), 'And the surviving item is the news one');

// A date written AFTER the title, on the last entry of a list. The forward
// window only runs when no anchor follows: text sitting between two links is
// ambiguous, and Japanese notice lists put the date first, so that text
// belongs to the link on its right. Letting both links read it would hand a
// nav link standing just before a notice that notice's date.
const trailing =
  '<li>令和8年9月10日<a href="/isa/news/08.html">在留カードの届出について</a></li>' +
  '<li><a href="/isa/news/09.html">特定技能制度の運用状況について</a>（2026年9月19日）</li>';
const trailingOut = parseNoticeList(trailing, 'https://www.moj.go.jp/isa/');
assert(trailingOut.length === 2, 'A trailing date on the final entry is still found');
assert(
  trailingOut[1].publishedAt.startsWith('2026-09-19'),
  'The final entry takes the date written after its title'
);
assert(
  trailingOut[0].publishedAt.startsWith('2026-09-10'),
  'And the entry before it keeps its own leading date'
);

// The same shape, but with a nav link where the news link was: nothing to
// inherit from, so it drops.
const navBeforeNews =
  '<li><a href="/isa/about/region/index.html">地方出入国在留管理官署一覧</a></li>' +
  '<li>令和8年9月19日<a href="/isa/news/01.html">在留資格の変更申請について</a></li>';
const navBeforeOut = parseNoticeList(navBeforeNews, 'https://www.moj.go.jp/isa/');
assert(navBeforeOut.length === 1, 'A nav link standing just before a notice does not borrow its date');
assert(navBeforeOut[0].url.includes('/news/'), 'Only the dated notice survives');

console.log('\n========================================================');
console.log(`TOTAL NEWSROOM TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('========================================================');

if (failCount > 0) {
  process.exit(1);
}
console.log('🎉 ALL NEWSROOM TESTS PASSED!\n');
process.exit(0);
