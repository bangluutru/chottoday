import React from 'react';
import './ArticleRenderer.css';
import { ExternalLinkIcon } from '../common/Icons';
import { getToolById, isToolAvailable, buildToolUrl } from '../../services/toolRegistry';
import { trackEvent } from '../../services/analytics';

/**
 * Lightweight inline text parser converting **bold** to <strong>
 * without pulling in heavy Markdown parser dependencies.
 */
function renderFormattedText(text) {
  if (typeof text !== 'string') return text;
  if (!text.includes('**')) return text;

  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return part;
  });
}

export function ArticleRenderer({ sections = [] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="article-reader">
      {sections.map((section, idx) => {
        switch (section.type) {
          case 'intro':
            return (
              <p key={idx} className="article-intro">
                {renderFormattedText(section.content)}
              </p>
            );

          case 'heading': {
            const HeadingTag = section.level === 3 ? 'h3' : 'h2';
            const headingClass = section.level === 3 ? 'article-h3' : 'article-h2';
            return (
              <HeadingTag key={idx} className={headingClass}>
                {renderFormattedText(section.text)}
              </HeadingTag>
            );
          }

          case 'paragraph':
            return (
              <p key={idx} className="article-paragraph">
                {renderFormattedText(section.content)}
              </p>
            );

          case 'list':
            return (
              <ul key={idx} className="article-list">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="article-list-item">
                    {renderFormattedText(item)}
                  </li>
                ))}
              </ul>
            );

          case 'steps':
            return (
              <div key={idx} className="article-steps">
                {section.items.map((step, stepIdx) => (
                  <div key={stepIdx} className="article-step-item">
                    <div className="article-step-number">
                      {step.stepNumber || stepIdx + 1}
                    </div>
                    <div className="article-step-content">
                      <div className="article-step-title">{renderFormattedText(step.title)}</div>
                      <div className="article-step-text">{renderFormattedText(step.text)}</div>
                    </div>
                  </div>
                ))}
              </div>
            );

          case 'term':
            return (
              <div key={idx} className="article-term-box">
                <div className="article-term-kanji">{section.term}</div>
                {section.reading && (
                  <div className="article-term-reading">Romaji: {section.reading}</div>
                )}
                <div className="article-term-meaning">{renderFormattedText(section.meaning)}</div>
              </div>
            );

          case 'note':
            return (
              <div key={idx} className="article-note">
                {section.title && (
                  <div className="article-note-title">
                    <span>💡</span>
                    <span>{renderFormattedText(section.title)}</span>
                  </div>
                )}
                <div className="article-note-content">{renderFormattedText(section.content)}</div>
              </div>
            );

          case 'warning':
            return (
              <div key={idx} className="article-warning" role="alert">
                {section.title && (
                  <div className="article-warning-title">
                    ⚠️ {renderFormattedText(section.title)}
                  </div>
                )}
                <div className="article-warning-content">{renderFormattedText(section.content)}</div>
              </div>
            );

          case 'example':
            return (
              <div key={idx} className="article-example-box">
                {section.title && (
                  <div className="article-example-title">{renderFormattedText(section.title)}</div>
                )}
                {section.items && (
                  <div className="article-example-table">
                    {section.items.map((row, rowIdx) => {
                      const rowClass = [
                        'article-example-row',
                        row.highlight ? 'highlight' : '',
                        row.isDeduction ? 'deduction' : '',
                        row.isTotal ? 'total' : '',
                      ]
                        .filter(Boolean)
                        .join(' ');

                      return (
                        <div key={rowIdx} className={rowClass}>
                          <span>{row.label}</span>
                          <span>{row.value}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {section.caption && (
                  <div className="article-example-caption">{renderFormattedText(section.caption)}</div>
                )}
              </div>
            );

          case 'quote':
            return (
              <blockquote key={idx} className="article-quote">
                <p className="article-quote-text">{renderFormattedText(section.content)}</p>
                {section.author && (
                  <cite className="article-quote-author">— {section.author}</cite>
                )}
              </blockquote>
            );

          case 'toolCTA': {
            // Requirement 14 & 18: toolId -> ToolRegistryService -> resolve tool -> check availability -> build URL -> render CTA
            const toolId = section.toolId;
            const tool = toolId ? getToolById(toolId) : null;
            const available = toolId ? isToolAvailable(toolId) : false;

            // Handle unknown or paused tool gracefully without crashing
            if (!tool || !available) {
              if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
                console.warn(`[ChottoDay] Tool CTA omitted: toolId "${toolId}" is not recognized or active.`);
              }
              return null;
            }

            // Centralized URL builder
            const ctaUrl = buildToolUrl(tool.id, { source: 'article' });
            if (!ctaUrl) {
              return null;
            }

            // Editorial contextualization
            const editorial = section.editorial || {};
            const title = editorial.title || section.title || tool.name;
            const description = editorial.description || section.description || tool.description;
            const badge = section.badge || 'Mở trong Toolio';
            const ctaText = section.ctaText || 'Dùng công cụ ngay';
            const note = section.note || (tool.processing === 'browser' ? '100% xử lý trên trình duyệt của bạn' : '');
            const icon = section.icon || '🛠️';

            const handleToolClick = () => {
              trackEvent('toolio_open', {
                toolId: tool.id,
                source: 'article_cta',
                title: tool.name,
              });
            };

            return (
              <div key={idx} className="article-tool-cta">
                <div className="article-tool-header">
                  <div className="article-tool-title-wrap">
                    <span className="article-tool-icon">{icon}</span>
                    <h3 className="article-tool-title">{title}</h3>
                  </div>
                  {badge && (
                    <span className="article-tool-badge">{badge}</span>
                  )}
                </div>

                {description && <p className="article-tool-desc">{description}</p>}

                <div className="article-tool-action-row">
                  <a
                    href={ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-tool-btn"
                    onClick={handleToolClick}
                  >
                    <span>{ctaText}</span>
                    <ExternalLinkIcon size={16} />
                  </a>
                  {note && (
                    <span className="article-tool-note">{note}</span>
                  )}
                </div>
              </div>
            );
          }

          case 'sources':
            return (
              <div key={idx} className="article-sources">
                <div className="article-sources-title">Nguồn tham khảo chính thức</div>
                <div className="article-sources-list">
                  {section.items.map((source, srcIdx) => (
                    <div key={srcIdx} className="article-source-item">
                      • {source.title} ({source.publisher || source.organization}) —{' '}
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="article-source-link"
                        onClick={() => trackEvent('source_link_click', { url: source.url, title: source.title })}
                      >
                        <span>Truy cập nguồn</span>
                        <ExternalLinkIcon size={12} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
