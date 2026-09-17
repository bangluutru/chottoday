import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './ProblemDiscoveryPage.css';
import { USER_PROBLEMS, getProblemsByCategory } from '../content/problems/problemsList.js';
import { CATEGORY_BY_ID } from '../content/categories/categoryMap.js';
import { getToolById, buildToolUrl } from '../services/toolRegistry/index.js';
import { ArrowRightIcon, ExternalLinkIcon } from '../components/common/Icons.jsx';
import { PageMeta } from '../components/common/PageMeta.jsx';
import { trackEvent } from '../services/analytics/index.js';

export function ProblemDiscoveryPage() {
  const [activeCategory, setActiveCategory] = useState('all');

  const filterTabs = [
    { id: 'all', label: 'Tất cả tình huống' },
    { id: 'doc', label: 'Giấy tờ & cư trú' },
    { id: 'work', label: 'Việc làm & thuế' },
    { id: 'life', label: 'Đời sống & nhà ở' },
  ];

  const displayedProblems = getProblemsByCategory(activeCategory);

  const handleTabChange = (catId) => {
    setActiveCategory(catId);
    trackEvent('category_open', { category: catId, source: 'problems_page' });
  };

  return (
    <div className="problem-discovery-wrapper">
      <PageMeta
        title="Khám phá theo tình huống thực tế"
        description="Tổng hợp các tình huống thực tế người Việt thường gặp tại Nhật Bản: thủ tục giấy tờ, thuế, chuyển việc, thuê nhà và công cụ hỗ trợ liên quan."
        canonical="/problems"
        ogTitle="Khám phá theo tình huống — Chotto"
        ogDescription="Bắt đầu từ vấn đề thực tế của bạn bằng ngôn ngữ đời thường thay vì thuật ngữ hành chính phức tạp."
      />

      <div className="container">
        <header className="problem-discovery-header">
          <div className="section-eyebrow">Khám phá theo tình huống</div>
          <h1 className="text-h1 problem-discovery-h1">
            Bạn đang gặp phải tình huống nào?
          </h1>
          <p className="text-body problem-discovery-lead">
            Bắt đầu từ vấn đề thực tế của bạn bằng ngôn ngữ đời thường. Chotto kết nối bạn đến bài viết giải thích chi tiết và công cụ thực hành phù hợp.
          </p>
        </header>

        {/* Filter tabs */}
        <div className="problem-filter-tabs" role="tablist" aria-label="Lọc tình huống theo nhóm">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`problem-filter-btn ${activeCategory === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
              role="tab"
              aria-selected={activeCategory === tab.id}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Problem grid */}
        <div className="problem-discovery-grid" role="list">
          {displayedProblems.map((prob) => {
            const cat = CATEGORY_BY_ID[prob.categoryKey];
            const tool = prob.recommendedToolId ? getToolById(prob.recommendedToolId) : null;
            const toolUrl = tool ? buildToolUrl(tool.id, { source: 'problem' }) : null;

            return (
              <div
                key={prob.id}
                className={`problem-discovery-card card-${prob.categoryKey}`}
                role="listitem"
              >
                <div className="problem-card-top">
                  {cat && (
                    <span className={`chotto-chip chip-${cat.colorKey}`}>
                      {cat.shortName}
                    </span>
                  )}
                </div>

                <h2 className="problem-card-title">
                  {prob.statement}
                </h2>

                <p className="problem-card-detail-text">
                  {prob.detail}
                </p>

                <div className="problem-card-links">
                  {prob.recommendedArticle && (
                    <Link
                      to={`/articles/${prob.recommendedArticle.slug}`}
                      className="problem-action-article"
                      onClick={() =>
                        trackEvent('article_from_discovery', {
                          problemId: prob.id,
                          articleSlug: prob.recommendedArticle.slug,
                        })
                      }
                    >
                      <span>Bài viết: {prob.recommendedArticle.title}</span>
                      <ArrowRightIcon size={14} />
                    </Link>
                  )}

                  {tool && toolUrl && (
                    <a
                      href={toolUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="problem-action-tool"
                      onClick={() =>
                        trackEvent('toolio_open', {
                          toolId: tool.id,
                          source: 'problem_discovery',
                        })
                      }
                    >
                      <span>Công cụ: {tool.name}</span>
                      <ExternalLinkIcon size={12} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ProblemDiscoveryPage;
