/**
 * Bản ghi bài viết → nội dung file `.js` đặt vào src/content/articles/.
 *
 * Tự sinh chuỗi thay vì JSON.stringify vì file này người sẽ đọc và sửa tay:
 * cần khoá không có ngoặc kép, nháy đơn, dấu phẩy cuối, và thụt lề hai khoảng
 * — đúng như các bài viết tay đang có trong repo.
 */

/** Tên biến export: `nisa-cho-nguoi-nuoc-ngoai` → `articleNisaChoNguoiNuocNgoai`. */
export function exportName(slug = '') {
  const camel = slug
    .split('-')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join('');
  return `article${camel || 'Untitled'}`;
}

const IDENT_RE = /^[A-Za-z_$][\w$]*$/;

function quote(s) {
  const body = String(s)
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\n/g, '\\n');
  return `'${body}'`;
}

function emit(value, indent) {
  const pad = '  '.repeat(indent);
  const padIn = '  '.repeat(indent + 1);

  if (value === null) return 'null';
  if (typeof value === 'boolean' || typeof value === 'number') return String(value);
  if (typeof value === 'string') return quote(value);

  if (Array.isArray(value)) {
    if (value.length === 0) return '[]';
    const allShortStrings = value.every((v) => typeof v === 'string' && v.length < 30);
    if (allShortStrings && value.join('').length < 60) {
      return `[${value.map(quote).join(', ')}]`;
    }
    const items = value.map((v) => `${padIn}${emit(v, indent + 1)},`).join('\n');
    return `[\n${items}\n${pad}]`;
  }

  const entries = Object.entries(value).filter(([, v]) => v !== undefined);
  if (entries.length === 0) return '{}';
  const body = entries
    .map(([k, v]) => {
      const key = IDENT_RE.test(k) ? k : quote(k);
      return `${padIn}${key}: ${emit(v, indent + 1)},`;
    })
    .join('\n');
  return `{\n${body}\n${pad}}`;
}

export function emitArticleFile(article) {
  const name = exportName(article.slug);
  const header = [
    '/**',
    ` * ${article.title}`,
    ' *',
    ' * Soạn qua Chotto Studio. status: "review" — CHƯA xuất bản.',
    ' * Trước khi đổi sang "published": mở từng link trong `sources`, đối chiếu',
    ' * số liệu, rồi điền tên mình vào `review.reviewer`.',
    ' */',
    '',
  ].join('\n');

  return `${header}export const ${name} = ${emit(article, 0)};\n`;
}

/**
 * Chèn import và tên biến vào articlesList.js.
 *
 * Thao tác trên chuỗi chứ không parse AST: file này có khuôn rất hẹp và ổn
 * định, thêm một parser JS đầy đủ chỉ để sửa hai dòng là đổi rủi ro nhỏ lấy
 * rủi ro lớn hơn. Trả về null khi không nhận ra khuôn — gọi bên ngoài phải
 * xử lý, tuyệt đối không ghi bừa.
 */
export function patchArticlesList(source, slug) {
  const name = exportName(slug);
  if (source.includes(`from './${slug}.js'`)) {
    return { source, changed: false, reason: 'Bài này đã có trong danh sách' };
  }

  const importLine = `import { ${name} } from './${slug}.js';`;
  const lastImport = [...source.matchAll(/^import .*;$/gm)].pop();
  if (!lastImport) return { source: null, changed: false, reason: 'Không tìm thấy dòng import nào' };

  const at = lastImport.index + lastImport[0].length;
  let out = `${source.slice(0, at)}\n${importLine}${source.slice(at)}`;

  const arrayOpen = out.indexOf('export const ALL_ARTICLES = [');
  if (arrayOpen === -1) return { source: null, changed: false, reason: 'Không tìm thấy mảng ALL_ARTICLES' };

  const insertAt = out.indexOf('[', arrayOpen) + 1;
  out = `${out.slice(0, insertAt)}\n  ${name},${out.slice(insertAt)}`;

  return { source: out, changed: true, reason: null };
}
