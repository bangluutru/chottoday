import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';
import { getAllCategories } from '../content/categories/categoryMap';
import { getAllTools } from '../services/toolRegistry';
import { getPublishedArticles } from '../content/articles';
import { TOOLIO_BASE_URL } from '../config/constants';
import {
  ArrowRightIcon,
  ExternalLinkIcon,
  ShieldCheckIcon,
  SparklesIcon,
  WrenchIcon,
  UsersIcon,
} from '../components/common/Icons';
import { PageMeta } from '../components/common/PageMeta';

const SITE_URL = 'https://chottoday.com';

const PAGE_DESCRIPTION =
  'Chotto là nền tảng thông tin, cẩm nang hướng dẫn và cổng kết nối công cụ cho người Việt đang sinh sống, học tập và làm việc tại Nhật Bản.';

const PRINCIPLES = [
  {
    id: 'sourced',
    title: 'Có nguồn, có ngày cập nhật',
    body:
      'Mỗi bài hướng dẫn đều ghi rõ nguồn tham chiếu, ngày xuất bản và ngày cập nhật gần nhất, để bạn biết thông tin còn hiệu lực hay không.',
  },
  {
    id: 'scope',
    title: 'Có phạm vi áp dụng',
    body:
      'Thủ tục ở Nhật thay đổi theo tỉnh, theo tư cách lưu trú và theo thời điểm. Chotto nói rõ một hướng dẫn áp dụng cho ai, ở đâu, thay vì khẳng định chung chung.',
  },
  {
    id: 'no-advice',
    title: 'Cẩm nang tham khảo, không phải tư vấn pháp lý',
    body:
      'Nội dung trên Chotto mang tính chất cẩm nang tham khảo và không thay thế tư vấn pháp lý, thuế hay y tế chính thức từ cơ quan có thẩm quyền.',
  },
];

export function AboutPage() {
  const categories = getAllCategories();
  const toolCount = getAllTools().length;
  const articleCount = getPublishedArticles().length;

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'Về Chotto',
    description: PAGE_DESCRIPTION,
    url: `${SITE_URL}/about`,
    mainEntity: {
      '@type': 'Organization',
      name: 'Chotto',
      url: SITE_URL,
      description: PAGE_DESCRIPTION,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/chotto-logo-full.svg`,
      },
    },
  };

  return (
    <div className="about-page-wrapper">
      <PageMeta
        title="Về Chotto"
        description={PAGE_DESCRIPTION}
        canonical="/about"
        ogTitle="Về Chotto | Chotto"
        ogDescription={PAGE_DESCRIPTION}
        structuredData={structuredData}
      />

      <div className="container">
        {/* Breadcrumb */}
        <nav className="breadcrumb-nav" aria-label="Đường dẫn trang">
          <Link to="/" className="breadcrumb-link">
            Trang chủ
          </Link>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-current" aria-current="page">
            Về Chotto
          </span>
        </nav>

        {/* 1. Intro */}
        <header className="about-hero">
          <div className="section-eyebrow">Về Chotto</div>
          <h1 className="text-h1 about-hero-title">Vấn đề nhỏ, có chỗ để hỏi.</h1>
          <p className="about-hero-lead">
            Sống ở Nhật, phần lớn khó khăn không phải là chuyện lớn. Đó là một tờ giấy không hiểu,
            một cái hẹn ở shiyakusho, một dòng trừ lương không rõ vì sao. Chotto sinh ra cho đúng
            những việc “một chút” đó.
          </p>
          <p className="about-hero-lead">{PAGE_DESCRIPTION}</p>

          <div className="about-stat-row">
            <div className="about-stat">
              <span className="about-stat-number">{categories.length}</span>
              <span className="about-stat-label">nhóm chủ đề</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">{articleCount}</span>
              <span className="about-stat-label">bài hướng dẫn đã xuất bản</span>
            </div>
            <div className="about-stat">
              <span className="about-stat-number">{toolCount}</span>
              <span className="about-stat-label">công cụ kết nối</span>
            </div>
          </div>
        </header>

        {/* 2. Core principle */}
        <section className="about-principle-band" aria-labelledby="about-principle-heading">
          <SparklesIcon size={22} color="var(--cat-tool-text)" />
          <div>
            <h2 id="about-principle-heading" className="about-principle-title">
              Nội dung là điểm bắt đầu, công cụ là điểm kết thúc.
            </h2>
            <p className="about-principle-text">
              Một bài viết giải thích cho bạn hiểu chuyện gì đang xảy ra. Nhưng hiểu xong vẫn phải
              làm. Vì vậy mỗi hướng dẫn trên Chotto đều cố gắng kết thúc bằng một việc bạn làm được
              ngay: một biểu mẫu, một phép tính, một danh sách cần chuẩn bị.
            </p>
          </div>
        </section>

        {/* 3. What Chotto does */}
        <section className="about-section" aria-labelledby="about-what-heading">
          <h2 id="about-what-heading" className="about-section-title">
            Chotto làm gì
          </h2>

          <div className="about-value-grid">
            <article className="about-value-card">
              <span className="about-value-icon">
                <UsersIcon size={20} color="var(--cat-life-text)" />
              </span>
              <h3 className="about-value-title">Giải thích bằng tiếng Việt, theo tình huống</h3>
              <p className="about-value-text">
                Không dịch lại luật. Chotto bắt đầu từ tình huống bạn đang gặp — mất thẻ cư trú,
                lương thực nhận ít hơn dự tính, sắp chuyển nhà — rồi mới đi vào thủ tục.
              </p>
            </article>

            <article className="about-value-card">
              <span className="about-value-icon">
                <WrenchIcon size={20} color="var(--cat-tool-text)" />
              </span>
              <h3 className="about-value-title">Nối thẳng sang công cụ làm được việc</h3>
              <p className="about-value-text">
                Các miniapp trên Toolio giúp bạn tính thuế, tính bảo hiểm, tạo ảnh thẻ hay xử lý
                PDF ngay sau khi đọc xong, thay vì phải tự tìm công cụ khác.
              </p>
            </article>

            <article className="about-value-card">
              <span className="about-value-icon">
                <ShieldCheckIcon size={20} color="var(--cat-doc-text)" />
              </span>
              <h3 className="about-value-title">Giữ dữ liệu của bạn ở lại máy bạn</h3>
              <p className="about-value-text">
                Công cụ xử lý ngay trên trình duyệt. Từ khoá tìm kiếm chỉ tồn tại trong phiên làm
                việc, không ghi vào đường dẫn và không lưu lại sau khi bạn rời trang.
              </p>
            </article>
          </div>
        </section>

        {/* 4. Ecosystem */}
        <section className="about-section" aria-labelledby="about-ecosystem-heading">
          <h2 id="about-ecosystem-heading" className="about-section-title">
            Hệ sinh thái Chotto
          </h2>
          <p className="about-section-lead">
            Chotto tách làm hai phần độc lập, để phần nội dung và phần công cụ có thể phát triển
            riêng mà không kéo nhau chậm lại.
          </p>

          <div className="about-eco-grid">
            <div className="about-eco-card card-doc">
              <div className="about-eco-head">
                <h3 className="about-eco-name">chottoday.com</h3>
                <span className="chotto-chip chip-doc">Nội dung</span>
              </div>
              <p className="about-eco-text">
                Cẩm nang bài viết, hướng dẫn từng bước, {categories.length} nhóm chủ đề đời sống và
                tra cứu theo tình huống.
              </p>
              <Link to="/articles" className="about-eco-link">
                <span>Xem cẩm nang</span>
                <ArrowRightIcon size={14} />
              </Link>
            </div>

            <div className="about-eco-card card-tool">
              <div className="about-eco-head">
                <h3 className="about-eco-name">toolio.chottoday.com</h3>
                <span className="chotto-chip chip-tool">Công cụ</span>
              </div>
              <p className="about-eco-text">
                {toolCount} miniapp độc lập: tính thuế, bảo hiểm xã hội, ảnh thẻ chuẩn ICAO, hoá
                đơn, PDF và nhiều tiện ích khác.
              </p>
              <a
                href={TOOLIO_BASE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="about-eco-link"
              >
                <span>Mở Toolio</span>
                <ExternalLinkIcon size={13} />
              </a>
            </div>
          </div>
        </section>

        {/* 5. Topics */}
        <section className="about-section" aria-labelledby="about-topics-heading">
          <h2 id="about-topics-heading" className="about-section-title">
            {categories.length} nhóm chủ đề
          </h2>

          <div className="about-topic-grid" role="list">
            {categories.map((category) => (
              <Link
                key={category.id}
                to={category.path}
                className={`about-topic-card card-${category.colorKey}`}
                role="listitem"
              >
                <img
                  src={category.icon}
                  alt=""
                  className="about-topic-icon"
                  width="28"
                  height="28"
                />
                <span className="about-topic-name">{category.name}</span>
                <span className="about-topic-desc">{category.description}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* 6. Editorial principles */}
        <section className="about-section" aria-labelledby="about-trust-heading">
          <h2 id="about-trust-heading" className="about-section-title">
            Nguyên tắc biên tập
          </h2>

          <div className="about-principle-list">
            {PRINCIPLES.map((principle) => (
              <div key={principle.id} className="about-principle-item">
                <h3 className="about-principle-item-title">{principle.title}</h3>
                <p className="about-principle-item-text">{principle.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 7. Closing CTA */}
        <section className="about-cta-band" aria-labelledby="about-cta-heading">
          <h2 id="about-cta-heading" className="about-cta-title">
            Bắt đầu từ việc bạn đang cần
          </h2>
          <p className="about-cta-text">
            Đọc một hướng dẫn, hoặc mở thẳng công cụ. Cách nào cũng được — miễn là việc của bạn
            xong.
          </p>
          <div className="about-cta-actions">
            <Link to="/articles" className="btn-primary">
              <span>Xem cẩm nang</span>
            </Link>
            <Link to="/tools" className="btn-secondary">
              <span>Xem tất cả công cụ</span>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

export default AboutPage;
