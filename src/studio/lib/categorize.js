/**
 * Đoán chuyên mục từ nội dung bài, bằng đối chiếu từ khoá.
 *
 * Cố tình KHÔNG gọi model: kết quả phải lặp lại được, không tốn tiền, chạy
 * offline, và người dùng đang nhìn bản xem thử ngay cạnh nên sửa lại mất hai
 * giây. Một lệnh gọi model ở đây mua rất ít mà thêm một thứ có thể hỏng.
 *
 * Trả về cả bảng điểm để giao diện nói được VÌ SAO nó chọn — đoán mà không
 * giải thích thì khi sai người ta không biết sửa từ đâu.
 */

import { CATEGORY_DEFINITIONS } from '../../content/categories/categoryMap.js';

/** Từ khoá theo id chuyên mục. Sửa ở đây, đừng rải vào logic. */
export const CATEGORY_KEYWORDS = {
  doc: ['visa', 'zairyu', '在留', 'thẻ cư trú', 'nyukan', '入管', 'xuất nhập cảnh', 'gia hạn',
        'vĩnh trú', 'nhập tịch', 'my number', 'mynumber', 'juminhyo', '住民票', 'thủ tục',
        'giấy tờ', 'đăng ký', 'shiyakusho', '市役所', 'khai báo', 'hộ chiếu'],
  work: ['thuế', '税', 'nenkin', '年金', 'hưu trí', 'lương', 'kyuyo', '給与', 'bảo hiểm xã hội',
         'shakai hoken', 'nisa', 'ideco', 'đầu tư', 'tiết kiệm', 'furusato', 'khấu trừ',
         'quyết toán', 'nenmatsu', 'thu nhập', 'tiền', 'phí', 'chi phí'],
  health: ['bảo hiểm y tế', 'kokumin kenko', '国民健康保険', 'bệnh viện', 'khám', 'thuốc',
           'tiêm', 'vắc', 'sức khoẻ', 'sức khỏe', 'cấp cứu', 'nha khoa', 'dịch', 'covid'],
  life: ['thuê nhà', 'hợp đồng nhà', 'reikin', '礼金', 'shikikin', '敷金', 'chuyển nhà',
         'điện', 'ga', 'nước', 'rác', 'internet', 'bằng lái', 'tàu', 'siêu thị', 'ngân hàng'],
  study: ['tiếng nhật', 'jlpt', 'du học', 'trường', 'học phí', 'học bổng', 'thi', 'kanji',
          'giáo trình', 'lớp học'],
  job: ['việc làm', 'tuyển dụng', 'xin việc', 'phỏng vấn', 'nghỉ việc', 'chuyển việc',
        'thất nghiệp', 'hellowork', 'tai nạn lao động', 'labor', 'hợp đồng lao động',
        'baito', 'làm thêm'],
  family: ['con', 'trẻ em', 'sinh con', 'mang thai', 'nhà trẻ', 'hoikuen', 'mẫu giáo',
           'trợ cấp trẻ', 'jidou teate', 'kết hôn', 'ly hôn', 'gia đình'],
  newcomer: ['mới sang', 'mới đến', 'lần đầu', 'vừa tới', 'nhập cảnh lần đầu', 'chuẩn bị sang'],
  tool: ['công cụ chotto', 'máy tính', 'mô phỏng'],
};

const VALID_IDS = new Set(CATEGORY_DEFINITIONS.map((c) => c.id));

/** Gom chữ đáng cân nhắc từ một bản ghi bài viết (hoặc bản nháp). */
export function collectText(article = {}) {
  const parts = [article.title, article.excerpt, ...(article.tags || [])];
  for (const s of article.sections || []) {
    parts.push(s.text, s.content, s.title, s.term, s.meaning);
    for (const item of s.items || []) {
      parts.push(typeof item === 'string' ? item : `${item.title || ''} ${item.text || ''} ${item.label || ''}`);
    }
  }
  return parts.filter(Boolean).join(' ').toLowerCase();
}

/**
 * Chấm điểm từng chuyên mục. Tiêu đề nặng gấp ba vì nó nói chủ đề rõ nhất.
 * Trả {category, scores, confident} — `confident` false khi hoà hoặc không
 * khớp gì, để giao diện nhắc người dùng tự chọn.
 */
export function suggestCategory(article = {}) {
  const body = collectText(article);
  const title = String(article.title || '').toLowerCase();

  const scores = {};
  for (const [id, words] of Object.entries(CATEGORY_KEYWORDS)) {
    if (!VALID_IDS.has(id)) continue;
    let score = 0;
    const hits = [];
    for (const w of words) {
      const lw = w.toLowerCase();
      if (title.includes(lw)) { score += 3; hits.push(w); continue; }
      if (body.includes(lw)) { score += 1; hits.push(w); }
    }
    scores[id] = { score, hits };
  }

  const ranked = Object.entries(scores).sort((a, b) => b[1].score - a[1].score);
  const [topId, top] = ranked[0] || ['doc', { score: 0, hits: [] }];
  const runnerUp = ranked[1]?.[1].score ?? 0;

  if (top.score === 0) {
    return { category: 'doc', scores, confident: false, reason: 'Không khớp từ khoá nào — mặc định "doc", hãy tự chọn' };
  }
  if (top.score === runnerUp) {
    return { category: topId, scores, confident: false, reason: `Hoà điểm với chuyên mục khác — hãy kiểm lại` };
  }
  return {
    category: topId,
    scores,
    confident: true,
    reason: `Khớp: ${top.hits.slice(0, 4).join(', ')}`,
  };
}
