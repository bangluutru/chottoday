import React, { useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MobileMenu.css';
import { CloseIcon, FacebookIcon, SearchIcon } from '../common/Icons';
import { ChottoWordmark } from '../common/ChottoWordmark';
import { getCategoryById } from '../../content/categories/categoryMap';
import { FANPAGE_URL } from '../../config/constants';

/** The five drawer links, each with its brand dot, in design order. */
const NAV_ITEMS = [
  { to: '/', label: 'Trang chủ', dot: 'var(--chotto-coral)', end: true },
  { to: '/articles', label: 'Bài viết', dot: 'var(--chotto-orange)' },
  { to: '/tools', label: 'Công cụ', dot: 'var(--chotto-cyan)' },
  { to: '/topics', label: 'Chủ đề', dot: 'var(--chotto-green)' },
  { to: '/about', label: 'Về Chotto', dot: 'var(--chotto-violet)' },
];

/** Three shortcuts under the nav, resolved from the taxonomy. */
const QUICK_TOPIC_IDS = ['newcomer', 'work', 'health'];

const LANGUAGES = ['VI', 'JA', 'EN'];

export function MobileMenu({ isOpen, onClose, triggerRef }) {
  const drawerRef = useRef(null);
  const closeButtonRef = useRef(null);
  const navigate = useNavigate();

  const quickTopics = QUICK_TOPIC_IDS.map(getCategoryById).filter(Boolean);

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

  const goToSearch = () => {
    onClose();
    navigate('/search');
  };

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
            <ChottoWordmark width={92} />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            className="mobile-menu-close-btn"
            onClick={onClose}
            aria-label="Đóng menu"
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Opens the search page rather than typing in the drawer: one field
            for the query, on the page that owns it. */}
        <button type="button" className="mobile-menu-search" onClick={goToSearch}>
          <SearchIcon size={17} />
          <span>Tìm kiếm trên Chotto</span>
        </button>

        <nav className="mobile-menu-nav" aria-label="Điều hướng di động">
          {NAV_ITEMS.map((item) => (
            <Link key={item.to} to={item.to} className="mobile-nav-item" onClick={onClose}>
              <span className="mobile-nav-dot" style={{ backgroundColor: item.dot }} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mobile-menu-chips">
          {quickTopics.map((category) => (
            <Link
              key={category.id}
              to={category.path}
              className="mobile-menu-chip"
              onClick={onClose}
            >
              {category.shortName}
            </Link>
          ))}
        </div>

        <div className="mobile-menu-footer">
          <p className="mobile-menu-note">
            Một chút hữu ích,
            <br />
            mỗi ngày ☺
          </p>
          <div className="mobile-menu-footer-row">
            <a
              href={FANPAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-menu-fb"
              aria-label="Fanpage Chotto trên Facebook"
            >
              <FacebookIcon size={18} color="#ffffff" />
            </a>
            <div className="mobile-menu-lang" role="group" aria-label="Ngôn ngữ">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang}
                  type="button"
                  className={`mobile-menu-lang-btn ${lang === 'VI' ? 'active' : ''}`}
                  aria-pressed={lang === 'VI'}
                  disabled={lang !== 'VI'}
                  title={lang === 'VI' ? 'Tiếng Việt' : 'Sắp có'}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
