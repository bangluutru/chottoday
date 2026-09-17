import React from 'react';
import './Hero.css';
import { SearchBar } from '../search/SearchBar';

export function Hero({ searchInputRef, onSearch }) {
  return (
    <section className="hero-section" aria-labelledby="hero-heading">
      <div className="container">
        <div className="hero-grid">
          {/* Content & Search */}
          <div className="hero-content">
            <div className="hero-badge-tag">
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--chotto-green)',
                }}
              />
              <span>Dành cho người Việt tại Nhật</span>
            </div>

            <h1 id="hero-heading" className="hero-headline">
              Vấn đề nhỏ,{'\n'}có Chotto giúp một chút.
            </h1>

            <p className="hero-support-text">
              Thông tin, hướng dẫn và công cụ hữu ích cho cuộc sống ở Nhật.
              Từ thủ tục hành chính, thuế, việc làm đến cuộc sống thường ngày.
            </p>

            {/* Live Search Component */}
            <SearchBar ref={searchInputRef} onSearch={onSearch} />
          </div>

          {/* Everyday Japan Lifestyle Scene */}
          <div className="hero-visual-card">
            <img
              src="/images/hero-everyday-japan.jpg"
              alt="Cuộc sống thường nhật ấm cúng của người Việt tại Nhật Bản"
              className="hero-illustration"
              width="600"
              height="450"
              loading="eager"
            />
            <div className="hero-visual-caption">
              <span>Góc học tập & sinh hoạt tại Tokyo</span>
              <span>chottoday.com</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
