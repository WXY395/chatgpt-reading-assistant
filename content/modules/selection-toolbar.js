/**
 * CRASelectionToolbar — Floating toolbar on text selection
 *
 * Dependencies: CRAEventBus, CRAEvents, CRAUIHelpers, CRAMarkdown
 */
((required) => {
  for (const [name, ref] of Object.entries(required)) {
    if (!ref) throw new Error(`[CRA] ${name} not loaded — check manifest.json order`);
  }
})({
  CRAEventBus: window.CRAEventBus,
  CRAEvents: window.CRAEvents,
  CRAUIHelpers: window.CRAUIHelpers,
  CRAMarkdown: window.CRAMarkdown,
});

window.CRASelectionToolbar = {
  create(deps) {
    const eventBus = deps.eventBus;
    const Events = deps.events;
    const ui = deps.ui;
    const markdown = deps.markdown;
    const input = deps.input; // CRAInputIntegration instance

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
      input.insertPrompt(action, currentSelection.text, false);
      ui.showToast('已插入輸入框');
      hide();
    }

    function copyPlainText() {
      if (!currentSelection) return;
      navigator.clipboard.writeText(currentSelection.text).then(() => {
        ui.showToast('已複製');
      }).catch(() => ui.showToast('複製失敗'));
      hide();
    }

    function copyAsMarkdown() {
      if (!currentSelection) return;
      const md = extractMarkdownFromSelection();
      navigator.clipboard.writeText(md).then(() => {
        ui.showToast('已複製 Markdown');
      }).catch(() => ui.showToast('複製失敗'));
      hide();
    }

    function addToCitations() {
      if (!currentSelection) return;
      eventBus.emit(Events.CITATION_ADD, {
        text: currentSelection.text,
        source: document.title,
      });
      ui.showToast('已加入引文');
      hide();
    }

    function extractMarkdownFromSelection() {
      if (!currentSelection || !currentSelection.range) {
        return currentSelection ? currentSelection.text : '';
      }
      try {
        const fragment = currentSelection.range.cloneContents();
        const container = document.createElement('div');
        container.appendChild(fragment);
        return markdown.htmlToSimpleMarkdown(container);
      } catch (e) {
        return currentSelection.text;
      }
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
          e.preventDefault();
          e.stopPropagation();
          btn.action();
        });
        toolbar.appendChild(button);
      }

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

      let top = rect.bottom + TOOLBAR_MARGIN + window.scrollY;
      let left = rect.left + (rect.width - toolbarWidth) / 2 + window.scrollX;

      const viewportHeight = document.documentElement.clientHeight;
      if (rect.bottom + toolbarHeight + TOOLBAR_MARGIN > viewportHeight) {
        top = rect.top - toolbarHeight - TOOLBAR_MARGIN + window.scrollY;
      }

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

      unsubMade = eventBus.on(Events.SELECTION_MADE, (data) => {
        if (data.range && data.range.commonAncestorContainer) {
          const ancestor = data.range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
            ? data.range.commonAncestorContainer
            : data.range.commonAncestorContainer.parentElement;
          if (ancestor && ancestor.closest('[data-cra-ui]')) return;
        }
        show(data);
      });

      unsubCleared = eventBus.on(Events.SELECTION_CLEARED, () => {
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
      if (toolbar) { toolbar.remove(); toolbar = null; }
      clearTimeout(hideTimer);
      currentSelection = null;
    }

    function getDiagnostics() {
      return { enabled, toolbarCreated: !!toolbar, hasSelection: !!currentSelection };
    }

    return { init, update, destroy, getDiagnostics };
  },
};
