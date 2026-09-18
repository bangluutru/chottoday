import React, { useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import './ToolDetailPage.css';
import { getToolById, getAllTools, buildToolUrl } from '../services/toolRegistry';
import {
  getDomainById,
  getDomainLabel,
  getCategoryLabel,
  getSubdomainLabel,
  getProcessingLabel,
} from '../content/tools/toolTaxonomy';
import { getPublishedArticles } from '../content/articles';
import { getAllCategories } from '../content/categories/categoryMap';
import { trackEvent } from '../services/analytics';
import { TOOLIO_BASE_URL } from '../config/constants';
import {
  ArrowRightIcon,
  ClockIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
} from '../components/common/Icons';
import { PageMeta } from '../components/common/PageMeta';

const SITE_URL = 'https://chottoday.com';
const MAX_RELATED_TOOLS = 3;

/**
 * Picks sibling tools: same subdomain first (most specific), then same
 * category, so a tool always has a next step even outside japan-life.
 */
function findRelatedTools(tool, allTools) {
  const others = allTools.filter((t) => t.id !== tool.id);
  const bySubdomain = tool.subdomain
    ? others.filter((t) => t.subdomain === tool.subdomain)
    : [];
  const byCategory = others.filter(
    (t) => t.category === tool.category && !bySubdomain.includes(t)
  );
  return [...bySubdomain, ...byCategory].slice(0, MAX_RELATED_TOOLS);
}

export function ToolDetailPage() {
  const { toolId } = useParams();
  const tool = getToolById(toolId);
  const allTools = useMemo(() => getAllTools(), []);

  if (!tool) {
    return (
      <div className="tool-detail-wrapper">
        <PageMeta
          title="Không tìm thấy công cụ"
          description="Công cụ bạn đang tìm không tồn tại trong danh mục Toolio hoặc đã được đổi tên."
        />
        <div className="container tool-detail-missing">
          <h1 className="text-h2 tool-detail-missing-title">Không tìm thấy công cụ</h1>
          <p className="text-body tool-detail-missing-desc">
            Công cụ bạn đang tìm không tồn tại trong danh mục Toolio hoặc đã được đổi tên.
          </p>
          <div className="tool-detail-missing-actions">
            <Link to="/tools" className="btn-primary">
              <span>Xem tất cả công cụ</span>
            </Link>
            <Link to="/" className="btn-secondary">
              <span>Về Trang chủ</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const toolUrl = buildToolUrl(tool.id, { source: 'tool-detail' });
  const domain = getDomainById(tool.domain);
  const subdomainLabel = getSubdomainLabel(tool.subdomain);
  const categoryLabel = getCategoryLabel(tool.category);
  const processingLabel = getProcessingLabel(tool.processing);

  const relatedArticles = getPublishedArticles().filter((article) =>
    (article.relatedToolIds || []).includes(tool.id)
  );

  const relatedCategories = getAllCategories().filter((category) =>
    (category.relatedToolIds || []).includes(tool.id)
  );

  const relatedTools = findRelatedTools(tool, allTools);

  const handleOpenTool = () => {
    trackEvent('toolio_open', { tool: tool.id, source: 'tool_detail' });
  };

  const structuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.name,
      description: tool.description,
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'Web',
      url: `${SITE_URL}/tools/${tool.id}`,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'JPY',
      },
      publisher: {
        '@type': 'Organization',
        name: 'Chotto',
        url: SITE_URL,
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Trang chủ', item: SITE_URL },
        { '@type': 'ListItem', position: 2, name: 'Công cụ', item: `${SITE_URL}/tools` },
        {
          '@type': 'ListItem',
          position: 3,
          name: tool.name,
          item: `${SITE_URL}/tools/${tool.id}`,
        },
      ],
    },
  ];

  return (
    <div className="tool-detail-wrapper">
      <PageMeta
        title={tool.name}
        description={tool.description}
        canonical={`/tools/${tool.id}`}
        ogTitle={`${tool.name} | Chotto`}
        ogDescription={tool.description}
        structuredData={structuredData}
      />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb-nav" aria-label="Đường dẫn công cụ">
          <Link to="/" className="breadcrumb-link">
            Trang chủ
          </Link>
          <span className="breadcrumb-separator">/</span>
          <Link to="/tools" className="breadcrumb-link">
            Công cụ
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current" aria-current="page">
            {tool.name}
          </span>
        </nav>

        {/* 1. Tool Header */}
        <header className="tool-detail-header card-tool">
          <div className="tool-detail-chip-row">
            <span className="chotto-chip chip-tool">{categoryLabel}</span>
            <span className="chotto-chip tool-detail-neutral-chip">
              {getDomainLabel(tool.domain)}
            </span>
            {subdomainLabel && (
              <span className="chotto-chip tool-detail-neutral-chip">{subdomainLabel}</span>
            )}
          </div>

          <h1 className="tool-detail-title">{tool.name}</h1>
          <p className="tool-detail-desc">{tool.description}</p>

          <div className="tool-detail-cta-row">
            {toolUrl ? (
              <a
                href={toolUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary tool-detail-cta"
                onClick={handleOpenTool}
              >
                <span>Mở trên Toolio</span>
                <ExternalLinkIcon size={15} className="icon-inline-right" />
              </a>
            ) : (
              <span className="tool-detail-unavailable">
                Công cụ này hiện chưa mở được từ Chotto.
              </span>
            )}

            <span className="tool-detail-privacy-pill">
              <ShieldCheckIcon size={14} color="var(--cat-tool-text)" />
              <span>{processingLabel}</span>
            </span>
          </div>
        </header>

        <div className="tool-detail-body">
          {/* 2. Main column */}
          <div className="tool-detail-main">
            {/* What this tool belongs to */}
            {domain && (
              <section className="tool-detail-section" aria-labelledby="tool-domain-heading">
                <h2 id="tool-domain-heading" className="tool-detail-section-title">
                  Công cụ này thuộc nhóm nào?
                </h2>
                <p className="tool-detail-section-text">
                  <strong>{domain.name}</strong> — {domain.description}
                </p>
              </section>
            )}

            {/* Related articles (content → tool bridge) */}
            <section className="tool-detail-section" aria-labelledby="tool-articles-heading">
              <h2 id="tool-articles-heading" className="tool-detail-section-title">
                Bài viết dùng công cụ này
              </h2>

              {relatedArticles.length === 0 ? (
                <p className="tool-detail-section-text tool-detail-muted">
                  Chưa có bài viết nào trên Chotto trỏ tới công cụ này. Bạn vẫn có thể mở trực tiếp
                  trên Toolio.
                </p>
              ) : (
                <div className="tool-detail-article-list" role="list">
                  {relatedArticles.map((article) => (
                    <Link
                      key={article.id}
                      to={`/articles/${article.slug}`}
                      className="tool-detail-article-card"
                      role="listitem"
                    >
                      <div className="tool-detail-article-text">
                        <h3 className="tool-detail-article-title">{article.title}</h3>
                        <p className="tool-detail-article-excerpt">{article.excerpt}</p>
                        <span className="tool-detail-article-meta">
                          <ClockIcon size={13} />
                          <span>{article.readingTime} phút đọc</span>
                        </span>
                      </div>
                      <ArrowRightIcon size={16} color="var(--text-muted)" />
                    </Link>
                  ))}
                </div>
              )}
            </section>

            {/* Related tools */}
            {relatedTools.length > 0 && (
              <section className="tool-detail-section" aria-labelledby="tool-related-heading">
                <h2 id="tool-related-heading" className="tool-detail-section-title">
                  Công cụ liên quan
                </h2>
                <div className="tool-detail-related-grid" role="list">
                  {relatedTools.map((related) => (
                    <Link
                      key={related.id}
                      to={`/tools/${related.id}`}
                      className="tool-detail-related-card"
                      role="listitem"
                    >
                      <span className="tool-detail-related-name">{related.name}</span>
                      <span className="tool-detail-related-desc">{related.description}</span>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* 3. Sidebar */}
          <aside className="tool-detail-side" aria-label="Thông tin công cụ">
            <div className="tool-detail-side-box">
              <h2 className="tool-detail-side-title">Thông tin nhanh</h2>
              <dl className="tool-detail-spec-list">
                <div className="tool-detail-spec-row">
                  <dt>Loại</dt>
                  <dd>{categoryLabel}</dd>
                </div>
                <div className="tool-detail-spec-row">
                  <dt>Nhóm</dt>
                  <dd>{getDomainLabel(tool.domain)}</dd>
                </div>
                {subdomainLabel && (
                  <div className="tool-detail-spec-row">
                    <dt>Lĩnh vực</dt>
                    <dd>{subdomainLabel}</dd>
                  </div>
                )}
                <div className="tool-detail-spec-row">
                  <dt>Xử lý</dt>
                  <dd>{processingLabel}</dd>
                </div>
                <div className="tool-detail-spec-row">
                  <dt>Nền tảng</dt>
                  <dd>
                    <a
                      href={TOOLIO_BASE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tool-detail-side-link"
                    >
                      Toolio
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Privacy note */}
            <div className="tool-detail-side-box tool-detail-privacy-box">
              <ShieldCheckIcon size={16} color="var(--cat-tool-text)" />
              <p className="tool-detail-privacy-text">
                Chotto không gửi dữ liệu bạn nhập sang Toolio. Đường dẫn chỉ mang theo nhãn nguồn
                giới thiệu, không kèm lương, thuế, giấy tờ hay nội dung tìm kiếm.
              </p>
            </div>

            {/* Related topics */}
            {relatedCategories.length > 0 && (
              <div className="tool-detail-side-box">
                <h2 className="tool-detail-side-title">Chủ đề liên quan</h2>
                <div className="tool-detail-topic-list">
                  {relatedCategories.map((category) => (
                    <Link key={category.id} to={category.path} className="tool-detail-topic-link">
                      <span className={`cat-dot cat-dot-${category.colorKey}`} />
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {tool.tags && tool.tags.length > 0 && (
              <div className="tool-detail-side-box">
                <h2 className="tool-detail-side-title">Từ khoá</h2>
                <div className="tool-detail-tag-cloud">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="tool-detail-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>

        {/* 4. Back link */}
        <div className="tool-detail-back-row">
          <Link to="/tools" className="btn-secondary btn-sm">
            <span>Xem tất cả công cụ</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ToolDetailPage;
