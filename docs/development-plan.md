# ChatGPT 聊天網頁體驗改善工具 — 分析報告與設計方向

## Context

用戶希望設計一個改善 ChatGPT 聊天網頁體驗的工具。本報告彙整了現有開源工具生態、使用者反饋痛點、以及競品 UX 差異分析，作為後續工具設計的決策依據。

目前本專案 (Gemini Reading Assistant) 已為 Google Gemini 打造了類似的增強工具，具備側邊導航、選取工具列、引文剪貼簿、頁內搜尋、對話持久化/匯出等功能。這些經驗可直接遷移到 ChatGPT 版本。

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
| **Superpower ChatGPT** | 資料夾、搜尋、匯出、提示詞庫、釘選訊息 | ~1.6k GitHub stars，最全面的單一擴充 |
| **ChatGPT Folders** | 自訂資料夾分類對話 | 16k+ 活躍用戶 |
| **Enhanced ChatGPT** | 聊天匯出 + 提示詞模板 | Chrome Web Store |
| **WebChatGPT** | 為回應加入網路搜尋結果 | 即時網路上下文 |

### Userscripts（Tampermonkey）
| 工具 | 核心功能 | 來源 |
|------|---------|------|
| **KeepChatGPT** | 自動刷新、Session 保活、追蹤攔截、全螢幕、頁面淨化 | GitHub，功能最豐富 |
| **ChatGPT Widescreen** | 寬/全/高螢幕模式 | adamlui，同時有擴充版 |
| **ChatGPT Auto-Continue** | 回應截斷時自動繼續生成 | adamlui 集合 |
| **ChatGPT UI Fix** | CSS 修正寬度、側邊欄、訊息佈局 | GitHub Gist |
| **ChatGPT Thread Toolkit** | 長對話保持回應、可匯出 | GitHub |

### 匯出工具
| 工具 | 功能 |
|------|------|
| **chatgpt-exporter** (pionxzh) | 匯出為 Markdown/HTML/JSON，可選特定對話 |
| **ai-chat-exporter** (revivalstack) | 支援 ChatGPT/Claude/Gemini/Grok，Alt+M/Alt+J 快捷鍵 |
| **chatgpt-export** (ryanschiang) | 匯出為 Markdown/JSON/PNG |

### 自架替代 UI（市場需求驗證）
| 專案 | GitHub Stars | 說明 |
|------|-------------|------|
| **Open WebUI** | ~124,000 | 最熱門自架 AI 聊天 UI，內建 RAG、語音、SSO |
| **LobeChat** | ~72,000 | 多 Agent 協作、Plugin 系統、精緻設計 |
| **LibreChat** | ~33,900 | ChatGPT 增強克隆，支援 Agents、MCP、對話分叉 |

---

## 三、競品 UX 優勢比較

| 特性 | ChatGPT | Claude | Gemini | Perplexity |
|------|---------|--------|--------|------------|
| 對話資料夾/標籤 | 無 | Projects | Labels | Collections |
| 輸出分離面板 | 無 (Canvas 有限) | Artifacts | Canvas | N/A |
| 內嵌引用來源 | 弱 | 中 | 中 | 優秀 |
| 寬螢幕響應式佈局 | 無（固定窄幅）| 較好 | 好 | 好 |
| 長對話效能 | 差（DOM 膨脹）| 較好 | 好 | N/A |
| 匯出選項 | 有限 | 下載 Artifacts | 有限 | 分享連結 |

---

## 四、機會缺口分析 — 現有工具未解決的問題

1. **無一站式解決方案**：現有工具各解決單一痛點（Widescreen 只改寬度、Folders 只加資料夾），缺乏整合型體驗增強
2. **長對話效能無人解決**：所有現有工具都是 UI 層面修補，沒有處理 DOM 膨脹的根本問題
3. **閱讀導航缺失**：無工具提供類似 Gemini Reading Assistant 的側邊導航索引功能
4. **選取互動貧乏**：無工具提供選取文字後的快捷操作（引文、解釋、簡化等）
5. **對話持久化/快照**：現有匯出工具僅為一次性匯出，缺乏自動保存 + 快照的持久化機制
6. **中文使用者特殊需求**：Condense Engine 的中文文本壓縮/正規化能力在現有工具中完全空白

---

## 五、開發策略 — 聚焦空白領域 + 可擴充架構

### 整體策略
- **核心**：聚焦 3 個零競爭領域（選取工具列、引文剪貼簿、Condense Engine）
- **架構**：模組化設計，預留接口供後續整合側邊導航、頁內搜尋、自動保存等功能
- **前提**：先做 ChatGPT DOM 技術驗證 PoC

### Step 0 — 技術可行性驗證（PoC）
目標：分析 ChatGPT 網頁的 DOM 結構，確認核心操作的可行性

1. **DOM 結構分析**
   - 對話容器、訊息元素、用戶/AI 訊息區分的選擇器
   - 訊息的巢狀結構（Markdown 渲染後的 DOM tree）
   - MutationObserver 監聽新訊息的可靠性
   - 滾動容器的定位

2. **輸入框整合分析**
   - ChatGPT 使用 ProseMirror 編輯器，需確認：
     - 程式化插入文字的方式（ProseMirror Transaction vs Selection API vs execCommand）
     - 事件觸發的正確性（讓 ChatGPT 偵測到輸入變化）

3. **Selection API 可行性**
   - 跨 Shadow DOM 的文字選取事件監聽
   - 選取範圍的座標計算（用於定位浮動工具列）

4. **API 攔截分析**
   - ChatGPT 使用 EventSource/SSE streaming，需確認攔截方式
   - 與 GRA 的 batchexecute 攔截機制的差異

**PoC 交付物**：一個最小 Chrome Extension，能在 ChatGPT 頁面上：
- 偵測並列出所有對話訊息
- 監聽文字選取事件並顯示座標
- 向輸入框插入文字

### Step 1 — 核心模組：選取工具列（SelectionToolbarModule）
從 GRA 遷移並適配 ChatGPT DOM，提供：
- 選取文字後浮現工具列
- 操作按鈕：複製、加入引文、解釋、簡化、舉例、要點整理
- 「解釋/簡化/舉例/要點整理」→ 自動插入輸入框並送出
- 位置自動調整（避免超出視窗）

### Step 2 — 核心模組：引文剪貼簿（CitationClipboardModule）
從 GRA 遷移，提供：
- 浮動面板管理已收集的文字片段
- 自動去重
- 一鍵插入 ChatGPT 輸入框
- chrome.storage.local 持久化
- 匯出為 Markdown/JSON

### Step 3 — 核心模組：Condense Engine 整合
從 GRA 遷移 condense-engine.js，提供：
- 對當前對話的 AI 回應進行摘要壓縮
- 摘要面板顯示壓縮後的結構化內容
- 支援中文文本正規化和角色分類
- 可折疊/展開查看原文

### 擴充接口預留
模組化架構設計（參考 GRA 的 IIFE 模組模式），預留以下接口：
- `ModuleRegistry` — 模組註冊/啟停機制
- `MessageScanner` — 統一的訊息掃描/索引服務，供導航、搜尋、Condense 共用
- `InputIntegration` — 統一的輸入框操作服務
- `StorageService` — 統一的儲存抽象層（key prefix: `cra_`）
- `EventBus` — 模組間通信

後續可按需加入的模組（不在初版範圍）：
- SidebarNavigationModule（側邊導航索引）
- PageSearchModule（頁內增強搜尋）
- ConversationPersistenceModule（對話持久化/快照）
- UICleanupModule（UI 淨化/寬螢幕）

---

## 六、現有工具覆蓋度 — 逐功能缺口分析

### 完全空白（零競爭，最大差異化）
| 功能 | 現況 |
|------|------|
| **選取工具列**（選取文字後的浮動操作按鈕） | 所有現有選取工具都是「把文字送去 AI」，沒有任何工具在 ChatGPT 對話內部提供儲存片段、引文、摘要、高亮等操作 |
| **引文剪貼簿**（多片段收集 + 標籤管理） | 現有工具僅有訊息級「複製」按鈕（如 CopyIt），無法收集多個片段並組織管理 |
| **文本壓縮引擎**（客戶端對話摘要/壓縮） | **完全無人做過** — 所有「摘要」工具都是用 API 處理外部文件，沒有前端對話壓縮引擎 |

### 部分覆蓋（有工具但淺或不整合）
| 功能 | 現有工具 | 缺口 |
|------|---------|------|
| **側邊導航索引** | GPT Table of Contents、ChatGPT Table of Contents（3+ 單功能擴充） | 僅索引用戶提問/標題，不索引回應內容，無搜尋，無與其他功能整合 |
| **頁內增強搜尋** | Searchable ChatGPT（跨對話搜尋） | 無法配合虛擬滾動運作（隱藏 DOM 搜不到） |
| **對話自動保存** | Chat Memo、Auto-save ChatGPT History | 有自動保存，但無版本快照 + diff/還原機制 |
| **對話標籤** | Superpower/ChatGPT Toolbox 有資料夾 | 有資料夾層級，但無標籤系統 |

### 已充分覆蓋（不需重做）
| 功能 | 現有工具 |
|------|---------|
| **寬螢幕模式** | ChatGPT Widescreen（3+ 成熟方案）、KeepChatGPT |
| **多格式匯出** | Superpower（PDF/TXT/MD/JSON）、Save ChatGPT、Thread Toolkit |
| **資料夾管理** | Superpower、ChatGPT Toolbox（17k+ 用戶）、Easy Folders |
| **虛擬滾動/DOM 優化** | ChatGPT Lag Fixer（127 stars，2026 年 1 月仍活躍，聲稱 70-90% DOM 減少）|

### 核心發現

**沒有任何單一工具整合超過一半的功能。** 使用者必須同時安裝 4-5 個擴充功能，但多擴充同時運行會造成效能劣化。這是最大的整合機會。

主要競爭者狀態：
- **Superpower ChatGPT** — GitHub 最後 commit 2023 年 4 月（已停更開源），轉為閉源付費（$10-15/月）。搜尋僅限標題，無內容搜尋。有誤導行銷和退款爭議。
- **KeepChatGPT** — Greasyfork 持續更新至 2026 年 2 月（v33.6，268k 安裝），但本質是穩定性/防斷線工具，不涉及閱讀體驗增強。
- **ChatGPT Lag Fixer** — 虛擬滾動做得好，但用 PolyForm Strict 授權（原始碼可看不可用）。

---

## 七、技術遷移評估

從 Gemini Reading Assistant 遷移到 ChatGPT 版本需要調整：

| 項目 | GRA 現狀 | ChatGPT 適配需求 |
|------|---------|-----------------|
| DOM 選擇器 | Gemini 特定 | 需重新分析 ChatGPT DOM 結構 |
| API 攔截 | batchexecute 協議解析 | ChatGPT 使用 EventSource/SSE streaming |
| 輸入框整合 | Gemini contenteditable | ChatGPT 使用 ProseMirror 編輯器 |
| 儲存結構 | chrome.storage.local | 可沿用，key prefix 改為 `cra_` |
| 模組架構 | IIFE 模組化 | 可直接沿用 |

---

---

## 八、開發路線圖 — Free 版 / Pro 版分階段

### 原則
- Free 版先行開發並完善，每個功能經過驗證（debug + 人工測試）通過後才進行下一步
- Pro 版在 Free 版全部完成後才開始
- 每步驟包含明確的驗證標準

---

### 🟢 FREE 版開發步驟

#### F0. 專案初始化 + ChatGPT DOM 技術驗證 PoC
**工作內容：**
- 建立 Chrome Extension 專案骨架（manifest.json, content.js, background.js, popup）
- 分析 ChatGPT DOM 結構：對話容器、訊息元素、用戶/AI 區分選擇器
- 分析 ProseMirror 輸入框：程式化插入文字的可行方式
- 分析 Selection API：文字選取事件監聽和座標計算
- 建立 `ModuleRegistry`、`MessageScanner`、`InputIntegration`、`StorageService`、`EventBus` 基礎架構

**驗證標準：**
- [ ] PoC 能在 chatgpt.com 正確偵測並列出所有對話訊息（含用戶/AI 區分）
- [ ] PoC 能監聽文字選取事件並正確取得選取範圍座標
- [ ] PoC 能向 ChatGPT 輸入框程式化插入文字，且 ChatGPT 能偵測到變化
- [ ] MutationObserver 能可靠監聽新訊息的出現
- [ ] 在新對話、長對話、Canvas 模式下選擇器均正常運作

---

#### F1. 選取工具列（SelectionToolbarModule）— 基礎版
**工作內容：**
- 選取文字後浮現浮動工具列
- 基礎操作按鈕：複製（純文字 + Markdown）、加入引文
- 工具列位置自動調整（避免超出視窗邊界）
- 點擊空白處或取消選取時自動隱藏

**驗證標準：**
- [ ] 在 AI 回應和用戶訊息中選取文字均能正確觸發工具列
- [ ] 工具列位置正確（不遮擋選取文字、不超出視窗）
- [ ] 複製按鈕能正確複製選取文字到剪貼簿
- [ ] 加入引文按鈕能將片段傳遞給引文剪貼簿模組（或暫存）
- [ ] 選取消失後工具列正確隱藏
- [ ] 不與 ChatGPT 原生的複製/選取功能衝突

---

#### F2. 引文剪貼簿（CitationClipboardModule）— 基礎版
**工作內容：**
- 側邊浮動面板顯示已收集的引文片段
- 從選取工具列「加入引文」的片段自動進入此面板
- 自動去重（相同文字不重複加入）
- 單個片段操作：刪除、複製
- 一鍵插入 ChatGPT 輸入框
- chrome.storage.local 持久化

**驗證標準：**
- [ ] 從選取工具列加入的引文正確出現在剪貼簿面板
- [ ] 重複引文被正確偵測並跳過
- [ ] 刪除片段後立即從面板移除
- [ ] 一鍵插入能將片段正確填入 ChatGPT 輸入框
- [ ] 重新載入頁面後引文仍然保留（持久化）
- [ ] 面板的開啟/關閉不影響 ChatGPT 正常使用

---

#### F3. 選取工具列 — 進階操作
**工作內容：**
- 新增操作按鈕：解釋、簡化、舉例、要點整理
- 點擊後自動構造 prompt 並插入輸入框
- 可選擇是否自動送出（預設不自動送出，讓用戶確認）

**驗證標準：**
- [ ] 每個操作按鈕正確構造預期的 prompt（包含選取的文字）
- [ ] Prompt 正確插入輸入框且 ChatGPT 偵測到輸入
- [ ] 用戶可在送出前編輯 prompt
- [ ] 中英文混合選取文字均正常運作

---

#### F4. 設定面板（Popup Settings）
**工作內容：**
- Extension popup 設定頁面
- 可開關各模組（選取工具列、引文剪貼簿）
- 引文管理：查看全部引文、批次刪除、匯出為 Markdown/JSON
- 快捷鍵設定

**驗證標準：**
- [ ] 模組開關即時生效（關閉後功能立即停用，開啟後恢復）
- [ ] 引文匯出格式正確（Markdown 格式化、JSON 結構完整）
- [ ] 設定在頁面重載後保持

---

#### F5. UI 美化 + 穩定性
**工作內容：**
- 統一視覺風格（配合 ChatGPT 深色/淺色主題）
- 動畫過渡效果
- 錯誤處理和邊界情況修復
- 效能優化（確保不拖慢 ChatGPT 頁面）

**驗證標準：**
- [ ] 深色模式和淺色模式均正確顯示
- [ ] Extension 載入後 ChatGPT 頁面效能無明顯下降（Lighthouse 評分對比）
- [ ] 100+ 則訊息的長對話中所有功能正常運作
- [ ] 無 console error / warning
- [ ] ChatGPT 頁面更新後（DOM 變化）extension 能自動適應

---

#### F6. Free 版整合測試 + 發布準備
**工作內容：**
- 端到端完整流程測試
- README 撰寫
- Chrome Web Store 準備（圖示、截圖、描述）
- Privacy policy

**驗證標準：**
- [ ] 完整流程：選取文字 → 工具列出現 → 加入引文 → 引文面板顯示 → 插入輸入框 → 送出
- [ ] 全新安裝後首次使用流程順暢
- [ ] 卸載後無殘留資料（或提示用戶是否保留）

---

### 🔵 PRO 版開發步驟（Free 版全部完成後）

#### P1. Condense Engine 整合
- 從 GRA 遷移 condense-engine.js
- 對 AI 回應進行客戶端摘要壓縮
- 摘要面板 + 可折疊/展開原文
- 中文文本正規化和角色分類

#### P2. 側邊導航索引（SidebarNavigationModule）
- 自動掃描對話建立索引
- 點擊跳轉 + 即時高亮
- 按用戶/AI 篩選
- 配合虛擬滾動（如有）

#### P3. 頁內增強搜尋（PageSearchModule）
- Ctrl+F 增強搜尋
- 僅搜對話內容
- TreeWalker 文字節點掃描
- 高亮 + 上下跳轉

#### P4. 對話持久化（ConversationPersistenceModule）
- 自動定時保存
- 版本快照 + diff
- 匯出為 MD/TXT/JSON/PDF

#### P5. UI 淨化 + 寬螢幕
- 移除追問問題
- 自適應寬度
- 程式碼區塊優化

---

## 九、交付物

退出計畫模式後立即建立：
1. `docs/chatgpt-enhancement-analysis-report.md` — 完整分析報告（供下載保存）
2. 開始 F0 步驟的開發工作
