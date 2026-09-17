import React from 'react';
import { PROBLEMS_NEED_HELP } from '../../data/problems';
import { ArrowRightIcon } from '../common/Icons';

export function NeedHelp() {
  return (
    <section className="section" id="need-help" aria-labelledby="need-help-heading">
      <div className="container">
        <div style={{ marginBottom: '24px' }}>
          <div
            className="text-caption"
            style={{
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '6px',
              color: 'var(--text-muted)',
            }}
          >
            Tình huống thực tế
          </div>
          <h2 id="need-help-heading" className="text-h2">
            Có thể bạn đang cần
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '16px',
          }}
        >
          {PROBLEMS_NEED_HELP.map((item) => (
            <div
              key={item.id}
              className={`chotto-card card-${item.categoryKey}`}
              style={{
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  className={`chotto-chip chip-${item.categoryKey}`}
                  style={{ marginBottom: '12px' }}
                >
                  {item.tag}
                </span>

                <h3
                  className="card-title"
                  style={{ fontSize: '17px', lineHeight: '24px', marginBottom: '14px' }}
                >
                  {item.question}
                </h3>
              </div>

              <a
                href={item.url}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: 'var(--font-body)',
                  fontSize: '14px',
                  fontWeight: 600,
                  color: 'var(--text-primary)',
                  marginTop: 'auto',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--border-subtle)',
                }}
              >
                <span>{item.linkText}</span>
                <ArrowRightIcon size={14} />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
