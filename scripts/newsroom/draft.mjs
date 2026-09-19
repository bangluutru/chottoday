/**
 * Newsroom — soạn bản nháp bài viết từ một thông báo của cơ quan Nhật.
 *
 * Ranh giới quan trọng nhất của file này: nó soạn BẢN NHÁP, không soạn bài
 * xuất bản. Nội dung ở đây nói về visa, thuế, bảo hiểm và hạn chót thủ tục —
 * sai một con số là người đọc lỡ việc thật. Nên:
 *
 *   - status luôn là 'review', không bao giờ 'published';
 *   - nguồn là URL thật đã fetch, kèm ngày truy cập, không do model bịa;
 *   - model được yêu cầu chỉ viết lại điều nguồn đã nói, và liệt kê rõ những
 *     chỗ nó KHÔNG chắc vào needsVerification để người duyệt biết mà tra.
 *
 * Người duyệt đổi status sang 'published' — không có đường nào khác, vì
 * validate-content.mjs đòi khối review có người ký tên.
 */

import Anthropic from '@anthropic-ai/sdk';

export const DRAFT_MODEL = 'claude-opus-5';
const MAX_TOKENS = 16000;

/**
 * Phần hướng dẫn cố định. Để riêng và đánh dấu cache được: một buổi sáng soạn
 * 5–10 tin thì phần này lặp y hệt, cache lại rẻ hơn nhiều so với gửi lại.
 */
export function buildSystemPrompt() {
  return `Bạn soạn bản nháp bài hướng dẫn cho Chotto — trang thông tin tiếng Việt cho người Việt sinh sống, học tập và làm việc tại Nhật Bản.

ĐỘC GIẢ
Người Việt ở Nhật, phần lớn không đọc được thông báo hành chính tiếng Nhật. Họ cần biết: chuyện gì đang đổi, có ảnh hưởng tới mình không, và phải làm gì.

NGUYÊN TẮC BẮT BUỘC
1. Chỉ viết lại điều nguồn đã nói. Tuyệt đối không thêm số liệu, mốc thời gian, mức phí hay điều kiện mà nguồn không nêu.
2. Không chắc thì không viết. Mọi chỗ còn mơ hồ phải đưa vào needsVerification, không được đoán cho trôi câu.
3. Không hứa thay cơ quan nhà nước. Viết "theo thông báo của ..." thay vì khẳng định trống không.
4. Nêu rõ phạm vi áp dụng khi nguồn có nói: áp dụng cho tư cách lưu trú nào, tỉnh nào, từ ngày nào.
5. Đây là cẩm nang tham khảo, không phải tư vấn pháp lý. Không viết như thể thay được cơ quan có thẩm quyền.

GIỌNG VĂN
Tiếng Việt tự nhiên, câu ngắn, không dịch máy. Thuật ngữ tiếng Nhật giữ nguyên kèm giải thích ngắn trong ngoặc ở lần xuất hiện đầu — ví dụ: 在留カード (thẻ cư trú). Không dùng giọng giật gân, không dùng emoji.`;
}

/**
 * Schema cho structured output. Các trường ánh xạ thẳng sang bản ghi bài viết
 * trong articlesList.js, trừ phần nguồn và review — hai thứ đó do code điền từ
 * dữ liệu thật, không để model đụng vào.
 */
export const DRAFT_SCHEMA = {
  type: 'object',
  properties: {
    title: {
      type: 'string',
      description: 'Tiêu đề tiếng Việt, tối đa 70 ký tự, nói đúng việc đang đổi',
    },
    excerpt: {
      type: 'string',
      description: 'Tóm tắt 1–2 câu, trả lời "chuyện gì và ảnh hưởng tới ai"',
    },
    category: {
      type: 'string',
      enum: ['life', 'doc', 'work', 'health', 'study', 'tool', 'newcomer', 'job', 'family'],
    },
    shortAnswer: {
      type: 'string',
      description: 'Câu trả lời ngắn cho người đang vội, tối đa 3 câu',
    },
    keyTakeaways: {
      type: 'array',
      items: { type: 'string' },
      description: '3–5 ý chính, mỗi ý một câu',
    },
    body: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          heading: { type: 'string' },
          paragraphs: { type: 'array', items: { type: 'string' } },
        },
        required: ['heading', 'paragraphs'],
        additionalProperties: false,
      },
      description: '2–4 phần nội dung',
    },
    applicability: {
      type: 'string',
      description: 'Áp dụng cho ai, ở đâu, từ khi nào — theo đúng điều nguồn nêu',
    },
    needsVerification: {
      type: 'array',
      items: { type: 'string' },
      description:
        'Những điểm người duyệt phải tự tra lại trước khi xuất bản. Để mảng rỗng chỉ khi thật sự không còn gì mơ hồ.',
    },
    fanpageCaption: {
      type: 'string',
      description:
        'Caption đăng fanpage, 3–6 câu, kết bằng lời mời đọc bài đầy đủ. Không hashtag, không emoji.',
    },
  },
  required: [
    'title', 'excerpt', 'category', 'shortAnswer', 'keyTakeaways',
    'body', 'applicability', 'needsVerification', 'fanpageCaption',
  ],
  additionalProperties: false,
};

export function buildUserContent(item, sourceBody = '') {
  return [
    `NGUỒN: ${item.organization || item.sourceId || 'không rõ'}`,
    `URL: ${item.url}`,
    `NGÀY ĐĂNG: ${item.publishedAt || 'nguồn không ghi'}`,
    `TIÊU ĐỀ GỐC: ${item.title}`,
    '',
    'NỘI DUNG THÔNG BÁO:',
    sourceBody || '(không lấy được phần thân, chỉ có tiêu đề — hãy viết rất dè dặt và đưa gần như mọi chi tiết vào needsVerification)',
  ].join('\n');
}

/** Slug ASCII từ tiêu đề tiếng Việt, khớp luật slug của validate-content.mjs. */
export function slugify(title) {
  return title
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/g, '');
}

/**
 * Ghép kết quả của model với dữ liệu thật thành bản ghi bài viết.
 *
 * Hàm thuần, không gọi mạng — nên test được, và đây là chỗ đáng test nhất:
 * nó quyết định status, nguồn và khối review, tức là ba thứ mà
 * validate-content.mjs dựa vào để chặn bài chưa kiểm chứng.
 */
export function toArticleRecord(drafted, item, source, today) {
  const slug = slugify(drafted.title);
  const accessedAt = today.slice(0, 10);

  // reviewAfter: 90 ngày. Thông báo hành chính Nhật đổi theo năm tài khoá,
  // ba tháng là khoảng đủ để bắt kịp đợt sửa kế tiếp.
  const reviewAfter = new Date(new Date(accessedAt).getTime() + 90 * 86_400_000)
    .toISOString()
    .slice(0, 10);

  return {
    id: `news-${accessedAt}-${slug}`.slice(0, 80),
    slug,
    title: drafted.title,
    excerpt: drafted.excerpt,
    category: drafted.category,
    tags: [],
    publishedAt: accessedAt,
    updatedAt: accessedAt,
    readingTime: Math.max(2, Math.ceil(
      drafted.body.reduce((n, s) => n + s.paragraphs.join(' ').split(/\s+/).length, 0) / 200
    )),
    author: { name: 'Ban Biên Tập Chotto' },
    // Không bao giờ 'published'. Người duyệt tự đổi sau khi tra nguồn.
    status: 'review',
    applicability: drafted.applicability,
    shortAnswer: drafted.shortAnswer,
    keyTakeaways: drafted.keyTakeaways,
    sections: drafted.body.map((section) => ({
      type: 'text',
      heading: section.heading,
      paragraphs: section.paragraphs,
    })),
    // Nguồn dựng từ dữ liệu fetch thật, model không chạm vào.
    sources: [
      {
        id: 'src-1',
        organization: source.organization,
        title: item.title,
        url: item.url,
        accessedAt,
        type: source.kind === 'official' ? 'government' : 'media',
      },
    ],
    review: {
      lastVerifiedAt: accessedAt,
      reviewAfter,
      reviewer: 'CHƯA DUYỆT — người duyệt điền tên vào đây',
    },
    relatedArticleIds: [],
    relatedToolIds: [],
    seo: {
      metaTitle: drafted.title,
      metaDescription: drafted.excerpt.slice(0, 160),
    },
    // Không thuộc schema bài viết; dùng cho file caption rồi bỏ đi.
    _needsVerification: drafted.needsVerification,
    _fanpageCaption: drafted.fanpageCaption,
  };
}

/** Caption kèm link bài và cảnh báo những chỗ chưa kiểm chứng. */
export function buildCaption(record, siteUrl = 'https://chottoday.com') {
  const lines = [
    record._fanpageCaption.trim(),
    '',
    `Đọc đầy đủ: ${siteUrl}/articles/${record.slug}`,
    `Nguồn: ${record.sources[0].organization}`,
  ];

  if (record._needsVerification?.length) {
    lines.push(
      '',
      '--- CHƯA ĐĂNG ĐƯỢC NGAY, TRA LẠI NHỮNG Ý SAU ---',
      ...record._needsVerification.map((point) => `- ${point}`)
    );
  }
  return lines.join('\n');
}

/**
 * Gọi Claude soạn một bản nháp.
 *
 * Phần cố định của prompt được đánh dấu cache: một buổi sáng soạn nhiều tin
 * thì chỉ trả tiền đầy đủ cho lần đầu.
 */
export async function draftArticle(item, source, sourceBody, { client, today } = {}) {
  const anthropic = client || new Anthropic();

  const response = await anthropic.messages.create({
    model: DRAFT_MODEL,
    max_tokens: MAX_TOKENS,
    thinking: { type: 'adaptive' },
    output_config: {
      effort: 'high',
      format: { type: 'json_schema', schema: DRAFT_SCHEMA },
    },
    system: [
      {
        type: 'text',
        text: buildSystemPrompt(),
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [{ role: 'user', content: buildUserContent({ ...item, organization: source.organization }, sourceBody) }],
  });

  if (response.stop_reason === 'refusal') {
    throw new Error(
      `Model từ chối soạn tin này (${response.stop_details?.category ?? 'không rõ lý do'}): ${item.url}`
    );
  }

  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock) {
    throw new Error(`Không có nội dung trả về cho: ${item.url}`);
  }

  const drafted = JSON.parse(textBlock.text);
  return {
    record: toArticleRecord(drafted, item, source, today || new Date().toISOString()),
    usage: response.usage,
  };
}
