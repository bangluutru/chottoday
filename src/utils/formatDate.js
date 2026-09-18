/**
 * Formats an ISO date (YYYY-MM-DD) the way Vietnamese readers expect: 12/04/2026.
 *
 * Content stores dates as ISO strings, which is what the sitemap and structured
 * data need; only the reader-facing surfaces go through this.
 *
 * @param {string} iso
 * @returns {string} The formatted date, or the input unchanged if it is not ISO.
 */
export function formatDate(iso) {
  if (typeof iso !== 'string') return '';
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return iso;
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export default formatDate;
