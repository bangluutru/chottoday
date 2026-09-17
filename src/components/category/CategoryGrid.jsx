import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';
import { getAllCategories } from '../../content/categories/categoryMap';
import { getArticlesByCategory } from '../../content/articles';
import { ArrowRightIcon } from '../common/Icons';

export function CategoryGrid() {
  const categories = getAllCategories();

  return (
    <div className="category-grid" role="list" aria-label="Danh sách 6 chủ đề chính">
      {categories.map((cat) => {
        const articleCount = getArticlesByCategory(cat.id).length;

        return (
          <Link
            key={cat.id}
            id={`category-${cat.id}`}
            to={cat.path}
            className="category-card"
            aria-label={`Chủ đề ${cat.name}`}
          >
            <div className="category-icon-wrapper">
              <img
                src={cat.icon}
                alt=""
                className="category-icon-img"
                width="28"
                height="28"
              />
            </div>

            <h3 className="category-name">{cat.name}</h3>
            <p className="category-desc">{cat.description}</p>

            <div className="category-count">
              <span className={`category-indicator-dot dot-${cat.colorKey}`} />
              <span>
                {articleCount > 0 ? `${articleCount} bài viết` : 'Công cụ thực hành'}
              </span>
              <ArrowRightIcon size={12} className="category-card-arrow" />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
