# Docker 構建問題修復指南

## 錯誤：exit code 127

這個錯誤通常表示：
- 命令找不到（npm 或 node）
- 或者構建腳本執行失敗

## 已修復的問題

### 問題 1：缺少構建依賴

**原因**：Dockerfile 使用了 `npm ci --only=production`，這會跳過 `devDependencies`，但構建前端需要 `vite` 和 `@vitejs/plugin-react`。

**修復**：改為 `npm ci`，安裝所有依賴（包括 devDependencies）。

### 問題 2：構建順序

**修復**：確保在複製代碼後再執行構建命令。

## 驗證修復

### 本地測試 Docker 構建

```bash
# 構建鏡像
docker build -t resign-collection .

# 運行容器
docker run -p 3001:3001 resign-collection
```

### 檢查構建日誌

如果仍然失敗，檢查：
1. 構建日誌中的具體錯誤信息
2. 確保所有文件都已複製
3. 確保 package.json 中的腳本正確

## 替代 Dockerfile（多階段構建）

如果需要優化鏡像大小，可以使用多階段構建：

```dockerfile
# 構建階段
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 運行階段
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
COPY server ./server
ENV NODE_ENV=production
EXPOSE 3001
CMD ["node", "server/index.js"]
```

## 常見問題

### Q: 構建時找不到 vite 命令

**A**: 確保使用 `npm ci` 而不是 `npm ci --only=production`，因為 vite 在 devDependencies 中。

### Q: 構建成功但運行時出錯

**A**: 檢查：
- 環境變量是否設置正確
- 數據庫路徑是否正確
- 端口是否正確暴露

### Q: 鏡像太大

**A**: 使用多階段構建（見上方），或者使用 `.dockerignore` 排除不必要的文件。

## Railway 使用 Docker

如果 Railway 使用 Docker 部署：

1. **確保 Dockerfile 存在**（已修復）
2. **在 Railway 中**：
   - 項目設置 → Builder
   - 選擇 "Dockerfile"
   - Railway 會自動使用 Dockerfile

3. **或者使用 Nixpacks**：
   - 項目設置 → Builder
   - 選擇 "Nixpacks"
   - 使用 `nixpacks.toml` 配置

## 下一步

1. 推送修復後的 Dockerfile 到 GitHub
2. 在 Railway 中重新部署
3. 如果使用 Docker，確保 Builder 設置為 "Dockerfile"
