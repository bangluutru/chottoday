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
