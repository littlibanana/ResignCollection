# Railway 部署問題修復指南

## 問題：Nixpacks 無法檢測構建方式

如果遇到 "Railpack could not determine how to build the app" 錯誤，請按照以下步驟修復：

## 解決方案

### 方法 1：使用 nixpacks.toml（推薦）

項目中已包含 `nixpacks.toml` 文件，這會明確告訴 Nixpacks 如何構建應用。

如果 Railway 仍然無法檢測，請：

1. **在 Railway 項目設置中**：
   - 進入項目設置
   - 找到 "Build" 或 "Settings" 選項卡
   - 確保 "Builder" 設置為 "Nixpacks"
   - 如果沒有，手動選擇 "Nixpacks"

2. **檢查文件是否存在**：
   - 確保 `nixpacks.toml` 文件在項目根目錄
   - 確保 `package.json` 存在且有效

3. **重新部署**：
   - 在 Railway 中觸發新的部署
   - 或推送新的提交到 GitHub

### 方法 2：手動設置構建命令

如果方法 1 不起作用：

1. **在 Railway 項目中**：
   - 點擊項目設置
   - 找到 "Variables" 或 "Settings"
   - 添加以下環境變量：
     - `NIXPACKS_NO_ERROR_ON_UNRECOGNIZED_BUILD_FILES=true`

2. **設置構建命令**：
   - 在項目設置中找到 "Build Command"
   - 設置為：`npm ci && npm run build`

3. **設置啟動命令**：
   - 在項目設置中找到 "Start Command"
   - 設置為：`node server/index.js`

### 方法 3：使用 Docker（備選）

如果 Nixpacks 仍然有問題，可以使用 Docker：

1. **確保 Dockerfile 存在**（項目中已包含）

2. **在 Railway 中**：
   - 項目設置 → Builder
   - 選擇 "Dockerfile"
   - Railway 會使用項目中的 Dockerfile

## 檢查清單

部署前確保：

- [ ] `package.json` 包含 `engines` 字段（已添加）
- [ ] `nixpacks.toml` 文件存在
- [ ] `railway.json` 配置正確
- [ ] `start` 腳本在 `package.json` 中定義
- [ ] `build` 腳本在 `package.json` 中定義

## 常見錯誤

### 錯誤：找不到 package.json

**解決方案**：確保 `package.json` 在項目根目錄

### 錯誤：構建失敗

**解決方案**：
1. 檢查構建日誌
2. 確保所有依賴都在 `dependencies` 中（不是 `devDependencies`）
3. 對於生產構建，可能需要將 `vite` 移到 `dependencies`

### 錯誤：找不到 node 命令

**解決方案**：確保 `nixpacks.toml` 中指定了正確的 Node.js 版本

## 快速修復步驟

1. **推送所有文件到 GitHub**：
   ```bash
   git add .
   git commit -m "Fix Railway deployment"
   git push
   ```

2. **在 Railway 中**：
   - 進入項目
   - 點擊 "Settings"
   - 找到 "Build & Deploy"
   - 確保 Builder 是 "Nixpacks"
   - 點擊 "Redeploy"

3. **如果還是不行**：
   - 刪除 Railway 項目
   - 重新創建項目
   - 重新連接 GitHub 倉庫

## 驗證部署

部署成功後，檢查：

1. **健康檢查端點**：
   ```
   https://your-app.railway.app/api/health
   ```
   應該返回：`{"status":"ok","message":"服務器運行正常"}`

2. **主頁**：
   ```
   https://your-app.railway.app
   ```
   應該顯示應用界面

## 需要幫助？

如果問題仍然存在：

1. 查看 Railway 構建日誌
2. 檢查所有配置文件是否正確
3. 嘗試使用 Docker 部署方式
4. 查看 Railway 文檔：https://docs.railway.app
