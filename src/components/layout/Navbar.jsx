import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { SearchIcon, MenuIcon, ChevronDownIcon, GlobeIcon } from '../common/Icons';
import { ChottoWordmark } from '../common/ChottoWordmark';
import { setEphemeralQuery } from '../../services/discovery/searchStore';

export function Navbar({
  onOpenMobileMenu,
  onFocusSearch,
  isMobileMenuOpen = false,
  menuTriggerRef,
}) {
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();

  const handleNavSearchSubmit = (e) => {
    e.preventDefault();
    const trimmed = navSearch.trim();
    if (!trimmed) return;
    setEphemeralQuery(trimmed);
    navigate(`/search?q=${encodeURIComponent(trimmed)}`);
    setNavSearch('');
  };

  return (
    <header className="navbar-wrapper" role="banner">
      <div className="container navbar-inner">
        {/* Brand lockup: wordmark stacked over the tagline */}
        <Link to="/" className="navbar-brand" aria-label="Chotto — Một chút hữu ích, mỗi ngày">
          <ChottoWordmark width={132} className="navbar-logo" />
          <span className="navbar-tagline">Một chút hữu ích, mỗi ngày.</span>
        </Link>

        <nav className="navbar-nav" aria-label="Chính">
          <NavLink to="/" end className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            Trang chủ
          </NavLink>
          <NavLink to="/articles" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            Bài viết
          </NavLink>
          <NavLink to="/tools" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            Công cụ
          </NavLink>
          <NavLink
            to="/topics"
            className={({ isActive }) => `navbar-link navbar-dropdown-link ${isActive ? 'active' : ''}`}
          >
            <span>Chủ đề</span>
            <ChevronDownIcon size={11} />
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            Về Chotto
          </NavLink>
        </nav>

        {/* Right actions: the search pill takes all remaining width and is the
            first thing to shrink, so the nav links never wrap. */}
        <div className="navbar-actions">
          <form className="navbar-search-form" onSubmit={handleNavSearchSubmit} role="search">
            <SearchIcon size={16} className="navbar-search-icon" />
            <input
              type="search"
              size="1"
              className="navbar-search-input"
              placeholder="Tìm kiếm: thuế, nenkin, nhà ở…"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              aria-label="Tìm kiếm trên Chotto"
            />
          </form>

          <button
            type="button"
            className="navbar-lang-btn"
            aria-label="Ngôn ngữ: Tiếng Việt"
            title="Ngôn ngữ: Tiếng Việt"
          >
            <GlobeIcon size={18} />
          </button>

          <button
            type="button"
            className="navbar-mobile-search-btn"
            onClick={onFocusSearch}
            aria-label="Tìm kiếm nội dung"
          >
            <SearchIcon size={19} />
          </button>

          <button
            ref={menuTriggerRef}
            id="mobile-menu-trigger"
            type="button"
            className="navbar-menu-btn"
            onClick={onOpenMobileMenu}
            aria-label={isMobileMenuOpen ? 'Đóng menu điều hướng' : 'Mở menu điều hướng'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu-drawer"
          >
            <MenuIcon size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
