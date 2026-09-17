import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ArticleDetailPage.css';
import { getArticleBySlug } from '../content/articles';
import { getCategoryById } from '../content/categories/categoryMap';
import { ArticleRenderer } from '../components/article/ArticleRenderer';
import { ClockIcon, ArrowRightIcon } from '../components/common/Icons';

export function ArticleDetailPage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);

  const category = article ? getCategoryById(article.category) : null;

  // Basic SEO meta update
  useEffect(() => {
    if (article) {
      document.title = `${article.title} — ChottoDay`;
    } else {
      document.title = 'Không tìm thấy bài viết — ChottoDay';
    }
  }, [article]);

  if (!article) {
    return (
      <div className="article-page-wrapper">
        <div className="article-container" style={{ textAlign: 'center', padding: '64px 0' }}>
          <h1 className="text-h2" style={{ marginBottom: '16px' }}>
            Không tìm thấy bài viết
          </h1>
          <p className="text-body" style={{ marginBottom: '24px' }}>
            Bài viết bạn tìm kiếm có thể đã được chuyển dời hoặc chưa được xuất bản.
          </p>
          <Link to="/articles" className="btn-primary" style={{ display: 'inline-flex' }}>
            <span>Xem tất cả bài viết</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <article className="article-page-wrapper">
      <div className="article-container">
        {/* 1. Breadcrumb Navigation */}
        <nav className="breadcrumb-nav" aria-label="Đường dẫn bài viết">
          <Link to="/" className="breadcrumb-link">
            Trang chủ
          </Link>
          <span className="breadcrumb-separator">/</span>
          {category && (
            <>
              <Link to={category.path} className="breadcrumb-link">
                {category.name}
              </Link>
              <span className="breadcrumb-separator">/</span>
            </>
          )}
          <span className="breadcrumb-current" aria-current="page">
            {article.title}
          </span>
        </nav>

        {/* 2. Article Header */}
        <header className="article-header">
          <div className="article-meta-top">
            {category && (
              <Link
                to={category.path}
                className={`chotto-chip chip-${category.colorKey}`}
              >
                {category.name}
              </Link>
            )}
            <span className="article-date-badge">
              Cập nhật ngày {article.updatedAt || article.publishedAt}
            </span>
          </div>

          <h1 className="article-h1">{article.title}</h1>

          <p className="article-excerpt-lead">{article.excerpt}</p>

          <div className="article-author-row">
            <span>
              Tác giả: <strong className="article-author-name">{article.author?.name || 'Chotto'}</strong>
            </span>
            <span>·</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <ClockIcon size={14} />
              <span>{article.readingTime} phút đọc</span>
            </span>
          </div>
        </header>

        {/* 3. Cover Image (If available) */}
        {article.coverImage && (
          <div className="article-cover-wrap">
            <img
              src={article.coverImage}
              alt={article.title}
              className="article-cover-img"
              width="820"
              height="420"
              loading="lazy"
            />
          </div>
        )}

        {/* 4. Structured Content Body */}
        <ArticleRenderer sections={article.sections} />

        {/* 5. Related Articles (Max 3) */}
        {article.relatedArticles && article.relatedArticles.length > 0 && (
          <section className="article-related-section" aria-labelledby="related-heading">
            <h2 id="related-heading" className="article-related-title">
              Bài tiếp theo bạn có thể cần
            </h2>
            <div className="article-related-grid">
              {article.relatedArticles.slice(0, 3).map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/articles/${rel.slug}`}
                  className="related-card"
                >
                  <div className="related-card-title">{rel.title}</div>
                  <div className="related-card-meta">
                    <ClockIcon size={12} />
                    <span>{rel.readingTime} phút đọc</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </article>
  );
}
