/**
 * CRASpaObserver — SPA navigation detection for ChatGPT
 *
 * Monitors URL changes (pushState doesn't fire popstate) via polling + popstate.
 * Calls onNavigate callback when URL changes.
 *
 * Dependencies: none
 */
window.CRASpaObserver = (() => {
  let lastUrl = '';
  let interval = null;
  let onNavigateCallback = null;

  /**
   * Start watching for SPA navigation.
   * @param {Function} onNavigate - Called with new URL when navigation detected
   */
  function start(onNavigate) {
    if (interval) stop();
    onNavigateCallback = onNavigate;
    lastUrl = window.location.href;

    // popstate fires on back/forward
    window.addEventListener('popstate', handleNavigate);

    // Polling for pushState navigation (ChatGPT uses pushState)
    interval = setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        handleNavigate();
      }
    }, 500);
  }

  function handleNavigate() {
    lastUrl = window.location.href;
    console.log('[CRA] Navigation detected:', lastUrl);
    if (onNavigateCallback) {
      // Delay to let React render new content
      setTimeout(() => onNavigateCallback(lastUrl), 800);
    }
  }

  function stop() {
    window.removeEventListener('popstate', handleNavigate);
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    onNavigateCallback = null;
  }

  return { start, stop };
})();
