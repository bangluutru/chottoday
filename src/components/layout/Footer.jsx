import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { ExternalLinkIcon } from '../common/Icons';
import { getAllCategories } from '../../content/categories/categoryMap';
import { TOOLIO_BASE_URL } from '../../config/constants';

export function Footer() {
  const categories = getAllCategories();

  return (
    <footer className="footer-wrapper" role="contentinfo">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand & Philosophy */}
          <div className="footer-brand-col">
            <Link to="/" aria-label="Trang chủ Chotto">
              <img
                src="/chotto-logo-full.svg"
                alt="Chotto"
                className="footer-logo"
                width="130"
                height="28"
              />
            </Link>
            <div className="footer-philosophy">
              “Vấn đề nhỏ, có chỗ để hỏi. Và có công cụ để giải quyết.”
            </div>
            <p className="footer-desc">
              ChottoDay là nền tảng thông tin, cẩm nang hướng dẫn và cổng kết nối công cụ hữu ích dành cho người Việt đang sinh sống, học tập và làm việc tại Nhật Bản.
            </p>
          </div>

          {/* Col 2: 6 Categories */}
          <div>
            <div className="footer-col-title">Chủ đề chính</div>
            <ul className="footer-link-list">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link to={cat.path} className="footer-link">
                    <span className={`footer-cat-dot cat-dot-${cat.colorKey}`} />
                    <span>{cat.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Ecosystem & Tools */}
          <div>
            <div className="footer-col-title">Hệ sinh thái Chotto</div>
            <ul className="footer-link-list">
              <li>
                <Link to="/articles" className="footer-link">
                  Cẩm nang bài viết
                </Link>
              </li>
              <li>
                <Link to="/#useful-today" className="footer-link">
                  Hướng dẫn từng bước
                </Link>
              </li>
              <li>
                <a
                  href={TOOLIO_BASE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-link footer-link-highlight"
                >
                  <span>Toolio (toolio.chottoday.com)</span>
                  <ExternalLinkIcon size={14} />
                </a>
              </li>
              <li>
                <a href="#community" className="footer-link">
                  Chotto Facebook Community
                </a>
              </li>
              <li>
                <Link to="/#about" className="footer-link">
                  Về dự án Chotto
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Disclaimer & Copyright */}
        <div className="footer-bottom">
          <div className="footer-disclaimer">
            Lưu ý: Thông tin trên Chotto được biên soạn và cập nhật dựa trên luật pháp và quy định thực tế tại Nhật Bản, mang tính chất tham khảo hướng dẫn thực hành và không thay thế tư vấn pháp lý chính thức từ cơ quan nhà nước.
          </div>
          <div>© 2026 ChottoDay. Bản quyền thuộc về Chotto.</div>
        </div>
      </div>
    </footer>
  );
}
