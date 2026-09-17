/**
 * Category URL & Semantic Taxonomy Mapping
 * 
 * Maps URL topic slugs directly to existing Phase 1 tokens and IDs.
 * Preserves the single taxonomy without duplicating categories.
 * All relatedToolIds strictly resolve against the Toolio compatibility snapshot.
 */

export const CATEGORY_DEFINITIONS = [
  {
    id: 'life',
    slug: 'life',
    path: '/topics/life',
    name: 'Đời sống & nhà ở',
    shortName: 'Đời sống',
    description: 'Hướng dẫn thuê nhà, hợp đồng, phân loại rác, giao tiếp hàng xóm và tiện ích sinh hoạt tại Nhật Bản.',
    icon: '/icons/icon-life.svg',
    colorKey: 'life',
    accentToken: 'var(--cat-life-accent)',
    bgToken: 'var(--cat-life-bg)',
    textToken: 'var(--cat-life-text)',
    borderToken: 'var(--cat-life-border)',
    relatedToolIds: ['moving-cost-jp', 'address-change-checklist-jp', 'barcode-qr'],
    availableTags: ['Tất cả', 'Thuê nhà', 'Hợp đồng', 'Rác & Vứt đồ', 'Bằng lái xe', 'Điện nước'],
  },
  {
    id: 'doc',
    slug: 'documents',
    path: '/topics/documents',
    name: 'Giấy tờ & hành chính',
    shortName: 'Giấy tờ',
    description: 'Thủ tục visa, thẻ cư trú (Zairyu), đăng ký địa chỉ Shiyakusho, My Number và thủ tục hành chính thiết yếu.',
    icon: '/icons/icon-doc.svg',
    colorKey: 'doc',
    accentToken: 'var(--cat-doc-accent)',
    bgToken: 'var(--cat-doc-bg)',
    textToken: 'var(--cat-doc-text)',
    borderToken: 'var(--cat-doc-border)',
    relatedToolIds: ['id-photo-studio', 'official-form-helper-jp', 'procedure-requirement-checker-jp'],
    availableTags: ['Tất cả', 'Visa & Nyukan', 'Thẻ cư trú', 'My Number', 'Shiyakusho', 'Hộ chiếu'],
  },
  {
    id: 'work',
    slug: 'work-money',
    path: '/topics/work-money',
    name: 'Việc làm & tiền',
    shortName: 'Việc làm & Tiền',
    description: 'Hợp đồng lao động, cách tính thuế thu nhập, thuế thị dân, hoàn thuế cuối năm, tiền Nenkin và chuyển tiền về nước.',
    icon: '/icons/icon-work.svg',
    colorKey: 'work',
    accentToken: 'var(--cat-work-accent)',
    bgToken: 'var(--cat-work-bg)',
    textToken: 'var(--cat-work-text)',
    borderToken: 'var(--cat-work-border)',
    relatedToolIds: ['japan-tax-simulator', 'social-insurance-jp', 'invoice-studio'],
    availableTags: ['Tất cả', 'Lương thực nhận', 'Thuế thu nhập', 'Nenkin', 'Khai thuế', 'Chuyển tiền'],
  },
  {
    id: 'health',
    slug: 'health',
    path: '/topics/health',
    name: 'Sức khoẻ & khẩn cấp',
    shortName: 'Sức khoẻ',
    description: 'Bảo hiểm y tế quốc dân (Kokumin Kenko Hoken), đi khám bệnh, từ vựng triệu chứng và số điện thoại cấp cứu.',
    icon: '/icons/icon-health.svg',
    colorKey: 'health',
    accentToken: 'var(--cat-health-accent)',
    bgToken: 'var(--cat-health-bg)',
    textToken: 'var(--cat-health-text)',
    borderToken: 'var(--cat-health-border)',
    relatedToolIds: ['social-insurance-jp', 'maternity-allowance-jp'],
    availableTags: ['Tất cả', 'Bảo hiểm y tế', 'Khám bệnh', 'Từ vựng y tế', 'Cấp cứu', 'Thuốc'],
  },
  {
    id: 'study',
    slug: 'study',
    path: '/topics/study',
    name: 'Tiếng Nhật & học tập',
    shortName: 'Tiếng Nhật',
    description: 'Mẫu câu giao tiếp thực tế tại cơ quan hành chính, từ vựng giấy tờ công vụ, thi cử và hòa nhập cuộc sống.',
    icon: '/icons/icon-study.svg',
    colorKey: 'study',
    accentToken: 'var(--cat-study-accent)',
    bgToken: 'var(--cat-study-bg)',
    textToken: 'var(--cat-study-text)',
    borderToken: 'var(--cat-study-border)',
    relatedToolIds: ['id-photo-studio', 'administrative-navigator-jp'],
    availableTags: ['Tất cả', 'Mẫu câu Shiyakusho', 'Từ vựng hành chính', 'Đổi bằng lái', 'Thi cử'],
  },
  {
    id: 'tool',
    slug: 'tools',
    path: '/topics/tools',
    name: 'Công cụ Chotto',
    shortName: 'Công cụ',
    description: 'Cổng kết nối các miniapps thực hành độc lập trên Toolio: tính thuế, tính Nenkin, tạo ảnh thẻ combini và hóa đơn.',
    icon: '/icons/icon-tool.svg',
    colorKey: 'tool',
    accentToken: 'var(--cat-tool-accent)',
    bgToken: 'var(--cat-tool-bg)',
    textToken: 'var(--cat-tool-text)',
    borderToken: 'var(--cat-tool-border)',
    relatedToolIds: ['japan-tax-simulator', 'social-insurance-jp', 'id-photo-studio', 'invoice-studio', 'pdf-toolkit'],
    availableTags: ['Tất cả', 'Tính toán thuế', 'Hồ sơ thẻ', 'Nenkin', 'Hóa đơn'],
  },
];

// Helper lookups
export const CATEGORY_BY_SLUG = CATEGORY_DEFINITIONS.reduce((acc, cat) => {
  acc[cat.slug] = cat;
  return acc;
}, {});

export const CATEGORY_BY_ID = CATEGORY_DEFINITIONS.reduce((acc, cat) => {
  acc[cat.id] = cat;
  return acc;
}, {});

export function getCategoryBySlug(slug) {
  return CATEGORY_BY_SLUG[slug] || null;
}

export function getCategoryById(id) {
  return CATEGORY_BY_ID[id] || null;
}

export function getAllCategories() {
  return CATEGORY_DEFINITIONS;
}
