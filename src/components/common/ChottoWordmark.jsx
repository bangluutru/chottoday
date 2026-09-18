import React from 'react';

/**
 * CHOTTO WORDMARK — six-colour lockup
 *
 * Geometry is transcribed from the locked brand handbook (pages 05–06):
 * x = stroke weight = 100 units, cap height 3.6x, "o"/"c" outer diameter 3.6x.
 * The two "t" stems stay interlocked on purpose — the joint is the brand's
 * "small pieces connected" metaphor and must not be pulled apart.
 *
 * Rendered inline rather than via <img> so the mark inherits crisp vector
 * scaling at every placement size and needs no extra network request.
 */
export function ChottoWordmark({ width = 132, className = '', title = 'Chotto' }) {
  return (
    <svg
      viewBox="0 0 1708 360"
      role="img"
      aria-label={title}
      className={className}
      style={{ display: 'block', width, height: 'auto' }}
    >
      {/* c — Xanh Lá */}
      <path
        d="M 271.92 88.08 A 130 130 0 1 0 271.92 271.92"
        fill="none"
        stroke="var(--chotto-green)"
        strokeWidth="100"
        strokeLinecap="round"
      />
      {/* h — Mực */}
      <g fill="var(--chotto-ink)">
        <rect x="342" y="0" width="100" height="360" rx="50" />
        <rect x="532" y="0" width="100" height="360" rx="50" />
        <rect x="442" y="130" width="90" height="100" />
      </g>
      {/* o — Cam Nắng */}
      <circle cx="832" cy="180" r="130" fill="none" stroke="var(--chotto-orange)" strokeWidth="100" />
      {/* tt — San Hô + Tím Lam, interlocked */}
      <path
        transform="translate(1002 0)"
        d="M 175 0 V 71.8 A 27 27 0 1 1 175 108.2 V 310 A 50 50 0 0 1 75 310 V 100 H 50 A 50 50 0 0 1 50 0 Z"
        fill="var(--chotto-coral)"
      />
      <path
        transform="translate(1002 0)"
        d="M 181 0 V 60.1 A 33 33 0 1 1 181 119.9 V 310 A 50 50 0 0 0 281 310 V 100 H 306 A 50 50 0 0 0 306 0 Z"
        fill="var(--chotto-violet)"
      />
      {/* o — Ngọc */}
      <circle cx="1528" cy="180" r="130" fill="none" stroke="var(--chotto-cyan)" strokeWidth="100" />
    </svg>
  );
}

export default ChottoWordmark;
