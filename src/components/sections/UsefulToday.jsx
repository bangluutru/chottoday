import React from 'react';
import './UsefulToday.css';
import { FEATURED_CONTENT } from '../../data/featured';
import { ArticleCard } from '../cards/ArticleCard';
import { GuideCard } from '../cards/GuideCard';
import { ToolCard } from '../cards/ToolCard';

export function UsefulToday() {
  const { article, guide, tool } = FEATURED_CONTENT;

  return (
    <section className="section" id="useful-today" aria-labelledby="useful-today-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            Gợi ý hàng ngày
          </div>
          <h2 id="useful-today-heading" className="text-h2">
            Hôm nay có gì hữu ích?
          </h2>
          <p className="text-body">
            Bộ ba nội dung được tuyển chọn: 1 bài viết chuyên sâu, 1 cẩm nang từng bước và 1 công cụ thực hành.
          </p>
        </div>

        {/* 3 Featured Items Grid */}
        <div className="useful-today-grid">
          {/* 1. Featured Article */}
          <div className="useful-today-col">
            <ArticleCard
              title={article.title}
              excerpt={article.excerpt}
              category={article.category}
              categoryKey={article.categoryKey}
              readTime={article.readTime}
              date={article.date}
              url="#articles"
            />
          </div>

          {/* 2. Featured Step-by-step Guide */}
          <div className="useful-today-col">
            <GuideCard
              title={guide.title}
              category={guide.category}
              categoryKey={guide.categoryKey}
              stepsCount={guide.stepsCount}
              timeEstimate={guide.timeEstimate}
              date={guide.date}
              slug="#useful-today"
            />
          </div>

          {/* 3. Featured Tool */}
          <div className="useful-today-col">
            <ToolCard
              title={tool.title}
              description={tool.description}
              category={tool.category}
              categoryKey={tool.categoryKey}
              badge={tool.badge}
              toolioPath={tool.url}
              actionText={tool.actionText}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
