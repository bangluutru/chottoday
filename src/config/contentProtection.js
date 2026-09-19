/**
 * Article copy protection — what it does, and what it honestly cannot do.
 *
 * Everything here runs in the reader's own browser, which means anyone who
 * wants the text badly enough can still have it: view source, disable
 * JavaScript, open reader mode, or read the prerendered HTML that Google is
 * deliberately served. No site can prevent that, and a site that tries hard
 * enough breaks itself for real readers instead.
 *
 * What this does prevent is the casual case, which is nearly all of it —
 * select, right-click, copy, paste into another blog. And when a copy does get
 * through, the clipboard carries the title and the canonical link back here
 * rather than bare text, so a re-post credits the source by default.
 *
 * The parts that actually enforce anything are elsewhere: robots.txt and
 * functions/_middleware.js for crawlers, and Cloudflare's bot management for
 * scrapers pretending to be Chrome. See README §"Chống crawl dữ liệu".
 */

/** Master switch. Set to false and every guard below goes quiet. */
export const COPY_PROTECTION_ENABLED = true;

/**
 * Blocks text selection inside the article body.
 *
 * Deliberately scoped to the article column only. Tool pages, the calculator,
 * forms, search results and the policy text stay fully selectable — a reader
 * copying an address into Google Maps or a Japanese term into a dictionary is
 * doing exactly what the site is for.
 */
export const BLOCK_SELECTION = true;

/** Blocks the right-click menu inside the article body, except on links. */
export const BLOCK_CONTEXT_MENU = true;

/** Blocks dragging an image out of the article into another tab or the desktop. */
export const BLOCK_IMAGE_DRAG = true;

/**
 * When a copy still happens, hand the clipboard an attribution block instead
 * of the selected text.
 */
export const ATTRIBUTE_ON_COPY = true;

/** How long the "this is copyrighted" notice stays on screen, in ms. */
export const NOTICE_DURATION = 2600;

/**
 * Builds what a blocked copy actually puts on the clipboard.
 *
 * @param {Object} article - { title, url }
 * @returns {string}
 */
export function buildAttribution({ title, url }) {
  return [
    `“${title}” — ChottoDay`,
    url,
    '',
    'Nội dung thuộc bản quyền ChottoDay. Bạn được phép trích dẫn ngắn kèm',
    'liên kết về bài gốc; sao chép toàn văn hoặc đăng lại thì không.',
  ].join('\n');
}
