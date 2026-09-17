import React from 'react';
import './LatestContent.css';
import { LATEST_ARTICLES } from '../../data/articles';
import { ArticleCard } from '../cards/ArticleCard';
import { ArrowRightIcon } from '../common/Icons';

export function LatestContent() {
  return (
    <section className="section" id="articles" aria-labelledby="latest-heading">
      <div className="container">
        {/* Section Header */}
        <div className="latest-content-header">
          <div>
            <div className="section-eyebrow">
              Nội dung tuyển chọn
            </div>
            <h2 id="latest-heading" className="text-h2">
              Mới trên Chotto
            </h2>
            <p className="text-body">
              Bài viết thực tế, ngắn gọn, giải quyết các khúc mắc phổ biến khi sống tại Nhật.
            </p>
          </div>

          <a href="#articles" className="btn-secondary btn-sm">
            <span>Xem tất cả bài viết</span>
            <ArrowRightIcon size={14} className="icon-inline-right" />
          </a>
        </div>

        {/* 4 Articles Grid */}
        <div className="latest-grid">
          {LATEST_ARTICLES.map((article) => (
            <div key={article.id} className="latest-grid-item">
              <ArticleCard
                title={article.title}
                excerpt={article.excerpt}
                category={article.category}
                categoryKey={article.categoryKey}
                readTime={article.readTime}
                date={article.date}
                url={article.url}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
