/**
 * CRA StorageService — Unified storage abstraction layer
 * Key prefix: cra_
 * Uses chrome.storage.local
 */
window.CRAStorage = (() => {
  const PREFIX = 'cra_';

  const DEFAULT_SETTINGS = {
    extensionEnabled: true,
    showSelectionToolbar: true,
    showQuotePanel: true,
    showCondenseEngine: false,
    showNavigator: false,
    showPageSearch: false,
  };

  // ── Settings ──

  async function getSettings() {
    const key = PREFIX + 'settings';
    const result = await chrome.storage.local.get(key);
    return Object.assign({}, DEFAULT_SETTINGS, result[key] || {});
  }

  async function saveSettings(partial) {
    const key = PREFIX + 'settings';
    const current = await getSettings();
    const updated = Object.assign({}, current, partial);
    await chrome.storage.local.set({ [key]: updated });
    return updated;
  }

  // ── Quotes / Citations ──

  const QUOTES_KEY = PREFIX + 'quotes';

  async function getQuotes() {
    const result = await chrome.storage.local.get(QUOTES_KEY);
    return result[QUOTES_KEY] || [];
  }

  async function saveQuotes(quotes) {
    await chrome.storage.local.set({ [QUOTES_KEY]: quotes });
  }

  async function clearQuotes() {
    await chrome.storage.local.remove(QUOTES_KEY);
  }

  function createQuoteEntry(text, source) {
    return {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: text.trim(),
      source: source || '',
      createdAt: Date.now(),
    };
  }

  // ── Conversation Persistence (future) ──

  async function getConversationIndex() {
    const key = PREFIX + 'conversation_index';
    const result = await chrome.storage.local.get(key);
    return result[key] || [];
  }

  async function saveConversationIndex(data) {
    const key = PREFIX + 'conversation_index';
    await chrome.storage.local.set({ [key]: data });
  }

  // ── Export / Import ──

  async function exportAllData() {
    const all = await chrome.storage.local.get(null);
    const craData = {};
    for (const [k, v] of Object.entries(all)) {
      if (k.startsWith(PREFIX)) {
        craData[k] = v;
      }
    }
    return {
      schemaVersion: 1,
      app: 'ChatGPT Reading Assistant',
      exportedAt: new Date().toISOString(),
      data: craData,
    };
  }

  async function importAllData(payload) {
    if (!payload || !payload.data) throw new Error('Invalid import payload');
    await chrome.storage.local.set(payload.data);
  }

  // ── Public API ──

  return {
    DEFAULT_SETTINGS,
    getSettings,
    saveSettings,
    QUOTES_KEY,
    getQuotes,
    saveQuotes,
    clearQuotes,
    createQuoteEntry,
    getConversationIndex,
    saveConversationIndex,
    exportAllData,
    importAllData,
  };
})();
