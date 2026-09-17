import React from 'react';
import { Link } from 'react-router-dom';
import './NeedHelp.css';
import { USER_PROBLEMS } from '../../content/problems/problemsList';
import { ArrowRightIcon, ExternalLinkIcon } from '../common/Icons';
import { getToolById, buildToolUrl } from '../../services/toolRegistry';

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
          {USER_PROBLEMS.map((prob) => {
            const tool = prob.recommendedToolId ? getToolById(prob.recommendedToolId) : null;
            const toolUrl = tool ? buildToolUrl(tool.id, { source: 'problem' }) : null;

            return (
              <div
                key={prob.id}
                className={`chotto-card card-${prob.categoryKey} problem-card`}
              >
                <h3 className="problem-card-question">
                  {prob.statement}
                </h3>

                <p className="text-body problem-card-detail">
                  {prob.detail}
                </p>

                <div className="problem-card-action-group">
                  {prob.recommendedArticle && (
                    <Link
                      to={`/articles/${prob.recommendedArticle.slug}`}
                      className="problem-card-action problem-card-article-action"
                    >
                      <span>Bài viết: {prob.recommendedArticle.title}</span>
                      <ArrowRightIcon size={13} />
                    </Link>
                  )}

                  {tool && toolUrl && (
                    <a
                      href={toolUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="problem-card-action problem-card-tool-action"
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
    </section>
  );
}
