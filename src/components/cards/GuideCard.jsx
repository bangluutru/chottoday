import React from 'react';
import './Cards.css';
import { ArrowRightIcon } from '../common/Icons';

export function GuideCard(props) {
  const guide = props.guide || props;
  const {
    title,
    category,
    categoryKey = 'work',
    stepsCount = 4,
    timeEstimate = '15 phút',
    slug = '#useful-today',
  } = guide;

  return (
    <div className={`guide-card card-${categoryKey}`}>
      <div className="card-top-meta">
        <span className={`chotto-chip chip-${categoryKey}`}>{category}</span>
        <span className="guide-steps-pill">
          {stepsCount} bước · {timeEstimate}
        </span>
      </div>

      <h3 className="card-title card-title-spaced">
        <a href={slug}>{title}</a>
      </h3>

      <div className="guide-action-wrapper">
        <a
          href={slug}
          className="btn-primary guide-action-btn"
        >
          <span>Bắt đầu xem các bước</span>
          <ArrowRightIcon size={16} className="icon-inline-right" />
        </a>
      </div>
    </div>
  );
}
