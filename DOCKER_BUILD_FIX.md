# Docker 構建錯誤修復（Exit Code 127）

## 問題分析

Exit code 127 通常表示：
- 命令找不到（command not found）
- 在 Docker 構建過程中，可能是因為：
  1. `sqlite3` 需要編譯原生模塊，需要構建工具
  2. Alpine Linux 缺少必要的構建依賴

## 已修復的 Dockerfile

### 主要更改：

1. **從 `node:18-alpine` 改為 `node:18-slim`**
   - Alpine 版本更小，但缺少一些構建工具
   - Slim 版本包含更多工具，但仍比完整版本小

2. **添加構建依賴**
   ```dockerfile
   RUN apt-get update && apt-get install -y \
       python3 \
       make \
       g++ \
       && rm -rf /var/lib/apt/lists/*
   ```
   這些是編譯 `sqlite3` 原生模塊所需的工具。

3. **確保 npm 可用**
   - 使用 `npm ci` 而不是 `npm install`
   - 這確保依賴版本一致

## 使用方式

### 標準 Dockerfile（推薦）

使用 `node:18-slim`，包含必要的構建工具：

```bash
docker build -t resign-collection .
```

### Alpine 版本（更小）

如果想使用更小的鏡像，使用 `Dockerfile.alpine`：

```bash
docker build -f Dockerfile.alpine -t resign-collection .
```

## Railway 部署

### 如果使用 Docker：

1. **確保使用修復後的 Dockerfile**
2. **在 Railway 中**：
   - 項目設置 → Builder
   - 選擇 "Dockerfile"
   - Railway 會自動使用 Dockerfile

### 如果使用 Nixpacks（推薦）：

1. **使用 `nixpacks.toml`**（已更新，包含構建工具）
2. **在 Railway 中**：
   - 項目設置 → Builder
   - 選擇 "Nixpacks"
   - Railway 會自動使用 nixpacks.toml

## 驗證修復

### 本地測試：

```bash
# 構建鏡像
docker build -t resign-collection .

# 如果成功，運行容器
docker run -p 3001:3001 resign-collection

# 測試健康檢查
curl http://localhost:3001/api/health
```

### 檢查構建日誌：

如果仍然失敗，查看構建日誌中的具體錯誤：
- 是否成功安裝依賴？
- 是否成功執行 `npm run build`？
- 是否有其他錯誤信息？

## 常見問題

### Q: 為什麼需要 python3、make、g++？

**A**: `sqlite3` 是一個原生 Node.js 模塊，需要在構建時編譯。這些工具是編譯 C++ 代碼所需的。

### Q: 可以使用更小的鏡像嗎？

**A**: 可以，使用 `Dockerfile.alpine`，但需要安裝構建工具（已包含在文件中）。

### Q: 構建時間太長？

**A**: 這是正常的，因為需要：
1. 安裝系統依賴
2. 安裝 npm 依賴
3. 編譯 sqlite3
4. 構建前端

### Q: 可以優化構建速度嗎？

**A**: 使用多階段構建可以緩存依賴層，但對於這個項目，當前的 Dockerfile 已經足夠。

## 替代方案

如果 Docker 構建仍然有問題，可以：

1. **使用 Nixpacks**（Railway 推薦）
   - 更簡單
   - 自動處理構建工具
   - 使用 `nixpacks.toml` 配置

2. **使用 Render**
   - 支持 Docker 和原生構建
   - 自動處理依賴

3. **使用 Fly.io**
   - 支持 Dockerfile
   - 有詳細的構建日誌

## 下一步

1. **推送修復後的文件**：
   ```bash
   git add .
   git commit -m "Fix Docker build: add build dependencies"
   git push
   ```

2. **在 Railway 中重新部署**

3. **如果使用 Docker**：確保 Builder 設置為 "Dockerfile"

4. **如果使用 Nixpacks**：確保 Builder 設置為 "Nixpacks"

現在應該可以成功構建了！
