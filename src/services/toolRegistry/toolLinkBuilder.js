/**
 * Centralized Toolio Deep-Link Builder for ChottoDay
 *
 * Requirements:
 * - Single source for constructing Toolio URLs
 * - Uses environment-configured base URL (never hardcoded in components)
 * - Uses canonical tool routes from Toolio snapshot
 * - Attaches safe, application-level referral parameters only
 * - NEVER transmits user or personal data (no salary, inputs, search queries, etc.)
 */

import { TOOLIO_BASE_URL } from '../../config/constants.js';

const ALLOWED_SOURCES = new Set([
  'homepage',
  'article',
  'category',
  'problem',
  'search',
  'tools',
  'tool-detail',
]);

// Canonical Toolio tool route format: '#/tools/:toolId' (optional leading slash or query)
const CANONICAL_ROUTE_REGEX = /^(\/)?#\/tools\/[a-z0-9-]+(\?.*)?$/;

/**
 * Validates that a route string conforms strictly to canonical Toolio route shape.
 * Rejects unexpected schemes (http:, https:, javascript:, data:, //, etc.)
 *
 * @param {string} route
 * @returns {boolean}
 */
export function isValidToolioRoute(route) {
  if (!route || typeof route !== 'string') return false;
  const trimmed = route.trim();
  // Reject absolute URLs, scheme indicators, protocol-relative paths
  if (/^[a-z]+:/i.test(trimmed) || trimmed.startsWith('//')) {
    return false;
  }
  return CANONICAL_ROUTE_REGEX.test(trimmed);
}

/**
 * Builds an absolute deep-link URL to an existing Toolio tool.
 *
 * @param {Object} tool - Normalized tool object from Toolio snapshot
 * @param {Object} [context] - Optional navigation context
 * @param {'homepage'|'article'|'category'|'problem'|'search'|'tools'|'tool-detail'} [context.source] - Discovery trigger source
 * @returns {string|null} Fully qualified Toolio URL, or null if invalid
 */
export function buildToolUrlFromTool(tool, context = {}) {
  if (!tool || !tool.route || !isValidToolioRoute(tool.route)) {
    return null;
  }

  const base = TOOLIO_BASE_URL.replace(/\/+$/, '');
  const cleanRoute = tool.route.startsWith('/') ? tool.route : `/${tool.route}`;

  // Safe referral params only
  const params = new URLSearchParams();
  params.set('ref', 'chottoday');

  if (context.source && ALLOWED_SOURCES.has(context.source)) {
    params.set('source', context.source);
  }

  const queryString = params.toString();
  const separator = cleanRoute.includes('?') ? '&' : '?';

  return `${base}${cleanRoute}${queryString ? `${separator}${queryString}` : ''}`;
}
