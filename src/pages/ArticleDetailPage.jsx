import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './ArticleDetailPage.css';
import { getArticleBySlug, getRelatedArticles } from '../content/articles';
import { getCategoryById } from '../content/categories/categoryMap';
import { ArticleRenderer, buildTableOfContents } from '../components/article/ArticleRenderer';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ArticleContextualProblem } from '../components/article/ArticleContextualProblem';
import { CopyGuard } from '../components/article/CopyGuard';
import {
  ArrowRightIcon,
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
import { getToolForArticle } from '../data/tools.js';
import { buildToolUrl, getToolById } from '../services/toolRegistry';
import { FANPAGE_URL } from '../config/constants';
import { trackEvent } from '../services/analytics';
import { formatDate } from '../utils/formatDate';

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
  const tableOfContents = buildTableOfContents(article.sections);

  // The orientation card next to the table of contents. A Chotto-hosted
  // calculator wins when one claims this article; otherwise the article's first
  // related Toolio tool stands in. Nothing is rendered if neither resolves.
  const internalTool = getToolForArticle(article.slug);
  const fallbackTool = internalTool
    ? null
    : getToolById((article.relatedToolIds || [])[0]);
  const fallbackToolUrl = fallbackTool
    ? buildToolUrl(fallbackTool.id, { source: 'article' })
    : null;
  const orientationTool = internalTool
    ? {
        name: internalTool.name,
        description: internalTool.description,
        to: `/tools/${internalTool.slug}`,
        external: false,
      }
    : fallbackTool && fallbackToolUrl
      ? {
          name: fallbackTool.name,
          description: fallbackTool.description,
          href: fallbackToolUrl,
          external: true,
        }
      : null;
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
        <Breadcrumb
          label="Đường dẫn bài viết"
          items={[
            { label: 'Trang chủ', to: '/' },
            ...(category ? [{ label: category.name, to: category.path }] : []),
            { label: article.title },
          ]}
        />

        {/* 2. Article body (3/4) + sidebar (1/4) */}
        <div className="article-layout">
          {/* The body is the part worth stealing, so it is the part guarded.
              The sidebar, the share buttons and every other page stay normal. */}
          <CopyGuard className="article-main" title={article.title}>

          {/* 2a. Article Header */}
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
                  Cập nhật {formatDate(article.updatedAt || article.publishedAt)}
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
                  <span className="article-published-meta">
                    Xuất bản: {formatDate(article.publishedAt)}
                  </span>
                </>
              )}
            </div>
          </header>

          {/* 3. Cover image */}
          {article.coverImage && (
            <div className="article-cover-wrap">
              <img
                src={article.coverImage}
                alt=""
                className="article-cover-img"
                width="820"
                height="420"
              />
            </div>
          )}

          {/* 4. Orientation row: table of contents beside the tool card */}
          {(tableOfContents.length > 0 || orientationTool) && (
            <div className="article-orientation-row">
              {tableOfContents.length > 0 && (
                <nav className="article-toc" aria-label="Mục lục">
                  <div className="article-toc-title">Mục lục</div>
                  <ol className="article-toc-list">
                    {tableOfContents.map((item) => (
                      <li key={item.id}>
                        <a href={`#${item.id}`}>{item.text}</a>
                      </li>
                    ))}
                  </ol>
                </nav>
              )}

              {orientationTool && (
                <div className="article-tool-card">
                  <span className="article-tool-icon">
                    <img src="/icons/icon-tool.svg" alt="" width="22" height="22" />
                  </span>
                  <div className="article-tool-name">{orientationTool.name}</div>
                  <p className="article-tool-desc">{orientationTool.description}</p>
                  {orientationTool.external ? (
                    <a
                      href={orientationTool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="article-tool-btn"
                      onClick={() =>
                        trackEvent('toolio_open', { slug: article.slug, source: 'article' })
                      }
                    >
                      Dùng công cụ
                      <ExternalLinkIcon size={14} />
                    </a>
                  ) : (
                    <Link to={orientationTool.to} className="article-tool-btn">
                      Dùng công cụ
                      <ArrowRightIcon size={14} />
                    </Link>
                  )}
                  <div className="article-tool-note">Miễn phí · Không lưu dữ liệu</div>
                </div>
              )}
            </div>
          )}

          {/* 5. Short Answer First Block (Orientation for practical queries) */}
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

          {/* 8. Structured Content Body */}
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

          {/* 10. Contextual Problem Card (Phase 5) */}
          <ArticleContextualProblem article={article} />

          {/* 11. Per-article rights line — the claim a re-post has to ignore. */}
          <p className="copy-guard-rights">
            <span>
              © {new Date().getFullYear()} ChottoDay. Bài viết do Ban Biên Tập Chotto biên soạn.
              Bạn được phép trích dẫn ngắn kèm liên kết về bài gốc.
            </span>
            <Link to="/policy#ban-quyen">Bản quyền &amp; trích dẫn</Link>
          </p>

          </CopyGuard>

          <aside className="article-aside" aria-label="Chia sẻ và bài liên quan">
            <div className="article-aside-card">
              <div className="article-aside-title">Chia sẻ bài viết</div>
              <div className="share-buttons-group">
                <button
                  type="button"
                  className="share-btn fb-share-btn"
                  onClick={handleFacebookShare}
                  aria-label="Chia sẻ lên Facebook"
                >
                  <FacebookIcon size={16} />
                  <span>Facebook</span>
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
                  className="share-btn copy-btn"
                  onClick={handleCopyLink}
                  aria-label="Sao chép liên kết bài viết"
                >
                  {copied ? <CheckIcon size={15} /> : <CopyIcon size={15} />}
                  <span>{copied ? 'Đã sao chép!' : 'Sao chép link'}</span>
                </button>

                <Link to="/about#lien-he" className="share-btn feedback-btn">
                  <span>Gửi góp ý</span>
                </Link>
              </div>
            </div>

            {relatedList && relatedList.length > 0 && (
              <div className="article-aside-card">
                <div className="article-aside-title" id="related-heading">
                  Bài viết liên quan
                </div>
                {relatedList.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/articles/${rel.slug}`}
                    className="article-aside-related"
                    onClick={() =>
                      trackEvent('article_related_click', {
                        fromSlug: article.slug,
                        toSlug: rel.slug,
                      })
                    }
                  >
                    {rel.coverImage && (
                      <img
                        src={rel.coverImage}
                        alt=""
                        className="article-aside-thumb"
                        loading="lazy"
                        width="56"
                        height="48"
                      />
                    )}
                    <span className="article-aside-related-body">
                      <span className="article-aside-related-title">{rel.title}</span>
                      <span className="article-aside-related-meta">
                        {rel.readingTime} phút đọc
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            )}

            <div className="article-aside-cta">
              <p className="article-aside-cta-note">
                Một chút thông tin
                <br />
                là bớt một chút lo!
              </p>
              <a
                href={FANPAGE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="article-aside-cta-btn"
              >
                <FacebookIcon size={16} color="#ffffff" />
                Theo dõi Fanpage
              </a>
            </div>
          </aside>
        </div>
      </div>
    </article>
  );
}
