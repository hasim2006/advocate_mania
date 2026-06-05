/**
 * Input sanitization utilities for defense-in-depth.
 * React auto-escapes JSX text, but these provide an extra layer
 * when data is persisted to localStorage or used in URLs.
 */

const HTML_ENTITY_MAP = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#x27;',
};

/**
 * Strip HTML tags and escape dangerous characters from user input.
 */
export function sanitizeText(input) {
  if (typeof input !== 'string') return '';
  return input
    .replace(/[&<>"']/g, (char) => HTML_ENTITY_MAP[char])
    .trim();
}

/**
 * Validate a 10-digit Indian mobile number (starts with 6-9).
 */
export function isValidIndianPhone(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

/**
 * Sanitize text before embedding in a URL parameter.
 * Prevents injection via crafted query strings.
 */
export function sanitizeForUrl(input) {
  if (typeof input !== 'string') return '';
  return encodeURIComponent(input.trim().slice(0, 500));
}
