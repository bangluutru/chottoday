import { getToolioUrl } from '../../config/constants';

export const articleSalary30Man = {
  id: 'salary-30man',
  slug: 'luong-30-man-thuc-nhan-bao-nhieu',
  title: 'Lương 30 man thực nhận bao nhiêu?',
  excerpt: 'Giải thích chi tiết 4 khoản khấu trừ bắt buộc tại Nhật (thuế thu nhập, thuế thị dân, bảo hiểm y tế, nenkin) và con số thực nhận vào tài khoản.',
  category: 'work',
  tags: ['Lương thực nhận', 'Thuế thu nhập', 'Nenkin', 'Bảo hiểm'],
  publishedAt: '2026-09-10',
  updatedAt: '2026-09-16',
  readingTime: 6,
  coverImage: '/images/hero-everyday-japan.jpg',
  author: {
    name: 'Chotto Editorial Team',
    role: 'Tư vấn đời sống & tài chính tại Nhật',
  },
  sections: [
    {
      type: 'intro',
      content: 'Khi nhận được thư mời làm việc (Naitei) với mức lương cơ bản 300,000 yên (thường gọi là 30 man), nhiều bạn lầm tưởng số tiền chuyển vào tài khoản ngân hàng sẽ gần bằng con số này. Tuy nhiên, theo luật pháp Nhật Bản, mọi cá nhân có thu nhập đều phải đóng các khoản an sinh xã hội và thuế theo quy chuẩn khắt khe.',
    },
    {
      type: 'heading',
      level: 2,
      text: '1. Lương 30 man thực nhận khoảng bao nhiêu?',
    },
    {
      type: 'paragraph',
      content: 'Đối với một nhân viên độc thân, chưa có người phụ thuộc sống tại Tokyo hoặc các tỉnh lân cận, số tiền thực nhận (手取り - Tedori) hàng tháng của mức lương 30 man thường dao động từ **235,000 yên đến 243,000 yên**. Khoảng 20% đến 22% tổng thu nhập sẽ được công ty trích lại nộp trực tiếp cho các cơ quan công quyền.',
    },
    {
      type: 'example',
      title: 'Bảng ước tính chi tiết các khoản trừ trên lương 300,000¥/tháng',
      items: [
        { label: 'Lương gộp (Tổng thu nhập)', value: '300,000 ¥', highlight: true },
        { label: 'Bảo hiểm y tế (Kenko Hoken ~4.98%)', value: '- 14,940 ¥' },
        { label: 'Nenkin phúc lợi (Kosei Nenkin ~9.15%)', value: '- 27,450 ¥' },
        { label: 'Bảo hiểm việc làm (Koyo Hoken 0.6%)', value: '- 1,800 ¥' },
        { label: 'Thuế thu nhập tạm tính (Shotokuzei)', value: '- 6,400 ¥' },
        { label: 'Thuế thị dân (Juminzei - từ năm thứ 2)', value: '- 12,500 ¥' },
        { label: 'Tổng tiền bị khấu trừ hàng tháng', value: '- 63,090 ¥', isDeduction: true },
        { label: 'Thực nhận vào thẻ ngân hàng (Tedori)', value: '≈ 236,910 ¥', isTotal: true },
      ],
      caption: 'Lưu ý: Mức khấu trừ có thể chênh lệch nhẹ tùy theo độ tuổi (trên 40 tuổi đóng thêm bảo hiểm điều dưỡng Kaigo) và tỷ lệ đóng bảo hiểm theo từng tỉnh (Hiệp hội Kenpo hoặc Kyokai Kenpo).',
    },
    {
      type: 'heading',
      level: 2,
      text: '2. Bốn khoản khấu trừ bắt buộc gồm những gì?',
    },
    {
      type: 'steps',
      items: [
        {
          stepNumber: 1,
          title: 'Bảo hiểm xã hội (Shakai Hoken)',
          text: 'Bao gồm Bảo hiểm y tế (健康保険) và Nenkin phúc lợi (厚生年金). Đây là khoản lớn nhất bị trừ trên bảng lương, tổng cộng khoảng 14%–15% lương của bạn. Đổi lại, công ty phải chi trả số tiền tương đương 50% cùng bạn để nộp vào quỹ an sinh quốc gia.',
        },
        {
          stepNumber: 2,
          title: 'Bảo hiểm việc làm (Koyo Hoken)',
          text: 'Khoản phí nhỏ (khoảng 0.6% lương) nhằm bảo vệ bạn trong trường hợp công ty phá sản, sa thải hoặc bạn nghỉ việc cần nhận tiền trợ cấp thất nghiệp.',
        },
        {
          stepNumber: 3,
          title: 'Thuế thu nhập cá nhân (Shotokuzei)',
          text: 'Cơ quan thuế tính thuế lũy tiến dựa trên mức thu nhập sau khi đã trừ đi các khoản giảm trừ tiêu chuẩn và an sinh xã hội.',
        },
        {
          stepNumber: 4,
          title: 'Thuế cư trú / Thuế thị dân (Juminzei)',
          text: 'Khoản thuế 10% tính trên thu nhập chịu thuế của năm trước đó, dùng để chi trả cho các dịch vụ công cộng tại địa phương nơi bạn cư trú.',
        },
      ],
    },
    {
      type: 'term',
      term: '住民税（じゅうみんぜい）',
      reading: 'Jūminzei',
      meaning: 'Thuế thị dân / Thuế cư trú. Thuế nộp cho quận/thành phố nơi bạn cư trú vào ngày 1 tháng 1 hàng năm.',
    },
    {
      type: 'warning',
      title: 'Điểm lưu ý cực kỳ quan trọng cho người mới sang Nhật năm đầu tiên',
      content: 'Trong năm đầu tiên sang Nhật làm việc, bạn **chưa phải đóng Thuế thị dân (Juminzei)** vì chưa có thu nhập của năm trước tại Nhật. Do đó, lương thực nhận năm đầu của mức 30 man sẽ cao hơn (khoảng 248,000–250,000 yên). Tuy nhiên, từ tháng 6 của năm thứ hai trở đi, khoản thuế này sẽ bắt đầu bị trừ lùi vào lương hàng tháng. Hãy chuẩn bị quỹ tài chính để không bị bỡ ngỡ khi thấy thực nhận giảm xuống!',
    },
    {
      type: 'heading',
      level: 2,
      text: '3. Cách tối ưu số tiền thực nhận hợp pháp',
    },
    {
      type: 'list',
      items: [
        'Đăng ký khấu trừ người phụ thuộc (Fuyo): Nếu gửi tiền về phụng dưỡng cha mẹ hoặc nuôi con nhỏ ở Việt Nam qua ngân hàng hợp pháp, bạn có thể được giảm đáng kể thuế thu nhập và thuế thị dân.',
        'Tham gia Furusato Nozei: Đóng góp tiền cho các địa phương Nhật Bản để nhận lại đặc sản và được giảm trừ thuế thị dân năm sau.',
        'Bảo hiểm nhân thọ và bảo hiểm động đất: Khoản chi trả hợp lệ có hóa đơn chứng từ được khấu trừ khi làm thủ tục Nenmatsu Chosei cuối năm.',
      ],
    },
    {
      type: 'toolCTA',
      toolId: 'japan-tax-simulator',
      icon: '🧮',
      title: 'Tính thử lương thực nhận của bạn',
      description: 'Nhập mức lương dự kiến, tình trạng người phụ thuộc và nơi làm việc để nhận bảng phân tích khấu trừ và số tiền về tài khoản chính xác nhất.',
      ctaText: 'Dùng công cụ ngay',
      ctaUrl: getToolioUrl('/#/japan-tax-simulator'),
      note: 'Miễn phí · Xử lý trực tiếp trên trình duyệt · Không lưu trữ dữ liệu',
      badge: 'Mở trong Toolio',
    },
    {
      type: 'sources',
      items: [
        {
          title: 'Bảng tỷ lệ đóng Bảo hiểm Xã hội Quốc gia Nhật Bản',
          publisher: 'Japan Pension Service (Nenkin Kiko)',
          url: 'https://www.nenkin.go.jp',
        },
        {
          title: 'Hướng dẫn cách tính Thuế thu nhập cá nhân',
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
  relatedTools: [
    {
      id: 'japan-tax-simulator',
      name: 'Mô phỏng Thuế thu nhập & Thị dân',
      description: 'Tính toán chính xác thuế thu nhập, thuế thị dân và số tiền thực nhận.',
      url: getToolioUrl('/#/japan-tax-simulator'),
    },
    {
      id: 'japan-nenkin-guide',
      name: 'Tính tiền Nenkin rút 1 lần (Lump-sum)',
      description: 'Ước tính số tiền nhận lại sau khi kết thúc hợp đồng về nước.',
      url: getToolioUrl('/#/japan-nenkin-guide'),
    },
  ],
};
