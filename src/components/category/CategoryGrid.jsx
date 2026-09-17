import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';
import { getAllCategories } from '../../content/categories/categoryMap';
import { getArticlesByCategory } from '../../content/articles';

export function CategoryGrid() {
  const categories = getAllCategories();

  return (
    <div className="category-grid" role="list" aria-label="Danh sách 6 chủ đề chính">
      {categories.map((cat) => {
        const articles = getArticlesByCategory(cat.id);
        const articleCount = articles.length;
        const countLabel = cat.id === 'tool'
          ? '8 công cụ'
          : `${articleCount > 0 ? articleCount : 'Mới'} bài viết`;

        return (
          <Link
            key={cat.id}
            id={`category-${cat.id}`}
            to={cat.path}
            className={`category-card category-card-${cat.colorKey}`}
            aria-label={`Chủ đề ${cat.name}`}
          >
            <div className={`category-icon-wrapper cat-icon-bg-${cat.colorKey}`}>
              <img
                src={cat.icon}
                alt=""
                className="category-icon-img"
                width="24"
                height="24"
              />
            </div>

            <h3 className="category-name">{cat.name}</h3>
            <span className="category-count-subtle">{countLabel}</span>
          </Link>
        );
      })}
    </div>
  );
}

