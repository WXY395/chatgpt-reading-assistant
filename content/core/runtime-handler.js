/**
 * CRARuntimeHandler — chrome.runtime message handling
 *
 * Handles messages from popup and background script.
 * Pure message router — no business logic.
 *
 * Dependencies: none (deps injected via attach)
 */
window.CRARuntimeHandler = (() => {
  let handler = null;

  /**
   * Attach the message listener.
   * @param {Object} deps - Injected dependencies
   * @param {Function} deps.onSettingsUpdate - Called with new settings
   * @param {Function} deps.getSettings - Returns current settings
   * @param {Function} deps.getDiagnostics - Returns module diagnostics
   * @param {Object} deps.inputIntegration - CRAInputIntegration instance
   * @param {Object} deps.messageScanner - CRAMessageScanner instance
   * @param {Object} deps.citationClipboard - CRACitationClipboard instance
   */
  function attach(deps) {
    if (handler) detach();

    handler = (message, sender, sendResponse) => {
      switch (message.type) {
        case 'CRA_UPDATE_SETTINGS':
          deps.onSettingsUpdate(message.settings);
          sendResponse({ success: true });
          break;

        case 'CRA_GET_SETTINGS':
          sendResponse({ settings: deps.getSettings() });
          break;

        case 'CRA_GET_DIAGNOSTICS':
          sendResponse({ diagnostics: deps.getDiagnostics() });
          break;

        case 'CRA_INSERT_TEXT': {
          const success = deps.inputIntegration.insertText(message.text, message.append);
          sendResponse({ success });
          break;
        }

        case 'CRA_QUOTES_CLEARED':
          if (deps.citationClipboard && deps.citationClipboard.loadQuotes) {
            deps.citationClipboard.loadQuotes();
          }
          sendResponse({ success: true });
          break;

        case 'CRA_SCAN_MESSAGES': {
          const msgs = deps.messageScanner.scan();
          sendResponse({
            messages: msgs.map((m) => ({
              index: m.index,
              turnIndex: m.turnIndex,
              role: m.role,
              text: m.text,
            })),
          });
          break;
        }

        default:
          return false;
      }
      return true;
    };

    chrome.runtime.onMessage.addListener(handler);
  }

  function detach() {
    if (handler) {
      chrome.runtime.onMessage.removeListener(handler);
      handler = null;
    }
  }

  return { attach, detach };
})();
