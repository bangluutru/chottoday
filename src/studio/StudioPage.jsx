/**
 * Chotto Studio — dán nội dung, xem thử, ghi file.
 *
 * Trang này CHỈ tồn tại khi chạy `npm run dev`. App.jsx nạp nó sau `import.meta
 * .env.DEV`, nên nó không có trong bản build và không bao giờ lên chottoday.com.
 *
 * Điểm quan trọng nhất của cả trang: phần xem thử dùng CHÍNH `ArticleRenderer`
 * và chính CSS của site. "Trông đúng trong studio" và "trông đúng trên site" vì
 * thế là một, không phải hai thứ có thể lệch nhau dần.
 */

import React, { useEffect, useMemo, useState } from 'react';
import { ArticleRenderer } from '../components/article/ArticleRenderer.jsx';
import { CATEGORY_DEFINITIONS } from '../content/categories/categoryMap.js';
import { detectFormat, FORMATS } from './lib/detect.js';
import { parseMarkdown } from './lib/parseMarkdown.js';
import { parseLiteral } from './lib/parseLiteral.js';
import { suggestCategory } from './lib/categorize.js';
import { buildArticle, reviewArticle } from './lib/buildArticle.js';
import { emitArticleFile } from './lib/emitArticleFile.js';
import './StudioPage.css';

const EMPTY_SOURCE = { organization: '', title: '', url: '', type: 'official' };

export function StudioPage() {
  const [raw, setRaw] = useState('');
  const [forcedFormat, setForcedFormat] = useState('auto');
  const [overrides, setOverrides] = useState({ title: '', excerpt: '', category: '', tags: '' });
  const [sources, setSources] = useState([{ ...EMPTY_SOURCE }]);
  const [cover, setCover] = useState(null);
  const [env, setEnv] = useState(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetch('/__studio/env').then((r) => r.json()).then(setEnv).catch(() => setEnv(null));
  }, []);

  const detected = useMemo(() => detectFormat(raw), [raw]);
  const format = forcedFormat === 'auto' ? detected.format : forcedFormat;

  // Phân tích nội dung dán vào. Lỗi parse là chuyện thường khi người ta đang
  // dán dở, nên bắt lại và hiện ra chứ không để văng trắng trang.
  const parsed = useMemo(() => {
    if (!raw.trim()) return { input: null, error: null };
    try {
      if (format === FORMATS.JS) {
        const obj = parseLiteral(raw);
        return { input: obj, error: null };
      }
      const { meta, sections } = parseMarkdown(raw);
      return {
        input: {
          title: meta.title || '',
          excerpt: meta.excerpt || '',
          tags: Array.isArray(meta.tags) ? meta.tags : (meta.tags ? [meta.tags] : []),
          category: meta.category || '',
          sections,
        },
        error: null,
      };
    } catch (e) {
      return { input: null, error: e.message };
    }
  }, [raw, format]);

  const suggestion = useMemo(
    () => (parsed.input ? suggestCategory({ ...parsed.input, title: overrides.title || parsed.input.title }) : null),
    [parsed.input, overrides.title]
  );

  const article = useMemo(() => {
    if (!parsed.input) return null;
    return buildArticle(parsed.input, {
      title: overrides.title || undefined,
      excerpt: overrides.excerpt || undefined,
      category: overrides.category || suggestion?.category,
      tags: overrides.tags ? overrides.tags.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
      sources: sources.filter((s) => s.url.trim()),
      coverImage: cover ? `/images/featured/${'PENDING'}` : undefined,
    });
  }, [parsed.input, overrides, suggestion, sources, cover]);

  // coverImage phải biết slug, mà slug lại sinh từ title — nên vá lại sau khi
  // đã có bản ghi, thay vì lồng hai vòng phụ thuộc vào nhau.
  const finalArticle = useMemo(() => {
    if (!article) return null;
    if (!cover) return article;
    return { ...article, coverImage: `/images/featured/${article.slug}.${cover.ext}` };
  }, [article, cover]);

  const check = useMemo(() => (finalArticle ? reviewArticle(finalArticle) : null), [finalArticle]);

  function onPickCover(event) {
    const file = event.target.files?.[0];
    if (!file) { setCover(null); return; }
    const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
    const reader = new FileReader();
    reader.onload = () => setCover({ dataUrl: String(reader.result), ext, name: file.name });
    reader.readAsDataURL(file);
  }

  async function post(url, body) {
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await r.json();
    if (!r.ok) throw new Error(data.detail || data.error || `HTTP ${r.status}`);
    return data;
  }

  async function onWrite({ overwrite = false } = {}) {
    if (!finalArticle) return;
    setBusy(true);
    setResult(null);
    try {
      const written = await post('/__studio/write', {
        slug: finalArticle.slug,
        fileSource: emitArticleFile(finalArticle),
        coverImage: cover,
        overwrite,
      });

      let card = null;
      try {
        card = await post('/__studio/card', {
          slug: finalArticle.slug,
          title: finalArticle.title,
          topic: finalArticle.category,
          organization: finalArticle.sources[0]?.organization || 'Chotto',
          publishedAt: finalArticle.publishedAt,
        });
      } catch (e) {
        card = { error: e.message };
      }

      setResult({ ok: true, written, card });
    } catch (e) {
      setResult({ ok: false, error: e.message });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="studio">
      <header className="studio-head">
        <h1>Chotto Studio</h1>
        <p>
          Dán nội dung AI trả về, chọn ảnh, xem thử, rồi ghi vào repo. Chỉ chạy ở
          <code> npm run dev</code> — không có trên site thật.
        </p>
        {env && (!env.python.ok || !env.fonts.ok) && (
          <div className="studio-warn">
            <strong>Môi trường chưa đủ để sinh ảnh OG.</strong>
            {!env.fonts.ok && <div>Thiếu font thương hiệu → chạy <code>npm install</code></div>}
            {!env.python.ok && (
              <div>
                {env.python.reason}
                {env.python.fix && <> → chạy <code>{env.python.fix}</code></>}
              </div>
            )}
            <div className="studio-muted">Bài viết vẫn ghi được bình thường, chỉ thiếu ảnh OG.</div>
          </div>
        )}
      </header>

      <div className="studio-grid">
        {/* ---------------- Cột trái: nhập ---------------- */}
        <section className="studio-pane">
          <label className="studio-label" htmlFor="studio-raw">Nội dung</label>
          <textarea
            id="studio-raw"
            className="studio-textarea"
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            placeholder={'Dán markdown hoặc file .js ở đây.\n\nMarkdown: dùng ## cho mục, - cho danh sách,\n1. cho các bước, > [!warning] cho cảnh báo.'}
            spellCheck={false}
          />

          <div className="studio-row">
            <span className={`studio-badge ${detected.confident ? 'ok' : 'unsure'}`}>
              {format === FORMATS.JS ? 'file .js' : 'markdown'}
            </span>
            <span className="studio-muted">{detected.reason}</span>
            <select value={forcedFormat} onChange={(e) => setForcedFormat(e.target.value)}>
              <option value="auto">tự nhận dạng</option>
              <option value={FORMATS.MARKDOWN}>ép markdown</option>
              <option value={FORMATS.JS}>ép .js</option>
            </select>
          </div>

          {parsed.error && <div className="studio-error">Không đọc được: {parsed.error}</div>}

          <label className="studio-label" htmlFor="studio-title">Tiêu đề</label>
          <input
            id="studio-title"
            value={overrides.title || parsed.input?.title || ''}
            onChange={(e) => setOverrides({ ...overrides, title: e.target.value })}
            placeholder="Lấy từ # H1 hoặc frontmatter"
          />

          <label className="studio-label" htmlFor="studio-excerpt">Tóm tắt (excerpt)</label>
          <textarea
            id="studio-excerpt"
            rows={2}
            value={overrides.excerpt || parsed.input?.excerpt || ''}
            onChange={(e) => setOverrides({ ...overrides, excerpt: e.target.value })}
            placeholder="1–2 câu: chuyện gì và ảnh hưởng tới ai"
          />

          <label className="studio-label" htmlFor="studio-category">Chuyên mục</label>
          <select
            id="studio-category"
            value={overrides.category || suggestion?.category || 'doc'}
            onChange={(e) => setOverrides({ ...overrides, category: e.target.value })}
          >
            {CATEGORY_DEFINITIONS.map((c) => (
              <option key={c.id} value={c.id}>{c.label || c.name || c.id}</option>
            ))}
          </select>
          {suggestion && (
            <div className={`studio-muted ${suggestion.confident ? '' : 'studio-unsure'}`}>
              {suggestion.confident ? 'Đoán: ' : 'Không chắc — '}{suggestion.reason}
            </div>
          )}

          <label className="studio-label" htmlFor="studio-tags">Thẻ (cách nhau bằng dấu phẩy)</label>
          <input
            id="studio-tags"
            value={overrides.tags || (parsed.input?.tags || []).join(', ')}
            onChange={(e) => setOverrides({ ...overrides, tags: e.target.value })}
          />

          <label className="studio-label">Ảnh bìa</label>
          <input type="file" accept="image/png,image/jpeg,image/webp" onChange={onPickCover} />
          {cover && <div className="studio-muted">Đã chọn: {cover.name} → sẽ lưu thành <code>{finalArticle?.slug}.{cover.ext}</code></div>}

          <label className="studio-label">Nguồn</label>
          {sources.map((src, i) => (
            <div key={i} className="studio-source">
              <input
                placeholder="Cơ quan ban hành"
                value={src.organization}
                onChange={(e) => setSources(sources.map((s, j) => (j === i ? { ...s, organization: e.target.value } : s)))}
              />
              <input
                placeholder="Tiêu đề trang nguồn"
                value={src.title}
                onChange={(e) => setSources(sources.map((s, j) => (j === i ? { ...s, title: e.target.value } : s)))}
              />
              <input
                placeholder="https://..."
                value={src.url}
                onChange={(e) => setSources(sources.map((s, j) => (j === i ? { ...s, url: e.target.value } : s)))}
              />
            </div>
          ))}
          <button type="button" className="studio-link" onClick={() => setSources([...sources, { ...EMPTY_SOURCE }])}>
            + Thêm nguồn
          </button>
        </section>

        {/* ---------------- Cột phải: xem thử ---------------- */}
        <section className="studio-pane">
          {check && (
            <div className="studio-check">
              <div className={check.ok ? 'studio-ok' : 'studio-error'}>
                {check.ok ? '✓ Đủ điều kiện ghi file' : `✗ Còn ${check.blocking.length} chỗ phải sửa`}
              </div>
              {check.blocking.map((m, i) => <div key={i} className="studio-block-item">✗ {m}</div>)}
              {check.advisory.map((m, i) => <div key={i} className="studio-advice-item">• {m}</div>)}
            </div>
          )}

          <div className="studio-actions">
            <button type="button" disabled={!check?.ok || busy} onClick={() => onWrite()}>
              {busy ? 'Đang ghi…' : 'Ghi vào repo + sinh ảnh OG'}
            </button>
            {result?.error?.includes('Đã có file') && (
              <button type="button" className="studio-danger" disabled={busy} onClick={() => onWrite({ overwrite: true })}>
                Đè lên file cũ
              </button>
            )}
          </div>

          {result && (
            <div className={result.ok ? 'studio-result ok' : 'studio-result bad'}>
              {result.ok ? (
                <>
                  <div>Đã ghi:</div>
                  <ul>{result.written.written.map((f) => <li key={f}><code>{f}</code></li>)}</ul>
                  {!result.written.listPatched && (
                    <div className="studio-warn-inline">
                      Chưa chèn được vào articlesList.js ({result.written.listReason}) — thêm tay hai dòng.
                    </div>
                  )}
                  {result.card?.error
                    ? <div className="studio-warn-inline">Ảnh OG: {result.card.error}</div>
                    : <div>Ảnh OG: <code>{result.card?.written}</code></div>}
                  <div className="studio-next">
                    Xem thử tại <code>/articles/{finalArticle.slug}</code>, rồi{' '}
                    <code>npm run validate && npm test</code> trước khi commit.
                  </div>
                </>
              ) : (
                <div>{result.error}</div>
              )}
            </div>
          )}

          <div className="studio-preview-label">
            Xem thử — dùng đúng ArticleRenderer và CSS của site
          </div>
          <div className="studio-preview">
            {finalArticle ? (
              <article className="article-body">
                <h1 className="studio-preview-title">{finalArticle.title}</h1>
                {finalArticle.excerpt && <p className="studio-preview-excerpt">{finalArticle.excerpt}</p>}
                <ArticleRenderer sections={finalArticle.sections} />
              </article>
            ) : (
              <div className="studio-muted">Chưa có gì để xem.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default StudioPage;
