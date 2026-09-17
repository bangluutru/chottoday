import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';
import { SearchIcon, CloseIcon, ArrowRightIcon, ExternalLinkIcon } from '../common/Icons';
import { searchArticles } from '../../content/articles';
import { SELECTED_TOOLS } from '../../data/toolsMock';

export const SearchBar = forwardRef(function SearchBar(
  { onSearch, initialValue = '' },
  ref
) {
  const [query, setQuery] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [articleResults, setArticleResults] = useState([]);
  const [toolResults, setToolResults] = useState([]);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Quick intents requested in Specification 6
  const quickIntents = [
    'Thuế',
    'Nenkin',
    'Nhà ở',
    'Đổi bằng lái',
    'Thẻ cư trú',
    'Việc làm',
    'Học tiếng Nhật',
  ];

  // Perform lightweight real-time search
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setArticleResults([]);
      setToolResults([]);
      setShowSuggestions(false);
      return;
    }

    // Articles search
    const matchedArticles = searchArticles(trimmed).slice(0, 4);
    setArticleResults(matchedArticles);

    // Tools search
    const lower = trimmed.toLowerCase();
    const matchedTools = SELECTED_TOOLS.filter((t) => {
      return (
        t.name.toLowerCase().includes(lower) ||
        t.description.toLowerCase().includes(lower) ||
        t.category.toLowerCase().includes(lower) ||
        (lower.includes('thue') && t.id.includes('tax')) ||
        (lower.includes('thuế') && t.id.includes('tax')) ||
        (lower.includes('nenkin') && t.id.includes('nenkin')) ||
        (lower.includes('the') && t.id.includes('photo')) ||
        (lower.includes('thẻ') && t.id.includes('photo')) ||
        (lower.includes('hoa don') && t.id.includes('invoice')) ||
        (lower.includes('hóa đơn') && t.id.includes('invoice'))
      );
    }).slice(0, 3);
    setToolResults(matchedTools);

    setShowSuggestions(true);
  }, [query]);

  // Handle clicking outside to dismiss suggestions
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions(false);
    if (onSearch) {
      onSearch(query.trim());
    } else {
      navigate(`/articles?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleIntentClick = (intent) => {
    setQuery(intent);
    setShowSuggestions(true);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    if (onSearch) onSearch('');
  };

  const handleSelectArticle = (slug) => {
    setShowSuggestions(false);
    navigate(`/articles/${slug}`);
  };

  const handleSeeAll = () => {
    setShowSuggestions(false);
    navigate(`/articles?q=${encodeURIComponent(query.trim())}`);
  };

  const totalResults = articleResults.length + toolResults.length;

  return (
    <div className="search-container" ref={containerRef}>
      <form onSubmit={handleSubmit} role="search" aria-label="Tìm kiếm trên Chotto" className="search-form">
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
            onFocus={() => {
              if (query.trim()) setShowSuggestions(true);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setShowSuggestions(false);
              }
            }}
            placeholder="Bạn đang cần tìm gì? Ví dụ: thuế, nenkin, đổi bằng lái…"
            aria-label="Nhập từ khóa cần tìm kiếm"
            autoComplete="off"
            spellCheck="false"
            aria-expanded={showSuggestions}
            aria-controls="search-suggestions-dropdown"
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

        {/* Real-time suggestions popup */}
        {showSuggestions && (
          <div
            id="search-suggestions-dropdown"
            className="search-suggestions-dropdown"
            role="listbox"
            aria-label="Gợi ý kết quả tìm kiếm"
          >
            {totalResults === 0 ? (
              <div className="search-empty-state">
                Không tìm thấy bài viết hoặc công cụ nào khớp với "{query}".
              </div>
            ) : (
              <>
                {/* 1. ARTICLES SUGGESTIONS */}
                {articleResults.length > 0 && (
                  <div>
                    <div className="suggestion-group-title">Bài viết ({articleResults.length})</div>
                    {articleResults.map((article) => (
                      <div
                        key={article.id}
                        className="suggestion-item"
                        role="option"
                        onClick={() => handleSelectArticle(article.slug)}
                      >
                        <div className="suggestion-main">
                          <div className="suggestion-title">{article.title}</div>
                          <div className="suggestion-meta">
                            <span>{article.readingTime} phút đọc</span>
                            <span>·</span>
                            <span>{article.tags.slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                        <ArrowRightIcon size={14} color="var(--text-muted)" />
                      </div>
                    ))}
                  </div>
                )}

                {/* 2. TOOLS SUGGESTIONS */}
                {toolResults.length > 0 && (
                  <div>
                    <div className="suggestion-group-title">Công cụ Toolio ({toolResults.length})</div>
                    {toolResults.map((tool) => (
                      <a
                        key={tool.id}
                        href={tool.toolioPath}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="suggestion-item"
                        role="option"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="suggestion-main">
                          <div className="suggestion-title">{tool.name}</div>
                          <div className="suggestion-meta">
                            <span>{tool.description.slice(0, 60)}...</span>
                          </div>
                        </div>
                        <span className="suggestion-tool-badge">
                          <span>Mở miniapp</span>
                          <ExternalLinkIcon size={12} style={{ marginLeft: '4px' }} />
                        </span>
                      </a>
                    ))}
                  </div>
                )}

                {/* 3. SEE ALL RESULTS ACTION */}
                <button
                  type="button"
                  className="search-see-all-btn"
                  onClick={handleSeeAll}
                >
                  <span>Xem tất cả kết quả cho "{query}"</span>
                  <ArrowRightIcon size={14} />
                </button>
              </>
            )}
          </div>
        )}
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
