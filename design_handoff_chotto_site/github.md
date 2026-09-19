repo: bangluutru/chottoday
branch: main

## Last sync
date: 2026-09-18T23:26:03Z

### Updated in this project
- Thêm 4 trang mới: danh sách bài viết, tất cả chủ đề, bản mobile (4 màn 390px + quy tắc responsive), Chính sách & Điều khoản.
- Trước đó: tất cả công cụ, công cụ chi tiết (máy tính lương), kết quả tìm kiếm, Về Chotto + liên hệ, trang 404.
- Nối toàn bộ điều hướng giữa 12 file thiết kế (nav, footer, breadcrumb, card).
- Gói handoff `design_handoff_chotto_site/` kèm route map cho 4 route còn thiếu trong `src/App.jsx`.

## Screen map
| Screen | Repo files |
| --- | --- |
| Chotto - Trang chu.dc.html | src/pages/HomePage.jsx, src/components/layout/Navbar.jsx+css, src/components/sections/Hero.jsx+css, src/components/category/CategoryGrid.jsx+css, src/components/sections/UsefulToday.jsx, src/components/sections/CommunityBlock.jsx+css, src/components/layout/Footer.jsx+css, src/styles/tokens.css |
| Chotto - Bai viet chi tiet.dc.html | src/pages/ArticleDetailPage.jsx+css, src/content/articles/salary-30man |
| Chotto - Trang chu de.dc.html | src/pages/CategoryPage.jsx+css, src/data/categories.js, src/services/toolRegistry |
| Chotto - Danh sach bai viet.dc.html | src/pages/ArticlesIndexPage.jsx (cần cập nhật UI) |
| Chotto - Tat ca chu de.dc.html | chưa có route — cần `/topics` → TopicsIndexPage.jsx, dữ liệu src/data/categories.js |
| Chotto - Tat ca cong cu.dc.html | chưa có route — cần `/tools` → ToolsIndexPage.jsx, src/services/toolRegistry |
| Chotto - Cong cu chi tiet.dc.html | chưa có route — cần `/tools/:slug` → ToolDetailPage.jsx |
| Chotto - Ket qua tim kiem.dc.html | chưa có route — cần `/search` → SearchResultsPage.jsx, src/services/discovery/searchStore.js |
| Chotto - Ve Chotto.dc.html | chưa có route — cần `/about` (+ `#lien-he`) → AboutPage.jsx |
| Chotto - Chinh sach.dc.html | chưa có route — cần `/policy` (+ `#dieu-khoan`) → PolicyPage.jsx |
| Chotto - Trang 404.dc.html | src/pages/NotFoundPage.jsx |
| Chotto - Ban mobile.dc.html | src/components/layout/MobileMenu.jsx, Navbar.jsx (breakpoint 768/480px) |
| Assets | public/chotto-logo-full.svg, public/icons/*.svg, public/images/hero-clean-japan.webp, public/images/thumbs/*.jpg, public/images/featured/*.jpg, public/images/community/fuji-sakura.jpg |

## Sync history
- 2026-09-18T15:20:30Z — thiết kế lại trang chủ, thêm trang bài viết chi tiết & trang chủ đề; import logo, icon, ảnh và token màu/typography từ repo.
