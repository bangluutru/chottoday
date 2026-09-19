import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './ToolsIndexPage.css';
import { PageMeta } from '../components/common/PageMeta';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ArrowRightIcon, ExternalLinkIcon, SearchIcon } from '../components/common/Icons';
import {
  TOOL_CATALOGUE,
  TOOL_CATEGORIES,
  TOOL_CATEGORY_TINT,
} from '../data/tools.js';
import { buildToolUrl, getToolById } from '../services/toolRegistry';

const ALL_LABEL = TOOL_CATEGORIES[0];

/**
 * Resolves the catalogue into renderable cards.
 *
 * Toolio entries take their name, description and URL from the registry, so a
 * tool renamed or retired in Toolio is reflected here without a content edit —
 * and an entry the registry no longer knows is dropped rather than rendered as
 * a dead link.
 */
function resolveCatalogue() {
  return TOOL_CATALOGUE.map((entry) => {
    if (entry.calculator || entry.comingSoon) {
      return {
        ...entry,
        name: entry.name,
        description: entry.description,
        to: `/tools/${entry.slug}`,
        external: false,
      };
    }

    const tool = getToolById(entry.toolId);
    if (!tool) return null;
    const url = buildToolUrl(tool.id, { source: 'tools' });
    if (!url) return null;

    return {
      ...entry,
      name: tool.name,
      description: tool.description,
      href: url,
      external: true,
    };
  }).filter(Boolean);
}

export function ToolsIndexPage() {
  const [category, setCategory] = useState(ALL_LABEL);
  const [query, setQuery] = useState('');

  const catalogue = useMemo(resolveCatalogue, []);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return catalogue.filter((tool) => {
      const inCategory = category === ALL_LABEL || tool.category === category;
      if (!inCategory) return false;
      if (!needle) return true;
      return `${tool.name} ${tool.description} ${tool.category}`
        .toLowerCase()
        .includes(needle);
    });
  }, [catalogue, category, query]);

  return (
    <div className="tools-page">
      <PageMeta
        title="Công cụ tiện ích"
        description="Nhập vài thông tin, có ngay con số. Công cụ tính lương thực nhận, thuế, nenkin, chi phí chuyển nhà và thủ tục hành chính tại Nhật — miễn phí, không cần đăng ký."
        canonical="/tools"
      />

      <div className="container tools-breadcrumb-row">
        <Breadcrumb
          label="Đường dẫn công cụ"
          items={[{ label: 'Trang chủ', to: '/' }, { label: 'Công cụ tiện ích' }]}
        />
      </div>

      {/* HERO */}
      <section className="tools-hero-section">
        <div className="container">
          <div className="tools-hero">
            <div className="tools-hero-main">
              <h1 className="tools-hero-title">
                Công cụ tiện ích <span className="tools-hero-accent">Chotto</span>
              </h1>
              <p className="tools-hero-desc">
                Nhập vài thông tin, có ngay con số. Tất cả công cụ đều miễn phí, không cần
                đăng ký và không lưu dữ liệu của bạn.
              </p>

              <div className="tools-search-pill">
                <SearchIcon size={18} className="tools-search-icon" />
                <input
                  type="search"
                  className="tools-search-input"
                  placeholder="Tìm công cụ: thuế, nenkin, tiền nhà…"
                  aria-label="Tìm công cụ"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <span className="tools-search-count" aria-live="polite">
                  {visible.length} công cụ
                </span>
              </div>
            </div>

            <div className="tools-hero-note-wrap">
              <p className="tools-hero-note">
                Tính trước một chút,
                <br />
                an tâm hơn nhiều!
                <span className="tools-hero-note-face" aria-hidden="true">
                  ☺
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FILTER CHIPS */}
      <section className="tools-filter-section">
        <div className="container">
          <div className="tools-filter-row" role="group" aria-label="Lọc công cụ theo nhóm">
            {TOOL_CATEGORIES.map((label) => (
              <button
                key={label}
                type="button"
                className={`tools-filter-chip ${category === label ? 'active' : ''}`}
                aria-pressed={category === label}
                onClick={() => setCategory(label)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* GRID */}
      <section className="tools-grid-section">
        <div className="container">
          {visible.length > 0 ? (
            <div className="tools-grid">
              {visible.map((tool) => {
                const tint = TOOL_CATEGORY_TINT[tool.category] || 'tool';
                const body = (
                  <>
                    <div className="tool-card-head">
                      <span className={`tool-card-icon head-icon-${tool.tint}`}>
                        <img src={tool.icon} alt="" width="26" height="26" />
                      </span>
                      <span className={`chotto-chip chip-${tint} tool-card-chip`}>
                        {tool.category}
                      </span>
                    </div>
                    <div className="tool-card-name">{tool.name}</div>
                    {tool.comingSoon && (
                      <span className="tool-card-soon-badge">Đang phát triển</span>
                    )}
                    <p className="tool-card-desc">{tool.description}</p>
                    <div className="tool-card-foot">
                      <span className="tool-card-meta">{tool.meta}</span>
                      {tool.comingSoon ? (
                        <span className="tool-card-cta tool-card-cta-soon">Sắp có</span>
                      ) : (
                        <span className="tool-card-cta">
                          Dùng ngay
                          {tool.external ? (
                            <ExternalLinkIcon size={14} />
                          ) : (
                            <ArrowRightIcon size={14} />
                          )}
                        </span>
                      )}
                    </div>
                  </>
                );

                return tool.external ? (
                  <a
                    key={tool.slug}
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tool-card"
                    aria-label={`${tool.name} — mở trong Toolio`}
                  >
                    {body}
                  </a>
                ) : (
                  <Link
                    key={tool.slug}
                    to={tool.to}
                    className={`tool-card ${tool.comingSoon ? 'is-coming-soon' : ''}`}
                  >
                    {body}
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="tools-empty">
              <p className="tools-empty-title">Chưa có công cụ nào khớp…</p>
              <p className="tools-empty-desc">
                Thử từ khoá khác, hoặc gửi đề xuất để Chotto làm công cụ bạn cần nhé.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* CTA BAND */}
      <section className="tools-cta-section">
        <div className="container">
          <div className="tools-cta-band">
            <div className="tools-cta-copy">
              <h2 className="tools-cta-title">Bạn cần một công cụ chưa có ở đây?</h2>
              <p className="tools-cta-desc">
                Nói cho Chotto biết bạn đang phải tính tay việc gì — những đề xuất được
                nhiều người quan tâm sẽ được làm trước.
              </p>
            </div>
            <div className="tools-cta-actions">
              <Link to="/about#lien-he" className="tools-cta-primary">
                Gửi đề xuất công cụ
                <ArrowRightIcon size={15} />
              </Link>
              <Link to="/topics" className="tools-cta-secondary">
                Xem theo chủ đề
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ToolsIndexPage;
