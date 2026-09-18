import React from 'react';
import './CommunityBlock.css';
import { FacebookIcon } from '../common/Icons';
import { ChottoWordmark } from '../common/ChottoWordmark';

/**
 * Community card — the fanpage call to action.
 *
 * Rendered as a column inside HomeContentColumns rather than as a full-width
 * band, so it sits level with the "Có thể bạn đang quan tâm" list beside it.
 */
export function CommunityBlock() {
  return (
    <div className="community-card">
      <div className="community-card-body">
        <p className="community-card-script">
          Một chút thông tin<br />
          Một chút công cụ<br />
          Một chút kết nối<br />
          = Cuộc sống dễ dàng hơn! ☺
        </p>

        <div className="community-card-foot">
          <div className="community-card-brand">
            <ChottoWordmark width={150} />
            <span className="community-card-tagline">Một chút hữu ích, mỗi ngày.</span>
          </div>

          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="community-card-btn"
            aria-label="Theo dõi Fanpage Chotto trên Facebook"
          >
            <FacebookIcon size={17} color="#ffffff" />
            <span>Theo dõi Fanpage</span>
          </a>
        </div>
      </div>

      <div className="community-card-visual">
        <img
          src="/images/hero-clean-japan.webp"
          alt="Bạn trẻ người Việt trên phố Nhật Bản"
          className="community-card-img"
          loading="lazy"
          width="500"
          height="280"
        />
        <div className="community-card-img-scrim" aria-hidden="true" />
        <p className="community-card-overlay-note" aria-hidden="true">
          Good<br />Ideas<br />Brighter<br />Days
        </p>
      </div>
    </div>
  );
}
