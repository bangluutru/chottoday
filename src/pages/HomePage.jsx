import React, { useEffect } from 'react';
import { Hero } from '../components/sections/Hero';
import { UsefulToday } from '../components/sections/UsefulToday';
import { NeedHelp } from '../components/sections/NeedHelp';
import { CategoryGrid } from '../components/category/CategoryGrid';
import { LatestContent } from '../components/sections/LatestContent';
import { ToolShowcase } from '../components/sections/ToolShowcase';
import { CommunityBlock } from '../components/sections/CommunityBlock';

export function HomePage({ searchInputRef, onSearch }) {
  useEffect(() => {
    document.title = 'Chotto — Vấn đề nhỏ, có Chotto giúp một chút.';
  }, []);

  return (
    <>
      {/* 1. HERO WITH LIVE SEARCH */}
      <Hero searchInputRef={searchInputRef} onSearch={onSearch} />

      {/* 2. HÔM NAY CÓ GÌ HỮU ÍCH? */}
      <UsefulToday />

      {/* 3. CÓ THỂ BẠN ĐANG CẦN (User Intent Discovery) */}
      <NeedHelp />

      {/* 4. KHÁM PHÁ THEO CHỦ ĐỀ */}
      <section className="section" id="topics" aria-labelledby="topics-heading">
        <div className="container">
          <div className="section-header">
            <div className="section-eyebrow">
              Hệ thống phân loại
            </div>
            <h2 id="topics-heading" className="text-h2">
              Khám phá theo chủ đề
            </h2>
            <p className="text-body">
              Chọn chủ đề bạn quan tâm để xem tất cả bài viết hướng dẫn và công cụ hỗ trợ liên quan.
            </p>
          </div>

          <CategoryGrid />
        </div>
      </section>

      {/* 5. MỚI TRÊN CHOTTO (Editorial List) */}
      <LatestContent />

      {/* 6. MỘT CHÚT CÔNG CỤ (Decoupled Toolio Miniapps) */}
      <ToolShowcase />

      {/* 7. CHOTTO FACEBOOK & ABOUT */}
      <CommunityBlock />
    </>
  );
}

export default HomePage;
