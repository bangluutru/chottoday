# Hướng dẫn cho Claude Code — bổ sung các trang mới của Chotto

Repo đích: **bangluutru/chottoday** (Vite + React + react-router-dom, CSS thuần theo từng page/component).
Gói này chứa **12 trang thiết kế hi-fi dạng HTML** và mọi asset cần dùng. Đọc offline, không cần DesignSync.

```
design_handoff_chotto_site/
├─ README.md                  ← spec đầy đủ (tokens, từng trang, công thức tính)
├─ CLAUDE_CODE_TASKS.md       ← tài liệu này: việc cần làm, theo thứ tự
├─ chotto-theme-guide.md
├─ github.md                  ← screen map: trang nào ↔ file repo nào
└─ designs/                   ← 12 file .dc.html + support.js + public/
```

Xem thiết kế: `cd designs && python3 -m http.server 8080` rồi mở từng file. **Mọi style là inline** → đọc trực tiếp HTML để lấy chính xác hex/px/font.

> Các file `.dc.html` là **bản tham chiếu thiết kế**, không phải code để copy. Việc cần làm là dựng lại chúng bằng pattern sẵn có của repo: `src/pages/<Name>.jsx` + `<Name>.css`, dùng lại component trong `src/components/`, biến màu từ `src/styles/tokens.css`.

---

## 0. Ràng buộc chung (áp cho mọi task)

- **Không đổi** `src/styles/tokens.css` trừ khi thêm token mới; màu/typography trong README §3 đã khớp token hiện có.
- Mỗi trang mới: một route trong `src/App.jsx`, một page component, một file CSS cùng tên, và (nếu cần) data/service riêng — không nhồi logic vào component UI.
- Tái dùng `Navbar` / `Footer` / `MobileMenu` / `ScrollToTop` đang có; **không** viết header/footer mới cho từng trang.
- Text tiếng Việt lấy nguyên văn từ file thiết kế (đã biên tập), không tự viết lại.
- Font: `Nunito` (heading 700/800), `Be Vietnam Pro` (body), `Dancing Script` (chữ tay). **Bắt buộc Dancing Script**, không dùng Caveat (thiếu dấu tiếng Việt).
- Responsive: `flex-wrap: wrap` + `grid auto-fit minmax()`, không fixed width; vùng chạm ≥ 44px; contrast chữ ≥ 4.5:1.
- Mỗi task kết thúc bằng: `npm run build` sạch + tự kiểm ở 3 khổ 1440 / 900 / 390px.

---

## Task 1 — Thêm route và khung trang (làm trước tiên)

Sửa `src/App.jsx`, đặt **trước** `<Route path="*">`:

```jsx
<Route path="/articles" element={<ArticlesIndexPage />} />      {/* đã có, chỉ đổi UI ở Task 2 */}
<Route path="/topics" element={<TopicsIndexPage />} />
<Route path="/tools" element={<ToolsIndexPage />} />
<Route path="/tools/:slug" element={<ToolDetailPage />} />
<Route path="/search" element={<SearchResultsPage />} />
<Route path="/about" element={<AboutPage />} />
<Route path="/policy" element={<PolicyPage />} />
```

Tạo 6 page component rỗng (chỉ `<main>` + `<h1>`) để route chạy được ngay, rồi sửa liên kết:

| Nơi sửa | Link cũ | Link mới |
| --- | --- | --- |
| `Navbar.jsx`, `MobileMenu.jsx` | "Công cụ" | `/tools` |
| `Navbar.jsx`, `MobileMenu.jsx` | "Chủ đề" | `/topics` |
| `Navbar.jsx`, `MobileMenu.jsx` | "Về Chotto" | `/about` |
| `Navbar.jsx` ô tìm kiếm | focus tại chỗ / `/articles` | submit → `/search?q=<query>` |
| `Footer.jsx` | "Liên hệ" | `/about#lien-he` |
| `Footer.jsx` | "Chính sách" | `/policy` |
| `Footer.jsx` | "Điều khoản" | `/policy#dieu-khoan` |
| `Footer.jsx` | "Sitemap" | đổi nhãn thành "Tìm kiếm" → `/search` |

**Xong task khi**: mọi link ở header/footer/mobile menu đều mở được, không còn 404 nội bộ. Trong file thiết kế link giữa các trang là tên file (`Chotto%20-%20Ve%20Chotto.dc.html`) — quy đổi theo bảng route ở README §2.

---

## Task 2 — `/articles` Danh sách bài viết

Thiết kế: `designs/Chotto - Danh sach bai viet.dc.html` (desktop) + màn 3 trong `Chotto - Ban mobile.dc.html`.

Cấu trúc trên xuống: breadcrumb → h1 36px + mô tả + lời nhắn chữ tay → hàng chip chủ đề (7 chip) và nhóm sort ở cùng dòng, dưới có `border-bottom` → **card bài nổi bật** 2 cột (ảnh trái / nội dung phải, badge "Bài nổi bật" nền `#FBF1BE`) → grid `auto-fit minmax(280px,1fr)` gap 16px → phân trang.

Hành vi:
- Chip lọc chủ đề (mặc định "Tất cả"), sort 3 mức: `Mới nhất` (ngày giảm) · `Đọc nhiều` (views giảm) · `Đọc nhanh` (phút đọc tăng).
- Tìm trong tiêu đề + mô tả + chủ đề, không phân biệt hoa/thường và dấu.
- Phân trang **6 bài/trang**, nút ‹ › + số trang; đổi chip/sort/từ khoá → về trang 1.
- Card bài nổi bật chỉ hiện khi: chủ đề = "Tất cả", không có từ khoá, đang ở trang 1.
- Empty state: card viền dashed + chữ tay "Chưa có bài nào khớp…" + nút `/about#lien-he`.
- Trạng thái lọc/sort/trang nên đọc-ghi qua query string (`?cat=&sort=&page=`) để chia sẻ link được.

Lưu ý khi port: dòng meta ("8 phút đọc • 12/04/2026 • 4.2k lượt đọc") phải `white-space: nowrap` theo từng cụm, gộp dấu `•` vào cụm sau để dấu không rơi cuối dòng.

---

## Task 3 — Mobile + drawer

Thiết kế: `designs/Chotto - Ban mobile.dc.html` (4 màn 390×844 + bảng quy tắc ở cuối trang).

- **≤768px**: ẩn nav desktop, hiện nút hamburger 44px; header cao **56px**, logo 96px, bỏ tagline, ô tìm kiếm thu về nút tròn 44px.
- **Trang con trên mobile**: header đổi thành nút "Quay lại" + tên trang (không logo).
- **≤480px**: mọi khối 2 cột xếp dọc; grid công cụ 2 cột; sidebar thành khối full-width nằm dưới nội dung chính.
- **Drawer** (`MobileMenu.jsx`): panel 320px trượt từ phải 220ms ease-out, overlay `rgba(30,42,68,.46)`, nội dung: logo + nút X, ô tìm kiếm, 5 link 52px (mỗi link có dot màu thương hiệu: đỏ/cam/ngọc/lá/tím), 3 chip chủ đề nhanh, đáy có chữ tay + Facebook + switch VI/JA/EN. Khoá scroll nền, `Esc` để đóng, focus trap, trả focus về nút trigger khi đóng.
- **Chip lọc** dùng `overflow-x:auto; scrollbar-width:none`, không wrap.
- **Card kết quả của công cụ**: `position:sticky; bottom:10px` để luôn thấy con số khi nhập.
- Input cỡ ≥16px (tránh iOS auto-zoom); body 13.5–14px, meta 11px, h1 26–28px.

---

## Task 4 — `/topics` Tất cả chủ đề

Thiết kế: `designs/Chotto - Tat ca chu de.dc.html`.

Grid `auto-fit minmax(330px,1fr)` gap 16px, 7 thẻ + 1 ô dashed CTA. Mỗi thẻ: header nền màu nhạt của chủ đề (icon box trắng 48px + tên 19px + dòng đếm "42 bài viết · 4 công cụ" màu đậm của chủ đề) → mô tả 13.5px → 3 chip chủ đề con nền `#F4F1EA` → "Xem chủ đề →" ghim đáy. Viền thẻ = màu nhạt, hover = màu đậm + `translateY(-2px)`.

Dữ liệu: `src/data/categories.js` (7 chủ đề, đúng thứ tự trong thiết kế). Số đếm lấy thật từ số bài + số công cụ của chủ đề, **đừng hard-code**. Click thẻ → `/topics/:category`.

---

## Task 5 — `/policy` Chính sách & Điều khoản

Thiết kế: `designs/Chotto - Chinh sach.dc.html`.

Một trang, 2 khối: `#bao-mat` (Phần 1 — badge ngọc) và `#dieu-khoan` (Phần 2 — badge tím); sidebar mục lục `position:sticky; top:92px` với 9 mục dẫn tới id: `bao-mat, du-lieu, cong-cu, cookie, quyen, dieu-khoan, tham-khao, ban-quyen, thay-doi`. Hai callout: nền lá `#EDF7EE` (dữ liệu công cụ không rời máy người dùng) và nền cam `#FEF6EB` (khuyến cáo xác nhận lại với cơ quan chức năng). Kết thúc bằng band gradient + nút "Hỏi Chotto".

Nội dung copy nguyên văn từ file thiết kế. Ngày "Cập nhật lần cuối" lấy từ một biến/constant, không viết cứng trong JSX rải rác. Anchor phải scroll đúng khi vào bằng `/policy#dieu-khoan` (hỗ trợ `hash` khi mount, lưu ý `ScrollToTop` hiện có đang reset scroll — cần bỏ qua khi URL có hash).

---

## Task 6 — `/tools` và `/tools/:slug`

Thiết kế: `designs/Chotto - Tat ca cong cu.dc.html`, `designs/Chotto - Cong cu chi tiet.dc.html`. Spec chi tiết ở README §5.1 và §5.2.

- `/tools`: hero card + ô tìm trong công cụ (đuôi hiện "N công cụ") + 6 chip lọc + grid card `auto-fit minmax(270px,1fr)`; danh sách 12 công cụ lấy từ `src/services/toolRegistry`.
- `/tools/:slug`: slug đầu tiên `luong-thuc-nhan`. Cột trái form (ô lương 5–200 man + slider đồng bộ, thưởng 4 mức, stepper người phụ thuộc 0–6, 4 khu vực), cột phải card kết quả `#0B7F8A` + 3 bar khoản bị trừ, dưới là khối "Công cụ này tính như thế nào?" + accordion FAQ + sidebar liên quan.
- **Công thức** (README §5.2) phải tách thành util thuần, có unit test cho 3 mốc 25/30/40 man × 0/1/2 người phụ thuộc. Không gửi số người dùng nhập lên server.

---

## Task 7 — `/search` Kết quả tìm kiếm

Thiết kế: `designs/Chotto - Ket qua tim kiem.dc.html`, spec README §5.3.

Ô tìm lớn 60px (nút × xoá), dòng "N kết quả cho “…”", 4 tab có đếm (Tất cả / Bài viết / Công cụ / Chủ đề), item kết quả có thumbnail 96×76 (ảnh = cover, icon = 34px trên nền `#F4F1EA`), sidebar: từ khoá phổ biến + lọc theo chủ đề + CTA đặt câu hỏi.

Nối với `src/services/discovery/searchStore.js` đang có; đọc/ghi `?q=` (debounce 200ms); tab lọc theo loại nhưng số đếm tính trên tập chưa lọc tab. `/problems` giữ nguyên, không trộn.

---

## Task 8 — `/about` Về Chotto + Liên hệ

Thiết kế: `designs/Chotto - Ve Chotto.dc.html`, spec README §5.4.

Hero ảnh + gradient giấy, 3 card giá trị, khối câu chuyện + card "Chotto hiện có" (số liệu lấy thật), form liên hệ `#lien-he` (4 loại yêu cầu, tên, email tuỳ chọn, nội dung), sidebar kênh khác + FAQ accordion.

Form trong prototype **không gọi API**: cần nối endpoint thật, validate (nội dung bắt buộc, email đúng định dạng nếu điền), chống spam (honeypot hoặc rate-limit), trạng thái gửi/thành công/lỗi. Sau khi gửi: banner `#EDF7EE` + nhãn nút "Đã gửi ✓".

---

## Task 9 — Cập nhật 4 trang đã có

Theo README §6: trang chủ (bỏ nút đăng nhập, search pill 430px, hero h1 50px, 4 section), bài viết chi tiết (mục lục + card công cụ 2 cột bằng nhau, prose full-width, sidebar 1/4), trang chủ đề (7 chip, grid 2 cột + sidebar 1/4), 404 (số 404 với vòng cam, ô tìm, 4 link nhanh).

---

## Thứ tự & tiêu chí hoàn thành

1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9. Mỗi task là một commit riêng.

Coi là xong khi: không còn link nội bộ chết; 12 trang thiết kế đều có route tương ứng (hoặc được ghi rõ là không cần); giao diện khớp file thiết kế ở 1440px và 390px; `npm run build` không warning mới; công thức tính lương có test.

Khi cần số liệu chính xác (hex, px, cỡ chữ, nội dung): **mở file trong `designs/` và đọc inline style**, đó là nguồn đúng duy nhất.
