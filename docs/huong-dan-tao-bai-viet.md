# Hướng dẫn tạo bài viết cho Chotto

Tài liệu này dành cho **AI được giao viết một bài mới**. Gửi nguyên văn file này
cho AI, kèm chủ đề bạn muốn. AI trả về một file `.js` dán thẳng vào repo được.

Mọi luật trong đây đều rút từ code thật. Chỗ nào ghi "validator chặn" nghĩa là
`npm run validate` sẽ báo lỗi và CI đỏ. Chỗ nào ghi "quy ước" nghĩa là máy không
chặn nhưng người duyệt sẽ trả lại.

---

## PHẦN 1 — AI PHẢI TRẢ VỀ GÌ

Đúng ba khối, theo thứ tự:

1. **Nội dung file `src/content/articles/<slug>.js`** — đầy đủ, chạy được.
2. **Hai dòng sửa `articlesList.js`** — câu `import` và tên biến thêm vào mảng.
3. **Bản mô tả ảnh** — theo mẫu ở Phần 5.

Không kèm lời dẫn, không giải thích ngoài lề. Ba khối code, hết.

---

## PHẦN 2 — KHUNG FILE BÀI VIẾT

```js
export const articleTenBien = {
  // === Định danh ===
  id: 'nisa-dau-tu-cho-nguoi-nuoc-ngoai',   // duy nhất toàn site
  slug: 'nisa-dau-tu-cho-nguoi-nuoc-ngoai', // duy nhất, chỉ [a-z0-9-]

  // === Hiển thị ===
  title: 'NISA là gì và người nước ngoài ở Nhật có mở được không?',
  excerpt: 'Một đến hai câu trả lời "bài này nói gì và ảnh hưởng tới ai".',
  category: 'work',            // một trong 9 id ở Phần 3
  tags: ['Đầu tư', 'Thuế'],    // 2–4 nhãn tiếng Việt

  // === Thời gian (BẮT BUỘC đúng YYYY-MM-DD) ===
  publishedAt: '2026-09-19',
  updatedAt: '2026-09-19',     // không được nhỏ hơn publishedAt
  readingTime: 7,              // số phút, ước lượng ~200 từ/phút

  // === Trạng thái ===
  status: 'review',            // LUÔN là 'review' khi AI tạo. Xem Phần 6.

  // === Ảnh ===
  coverImage: '/images/hero-everyday-japan.jpg',
  socialImage: '/images/og/og-nisa-dau-tu-cho-nguoi-nuoc-ngoai.png',

  author: {
    name: 'Ban Biên Tập Chotto',
    role: 'Nội dung việc làm & tài chính',
  },

  // === Trả lời nhanh cho người đang vội ===
  shortAnswer: {
    lead: 'Một câu mở, kết thúc bằng dấu hai chấm:',
    steps: [
      'Việc thứ nhất, cụ thể, làm được ngay.',
      'Việc thứ hai.',
      'Việc thứ ba.',
    ],
    note: 'Một câu lưu ý quan trọng nhất.',
  },

  keyTakeaways: [
    'Ý chính thứ nhất, một câu trọn vẹn.',
    'Ý chính thứ hai.',
    'Ý chính thứ ba.',
  ],

  applicability: {
    country: 'Nhật Bản',
    effectiveFrom: '2026',
    audience: 'Ai áp dụng được — nêu rõ tư cách lưu trú nếu nguồn có nói.',
    notes: 'Phạm vi áp dụng: toàn quốc hay chỉ một số tỉnh.',
  },

  sections: [ /* Phần 4 */ ],

  sources: [
    {
      id: 'src-nta-01',
      organization: 'Tổng cục Thuế quốc gia (国税庁)',
      title: 'Tên trang nguồn, giữ cả tiếng Nhật trong ngoặc',
      url: 'https://www.nta.go.jp/...',   // BẮT BUỘC https://
      accessedAt: '2026-09-19',
      type: 'official',                   // official | primary | reference
    },
  ],

  review: {
    lastVerifiedAt: '2026-09-19',
    reviewAfter: '2027-03-19',            // thường +6 tháng
    reviewer: 'CHƯA DUYỆT',               // người duyệt tự thay tên mình
  },

  relatedArticleIds: ['luong-30-man-thuc-nhan-bao-nhieu'],  // slug CÓ THẬT
  relatedToolIds: [],

  seo: {
    metaTitle: 'Tiêu đề SEO | Chotto',        // ≤ 60 ký tự
    metaDescription: 'Mô tả 150–160 ký tự.',
    canonical: 'https://chottoday.com/articles/<slug>',
    structuredDataType: 'Article',
  },
};
```

---

## PHẦN 3 — CHUYÊN MỤC

Trường `category` phải là **một trong chín id** này. Validator chặn nếu sai.

| id | Nội dung |
|---|---|
| `life` | Đời sống & nhà ở |
| `doc` | Giấy tờ & hành chính |
| `work` | Việc làm & tiền |
| `health` | Sức khoẻ & khẩn cấp |
| `study` | Tiếng Nhật & học tập |
| `tool` | Công cụ Chotto |
| `newcomer` | Mới sang Nhật |
| `job` | Công việc |
| `family` | Gia đình & Giáo dục |

---

## PHẦN 4 — TỪ VỰNG SECTION

**Đây là phần dễ sai nhất.** Bộ render dùng `switch (section.type)` và kết thúc
bằng `default: return null`. Một kiểu ngoài danh sách sẽ **render ra trống** —
không lỗi, không cảnh báo, chỉ là bài trắng. Đã có nguyên một pipeline chết vì
dùng `type: 'text'`, thứ không tồn tại.

Chỉ dùng đúng 12 kiểu sau:

```js
{ type: 'intro',     content: 'Đoạn mở bài, một đoạn văn.' }

{ type: 'heading',   level: 2, text: '1. Tiêu đề mục' }   // level: 2 hoặc 3

{ type: 'paragraph', content: 'Một đoạn văn thường.' }

{ type: 'list',      items: ['Ý một', 'Ý hai'] }          // mảng chuỗi

{ type: 'steps',     items: [
    { stepNumber: 1, title: 'Tên bước', text: 'Làm gì cụ thể.' },
  ] }

{ type: 'term',      term: '在留カード',
                     reading: 'Zairyu Card',
                     meaning: 'Thẻ cư trú.' }

{ type: 'note',      title: 'Mẹo', content: 'Nội dung ghi chú.' }

{ type: 'warning',   title: 'Lưu ý', content: 'Cảnh báo quan trọng.' }

{ type: 'example',   title: 'Ví dụ: lương 30 man',
                     items: [
                       { label: 'Lương gộp', value: '300.000 ¥' },
                       { label: 'Bảo hiểm',  value: '−45.000 ¥', isDeduction: true },
                       { label: 'Thực nhận', value: '243.000 ¥', isTotal: true },
                     ],
                     caption: 'Số liệu minh hoạ.' }

{ type: 'quote',     content: 'Trích dẫn.', author: 'Nguồn' }

{ type: 'toolCTA',   toolId: 'net-salary-jp' }   // phải là toolId CÓ THẬT

{ type: 'sources',   items: [
    { title: 'Tên nguồn', organization: 'Cơ quan', url: 'https://...' },
  ] }
```

**Cấu trúc nên theo:** mở bằng `intro`, rồi các cụm `heading` + nội dung. Dùng
`steps` cho thủ tục, `term` cho từ tiếng Nhật lần đầu xuất hiện, `warning` cho
hạn chót và rủi ro. Đừng dùng `toolCTA` trừ khi chắc chắn toolId tồn tại —
`npm run validate:tool-refs` chặn id sai.

---

## PHẦN 5 — ẢNH

Có hai loại ảnh, và **chúng làm khác nhau**.

### Ảnh OG / chia sẻ mạng xã hội — KHÔNG do AI vẽ

Ảnh này có chữ trên đó. Model sinh ảnh viết sai dấu tiếng Việt và bịa kanji —
một tấm card nói về 在留カード mà kanji sai thì tệ hơn là không có ảnh. Nên nó
được vẽ bằng template, tất định.

Sau khi có file bài, người đăng chạy:

```bash
python3 scripts/images/card.py \
  --out public/images/og/og-<slug>.png \
  --item '{"title":"<title của bài>","topic":"<category>","organization":"<organization của sources[0]>","publishedAt":"<publishedAt>"}'
```

Script tự kiểm mọi ký tự có nằm trong font hay không **trước khi vẽ**. Thiếu
glyph thì nó dừng và báo, chứ không lặng lẽ xuất ra ảnh đầy ô vuông.

AI không cần làm gì cho ảnh này, chỉ cần điền đúng `socialImage` theo mẫu
`/images/og/og-<slug>.png`.

### Ảnh minh hoạ bài — AI mô tả, KHÔNG vẽ chữ

Trả về một khối như sau:

```
ẢNH MINH HOẠ
Tên file đề xuất: <slug>.jpg
Thư mục:          public/images/featured/
Tỉ lệ:            16:9, tối thiểu 1200×675

Mô tả để sinh ảnh:
  <Mô tả bằng tiếng Anh, 1–3 câu. Bối cảnh Nhật Bản, ánh sáng tự nhiên,
   tông trầm ấm. TUYỆT ĐỐI không có chữ, không có số, không có logo,
   không có biển hiệu đọc được, không có khuôn mặt người nhận diện được.>
```

Ba điều cấm, lý do thật:

- **Không chữ, không số.** Model sinh ảnh viết sai chữ Việt và kanji. Và số
  liệu trong ảnh thì không ai kiểm chứng được khi nó sai.
- **Không logo Chotto.** Logo là tài sản thương hiệu, không để model đoán lại.
- **Không khuôn mặt nhận diện được.** Bài nói về thủ tục cư trú; gán mặt người
  vào là chuyện khác hẳn.

Nếu chưa có ảnh riêng thì cứ để `coverImage: '/images/hero-everyday-japan.jpg'`
— bài vẫn chạy bình thường.

---

## PHẦN 6 — TRẠNG THÁI: LUÔN LÀ `review`

AI **luôn** đặt `status: 'review'` và `reviewer: 'CHƯA DUYỆT'`.

Vì sao quan trọng: bài `review` xem được bằng URL trực tiếp nhưng **không** vào
sitemap, **không** hiện ở trang danh sách, **không** được prerender. Nó là bản
xem thử, đúng nghĩa.

Chỉ người thật mới đổi sang `published`, sau khi đã mở từng link nguồn và đối
chiếu từng con số. Lúc đó validator mới bật toàn bộ luật nghiêm ngặt ở Phần 7.

Đây không phải thủ tục hình thức. Trang này nói về visa, thuế, bảo hiểm và hạn
chót — sai một con số là người đọc lỡ việc thật.

---

## PHẦN 7 — VALIDATOR CHẶN NHỮNG GÌ

Chạy `npm run validate` để kiểm.

**Áp dụng cho mọi bài, kể cả `review`:**

- `id` có, và không trùng bài khác
- `slug` có, không trùng, chỉ chứa `[a-z0-9-]`
- `title` và `excerpt` là chuỗi không rỗng
- `category` nằm trong 9 id ở Phần 3
- `status` nằm trong: `draft`, `review`, `verified`, `published`,
  `review_due`, `needs_update`, `archived`
- `publishedAt` đúng `YYYY-MM-DD`
- `updatedAt` nếu có thì đúng định dạng và **không nhỏ hơn** `publishedAt`
- mọi slug trong `relatedArticleIds` phải là bài **có thật**

**Chỉ áp dụng khi `status: 'published'`:**

- `sources` có ít nhất một phần tử, mỗi phần tử đủ `id`, `organization`,
  `title`, `url` (**bắt buộc `https://`**), `accessedAt` (`YYYY-MM-DD`),
  `type` ∈ {`official`, `primary`, `reference`}
- `review` đủ `lastVerifiedAt`, `reviewAfter` (cả hai `YYYY-MM-DD`,
  `lastVerifiedAt` không được sau `reviewAfter`), và `reviewer` không rỗng
- `seo.metaTitle` và `seo.metaDescription` không rỗng

**Quy ước — validator KHÔNG chặn, nhưng người duyệt sẽ trả lại:**

- `shortAnswer`, `keyTakeaways`, `applicability` — **ba trường này mỗi cái
  chiếm một khối riêng trong bố cục bài**: "Tóm tắt giải pháp nhanh", "Bạn sẽ
  biết sau bài này", và "Phạm vi áp dụng". Thiếu chúng thì ba khối ấy đơn giản
  là không xuất hiện, và bài tụt xuống thành một mảng chữ chạy dài. Máy không
  chặn, nhưng nhìn là thấy ngay.
  Ngoài ra bộ tìm kiếm nội bộ đọc `shortAnswer` để dựng câu trả lời nhanh, nên
  thiếu nó thì bài không xuất hiện đúng chỗ khi người ta tìm.
- `sections[].type` ngoài 12 kiểu ở Phần 4 → **render ra trống, không báo lỗi**.

---

## PHẦN 8 — GIỌNG VĂN

- Tiếng Việt tự nhiên, câu ngắn. Không dịch máy.
- Thuật ngữ tiếng Nhật giữ nguyên, kèm giải thích ngắn ở lần đầu xuất hiện:
  `在留カード (thẻ cư trú)`. Từ quan trọng thì dùng hẳn section `term`.
- Trả lời trước, giải thích sau. Người đọc đang cần biết phải làm gì.
- **Chỉ viết điều nguồn đã nói.** Không thêm số liệu, mốc thời gian, mức phí
  hay điều kiện mà nguồn không nêu. Không chắc thì bỏ, hoặc ghi rõ là chưa rõ.
- Viết "theo thông báo của <cơ quan>", đừng khẳng định trống không thay cơ quan
  nhà nước.
- Đây là cẩm nang tham khảo, không phải tư vấn pháp lý.
- Không giật gân, không emoji.

**Về nguồn:** ưu tiên trang của chính cơ quan ban hành (`type: 'official'`).
Báo chí chỉ dùng để *biết có chuyện đó*, không dùng làm căn cứ cho con số hay
quy định — khi đã có nguồn chính thức thì trích nguồn chính thức.

---

## PHẦN 9 — NGƯỜI ĐĂNG LÀM GÌ

```bash
# 1. Lưu file AI trả về
#    → src/content/articles/<slug>.js

# 2. Thêm hai dòng vào src/content/articles/articlesList.js
#    import { articleTenBien } from './<slug>.js';
#    ...và thêm articleTenBien vào mảng ALL_ARTICLES

# 3. Sinh ảnh OG
python3 scripts/images/card.py \
  --out public/images/og/og-<slug>.png \
  --item '{"title":"...","topic":"...","organization":"...","publishedAt":"..."}'

# 4. Kiểm tra
npm run validate     # schema + nguồn + liên kết nội bộ
npm test             # 284 test
npm run build        # prerender + sitemap

# 5. Commit, push, mở PR
```

Xem thử bài trên bản preview của Cloudflare: `/articles/<slug>`. Bài `review`
mở được bằng URL trực tiếp, nên bạn đọc đúng bài thật với đúng layout trước khi
quyết định đăng.

Khi đã đối chiếu xong từng nguồn: đổi `status` sang `'published'`, điền tên mình
vào `review.reviewer`, chạy lại `npm run validate`. Lúc này toàn bộ luật ở Phần
7 mới bật — nếu còn thiếu gì, validator nói thẳng thiếu gì.
