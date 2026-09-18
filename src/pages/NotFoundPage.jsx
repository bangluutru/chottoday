import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './NotFoundPage.css';
import { PageMeta } from '../components/common/PageMeta';
import { ArrowRightIcon, SearchIcon } from '../components/common/Icons';
import { setEphemeralQuery } from '../services/discovery/searchStore';

/** The four routes people most often land here looking for. */
const POPULAR = [
  {
    to: '/tools/luong-thuc-nhan',
    label: 'Tính lương thực nhận',
    icon: '/icons/icon-tool.svg',
    tint: 'tool',
  },
  {
    to: '/articles/luong-30-man-thuc-nhan-bao-nhieu',
    label: 'Lương 30 man còn lại bao nhiêu?',
    icon: '/icons/icon-doc.svg',
    tint: 'health',
  },
  {
    to: '/topics/newcomer',
    label: 'Mới sang Nhật',
    icon: '/icons/icon-study.svg',
    tint: 'life',
  },
  {
    to: '/tools',
    label: 'Tất cả công cụ',
    icon: '/icons/icon-life.svg',
    tint: 'work',
  },
];

export function NotFoundPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = query.trim();
    setEphemeralQuery(trimmed);
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search');
  };

  return (
    <div className="notfound-page">
      <PageMeta
        title="404 — Không tìm thấy trang"
        description="Đường dẫn có thể đã thay đổi, hoặc nội dung đang được cập nhật lại. Thử tìm kiếm, hoặc quay về trang chủ."
        robots="noindex, nofollow"
      />

      <div className="container notfound-container">
        <div className="notfound-top">
          <div className="notfound-main">
            <div className="notfound-mark">
              <svg viewBox="0 0 360 360" role="img" aria-label="404" className="notfound-mark-ring">
                <circle
                  cx="180"
                  cy="180"
                  r="130"
                  fill="none"
                  stroke="var(--chotto-orange)"
                  strokeWidth="100"
                />
              </svg>
              <div className="notfound-mark-digits" aria-hidden="true">
                4<span className="notfound-mark-zero">0</span>4
              </div>
            </div>

            <h1 className="notfound-title">Trang này đi đâu mất rồi ☺</h1>
            <p className="notfound-desc">
              Có thể đường dẫn đã thay đổi, hoặc nội dung đang được cập nhật lại. Thử tìm
              kiếm bên dưới, hoặc quay về trang chủ nhé.
            </p>

            <form className="notfound-search" role="search" onSubmit={handleSubmit}>
              <SearchIcon size={19} className="notfound-search-icon" />
              <input
                type="search"
                className="notfound-search-input"
                aria-label="Tìm kiếm trên Chotto"
                placeholder="Tìm nội dung bạn cần…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button type="submit" className="notfound-search-btn">
                Tìm kiếm
              </button>
            </form>

            <div className="notfound-actions">
              <Link to="/" className="notfound-btn-ink">
                <span className="notfound-btn-arrow" aria-hidden="true">
                  ←
                </span>
                Về trang chủ
              </Link>
              <Link to="/about#lien-he" className="notfound-btn-plain">
                Báo cho Chotto biết
              </Link>
            </div>
          </div>

          <div className="notfound-side">
            <p className="notfound-note">
              Đi lạc một chút
              <br />
              cũng không sao,
              <br />
              Chotto dẫn bạn về!
              <span className="notfound-note-face" aria-hidden="true">
                ☺
              </span>
            </p>
            <img
              src="/images/community/fuji-sakura.jpg"
              alt=""
              className="notfound-photo"
              loading="lazy"
            />
          </div>
        </div>

        <div className="notfound-popular">
          <h2 className="notfound-popular-title">Mọi người thường tìm những mục này</h2>
          <div className="notfound-popular-grid">
            {POPULAR.map((item) => (
              <Link key={item.to} to={item.to} className="notfound-popular-card">
                <span className={`notfound-popular-icon head-icon-${item.tint}`}>
                  <img src={item.icon} alt="" width="22" height="22" />
                </span>
                <span className="notfound-popular-label">{item.label}</span>
                <ArrowRightIcon size={14} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFoundPage;
