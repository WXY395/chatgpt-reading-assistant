# Contributing to ChatGPT Reading Assistant

Thank you for your interest in contributing! This guide covers everything you need to get started.

## Development Setup

### Prerequisites
- Google Chrome (latest stable)
- Git
- A text editor (VS Code recommended)

### Setup Steps

1. **Fork and clone**
   ```bash
   git clone https://github.com/YOUR_USERNAME/chatgpt-reading-assistant.git
   cd chatgpt-reading-assistant
   ```

2. **Load in Chrome**
   - Open `chrome://extensions/`
   - Enable **Developer mode**
   - Click **Load unpacked** → select the project folder

3. **Open ChatGPT**
   - Go to [chatgpt.com](https://chatgpt.com)
   - Open DevTools → Console → filter by `CRA` to see logs

4. **Make changes**
   - Edit files → click the refresh icon on `chrome://extensions/` → reload the ChatGPT tab

> **Tip:** No build step is needed. The extension runs directly from source files.

## Project Structure

```
content.js          Main content script (all modules in one file via IIFE)
content.css         Theme-aware styles (CSS variables for dark/light)
popup.html/css/js   Extension settings popup
background.js       Service worker (message relay only)
utils/storage.js    Chrome storage abstraction
utils/event-bus.js  Lightweight pub/sub event system
manifest.json       Extension manifest (MV3)
```

## Code Standards

### General
- **No external dependencies.** Everything is vanilla JavaScript.
- **No build tools.** The extension runs from source. No webpack, no bundler.
- **IIFE module pattern.** Each module is a self-contained IIFE that returns a public API.

### Naming
- Module names: `CRA` prefix (e.g., `CRADom`, `CRASelectionToolbar`)
- CSS classes: `cra-` prefix (e.g., `cra-toolbar-btn`, `cra-panel-header`)
- Storage keys: `cra_` prefix (e.g., `cra_settings`, `cra_quotes`)
- Data attributes: `data-cra-` prefix (e.g., `data-cra-ui`, `data-cra-index`)

### DOM Selectors
ChatGPT's DOM changes frequently. Always use multi-fallback selectors:
```javascript
// Good: fallback chain
const INPUT_SELECTORS = [
  '#prompt-textarea',
  'div[contenteditable="true"][id*="prompt"]',
  'div.ProseMirror[contenteditable="true"]',
  'div[contenteditable="true"]',
];

// Bad: single brittle selector
const input = document.querySelector('#prompt-textarea');
```

### CSS
- Use CSS variables for theming (`--cra-toolbar-bg`, etc.)
- Support both dark and light modes
- Use `[data-cra-ui]` attribute to mark CRA-owned elements

### JavaScript
- Use `const` / `let` (never `var`)
- Use `async/await` for storage operations
- Log with `[CRA]` prefix: `console.log('[CRA] message')`
- Error handling: wrap module init in try/catch, never crash the page

## Pull Request Workflow

### 1. Create a branch
```bash
git checkout -b feat/your-feature-name
# or
git checkout -b fix/your-bug-description
```

### 2. Make your changes
- Follow the code standards above
- Test on chatgpt.com with multiple scenarios
- Check the Console for errors (filter by `CRA`)

### 3. Commit
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
feat(toolbar): add keyboard shortcut for copy action
fix(citation): prevent duplicate badge update on SPA navigation
docs(readme): add screenshot for citation panel
refactor(storage): simplify quote deduplication logic
```

### 4. Open a PR
- **Title:** Short, descriptive (under 70 characters)
- **Description:** What changed, why, and how to test
- **Screenshots:** Include before/after if UI changed

### 5. Review
- Address feedback promptly
- Keep commits clean (squash if needed)

## Issue Guidelines

### Bug Reports
Please include:
- Chrome version
- Steps to reproduce
- Expected behavior vs actual behavior
- Console errors (filter by `CRA`)
- Screenshot if UI-related

### Feature Requests
Please include:
- Use case (why do you need this?)
- Proposed behavior
- Mockup or description of UI changes (if applicable)

## Testing Checklist

Before submitting a PR, verify:

- [ ] Extension loads without errors on `chrome://extensions/`
- [ ] Console shows `[CRA] Initialization complete` on chatgpt.com
- [ ] Selection toolbar appears on text selection
- [ ] Citation clipboard add/remove/insert works
- [ ] Settings toggle takes effect immediately (no page reload)
- [ ] Works in both dark and light mode
- [ ] No CRA-related errors in Console
- [ ] SPA navigation (switching conversations) works correctly

## Architecture Decisions

Key decisions and their rationale:

| Decision | Rationale |
|----------|-----------|
| Single `content.js` file | No bundler needed; simpler to load and debug |
| IIFE module pattern | Clean scoping without ES modules (content scripts can't use `import`) |
| Multi-fallback selectors | ChatGPT's DOM changes frequently; resilience over elegance |
| `execCommand('insertText')` | Only reliable way to insert into ProseMirror editor |
| CSS variables for theming | Auto-matches ChatGPT's dark/light toggle |
| EventBus for inter-module comms | Loose coupling between toolbar, clipboard, and tracker |

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).
