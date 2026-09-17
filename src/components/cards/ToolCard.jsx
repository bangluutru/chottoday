import React from 'react';
import './Cards.css';
import { ExternalLinkIcon, ShieldCheckIcon } from '../common/Icons';

export function ToolCard({ tool }) {
  const { name, description, category, categoryKey, badge, toolioPath, stats } = tool;

  return (
    <div className={`tool-card card-${categoryKey}`}>
      <div className="card-top-meta">
        <span className={`chotto-chip chip-${categoryKey}`}>{category}</span>
        <span className="tool-privacy-pill">
          <ShieldCheckIcon size={13} />
          <span>{badge}</span>
        </span>
      </div>

      <h3 className="card-title" style={{ marginTop: '4px' }}>
        <a href={toolioPath} target="_blank" rel="noopener noreferrer">
          {name}
        </a>
      </h3>

      <p className="card-excerpt">{description}</p>

      <div style={{ marginTop: 'auto' }}>
        {stats && (
          <div className="text-caption" style={{ marginBottom: '10px' }}>
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
