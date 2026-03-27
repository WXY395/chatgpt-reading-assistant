# ChatGPT Reading Assistant (CRA)

Enhance your ChatGPT reading experience with text selection tools, citation collection, and AI-powered quick actions.

## Features

### Selection Toolbar
Select any text in a ChatGPT conversation to reveal a floating toolbar with quick actions:
- **Collect** — Save text snippets to the citation clipboard for later reference
- **Explain / Simplify / Examples / Key Points** — Auto-generate prompts and insert into the input box
- **Copy / MD** — Copy as plain text or Markdown (preserves formatting)

### Citation Clipboard
Collect multiple text snippets across a conversation and manage them in a side panel:
- Multi-select with checkboxes — insert or copy only the quotes you need
- Auto-deduplication — identical quotes are skipped
- Persistent storage — quotes survive page reloads
- One-click insert into ChatGPT input box with contextual prompt framing

### Settings Panel
- Toggle individual modules on/off (takes effect immediately, no page refresh needed)
- Preview collected quotes
- Export quotes as JSON or Markdown
- View extension diagnostics

## Installation

### From source (Developer mode)
1. Clone or download this repository
2. Open `chrome://extensions/` in Chrome
3. Enable **Developer mode** (top right)
4. Click **Load unpacked** and select the project folder
5. Open [chatgpt.com](https://chatgpt.com) and start using

## Tech Stack

- Chrome Extension Manifest V3
- Vanilla JavaScript (IIFE module pattern)
- No external dependencies
- `chrome.storage.local` for persistence

## Architecture

```
content.js          Main content script
  CRADom            ChatGPT DOM selectors (multi-fallback)
  CRAModuleRegistry Module lifecycle (init/update/destroy)
  CRAMessageScanner MutationObserver message detection
  CRAInputIntegration ProseMirror input box integration
  CRASelectionTracker Text selection event tracking
  CRASelectionToolbar Floating toolbar on selection
  CRACitationClipboard Citation collection panel

utils/
  storage.js        CRAStorage (chrome.storage.local abstraction)
  event-bus.js      CRAEventBus (lightweight pub/sub)

popup.*             Extension settings UI
background.js       Service worker (message relay)
```

## Browser Support

- Google Chrome (latest)
- Chromium-based browsers (Edge, Brave, Arc, etc.)

## Permissions

- `storage` — Save quotes and settings locally
- Host access to `chatgpt.com` and `chat.openai.com`

No data is sent to external servers. All processing happens locally in your browser.

## License

MIT
