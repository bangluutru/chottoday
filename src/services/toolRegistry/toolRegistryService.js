/**
 * Tool Registry Service
 *
 * Single, unified access layer for ChottoDay components to discover,
 * query, and deep-link to Toolio miniapps.
 *
 * Architecture:
 * UI Components (Articles, Homepage, Search, Categories, Problems)
 *        │
 *        ▼
 * ToolRegistryService (this file)
 *        │
 *        ▼
 * ToolioCompatibilityAdapter / Snapshot
 * (Future: replaceable by PublicToolRegistryAdapter without changing any UI)
 */

import {
  resolveTool,
  resolveTools,
  isAvailable,
  getAllSnapshotTools,
  getToolsByDomain as filterByDomain,
  getToolsByCategory as filterByCategory,
  searchSnapshot,
} from './toolResolver.js';

import { buildToolUrlFromTool } from './toolLinkBuilder.js';

/**
 * Resolves a single tool by its stable ID.
 *
 * @param {string} id - Tool identifier
 * @returns {Object|null} Normalized tool object or null if not found
 */
export function getToolById(id) {
  return resolveTool(id);
}

/**
 * Resolves multiple tools by an array of IDs.
 * Non-existent IDs are filtered out safely.
 *
 * @param {string[]} ids - Array of tool identifiers
 * @returns {Object[]} Array of resolved tools
 */
export function getToolsByIds(ids = []) {
  return resolveTools(ids);
}

/**
 * Checks whether a tool is recognized and active.
 *
 * @param {string} id - Tool identifier
 * @returns {boolean}
 */
export function isToolAvailable(id) {
  return isAvailable(id);
}

/**
 * Performs fast, local text search across tool names, descriptions, and tags.
 *
 * @param {string} query - Search term
 * @param {number} [limit=5] - Maximum number of results
 * @returns {Object[]}
 */
export function searchTools(query, limit = 5) {
  return searchSnapshot(query, limit);
}

/**
 * Retrieves tools belonging to a specific domain ('common', 'japan-life', 'vietnam-life').
 *
 * @param {string} domain
 * @returns {Object[]}
 */
export function getToolsByDomain(domain) {
  return filterByDomain(domain);
}

/**
 * Retrieves tools belonging to a specific Toolio category ('office', 'image', 'pdf', 'utils', 'ai').
 *
 * @param {string} category
 * @returns {Object[]}
 */
export function getToolsByCategory(category) {
  return filterByCategory(category);
}

/**
 * Returns all active tools in the registry.
 *
 * @returns {Object[]}
 */
export function getAllTools() {
  return getAllSnapshotTools();
}

/**
 * Constructs a fully-qualified, safe Toolio deep link for a tool ID.
 *
 * @param {string} toolId - Tool identifier
 * @param {Object} [context] - Context options
 * @param {'homepage'|'article'|'category'|'problem'|'search'|'tools'|'tool-detail'} [context.source] - Referral source
 * @returns {string|null} Fully qualified URL or null if tool is unknown/invalid
 */
export function buildToolUrl(toolId, context = {}) {
  const tool = resolveTool(toolId);
  if (!tool) {
    return null;
  }
  return buildToolUrlFromTool(tool, context);
}
