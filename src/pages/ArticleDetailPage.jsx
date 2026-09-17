import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ArticleDetailPage.css';
import { getArticleBySlug, getRelatedArticles } from '../content/articles';
import { getCategoryById } from '../content/categories/categoryMap';
import { ArticleRenderer } from '../components/article/ArticleRenderer';
import {
  ClockIcon,
  ShieldCheckIcon,
  ExternalLinkIcon,
  ShareIcon,
  CopyIcon,
  CheckIcon,
  FacebookIcon,
} from '../components/common/Icons';
import { PageMeta } from '../components/common/PageMeta';
import { isArticleVerified } from '../services/content/articleModel';
import { trackEvent } from '../services/analytics';

export function ArticleDetailPage() {
  const { slug } = useParams();
  const article = getArticleBySlug(slug);
  const category = article ? getCategoryById(article.category) : null;
  const [copied, setCopied] = useState(false);

  // Track article_view on mount or slug change
  useEffect(() => {
    if (article) {
      trackEvent('article_view', {
        slug: article.slug,
        category: article.category,
        title: article.title,
      });
    }
  }, [article?.slug]);

  if (!article) {
    return (
      <div className="article-page-wrapper">
        <PageMeta
          title="Không tìm thấy bài viết"
          description="Bài viết bạn tìm kiếm có thể đã được chuyển dời hoặc chưa được xuất bản."
        />
        <div className="article-container article-not-found-wrap">
          <h1 className="text-h2 article-not-found-title">
            Không tìm thấy bài viết
          </h1>
          <p className="text-body article-not-found-desc">
            Bài viết bạn tìm kiếm có thể đã được chuyển dời hoặc chưa được xuất bản.
          </p>
          <Link to="/articles" className="btn-primary article-not-found-btn">
            <span>Xem tất cả bài viết</span>
          </Link>
        </div>
      </div>
    );
  }

  const verified = isArticleVerified(article);
  const relatedList = getRelatedArticles(article).slice(0, 3);
  const articleUrl = typeof window !== 'undefined'
    ? window.location.href
    : `https://chottoday.com/articles/${article.slug}`;

  const handleCopyLink = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(articleUrl);
        setCopied(true);
        trackEvent('article_share', { method: 'copy_link', slug: article.slug });
        setTimeout(() => setCopied(false), 2500);
      }
    } catch (e) {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: `${article.title} | Chotto`,
          text: article.excerpt,
          url: articleUrl,
        });
        trackEvent('article_share', { method: 'web_share', slug: article.slug });
      } catch (e) {
        // User cancelled or share failed
      }
    }
  };

  const handleFacebookShare = () => {
    trackEvent('article_share', { method: 'facebook', slug: article.slug });
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
    window.open(fbUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };

  // Structured Data (Schema.org Article & Breadcrumbs)
  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: article.title,
      description: article.excerpt,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `https://chottoday.com/articles/${article.slug}`,
      },
      author: {
        '@type': 'Organization',
        name: article.author?.name || 'Chotto',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Chotto',
        logo: {
          '@type': 'ImageObject',
          url: 'https://chottoday.com/chotto-logo-full.svg',
        },
      },
      image: article.socialImage
        ? (article.socialImage.startsWith('http') ? article.socialImage : `https://chottoday.com${article.socialImage}`)
        : 'https://chottoday.com/images/hero-everyday-japan.jpg',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Trang chủ',
          item: 'https://chottoday.com',
        },
        ...(category
          ? [
              {
                '@type': 'ListItem',
                position: 2,
                name: category.name,
                item: `https://chottoday.com${category.path}`,
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: article.title,
                item: `https://chottoday.com/articles/${article.slug}`,
              },
            ]
          : [
              {
                '@type': 'ListItem',
                position: 2,
                name: article.title,
                item: `https://chottoday.com/articles/${article.slug}`,
              },
            ]),
      ],
    },
  ];

  return (
    <article className="article-page-wrapper">
      <PageMeta
        title={article.title}
        description={article.excerpt}
        canonical={`/articles/${article.slug}`}
        ogTitle={article.seo?.metaTitle || `${article.title} | Chotto`}
        ogDescription={article.seo?.metaDescription || article.excerpt}
        ogImage={article.socialImage || article.coverImage}
        ogType="article"
        structuredData={structuredData}
      />

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

            {/* Human Verification / Update Badge */}
            <div className="article-trust-badge-group">
              <span className="article-date-badge">
                Cập nhật {article.updatedAt || article.publishedAt}
              </span>
              {verified && (
                <span className="article-verified-pill" title="Nội dung đã được đối chiếu theo tài liệu từ cơ quan thẩm quyền Nhật Bản">
                  <ShieldCheckIcon size={14} />
                  <span>Đã kiểm tra nguồn chính thức</span>
                </span>
              )}
            </div>
          </div>

          <h1 className="article-h1">{article.title}</h1>

          <p className="article-excerpt-lead">{article.excerpt}</p>

          <div className="article-author-row">
            <span>
              Tác giả: <strong className="article-author-name">{article.author?.name || 'Ban Biên Tập Chotto'}</strong>
            </span>
            <span>·</span>
            <span className="article-reading-meta">
              <ClockIcon size={14} />
              <span>{article.readingTime} phút đọc</span>
            </span>
            {article.publishedAt && (
              <>
                <span>·</span>
                <span className="article-published-meta">Xuất bản: {article.publishedAt}</span>
              </>
            )}
          </div>
        </header>

        {/* 3. Short Answer First Block (Orientation for practical queries) */}
        {article.shortAnswer && (
          <div className="article-short-answer-box" role="region" aria-label="Trả lời nhanh">
            <div className="short-answer-header">
              <span className="short-answer-badge">Tóm tắt giải pháp nhanh</span>
            </div>
            <p className="short-answer-lead">{article.shortAnswer.lead}</p>
            {article.shortAnswer.steps && (
              <ol className="short-answer-steps">
                {article.shortAnswer.steps.map((step, sIdx) => (
                  <li key={sIdx} className="short-answer-step-item">
                    <span className="short-answer-step-num">{sIdx + 1}</span>
                    <span className="short-answer-step-text">{step}</span>
                  </li>
                ))}
              </ol>
            )}
            {article.shortAnswer.note && (
              <p className="short-answer-note">💡 {article.shortAnswer.note}</p>
            )}
          </div>
        )}

        {/* 4. "Bạn sẽ biết sau bài này" Summary Box (3-5 items) */}
        {article.keyTakeaways && article.keyTakeaways.length > 0 && (
          <div className="article-takeaways-box" role="region" aria-label="Bạn sẽ biết sau bài này">
            <h2 className="takeaways-title">Bạn sẽ biết sau bài này</h2>
            <ul className="takeaways-list">
              {article.keyTakeaways.map((item, tIdx) => (
                <li key={tIdx} className="takeaways-item">
                  <span className="takeaways-bullet">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 5. Applicability / Scope Box */}
        {article.applicability && (
          <div className="article-applicability-box" role="note" aria-label="Phạm vi áp dụng">
            <div className="applicability-title">Phạm vi áp dụng</div>
            <div className="applicability-content">
              {article.applicability.audience && (
                <div className="applicability-row">
                  <span className="applicability-label">Đối tượng:</span>
                  <span className="applicability-val">{article.applicability.audience}</span>
                </div>
              )}
              {article.applicability.effectiveFrom && (
                <div className="applicability-row">
                  <span className="applicability-label">Thời hiệu:</span>
                  <span className="applicability-val">Áp dụng từ năm {article.applicability.effectiveFrom}</span>
                </div>
              )}
              {article.applicability.notes && (
                <p className="applicability-note">{article.applicability.notes}</p>
              )}
            </div>
          </div>
        )}

        {/* 6. Cover Image */}
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

        {/* 7. Structured Content Body */}
        <ArticleRenderer sections={article.sections} />

        {/* 8. Source Governance Presentation ("Nguồn & lần cập nhật") */}
        {article.sources && article.sources.length > 0 && (
          <section className="article-source-governance-box" aria-labelledby="sources-governance-title">
            <div className="source-governance-header">
              <ShieldCheckIcon size={18} className="source-governance-icon" />
              <h2 id="sources-governance-title" className="source-governance-title">
                Nguồn & lần cập nhật
              </h2>
            </div>

            <div className="source-governance-list">
              {article.sources.map((src, sIdx) => (
                <div key={src.id || sIdx} className="source-governance-item">
                  <div className="source-item-meta">
                    <span className="source-item-org">{src.organization}</span>
                    <span className="source-item-type">
                      {src.type === 'official' ? 'Cơ quan chính thức' : src.type === 'primary' ? 'Văn bản quy chuẩn' : 'Tài liệu tham khảo'}
                    </span>
                  </div>
                  <div className="source-item-title-row">
                    <a
                      href={src.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="source-item-link"
                      onClick={() => trackEvent('source_link_click', { url: src.url, title: src.title })}
                    >
                      <span>{src.title}</span>
                      <ExternalLinkIcon size={14} />
                    </a>
                  </div>
                  {src.accessedAt && (
                    <div className="source-item-date">
                      Đối chiếu ngày: {src.accessedAt}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="source-governance-footer">
              <div className="source-update-timestamps">
                {article.publishedAt && <span>Xuất bản: {article.publishedAt}</span>}
                {article.updatedAt && <span> · Cập nhật nội dung: {article.updatedAt}</span>}
                {article.review?.lastVerifiedAt && <span> · Lần rà soát gần nhất: {article.review.lastVerifiedAt}</span>}
              </div>
              <p className="source-disclaimer">
                Thông tin này áp dụng cho chế độ hiện hành tại thời điểm bài được cập nhật. Khi có thay đổi chính sách từ chính phủ Nhật Bản, bài viết sẽ được rà soát và cập nhật tương ứng.
              </p>
            </div>
          </section>
        )}

        {/* 9. Social Share / Actions */}
        <section className="article-share-section" aria-label="Chia sẻ bài viết">
          <span className="share-section-label">Chia sẻ bài viết:</span>
          <div className="share-buttons-group">
            <button
              type="button"
              className="share-btn copy-btn"
              onClick={handleCopyLink}
              aria-label="Sao chép liên kết bài viết"
            >
              {copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
              <span>{copied ? 'Đã sao chép!' : 'Sao chép link'}</span>
            </button>

            {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
              <button
                type="button"
                className="share-btn native-share-btn"
                onClick={handleNativeShare}
                aria-label="Chia sẻ qua ứng dụng"
              >
                <ShareIcon size={15} />
                <span>Chia sẻ</span>
              </button>
            )}

            <button
              type="button"
              className="share-btn fb-share-btn"
              onClick={handleFacebookShare}
              aria-label="Chia sẻ lên Facebook"
            >
              <FacebookIcon size={16} />
              <span>Facebook</span>
            </button>
          </div>
        </section>

        {/* 10. Related Articles (Max 3) */}
        {relatedList && relatedList.length > 0 && (
          <section className="article-related-section" aria-labelledby="related-heading">
            <h2 id="related-heading" className="article-related-title">
              Bài tiếp theo bạn có thể cần
            </h2>
            <div className="article-related-grid">
              {relatedList.map((rel) => (
                <Link
                  key={rel.slug}
                  to={`/articles/${rel.slug}`}
                  className="related-card"
                  onClick={() =>
                    trackEvent('article_related_click', {
                      fromSlug: article.slug,
                      toSlug: rel.slug,
                    })
                  }
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
