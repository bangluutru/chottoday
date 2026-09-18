import React from 'react';
import { Link } from 'react-router-dom';
import './Breadcrumb.css';

/**
 * The 12.5px breadcrumb row every inner page opens with.
 *
 * @param {Object} props
 * @param {{label: string, to?: string}[]} props.items
 *        The trail, root first. The last item is rendered as the current page;
 *        any item without a `to` renders as plain text.
 * @param {string} [props.label] Accessible name for the nav landmark.
 */
export function Breadcrumb({ items = [], label = 'Đường dẫn' }) {
  if (items.length === 0) return null;

  return (
    <nav className="chotto-breadcrumb" aria-label={label}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={`${item.label}-${index}`}>
            {index > 0 && (
              <span className="chotto-breadcrumb-sep" aria-hidden="true">
                /
              </span>
            )}
            {item.to && !isLast ? (
              <Link to={item.to} className="chotto-breadcrumb-link">
                {item.label}
              </Link>
            ) : (
              <span
                className={isLast ? 'chotto-breadcrumb-current' : 'chotto-breadcrumb-link'}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export default Breadcrumb;
