import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FacebookIcon, YouTubeIcon, TikTokIcon, InstagramIcon } from '../common/Icons';

export function Footer() {
  return (
    <footer className="footer-wrapper" role="contentinfo">
      <div className="container">
        <div className="footer-main-row">
          {/* Brand & Tagline */}
          <div className="footer-brand">
            <Link to="/" aria-label="Trang chủ Chotto">
              <img
                src="/chotto-logo-full.svg"
                alt="Chotto"
                className="footer-logo"
                width="120"
                height="26"
              />
            </Link>
            <span className="footer-tagline">Một chút, mỗi ngày cho người Việt tại Nhật</span>
          </div>

          {/* Nav Links */}
          <nav className="footer-nav" aria-label="Liên kết chân trang">
            <Link to="/#about" className="footer-nav-link">Về Chotto</Link>
            <span className="footer-nav-dot" aria-hidden="true">·</span>
            <Link to="/articles" className="footer-nav-link">Cẩm nang</Link>
            <span className="footer-nav-dot" aria-hidden="true">·</span>
            <Link to="/topics/tools" className="footer-nav-link">Công cụ</Link>
            <span className="footer-nav-dot" aria-hidden="true">·</span>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-nav-link">Liên hệ</a>
            <span className="footer-nav-dot" aria-hidden="true">·</span>
            <span className="footer-nav-link footer-nav-subtle">Điều khoản &amp; Bảo mật</span>
          </nav>

          {/* Social Icons */}
          <div className="footer-socials" aria-label="Mạng xã hội Chotto">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Facebook">
              <FacebookIcon size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="YouTube">
              <YouTubeIcon size={18} />
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="TikTok">
              <TikTokIcon size={16} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="footer-social-btn" aria-label="Instagram">
              <InstagramIcon size={16} />
            </a>
          </div>
        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="footer-bottom-bar">
          <p className="footer-disclaimer">
            Lưu ý: Thông tin trên Chotto được biên soạn và cập nhật dựa trên luật pháp và thực tế tại Nhật Bản, mang tính chất cẩm nang tham khảo và không thay thế tư vấn pháp lý chính thức.
          </p>
          <div className="footer-copy">
            © 2026 ChottoDay. Giữ bản quyền.
          </div>
        </div>
      </div>
    </footer>
  );
}

