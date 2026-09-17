/**
 * Intent Resolver for Intelligent Discovery
 * 
 * Maps normalized query signals to concept definitions,
 * topical categories, and problem intents with confidence scoring.
 */

import { TERMINOLOGY_CONCEPTS } from './terminologyIndex.js';
import { removeDiacritics } from './queryNormalizer.js';

export function resolveIntent(normalizedQuery) {
  if (!normalizedQuery || !normalizedQuery.raw) {
    return {
      primaryConcept: null,
      matchedConcepts: [],
      category: null,
      confidence: 0,
      matchedKeywords: [],
    };
  }

  const { cleaned, unaccented, corrected } = normalizedQuery;
  const matchedConcepts = [];

  for (const concept of TERMINOLOGY_CONCEPTS) {
    let score = 0;
    const matchedTerms = [];

    // 1. Check Japanese kanji/kana (substring check on cleaned)
    for (const jp of concept.japanese) {
      if (cleaned.includes(jp.toLowerCase())) {
        score += 50;
        matchedTerms.push(jp);
      }
    }

    // 2. Check Romaji keywords
    for (const ro of concept.romaji) {
      const roLower = ro.toLowerCase();
      if (cleaned.includes(roLower) || corrected.includes(roLower) || unaccented.includes(roLower)) {
        score += 40;
        matchedTerms.push(ro);
      }
    }

    // 3. Check Vietnamese phrases (accented & unaccented)
    for (const vi of concept.vietnamese) {
      const viClean = vi.toLowerCase();
      const viUnaccented = removeDiacritics(viClean);
      if (cleaned.includes(viClean) || unaccented.includes(viUnaccented) || corrected.includes(viUnaccented)) {
        // Higher weight for multi-word exact phrase matches
        const phraseWeight = vi.includes(' ') ? 45 : 30;
        score += phraseWeight;
        matchedTerms.push(vi);
      }
    }

    // 4. Check known typos
    for (const typo of concept.typos || []) {
      const typoUnaccented = removeDiacritics(typo.toLowerCase());
      if (unaccented.includes(typoUnaccented) || corrected.includes(typoUnaccented)) {
        score += 35;
        matchedTerms.push(typo);
      }
    }

    if (score > 0) {
      matchedConcepts.push({
        concept,
        score,
        matchedTerms: Array.from(new Set(matchedTerms)),
      });
    }
  }

  // Sort matched concepts by score descending
  matchedConcepts.sort((a, b) => b.score - a.score);

  if (matchedConcepts.length === 0) {
    return {
      primaryConcept: null,
      matchedConcepts: [],
      category: null,
      confidence: 0,
      matchedKeywords: [],
    };
  }

  const primary = matchedConcepts[0];
  const confidence = Math.min(1, Math.max(0.1, primary.score / 60));

  return {
    primaryConcept: primary.concept,
    matchedConcepts,
    category: primary.concept.category,
    confidence: Number(confidence.toFixed(2)),
    matchedKeywords: primary.matchedTerms,
  };
}
