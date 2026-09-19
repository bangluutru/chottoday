/**
 * Chotto Studio — lớp ghi file, chạy phía Node trong dev server.
 *
 * CHỈ TỒN TẠI KHI `npm run dev`. `apply: 'serve'` khiến Vite không nạp plugin
 * này lúc build, nên các endpoint dưới đây không bao giờ có mặt trên
 * chottoday.com. Đó là lý do studio không cần xác thực: nó không tồn tại ở nơi
 * công cộng.
 *
 * Ba ranh giới của file này:
 *   1. Không bao giờ chạy nội dung người dùng dán vào. Nó chỉ nhận dữ liệu đã
 *      được parser phía trình duyệt chuyển thành JSON.
 *   2. Mọi đường dẫn ghi đều dựng từ slug đã lọc — không nhận đường dẫn từ
 *      client, nên không có lối đi ra khỏi thư mục dự án.
 *   3. Không ghi đè file đã có trừ khi client nói rõ `overwrite: true`.
 */

import { execFile } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

const SLUG_RE = /^[a-z0-9-]{3,60}$/;
const MAX_BODY = 8 * 1024 * 1024; // ảnh bìa dạng base64 có thể vài MB

function readJson(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > MAX_BODY) { reject(new Error('Nội dung gửi lên quá lớn')); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (e) { reject(new Error(`JSON hỏng: ${e.message}`)); }
    });
    req.on('error', reject);
  });
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('content-type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(payload));
}

/** Kiểm python3 và hai thư viện card.py cần. Máy mới hay thiếu đúng chỗ này. */
async function checkPython(root) {
  const cardPath = path.join(root, 'scripts', 'images', 'card.py');
  try { await fs.access(cardPath); }
  catch { return { ok: false, reason: 'Không tìm thấy scripts/images/card.py' }; }

  try {
    await execFileAsync('python3', ['-c', 'import PIL, fontTools']);
    return { ok: true, reason: null };
  } catch (error) {
    const missing = /No module named '?(\w+)'?/.exec(String(error.stderr || error.message));
    if (missing) {
      return {
        ok: false,
        reason: `Thiếu thư viện Python: ${missing[1]}`,
        fix: 'pip install pillow fonttools brotli',
      };
    }
    return {
      ok: false,
      reason: 'Không chạy được python3',
      fix: 'Cài Python 3 rồi chạy: pip install pillow fonttools brotli',
    };
  }
}

async function exists(p) {
  try { await fs.access(p); return true; } catch { return false; }
}

export function chottoStudio() {
  return {
    name: 'chotto-studio',
    // Chỉ chạy ở dev server. Không có mặt trong bản build production.
    apply: 'serve',

    configureServer(server) {
      const root = server.config.root;

      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/__studio/')) return next();

        try {
          // --- Kiểm môi trường -------------------------------------------
          if (req.url === '/__studio/env') {
            const python = await checkPython(root);
            const fontsDir = path.join(root, 'node_modules', '@expo-google-fonts');
            return send(res, 200, {
              python,
              fonts: { ok: await exists(fontsDir), fix: 'npm install' },
            });
          }

          if (req.method !== 'POST') return send(res, 405, { error: 'Chỉ nhận POST' });

          // --- Sinh ảnh OG bằng card.py ----------------------------------
          if (req.url === '/__studio/card') {
            const { slug, title, topic, organization, publishedAt } = await readJson(req);
            if (!SLUG_RE.test(slug || '')) return send(res, 400, { error: `slug không hợp lệ: "${slug}"` });

            const outPath = path.join(root, 'public', 'images', 'og', `og-${slug}.png`);
            await fs.mkdir(path.dirname(outPath), { recursive: true });
            try {
              await execFileAsync('python3', [
                path.join(root, 'scripts', 'images', 'card.py'),
                '--out', outPath,
                '--item', JSON.stringify({ title, topic, organization, publishedAt }),
              ]);
            } catch (error) {
              // card.py dừng khi thiếu glyph — đó là tính năng, không phải lỗi
              // vặt. Trả nguyên thông báo của nó để người dùng biết ký tự nào.
              return send(res, 422, {
                error: 'card.py không vẽ được',
                detail: String(error.stderr || error.message).trim(),
              });
            }
            return send(res, 200, { written: `/images/og/og-${slug}.png` });
          }

          // --- Ghi bài viết ----------------------------------------------
          if (req.url === '/__studio/write') {
            const { slug, fileSource, coverImage, overwrite } = await readJson(req);
            if (!SLUG_RE.test(slug || '')) return send(res, 400, { error: `slug không hợp lệ: "${slug}"` });
            if (typeof fileSource !== 'string' || !fileSource.includes('export const')) {
              return send(res, 400, { error: 'fileSource không phải nội dung file hợp lệ' });
            }

            const articlePath = path.join(root, 'src', 'content', 'articles', `${slug}.js`);
            if (!overwrite && await exists(articlePath)) {
              return send(res, 409, { error: `Đã có file ${slug}.js. Gửi lại với overwrite nếu muốn đè.` });
            }

            const written = [];

            await fs.writeFile(articlePath, fileSource, 'utf8');
            written.push(`src/content/articles/${slug}.js`);

            // Ảnh bìa: nhận data URL, chỉ chấp nhận vài kiểu ảnh.
            if (coverImage?.dataUrl) {
              const m = /^data:image\/(png|jpeg|jpg|webp);base64,(.+)$/s.exec(coverImage.dataUrl);
              if (!m) return send(res, 400, { error: 'Ảnh bìa phải là data URL png/jpeg/webp' });
              const ext = m[1] === 'jpeg' ? 'jpg' : m[1];
              const coverPath = path.join(root, 'public', 'images', 'featured', `${slug}.${ext}`);
              await fs.mkdir(path.dirname(coverPath), { recursive: true });
              await fs.writeFile(coverPath, Buffer.from(m[2], 'base64'));
              written.push(`public/images/featured/${slug}.${ext}`);
            }

            // Chèn vào articlesList.js. Bước này có thể từ chối — khi đó file
            // bài vẫn nằm đó và người dùng tự thêm hai dòng, còn hơn là sửa
            // hỏng file danh sách.
            const listPath = path.join(root, 'src', 'content', 'articles', 'articlesList.js');
            const listSource = await fs.readFile(listPath, 'utf8');
            const { patchArticlesList } = await server.ssrLoadModule(
              '/src/studio/lib/emitArticleFile.js'
            );
            const patched = patchArticlesList(listSource, slug);
            if (patched.source) {
              await fs.writeFile(listPath, patched.source, 'utf8');
              written.push('src/content/articles/articlesList.js');
            }

            return send(res, 200, {
              written,
              listPatched: Boolean(patched.source),
              listReason: patched.reason,
            });
          }

          return send(res, 404, { error: 'Không có endpoint này' });
        } catch (error) {
          return send(res, 500, { error: String(error.message || error) });
        }
      });
    },
  };
}
