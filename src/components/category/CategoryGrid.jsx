import React from 'react';
import './CategoryGrid.css';
import { CATEGORIES } from '../../data/categories';

export function CategoryGrid({ onSelectCategory }) {
  return (
    <div className="category-grid" role="list" aria-label="Danh sách 6 chủ đề chính">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          type="button"
          className="category-card"
          onClick={() => onSelectCategory && onSelectCategory(cat.id)}
          aria-label={`Chủ đề ${cat.name}, ${cat.itemCount} mục`}
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
            <span
              className="category-indicator-dot"
              style={{ backgroundColor: cat.accentColor }}
            />
            <span>{cat.itemCount} nội dung</span>
          </div>
        </button>
      ))}
    </div>
  );
}
