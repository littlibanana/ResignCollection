import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import db from './database.js'
import userRoutes from './routes/users.js'
import friendRoutes from './routes/friends.js'
import stampRoutes from './routes/stamps.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3001

// 中間件
app.use(cors())
app.use(express.json())

// 在生產環境中提供靜態文件
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')))
}

// 路由
app.use('/api/users', userRoutes)
app.use('/api/friends', friendRoutes)
app.use('/api/stamps', stampRoutes)

// 健康檢查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: '服務器運行正常' })
})

// 在生產環境中，所有非 API 路由都返回 index.html（用於 React Router）
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../dist/index.html'))
    }
  })
}

// 啟動服務器
app.listen(PORT, '0.0.0.0', () => {
  console.log(`服務器運行在 http://0.0.0.0:${PORT}`)
  console.log(`本地訪問: http://localhost:${PORT}`)
  if (process.env.NODE_ENV === 'production') {
    console.log('生產環境模式：靜態文件已啟用')
  }
})
