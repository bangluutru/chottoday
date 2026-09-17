/**
 * Centralized Discovery Service (Phase 5 — Intelligent Discovery)
 * 
 * Provides a stable service API for natural-language discovery,
 * intent resolution, grounded summarization, and ranked retrieval.
 */

import { normalizeQuery } from './queryNormalizer.js';
import { resolveIntent } from './intentResolver.js';
import { rankResults } from './rankingEngine.js';
import { generateGroundedSummary } from './groundedSummarizer.js';
import { searchArticles } from '../../content/articles/index.js';
import { searchTools } from '../toolRegistry/index.js';

/**
 * Performs natural language discovery across all Chotto knowledge bases.
 *
 * @param {string} query - Raw user query
 * @param {Object} [options] - Options (category, limit, etc.)
 * @returns {Object} Standardized discovery result
 */
export function discover(query = '', options = {}) {
  const trimmed = (query || '').trim();

  if (!trimmed) {
    return {
      query: '',
      normalizedQuery: '',
      intent: {
        primaryConcept: null,
        category: null,
        confidence: 0,
        matchedKeywords: [],
      },
      summary: null,
      results: {
        articles: [],
        problems: [],
        tools: [],
      },
      totalCount: 0,
      isLowConfidence: false,
      hasResults: false,
      matchedReasons: [],
    };
  }

  try {
    // 1. Normalize Query
    const normalized = normalizeQuery(trimmed);

    // 2. Resolve Intent & Concept
    const intent = resolveIntent(normalized);

    // 3. Rank Grounded Results
    const ranked = rankResults(normalized, intent);

    // 4. Generate Grounded Summary (from top verified article)
    const topArticle = ranked.articles.length > 0 ? ranked.articles[0] : null;
    const summary = generateGroundedSummary(topArticle, intent);

    let finalArticles = ranked.articles;
    let finalProblems = ranked.problems;
    let finalTools = ranked.tools;

    // If query has 0 concept confidence and no articles or problems matched,
    // clear stray tools so unsupported query returns 0 results
    if (intent.confidence === 0 && finalArticles.length === 0 && finalProblems.length === 0) {
      finalTools = [];
    }

    const totalCount = finalArticles.length + finalProblems.length + finalTools.length;
    const hasResults = totalCount > 0;
    const isLowConfidence = !hasResults || intent.confidence < 0.35 || (finalArticles.length === 0 && finalProblems.length === 0);

    const matchedReasons = ranked.articleScores.length > 0
      ? ranked.articleScores[0].matchedReasons
      : intent.matchedKeywords;

    return {
      query: trimmed,
      normalizedQuery: normalized.corrected || normalized.unaccented,
      intent,
      summary,
      results: {
        articles: finalArticles,
        problems: finalProblems,
        tools: finalTools,
      },
      totalCount,
      isLowConfidence,
      hasResults,
      matchedReasons,
    };
  } catch (err) {
    // Fallback: simple keyword search if discovery pipeline errors
    if (typeof process !== 'undefined' && process.env?.NODE_ENV !== 'production') {
      console.warn('[DiscoveryService] Fallback invoked due to error:', err);
    }

    const fallbackArticles = searchArticles(trimmed);
    const fallbackTools = searchTools(trimmed, 3);
    const totalCount = fallbackArticles.length + fallbackTools.length;

    return {
      query: trimmed,
      normalizedQuery: trimmed,
      intent: {
        primaryConcept: null,
        category: null,
        confidence: 0.1,
        matchedKeywords: [],
      },
      summary: null,
      results: {
        articles: fallbackArticles,
        problems: [],
        tools: fallbackTools,
      },
      totalCount,
      isLowConfidence: totalCount === 0,
      hasResults: totalCount > 0,
      matchedReasons: ['fallback_keyword_search'],
    };
  }
}
