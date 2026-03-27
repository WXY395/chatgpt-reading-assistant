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
    // Collapse empty lines from selected text
    const cleaned = selectedText.split('\n').filter((l) => l.trim() !== '').join('\n');
    const templates = {
      explain: `請解釋以下內容：\n${cleaned}`,
      simplify: `請用更簡單的方式重新說明以下內容：\n${cleaned}`,
      examples: `請針對以下內容舉例說明：\n${cleaned}`,
      summarize: `請整理以下內容的要點：\n${cleaned}`,
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
// CRASelectionToolbar — Floating toolbar on text selection
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CRASelectionToolbar = (() => {
  let toolbar = null;
  let enabled = true;
  let currentSelection = null;
  let unsubMade = null;
  let unsubCleared = null;
  let hideTimer = null;

  const TOOLBAR_MARGIN = 8;

  // ── Button definitions ──

  const BUTTONS = [
    {
      id: 'add-quote',
      label: '收藏',
      icon: '📌',
      title: '加入引文剪貼簿（多段收集）',
      action: addToCitations,
    },
    { id: 'sep-1', separator: true },
    {
      id: 'explain',
      label: '解釋',
      icon: '💡',
      title: '請 AI 解釋這段內容',
      action: () => insertPromptAction('explain'),
    },
    {
      id: 'simplify',
      label: '簡化',
      icon: '✂️',
      title: '請 AI 用更簡單的方式說明',
      action: () => insertPromptAction('simplify'),
    },
    {
      id: 'examples',
      label: '舉例',
      icon: '📎',
      title: '請 AI 舉例說明',
      action: () => insertPromptAction('examples'),
    },
    {
      id: 'summarize',
      label: '要點',
      icon: '📊',
      title: '請 AI 整理要點',
      action: () => insertPromptAction('summarize'),
    },
    { id: 'sep-2', separator: true },
    {
      id: 'copy-text',
      label: '複製',
      icon: '📋',
      action: copyPlainText,
    },
    {
      id: 'copy-markdown',
      label: 'MD',
      icon: '📝',
      title: '複製為 Markdown（保留格式）',
      action: copyAsMarkdown,
    },
  ];

  // ── Actions ──

  function insertPromptAction(action) {
    if (!currentSelection) return;
    const text = currentSelection.text;
    CRAInputIntegration.insertPrompt(action, text, false);
    showToast('已插入輸入框');
    hide();
  }

  function copyPlainText() {
    if (!currentSelection) return;
    navigator.clipboard.writeText(currentSelection.text).then(() => {
      showToast('已複製');
    });
    hide();
  }

  function copyAsMarkdown() {
    if (!currentSelection) return;
    const md = extractMarkdownFromSelection();
    navigator.clipboard.writeText(md).then(() => {
      showToast('已複製 Markdown');
    });
    hide();
  }

  function addToCitations() {
    if (!currentSelection) return;
    CRAEventBus.emit('citation:add', {
      text: currentSelection.text,
      source: document.title,
    });
    showToast('已加入引文');
    hide();
  }

  /**
   * Try to extract Markdown from the selected HTML.
   * Falls back to plain text if extraction fails.
   */
  function extractMarkdownFromSelection() {
    if (!currentSelection || !currentSelection.range) {
      return currentSelection ? currentSelection.text : '';
    }
    try {
      const fragment = currentSelection.range.cloneContents();
      const container = document.createElement('div');
      container.appendChild(fragment);
      return htmlToSimpleMarkdown(container);
    } catch (e) {
      return currentSelection.text;
    }
  }

  /**
   * Minimal HTML-to-Markdown conversion for common ChatGPT elements.
   */
  function htmlToSimpleMarkdown(el) {
    let md = '';
    for (const node of el.childNodes) {
      if (node.nodeType === Node.TEXT_NODE) {
        md += node.textContent;
        continue;
      }
      if (node.nodeType !== Node.ELEMENT_NODE) continue;

      const tag = node.tagName.toLowerCase();
      const inner = htmlToSimpleMarkdown(node);

      switch (tag) {
        case 'strong':
        case 'b':
          md += `**${inner}**`;
          break;
        case 'em':
        case 'i':
          md += `*${inner}*`;
          break;
        case 'code':
          // Inline code vs code block
          if (node.parentElement && node.parentElement.tagName.toLowerCase() === 'pre') {
            md += inner;
          } else {
            md += `\`${inner}\``;
          }
          break;
        case 'pre':
          const lang = node.querySelector('code')?.className?.match(/language-(\w+)/)?.[1] || '';
          md += `\n\`\`\`${lang}\n${inner}\n\`\`\`\n`;
          break;
        case 'a':
          md += `[${inner}](${node.getAttribute('href') || ''})`;
          break;
        case 'h1': md += `\n# ${inner}\n`; break;
        case 'h2': md += `\n## ${inner}\n`; break;
        case 'h3': md += `\n### ${inner}\n`; break;
        case 'h4': md += `\n#### ${inner}\n`; break;
        case 'li':
          md += `- ${inner}\n`;
          break;
        case 'p':
          md += `${inner}\n\n`;
          break;
        case 'br':
          md += '\n';
          break;
        default:
          md += inner;
      }
    }
    return md.replace(/\n{3,}/g, '\n\n').trim();
  }

  // ── Toast notification ──

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cra-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    // Trigger animation
    requestAnimationFrame(() => toast.classList.add('cra-visible'));
    setTimeout(() => {
      toast.classList.remove('cra-visible');
      setTimeout(() => toast.remove(), 200);
    }, 1200);
  }

  // ── Toolbar DOM ──

  function createToolbar() {
    if (toolbar) return;
    toolbar = document.createElement('div');
    toolbar.className = 'cra-selection-toolbar';
    toolbar.setAttribute('data-cra-ui', 'true');

    for (const btn of BUTTONS) {
      if (btn.separator) {
        const sep = document.createElement('span');
        sep.className = 'cra-separator';
        toolbar.appendChild(sep);
        continue;
      }
      const button = document.createElement('button');
      button.className = 'cra-toolbar-btn';
      button.setAttribute('data-action', btn.id);
      button.title = btn.title || btn.label;
      button.innerHTML = `<span class="cra-btn-icon">${btn.icon}</span><span class="cra-btn-label">${btn.label}</span>`;
      button.addEventListener('mousedown', (e) => {
        e.preventDefault(); // Prevent selection from clearing
        e.stopPropagation();
        btn.action();
      });
      toolbar.appendChild(button);
    }

    // Prevent toolbar clicks from clearing selection
    toolbar.addEventListener('mousedown', (e) => e.preventDefault());

    document.body.appendChild(toolbar);
  }

  // ── Positioning ──

  function show(selectionData) {
    if (!enabled || !toolbar) return;
    currentSelection = selectionData;

    const rect = selectionData.rect;
    const toolbarWidth = 240;
    const toolbarHeight = 36;

    // Position BELOW the selection (avoid overlapping ChatGPT's native toolbar above)
    let top = rect.bottom + TOOLBAR_MARGIN + window.scrollY;
    let left = rect.left + (rect.width - toolbarWidth) / 2 + window.scrollX;

    // If toolbar would go below viewport, show above selection
    const viewportHeight = document.documentElement.clientHeight;
    if (rect.bottom + toolbarHeight + TOOLBAR_MARGIN > viewportHeight) {
      top = rect.top - toolbarHeight - TOOLBAR_MARGIN + window.scrollY;
    }

    // Clamp horizontal position within viewport
    const viewportWidth = document.documentElement.clientWidth;
    left = Math.max(TOOLBAR_MARGIN, Math.min(left, viewportWidth - toolbarWidth - TOOLBAR_MARGIN));

    toolbar.style.top = `${top}px`;
    toolbar.style.left = `${left}px`;

    clearTimeout(hideTimer);
    requestAnimationFrame(() => toolbar.classList.add('cra-visible'));
  }

  function hide() {
    if (!toolbar) return;
    toolbar.classList.remove('cra-visible');
    currentSelection = null;
  }

  // ── Lifecycle ──

  function init(settings) {
    enabled = settings.showSelectionToolbar !== false;
    if (!enabled) return;

    createToolbar();

    unsubMade = CRAEventBus.on('selection:made', (data) => {
      // Don't show toolbar if selecting within CRA UI
      if (data.range && data.range.commonAncestorContainer) {
        const ancestor = data.range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
          ? data.range.commonAncestorContainer
          : data.range.commonAncestorContainer.parentElement;
        if (ancestor && ancestor.closest('[data-cra-ui]')) return;
      }
      show(data);
    });

    unsubCleared = CRAEventBus.on('selection:cleared', () => {
      // Small delay to allow toolbar button clicks to register
      hideTimer = setTimeout(() => hide(), 150);
    });
  }

  function update(settings) {
    const wasEnabled = enabled;
    enabled = settings.showSelectionToolbar !== false;
    if (!wasEnabled && enabled) {
      createToolbar();
    } else if (wasEnabled && !enabled) {
      destroy();
    }
  }

  function destroy() {
    if (unsubMade) { unsubMade(); unsubMade = null; }
    if (unsubCleared) { unsubCleared(); unsubCleared = null; }
    if (toolbar) {
      toolbar.remove();
      toolbar = null;
    }
    clearTimeout(hideTimer);
    currentSelection = null;
  }

  function getDiagnostics() {
    return { enabled, toolbarCreated: !!toolbar, hasSelection: !!currentSelection };
  }

  return { init, update, destroy, getDiagnostics };
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// CRACitationClipboard — Floating citation management panel
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const CRACitationClipboard = (() => {
  let panel = null;
  let toggleBtn = null;
  let quotes = [];
  let enabled = true;
  let visible = false;
  let unsubAdd = null;

  // ── Helpers ──

  /** Get selected quotes (checked), or all if none checked */
  function getSelectedQuotes() {
    if (!panel) return quotes;
    const checked = panel.querySelectorAll('.cra-quote-checkbox:checked');
    if (checked.length === 0) return quotes;
    const selectedIds = new Set([...checked].map((cb) => cb.getAttribute('data-id')));
    return quotes.filter((q) => selectedIds.has(q.id));
  }

  /** Clean quote text: collapse empty lines */
  function quoteBlock(text) {
    return text
      .split('\n')
      .filter((line) => line.trim() !== '')
      .join('\n');
  }

  // ── Data ──

  async function loadQuotes() {
    quotes = await CRAStorage.getQuotes();
    renderList();
  }

  async function saveQuotes() {
    await CRAStorage.saveQuotes(quotes);
  }

  function addQuote(text, source) {
    // Dedup: skip if identical text already exists
    const trimmed = text.trim();
    if (!trimmed) return;
    if (quotes.some((q) => q.text === trimmed)) {
      CRASelectionToolbar.showToast
        ? null
        : console.log('[CRA] Duplicate quote skipped');
      // Show toast via a simple emit
      showToast('引文已存在');
      return;
    }

    const entry = CRAStorage.createQuoteEntry(trimmed, source || document.title);
    quotes.unshift(entry);
    saveQuotes();
    renderList();
    showToast('已加入引文');
  }

  function removeQuote(id) {
    quotes = quotes.filter((q) => q.id !== id);
    saveQuotes();
    renderList();
  }

  function clearAll() {
    quotes = [];
    CRAStorage.clearQuotes();
    renderList();
  }

  // ── Toast (reuse from toolbar if available) ──

  function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'cra-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('cra-visible'));
    setTimeout(() => {
      toast.classList.remove('cra-visible');
      setTimeout(() => toast.remove(), 200);
    }, 1200);
  }

  // ── Panel DOM ──

  function createPanel() {
    if (panel) return;

    // Toggle button (always visible at right edge)
    toggleBtn = document.createElement('button');
    toggleBtn.className = 'cra-citation-toggle';
    toggleBtn.setAttribute('data-cra-ui', 'true');
    toggleBtn.title = '引文剪貼簿';
    toggleBtn.innerHTML = `<span class="cra-citation-toggle-icon">📌</span><span class="cra-citation-badge" id="cra-badge">0</span>`;
    toggleBtn.addEventListener('click', toggle);
    document.body.appendChild(toggleBtn);

    // Panel
    panel = document.createElement('div');
    panel.className = 'cra-citation-panel';
    panel.setAttribute('data-cra-ui', 'true');

    panel.innerHTML = `
      <div class="cra-panel-header">
        <span class="cra-panel-title">📌 引文剪貼簿</span>
        <div class="cra-panel-actions">
          <button class="cra-panel-btn" data-action="insert-all" title="全部插入輸入框">⬇️ 插入</button>
          <button class="cra-panel-btn" data-action="copy-all" title="全部複製">📋</button>
          <button class="cra-panel-btn cra-btn-danger" data-action="clear-all" title="清除全部">🗑️</button>
          <button class="cra-panel-btn" data-action="close" title="關閉">✕</button>
        </div>
      </div>
      <div class="cra-panel-list" id="cra-quote-list"></div>
      <div class="cra-panel-empty" id="cra-quote-empty">尚無引文。選取文字後點擊 📌 加入。</div>
    `;

    // Header button handlers
    panel.querySelector('[data-action="close"]').addEventListener('click', hide);
    panel.querySelector('[data-action="clear-all"]').addEventListener('click', () => {
      if (quotes.length === 0) return;
      clearAll();
      showToast('已清除全部引文');
    });
    panel.querySelector('[data-action="copy-all"]').addEventListener('click', () => {
      const selected = getSelectedQuotes();
      if (selected.length === 0) return;
      const text = selected.map((q) => quoteBlock(q.text)).join('\n');
      navigator.clipboard.writeText(text).then(() =>
        showToast(`已複製 ${selected.length} 段引文`)
      );
    });
    panel.querySelector('[data-action="insert-all"]').addEventListener('click', () => {
      const selected = getSelectedQuotes();
      if (selected.length === 0) return;
      const body = selected.map((q) => quoteBlock(q.text)).join('\n');
      const text = `我想引用以下這段內容：\n${body}\n請根據這段內容回答我接下來的問題：`;
      CRAInputIntegration.insertText(text, false);
      showToast(`已插入 ${selected.length} 段引文`);
    });

    document.body.appendChild(panel);
  }

  function renderList() {
    if (!panel) return;

    const listEl = panel.querySelector('#cra-quote-list');
    const emptyEl = panel.querySelector('#cra-quote-empty');
    const badge = document.getElementById('cra-badge');

    // Update badge
    if (badge) {
      badge.textContent = quotes.length;
      badge.style.display = quotes.length > 0 ? '' : 'none';
    }

    if (quotes.length === 0) {
      listEl.innerHTML = '';
      emptyEl.style.display = 'block';
      return;
    }

    emptyEl.style.display = 'none';

    listEl.innerHTML = quotes
      .map(
        (q) => `
      <div class="cra-quote-item" data-id="${q.id}">
        <label class="cra-quote-check">
          <input type="checkbox" class="cra-quote-checkbox" data-id="${q.id}">
        </label>
        <div class="cra-quote-body">
          <div class="cra-quote-text">${escapeHtml(q.text)}</div>
          <div class="cra-quote-actions">
            <button class="cra-quote-btn cra-btn-danger" data-action="delete" title="刪除">✕</button>
          </div>
        </div>
      </div>
    `
      )
      .join('');

    // Delete button handlers
    listEl.querySelectorAll('[data-action="delete"]').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const item = e.target.closest('.cra-quote-item');
        const id = item?.getAttribute('data-id');
        if (id) removeQuote(id);
      });
    });
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ── Show / Hide / Toggle ──

  function show() {
    if (!panel) return;
    visible = true;
    panel.classList.add('cra-visible');
    toggleBtn.classList.add('cra-active');
  }

  function hide() {
    if (!panel) return;
    visible = false;
    panel.classList.remove('cra-visible');
    toggleBtn.classList.remove('cra-active');
  }

  function toggle() {
    visible ? hide() : show();
  }

  // ── Lifecycle ──

  function init(settings) {
    enabled = settings.showQuotePanel !== false;
    if (!enabled) return;

    createPanel();
    loadQuotes();

    // Listen for citations from SelectionToolbar
    unsubAdd = CRAEventBus.on('citation:add', (data) => {
      addQuote(data.text, data.source);
    });
  }

  function update(settings) {
    const wasEnabled = enabled;
    enabled = settings.showQuotePanel !== false;
    if (!wasEnabled && enabled) {
      createPanel();
      loadQuotes();
    } else if (wasEnabled && !enabled) {
      destroy();
    }
  }

  function destroy() {
    if (unsubAdd) { unsubAdd(); unsubAdd = null; }
    if (panel) { panel.remove(); panel = null; }
    if (toggleBtn) { toggleBtn.remove(); toggleBtn = null; }
    visible = false;
  }

  function getDiagnostics() {
    return { enabled, visible, quoteCount: quotes.length };
  }

  return { init, update, destroy, getDiagnostics, addQuote, show, hide, toggle };
})();

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// ChatGPTReadingAssistant — Main Orchestrator
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
const ChatGPTReadingAssistant = (() => {
  let settings = null;
  let initialized = false;
  let lastUrl = '';
  let navigationObserver = null;

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
    CRAModuleRegistry.register('selectionToolbar', CRASelectionToolbar);
    CRAModuleRegistry.register('citationClipboard', CRACitationClipboard);

    // Init all modules
    CRAModuleRegistry.initAll(settings);

    // Listen for settings updates from popup
    chrome.runtime.onMessage.addListener(handleMessage);

    // Watch for SPA navigation (ChatGPT is a SPA — URL changes without page reload)
    lastUrl = window.location.href;
    startNavigationWatch();

    // Log diagnostics after a short delay to let React render
    setTimeout(() => logDiagnostics(), 1500);

    initialized = true;
    console.log('[CRA] Initialization complete');
  }

  /**
   * Watch for SPA navigation by monitoring URL changes.
   * When URL changes, re-scan messages and re-attach observers.
   */
  function startNavigationWatch() {
    // Method 1: Listen for popstate (back/forward)
    window.addEventListener('popstate', onNavigate);

    // Method 2: Observe DOM changes in <title> or use polling as fallback
    // ChatGPT uses pushState for navigation, which doesn't fire popstate
    navigationObserver = setInterval(() => {
      if (window.location.href !== lastUrl) {
        lastUrl = window.location.href;
        onNavigate();
      }
    }, 500);
  }

  function onNavigate() {
    console.log('[CRA] Navigation detected:', window.location.href);
    // Re-initialize message scanner (re-attach observer to new container)
    setTimeout(() => {
      CRAMessageScanner.update();
      console.log('[CRA] Post-navigation rescan:', CRAMessageScanner.getMessageCount(), 'messages');
    }, 800);
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
    window.removeEventListener('popstate', onNavigate);
    if (navigationObserver) {
      clearInterval(navigationObserver);
      navigationObserver = null;
    }
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
