# CRA 社群媒體發布素材包

> 各平台文案已優化為該平台的最佳格式和語氣。直接複製使用。

---

## 1. Reddit

### r/ChatGPT（主力貼文）

**Title:**
```
I built a free extension that adds a "reading layer" to ChatGPT — select text, collect quotes, one-click follow-ups. No data collection, fully open source.
```

**Body:**
```
I've been using ChatGPT daily for months, and I kept running into the same problem:

ChatGPT gives great answers, but **finding and reusing specific parts** of a long conversation is painful. You end up scrolling back and forth, manually copying text, retyping "explain this part" over and over.

So I built **ChatGPT Reading Assistant** — a Chrome extension that adds a native-feeling toolbar when you select text in any ChatGPT conversation.

**What it does:**
- 📌 **Select & Collect** — Save text snippets to a citation clipboard
- 💡 **One-click actions** — "Explain", "Simplify", "Examples", "Key Points" — auto-inserts the prompt
- 📋 **Multi-quote insert** — Check the quotes you want, insert all at once
- 📝 **Markdown copy** — Preserves code blocks and formatting

**Privacy:**
- Zero network requests (you can verify in DevTools)
- Zero dependencies
- All data stored locally in your browser
- ~2,300 lines of vanilla JS, fully auditable

**Links:**
- GitHub: [LINK]
- Chrome Web Store: [LINK]

Built this as an open-source project. Feedback welcome — especially on what features you'd want next.
```

### r/productivity

**Title:**
```
If you use ChatGPT daily, you're probably wasting time manually copying text. I built a tool to fix that.
```

**Body:**
```
Quick context: I have 50+ message conversations with ChatGPT regularly. The problem? Finding that one key insight buried in message #37.

**ChatGPT Reading Assistant** adds a simple selection toolbar to ChatGPT. Select text → collect it, ask a follow-up, or copy it with formatting intact.

The killer feature for me: **citation clipboard**. I collect 5-6 key sentences throughout a conversation, then insert them all at once as context for my next question.

Free, open source, no data collection. [LINK]
```

### r/chrome_extensions

**Title:**
```
Open source Chrome Extension for ChatGPT — zero dependencies, MV3, ~2,300 lines of vanilla JS
```

**Body:**
```
Built a reading assistant for ChatGPT conversations. Thought this community might find the technical approach interesting:

**Tech:**
- Manifest V3, vanilla JavaScript, zero dependencies
- IIFE factory pattern with dependency injection
- Multi-fallback DOM selectors (ChatGPT changes their DOM frequently)
- ProseMirror integration via execCommand('insertText')
- MutationObserver for real-time message detection
- SPA navigation detection (URL polling + popstate)
- CSS variables for automatic dark/light theme matching

**Architecture:**
13 modular files, each with a single responsibility. Factory functions receive deps explicitly — no hidden globals.

**Privacy:**
Zero network calls. You can grep the entire codebase for `fetch` or `XMLHttpRequest` — zero results.

GitHub: [LINK]

Looking for feedback on the architecture. PRs welcome.
```

---

## 2. Twitter/X

### Launch Thread

```
🧵 Thread:

1/ ChatGPT 很會回答問題。

但你有沒有過這種經驗：
聊了 50 則，結束後才發現有用的只有 3 句。
但你已經忘了是哪 3 句。

2/ 問題不是 ChatGPT 不夠好。
問題是你沒有工具「重用」那些好的回答。

所以我做了 ChatGPT Reading Assistant 👇

3/ 它在 ChatGPT 頁面上加了一個閱讀層：

📌 選取文字 → 一鍵收藏
💡 選取文字 → 一鍵追問（解釋/簡化/舉例/要點）
📋 多段引用 → 一次全部插入輸入框

不用離開頁面。不用手動複製貼上。

4/ 隱私方面：
• 零網路請求
• 零資料收集
• 零依賴
• 完全開源，2,300 行 vanilla JS

你可以自己查：打開 DevTools → Network tab → 零外部請求。

5/ 免費、開源、MIT 授權。

GitHub: [LINK]
Chrome Web Store: [LINK]

如果你每天都在用 ChatGPT，試試看。

⭐ 覺得有用的話，GitHub 給個 Star 🙏
```

### Single Tweet (English)
```
Built an open-source Chrome extension for ChatGPT power users:

📌 Select text → save to citation clipboard
💡 One-click "Explain" / "Simplify" / "Examples"
📋 Multi-quote insert into input box

Zero data collection. Zero dependencies. 2,300 lines of vanilla JS.

GitHub: [LINK]
```

### Single Tweet (繁中)
```
做了一個 ChatGPT 的閱讀輔助工具：

選取文字就能收藏、追問、複製。
不用手動打提示詞，不用在 50 則對話裡翻找。

零資料收集。完全開源。免費。

GitHub: [LINK]
```

---

## 3. Hacker News

### Show HN Post

**Title:**
```
Show HN: ChatGPT Reading Assistant – Select, collect, reuse text from long conversations
```

**URL:** `[GitHub repo URL]`

**First Comment (important on HN):**
```
Hi HN, I built this because I kept losing insights in long ChatGPT conversations.

Technical details:
- Chrome Extension, Manifest V3
- ~2,300 lines of vanilla JavaScript, zero dependencies
- No build step — runs directly from source
- Multi-fallback DOM selectors (ChatGPT changes their DOM frequently)
- ProseMirror integration for text insertion
- Factory pattern with explicit dependency injection
- Zero network calls (verifiable: grep for fetch/XMLHttpRequest returns nothing)

Architecture: 13 files split by responsibility. Factory functions receive dependencies explicitly rather than reading from window globals.

The most interesting technical challenge was inserting text into ChatGPT's ProseMirror editor. document.execCommand('insertText') is deprecated but remains the only reliable method — the Clipboard API fallback is there but ProseMirror doesn't always honor synthetic paste events.

Code: [GitHub LINK]
Feedback on the architecture welcome.
```

---

## 4. Product Hunt

### Tagline
```
Stop losing insights in long ChatGPT conversations
```

### Description
```
ChatGPT Reading Assistant adds a selection toolbar to ChatGPT. Select any text to collect quotes, generate follow-up prompts, or copy with formatting.

Key features:
📌 Citation clipboard — collect text snippets across a conversation
💡 One-click follow-ups — "Explain", "Simplify", "Examples", "Key Points"
📋 Multi-quote insert — select multiple quotes and insert them all at once
🔒 Privacy-first — zero network requests, zero data collection, fully open source

Free and open source. No account needed.
```

### Topics
```
Chrome Extensions, Productivity, Artificial Intelligence, ChatGPT, Open Source
```

---

## 5. Dev.to / Hashnode（技術文章）

### Article Title Options
```
1. "How I Built a Chrome Extension in 2,300 Lines of Vanilla JS (No Dependencies)"
2. "Injecting UI into ChatGPT: ProseMirror, MutationObserver, and Multi-Fallback Selectors"
3. "Privacy-First Chrome Extension Architecture: Zero Network Calls by Design"
```

### Article Outline (Article 1)
```
1. Why I built it (problem)
2. Architecture decisions
   - Why no build tools
   - Why IIFE + factory pattern
   - Why zero dependencies
3. Technical challenges
   - ProseMirror text insertion
   - SPA navigation detection
   - Multi-fallback DOM selectors
4. Privacy by design
   - How to verify zero network calls
5. What I'd do differently
6. Try it yourself (links)
```

---

## 6. LinkedIn

```
ChatGPT 是很好的 AI 助手，但長對話的「重用性」一直是個痛點。

過去幾個月，我開發了一個開源 Chrome 擴充功能 — ChatGPT Reading Assistant。

它在 ChatGPT 頁面上加了一個閱讀輔助層：
• 選取文字就能收藏重點
• 一鍵生成追問提示
• 多段引用一次插入

技術上選擇了極簡路線：零依賴、零網路請求、約 2,300 行 vanilla JavaScript。

所有資料只存在你的瀏覽器裡。

GitHub: [LINK]

如果你每天都在使用 AI 工具，歡迎試用和回饋。

#ChatGPT #ChromeExtension #OpenSource #Productivity #AITools
```

---

## 7. PTT / 巴哈姆特（繁中社群）

### PTT 標題
```
[工具] ChatGPT 閱讀輔助 Chrome 擴充 — 選取、收藏、一鍵追問
```

### PTT 內文
```
各位好，分享一個自己做的 Chrome 擴充功能。

使用情境：
你跟 ChatGPT 聊了 50 則，裡面有 3 句很重要，但你忘了在哪。
你想追問某一段，但得手動複製 → 貼上 → 打「請解釋這段」。

這個工具就是解決這個問題：

1. 選取文字 → 工具列出現
2. 點「收藏」→ 自動存到側邊面板
3. 點「解釋」→ 提示詞自動填入輸入框
4. 多段引用 → 勾選後一次全部插入

隱私：
- 不連任何伺服器
- 不收集任何資料
- 完全開源，可以自己看 code

免費，MIT 授權。

GitHub: [LINK]
Chrome Web Store: [LINK]

歡迎回饋，或直接在 GitHub 開 issue。
```

---

## SEO 關鍵字

### Primary Keywords
- ChatGPT Chrome Extension
- ChatGPT Reading Assistant
- ChatGPT productivity tool
- ChatGPT citation tool
- ChatGPT text selection

### Long-tail Keywords
- how to save text from ChatGPT conversations
- ChatGPT copy text with formatting
- collect quotes from ChatGPT
- ChatGPT reading helper chrome
- best ChatGPT Chrome extensions 2026

### 繁中關鍵字
- ChatGPT 擴充功能
- ChatGPT 閱讀助手
- ChatGPT 生產力工具
- ChatGPT 引文收藏
- ChatGPT Chrome 外掛
