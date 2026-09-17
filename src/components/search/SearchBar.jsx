import React, { useState, forwardRef } from 'react';
import './SearchBar.css';
import { SearchIcon, CloseIcon } from '../common/Icons';

export const SearchBar = forwardRef(function SearchBar(
  { onSearch, initialValue = '' },
  ref
) {
  const [query, setQuery] = useState(initialValue);

  const quickIntents = [
    'Gia hạn visa',
    'Khai thuế cuối năm',
    'Chuyển nhà',
    'Lấy lại tiền nenkin',
    'Đổi bằng lái',
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(query);
  };

  const handleIntentClick = (intent) => {
    setQuery(intent);
    if (onSearch) onSearch(intent);
  };

  const handleClear = () => {
    setQuery('');
    if (onSearch) onSearch('');
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} role="search" aria-label="Tìm kiếm trên Chotto">
        <div className="search-box-wrapper">
          <div className="search-icon-wrapper">
            <SearchIcon size={20} color="var(--text-muted)" />
          </div>

          <input
            ref={ref}
            type="search"
            className="search-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Bạn đang cần tìm gì? (Ví dụ: thuế, nenkin, đổi bằng lái, nhà ở...)"
            aria-label="Nhập từ khóa cần tìm kiếm"
            autoComplete="off"
            spellCheck="false"
          />

          {query && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label="Xóa từ khóa tìm kiếm"
            >
              <CloseIcon size={14} />
            </button>
          )}

          <button type="submit" className="search-submit-btn">
            Tìm
          </button>
        </div>
      </form>

      {/* Quick Intents / Suggested queries */}
      <div className="quick-intents-wrapper" aria-label="Gợi ý tìm kiếm phổ biến">
        <span className="quick-intents-label">Gợi ý nhanh:</span>
        {quickIntents.map((intent) => (
          <button
            key={intent}
            type="button"
            className="intent-chip"
            onClick={() => handleIntentClick(intent)}
          >
            {intent}
          </button>
        ))}
      </div>
    </div>
  );
});
