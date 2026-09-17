/**
 * ChottoDay Global Constants & Configuration
 * 
 * VITE_TOOLIO_BASE_URL: Environment-configured base URL for Toolio miniapps.
 * Preserves Toolio as an independent, decoupled application.
 */

export const TOOLIO_BASE_URL =
  import.meta.env.VITE_TOOLIO_BASE_URL || 'https://tools.chottoday.com';

/**
 * Builds an absolute URL pointing to a Toolio tool or subpath.
 * @param {string} path - Relative subpath or hash route, e.g. '/#/japan-tax-simulator'
 * @returns {string} - Full external Toolio URL
 */
export function getToolioUrl(path = '') {
  const base = TOOLIO_BASE_URL.replace(/\/+$/, '');
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${base}${cleanPath}`;
}
