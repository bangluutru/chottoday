/**
 * Ranking Engine for Intelligent Discovery
 * 
 * Scores and ranks candidate articles, problem situations, and tools.
 * Prioritizes published & verified content according to Phase 4 trust governance.
 */

import { ALL_ARTICLES } from '../../content/articles/articlesList.js';
import { USER_PROBLEMS } from '../../content/problems/problemsList.js';
import { searchTools, getToolById, isToolAvailable } from '../toolRegistry/index.js';
import { ARTICLE_STATUSES } from '../content/articleModel.js';
import { removeDiacritics } from './queryNormalizer.js';

export function rankResults(normalizedQuery, intent) {
  const { raw, unaccented, corrected, meaningfulTokens = [] } = normalizedQuery;
  const primaryConcept = intent?.primaryConcept || null;

  // ==========================================
  // 1. ARTICLE RANKING
  // ==========================================
  const rankedArticles = [];

  for (const article of ALL_ARTICLES) {
    let score = 0;
    const matchedReasons = [];

    const normTitle = removeDiacritics(article.title.toLowerCase());
    const normExcerpt = removeDiacritics((article.excerpt || '').toLowerCase());
    const normTags = (article.tags || []).map((t) => removeDiacritics(t.toLowerCase())).join(' ');

    // Primary concept association boost
    if (primaryConcept) {
      if (primaryConcept.primaryArticleSlug === article.slug) {
        score += 80;
        matchedReasons.push(`concept: ${primaryConcept.name}`);
      }
      if (article.category === primaryConcept.category) {
        score += 20;
        matchedReasons.push(`category: ${article.category}`);
      }
    }

    // Title match
    if (normTitle.includes(unaccented) || normTitle.includes(corrected)) {
      score += 60;
      matchedReasons.push('title exact phrase');
    } else {
      // Word matches in title (meaningful tokens only, ignoring stop words)
      let titleHits = 0;
      for (const token of meaningfulTokens) {
        if (normTitle.includes(token)) {
          titleHits++;
        }
      }
      if (titleHits > 0) {
        score += titleHits * 15;
        matchedReasons.push(`title tokens (${titleHits})`);
      }
    }

    // Tags match
    if (normTags.includes(unaccented)) {
      score += 30;
      matchedReasons.push('tag exact match');
    }

    // Excerpt match
    if (normExcerpt.includes(unaccented) || normExcerpt.includes(corrected)) {
      score += 25;
      matchedReasons.push('excerpt match');
    }

    // Short answer / Key takeaways match
    if (article.shortAnswer) {
      const normShortAnswer = removeDiacritics(JSON.stringify(article.shortAnswer).toLowerCase());
      if (normShortAnswer.includes(unaccented)) {
        score += 25;
        matchedReasons.push('verified short answer match');
      }
    }

    // Japanese raw content match
    const rawArticleStr = JSON.stringify(article).toLowerCase();
    if (raw.length >= 2 && rawArticleStr.includes(raw.toLowerCase())) {
      score += 30;
      matchedReasons.push('japanese content match');
    }

    // STATUS WEIGHTING (Phase 4 Trust Governance)
    if (article.status === ARTICLE_STATUSES.PUBLISHED) {
      score += 20; // Published and verified articles receive strong priority
    } else if (article.status === ARTICLE_STATUSES.REVIEW) {
      score -= 5; // Review/draft content ranks lower
    }

    // Only include article if it meets threshold
    const minThreshold = primaryConcept ? 30 : 45;
    if (score >= minThreshold) {
      rankedArticles.push({
        article,
        score,
        matchedReasons,
      });
    }
  }

  // Sort articles by score descending
  rankedArticles.sort((a, b) => b.score - a.score);

  // ==========================================
  // 2. PROBLEMS RANKING
  // ==========================================
  const rankedProblems = [];

  for (const prob of USER_PROBLEMS) {
    let score = 0;
    const matchedReasons = [];

    const normStatement = removeDiacritics(prob.statement.toLowerCase());
    const normDetail = removeDiacritics((prob.detail || '').toLowerCase());

    // Concept link
    if (primaryConcept && primaryConcept.primaryProblemId === prob.id) {
      score += 70;
      matchedReasons.push('primary concept problem');
    }

    // Statement phrase match
    if (normStatement.includes(unaccented) || normStatement.includes(corrected)) {
      score += 50;
      matchedReasons.push('problem statement match');
    }

    // Detail phrase match
    if (normDetail.includes(unaccented) || normDetail.includes(corrected)) {
      score += 30;
      matchedReasons.push('problem detail match');
    }

    // Category match
    if (primaryConcept && prob.categoryKey === primaryConcept.category) {
      score += 15;
    }

    // Keyword tokens
    for (const token of meaningfulTokens) {
      if (normStatement.includes(token) || normDetail.includes(token)) {
        score += 12;
      }
    }

    const minProbThreshold = primaryConcept ? 25 : 45;
    if (score >= minProbThreshold) {
      rankedProblems.push({
        problem: prob,
        score,
        matchedReasons,
      });
    }
  }

  rankedProblems.sort((a, b) => b.score - a.score);

  // ==========================================
  // 3. TOOLS RANKING
  // ==========================================
  const rankedTools = [];
  const addedToolIds = new Set();

  // 1. Primary concept tool
  if (primaryConcept && primaryConcept.primaryToolId) {
    const tool = getToolById(primaryConcept.primaryToolId);
    if (tool && isToolAvailable(tool.id)) {
      rankedTools.push({
        tool,
        score: 90,
        matchedReasons: [`primary tool for ${primaryConcept.name}`],
      });
      addedToolIds.add(tool.id);
    }
  }

  // 2. Tools from top problems
  for (const rp of rankedProblems.slice(0, 2)) {
    if (rp.problem.recommendedToolId && !addedToolIds.has(rp.problem.recommendedToolId)) {
      const tool = getToolById(rp.problem.recommendedToolId);
      if (tool && isToolAvailable(tool.id)) {
        rankedTools.push({
          tool,
          score: 60,
          matchedReasons: [`recommended by situation: ${rp.problem.statement}`],
        });
        addedToolIds.add(tool.id);
      }
    }
  }

  // 3. Text search tools from ToolRegistryService ONLY if we have meaningful tokens or concept
  if (primaryConcept || meaningfulTokens.length > 0) {
    const searchQuery = meaningfulTokens.length > 0 ? meaningfulTokens.join(' ') : raw;
    const searchedTools = searchTools(searchQuery, 3);
    for (const tool of searchedTools) {
      if (!addedToolIds.has(tool.id)) {
        rankedTools.push({
          tool,
          score: 40,
          matchedReasons: ['tool text match'],
        });
        addedToolIds.add(tool.id);
      }
    }
  }

  rankedTools.sort((a, b) => b.score - a.score);

  return {
    articles: rankedArticles.map((r) => r.article),
    articleScores: rankedArticles,
    problems: rankedProblems.map((r) => r.problem),
    problemScores: rankedProblems,
    tools: rankedTools.map((r) => r.tool),
    toolScores: rankedTools,
  };
}
