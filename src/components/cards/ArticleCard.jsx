import React from 'react';
import { Link } from 'react-router-dom';
import './Cards.css';
import { ClockIcon, ArrowRightIcon } from '../common/Icons';

export function ArticleCard(props) {
  const article = props.article || props;
  const {
    slug,
    title,
    excerpt,
    category,
    categoryLabel,
    categoryKey = 'life',
    readTime,
    date,
    updatedDate,
  } = article;

  const displayCategory = categoryLabel || category;
  const displayDate = updatedDate || date;
  const targetUrl = slug ? `/articles/${slug}` : (article.url || '/articles');
  const isExternal = targetUrl.startsWith('http');

  return (
    <article className={`article-card card-${categoryKey}`}>
      <div className="card-top-meta">
        <span className={`chotto-chip chip-${categoryKey}`}>{displayCategory}</span>
        <span className="text-caption">{displayDate}</span>
      </div>

      <h3 className="card-title">
        {isExternal ? (
          <a href={targetUrl}>{title}</a>
        ) : (
          <Link to={targetUrl}>{title}</Link>
        )}
      </h3>

      <p className="card-excerpt">{excerpt}</p>

      <div className="card-bottom-meta">
        <span className="meta-item">
          <ClockIcon size={14} />
          <span>{readTime}</span>
        </span>
        {isExternal ? (
          <a href={targetUrl} className="meta-item card-action-link">
            <span>Đọc bài</span>
            <ArrowRightIcon size={14} />
          </a>
        ) : (
          <Link to={targetUrl} className="meta-item card-action-link">
            <span>Đọc bài</span>
            <ArrowRightIcon size={14} />
          </Link>
        )}
      </div>
    </article>
  );
}
