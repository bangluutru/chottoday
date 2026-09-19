import React from 'react';
import { Link } from 'react-router-dom';
import './TopicsIndexPage.css';
import { PageMeta } from '../components/common/PageMeta';
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ArrowRightIcon } from '../components/common/Icons';
import { getAllCategories } from '../content/categories/categoryMap';
import { getAllArticles } from '../content/articles';

/**
 * Home-grid order first (the order the design shows), then any remaining
 * category. The design has seven topics; this repo routes nine, and a page
 * called "tất cả chủ đề" that hides two of them would be a dead end.
 */
function orderedCategories() {
  const all = getAllCategories();
  const onGrid = all
    .filter((c) => typeof c.homeOrder === 'number')
    .sort((a, b) => a.homeOrder - b.homeOrder);
  const rest = all.filter((c) => typeof c.homeOrder !== 'number');
  return [...onGrid, ...rest];
}

export function TopicsIndexPage() {
  const articles = getAllArticles();
  const categories = orderedCategories().map((category) => ({
    ...category,
    articleCount: articles.filter((a) => a.category === category.id).length,
    toolCount: (category.relatedToolIds || []).length,
    // "Tất cả" is the filter's own chip, not a subtopic.
    subTopics: (category.availableTags || []).filter((tag) => tag !== 'Tất cả').slice(0, 3),
  }));

  return (
    <div className="topics-page">
      <PageMeta
        title="Khám phá theo chủ đề"
        description="Những nhóm việc người Việt ở Nhật hay phải xử lý. Mỗi chủ đề gom cả bài hướng dẫn và công cụ tính toán liên quan."
        canonical="/topics"
      />

      <div className="container topics-breadcrumb-row">
        <Breadcrumb
          label="Đường dẫn chủ đề"
          items={[{ label: 'Trang chủ', to: '/' }, { label: 'Chủ đề' }]}
        />
      </div>

      {/* HEADER */}
      <section className="topics-head-section">
        <div className="container topics-head">
          <div className="topics-head-main">
            <h1 className="topics-title">
              Khám phá theo <span className="topics-title-accent">chủ đề</span>
            </h1>
            <p className="topics-desc">
              Những nhóm việc mà người Việt ở Nhật hay phải xử lý. Mỗi chủ đề gom cả bài
              hướng dẫn và công cụ tính toán liên quan.
            </p>
          </div>
          <p className="topics-note">
            Bắt đầu từ chủ đề
            <br />
            bạn đang cần nhất ☺
          </p>
        </div>
      </section>

      {/* GRID */}
      <section className="topics-grid-section">
        <div className="container">
          <div className="topics-grid">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className={`topic-card topic-card-${category.colorKey}`}
              >
                <div className="topic-card-head">
                  <span className="topic-card-icon">
                    <img src={category.icon} alt="" width="28" height="28" />
                  </span>
                  <span className="topic-card-heading">
                    <span className="topic-card-name">{category.name}</span>
                    <span className="topic-card-count">
                      {category.articleCount} bài viết · {category.toolCount} công cụ
                    </span>
                  </span>
                </div>

                <div className="topic-card-body">
                  <p className="topic-card-desc">{category.description}</p>
                  {category.subTopics.length > 0 && (
                    <div className="topic-card-tags">
                      {category.subTopics.map((tag) => (
                        <span key={tag} className="topic-card-tag">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                  <span className="topic-card-cta">
                    Xem chủ đề
                    <ArrowRightIcon size={14} />
                  </span>
                </div>
              </Link>
            ))}

            <div className="topic-cta-tile">
              <p className="topic-cta-note">
                Thiếu một chủ đề
                <br />
                bạn đang cần?
              </p>
              <p className="topic-cta-desc">
                Gửi cho Chotto biết vấn đề bạn đang gặp — chủ đề mới thường bắt đầu từ một
                câu hỏi của bạn đọc.
              </p>
              <Link to="/about#lien-he" className="topic-cta-btn">
                Gửi câu hỏi
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TopicsIndexPage;
