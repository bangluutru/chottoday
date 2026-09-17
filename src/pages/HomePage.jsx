import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/sections/Hero';
import { UsefulToday } from '../components/sections/UsefulToday';
import { CategoryGrid } from '../components/category/CategoryGrid';
import { HomeContentColumns } from '../components/sections/HomeContentColumns';
import { CommunityBlock } from '../components/sections/CommunityBlock';
import { PageMeta } from '../components/common/PageMeta';
import { ArrowRightIcon } from '../components/common/Icons';

export function HomePage({ searchInputRef, onSearch }) {
  return (
    <>
      <PageMeta
        title="Vấn đề nhỏ, có Chotto giúp một chút."
        description="Thông tin, hướng dẫn và công cụ hữu ích cho người Việt sống tại Nhật Bản. Từ thủ tục hành chính, thuế, việc làm đến cuộc sống thường ngày."
        canonical="/"
      />

      {/* 1. HERO WITH LIVE DISCOVERY SEARCH */}
      <Hero searchInputRef={searchInputRef} onSearch={onSearch} />

      {/* 2. HÔM NAY CÓ GÌ HỮU ÍCH? */}
      <UsefulToday />

      {/* 3. KHÁM PHÁ THEO CHỦ ĐỀ */}
      <section className="section topics-section" id="topics" aria-labelledby="topics-heading">
        <div className="container">
          <div className="section-head-bar">
            <div className="section-head-left">
              <h2 id="topics-heading" className="section-title-with-icon">
                <span className="section-icon-emoji" role="img" aria-label="Cây non">🌱</span>
                <span>Khám phá theo chủ đề</span>
              </h2>
              <p className="section-desc-subtle">
                Chọn chủ đề bạn quan tâm để xem tất cả bài viết hướng dẫn và công cụ hỗ trợ liên quan.
              </p>
            </div>
            <Link to="/articles" className="section-link-more">
              <span>Xem tất cả</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          <CategoryGrid />
        </div>
      </section>

      {/* 4. TWO-COLUMN SECTION: MỚI TRÊN CHOTTO + MỘT CHÚT CÔNG CỤ */}
      <HomeContentColumns />

      {/* 5. CHOTTO FACEBOOK COMMUNITY BANNER */}
      <CommunityBlock />
    </>
  );
}

export default HomePage;

