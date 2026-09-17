import React from 'react';
import { Link } from 'react-router-dom';
import './DiscoveryQuickSummary.css';
import { ArrowRightIcon } from '../common/Icons';

export function DiscoveryQuickSummary({ summary }) {
  if (!summary || !summary.keyPoints || summary.keyPoints.length === 0) {
    return null;
  }

  return (
    <div className="discovery-summary-card" role="region" aria-label="Tóm tắt nhanh từ nội dung đã xác minh">
      <div className="discovery-summary-header">
        <div className="discovery-summary-badge">
          <span className="discovery-summary-dot" />
          <span>Tóm tắt nhanh cho bạn</span>
        </div>
        {summary.sourceArticle && (
          <Link
            to={`/articles/${summary.sourceArticle.slug}`}
            className="discovery-summary-source-link"
          >
            <span>Bài viết gốc</span>
            <ArrowRightIcon size={12} />
          </Link>
        )}
      </div>

      <h3 className="discovery-summary-headline">{summary.headline}</h3>

      <ul className="discovery-summary-list">
        {summary.keyPoints.map((point, idx) => (
          <li key={idx} className="discovery-summary-item">
            <span className="discovery-summary-bullet">•</span>
            <span className="discovery-summary-text">{point}</span>
          </li>
        ))}
      </ul>

      {summary.note && (
        <div className="discovery-summary-note">
          <span>💡</span>
          <span>{summary.note}</span>
        </div>
      )}

      {summary.sourceArticle && (
        <div className="discovery-summary-footer">
          <span>Trích xuất trực tiếp từ bài viết đã xác minh: </span>
          <Link
            to={`/articles/${summary.sourceArticle.slug}`}
            className="discovery-summary-article-title"
          >
            {summary.sourceArticle.title}
          </Link>
        </div>
      )}
    </div>
  );
}
