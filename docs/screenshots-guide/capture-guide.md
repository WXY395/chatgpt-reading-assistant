# CRA 截圖 & GIF 製作指南

> 截圖是 README 和 Chrome Web Store 轉換率的最大影響因素。

---

## 需要製作的素材

| # | 素材 | 用途 | 尺寸 | 格式 |
|---|------|------|------|------|
| 1 | toolbar.png | README + CWS 截圖 1 | 1280×800 | PNG |
| 2 | citation-panel.png | README + CWS 截圖 2 | 1280×800 | PNG |
| 3 | one-click-action.png | CWS 截圖 3 | 1280×800 | PNG |
| 4 | settings.png | CWS 截圖 4 | 1280×800 | PNG |
| 5 | dark-light.png | CWS 截圖 5 | 1280×800 | PNG |
| 6 | demo.gif | README hero + 社群分享 | 800×500 | GIF (<5MB) |
| 7 | og-image.png | GitHub Social Preview | 1280×640 | PNG |
| 8 | promo-small.png | CWS Small Promo Tile | 440×280 | PNG |
| 9 | promo-marquee.png | CWS Marquee（選填）| 1400×560 | PNG |

---

## 截圖製作步驟

### 環境準備
1. 使用 Chrome（確保視窗大小為 1280×800）
   - 開啟 DevTools → 按 Ctrl+Shift+M 進入裝置模式
   - 設定 Dimensions: 1280×800
   - 或使用: `chrome --window-size=1280,800`
2. 開啟 ChatGPT，使用**有多段回覆的對話**
3. 確保 CRA 擴充功能已載入
4. 選擇適合展示的對話內容（避免敏感/個人資訊）

### 截圖 1: 選取工具列 (toolbar.png)
1. 找一段有意義的 AI 回覆（包含粗體、清單等格式）
2. 選取 2-3 行文字
3. 等待工具列出現在選取文字下方
4. 截圖（確保工具列完整可見）
5. **重點：** 讓讀者一眼看到「選取 → 工具列出現」的因果關係

### 截圖 2: 引文剪貼簿 (citation-panel.png)
1. 事先收藏 3-4 段不同的引文
2. 點擊 📌 打開引文面板
3. 確保有些引文被勾選，有些沒有
4. 截圖要同時看到面板和背後的對話
5. **重點：** 展示「多段收藏 + 選擇性使用」的概念

### 截圖 3: 一鍵追問 (one-click-action.png)
1. 選取一段文字
2. 點擊「解釋」按鈕
3. 等待提示詞自動填入輸入框
4. 截圖（同時顯示被選取的文字和輸入框中的提示詞）
5. **重點：** 展示「不用打字就能追問」的便利性

### 截圖 4: 設定面板 (settings.png)
1. 點擊 CRA 擴充功能圖示，開啟 Popup
2. 確保有一些引文（引文管理區會顯示預覽）
3. 截圖 Popup 面板
4. 可以用半透明背景疊在 ChatGPT 頁面上
5. **重點：** 展示簡潔、清晰的設定介面

### 截圖 5: 深淺模式對比 (dark-light.png)
1. 分別在深色和淺色模式下截取工具列
2. 使用圖片編輯工具左右並排
3. 加上「Dark Mode」「Light Mode」標註
4. **重點：** 展示 CRA 能自動適配 ChatGPT 的主題

---

## Demo GIF 製作

### 推薦工具
- **ScreenToGif** (Windows, 免費): https://www.screentogif.com/
- **LICEcap** (Windows/Mac, 免費): https://www.cockos.com/licecap/
- **Kap** (Mac, 免費): https://getkap.co/
- **Chrome DevTools Recorder** → 匯出為影片再轉 GIF

### GIF 腳本（30 秒內完成）

```
0s-3s   開啟 ChatGPT 對話頁面（有多段回覆）
3s-7s   選取一段 AI 回覆文字 → 工具列出現
7s-9s   點擊 📌 收藏 → toast 顯示「已加入引文」
9s-13s  選取另一段文字 → 點擊 📌 收藏
13s-16s 點擊 📌 toggle → 引文面板打開，顯示 2 條引文
16s-19s 勾選第 1 條 → 點擊「插入」→ 輸入框填入引文
19s-23s 選取新的文字 → 點擊「解釋」→ 輸入框填入提示詞
23s-26s 展示輸入框中完整的提示詞（不送出）
26s-30s 結束，可加上 logo 或 GitHub 連結
```

### GIF 優化
- 目標檔案大小: < 5MB（GitHub README 載入速度）
- 幀率: 10-15 fps（足夠流暢，檔案更小）
- 使用 https://ezgif.com/optimize 壓縮
- 或使用 gifsicle: `gifsicle -O3 --lossy=80 demo.gif -o demo-optimized.gif`

---

## OG Social Preview 圖片 (og-image.png)

### 設計要素
- 尺寸: 1280×640px
- 背景: 深色（#1e1e1e）或漸層
- 左側: CRA 圖示 + 名稱
- 右側: 截圖或功能示意
- 底部: 一行 tagline

### 簡易製作方式（無設計工具）
1. 使用 Canva（免費）: https://www.canva.com/
2. 選擇「Custom Size」→ 1280×640
3. 使用深色背景模板
4. 放入 CRA 圖示 + 名稱 + tagline
5. 加入一張截圖（帶陰影效果）

### Tagline 選項
```
"Stop losing insights in long ChatGPT conversations"
「讓你不再遺漏 ChatGPT 對話中的重要內容」
```

---

## Chrome Web Store Promo Tiles

### Small Promo Tile (440×280)
- 簡潔設計，CRA 圖示居中
- 名稱 + 一句話描述
- 背景建議使用 ChatGPT 綠色（#10a37f）或深色

### Marquee Promo Tile (1400×560)
- 選填，但如果被 Featured 會需要
- 左側: 功能文字描述
- 右側: 產品截圖

---

## 檔案命名與存放

```
docs/screenshots/
├── toolbar.png              # 選取工具列截圖
├── citation-panel.png       # 引文剪貼簿截圖
├── one-click-action.png     # 一鍵追問截圖
├── settings.png             # 設定面板截圖
├── dark-light.png           # 深淺模式對比
├── demo.gif                 # Demo GIF
├── og-image.png             # GitHub Social Preview
├── store/
│   ├── screenshot-1.png     # CWS 截圖 (1280×800)
│   ├── screenshot-2.png
│   ├── screenshot-3.png
│   ├── screenshot-4.png
│   ├── screenshot-5.png
│   ├── promo-small.png      # 440×280
│   └── promo-marquee.png    # 1400×560
```
