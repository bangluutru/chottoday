import { getToolioUrl } from '../../config/constants';

export const articleLostZairyu = {
  id: 'lost-zairyu',
  slug: 'mat-the-zairyu-thi-lam-gi',
  title: 'Mất thẻ cư trú (Zairyu Card) thì làm gì?',
  excerpt: 'Quy trình 3 bước xử lý khi đánh rơi hoặc làm mất thẻ cư trú tại Nhật: báo cảnh sát, chuẩn bị ảnh thẻ và xin cấp lại tại Nyukan trong vòng 14 ngày.',
  category: 'doc',
  tags: ['Thẻ cư trú', 'Visa & Nyukan', 'Shiyakusho', 'Hành chính'],
  publishedAt: '2026-09-12',
  updatedAt: '2026-09-17',
  readingTime: 5,
  coverImage: '/images/hero-everyday-japan.jpg',
  author: {
    name: 'Chotto Editorial Team',
    role: 'Hướng dẫn thủ tục pháp lý & cư trú',
  },
  sections: [
    {
      type: 'intro',
      content: 'Thẻ cư trú (在留カード - Zairyu Card) là giấy tờ tùy thân quan trọng nhất của người nước ngoài tại Nhật Bản. Theo Điều 71-2 của Luật Quản lý Xuất nhập cảnh, nếu bạn làm mất thẻ do đánh rơi, bị trộm cắp hoặc hư hỏng, bạn có nghĩa vụ pháp lý phải làm thủ tục xin cấp lại trong vòng 14 ngày kể từ ngày phát hiện sự việc.',
    },
    {
      type: 'heading',
      level: 2,
      text: '1. Quy trình 3 bước làm lại thẻ cư trú',
    },
    {
      type: 'steps',
      items: [
        {
          stepNumber: 1,
          title: 'Đến ngay đồn cảnh sát (Koban) gần nhất báo mất',
          text: 'Vào đồn cảnh sát gần nơi bạn đánh rơi hoặc nơi bạn sinh sống, khai báo tường trình việc mất thẻ. Cảnh sát sẽ ghi nhận và cấp cho bạn "Giấy chứng nhận báo mất đồ" (遺失届出証明書 - Ishitsu Todokede Shomeisho) hoặc mã số thụ lý hồ sơ (Juri Bango). Bạn bắt buộc phải có giấy tờ này để nộp cho Cục Nyukan.',
        },
        {
          stepNumber: 2,
          title: 'Chuẩn bị hồ sơ và ảnh thẻ 3x4cm',
          text: 'Chuẩn bị hộ chiếu gốc còn hạn, đơn xin cấp lại thẻ cư trú (có thể tải trên trang ISA hoặc lấy trực tiếp tại quầy Nyukan) và 1 ảnh thẻ cỡ 3cm × 4cm chụp trong vòng 3 tháng, nền trắng không đội mũ.',
        },
        {
          stepNumber: 3,
          title: 'Trực tiếp đến Cục Quản lý Xuất nhập cảnh (Nyukan)',
          text: 'Đến cục Nyukan có thẩm quyền tại khu vực của bạn (ví dụ tại Tokyo là Nyukan Shinagawa hoặc Tachikawa). Nộp hồ sơ tại quầy cấp lại thẻ. Thông thường bạn sẽ được in và nhận thẻ Zairyu mới ngay trong ngày (khoảng 1–2 tiếng chờ đợi).',
        },
      ],
    },
    {
      type: 'term',
      term: '遺失届出証明書（いしつとどけでしょうめいしょ）',
      reading: 'Ishitsu Todokede Shōmeisho',
      meaning: 'Giấy chứng nhận báo mất đồ do cơ quan Cảnh sát Nhật Bản cấp khi bạn trình báo bị mất tài sản.',
    },
    {
      type: 'note',
      title: 'Lệ phí làm lại thẻ cư trú',
      content: 'Thủ tục cấp lại thẻ cư trú do bị mất hoặc bị hư hại tại Nyukan là **hoàn toàn miễn phí** (không mất tiền tem doanh thu 収入印紙). Bạn chỉ tốn chi phí chụp ảnh thẻ và chi phí đi lại.',
    },
    {
      type: 'warning',
      title: 'Hậu quả nếu để quá hạn 14 ngày không trình báo',
      content: 'Luật pháp Nhật Bản quy định nếu người nước ngoài không thực hiện việc xin cấp lại thẻ cư trú trong vòng 14 ngày mà không có lý do chính đáng, có thể bị phạt hành chính lên tới 200,000 yên. Đặc biệt, việc này sẽ bị lưu lại trong hồ sơ xuất nhập cảnh, gây bất lợi lớn khi bạn xin gia hạn visa hoặc xin tư cách vĩnh trú (Eiju) sau này.',
    },
    {
      type: 'heading',
      level: 2,
      text: '2. Cần chuẩn bị ảnh thẻ như thế nào?',
    },
    {
      type: 'paragraph',
      content: 'Ảnh thẻ dùng cho hồ sơ Nyukan phải chuẩn kích thước 3cm x 4cm, nền trơn sáng màu (tốt nhất là nền trắng), rõ khuôn mặt, không đeo kính râm và không bị bóng lóa. Nếu bạn không tiện ra bốt chụp ảnh tự động ngoài ga (chi phí 800–1000¥), bạn có thể dùng điện thoại chụp tại nhà và ra combini in với giá chỉ 200¥.',
    },
    {
      type: 'toolCTA',
      toolId: 'id-photo-studio',
      icon: '📸',
      title: 'Tạo ảnh thẻ chuẩn hồ sơ Nyukan bằng điện thoại',
      description: 'Chụp bằng điện thoại, tự động căn chỉnh tỷ lệ 3x4cm đúng chuẩn Cục Xuất Nhập Cảnh và xuất file sẵn sàng in tại 7-Eleven / FamilyMart với giá 200¥.',
      ctaText: 'Tạo ảnh thẻ ngay',
      ctaUrl: getToolioUrl('/#/id-photo-studio'),
      note: 'Xử lý hoàn toàn trên trình duyệt · Không gửi ảnh lên server · An toàn tuyệt đối',
      badge: 'Mở trong Toolio',
    },
    {
      type: 'sources',
      items: [
        {
          title: 'Thủ tục xin cấp lại thẻ cư trú do mất mát hoặc hư hỏng (Điều 19-10)',
          publisher: 'Cục Quản lý Xuất nhập cảnh và Lưu trú Nhật Bản (Immigration Services Agency)',
          url: 'https://www.moj.go.jp/isa',
        },
      ],
    },
  ],
  relatedArticles: [
    {
      slug: 'gia-han-visa-ky-su-truoc-3-thang',
      title: 'Gia hạn visa kỹ sư trước 3 tháng: Thủ tục và giấy tờ công ty cần cấp',
      readingTime: 6,
      category: 'doc',
    },
    {
      slug: 'luong-30-man-thuc-nhan-bao-nhieu',
      title: 'Lương 30 man thực nhận bao nhiêu?',
      readingTime: 6,
      category: 'work',
    },
    {
      slug: 'mau-cau-tieng-nhat-shiyakusho-buu-dien',
      title: 'Mẫu câu tiếng Nhật thường gặp khi gọi điện lên Shiyakusho và bưu điện',
      readingTime: 5,
      category: 'study',
    },
  ],
  relatedTools: [
    {
      id: 'id-photo-studio',
      name: 'Tạo ảnh thẻ chuẩn hồ sơ Nhật',
      description: 'Tự chụp bằng điện thoại, xuất ảnh in combini 200¥ đúng chuẩn 3x4cm.',
      url: getToolioUrl('/#/id-photo-studio'),
    },
  ],
};
