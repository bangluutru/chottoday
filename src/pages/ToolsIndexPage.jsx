import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './ToolsIndexPage.css';
import { getAllTools, searchTools, buildToolUrl } from '../services/toolRegistry';
import {
  TOOL_DOMAINS,
  TOOL_CATEGORIES,
  getDomainLabel,
  getCategoryLabel,
  getSubdomainLabel,
  getProcessingLabel,
} from '../content/tools/toolTaxonomy';
import { trackEvent } from '../services/analytics';
import { TOOLIO_BASE_URL } from '../config/constants';
import {
  SearchIcon,
  CloseIcon,
  ArrowRightIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
} from '../components/common/Icons';
import { PageMeta } from '../components/common/PageMeta';

const PAGE_DESCRIPTION =
  'Toàn bộ miniapp Toolio mà Chotto giới thiệu: tính thuế, bảo hiểm, ảnh thẻ, PDF, hóa đơn và các tiện ích xử lý ngay trên trình duyệt.';

export function ToolsIndexPage() {
  // Ephemeral, component-local only: never written to the URL, localStorage, or cookies.
  const [query, setQuery] = useState('');
  const [activeDomain, setActiveDomain] = useState('all');
  const [activeCategory, setActiveCategory] = useState('all');

  const allTools = useMemo(() => getAllTools(), []);

  const visibleTools = useMemo(() => {
    const trimmed = query.trim();
    // Reuse the registry's diacritics-aware search rather than re-implementing it.
    const base = trimmed ? searchTools(trimmed, allTools.length) : allTools;

    return base.filter((tool) => {
      if (activeDomain !== 'all' && tool.domain !== activeDomain) return false;
      if (activeCategory !== 'all' && tool.category !== activeCategory) return false;
      return true;
    });
  }, [query, activeDomain, activeCategory, allTools]);

  const handleClearSearch = () => setQuery('');

  const hasActiveFilter =
    Boolean(query.trim()) || activeDomain !== 'all' || activeCategory !== 'all';

  const handleResetAll = () => {
    setQuery('');
    setActiveDomain('all');
    setActiveCategory('all');
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Tất cả công cụ Chotto',
    description: PAGE_DESCRIPTION,
    url: 'https://chottoday.com/tools',
    isPartOf: {
      '@type': 'WebSite',
      name: 'Chotto',
      url: 'https://chottoday.com',
    },
  };

  return (
    <div className="tools-index-wrapper">
      <PageMeta
        title="Tất cả công cụ"
        description={PAGE_DESCRIPTION}
        canonical="/tools"
        ogTitle="Tất cả công cụ | Chotto"
        ogDescription={PAGE_DESCRIPTION}
        structuredData={structuredData}
      />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb-nav" aria-label="Đường dẫn trang">
          <Link to="/" className="breadcrumb-link">
            Trang chủ
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current" aria-current="page">
            Tất cả công cụ
          </span>
        </nav>

        {/* 1. Page Header */}
        <header className="tools-index-header">
          <div className="tools-index-header-text">
            <div className="section-eyebrow">Công cụ Chotto</div>
            <h1 className="text-h1 tools-index-title">Tất cả công cụ</h1>
            <p className="tools-index-desc">{PAGE_DESCRIPTION}</p>
          </div>

          <div className="tools-index-count" aria-live="polite">
            <span className="tools-index-count-number">{allTools.length}</span>
            <span className="tools-index-count-label">công cụ đang hoạt động</span>
          </div>
        </header>

        {/* 2. Ecosystem & privacy notice */}
        <div className="tools-index-notice">
          <ShieldCheckIcon size={18} color="var(--cat-tool-text)" />
          <p className="tools-index-notice-text">
            <strong>Nguyên tắc Chotto:</strong> Nội dung là điểm bắt đầu, công cụ là điểm kết thúc.
            Mọi công cụ đều là miniapp độc lập chạy trên{' '}
            <a
              href={TOOLIO_BASE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="tools-index-notice-link"
            >
              toolio.chottoday.com
            </a>{' '}
            và xử lý dữ liệu ngay trên trình duyệt của bạn.
          </p>
        </div>

        {/* 3. Search + Filters */}
        <div className="tools-filter-panel">
          <div className="tools-search-box">
            <SearchIcon size={17} className="tools-search-icon" />
            <input
              type="search"
              className="tools-search-input"
              placeholder="Tìm công cụ: thuế, nenkin, ảnh thẻ, PDF..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Tìm kiếm công cụ"
            />
            {query && (
              <button
                type="button"
                className="tools-search-clear"
                onClick={handleClearSearch}
                aria-label="Xoá từ khoá tìm kiếm"
              >
                <CloseIcon size={15} />
              </button>
            )}
          </div>

          <div className="tools-filter-group" role="group" aria-label="Lọc theo nhóm công cụ">
            <span className="tools-filter-label">Nhóm</span>
            <button
              type="button"
              className={`tools-filter-chip ${activeDomain === 'all' ? 'active' : ''}`}
              onClick={() => setActiveDomain('all')}
            >
              Tất cả
            </button>
            {TOOL_DOMAINS.map((domain) => (
              <button
                key={domain.id}
                type="button"
                className={`tools-filter-chip ${activeDomain === domain.id ? 'active' : ''}`}
                onClick={() => setActiveDomain(domain.id)}
                title={domain.description}
              >
                {domain.name}
              </button>
            ))}
          </div>

          <div className="tools-filter-group" role="group" aria-label="Lọc theo loại công cụ">
            <span className="tools-filter-label">Loại</span>
            <button
              type="button"
              className={`tools-filter-chip ${activeCategory === 'all' ? 'active' : ''}`}
              onClick={() => setActiveCategory('all')}
            >
              Tất cả
            </button>
            {TOOL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                className={`tools-filter-chip ${activeCategory === cat.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 4. Result count */}
        <div className="tools-result-bar">
          <span className="text-caption">
            Hiển thị <strong>{visibleTools.length}</strong> / {allTools.length} công cụ
          </span>
          {hasActiveFilter && (
            <button type="button" className="tools-reset-btn" onClick={handleResetAll}>
              Xoá bộ lọc
            </button>
          )}
        </div>

        {/* 5. Tool Grid */}
        {visibleTools.length === 0 ? (
          <div className="tools-empty-state">
            <p className="tools-empty-title">Không tìm thấy công cụ phù hợp</p>
            <p className="tools-empty-desc">
              Thử một từ khoá ngắn hơn, hoặc bỏ bớt bộ lọc để xem toàn bộ {allTools.length} công cụ.
            </p>
            <button type="button" className="btn-secondary btn-sm" onClick={handleResetAll}>
              <span>Xem tất cả công cụ</span>
            </button>
          </div>
        ) : (
          <div className="tools-grid" role="list">
            {visibleTools.map((tool) => {
              const toolUrl = buildToolUrl(tool.id, { source: 'tools' });
              const subdomainLabel = getSubdomainLabel(tool.subdomain);

              return (
                <article key={tool.id} className="tool-index-card card-tool" role="listitem">
                  <div className="tool-index-card-top">
                    <span className="chotto-chip chip-tool">{getCategoryLabel(tool.category)}</span>
                    <span className="tool-index-privacy">
                      <ShieldCheckIcon size={12} />
                      <span>{getProcessingLabel(tool.processing)}</span>
                    </span>
                  </div>

                  <h2 className="tool-index-card-title">
                    <Link to={`/tools/${tool.id}`}>{tool.name}</Link>
                  </h2>

                  <p className="tool-index-card-desc">{tool.description}</p>

                  <div className="tool-index-card-tags">
                    <span className="tool-index-domain">{getDomainLabel(tool.domain)}</span>
                    {subdomainLabel && (
                      <>
                        <span className="tool-index-tag-dot" aria-hidden="true">
                          ·
                        </span>
                        <span className="tool-index-domain">{subdomainLabel}</span>
                      </>
                    )}
                  </div>

                  <div className="tool-index-card-foot">
                    <Link to={`/tools/${tool.id}`} className="tool-index-detail-link">
                      <span>Xem chi tiết</span>
                      <ArrowRightIcon size={14} />
                    </Link>

                    {toolUrl && (
                      <a
                        href={toolUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tool-index-open-link"
                        onClick={() =>
                          trackEvent('toolio_open', { tool: tool.id, source: 'tools_index' })
                        }
                      >
                        <span>Mở trên Toolio</span>
                        <ExternalLinkIcon size={13} />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ToolsIndexPage;
