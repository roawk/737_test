/* ==========================================================================
   LocalStorage History Manager
   ========================================================================== */

const STORAGE_KEY = 'fortune_history';

export class StorageManager {
  static loadHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch (e) {
      return [];
    }
  }

  static saveFortune(fortune, history) {
    if (!fortune) return history;
    const exists = history.some(h => h.quote === fortune.quote);
    if (!exists) {
      const item = {
        ...fortune,
        timestamp: new Date().toLocaleDateString('ko-KR')
      };
      const updated = [item, ...history];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    }
    return history;
  }

  static clearHistory() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    return [];
  }
}
