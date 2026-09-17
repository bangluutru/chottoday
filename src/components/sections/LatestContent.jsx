import React from 'react';
import { LATEST_ARTICLES } from '../../data/articles';
import { ArticleCard } from '../cards/ArticleCard';
import { ArrowRightIcon } from '../common/Icons';

export function LatestContent() {
  return (
    <section className="section" id="articles" aria-labelledby="latest-heading">
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '28px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div
              className="text-caption"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
                color: 'var(--text-muted)',
              }}
            >
              Cập nhật gần đây
            </div>
            <h2 id="latest-heading" className="text-h2">
              Mới trên Chotto
            </h2>
          </div>

          <a href="#articles" className="btn-secondary" style={{ height: '40px', fontSize: '14px' }}>
            <span>Xem tất cả bài viết</span>
            <ArrowRightIcon size={14} style={{ marginLeft: '6px' }} />
          </a>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {LATEST_ARTICLES.map((article) => (
            <div key={article.id} style={{ display: 'flex' }}>
              <ArticleCard article={article} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
