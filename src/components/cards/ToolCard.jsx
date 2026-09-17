import React from 'react';
import './Cards.css';
import { ExternalLinkIcon, ShieldCheckIcon } from '../common/Icons';

export function ToolCard(props) {
  const tool = props.tool || props;
  const {
    name,
    title,
    description,
    category,
    categoryKey = 'tool',
    badge = 'Xử lý trên trình duyệt',
    toolioPath,
    stats,
  } = tool;

  const displayTitle = name || title;

  return (
    <div className={`tool-card card-${categoryKey}`}>
      <div className="card-top-meta">
        <span className={`chotto-chip chip-${categoryKey}`}>{category}</span>
        <span className="tool-privacy-pill">
          <ShieldCheckIcon size={13} />
          <span>{badge}</span>
        </span>
      </div>

      <h3 className="card-title card-title-spaced">
        <a href={toolioPath} target="_blank" rel="noopener noreferrer">
          {displayTitle}
        </a>
      </h3>

      <p className="card-excerpt">{description}</p>

      <div className="tool-action-wrapper">
        {stats && (
          <div className="text-caption tool-stats-caption">
            {stats}
          </div>
        )}
        <a
          href={toolioPath}
          target="_blank"
          rel="noopener noreferrer"
          className="tool-card-cta"
        >
          <span>Mở trên Toolio (tools.chottoday.com)</span>
          <ExternalLinkIcon size={15} />
        </a>
      </div>
    </div>
  );
}
