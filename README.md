<p align="center">
  <img src="icons/icon128.png" width="80" alt="CRA icon">
</p>

<h1 align="center">ChatGPT Reading Assistant</h1>

<p align="center">
  <strong>Stop losing insights buried in long ChatGPT conversations.</strong><br>
  Select, collect, and reuse any text — without leaving the chat.
</p>

<p align="center">
  <a href="#installation">Install</a> ·
  <a href="#features">Features</a> ·
  <a href="#usage">Usage</a> ·
  <a href="#privacy">Privacy</a> ·
  <a href="#roadmap">Roadmap</a> ·
  <a href="#contributing">Contributing</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/manifest-v3-blue" alt="Manifest V3">
  <img src="https://img.shields.io/badge/dependencies-0-brightgreen" alt="Zero Dependencies">
  <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT License">
  <img src="https://img.shields.io/badge/data_sent-none-brightgreen" alt="No Data Sent">
</p>

---

## The Problem

ChatGPT gives you long, rich responses — but **there's no built-in way to collect, compare, or reuse specific parts** of a conversation.

You end up:
- Manually copying text back and forth
- Losing track of key points across a 50+ message thread
- Retyping "explain this" or "give me examples" over and over
- Switching between tabs just to save a useful snippet

**CRA fixes this.** It adds a native-feeling layer on top of ChatGPT that makes reading, collecting, and interacting with AI responses seamless.

## Features

### Selection Toolbar
Select any text in a conversation → a floating toolbar appears instantly.

| Action | What it does |
|--------|-------------|
| 📌 **Collect** | Save to citation clipboard (multi-snippet) |
| 💡 **Explain** | Insert "Explain this..." prompt into input box |
| ✂️ **Simplify** | Insert "Simplify this..." prompt |
| 📎 **Examples** | Insert "Give examples of..." prompt |
| 📊 **Key Points** | Insert "Summarize key points..." prompt |
| 📋 **Copy** | Copy as plain text |
| 📝 **MD** | Copy as Markdown (preserves formatting) |

<!-- TODO: Replace with actual screenshot -->
<!-- ![Selection Toolbar](docs/screenshots/toolbar.png) -->

### Citation Clipboard
Collect multiple text snippets across a conversation and manage them in a side panel:

- **Multi-select** — Check only the quotes you want to insert or copy
- **Auto-deduplication** — Identical quotes are automatically skipped
- **Persistent** — Quotes survive page reloads and navigation
- **One-click insert** — Inserts all selected quotes into the input box, framed as a reference prompt

<!-- TODO: Replace with actual screenshot -->
<!-- ![Citation Clipboard](docs/screenshots/citation-panel.png) -->

### Quick Actions (No Typing Required)
Select text → click an action → the prompt is auto-inserted into the input box, ready to send.

No more typing "please explain the following..." manually.

### Settings Panel
- Toggle modules on/off — **takes effect instantly**, no page refresh
- Preview collected quotes
- Export quotes as JSON or Markdown
- Built-in diagnostics

## Demo

<!-- TODO: Replace with actual GIF -->
<!-- ![Demo GIF](docs/screenshots/demo.gif) -->

> **Coming soon:** A 30-second demo GIF showing the full workflow.

## Installation

### From Source (Developer Mode)

**Time required: ~2 minutes**

1. **Download** this repository
   ```bash
   git clone https://github.com/user/chatgpt-reading-assistant.git
   ```
   Or click **Code → Download ZIP** and unzip.

2. **Open Chrome Extensions**
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in the top-right corner)

3. **Load the extension**
   - Click **Load unpacked**
   - Select the project folder (the one containing `manifest.json`)

4. **Open ChatGPT**
   - Go to [chatgpt.com](https://chatgpt.com)
   - Select any text in a conversation — the toolbar appears!

<!-- ### From Chrome Web Store -->
<!-- > **Coming soon** — CRA is currently in review for the Chrome Web Store. -->

## Usage

### Scenario 1: Collecting Key Points from a Long Conversation
1. Read through a long ChatGPT response
2. Select important sentences → click 📌 **Collect**
3. Repeat for multiple sections
4. Open the citation panel → review all collected snippets
5. Click **Insert** → all quotes are inserted as a reference prompt

### Scenario 2: Quick Follow-Up Questions
1. Select a confusing paragraph
2. Click 💡 **Explain** → the prompt auto-fills in the input box
3. Hit Enter — ChatGPT explains that specific section

### Scenario 3: Export Research Notes
1. Collect quotes throughout a research session
2. Open the extension popup → click **📝 MD Export**
3. Get a clean Markdown file with all your collected quotes

## Permissions

CRA requests the **minimum permissions** required:

| Permission | Why |
|-----------|-----|
| `storage` | Save your quotes and settings **locally on your device** |
| Host access: `chatgpt.com`, `chat.openai.com` | Inject the toolbar and citation panel into ChatGPT pages |

**That's it.** No `tabs`, no `webRequest`, no `identity`, no background network access.

## Privacy

**CRA collects zero data. Period.**

- No analytics or telemetry
- No external API calls
- No data leaves your browser
- No cloud sync
- All quotes are stored in `chrome.storage.local` (on your machine only)
- Full details: [PRIVACY.md](PRIVACY.md)

> **Why this matters:** Many Chrome extensions request broad permissions and send data to external servers. CRA is designed to be auditable — the entire codebase is ~2,300 lines of vanilla JavaScript with zero dependencies.

## Tech Stack

| Component | Choice | Why |
|----------|--------|-----|
| Extension API | Manifest V3 | Latest Chrome standard |
| Language | Vanilla JavaScript | Zero dependencies, fully auditable |
| Module pattern | IIFE | No bundler needed, fast load |
| Storage | `chrome.storage.local` | Private, persistent, no server |
| Styling | CSS Variables | Auto dark/light theme matching |

## Architecture

```
chatgpt-reading-assistant/
├── manifest.json           # Extension manifest (MV3)
├── content.js              # Main content script (~1,280 lines)
│   ├── CRADom              #   DOM selectors with multi-fallback
│   ├── CRAModuleRegistry   #   Module lifecycle management
│   ├── CRAMessageScanner   #   MutationObserver message detection
│   ├── CRAInputIntegration #   ProseMirror input box integration
│   ├── CRASelectionTracker #   Text selection event tracking
│   ├── CRASelectionToolbar #   Floating toolbar UI
│   └── CRACitationClipboard#   Citation panel UI + storage
├── content.css             # Theme-aware styles (dark/light)
├── background.js           # Service worker (message relay)
├── popup.html/css/js       # Extension settings popup
└── utils/
    ├── storage.js          # CRAStorage abstraction
    └── event-bus.js        # Lightweight pub/sub
```

## FAQ

<details>
<summary><strong>Does CRA work with GPT-4, GPT-4o, o1, etc.?</strong></summary>
Yes. CRA works with any model on chatgpt.com — it interacts with the UI, not the API.
</details>

<details>
<summary><strong>Does CRA send my conversations to any server?</strong></summary>
No. CRA has zero network calls. Everything stays in your browser. You can verify this by inspecting the source code — there are no <code>fetch()</code> or <code>XMLHttpRequest</code> calls.
</details>

<details>
<summary><strong>Will CRA break when ChatGPT updates?</strong></summary>
CRA uses multi-fallback DOM selectors to handle ChatGPT UI changes. If a selector breaks, it automatically tries alternatives. Major redesigns may require an update.
</details>

<details>
<summary><strong>Does it work on mobile?</strong></summary>
No. CRA is a Chrome desktop extension. Mobile Chrome does not support extensions.
</details>

<details>
<summary><strong>Does it work on Edge / Brave / Arc?</strong></summary>
Yes. Any Chromium-based browser that supports Manifest V3 extensions.
</details>

<details>
<summary><strong>Can I use it with ChatGPT Teams / Enterprise?</strong></summary>
Yes, as long as you access ChatGPT via chatgpt.com in Chrome.
</details>

## Roadmap

### v0.2 — Condense Engine (Next)
- AI-powered conversation summarization
- Collapsible message sections
- TL;DR generation

### v0.3 — Side Navigation
- Table of contents for long conversations
- Jump-to-message navigation
- Topic detection

### v0.4 — Page Search
- Full-text search within conversations
- Regex support
- Search history

### Future
- Cross-conversation quote management
- Quote tagging and categorization
- Keyboard shortcuts
- Chrome Web Store publication

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for setup instructions, code standards, and PR workflow.

Quick start:
```bash
git clone https://github.com/user/chatgpt-reading-assistant.git
# Load unpacked in chrome://extensions/
# Make changes → reload extension → test on chatgpt.com
```

## License

[MIT](LICENSE) — Use it freely, commercially or personally.

---

<p align="center">
  <sub>Built for people who read ChatGPT conversations seriously.</sub>
</p>
