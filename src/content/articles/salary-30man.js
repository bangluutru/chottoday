export const articleSalary30Man = {
  id: 'salary-30man',
  slug: 'luong-30-man-thuc-nhan-bao-nhieu',
  title: 'Lương 30 man thực nhận bao nhiêu? (Minh họa tham khảo)',
  excerpt: 'Giải thích cơ cấu 4 khoản khấu trừ phổ biến tại Nhật (thuế thu nhập, thuế thị dân, bảo hiểm y tế, nenkin) và ước tính số tiền thực nhận vào tài khoản.',
  category: 'work',
  tags: ['Lương thực nhận', 'Thuế thu nhập', 'Nenkin', 'Bảo hiểm'],
  publishedAt: '2026-09-10',
  updatedAt: '2026-09-17',
  readingTime: 6,
  author: {
    name: 'Ban Biên Tập Chotto',
    role: 'Nội dung việc làm & thuế Nhật Bản',
  },
  coverImage: '/images/hero-everyday-japan.jpg',
  socialImage: '/images/og/og-luong-30man.png',
  status: 'published',

  applicability: {
    country: 'Nhật Bản',
    effectiveFrom: '2026',
    audience: 'Người lao động độc thân làm việc theo hợp đồng chính thức (Seishain/Keiyakushain), tham gia Bảo hiểm Xã hội (Shakai Hoken).',
    notes: 'Tỷ lệ bảo hiểm y tế ước tính theo chuẩn Tokyo (Hiệp hội Bảo hiểm Y tế Quốc gia Kyokai Kenpo). Thuế thị dân áp dụng từ năm thứ hai trở đi.',
  },

  review: {
    lastVerifiedAt: '2026-09-17',
    reviewAfter: '2027-03-17',
    reviewer: 'Ban Biên Tập Chotto',
    status: 'verified',
  },

  shortAnswer: {
    lead: 'Tóm tắt nhanh số tiền thực nhận với mức lương 300,000 yên (30 man):',
    steps: [
      'Số tiền thực nhận (Tedori): Khoảng 235,000¥ – 243,000¥/tháng (với nhân viên độc thân, chưa có người phụ thuộc).',
      'Tổng các khoản bị khấu trừ: Chiếm khoảng 20% – 22% (khoảng 57,000¥ – 65,000¥/tháng).',
      'Bốn khoản trừ cố định gồm: Bảo hiểm y tế (~15,000¥), Nenkin phúc lợi (~27,500¥), Bảo hiểm việc làm (~1,800¥), Thuế thu nhập (~6,400¥) và Thuế thị dân (từ năm thứ 2 trở đi, ~12,500¥).',
    ],
    note: 'Người mới sang Nhật năm đầu tiên chưa phải đóng thuế thị dân (Juminzei) nên lương thực nhận hàng tháng sẽ cao hơn khoảng 10,000¥ – 15,000¥.',
  },

  keyTakeaways: [
    'Lương thực nhận = Lương gộp trừ 4 khoản: BHYT, Nenkin, Bảo hiểm việc làm và Thuế (thu nhập + thị dân).',
    'Năm đầu tiên thực nhận cao hơn năm thứ hai do chưa phát sinh thuế thị dân tính trên thu nhập năm trước.',
    'Có thể tối ưu thuế bằng việc đăng ký người phụ thuộc (Fuyo) hợp lệ hoặc tham gia chế độ Furusato Nozei.',
  ],

  sections: [
    {
      type: 'intro',
      content: 'Khi nhận được thư mời làm việc (Naitei) với mức lương cơ bản 300,000 yên (thường gọi là 30 man), nhiều bạn băn khoăn số tiền thực tế chuyển vào tài khoản ngân hàng hàng tháng là bao nhiêu. Tại Nhật Bản, người lao động có trách nhiệm tham gia các chế độ an sinh xã hội và nộp thuế khấu trừ theo luật định.',
    },
    {
      type: 'heading',
      level: 2,
      text: '1. Ước tính số tiền thực nhận ở mức lương 30 man',
    },
    {
      type: 'paragraph',
      content: 'Với trường hợp nhân viên độc thân sống tại khu vực Tokyo, chưa tính người phụ thuộc, số tiền thực nhận (手取り - Tedori) hàng tháng thường dao động từ 235,000 yên đến 243,000 yên. Khoảng 20% đến 22% tổng thu nhập được trích tự động để đóng an sinh xã hội và thuế.',
    },
    {
      type: 'example',
      title: 'Bảng minh họa các khoản trừ trên lương 300,000¥/tháng (Năm thứ 2)',
      items: [
        { label: 'Lương gộp danh nghĩa (Tổng thu nhập)', value: '300,000 ¥', highlight: true },
        { label: 'Bảo hiểm y tế ước tính (~4.98%)', value: '- 14,940 ¥' },
        { label: 'Nenkin phúc lợi ước tính (~9.15%)', value: '- 27,450 ¥' },
        { label: 'Bảo hiểm việc làm ước tính (0.6%)', value: '- 1,800 ¥' },
        { label: 'Thuế thu nhập tạm tính (Shotokuzei)', value: '- 6,400 ¥' },
        { label: 'Thuế thị dân tham khảo (Juminzei - từ năm 2)', value: '- 12,500 ¥' },
        { label: 'Tổng các khoản khấu trừ ước tính', value: '- 63,090 ¥', isDeduction: true },
        { label: 'Số tiền thực nhận ước tính (Tedori)', value: '≈ 236,910 ¥', isTotal: true },
      ],
      caption: 'Ghi chú: Bảng trên là dữ liệu minh họa dựa trên mức phí bảo hiểm tại Tokyo. Mức khấu trừ cụ thể phụ thuộc vào độ tuổi, quỹ bảo hiểm y tế và biểu thuế địa phương.',
    },
    {
      type: 'heading',
      level: 2,
      text: '2. Bốn khoản khấu trừ cơ bản gồm những gì?',
    },
    {
      type: 'steps',
      items: [
        {
          stepNumber: 1,
          title: 'Bảo hiểm xã hội (Shakai Hoken)',
          text: 'Bao gồm Bảo hiểm y tế (Kenko Hoken) và Nenkin phúc lợi (Kosei Nenkin). Đây là hai khoản an sinh lớn nhất, doanh nghiệp chi trả 50% cùng người lao động.',
        },
        {
          stepNumber: 2,
          title: 'Bảo hiểm việc làm (Koyo Hoken)',
          text: 'Khoản trích đóng nhằm hỗ trợ trợ cấp thất nghiệp khi nghỉ việc hoặc hỗ trợ học nghề nâng cao trình độ.',
        },
        {
          stepNumber: 3,
          title: 'Thuế thu nhập cá nhân (Shotokuzei)',
          text: 'Thuế quốc gia tính theo biểu lũy tiến từng phần sau khi đã trừ các khoản giảm trừ cơ bản và an sinh xã hội.',
        },
        {
          stepNumber: 4,
          title: 'Thuế cư trú / Thuế thị dân (Juminzei)',
          text: 'Thuế địa phương (thường khoảng 10% thu nhập chịu thuế năm trước), dùng để vận hành các dịch vụ công ích tại nơi bạn đăng ký cư trú.',
        },
      ],
    },
    {
      type: 'term',
      term: '住民税（じゅうみんぜい）',
      reading: 'Jūminzei',
      meaning: 'Thuế thị dân / Thuế cư trú nộp cho chính quyền địa phương nơi cư trú, bắt đầu trích trừ từ tháng 6 năm thứ hai làm việc tại Nhật.',
    },
    {
      type: 'warning',
      title: 'Lưu ý về Thuế thị dân cho người mới sang Nhật năm đầu tiên',
      content: 'Trong năm đầu tiên đi làm tại Nhật, bạn chưa phải đóng thuế thị dân vì chưa có thu nhập của năm trước đó tại Nhật. Từ tháng 6 của năm thứ hai trở đi, khoản thuế này mới bắt đầu được trích trừ hàng tháng. Bạn nên có kế hoạch tích lũy để không bị bất ngờ khi thực nhận giảm xuống.',
    },
    {
      type: 'heading',
      level: 2,
      text: '3. Các yếu tố ảnh hưởng đến thu nhập thực nhận',
    },
    {
      type: 'list',
      items: [
        'Kê khai người phụ thuộc (Fuyo): Người lao động gửi tiền phụ dưỡng bố mẹ hoặc nuôi con nhỏ có thể được áp dụng mức giảm trừ gia cảnh, giúp giảm thuế thu nhập và thuế thị dân.',
        'Chế độ Furusato Nozei: Đóng góp tự nguyện cho địa phương giúp trừ thuế thị dân năm sau và nhận quà tặng đặc sản.',
        'Các khoản bảo hiểm nhân thọ, y tế tự nguyện đủ điều kiện giảm trừ khi làm thủ tục điều chỉnh thuế cuối năm (Nenmatsu Chosei).',
      ],
    },
    {
      type: 'toolCTA',
      toolId: 'japan-tax-simulator',
      icon: '🧮',
      editorial: {
        title: 'Tính thử lương thực nhận của bạn',
        description: 'Nhập một số thông tin cơ bản để xem kết quả ước tính các khoản khấu trừ thuế và bảo hiểm theo trường hợp cụ thể của bạn.',
      },
      ctaText: 'Dùng công cụ ngay',
      note: 'Công cụ chạy trực tiếp trên trình duyệt, không lưu trữ dữ liệu cá nhân',
      badge: 'Mở trong Toolio',
    },
  ],

  sources: [
    {
      id: 'src-nta-01',
      organization: 'Cục Thuế Quốc Gia Nhật Bản (National Tax Agency - 国税庁)',
      title: 'Biểu thuế thu nhập khấu trừ tại nguồn hàng tháng (給与所得の源泉徴収税額表)',
      url: 'https://www.nta.go.jp/publication/pamph/gensen/zeigakuhyo2024/02.htm',
      accessedAt: '2026-09-17',
      type: 'official',
    },
    {
      id: 'src-nenkin-02',
      organization: 'Cơ quan Hưu trí Nhật Bản (Japan Pension Service - 日本年金機構)',
      title: 'Bảng tỷ lệ đóng bảo hiểm Nenkin phúc lợi và bảo hiểm y tế (厚生年金保険料額表)',
      url: 'https://www.nenkin.go.jp/service/kounen/hokenryo/ryogaku.html',
      accessedAt: '2026-09-17',
      type: 'official',
    },
    {
      id: 'src-soumu-03',
      organization: 'Bộ Nội vụ và Truyền thông Nhật Bản (Ministry of Internal Affairs and Communications - 総務省)',
      title: 'Cơ chế tính và thời điểm áp dụng thuế thị dân cá nhân (個人住民税の概要)',
      url: 'https://www.soumu.go.jp/main_sosiki/jichi_zeisei/czaisei/czaisei_seido/chihouzei/kojin_juminzei.html',
      accessedAt: '2026-09-17',
      type: 'official',
    },
  ],

  relatedArticleIds: [
    'khai-thue-cuoi-nam-gui-tien-ve-nha',
    'mat-the-zairyu-thi-lam-gi',
    'hop-dong-thue-nha-nhat-ban',
  ],

  relatedToolIds: ['japan-tax-simulator', 'social-insurance-jp'],

  seo: {
    metaTitle: 'Lương 30 man thực nhận bao nhiêu? | Chotto',
    metaDescription: 'Giải thích chi tiết 4 khoản khấu trừ thuế thu nhập, thuế thị dân, BHYT, Nenkin trên mức lương 30 man và ước tính số tiền thực nhận chuyển khoản hàng tháng.',
    canonical: 'https://chottoday.com/articles/luong-30-man-thuc-nhan-bao-nhieu',
    structuredDataType: 'Article',
  },
};
