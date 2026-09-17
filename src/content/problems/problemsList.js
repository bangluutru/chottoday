import { getToolioUrl } from '../../config/constants';

export const USER_PROBLEMS = [
  {
    id: 'prob-newcomer',
    statement: 'Tôi mới sang Nhật',
    detail: 'Các thủ tục đăng ký địa chỉ tại Shiyakusho, mở tài khoản ngân hàng và mua sim điện thoại.',
    categoryKey: 'doc',
    targetUrl: '/topics/documents',
    recommendedArticle: {
      slug: 'mat-the-zairyu-thi-lam-gi',
      title: 'Mất thẻ cư trú (Zairyu Card) thì làm gì?',
    },
    recommendedTool: {
      name: 'Tạo ảnh thẻ combini 200¥',
      url: getToolioUrl('/#/id-photo-studio'),
    },
  },
  {
    id: 'prob-moving',
    statement: 'Tôi sắp chuyển nhà',
    detail: 'Hợp đồng thuê nhà, tiền cọc, tiền lễ và thủ tục cắt/chuyển giấy báo cư trú.',
    categoryKey: 'life',
    targetUrl: '/topics/life',
    recommendedArticle: {
      slug: 'hop-dong-thue-nha-nhat-ban',
      title: 'Hợp đồng thuê nhà ở Nhật: Những khoản tiền không lấy lại được',
    },
    recommendedTool: null,
  },
  {
    id: 'prob-tax',
    statement: 'Tôi muốn biết mình phải đóng bao nhiêu thuế',
    detail: 'Cách tính thuế thu nhập, thuế thị dân và số tiền thực nhận sau các khoản khấu trừ.',
    categoryKey: 'work',
    targetUrl: '/articles/luong-30-man-thuc-nhan-bao-nhieu',
    recommendedArticle: {
      slug: 'luong-30-man-thuc-nhan-bao-nhieu',
      title: 'Lương 30 man thực nhận bao nhiêu?',
    },
    recommendedTool: {
      name: 'Mô phỏng Thuế thu nhập & Thị dân',
      url: getToolioUrl('/#/japan-tax-simulator'),
    },
  },
  {
    id: 'prob-job-change',
    statement: 'Tôi nghỉ việc hoặc chuyển công ty',
    detail: 'Thủ tục thông báo Cục Nyukan trong 14 ngày, chuyển đổi bảo hiểm y tế và tiền trợ cấp thất nghiệp.',
    categoryKey: 'work',
    targetUrl: '/topics/work-money',
    recommendedArticle: {
      slug: 'bao-hiem-y-te-quoc-dan-giam-phi',
      title: 'Bảo hiểm y tế quốc dân giảm phí khi thu nhập thấp',
    },
    recommendedTool: {
      name: 'Tính tiền Nenkin rút 1 lần',
      url: getToolioUrl('/#/japan-nenkin-guide'),
    },
  },
  {
    id: 'prob-renew-visa',
    statement: 'Tôi muốn đổi hoặc gia hạn visa',
    detail: 'Thời điểm nộp đơn trước 3 tháng, giấy tờ xin công ty và cách kiểm tra tiến độ hồ sơ.',
    categoryKey: 'doc',
    targetUrl: '/topics/documents',
    recommendedArticle: {
      slug: 'gia-han-visa-ky-su-truoc-3-thang',
      title: 'Gia hạn visa kỹ sư trước 3 tháng: Thủ tục và giấy tờ công ty cần cấp',
    },
    recommendedTool: {
      name: 'Tạo ảnh thẻ chuẩn hồ sơ Nyukan',
      url: getToolioUrl('/#/id-photo-studio'),
    },
  },
  {
    id: 'prob-unknown-mail',
    statement: 'Tôi không hiểu giấy tờ này gửi về nhà',
    detail: 'Cách đọc giấy báo thuế màu xanh lá, hóa đơn bảo hiểm y tế và giấy thông báo Nenkin.',
    categoryKey: 'work',
    targetUrl: '/articles/luong-30-man-thuc-nhan-bao-nhieu',
    recommendedArticle: {
      slug: 'luong-30-man-thuc-nhan-bao-nhieu',
      title: 'Lương 30 man thực nhận bao nhiêu?',
    },
    recommendedTool: null,
  },
  {
    id: 'prob-driving',
    statement: 'Tôi muốn đổi bằng lái xe ô tô Nhật',
    detail: 'Quy trình thi lý thuyết tiếng Việt 10 câu, dịch thuật bằng JAF và điều kiện 3 tháng lưu trú.',
    categoryKey: 'life',
    targetUrl: '/topics/life',
    recommendedArticle: {
      slug: 'doi-bang-lai-xe-viet-nhat',
      title: 'Đổi bằng lái xe Việt Nam sang bằng Nhật Bản (Gaimen Kirikae)',
    },
    recommendedTool: {
      name: 'Tạo ảnh thẻ sát hạch lái xe',
      url: getToolioUrl('/#/id-photo-studio'),
    },
  },
];
