/**
 * Newsroom — soạn bản nháp bài viết từ một thông báo của cơ quan Nhật.
 *
 * Gọi model qua API tương thích OpenAI. Tên model và endpoint đều lấy từ biến
 * môi trường (NEWSROOM_MODEL, OPENAI_BASE_URL) nên đổi nhà cung cấp không phải
 * sửa file này.
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

import OpenAI from 'openai';

/**
 * Tên model đọc từ biến môi trường, không hardcode.
 *
 * Lý do: model dùng ở đây không phải model phổ thông, và nhà cung cấp có thể
 * đổi tên hoặc phiên bản mà không báo trước. Để trong env thì đổi model là sửa
 * một biến, không phải sửa code rồi mở PR.
 */
export const DRAFT_MODEL = process.env.NEWSROOM_MODEL || 'gpt-5.6-luna';
const MAX_TOKENS = 16000;

/**
 * Tạo client. Hỗ trợ OPENAI_BASE_URL để trỏ sang gateway tương thích OpenAI —
 * cần thiết khi model không nằm trên endpoint mặc định của OpenAI.
 */
export function createClient() {
  const baseURL = process.env.OPENAI_BASE_URL;
  return new OpenAI(baseURL ? { baseURL } : {});
}

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

/**
 * VÒNG SÀNG — model tự quyết tin nào đáng soạn, chạy TRƯỚC khi soạn.
 *
 * Vì sao cần một tầng nữa, sau xếp hạng và sau cổng đủ chất: hai tầng kia
 * không đo được "có ích cho ai". Lần chạy thật thứ tư đẩy lên đầu bảng, 9.8
 * điểm, tin 【東京出入国在留管理局】入国警備官（公安職）の選考採用募集中です！
 * — thông báo tuyển công chức làm nhân viên cảnh bị nhập cảnh. Tin thật, có
 * ngày thật, nguồn chính thống thật, đầy văn xuôi thật. Nó khớp 入国, 在留,
 * 募集 nên điểm cao. Và nó hoàn toàn vô dụng với người Việt đang sống ở Nhật.
 *
 * Đó là lần thứ ba cùng một lớp lỗi: bộ đếm từ khoá bắt đúng CHỮ mà trượt
 * đúng Ý (trước đó là H-1B, rồi trang điều hướng). Thêm từ khoá loại trừ chỉ
 * chặn được đúng loại rác vừa gặp; loại rác sau lại lọt. Nên hỏi thẳng model
 * một câu mà bộ đếm từ khoá không bao giờ trả lời được.
 *
 * Một lệnh gọi cho cả danh sách, chỉ tiêu đề — rẻ hơn nhiều so với soạn một
 * bài rác rồi vứt.
 */
export const SCREEN_SCHEMA = {
  type: 'object',
  properties: {
    decisions: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          index: { type: 'integer', description: 'Số thứ tự của tin trong danh sách' },
          keep: { type: 'boolean', description: 'true nếu tin này đáng soạn cho độc giả Chotto' },
          reason: { type: 'string', description: 'Một câu ngắn, vì sao giữ hoặc vì sao bỏ' },
        },
        required: ['index', 'keep', 'reason'],
        additionalProperties: false,
      },
    },
  },
  required: ['decisions'],
  additionalProperties: false,
};

export function buildScreenSystemPrompt() {
  return `Bạn sàng tin cho Chotto — trang thông tin tiếng Việt cho người Việt đang sinh sống, học tập và làm việc tại Nhật Bản.

Bạn nhận một danh sách tiêu đề thông báo (phần lớn tiếng Nhật) đã qua lọc máy. Với TỪNG tin, quyết định: người Việt bình thường đang sống ở Nhật có cần biết tin này không?

GIỮ khi tin ảnh hưởng tới đời sống hoặc thủ tục của cư dân:
- tư cách lưu trú, visa, thẻ cư trú, thủ tục nhập cư, nhập tịch
- thuế, lương, bảo hiểm xã hội, hưu trí, bảo hiểm y tế
- quyền lợi lao động, hợp đồng, tai nạn lao động, thất nghiệp
- y tế, tiêm chủng, dịch bệnh
- nhà ở, điện nước, rác, bằng lái, thủ tục hành chính địa phương
- trợ cấp, nuôi con, học hành
- thiên tai và an toàn
- thay đổi giá cả, chính sách ảnh hưởng tới túi tiền

BỎ khi tin không phải việc của cư dân, dù tiêu đề có đầy từ khoá nhập cư hay lao động:
- tuyển dụng công chức, thông báo thi tuyển vào cơ quan nhà nước
- tài liệu kỹ thuật nội bộ: đặc tả hệ thống, bảng mã, định dạng dữ liệu, hướng dẫn cho nhà cung cấp phần mềm
- đấu thầu, mua sắm công, thông báo hợp đồng
- thống kê, báo cáo nghiên cứu không kèm việc gì cư dân phải làm
- hội thảo, sự kiện dành cho giới chuyên môn
- tin nội bộ của cơ quan: bổ nhiệm, cơ cấu tổ chức, lịch làm việc
- tin về nước khác, hoặc về người Nhật ra nước ngoài

Khi phân vân giữa giữ và bỏ, hãy GIỮ — người duyệt còn đọc lại, còn tin bị bỏ thì không ai thấy nữa.

Trả lời cho ĐỦ mọi tin trong danh sách, đúng số thứ tự đã cho.`;
}

export function buildScreenUserContent(items) {
  return [
    'DANH SÁCH TIN CẦN SÀNG:',
    '',
    ...items.map((item, i) =>
      `${i + 1}. [${item.organization || item.sourceId || '?'}] ${item.title}`
    ),
  ].join('\n');
}

/**
 * Gọi model sàng danh sách. Trả về mảng quyết định theo đúng thứ tự đầu vào.
 *
 * HỎNG THÌ GIỮ HẾT, không phải bỏ hết. Một lỗi mạng mà làm cả buổi sáng ra 0
 * bài thì nhìn y hệt "hôm nay không có tin đáng viết" — tức là lỗi tự giấu
 * mình, đúng kiểu đã mất một vòng chạy để phát hiện ở chỗ nguồn 0 tin. Giữ
 * hết thì cùng lắm người duyệt đọc phải vài bài rác, và log nói rõ vì sao.
 */
export async function screenItems(items, { client, today } = {}) {
  if (items.length === 0) return { decisions: [], usage: null, failed: null };

  const openai = client || createClient();
  try {
    const response = await createCompletion(openai, {
      model: DRAFT_MODEL,
      messages: [
        { role: 'system', content: buildScreenSystemPrompt() },
        { role: 'user', content: buildScreenUserContent(items) },
      ],
      response_format: {
        type: 'json_schema',
        json_schema: { name: 'chotto_screen', schema: SCREEN_SCHEMA, strict: true },
      },
    });

    const content = response.choices?.[0]?.message?.content;
    if (!content) throw new Error('vòng sàng không trả về nội dung');

    const parsed = JSON.parse(content);
    const byIndex = new Map();
    for (const d of parsed.decisions || []) {
      byIndex.set(Number(d.index), d);
    }

    // Tin model quên nhắc tới thì GIỮ, cùng lý do như trên.
    const decisions = items.map((item, i) => {
      const d = byIndex.get(i + 1);
      if (!d) return { keep: true, reason: 'vòng sàng không nhắc tới tin này — giữ lại cho chắc' };
      return { keep: Boolean(d.keep), reason: String(d.reason || '') };
    });

    return { decisions, usage: response.usage, failed: null };
  } catch (error) {
    const why = error?.message || String(error);
    return {
      decisions: items.map(() => ({ keep: true, reason: `vòng sàng hỏng (${why}) — giữ lại` })),
      usage: null,
      failed: why,
    };
  }
}

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
 * Gửi request, tự xử lý khác biệt tên tham số giới hạn độ dài.
 *
 * Dòng model mới của OpenAI đã đổi `max_tokens` thành `max_completion_tokens`
 * và trả 400 khi nhận tên cũ; các model và gateway cũ thì ngược lại. Tài liệu
 * của gpt-5.6-luna nằm sau tường lửa của môi trường dựng này nên không tra
 * được model đó nhận tên nào — thay vì đoán, gửi tên mới trước rồi lùi về tên
 * cũ đúng khi server than phiền về chính tham số đó.
 *
 * Chỉ bắt đúng lỗi này. Mọi lỗi khác ném nguyên vẹn.
 */
async function createCompletion(openai, params) {
  try {
    return await openai.chat.completions.create({
      ...params,
      max_completion_tokens: MAX_TOKENS,
    });
  } catch (error) {
    const message = String(error?.message || '');
    const isParamName =
      error?.status === 400 &&
      /max_completion_tokens|max_tokens|unsupported_parameter|unrecognized/i.test(message);

    if (!isParamName) throw error;

    console.warn('  ⚠ Model không nhận max_completion_tokens, thử lại với max_tokens');
    return openai.chat.completions.create({ ...params, max_tokens: MAX_TOKENS });
  }
}

/**
 * Gọi model soạn một bản nháp.
 *
 * Dùng Chat Completions chứ không phải endpoint mới hơn: đây là giao diện mà
 * gần như mọi gateway tương thích OpenAI đều cài, nên nếu model nằm sau một
 * gateway thì vẫn chạy.
 */
export async function draftArticle(item, source, sourceBody, { client, today } = {}) {
  const openai = client || createClient();

  const response = await createCompletion(openai, {
    model: DRAFT_MODEL,
    messages: [
      { role: 'system', content: buildSystemPrompt() },
      {
        role: 'user',
        content: buildUserContent({ ...item, organization: source.organization }, sourceBody),
      },
    ],
    response_format: {
      type: 'json_schema',
      json_schema: { name: 'chotto_draft', schema: DRAFT_SCHEMA, strict: true },
    },
  });

  const message = response.choices?.[0]?.message;

  // Model có thể từ chối; khi đó content rỗng và lý do nằm ở refusal.
  if (message?.refusal) {
    throw new Error(`Model từ chối soạn tin này: ${message.refusal} — ${item.url}`);
  }
  if (!message?.content) {
    throw new Error(`Không có nội dung trả về cho: ${item.url}`);
  }

  let drafted;
  try {
    drafted = JSON.parse(message.content);
  } catch (error) {
    throw new Error(
      `Model trả về JSON hỏng cho ${item.url}: ${error.message}\n` +
      `  Bắt đầu bằng: ${message.content.slice(0, 200)}`
    );
  }

  return {
    record: toArticleRecord(drafted, item, source, today || new Date().toISOString()),
    usage: response.usage,
  };
}
