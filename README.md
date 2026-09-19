# ChottoDay (chottoday.com)

> **“Vấn đề nhỏ, có chỗ để hỏi. Và có công cụ để giải quyết.”**  
> *Nội dung là điểm bắt đầu, công cụ là điểm kết thúc.*

ChottoDay là nền tảng thông tin, cẩm nang hướng dẫn và cổng kết nối công cụ hữu ích dành cho cộng đồng người Việt đang sinh sống, học tập và làm việc tại Nhật Bản.

---

## 🏛️ Kiến Trúc Hệ Sinh Thái (Ecosystem)

```
CHOTTO ECOSYSTEM
chottoday.com (ChottoDay — Repo này)
│
├── /                     Trang chủ (Homepage)
├── /articles             Cẩm nang bài viết (Articles Discovery)
├── /articles/:slug       Bài viết chi tiết
├── /topics/:category     Chủ đề đời sống (Topics & Taxonomy)
├── /problems             Tra cứu theo tình huống
├── /search               Tìm kiếm thông minh (Search UI)
├── /about                Về Chotto + Liên hệ (#lien-he)
├── /tools                Tất cả công cụ tiện ích
├── /tools/:slug          Công cụ Chotto tự chạy (vd. tính lương thực nhận)
│
└── Công cụ Toolio (Contextual Recommendation)
      │
      ▼
toolio.chottoday.com (Toolio — Interactive Miniapps & Utilities)
```

> `/tools` gộp cả hai loại: công cụ Chotto tự dựng (chạy ngay trên trang, có
> trang riêng `/tools/:slug`) và miniapp Toolio (mở sang toolio.chottoday.com).
> Danh mục nằm ở `src/data/tools.js`; tên và URL của miniapp luôn được phân giải
> từ `src/services/toolRegistry` nên không bao giờ lệch với Toolio.

---

## 🎨 Hệ Thống Nhận Diện Thương Hiệu (Design SOT)

- **Thẩm mỹ**: *Japanese Clean Editorial + Friendly Utility + Chotto Personality*.
- **Tỉ lệ composition**: Giấy (Paper `#FBF9F5`) ~45% · Mực (Ink `#1E2A44`) ~35% · Màu chủ đề ~12% · Màu phụ ~8%.
- **Typography chuẩn**:
  - Tiêu đề (Headings): `Nunito` (700 Bold / 800 ExtraBold)
  - Thân bài & Giao diện (Body & UI): `Be Vietnam Pro` (400 Regular / 500 Medium / 600 SemiBold)
- **6 Danh mục chuẩn hóa**:
  1. 🟢 **Đời sống & nhà ở**: `#66B96B` (text tương phản `#2F7A43`)
  2. 🔵 **Giấy tờ & hành chính**: `#1E2A44`
  3. 🟠 **Việc làm & tiền**: `#FBA93E` (text tương phản `#8F5310`)
  4. 🔴 **Sức khoẻ & khẩn cấp**: `#F15A53` (text tương phản `#B32B26`)
  5. 🟣 **Tiếng Nhật & học tập**: `#AB8DF5` (text tương phản `#6741C4`)
  6. 💠 **Công cụ Chotto**: `#2FC5D0` (text tương phản `#0A6E78`)

---

## 🚀 Khởi Chạy Dự Án

### Yêu cầu
- Node.js ≥ 18.0.0
- npm hoặc pnpm

### Cài đặt & chạy môi trường phát triển
```bash
# Cài đặt dependencies
npm install

# Khởi chạy dev server
npm run dev

# Build production bundle (kèm prerender + sitemap)
npm run build

# Xem thử production build
npm run preview

# Kiểm định nội dung và tham chiếu công cụ
npm run validate

# Chạy test (discovery + công thức tính lương + chính sách chặn bot)
npm test
```

### Biến môi trường

| Biến | Mục đích |
| --- | --- |
| `VITE_TOOLIO_BASE_URL` | Base URL của Toolio miniapps. |
| `VITE_CONTACT_ENDPOINT` | Endpoint nhận form liên hệ ở `/about#lien-he`. Bỏ trống thì form không giả vờ gửi thành công mà hướng người dùng sang email. |

---

## ✍️ Viết bài mới

Hướng dẫn đầy đủ: **[`docs/huong-dan-tao-bai-viet.md`](docs/huong-dan-tao-bai-viet.md)**.
Gửi nguyên văn file đó cho AI kèm chủ đề là nhận về một file `.js` dán thẳng vào
repo được.

Bài viết là **file JavaScript trong repo**, không phải bản ghi trong database.
Đổi lại sự bất tiện khi sửa, ta được ba thứ: lịch sử từng phiên bản, diff để
review, và quan trọng nhất — `npm run validate` **chặn build** nếu một bài
`published` thiếu nguồn hoặc thiếu người ký duyệt. Đó là sự từ chối, không phải
lời nhắc.

| Thứ | Ở đâu |
| --- | --- |
| Nội dung bài | `src/content/articles/<slug>.js`, khai báo trong `articlesList.js` |
| Trạng thái & loại nguồn | `src/services/content/articleModel.js` |
| Chuyên mục (9 id) | `src/content/categories/categoryMap.js` |
| Kiểu section được render | `src/components/article/ArticleRenderer.jsx` |
| Luật kiểm định | `scripts/validate-content.mjs` |
| Sinh ảnh OG 1200×630 | `scripts/images/card.py` |

### Cách nhanh: Chotto Studio

```bash
npm run dev     # rồi mở localhost:5173/studio
```

Dán nội dung AI trả về (markdown hoặc file `.js` — nó tự nhận dạng), chọn ảnh
bìa, xem thử bằng **đúng bố cục của site**, rồi bấm một nút: studio ghi file bài
viết, chèn vào `articlesList.js`, và sinh ảnh OG.

Studio **chỉ chạy ở chế độ dev**, không có trong bản build nên không bao giờ
xuất hiện trên chottoday.com. Đổi máy chỉ cần `git clone && npm install` —
không có gì lưu riêng trên máy cũ. Riêng ảnh OG cần Python:
`pip install pillow fonttools brotli` (studio tự kiểm và nhắc nếu thiếu).

Bài studio ghi ra luôn mang `status: 'review'`. Xem thử tại
`/articles/<slug>`, chạy `npm run validate && npm test && npm run build`, rồi PR.

### Cách thủ công

Viết file → `python3 scripts/images/card.py` sinh ảnh OG →
`npm run validate && npm test && npm run build` → PR → xem thử trên bản preview
Cloudflare → merge.

> **Hai cái bẫy đã cắn thật, ghi lại cho khỏi quên.**
> `ArticleRenderer` kết thúc bằng `default: return null`, nên một
> `sections[].type` ngoài 12 kiểu hợp lệ sẽ render ra **bài trống** — không lỗi,
> không cảnh báo. Và bài `status: 'review'` **mở được bằng URL trực tiếp** nhưng
> không vào sitemap, không hiện ở trang danh sách, không được prerender — đó là
> cơ chế xem thử, dùng nó để duyệt bài trên preview trước khi đổi sang
> `published`.

---

## 🛡️ Chống crawl dữ liệu & chống copy bài viết

Ba lớp, làm ba việc khác nhau. Lớp nào cũng có giới hạn thật của nó, nên ghi rõ
ở đây để sau này không ai nhầm lẫn là site đã "an toàn tuyệt đối".

### Lớp 1 — `robots.txt`: lời đề nghị

`src/config/crawlerPolicy.js` là **nguồn đúng duy nhất** cho danh sách bot. File
`public/robots.txt` và `dist/robots.txt` (do `scripts/prerender.mjs` sinh ra)
đều lấy từ đó.

- **Vẫn cho phép**: Googlebot, Bingbot, coccocbot (Cốc Cốc), DuckDuckBot,
  Applebot, Yeti — và các bot xem trước liên kết: `facebookexternalhit`,
  Twitterbot, Zalo, Telegram, WhatsApp, Slack, Discord. Site sống bằng traffic
  tìm kiếm và bằng thẻ chia sẻ, nên **không bao giờ** được chặn nhóm này.
- **Từ chối**: 32 bot huấn luyện AI (GPTBot, ClaudeBot, CCBot, Google-Extended,
  Applebot-Extended, Bytespider, PerplexityBot, Meta-ExternalAgent…) và 14 bot
  thu thập SEO (AhrefsBot, SemrushBot, MJ12bot, DataForSeoBot…).

Sửa danh sách thì sửa `crawlerPolicy.js`, rồi chạy lại:

```bash
node --input-type=module -e "import fs from 'fs'; \
  const { buildRobotsTxt } = await import('./src/config/crawlerPolicy.js'); \
  fs.writeFileSync('public/robots.txt', buildRobotsTxt('https://chottoday.com'));"
npm run test:crawler-policy
```

> `robots.txt` chỉ là **lời đề nghị**. Bot tử tế thì nghe; bot đi ăn cắp dữ liệu
> thì không. Vì vậy mới có lớp 2.

### Lớp 2 — `functions/_middleware.js`: chặn thật ở edge

Cloudflare Pages Function chạy trước mọi request, trả `403` cho user-agent nằm
trong danh sách chặn (gồm cả thư viện HTTP vô danh: Scrapy, HTTrack, wget,
python-requests, Go-http-client…).

Hai nguyên tắc bất di bất dịch của file này:

1. **Fail open.** Mọi lỗi đều rơi xuống `next()`. Một bug ở đây mà làm sập site
   thì tai hại hơn nhiều so với việc lọt một con bot.
2. **Không đoán.** Chỉ chặn user-agent tự khai tên. Scraper giả làm Chrome thì
   không thể phân biệt với độc giả thật — việc đó để Cloudflare lo (lớp 3).

Danh sách trong file này được chép tay từ `crawlerPolicy.js` (để Function không
phụ thuộc import nào cả); `npm run test:crawler-policy` sẽ đỏ nếu hai bản lệch
nhau, và in ra đúng nội dung cần dán vào.

`public/_headers` bổ sung `X-Robots-Tag: noai, noimageai` (tuyên bố không đồng ý
cho huấn luyện AI) và `frame-ancestors 'self'` (chặn nhúng bài vào iframe site
khác).

### Lớp 3 — Cloudflare Dashboard: việc cần làm bằng tay

Ba mục này **không nằm trong code**, phải bật trong dashboard của
`chottoday.com`:

| Nơi bật | Mục | Vì sao |
| --- | --- | --- |
| Security → Bots | **Block AI Scrapers and Crawlers** = On | Cloudflare nhận diện theo hành vi, bắt được cả bot giả user-agent. |
| Security → Bots | **Bot Fight Mode** = On | Chặn bot thường ở mức free. |
| Security → WAF → Rate limiting rules | 60 request / 1 phút / IP cho `/articles/*` | Người đọc thật không bao giờ mở 60 bài/phút; scraper thì có. |
| Scrape Shield | **Hotlink Protection** = On | Site khác hết lấy ảnh trực tiếp từ đây. |

### Lớp 4 — Chống copy bài viết (phía trình duyệt)

`src/components/article/CopyGuard.jsx`, cấu hình ở
`src/config/contentProtection.js`, **chỉ bọc phần thân bài viết**:

- chặn bôi đen (`user-select: none`), chặn chuột phải, chặn kéo ảnh ra ngoài;
- nếu copy vẫn lọt (reader mode, extension), clipboard nhận **tiêu đề + link
  bài gốc + dòng bản quyền** thay vì nội dung;
- hiện thông báo nhỏ mời người đọc dùng nút "Sao chép link" — thứ mà đa số họ
  thực sự muốn;
- cuối bài có dòng `© ChottoDay` dẫn tới `/policy#ban-quyen`.

**Không bọc**: link, nút, ô nhập liệu, sidebar, trang công cụ, máy tính lương,
`/policy`, `/about`, `/search` và trang chủ. Người đọc vẫn copy được địa chỉ,
số tiền hay từ tiếng Nhật ở những chỗ đó — đúng mục đích của site.

Tắt toàn bộ: đặt `COPY_PROTECTION_ENABLED = false`.

> **Nói thẳng về giới hạn:** đây là rào cản, không phải khoá. Ai tắt JavaScript,
> xem source, hay đọc chính bản HTML prerender mà site cố tình dọn sẵn cho
> Google thì vẫn lấy được chữ. Không site nào ngăn được điều đó. Cái này chặn
> trường hợp tiện tay — vốn là đại đa số — và làm cho bản copy lọt ra ngoài vẫn
> mang tên Chotto. Phần còn lại là chuyện của lớp 2, lớp 3 và điều khoản bản
> quyền ở `/policy#ban-quyen`.

---

## 📌 Việc còn lại (TODO)

- [ ] **Nối endpoint thật cho form liên hệ.** `/about#lien-he` đã validate và gửi
      `POST` JSON `{kind, name, email, message}`, nhưng `VITE_CONTACT_ENDPOINT`
      còn trống nên form đang báo cho người dùng gửi qua `hello@chottoday.com`.
      Đặt biến này trong Cloudflare Pages (Settings → Environment variables) rồi
      build lại là form chạy, không cần sửa code.
- [ ] **Bốn công cụ đang phát triển.** `furusato-nozei`, `chi-phi-sinh-hoat`,
      `doi-bang-lai`, `so-sanh-luong-gio` đang hiển thị ở `/tools` với nhãn
      "Đang phát triển" và trang riêng báo quay lại sau. Khi làm xong, đổi
      `comingSoon: true` trong `src/data/tools.js` thành `toolId` (nếu là
      miniapp Toolio) hoặc `calculator` + trang nội dung trong
      `src/data/toolPages.js` (nếu Chotto tự dựng).
- [ ] **Bật 4 mục Cloudflare ở lớp 3** trong bảng "Chống crawl dữ liệu" phía
      trên. Code đã xong phần của nó; bốn mục kia chỉ bật được bằng tay trong
      dashboard và là lớp chặn hiệu quả nhất với scraper giả làm Chrome.

---

## 📦 Bản Quyền & Giấy Phép
Bản quyền © 2026 ChottoDay. Mọi quyền được bảo lưu.
