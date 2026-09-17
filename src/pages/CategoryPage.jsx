import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CategoryPage.css';
import { getCategoryBySlug } from '../content/categories/categoryMap';
import { getArticlesByCategory } from '../content/articles';
import { SELECTED_TOOLS } from '../data/toolsMock';
import { ClockIcon, ArrowRightIcon, ExternalLinkIcon } from '../components/common/Icons';

export function CategoryPage() {
  const { category: categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);
  const [selectedTag, setSelectedTag] = useState('Tất cả');

  // Basic SEO
  useEffect(() => {
    if (category) {
      document.title = `${category.name} — ChottoDay`;
    } else {
      document.title = 'Chủ đề — ChottoDay';
    }
  }, [category]);

  // Reset tag on category change
  useEffect(() => {
    setSelectedTag('Tất cả');
  }, [categorySlug]);

  if (!category) {
    return (
      <div className="category-page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '64px 0' }}>
          <h1 className="text-h2" style={{ marginBottom: '16px' }}>
            Không tìm thấy chủ đề
          </h1>
          <p className="text-body" style={{ marginBottom: '24px' }}>
            Chủ đề bạn đang tìm kiếm không tồn tại hoặc đã được chuyển dời.
          </p>
          <Link to="/" className="btn-primary" style={{ display: 'inline-flex' }}>
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

  // Related tools
  const relatedTools = (category.relatedToolIds || [])
    .map((toolId) => SELECTED_TOOLS.find((t) => t.id === toolId))
    .filter(Boolean);

  return (
    <div className="category-page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb-nav" aria-label="Đường dẫn chủ đề">
          <Link to="/" className="breadcrumb-link">
            Trang chủ
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current" aria-current="page">
            {category.name}
          </span>
        </nav>

        {/* 1. Category Header Banner */}
        <header className="category-page-header">
          <div className="category-page-icon-wrap">
            <img
              src={category.icon}
              alt=""
              className="category-page-icon-img"
              width="36"
              height="36"
            />
          </div>

          <div className="category-page-title-group">
            <h1 className="category-page-title">{category.name}</h1>
            <p className="category-page-desc">{category.description}</p>
          </div>
        </header>

        {/* 2. Tag Filters (Derived from content tags) */}
        {category.availableTags && category.availableTags.length > 0 && (
          <div className="category-tag-filter-row" role="group" aria-label="Lọc theo nhãn nội dung">
            {category.availableTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`category-tag-chip ${selectedTag === tag ? 'active' : ''}`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}

        {/* 3. Articles Grid (2 cols desktop/tablet, 1 col mobile) */}
        {filteredArticles.length === 0 ? (
          <div style={{ padding: '48px 0', textAlign: 'center', color: 'var(--text-muted)' }}>
            Chưa có bài viết nào với nhãn "{selectedTag}".
          </div>
        ) : (
          <div className="category-content-grid" role="list">
            {filteredArticles.map((article) => (
              <Link
                key={article.id}
                to={`/articles/${article.slug}`}
                className={`category-article-card card-${category.colorKey}`}
                role="listitem"
              >
                <div className="cat-card-meta-top">
                  <span className={`chotto-chip chip-${category.colorKey}`}>
                    {category.shortName}
                  </span>
                  <span>{article.updatedAt || article.publishedAt}</span>
                </div>

                <h2 className="cat-card-title">{article.title}</h2>
                <p className="cat-card-excerpt">{article.excerpt}</p>

                <div className="cat-card-meta-bottom">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <ClockIcon size={13} />
                    <span>{article.readingTime} phút đọc</span>
                  </span>
                  <span className="cat-card-read-action">
                    <span>Xem hướng dẫn</span>
                    <ArrowRightIcon size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* 4. Related Tools Connection (Bridge to Toolio) */}
        {relatedTools.length > 0 && (
          <section className="category-tools-section" aria-labelledby="cat-tools-heading">
            <div className="category-tools-header">
              <h2 id="cat-tools-heading" className="category-tools-title">
                Công cụ Toolio hỗ trợ cho {category.shortName}
              </h2>
              <span className="text-caption">Nội dung là khởi đầu, công cụ là kết thúc</span>
            </div>

            <div className="category-tools-grid">
              {relatedTools.map((tool) => (
                <a
                  key={tool.id}
                  href={tool.toolioPath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chotto-card"
                  style={{
                    padding: '18px 20px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        {tool.name}
                      </h3>
                      <span className="chotto-chip chip-tool" style={{ fontSize: '11px', height: '24px' }}>
                        Miniapp
                      </span>
                    </div>
                    <p style={{ fontSize: '13px', lineHeight: '20px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                      {tool.description}
                    </p>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '10px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--cat-tool-text)', fontWeight: 600 }}>
                      Mở trong Toolio
                    </span>
                    <ExternalLinkIcon size={14} color="var(--cat-tool-text)" />
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
