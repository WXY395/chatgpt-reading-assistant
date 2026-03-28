# GitHub 發布指南

## Step 1: 建立 Repository

### 透過 GitHub CLI
```bash
cd F:\chatgpt-enhancement

# 建立公開 repo
gh repo create chatgpt-reading-assistant --public --source=. --push

# 或如果已建立 repo，只需設定 remote
git remote add origin https://github.com/YOUR_USERNAME/chatgpt-reading-assistant.git
git branch -M main
git push -u origin main
```

### 透過 GitHub 網頁
1. 前往 https://github.com/new
2. Repository name: `chatgpt-reading-assistant`
3. Description: `Stop losing insights in long ChatGPT conversations. Select, collect, reuse — without leaving the chat.`
4. Public
5. 不要勾選 Initialize（已有本地檔案）
6. Create repository
7. 依照頁面指示 push 本地檔案

## Step 2: Repository 設定

### Settings → General
- [x] Issues: enabled
- [x] Discussions: enabled
- [ ] Wiki: disabled（用 docs/ 替代）
- [ ] Projects: optional

### Settings → Social Preview
上傳 `docs/screenshots/og-image.png`（1280×640px）

### Settings → Topics
點擊 repo 名稱旁的齒輪圖示，加入：
```
chatgpt, chrome-extension, productivity, ai-tools,
reading-assistant, manifest-v3, vanilla-js, open-source
```

### Settings → Branches → Branch protection
- Branch name pattern: `main`
- [x] Require a pull request before merging
- [x] Require approvals: 1（如果有合作者）

## Step 3: 建立 Release

### 透過 GitHub CLI
```bash
# 建立 tag
git tag -a v0.1.0 -m "v0.1.0 — Selection Toolbar + Citation Clipboard"
git push origin v0.1.0

# 建立 Release（先準備好 zip）
# Windows PowerShell 打包命令（見 packaging-guide.md）

gh release create v0.1.0 \
  --title "v0.1.0 — Selection Toolbar + Citation Clipboard" \
  --notes-file CHANGELOG.md \
  cra-v0.1.0.zip
```

### 透過 GitHub 網頁
1. 前往 repo → Releases → Create a new release
2. Tag: `v0.1.0`（Create new tag on publish）
3. Title: `v0.1.0 — Selection Toolbar + Citation Clipboard`
4. Description: 從 CHANGELOG.md 複製 v0.1.0 內容
5. 附加 `cra-v0.1.0.zip`
6. Publish release

## Step 4: 建立 Issue Templates

### Bug Report Template
在 repo 中建立 `.github/ISSUE_TEMPLATE/bug_report.md`:

```yaml
---
name: Bug Report
about: Report a bug to help us improve
title: '[Bug] '
labels: bug
---

**Chrome Version:**
**CRA Version:**
**ChatGPT Page:** (e.g., new conversation, existing conversation, Canvas mode)

**Steps to Reproduce:**
1.
2.
3.

**Expected Behavior:**

**Actual Behavior:**

**Console Errors (filter by CRA):**

**Screenshot (if applicable):**
```

### Feature Request Template
建立 `.github/ISSUE_TEMPLATE/feature_request.md`:

```yaml
---
name: Feature Request
about: Suggest a new feature
title: '[Feature] '
labels: enhancement
---

**Use Case:**
What problem would this feature solve?

**Proposed Solution:**
How should it work?

**Alternatives Considered:**
Have you tried any workarounds?

**Additional Context:**
```

## Step 5: 更新 README 中的連結

上傳後，把 README.md 中所有 `[LINK]` 和 `https://github.com/user/chatgpt-reading-assistant` 替換為實際的 GitHub repo URL。

## Step 6: Privacy Policy URL

Chrome Web Store 需要一個公開可訪問的 Privacy Policy URL。

### 選項 A: GitHub Pages（推薦）
1. Settings → Pages → Source: Deploy from a branch → `main` → `/docs`
2. Privacy Policy URL: `https://YOUR_USERNAME.github.io/chatgpt-reading-assistant/legal/PRIVACY`

### 選項 B: 直接連結到 GitHub 檔案
```
https://github.com/YOUR_USERNAME/chatgpt-reading-assistant/blob/main/PRIVACY.md
```

## 發布後注意事項

1. **第一天** — 密切關注 Issues，快速回覆
2. **第一週** — 每天檢查 Star 數和 Fork 數
3. **持續** — 監控 ChatGPT 的 DOM 變動，及時更新選擇器
4. **每月** — 更新 CHANGELOG，發布新版本
