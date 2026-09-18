/**
 * Category URL & Semantic Taxonomy Mapping
 *
 * Maps URL topic slugs directly to existing Phase 1 tokens and IDs.
 * Preserves the single taxonomy without duplicating categories.
 * All relatedToolIds strictly resolve against the Toolio compatibility snapshot.
 *
 * HOMEPAGE PRESENTATION FIELDS
 * The redesigned homepage shows seven topic cards with its own shorter labels.
 * Those live here as presentation-only fields so the grid stays data-driven:
 *
 *   homeOrder    Position in the homepage grid. Absent => not shown on home.
 *                (`study` and `tool` are routable but stay off the grid — the
 *                homepage surfaces tools through its own "Công cụ tiện ích"
 *                panel instead.)
 *   homeLabel    Card title. Shorter than `name`, which remains the canonical
 *                label used by /topics pages, SEO metadata and the sitemap.
 *   homeTagline  One-line card description.
 *   homePalette  Which --cat-*-* token family tints the card. Usually the
 *                category's own colorKey; the design deliberately reuses the
 *                coral family for two cards, so this is kept separate.
 *   homeIcon     Overrides `icon` for the homepage card only, where the grid
 *                needs a distinct glyph (e.g. work shows a coin on the home
 *                grid so it does not repeat the briefcase used by `job`).
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
    homeOrder: 7,
    homeLabel: 'Cuộc sống',
    homeTagline: 'Nhà ở, đi lại, mua sắm hằng ngày…',
    homePalette: 'health',
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
    homeOrder: 2,
    homeLabel: 'Thủ tục & Giấy tờ',
    homeTagline: 'Visa, thẻ cư trú, bảo hiểm…',
    homePalette: 'health',
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
    homeIcon: '/icons/icon-money.svg',
    homeOrder: 3,
    homeLabel: 'Tiền & Thuế',
    homeTagline: 'Lương, thuế, nenkin, trợ cấp…',
    homePalette: 'study',
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
    homeOrder: 6,
    homeLabel: 'Sức khỏe',
    homeTagline: 'Khám bệnh, bảo hiểm, phòng bệnh…',
    homePalette: 'tool',
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
  {
    id: 'newcomer',
    slug: 'newcomer',
    path: '/topics/newcomer',
    name: 'Mới sang Nhật',
    shortName: 'Mới sang',
    description: 'Lộ trình 14 ngày đầu tại Nhật: đăng ký cư trú ở Shiyakusho, My Number, mở tài khoản ngân hàng, đăng ký điện nước và SIM.',
    icon: '/icons/icon-study.svg',
    colorKey: 'life',
    accentToken: 'var(--cat-life-accent)',
    bgToken: 'var(--cat-life-bg)',
    textToken: 'var(--cat-life-text)',
    borderToken: 'var(--cat-life-border)',
    relatedToolIds: ['arriving-in-japan-wizard-jp', 'address-change-checklist-jp', 'mynumber-procedure-guide-jp'],
    homeOrder: 1,
    homeLabel: 'Mới sang Nhật',
    homeTagline: 'Những điều cần biết khi bắt đầu',
    homePalette: 'life',
    availableTags: ['Tất cả', 'Thủ tục 14 ngày', 'Đăng ký cư trú', 'My Number', 'Ngân hàng', 'SIM & Internet'],
  },
  {
    id: 'job',
    slug: 'jobs',
    path: '/topics/jobs',
    name: 'Công việc',
    shortName: 'Công việc',
    description: 'Tìm việc và chuyển việc tại Nhật, phạm vi làm việc được phép theo tư cách lưu trú, thủ tục nghỉ việc và trợ cấp thất nghiệp.',
    icon: '/icons/icon-work.svg',
    colorKey: 'doc',
    accentToken: 'var(--cat-doc-accent)',
    bgToken: 'var(--cat-doc-bg)',
    textToken: 'var(--cat-doc-text)',
    borderToken: 'var(--cat-doc-border)',
    relatedToolIds: ['work-scope-checker-jp', 'leaving-job-wizard-jp', 'unemployment-benefit-jp', 'overtime-calculator-jp'],
    homeOrder: 4,
    homeLabel: 'Công việc',
    homeTagline: 'Tìm việc, chuyển việc, quyền lợi…',
    homePalette: 'doc',
    availableTags: ['Tất cả', 'Tìm việc', 'Chuyển việc', 'Nghỉ việc', 'Làm thêm giờ', 'Thất nghiệp'],
  },
  {
    id: 'family',
    slug: 'family',
    path: '/topics/family',
    name: 'Gia đình & Giáo dục',
    shortName: 'Gia đình',
    description: 'Sinh con và nuôi con tại Nhật, trợ cấp trẻ em, nghỉ chăm con, thủ tục xin học mẫu giáo và tiểu học cho con.',
    icon: '/icons/icon-study.svg',
    colorKey: 'work',
    accentToken: 'var(--cat-work-accent)',
    bgToken: 'var(--cat-work-bg)',
    textToken: 'var(--cat-work-text)',
    borderToken: 'var(--cat-work-border)',
    relatedToolIds: ['child-allowance-jp', 'childcare-benefit-jp', 'maternity-allowance-jp', 'birth-wizard-jp'],
    homeIcon: '/icons/icon-family.svg',
    homeOrder: 5,
    homeLabel: 'Gia đình & Giáo dục',
    homeTagline: 'Trường học, y tế, nuôi dạy con…',
    homePalette: 'work',
    availableTags: ['Tất cả', 'Sinh con', 'Trợ cấp trẻ em', 'Nhà trẻ & Mẫu giáo', 'Tiểu học', 'Nghỉ chăm con'],
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

/**
 * The seven topic cards shown on the homepage grid, in design order.
 * Categories without a `homeOrder` (study, tool) stay routable and keep
 * appearing in the mobile menu and the articles index filter.
 */
export function getHomeCategories() {
  return CATEGORY_DEFINITIONS
    .filter((cat) => typeof cat.homeOrder === 'number')
    .sort((a, b) => a.homeOrder - b.homeOrder);
}
