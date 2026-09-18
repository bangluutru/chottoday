/**
 * ChottoDay Global Constants & Configuration
 * 
 * VITE_TOOLIO_BASE_URL: Environment-configured base URL for Toolio miniapps.
 * Preserves Toolio as an independent, decoupled application.
 * Safe for both Vite runtime and Node.js execution (CLI/scripts).
 */

export const TOOLIO_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_TOOLIO_BASE_URL) ||
  (typeof process !== 'undefined' && process.env?.VITE_TOOLIO_BASE_URL) ||
  'https://toolio.chottoday.com';

/**
 * VITE_CONTACT_ENDPOINT: where the /about contact form POSTs its JSON payload.
 *
 * Intentionally empty by default. With no endpoint configured the form never
 * claims a message was sent — it points the visitor at CONTACT_EMAIL instead.
 */
export const CONTACT_ENDPOINT =
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_CONTACT_ENDPOINT) ||
  (typeof process !== 'undefined' && process.env?.VITE_CONTACT_ENDPOINT) ||
  '';

export const CONTACT_EMAIL = 'hello@chottoday.com';

export const FANPAGE_URL = 'https://www.facebook.com/chottoday';

/**
 * Builds an absolute URL pointing to a Toolio tool or subpath.
 * @param {string} path - Relative subpath or hash route, e.g. '/#/tools/japan-tax-simulator'
 * @returns {string} - Full external Toolio URL
 */
export function getToolioUrl(path = '') {
  const base = TOOLIO_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
