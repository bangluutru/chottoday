import React from 'react';
import { Link } from 'react-router-dom';
import { Hero } from '../components/sections/Hero';
import { ToolShowcase } from '../components/sections/ToolShowcase';
import { LatestContent } from '../components/sections/LatestContent';
import { CategoryGrid } from '../components/category/CategoryGrid';
import { HomeContentColumns } from '../components/sections/HomeContentColumns';
import { PageMeta } from '../components/common/PageMeta';
import { ArrowRightIcon } from '../components/common/Icons';

export function HomePage({ searchInputRef, onSearch }) {
  return (
    <>
      <PageMeta
        title="Sống ở Nhật, dễ hơn một chút"
        description="Thông tin, hướng dẫn và công cụ hữu ích dành cho người Việt tại Nhật. Từ thủ tục hành chính, thuế, việc làm đến cuộc sống thường ngày."
        canonical="/"
      />

      {/* 1. HERO — photo band with the discovery search */}
      <Hero searchInputRef={searchInputRef} onSearch={onSearch} />

      {/* 2. CÔNG CỤ TIỆN ÍCH */}
      <ToolShowcase />

      {/* 3. BÀI VIẾT MỚI NHẤT */}
      <LatestContent />

      {/* 4. KHÁM PHÁ THEO CHỦ ĐỀ */}
      <section className="topics-section" id="topics" aria-labelledby="topics-heading">
        <div className="container">
          <div className="chotto-panel">
            <div className="section-head-bar">
              <div className="section-head-icon head-icon-life">
                <img src="/icons/icon-study.svg" alt="" width="26" height="26" />
              </div>
              <div className="section-head-left">
                <h2 id="topics-heading" className="section-title-with-icon">Khám phá theo chủ đề</h2>
                <p className="section-desc-subtle">
                  Chọn chủ đề bạn quan tâm để xem tất cả hướng dẫn và công cụ liên quan.
                </p>
              </div>
              <Link to="/articles" className="section-link-more">
                <span>Xem tất cả</span>
                <ArrowRightIcon size={14} />
              </Link>
            </div>

            <CategoryGrid />
          </div>
        </div>
      </section>

      {/* 5. CÓ THỂ BẠN ĐANG QUAN TÂM + CỘNG ĐỒNG CHOTTO */}
      <HomeContentColumns />
    </>
  );
}

export default HomePage;
