/** Utility functions for the portfolio application */

/**
 * Fuzzy search algorithm - finds pattern matches in a string
 * Returns match score and indices of matched characters, or null if no match
 * @param {string} str - The string to search in
 * @param {string} pattern - The pattern to search for
 * @returns {{score: number, indices: number[]} | null}
 */
export function fuzzy(str, pattern) {
  str = str.toLowerCase();
  pattern = pattern.toLowerCase();
  let si = 0,
    pi = 0,
    score = 0,
    indices = [];
  while (si < str.length && pi < pattern.length) {
    if (str[si] === pattern[pi]) {
      indices.push(si);
      score++;
      pi++;
    }
    si++;
  }
  return pi === pattern.length ? { score, indices } : null;
}

/**
 * Highlight matched characters in text using mark tags
 * @param {string} text - The text to highlight
 * @param {number[]} indices - Array of character indices to highlight
 * @returns {string} HTML string with highlighted characters
 */
export function highlight(text, indices) {
  if (!indices?.length) return esc(text);
  const ii = new Set(indices);
  return [...text]
    .map((ch, i) => (ii.has(i) ? `<mark>${esc(ch)}</mark>` : esc(ch)))
    .join("");
}

/**
 * Escape HTML special characters to prevent XSS
 * @param {string} s - The string to escape
 * @returns {string} Escaped string safe for HTML insertion
 */
export function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Debounce function to limit execution rate
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(fn, delay) {
  let timer = null;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function to limit execution rate
 * @param {Function} fn - The function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(fn, limit) {
  let inThrottle = false;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
