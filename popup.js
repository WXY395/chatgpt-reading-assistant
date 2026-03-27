// CRA Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  const SETTINGS_KEY = 'cra_settings';
  const QUOTES_KEY = 'cra_quotes';

  // Show version
  const manifest = chrome.runtime.getManifest();
  document.getElementById('version').textContent = `v${manifest.version}`;

  // ── Load settings ──

  const defaults = {
    extensionEnabled: true,
    showSelectionToolbar: true,
    showQuotePanel: true,
  };
  const result = await chrome.storage.local.get(SETTINGS_KEY);
  const settings = Object.assign({}, defaults, result[SETTINGS_KEY] || {});

  // ── Bind toggles ──

  const toggleEnabled = document.getElementById('toggleEnabled');
  const toggleSelectionToolbar = document.getElementById('toggleSelectionToolbar');
  const toggleQuotePanel = document.getElementById('toggleQuotePanel');
  const sectionModules = document.getElementById('sectionModules');
  const sectionQuotes = document.getElementById('sectionQuotes');

  toggleEnabled.checked = settings.extensionEnabled;
  toggleSelectionToolbar.checked = settings.showSelectionToolbar;
  toggleQuotePanel.checked = settings.showQuotePanel;

  updateDisabledState();

  function updateDisabledState() {
    const disabled = !toggleEnabled.checked;
    sectionModules.classList.toggle('disabled', disabled);
    sectionQuotes.classList.toggle('disabled', disabled);
    toggleSelectionToolbar.disabled = disabled;
    toggleQuotePanel.disabled = disabled;
  }

  function saveAndNotify() {
    const updated = {
      extensionEnabled: toggleEnabled.checked,
      showSelectionToolbar: toggleSelectionToolbar.checked,
      showQuotePanel: toggleQuotePanel.checked,
    };
    chrome.storage.local.set({ [SETTINGS_KEY]: updated });
    updateDisabledState();

    // Notify content script
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, {
          type: 'CRA_UPDATE_SETTINGS',
          settings: updated,
        });
      }
    });
  }

  toggleEnabled.addEventListener('change', saveAndNotify);
  toggleSelectionToolbar.addEventListener('change', saveAndNotify);
  toggleQuotePanel.addEventListener('change', saveAndNotify);

  // ── Load and display quotes ──

  async function loadQuotes() {
    const quotesResult = await chrome.storage.local.get(QUOTES_KEY);
    return quotesResult[QUOTES_KEY] || [];
  }

  async function renderQuotePreview() {
    const quotes = await loadQuotes();
    const countEl = document.getElementById('quoteCount');
    const previewEl = document.getElementById('quotePreview');

    countEl.textContent = quotes.length > 0 ? `(${quotes.length})` : '';

    if (quotes.length === 0) {
      previewEl.innerHTML = '<div class="quote-empty">尚無引文</div>';
      return;
    }

    previewEl.innerHTML = quotes
      .map(
        (q) =>
          `<div class="quote-item">
            <span class="quote-text">${escapeHtml(q.text)}</span>
            <span class="quote-date">${formatDate(q.createdAt)}</span>
          </div>`
      )
      .join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function formatDate(ts) {
    if (!ts) return '';
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  }

  renderQuotePreview();

  // ── Export JSON ──

  document.getElementById('btnExportJson').addEventListener('click', async () => {
    const quotes = await loadQuotes();
    if (quotes.length === 0) { alert('尚無引文可匯出。'); return; }

    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    downloadBlob(blob, `cra-quotes-${dateStr()}.json`);
  });

  // ── Export Markdown ──

  document.getElementById('btnExportMd').addEventListener('click', async () => {
    const quotes = await loadQuotes();
    if (quotes.length === 0) { alert('尚無引文可匯出。'); return; }

    const lines = [
      `# CRA 引文匯出`,
      `> ${dateStr()}`,
      '',
      ...quotes.map((q, i) => {
        const date = q.createdAt ? new Date(q.createdAt).toLocaleString('zh-TW') : '';
        return `## ${i + 1}.\n\n${q.text}\n\n*${date}*\n`;
      }),
    ];
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    downloadBlob(blob, `cra-quotes-${dateStr()}.md`);
  });

  // ── Clear quotes ──

  document.getElementById('btnClearQuotes').addEventListener('click', async () => {
    const quotes = await loadQuotes();
    if (quotes.length === 0) { alert('尚無引文。'); return; }
    if (!confirm(`確定要清除全部 ${quotes.length} 條引文嗎？此操作無法還原。`)) return;
    await chrome.storage.local.remove(QUOTES_KEY);
    renderQuotePreview();
    // Notify content script to refresh citation panel
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        chrome.tabs.sendMessage(tabs[0].id, { type: 'CRA_QUOTES_CLEARED' });
      }
    });
  });

  // ── Diagnostics ──

  document.getElementById('btnDiagnostics').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { type: 'CRA_GET_DIAGNOSTICS' }, (response) => {
        const output = document.getElementById('diagnosticsOutput');
        if (response && response.diagnostics) {
          output.textContent = JSON.stringify(response.diagnostics, null, 2);
        } else {
          output.textContent = '無法取得診斷資訊。請確認 ChatGPT 頁面已開啟。';
        }
        output.classList.toggle('visible');
      });
    });
  });

  // ── Helpers ──

  function dateStr() {
    return new Date().toISOString().slice(0, 10);
  }

  function downloadBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }
});
