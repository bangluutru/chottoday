import React from 'react';
import { Link } from 'react-router-dom';
import './CategoryGrid.css';
import { getHomeCategories } from '../../content/categories/categoryMap';

/**
 * "Khám phá theo chủ đề" — the seven homepage topic cards.
 *
 * Order, labels and taglines come from the category records' `home*` fields,
 * so adding or reordering a card is a data change, not a markup change.
 */
export function CategoryGrid() {
  const categories = getHomeCategories();

  return (
    <div className="category-grid" role="list" aria-label="Danh sách chủ đề chính">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          id={`category-${cat.id}`}
          to={cat.path}
          role="listitem"
          className={`category-card cat-tint-${cat.homePalette || cat.colorKey}`}
          aria-label={`Chủ đề ${cat.name}`}
        >
          <img src={cat.homeIcon || cat.icon} alt="" className="category-icon-img" width="30" height="30" />
          <span className="category-name">{cat.homeLabel || cat.name}</span>
          <span className="category-tagline">{cat.homeTagline || cat.description}</span>
        </Link>
      ))}
    </div>
  );
}
