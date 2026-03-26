# ChatGPT 聊天網頁體驗改善工具 — 市場分析報告

> 報告日期：2026-03-26
> 專案：ChatGPT Reading Assistant（基於 Gemini Reading Assistant 經驗遷移）

---

## 一、使用者痛點分析（按嚴重度排序）

### 1. 對話管理混亂（最高頻投訴）
- **無資料夾/標籤系統**：OpenAI 社群論壇上至少 6 個獨立 feature request 貼文，各有數百 upvotes
- **搜尋功能不足**：Ctrl+K 搜尋僅基於標題和內容，缺乏日期、模型、主題等進階篩選
- **對話消失**：使用者回報聊天記錄在更新後遺失，側邊欄僅顯示快取的近期子集
- **無對話分支/分叉**：無法在特定節點分叉探索不同方向

### 2. 閱讀體驗不佳
- **內容寬度過窄**：桌面寬螢幕上大量留白浪費空間，自 2023 年 3 月至今持續被投訴
- **程式碼區塊問題**：不響應螢幕寬度變化、需水平捲動、無法並排比較
- **Markdown 渲染缺陷**：表格換行不生效、code fence 衝突、半渲染回應
- **不需要的追問問題**：ChatGPT 幾乎每個回應都附加追問問題，被視為留客手段

### 3. 長對話效能崩潰（架構性問題）
- 所有訊息留在 DOM 中 → 瀏覽器記憶體暴增
- 每次新回應強制全頁 layout recalculation
- 100+ 則訊息後出現 10-30 秒延遲
- 嚴重時瀏覽器凍結/崩潰

### 4. 匯出功能貧弱
- 原生僅提供全量 JSON 下載，無法匯出單一對話
- 缺乏 Markdown、PDF、TXT 等格式選項
- 複製貼上時 Markdown 符號變成文字字元

### 5. 缺少工作區概念
- 無 Artifacts/Canvas 分離面板（Claude 有）
- 無內嵌引用來源系統（Perplexity 有）
- 無專案/上下文共享機制（Claude Projects 有）

---

## 二、現有開源工具生態

### Chrome 擴充功能

| 工具 | 核心功能 | 備註 |
|------|---------|------|
| **Superpower ChatGPT** | 資料夾、搜尋、匯出、提示詞庫、釘選訊息、Minimap、Prompt Chains | ~1.7k GitHub stars，最全面的單一擴充。GitHub 2023 年停更，已轉閉源付費（$10-15/月）。搜尋僅限標題。 |
| **ChatGPT Toolbox** | 資料夾、子資料夾、釘選、批次管理 | 17k+ 活躍用戶，2026 年 3 月仍活躍更新。$9.99/月或 $99 終身。 |
| **ChatGPT Folders** | 自訂資料夾分類對話 | 16k+ 活躍用戶 |
| **Enhanced ChatGPT** | 聊天匯出 + 提示詞模板 | Chrome Web Store |
| **WebChatGPT** | 為回應加入網路搜尋結果 | 即時網路上下文 |

### Userscripts（Tampermonkey）

| 工具 | 核心功能 | 備註 |
|------|---------|------|
| **KeepChatGPT** | 自動刷新、Session 保活、追蹤攔截、全螢幕、頁面淨化 | 14.9k GitHub stars，Greasyfork v33.6（2026/02 更新），268k+ 安裝。本質是穩定性工具。 |
| **ChatGPT Widescreen** | 寬/全/高螢幕模式 + spamblock | adamlui，同時有擴充版，多瀏覽器支援 |
| **ChatGPT Auto-Continue** | 回應截斷時自動繼續生成 | adamlui 集合 |
| **ChatGPT UI Fix** | CSS 修正寬度、側邊欄、訊息佈局 | GitHub Gist |
| **ChatGPT Thread Toolkit** | 折疊舊訊息、MD/JSONL 匯出 | 0 stars，極小專案 |

### 匯出工具

| 工具 | 功能 |
|------|------|
| **chatgpt-exporter** (pionxzh) | 匯出為 Markdown/HTML/JSON，可選特定對話 |
| **ai-chat-exporter** (revivalstack) | 支援 ChatGPT/Claude/Gemini/Grok，Alt+M/Alt+J 快捷鍵 |
| **chatgpt-export** (ryanschiang) | 匯出為 Markdown/JSON/PNG |

### 效能優化工具

| 工具 | 功能 | 備註 |
|------|------|------|
| **ChatGPT Lag Fixer** | 虛擬滾動，將離螢幕訊息替換為高度匹配佔位符 | 127 stars，v1.0.4（2026/01），聲稱 70-90% DOM 減少。PolyForm Strict 授權（不可重用）。 |
| **ChatGPT Virtual Scroll** | 虛擬滾動 userscript | Greasyfork |
| **ChatGPT Performance Long Chats** | 長對話效能優化 | Chrome Web Store |

### 導航/索引工具

| 工具 | 功能 | 備註 |
|------|------|------|
| **GPT Table of Contents** | 自動從標題生成目錄 | 單功能，僅索引標題 |
| **ChatGPT Table of Contents** | 編號可點擊的提問索引 | 單功能，僅索引用戶提問 |
| **Index for ChatGPT** | 自動生成可點擊索引 | Product Hunt 上架 |

### 自架替代 UI（市場需求驗證）

| 專案 | GitHub Stars | 說明 |
|------|-------------|------|
| **Open WebUI** | ~124,000 | 最熱門自架 AI 聊天 UI，內建 RAG、語音通話、SSO、RBAC |
| **LobeChat** | ~72,000 | 多 Agent 協作、Plugin 系統、精緻設計 |
| **LibreChat** | ~33,900 | ChatGPT 增強克隆，支援 Agents、MCP、對話分叉、Artifacts |

---

## 三、競品 UX 優勢比較

| 特性 | ChatGPT | Claude | Gemini | Perplexity |
|------|---------|--------|--------|------------|
| 對話資料夾/標籤 | 無 | Projects | Labels | Collections |
| 輸出分離面板 | 無（Canvas 有限） | Artifacts | Canvas | N/A |
| 內嵌引用來源 | 弱 | 中 | 中 | 優秀（編號引用） |
| 寬螢幕響應式佈局 | 無（固定窄幅） | 較好 | 好 | 好 |
| 長對話效能 | 差（DOM 膨脹） | 較好 | 好 | N/A（短互動） |
| 匯出選項 | 有限（全量 JSON） | 下載 Artifacts | 有限 | 分享連結 |
| 搜尋範圍控制 | 二元（開/關瀏覽） | N/A | N/A | 精細（網頁/學術/社群） |
| 每次查詢切換模型 | 會話級 | 會話級 | 會話級 | 查詢級 |

---

## 四、逐功能缺口分析

### 完全空白（零競爭，最大差異化）

| 功能 | 現況 |
|------|------|
| **選取工具列**（選取文字後的浮動操作按鈕） | 所有現有選取工具都是「把文字送去 AI」，沒有任何工具在 ChatGPT 對話內部提供儲存片段、引文、摘要、高亮等操作 |
| **引文剪貼簿**（多片段收集 + 標籤管理） | 現有工具僅有訊息級「複製」按鈕（如 CopyIt），無法收集多個片段並組織管理 |
| **文本壓縮引擎**（客戶端對話摘要/壓縮） | **完全無人做過** — 所有「摘要」工具都是用 API 處理外部文件，沒有前端對話壓縮引擎 |

### 部分覆蓋（有工具但淺或不整合）

| 功能 | 現有工具 | 缺口 |
|------|---------|------|
| **側邊導航索引** | GPT Table of Contents 等 3+ 單功能擴充 | 僅索引用戶提問/標題，不索引回應內容，無搜尋，無整合 |
| **頁內增強搜尋** | Searchable ChatGPT（跨對話搜尋） | 無法配合虛擬滾動運作（隱藏 DOM 搜不到） |
| **對話自動保存** | Chat Memo、Auto-save ChatGPT History | 有自動保存，但無版本快照 + diff/還原機制 |
| **對話標籤** | Superpower/ChatGPT Toolbox 有資料夾 | 有資料夾層級，但無標籤系統 |

### 已充分覆蓋（不需重做）

| 功能 | 現有工具 |
|------|---------|
| **寬螢幕模式** | ChatGPT Widescreen（3+ 成熟方案）、KeepChatGPT |
| **多格式匯出** | Superpower（PDF/TXT/MD/JSON）、Save ChatGPT、Thread Toolkit |
| **資料夾管理** | Superpower、ChatGPT Toolbox、Easy Folders |
| **虛擬滾動/DOM 優化** | ChatGPT Lag Fixer（PolyForm Strict 授權） |

### 核心發現

1. **沒有任何單一工具整合超過一半的功能**。使用者必須同時安裝 4-5 個擴充功能，多擴充同時運行會造成效能劣化。
2. **三大零競爭功能**（選取工具列、引文剪貼簿、文本壓縮引擎）具有最強差異化。
3. **碎片化本身就是痛點**：整合型方案的存在價值不僅是功能，更是減少擴充衝突。

---

## 五、機會總結

| 維度 | 評估 |
|------|------|
| **市場需求** | 極高 — Open WebUI 124k stars、LobeChat 72k stars 證明龐大需求 |
| **競爭格局** | 碎片化 — 無整合型方案，最大玩家 Superpower 已轉閉源付費且口碑下滑 |
| **技術可行性** | 高 — GRA 已驗證核心技術，遷移到 ChatGPT 需適配 DOM 和 ProseMirror |
| **差異化空間** | 強 — 選取工具列、引文剪貼簿、Condense Engine 三項零競爭 |
| **進入門檻** | 中 — DOM 選擇器依賴 ChatGPT UI 穩定性，需持續維護 |

---

## 六、建議開發方向

### 策略：聚焦 3 個空白領域 + 可擴充架構

**Free 版核心功能：**
1. 選取工具列（SelectionToolbarModule）— 對話內文字選取後的浮動操作
2. 引文剪貼簿（CitationClipboardModule）— 多片段收集管理
3. 設定面板 + UI 整合

**Pro 版擴展功能：**
1. Condense Engine — 客戶端對話壓縮（獨一無二的差異化）
2. 側邊導航索引
3. 頁內增強搜尋
4. 對話持久化/快照
5. UI 淨化 + 寬螢幕

**架構原則：**
- 模組化設計（IIFE 模組），預留 ModuleRegistry / MessageScanner / InputIntegration / StorageService / EventBus 接口
- 先做 ChatGPT DOM 技術驗證 PoC
- 每步經過 debug + 人工驗證後才進入下一步

---

## 附錄：技術遷移評估（從 GRA 到 CRA）

| 項目 | GRA 現狀 | ChatGPT 適配需求 |
|------|---------|-----------------|
| DOM 選擇器 | Gemini 特定 | 需重新分析 ChatGPT DOM 結構 |
| API 攔截 | batchexecute 協議解析 | ChatGPT 使用 EventSource/SSE streaming |
| 輸入框整合 | Gemini contenteditable | ChatGPT 使用 ProseMirror 編輯器 |
| 儲存結構 | chrome.storage.local | 可沿用，key prefix 改為 `cra_` |
| 模組架構 | IIFE 模組化 | 可直接沿用 |
