/**
 * Newsroom — danh sách nguồn tin.
 *
 * Nguyên tắc chọn nguồn, theo đúng trust governance của validate-content.mjs:
 *
 *   1. Ưu tiên nguồn gốc (cơ quan ban hành) hơn báo chí đưa lại. Một thông báo
 *      của 入管庁 là nguồn `official`; NHK viết về thông báo đó là `media` và
 *      chỉ dùng để *phát hiện* tin, không dùng làm căn cứ số liệu.
 *   2. Chỉ HTTPS. validate-content.mjs đã từ chối nguồn http, nên tin lấy về
 *      cũng theo chuẩn đó.
 *   3. Không lấy nguyên văn. Pipeline chỉ giữ tiêu đề + link + ngày để xếp
 *      hạng; phần viết lại là việc của bước draft.
 *
 * CẢNH BÁO: các URL feed dưới đây CHƯA được kiểm chứng sống — môi trường dựng
 * pipeline bị chặn outbound nên không gọi thử được. Lần chạy workflow đầu tiên
 * sẽ báo nguồn nào chết (fetch.mjs log rõ từng nguồn). Sửa ở đây, không sửa rải
 * rác trong code.
 */

/** Kiểu nguồn — khớp với `type` mà validate-content.mjs chấp nhận cho sources. */
export const SOURCE_KIND = {
  OFFICIAL: 'official', // cơ quan nhà nước Nhật
  MEDIA: 'media',       // báo, đài
};

export const SOURCES = [
  // --- Cơ quan nhà nước: căn cứ chính thức -------------------------------
  {
    id: 'isa-news',
    organization: 'Cơ quan Quản lý Xuất nhập cảnh và Lưu trú (出入国在留管理庁)',
    kind: SOURCE_KIND.OFFICIAL,
    // Đường dẫn sâu /isa/news/index.html trả 404 ở lần chạy thật đầu tiên.
    // Trang gốc ổn định hơn nhiều, và parseNoticeList tự nhặt link từ đó.
    url: 'https://www.moj.go.jp/isa/',
    format: 'html',
    lang: 'ja',
    // Chủ đề mà nguồn này gần như luôn thuộc về → cộng điểm khi xếp hạng.
    topicHints: ['doc', 'newcomer'],
    weight: 1.0,
  },
  {
    id: 'mhlw-news',
    organization: 'Bộ Y tế, Lao động và Phúc lợi (厚生労働省)',
    kind: SOURCE_KIND.OFFICIAL,
    // /stf/news.html cũng trả 404. Dùng trang gốc, như isa-news.
    url: 'https://www.mhlw.go.jp/index.html',
    format: 'html',
    lang: 'ja',
    topicHints: ['work', 'health', 'job'],
    weight: 1.0,
  },
  {
    id: 'nta-news',
    organization: 'Tổng cục Thuế quốc gia (国税庁)',
    kind: SOURCE_KIND.OFFICIAL,
    url: 'https://www.nta.go.jp/information/index.htm',
    format: 'html',
    lang: 'ja',
    topicHints: ['work'],
    weight: 1.0,
  },
  {
    id: 'nenkin-news',
    organization: 'Cơ quan Hưu trí Nhật Bản (日本年金機構)',
    kind: SOURCE_KIND.OFFICIAL,
    url: 'https://www.nenkin.go.jp/oshirase/index.html',
    format: 'html',
    lang: 'ja',
    topicHints: ['work', 'health'],
    weight: 1.0,
  },

  // --- Báo chí: dùng để PHÁT HIỆN tin, không làm căn cứ -------------------
  {
    id: 'nhk-news',
    organization: 'NHK',
    kind: SOURCE_KIND.MEDIA,
    url: 'https://www.nhk.or.jp/rss/news/cat0.xml',
    format: 'rss',
    lang: 'ja',
    topicHints: [],
    weight: 0.6,
  },
  {
    id: 'japan-times',
    organization: 'The Japan Times',
    kind: SOURCE_KIND.MEDIA,
    url: 'https://www.japantimes.co.jp/feed/',
    format: 'rss',
    lang: 'en',
    topicHints: [],
    weight: 0.5,
  },
];

export function getSourceById(id) {
  return SOURCES.find((s) => s.id === id) || null;
}

export function getOfficialSources() {
  return SOURCES.filter((s) => s.kind === SOURCE_KIND.OFFICIAL);
}
