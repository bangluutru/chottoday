import React from 'react';
import { Link } from 'react-router-dom';
import './UsefulToday.css';
import { articleSalary30Man } from '../../content/articles/salary-30man';
import { articleLostZairyu } from '../../content/articles/lost-zairyu';
import { getToolioUrl } from '../../config/constants';
import { ClockIcon, ArrowRightIcon, ExternalLinkIcon, ShieldCheckIcon } from '../common/Icons';

export function UsefulToday() {
  return (
    <section className="section" id="useful-today" aria-labelledby="useful-today-heading">
      <div className="container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow">
            Tuyển chọn hôm nay
          </div>
          <h2 id="useful-today-heading" className="text-h2">
            Hôm nay có gì hữu ích?
          </h2>
          <p className="text-body">
            Hai bài viết cẩm nang giải thích rõ ngọn ngành và một công cụ thực hành xử lý ngay.
          </p>
        </div>

        {/* 3 Featured Items Grid: ARTICLE, ARTICLE, TOOL */}
        <div className="useful-today-grid">
          {/* Card 1: Article 30 Man */}
          <div className="useful-today-col">
            <Link
              to={`/articles/${articleSalary30Man.slug}`}
              className="chotto-card card-work"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                height: '100%',
                textDecoration: 'none',
                color: 'var(--text-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="chotto-chip chip-work">BÀI VIẾT</span>
                <span className="text-caption">{articleSalary30Man.updatedAt}</span>
              </div>
              <h3 className="card-title">{articleSalary30Man.title}</h3>
              <p className="card-excerpt">{articleSalary30Man.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ClockIcon size={13} />
                  <span>{articleSalary30Man.readingTime} phút đọc</span>
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>Đọc bài</span>
                  <ArrowRightIcon size={14} />
                </span>
              </div>
            </Link>
          </div>

          {/* Card 2: Article Lost Zairyu */}
          <div className="useful-today-col">
            <Link
              to={`/articles/${articleLostZairyu.slug}`}
              className="chotto-card card-doc"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                height: '100%',
                textDecoration: 'none',
                color: 'var(--text-primary)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="chotto-chip chip-doc">BÀI VIẾT</span>
                <span className="text-caption">{articleLostZairyu.updatedAt}</span>
              </div>
              <h3 className="card-title">{articleLostZairyu.title}</h3>
              <p className="card-excerpt">{articleLostZairyu.excerpt}</p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ClockIcon size={13} />
                  <span>{articleLostZairyu.readingTime} phút đọc</span>
                </span>
                <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>Đọc bài</span>
                  <ArrowRightIcon size={14} />
                </span>
              </div>
            </Link>
          </div>

          {/* Card 3: Tool Recommendation (Toolio) */}
          <div className="useful-today-col">
            <a
              href={getToolioUrl('/#/japan-nenkin-guide')}
              target="_blank"
              rel="noopener noreferrer"
              className="chotto-card card-tool"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                height: '100%',
                textDecoration: 'none',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--cat-tool-bg)',
                borderColor: 'var(--cat-tool-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span className="chotto-chip chip-tool" style={{ backgroundColor: 'var(--surface-card)', borderColor: 'var(--cat-tool-border)', color: 'var(--cat-tool-text)' }}>
                  CÔNG CỤ THỰC HÀNH
                </span>
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cat-tool-text)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheckIcon size={13} />
                  <span>Chạy trên máy bạn</span>
                </span>
              </div>
              <h3 className="card-title" style={{ color: 'var(--text-primary)' }}>
                Tính tiền Nenkin rút 1 lần (Lump-sum)
              </h3>
              <p className="card-excerpt" style={{ color: 'var(--text-secondary)' }}>
                Ước tính số tiền nhận lại sau khi rời Nhật Bản theo số tháng đóng và hướng dẫn xin lại 20.42% tiền thuế khấu trừ.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--cat-tool-border)' }}>
                <span style={{ fontSize: '13px', color: 'var(--cat-tool-text)', fontWeight: 600 }}>
                  Mở trên Toolio
                </span>
                <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <span>Dùng ngay</span>
                  <ExternalLinkIcon size={14} />
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
