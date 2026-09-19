/**
 * Đoán nội dung dán vào là file .js hay markdown.
 *
 * Đoán sai thì khó hiểu vì sao, nên hàm này trả cả LÝ DO để giao diện hiện ra,
 * và người dùng luôn ép được bằng tay. Một bộ đoán im lặng là bộ đoán mà khi
 * sai không ai biết nó đã quyết định gì.
 */

export const FORMATS = { JS: 'js', MARKDOWN: 'markdown' };

export function detectFormat(raw = '') {
  const text = raw.trim();
  if (!text) return { format: FORMATS.MARKDOWN, reason: 'Chưa có nội dung', confident: false };

  if (/^export\s+(?:default|const|let|var)\b/.test(text)) {
    return { format: FORMATS.JS, reason: 'Mở đầu bằng `export`', confident: true };
  }
  if (/^(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*\{/.test(text)) {
    return { format: FORMATS.JS, reason: 'Mở đầu bằng khai báo biến gán object', confident: true };
  }
  if (text.startsWith('---')) {
    return { format: FORMATS.MARKDOWN, reason: 'Mở đầu bằng khối frontmatter `---`', confident: true };
  }
  if (/^#{1,3}\s+/m.test(text)) {
    return { format: FORMATS.MARKDOWN, reason: 'Có tiêu đề markdown `#`', confident: true };
  }

  // Object trần `{ ... }`: chỉ coi là JS khi thấy khoá đặc trưng của bài viết,
  // vì một đoạn markdown cũng có thể tình cờ mở bằng dấu ngoặc nhọn.
  if (text.startsWith('{') && /\b(?:slug|sections|excerpt)\s*:/.test(text)) {
    return { format: FORMATS.JS, reason: 'Object literal có khoá `slug`/`sections`', confident: true };
  }

  return { format: FORMATS.MARKDOWN, reason: 'Không thấy dấu hiệu của JS — coi như markdown', confident: false };
}
