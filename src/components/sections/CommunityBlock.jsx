import React from 'react';
import './CommunityBlock.css';
import { FacebookIcon, ArrowRightIcon } from '../common/Icons';

export function CommunityBlock() {
  return (
    <section className="section community-section" id="community" aria-labelledby="community-heading">
      <div className="container">
        <div className="community-banner-card">
          <div className="community-banner-overlay" />
          
          <div className="community-banner-content">
            <div className="community-banner-tag">
              <span className="community-tag-dot" />
              <span>Cộng đồng Chotto</span>
            </div>

            <h2 id="community-heading" className="community-banner-title">
              Cùng nhau khám phá cuộc sống Nhật Bản dễ dàng hơn.
            </h2>

            <div className="community-banner-note" aria-hidden="true">
              "Chia sẻ kinh nghiệm, giúp đỡ lẫn nhau 🌸"
            </div>

            <p className="community-banner-desc">
              Theo dõi fanpage Chotto để cập nhật bài viết mới, mẹo vặt hàng ngày và tham gia cộng đồng người Việt tại Nhật Bản.
            </p>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="community-banner-btn"
              aria-label="Theo dõi Fanpage Chotto trên Facebook"
            >
              <FacebookIcon size={18} color="#ffffff" />
              <span>Theo dõi Fanpage</span>
              <ArrowRightIcon size={15} color="#ffffff" />
            </a>
          </div>

          <div className="community-banner-visual">
            <img
              src="/images/community/fuji-sakura.jpg"
              alt="Núi Phú Sĩ và hoa anh đào Nhật Bản"
              className="community-banner-img"
              loading="lazy"
              width="500"
              height="280"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

