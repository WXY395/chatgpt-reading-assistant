# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-03-27

### Added
- **Selection Toolbar** — Floating toolbar on text selection with actions: Collect, Explain, Simplify, Examples, Key Points, Copy, Markdown Copy
- **Citation Clipboard** — Side panel for collecting, managing, and inserting multiple text snippets
  - Multi-select with checkboxes
  - Auto-deduplication
  - Persistent storage across page reloads
  - One-click insert with contextual prompt framing
- **Quick Actions** — Select text → auto-generate prompts (explain, simplify, examples, key points) and insert into input box
- **Settings Panel** — Popup with module toggles (instant effect, no page reload), quote preview, JSON/Markdown export, diagnostics
- **SPA Navigation Detection** — Automatic re-scan when switching between ChatGPT conversations
- **Theme Support** — Auto dark/light mode matching ChatGPT's theme
- **Multi-fallback DOM Selectors** — Resilient against ChatGPT UI changes
- **ProseMirror Integration** — Reliable text insertion into ChatGPT's editor
- **Privacy-first Architecture** — Zero external network calls, all data stored locally

### Technical
- Chrome Extension Manifest V3
- Vanilla JavaScript with IIFE module pattern
- Zero external dependencies
- `chrome.storage.local` for persistence
- EventBus for inter-module communication
- MutationObserver for real-time message detection
