import React, { useState, useRef, useEffect } from 'react';
import { Navbar } from './components/layout/Navbar';
import { MobileMenu } from './components/layout/MobileMenu';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { UsefulToday } from './components/sections/UsefulToday';
import { NeedHelp } from './components/sections/NeedHelp';
import { CategoryGrid } from './components/category/CategoryGrid';
import { LatestContent } from './components/sections/LatestContent';
import { ToolShowcase } from './components/sections/ToolShowcase';
import { CommunityBlock } from './components/sections/CommunityBlock';

export function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const menuTriggerRef = useRef(null);

  // Focus search input when triggered
  const handleFocusSearch = () => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
      searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Global keyboard shortcut for ⌘K or /
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleFocusSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (query) => {
    if (!query) return;
    const target = document.getElementById('articles');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catId) => {
    const target = document.getElementById(`category-${catId}`);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="app-shell">
      {/* 1. NAVBAR */}
      <Navbar
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onFocusSearch={handleFocusSearch}
        isMobileMenuOpen={mobileMenuOpen}
        menuTriggerRef={menuTriggerRef}
      />

      {/* MOBILE DRAWER */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        triggerRef={menuTriggerRef}
      />

      <main id="main-content" className="main-content">
        {/* 2. HERO */}
        <Hero
          searchInputRef={searchInputRef}
          onSearch={handleSearch}
        />

        {/* 3. HÔM NAY CÓ GÌ HỮU ÍCH? */}
        <UsefulToday />

        {/* 4. CÓ THỂ BẠN ĐANG CẦN */}
        <NeedHelp />

        {/* 5. KHÁM PHÁ THEO CHỦ ĐỀ */}
        <section className="section" id="topics" aria-labelledby="topics-heading">
          <div className="container">
            <div className="section-header">
              <div className="section-eyebrow">
                Hệ thống phân loại
              </div>
              <h2 id="topics-heading" className="text-h2">
                Khám phá theo chủ đề
              </h2>
            </div>

            <CategoryGrid onSelectCategory={handleSelectCategory} />
          </div>
        </section>

        {/* 6. MỚI TRÊN CHOTTO */}
        <LatestContent />

        {/* 7. MỘT CHÚT CÔNG CỤ */}
        <ToolShowcase />

        {/* 8. CHOTTO FACEBOOK & ABOUT */}
        <CommunityBlock />
      </main>

      {/* 9. FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
