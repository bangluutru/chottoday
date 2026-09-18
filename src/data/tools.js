/**
 * TOOL CATALOGUE — /tools and /tools/:slug
 *
 * Selection and presentation only. Names, descriptions and destination URLs of
 * Toolio-hosted tools are always resolved from the registry at render time
 * (`src/services/toolRegistry`), so nothing here can drift out of sync with
 * Toolio. Every `toolId` below is validated by `npm run validate:tool-refs`.
 *
 * Two kinds of entry:
 *
 *   toolId      A Toolio miniapp. The card opens the Toolio deep link; there is
 *               no ChottoDay page for it.
 *   calculator  A calculator that runs on chottoday.com itself, rendered by
 *               `ToolDetailPage` at /tools/<slug>. These carry their own name
 *               and description because the registry knows nothing about them.
 *
 * `category` must be one of TOOL_CATEGORIES; `tint` selects a --cat-*-bg
 * swatch for the icon box and the category chip.
 */

export const TOOL_CATEGORIES = [
  'Tất cả',
  'Tiền & Thuế',
  'Cuộc sống',
  'Thủ tục',
  'Công việc',
  'Gia đình',
];

export const TOOL_CATALOGUE = [
  {
    slug: 'luong-thuc-nhan',
    calculator: 'net-salary',
    name: 'Tính lương thực nhận',
    description:
      'Nhập lương trước thuế, xem ngay tiền về tay mỗi tháng và các khoản bị trừ.',
    category: 'Tiền & Thuế',
    meta: 'Phổ biến nhất',
    icon: '/icons/icon-tool.svg',
    tint: 'tool',
    // Articles whose "dùng công cụ" card should point here rather than at a
    // Toolio miniapp. Validated by `npm run validate:tool-refs`.
    articleSlugs: ['luong-30-man-thuc-nhan-bao-nhieu'],
  },
  {
    slug: 'mo-phong-thue-nhat-ban',
    toolId: 'japan-tax-simulator',
    category: 'Tiền & Thuế',
    meta: 'Cập nhật 2026',
    icon: '/icons/icon-doc.svg',
    tint: 'study',
  },
  {
    slug: 'tinh-nenkin',
    toolId: 'national-pension-jp',
    category: 'Tiền & Thuế',
    meta: 'Có bảng tra',
    icon: '/icons/icon-money.svg',
    tint: 'life',
  },
  {
    slug: 'bao-hiem-xa-hoi',
    toolId: 'social-insurance-jp',
    category: 'Tiền & Thuế',
    meta: '47 tỉnh thành',
    icon: '/icons/icon-health.svg',
    tint: 'health',
  },
  {
    slug: 'chi-phi-chuyen-nha',
    toolId: 'moving-cost-jp',
    category: 'Cuộc sống',
    meta: 'Gồm phí ban đầu',
    icon: '/icons/icon-life.svg',
    tint: 'work',
  },
  {
    slug: 'doi-dia-chi',
    toolId: 'address-change-checklist-jp',
    category: 'Cuộc sống',
    meta: 'Checklist',
    icon: '/icons/icon-doc.svg',
    tint: 'doc',
  },
  {
    slug: 'gia-han-luu-tru',
    toolId: 'residence-renewal-guide-jp',
    category: 'Thủ tục',
    meta: 'Theo tư cách',
    icon: '/icons/icon-doc.svg',
    tint: 'doc',
  },
  {
    slug: 'thu-tuc-my-number',
    toolId: 'mynumber-procedure-guide-jp',
    category: 'Thủ tục',
    meta: 'Từng bước',
    icon: '/icons/icon-study.svg',
    tint: 'study',
  },
  {
    slug: 'moi-sang-nhat',
    toolId: 'arriving-in-japan-wizard-jp',
    category: 'Thủ tục',
    meta: '14 ngày đầu',
    icon: '/icons/icon-study.svg',
    tint: 'life',
  },
  {
    slug: 'tro-cap-that-nghiep',
    toolId: 'unemployment-benefit-jp',
    category: 'Công việc',
    meta: 'Hellowork',
    icon: '/icons/icon-work.svg',
    tint: 'life',
  },
  {
    slug: 'luong-lam-them-gio',
    toolId: 'overtime-calculator-jp',
    category: 'Công việc',
    meta: 'Quy đổi nhanh',
    icon: '/icons/icon-work.svg',
    tint: 'doc',
  },
  {
    slug: 'tro-cap-tre-em',
    toolId: 'child-allowance-jp',
    category: 'Gia đình',
    meta: 'Có trợ cấp',
    icon: '/icons/icon-family.svg',
    tint: 'work',
  },
];

/** Category chip palette: which --cat-* family tints each catalogue category. */
export const TOOL_CATEGORY_TINT = {
  'Tiền & Thuế': 'study',
  'Cuộc sống': 'health',
  'Thủ tục': 'doc',
  'Công việc': 'life',
  'Gia đình': 'work',
};

export function getToolCatalogueEntry(slug) {
  return TOOL_CATALOGUE.find((entry) => entry.slug === slug) || null;
}

/** Catalogue entries that ChottoDay renders itself at /tools/:slug. */
export function getInternalTools() {
  return TOOL_CATALOGUE.filter((entry) => Boolean(entry.calculator));
}

/**
 * The Chotto-hosted tool that belongs to an article, if any.
 * Articles without one fall back to their first `relatedToolIds` entry.
 */
export function getToolForArticle(articleSlug) {
  return (
    TOOL_CATALOGUE.find((entry) => (entry.articleSlugs || []).includes(articleSlug)) || null
  );
}
