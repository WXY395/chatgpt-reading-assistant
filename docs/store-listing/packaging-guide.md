# CRA 打包指南 — Chrome Web Store 提交

## 方法一：ZIP 打包（推薦）

### 需要包含的檔案
```
manifest.json
background.js
content.css
popup.html
popup.css
popup.js
icons/
  icon16.png
  icon48.png
  icon128.png
utils/
  storage.js
  event-bus.js
  events.js
  ui-helpers.js
  markdown.js
content/
  core/
    dom.js
    registry.js
    runtime-handler.js
    spa-observer.js
    bootstrap.js
  modules/
    message-scanner.js
    input-integration.js
    selection-tracker.js
    selection-toolbar.js
    citation-clipboard.js
```

### 不要包含的檔案
```
.git/
.claude/
.gitignore
docs/
README.md
CONTRIBUTING.md
CHANGELOG.md
SECURITY.md
PRIVACY.md       ← 隱私政策需要另外以 URL 提供
LICENSE
*.md (所有 markdown)
```

### 打包命令（在專案根目錄執行）

#### Windows (PowerShell)
```powershell
# 建立打包用的暫存目錄
$dest = ".\cra-release"
Remove-Item -Recurse -Force $dest -ErrorAction SilentlyContinue
New-Item -ItemType Directory -Path $dest

# 複製所需檔案
Copy-Item manifest.json $dest
Copy-Item background.js $dest
Copy-Item content.css $dest
Copy-Item popup.html $dest
Copy-Item popup.css $dest
Copy-Item popup.js $dest
Copy-Item -Recurse icons $dest\icons
Copy-Item -Recurse utils $dest\utils
Copy-Item -Recurse content $dest\content

# 打包為 ZIP
Compress-Archive -Path "$dest\*" -DestinationPath "cra-v0.1.0.zip" -Force

# 清理
Remove-Item -Recurse -Force $dest
```

#### Bash (Linux/Mac)
```bash
zip -r cra-v0.1.0.zip \
  manifest.json background.js content.css \
  popup.html popup.css popup.js \
  icons/ utils/ content/ \
  -x "*.DS_Store" -x "*__MACOSX*"
```

### 驗證打包檔
1. 解壓縮到新資料夾
2. 在 `chrome://extensions/` 以 Developer mode 載入
3. 確認功能正常
4. 確認 Console 無錯誤

## 方法二：Chrome 打包（產生 .crx）

> 注意：CWS 提交使用 .zip，不是 .crx。.crx 用於自行分發。

```
1. 開啟 chrome://extensions/
2. 點擊「Pack extension」
3. Extension root directory: 選擇專案資料夾
4. Private key file: 留空（首次打包會自動產生）
5. 保存產生的 .crx 和 .pem 檔案
```

**重要：** `.pem` 私鑰檔案必須妥善保管，不可上傳到 GitHub。用於日後更新擴充功能的身份驗證。

## 提交到 Chrome Web Store

1. 前往 https://chrome.google.com/webstore/devconsole
2. 點擊「New Item」
3. 上傳 .zip 檔案
4. 填寫 Store Listing（見 chrome-web-store.md）
5. 上傳截圖和 Promo Tiles
6. 填寫 Privacy Practices
7. 提交審核
8. 等待 1-3 個工作天
