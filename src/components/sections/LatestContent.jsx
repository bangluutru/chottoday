import React from 'react';
import { Link } from 'react-router-dom';
import './LatestContent.css';
import { getAllArticles } from '../../content/articles';
import { ArrowRightIcon } from '../common/Icons';

export function LatestContent() {
  const latestArticles = getAllArticles().slice(0, 6);

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

          <Link to="/articles" className="btn-secondary btn-sm">
            <span>Xem tất cả bài viết</span>
            <ArrowRightIcon size={14} className="icon-inline-right" />
          </Link>
        </div>

        {/* Compact Editorial List */}
        <div className="latest-editorial-list" role="feed" aria-label="Danh sách bài viết mới nhất">
          {latestArticles.map((article) => {
            return (
              <Link
                key={article.slug}
                to={`/articles/${article.slug}`}
                className="latest-editorial-item"
                aria-label={`Đọc bài viết: ${article.title}`}
              >
                <div className="editorial-main-info">
                  <div className="editorial-cat-meta">
                    <span
                      className={`editorial-cat-dot cat-dot-${article.categoryKey || 'life'}`}
                      aria-hidden="true"
                    />
                    <span className="editorial-cat-name">{article.categoryLabel}</span>
                  </div>
                  <h3 className="editorial-title">{article.title}</h3>
                </div>

                <div className="editorial-secondary-meta">
                  <span className="editorial-meta-item">{article.readTime}</span>
                  <span className="editorial-meta-divider" aria-hidden="true">•</span>
                  <span className="editorial-meta-item">Cập nhật {article.updatedDate}</span>
                  <div className="editorial-action-icon" aria-hidden="true">
                    <ArrowRightIcon size={16} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
