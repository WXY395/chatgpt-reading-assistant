// CRA Popup Script

document.addEventListener('DOMContentLoaded', async () => {
  // Show version
  const manifest = chrome.runtime.getManifest();
  document.getElementById('version').textContent = `v${manifest.version}`;

  // Load settings
  const key = 'cra_settings';
  const result = await chrome.storage.local.get(key);
  const defaults = {
    extensionEnabled: true,
    showSelectionToolbar: true,
    showQuotePanel: true,
  };
  const settings = Object.assign({}, defaults, result[key] || {});

  // Bind toggles
  const toggleEnabled = document.getElementById('toggleEnabled');
  const toggleSelectionToolbar = document.getElementById('toggleSelectionToolbar');
  const toggleQuotePanel = document.getElementById('toggleQuotePanel');

  toggleEnabled.checked = settings.extensionEnabled;
  toggleSelectionToolbar.checked = settings.showSelectionToolbar;
  toggleQuotePanel.checked = settings.showQuotePanel;

  function saveAndNotify() {
    const updated = {
      extensionEnabled: toggleEnabled.checked,
      showSelectionToolbar: toggleSelectionToolbar.checked,
      showQuotePanel: toggleQuotePanel.checked,
    };
    chrome.storage.local.set({ [key]: updated });

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

  // Diagnostics
  document.getElementById('btnDiagnostics').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs[0]) return;
      chrome.tabs.sendMessage(tabs[0].id, { type: 'CRA_GET_DIAGNOSTICS' }, (response) => {
        const output = document.getElementById('diagnosticsOutput');
        if (response && response.diagnostics) {
          output.textContent = JSON.stringify(response.diagnostics, null, 2);
        } else {
          output.textContent = 'Unable to get diagnostics. Is ChatGPT page open?';
        }
        output.classList.add('visible');
      });
    });
  });

  // Export quotes
  document.getElementById('btnExportQuotes').addEventListener('click', async () => {
    const quotesKey = 'cra_quotes';
    const quotesResult = await chrome.storage.local.get(quotesKey);
    const quotes = quotesResult[quotesKey] || [];

    if (quotes.length === 0) {
      alert('No quotes to export.');
      return;
    }

    // Export as JSON
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cra-quotes-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // Clear quotes
  document.getElementById('btnClearQuotes').addEventListener('click', async () => {
    if (confirm('確定要清除所有引文嗎？此操作無法還原。')) {
      await chrome.storage.local.remove('cra_quotes');
      alert('引文已清除。');
    }
  });
});
