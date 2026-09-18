import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import './Navbar.css';
import { SearchIcon, MenuIcon, ChevronDownIcon } from '../common/Icons';
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
    navigate('/articles');
    setNavSearch('');
  };

  return (
    <header className="navbar-wrapper" role="banner">
      <div className="container navbar-inner">
        {/* Brand Logo with Tagline */}
        <Link to="/" className="navbar-brand" aria-label="Chotto — Sống dễ hơn ở Nhật">
          <img
            src="/chotto-logo-full.svg"
            alt="Chotto"
            className="navbar-logo-img"
            width="136"
            height="32"
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav" aria-label="Chính">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/articles"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Bài viết
          </NavLink>
          <a href="/#topics" className="navbar-link navbar-dropdown-link">
            <span>Chủ đề</span>
            <ChevronDownIcon size={12} />
          </a>
          <NavLink
            to="/tools"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Công cụ
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}
          >
            Về Chotto
          </NavLink>
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Integrated Search Box (Desktop) */}
          <form className="navbar-search-form" onSubmit={handleNavSearchSubmit} role="search">
            <SearchIcon size={14} className="navbar-search-icon" />
            <input
              type="search"
              className="navbar-search-input"
              placeholder="Tìm kiếm... (ví dụ: thuế, nenkin, nhà ở...)"
              value={navSearch}
              onChange={(e) => setNavSearch(e.target.value)}
              aria-label="Tìm kiếm trên Chotto"
            />
          </form>

          {/* Language Selector */}
          <div className="navbar-lang-pill" title="Ngôn ngữ: Tiếng Việt" aria-label="Tiếng Việt">
            <span>VI</span>
            <ChevronDownIcon size={11} />
          </div>

          {/* Mobile Search Icon Button */}
          <button
            type="button"
            className="navbar-mobile-search-btn"
            onClick={onFocusSearch}
            aria-label="Tìm kiếm nội dung"
          >
            <SearchIcon size={19} />
          </button>

          {/* Mobile Hamburger Button */}
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

