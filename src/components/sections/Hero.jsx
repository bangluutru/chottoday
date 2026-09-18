import React from 'react';
import './Hero.css';
import { SearchBar } from '../search/SearchBar';

/**
 * HERO — photographic band with the search entry point laid over it.
 *
 * `showNotes` mirrors the design's toggle for the two handwritten annotations.
 * They are decorative and pointer-transparent, so they never sit between the
 * reader and the search field.
 */
export function Hero({ searchInputRef, onSearch, showNotes = true }) {
  return (
    <section className="hero-section" id="hero" aria-labelledby="hero-heading">
      <div className="hero-shell">
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

        {/* Paper gradient fading left-to-right, keeping the copy legible */}
        <div className="hero-overlay-gradient" aria-hidden="true" />

        <div className="hero-content-wrap">
          <h1 id="hero-heading" className="hero-headline">
            Sống ở Nhật,<br />
            dễ hơn <span className="hero-accent-orange">một</span>{' '}
            <span className="hero-accent-violet">chút</span>
          </h1>

          <p className="hero-description">
            Thông tin, hướng dẫn và công cụ hữu ích dành cho người Việt tại Nhật.
          </p>

          <div className="hero-search-box-container">
            <SearchBar ref={searchInputRef} onSearch={onSearch} />
          </div>
        </div>

        {showNotes && (
          <div className="hero-notes" aria-hidden="true">
            <p className="hero-note-script">
              Những điều nhỏ<br />
              làm cuộc sống tốt đẹp hơn<br />
              mỗi ngày ☺
            </p>
            <div className="hero-note-sticky">
              Cùng nhau<br />
              khám phá một<br />
              Nhật Bản gần gũi<br />
              và dễ hiểu hơn!
              <span className="hero-note-sticky-face">☺</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
