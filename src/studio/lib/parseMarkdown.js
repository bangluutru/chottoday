/**
 * Markdown → sections[] đúng 12 kiểu mà ArticleRenderer hiểu.
 *
 * Vì sao nhận markdown chứ không chỉ nhận file .js: AI viết markdown ổn định
 * hơn hẳn so với viết object literal, và người dán soát bằng mắt cũng dễ hơn.
 * Nhưng markdown không có cú pháp cho `term`, `toolCTA` hay `example`, nên ba
 * kiểu đó dùng chỉ thị `:::`.
 *
 * Nguyên tắc: KHÔNG bao giờ sinh ra một `type` ngoài 12 kiểu hợp lệ. Bất cứ
 * thứ gì không nhận ra đều rơi về `paragraph` — hiện ra dưới dạng chữ thường
 * để người dán nhìn thấy và sửa, chứ không biến mất.
 */

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/;

/** Đọc khối frontmatter đơn giản: `khoá: giá trị`, mảng dạng `[a, b]`. */
export function parseFrontmatter(text = '') {
  const m = FRONTMATTER_RE.exec(text);
  if (!m) return { meta: {}, body: text };

  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const mm = /^([A-Za-z_][\w-]*)\s*:\s*(.*)$/.exec(line.trim());
    if (!mm) continue;
    const [, key, rawValue] = mm;
    let value = rawValue.trim();
    if (value.startsWith('[') && value.endsWith(']')) {
      value = value
        .slice(1, -1)
        .split(',')
        .map((s) => s.trim().replace(/^["']|["']$/g, ''))
        .filter(Boolean);
    } else {
      value = value.replace(/^["']|["']$/g, '');
    }
    meta[key] = value;
  }
  return { meta, body: text.slice(m[0].length) };
}

/** Gỡ đánh dấu inline để lấy chữ trần (dùng cho tiêu đề, nhãn). */
function plain(s = '') {
  return s
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.*?\)/g, '$1')
    .trim();
}

function splitBlocks(body) {
  return body
    .replace(/\r\n/g, '\n')
    .split(/\n{2,}/)
    .map((b) => b.trim())
    .filter(Boolean);
}

/**
 * Một mục danh sách đánh số → {title, text}.
 * Tách ở " — " hoặc ": " đầu tiên. Không có dấu tách thì cả câu là title và
 * text để rỗng — renderer vẫn hiện đúng, chỉ là không có dòng mô tả.
 */
function splitStep(raw, index) {
  const text = plain(raw);
  const sep = text.match(/\s+—\s+|\s+–\s+|:\s+/);
  if (!sep) return { stepNumber: index + 1, title: text, text: '' };
  const at = sep.index;
  return {
    stepNumber: index + 1,
    title: text.slice(0, at).trim(),
    text: text.slice(at + sep[0].length).trim(),
  };
}

/** Bảng markdown → example.items[{label, value}]. Bỏ dòng phân cách ---. */
function parseTable(lines) {
  const rows = lines
    .filter((l) => l.trim().startsWith('|'))
    .map((l) => l.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim()))
    .filter((cells) => !cells.every((c) => /^:?-{2,}:?$/.test(c)));
  if (rows.length === 0) return null;

  // Dòng đầu là tiêu đề cột nếu ngay dưới nó là dòng phân cách.
  const hasHeader = lines.some((l) => /^\|?[\s:-]*-{2,}[\s:|-]*$/.test(l.trim()));
  const body = hasHeader ? rows.slice(1) : rows;

  return body
    .filter((cells) => cells.length >= 2)
    .map((cells) => {
      const item = { label: plain(cells[0]), value: plain(cells[1]) };
      const flag = (cells[2] || '').toLowerCase();
      if (flag.includes('tổng') || flag.includes('total')) item.isTotal = true;
      else if (flag.includes('trừ') || flag.includes('deduction')) item.isDeduction = true;
      else if (flag.includes('nổi') || flag.includes('highlight')) item.highlight = true;
      return item;
    });
}

/** `:::term 在留カード | Zairyu Card | Thẻ cư trú` và bạn bè. */
function parseDirective(block) {
  const m = /^:::(\w+)\s*([\s\S]*?)(?:\n:::)?$/.exec(block.trim());
  if (!m) return null;
  const [, name, rest] = m;
  const body = rest.trim();

  if (name === 'term') {
    const parts = body.split('|').map((s) => s.trim());
    return { type: 'term', term: parts[0] || '', reading: parts[1] || '', meaning: parts[2] || '' };
  }
  if (name === 'tool') {
    return { type: 'toolCTA', toolId: body };
  }
  if (name === 'quote') {
    const [content, author] = body.split('—').map((s) => s.trim());
    const section = { type: 'quote', content: content || body };
    if (author) section.author = author;
    return section;
  }
  return null;
}

/** GitHub alert: `> [!note] Tiêu đề` / `> [!warning] Tiêu đề`. */
function parseAlert(block) {
  const lines = block.split('\n').map((l) => l.replace(/^>\s?/, ''));
  const m = /^\[!(note|warning|tip|caution)\]\s*(.*)$/i.exec(lines[0].trim());
  if (!m) return null;
  const kind = m[1].toLowerCase();
  const type = kind === 'warning' || kind === 'caution' ? 'warning' : 'note';
  const title = plain(m[2]) || (type === 'warning' ? 'Lưu ý' : 'Mẹo');
  return { type, title, content: plain(lines.slice(1).join(' ')) };
}

/**
 * Chuyển markdown thành {meta, sections}.
 * `# H1` được coi là tiêu đề bài và đi vào meta.title, không thành section.
 */
export function parseMarkdown(text = '') {
  const { meta, body } = parseFrontmatter(text);
  const sections = [];
  let seenProse = false;

  for (const block of splitBlocks(body)) {
    const lines = block.split('\n');

    // Chỉ thị :::
    const directive = parseDirective(block);
    if (directive) { sections.push(directive); continue; }

    // Alert → note / warning
    if (block.startsWith('>')) {
      const alert = parseAlert(block);
      if (alert) { sections.push(alert); continue; }
      const content = plain(lines.map((l) => l.replace(/^>\s?/, '')).join(' '));
      if (content) sections.push({ type: 'quote', content });
      continue;
    }

    // Tiêu đề
    const h = /^(#{1,3})\s+(.*)$/.exec(lines[0]);
    if (h) {
      const level = h[1].length;
      const textValue = plain(h[2]);
      if (level === 1) {
        if (!meta.title) meta.title = textValue;
      } else {
        sections.push({ type: 'heading', level, text: textValue });
        seenProse = true;
      }
      // Phần còn lại của khối (nếu có) xử lý như đoạn văn.
      const rest = plain(lines.slice(1).join(' '));
      if (rest) { sections.push({ type: 'paragraph', content: rest }); }
      continue;
    }

    // Bảng → example
    if (lines[0].trim().startsWith('|')) {
      const items = parseTable(lines);
      if (items && items.length) { sections.push({ type: 'example', items }); continue; }
    }

    // Danh sách đánh số → steps
    if (/^\d+[.)]\s+/.test(lines[0])) {
      const items = lines
        .filter((l) => /^\d+[.)]\s+/.test(l.trim()))
        .map((l, i) => splitStep(l.replace(/^\s*\d+[.)]\s+/, ''), i));
      if (items.length) { sections.push({ type: 'steps', items }); continue; }
    }

    // Danh sách gạch đầu dòng → list
    if (/^[-*+]\s+/.test(lines[0])) {
      const items = lines
        .filter((l) => /^\s*[-*+]\s+/.test(l))
        .map((l) => plain(l.replace(/^\s*[-*+]\s+/, '')));
      if (items.length) { sections.push({ type: 'list', items }); continue; }
    }

    // Còn lại là văn xuôi. Đoạn đầu tiên trước mọi tiêu đề là intro.
    const content = plain(lines.join(' '));
    if (!content) continue;
    sections.push({ type: seenProse ? 'paragraph' : 'intro', content });
    seenProse = true;
  }

  return { meta, sections };
}
