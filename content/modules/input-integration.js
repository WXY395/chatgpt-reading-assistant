/**
 * CRAInputIntegration — ProseMirror input box integration
 *
 * Handles text insertion, prompt generation, and send button triggering.
 *
 * Dependencies: CRADom
 */
((required) => {
  for (const [name, ref] of Object.entries(required)) {
    if (!ref) throw new Error(`[CRA] ${name} not loaded — check manifest.json order`);
  }
})({ CRADom: window.CRADom });

window.CRAInputIntegration = {
  create(deps) {
    const dom = deps.dom;

    /**
     * Insert text into ChatGPT's ProseMirror input box.
     * @param {string} text - Text to insert
     * @param {boolean} append - If true, append; if false, replace
     * @returns {boolean} Success
     */
    function insertText(text, append) {
      const editor = dom.getInputBox();
      if (!editor) {
        console.warn('[CRA InputIntegration] Input box not found');
        return false;
      }

      editor.focus();

      if (!append) {
        document.execCommand('selectAll');
        document.execCommand('delete');
      } else {
        const sel = window.getSelection();
        sel.selectAllChildren(editor);
        sel.collapseToEnd();
      }

      const success = document.execCommand('insertText', false, text);
      if (!success) return pasteText(editor, text);
      return true;
    }

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

    function triggerSend() {
      const btn = dom.getSendButton();
      if (btn && !btn.disabled && btn.offsetParent !== null) {
        btn.click();
        return true;
      }
      return false;
    }

    /**
     * Build prompt from template and insert into input box.
     * @param {string} action - 'explain' | 'simplify' | 'examples' | 'summarize'
     * @param {string} selectedText - Selected text
     * @param {boolean} autoSend - Auto-send after insert
     */
    function insertPrompt(action, selectedText, autoSend) {
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
        setTimeout(() => triggerSend(), 100);
      }
      return success;
    }

    function init() {}
    function update() {}
    function destroy() {}
    function getDiagnostics() {
      return {
        inputBoxFound: !!dom.getInputBox(),
        sendButtonFound: !!dom.getSendButton(),
      };
    }

    return { init, update, destroy, getDiagnostics, insertText, insertPrompt, triggerSend };
  },
};
