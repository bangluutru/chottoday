# Handoff: Chotto — bộ 12 trang thiết kế lại (hi-fi)

> Bắt đầu từ **CLAUDE_CODE_TASKS.md** (việc cần làm, theo thứ tự). File này là spec tra cứu.

## 0. Đọc trước: vì sao có gói này

Claude Code (kể cả bản web) **không có quyền đọc trực tiếp file thiết kế** trong workspace design (lỗi authorization của DesignSync). Vì vậy toàn bộ nguồn đã được đóng gói sẵn ở đây:

```
design_handoff_chotto_site/
├─ README.md                  ← tài liệu này (đủ để implement, không cần hỏi lại)
├─ chotto-theme-guide.md      ← token màu / typography đã dùng
└─ designs/
   ├─ Chotto - Trang chu.dc.html
   ├─ Chotto - Bai viet chi tiet.dc.html
   ├─ Chotto - Trang chu de.dc.html
   ├─ Chotto - Tat ca cong cu.dc.html
   ├─ Chotto - Cong cu chi tiet.dc.html
   ├─ Chotto - Ket qua tim kiem.dc.html
   ├─ Chotto - Ve Chotto.dc.html
   ├─ Chotto - Trang 404.dc.html
   ├─ Chotto - Danh sach bai viet.dc.html
   ├─ Chotto - Tat ca chu de.dc.html
   ├─ Chotto - Chinh sach.dc.html
   ├─ Chotto - Ban mobile.dc.html
   ├─ support.js               ← runtime để mở file trong browser
   └─ public/                  ← toàn bộ ảnh + icon các thiết kế dùng
```

Mở bất kỳ file `.dc.html` bằng browser (hoặc `python3 -m http.server` trong `designs/`) để xem đúng như thiết kế. **Đọc trực tiếp HTML để lấy số liệu** — mọi style đều là inline style, không có CSS ngoài, nên mỗi giá trị màu/spacing/font nằm ngay trên element.

## 1. Về các file thiết kế

Đây là **design reference viết bằng HTML** — prototype thể hiện giao diện và hành vi mong muốn, **không phải code production để copy**. Việc cần làm: **tái tạo các thiết kế này trong codebase React hiện có** (`bangluutru/chottoday`, Vite + React + react-router-dom, CSS thuần theo từng page/component) bằng đúng pattern sẵn có của repo: một `PageName.jsx` + `PageName.css` trong `src/pages/`, component dùng lại từ `src/components/`, token màu lấy từ `src/styles/tokens.css`.

**Fidelity: hi-fi.** Màu, typography, spacing, radius, hover state đều là giá trị cuối. Hãy dựng lại đúng pixel bằng CSS của repo (biến token khi có, hex khi chưa có token).

## 2. Route map — cái gì có, cái gì cần tạo

Repo hiện tại (`src/App.jsx`) có: `/`, `/articles`, `/articles/:slug`, `/topics/:category`, `/problems`, `*`.

| Design file | Route đích | Trạng thái | Việc cần làm |
| --- | --- | --- | --- |
| Chotto - Trang chu | `/` → `HomePage.jsx` | có | cập nhật UI theo thiết kế mới |
| Chotto - Bai viet chi tiet | `/articles/:slug` → `ArticleDetailPage.jsx` | có | cập nhật layout (TOC + tool card 2 cột, prose full-width) |
| Chotto - Trang chu de | `/topics/:category` → `CategoryPage.jsx` | có | cập nhật UI |
| Chotto - Trang 404 | `*` → `NotFoundPage.jsx` | có | cập nhật UI |
| Chotto - Ket qua tim kiem | `/search` (mới) → `SearchResultsPage.jsx` | **thiếu route** | tạo route + page. Đọc query từ `?q=`; dùng lại `src/services/discovery/searchStore.js` (`setEphemeralQuery`) đang có. `/problems` giữ nguyên, không trộn vào. |
| Chotto - Tat ca cong cu | `/tools` (mới) → `ToolsIndexPage.jsx` | **thiếu route** | tạo route + page, lấy danh sách từ `src/services/toolRegistry` |
| Chotto - Cong cu chi tiet | `/tools/:slug` (mới) → `ToolDetailPage.jsx` | **thiếu route** | tạo route + page; slug đầu tiên: `luong-thuc-nhan` |
| Chotto - Ve Chotto | `/about` (mới) → `AboutPage.jsx`, anchor `#lien-he` | **thiếu route** | tạo route + page (about + form liên hệ + FAQ) |
| Chotto - Danh sach bai viet | `/articles` → `ArticlesIndexPage.jsx` | có | cập nhật UI: chip lọc + sort + bài nổi bật + phân trang 6 bài/trang (§5.5) |
| Chotto - Tat ca chu de | `/topics` (mới) → `TopicsIndexPage.jsx` | **thiếu route** | tạo route + page, 7 thẻ chủ đề (§5.6) |
| Chotto - Chinh sach | `/policy` (mới, + `#dieu-khoan`) → `PolicyPage.jsx` | **thiếu route** | tạo route + page, 2 phần + mục lục sticky (§5.7) |
| Chotto - Ban mobile | không phải route — là spec mobile cho `Navbar`/`MobileMenu` và mọi trang | — | áp breakpoint 768/480px + drawer (§5.8) |

Cần sửa `src/App.jsx` thêm 4 route (đặt **trước** `path="*"`):

```jsx
<Route path="/tools" element={<ToolsIndexPage />} />
<Route path="/tools/:slug" element={<ToolDetailPage />} />
<Route path="/search" element={<SearchResultsPage />} />
<Route path="/about" element={<AboutPage />} />
<Route path="/topics" element={<TopicsIndexPage />} />
<Route path="/policy" element={<PolicyPage />} />
```

Và cập nhật `Navbar.jsx` / `Footer.jsx` / `MobileMenu.jsx`: link "Công cụ" → `/tools`, "Về Chotto" → `/about`, "Liên hệ" → `/about#lien-he`, ô search submit → `/search?q=…`.

> Trong file HTML, link giữa các trang là tên file (`Chotto%20-%20Ve%20Chotto.dc.html`). Khi implement hãy đổi sang route ở bảng trên.

## 3. Design tokens (dùng chung 8 trang)

**Màu nền & chữ**
| Vai trò | Hex |
| --- | --- |
| Nền giấy (page) | `#FBF9F5` |
| Nền section nhạt | `#FDFCFA` |
| Nền input / chip nhạt | `#F4F1EA` |
| Trắng thẻ | `#FFFFFF` |
| Viền chuẩn | `#E6E2D9` |
| Viền section | `#EFEBE2` |
| Divider trong thẻ | `#F0EDE6` |
| Viền nhạt/dashed | `#D8D3C8` |
| Chữ chính | `#1E2A44` |
| Chữ phụ | `#3A4354` |
| Chữ mờ | `#666D7A` |

**6 màu thương hiệu + nền nhạt tương ứng**
| Màu | Hex | Nền nhạt | Viền nhạt | Chữ đậm trên nền nhạt |
| --- | --- | --- | --- | --- |
| Xanh lá | `#66B96B` | `#EDF7EE` | `#CBE8CE` | `#2F6B34` |
| Cam | `#FBA93E` | `#FEF6EB` | `#FDDDBD` | `#8F5310` |
| Đỏ san hô | `#F15A53` | `#FDEEED` | `#FBCDCB` | `#A6302A` |
| Tím | `#AB8DF5` | `#F6F2FE` | `#DFD5FB` | `#5B3FB0` |
| Xanh ngọc | `#2FC5D0` | `#E9F8F9` | `#B7EBEF` | `#0A6E78` |
| Mực | `#1E2A44` | `#ECEFF5` | `#CFD7E4` | `#1E2A44` |

**Màu hành động**: primary button `#0B7F8A`, hover `#0A6E78`; button tối `#1E2A44`, hover `#0F1930`; link `#0B7F8A`/hover `#0A6E78`; Facebook `#1877F2`; giấy nhớ vàng `#FBF1BE`.

**Typography**
- Heading: `'Nunito', sans-serif` — 700/800, `letter-spacing:-0.02em`.
- Body: `'Be Vietnam Pro', system-ui, sans-serif` — 400/500/600.
- Chữ viết tay (lời nhắn, giấy nhớ): `'Dancing Script', cursive` 600, 21–26px. **Bắt buộc Dancing Script** (Caveat thiếu dấu tiếng Việt).
- Thang cỡ: h1 trang chủ 50px/1.12 · h1 trang phụ 34–44px · h2 section 21–24px · h3 card 16–17px · body 14–16.5px · meta 11.5–13px. Line-height body 1.55–1.8, `text-wrap: pretty` cho đoạn văn.

**Khác**: radius — pill `9999px`, hero `22px`, section `20px`, card `15–18px`, input `12–14px`, icon box `11–14px`. Shadow — card `0 2px 8px rgba(30,42,68,.03)`, nổi `0 6px 22px rgba(30,42,68,.09)`, hero `0 8px 30px rgba(30,42,68,.05)`, giấy nhớ `0 10px 24px rgba(30,42,68,.14)` + `rotate(2.6–3.2deg)`. Hover card: `translateY(-2px)` + viền `#2FC5D0`. Container `max-width:1240px`, padding ngang `24px`. Header sticky cao `72px`, nền `rgba(251,249,245,.92)` + `backdrop-filter: blur(12px)`.

## 4. Khung chung mọi trang

**Header (sticky)**: logo SVG 6 màu (width 132px) + tagline 10.5px "Một chút hữu ích, mỗi ngày." → nav 5 link 14px (mục đang mở: `font-weight:600` + `border-bottom:2.5px solid #F15A53`) → search pill `flex:1; max-width:430px; height:42px` nền `#F4F1EA` → nút tròn 42px đổi ngôn ngữ. **Không có nút đăng nhập.**

**Footer**: logo 124px + tagline, nav ngang (Về Chotto | Liên hệ | Chủ đề | Công cụ | Tìm kiếm), social tròn 30px (FB/YouTube/TikTok/Instagram), switch VI/JA/EN (VI active nền `#0B7F8A`), dòng copyright 11.5px `© 2026 ChottoDay. All rights reserved.`

Cả hai dùng `flex-wrap: wrap` — không fixed width, không `nowrap` ở khối chứa chữ.

## 5. Bốn trang mới — spec chi tiết

### 5.1 `/tools` — Tất cả công cụ (`Chotto - Tat ca cong cu.dc.html`)

- Breadcrumb 12.5px: Trang chủ / Công cụ tiện ích.
- Hero card `#FDFCFA` radius 20px, padding `26px 24px 24px`, 2 cột wrap: trái h1 34px ("Công cụ tiện ích **Chotto**", chữ Chotto `#0B7F8A`) + mô tả 15px + search pill trắng cao 52px (đuôi phải hiển thị số lượng "N công cụ"); phải giấy nhớ `#FBF1BE` 210px nghiêng 2.6°.
- Hàng chip lọc: `Tất cả · Tiền & Thuế · Cuộc sống · Thủ tục · Công việc · Gia đình` — cao 36px, pill; active nền `#0B7F8A` chữ trắng, thường nền trắng viền `#E6E2D9`.
- Grid card `repeat(auto-fit, minmax(270px,1fr))`, gap 14px. Mỗi card: icon box 46px + chip category, tên 17px Nunito 700, mô tả 13px, footer chia `space-between` (meta 11.5px mờ + "Dùng ngay →" 13px `#0A6E78`), viền trên `1px #F0EDE6`.
- Dữ liệu 12 công cụ: xem mảng `ALL` trong file HTML (tên, mô tả, category, meta, icon, màu nền). Lọc = chip AND từ khoá (khớp tên + mô tả + category, không phân biệt hoa thường).
- Empty state: card dashed, dòng chữ tay 24px "Chưa có công cụ nào khớp…" + gợi ý gửi đề xuất.
- Band CTA cuối: gradient `linear-gradient(135deg,#EAF6FB,#EAF7F8 55%,#EDF7EE)` viền `#CFE6EF`, 2 nút (Gửi đề xuất công cụ → `/about#lien-he`; Xem theo chủ đề → `/topics`).

### 5.2 `/tools/:slug` — Công cụ chi tiết (`Chotto - Cong cu chi tiet.dc.html`)

Đây là trang có **logic tính toán thật** — quan trọng nhất khi port.

Hero: 3 badge (Tiền & Thuế / Cập nhật 04/2026 / "Không lưu dữ liệu của bạn"), h1 38px, mô tả 15.5px, kèm lời nhắn chữ tay nghiêng -2.5° trên nền `#FBF1BE`.

**Cột trái — form** (card trắng radius 20px, padding 22px):
- Ô lương: `input[type=number]` (5–200) cỡ 26px Nunito 800 trong khung `#F4F1EA` cao 54px, đuôi "man / tháng"; dưới là `input[type=range]` 10–100 đồng bộ cùng state (`accent-color:#0B7F8A`).
- Thưởng: 4 nút `Không có / 1 tháng / 2 tháng / 4 tháng` (mặc định 2), active nền `#0B7F8A`.
- Người phụ thuộc: stepper − / số / + (0–6), nút 44×44 radius 12.
- Khu vực: `Tokoyo/Osaka/Aichi/Khác` → active nền `#1E2A44`; đổi tỷ lệ bảo hiểm y tế.
- Disclaimer 12px cuối card.

**Cột phải — kết quả**:
- Card `#0B7F8A` chữ trắng: label 13.5px, số lớn 46px Nunito 800 (thực nhận/tháng), hàng dưới 3 chỉ số (thực nhận năm / tổng thu nhập năm / tỷ lệ bị trừ) cách nhau bằng đường `rgba(255,255,255,.22)`.
- Card trắng "Các khoản bị trừ mỗi tháng": 3 dòng (Bảo hiểm xã hội `#2FC5D0`, Thuế thu nhập `#AB8DF5`, Thuế thị dân `#FBA93E`) — mỗi dòng label + số tiền + bar cao 8px trên track `#F4F1EA` (bar = tỷ lệ so với gross ×3, clamp 100) + ghi chú 11.5px; cuối là "Tổng bị trừ" màu `#A6302A`.

**Công thức đã dùng (giữ nguyên khi port — xem hàm `calc()` trong file):**
```
gross  = man*10000*(12 + bonusMonths)
social = gross * (healthRate + 0.0915 + 0.006)     // health: Tokyo .0499 / Osaka .0516 / Aichi .0501 / khác .0495
empDeduction(gross): ≤1.625tr→550k; ≤1.8tr→g*.4-100k; ≤3.6tr→g*.3+80k;
                     ≤6.6tr→g*.2+440k; ≤8.5tr→g*.1+1.1tr; else 1.95tr
base       = gross - social - empDeduction(gross)
taxableNat = max(0, base - 480000 - deps*380000)
taxableLoc = max(0, base - 430000 - deps*330000)
incomeTax  = bậc lũy tiến 5/10/20/23/33/40% (trừ số cố định) × 1.021
resident   = taxableLoc*0.10 + 5000
net        = gross - social - incomeTax - resident
```
Format tiền: `Intl.NumberFormat('vi-VN')` + `" ¥"`, làm tròn nguyên.

Dưới cùng: card "Công cụ này tính như thế nào?" (3 ô giải thích ngọc/tím/cam) + accordion 4 FAQ (chỉ mở 1, dấu `+`/`−` màu `#0B7F8A`); sidebar phải 1/4 (`flex:1 1 260px; max-width:340px`): công cụ liên quan, đọc thêm (3 bài có thumbnail 62×48), card gradient góp ý.

### 5.3 `/search` — Kết quả tìm kiếm (`Chotto - Ket qua tim kiem.dc.html`)

- Search pill lớn cao 60px (max-width 760px) có nút `×` xoá khi có từ khoá + nút "Tìm kiếm" `#0B7F8A`.
- Dòng tổng kết 14px: `N kết quả cho “từ khoá”`; khi rỗng → câu mời nhập.
- Tab pill có đếm: `Tất cả (n) · Bài viết (n) · Công cụ (n) · Chủ đề (n)` — active nền `#1E2A44`; dưới là `border-bottom:1px solid #E6E2D9`.
- Item kết quả: card trắng radius 16, thumbnail 96×76 (bài viết = ảnh cover `object-fit:cover`; công cụ/chủ đề = icon 34px trên nền `#F4F1EA`), badge loại (Bài viết đỏ nhạt / Công cụ ngọc nhạt / Chủ đề tím nhạt) + meta, tiêu đề 16.5px, mô tả 13px.
- Sidebar: "Mọi người hay tìm" (7 chip, click → set query), "Lọc theo chủ đề" (5 dòng + số lượng), card gradient "Không tìm thấy điều bạn cần?".
- Empty state: chữ tay 26px + nút gửi câu hỏi.
- Khi implement: query từ `?q=`, cập nhật URL khi gõ (debounce), tab lọc theo `kind`.

### 5.4 `/about` — Về Chotto + Liên hệ (`Chotto - Ve Chotto.dc.html`)

- Hero ảnh `public/images/community/fuji-sakura.jpg` phủ gradient giấy từ trái (min-height 360px, radius 22px), badge "Về Chotto", h1 44px, 2 nút (Liên hệ / Xem công cụ), lời nhắn chữ tay góc phải.
- 3 card giá trị: Dễ hiểu trước đã / Có con số để quyết định / Cập nhật theo phản hồi (icon box 46px, nền lá–ngọc–đỏ nhạt).
- Khối câu chuyện `#FDFCFA`: 2 đoạn 15px/1.8 + disclaimer 13px; cột phải giấy nhớ + card "Chotto hiện có" (135 bài / 12 công cụ / 7 chủ đề — **cập nhật số thật khi nối data**).
- `#lien-he`: card form — 4 nút loại (Góp ý nội dung / Đề xuất công cụ / Câu hỏi / Hợp tác, active `#1E2A44`), input Tên + Email (grid auto-fit 200px, cao 48px, nền `#F4F1EA`, radius 12), textarea 5 dòng, nút gửi cao 50px `#0B7F8A`, chú thích 12.5px. Sau khi gửi: banner xanh `#EDF7EE` + nhãn nút "Đã gửi ✓". Prototype **không gọi API** — nối endpoint thật khi implement, kèm validate email + required nội dung.
- Sidebar: "Kênh khác" (Fanpage / hello@chottoday.com / Đề xuất công cụ mới) + accordion 4 FAQ.

### 5.5 `/articles` — Danh sách bài viết (`Chotto - Danh sach bai viet.dc.html`)

- Breadcrumb → h1 36px "Tất cả **bài viết**" + mô tả 15px + lời nhắn chữ tay nghiêng -1.8°.
- Hàng điều khiển: 7 chip chủ đề (Tất cả · Tiền & Thuế · Thủ tục · Cuộc sống · Gia đình · Sức khỏe · Công việc, active nền `#0B7F8A`) bên trái; bên phải "N bài viết" + nhóm sort 3 nút trong pill nền `#F4F1EA` (`Mới nhất` / `Đọc nhiều` / `Đọc nhanh`). Dưới cùng `border-bottom:1px solid #E6E2D9`.
- Card bài nổi bật: 2 cột wrap (`flex:1 1 420px` mỗi bên), ảnh cover min-height 260px; badge "Bài nổi bật" nền `#FBF1BE` chữ `#7A5A00` + badge chủ đề; h2 27px; meta 12.5px. Chỉ hiện ở trang 1, không lọc, không từ khoá.
- Grid `auto-fit minmax(280px,1fr)` gap 16px: ảnh cao 158px, badge chủ đề, h3 16.5px, mô tả 12.8px, dòng meta trên viền `#F0EDE6` — **mỗi cụm meta `white-space:nowrap`, dấu `•` gộp vào cụm sau**.
- Phân trang giữa trang: nút ‹ › 42×42 radius 12 + số trang (active nền `#1E2A44`), 6 bài/trang.
- Empty state: card dashed + chữ tay 25px + nút "Gửi yêu cầu chủ đề".

### 5.6 `/topics` — Tất cả chủ đề (`Chotto - Tat ca chu de.dc.html`)

- h1 36px "Khám phá theo **chủ đề**" + mô tả + lời nhắn chữ tay nghiêng 2°.
- Grid `auto-fit minmax(330px,1fr)` gap 16px: 7 thẻ + 1 ô dashed CTA.
- Mỗi thẻ: header padding `18px 20px` nền màu nhạt của chủ đề (icon box trắng 48px radius 14 + tên 19px Nunito 800 + dòng đếm 12px màu đậm của chủ đề) → thân padding `16px 20px 18px`: mô tả 13.5px, 3 chip chủ đề con nền `#F4F1EA` 11.5px, "Xem chủ đề →" 13px `#0A6E78` ghim đáy (`margin-top:auto`).
- Cặp màu theo bảng §3: Mới sang Nhật (lá), Thủ tục & Giấy tờ (đỏ), Tiền & Thuế (tím), Công việc (mực), Gia đình & Giáo dục (cam), Sức khỏe (ngọc), Cuộc sống (đỏ).
- Ô CTA: chữ tay 23px "Thiếu một chủ đề bạn đang cần?" + nút `#0B7F8A` → `/about#lien-he`.

### 5.7 `/policy` — Chính sách & Điều khoản (`Chotto - Chinh sach.dc.html`)

- Header trang: h1 36px + card nhỏ "Cập nhật lần cuối 19/09/2026".
- Sidebar mục lục: `flex:1 1 240px; max-width:300px; position:sticky; top:92px`, nền `#FDFCFA`; 9 mục, mục cấp 2 thụt 14px; đáy ghi email liên hệ.
- Nội dung `flex:1 1 620px`, 2 card trắng radius 20px padding `26px 28px 24px`:
  - Phần 1 `#bao-mat` badge ngọc — 1.1 dữ liệu thu thập · 1.2 dữ liệu nhập vào công cụ (callout lá `#EDF7EE`) · 1.3 cookie (2 dòng bullet dot lá/cam) · 1.4 quyền của bạn.
  - Phần 2 `#dieu-khoan` badge tím — 2.1 nội dung tham khảo (callout cam `#FEF6EB`) · 2.2 bản quyền · 2.3 thay đổi & liên hệ + band gradient với nút "Hỏi Chotto".
- Body 14.5–15px, line-height 1.8; h3 18px Nunito 800.

### 5.8 Bản mobile (`Chotto - Ban mobile.dc.html`)

Bốn artboard 390×844 (trang chủ · drawer mở · danh sách bài viết · công cụ tính lương) và bảng 6 quy tắc responsive ở cuối trang. Tóm tắt: breakpoint 768px (ẩn nav, hiện hamburger) và 480px (xếp dọc, grid công cụ 2 cột); header 56px, logo 96px, bỏ tagline; trang con dùng nút Quay lại + tên trang; chip lọc `overflow-x:auto; scrollbar-width:none`; card kết quả công cụ `position:sticky; bottom:10px`; drawer 320px trượt từ phải 220ms ease-out, overlay `rgba(30,42,68,.46)`, khoá scroll nền, Esc + focus trap; input ≥16px, vùng chạm ≥44px.

## 6. Trang cũ — những gì đã đổi (nếu chưa merge)

- **Trang chủ**: bỏ nút đăng nhập, search pill header rộng tối đa 430px; hero ảnh + gradient giấy, h1 50px "Sống ở Nhật, dễ hơn **một chút**" (một = `#E08A0B`, chút = `#7C5CD6`), search pill trắng 58px + 7 chip từ khoá + nút `•••`; section công cụ (grid `auto-fit minmax(100px,1fr)`), bài viết mới (4 card), chủ đề (grid 7 cột), khối cộng đồng 2 cột, footer.
- **Bài viết chi tiết**: breadcrumb → hero ảnh → 2 cột bằng nhau (mục lục nền kem + card công cụ nền ngọc) → prose full-width → sidebar bài liên quan chiếm 1/4. Nút "Copy link" và "Gửi góp ý" tự xuống dòng ở viewport nhỏ.
- **Chủ đề**: 7 chip lọc, grid bài viết 2 cột (3/4 chiều rộng), sidebar công cụ liên quan 1/4 (max ~284px).

## 7. Hành vi & state

| Trang | State | Ghi chú |
| --- | --- | --- |
| `/tools` | `category`, `query` | lọc client-side, hiện số lượng, empty state |
| `/tools/:slug` | `man`, `bonus`, `deps`, `region`, `openFaq` | tính lại mỗi lần đổi input, không debounce; không gửi dữ liệu đi đâu |
| `/search` | `query`, `tab` | sync `?q=`; đếm theo loại trước khi lọc tab |
| `/about` | `kind`, `name`, `email`, `msg`, `sent`, `openFaq` | reset `sent=false` khi user sửa field |
| 404 | `query` | Enter → `/search?q=…` |

Chuyển động: chỉ hover (`translateY(-2px)`, đổi màu viền/nền) và accordion mở/đóng. Không animation phức tạp.

**Responsive**: mọi khối 2 cột dùng `flex-wrap: wrap` + `flex:1 1 <basis>` và grid `auto-fit minmax()`. Không đặt chiều rộng cố định, không `white-space: nowrap` cho khối chữ. Ở dưới ~900px: hai cột trái/phải xếp dọc, nav xuống dòng, sidebar full-width. Chạm tối thiểu 44px (stepper, nút form).

**A11y**: mọi input có `aria-label`, ảnh trang trí `alt=""`, accordion là `<button>`, contrast chữ ≥ 4.5:1 (chữ trên `#0B7F8A` dùng trắng đủ độ, không dùng chữ mờ trên nền màu).

## 8. Assets

Tất cả nằm trong `designs/public/` (đã lấy từ repo, giữ nguyên đường dẫn):
- `chotto-logo-full.svg`, `favicon.svg`
- `icons/icon-tool.svg`, `icon-doc.svg`, `icon-work.svg`, `icon-life.svg`, `icon-study.svg`, `icon-health.svg`
- `images/hero-clean-japan.webp`
- `images/featured/salary-30man.jpg`, `nenkin-tool.jpg`, `zairyu-card.jpg`
- `images/thumbs/thumb-school.jpg`, `thumb-train.jpg`, `thumb-clinic.jpg`
- `images/community/fuji-sakura.jpg`

Logo trong header/footer là **inline SVG** `viewBox="0 0 1708 360"` (6 màu) — copy nguyên khối từ bất kỳ file HTML, đừng vẽ lại.

Fonts: Google Fonts `Nunito:600,700,800` + `Be Vietnam Pro:400,500,600,700` + `Dancing Script:500,600,700`.

## 9. Thứ tự làm đề xuất

1. Thêm 4 route + 4 page rỗng vào `App.jsx`, sửa link ở `Navbar`/`Footer`/`MobileMenu` → hết lỗi "no route".
2. `/tools` (thuần UI + data từ `toolRegistry`).
3. `/tools/:slug` (port nguyên công thức ở §5.2 vào util có unit test).
4. `/search` (nối `searchStore.js`).
5. `/about` (+ endpoint form).
6. Cập nhật 4 trang đã có theo §6.
