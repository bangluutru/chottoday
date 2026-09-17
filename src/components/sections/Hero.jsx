import React from 'react';
import './Hero.css';
import { SearchBar } from '../search/SearchBar';
import { BookOpenIcon, WrenchIcon, UsersIcon } from '../common/Icons';

export function Hero({ searchInputRef, onSearch }) {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-grid">
          {/* Left Column: Content, Headline, Handwritten Note & Discovery Search */}
          <div className="hero-content">
            <div className="hero-badge-tag">
              <span className="hero-badge-dot" />
              <span>Một chút, mỗi ngày</span>
            </div>

            <h1 id="hero-heading" className="hero-headline">
              Vấn đề nhỏ,<br />
              có Chotto giúp <span className="hero-accent-coral">một</span> <span className="hero-accent-green">chút.</span>
            </h1>

            <div className="hero-handwritten-note" aria-hidden="true">
              "Những điều nhỏ làm cuộc sống tốt đẹp hơn mỗi ngày ☺"
            </div>

            <p className="hero-support-text">
              Chotto là cẩm nang sống, thủ tục, công việc &amp; công cụ tiện ích cho người Việt tại Nhật Bản. Miễn phí, cập nhật liên tục.
            </p>

            {/* Live Search Component with Intelligent Discovery */}
            <SearchBar ref={searchInputRef} onSearch={onSearch} />
          </div>

          {/* Right Column: Everyday Japan Scene + Floating Highlights */}
          <div className="hero-visual-wrapper">
            <div className="hero-visual-card">
              <img
                src="/images/hero-everyday-japan.jpg"
                alt="Cuộc sống thường nhật ấm cúng của người Việt tại Nhật Bản"
                className="hero-illustration"
                width="600"
                height="450"
                loading="eager"
              />
            </div>

            <div className="hero-stats-card" aria-label="Thống kê nhanh Chotto">
              <div className="hero-stat-item">
                <div className="hero-stat-icon-wrap hero-stat-icon-articles">
                  <BookOpenIcon size={18} color="var(--cat-work-text, #D97706)" />
                </div>
                <div className="hero-stat-info">
                  <span className="hero-stat-value">200+</span>
                  <span className="hero-stat-label">Bài viết hữu ích</span>
                </div>
              </div>

              <div className="hero-stat-divider" aria-hidden="true" />

              <div className="hero-stat-item">
                <div className="hero-stat-icon-wrap hero-stat-icon-tools">
                  <WrenchIcon size={18} color="var(--cat-tool-text, #0D9488)" />
                </div>
                <div className="hero-stat-info">
                  <span className="hero-stat-value">40+</span>
                  <span className="hero-stat-label">Công cụ tiện ích</span>
                </div>
              </div>

              <div className="hero-stat-divider" aria-hidden="true" />

              <div className="hero-stat-item">
                <div className="hero-stat-icon-wrap hero-stat-icon-community">
                  <UsersIcon size={18} color="var(--color-indigo, #3B82F6)" />
                </div>
                <div className="hero-stat-info">
                  <span className="hero-stat-value">Luôn bên bạn</span>
                  <span className="hero-stat-label">Cộng đồng Chotto</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

