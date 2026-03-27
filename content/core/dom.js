/**
 * CRADom — ChatGPT DOM selectors and helpers
 *
 * All DOM queries use multi-fallback selector chains for resilience
 * against ChatGPT UI changes. Each query is wrapped in try/catch.
 *
 * Dependencies: none
 */
((required) => {
  for (const [name, ref] of Object.entries(required)) {
    if (!ref) throw new Error(`[CRA] ${name} not loaded — check manifest.json order`);
  }
})({});
// CRADom has no dependencies — assertion block is empty but kept for consistency

window.CRADom = (() => {
  // Multi-selector fallback chains

  const CONVERSATION_CONTAINER_SELECTORS = [
    'main [class*="react-scroll-to-bottom"]',
    'main[class*="conversation" i]',
    '[role="main"]',
    'main',
  ];

  const MESSAGE_TURN_SELECTOR =
    "article[data-testid^='conversation-turn-'], section[data-testid^='conversation-turn-']";

  const USER_ROLE_SELECTOR = 'div[data-message-author-role="user"]';
  const ASSISTANT_ROLE_SELECTOR = 'div[data-message-author-role="assistant"]';

  const INPUT_SELECTORS = [
    '#prompt-textarea',
    'div[contenteditable="true"][id*="prompt"]',
    'div.ProseMirror[contenteditable="true"]',
    'div[contenteditable="true"]',
  ];

  const SEND_BUTTON_SELECTORS = [
    'button[data-testid="send-button"]',
    'button[aria-label*="Send" i]',
    'form button[type="submit"]',
  ];

  const MARKDOWN_CONTENT_SELECTOR = '.markdown, .whitespace-pre-wrap';

  /**
   * Find element using a list of fallback selectors.
   * Each selector is tried in order; first match wins.
   */
  function queryFirst(selectors, root) {
    root = root || document;
    for (const sel of selectors) {
      try {
        const el = root.querySelector(sel);
        if (el) return el;
      } catch (e) {
        console.warn(`[CRA Dom] Selector failed: "${sel}"`, e);
      }
    }
    return null;
  }

  function getConversationContainer() {
    return queryFirst(CONVERSATION_CONTAINER_SELECTORS);
  }

  function getAllMessageTurns() {
    try {
      return document.querySelectorAll(MESSAGE_TURN_SELECTOR);
    } catch (e) {
      console.warn('[CRA Dom] Message turn query failed:', e);
      return [];
    }
  }

  function getMessageRole(turnElement) {
    if (turnElement.querySelector(USER_ROLE_SELECTOR)) return 'user';
    if (turnElement.querySelector(ASSISTANT_ROLE_SELECTOR)) return 'assistant';
    // Fallback: hidden h4 text
    const h4 = turnElement.querySelector('h4');
    if (h4) {
      const text = h4.textContent.toLowerCase();
      if (text.includes('you')) return 'user';
      if (text.includes('chatgpt') || text.includes('assistant')) return 'assistant';
    }
    return 'unknown';
  }

  function getMessageText(turnElement) {
    const md = turnElement.querySelector(MARKDOWN_CONTENT_SELECTOR);
    if (md) return md.textContent.trim();
    const roleDiv =
      turnElement.querySelector(ASSISTANT_ROLE_SELECTOR) ||
      turnElement.querySelector(USER_ROLE_SELECTOR);
    if (roleDiv) return roleDiv.textContent.trim();
    return turnElement.textContent.trim();
  }

  function getTurnIndex(turnElement) {
    const testId = turnElement.getAttribute('data-testid') || '';
    const match = testId.match(/conversation-turn-(\d+)/);
    return match ? parseInt(match[1], 10) : -1;
  }

  function getInputBox() {
    return queryFirst(INPUT_SELECTORS);
  }

  function getSendButton() {
    return queryFirst(SEND_BUTTON_SELECTORS);
  }

  function getScrollContainer() {
    const container = getConversationContainer();
    if (!container) return document.scrollingElement || document.documentElement;

    let parent = container;
    while (parent && parent !== document.body) {
      try {
        const style = getComputedStyle(parent);
        if (
          (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
          parent.scrollHeight > parent.clientHeight
        ) {
          return parent;
        }
      } catch (e) {
        // getComputedStyle can fail on disconnected nodes
      }
      parent = parent.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  function isStreamingActive() {
    try {
      return !!document.querySelector(
        '[data-testid="stop-button"], [data-testid="result-streaming-indicator"]'
      );
    } catch (e) {
      return false;
    }
  }

  return {
    CONVERSATION_CONTAINER_SELECTORS,
    MESSAGE_TURN_SELECTOR,
    MARKDOWN_CONTENT_SELECTOR,
    queryFirst,
    getConversationContainer,
    getAllMessageTurns,
    getMessageRole,
    getMessageText,
    getTurnIndex,
    getInputBox,
    getSendButton,
    getScrollContainer,
    isStreamingActive,
  };
})();
