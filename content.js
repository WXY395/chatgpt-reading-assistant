/**
 * ChatGPT Reading Assistant — Main Content Script
 *
 * Architecture:
 *   CRAStorage (utils/storage.js)  — persistent storage
 *   CRAEventBus (utils/event-bus.js) — pub/sub
 *   CRADom          — ChatGPT DOM selectors & helpers
 *   CRAModuleRegistry — module lifecycle management
 *   CRAMessageScanner — message detection & indexing
 *   CRAInputIntegration — ProseMirror input box integration
 *   CRASelectionTracker — text selection event tracking
 *   ChatGPTReadingAssistant — main orchestrator
 */

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CRADom — ChatGPT DOM selectors and helpers
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CRADom = (() => {
  // Multi-selector fallback chains for resilience against DOM changes

  const CONVERSATION_CONTAINER_SELECTORS = [
    'main [class*="react-scroll-to-bottom"]',
    'main[class*="conversation" i]',
    '[role="main"]',
    'main',
  ];

  // ChatGPT uses article or section for conversation turns
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
   * Find element using a list of fallback selectors
   */
  function queryFirst(selectors, root) {
    root = root || document;
    for (const sel of selectors) {
      const el = root.querySelector(sel);
      if (el) return el;
    }
    return null;
  }

  function getConversationContainer() {
    return queryFirst(CONVERSATION_CONTAINER_SELECTORS);
  }

  function getAllMessageTurns() {
    return document.querySelectorAll(MESSAGE_TURN_SELECTOR);
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
    // Fallback: role content div
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
    // Walk up from conversation container to find scrollable parent
    const container = getConversationContainer();
    if (!container) return document.scrollingElement || document.documentElement;

    let parent = container;
    while (parent && parent !== document.body) {
      const style = getComputedStyle(parent);
      if (
        (style.overflowY === 'auto' || style.overflowY === 'scroll') &&
        parent.scrollHeight > parent.clientHeight
      ) {
        return parent;
      }
      parent = parent.parentElement;
    }
    return document.scrollingElement || document.documentElement;
  }

  function isStreamingActive() {
    return !!document.querySelector(
      '[data-testid="stop-button"], [data-testid="result-streaming-indicator"]'
    );
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

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CRAModuleRegistry — Module lifecycle management
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CRAModuleRegistry = (() => {
  const modules = new Map();

  /**
   * Register a module. Module must implement:
   *   init(settings) — first-time setup
   *   update(settings) — settings changed
   *   destroy() — teardown
   *   getDiagnostics() — debug info (optional)
   */
  function register(name, moduleObj) {
    if (modules.has(name)) {
      console.warn(`[CRA] Module "${name}" already registered, replacing.`);
    }
    modules.set(name, { module: moduleObj, initialized: false });
  }

  function initAll(settings) {
    for (const [name, entry] of modules) {
      try {
        entry.module.init(settings);
        entry.initialized = true;
        console.log(`[CRA] Module "${name}" initialized`);
      } catch (e) {
        console.error(`[CRA] Failed to init module "${name}":`, e);
      }
    }
  }

  function updateAll(settings) {
    for (const [name, entry] of modules) {
      if (entry.initialized) {
        try {
          entry.module.update(settings);
        } catch (e) {
          console.error(`[CRA] Failed to update module "${name}":`, e);
        }
      }
    }
  }

  function destroyAll() {
    for (const [name, entry] of modules) {
      if (entry.initialized) {
        try {
          entry.module.destroy();
          entry.initialized = false;
        } catch (e) {
          console.error(`[CRA] Failed to destroy module "${name}":`, e);
        }
      }
    }
  }

  function get(name) {
    const entry = modules.get(name);
    return entry ? entry.module : null;
  }

  function getDiagnostics() {
    const diag = {};
    for (const [name, entry] of modules) {
      diag[name] = {
        initialized: entry.initialized,
        diagnostics: entry.initialized && entry.module.getDiagnostics
          ? entry.module.getDiagnostics()
          : null,
      };
    }
    return diag;
  }

  return { register, initAll, updateAll, destroyAll, get, getDiagnostics };
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CRAMessageScanner — Message detection and indexing
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CRAMessageScanner = (() => {
  let messages = [];
  let observer = null;
  let rescanTimer = null;
  const DEBOUNCE_MS = 300;

  function scan() {
    const turns = CRADom.getAllMessageTurns();
    messages = [];

    turns.forEach((turn, i) => {
      const role = CRADom.getMessageRole(turn);
      const text = CRADom.getMessageText(turn);
      const turnIndex = CRADom.getTurnIndex(turn);

      // Mark element for easy lookup
      turn.setAttribute('data-cra-index', i);

      messages.push({
        index: i,
        turnIndex,
        role,
        text: text.slice(0, 200), // truncate for index
        element: turn,
      });
    });

    CRAEventBus.emit('messages:scanned', { count: messages.length, messages });
    return messages;
  }

  function getMessages() {
    return messages;
  }

  function getMessageCount() {
    return messages.length;
  }

  function startObserving() {
    if (observer) return;

    const target = CRADom.getConversationContainer() || document.body;

    observer = new MutationObserver(() => {
      clearTimeout(rescanTimer);
      rescanTimer = setTimeout(() => {
        scan();
      }, DEBOUNCE_MS);
    });

    observer.observe(target, {
      childList: true,
      subtree: true,
    });

    // Initial scan
    scan();
  }

  function stopObserving() {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    clearTimeout(rescanTimer);
  }

  function init() {
    startObserving();
  }

  function update() {
    // Re-attach observer if container changed
    stopObserving();
    startObserving();
  }

  function destroy() {
    stopObserving();
    messages = [];
  }

  function getDiagnostics() {
    return {
      messageCount: messages.length,
      observing: !!observer,
      containerFound: !!CRADom.getConversationContainer(),
    };
  }

  return { init, update, destroy, getDiagnostics, scan, getMessages, getMessageCount };
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CRAInputIntegration — ProseMirror input box integration
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CRAInputIntegration = (() => {

  /**
   * Insert text into ChatGPT's ProseMirror input box.
   * Uses execCommand('insertText') which triggers ProseMirror's internal transaction.
   * @param {string} text - Text to insert
   * @param {boolean} append - If true, append to existing content; if false, replace
   * @returns {boolean} Success
   */
  function insertText(text, append) {
    const editor = CRADom.getInputBox();
    if (!editor) {
      console.warn('[CRA InputIntegration] Input box not found');
      return false;
    }

    editor.focus();

    if (!append) {
      // Select all existing content and delete
      document.execCommand('selectAll');
      document.execCommand('delete');
    } else {
      // Move cursor to end
      const sel = window.getSelection();
      sel.selectAllChildren(editor);
      sel.collapseToEnd();
    }

    // Insert via execCommand (ProseMirror-compatible)
    const success = document.execCommand('insertText', false, text);

    if (!success) {
      // Fallback: clipboard paste simulation
      return pasteText(editor, text);
    }

    return true;
  }

  /**
   * Fallback: simulate paste event
   */
  function pasteText(editor, text) {
    try {
      const clipboardData = new DataTransfer();
      clipboardData.setData('text/plain', text);
      const pasteEvent = new ClipboardEvent('paste', {
        bubbles: true,
        cancelable: true,
        clipboardData,
      });
      editor.dispatchEvent(pasteEvent);
      return true;
    } catch (e) {
      console.error('[CRA InputIntegration] Paste fallback failed:', e);
      return false;
    }
  }

  /**
   * Click the send button
   * @returns {boolean} Success
   */
  function triggerSend() {
    const btn = CRADom.getSendButton();
    if (btn && !btn.disabled && btn.offsetParent !== null) {
      btn.click();
      return true;
    }
    return false;
  }

  /**
   * Build a prompt from template and selection, then insert
   * @param {string} action - e.g. 'explain', 'simplify', 'examples', 'summarize'
   * @param {string} selectedText - The selected text
   * @param {boolean} autoSend - Whether to auto-send
   */
  function insertPrompt(action, selectedText, autoSend) {
    const templates = {
      explain: `請解釋以下內容：\n\n「${selectedText}」`,
      simplify: `請用更簡單的方式重新說明以下內容：\n\n「${selectedText}」`,
      examples: `請針對以下內容舉例說明：\n\n「${selectedText}」`,
      summarize: `請整理以下內容的要點：\n\n「${selectedText}」`,
    };

    const prompt = templates[action] || selectedText;
    const success = insertText(prompt, false);

    if (success && autoSend) {
      // Small delay to let ProseMirror process the input
      setTimeout(() => triggerSend(), 100);
    }

    return success;
  }

  function init() {}
  function update() {}
  function destroy() {}

  function getDiagnostics() {
    return {
      inputBoxFound: !!CRADom.getInputBox(),
      sendButtonFound: !!CRADom.getSendButton(),
    };
  }

  return { init, update, destroy, getDiagnostics, insertText, insertPrompt, triggerSend };
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CRASelectionTracker — Text selection event tracking
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CRASelectionTracker = (() => {
  let active = false;
  let debounceTimer = null;
  const DEBOUNCE_MS = 200;

  function handleMouseUp() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed || !selection.toString().trim()) {
        CRAEventBus.emit('selection:cleared');
        return;
      }

      const text = selection.toString().trim();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      // Check if selection is within conversation area
      const container = CRADom.getConversationContainer();
      if (container && !container.contains(range.commonAncestorContainer)) {
        return; // Selection outside conversation
      }

      CRAEventBus.emit('selection:made', {
        text,
        rect: {
          top: rect.top,
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          width: rect.width,
          height: rect.height,
        },
        range,
      });
    }, DEBOUNCE_MS);
  }

  function handleSelectionChange() {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        CRAEventBus.emit('selection:cleared');
      }, 100);
    }
  }

  function init() {
    if (active) return;
    document.addEventListener('mouseup', handleMouseUp, true);
    document.addEventListener('selectionchange', handleSelectionChange, true);
    active = true;
  }

  function update() {}

  function destroy() {
    document.removeEventListener('mouseup', handleMouseUp, true);
    document.removeEventListener('selectionchange', handleSelectionChange, true);
    clearTimeout(debounceTimer);
    active = false;
  }

  function getDiagnostics() {
    return { active };
  }

  return { init, update, destroy, getDiagnostics };
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ChatGPTReadingAssistant — Main Orchestrator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChatGPTReadingAssistant = (() => {
  let settings = null;
  let initialized = false;

  function isSupportedPage() {
    const host = window.location.hostname;
    return host === 'chatgpt.com' || host === 'chat.openai.com';
  }

  async function init() {
    if (initialized) return;
    if (!isSupportedPage()) {
      console.log('[CRA] Not a supported page, skipping init');
      return;
    }

    console.log('[CRA] Initializing ChatGPT Reading Assistant...');

    // Load settings
    settings = await CRAStorage.getSettings();

    if (!settings.extensionEnabled) {
      console.log('[CRA] Extension disabled in settings');
      return;
    }

    // Register core modules
    CRAModuleRegistry.register('messageScanner', CRAMessageScanner);
    CRAModuleRegistry.register('inputIntegration', CRAInputIntegration);
    CRAModuleRegistry.register('selectionTracker', CRASelectionTracker);

    // Init all modules
    CRAModuleRegistry.initAll(settings);

    // Listen for settings updates from popup
    chrome.runtime.onMessage.addListener(handleMessage);

    // Log diagnostics
    logDiagnostics();

    initialized = true;
    console.log('[CRA] Initialization complete');
  }

  function handleMessage(message, sender, sendResponse) {
    switch (message.type) {
      case 'CRA_UPDATE_SETTINGS':
        onSettingsUpdate(message.settings);
        sendResponse({ success: true });
        break;

      case 'CRA_GET_SETTINGS':
        sendResponse({ settings });
        break;

      case 'CRA_GET_DIAGNOSTICS':
        sendResponse({ diagnostics: CRAModuleRegistry.getDiagnostics() });
        break;

      case 'CRA_INSERT_TEXT':
        const success = CRAInputIntegration.insertText(message.text, message.append);
        sendResponse({ success });
        break;

      case 'CRA_SCAN_MESSAGES':
        const msgs = CRAMessageScanner.scan();
        sendResponse({
          messages: msgs.map((m) => ({
            index: m.index,
            turnIndex: m.turnIndex,
            role: m.role,
            text: m.text,
          })),
        });
        break;

      default:
        return false;
    }
    return true;
  }

  async function onSettingsUpdate(newSettings) {
    settings = await CRAStorage.saveSettings(newSettings);
    CRAModuleRegistry.updateAll(settings);

    if (!settings.extensionEnabled) {
      CRAModuleRegistry.destroyAll();
    }
  }

  function logDiagnostics() {
    const diag = CRAModuleRegistry.getDiagnostics();
    console.log('[CRA] Diagnostics:', JSON.stringify(diag, null, 2));

    // Also log key DOM element detection
    console.log('[CRA] DOM Detection:', {
      conversationContainer: !!CRADom.getConversationContainer(),
      inputBox: !!CRADom.getInputBox(),
      sendButton: !!CRADom.getSendButton(),
      messageTurns: CRADom.getAllMessageTurns().length,
      isStreaming: CRADom.isStreamingActive(),
    });
  }

  function destroy() {
    CRAModuleRegistry.destroyAll();
    chrome.runtime.onMessage.removeListener(handleMessage);
    initialized = false;
  }

  return { init, destroy, logDiagnostics };
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Bootstrap
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => ChatGPTReadingAssistant.init());
} else {
  ChatGPTReadingAssistant.init();
}
