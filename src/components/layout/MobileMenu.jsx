import React, { useEffect } from 'react';
import './MobileMenu.css';
import { CloseIcon, ExternalLinkIcon, ArrowRightIcon } from '../common/Icons';
import { CATEGORIES } from '../../data/categories';

export function MobileMenu({ isOpen, onClose }) {
  // Handle ESC key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Prevent background scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <div
      className={`mobile-menu-backdrop ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Menu điều hướng di động"
    >
      <div
        className="mobile-menu-drawer"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-menu-header">
          <img
            src="/chotto-logo-full.svg"
            alt="Chotto"
            width="120"
            height="26"
          />
          <button
            type="button"
            className="mobile-menu-close-btn"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="mobile-menu-content">
          <ul className="mobile-nav-list">
            <li>
              <a href="/" className="mobile-nav-item" onClick={onClose}>
                <span>Trang chủ</span>
                <ArrowRightIcon size={16} color="var(--text-muted)" />
              </a>
            </li>
            <li>
              <a href="#articles" className="mobile-nav-item" onClick={onClose}>
                <span>Bài viết</span>
                <ArrowRightIcon size={16} color="var(--text-muted)" />
              </a>
            </li>
            <li>
              <a href="#topics" className="mobile-nav-item" onClick={onClose}>
                <span>Chủ đề</span>
                <ArrowRightIcon size={16} color="var(--text-muted)" />
              </a>
            </li>
            <li>
              <a href="#tools" className="mobile-nav-item" onClick={onClose}>
                <span>Công cụ Chotto</span>
                <ArrowRightIcon size={16} color="var(--text-muted)" />
              </a>
            </li>
            <li>
              <a href="#about" className="mobile-nav-item" onClick={onClose}>
                <span>Về Chotto</span>
                <ArrowRightIcon size={16} color="var(--text-muted)" />
              </a>
            </li>
          </ul>

          <div className="mobile-categories-section">
            <div className="mobile-section-title">6 Nhóm Chủ Đề</div>
            <div className="mobile-cat-grid">
              {CATEGORIES.map((cat) => (
                <a
                  key={cat.id}
                  href={`#category-${cat.id}`}
                  className="mobile-cat-link"
                  onClick={onClose}
                >
                  <span
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      backgroundColor: cat.accentColor,
                      flexShrink: 0,
                    }}
                  />
                  <span>{cat.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mobile-menu-footer">
          <a
            href="https://tools.chottoday.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-external-tool-btn"
          >
            <span>Mở Toolio Miniapps</span>
            <ExternalLinkIcon size={16} />
          </a>
        </div>
      </div>
    </div>
  );
}
