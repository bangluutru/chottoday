import React from 'react';
import { SELECTED_TOOLS } from '../../data/toolsMock';
import { ToolCard } from '../cards/ToolCard';
import { ExternalLinkIcon, ShieldCheckIcon } from '../common/Icons';

export function ToolShowcase() {
  return (
    <section className="section" id="tools" aria-labelledby="tools-heading">
      <div className="container">
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            marginBottom: '20px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>
            <div
              className="text-caption"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '6px',
                color: 'var(--text-muted)',
              }}
            >
              Tiện ích tương tác
            </div>
            <h2 id="tools-heading" className="text-h2">
              Một chút công cụ
            </h2>
          </div>

          <a
            href="https://tools.chottoday.com"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ height: '40px', fontSize: '14px' }}
          >
            <span>Khám phá toàn bộ Toolio</span>
            <ExternalLinkIcon size={14} style={{ marginLeft: '6px' }} />
          </a>
        </div>

        {/* Subtle Privacy Assurance Note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '24px',
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'var(--text-secondary)',
          }}
        >
          <ShieldCheckIcon size={16} color="var(--cat-life-text)" />
          <span>
            Xử lý trực tiếp trên trình duyệt — tệp tin và dữ liệu cá nhân không bao giờ tải lên máy chủ.
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '20px',
          }}
        >
          {SELECTED_TOOLS.map((tool) => (
            <div key={tool.id} style={{ display: 'flex' }}>
              <ToolCard tool={tool} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
