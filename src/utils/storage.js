/**
 * Safe localStorage utilities that handle unavailable storage,
 * corrupted JSON, and quota exceeded errors without crashing.
 */

export function safeGetItem(key, fallback = null) {
  try {
    return localStorage.getItem(key);
  } catch (error) {
    console.error(`[storage] Failed to read "${key}":`, error);
    return fallback;
  }
}

export function safeSetItem(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`[storage] Failed to write "${key}":`, error);
    return false;
  }
}

export function safeGetJSON(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`[storage] Failed to parse "${key}":`, error);
    return fallback;
  }
}

export function safeSetJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`[storage] Failed to write JSON "${key}":`, error);
    return false;
  }
}
