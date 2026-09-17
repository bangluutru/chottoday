/**
 * Query Normalizer for Intelligent Discovery
 * 
 * Handles Vietnamese diacritics stripping, common typos, Romaji variants,
 * punctuation removal, and tokenization.
 */

// Common typo corrections dictionary
const TYPO_MAP = {
  'zairu': 'zairyu',
  'zaryu': 'zairyu',
  'zairy': 'zairyu',
  'nenkinn': 'nenkin',
  'shakaihoken': 'shakai hoken',
  'juminze': 'juminzei',
  'gaimenkirikae': 'gaimen kirikae',
  'shikikin': 'shikikin',
  'reikin': 'reikin',
  'taishoku': 'taishoku',
  'koushin': 'koushin',
};

/**
 * Removes Vietnamese accents/diacritics
 * e.g., "Thẻ cư trú" -> "the cu tru"
 */
export function removeDiacritics(str = '') {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd');
}

/**
 * Strips non-alphanumeric characters except spaces, hyphens, and Japanese kanji/kana
 */
export function cleanPunctuation(str = '') {
  return str.replace(/[!?,;:.()"'\\[\]{}_+=*&^%$#@~`|\/\\<>]/g, ' ').replace(/\s+/g, ' ').trim();
}

export const STOP_WORDS = new Set([
  'xin', 'o', 'tai', 'la', 'gi', 'thi', 'va', 'cua', 'cho', 'cac',
  'nhung', 'duoc', 'bi', 'khong', 'co', 'nay', 'do', 'ra', 'vao',
  'len', 'xuong', 'muon', 'can', 'biet', 'sao', 'nao', 'mot', 'hai',
]);

/**
 * Normalizes user query into searchable tokens and corrected terms
 */
export function normalizeQuery(rawQuery = '') {
  const trimmed = (rawQuery || '').trim();
  if (!trimmed) {
    return {
      raw: '',
      cleaned: '',
      unaccented: '',
      corrected: '',
      tokens: [],
      unaccentedTokens: [],
      meaningfulTokens: [],
    };
  }

  const cleaned = cleanPunctuation(trimmed.toLowerCase());
  const unaccented = removeDiacritics(cleaned);

  // Apply word-level typo replacements
  const words = unaccented.split(/\s+/).filter(Boolean);
  const correctedWords = words.map((w) => TYPO_MAP[w] || w);
  const corrected = correctedWords.join(' ');

  // Japanese phrase handling (without space separation)
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  const unaccentedTokens = unaccented.split(/\s+/).filter(Boolean);
  const meaningfulTokens = unaccentedTokens.filter((t) => t.length >= 3 && !STOP_WORDS.has(t));

  return {
    raw: trimmed,
    cleaned,
    unaccented,
    corrected,
    tokens,
    unaccentedTokens,
    meaningfulTokens,
  };
}
