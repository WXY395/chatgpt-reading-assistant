/**
 * CRACitationClipboard — Floating citation management panel
 *
 * Dependencies: CRAStorage, CRAEventBus, CRAEvents, CRAUIHelpers
 */
((required) => {
  for (const [name, ref] of Object.entries(required)) {
    if (!ref) throw new Error(`[CRA] ${name} not loaded — check manifest.json order`);
  }
})({
  CRAStorage: window.CRAStorage,
  CRAEventBus: window.CRAEventBus,
  CRAEvents: window.CRAEvents,
  CRAUIHelpers: window.CRAUIHelpers,
});

window.CRACitationClipboard = {
  create(deps) {
    const storage = deps.storage;
    const eventBus = deps.eventBus;
    const Events = deps.events;
    const ui = deps.ui;
    const input = deps.input; // CRAInputIntegration instance

    let panel = null;
    let toggleBtn = null;
    let quotes = [];
    let enabled = true;
    let visible = false;
    let unsubAdd = null;

    // ── Helpers ──

    function getSelectedQuotes() {
      if (!panel) return quotes;
      const checked = panel.querySelectorAll('.cra-quote-checkbox:checked');
      if (checked.length === 0) return quotes;
      const selectedIds = new Set([...checked].map((cb) => cb.getAttribute('data-id')));
      return quotes.filter((q) => selectedIds.has(q.id));
    }

    function quoteBlock(text) {
      return text.split('\n').filter((line) => line.trim() !== '').join('\n');
    }

    // ── Data ──

    async function loadQuotes() {
      quotes = await storage.getQuotes();
      renderList();
    }

    async function saveQuotes() {
      await storage.saveQuotes(quotes);
    }

    function addQuote(text, source) {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (quotes.some((q) => q.text === trimmed)) {
        ui.showToast('引文已存在');
        return;
      }

      const entry = storage.createQuoteEntry(trimmed, source || document.title);
      quotes.unshift(entry);
      saveQuotes();
      renderList();
      ui.showToast('已加入引文');
    }

    function removeQuote(id) {
      quotes = quotes.filter((q) => q.id !== id);
      saveQuotes();
      renderList();
    }

    function clearAll() {
      quotes = [];
      storage.clearQuotes();
      renderList();
    }

    // ── Panel DOM ──

    function createPanel() {
      if (panel) return;

      toggleBtn = document.createElement('button');
      toggleBtn.className = 'cra-citation-toggle';
      toggleBtn.setAttribute('data-cra-ui', 'true');
      toggleBtn.title = '引文剪貼簿';
      toggleBtn.innerHTML = `<span class="cra-citation-toggle-icon">📌</span><span class="cra-citation-badge" id="cra-badge">0</span>`;
      toggleBtn.addEventListener('click', toggle);
      document.body.appendChild(toggleBtn);

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

      panel.querySelector('[data-action="close"]').addEventListener('click', hide);
      panel.querySelector('[data-action="clear-all"]').addEventListener('click', () => {
        if (quotes.length === 0) return;
        clearAll();
        ui.showToast('已清除全部引文');
      });
      panel.querySelector('[data-action="copy-all"]').addEventListener('click', () => {
        const selected = getSelectedQuotes();
        if (selected.length === 0) return;
        const text = selected.map((q) => quoteBlock(q.text)).join('\n');
        navigator.clipboard.writeText(text).then(() =>
          ui.showToast(`已複製 ${selected.length} 段引文`)
        ).catch(() => ui.showToast('複製失敗'));
      });
      panel.querySelector('[data-action="insert-all"]').addEventListener('click', () => {
        const selected = getSelectedQuotes();
        if (selected.length === 0) return;
        const body = selected.map((q) => quoteBlock(q.text)).join('\n');
        const text = `我想引用以下這段內容：\n${body}\n請根據這段內容回答我接下來的問題：`;
        input.insertText(text, false);
        ui.showToast(`已插入 ${selected.length} 段引文`);
      });

      document.body.appendChild(panel);
    }

    function renderList() {
      if (!panel) return;

      const listEl = panel.querySelector('#cra-quote-list');
      const emptyEl = panel.querySelector('#cra-quote-empty');
      const badge = document.getElementById('cra-badge');

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
            <div class="cra-quote-text">${ui.escapeHtml(q.text)}</div>
            <div class="cra-quote-actions">
              <button class="cra-quote-btn cra-btn-danger" data-action="delete" title="刪除">✕</button>
            </div>
          </div>
        </div>
      `
        )
        .join('');

      listEl.querySelectorAll('[data-action="delete"]').forEach((btn) => {
        btn.addEventListener('click', (e) => {
          const item = e.target.closest('.cra-quote-item');
          const id = item?.getAttribute('data-id');
          if (id) removeQuote(id);
        });
      });
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

    function toggle() { visible ? hide() : show(); }

    // ── Lifecycle ──

    function init(settings) {
      enabled = settings.showQuotePanel !== false;
      if (!enabled) return;

      createPanel();
      loadQuotes();

      unsubAdd = eventBus.on(Events.CITATION_ADD, (data) => {
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

    return { init, update, destroy, getDiagnostics, addQuote, loadQuotes, show, hide, toggle };
  },
};
