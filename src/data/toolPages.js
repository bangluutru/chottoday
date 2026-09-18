/**
 * PAGE CONTENT FOR CHOTTO-HOSTED TOOLS (/tools/:slug)
 *
 * Copy only: the hero, the explainer cards, the FAQ and the sidebar picks for
 * each calculator ChottoDay renders itself. Keyed by the catalogue slug in
 * `src/data/tools.js`; the calculator itself lives in
 * `src/services/toolCalculators/`.
 *
 * Sidebar links carry slugs, never titles — related tool names resolve through
 * the Toolio registry and article titles through the content layer, so nothing
 * here can go stale against them.
 */

export const TOOL_PAGES = {
  'luong-thuc-nhan': {
    badges: [
      { label: 'Tiền & Thuế', tint: 'study' },
      { label: 'Cập nhật 04/2026', tint: 'life' },
    ],
    badgeNote: 'Không lưu dữ liệu của bạn',
    headline: {
      before: 'Lương của bạn ',
      accent: 'thực nhận',
      after: ' bao nhiêu?',
    },
    intro:
      'Nhập lương trước thuế và một vài thông tin cơ bản, Chotto sẽ ước tính tiền về tay mỗi tháng cùng các khoản bị trừ: bảo hiểm xã hội, thuế thu nhập và thuế thị dân.',
    handNote: ['Biết trước con số,', 'dễ lên kế hoạch hơn ☺'],
    disclaimer:
      'Kết quả chỉ mang tính ước tính theo mức phổ biến năm 2026. Con số thực tế phụ thuộc vào công ty, loại bảo hiểm và các khoản khấu trừ riêng của bạn.',
    explainer: {
      title: 'Công cụ này tính như thế nào?',
      intro:
        'Lương ghi trong hợp đồng là số trước thuế. Trước khi tiền về tay bạn, công ty sẽ trừ lần lượt bảo hiểm xã hội, thuế thu nhập quốc gia và thuế thị dân của địa phương bạn sống.',
      steps: [
        {
          tint: 'tool',
          title: '1. Bảo hiểm xã hội',
          body: 'Bảo hiểm y tế, nenkin và bảo hiểm lao động, khoảng 14–15% lương và công ty đóng một nửa.',
        },
        {
          tint: 'study',
          title: '2. Thuế thu nhập',
          body: 'Tính theo bậc lũy tiến 5–45% sau khi trừ các khoản khấu trừ và người phụ thuộc.',
        },
        {
          tint: 'work',
          title: '3. Thuế thị dân',
          body: 'Khoảng 10% thu nhập chịu thuế của năm trước, nộp cho tỉnh và thành phố bạn sống.',
        },
      ],
    },
    faqs: [
      {
        q: 'Vì sao số của tôi khác con số ở đây?',
        a: 'Mỗi công ty áp dụng phụ cấp, loại bảo hiểm và các khoản khấu trừ khác nhau. Công cụ dùng mức phổ biến nhất nên kết quả thường lệch 3–5% so với bảng lương thật.',
      },
      {
        q: 'Người phụ thuộc ảnh hưởng thế nào?',
        a: 'Mỗi người phụ thuộc được khấu trừ thêm khỏi thu nhập chịu thuế, nên thuế thu nhập và thuế thị dân đều giảm. Người thân ở Việt Nam vẫn có thể khai nếu bạn chứng minh được việc gửi tiền.',
      },
      {
        q: 'Năm đầu sang Nhật có phải nộp thuế thị dân?',
        a: 'Thường là không. Thuế thị dân tính trên thu nhập của năm trước, nên năm đầu tiên bạn thường chưa bị trừ khoản này và tiền thực nhận sẽ cao hơn kết quả ở đây.',
      },
      {
        q: 'Chotto có lưu thông tin tôi nhập không?',
        a: 'Không. Mọi phép tính chạy ngay trên máy của bạn, Chotto không gửi hay lưu bất kỳ con số nào.',
      },
    ],
    relatedToolSlugs: ['tinh-nenkin', 'bao-hiem-xa-hoi', 'mo-phong-thue-nhat-ban'],
    relatedArticles: [
      {
        slug: 'luong-30-man-thuc-nhan-bao-nhieu',
        image: '/images/featured/salary-30man.jpg',
      },
      {
        slug: 'khai-thue-cuoi-nam-gui-tien-ve-nha',
        image: '/images/featured/nenkin-tool.jpg',
      },
      {
        slug: 'bao-hiem-y-te-quoc-dan-giam-phi',
        image: '/images/thumbs/thumb-clinic.jpg',
      },
    ],
    feedbackNote: ['Con số chưa đúng', 'với bảng lương của bạn?'],
    seo: {
      title: 'Tính lương thực nhận tại Nhật',
      description:
        'Nhập lương trước thuế để ước tính tiền thực nhận mỗi tháng tại Nhật, cùng bảo hiểm xã hội, thuế thu nhập và thuế thị dân bị trừ. Miễn phí, tính ngay trên máy bạn.',
    },
  },
};

export function getToolPage(slug) {
  return TOOL_PAGES[slug] || null;
}
