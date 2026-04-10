// Handle browser storage restrictions (privacy mode, tracking prevention, etc.)
// Falls back to memory storage if localStorage is blocked

const storage = {
  setItem(key, value) {
    try {
      localStorage.setItem(key, value);
      // Also store in memory as backup
      window.__fallbackStorage = window.__fallbackStorage || {};
      window.__fallbackStorage[key] = value;
    } catch (e) {
      // localStorage blocked by browser privacy settings
      window.__fallbackStorage = window.__fallbackStorage || {};
      window.__fallbackStorage[key] = value;
      console.warn(`🔵 Using memory storage for "${key}" (localStorage blocked by browser privacy)`);
    }
  },

  getItem(key) {
    try {
      const item = localStorage.getItem(key);
      if (item) return item;
    } catch (e) {
      // localStorage blocked
    }
    // Fallback to memory storage
    return window.__fallbackStorage?.[key] || null;
  },

  removeItem(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      // ignore
    }
    // Also remove from memory
    if (window.__fallbackStorage) {
      delete window.__fallbackStorage[key];
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      // ignore
    }
    window.__fallbackStorage = {};
  }
};

export default storage;
