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
    audience: 'Người lao động độc thân 35 tuổi làm việc theo hợp đồng chính thức (Seishain/Keiyakushain) tại Tokyo, tham gia Bảo hiểm Xã hội (Shakai Hoken).',
    notes: 'Tỷ lệ bảo hiểm y tế tính theo Hiệp hội Bảo hiểm Y tế Quốc gia (Kyokai Kenpo chi nhánh Tokyo) áp dụng cho năm tài chính 2026 (令和8年度). Chưa bao gồm bảo hiểm chăm sóc Kaigo Hoken (chỉ áp dụng từ 40 tuổi).',
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
      'Số tiền thực nhận ước tính (Tedori): Khoảng 235,000¥ – 243,000¥/tháng (ví dụ minh họa nhân viên 35 tuổi, độc thân, chưa có người phụ thuộc tại Tokyo đạt ≈ 237,010¥/tháng từ năm thứ hai).',
      'Tổng các khoản khấu trừ: Chiếm khoảng 20% – 22% tổng thu nhập danh nghĩa (khoảng 57,000¥ – 63,000¥/tháng).',
      'Bốn nhóm trừ cố định gồm: Bảo hiểm y tế (~14,775¥ + hỗ trợ nuôi con ~345¥), Nenkin phúc lợi (27,450¥), Bảo hiểm việc làm (1,500¥ theo mức 5/1.000 năm 2026), Thuế thu nhập tạm tính (~6,420¥) và Thuế thị dân (từ năm thứ 2 trở đi, ~12,500¥).',
    ],
    note: 'Thuế thị dân (Juminzei) được tính dựa trên thu nhập năm trước tại Nhật Bản. Người mới sang Nhật trong năm đầu tiên thường chưa phát sinh thuế này nếu năm trước chưa có thu nhập tại Nhật.',
  },

  keyTakeaways: [
    'Lương thực nhận = Lương gộp trừ đi 4 nhóm: BHYT, Nenkin, Bảo hiểm việc làm và Thuế (thu nhập + thị dân).',
    'Bảo hiểm việc làm năm tài chính 2026 (áp dụng từ 01/04/2026): Người lao động đóng 5/1.000 (0,5%), tương đương 1.500¥ trên mức 300.000¥.',
    'Bảo hiểm chăm sóc (Kaigo Hoken): Chỉ áp dụng cho người từ đủ 40 đến 64 tuổi (nhân viên dưới 40 tuổi không bị trừ khoản này).',
    'Thuế thị dân phụ thuộc vào việc có hay không thu nhập chịu thuế tại Nhật trong năm trước, không phải chế độ miễn thuế cố định.',
  ],

  sections: [
    {
      type: 'intro',
      content: 'Khi nhận được thư mời làm việc (Naitei) với mức lương cơ bản 300,000 yên (thường gọi là 30 man), nhiều bạn băn khoăn số tiền thực tế chuyển vào tài khoản ngân hàng hàng tháng là bao nhiêu. Tại Nhật Bản, người lao động có trách nhiệm tham gia các chế độ an sinh xã hội và nộp thuế khấu trừ theo quy định pháp luật.',
    },
    {
      type: 'heading',
      level: 2,
      text: '1. Ước tính số tiền thực nhận ở mức lương 30 man (Ví dụ chuẩn năm 2026)',
    },
    {
      type: 'paragraph',
      content: 'Để minh họa rõ ràng, ta xét trường hợp nhân viên 35 tuổi (chưa thuộc diện đóng bảo hiểm chăm sóc Kaigo Hoken), độc thân, chưa có người phụ thuộc, làm việc tại doanh nghiệp kinh doanh thông thường ở Tokyo tham gia Kyokai Kenpo. Mức lương gộp 300,000 yên tương ứng mức lương tiêu chuẩn (標準報酬月額) Hạng 22 (300,000 yên).',
    },
    {
      type: 'example',
      title: 'Bảng số liệu minh họa các khoản trừ trên lương 300,000¥/tháng (Năm 2026 - Năm thứ 2)',
      items: [
        { label: 'Lương gộp danh nghĩa (Tổng thu nhập)', value: '300,000 ¥', highlight: true },
        { label: 'Bảo hiểm y tế Kyokai Kenpo Tokyo (4.925%)', value: '- 14,775 ¥' },
        { label: 'Khoản hỗ trợ nuôi con 2026 (Kodomo Shienkin - 0.115%)', value: '- 345 ¥' },
        { label: 'Nenkin phúc lợi xã hội (Kosei Nenkin - 9.15%)', value: '- 27,450 ¥' },
        { label: 'Bảo hiểm việc làm năm 2026 (Koyo Hoken - 0.5%)', value: '- 1,500 ¥' },
        { label: 'Thuế thu nhập tạm tính (Shotokuzei - Biểu thuế NTA 令和8年)', value: '- 6,420 ¥' },
        { label: 'Thuế thị dân tham khảo (Juminzei - từ năm thứ 2 trở đi)', value: '- 12,500 ¥' },
        { label: 'Tổng các khoản khấu trừ ước tính', value: '- 62,990 ¥', isDeduction: true },
        { label: 'Số tiền thực nhận ước tính (Tedori)', value: '≈ 237,010 ¥', isTotal: true },
      ],
      caption: 'Lưu ý: Bảng trên là ví dụ minh họa có tính chất tham khảo cho nhân viên 35 tuổi tại Tokyo năm 2026. Số tiền khấu trừ thực tế có thể chênh lệch tùy theo hiệp hội bảo hiểm của công ty, độ tuổi chính xác và biểu thuế địa phương nơi cư trú.',
    },
    {
      type: 'heading',
      level: 2,
      text: '2. Chi tiết 4 khoản khấu trừ cơ bản theo quy định năm 2026',
    },
    {
      type: 'steps',
      items: [
        {
          stepNumber: 1,
          title: 'Bảo hiểm y tế & Khoản hỗ trợ nuôi con (Kenko Hoken & Kodomo Shienkin)',
          text: 'Tại Tokyo, tỷ lệ bảo hiểm y tế Kyokai Kenpo năm 2026 là 9.85% (người lao động chịu một nửa là 4.925%, tương đương 14,775¥). Từ năm 2026, chế độ hỗ trợ nuôi con mới bổ sung tỷ lệ 0.23% (người lao động chịu 0.115%, tương đương 345¥). Đối với người lao động từ đủ 40 đến 64 tuổi, sẽ phát sinh thêm khoản bảo hiểm chăm sóc (Kaigo Hoken) với tỷ lệ người lao động chịu là 0.81%.',
        },
        {
          stepNumber: 2,
          title: 'Nenkin phúc lợi (Kosei Nenkin)',
          text: 'Tỷ lệ đóng bảo hiểm Nenkin phúc lợi cố định toàn quốc là 18.3%, trong đó doanh nghiệp và người lao động chia đôi (mỗi bên 9.15%). Với mức lương chuẩn 300,000¥, khoản trích là 27,450¥.',
        },
        {
          stepNumber: 3,
          title: 'Bảo hiểm việc làm (Koyo Hoken - Cập nhật MHLW FY2026)',
          text: 'Theo công bố chính thức của Bộ Y tế, Lao động và Phúc lợi Nhật Bản (MHLW), từ ngày 01/04/2026 đến 31/03/2027, tỷ lệ bảo hiểm việc làm cho ngành thông thường đối với người lao động là 5/1.000 (0.5%), tương đương 1,500¥/tháng trên mức lương 300,000¥ (giảm so với tỷ lệ 0.6% của các năm trước).',
        },
        {
          stepNumber: 4,
          title: 'Thuế thu nhập cá nhân (Shotokuzei) và Thuế thị dân (Juminzei)',
          text: 'Thuế thu nhập được tính tự động hàng tháng theo Biểu thuế thu nhập khấu trừ tại nguồn 令和8年分 của Cục Thuế Quốc Gia (NTA) dựa trên thu nhập sau khi đã trừ tiền bảo hiểm xã hội. Thuế thị dân do địa phương nơi bạn đăng ký cư trú tính toán dựa trên thu nhập chịu thuế của năm trước.',
        },
      ],
    },
    {
      type: 'term',
      term: '住民税（じゅうみんぜい）',
      reading: 'Jūminzei',
      meaning: 'Thuế thị dân / Thuế cư trú nộp cho chính quyền địa phương nơi cư trú vào ngày 1 tháng 1 hàng năm, tính dựa trên thu nhập chịu thuế của năm dương lịch trước đó.',
    },
    {
      type: 'warning',
      title: 'Hiểu đúng về Thuế thị dân cho người mới sang Nhật',
      content: 'Thuế thị dân chỉ phát sinh khi bạn có đăng ký địa chỉ tại Nhật vào ngày 1 tháng 1 VÀ có phát sinh thu nhập chịu thuế tại Nhật trong năm dương lịch trước đó. Người mới sang Nhật làm việc trong năm đầu tiên thường chưa bị trừ thuế thị dân vì chưa có căn cứ thu nhập năm trước tại Nhật. Tuy nhiên, từ tháng 6 của năm thứ hai trở đi, khoản thuế này sẽ bắt đầu được trích trừ hàng tháng. Nếu bạn từng có thu nhập tại Nhật trước đó, bạn vẫn có thể phải nộp thuế này ngay trong năm đầu.',
    },
    {
      type: 'heading',
      level: 2,
      text: '3. Các yếu tố giúp tối ưu số tiền thực nhận',
    },
    {
      type: 'list',
      items: [
        'Kê khai người phụ thuộc hợp lệ (Fuyo): Người lao động phụ dưỡng bố mẹ hoặc nuôi con nhỏ đáp ứng điều kiện có thể được giảm trừ gia cảnh, giúp giảm thuế thu nhập và thuế thị dân.',
        'Chế độ Furusato Nozei: Đóng góp tự nguyện cho địa phương giúp khấu trừ thuế thị dân cho năm tiếp theo và nhận lại các phần quà nông đặc sản.',
        'Quyết toán thuế cuối năm (Nenmatsu Chosei): Doanh nghiệp sẽ cân đối lại số thuế thu nhập đã tạm khấu trừ trong năm so với số thuế thực tế phải nộp, hoàn trả lại phần chênh lệch (nếu có) vào kỳ lương tháng 12.',
      ],
    },
    {
      type: 'toolCTA',
      toolId: 'japan-tax-simulator',
      icon: '🧮',
      editorial: {
        title: 'Tính thử lương thực nhận của bạn',
        description: 'Nhập thông tin cụ thể (mức lương, nơi ở, độ tuổi, người phụ thuộc) để xem kết quả ước tính chi tiết theo trường hợp riêng của bạn.',
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
      title: 'Biểu thuế thu nhập khấu trừ tại nguồn năm 2026 (令和8年分 源泉徴収税額表)',
      url: 'https://www.nta.go.jp/publication/pamph/gensen/zeigakuhyo2026/index.htm',
      accessedAt: '2026-09-17',
      type: 'official',
    },
    {
      id: 'src-mhlw-02',
      organization: 'Bộ Y tế, Lao động và Phúc lợi Nhật Bản (Ministry of Health, Labour and Welfare - 厚生労働省)',
      title: 'Thông báo tỷ lệ đóng bảo hiểm việc làm năm tài chính 2026 (令和8年度 雇用保険料率のご案内)',
      url: 'https://www.mhlw.go.jp/stf/seisakunitsuite/bunya/koyou_roudou/koyou/koyouhoken/index.html',
      accessedAt: '2026-09-17',
      type: 'official',
    },
    {
      id: 'src-kyoukaikenpo-03',
      organization: 'Hiệp hội Bảo hiểm Y tế Quốc gia (Kyokai Kenpo - 全国健康保険協会)',
      title: 'Bảng tỷ lệ đóng bảo hiểm y tế chi nhánh Tokyo năm 2026 (令和8年度 東京都 保険料額表)',
      url: 'https://www.kyoukaikenpo.or.jp/g7/cat710/sb3160/',
      accessedAt: '2026-09-17',
      type: 'official',
    },
    {
      id: 'src-nenkin-04',
      organization: 'Cơ quan Hưu trí Nhật Bản (Japan Pension Service - 日本年金機構)',
      title: 'Bảng tỷ lệ đóng bảo hiểm Nenkin phúc lợi (厚生年金保険料額表)',
      url: 'https://www.nenkin.go.jp/service/kounen/hokenryo/ryogaku.html',
      accessedAt: '2026-09-17',
      type: 'official',
    },
    {
      id: 'src-soumu-05',
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
    metaTitle: 'Lương 30 man thực nhận bao nhiêu? (Minh họa 2026) | Chotto',
    metaDescription: 'Giải thích chi tiết 4 nhóm khấu trừ thuế thu nhập, thuế thị dân, BHYT, Nenkin theo quy định năm 2026 trên mức lương 30 man và ước tính số tiền thực nhận.',
    canonical: 'https://chottoday.com/articles/luong-30-man-thuc-nhan-bao-nhieu',
    structuredDataType: 'Article',
  },
};
