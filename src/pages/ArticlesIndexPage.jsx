import React, { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import './ArticlesIndexPage.css';
import { getAllArticles } from '../content/articles/index.js';
import { getAllCategories, getCategoryById } from '../content/categories/categoryMap.js';
import { HOME_ARTICLE_CARDS, HOME_INTEREST_SLUGS } from '../data/homepage.js';
import { PageMeta } from '../components/common/PageMeta.jsx';
import { Breadcrumb } from '../components/common/Breadcrumb.jsx';
import { formatDate } from '../utils/formatDate.js';

const PAGE_SIZE = 6;
const ALL = 'all';

const SORTS = [
  { key: 'new', label: 'Mới nhất' },
  { key: 'hot', label: 'Đọc nhiều' },
  { key: 'short', label: 'Đọc nhanh' },
];

/**
 * "Đọc nhiều" ordering.
 *
 * There is no analytics backend, so rather than print invented view counts the
 * page reuses the editorially ranked interest list the homepage already
 * carries. Articles on that list come first in its order; everything else
 * follows by date.
 */
const INTEREST_RANK = new Map(HOME_INTEREST_SLUGS.map((slug, index) => [slug, index]));

/**
 * Cover art.
 *
 * Most records still share one placeholder `coverImage`, which makes a grid of
 * them look like a mistake. The homepage already carries curated per-article
 * imagery, so the list reuses it and falls back to the record's own cover.
 */
const CARD_IMAGE = new Map(HOME_ARTICLE_CARDS.map((card) => [card.slug, card.image]));

function coverFor(article) {
  return CARD_IMAGE.get(article.slug) || article.coverImage;
}

function sortArticles(list, sort) {
  const byDate = (a, b) =>
    (b.updatedAt || b.publishedAt || '').localeCompare(a.updatedAt || a.publishedAt || '');

  if (sort === 'short') {
    return [...list].sort((a, b) => (a.readingTime || 0) - (b.readingTime || 0) || byDate(a, b));
  }
  if (sort === 'hot') {
    return [...list].sort((a, b) => {
      const ra = INTEREST_RANK.has(a.slug) ? INTEREST_RANK.get(a.slug) : Number.MAX_SAFE_INTEGER;
      const rb = INTEREST_RANK.has(b.slug) ? INTEREST_RANK.get(b.slug) : Number.MAX_SAFE_INTEGER;
      return ra - rb || byDate(a, b);
    });
  }
  return [...list].sort(byDate);
}

export function ArticlesIndexPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const categories = getAllCategories();
  // Lists every article the index has always listed, review drafts included;
  // only the sitemap is restricted to published ones.
  const articles = getAllArticles();

  // Filter, sort and page live in the query string so a filtered view can be
  // shared and reloaded. None of them is a free-text query, so nothing
  // sensitive ends up in the URL.
  const catParam = searchParams.get('cat') || ALL;
  const activeCategory = catParam !== ALL && getCategoryById(catParam) ? catParam : ALL;
  const sortParam = searchParams.get('sort') || 'new';
  const activeSort = SORTS.some((s) => s.key === sortParam) ? sortParam : 'new';
  const pageParam = Number.parseInt(searchParams.get('page') || '1', 10);

  const filtered = useMemo(() => {
    const list =
      activeCategory === ALL
        ? articles
        : articles.filter((a) => a.category === activeCategory);
    return sortArticles(list, activeSort);
  }, [articles, activeCategory, activeSort]);

  // The featured article is pulled out of the paginated list whenever the
  // featured card can appear, so it is never shown twice — and pagination
  // stays stable when you move off page 1.
  const featured =
    HOME_INTEREST_SLUGS.map((slug) => articles.find((a) => a.slug === slug)).find(Boolean) ||
    null;
  const featuredEligible = activeCategory === ALL && Boolean(featured);
  const gridList = featuredEligible
    ? filtered.filter((a) => a.slug !== featured.slug)
    : filtered;

  const pageCount = Math.max(1, Math.ceil(gridList.length / PAGE_SIZE));
  const page = Math.min(Math.max(Number.isNaN(pageParam) ? 1 : pageParam, 1), pageCount);
  const shown = gridList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // A page number past the end (a stale link, or the filter shrank) is rewritten
  // rather than rendering an empty grid.
  useEffect(() => {
    if (!Number.isNaN(pageParam) && pageParam !== page) {
      const next = new URLSearchParams(searchParams);
      if (page === 1) next.delete('page');
      else next.set('page', String(page));
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageParam, page]);

  const update = (changes) => {
    const next = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(changes)) {
      if (value === null) next.delete(key);
      else next.set(key, value);
    }
    setSearchParams(next);
  };

  const showFeatured = featuredEligible && page === 1;
  const featuredCategory = featured ? getCategoryById(featured.category) : null;

  return (
    <div className="articles-page">
      <PageMeta
        title="Tất cả bài viết & hướng dẫn"
        description="Hướng dẫn và kinh nghiệm sống ở Nhật, viết theo thứ tự việc cần làm. Mỗi bài đều ghi rõ ngày cập nhật gần nhất."
        canonical="/articles"
      />

      <div className="container articles-breadcrumb-row">
        <Breadcrumb
          label="Đường dẫn bài viết"
          items={[{ label: 'Trang chủ', to: '/' }, { label: 'Bài viết' }]}
        />
      </div>

      {/* HEADER */}
      <section className="articles-head-section">
        <div className="container articles-head">
          <div className="articles-head-main">
            <h1 className="articles-title">
              Tất cả <span className="articles-title-accent">bài viết</span>
            </h1>
            <p className="articles-desc">
              Hướng dẫn và kinh nghiệm sống ở Nhật, viết theo thứ tự việc cần làm. Mỗi bài
              đều ghi rõ ngày cập nhật gần nhất.
            </p>
          </div>
          <p className="articles-note">
            Đọc một chút mỗi ngày
            <br />
            là đủ ☺
          </p>
        </div>
      </section>

      {/* CONTROLS */}
      <section className="articles-controls-section">
        <div className="container">
          <div className="articles-controls">
            <div className="articles-chips" role="group" aria-label="Lọc bài viết theo chủ đề">
              <button
                type="button"
                className={`articles-chip ${activeCategory === ALL ? 'active' : ''}`}
                aria-pressed={activeCategory === ALL}
                onClick={() => update({ cat: null, page: null })}
              >
                Tất cả
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`articles-chip ${activeCategory === category.id ? 'active' : ''}`}
                  aria-pressed={activeCategory === category.id}
                  onClick={() => update({ cat: category.id, page: null })}
                >
                  {category.shortName}
                </button>
              ))}
            </div>

            <div className="articles-controls-right">
              <span className="articles-count">{filtered.length} bài viết</span>
              <div className="articles-sort" role="group" aria-label="Sắp xếp bài viết">
                {SORTS.map((sort) => (
                  <button
                    key={sort.key}
                    type="button"
                    className={`articles-sort-btn ${activeSort === sort.key ? 'active' : ''}`}
                    aria-pressed={activeSort === sort.key}
                    onClick={() => update({ sort: sort.key, page: null })}
                  >
                    {sort.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED */}
      {showFeatured && (
        <section className="articles-featured-section">
          <div className="container">
            <Link to={`/articles/${featured.slug}`} className="articles-featured">
              <div
                className="articles-featured-media"
                role="img"
                aria-label={featured.title}
                style={{ backgroundImage: `url(${coverFor(featured)})` }}
              />
              <div className="articles-featured-body">
                <div className="articles-featured-badges">
                  <span className="articles-featured-badge">Bài nổi bật</span>
                  {featuredCategory && (
                    <span
                      className={`chotto-chip chip-${featuredCategory.colorKey} articles-card-chip`}
                    >
                      {featuredCategory.shortName}
                    </span>
                  )}
                </div>
                <h2 className="articles-featured-title">{featured.title}</h2>
                <p className="articles-featured-desc">{featured.excerpt}</p>
                <div className="articles-featured-meta">
                  <span>{featured.readingTime} phút đọc</span>
                  <span className="articles-meta-sep" aria-hidden="true">
                    •
                  </span>
                  <span>Cập nhật {formatDate(featured.updatedAt || featured.publishedAt)}</span>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* GRID */}
      <section className="articles-grid-section">
        <div className="container">
          {shown.length > 0 ? (
            <div className="articles-grid">
              {shown.map((article) => {
                const category = getCategoryById(article.category);
                return (
                  <Link
                    key={article.slug}
                    to={`/articles/${article.slug}`}
                    className="articles-card"
                  >
                    <div
                      className="articles-card-media"
                      role="img"
                      aria-label={article.title}
                      style={{ backgroundImage: `url(${coverFor(article)})` }}
                    />
                    <div className="articles-card-body">
                      {category && (
                        <span
                          className={`chotto-chip chip-${category.colorKey} articles-card-chip`}
                        >
                          {category.shortName}
                        </span>
                      )}
                      <h3 className="articles-card-title">{article.title}</h3>
                      <p className="articles-card-desc">{article.excerpt}</p>
                      <div className="articles-card-meta">
                        {/* Each cluster is nowrap and carries its own leading
                            dot, so a bullet never lands alone at a line end. */}
                        <span className="articles-meta-part">{article.readingTime} phút đọc</span>
                        <span className="articles-meta-part">
                          <span className="articles-meta-sep" aria-hidden="true">
                            •
                          </span>{' '}
                          {formatDate(article.updatedAt || article.publishedAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="articles-empty">
              <p className="articles-empty-title">Chưa có bài nào khớp…</p>
              <p className="articles-empty-desc">
                Thử bỏ bộ lọc chủ đề, hoặc gửi câu hỏi để Chotto viết bài bạn cần.
              </p>
              <Link to="/about#lien-he" className="articles-empty-btn">
                Gửi yêu cầu chủ đề
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* PAGINATION */}
      {pageCount > 1 && (
        <section className="articles-pagination-section">
          <nav className="container articles-pagination" aria-label="Phân trang bài viết">
            <button
              type="button"
              className="articles-page-arrow"
              aria-label="Trang trước"
              disabled={page === 1}
              onClick={() => update({ page: String(Math.max(1, page - 1)) })}
            >
              ‹
            </button>
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                type="button"
                className={`articles-page-btn ${n === page ? 'active' : ''}`}
                aria-current={n === page ? 'page' : undefined}
                aria-label={`Trang ${n}`}
                onClick={() => update({ page: String(n) })}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              className="articles-page-arrow"
              aria-label="Trang sau"
              disabled={page === pageCount}
              onClick={() => update({ page: String(Math.min(pageCount, page + 1)) })}
            >
              ›
            </button>
          </nav>
        </section>
      )}
    </div>
  );
}

export default ArticlesIndexPage;
