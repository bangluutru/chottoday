import { getToolioUrl } from '../config/constants';

export const FEATURED_CONTENT = {
  article: {
    id: 'art-f1',
    category: 'Giấy tờ & hành chính',
    categoryKey: 'doc',
    title: 'Gia hạn visa kỹ sư trước 3 tháng: Thủ tục và giấy tờ công ty cần cấp',
    excerpt: 'Cục xuất nhập cảnh cho phép nộp đơn gia hạn trước ngày hết hạn 3 tháng. Đây là danh sách giấy tờ bạn tự chuẩn bị và giấy tờ xin từ bộ phận nhân sự.',
    readTime: '6 phút đọc',
    date: '14/09/2026',
    slug: '/articles/gia-han-visa-ky-su-3-thang',
  },
  guide: {
    id: 'gui-f1',
    category: 'Việc làm & tiền',
    categoryKey: 'work',
    title: 'Hướng dẫn khai thuế cuối năm (Nenmatsu Chosei) cho người gửi tiền về nhà',
    stepsCount: 4,
    timeEstimate: '15 phút',
    date: '12/09/2026',
    slug: '/guides/khai-thue-cuoi-nam-nguoi-phu-thuoc',
  },
  tool: {
    id: 'tool-f1',
    category: 'Công cụ Chotto',
    categoryKey: 'tool',
    title: 'Mô phỏng Thuế thu nhập & Thuế thị dân Nhật Bản',
    description: 'Ước tính số tiền thuế bị khấu trừ hàng tháng và hoàn thuế theo mức lương, số người phụ thuộc và tiền gửi về.',
    badge: 'Chạy trên máy bạn',
    url: getToolioUrl('/#/japan-tax-simulator'),
    actionText: 'Mở công cụ',
  },
};
