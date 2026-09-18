import React, { useId, useState } from 'react';
import './FaqAccordion.css';

/**
 * Single-open FAQ accordion.
 *
 * Each question is a real <button> controlling its answer panel, so the list is
 * reachable by keyboard and announced correctly. Clicking the open question
 * closes it, matching the design's `+` / `−` affordance.
 *
 * @param {Object} props
 * @param {{q: string, a: string}[]} props.items
 * @param {number} [props.defaultOpen] Index open on first render; -1 for none.
 * @param {'lg'|'sm'} [props.size] Article-column (lg) or sidebar (sm) scale.
 */
export function FaqAccordion({ items = [], defaultOpen = -1, size = 'lg' }) {
  const [openIndex, setOpenIndex] = useState(defaultOpen);
  const baseId = useId();

  return (
    <div className={`faq-accordion faq-accordion-${size}`}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const panelId = `${baseId}-panel-${index}`;
        const buttonId = `${baseId}-button-${index}`;
        return (
          <div className="faq-item" key={item.q}>
            <button
              type="button"
              id={buttonId}
              className="faq-question"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
            >
              <span>{item.q}</span>
              <span className="faq-sign" aria-hidden="true">
                {isOpen ? '−' : '+'}
              </span>
            </button>
            {isOpen && (
              <div className="faq-answer" id={panelId} role="region" aria-labelledby={buttonId}>
                <p>{item.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FaqAccordion;
