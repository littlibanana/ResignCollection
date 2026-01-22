# 使用 Node.js 官方映像
FROM node:18-alpine

# 設置工作目錄
WORKDIR /app

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
