# CLAUDE.md

Ghi chú cho phiên làm việc AI trong repo này. Chỉ những thứ **không đoán được
từ code** hoặc **đã từng làm ai đó mất thời gian**.

## Đây là gì

Vite + React 18 + react-router-dom 7, SPA tĩnh, deploy lên Cloudflare Pages từ
nhánh `main`. Trang thông tin tiếng Việt cho người Việt ở Nhật: visa, thuế, bảo
hiểm, thủ tục hành chính. **Sai một con số là người đọc lỡ việc thật** — đó là
lý do tồn tại của mọi rào kiểm định bên dưới.

Không có backend. Nội dung là file JavaScript trong repo.

## Lệnh

```bash
npm run dev        # dev server
npm run build      # vite build + prerender + sitemap + robots.txt
npm run validate   # validate:content + validate:tool-refs
npm test           # discovery 61 + net-salary 91 + crawler-policy 132
```

Trước khi push: cả ba đều phải sạch.

## Nguồn đúng duy nhất

Sửa ở đây, đừng rải vào logic:

| Thứ | File |
| --- | --- |
| Trạng thái bài, loại nguồn | `src/services/content/articleModel.js` |
| 9 chuyên mục | `src/content/categories/categoryMap.js` |
| Danh sách bot chặn/cho phép | `src/config/crawlerPolicy.js` |
| Tên & URL miniapp Toolio | `src/services/toolRegistry` |
| Danh mục công cụ | `src/data/tools.js` |

## Nội dung

Viết bài mới: đọc `docs/huong-dan-tao-bai-viet.md`. Tài liệu đó dành cho cả
người lẫn AI, và mọi luật trong đó đã đối chiếu với code.

Bốn điều dễ sai:

1. **`sections[].type` ngoài danh sách → bài render TRỐNG.**
   `ArticleRenderer.jsx` kết thúc bằng `default: return null`. Không lỗi, không
   cảnh báo, chỉ là trang trắng. Đúng 12 kiểu hợp lệ: `intro`, `heading`,
   `paragraph`, `list`, `steps`, `term`, `note`, `warning`, `example`, `quote`,
   `toolCTA`, `sources`. Đã có nguyên một pipeline chết vì dùng `type: 'text'`.

2. **`validate-content.mjs` chỉ siết bài `published`.**
   Bài `review` gần như không bị kiểm. Nên "validate sạch" *không* có nghĩa là
   bài đã đủ điều kiện đăng — đổi `status` sang `published` mới biết còn thiếu
   gì. Hiện có 8 bài `review` thiếu `sources` và khối `review`.

3. **`prerender.mjs` chỉ xuất metadata SEO, không xuất thân bài.**
   HTML tĩnh ~3,8 KB chỉ có thẻ meta; nội dung render ở client. Đừng grep HTML
   trong `dist/` để kiểm nội dung — phép thử đó luôn "thất bại" kể cả khi mọi
   thứ đúng. Muốn kiểm thật thì `npm run preview` rồi mở bằng trình duyệt.

4. **Bài `status: 'review'` mở được bằng URL trực tiếp** nhưng không vào
   sitemap, không hiện ở danh sách, không prerender. Đây là cơ chế xem thử:
   ghép với bản preview Cloudflare của mỗi PR là đọc được bài thật đúng layout
   trước khi merge.

## Ảnh

`scripts/images/card.py` vẽ card 1200×630 đúng thương hiệu, **tất định**. Nó
kiểm mọi ký tự có trong font hay không *trước khi vẽ* và dừng nếu thiếu, thay vì
xuất ra ảnh đầy ô vuông.

Ảnh có chữ thì dùng script này, đừng để model sinh ảnh vẽ — model viết sai dấu
tiếng Việt và bịa kanji. Một tấm card nói về 在留カード mà kanji sai thì tệ hơn
là không có ảnh.

`scripts/generate-social-images.py` (Phase 4) cũng vẽ OG 1200×630 nhưng dùng
danh sách hardcode và không có chốt kiểm glyph. Hai script đang chồng nhau —
khi nào động tới ảnh thì gộp lại, đừng viết cái thứ ba.

## Đừng đụng

- **Toolio và `ToolRegistryService`.** Tên và URL miniapp luôn phân giải qua
  registry để không lệch với `toolio.chottoday.com`.
- **Bài đã `published`** — trừ khi được yêu cầu rõ.
- **Hành vi prerender/SEO** và các lớp chống crawl, trừ khi đó chính là việc
  đang làm.

## Giọng văn

Tài liệu và comment trong repo này viết bằng **tiếng Việt**, câu ngắn, nói thẳng
giới hạn thật của từng thứ thay vì hứa "an toàn tuyệt đối". Xem README mục chống
crawl để thấy chuẩn mực. Giữ đúng giọng đó.

Comment giải thích **vì sao**, nhất là khi lựa chọn trông có vẻ kỳ quặc — phần
lớn chúng ghi lại một lần đã sai thật.
