# Chrome Web Store Listing — 完整文案

> 直接複製到 Chrome Web Store Developer Dashboard 中。

---

## Extension Name
```
ChatGPT Reading Assistant
```

## Short Description (max 132 characters)
```
選取、收藏、一鍵追問 — 讓你不再遺漏 ChatGPT 對話中的重要內容。零資料收集，完全離線運作。
```

## Short Description (English, max 132 characters)
```
Select, collect, and reuse text from ChatGPT conversations. Citation clipboard + quick actions. Zero data collection, fully offline.
```

## Detailed Description (繁中)
```
ChatGPT Reading Assistant（CRA）為 ChatGPT 對話頁面添加一個原生體驗的閱讀輔助層。

【你一定遇過這些情況】
• 回答太長，滾回去找那句關鍵的話卻找不到
• 想追問某一段，得手動複製貼上再打提示詞
• 聊了 50 則，結束後才發現有用的只有 3 句，但忘了是哪 3 句

【CRA 能幫你做什麼】

📌 選取即收藏
看到重要的句子，選取後點一下「收藏」，自動保存到側邊引文面板。支援多段收藏，跨頁面保留。

💡 一鍵追問
選取看不懂的內容，點「解釋」「簡化」「舉例」或「要點」— 提示詞自動填入輸入框，不用手動打字。

📋 多段引用
收藏了多段內容？勾選你要的，點「插入」— 全部引文自動整理，放進輸入框。

📝 格式化複製
一鍵複製為純文字或 Markdown，程式碼區塊、粗體格式完整保留。

⚙️ 即時設定
模組隨時開關，即時生效，不用重新整理頁面。引文可匯出為 JSON 或 Markdown。

【隱私與安全】
• 零網路請求 — 不會連接任何外部伺服器
• 零資料收集 — 不收集任何使用者資料
• 零雲端同步 — 所有資料僅儲存在你的瀏覽器中
• 完全開源 — 約 2,300 行程式碼，零依賴，可逐行審查

【權限說明】
• storage：在本機儲存你的設定和引文
• chatgpt.com 存取權限：在 ChatGPT 頁面注入工具列和引文面板

僅此而已。不要求 tabs、webRequest 或任何其他廣泛權限。

【支援】
• 所有 ChatGPT 模型（GPT-4、GPT-4o、o1 等）
• 深色模式和淺色模式
• Chromium 系列瀏覽器（Chrome、Edge、Brave、Arc）

GitHub: https://github.com/WXY395/chatgpt-reading-assistant
回報問題: https://github.com/WXY395/chatgpt-reading-assistant/issues
```

## Detailed Description (English)
```
ChatGPT Reading Assistant (CRA) adds a native-feeling reading layer to ChatGPT conversations.

PROBLEM:
• Long AI responses bury key insights
• Manually copying text to ask follow-ups is tedious
• No way to collect and reuse specific parts of a conversation

FEATURES:

📌 Select & Collect
Highlight important text, click "Collect" — saved to a citation clipboard. Supports multiple snippets, persists across page reloads.

💡 One-Click Follow-Up
Select confusing text, click "Explain", "Simplify", "Examples", or "Key Points" — the prompt auto-fills in the input box.

📋 Multi-Quote Insert
Collected 5 quotes? Check the ones you want, click "Insert" — all quotes are formatted and placed in the input box.

📝 Formatted Copy
Copy as plain text or Markdown with formatting preserved (code blocks, bold, etc.).

⚙️ Instant Settings
Toggle modules on/off instantly — no page reload needed. Export quotes as JSON or Markdown.

PRIVACY & SECURITY:
• Zero network requests — never connects to external servers
• Zero data collection — no analytics, no telemetry
• Zero cloud sync — all data stored locally in your browser
• Fully open source — ~2,300 lines, zero dependencies, auditable

PERMISSIONS:
• storage: Save your settings and quotes locally
• chatgpt.com access: Inject the toolbar and citation panel

That's it. No tabs, webRequest, or broad permissions.

SUPPORTS:
• All ChatGPT models (GPT-4, GPT-4o, o1, etc.)
• Dark and light mode
• Chromium browsers (Chrome, Edge, Brave, Arc)
```

## Category
```
Productivity
```

## Language
```
Primary: Chinese (Traditional)
Additional: English
```

## Privacy Practices (CWS Required Form)

### Single Purpose Description
```
Enhance ChatGPT reading experience by providing a text selection toolbar for collecting citations and generating follow-up prompts directly on chatgpt.com.
```

### Does your extension collect or use personal data?
```
No
```

### Does your extension use remote code?
```
No
```

### Permissions Justification

#### storage
```
Required to save user preferences (module on/off toggles) and collected text citations locally on the user's device using chrome.storage.local. No data is synced or transmitted externally.
```

#### Host permission: chatgpt.com
```
Required to inject the content script that provides the selection toolbar and citation clipboard UI on ChatGPT conversation pages. The extension only activates on chatgpt.com and chat.openai.com — it does not access any other websites.
```

---

## Image Specifications

| Asset | Size | Format | Purpose |
|-------|------|--------|---------|
| Store Icon | 128×128 | PNG | Store listing icon (already have) |
| Screenshot 1-5 | 1280×800 or 640×400 | PNG/JPG | Feature showcase |
| Small Promo Tile | 440×280 | PNG/JPG | Store category pages |
| Marquee Promo Tile | 1400×560 | PNG/JPG | Featured section (optional) |

### Screenshot Descriptions (for Alt Text)
1. "Selection toolbar appearing below highlighted text in a ChatGPT conversation"
2. "Citation clipboard panel showing collected quotes with checkboxes"
3. "One-click 'Explain' action inserting a prompt into the ChatGPT input box"
4. "Extension settings popup with module toggles and quote management"
5. "Dark mode and light mode comparison showing theme adaptation"
