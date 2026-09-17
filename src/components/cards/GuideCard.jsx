import React from 'react';
import './Cards.css';
import { ClockIcon, ArrowRightIcon } from '../common/Icons';

export function GuideCard({ guide }) {
  const { title, category, categoryKey, stepsCount, timeEstimate, slug } = guide;

  return (
    <div className={`guide-card card-${categoryKey}`}>
      <div className="card-top-meta">
        <span className={`chotto-chip chip-${categoryKey}`}>{category}</span>
        <span className="guide-steps-pill">
          {stepsCount} bước · {timeEstimate}
        </span>
      </div>

      <h3 className="card-title" style={{ marginTop: '4px' }}>
        <a href={slug}>{title}</a>
      </h3>

      <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
        <a
          href={slug}
          className="btn-primary"
          style={{ width: '100%', height: '44px', fontSize: '14px' }}
        >
          <span>Bắt đầu xem các bước</span>
          <ArrowRightIcon size={16} style={{ marginLeft: '6px' }} />
        </a>
      </div>
    </div>
  );
}
