import { getToolioUrl } from '../config/constants';

/**
 * Centralized Toolio Tools Registry (Single Source of Truth)
 * 
 * Provides tool metadata, descriptions, badges, and deep-link destinations.
 * Prepares for Phase 3 dynamic Toolio Registry integration.
 */
export const SELECTED_TOOLS = [
  {
    id: 'japan-tax-simulator',
    name: 'Mô phỏng Thuế thu nhập & Thị dân',
    description: 'Mô phỏng ước tính tham khảo thuế thu nhập, thuế thị dân, bảo hiểm xã hội và số tiền thực lĩnh hàng tháng tại Nhật.',
    category: 'Việc làm & tiền',
    categoryKey: 'work',
    badge: 'Xử lý trên trình duyệt',
    isExternal: true,
    toolioPath: getToolioUrl('/#/japan-tax-simulator'),
    stats: 'Cập nhật khung thuế tham khảo',
  },
  {
    id: 'japan-nenkin-guide',
    name: 'Tính tiền Nenkin rút 1 lần (Lump-sum)',
    description: 'Ước tính số tiền nhận lại tham khảo sau khi rời Nhật Bản theo số tháng đóng và hướng dẫn xin lại 20.42% tiền thuế khấu trừ.',
    category: 'Việc làm & tiền',
    categoryKey: 'work',
    badge: 'Xử lý trên trình duyệt',
    isExternal: true,
    toolioPath: getToolioUrl('/#/japan-nenkin-guide'),
    stats: 'Tối đa 60 tháng đóng',
  },
  {
    id: 'id-photo-studio',
    name: 'Tạo ảnh thẻ chuẩn hồ sơ Nhật',
    description: 'Tự chụp bằng điện thoại, định dạng đúng kích cỡ tiêu chuẩn 3x4cm (thẻ cư trú, xin việc) hoặc 3.5x4.5cm (visa, hộ chiếu), sẵn sàng in tại combini.',
    category: 'Giấy tờ & hành chính',
    categoryKey: 'doc',
    badge: 'Xử lý trên trình duyệt',
    isExternal: true,
    toolioPath: getToolioUrl('/#/id-photo-studio'),
    stats: 'In combini 200¥',
  },
  {
    id: 'invoice-studio',
    name: 'Tạo hóa đơn Invoice hợp lệ Nhật Bản',
    description: 'Biểu mẫu lập hóa đơn theo quy chuẩn hệ thống Invoice (Tekikaku Seikyusho) dành cho người làm freelance, kinh doanh tự do.',
    category: 'Công cụ Chotto',
    categoryKey: 'tool',
    badge: 'Xử lý trên trình duyệt',
    isExternal: true,
    toolioPath: getToolioUrl('/#/invoice-studio'),
    stats: 'Mẫu theo luật định NTA',
  },
];

export function getToolById(id) {
  return SELECTED_TOOLS.find((t) => t.id === id) || null;
}

export function getToolsByIds(ids = []) {
  if (!Array.isArray(ids)) return [];
  return ids.map((id) => getToolById(id)).filter(Boolean);
}

export function getAllTools() {
  return SELECTED_TOOLS;
}
