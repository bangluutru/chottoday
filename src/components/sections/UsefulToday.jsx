import React from 'react';
import { FEATURED_CONTENT } from '../../data/featured';
import { ArticleCard } from '../cards/ArticleCard';
import { GuideCard } from '../cards/GuideCard';
import { ToolCard } from '../cards/ToolCard';

export function UsefulToday() {
  const { article, guide, tool } = FEATURED_CONTENT;

  return (
    <section className="section" id="useful-today" aria-labelledby="useful-today-heading">
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <div className="text-caption" style={{ textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '6px', color: 'var(--text-muted)' }}>
            Nổi bật trong ngày
          </div>
          <h2 id="useful-today-heading" className="text-h2">
            Hôm nay có gì hữu ích?
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '20px',
          }}
        >
          {/* 1. Featured Article */}
          <div style={{ display: 'flex' }}>
            <ArticleCard article={article} />
          </div>

          {/* 2. Featured Guide */}
          <div style={{ display: 'flex' }}>
            <GuideCard guide={guide} />
          </div>

          {/* 3. Featured Tool */}
          <div style={{ display: 'flex' }}>
            <ToolCard tool={tool} />
          </div>
        </div>
      </div>
    </section>
  );
}
