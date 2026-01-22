# 快速部署指南

## 🚀 最簡單的部署方式：Railway

### 步驟 1：準備代碼

1. 確保所有代碼已推送到 GitHub
2. 檢查 `railway.json` 文件是否存在

### 步驟 2：部署到 Railway

1. **訪問 Railway**
   - 打開 https://railway.app
   - 使用 GitHub 登入

2. **創建新項目**
   - 點擊 "New Project"
   - 選擇 "Deploy from GitHub repo"
   - 選擇您的倉庫

3. **自動部署**
   - Railway 會自動檢測配置
   - 等待構建完成（約 2-3 分鐘）

4. **獲取 URL**
   - 部署完成後，點擊項目
   - 複製生成的 URL（例如：`https://your-app.railway.app`）

5. **設置環境變量**（可選）
   - 在項目設置中添加：
     - `NODE_ENV=production`

### 步驟 3：完成！

您的應用現在已經在線了！🎉

---

## 🎯 其他快速部署選項

### Render（免費）

1. 訪問 https://render.com
2. 使用 GitHub 登入
3. 點擊 "New +" → "Web Service"
4. 連接您的倉庫
5. 設置：
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `node server/index.js`
6. 點擊 "Create Web Service"

### Fly.io（全球分佈）

```bash
# 安裝 Fly CLI
iwr https://fly.io/install.ps1 -useb | iex

# 登入
fly auth login

# 部署
fly launch
fly deploy
```

---

## 📝 部署前檢查清單

- [ ] 代碼已推送到 GitHub
- [ ] `package.json` 包含 `start` 腳本
- [ ] 環境變量已設置（如果需要）
- [ ] 數據庫路徑正確
- [ ] 測試本地構建：`npm run build`

---

## 🔧 常見問題

### 構建失敗？

檢查：
- Node.js 版本（需要 18+）
- 所有依賴是否正確安裝
- 構建日誌中的錯誤信息

### 應用無法啟動？

檢查：
- 端口設置（使用環境變量 `PORT`）
- 數據庫路徑權限
- 運行時日誌

### 數據庫丟失？

確保：
- 平台提供持久化存儲
- 數據庫文件路徑正確
- 定期備份數據庫

---

## 💡 提示

- **免費額度**：Railway 提供 $5/月免費額度
- **自動部署**：推送代碼到 GitHub 會自動重新部署
- **自定義域名**：在平台設置中添加您的域名

---

需要詳細說明？查看 `DEPLOYMENT.md` 文件。
