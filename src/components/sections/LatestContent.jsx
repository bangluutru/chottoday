import React from 'react';
import { Link } from 'react-router-dom';
import './LatestContent.css';
import { getArticleBySlug } from '../../content/articles';
import { ArrowRightIcon } from '../common/Icons';
import { HOME_ARTICLE_CARDS } from '../../data/homepage.js';

/** `2026-09-17` -> `17/09/2026`, the format used throughout the site. */
function formatDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return d && m && y ? `${d}/${m}/${y}` : iso;
}

/**
 * "Bài viết mới nhất" — four picture cards.
 *
 * Titles, excerpts, reading time and dates come straight from the article
 * records; only the image, chip label and ordering are curated.
 */
export function LatestContent() {
  const cards = HOME_ARTICLE_CARDS.map((card) => {
    const article = getArticleBySlug(card.slug);
    return article ? { ...card, article } : null;
  }).filter(Boolean);

  if (cards.length === 0) return null;

  return (
    <section className="articles-section" id="articles" aria-labelledby="articles-heading">
      <div className="container">
        <div className="section-head-bar">
          <div className="section-head-icon head-icon-health">
            <img src="/icons/icon-doc.svg" alt="" width="26" height="26" />
          </div>
          <div className="section-head-left">
            <h2 id="articles-heading" className="section-title-with-icon">Bài viết mới nhất</h2>
            <p className="section-desc-subtle">
              Những thông tin hữu ích, gần gũi và dễ hiểu cho cuộc sống tại Nhật.
            </p>
          </div>
          <Link to="/articles" className="section-link-more">
            <span>Xem tất cả</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        <div className="article-card-grid">
          {cards.map(({ article, image, imageAlt, chipLabel, chipPalette, slug }) => (
            <Link key={slug} to={`/articles/${slug}`} className="article-media-card">
              <img
                src={image}
                alt={imageAlt}
                className="article-media-img"
                loading="lazy"
                width="400"
                height="150"
              />
              <div className="article-media-body">
                <span className={`article-media-chip chip-${chipPalette}`}>{chipLabel}</span>
                <h3 className="article-media-title">{article.title}</h3>
                <p className="article-media-excerpt">{article.excerpt}</p>
                <div className="article-media-meta">
                  <span>{article.readingTime} phút đọc</span>
                  <span className="article-media-dot" aria-hidden="true">•</span>
                  <span>{formatDate(article.updatedAt || article.publishedAt)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default LatestContent;
