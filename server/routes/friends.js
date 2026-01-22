import express from 'express'
import db from '../database.js'
import { v4 as uuidv4 } from 'uuid'

const router = express.Router()

// 發送好友請求
router.post('/request', async (req, res) => {
  try {
    const { userId1, userId2 } = req.body

    if (!userId1 || !userId2) {
      return res.status(400).json({ error: '缺少用戶ID' })
    }

    if (userId1 === userId2) {
      return res.status(400).json({ error: '不能添加自己為好友' })
    }

    // 檢查是否已經是好友或已有請求
    const existing = await db.get(
      'SELECT * FROM friendships WHERE (user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?)',
      userId1, userId2, userId2, userId1
    )

    if (existing) {
      if (existing.status === 'accepted') {
        return res.status(400).json({ error: '已經是好友了' })
      } else {
        return res.status(400).json({ error: '已經發送過好友請求' })
      }
    }

    // 創建好友請求
    const id = uuidv4()
    const createdAt = new Date().toISOString()

    await db.run(
      'INSERT INTO friendships (id, user_id1, user_id2, status, created_at) VALUES (?, ?, ?, ?, ?)',
      id, userId1, userId2, 'pending', createdAt
    )

    res.status(201).json({ id, userId1, userId2, status: 'pending', createdAt })
  } catch (error) {
    console.error('發送好友請求錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 獲取好友列表
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params

    const friendships = await db.all(`
      SELECT f.*, 
        CASE 
          WHEN f.user_id1 = ? THEN u2.id
          ELSE u1.id
        END as friend_id,
        CASE 
          WHEN f.user_id1 = ? THEN u2.username
          ELSE u1.username
        END as friend_username,
        CASE 
          WHEN f.user_id1 = ? THEN u2.email
          ELSE u1.email
        END as friend_email
      FROM friendships f
      LEFT JOIN users u1 ON f.user_id1 = u1.id
      LEFT JOIN users u2 ON f.user_id2 = u2.id
      WHERE (f.user_id1 = ? OR f.user_id2 = ?) AND f.status = 'accepted'
    `, userId, userId, userId, userId, userId)

    const friends = friendships.map(f => ({
      id: f.friend_id,
      username: f.friend_username,
      email: f.friend_email
    }))

    res.json(friends)
  } catch (error) {
    console.error('獲取好友列表錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 獲取待處理的好友請求
router.get('/:userId/requests', async (req, res) => {
  try {
    const { userId } = req.params

    const requests = await db.all(`
      SELECT f.*, u.username, u.email
      FROM friendships f
      JOIN users u ON f.user_id1 = u.id
      WHERE f.user_id2 = ? AND f.status = 'pending'
    `, userId)

    res.json(requests.map(r => ({
      id: r.id,
      userId1: r.user_id1,
      userId2: r.user_id2,
      status: r.status,
      createdAt: r.created_at,
      requester: {
        id: r.user_id1,
        username: r.username,
        email: r.email
      }
    })))
  } catch (error) {
    console.error('獲取好友請求錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 接受好友請求
router.post('/accept', async (req, res) => {
  try {
    const { requestId } = req.body

    const result = await db.run(
      'UPDATE friendships SET status = ? WHERE id = ?',
      'accepted', requestId
    )

    if (result.changes === 0) {
      return res.status(404).json({ error: '請求不存在' })
    }

    res.json({ message: '已接受好友請求' })
  } catch (error) {
    console.error('接受好友請求錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

// 拒絕好友請求
router.delete('/reject/:requestId', async (req, res) => {
  try {
    const { requestId } = req.params

    const result = await db.run('DELETE FROM friendships WHERE id = ?', requestId)

    if (result.changes === 0) {
      return res.status(404).json({ error: '請求不存在' })
    }

    res.json({ message: '已拒絕好友請求' })
  } catch (error) {
    console.error('拒絕好友請求錯誤:', error)
    res.status(500).json({ error: '服務器錯誤' })
  }
})

export default router
