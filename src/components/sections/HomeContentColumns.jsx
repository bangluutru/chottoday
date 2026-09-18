import React from 'react';
import { Link } from 'react-router-dom';
import './HomeContentColumns.css';
import { CommunityBlock } from './CommunityBlock';
import { getArticleBySlug } from '../../content/articles';
import { ArrowRightIcon } from '../common/Icons';
import { HOME_INTEREST_SLUGS } from '../../data/homepage.js';

/**
 * Closing two-column row: a ranked reading list beside the community card.
 *
 * The list is built from real article slugs, so a rank never points at a
 * missing page — unresolved slugs drop out and the numbering closes up.
 */
export function HomeContentColumns() {
  const interest = HOME_INTEREST_SLUGS
    .map((slug) => getArticleBySlug(slug))
    .filter(Boolean);

  return (
    <section className="home-columns-section" id="community" aria-label="Nội dung quan tâm và cộng đồng Chotto">
      <div className="container">
        <div className="home-columns-grid">
          <div className="interest-card">
            <div className="interest-card-head">
              <span className="interest-card-icon" aria-hidden="true">
                <svg width="22" height="22" viewBox="0 0 48 48" fill="none">
                  <path
                    d="M24 6c2 7-6 10-6 17a6 6 0 0012 0c0-3-1-5-1-5 6 3 9 8 9 13 0 7-6 11-14 11s-14-4-14-11c0-11 10-16 14-25z"
                    stroke="var(--chotto-ink)"
                    strokeWidth="3.2"
                    strokeLinejoin="round"
                    fill="#FEF0D8"
                  />
                  <path
                    d="M24 40c-4 0-6-2-6-5s3-4 4-7c3 3 8 4 8 8 0 2.5-2 4-6 4z"
                    fill="var(--chotto-coral)"
                  />
                </svg>
              </span>
              <h2 className="interest-card-title">Có thể bạn đang quan tâm</h2>
            </div>

            <ol className="interest-list">
              {interest.map((article, idx) => (
                <li key={article.slug}>
                  <Link to={`/articles/${article.slug}`} className="interest-row">
                    <span className="interest-rank" aria-hidden="true">{idx + 1}</span>
                    <span className="interest-row-title">{article.title}</span>
                    <ArrowRightIcon size={15} className="interest-row-arrow" />
                  </Link>
                </li>
              ))}
            </ol>
          </div>

          <CommunityBlock />
        </div>
      </div>
    </section>
  );
}
