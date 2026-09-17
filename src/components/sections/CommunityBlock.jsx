import React from 'react';
import { FacebookIcon, ArrowRightIcon } from '../common/Icons';

export function CommunityBlock() {
  return (
    <section className="section" id="community" aria-labelledby="community-heading">
      <div className="container">
        <div
          className="chotto-card"
          style={{
            padding: '40px 32px',
            background: 'var(--surface-card)',
            border: '1px solid var(--border-card)',
            borderRadius: 'var(--radius-card)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            alignItems: 'center',
            gap: '32px',
          }}
        >
          <div>
            <div
              className="text-caption"
              style={{
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                marginBottom: '8px',
                color: 'var(--text-muted)',
              }}
            >
              Cộng đồng hỗ trợ
            </div>

            <h2
              id="community-heading"
              className="text-h2"
              style={{ marginBottom: '12px' }}
            >
              Gặp vấn đề chưa có lời giải?{'\n'}Hỏi Chotto trên Facebook.
            </h2>

            <p
              className="text-body"
              style={{ maxWidth: '520px', marginBottom: '20px' }}
            >
              Không ai biết hết mọi việc ở một đất nước mới. Chotto cùng cộng đồng người Việt lâu năm tại Nhật sẵn sàng lắng nghe và gợi ý hướng đi cho bạn.
            </p>

            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <FacebookIcon size={18} />
              <span>Tham gia Chotto Community</span>
              <ArrowRightIcon size={16} />
            </a>
          </div>

          <div
            style={{
              padding: '24px',
              backgroundColor: 'var(--surface-dim)',
              borderRadius: 'var(--radius-card)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ fontFamily: 'var(--font-heading)', fontSize: '18px', fontWeight: 700, marginBottom: '8px' }}>
              “Vấn đề nhỏ, có chỗ để hỏi.”
            </div>
            <p className="text-body" style={{ fontSize: '14px', lineHeight: '22px' }}>
              Mỗi câu hỏi của bạn là một gợi ý để đội ngũ Chotto hoàn thiện thêm những bài viết hướng dẫn và miniapps công cụ hữu ích cho cộng đồng.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
