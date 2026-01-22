import sqlite3 from 'sqlite3'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { promisify } from 'util'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// 創建數據庫連接
const db = new sqlite3.Database(join(__dirname, 'database.sqlite'))

// 將回調函數轉換為 Promise
db.get = promisify(db.get.bind(db))
db.all = promisify(db.all.bind(db))
db.exec = promisify(db.exec.bind(db))

// 自定義 run 方法以正確處理 changes
db.run = function(sql, ...params) {
  return new Promise((resolve, reject) => {
    db.run(sql, ...params, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve({ changes: this.changes, lastID: this.lastID })
      }
    })
  })
}

// 啟用外鍵約束（使用同步方式）
db.run('PRAGMA foreign_keys = ON').catch(() => {})

// 初始化數據庫表
async function initDatabase() {
  try {
    // 用戶表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        email TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `)

    // 好友關係表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS friendships (
        id TEXT PRIMARY KEY,
        user_id1 TEXT NOT NULL,
        user_id2 TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id1) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (user_id2) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id1, user_id2)
      )
    `)

    // 集點卡表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS stamps (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `)

    // 集點卡可見性設置表
    await db.exec(`
      CREATE TABLE IF NOT EXISTS stamp_visibility (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        visible_user_id TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (visible_user_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(user_id, visible_user_id)
      )
    `)

    console.log('數據庫初始化完成')
  } catch (error) {
    console.error('數據庫初始化錯誤:', error)
  }
}

// 初始化數據庫
initDatabase()

export default db
