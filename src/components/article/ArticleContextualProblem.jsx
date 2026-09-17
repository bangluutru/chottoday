import React from 'react';
import { Link } from 'react-router-dom';
import './ArticleContextualProblem.css';
import { USER_PROBLEMS } from '../../content/problems/problemsList.js';
import { ArrowRightIcon, ExternalLinkIcon } from '../common/Icons.jsx';
import { getToolById, buildToolUrl } from '../../services/toolRegistry/index.js';
import { trackEvent } from '../../services/analytics/index.js';

export function ArticleContextualProblem({ article }) {
  if (!article) return null;

  // Find problems directly matching this article's slug or category
  const matchingProblems = USER_PROBLEMS.filter(
    (p) => p.recommendedArticle?.slug === article.slug || p.categoryKey === article.category
  ).slice(0, 1);

  if (matchingProblems.length === 0) return null;

  const problem = matchingProblems[0];
  const tool = problem.recommendedToolId ? getToolById(problem.recommendedToolId) : null;
  const toolUrl = tool ? buildToolUrl(tool.id, { source: 'article' }) : null;

  return (
    <section className="article-contextual-box" aria-labelledby="contextual-problem-title">
      <div className="contextual-problem-badge">Tình huống thực tế liên quan</div>
      <h3 id="contextual-problem-title" className="contextual-problem-heading">
        {problem.statement}
      </h3>
      <p className="contextual-problem-detail">
        {problem.detail}
      </p>

      <div className="contextual-problem-actions">
        {tool && toolUrl && (
          <a
            href={toolUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="contextual-tool-link"
            onClick={() =>
              trackEvent('toolio_open', {
                toolId: tool.id,
                source: 'article_contextual',
              })
            }
          >
            <span>Dùng công cụ: {tool.name}</span>
            <ExternalLinkIcon size={13} />
          </a>
        )}
        <Link to="/problems" className="contextual-all-problems-link">
          <span>Xem các tình huống khác</span>
          <ArrowRightIcon size={13} />
        </Link>
      </div>
    </section>
  );
}
