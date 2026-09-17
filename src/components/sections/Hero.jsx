import React from 'react';
import './Hero.css';
import { SearchBar } from '../search/SearchBar';

export function Hero({ searchInputRef, onSearch }) {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-heading">
      <div className="hero-shell">
        {/* Full-width photography background */}
        <picture className="hero-bg-picture">
          <source srcSet="/images/hero-clean-japan.webp" type="image/webp" />
          <img
            src="/images/hero-clean-japan.jpg"
            alt=""
            className="hero-bg-img"
            width="1920"
            height="960"
            fetchPriority="high"
            loading="eager"
          />
        </picture>

        {/* Left-side subtle readability gradient */}
        <div className="hero-overlay-gradient" aria-hidden="true" />

        {/* Real functional HTML/UI overlaid directly on the photo */}
        <div className="hero-content-wrap">
          <div className="hero-badge-pill">
            <span>Một chút, mỗi ngày</span>
          </div>

          <h1 id="hero-heading" className="hero-headline">
            Vấn đề nhỏ,<br />
            có Chotto giúp <span className="hero-accent-coral">một</span> <span className="hero-accent-blue">chút.</span>
          </h1>

          <p className="hero-description">
            Thông tin, hướng dẫn và công cụ hữu ích<br />
            cho cuộc sống thường ngày ở Nhật.
          </p>

          {/* Live Phase 5 Intelligent Discovery Search */}
          <div className="hero-search-box-container">
            <SearchBar ref={searchInputRef} onSearch={onSearch} />
          </div>
        </div>
      </div>
    </section>
  );
}


