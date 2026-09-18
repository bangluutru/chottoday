import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './CategoryPage.css';
import { getCategoryBySlug } from '../content/categories/categoryMap';
import { getArticlesByCategory } from '../content/articles';
import { getToolsByIds, buildToolUrl } from '../services/toolRegistry';
import { ArrowRightIcon } from '../components/common/Icons';
import { PageMeta } from '../components/common/PageMeta';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { formatDate } from '../utils/formatDate';

/** Articles shown before "Xem thêm bài viết" appears. */
const PAGE_SIZE = 6;

export function CategoryPage() {
  const { category: categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);
  const navigate = useNavigate();

  const [selectedTag, setSelectedTag] = useState('Tất cả');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [suggestion, setSuggestion] = useState('');

  // Reset filtering on category change
  useEffect(() => {
    setSelectedTag('Tất cả');
    setVisibleCount(PAGE_SIZE);
  }, [categorySlug]);

  if (!category) {
    return (
      <div className="category-page-wrapper">
        <PageMeta
          title="Không tìm thấy chủ đề"
          description="Chủ đề bạn đang tìm kiếm không tồn tại hoặc đã được chuyển dời."
        />
        <div className="container category-not-found-wrap">
          <h1 className="text-h2 category-not-found-title">Không tìm thấy chủ đề</h1>
          <p className="text-body category-not-found-desc">
            Chủ đề bạn đang tìm kiếm không tồn tại hoặc đã được chuyển dời.
          </p>
          <Link to="/" className="btn-primary category-not-found-btn">
            <span>Quay lại trang chủ</span>
          </Link>
        </div>
      </div>
    );
  }

  // Articles for this category
  const allCategoryArticles = getArticlesByCategory(category.id);
  const filteredArticles =
    selectedTag === 'Tất cả'
      ? allCategoryArticles
      : allCategoryArticles.filter((a) => a.tags.includes(selectedTag));
  const shownArticles = filteredArticles.slice(0, visibleCount);

  // Related tools resolved centrally from single source of truth
  const relatedTools = getToolsByIds(category.relatedToolIds || []);

  // The suggestion box hands its text to the real contact form rather than
  // pretending to deliver it from here.
  const handleSuggest = (e) => {
    e.preventDefault();
    const trimmed = suggestion.trim();
    navigate('/about#lien-he', {
      state: trimmed
        ? {
            contactKind: 'Góp ý nội dung',
            contactMessage: `Gợi ý chủ đề cho “${category.name}”: ${trimmed}`,
          }
        : undefined,
    });
  };

  return (
    <div className="category-page-wrapper">
      <PageMeta
        title={category.name}
        description={category.description}
        canonical={category.path}
        ogTitle={`${category.name} — ChottoDay`}
        ogDescription={category.description}
      />

      <div className="container">
        <Breadcrumb
          label="Đường dẫn chủ đề"
          items={[
            { label: 'Trang chủ', to: '/' },
            { label: 'Chủ đề', to: '/#topics' },
            { label: category.name },
          ]}
        />

        <div className="category-layout">
          <div className="category-main">
            {/* 1. Category header card, with its tag filters */}
            <header className="category-page-header">
              <div className="category-header-row">
                <div className={`category-page-icon-wrap head-icon-${category.colorKey}`}>
                  <img
                    src={category.icon}
                    alt=""
                    className="category-page-icon-img"
                    width="32"
                    height="32"
                  />
                </div>

                <div className="category-page-title-group">
                  <h1 className="category-page-title">{category.name}</h1>
                  <p className="category-page-desc">{category.description}</p>
                </div>
              </div>

              {category.availableTags && category.availableTags.length > 0 && (
                <div
                  className="category-tag-filter-row"
                  role="group"
                  aria-label="Lọc theo nhãn nội dung"
                >
                  {category.availableTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      className={`category-tag-chip ${selectedTag === tag ? 'active' : ''}`}
                      aria-pressed={selectedTag === tag}
                      onClick={() => {
                        setSelectedTag(tag);
                        setVisibleCount(PAGE_SIZE);
                      }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              )}
            </header>

            {/* 2. Article grid */}
            {filteredArticles.length === 0 ? (
              <div className="category-empty-state">
                Chưa có bài viết nào với nhãn “{selectedTag}”.
              </div>
            ) : (
              <div className="category-content-grid">
                {shownArticles.map((article) => (
                  <Link
                    key={article.id}
                    to={`/articles/${article.slug}`}
                    className="category-article-card"
                  >
                    {article.coverImage && (
                      <img
                        src={article.coverImage}
                        alt=""
                        className="cat-card-cover"
                        loading="lazy"
                      />
                    )}
                    <div className="cat-card-body">
                      <span className={`chotto-chip chip-${category.colorKey} cat-card-chip`}>
                        {article.tags?.[0] || category.shortName}
                      </span>
                      <h2 className="cat-card-title">{article.title}</h2>
                      <p className="cat-card-excerpt">{article.excerpt}</p>
                      <div className="cat-card-meta-bottom">
                        <span>{article.readingTime} phút đọc</span>
                        <span className="cat-card-meta-sep" aria-hidden="true">
                          •
                        </span>
                        <span>{formatDate(article.updatedAt || article.publishedAt)}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {filteredArticles.length > visibleCount && (
              <div className="category-more-row">
                <button
                  type="button"
                  className="category-more-btn"
                  onClick={() => setVisibleCount((n) => n + PAGE_SIZE)}
                >
                  Xem thêm bài viết
                  <span className="category-more-arrow" aria-hidden="true">
                    ↓
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* 3. Sidebar: related tools + topic suggestion */}
          <aside className="category-aside" aria-label="Công cụ liên quan">
            {relatedTools.length > 0 && (
              <div className="category-aside-card">
                <div className="category-aside-title">Công cụ liên quan</div>
                {relatedTools.map((tool) => {
                  const toolUrl = buildToolUrl(tool.id, { source: 'category' });
                  if (!toolUrl) return null;
                  return (
                    <a
                      key={tool.id}
                      href={toolUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="category-aside-tool"
                    >
                      <span className={`category-aside-tool-icon head-icon-${category.colorKey}`}>
                        <img src={category.icon} alt="" width="20" height="20" />
                      </span>
                      <span className="category-aside-tool-body">
                        <span className="category-aside-tool-name">{tool.name}</span>
                        <span className="category-aside-tool-desc">{tool.description}</span>
                      </span>
                    </a>
                  );
                })}
                <Link to="/tools" className="category-aside-all">
                  Xem tất cả công cụ
                  <ArrowRightIcon size={15} />
                </Link>
              </div>
            )}

            <form className="category-suggest-card" onSubmit={handleSuggest}>
              <div className="category-suggest-title">Bạn không tìm thấy thông tin?</div>
              <p className="category-suggest-desc">
                Gợi ý chủ đề bạn quan tâm để Chotto viết bài hướng dẫn chi tiết nhé!
              </p>
              <input
                type="text"
                className="category-suggest-input"
                aria-label="Chủ đề bạn muốn Chotto viết"
                placeholder="Ví dụ: đăng ký xe máy 50cc…"
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
              />
              <div className="category-suggest-actions">
                <button type="submit" className="category-suggest-btn">
                  <span>Gửi gợi ý</span>
                  <ArrowRightIcon size={15} />
                </button>
                <span className="category-suggest-thanks">cảm ơn bạn!</span>
              </div>
            </form>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
