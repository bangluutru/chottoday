import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './SearchResultsPage.css';
import { PageMeta } from '../components/common/PageMeta';
import { ArrowRightIcon, SearchIcon } from '../components/common/Icons';
import { discover, setEphemeralQuery } from '../services/discovery/index.js';
import { removeDiacritics } from '../services/discovery/queryNormalizer.js';
import { getPublishedArticles } from '../content/articles';
import { getAllCategories } from '../content/categories/categoryMap';
import { buildToolUrl } from '../services/toolRegistry';
import { TOOL_CATALOGUE } from '../data/tools.js';
import { trackEvent } from '../services/analytics';
import { formatDate } from '../utils/formatDate';
import { DiscoveryQuickSummary } from '../components/search/DiscoveryQuickSummary';

const TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'article', label: 'Bài viết' },
  { id: 'tool', label: 'Công cụ' },
  { id: 'topic', label: 'Chủ đề' },
];

const SUGGESTIONS = [
  'nenkin',
  'lương thực nhận',
  'đổi bằng lái',
  'thuế thị dân',
  'nhà trẻ',
  'mất thẻ zairyu',
  'bảo hiểm y tế',
];

const KIND_LABEL = { article: 'Bài viết', tool: 'Công cụ', topic: 'Chủ đề' };
/** Catalogue icons, so a tool in /tools keeps the same glyph here. */
const TOOL_ICON_BY_ID = Object.fromEntries(
  TOOL_CATALOGUE.filter((entry) => entry.toolId).map((entry) => [entry.toolId, entry.icon])
);
const KIND_CHIP = { article: 'health', tool: 'tool', topic: 'study' };

/** URL sync is debounced so typing does not push a history entry per keystroke. */
const URL_SYNC_DELAY = 400;

/** Topic matches are a plain local filter — categories are not in the index. */
function matchCategories(query) {
  const needle = removeDiacritics(query.trim());
  if (!needle) return [];
  const published = getPublishedArticles();

  return getAllCategories()
    .filter((category) => {
      const haystack = removeDiacritics(
        `${category.name} ${category.shortName} ${category.description} ${(category.availableTags || []).join(' ')}`
      );
      return haystack.includes(needle);
    })
    .map((category) => ({
      kind: 'topic',
      key: `topic-${category.id}`,
      title: category.name,
      description: category.description,
      meta: (() => {
        const count = published.filter((a) => a.category === category.id).length;
        return count > 0 ? `${count} bài viết` : 'Chủ đề';
      })(),
      to: category.path,
      icon: category.icon,
    }));
}

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [tab, setTab] = useState('all');

  // Keep the shared ephemeral store in step so the rest of the app (the navbar
  // pill, /articles) sees the same query without reading it back off the URL.
  useEffect(() => {
    setEphemeralQuery(query);
  }, [query]);

  // Debounced ?q= sync. `replace` keeps the back button pointing at whatever
  // the visitor was reading before they started searching.
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = new URLSearchParams(window.location.search).get('q') || '';
      if (current === query) return;
      navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/search', {
        replace: true,
      });
    }, URL_SYNC_DELAY);
    return () => clearTimeout(timer);
  }, [query, navigate]);

  // A query arriving from elsewhere (a 404 page, a shared link, the navbar)
  // must land in the field even though the field owns the state afterwards.
  useEffect(() => {
    const fromUrl = searchParams.get('q') || '';
    setQuery((current) => (current === fromUrl ? current : fromUrl));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams.get('q')]);

  const trimmed = query.trim();
  const discovery = useMemo(() => (trimmed ? discover(trimmed) : null), [trimmed]);

  const allResults = useMemo(() => {
    if (!discovery) return [];

    const articles = discovery.results.articles.map((article) => ({
      kind: 'article',
      key: `article-${article.slug}`,
      title: article.title,
      description: article.excerpt,
      meta: [
        article.readingTime ? `${article.readingTime} phút đọc` : null,
        formatDate(article.updatedAt || article.publishedAt),
      ]
        .filter(Boolean)
        .join(' • '),
      to: `/articles/${article.slug}`,
      image: article.coverImage || null,
      icon: '/icons/icon-doc.svg',
    }));

    const tools = discovery.results.tools
      .map((tool) => {
        const url = buildToolUrl(tool.id, { source: 'search' });
        if (!url) return null;
        return {
          kind: 'tool',
          key: `tool-${tool.id}`,
          title: tool.name,
          description: tool.description,
          meta: 'Mở trong Toolio',
          href: url,
          icon: TOOL_ICON_BY_ID[tool.id] || '/icons/icon-tool.svg',
        };
      })
      .filter(Boolean);

    return [...articles, ...tools, ...matchCategories(trimmed)];
  }, [discovery, trimmed]);

  const counts = useMemo(
    () => ({
      all: allResults.length,
      article: allResults.filter((r) => r.kind === 'article').length,
      tool: allResults.filter((r) => r.kind === 'tool').length,
      topic: allResults.filter((r) => r.kind === 'topic').length,
    }),
    [allResults]
  );

  const visible = tab === 'all' ? allResults : allResults.filter((r) => r.kind === tab);

  // Analytics carries counts only — never the query itself (Phase 5 privacy).
  useEffect(() => {
    if (!trimmed) return;
    trackEvent('discovery_search', {
      resultCount: allResults.length,
      hasResults: allResults.length > 0,
      category: discovery?.intent?.category || 'all',
      source: 'search_page',
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmed, allResults.length]);

  const summary = trimmed
    ? `${counts.all} kết quả cho “${trimmed}”`
    : 'Nhập từ khoá để tìm bài viết, công cụ và chủ đề trên Chotto.';

  const published = getPublishedArticles();
  const topicFilters = getAllCategories()
    .map((category) => ({
      ...category,
      count: published.filter((a) => a.category === category.id).length,
    }))
    .filter((category) => category.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="search-page">
      {/* The query never reaches the title, the description or the canonical —
          only the bare /search URL is ever indexable. */}
      <PageMeta
        title="Tìm kiếm & khám phá"
        description="Tìm bài viết, công cụ và chủ đề trên Chotto: thuế, nenkin, thủ tục hành chính, nhà ở, sức khoẻ và cuộc sống tại Nhật."
        canonical="/search"
        robots="noindex, follow"
      />

      <section className="search-hero-section">
        <div className="container">
          <form
            className="search-pill"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/search', {
                replace: true,
              });
            }}
          >
            <SearchIcon size={20} className="search-pill-icon" />
            <input
              type="search"
              className="search-pill-input"
              aria-label="Tìm kiếm trên Chotto"
              placeholder="Bạn đang tìm gì? (ví dụ: nenkin, đổi bằng lái…)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoComplete="off"
            />
            {query.length > 0 && (
              <button
                type="button"
                className="search-pill-clear"
                aria-label="Xoá từ khoá"
                onClick={() => setQuery('')}
              >
                ×
              </button>
            )}
            <button type="submit" className="search-pill-submit">
              Tìm kiếm
            </button>
          </form>

          <p className="search-summary" aria-live="polite">
            {summary}
          </p>
        </div>
      </section>

      <section className="search-tabs-section">
        <div className="container">
          <div className="search-tabs" role="tablist" aria-label="Phân loại kết quả">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={`search-tab ${tab === item.id ? 'active' : ''}`}
                onClick={() => setTab(item.id)}
              >
                {item.label} ({counts[item.id]})
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="search-body-section">
        <div className="container search-body">
          <div className="search-results">
            {/* The grounded summary the discovery service derives from the top
                verified article. It moved here from /articles, which is now a
                browse page. */}
            {tab === 'all' && discovery?.summary && (
              <DiscoveryQuickSummary summary={discovery.summary} />
            )}

            {visible.map((result) => {
              const body = (
                <>
                  <div className={`search-result-thumb ${result.image ? '' : 'is-icon'}`}>
                    {result.image ? (
                      <img src={result.image} alt="" loading="lazy" />
                    ) : (
                      <img src={result.icon} alt="" width="34" height="34" />
                    )}
                  </div>
                  <div className="search-result-body">
                    <div className="search-result-metaline">
                      <span
                        className={`chotto-chip chip-${KIND_CHIP[result.kind]} search-result-kind`}
                      >
                        {KIND_LABEL[result.kind]}
                      </span>
                      <span className="search-result-meta">{result.meta}</span>
                    </div>
                    <div className="search-result-title">{result.title}</div>
                    <p className="search-result-desc">{result.description}</p>
                  </div>
                </>
              );

              return result.href ? (
                <a
                  key={result.key}
                  href={result.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="search-result"
                >
                  {body}
                </a>
              ) : (
                <Link key={result.key} to={result.to} className="search-result">
                  {body}
                </Link>
              );
            })}

            {visible.length === 0 && (
              <div className="search-empty">
                <p className="search-empty-title">
                  {trimmed ? 'Chotto chưa tìm thấy gì cả…' : 'Bạn đang tìm điều gì?'}
                </p>
                <p className="search-empty-desc">
                  {trimmed
                    ? 'Thử từ khoá ngắn hơn, hoặc cho Chotto biết bạn cần thông tin gì nhé.'
                    : 'Gõ một từ khoá ở ô trên, hoặc chọn một gợi ý bên cạnh để bắt đầu.'}
                </p>
                {trimmed && (
                  <Link to="/about#lien-he" className="search-empty-btn">
                    Gửi câu hỏi cho Chotto
                  </Link>
                )}
              </div>
            )}
          </div>

          <aside className="search-aside" aria-label="Gợi ý tìm kiếm">
            <div className="search-aside-card search-aside-card-panel">
              <h2 className="search-aside-title">Mọi người hay tìm</h2>
              <div className="search-suggestions">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    className="search-suggestion"
                    onClick={() => {
                      setQuery(suggestion);
                      setTab('all');
                    }}
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="search-aside-card">
              <h2 className="search-aside-title">Lọc theo chủ đề</h2>
              {topicFilters.map((category) => (
                <Link key={category.id} to={category.path} className="search-topic-row">
                  <span>{category.name}</span>
                  <span className="search-topic-count">{category.count}</span>
                </Link>
              ))}
            </div>

            <div className="search-aside-cta">
              <p className="search-aside-cta-note">
                Không tìm thấy điều
                <br />
                bạn cần? Hỏi Chotto nhé!
              </p>
              <Link to="/about#lien-he" className="search-aside-cta-btn">
                Đặt câu hỏi
                <ArrowRightIcon size={14} />
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default SearchResultsPage;
