/**
 * CRA UI Helpers — Shared UI utility functions
 *
 * Provides toast notifications and HTML escaping used across modules.
 */
window.CRAUIHelpers = (() => {
  /**
   * Show a brief toast notification at the bottom of the screen.
   * @param {string} message - Text to display
   * @param {number} [duration=1200] - Display duration in ms
   */
  function showToast(message, duration) {
    duration = duration || 1200;
    const toast = document.createElement('div');
    toast.className = 'cra-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('cra-visible'));
    setTimeout(() => {
      toast.classList.remove('cra-visible');
      setTimeout(() => toast.remove(), 200);
    }, duration);
  }

  /**
   * Escape a string for safe HTML insertion.
   * @param {string} str - Raw string
   * @returns {string} HTML-escaped string
   */
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  return { showToast, escapeHtml };
})();
