export const articleSalary30Man = {
  id: 'salary-30man',
  slug: 'luong-30-man-thuc-nhan-bao-nhieu',
  title: 'Lương 30 man thực nhận bao nhiêu? (Minh họa tham khảo)',
  excerpt: 'Giải thích cơ cấu 4 khoản khấu trừ phổ biến tại Nhật (thuế thu nhập, thuế thị dân, bảo hiểm y tế, nenkin) và ước tính số tiền thực nhận vào tài khoản.',
  category: 'work',
  tags: ['Lương thực nhận', 'Thuế thu nhập', 'Nenkin', 'Bảo hiểm'],
  publishedAt: '2026-09-10',
  updatedAt: '2026-09-16',
  readingTime: 6,
  coverImage: '/images/hero-everyday-japan.jpg',
  author: {
    name: 'Chotto Editorial Team',
    role: 'Nội dung kiến trúc demo',
  },
  sections: [
    {
      type: 'note',
      title: 'Lưu ý về nội dung demo kiến trúc',
      content: 'Bài viết này thuộc bộ dữ liệu mẫu (demo) của Phase 2 nhằm kiểm chứng hiển thị cấu trúc bài viết và luồng kết nối công cụ. Các con số và tỷ lệ khấu trừ mang tính chất minh họa tham khảo, không đại diện cho tư vấn pháp lý, kế toán hay thuế chính thức.',
    },
    {
      type: 'intro',
      content: 'Khi nhận được thư mời làm việc (Naitei) với mức lương cơ bản 300,000 yên (thường gọi là 30 man), nhiều bạn băn khoăn số tiền thực tế chuyển vào tài khoản ngân hàng hàng tháng là bao nhiêu. Tại Nhật Bản, người lao động thường tham gia các khoản an sinh xã hội và nộp thuế khấu trừ theo luật định.',
    },
    {
      type: 'heading',
      level: 2,
      text: '1. Ước tính số tiền thực nhận ở mức lương 30 man',
    },
    {
      type: 'paragraph',
      content: 'Với trường hợp nhân viên độc thân tham khảo, chưa tính người phụ thuộc sống tại khu vực Tokyo, số tiền thực nhận (手取り - Tedori) hàng tháng thường được ước tính trong khoảng 235,000 yên đến 243,000 yên. Khoảng 20% đến 22% tổng thu nhập được trích để đóng các khoản nghĩa vụ an sinh và thuế.',
    },
    {
      type: 'example',
      title: 'Bảng số liệu minh họa tham khảo các khoản trừ trên lương 300,000¥/tháng',
      items: [
        { label: 'Lương gộp danh nghĩa (Tổng thu nhập)', value: '300,000 ¥', highlight: true },
        { label: 'Bảo hiểm y tế ước tính (~4.98%)', value: '- 14,940 ¥' },
        { label: 'Nenkin phúc lợi ước tính (~9.15%)', value: '- 27,450 ¥' },
        { label: 'Bảo hiểm việc làm ước tính (0.6%)', value: '- 1,800 ¥' },
        { label: 'Thuế thu nhập tạm tính (Shotokuzei)', value: '- 6,400 ¥' },
        { label: 'Thuế thị dân tham khảo (Juminzei - từ năm thứ 2)', value: '- 12,500 ¥' },
        { label: 'Tổng các khoản khấu trừ ước tính', value: '- 63,090 ¥', isDeduction: true },
        { label: 'Số tiền thực nhận ước tính (Tedori)', value: '≈ 236,910 ¥', isTotal: true },
      ],
      caption: 'Lưu ý: Bảng trên là dữ liệu minh họa. Mức khấu trừ cụ thể phụ thuộc vào độ tuổi, quỹ bảo hiểm y tế của doanh nghiệp và quy định tại địa phương cư trú.',
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
          text: 'Thường bao gồm Bảo hiểm y tế (Kenko Hoken) và Nenkin phúc lợi (Kosei Nenkin). Đây là hai khoản an sinh lớn trên bảng lương. Doanh nghiệp chi trả tỷ lệ theo luật cùng người lao động.',
        },
        {
          stepNumber: 2,
          title: 'Bảo hiểm việc làm (Koyo Hoken)',
          text: 'Khoản đóng nhằm hỗ trợ người lao động trong trường hợp gián đoạn việc làm hoặc tìm kiếm cơ hội nghề nghiệp mới.',
        },
        {
          stepNumber: 3,
          title: 'Thuế thu nhập cá nhân (Shotokuzei)',
          text: 'Thuế quốc gia tính theo biểu thuế lũy tiến dựa trên thu nhập chịu thuế sau khi đã trừ các khoản giảm trừ tiêu chuẩn.',
        },
        {
          stepNumber: 4,
          title: 'Thuế cư trú / Thuế thị dân (Juminzei)',
          text: 'Khoản thuế địa phương dùng cho dịch vụ công tại nơi cư trú, thường được tính dựa trên thu nhập của năm trước đó.',
        },
      ],
    },
    {
      type: 'term',
      term: '住民税（じゅうみんぜい）',
      reading: 'Jūminzei',
      meaning: 'Thuế thị dân / Thuế cư trú nộp cho chính quyền địa phương nơi cư trú.',
    },
    {
      type: 'warning',
      title: 'Lưu ý về Thuế thị dân cho người mới sang Nhật năm đầu tiên',
      content: 'Trong năm đầu tiên làm việc tại Nhật, người mới sang thường chưa phát sinh nghĩa vụ Thuế thị dân (Juminzei) do chưa có cơ sở thu nhập của năm trước tại Nhật. Từ tháng 6 của năm thứ hai trở đi, khoản thuế này mới bắt đầu được trích trừ vào lương hàng tháng. Bạn nên chuẩn bị kế hoạch tài chính để chủ động khi khoản này xuất hiện.',
    },
    {
      type: 'heading',
      level: 2,
      text: '3. Các yếu tố ảnh hưởng đến thu nhập thực nhận',
    },
    {
      type: 'list',
      items: [
        'Kê khai người phụ thuộc hợp lệ (Fuyo): Người lao động có thân nhân phụ thuộc đáp ứng điều kiện có thể được áp dụng các mức giảm trừ gia cảnh tương ứng.',
        'Chế độ Furusato Nozei: Khoản đóng góp tự nguyện cho các địa phương theo quy định của nhà nước.',
        'Các khoản bảo hiểm đủ điều kiện khấu trừ khi quyết toán thuế cuối năm (Nenmatsu Chosei).',
      ],
    },
    {
      type: 'toolCTA',
      toolId: 'japan-tax-simulator',
      icon: '🧮',
      editorial: {
        title: 'Tính thử lương thực nhận của bạn',
        description: 'Nhập một số thông tin cơ bản để xem kết quả ước tính các khoản khấu trừ thuế và bảo hiểm.',
      },
      ctaText: 'Dùng công cụ ngay',
      note: 'Công cụ chạy trực tiếp trên trình duyệt, không lưu trữ dữ liệu cá nhân',
      badge: 'Mở trong Toolio',
    },
    {
      type: 'sources',
      items: [
        {
          title: 'Thông tin chế độ Bảo hiểm Xã hội Nhật Bản',
          publisher: 'Japan Pension Service (Nenkin Kiko)',
          url: 'https://www.nenkin.go.jp',
        },
        {
          title: 'Cơ sở dữ liệu Thuế Quốc gia Nhật Bản',
          publisher: 'National Tax Agency (Cục Thuế Quốc Gia Nhật Bản)',
          url: 'https://www.nta.go.jp',
        },
      ],
    },
  ],
  relatedArticles: [
    {
      slug: 'khai-thue-cuoi-nam-gui-tien-ve-nha',
      title: 'Hướng dẫn khai thuế cuối năm (Nenmatsu Chosei) cho người gửi tiền về nhà',
      readingTime: 5,
      category: 'work',
    },
    {
      slug: 'mat-the-zairyu-thi-lam-gi',
      title: 'Mất thẻ cư trú (Zairyu Card) thì làm gì?',
      readingTime: 5,
      category: 'doc',
    },
    {
      slug: 'hop-dong-thue-nha-nhat-ban',
      title: 'Hợp đồng thuê nhà ở Nhật: Những khoản tiền không lấy lại được',
      readingTime: 7,
      category: 'life',
    },
  ],
  relatedToolIds: ['japan-tax-simulator', 'social-insurance-jp'],
};
