/**
 * 6 Core Categories of ChottoDay (SSOT: Chotto - Design.pdf)
 * 
 * Semantic category identity only. Visual presentation and color tokens
 * are resolved strictly via CSS design tokens (--cat-*-accent, --cat-*-text).
 */
export const CATEGORIES = [
  {
    id: 'life',
    name: 'Đời sống & nhà ở',
    description: 'Thuê nhà, hợp đồng, rác, hàng xóm, điện nước',
    icon: '/icons/icon-life.svg',
    colorKey: 'life',
    itemCount: 24,
  },
  {
    id: 'doc',
    name: 'Giấy tờ & hành chính',
    description: 'Visa, thẻ cư trú, đăng ký thành phố, my number',
    icon: '/icons/icon-doc.svg',
    colorKey: 'doc',
    itemCount: 38,
  },
  {
    id: 'work',
    name: 'Việc làm & tiền',
    description: 'Hợp đồng lao động, thuế, lương, chuyển tiền',
    icon: '/icons/icon-work.svg',
    colorKey: 'work',
    itemCount: 31,
  },
  {
    id: 'health',
    name: 'Sức khoẻ & khẩn cấp',
    description: 'Bệnh viện, bảo hiểm y tế, thiên tai, tai nạn',
    icon: '/icons/icon-health.svg',
    colorKey: 'health',
    itemCount: 19,
  },
  {
    id: 'study',
    name: 'Tiếng Nhật & học tập',
    description: 'Từ vựng hành chính, mẫu câu, thi cử, trường học',
    icon: '/icons/icon-study.svg',
    colorKey: 'study',
    itemCount: 27,
  },
  {
    id: 'tool',
    name: 'Công cụ Chotto',
    description: 'Biểu mẫu, bảng tính, trình kiểm tra, liên kết',
    icon: '/icons/icon-tool.svg',
    colorKey: 'tool',
    itemCount: 18,
  },
];
