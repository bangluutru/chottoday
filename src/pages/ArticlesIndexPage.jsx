import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './ArticlesIndexPage.css';
import { getAllArticles } from '../content/articles/index.js';
import { getAllCategories, getCategoryById, CATEGORY_BY_ID } from '../content/categories/categoryMap.js';
import { discover } from '../services/discovery/index.js';
import { buildToolUrl } from '../services/toolRegistry/index.js';
import { trackEvent } from '../services/analytics/index.js';
import { ClockIcon, ArrowRightIcon, SearchIcon, ExternalLinkIcon, CloseIcon } from '../components/common/Icons.jsx';
import { PageMeta } from '../components/common/PageMeta.jsx';
import { DiscoveryQuickSummary } from '../components/search/DiscoveryQuickSummary.jsx';

export function ArticlesIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeSearchTab, setActiveSearchTab] = useState('all'); // 'all', 'articles', 'problems', 'tools'

  const categories = getAllCategories();

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
    if (q.trim()) {
      setActiveSearchTab('all');
    }
  }, [searchParams]);

  // Handle Search Input Change
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim()) {
      setSearchParams({ q: val.trim() });
    } else {
      setSearchParams({});
    }
  };

  const handleClearSearch = () => {
    setQuery('');
    setSearchParams({});
  };

  const isSearching = Boolean(query.trim());

  // Discovery execution when query is present
  const discovery = isSearching ? discover(query.trim()) : null;

  // Track search event safely without recording raw free-text query
  useEffect(() => {
    if (isSearching && discovery) {
      trackEvent('discovery_search', {
        resultCount: discovery.totalCount,
        hasResults: discovery.hasResults,
        category: discovery.intent.category || 'all',
        source: 'articles_index',
      });
    }
  }, [query]);

  // Base list for non-search browsing
  const allArticles = getAllArticles();
  const nonSearchArticles =
    activeCategory === 'all'
      ? allArticles
      : allArticles.filter((a) => a.category === activeCategory);

  return (
    <div className="articles-index-wrapper">
      <PageMeta
        title={isSearching ? `Tìm kiếm: ${query} | Chotto` : 'Tất cả bài viết & hướng dẫn | Chotto'}
        description="Tổng hợp các bài viết giải thích luật pháp, kinh nghiệm thực tiễn và hướng dẫn từng bước cho người Việt sinh sống tại Nhật Bản."
        canonical="/articles"
        robots={isSearching ? 'noindex, follow' : 'index, follow'}
        ogTitle={isSearching ? `Tìm kiếm: ${query} — Chotto` : 'Cẩm nang bài viết Chotto'}
        ogDescription="Tổng hợp các bài viết giải thích luật pháp, kinh nghiệm thực tiễn và hướng dẫn từng bước cho người Việt sinh sống tại Nhật Bản."
      />

      <div className="container">
        {/* Header */}
        <header className="articles-index-header">
          <div className="section-eyebrow">
            {isSearching ? 'Khám phá thông minh' : 'Thư viện nội dung'}
          </div>
          <h1 className="text-h1 articles-index-h1">
            {isSearching ? `Kết quả tìm kiếm cho "${query}"` : 'Cẩm nang bài viết Chotto'}
          </h1>
          <p className="text-body articles-index-lead">
            {isSearching
              ? 'Chotto kết nối vấn đề của bạn tới bài viết hướng dẫn đã xác minh và công cụ hỗ trợ phù hợp.'
              : 'Tổng hợp các bài viết giải thích luật pháp, kinh nghiệm thực tiễn và hướng dẫn từng bước cho người Việt sinh sống tại Nhật Bản.'}
          </p>
        </header>

        {/* Search Input Box */}
        <div className="articles-search-container">
          <div className="search-box-wrapper articles-search-box">
            <SearchIcon size={18} color="var(--text-muted)" />
            <input
              type="search"
              className="search-input"
              value={query}
              onChange={handleSearchChange}
              placeholder="Bạn đang gặp vấn đề gì? Ví dụ: mất thẻ zairyu, thuế thị dân, nghỉ việc..."
              aria-label="Tìm kiếm bài viết hoặc vấn đề"
            />
            {query && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={handleClearSearch}
                aria-label="Xóa từ khóa tìm kiếm"
              >
                <CloseIcon size={14} />
              </button>
            )}
          </div>
        </div>

        {/* ========================================================= */}
        {/* MODE A: DISCOVERY SEARCH RESULTS VIEW                      */}
        {/* ========================================================= */}
        {isSearching && discovery ? (
          <div className="discovery-results-section">
            {/* 1. Grounded Quick Summary (if available) */}
            {discovery.summary && activeSearchTab === 'all' && (
              <DiscoveryQuickSummary summary={discovery.summary} />
            )}

            {/* 2. Result Type Filter Tabs */}
            {discovery.hasResults && (
              <div className="discovery-result-tabs" role="tablist" aria-label="Phân loại kết quả">
                <button
                  type="button"
                  className={`discovery-tab-btn ${activeSearchTab === 'all' ? 'active' : ''}`}
                  onClick={() => setActiveSearchTab('all')}
                  role="tab"
                  aria-selected={activeSearchTab === 'all'}
                >
                  Tất cả ({discovery.totalCount})
                </button>
                {discovery.results.articles.length > 0 && (
                  <button
                    type="button"
                    className={`discovery-tab-btn ${activeSearchTab === 'articles' ? 'active' : ''}`}
                    onClick={() => setActiveSearchTab('articles')}
                    role="tab"
                    aria-selected={activeSearchTab === 'articles'}
                  >
                    Bài viết ({discovery.results.articles.length})
                  </button>
                )}
                {discovery.results.problems.length > 0 && (
                  <button
                    type="button"
                    className={`discovery-tab-btn ${activeSearchTab === 'problems' ? 'active' : ''}`}
                    onClick={() => setActiveSearchTab('problems')}
                    role="tab"
                    aria-selected={activeSearchTab === 'problems'}
                  >
                    Tình huống ({discovery.results.problems.length})
                  </button>
                )}
                {discovery.results.tools.length > 0 && (
                  <button
                    type="button"
                    className={`discovery-tab-btn ${activeSearchTab === 'tools' ? 'active' : ''}`}
                    onClick={() => setActiveSearchTab('tools')}
                    role="tab"
                    aria-selected={activeSearchTab === 'tools'}
                  >
                    Công cụ ({discovery.results.tools.length})
                  </button>
                )}
              </div>
            )}

            {/* 3. Empty or Low Confidence State */}
            {(!discovery.hasResults || discovery.isLowConfidence) && (
              <div className="discovery-empty-card" role="status">
                <div className="discovery-empty-icon">🔍</div>
                <h2 className="discovery-empty-title">
                  Chotto chưa tìm thấy nội dung đủ sát với vấn đề này.
                </h2>
                <p className="discovery-empty-desc">
                  Chotto tập trung vào các thủ tục hành chính, thuế, việc làm, và sinh hoạt tại Nhật Bản.
                  Bạn có thể thử tìm theo cách diễn đạt khác hoặc xem các chủ đề phổ biến:
                </p>

                <div className="discovery-suggestion-chips">
                  {['Mất thẻ cư trú', 'Lương 30 man', 'Đổi bằng lái xe', 'Nghỉ việc', 'Thuế thị dân'].map(
                    (suggestion) => (
                      <button
                        key={suggestion}
                        type="button"
                        className="intent-chip"
                        onClick={() => {
                          setQuery(suggestion);
                          setSearchParams({ q: suggestion });
                        }}
                      >
                        {suggestion}
                      </button>
                    )
                  )}
                </div>

                <div className="discovery-empty-actions">
                  <Link to="/problems" className="chotto-btn chotto-btn-secondary">
                    <span>Xem tất cả tình huống</span>
                    <ArrowRightIcon size={14} />
                  </Link>
                  <button
                    type="button"
                    className="chotto-btn chotto-btn-ghost"
                    onClick={handleClearSearch}
                  >
                    Xem tất cả bài viết
                  </button>
                </div>
              </div>
            )}

            {/* 4. Articles Results */}
            {(activeSearchTab === 'all' || activeSearchTab === 'articles') &&
              discovery.results.articles.length > 0 && (
                <div className="discovery-group-block">
                  {activeSearchTab === 'all' && (
                    <div className="discovery-group-heading">
                      <span>Bài viết hướng dẫn</span>
                      <span className="discovery-group-count">
                        ({discovery.results.articles.length})
                      </span>
                    </div>
                  )}

                  <div className="articles-editorial-list" role="list">
                    {discovery.results.articles.map((article) => {
                      const cat = getCategoryById(article.category);
                      return (
                        <Link
                          key={article.id}
                          to={`/articles/${article.slug}`}
                          className={`article-row-item card-${article.category}`}
                          role="listitem"
                          onClick={() =>
                            trackEvent('discovery_result_click', {
                              resultType: 'article',
                              articleSlug: article.slug,
                            })
                          }
                        >
                          <div className="article-row-main">
                            <div className="article-row-top">
                              {cat && (
                                <span className={`chotto-chip chip-${cat.colorKey} article-row-chip`}>
                                  {cat.shortName}
                                </span>
                              )}
                              {article.status === 'published' && (
                                <span className="discovery-verified-tag">
                                  Đã xác minh
                                </span>
                              )}
                              <span className="text-caption">
                                {article.updatedAt || article.publishedAt}
                              </span>
                              <span className="text-caption">·</span>
                              <span className="text-caption article-row-read-time">
                                <ClockIcon size={12} />
                                <span>{article.readingTime} phút đọc</span>
                              </span>
                            </div>

                            <h2 className="article-row-title">{article.title}</h2>
                            <p className="article-row-excerpt">{article.excerpt}</p>
                          </div>

                          <div className="article-row-action">
                            <ArrowRightIcon size={18} />
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* 5. Problems / Situations Results */}
            {(activeSearchTab === 'all' || activeSearchTab === 'problems') &&
              discovery.results.problems.length > 0 && (
                <div className="discovery-group-block">
                  {activeSearchTab === 'all' && (
                    <div className="discovery-group-heading">
                      <span>Tình huống thực tế liên quan</span>
                      <span className="discovery-group-count">
                        ({discovery.results.problems.length})
                      </span>
                    </div>
                  )}

                  <div className="discovery-problems-grid">
                    {discovery.results.problems.map((prob) => {
                      const cat = CATEGORY_BY_ID[prob.categoryKey];
                      return (
                        <div
                          key={prob.id}
                          className={`discovery-problem-item card-${prob.categoryKey}`}
                        >
                          <div className="discovery-problem-header">
                            {cat && (
                              <span className={`chotto-chip chip-${cat.colorKey}`}>
                                {cat.shortName}
                              </span>
                            )}
                          </div>
                          <h3 className="discovery-problem-title">💬 {prob.statement}</h3>
                          <p className="discovery-problem-detail">{prob.detail}</p>
                          {prob.recommendedArticle && (
                            <Link
                              to={`/articles/${prob.recommendedArticle.slug}`}
                              className="discovery-problem-link"
                              onClick={() =>
                                trackEvent('discovery_result_click', {
                                  resultType: 'problem',
                                  problemId: prob.id,
                                })
                              }
                            >
                              <span>Xem giải pháp: {prob.recommendedArticle.title}</span>
                              <ArrowRightIcon size={13} />
                            </Link>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* 6. Tools Results */}
            {(activeSearchTab === 'all' || activeSearchTab === 'tools') &&
              discovery.results.tools.length > 0 && (
                <div className="discovery-group-block">
                  {activeSearchTab === 'all' && (
                    <div className="discovery-group-heading">
                      <span>Công cụ thực hành (Toolio)</span>
                      <span className="discovery-group-count">
                        ({discovery.results.tools.length})
                      </span>
                    </div>
                  )}

                  <div className="discovery-tools-grid">
                    {discovery.results.tools.map((tool) => {
                      const toolUrl = buildToolUrl(tool.id, { source: 'search' });
                      if (!toolUrl) return null;
                      return (
                        <a
                          key={tool.id}
                          href={toolUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="discovery-tool-card"
                          onClick={() =>
                            trackEvent('toolio_open', {
                              toolId: tool.id,
                              source: 'discovery_search',
                            })
                          }
                        >
                          <div className="discovery-tool-info">
                            <h3 className="discovery-tool-name">{tool.name}</h3>
                            <p className="discovery-tool-desc">{tool.description}</p>
                          </div>
                          <span className="discovery-tool-cta-badge">
                            <span>Mở trong Toolio</span>
                            <ExternalLinkIcon size={12} />
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
          </div>
        ) : (
          /* ========================================================= */
          /* MODE B: STANDARD ARTICLES BROWSER (NO ACTIVE SEARCH)      */
          /* ========================================================= */
          <>
            {/* Category Tabs */}
            <div className="articles-filter-tabs" role="tablist" aria-label="Lọc theo nhóm chủ đề">
              <button
                type="button"
                className={`articles-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
                onClick={() => setActiveCategory('all')}
                role="tab"
                aria-selected={activeCategory === 'all'}
              >
                Tất cả ({allArticles.length})
              </button>
              {categories.map((cat) => {
                const count = allArticles.filter((a) => a.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`articles-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                    onClick={() => setActiveCategory(cat.id)}
                    role="tab"
                    aria-selected={activeCategory === cat.id}
                  >
                    <span className={`cat-dot cat-dot-${cat.colorKey} articles-filter-dot`} />
                    <span>
                      {cat.shortName} ({count})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Editorial Article Rows */}
            {nonSearchArticles.length === 0 ? (
              <div className="articles-empty-state">
                Không tìm thấy bài viết nào trong danh mục này.
              </div>
            ) : (
              <div className="articles-editorial-list" role="list">
                {nonSearchArticles.map((article) => {
                  const cat = getCategoryById(article.category);
                  return (
                    <Link
                      key={article.id}
                      to={`/articles/${article.slug}`}
                      className={`article-row-item card-${article.category}`}
                      role="listitem"
                    >
                      <div className="article-row-main">
                        <div className="article-row-top">
                          {cat && (
                            <span className={`chotto-chip chip-${cat.colorKey} article-row-chip`}>
                              {cat.shortName}
                            </span>
                          )}
                          <span className="text-caption">
                            {article.updatedAt || article.publishedAt}
                          </span>
                          <span className="text-caption">·</span>
                          <span className="text-caption article-row-read-time">
                            <ClockIcon size={12} />
                            <span>{article.readingTime} phút đọc</span>
                          </span>
                        </div>

                        <h2 className="article-row-title">{article.title}</h2>
                        <p className="article-row-excerpt">{article.excerpt}</p>
                      </div>

                      <div className="article-row-action">
                        <ArrowRightIcon size={18} />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ArticlesIndexPage;
