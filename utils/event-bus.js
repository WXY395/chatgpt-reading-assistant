/**
 * CRA EventBus — Lightweight pub/sub for inter-module communication
 */
window.CRAEventBus = (() => {
  const listeners = new Map();

  function on(event, callback) {
    if (!listeners.has(event)) {
      listeners.set(event, new Set());
    }
    listeners.get(event).add(callback);
    return () => off(event, callback);
  }

  function off(event, callback) {
    const set = listeners.get(event);
    if (set) {
      set.delete(callback);
      if (set.size === 0) listeners.delete(event);
    }
  }

  function emit(event, data) {
    // Warn on unknown events (helps catch typos and undeclared events)
    if (window.CRAEvents && !Object.values(window.CRAEvents).includes(event)) {
      console.warn(`[CRA EventBus] Unknown event: "${event}" — add it to CRAEvents`);
    }

    const set = listeners.get(event);
    if (set) {
      for (const cb of set) {
        try {
          cb(data);
        } catch (e) {
          console.error(`[CRA EventBus] Error in listener for "${event}":`, e);
        }
      }
    }
  }

  function once(event, callback) {
    const wrapper = (data) => {
      off(event, wrapper);
      callback(data);
    };
    on(event, wrapper);
    return () => off(event, wrapper);
  }

  return { on, off, emit, once };
})();
