import express from 'express'
import db from '../database.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// 註冊
router.post('/register', async (req, res) => {
  try {
    const { username, password, email } = req.body

    if (!username || !password || !email) {
      return res.status(400).json({ error: '請填寫所有必填欄位' })
    }

    // 檢查用戶名是否已存在
    const existingUser = await db.get('SELECT * FROM users WHERE username = ?', username)
    if (existingUser) {
      return res.status(400).json({ error: '用戶名已存在' })
    }

    // 創建新用戶
    const id = uuidv4()
    const createdAt = new Date().toISOString()

    await db.run(
      'INSERT INTO users (id, username, password, email, created_at) VALUES (?, ?, ?, ?, ?)',
      id, username, password, email, createdAt
    )

    const user = {
      id,
      username,
      email,
      createdAt
    }

    res.status(201).json(user)
  } catch (error) {
    console.error('註冊錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 登入
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    if (!username || !password) {
      return res.status(400).json({ error: '請填寫用戶名和密碼' })
    }

    const user = await db.get(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      username, password
    )

    if (!user) {
      return res.status(401).json({ error: '用戶名或密碼錯誤' })
    }

    // 不返回密碼
    const { password: _, ...userWithoutPassword } = user
    res.json(userWithoutPassword)
  } catch (error) {
    console.error('登入錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 獲取用戶信息
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const user = await db.get(
      'SELECT id, username, email, created_at FROM users WHERE id = ?',
      id
    )

    if (!user) {
      return res.status(404).json({ error: '用戶不存在' })
    }

    res.json(user)
  } catch (error) {
    console.error('獲取用戶錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 獲取所有用戶（用於好友搜索）
router.get('/', async (req, res) => {
  try {
    const users = await db.all('SELECT id, username, email FROM users')
    res.json(users)
  } catch (error) {
    console.error('獲取用戶列表錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

export default router
