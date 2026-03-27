# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly:

1. **Do NOT open a public issue.**
2. Email: [TODO: Add security contact email]
3. Include: description, reproduction steps, and potential impact.
4. We will respond within 72 hours.

## Security Model

### What CRA Does
- Injects a content script into `chatgpt.com` and `chat.openai.com` pages
- Reads selected text from the page DOM
- Stores quotes and settings in `chrome.storage.local`
- Communicates between popup and content script via `chrome.runtime.sendMessage`

### What CRA Does NOT Do
- **No network calls** — CRA never uses `fetch()`, `XMLHttpRequest`, or any networking API
- **No data exfiltration** — No data leaves the browser under any circumstances
- **No remote code execution** — No `eval()`, no dynamic script loading
- **No cross-origin access** — Only operates on `chatgpt.com` and `chat.openai.com`
- **No cookie access** — Does not read or modify cookies
- **No clipboard monitoring** — Only writes to clipboard when user explicitly clicks "Copy"

### Permissions Audit

| Permission | Scope | Risk Level | Justification |
|-----------|-------|------------|---------------|
| `storage` | Extension-only | Low | Save settings and quotes locally |
| `chatgpt.com/*` | Host permission | Medium | Required to inject content script |
| `chat.openai.com/*` | Host permission | Medium | Legacy domain support |

**No broad permissions:** CRA does not request `tabs`, `webRequest`, `activeTab`, `identity`, `cookies`, or any other permission.

### Content Script Isolation
- CRA's content script runs in Chrome's isolated world
- It cannot access page-level JavaScript variables
- It cannot be accessed by page-level JavaScript
- DOM interactions are read-only (except inserting text into the input box via `execCommand`)

### Storage Security
- All data is stored in `chrome.storage.local`, which is:
  - Accessible only to this extension
  - Not synced to any cloud service
  - Not readable by websites or other extensions
  - Deleted when the extension is uninstalled

## Known Risks and Mitigations

### Risk 1: DOM Selector Dependency
**Risk:** CRA depends on ChatGPT's DOM structure. A malicious page could theoretically spoof ChatGPT's DOM.
**Mitigation:** CRA only activates on `chatgpt.com` and `chat.openai.com` (enforced by `manifest.json` host permissions). It cannot be triggered on other domains.

### Risk 2: XSS via Stored Quotes
**Risk:** If a malicious string is saved as a quote and rendered as HTML, it could execute scripts.
**Mitigation:** All quote text is escaped via `textContent` assignment before rendering. The `escapeHtml()` function is used for any `innerHTML` operations.

### Risk 3: execCommand Deprecation
**Risk:** `document.execCommand('insertText')` is deprecated and may be removed.
**Mitigation:** CRA includes a fallback using `ClipboardEvent` simulation. If both fail, the operation is silently skipped (no crash).

## Verification

You can verify CRA's security claims yourself:

1. **Search for network calls:**
   ```bash
   grep -rn "fetch\|XMLHttpRequest\|navigator.sendBeacon\|WebSocket" content.js utils/
   ```
   Expected: zero results.

2. **Search for eval:**
   ```bash
   grep -rn "eval\|Function(" content.js utils/
   ```
   Expected: zero results.

3. **Check permissions:**
   Open `manifest.json` — only `storage` and two specific host permissions.

4. **Monitor network:**
   Open DevTools → Network tab → filter by the extension's ID. Expected: zero requests.
