/**
 * HOMEPAGE COMPOSITION DATA
 *
 * Curated picks for the redesigned homepage ("Chotto - Trang chu" handoff).
 * Only selection and presentation live here — titles, excerpts, reading time
 * and dates are always resolved from the article records at render time, and
 * tool names and URLs from the Toolio registry, so nothing here can drift out
 * of sync with the content layer.
 *
 * Every `toolId` below is validated by `npm run validate:tool-refs`.
 */

/**
 * "Công cụ tiện ích" — six tool tiles plus a trailing "xem thêm" tile.
 *
 * `label` / `caption` are the short two-line forms the tile layout needs; the
 * registry names ("Mô Phỏng Thuế Nhật Bản") are far too long for a 100px tile,
 * so the full name rides along as the link's accessible name instead.
 *
 * `icon` selects one of the inline glyphs in ToolShowcase; `tint` selects the
 * --cat-*-bg swatch behind it.
 */
export const HOME_TOOL_TILES = [
  {
    toolId: 'japan-tax-simulator',
    label: 'Tính thuế\nthu nhập',
    caption: 'Ước tính thực nhận',
    icon: 'calculator',
    tint: 'life',
  },
  {
    toolId: 'moving-cost-jp',
    label: 'Chi phí\nchuyển nhà',
    caption: 'Trọn gói theo mùa',
    icon: 'truck',
    tint: 'tool',
  },
  {
    toolId: 'national-pension-jp',
    label: 'Tính nenkin',
    caption: 'Đóng & nhận bao nhiêu?',
    icon: 'shield',
    tint: 'life',
  },
  {
    toolId: 'social-insurance-jp',
    label: 'Bảo hiểm\nxã hội',
    caption: 'Theo 47 tỉnh thành',
    icon: 'life',
    tint: 'health',
  },
  {
    toolId: 'residence-renewal-guide-jp',
    label: 'Gia hạn\nlưu trú',
    caption: 'Hạn nộp & lệ phí',
    icon: 'doc',
    tint: 'doc',
  },
  {
    toolId: 'child-allowance-jp',
    label: 'Trợ cấp\ntrẻ em',
    caption: 'Nhận bao nhiêu?',
    icon: 'jar',
    tint: 'work',
  },
];

/**
 * "Bài viết mới nhất" — four cards.
 *
 * `image` overrides the article's own coverImage, which is currently a shared
 * placeholder for every record. `chipLabel` / `chipPalette` reproduce the
 * design's chips, which are narrower than the full category names.
 */
export const HOME_ARTICLE_CARDS = [
  {
    slug: 'luong-30-man-thuc-nhan-bao-nhieu',
    image: '/images/featured/salary-30man.jpg',
    imageAlt: 'Bảng lương và máy tính trên bàn gỗ',
    chipLabel: 'Tiền & Thuế',
    chipPalette: 'work',
  },
  {
    slug: 'mau-cau-tieng-nhat-shiyakusho-buu-dien',
    image: '/images/thumbs/thumb-school.jpg',
    imageAlt: 'Học sinh tiểu học Nhật Bản đi trên đường làng',
    chipLabel: 'Tiếng Nhật',
    chipPalette: 'work',
  },
  {
    slug: 'doi-bang-lai-xe-viet-nhat',
    image: '/images/thumbs/thumb-train.jpg',
    imageAlt: 'Ga tàu Shibuya vào buổi sáng',
    chipLabel: 'Đi lại',
    chipPalette: 'doc',
  },
  {
    slug: 'di-kham-benh-tu-vung-trieu-chung',
    image: '/images/thumbs/thumb-clinic.jpg',
    imageAlt: 'Quầy tiếp nhận của phòng khám tại Nhật',
    chipLabel: 'Sức khỏe',
    chipPalette: 'tool',
  },
];

/** "Có thể bạn đang quan tâm" — five ranked links, titles resolved by slug. */
export const HOME_INTEREST_SLUGS = [
  'luong-30-man-thuc-nhan-bao-nhieu',
  'bao-hiem-y-te-quoc-dan-giam-phi',
  'doi-bang-lai-xe-viet-nhat',
  'mat-the-zairyu-thi-lam-gi',
  'mau-cau-tieng-nhat-shiyakusho-buu-dien',
];

/** Hero quick-search chips. */
export const HOME_SEARCH_CHIPS = [
  'Thuế',
  'Nenkin',
  'Đổi bằng lái',
  'Nhà ở',
  'Trường học',
  'Việc làm',
  'Khám bệnh',
];
