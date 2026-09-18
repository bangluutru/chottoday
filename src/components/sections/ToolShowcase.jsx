import React from 'react';
import { Link } from 'react-router-dom';
import './ToolShowcase.css';
import { getToolById, buildToolUrl } from '../../services/toolRegistry';
import { ArrowRightIcon } from '../common/Icons';
import { HOME_TOOL_TILES } from '../../data/homepage.js';

/**
 * Tile glyphs.
 *
 * Drawn inline on a 48-unit grid rather than pulled from /icons, because these
 * six need a shared stroke weight (3.5) and a single brand accent each — the
 * public icon set is a different, heavier family.
 */
const TILE_ICONS = {
  calculator: (
    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="11" y="7" width="26" height="34" rx="5" stroke="var(--chotto-ink)" strokeWidth="3.5" />
      <rect x="16" y="12" width="16" height="7" rx="2" fill="var(--chotto-green)" />
      <circle cx="18" cy="26" r="2.2" fill="var(--chotto-ink)" />
      <circle cx="24" cy="26" r="2.2" fill="var(--chotto-ink)" />
      <circle cx="30" cy="26" r="2.2" fill="var(--chotto-ink)" />
      <circle cx="18" cy="33" r="2.2" fill="var(--chotto-ink)" />
      <circle cx="24" cy="33" r="2.2" fill="var(--chotto-ink)" />
      <circle cx="30" cy="33" r="2.2" fill="var(--chotto-green)" />
    </svg>
  ),
  truck: (
    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="12" y="7" width="24" height="28" rx="6" stroke="var(--chotto-ink)" strokeWidth="3.5" />
      <rect x="17" y="13" width="14" height="8" rx="2" fill="var(--chotto-cyan)" />
      <path d="M17 41l3-6M31 41l-3-6" stroke="var(--chotto-ink)" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="18" cy="29" r="2.2" fill="var(--chotto-ink)" />
      <circle cx="30" cy="29" r="2.2" fill="var(--chotto-ink)" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M24 6l14 5v13c0 9-6 15.5-14 18-8-2.5-14-9-14-18V11z"
        stroke="var(--chotto-ink)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path
        d="M17 24l5 5 9-10"
        stroke="var(--chotto-green)"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  life: <img src="/icons/icon-life.svg" alt="" width="26" height="26" />,
  doc: <img src="/icons/icon-doc.svg" alt="" width="26" height="26" />,
  jar: (
    <svg width="24" height="24" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M18 8h12l-3 6h-6z"
        fill="var(--chotto-orange)"
        stroke="var(--chotto-ink)"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <path
        d="M27 14c8 3 13 10 13 17 0 5-4 8-16 8S8 36 8 31c0-7 5-14 13-17z"
        stroke="var(--chotto-ink)"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />
      <path d="M24 22v13M20 26h8M20 31h8" stroke="var(--chotto-ink)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  ),
};

/**
 * "Công cụ tiện ích" — a row of compact tool tiles opening in Toolio.
 *
 * Tiles whose tool is missing from the registry snapshot are skipped rather
 * than rendered as dead links.
 */
export function ToolShowcase() {
  const tiles = HOME_TOOL_TILES.map((tile) => {
    const tool = getToolById(tile.toolId);
    if (!tool) return null;
    const url = buildToolUrl(tool.id, { source: 'homepage' });
    if (!url) return null;
    return { ...tile, tool, url };
  }).filter(Boolean);

  return (
    <section className="tools-section" id="tools" aria-labelledby="tools-heading">
      <div className="container">
        <div className="chotto-panel">
          <div className="section-head-bar">
            <div className="section-head-icon head-icon-tool">
              <img src="/icons/icon-tool.svg" alt="" width="26" height="26" />
            </div>
            <div className="section-head-left">
              <h2 id="tools-heading" className="section-title-with-icon">Công cụ tiện ích</h2>
              <p className="section-desc-subtle">
                Những công cụ nhỏ giúp bạn tiết kiệm thời gian và xử lý mọi việc dễ dàng hơn.
              </p>
            </div>
            <Link to="/topics/tools" className="section-link-more">
              <span>Xem tất cả</span>
              <ArrowRightIcon size={14} />
            </Link>
          </div>

          <div className="tool-tile-grid">
            {tiles.map((tile) => (
              <a
                key={tile.toolId}
                href={tile.url}
                target="_blank"
                rel="noopener noreferrer"
                className="tool-tile"
                /* The registry name is the real, unabbreviated label */
                aria-label={`${tile.tool.name} — mở trong Toolio`}
                title={tile.tool.name}
              >
                <span className={`tool-tile-icon head-icon-${tile.tint}`}>
                  {TILE_ICONS[tile.icon]}
                </span>
                <span className="tool-tile-label">{tile.label}</span>
                <span className="tool-tile-caption">{tile.caption}</span>
              </a>
            ))}

            <Link to="/topics/tools" className="tool-tile tool-tile-more">
              <span className="tool-tile-more-dots" aria-hidden="true">•••</span>
              <span className="tool-tile-label">{'Xem thêm\ncông cụ'}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ToolShowcase;
