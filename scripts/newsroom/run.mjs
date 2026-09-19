#!/usr/bin/env node
/**
 * Newsroom — chạy một buổi sáng: thu thập → xếp hạng → soạn nháp → ghi file.
 *
 * Kết quả KHÔNG ghi thẳng vào src/content/articles. Bản nháp rơi vào
 * newsroom/drafts/<ngày>/ và dừng ở đó. Đưa một bài vào tầng nội dung là việc
 * của người duyệt, làm sau khi đã tra nguồn — đó là chỗ duy nhất quyết định
 * bài có lên site hay không, và nó phải là một hành động có chủ ý.
 *
 * Mỗi tin cho ra ba file cùng tên:
 *   <slug>.json          bản ghi bài viết, status: 'review'
 *   <slug>.caption.txt   caption fanpage, kèm danh sách điểm chưa kiểm chứng
 *   <slug>.png           ảnh card 1200x630
 */

import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

import { fetchAllSources, fetchArticleBody, hasEnoughSubstance } from './fetch.mjs';
import { rankItems } from './rank.mjs';
import { buildCaption, draftArticle, screenItems } from './draft.mjs';
import { getSourceById } from './sources.js';

const execFileAsync = promisify(execFile);
const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..');
const DEFAULT_LIMIT = 5;

async function renderCard(record, item, outPath) {
  const payload = JSON.stringify({
    title: record.title,
    topic: record.category,
    organization: record.sources[0].organization,
    publishedAt: record.sources[0].accessedAt,
  });
  await execFileAsync('python3', [
    path.join(REPO_ROOT, 'scripts', 'newsroom', 'render_card.py'),
    '--out', outPath,
    '--item', payload,
  ]);
}

async function main() {
  const limit = Number(process.env.NEWSROOM_LIMIT || DEFAULT_LIMIT);
  const today = new Date().toISOString();
  const dateStamp = today.slice(0, 10);
  const outDir = path.join(REPO_ROOT, 'newsroom', 'drafts', dateStamp);

  const { entries } = await fetchAllSources();
  if (entries.length === 0) {
    console.error('❌ Không nguồn nào trả về tin. Kiểm tra URL trong sources.js.');
    process.exit(1);
  }

  // Xếp hạng RỘNG hơn số bài cần soạn, để vòng sàng có cái mà chọn.
  //
  // Nếu chỉ xếp đúng `limit` tin rồi mới sàng thì một buổi sáng mà cả hai tin
  // đầu bảng đều là rác sẽ ra 0 bài, trong khi tin thứ ba có khi lại đúng
  // việc. Lấy dư rồi cắt sau.
  const POOL = Math.max(limit * 5, 12);
  const pool = rankItems(entries, { limit: POOL });
  console.log(`\nXếp hạng: ${pool.length} tin qua ngưỡng (từ ${entries.length} tin thô)`);
  for (const item of pool) {
    console.log(`  ${item.score.toFixed(1).padStart(5)}  [${item.topic || '?'}] ${item.title.slice(0, 70)}`);
  }

  if (pool.length === 0) {
    console.log('\nKhông có tin nào vượt ngưỡng hôm nay. Không tạo draft — đó là kết quả hợp lệ.');
    return;
  }

  // Vòng sàng: model tự đọc tiêu đề và loại tin không phải việc của cư dân.
  //
  // Cần tầng này vì bộ đếm từ khoá đo CHỮ chứ không đo Ý — lần chạy #4 đẩy
  // một thông báo tuyển công chức lên đầu bảng với 9.8 điểm.
  const poolWithOrg = pool.map((item) => ({
    ...item,
    organization: getSourceById(item.sourceId)?.organization || item.sourceId,
  }));
  const screen = await screenItems(poolWithOrg, { today });
  if (screen.failed) {
    console.warn(`  ⚠ Vòng sàng hỏng: ${screen.failed} — giữ hết, người duyệt tự lọc.`);
  }

  const rejected = [];
  const kept = [];
  pool.forEach((item, i) => {
    const decision = screen.decisions[i] || { keep: true, reason: '' };
    (decision.keep ? kept : rejected).push({ item, reason: decision.reason });
  });

  if (rejected.length) {
    console.log(`\nVòng sàng bỏ ${rejected.length} tin:`);
    for (const r of rejected) {
      console.log(`  – ${r.item.title.slice(0, 55)} — ${r.reason}`);
    }
  }
  if (screen.usage) {
    console.log(
      `  (sàng: ${screen.usage.prompt_tokens ?? '?'} vào / ${screen.usage.completion_tokens ?? '?'} ra)`
    );
  }

  const ranked = kept.map((k) => k.item).slice(0, limit);
  if (ranked.length === 0) {
    console.log('\nVòng sàng loại hết. Không tạo draft — thà không có bài còn hơn bài vô dụng.');
  }

  await fs.mkdir(outDir, { recursive: true });
  const written = [];
  const failures = [];
  const skipped = [];

  for (const item of ranked) {
    const source = getSourceById(item.sourceId);
    try {
      // Lấy thân thông báo để model có nguyên liệu thật, không chỉ tiêu đề.
      let body = '';
      try {
        body = await fetchArticleBody(item.url);
      } catch (error) {
        console.warn(`  ⚠ Không lấy được thân bài ${item.url}: ${error.message}`);
      }

      // Cổng "đủ chất", đặt TRƯỚC khi gọi model.
      //
      // Lần chạy thật đầu tiên soạn một bài từ trang mục lục. Model không bịa
      // — nó trung thực nói nguồn thiếu chi tiết — nhưng kết quả là bài bảo
      // người đọc đi đọc trang gốc, và caption cũng vậy. Bài rỗng tệ hơn không
      // có bài: nó tốn tiền gọi model, tốn thì giờ người duyệt, và nếu lọt lên
      // fanpage thì tốn uy tín.
      const substance = hasEnoughSubstance(body);
      if (!substance.ok) {
        skipped.push({ item, reason: substance.reason });
        console.log(`  – ${item.title.slice(0, 55)} — bỏ qua: ${substance.reason}`);
        continue;
      }

      const { record, usage } = await draftArticle(item, source, body, { today });
      const base = path.join(outDir, record.slug);

      await fs.writeFile(`${base}.json`, JSON.stringify(record, null, 2) + '\n', 'utf8');
      await fs.writeFile(`${base}.caption.txt`, buildCaption(record) + '\n', 'utf8');
      await renderCard(record, item, `${base}.png`);

      written.push(record);
      // Tên trường của OpenAI, không phải của Anthropic — lần chạy đầu in ra
      // "undefined vào / undefined ra" vì đọc nhầm tên còn sót lại.
      console.log(
        `  ✓ ${record.slug}  (${usage?.prompt_tokens ?? '?'} vào / ` +
        `${usage?.completion_tokens ?? '?'} ra, cache đọc ` +
        `${usage?.prompt_tokens_details?.cached_tokens ?? 0})`
      );
    } catch (error) {
      failures.push({ item, error: error.message });
      console.error(`  ✗ ${item.title.slice(0, 60)}: ${error.message}`);
    }
  }

  // Bảng kê để người duyệt đọc trước khi mở từng file.
  const summary = [
    `# Nháp tin ngày ${dateStamp}`,
    '',
    `Tự động soạn từ ${entries.length} tin thô: ${pool.length} qua xếp hạng, `+
    `vòng sàng bỏ ${rejected.length}, cổng đủ chất bỏ ${skipped.length}, soạn xong ${written.length}.`,
    '',
    '**Chưa bài nào được xuất bản.** Mọi bản ghi đều mang `status: "review"` và ô',
    '`reviewer` còn để trống. Muốn đưa lên site thì tự tra nguồn, điền tên vào ô đó,',
    'rồi mới chuyển bản ghi sang tầng nội dung.',
    '',
    ...written.flatMap((record) => [
      `## ${record.title}`,
      '',
      `- Chủ đề: \`${record.category}\``,
      `- Nguồn: ${record.sources[0].organization}`,
      `- Link gốc: ${record.sources[0].url}`,
      record._needsVerification?.length
        ? `- **Phải tra lại ${record._needsVerification.length} điểm** trước khi đăng:\n` +
          record._needsVerification.map((p) => `  - ${p}`).join('\n')
        : '- Model không đánh dấu điểm nào cần tra lại (vẫn nên đọc kỹ)',
      '',
    ]),
    ...(skipped.length
      ? [
          '## Bỏ qua vì nguồn không đủ chất',
          '',
          'Những tin này lọt qua xếp hạng nhưng trang nguồn chỉ là mục lục hoặc',
          'gần như rỗng. Soạn bài từ đó sẽ ra một bài bảo bạn đi đọc trang gốc,',
          'nên pipeline dừng trước khi gọi model. Nếu thấy tin nào đáng làm, mở',
          'link và tự viết.',
          '',
          ...skipped.map((sk) => `- [${sk.item.title}](${sk.item.url}) — ${sk.reason}`),
          '',
        ]
      : []),
    ...(rejected.length
      ? [
          '## Vòng sàng bỏ',
          '',
          'Những tin này qua được xếp hạng bằng từ khoá nhưng model cho rằng không',
          'phải việc của người Việt đang sống ở Nhật. Danh sách để đây vì vòng sàng',
          '**có thể bỏ nhầm** — nếu thấy tin nào đáng làm thì mở link và tự viết,',
          'rồi nói lại để sửa hướng dẫn sàng.',
          '',
          ...rejected.map((r) => `- [${r.item.title}](${r.item.url}) — ${r.reason}`),
          '',
        ]
      : []),
    ...(screen.failed
      ? [
          '## Vòng sàng hỏng',
          '',
          `Không gọi được vòng sàng (\`${screen.failed}\`), nên **mọi tin đều được giữ**`,
          'thay vì bỏ hết. Danh sách dưới đây có thể lẫn tin không liên quan.',
          '',
        ]
      : []),
    ...(failures.length
      ? ['## Soạn hỏng', '', ...failures.map((f) => `- ${f.item.url} — ${f.error}`), '']
      : []),
  ].join('\n');

  // Chỉ ghi bảng kê khi thật sự có cái để duyệt.
  //
  // Thư mục rỗng thì git không thấy gì, nên workflow không mở PR — và đó là
  // điều đúng: một PR chỉ chứa bảng kê "hôm nay không có bài" mỗi sáng là
  // tiếng ồn, mà tiếng ồn hằng ngày thì kết cục quen thuộc là người ta thôi
  // không mở PR nữa. Những buổi sáng như vậy, log của workflow đã ghi đủ ai
  // bị loại vì lý do gì.
  if (written.length === 0 && failures.length === 0) {
    console.log(
      `\nKhông có bản nháp nào hôm nay (sàng bỏ ${rejected.length}, ` +
      `cổng đủ chất bỏ ${skipped.length}). Không mở PR — xem log phía trên.`
    );
    return;
  }

  await fs.writeFile(path.join(outDir, 'README.md'), summary, 'utf8');
  console.log(
    `\nĐã ghi ${written.length} bản nháp vào newsroom/drafts/${dateStamp}/` +
    (skipped.length ? ` (bỏ qua ${skipped.length} vì nguồn không đủ chất)` : '')
  );

  // Một buổi sáng không có tin nào đáng soạn là kết quả HỢP LỆ, không phải
  // hỏng — nhất là sau khi thêm cổng đủ chất. Báo đỏ vào những hôm như vậy
  // thì mỗi tuần vài lần có mail báo lỗi giả, và kết cục quen thuộc là người
  // ta tắt thông báo của workflow, tắt luôn cả cảnh báo thật.
  // Chỉ coi là hỏng khi có tin đã qua cổng mà soạn lỗi hết.
  if (written.length === 0 && failures.length > 0) {
    console.error(`❌ ${failures.length} tin qua cổng nhưng soạn lỗi hết.`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Newsroom hỏng:', error);
  process.exit(1);
});
