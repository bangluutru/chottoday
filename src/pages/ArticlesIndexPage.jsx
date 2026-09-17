import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './ArticlesIndexPage.css';
import { getAllArticles, searchArticles } from '../content/articles';
import { getAllCategories, getCategoryById } from '../content/categories/categoryMap';
import { ClockIcon, ArrowRightIcon, SearchIcon } from '../components/common/Icons';

export function ArticlesIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [activeCategory, setActiveCategory] = useState('all');

  const categories = getAllCategories();

  useEffect(() => {
    document.title = 'Tất cả bài viết & hướng dẫn — ChottoDay';
  }, []);

  useEffect(() => {
    const q = searchParams.get('q') || '';
    setQuery(q);
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

  // Base list (either searched or all)
  const baseArticles = query.trim() ? searchArticles(query.trim()) : getAllArticles();

  // Category filter
  const displayedArticles =
    activeCategory === 'all'
      ? baseArticles
      : baseArticles.filter((a) => a.category === activeCategory);

  return (
    <div className="articles-index-wrapper">
      <div className="container">
        {/* Header */}
        <header className="articles-index-header">
          <div className="section-eyebrow">Thư viện nội dung</div>
          <h1 className="text-h1" style={{ marginBottom: '12px' }}>
            Cẩm nang bài viết Chotto
          </h1>
          <p className="text-body" style={{ maxWidth: '640px' }}>
            Tổng hợp các bài viết giải thích luật pháp, kinh nghiệm thực tiễn và hướng dẫn từng bước cho người Việt sinh sống tại Nhật Bản.
          </p>
        </header>

        {/* Search & Category Filter */}
        <div style={{ marginBottom: '24px', maxWidth: '480px' }}>
          <div className="search-box-wrapper" style={{ height: '44px' }}>
            <SearchIcon size={18} color="var(--text-muted)" />
            <input
              type="search"
              className="search-input"
              value={query}
              onChange={handleSearchChange}
              placeholder="Lọc bài viết theo từ khóa..."
              aria-label="Lọc bài viết"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="articles-filter-tabs" role="tablist" aria-label="Lọc theo nhóm chủ đề">
          <button
            type="button"
            className={`articles-filter-btn ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
            role="tab"
            aria-selected={activeCategory === 'all'}
          >
            Tất cả ({baseArticles.length})
          </button>
          {categories.map((cat) => {
            const count = baseArticles.filter((a) => a.category === cat.id).length;
            return (
              <button
                key={cat.id}
                type="button"
                className={`articles-filter-btn ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                role="tab"
                aria-selected={activeCategory === cat.id}
              >
                <span className={`cat-dot cat-dot-${cat.colorKey}`} style={{ marginRight: '6px' }} />
                <span>{cat.shortName} ({count})</span>
              </button>
            );
          })}
        </div>

        {/* Article Editorial Rows */}
        {displayedArticles.length === 0 ? (
          <div style={{ padding: '64px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Không tìm thấy bài viết nào phù hợp với điều kiện tìm kiếm.
          </div>
        ) : (
          <div className="articles-editorial-list" role="list">
            {displayedArticles.map((article) => {
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
                        <span className={`chotto-chip chip-${cat.colorKey}`} style={{ height: '24px', fontSize: '11px', padding: '0 8px' }}>
                          {cat.shortName}
                        </span>
                      )}
                      <span className="text-caption">
                        {article.updatedAt || article.publishedAt}
                      </span>
                      <span className="text-caption">·</span>
                      <span className="text-caption" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
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
      </div>
    </div>
  );
}
