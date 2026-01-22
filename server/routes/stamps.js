import express from 'express'
import db from '../database.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// 獲取用戶的集點卡
router.get('/:userId', (req, res) => {
  try {
    const { userId } = req.params

    const stamps = await db.all(
      'SELECT * FROM stamps WHERE user_id = ? ORDER BY created_at DESC',
      userId
    )

    const formattedStamps = stamps.map(s => ({
      id: s.id,
      userId: s.user_id,
      title: s.title,
      description: s.description,
      completed: s.completed === 1,
      createdAt: s.created_at
    }))

    res.json(formattedStamps)
  } catch (error) {
    console.error('獲取集點卡錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 創建集點卡
router.post('/', async (req, res) => {
  try {
    const { userId, title, description } = req.body

    if (!userId || !title) {
      return res.status(400).json({ error: '請填寫用戶ID和標題' })
    }

    const id = uuidv4()
    const createdAt = new Date().toISOString()

    await db.run(
      'INSERT INTO stamps (id, user_id, title, description, completed, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      id, userId, title, description || null, 0, createdAt
    )

    const stamp = {
      id,
      userId,
      title,
      description,
      completed: false,
      createdAt
    }

    res.status(201).json(stamp)
  } catch (error) {
    console.error('創建集點卡錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 切換集點卡完成狀態
router.patch('/:stampId/toggle', async (req, res) => {
  try {
    const { stampId } = req.params

    const stamp = await db.get('SELECT * FROM stamps WHERE id = ?', stampId)
    if (!stamp) {
      return res.status(404).json({ error: '集點卡不存在' })
    }

    const newCompleted = stamp.completed === 1 ? 0 : 1

    await db.run('UPDATE stamps SET completed = ? WHERE id = ?', newCompleted, stampId)

    res.json({ completed: newCompleted === 1 })
  } catch (error) {
    console.error('切換集點卡狀態錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 刪除集點卡
router.delete('/:stampId', async (req, res) => {
  try {
    const { stampId } = req.params

    const result = await db.run('DELETE FROM stamps WHERE id = ?', stampId)

    if (result.changes === 0) {
      return res.status(404).json({ error: '集點卡不存在' })
    }

    res.json({ message: '已刪除集點卡' })
  } catch (error) {
    console.error('刪除集點卡錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 獲取可見性設置
router.get('/:userId/visibility', async (req, res) => {
  try {
    const { userId } = req.params

    const visibility = await db.all(
      'SELECT visible_user_id FROM stamp_visibility WHERE user_id = ?',
      userId
    )

    const visibleUserIds = visibility.map(v => v.visible_user_id)
    res.json(visibleUserIds)
  } catch (error) {
    console.error('獲取可見性設置錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 切換可見性設置
router.post('/:userId/visibility', async (req, res) => {
  try {
    const { userId } = req.params
    const { friendId } = req.body

    if (!friendId) {
      return res.status(400).json({ error: '缺少好友ID' })
    }

    // 檢查是否已存在
    const existing = await db.get(
      'SELECT * FROM stamp_visibility WHERE user_id = ? AND visible_user_id = ?',
      userId, friendId
    )

    if (existing) {
      // 刪除
      await db.run(
        'DELETE FROM stamp_visibility WHERE user_id = ? AND visible_user_id = ?',
        userId, friendId
      )
      res.json({ visible: false })
    } else {
      // 添加
      const id = uuidv4()
      await db.run(
        'INSERT INTO stamp_visibility (id, user_id, visible_user_id) VALUES (?, ?, ?)',
        id, userId, friendId
      )
      res.json({ visible: true })
    }
  } catch (error) {
    console.error('切換可見性設置錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

export default router
