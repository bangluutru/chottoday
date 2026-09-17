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
    // For Phase 1, scroll smoothly to content and log query
    const target = document.getElementById('articles');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSelectCategory = (catId) => {
    const target = document.getElementById('articles');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* 1. NAVBAR */}
      <Navbar
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onFocusSearch={handleFocusSearch}
      />

      {/* MOBILE DRAWER */}
      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <main id="main-content" style={{ flex: 1 }}>
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
            <div style={{ marginBottom: '24px' }}>
              <div
                className="text-caption"
                style={{
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  marginBottom: '6px',
                  color: 'var(--text-muted)',
                }}
              >
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

        {/* 8. CHOTTO FACEBOOK */}
        <CommunityBlock />
      </main>

      {/* 9. FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
