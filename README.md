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
├── Trang chủ (Homepage Skeleton)
├── Cẩm nang bài viết (Articles Discovery)
├── Hướng dẫn từng bước (Step-by-step Guides)
├── 6 Chủ đề đời sống (Topics & Taxonomy)
├── Tìm kiếm thông minh (Search UI)
│
└── Công cụ (Contextual Recommendation)
      │
      ▼
tools.chottoday.com (Toolio — Interactive Miniapps & Utilities)
```

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

# Build production bundle
npm run build

# Xem thử production build
npm run preview
```

---

## 📦 Bản Quyền & Giấy Phép
Bản quyền © 2026 ChottoDay. Mọi quyền được bảo lưu.
