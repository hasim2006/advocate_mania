import { sanitizeText } from './sanitize';
import { safeGetJSON, safeSetJSON } from './storage';

const STORAGE_KEY = 'advocate_inquiries';
const INQUIRY_EVENT = 'inquiry_submitted';

/**
 * Format the current date/time in Indian locale for inquiry records.
 */
export function formatDateIndian() {
  return new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Save an inquiry to localStorage and dispatch a sync event
 * so the Dashboard (or other listeners) can update in real-time.
 * All text fields are sanitized before persisting.
 * Returns { success: boolean, inquiry?: object } so callers can handle storage failures.
 *
 * @param {{ name: string, phone: string, email?: string, subject: string, message: string, idPrefix?: string }} fields
 */
export function saveInquiry({ name, phone, email, subject, message, idPrefix = 'inq' }) {
  const newInquiry = {
    id: `${idPrefix}-${Date.now()}`,
    name: sanitizeText(name),
    phone: sanitizeText(phone),
    email: email ? sanitizeText(email) : 'Not Provided',
    subject: sanitizeText(subject),
    message: sanitizeText(message),
    date: formatDateIndian(),
    status: 'unread',
  };

  const existing = safeGetJSON(STORAGE_KEY, []);
  const saved = safeSetJSON(STORAGE_KEY, [newInquiry, ...existing]);

  if (!saved) {
    return { success: false };
  }

  window.dispatchEvent(new Event(INQUIRY_EVENT));

  return { success: true, inquiry: newInquiry };
}
