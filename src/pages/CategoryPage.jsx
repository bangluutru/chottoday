import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './CategoryPage.css';
import { getCategoryBySlug } from '../content/categories/categoryMap';
import { getArticlesByCategory } from '../content/articles';
import { getToolsByIds, buildToolUrl } from '../services/toolRegistry';
import { ClockIcon, ArrowRightIcon, ExternalLinkIcon } from '../components/common/Icons';
import { PageMeta } from '../components/common/PageMeta';

export function CategoryPage() {
  const { category: categorySlug } = useParams();
  const category = getCategoryBySlug(categorySlug);
  const [selectedTag, setSelectedTag] = useState('Tất cả');

  // Reset tag on category change
  useEffect(() => {
    setSelectedTag('Tất cả');
  }, [categorySlug]);

  if (!category) {
    return (
      <div className="category-page-wrapper">
        <PageMeta
          title="Không tìm thấy chủ đề"
          description="Chủ đề bạn đang tìm kiếm không tồn tại hoặc đã được chuyển dời."
        />
        <div className="container category-not-found-wrap">
          <h1 className="text-h2 category-not-found-title">
            Không tìm thấy chủ đề
          </h1>
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

  // Related tools resolved centrally from single source of truth
  const relatedTools = getToolsByIds(category.relatedToolIds || []);

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
          <div className="category-empty-state">
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
                  <span className="cat-card-read-time">
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
                  href={buildToolUrl(tool.id, { source: 'category' })}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="chotto-card category-tool-card"
                >
                  <div>
                    <div className="category-tool-card-head">
                      <h3 className="category-tool-card-name">
                        {tool.name}
                      </h3>
                      <span className="chotto-chip chip-tool category-tool-card-chip">
                        Miniapp
                      </span>
                    </div>
                    <p className="category-tool-card-desc">
                      {tool.description}
                    </p>
                  </div>

                  <div className="category-tool-card-foot">
                    <span className="category-tool-card-action-text">
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
