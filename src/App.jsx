import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Navbar } from './components/layout/Navbar';
import { MobileMenu } from './components/layout/MobileMenu';
import { Footer } from './components/layout/Footer';
import { ScrollToTop } from './components/common/ScrollToTop';

import { HomePage } from './pages/HomePage';
import { ArticlesIndexPage } from './pages/ArticlesIndexPage';
import { ArticleDetailPage } from './pages/ArticleDetailPage';
import { CategoryPage } from './pages/CategoryPage';
import { ProblemDiscoveryPage } from './pages/ProblemDiscoveryPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { setEphemeralQuery } from './services/discovery/searchStore.js';

export function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const menuTriggerRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Focus search input when triggered
  const handleFocusSearch = () => {
    if (location.pathname === '/') {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
        searchInputRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      navigate('/articles');
    }
  };

  // Global keyboard shortcut for ⌘K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        handleFocusSearch();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [location.pathname]);

  const handleSearch = (query) => {
    if (!query) return;
    setEphemeralQuery(query);
    navigate('/articles');
  };

  return (
    <div className="app-shell">
      <ScrollToTop />

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
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                searchInputRef={searchInputRef}
                onSearch={handleSearch}
              />
            }
          />
          <Route path="/articles" element={<ArticlesIndexPage />} />
          <Route path="/articles/:slug" element={<ArticleDetailPage />} />
          <Route path="/topics/:category" element={<CategoryPage />} />
          <Route path="/problems" element={<ProblemDiscoveryPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* FOOTER */}
      <Footer />
    </div>
  );
}

export default App;
