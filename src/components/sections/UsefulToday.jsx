import React from 'react';
import { Link } from 'react-router-dom';
import './UsefulToday.css';
import { articleSalary30Man } from '../../content/articles/salary-30man';
import { articleLostZairyu } from '../../content/articles/lost-zairyu';
import { getToolById, buildToolUrl } from '../../services/toolRegistry';
import { ClockIcon, ArrowRightIcon, ExternalLinkIcon, ShieldCheckIcon } from '../common/Icons';

export function UsefulToday() {
  const nenkinTool = getToolById('national-pension-jp');
  const nenkinUrl = nenkinTool ? buildToolUrl(nenkinTool.id, { source: 'homepage' }) : null;

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
              className="chotto-card card-work useful-today-card"
            >
              <div className="useful-today-meta-head">
                <span className="chotto-chip chip-work">BÀI VIẾT</span>
                <span className="text-caption">{articleSalary30Man.updatedAt}</span>
              </div>
              <h3 className="card-title">{articleSalary30Man.title}</h3>
              <p className="card-excerpt">{articleSalary30Man.excerpt}</p>
              <div className="useful-today-card-foot">
                <span className="useful-today-read-time">
                  <ClockIcon size={13} />
                  <span>{articleSalary30Man.readingTime} phút đọc</span>
                </span>
                <span className="useful-today-action-link">
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
              className="chotto-card card-doc useful-today-card"
            >
              <div className="useful-today-meta-head">
                <span className="chotto-chip chip-doc">BÀI VIẾT</span>
                <span className="text-caption">{articleLostZairyu.updatedAt}</span>
              </div>
              <h3 className="card-title">{articleLostZairyu.title}</h3>
              <p className="card-excerpt">{articleLostZairyu.excerpt}</p>
              <div className="useful-today-card-foot">
                <span className="useful-today-read-time">
                  <ClockIcon size={13} />
                  <span>{articleLostZairyu.readingTime} phút đọc</span>
                </span>
                <span className="useful-today-action-link">
                  <span>Đọc bài</span>
                  <ArrowRightIcon size={14} />
                </span>
              </div>
            </Link>
          </div>

          {/* Card 3: Tool Recommendation (Toolio) */}
          {nenkinTool && nenkinUrl && (
            <div className="useful-today-col">
              <a
                href={nenkinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="chotto-card card-tool useful-today-card useful-today-tool-card"
              >
                <div className="useful-today-meta-head">
                  <span className="chotto-chip chip-tool useful-today-tool-chip">
                    CÔNG CỤ THỰC HÀNH
                  </span>
                  <span className="useful-today-privacy-badge">
                    <ShieldCheckIcon size={13} />
                    <span>Chạy trên máy bạn</span>
                  </span>
                </div>
                <h3 className="card-title">
                  {nenkinTool.name}
                </h3>
                <p className="card-excerpt useful-today-tool-desc">
                  {nenkinTool.description}
                </p>
                <div className="useful-today-card-foot useful-today-tool-foot">
                  <span className="useful-today-tool-origin">
                    Mở trên Toolio
                  </span>
                  <span className="useful-today-action-link useful-today-tool-action">
                    <span>Dùng ngay</span>
                    <ExternalLinkIcon size={14} />
                  </span>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
