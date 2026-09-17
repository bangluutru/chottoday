import React from 'react';
import { Link } from 'react-router-dom';
import './HomeContentColumns.css';
import { getToolsByIds, buildToolUrl } from '../../services/toolRegistry';
import { ClockIcon, ArrowRightIcon, ExternalLinkIcon } from '../common/Icons';

export function HomeContentColumns() {
  const tools = getToolsByIds([
    'japan-tax-simulator',
    'moving-cost-jp',
    'national-pension-jp',
    'id-photo-studio',
  ]);

  const latestArticles = [
    {
      slug: 'luong-30-man-thuc-nhan-bao-nhieu',
      title: 'Cách chuyển vùng và nạp tiền Suica, Pasmo trên điện thoại',
      category: 'Đời sống',
      categoryKey: 'life',
      thumb: '/images/thumbs/thumb-train.jpg',
      readingTime: 4,
      updatedAt: '16/09/2026',
    },
    {
      slug: 'mat-the-zairyu-thi-lam-gi',
      title: 'Thủ tục xin nhập học trường tiểu học cho con tại Nhật Bản',
      category: 'Học tập',
      categoryKey: 'study',
      thumb: '/images/thumbs/thumb-school.jpg',
      readingTime: 6,
      updatedAt: '14/09/2026',
    },
    {
      slug: 'luong-30-man-thuc-nhan-bao-nhieu',
      title: 'Đi khám bệnh lần đầu tại Nhật: từ vựng triệu chứng & quy trình',
      category: 'Sức khỏe',
      categoryKey: 'health',
      thumb: '/images/thumbs/thumb-clinic.jpg',
      readingTime: 5,
      updatedAt: '12/09/2026',
    },
  ];

  return (
    <section className="section home-columns-section" aria-label="Nội dung mới và Công cụ tiện ích">
      <div className="container">
        <div className="home-columns-grid">
          {/* Left Column: Mới trên Chotto */}
          <div className="home-column">
            <div className="column-head-bar">
              <h2 className="column-title">
                <span className="column-icon-emoji" role="img" aria-label="Nhà">🏠</span>
                <span>Mới trên Chotto</span>
              </h2>
              <Link to="/articles" className="column-link-more">
                <span>Xem tất cả</span>
                <ArrowRightIcon size={13} />
              </Link>
            </div>

            <div className="column-items-list" role="feed" aria-label="Bài viết mới trên Chotto">
              {latestArticles.map((art, idx) => (
                <Link
                  key={idx}
                  to={`/articles/${art.slug}`}
                  className="article-row-card"
                  aria-label={art.title}
                >
                  <img
                    src={art.thumb}
                    alt={art.title}
                    className="article-row-thumb"
                    loading="lazy"
                    width="96"
                    height="72"
                  />
                  <div className="article-row-content">
                    <div className="article-row-tag">
                      <span className={`article-tag-chip tag-${art.categoryKey}`}>
                        {art.category}
                      </span>
                    </div>
                    <h3 className="article-row-title">{art.title}</h3>
                    <div className="article-row-meta">
                      <ClockIcon size={12} />
                      <span>{art.readingTime} phút đọc · {art.updatedAt}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Right Column: Một chút công cụ */}
          <div className="home-column">
            <div className="column-head-bar">
              <h2 className="column-title">
                <span className="column-icon-emoji" role="img" aria-label="Cờ lê">🔧</span>
                <span>Một chút công cụ</span>
              </h2>
              <Link to="/topics/tools" className="column-link-more">
                <span>Xem tất cả</span>
                <ArrowRightIcon size={13} />
              </Link>
            </div>

            <div className="column-items-list" role="feed" aria-label="Công cụ tiện ích Toolio">
              {tools.map((tool) => {
                const toolUrl = buildToolUrl(tool.id, { source: 'homepage' });
                return (
                  <a
                    key={tool.id}
                    href={toolUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="tool-row-card"
                    aria-label={`Mở công cụ ${tool.name}`}
                  >
                    <div className="tool-row-info">
                      <h3 className="tool-row-title">{tool.name}</h3>
                      <p className="tool-row-desc">{tool.description}</p>
                    </div>
                    <div className="tool-row-btn">
                      <span>Dùng ngay</span>
                      <ExternalLinkIcon size={12} />
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
