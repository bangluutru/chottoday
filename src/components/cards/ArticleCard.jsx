import React from 'react';
import './Cards.css';
import { ClockIcon, ArrowRightIcon } from '../common/Icons';

export function ArticleCard(props) {
  const article = props.article || props;
  const {
    title,
    excerpt,
    category,
    categoryKey = 'life',
    readTime,
    date,
    url = '#articles',
  } = article;

  return (
    <article className={`article-card card-${categoryKey}`}>
      <div className="card-top-meta">
        <span className={`chotto-chip chip-${categoryKey}`}>{category}</span>
        <span className="text-caption">{date}</span>
      </div>

      <h3 className="card-title">
        <a href={url}>{title}</a>
      </h3>

      <p className="card-excerpt">{excerpt}</p>

      <div className="card-bottom-meta">
        <span className="meta-item">
          <ClockIcon size={14} />
          <span>{readTime}</span>
        </span>
        <a href={url} className="meta-item card-action-link">
          <span>Đọc bài</span>
          <ArrowRightIcon size={14} />
        </a>
      </div>
    </article>
  );
}
