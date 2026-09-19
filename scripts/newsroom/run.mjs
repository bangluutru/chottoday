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

import { fetchAllSources, fetchArticleBody } from './fetch.mjs';
import { rankItems } from './rank.mjs';
import { buildCaption, draftArticle } from './draft.mjs';
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

  const ranked = rankItems(entries, { limit });
  console.log(`\nXếp hạng: ${ranked.length} tin đáng soạn (từ ${entries.length} tin thô)`);
  for (const item of ranked) {
    console.log(`  ${item.score.toFixed(1).padStart(5)}  [${item.topic || '?'}] ${item.title.slice(0, 70)}`);
  }

  if (ranked.length === 0) {
    console.log('\nKhông có tin nào vượt ngưỡng hôm nay. Không tạo draft — đó là kết quả hợp lệ.');
    return;
  }

  await fs.mkdir(outDir, { recursive: true });
  const written = [];
  const failures = [];

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

      const { record, usage } = await draftArticle(item, source, body, { today });
      const base = path.join(outDir, record.slug);

      await fs.writeFile(`${base}.json`, JSON.stringify(record, null, 2) + '\n', 'utf8');
      await fs.writeFile(`${base}.caption.txt`, buildCaption(record) + '\n', 'utf8');
      await renderCard(record, item, `${base}.png`);

      written.push(record);
      console.log(
        `  ✓ ${record.slug}  (${usage.input_tokens} vào / ${usage.output_tokens} ra` +
        `, cache đọc ${usage.cache_read_input_tokens ?? 0})`
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
    `Tự động soạn từ ${entries.length} tin thô, giữ lại ${ranked.length}, soạn xong ${written.length}.`,
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
    ...(failures.length
      ? ['## Soạn hỏng', '', ...failures.map((f) => `- ${f.item.url} — ${f.error}`), '']
      : []),
  ].join('\n');

  await fs.writeFile(path.join(outDir, 'README.md'), summary, 'utf8');
  console.log(`\nĐã ghi ${written.length} bản nháp vào newsroom/drafts/${dateStamp}/`);

  if (written.length === 0) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('❌ Newsroom hỏng:', error);
  process.exit(1);
});
