/**
 * Đọc một object literal JavaScript mà KHÔNG chạy nó.
 *
 * Vì sao không dùng `new Function('return ' + src)` cho nhanh: nội dung dán vào
 * studio đến từ AI agent, và AI agent thì đọc trang web bên ngoài. Một trang
 * nguồn có thể chèn chỉ thị vào output của model — đó không phải giả thuyết,
 * chính repo này đã gỡ một pipeline có đúng bề mặt tấn công ấy. Dán một chuỗi
 * rồi cho nó chạy trong trang có quyền gọi endpoint ghi file là mở cửa hẳn.
 *
 * Nên: parser đệ quy chỉ chấp nhận DỮ LIỆU — object, mảng, chuỗi, số, boolean,
 * null. Gặp lời gọi hàm, biến, toán tử hay template literal thì ném lỗi kèm vị
 * trí. Không có đường nào để một chuỗi dán vào trở thành code chạy được.
 */

class LiteralError extends Error {
  constructor(message, index) {
    super(index == null ? message : `${message} (vị trí ${index})`);
    this.name = 'LiteralError';
    this.index = index;
  }
}

export { LiteralError };

/**
 * Cắt phần `export const X = ` ở đầu và `;` ở cuối, trả về đúng phần literal.
 * Chấp nhận cả `export default {...}` lẫn object trần.
 */
export function stripModuleWrapper(source = '') {
  let s = source.trim();

  // Bỏ chú thích ở đầu file trước đã. File do chính studio sinh ra mở đầu bằng
  // khối /** ... */, nên thiếu bước này thì studio không đọc lại được file của
  // chính nó — test vòng sinh–đọc đã bắt đúng lỗi đó.
  for (;;) {
    if (s.startsWith('//')) {
      const nl = s.indexOf('\n');
      if (nl === -1) return '';
      s = s.slice(nl + 1).trimStart();
      continue;
    }
    if (s.startsWith('/*')) {
      const end = s.indexOf('*/');
      if (end === -1) return '';
      s = s.slice(end + 2).trimStart();
      continue;
    }
    break;
  }

  s = s.replace(/^export\s+default\s+/, '');
  s = s.replace(/^export\s+(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*/, '');
  s = s.replace(/^(?:const|let|var)\s+[A-Za-z_$][\w$]*\s*=\s*/, '');
  s = s.replace(/;\s*$/, '');
  return s.trim();
}

export function parseLiteral(source) {
  const src = stripModuleWrapper(source);
  const p = { s: src, i: 0 };
  skipTrivia(p);
  const value = parseValue(p);
  skipTrivia(p);
  if (p.i < p.s.length) {
    throw new LiteralError('Còn ký tự thừa sau giá trị', p.i);
  }
  return value;
}

function skipTrivia(p) {
  for (;;) {
    const c = p.s[p.i];
    if (c === undefined) return;
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') { p.i++; continue; }
    if (c === '/' && p.s[p.i + 1] === '/') {
      while (p.i < p.s.length && p.s[p.i] !== '\n') p.i++;
      continue;
    }
    if (c === '/' && p.s[p.i + 1] === '*') {
      const end = p.s.indexOf('*/', p.i + 2);
      if (end === -1) throw new LiteralError('Comment /* không đóng', p.i);
      p.i = end + 2;
      continue;
    }
    return;
  }
}

function parseValue(p) {
  skipTrivia(p);
  const c = p.s[p.i];
  if (c === undefined) throw new LiteralError('Hết chuỗi khi đang chờ một giá trị', p.i);
  if (c === '{') return parseObject(p);
  if (c === '[') return parseArray(p);
  if (c === '"' || c === "'") return parseString(p);
  if (c === '`') {
    throw new LiteralError('Template literal không được chấp nhận — dùng chuỗi thường', p.i);
  }
  if (c === '-' || (c >= '0' && c <= '9')) return parseNumber(p);

  if (p.s.startsWith('true', p.i)) { p.i += 4; return true; }
  if (p.s.startsWith('false', p.i)) { p.i += 5; return false; }
  if (p.s.startsWith('null', p.i)) { p.i += 4; return null; }

  throw new LiteralError(
    'Chỉ chấp nhận dữ liệu thuần (object, mảng, chuỗi, số, boolean, null)',
    p.i
  );
}

function parseObject(p) {
  p.i++; // {
  const out = {};
  skipTrivia(p);
  if (p.s[p.i] === '}') { p.i++; return out; }
  for (;;) {
    skipTrivia(p);
    const key = parseKey(p);
    skipTrivia(p);
    if (p.s[p.i] !== ':') throw new LiteralError(`Thiếu ":" sau khoá "${key}"`, p.i);
    p.i++;
    out[key] = parseValue(p);
    skipTrivia(p);
    if (p.s[p.i] === ',') { p.i++; skipTrivia(p); if (p.s[p.i] === '}') { p.i++; return out; } continue; }
    if (p.s[p.i] === '}') { p.i++; return out; }
    throw new LiteralError('Thiếu "," hoặc "}" trong object', p.i);
  }
}

function parseKey(p) {
  const c = p.s[p.i];
  if (c === '"' || c === "'") return parseString(p);
  const m = /^[A-Za-z_$][\w$]*/.exec(p.s.slice(p.i));
  if (!m) throw new LiteralError('Khoá không hợp lệ', p.i);
  p.i += m[0].length;
  return m[0];
}

function parseArray(p) {
  p.i++; // [
  const out = [];
  skipTrivia(p);
  if (p.s[p.i] === ']') { p.i++; return out; }
  for (;;) {
    out.push(parseValue(p));
    skipTrivia(p);
    if (p.s[p.i] === ',') { p.i++; skipTrivia(p); if (p.s[p.i] === ']') { p.i++; return out; } continue; }
    if (p.s[p.i] === ']') { p.i++; return out; }
    throw new LiteralError('Thiếu "," hoặc "]" trong mảng', p.i);
  }
}

const ESCAPES = { n: '\n', t: '\t', r: '\r', b: '\b', f: '\f', v: '\v', 0: '\0' };

function parseString(p) {
  const quote = p.s[p.i];
  p.i++;
  let out = '';
  for (;;) {
    const c = p.s[p.i];
    if (c === undefined) throw new LiteralError('Chuỗi không đóng', p.i);
    if (c === quote) { p.i++; return out; }
    if (c === '\\') {
      const e = p.s[p.i + 1];
      if (e === 'u') {
        const hex = p.s.slice(p.i + 2, p.i + 6);
        if (!/^[0-9a-fA-F]{4}$/.test(hex)) throw new LiteralError('Escape \\u hỏng', p.i);
        out += String.fromCharCode(parseInt(hex, 16));
        p.i += 6;
        continue;
      }
      // Xuống dòng sau dấu \ là nối dòng, không phải ký tự.
      if (e === '\n') { p.i += 2; continue; }
      out += Object.prototype.hasOwnProperty.call(ESCAPES, e) ? ESCAPES[e] : e;
      p.i += 2;
      continue;
    }
    out += c;
    p.i++;
  }
}

function parseNumber(p) {
  const m = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?/.exec(p.s.slice(p.i));
  if (!m) throw new LiteralError('Số không hợp lệ', p.i);
  p.i += m[0].length;
  return Number(m[0]);
}
