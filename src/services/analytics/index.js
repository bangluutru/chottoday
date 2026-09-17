/**
 * ChottoDay Minimal Privacy-Preserving Analytics
 * 
 * Philosophy:
 * - Only collects anonymous product navigation and engagement events.
 * - STRICT PRIVACY: Prohibits any financial, tax, salary, identity, document, or calculation data.
 * - Decoupled: Can be connected to any provider or run as a safe no-op.
 */

const ALLOWED_EVENTS = new Set([
  'page_view',
  'article_view',
  'search',
  'article_related_click',
  'toolio_open',
  'source_link_click',
  'category_open',
  'article_share',
]);

const FORBIDDEN_KEYS = new Set([
  'salary',
  'income',
  'tax',
  'email',
  'name',
  'phone',
  'address',
  'cardId',
  'zairyu',
  'myNumber',
  'calculation',
  'inputs',
]);

/**
 * Sanitizes metadata to ensure no sensitive personal or financial information is tracked.
 */
function sanitizeMetadata(metadata = {}) {
  const clean = {};
  for (const [key, val] of Object.entries(metadata)) {
    if (FORBIDDEN_KEYS.has(key.toLowerCase())) {
      continue;
    }
    // Only accept primitive scalar types (strings, numbers, booleans)
    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
      clean[key] = val;
    }
  }
  return clean;
}

export function trackEvent(eventName, metadata = {}) {
  if (!ALLOWED_EVENTS.has(eventName)) {
    if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
      console.warn(`[ChottoAnalytics] Unrecognized event ignored: "${eventName}"`);
    }
    return;
  }

  const sanitized = sanitizeMetadata(metadata);

  // In browser development, output to console for inspection
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
    // console.debug(`[Analytics] ${eventName}`, sanitized);
  }

  // Future provider hook (e.g. window.gtag or custom endpoint)
  if (typeof window !== 'undefined' && typeof window.__chotto_track__ === 'function') {
    try {
      window.__chotto_track__(eventName, sanitized);
    } catch (e) {
      // Fail safely
    }
  }
}
