import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './ToolDetailPage.css';
import { PageMeta } from '../components/common/PageMeta';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { FaqAccordion } from '../components/common/FaqAccordion';
import { NetSalaryCalculator } from '../components/tools/NetSalaryCalculator';
import { ArrowRightIcon, ExternalLinkIcon } from '../components/common/Icons';
import { getToolCatalogueEntry } from '../data/tools.js';
import { getToolPage } from '../data/toolPages.js';
import { getArticleBySlug } from '../content/articles';
import { buildToolUrl, getToolById } from '../services/toolRegistry';

/** Calculators ChottoDay renders itself, keyed by the entry's `calculator`. */
const CALCULATORS = {
  'net-salary': NetSalaryCalculator,
};

/**
 * A tool from the design that is not built yet.
 *
 * It gets a real page rather than a dead link so the visitor lands somewhere
 * that explains itself, and `noindex` so an empty tool cannot be found in
 * search before it exists.
 */
function ComingSoon({ entry }) {
  return (
    <div className="tool-detail-page">
      <PageMeta
        title={entry.name}
        description={`${entry.description} Công cụ đang được Chotto phát triển.`}
        canonical={`/tools/${entry.slug}`}
        robots="noindex, follow"
      />

      <div className="container tool-detail-breadcrumb">
        <Breadcrumb
          label="Đường dẫn công cụ"
          items={[
            { label: 'Trang chủ', to: '/' },
            { label: 'Công cụ', to: '/tools' },
            { label: entry.name },
          ]}
        />
      </div>

      <section className="tool-detail-hero-section">
        <div className="container">
          <div className="tool-soon-card">
            <span className={`tool-soon-icon head-icon-${entry.tint}`}>
              <img src={entry.icon} alt="" width="30" height="30" />
            </span>
            <span className="tool-soon-badge">Đang phát triển</span>
            <h1 className="tool-soon-title">{entry.name}</h1>
            <p className="tool-soon-desc">{entry.description}</p>
            <p className="tool-soon-note">
              Công cụ này đang được phát triển, bạn vui lòng quay lại sau nhé.
            </p>
            <div className="tool-soon-actions">
              <Link to="/tools" className="tool-soon-primary">
                Xem công cụ đang có
                <ArrowRightIcon size={15} />
              </Link>
              <Link to="/about#lien-he" className="tool-soon-secondary">
                Nhắc Chotto làm sớm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function NotFound() {
  return (
    <div className="container tool-detail-missing">
      <PageMeta
        title="Không tìm thấy công cụ"
        description="Công cụ bạn tìm có thể đã đổi đường dẫn hoặc chưa được phát hành."
      />
      <h1 className="text-h2">Không tìm thấy công cụ</h1>
      <p className="text-body">
        Công cụ bạn tìm có thể đã đổi đường dẫn hoặc chưa được phát hành.
      </p>
      <Link to="/tools" className="btn-primary">
        <span>Xem tất cả công cụ</span>
      </Link>
    </div>
  );
}

export function ToolDetailPage() {
  const { slug } = useParams();
  const entry = getToolCatalogueEntry(slug);
  const page = getToolPage(slug);
  const Calculator = entry?.calculator ? CALCULATORS[entry.calculator] : null;

  if (entry?.comingSoon) {
    return <ComingSoon entry={entry} />;
  }

  if (!entry || !page || !Calculator) {
    return <NotFound />;
  }

  const relatedTools = (page.relatedToolSlugs || [])
    .map((relatedSlug) => {
      const related = getToolCatalogueEntry(relatedSlug);
      if (!related) return null;
      if (related.calculator) {
        return { ...related, name: related.name, to: `/tools/${related.slug}`, external: false };
      }
      const tool = getToolById(related.toolId);
      if (!tool) return null;
      const url = buildToolUrl(tool.id, { source: 'tools' });
      if (!url) return null;
      return { ...related, name: tool.name, href: url, external: true };
    })
    .filter(Boolean);

  const relatedArticles = (page.relatedArticles || [])
    .map((item) => {
      const article = getArticleBySlug(item.slug);
      if (!article) return null;
      return { ...item, title: article.title };
    })
    .filter(Boolean);

  return (
    <div className="tool-detail-page">
      <PageMeta
        title={page.seo?.title || entry.name}
        description={page.seo?.description || entry.description}
        canonical={`/tools/${entry.slug}`}
      />

      <div className="container tool-detail-breadcrumb">
        <Breadcrumb
          label="Đường dẫn công cụ"
          items={[
            { label: 'Trang chủ', to: '/' },
            { label: 'Công cụ', to: '/tools' },
            { label: entry.name },
          ]}
        />
      </div>

      {/* HERO */}
      <section className="tool-detail-hero-section">
        <div className="container tool-detail-hero">
          <div className="tool-detail-hero-main">
            <div className="tool-detail-badges">
              {page.badges.map((badge) => (
                <span key={badge.label} className={`chotto-chip chip-${badge.tint} tool-detail-badge`}>
                  {badge.label}
                </span>
              ))}
              {page.badgeNote && (
                <span className="tool-detail-badge-note">{page.badgeNote}</span>
              )}
            </div>
            <h1 className="tool-detail-title">
              {page.headline.before}
              <span className="tool-detail-title-accent">{page.headline.accent}</span>
              {page.headline.after}
            </h1>
            <p className="tool-detail-intro">{page.intro}</p>
          </div>

          <div className="tool-detail-note-wrap">
            <p className="tool-detail-note">
              {page.handNote.map((line, index) => (
                <React.Fragment key={line}>
                  {index > 0 && <br />}
                  {line}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="tool-detail-calc-section">
        <div className="container">
          <Calculator disclaimer={page.disclaimer} />
        </div>
      </section>

      {/* EXPLAINER + FAQ + SIDEBAR */}
      <section className="tool-detail-explainer-section">
        <div className="container tool-detail-explainer-row">
          <div className="tool-detail-explainer">
            <h2 className="tool-detail-explainer-title">{page.explainer.title}</h2>
            <p className="tool-detail-explainer-intro">{page.explainer.intro}</p>

            <div className="tool-detail-steps">
              {page.explainer.steps.map((step) => (
                <div key={step.title} className={`tool-detail-step step-${step.tint}`}>
                  <div className="tool-detail-step-title">{step.title}</div>
                  <p className="tool-detail-step-body">{step.body}</p>
                </div>
              ))}
            </div>

            <h3 className="tool-detail-faq-title">Câu hỏi thường gặp</h3>
            <FaqAccordion items={page.faqs} defaultOpen={0} />
          </div>

          <aside className="tool-detail-aside" aria-label="Nội dung liên quan">
            {relatedTools.length > 0 && (
              <div className="tool-aside-card tool-aside-card-panel">
                <h2 className="tool-aside-title">Công cụ liên quan</h2>
                {relatedTools.map((tool) =>
                  tool.external ? (
                    <a
                      key={tool.slug}
                      href={tool.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="tool-aside-row"
                    >
                      <span className={`tool-aside-icon head-icon-${tool.tint}`}>
                        <img src={tool.icon} alt="" width="20" height="20" />
                      </span>
                      <span className="tool-aside-row-label">{tool.name}</span>
                      <ExternalLinkIcon size={14} />
                    </a>
                  ) : (
                    <Link key={tool.slug} to={tool.to} className="tool-aside-row">
                      <span className={`tool-aside-icon head-icon-${tool.tint}`}>
                        <img src={tool.icon} alt="" width="20" height="20" />
                      </span>
                      <span className="tool-aside-row-label">{tool.name}</span>
                    </Link>
                  )
                )}
                <Link to="/tools" className="tool-aside-more">
                  Xem tất cả công cụ
                  <ArrowRightIcon size={14} />
                </Link>
              </div>
            )}

            {relatedArticles.length > 0 && (
              <div className="tool-aside-card">
                <h2 className="tool-aside-title">Đọc thêm</h2>
                {relatedArticles.map((article) => (
                  <Link
                    key={article.slug}
                    to={`/articles/${article.slug}`}
                    className="tool-aside-article"
                  >
                    <img
                      src={article.image}
                      alt=""
                      className="tool-aside-thumb"
                      loading="lazy"
                      width="62"
                      height="48"
                    />
                    <span className="tool-aside-article-title">{article.title}</span>
                  </Link>
                ))}
              </div>
            )}

            <div className="tool-aside-feedback">
              <p className="tool-aside-feedback-note">
                {page.feedbackNote.map((line, index) => (
                  <React.Fragment key={line}>
                    {index > 0 && <br />}
                    {line}
                  </React.Fragment>
                ))}
              </p>
              <Link to="/about#lien-he" className="tool-aside-feedback-btn">
                Góp ý cho Chotto
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default ToolDetailPage;
