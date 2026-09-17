import { getToolioUrl } from '../../config/constants';
import { articleSalary30Man } from './salary-30man';
import { articleLostZairyu } from './lost-zairyu';

export const ALL_ARTICLES = [
  articleSalary30Man,
  articleLostZairyu,
  {
    id: 'thue-nha-hop-dong',
    slug: 'hop-dong-thue-nha-nhat-ban',
    title: 'Hợp đồng thuê nhà ở Nhật: Những khoản tiền không lấy lại được',
    excerpt: 'Tiền lễ (reikin), tiền cọc (shikikin), phí đổi chìa khóa và bảo hiểm hỏa hoạn: khoản nào bắt buộc và khoản nào có thể thương lượng.',
    category: 'life',
    tags: ['Thuê nhà', 'Hợp đồng', 'Rác & Vứt đồ'],
    publishedAt: '2026-09-08',
    updatedAt: '2026-09-15',
    readingTime: 7,
    coverImage: '/images/hero-everyday-japan.jpg',
    author: { name: 'Chotto Editorial Team' },
    sections: [
      {
        type: 'intro',
        content: 'Thuê nhà tại Nhật Bản là một trong những rào cản lớn nhất đối với người nước ngoài. Bên cạnh tiền thuê nhà hàng tháng, chi phí ban đầu (Shoki Hiyo) thường gấp 3 đến 5 lần tiền nhà.',
      },
      {
        type: 'heading',
        level: 2,
        text: '1. Phân biệt các khoản tiền đầu vào khi ký hợp đồng',
      },
      {
        type: 'list',
        items: [
          'Tiền lễ (礼金 - Reikin): Tiền biếu chủ nhà để cảm ơn, hoàn toàn không được hoàn trả.',
          'Tiền cọc (敷金 - Shikikin): Tiền thế chân bảo đảm, sau khi trừ tiền dọn dẹp vệ sinh khi trả nhà sẽ được hoàn lại phần dư.',
          'Phí công ty bảo lãnh (Hoshonin-gaisha): Bắt buộc với hầu hết người nước ngoài không có người Nhật bảo lãnh.',
          'Bảo hiểm hỏa hoạn (Kasai Hoken): Bắt buộc mua trong suốt thời hạn thuê 2 năm.',
        ],
      },
      {
        type: 'term',
        term: '敷金（しききん） và 礼金（れいきん）',
        reading: 'Shikikin & Reikin',
        meaning: 'Tiền đặt cọc (có thể hoàn trả một phần) và Tiền lễ (mất đứt không hoàn lại).',
      },
      {
        type: 'note',
        title: 'Mẹo đàm phán hợp đồng',
        content: 'Bạn hoàn toàn có thể yêu cầu công ty bất động sản tìm những căn hộ "Zero-Zero" (0 tiền cọc, 0 tiền lễ) hoặc đàm phán xin miễn phí tháng đầu tiên (Free Rent) vào mùa thấp điểm.',
      },
    ],
    relatedArticles: [
      { slug: 'doi-bang-lai-xe-viet-nhat', title: 'Đổi bằng lái xe Việt Nam sang bằng Nhật Bản (Gaimen Kirikae)', readingTime: 6, category: 'life' },
      { slug: 'luong-30-man-thuc-nhan-bao-nhieu', title: 'Lương 30 man thực nhận bao nhiêu?', readingTime: 6, category: 'work' },
    ],
    relatedTools: [
      { id: 'japan-tax-simulator', name: 'Mô phỏng Thuế thu nhập & Thị dân', url: getToolioUrl('/#/japan-tax-simulator') },
    ],
  },
  {
    id: 'doi-bang-lai',
    slug: 'doi-bang-lai-xe-viet-nhat',
    title: 'Đổi bằng lái xe Việt Nam sang bằng Nhật Bản (Gaimen Kirikae)',
    excerpt: 'Điều kiện 3 tháng lái xe tại Việt Nam, thủ tục dịch thuật bằng tại JAF và quy trình thi lý thuyết 10 câu bằng tiếng Việt.',
    category: 'life',
    tags: ['Bằng lái xe', 'Hành chính', 'Đời sống'],
    publishedAt: '2026-09-05',
    updatedAt: '2026-09-14',
    readingTime: 6,
    coverImage: '/images/hero-everyday-japan.jpg',
    author: { name: 'Chotto Editorial Team' },
    sections: [
      {
        type: 'intro',
        content: 'Thủ tục Gaimen Kirikae (外免切替) cho phép người có bằng lái xe ô tô tại Việt Nam chuyển đổi sang bằng lái xe Nhật Bản mà không cần phải học lại từ đầu tại trường dạy lái xe với chi phí 30 man yên.',
      },
      {
        type: 'heading',
        level: 2,
        text: '1. Điều kiện tiên quyết để được đổi bằng',
      },
      {
        type: 'warning',
        title: 'Quy tắc 3 tháng lưu trú tại Việt Nam sau ngày cấp bằng',
        content: 'Bạn bắt buộc phải chứng minh đã ở Việt Nam tổng cộng ít nhất 90 ngày sau khi bằng lái có hiệu lực. Bằng chứng thường là dấu xuất nhập cảnh trên hộ chiếu hoặc giấy chứng nhận di trú.',
      },
      {
        type: 'steps',
        items: [
          { stepNumber: 1, title: 'Dịch thuật bằng lái xe tại JAF', text: 'Gửi bản photo bằng lái xe đến Liên đoàn Ô tô Nhật Bản (JAF) để lấy bản dịch thuật công chứng tiếng Nhật (phí khoảng 4,000¥).' },
          { stepNumber: 2, title: 'Chuẩn bị ảnh thẻ và hồ sơ', text: 'Chụp ảnh thẻ cỡ 3cm x 2.4cm chuẩn hồ sơ thi bằng lái xe tại Nhật.' },
          { stepNumber: 3, title: 'Thi lý thuyết 10 câu', text: 'Bạn có thể chọn thi bằng tiếng Việt, trả lời đúng 7/10 câu là đạt phần lý thuyết để bước sang bài thi thực hành sân bãi.' },
        ],
      },
      {
        type: 'toolCTA',
        toolId: 'id-photo-studio',
        icon: '📸',
        title: 'Chuẩn bị ảnh thẻ đổi bằng lái xe tiện lợi',
        description: 'Chụp ảnh bằng điện thoại, tự động xuất file đúng kích cỡ nộp trung tâm sát hạch lái xe Menkyo Center.',
        ctaText: 'Tạo ảnh thẻ ngay',
        ctaUrl: getToolioUrl('/#/id-photo-studio'),
        note: 'In tại mọi combini 7-Eleven / FamilyMart 200¥',
        badge: 'Mở trong Toolio',
      },
    ],
    relatedArticles: [
      { slug: 'hop-dong-thue-nha-nhat-ban', title: 'Hợp đồng thuê nhà ở Nhật: Những khoản tiền không lấy lại được', readingTime: 7, category: 'life' },
    ],
    relatedTools: [
      { id: 'id-photo-studio', name: 'Tạo ảnh thẻ chuẩn hồ sơ Nhật', url: getToolioUrl('/#/id-photo-studio') },
    ],
  },
  {
    id: 'gia-han-visa-3-thang',
    slug: 'gia-han-visa-ky-su-truoc-3-thang',
    title: 'Gia hạn visa kỹ sư trước 3 tháng: Thủ tục và giấy tờ công ty cần cấp',
    excerpt: 'Cục xuất nhập cảnh cho phép nộp đơn gia hạn trước ngày hết hạn 3 tháng. Đây là danh sách giấy tờ bạn tự chuẩn bị và giấy tờ xin từ bộ phận nhân sự.',
    category: 'doc',
    tags: ['Visa & Nyukan', 'Thẻ cư trú', 'Hành chính'],
    publishedAt: '2026-09-02',
    updatedAt: '2026-09-14',
    readingTime: 6,
    coverImage: '/images/hero-everyday-japan.jpg',
    author: { name: 'Chotto Editorial Team' },
    sections: [
      {
        type: 'intro',
        content: 'Bạn hoàn toàn có quyền nộp đơn xin gia hạn thời hạn lưu trú (在留期間更新許可申請) tại Cục Quản lý Xuất nhập cảnh (Nyukan) trước ngày hết hạn visa tối đa 3 tháng.',
      },
      {
        type: 'heading',
        level: 2,
        text: '1. Danh mục giấy tờ cần nộp',
      },
      {
        type: 'list',
        items: [
          'Đơn xin gia hạn tư cách lưu trú (mẫu Kỹ sư / Trí thức nhân văn / Quốc tế).',
          'Ảnh thẻ 3cm × 4cm chụp trong vòng 3 tháng gần nhất.',
          'Hộ chiếu và thẻ cư trú Zairyu bản gốc.',
          'Giấy chứng nhận đang làm việc (在職証明書 - Zaishoku Shomeisho) do công ty cấp.',
          'Giấy nộp thuế và chứng nhận thuế thị dân (Nozei Shomeisho & Kazei Shomeisho) xin tại Shiyakusho.',
        ],
      },
    ],
    relatedArticles: [
      { slug: 'mat-the-zairyu-thi-lam-gi', title: 'Mất thẻ cư trú (Zairyu Card) thì làm gì?', readingTime: 5, category: 'doc' },
    ],
    relatedTools: [
      { id: 'id-photo-studio', name: 'Tạo ảnh thẻ chuẩn hồ sơ Nhật', url: getToolioUrl('/#/id-photo-studio') },
    ],
  },
  {
    id: 'khai-thue-cuoi-nam',
    slug: 'khai-thue-cuoi-nam-gui-tien-ve-nha',
    title: 'Hướng dẫn khai thuế cuối năm (Nenmatsu Chosei) cho người gửi tiền về nhà',
    excerpt: 'Quy định mới về chứng minh chuyển tiền riêng biệt cho từng người thân và các kênh chuyển tiền kiều hối được cục thuế chấp thuận.',
    category: 'work',
    tags: ['Khai thuế', 'Thuế thu nhập', 'Chuyển tiền', 'Lương thực nhận'],
    publishedAt: '2026-08-28',
    updatedAt: '2026-09-12',
    readingTime: 5,
    coverImage: '/images/hero-everyday-japan.jpg',
    author: { name: 'Chotto Editorial Team' },
    sections: [
      {
        type: 'intro',
        content: 'Vào tháng 11 hàng năm, các công ty tại Nhật Bản sẽ phát tờ khai điều chỉnh thuế cuối năm (年末調整 - Nenmatsu Chosei). Đây là cơ hội vàng để người lao động nước ngoài nhận lại tiền thuế đã nộp dư trong năm.',
      },
      {
        type: 'warning',
        title: 'Quy định chuyển tiền riêng biệt cho từng người phụ thuộc',
        content: 'Từ năm 2023, Cục Thuế yêu cầu với người phụ thuộc từ 30 đến 69 tuổi ở nước ngoài, bạn phải chứng minh chuyển tiền ít nhất 38 man yên/người/năm hoặc chuyển tiền định kỳ cho từng cá nhân đứng tên riêng, không được gộp chung.',
      },
      {
        type: 'toolCTA',
        toolId: 'japan-tax-simulator',
        icon: '🧮',
        title: 'Mô phỏng tiền hoàn thuế khi khai người phụ thuộc',
        description: 'Xem số tiền hoàn thuế thu nhập vào kỳ lương tháng 12 và số tiền thuế thị dân được giảm trong năm tiếp theo.',
        ctaText: 'Tính thử hoàn thuế',
        ctaUrl: getToolioUrl('/#/japan-tax-simulator'),
        note: 'Công cụ độc lập trên Toolio',
        badge: 'Mở trong Toolio',
      },
    ],
    relatedArticles: [
      { slug: 'luong-30-man-thuc-nhan-bao-nhieu', title: 'Lương 30 man thực nhận bao nhiêu?', readingTime: 6, category: 'work' },
    ],
    relatedTools: [
      { id: 'japan-tax-simulator', name: 'Mô phỏng Thuế thu nhập & Thị dân', url: getToolioUrl('/#/japan-tax-simulator') },
    ],
  },
  {
    id: 'giam-phi-bhyt',
    slug: 'bao-hiem-y-te-quoc-dan-giam-phi',
    title: 'Bảo hiểm y tế quốc dân (Kokumin Kenko Hoken) giảm phí khi thu nhập thấp',
    excerpt: 'Nếu bạn vừa thôi việc hoặc đang là du học sinh, bạn có thể xin giảm từ 20% đến 70% mức đóng tại văn phòng Shiyakusho.',
    category: 'health',
    tags: ['Bảo hiểm y tế', 'Khám bệnh', 'Shiyakusho'],
    publishedAt: '2026-08-20',
    updatedAt: '2026-09-13',
    readingTime: 4,
    coverImage: '/images/hero-everyday-japan.jpg',
    author: { name: 'Chotto Editorial Team' },
    sections: [
      {
        type: 'intro',
        content: 'Bảo hiểm Y tế Quốc dân (国民健康保険) được tính dựa trên thu nhập năm trước. Nếu bạn vừa thôi việc, mất nguồn thu hoặc thu nhập giảm sút nghiêm trọng, bạn hoàn toàn có thể xin miễn giảm hợp pháp.',
      },
      {
        type: 'note',
        title: 'Các mức giảm trừ',
        content: 'Tùy theo mức thu nhập quy định của từng quận/thành phố, bạn có thể được giảm 70%, 50% hoặc 20% tiền bảo hiểm hàng tháng.',
      },
    ],
    relatedArticles: [
      { slug: 'di-kham-benh-tu-vung-trieu-chung', title: 'Bảng từ vựng triệu chứng cơ thể khi đi khám bệnh tại Nhật', readingTime: 5, category: 'health' },
    ],
    relatedTools: [],
  },
  {
    id: 'tu-vung-kham-benh',
    slug: 'di-kham-benh-tu-vung-trieu-chung',
    title: 'Bảng từ vựng triệu chứng cơ thể khi đi khám bệnh tại Nhật',
    excerpt: 'Tổng hợp từ vựng và mẫu câu giao tiếp ngắn gọn, rõ ràng để mô tả tình trạng đau đầu, đau bụng, sốt và dị ứng khi gặp bác sĩ.',
    category: 'health',
    tags: ['Từ vựng y tế', 'Khám bệnh', 'Cấp cứu'],
    publishedAt: '2026-08-15',
    updatedAt: '2026-09-10',
    readingTime: 5,
    coverImage: '/images/hero-everyday-japan.jpg',
    author: { name: 'Chotto Editorial Team' },
    sections: [
      {
        type: 'intro',
        content: 'Khi gặp vấn đề sức khỏe ở Nhật, việc diễn đạt chính xác vị trí và mức độ đau nhức cho bác sĩ là yếu tố quyết định để nhận được chẩn đoán và đơn thuốc phù hợp.',
      },
      {
        type: 'term',
        term: '問診票（もんしんひょう）',
        reading: 'Monshinhō',
        meaning: 'Phiếu khai báo triệu chứng ban đầu cần điền khi đến phòng khám hoặc bệnh viện Nhật Bản.',
      },
      {
        type: 'list',
        items: [
          'Đau nhức đầu: 頭がズキズキ痛む (Atama ga zukizuki itamu)',
          'Đau quặn bụng: お腹がキリキリ痛む (Onaka ga kirikiri itamu)',
          'Sốt cao: 高熱が出る (Kōnetsu ga deru)',
          'Buồn nôn: 吐き気がする (Hakike ga suru)',
        ],
      },
    ],
    relatedArticles: [
      { slug: 'bao-hiem-y-te-quoc-dan-giam-phi', title: 'Bảo hiểm y tế quốc dân giảm phí khi thu nhập thấp', readingTime: 4, category: 'health' },
    ],
    relatedTools: [],
  },
  {
    id: 'mau-cau-shiyakusho',
    slug: 'mau-cau-tieng-nhat-shiyakusho-buu-dien',
    title: 'Mẫu câu tiếng Nhật thường gặp khi gọi điện lên Shiyakusho và bưu điện',
    excerpt: 'Tổng hợp 15 mẫu câu giao tiếp ngắn gọn, rõ ràng để hỏi tình trạng hồ sơ giấy tờ và hẹn giờ giao lại bưu phẩm.',
    category: 'study',
    tags: ['Mẫu câu Shiyakusho', 'Từ vựng hành chính', 'Tiếng Nhật'],
    publishedAt: '2026-08-10',
    updatedAt: '2026-09-11',
    readingTime: 5,
    coverImage: '/images/hero-everyday-japan.jpg',
    author: { name: 'Chotto Editorial Team' },
    sections: [
      {
        type: 'intro',
        content: 'Giao tiếp qua điện thoại với người Nhật thường gây áp lực lớn vì không thể nhìn khẩu hình hoặc cử chỉ. Nắm vững cấu trúc câu tiêu chuẩn giúp bạn xử lý công việc nhanh chóng.',
      },
      {
        type: 'steps',
        items: [
          { stepNumber: 1, title: 'Mở đầu cuộc gọi', text: 'お忙しいところ恐れ入ります。ベトナム人の[Tên bạn]と申します。(Xin lỗi vì làm phiền lúc anh/chị bận, tôi là [Tên bạn] người Việt Nam).' },
          { stepNumber: 2, title: 'Nêu lý do gọi', text: '住民票の件でお伺いしたいのですが。(Tôi muốn hỏi về việc giấy xác nhận cư trú Juminhyo).' },
          { stepNumber: 3, title: 'Nhờ nhắc lại khi chưa nghe rõ', text: '恐れ入りますが、もう一度ゆっくりお願いできますでしょうか。(Thứ lỗi, anh/chị có thể nói lại chậm một chút được không ạ?).' },
        ],
      },
    ],
    relatedArticles: [
      { slug: 'mat-the-zairyu-thi-lam-gi', title: 'Mất thẻ cư trú (Zairyu Card) thì làm gì?', readingTime: 5, category: 'doc' },
    ],
    relatedTools: [],
  },
  {
    id: 'hoa-don-invoice-freelance',
    slug: 'hoa-don-invoice-tekikaku-freelance',
    title: 'Quy chuẩn hóa đơn Invoice (Tekikaku Seikyusho) cho người làm tự do',
    excerpt: 'Cách điền mã số thuế doanh nghiệp T-number, thuế suất 10% và 8% trên hóa đơn thanh toán theo luật thuế Invoice Nhật Bản.',
    category: 'tool',
    tags: ['Hóa đơn', 'Khai thuế', 'Công cụ Chotto'],
    publishedAt: '2026-08-05',
    updatedAt: '2026-09-09',
    readingTime: 4,
    coverImage: '/images/hero-everyday-japan.jpg',
    author: { name: 'Chotto Editorial Team' },
    sections: [
      {
        type: 'intro',
        content: 'Chế độ hóa đơn hợp lệ (Invoice Seido) áp dụng tại Nhật Bản đòi hỏi mọi cá nhân kinh doanh hoặc làm freelance phải xuất hóa đơn đáp ứng đúng 6 tiêu chí luật định để đối tác được khấu trừ thuế.',
      },
      {
        type: 'toolCTA',
        toolId: 'invoice-studio',
        icon: '🧾',
        title: 'Tạo hóa đơn Invoice hợp lệ Nhật Bản',
        description: 'Biểu mẫu lập hóa đơn tự động tính thuế 10% và thuế giảm trừ 8%, sẵn sàng xuất file in hoặc gửi PDF cho đối tác.',
        ctaText: 'Tạo hóa đơn ngay',
        ctaUrl: getToolioUrl('/#/invoice-studio'),
        note: 'Đúng chuẩn quy định của Cục Thuế Quốc Gia Nhật Bản',
        badge: 'Mở trong Toolio',
      },
    ],
    relatedArticles: [
      { slug: 'luong-30-man-thuc-nhan-bao-nhieu', title: 'Lương 30 man thực nhận bao nhiêu?', readingTime: 6, category: 'work' },
    ],
    relatedTools: [
      { id: 'invoice-studio', name: 'Tạo hóa đơn Invoice hợp lệ Nhật Bản', url: getToolioUrl('/#/invoice-studio') },
    ],
  },
];
