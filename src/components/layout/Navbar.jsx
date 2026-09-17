import React from 'react';
import './Navbar.css';
import { SearchIcon, MenuIcon } from '../common/Icons';

export function Navbar({ onOpenMobileMenu, onFocusSearch }) {
  return (
    <header className="navbar-wrapper" role="banner">
      <div className="container navbar-inner">
        {/* Brand Logo (6-color official vector logo on light canvas) */}
        <a href="/" className="navbar-brand" aria-label="Chotto — Trang chủ">
          <img
            src="/chotto-logo-full.svg"
            alt="Chotto"
            className="navbar-logo-img"
            width="152"
            height="32"
          />
        </a>

        {/* Desktop Navigation Links */}
        <nav className="navbar-nav" aria-label="Chính">
          <a href="/" className="navbar-link active">
            Trang chủ
          </a>
          <a href="#articles" className="navbar-link">
            Bài viết
          </a>
          <a href="#topics" className="navbar-link">
            Chủ đề
          </a>
          <a href="#tools" className="navbar-link">
            Công cụ
          </a>
          <a href="#about" className="navbar-link">
            Về Chotto
          </a>
        </nav>

        {/* Right Actions */}
        <div className="navbar-actions">
          <button
            type="button"
            className="navbar-search-btn"
            onClick={onFocusSearch}
            aria-label="Tìm kiếm nội dung trên Chotto"
          >
            <SearchIcon size={16} color="var(--text-secondary)" />
            <span>Tìm kiếm...</span>
            <kbd className="navbar-search-shortcut">⌘K</kbd>
          </button>

          <span className="navbar-lang-badge" title="Ngôn ngữ: Tiếng Việt" aria-label="Tiếng Việt">
            VI
          </span>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            className="navbar-menu-btn"
            onClick={onOpenMobileMenu}
            aria-label="Mở menu điều hướng"
            aria-expanded="false"
          >
            <MenuIcon size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
