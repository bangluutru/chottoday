import React from 'react';
import { Link } from 'react-router-dom';
import './NeedHelp.css';
import { USER_PROBLEMS } from '../../content/problems/problemsList';
import { ArrowRightIcon, ExternalLinkIcon } from '../common/Icons';

export function NeedHelp() {
  return (
    <section className="section" id="need-help" aria-labelledby="need-help-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            Tìm giải pháp theo tình huống
          </div>
          <h2 id="need-help-heading" className="text-h2">
            Có thể bạn đang cần
          </h2>
          <p className="text-body">
            Bắt đầu từ vấn đề thực tế của bạn bằng ngôn ngữ đời thường thay vì thuật ngữ hành chính phức tạp.
          </p>
        </div>

        {/* User-Problem Cards Grid */}
        <div className="problem-grid">
          {USER_PROBLEMS.map((prob) => (
            <div
              key={prob.id}
              className={`chotto-card card-${prob.categoryKey} problem-card`}
            >
              <h3 className="problem-card-question">
                {prob.statement}
              </h3>

              <p className="text-body" style={{ fontSize: '13px', lineHeight: '20px', marginBottom: '16px' }}>
                {prob.detail}
              </p>

              <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid var(--border-subtle)', paddingTop: '12px' }}>
                {prob.recommendedArticle && (
                  <Link
                    to={`/articles/${prob.recommendedArticle.slug}`}
                    className="problem-card-action"
                    style={{ fontSize: '13px', fontWeight: 600 }}
                  >
                    <span>Bài viết: {prob.recommendedArticle.title}</span>
                    <ArrowRightIcon size={13} />
                  </Link>
                )}

                {prob.recommendedTool && (
                  <a
                    href={prob.recommendedTool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="problem-card-action"
                    style={{ fontSize: '12px', color: 'var(--cat-tool-text)', fontWeight: 600 }}
                  >
                    <span>Công cụ: {prob.recommendedTool.name}</span>
                    <ExternalLinkIcon size={12} />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
