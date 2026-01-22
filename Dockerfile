# 使用 Node.js 官方映像（使用完整版本而非 alpine，避免構建問題）
FROM node:18-slim

# 設置工作目錄
WORKDIR /app

# 安裝必要的系統依賴（sqlite3 需要）
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 複製 package 文件
COPY package*.json ./

# 安裝所有依賴（包括 devDependencies，因為構建需要 vite）
RUN npm ci

# 複製應用代碼
COPY . .

# 構建前端
RUN npm run build

# 暴露端口
EXPOSE 3001

# 設置環境變量
ENV NODE_ENV=production

# 啟動應用
CMD ["node", "server/index.js"]
