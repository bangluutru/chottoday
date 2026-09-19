import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FacebookIcon, YouTubeIcon, TikTokIcon, InstagramIcon } from '../common/Icons';
import { ChottoWordmark } from '../common/ChottoWordmark';
import { FANPAGE_URL } from '../../config/constants';

const LANGUAGES = ['VI', 'JA', 'EN'];

export function Footer() {
  return (
    <footer className="footer-wrapper" role="contentinfo">
      <div className="container">
        <div className="footer-main-row">
          <Link to="/" className="footer-brand" aria-label="Trang chủ Chotto">
            <ChottoWordmark width={124} />
            <span className="footer-tagline">Một chút hữu ích, mỗi ngày.</span>
          </Link>

          <nav className="footer-nav" aria-label="Liên kết chân trang">
            <Link to="/about" className="footer-nav-link">Về Chotto</Link>
            <span className="footer-nav-sep" aria-hidden="true">|</span>
            <Link to="/about#lien-he" className="footer-nav-link">Liên hệ</Link>
            <span className="footer-nav-sep" aria-hidden="true">|</span>
            <Link to="/policy" className="footer-nav-link">Chính sách</Link>
            <span className="footer-nav-sep" aria-hidden="true">|</span>
            <Link to="/policy#dieu-khoan" className="footer-nav-link">Điều khoản</Link>
            <span className="footer-nav-sep" aria-hidden="true">|</span>
            <Link to="/search" className="footer-nav-link">Tìm kiếm</Link>
          </nav>

          <div className="footer-end">
            <div className="footer-socials" aria-label="Mạng xã hội Chotto">
              <a
                href={FANPAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn social-facebook"
                aria-label="Facebook"
              >
                <FacebookIcon size={16} color="#ffffff" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn social-youtube"
                aria-label="YouTube"
              >
                <YouTubeIcon size={15} color="#ffffff" />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn social-tiktok"
                aria-label="TikTok"
              >
                <TikTokIcon size={14} color="#ffffff" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-btn social-instagram"
                aria-label="Instagram"
              >
                <InstagramIcon size={15} color="#ffffff" />
              </a>
            </div>

            {/* Visual placeholder: only Vietnamese ships today, so the other
                two are marked disabled rather than dressed up as live links. */}
            <div className="footer-lang-switch" role="group" aria-label="Ngôn ngữ">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`footer-lang-btn ${lang === 'VI' ? 'active' : ''}`}
                  aria-pressed={lang === 'VI'}
                  disabled={lang !== 'VI'}
                  title={lang === 'VI' ? 'Tiếng Việt' : 'Sắp có'}
                >
                  {lang}
                </button>
              ))}
            </div>

            <img
              src="/images/community/fuji-sakura.jpg"
              alt="Núi Phú Sĩ và hoa anh đào"
              className="footer-thumb"
              loading="lazy"
              width="104"
              height="44"
            />
          </div>
        </div>

        <div className="footer-bottom-bar">
          <p className="footer-disclaimer">
            Lưu ý: Thông tin trên Chotto được biên soạn và cập nhật dựa trên luật pháp và thực tế tại
            Nhật Bản, mang tính chất cẩm nang tham khảo và không thay thế tư vấn pháp lý chính thức.
          </p>
          <div className="footer-copy">© 2026 ChottoDay. Giữ bản quyền.</div>
        </div>
      </div>
    </footer>
  );
}
