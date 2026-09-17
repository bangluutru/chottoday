import React from 'react';
import './CommunityBlock.css';
import { FacebookIcon, ArrowRightIcon } from '../common/Icons';

export function CommunityBlock() {
  return (
    <section className="section" id="about" aria-labelledby="community-heading">
      <div id="community" />
      <div className="container">
        <div className="community-card">
          <div>
            <div className="section-eyebrow community-header-eyebrow">
              Cộng đồng hỗ trợ & Về Chotto
            </div>

            <h2 id="community-heading" className="text-h2 community-title">
              Gặp vấn đề chưa có lời giải?{'\n'}Hỏi Chotto trên Facebook.
            </h2>

            <p className="text-body community-desc">
              Không ai biết hết mọi việc ở một đất nước mới. Chotto cùng cộng đồng người Việt lâu năm tại Nhật sẵn sàng lắng nghe và gợi ý hướng đi cho bạn.
            </p>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary community-btn"
            >
              <FacebookIcon size={18} />
              <span>Tham gia Chotto Community</span>
              <ArrowRightIcon size={16} />
            </a>
          </div>

          <div className="community-quote-card">
            <div className="community-quote-heading">
              “Vấn đề nhỏ, có chỗ để hỏi.”
            </div>
            <p className="text-body community-quote-text">
              Mỗi câu hỏi của bạn là một gợi ý để đội ngũ Chotto hoàn thiện thêm những bài viết hướng dẫn và miniapps công cụ hữu ích cho cộng đồng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
