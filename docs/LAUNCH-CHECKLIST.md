# CRA 發布前置檢查清單

> 三大平台發布所需的完整準備清單。每個項目完成後打勾。

---

## 一、GitHub 發布

### 1.1 Repository 設定
- [ ] 建立 GitHub repo（公開）
- [ ] 設定 repo Description: `Stop losing insights in long ChatGPT conversations. Select, collect, reuse — without leaving the chat.`
- [ ] 設定 repo Topics: `chatgpt`, `chrome-extension`, `productivity`, `ai-tools`, `reading-assistant`, `manifest-v3`, `vanilla-js`, `open-source`
- [ ] 上傳 Social Preview 圖片（1280×640px）到 Settings → Social preview
- [ ] 設定 Website URL（Chrome Web Store 連結，上架後回填）
- [ ] 啟用 Issues + Discussions
- [ ] 關閉 Wiki（用 docs/ 資料夾替代）
- [ ] 設定 Default branch: `main`
- [ ] 設定 Branch protection: require PR review for main

### 1.2 Release
- [ ] 建立 GitHub Release `v0.1.0`
- [ ] Tag: `v0.1.0`
- [ ] Release title: `v0.1.0 — Selection Toolbar + Citation Clipboard`
- [ ] 附加 Release notes（從 CHANGELOG.md 複製）
- [ ] 附加 .zip 打包檔（方便非開發者下載）

### 1.3 視覺素材
- [ ] README 截圖：選取工具列（toolbar.png）
- [ ] README 截圖：引文剪貼簿面板（citation-panel.png）
- [ ] README 截圖：設定面板（settings.png）
- [ ] README Demo GIF（demo.gif, 30 秒內）
- [ ] OG Social Preview 圖片（og-image.png, 1280×640）

### 1.4 文件
- [x] README.md（著陸頁級）
- [x] CONTRIBUTING.md
- [x] CHANGELOG.md
- [x] SECURITY.md
- [x] PRIVACY.md
- [x] LICENSE (MIT)
- [x] .gitignore
- [ ] TERMS.md（服務條款）
- [ ] CODE_OF_CONDUCT.md（行為準則）

---

## 二、Chrome Web Store 發布

### 2.1 開發者帳號
- [ ] 註冊 Chrome Web Store 開發者帳號（一次性費用 US$5）
  - 前往 https://chrome.google.com/webstore/devconsole
  - 需要 Google 帳號 + 信用卡驗證
- [ ] 完成開發者身分驗證

### 2.2 Store Listing 素材
- [ ] 擴充功能名稱: `ChatGPT Reading Assistant`
- [ ] 簡短描述（132 字元內）
- [ ] 完整描述
- [ ] 分類: `Productivity`
- [ ] 語言: `Chinese (Traditional)` + `English`

### 2.3 圖片素材（嚴格尺寸要求）
- [ ] Store Icon: 128×128px PNG（已有 icons/icon128.png）
- [ ] 截圖 1~5 張: 1280×800px 或 640×400px PNG/JPG
  - 截圖 1: 選取工具列功能展示
  - 截圖 2: 引文剪貼簿面板
  - 截圖 3: 一鍵追問功能
  - 截圖 4: 設定面板
  - 截圖 5: 深色/淺色模式對比
- [ ] Small Promo Tile: 440×280px PNG/JPG
- [ ] Marquee Promo Tile（選填）: 1400×560px PNG/JPG

### 2.4 隱私與合規
- [ ] Privacy Policy URL（必須是公開可訪問的 URL）
  - 選項 A: 使用 GitHub Pages 託管 PRIVACY.md
  - 選項 B: 使用 GitHub 原始檔連結
- [ ] 填寫 Privacy Practices 表單
  - Single Purpose: 「增強 ChatGPT 閱讀體驗，提供選取工具列和引文收藏功能」
  - Data Usage: 不收集任何使用者資料
  - Remote Code: 不使用遠端代碼
- [ ] 權限說明（Permissions Justification）
  - `storage`: 在本機儲存使用者設定和引文
  - Host permissions: 在 chatgpt.com 注入內容腳本以提供工具列功能

### 2.5 打包與提交
- [ ] 用 Chrome 打包擴充功能（chrome://extensions → Pack extension）
- [ ] 或打包為 .zip（不含 .git, .claude, docs/ 等開發檔案）
- [ ] 上傳到 Chrome Web Store Developer Dashboard
- [ ] 提交審核（通常 1-3 個工作天）

---

## 三、社群媒體 & SEO 發布

### 3.1 平台清單
- [ ] Reddit（主力）
- [ ] Twitter/X
- [ ] Product Hunt
- [ ] Hacker News (Show HN)
- [ ] Dev.to / Hashnode（技術文章）
- [ ] LinkedIn（專業受眾）
- [ ] YouTube（短影片）
- [ ] 巴哈姆特 / PTT（繁中社群）

### 3.2 素材準備
- [ ] 30 秒 Demo 影片/GIF
- [ ] 各平台貼文文案（見 docs/social-media-kit/）
- [ ] 短連結（bit.ly 或自訂域名）
- [ ] SEO 關鍵字清單

### 3.3 發布時程
- [ ] Day 0: GitHub repo 公開 + Release
- [ ] Day 1: Reddit r/ChatGPT + r/productivity
- [ ] Day 2: Twitter/X thread
- [ ] Day 3: Hacker News Show HN
- [ ] Day 5: Dev.to 技術文章
- [ ] Day 7: Product Hunt launch
- [ ] Day 14: YouTube 影片

---

## 四、發布後維護

### 4.1 監控
- [ ] GitHub Issues 回覆（24 小時內）
- [ ] Chrome Web Store 評價回覆
- [ ] Reddit/Twitter 留言互動
- [ ] 監控 ChatGPT DOM 變動（每週檢查一次）

### 4.2 迭代
- [ ] 收集前 100 位用戶反饋
- [ ] 優先修復高頻 bug
- [ ] 規劃 v0.2 功能（Condense Engine）
