# 雲端部署指南

本指南將幫助您將集點卡系統部署到各種雲端平台。

## 部署架構

本應用包含：
- **前端**：React + Vite
- **後端**：Express API
- **數據庫**：SQLite

## 推薦部署方案

### 方案 1：Railway（推薦 - 全棧部署）

Railway 可以同時部署前端和後端，並提供持久化存儲。

#### 步驟：

1. **註冊 Railway 帳號**
   - 訪問 https://railway.app
   - 使用 GitHub 登入

2. **創建新項目**
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇您的倉庫

3. **配置環境變量**
   - 在項目設置中添加：
     - `NODE_ENV=production`
     - `PORT=3001`（Railway 會自動設置）

4. **部署**
   - Railway 會自動檢測 `railway.json` 配置
   - 構建和部署會自動進行

5. **數據庫持久化**
   - Railway 提供持久化磁盤
   - 數據庫文件會自動保存

**優點**：
- ✅ 簡單易用
- ✅ 自動 HTTPS
- ✅ 免費額度充足
- ✅ 支持持久化存儲

---

### 方案 2：Render（推薦 - 全棧部署）

Render 提供免費的 Web 服務和持久化磁盤。

#### 步驟：

1. **註冊 Render 帳號**
   - 訪問 https://render.com
   - 使用 GitHub 登入

2. **創建 Web Service**
   - 點擊 "New +" → "Web Service"
   - 連接您的 GitHub 倉庫

3. **配置設置**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/index.js`
   - **Environment**: `Node`

4. **添加環境變量**
   - `NODE_ENV=production`
   - `PORT=10000`（Render 默認端口）

5. **添加持久化磁盤**
   - 在 "Disks" 選項卡中
   - 創建磁盤，掛載到 `/opt/render/project/src/server`
   - 大小：1GB（免費）

6. **部署**
   - 點擊 "Create Web Service"
   - 等待構建完成

**優點**：
- ✅ 免費層可用
- ✅ 自動 HTTPS
- ✅ 持久化磁盤支持
- ✅ 自動部署

---

### 方案 3：Vercel（前端）+ Railway/Render（後端）

分離部署前端和後端。

#### 前端部署（Vercel）：

1. **註冊 Vercel 帳號**
   - 訪問 https://vercel.com
   - 使用 GitHub 登入

2. **導入項目**
   - 點擊 "New Project"
   - 選擇您的倉庫
   - Framework Preset: Vite

3. **配置環境變量**
   - 添加 `VITE_API_URL=https://your-backend-url.com/api`
   - 替換為您的後端 URL

4. **部署**
   - 點擊 "Deploy"
   - Vercel 會自動構建和部署

#### 後端部署（Railway 或 Render）：

按照方案 1 或 2 的步驟部署後端。

**優點**：
- ✅ Vercel 前端部署非常快
- ✅ 全球 CDN
- ✅ 可以分別擴展

---

### 方案 4：Fly.io（推薦 - 全棧部署）

Fly.io 提供全球分佈式部署。

#### 步驟：

1. **安裝 Fly CLI**
   ```bash
   # Windows (PowerShell)
   iwr https://fly.io/install.ps1 -useb | iex
   ```

2. **登入 Fly.io**
   ```bash
   fly auth login
   ```

3. **初始化應用**
   ```bash
   fly launch
   ```

4. **配置 fly.toml**
   - 已包含在項目中
   - 確保端口設置正確

5. **部署**
   ```bash
   fly deploy
   ```

**優點**：
- ✅ 全球分佈
- ✅ 自動 HTTPS
- ✅ 持久化存儲

---

## 環境變量配置

在部署時，確保設置以下環境變量：

| 變量名 | 說明 | 默認值 |
|--------|------|--------|
| `NODE_ENV` | 環境模式 | `production` |
| `PORT` | 服務器端口 | `3001` |
| `VITE_API_URL` | API 基礎 URL（僅前端） | `/api` |

## 數據庫備份

### 自動備份腳本

創建 `scripts/backup.js`：

```javascript
import { copyFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const dbPath = join(__dirname, '../server/database.sqlite')
const backupPath = join(__dirname, `../backups/database-${Date.now()}.sqlite`)

copyFileSync(dbPath, backupPath)
console.log('備份完成:', backupPath)
```

### 定期備份

使用 cron job 或平台提供的定時任務功能定期備份數據庫。

## 部署檢查清單

- [ ] 代碼推送到 GitHub
- [ ] 環境變量已設置
- [ ] 構建命令正確
- [ ] 啟動命令正確
- [ ] 數據庫路徑可寫入
- [ ] HTTPS 已啟用
- [ ] 域名已配置（可選）

## 常見問題

### Q: 數據庫文件在哪裡？

A: 數據庫文件位於 `server/database.sqlite`。在雲端部署時，確保平台提供持久化存儲。

### Q: 如何更新應用？

A: 推送代碼到 GitHub，平台會自動重新部署（如果啟用了自動部署）。

### Q: 如何查看日誌？

A: 在平台的儀表板中查看實時日誌，或使用 CLI 工具。

### Q: 如何設置自定義域名？

A: 在平台設置中添加自定義域名，並按照指示配置 DNS。

## 性能優化建議

1. **啟用 Gzip 壓縮**
2. **使用 CDN**（如果分離部署）
3. **數據庫索引優化**
4. **緩存靜態資源**

## 安全建議

1. **使用環境變量存儲敏感信息**
2. **啟用 HTTPS**
3. **設置 CORS 限制**
4. **定期更新依賴**
5. **實施密碼加密**（當前為演示版本）

## 監控和維護

- 設置錯誤監控（如 Sentry）
- 配置日誌聚合
- 設置健康檢查端點
- 定期備份數據庫

## 免費額度對比

| 平台 | 免費額度 | 數據庫支持 | 持久化存儲 |
|------|----------|------------|------------|
| Railway | $5/月 | ✅ | ✅ |
| Render | 免費層 | ✅ | ✅ |
| Vercel | 100GB/月 | ❌ | ❌ |
| Fly.io | 3 個 VM | ✅ | ✅ |

## 需要幫助？

如果遇到部署問題，請檢查：
1. 構建日誌
2. 運行時日誌
3. 環境變量設置
4. 端口配置
5. 數據庫路徑權限
