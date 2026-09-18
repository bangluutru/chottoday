/**
 * Tool Taxonomy Labels
 *
 * Maps the raw Toolio snapshot fields (domain, category, subdomain, processing)
 * onto Vietnamese display labels used by the Chotto tool pages.
 *
 * The snapshot is the single source of truth for which tools exist; this file
 * only names what the snapshot already contains. Never add an entry here to
 * introduce a tool, a domain, or a category that Toolio does not expose.
 */

export const TOOL_DOMAINS = [
  {
    id: 'common',
    name: 'Tiện ích chung',
    description: 'Công cụ dùng được ở bất kỳ đâu: ảnh, PDF, văn phòng, mã QR.',
  },
  {
    id: 'japan-life',
    name: 'Đời sống Nhật Bản',
    description: 'Thuế, bảo hiểm, cư trú, nhà ở và thủ tục hành chính tại Nhật.',
  },
  {
    id: 'vietnam-life',
    name: 'Việt Nam & lãnh sự',
    description: 'Thủ tục liên quan tới giấy tờ Việt Nam và cơ quan lãnh sự.',
  },
];

export const TOOL_CATEGORIES = [
  { id: 'image', name: 'Hình ảnh' },
  { id: 'pdf', name: 'PDF & tài liệu' },
  { id: 'office', name: 'Văn phòng' },
  { id: 'utils', name: 'Tiện ích' },
];

const SUBDOMAIN_LABELS = {
  tax: 'Thuế',
  insurance: 'Bảo hiểm',
  employment: 'Việc làm',
  family: 'Gia đình',
  housing: 'Nhà ở',
  immigration: 'Cư trú & visa',
  'procedures-documents': 'Thủ tục & giấy tờ',
  navigator: 'Tra cứu thủ tục',
  'consular-vn': 'Lãnh sự Việt Nam',
};

const PROCESSING_LABELS = {
  browser: 'Xử lý trên trình duyệt',
  hybrid: 'Xử lý kết hợp',
};

const DOMAIN_BY_ID = TOOL_DOMAINS.reduce((acc, d) => {
  acc[d.id] = d;
  return acc;
}, {});

const CATEGORY_BY_ID = TOOL_CATEGORIES.reduce((acc, c) => {
  acc[c.id] = c;
  return acc;
}, {});

export function getDomainById(id) {
  return DOMAIN_BY_ID[id] || null;
}

export function getDomainLabel(id) {
  return DOMAIN_BY_ID[id]?.name || 'Công cụ';
}

export function getCategoryLabel(id) {
  return CATEGORY_BY_ID[id]?.name || 'Tiện ích';
}

export function getSubdomainLabel(id) {
  return id ? SUBDOMAIN_LABELS[id] || null : null;
}

export function getProcessingLabel(id) {
  return PROCESSING_LABELS[id] || 'Xử lý an toàn';
}
