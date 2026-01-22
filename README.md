# 集點卡系統 (ResignCollection)

一個使用 React 構建的集點卡管理系統，支持用戶註冊、好友管理和集點卡功能。

## 功能特色

1. **用戶註冊與登入**
   - 用戶可以註冊新帳號
   - 安全的登入系統
   - 自動保存登入狀態

2. **好友管理**
   - 發送好友請求
   - 接受/拒絕好友請求
   - 查看好友列表

3. **集點卡功能**
   - 創建和管理個人集點卡
   - 追蹤完成進度
   - 選擇查看好友的集點卡
   - 美觀的進度顯示

## 技術棧

- **React 18** - 前端框架
- **React Router** - 路由管理
- **Vite** - 構建工具
- **Context API** - 狀態管理
- **LocalStorage** - 數據持久化

## 安裝與運行

### 前置需求

- Node.js (建議 v16 或更高版本)
- npm 或 yarn

### 安裝步驟

1. 安裝依賴：
```bash
npm install
```

2. 啟動開發服務器：
```bash
npm run dev
```

3. 在瀏覽器中打開顯示的本地地址（通常是 `http://localhost:5173`）

### 構建生產版本

```bash
npm run build
```

構建完成後，文件將在 `dist` 目錄中。

### 預覽生產版本

```bash
npm run preview
```

## 使用說明

### 註冊帳號

1. 訪問註冊頁面
2. 填寫用戶名、電子郵件和密碼
3. 點擊「註冊」按鈕
4. 註冊成功後會自動登入並跳轉到首頁

### 添加好友

1. 登入後，點擊導航欄的「好友」連結
2. 在「添加好友」區域輸入好友的用戶名
3. 點擊「發送好友請求」
4. 對方會在「好友請求」區域看到請求，可以選擇接受或拒絕

### 使用集點卡

1. 在首頁的「我的集點卡」區域：
   - 輸入集點項目名稱和描述（選填）
   - 點擊「新增集點」按鈕
   - 點擊集點項目可以切換完成狀態
   - 查看進度條了解完成情況

2. 查看好友集點卡：
   - 在「好友集點卡」區域勾選想要查看的好友
   - 從下拉選單中選擇好友
   - 查看該好友的集點卡內容

## 項目結構

```
ResignCollection/
├── src/
│   ├── components/          # 可重用組件
│   │   ├── Navbar.jsx      # 導航欄
│   │   └── Navbar.css
│   ├── contexts/            # Context API 狀態管理
│   │   ├── AuthContext.jsx # 認證狀態
│   │   ├── FriendContext.jsx # 好友狀態
│   │   └── StampContext.jsx  # 集點卡狀態
│   ├── pages/              # 頁面組件
│   │   ├── Login.jsx       # 登入頁面
│   │   ├── Register.jsx    # 註冊頁面
│   │   ├── Home.jsx        # 首頁（集點卡）
│   │   ├── Friends.jsx     # 好友管理頁面
│   │   ├── Auth.css        # 認證頁面樣式
│   │   ├── Home.css        # 首頁樣式
│   │   └── Friends.css     # 好友頁面樣式
│   ├── App.jsx             # 主應用組件
│   ├── App.css
│   ├── main.jsx            # 應用入口
│   └── index.css           # 全局樣式
├── index.html              # HTML 模板
├── package.json            # 項目配置
├── vite.config.js          # Vite 配置
└── README.md               # 說明文檔
```

## 數據存儲

本應用使用瀏覽器的 LocalStorage 來存儲數據，包括：
- 用戶資料
- 好友關係
- 集點卡數據
- 可見性設置

**注意**：這是一個演示應用，實際生產環境應該使用後端數據庫。

## 瀏覽器支持

支持所有現代瀏覽器，包括：
- Chrome (最新版本)
- Firefox (最新版本)
- Safari (最新版本)
- Edge (最新版本)

## 雲端部署

本應用已配置好多種雲端部署方案，詳見 [DEPLOYMENT.md](./DEPLOYMENT.md)。

### 快速部署（推薦）

**Railway** - 最簡單的全棧部署：
1. 訪問 https://railway.app
2. 使用 GitHub 登入
3. 選擇 "Deploy from GitHub repo"
4. 選擇您的倉庫
5. 等待自動部署完成

詳細步驟請查看 [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)。

### 其他部署選項

- **Render** - 免費層可用，支持持久化存儲
- **Fly.io** - 全球分佈式部署
- **Vercel + Railway** - 分離部署前端和後端

## 授權

此項目僅供學習和演示使用。
