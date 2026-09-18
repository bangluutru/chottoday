import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './SearchBar.css';
import { SearchIcon, CloseIcon, ArrowRightIcon, ExternalLinkIcon } from '../common/Icons';
import { discover, setEphemeralQuery } from '../../services/discovery/index.js';
import { buildToolUrl } from '../../services/toolRegistry/index.js';
import { HOME_SEARCH_CHIPS } from '../../data/homepage.js';

export const SearchBar = forwardRef(function SearchBar(
  { onSearch, initialValue = '' },
  ref
) {
  const [query, setQuery] = useState(initialValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [discoveryResult, setDiscoveryResult] = useState(null);
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Quick intent chips sit directly under the field, as in the design
  const quickIntents = HOME_SEARCH_CHIPS;

  // Perform intelligent real-time discovery
  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      setDiscoveryResult(null);
      setShowSuggestions(false);
      return;
    }

    const res = discover(trimmed);
    setDiscoveryResult(res);
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
    const trimmed = query.trim();
    if (!trimmed) return;
    setShowSuggestions(false);
    setEphemeralQuery(trimmed);
    if (onSearch) {
      onSearch(trimmed);
    } else {
      navigate('/articles');
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

  const handleSeeAll = () => {
    const trimmed = query.trim();
    setShowSuggestions(false);
    setEphemeralQuery(trimmed);
    navigate('/articles');
  };

  const articles = discoveryResult?.results?.articles?.slice(0, 3) || [];
  const problems = discoveryResult?.results?.problems?.slice(0, 2) || [];
  const tools = discoveryResult?.results?.tools?.slice(0, 2) || [];
  const primaryConcept = discoveryResult?.intent?.primaryConcept || null;
  const totalResults = articles.length + problems.length + tools.length;

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
            size="1"
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
            placeholder="Bạn đang tìm gì? (ví dụ: thuế, đổi bằng lái…)"
            aria-label="Nhập vấn đề hoặc từ khóa cần tìm kiếm"
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
            <SearchIcon size={15} color="#ffffff" className="search-btn-icon" />
            <span>Tìm kiếm</span>
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
            {/* Concept recognition banner */}
            {primaryConcept && (
              <div className="suggestion-concept-header">
                <span className="suggestion-concept-tag">Chủ đề: {primaryConcept.name}</span>
              </div>
            )}

            {totalResults === 0 ? (
              <div className="search-empty-state">
                Chotto chưa tìm thấy nội dung phù hợp. Thử tìm theo từ khóa hoặc xem các chủ đề bên dưới.
              </div>
            ) : (
              <>
                {/* 1. ARTICLES SUGGESTIONS */}
                {articles.length > 0 && (
                  <div>
                    <div className="suggestion-group-title">Bài viết hướng dẫn ({articles.length})</div>
                    {articles.map((article) => (
                      <Link
                        key={article.id}
                        to={`/articles/${article.slug}`}
                        className="suggestion-item"
                        role="option"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="suggestion-main">
                          <div className="suggestion-title">{article.title}</div>
                          <div className="suggestion-meta">
                            <span>{article.readingTime} phút đọc</span>
                            <span>·</span>
                            <span>{(article.tags || []).slice(0, 2).join(', ')}</span>
                          </div>
                        </div>
                        <ArrowRightIcon size={14} color="var(--text-muted)" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* 2. PROBLEMS / SITUATIONS SUGGESTIONS */}
                {problems.length > 0 && (
                  <div>
                    <div className="suggestion-group-title">Tình huống thực tế ({problems.length})</div>
                    {problems.map((prob) => (
                      <Link
                        key={prob.id}
                        to={prob.targetUrl || '/problems'}
                        className="suggestion-item suggestion-problem-item"
                        role="option"
                        onClick={() => setShowSuggestions(false)}
                      >
                        <div className="suggestion-main">
                          <div className="suggestion-title">💬 {prob.statement}</div>
                          <div className="suggestion-meta">
                            <span>{prob.detail.slice(0, 65)}...</span>
                          </div>
                        </div>
                        <ArrowRightIcon size={14} color="var(--text-muted)" />
                      </Link>
                    ))}
                  </div>
                )}

                {/* 3. TOOLS SUGGESTIONS */}
                {tools.length > 0 && (
                  <div>
                    <div className="suggestion-group-title">Công cụ thực hành ({tools.length})</div>
                    {tools.map((tool) => {
                      const toolUrl = buildToolUrl(tool.id, { source: 'search' });
                      if (!toolUrl) return null;
                      return (
                        <a
                          key={tool.id}
                          href={toolUrl}
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
                            <span>Mở trong Toolio</span>
                            <ExternalLinkIcon size={12} className="suggestion-badge-icon" />
                          </span>
                        </a>
                      );
                    })}
                  </div>
                )}

                {/* 4. SEE ALL RESULTS ACTION */}
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
      <div className="quick-intents-wrapper" role="group" aria-label="Gợi ý tìm kiếm phổ biến">
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
        {/* Overflow affordance: the full keyword set lives on the topics grid */}
        <a href="/#topics" className="intent-chip intent-chip-more" aria-label="Xem thêm từ khoá">
          •••
        </a>
      </div>
    </div>
  );
});
