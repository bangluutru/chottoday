/**
 * Toolio Compatibility Resolver
 *
 * Provides index lookups, query filtering, and status checks
 * against the local Toolio compatibility snapshot.
 */

import { TOOLIO_SNAPSHOT } from './toolioSnapshot.js';

// Index tools by ID for O(1) lookup
const toolMap = new Map();
for (const tool of TOOLIO_SNAPSHOT) {
  toolMap.set(tool.id, tool);
}

/**
 * Resolves a tool by ID from the snapshot
 * @param {string} id
 * @returns {Object|null}
 */
export function resolveTool(id) {
  if (!id || typeof id !== 'string') return null;
  return toolMap.get(id.trim()) || null;
}

/**
 * Resolves multiple tools in order
 * @param {string[]} ids
 * @returns {Object[]}
 */
export function resolveTools(ids = []) {
  if (!Array.isArray(ids)) return [];
  return ids
    .map((id) => resolveTool(id))
    .filter(Boolean);
}

/**
 * Checks if a tool is active and routable
 * @param {string} id
 * @returns {boolean}
 */
export function isAvailable(id) {
  const tool = resolveTool(id);
  return Boolean(tool && tool.status === 'active');
}

/**
 * Returns all tools in the snapshot
 * @returns {Object[]}
 */
export function getAllSnapshotTools() {
  return [...TOOLIO_SNAPSHOT];
}

/**
 * Filters tools by domain (e.g. 'common', 'japan-life', 'vietnam-life')
 * @param {string} domain
 * @returns {Object[]}
 */
export function getToolsByDomain(domain) {
  if (!domain) return [];
  const normalized = domain.trim().toLowerCase();
  return TOOLIO_SNAPSHOT.filter((t) => t.domain?.toLowerCase() === normalized);
}

/**
 * Filters tools by Toolio category (e.g. 'office', 'image', 'pdf', 'utils', 'ai')
 * @param {string} category
 * @returns {Object[]}
 */
export function getToolsByCategory(category) {
  if (!category) return [];
  const normalized = category.trim().toLowerCase();
  return TOOLIO_SNAPSHOT.filter((t) => t.category?.toLowerCase() === normalized);
}

/**
 * Normalizes a string by removing Vietnamese diacritics for flexible search
 * @param {string} str
 * @returns {string}
 */
function removeDiacritics(str = '') {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
}

/**
 * Searches tools against name, description, tags, category, and ID
 * Supports both accented and non-accented search terms
 *
 * @param {string} query
 * @param {number} [limit=10]
 * @returns {Object[]}
 */
export function searchSnapshot(query = '', limit = 10) {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const rawTerm = trimmed.toLowerCase();
  const cleanTerm = removeDiacritics(trimmed);

  const matched = [];

  for (const tool of TOOLIO_SNAPSHOT) {
    if (tool.status !== 'active') continue;

    const rawName = (tool.name || '').toLowerCase();
    const cleanName = removeDiacritics(tool.name);

    const rawDesc = (tool.description || '').toLowerCase();
    const cleanDesc = removeDiacritics(tool.description);

    const idMatch = tool.id.toLowerCase().includes(rawTerm);
    const nameMatch = rawName.includes(rawTerm) || cleanName.includes(cleanTerm);
    const descMatch = rawDesc.includes(rawTerm) || cleanDesc.includes(cleanTerm);

    const tagMatch = (tool.tags || []).some((tag) => {
      const rawTag = tag.toLowerCase();
      const cleanTag = removeDiacritics(tag);
      return rawTag.includes(rawTerm) || cleanTag.includes(cleanTerm);
    });

    if (nameMatch || idMatch || tagMatch || descMatch) {
      // Calculate score for ranking: name matches score highest
      let score = 0;
      if (rawName.startsWith(rawTerm) || cleanName.startsWith(cleanTerm)) score += 10;
      else if (nameMatch) score += 5;
      if (idMatch) score += 4;
      if (tagMatch) score += 3;
      if (descMatch) score += 1;

      matched.push({ tool, score });
    }
  }

  // Sort descending by score
  matched.sort((a, b) => b.score - a.score);

  return matched.slice(0, limit).map((item) => item.tool);
}
