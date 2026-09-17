import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './MobileMenu.css';
import { CloseIcon, ExternalLinkIcon, ArrowRightIcon } from '../common/Icons';
import { getAllCategories } from '../../content/categories/categoryMap';
import { TOOLIO_BASE_URL } from '../../config/constants';

export function MobileMenu({ isOpen, onClose, triggerRef }) {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const categories = getAllCategories();

  // Focus trap & ESC key handling
  useEffect(() => {
    if (!isOpen) return;

    // Focus the close button when drawer opens
    const focusTimer = setTimeout(() => {
      if (closeButtonRef.current) {
        closeButtonRef.current.focus();
      }
    }, 50);

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab' && drawerRef.current) {
        const focusableElements = drawerRef.current.querySelectorAll(
          'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: loop from first to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: loop from last to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(focusTimer);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Return focus to menu trigger button after closing
  const prevIsOpen = useRef(isOpen);
  useEffect(() => {
    if (prevIsOpen.current && !isOpen) {
      if (triggerRef && triggerRef.current) {
        triggerRef.current.focus();
      } else {
        const trigger = document.getElementById('mobile-menu-trigger');
        if (trigger) trigger.focus();
      }
    }
    prevIsOpen.current = isOpen;
  }, [isOpen, triggerRef]);

  // Prevent background scrolling & lock background interaction
  useEffect(() => {
    const mainContent = document.getElementById('main-content');
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      if (mainContent) {
        mainContent.setAttribute('aria-hidden', 'true');
        mainContent.setAttribute('inert', '');
      }
    } else {
      document.body.style.overflow = '';
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
        mainContent.removeAttribute('inert');
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (mainContent) {
        mainContent.removeAttribute('aria-hidden');
        mainContent.removeAttribute('inert');
      }
    };
  }, [isOpen]);

  return (
    <div
      className={`mobile-menu-backdrop ${isOpen ? 'open' : ''}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        id="mobile-menu-drawer"
        ref={drawerRef}
        className="mobile-menu-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Menu điều hướng di động"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mobile-menu-header">
          <Link to="/" onClick={onClose} aria-label="Trang chủ Chotto">
            <img
              src="/chotto-logo-full.svg"
              alt="Chotto"
              width="120"
              height="26"
            />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className="mobile-menu-close-btn"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <CloseIcon size={20} />
          </button>
        </div>

        <div className="mobile-menu-content">
          <nav aria-label="Điều hướng di động">
            <ul className="mobile-nav-list">
              <li>
                <Link to="/" className="mobile-nav-item" onClick={onClose}>
                  <span>Trang chủ</span>
                  <ArrowRightIcon size={16} color="var(--text-muted)" />
                </Link>
              </li>
              <li>
                <Link to="/articles" className="mobile-nav-item" onClick={onClose}>
                  <span>Bài viết</span>
                  <ArrowRightIcon size={16} color="var(--text-muted)" />
                </Link>
              </li>
              <li>
                <Link to="/#topics" className="mobile-nav-item" onClick={onClose}>
                  <span>Chủ đề</span>
                  <ArrowRightIcon size={16} color="var(--text-muted)" />
                </Link>
              </li>
              <li>
                <Link to="/topics/tools" className="mobile-nav-item" onClick={onClose}>
                  <span>Công cụ Chotto</span>
                  <ArrowRightIcon size={16} color="var(--text-muted)" />
                </Link>
              </li>
              <li>
                <Link to="/#about" className="mobile-nav-item" onClick={onClose}>
                  <span>Về Chotto</span>
                  <ArrowRightIcon size={16} color="var(--text-muted)" />
                </Link>
              </li>
            </ul>
          </nav>

          <div className="mobile-categories-section">
            <div className="mobile-section-title">6 Nhóm Chủ Đề</div>
            <div className="mobile-cat-grid" role="list">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={cat.path}
                  className="mobile-cat-link"
                  onClick={onClose}
                >
                  <span className={`mobile-cat-dot cat-dot-${cat.colorKey}`} />
                  <span>{cat.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mobile-menu-footer">
          <a
            href={TOOLIO_BASE_URL}
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
