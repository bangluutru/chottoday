/**
 * Chotto Studio — test cho lớp lõi.
 *
 * Chỉ test hàm thuần: nhận dạng định dạng, đọc markdown, đọc object literal,
 * đoán chuyên mục, dựng bản ghi, sinh file. Giao diện và phần ghi file không
 * test ở đây — chúng cần trình duyệt và đĩa thật.
 *
 * Điều đáng kiểm nhất: studio KHÔNG BAO GIỜ sinh ra `type` ngoài 12 kiểu hợp
 * lệ, và KHÔNG BAO GIỜ chạy code dán vào.
 */

import { detectFormat, FORMATS } from '../src/studio/lib/detect.js';
import { parseMarkdown, parseFrontmatter } from '../src/studio/lib/parseMarkdown.js';
import { parseLiteral, stripModuleWrapper, LiteralError } from '../src/studio/lib/parseLiteral.js';
import { suggestCategory, collectText } from '../src/studio/lib/categorize.js';
import {
  buildArticle, reviewArticle, slugify, estimateReadingTime, VALID_SECTION_TYPES,
} from '../src/studio/lib/buildArticle.js';
import { emitArticleFile, exportName, patchArticlesList } from '../src/studio/lib/emitArticleFile.js';

let passCount = 0;
let failCount = 0;

function assert(cond, label) {
  if (cond) { passCount++; console.log(`  ✓ ${label}`); }
  else { failCount++; console.log(`  ✗ ${label}`); }
}

console.log('========================================================');
console.log('CHOTTO STUDIO TESTS');
console.log('========================================================');

// 1. Nhận dạng định dạng ---------------------------------------------------
console.log('\n1. Nhận dạng định dạng');
assert(detectFormat('export const a = {}').format === FORMATS.JS, 'Mở đầu `export const` là JS');
assert(detectFormat('export default { }').format === FORMATS.JS, '`export default` là JS');
assert(detectFormat('const x = { slug: "a" }').format === FORMATS.JS, 'Khai báo biến gán object là JS');
assert(detectFormat('---\ntitle: A\n---\n').format === FORMATS.MARKDOWN, 'Frontmatter là markdown');
assert(detectFormat('# Tiêu đề\n\nNội dung').format === FORMATS.MARKDOWN, 'Có `#` là markdown');
assert(
  detectFormat('{ slug: "a", sections: [] }').format === FORMATS.JS,
  'Object trần có khoá slug/sections là JS'
);
assert(
  detectFormat('Chỉ là văn xuôi thường.').confident === false,
  'Văn xuôi trần thì không tự tin — giao diện phải nhắc'
);
assert(detectFormat('').reason.length > 0, 'Luôn kèm lý do để hiện ra cho người dùng');

// 2. Object literal — KHÔNG chạy code -------------------------------------
console.log('\n2. Đọc object literal mà không chạy code');
// Nội dung dán đến từ AI agent, mà agent thì đọc web. Nếu studio `eval` chuỗi
// dán vào thì một trang nguồn bị chèn chỉ thị có thể gọi thẳng endpoint ghi
// file. Parser chỉ nhận dữ liệu, nên đường đó không tồn tại.
assert(
  stripModuleWrapper('export const articleA = { a: 1 };') === '{ a: 1 }',
  'Gỡ được vỏ `export const ... = ...;`'
);
const lit = parseLiteral(`export const x = {
  // chú thích được phép
  slug: 'nisa-la-gi',
  tags: ['Đầu tư', 'Thuế'],
  readingTime: 7,
  nested: { deep: [1, 2, { ok: true }] },
  nothing: null,
};`);
assert(lit.slug === 'nisa-la-gi', 'Đọc được chuỗi nháy đơn');
assert(lit.tags.length === 2 && lit.tags[1] === 'Thuế', 'Đọc được mảng chuỗi có dấu tiếng Việt');
assert(lit.readingTime === 7, 'Đọc được số');
assert(lit.nested.deep[2].ok === true, 'Đọc được object lồng và boolean');
assert(lit.nothing === null, 'Đọc được null');
assert(parseLiteral("{ 'khoá lạ': 1 }")['khoá lạ'] === 1, 'Khoá dạng chuỗi cũng đọc được');
assert(parseLiteral('{ a: "x\\ny" }').a === 'x\ny', 'Escape \\n giải mã đúng');

function rejects(src, label) {
  try { parseLiteral(src); assert(false, label); }
  catch (e) { assert(e instanceof LiteralError, label); }
}
rejects('{ a: fetch("/x") }', 'Từ chối lời gọi hàm');
rejects('{ a: window.location }', 'Từ chối truy cập biến toàn cục');
rejects('{ a: `template` }', 'Từ chối template literal');
rejects('{ a: 1 + 1 }', 'Từ chối biểu thức toán tử');
rejects('{ a: (() => 1)() }', 'Từ chối hàm mũi tên gọi ngay');
rejects("{ a: 'chưa đóng }", 'Từ chối chuỗi không đóng');

// 3. Markdown → sections ---------------------------------------------------
console.log('\n3. Markdown → sections');
const fm = parseFrontmatter('---\ntitle: NISA là gì\ntags: [Đầu tư, Thuế]\n---\n\nThân bài.');
assert(fm.meta.title === 'NISA là gì', 'Frontmatter đọc được khoá chuỗi');
assert(Array.isArray(fm.meta.tags) && fm.meta.tags[0] === 'Đầu tư', 'Frontmatter đọc được mảng');
assert(fm.body.trim() === 'Thân bài.', 'Thân bài tách khỏi frontmatter');

const md = parseMarkdown(`---
title: Gia hạn visa
---

# Gia hạn visa kỹ sư

Đoạn mở đầu nói bài này về gì.

## 1. Hồ sơ cần chuẩn bị

Một đoạn giải thích.

- Hộ chiếu gốc
- Thẻ cư trú

## 2. Các bước nộp

1. **Chuẩn bị hồ sơ** — gom đủ giấy tờ ở mục trên.
2. **Nộp tại Nyukan** — mang bản gốc đi đối chiếu.

> [!warning] Hạn chót
> Nộp trước khi thẻ hết hạn 3 tháng.

> [!note] Mẹo
> Đặt lịch online để khỏi xếp hàng.

:::term 在留カード | Zairyu Card | Thẻ cư trú

| Khoản | Số tiền | ghi chú |
| --- | --- | --- |
| Lệ phí | 4.000 ¥ | |
| Tổng | 4.000 ¥ | tổng |

:::tool net-salary-jp

> Một câu trích dẫn — Nguồn nào đó
`);

const types = md.sections.map((s) => s.type);
assert(md.meta.title === 'Gia hạn visa', 'Frontmatter thắng `# H1` khi cả hai cùng có');
assert(types[0] === 'intro', 'Đoạn văn đầu tiên thành intro');
assert(types.filter((t) => t === 'heading').length === 2, 'Hai `##` thành hai heading');
assert(md.sections.find((s) => s.type === 'heading').level === 2, 'heading giữ đúng level 2');
assert(types.includes('paragraph'), 'Đoạn văn sau heading thành paragraph');
assert(types.includes('list'), 'Danh sách gạch đầu dòng thành list');

const steps = md.sections.find((s) => s.type === 'steps');
assert(steps && steps.items.length === 2, 'Danh sách đánh số thành steps');
assert(steps.items[0].title === 'Chuẩn bị hồ sơ', 'steps tách được tiêu đề trước dấu —');
assert(steps.items[0].text.startsWith('gom đủ'), 'steps giữ phần mô tả sau dấu —');
assert(steps.items[1].stepNumber === 2, 'steps đánh số đúng thứ tự');

const warn = md.sections.find((s) => s.type === 'warning');
assert(warn && warn.title === 'Hạn chót', '`> [!warning]` thành warning kèm tiêu đề');
assert(md.sections.some((s) => s.type === 'note' && s.title === 'Mẹo'), '`> [!note]` thành note');

const term = md.sections.find((s) => s.type === 'term');
assert(term && term.term === '在留カード' && term.reading === 'Zairyu Card', ':::term tách ba phần');

const example = md.sections.find((s) => s.type === 'example');
assert(example && example.items.length === 2, 'Bảng markdown thành example, bỏ dòng phân cách');
assert(example.items[0].label === 'Lệ phí', 'example lấy đúng cột nhãn');
assert(example.items[1].isTotal === true, 'Cột ghi chú "tổng" bật cờ isTotal');

assert(md.sections.some((s) => s.type === 'toolCTA' && s.toolId === 'net-salary-jp'), ':::tool thành toolCTA');
assert(md.sections.some((s) => s.type === 'quote'), 'Blockquote thường thành quote');

// Ràng buộc quan trọng nhất của cả file này.
assert(
  md.sections.every((s) => VALID_SECTION_TYPES.has(s.type)),
  'MỌI section sinh ra đều nằm trong 12 kiểu hợp lệ'
);

// Thứ không nhận ra phải rơi về paragraph, không được biến mất.
const odd = parseMarkdown('Một đoạn.\n\n::: khongbiet\nnội dung lạ\n:::');
assert(
  odd.sections.every((s) => VALID_SECTION_TYPES.has(s.type)),
  'Chỉ thị lạ cũng không sinh ra kiểu ngoài danh sách'
);
assert(odd.sections.length >= 1, 'Nội dung không nhận ra vẫn còn lại, không bị nuốt');

// 4. Đoán chuyên mục -------------------------------------------------------
console.log('\n4. Đoán chuyên mục');
const catTax = suggestCategory({ title: 'NISA và thuế đầu tư cho người nước ngoài', sections: [] });
assert(catTax.category === 'work', 'Bài về thuế/đầu tư → work');
assert(catTax.confident === true, 'Khớp rõ thì tự tin');
assert(catTax.reason.includes('Khớp'), 'Có nêu từ khoá đã khớp để người dùng soát');

assert(
  suggestCategory({ title: 'Gia hạn thẻ cư trú tại Nyukan', sections: [] }).category === 'doc',
  'Bài về thẻ cư trú → doc'
);
assert(
  suggestCategory({ title: 'Bảo hiểm y tế quốc dân', sections: [] }).category === 'health',
  'Bài về bảo hiểm y tế → health'
);
const vague = suggestCategory({ title: 'Chuyện linh tinh', sections: [] });
assert(vague.confident === false, 'Không khớp gì thì KHÔNG tự tin');
assert(vague.category === 'doc', 'Và lùi về mặc định an toàn');
assert(
  collectText({ title: 'A', sections: [{ type: 'list', items: ['thuê nhà'] }] }).includes('thuê nhà'),
  'Gom được chữ từ trong items của section'
);

// 5. Dựng bản ghi ----------------------------------------------------------
console.log('\n5. Dựng bản ghi');
assert(slugify('Gia hạn visa kỹ sư: nộp trước 3 tháng') === 'gia-han-visa-ky-su-nop-truoc-3-thang', 'slugify bỏ dấu và ký tự lạ');
assert(slugify('Đổi bằng lái') === 'doi-bang-lai', 'slugify xử lý chữ Đ');

const built = buildArticle(
  { title: 'NISA là gì', excerpt: 'Giải thích ngắn.', sections: md.sections },
  { category: 'work', sources: [{ organization: 'NTA', title: 'Trang NISA', url: 'https://www.nta.go.jp/' }] }
);
assert(built.status === 'review', 'status LUÔN là review — studio không xuất bản');
assert(built.review.reviewer === 'CHƯA DUYỆT', 'reviewer để trống có nhãn, không điền sẵn tên ai');
assert(built.slug === 'nisa-la-gi', 'slug sinh từ tiêu đề');
assert(built.socialImage === '/images/og/og-nisa-la-gi.png', 'socialImage theo đúng quy ước tên');
assert(built.seo.canonical === 'https://chottoday.com/articles/nisa-la-gi', 'canonical khớp slug');
assert(built.sources[0].type === 'official', 'Nguồn mặc định type official');
assert(built.sources[0].accessedAt.match(/^\d{4}-\d{2}-\d{2}$/), 'accessedAt đúng định dạng ngày');
assert(built.review.reviewAfter > built.review.lastVerifiedAt, 'reviewAfter sau lastVerifiedAt');
assert(built.readingTime >= 2, 'readingTime tối thiểu 2 phút');
assert(estimateReadingTime([]) === 2, 'Bài rỗng vẫn là 2 phút, không phải 0');

// Kiểu section lạ phải bị loại ngay lúc dựng, không chờ tới lúc render.
const dirty = buildArticle({ title: 'X', sections: [{ type: 'text', content: 'a' }, { type: 'intro', content: 'b' }] }, {});
assert(dirty.sections.length === 1 && dirty.sections[0].type === 'intro', 'Kiểu `text` bị loại khi dựng');

// 6. Soát bản ghi ----------------------------------------------------------
console.log('\n6. Soát bản ghi');
const goodReview = reviewArticle(built);
assert(goodReview.ok === true, 'Bản ghi đủ nguồn thì không còn lỗi chặn');
assert(goodReview.advisory.some((m) => m.includes('shortAnswer')), 'Vẫn nhắc thiếu shortAnswer');
assert(goodReview.advisory.some((m) => m.includes('Tóm tắt giải pháp nhanh')), 'Nói rõ thiếu thì mất khối nào');

const bad = reviewArticle(buildArticle({ title: '', sections: [] }, {}));
assert(bad.ok === false, 'Bài rỗng thì không qua');
assert(bad.blocking.some((m) => m.includes('title')), 'Báo thiếu title');
assert(bad.blocking.some((m) => m.includes('nguồn')), 'Báo thiếu nguồn');
assert(bad.blocking.some((m) => m.includes('nội dung')), 'Báo bài không có nội dung');

const httpSrc = reviewArticle(buildArticle(
  { title: 'A', excerpt: 'B', sections: [{ type: 'intro', content: 'c' }] },
  { sources: [{ organization: 'X', title: 'Y', url: 'http://insecure.example/' }] }
));
assert(httpSrc.blocking.some((m) => m.includes('https')), 'Nguồn http bị chặn, đúng luật trust governance');

// 7. Sinh file -------------------------------------------------------------
console.log('\n7. Sinh file .js');
assert(exportName('nisa-la-gi') === 'articleNisaLaGi', 'Tên biến export theo camelCase');
const fileSrc = emitArticleFile(built);
assert(fileSrc.startsWith('/**'), 'File mở đầu bằng khối chú thích');
assert(fileSrc.includes('export const articleNisaLaGi = {'), 'Có câu export đúng tên');
assert(fileSrc.includes("status: 'review'"), 'Dùng nháy đơn như các bài viết tay trong repo');
assert(fileSrc.trimEnd().endsWith('};'), 'Kết thúc bằng };');
assert(!fileSrc.includes('"slug"'), 'Khoá không bọc ngoặc kép');

// Quan trọng: file sinh ra phải đọc ngược lại được bằng chính parser của studio.
const roundTrip = parseLiteral(fileSrc);
assert(roundTrip.slug === built.slug, 'Sinh ra rồi đọc lại được, slug khớp');
assert(roundTrip.sections.length === built.sections.length, 'Số section khớp sau vòng sinh–đọc');
assert(roundTrip.review.reviewer === 'CHƯA DUYỆT', 'Khối review qua được vòng sinh–đọc');

const withApostrophe = emitArticleFile(buildArticle(
  { title: "Bài có dấu ' nháy", excerpt: "a'b", sections: [{ type: 'intro', content: "x'y" }] }, {}
));
assert(parseLiteral(withApostrophe).excerpt === "a'b", 'Dấu nháy đơn trong nội dung được escape đúng');

// 8. Chèn vào articlesList.js ---------------------------------------------
console.log('\n8. Chèn vào articlesList.js');
const listSrc = `import { articleSalary30Man } from './salary-30man.js';
import { articleLostZairyu } from './lost-zairyu.js';

export const ALL_ARTICLES = [
  articleSalary30Man,
  articleLostZairyu,
];
`;
const patched = patchArticlesList(listSrc, 'nisa-la-gi');
assert(patched.changed === true, 'Chèn thành công');
assert(patched.source.includes("import { articleNisaLaGi } from './nisa-la-gi.js';"), 'Thêm đúng dòng import');
assert(/ALL_ARTICLES = \[\s*\n\s*articleNisaLaGi,/.test(patched.source), 'Thêm tên biến vào đầu mảng');

const twice = patchArticlesList(patched.source, 'nisa-la-gi');
assert(twice.changed === false, 'Chèn lần hai thì không làm gì');
assert(twice.reason.includes('đã có'), 'Và nói rõ vì sao');

const broken = patchArticlesList('// không có gì ở đây', 'x-y');
assert(broken.source === null, 'Không nhận ra khuôn file thì trả null');
assert(broken.changed === false, 'Và tuyệt đối không ghi bừa');

console.log('\n========================================================');
console.log(`TOTAL STUDIO TESTS: ${passCount + failCount}`);
console.log(`PASSED: ${passCount}`);
console.log(`FAILED: ${failCount}`);
console.log('========================================================');
if (failCount > 0) {
  console.log('❌ STUDIO TESTS FAILED');
  process.exit(1);
}
console.log('🎉 ALL STUDIO TESTS PASSED!');
