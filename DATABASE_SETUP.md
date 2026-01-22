# SQLite 數據庫設置說明

## 概述

應用已從 localStorage 遷移到 SQLite 數據庫，所有數據現在持久化存儲在服務器端。

## 數據庫結構

### 表結構

1. **users** - 用戶表
   - id (TEXT PRIMARY KEY)
   - username (TEXT UNIQUE)
   - password (TEXT)
   - email (TEXT)
   - created_at (TEXT)

2. **friendships** - 好友關係表
   - id (TEXT PRIMARY KEY)
   - user_id1 (TEXT)
   - user_id2 (TEXT)
   - status (TEXT) - 'pending' 或 'accepted'
   - created_at (TEXT)

3. **stamps** - 集點卡表
   - id (TEXT PRIMARY KEY)
   - user_id (TEXT)
   - title (TEXT)
   - description (TEXT)
   - completed (INTEGER) - 0 或 1
   - created_at (TEXT)

4. **stamp_visibility** - 集點卡可見性設置表
   - id (TEXT PRIMARY KEY)
   - user_id (TEXT)
   - visible_user_id (TEXT)

## 安裝和運行

### 1. 安裝依賴

```bash
npm install
```

這將安裝所有必要的依賴，包括：
- Express (後端框架)
- better-sqlite3 (SQLite 數據庫)
- cors (跨域支持)
- uuid (生成唯一ID)
- concurrently (同時運行前後端)

### 2. 啟動應用

```bash
npm run dev
```

這將同時啟動：
- 後端服務器：`http://localhost:3001`
- 前端開發服務器：`http://localhost:5173`

### 3. 數據庫文件

數據庫文件會自動創建在 `server/database.sqlite`。

**注意**：數據庫文件已添加到 `.gitignore`，不會被提交到版本控制。

## API 端點

### 用戶 API

- `POST /api/users/register` - 註冊新用戶
- `POST /api/users/login` - 用戶登入
- `GET /api/users/:id` - 獲取用戶信息
- `GET /api/users` - 獲取所有用戶（用於好友搜索）

### 好友 API

- `POST /api/friends/request` - 發送好友請求
- `GET /api/friends/:userId` - 獲取好友列表
- `GET /api/friends/:userId/requests` - 獲取待處理的好友請求
- `POST /api/friends/accept` - 接受好友請求
- `DELETE /api/friends/reject/:requestId` - 拒絕好友請求

### 集點卡 API

- `GET /api/stamps/:userId` - 獲取用戶的集點卡
- `POST /api/stamps` - 創建新集點卡
- `PATCH /api/stamps/:stampId/toggle` - 切換集點卡完成狀態
- `DELETE /api/stamps/:stampId` - 刪除集點卡
- `GET /api/stamps/:userId/visibility` - 獲取可見性設置
- `POST /api/stamps/:userId/visibility` - 切換可見性設置

## 數據遷移

如果您之前使用 localStorage 版本，需要重新註冊帳號。數據無法自動遷移，因為：
1. localStorage 數據存儲在瀏覽器中
2. 新系統使用服務器端數據庫

## 備份數據庫

建議定期備份 `server/database.sqlite` 文件：

```bash
# Windows
copy server\database.sqlite server\database.backup.sqlite

# Linux/Mac
cp server/database.sqlite server/database.backup.sqlite
```

## 重置數據庫

如果需要重置數據庫，只需刪除 `server/database.sqlite` 文件，然後重啟服務器。數據庫會自動重新創建。

## 故障排除

### 問題：無法連接到後端服務器

**解決方案**：
1. 確保後端服務器正在運行（端口 3001）
2. 檢查防火牆設置
3. 查看終端中的錯誤信息

### 問題：數據庫錯誤

**解決方案**：
1. 檢查 `server/database.sqlite` 文件是否存在
2. 確保有寫入權限
3. 如果數據庫損壞，刪除文件並重啟服務器

### 問題：端口被占用

**解決方案**：
- 後端：修改 `server/index.js` 中的 PORT
- 前端：修改 `vite.config.js` 中的 port

## 生產環境部署

在生產環境中，建議：
1. 使用環境變量管理配置
2. 設置數據庫備份計劃
3. 使用 HTTPS
4. 實施密碼加密（目前密碼以明文存儲，僅用於演示）

## 安全注意事項

⚠️ **重要**：當前實現中密碼以明文存儲，僅用於演示目的。在生產環境中，應該：
- 使用 bcrypt 或其他加密庫對密碼進行哈希
- 實施 JWT 或其他認證機制
- 使用 HTTPS
- 添加輸入驗證和清理
