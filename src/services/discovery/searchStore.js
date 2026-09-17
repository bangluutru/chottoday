/**
 * Ephemeral In-Memory Search Store (Phase 5 Privacy Standard)
 * 
 * Objectives:
 * - Keeps raw natural-language queries strictly in ephemeral JavaScript memory.
 * - ZERO persistence to: URL query params, browser history, localStorage, sessionStorage, IndexedDB, or cookies.
 * - Ensures PII (such as names, ID numbers, medical descriptions, salaries) is NEVER stored.
 */

let ephemeralQuery = '';

export function getEphemeralQuery() {
  return ephemeralQuery;
}

export function setEphemeralQuery(query) {
  ephemeralQuery = typeof query === 'string' ? query : '';
}

export function clearEphemeralQuery() {
  ephemeralQuery = '';
}
