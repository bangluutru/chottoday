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
    <section className="section useful-today-section" id="useful-today" aria-labelledby="useful-today-heading">
      <div className="container">
        {/* Section Header with 'Xem tất cả →' */}
        <div className="section-head-bar">
          <div className="section-head-left">
            <h2 id="useful-today-heading" className="section-title-with-icon">
              <span className="section-icon-emoji" role="img" aria-label="Sao">⭐</span>
              <span>Hôm nay có gì hữu ích?</span>
            </h2>
            <p className="section-desc-subtle">
              Hai bài viết cẩm nang giải thích rõ ngọn ngành và một công cụ thực hành xử lý ngay.
            </p>
          </div>
          <Link to="/articles" className="section-link-more">
            <span>Xem tất cả</span>
            <ArrowRightIcon size={14} />
          </Link>
        </div>

        {/* 3 Visual Cards: Article, Article, Tool */}
        <div className="useful-today-grid">
          {/* Card 1: Article Salary 30 Man */}
          <div className="useful-today-col">
            <Link
              to={`/articles/${articleSalary30Man.slug}`}
              className="useful-visual-card"
            >
              <div className="useful-card-media">
                <img
                  src="/images/featured/salary-30man.jpg"
                  alt="Bảng tính lương 30 man tại Nhật Bản"
                  className="useful-card-img"
                  loading="lazy"
                  width="400"
                  height="220"
                />
                <span className="useful-card-chip chip-work-pill">Việc làm &amp; tiền</span>
              </div>
              <div className="useful-card-body">
                <h3 className="useful-card-title">{articleSalary30Man.title}</h3>
                <p className="useful-card-excerpt">{articleSalary30Man.excerpt}</p>
                <div className="useful-card-foot">
                  <span className="useful-card-meta">
                    <ClockIcon size={13} />
                    <span>{articleSalary30Man.readingTime} phút đọc · 17/09/2026</span>
                  </span>
                  <span className="useful-card-arrow">
                    <ArrowRightIcon size={15} />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Card 2: Article Lost Zairyu Card */}
          <div className="useful-today-col">
            <Link
              to={`/articles/${articleLostZairyu.slug}`}
              className="useful-visual-card"
            >
              <div className="useful-card-media">
                <img
                  src="/images/featured/zairyu-card.jpg"
                  alt="Thẻ lưu trú Zairyu Card tại Nhật"
                  className="useful-card-img"
                  loading="lazy"
                  width="400"
                  height="220"
                />
                <span className="useful-card-chip chip-doc-pill">Giấy tờ &amp; hành chính</span>
              </div>
              <div className="useful-card-body">
                <h3 className="useful-card-title">{articleLostZairyu.title}</h3>
                <p className="useful-card-excerpt">{articleLostZairyu.excerpt}</p>
                <div className="useful-card-foot">
                  <span className="useful-card-meta">
                    <ClockIcon size={13} />
                    <span>{articleLostZairyu.readingTime} phút đọc · 17/09/2026</span>
                  </span>
                  <span className="useful-card-arrow">
                    <ArrowRightIcon size={15} />
                  </span>
                </div>
              </div>
            </Link>
          </div>

          {/* Card 3: Tool Recommendation (Toolio Nenkin) */}
          {nenkinTool && nenkinUrl && (
            <div className="useful-today-col">
              <a
                href={nenkinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="useful-visual-card useful-tool-featured-card"
              >
                <div className="useful-card-media">
                  <img
                    src="/images/featured/nenkin-tool.jpg"
                    alt="Công cụ tính lương hưu Nenkin"
                    className="useful-card-img"
                    loading="lazy"
                    width="400"
                    height="220"
                  />
                  <span className="useful-card-chip chip-tool-pill">Công cụ</span>
                </div>
                <div className="useful-card-body">
                  <h3 className="useful-card-title">Tính Nênkin của bạn</h3>
                  <p className="useful-card-excerpt">
                    Ước tính số tiền lương hưu hoặc tiền rút bảo hiểm Nenkin một lần khi về nước chính xác theo quy định 2026.
                  </p>
                  <div className="useful-tool-action-wrap">
                    <div className="useful-tool-cta-btn">
                      <span>Dùng ngay</span>
                      <ExternalLinkIcon size={14} />
                    </div>
                    <div className="useful-tool-trust-pill">
                      <ShieldCheckIcon size={13} />
                      <span>Miễn phí · Bảo mật</span>
                    </div>
                  </div>
                </div>
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

