import React from 'react';
import './ArticleRenderer.css';
import { ArrowRightIcon, ExternalLinkIcon } from '../common/Icons';

export function ArticleRenderer({ sections = [] }) {
  if (!sections || sections.length === 0) return null;

  return (
    <div className="article-reader">
      {sections.map((section, idx) => {
        switch (section.type) {
          case 'intro':
            return (
              <p key={idx} className="article-intro">
                {section.content}
              </p>
            );

          case 'heading': {
            const HeadingTag = section.level === 3 ? 'h3' : 'h2';
            const headingClass = section.level === 3 ? 'article-h3' : 'article-h2';
            return (
              <HeadingTag key={idx} className={headingClass}>
                {section.text}
              </HeadingTag>
            );
          }

          case 'paragraph':
            return (
              <p key={idx} className="article-paragraph">
                {section.content}
              </p>
            );

          case 'list':
            return (
              <ul key={idx} className="article-list">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="article-list-item">
                    {item}
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
                      <div className="article-step-title">{step.title}</div>
                      <div className="article-step-text">{step.text}</div>
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
                <div className="article-term-meaning">{section.meaning}</div>
              </div>
            );

          case 'note':
            return (
              <div key={idx} className="article-note">
                {section.title && (
                  <div className="article-note-title">
                    <span>💡</span>
                    <span>{section.title}</span>
                  </div>
                )}
                <div className="article-note-content">{section.content}</div>
              </div>
            );

          case 'warning':
            return (
              <div key={idx} className="article-warning" role="alert">
                {section.title && (
                  <div className="article-warning-title">
                    ⚠️ {section.title}
                  </div>
                )}
                <div className="article-warning-content">{section.content}</div>
              </div>
            );

          case 'example':
            return (
              <div key={idx} className="article-example-box">
                {section.title && (
                  <div className="article-example-title">{section.title}</div>
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
                  <div className="article-example-caption">{section.caption}</div>
                )}
              </div>
            );

          case 'toolCTA':
            return (
              <div key={idx} className="article-tool-cta">
                <div className="article-tool-header">
                  <div className="article-tool-title-wrap">
                    <span className="article-tool-icon">{section.icon || '🛠️'}</span>
                    <h3 className="article-tool-title">{section.title}</h3>
                  </div>
                  {section.badge && (
                    <span className="article-tool-badge">{section.badge}</span>
                  )}
                </div>

                <p className="article-tool-desc">{section.description}</p>

                <div className="article-tool-action-row">
                  <a
                    href={section.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-tool-btn"
                  >
                    <span>{section.ctaText || 'Dùng công cụ ngay'}</span>
                    <ExternalLinkIcon size={16} />
                  </a>
                  {section.note && (
                    <span className="article-tool-note">{section.note}</span>
                  )}
                </div>
              </div>
            );

          case 'sources':
            return (
              <div key={idx} className="article-sources">
                <div className="article-sources-title">Nguồn tham khảo chính thức</div>
                <div className="article-sources-list">
                  {section.items.map((source, srcIdx) => (
                    <div key={srcIdx} className="article-source-item">
                      • {source.title} ({source.publisher}) —{' '}
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="article-source-link"
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
