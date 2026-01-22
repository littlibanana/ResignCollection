import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { stampAPI } from '../utils/api'

const StampContext = createContext()

export function useStamp() {
  return useContext(StampContext)
}

export function StampProvider({ children }) {
  const { user } = useAuth()
  const [stamps, setStamps] = useState([])
  const [visibleUsers, setVisibleUsers] = useState([])

  useEffect(() => {
    if (user) {
      loadStamps()
      loadVisibleUsers()
    } else {
      setStamps([])
      setVisibleUsers([])
    }
  }, [user])

  const loadStamps = async () => {
    if (!user) return
    try {
      const userStamps = await stampAPI.getStamps(user.id)
      setStamps(userStamps)
    } catch (error) {
      console.error('載入集點卡錯誤:', error)
    }
  }

  const loadVisibleUsers = async () => {
    if (!user) return
    try {
      const visibleUserIds = await stampAPI.getVisibility(user.id)
      setVisibleUsers(visibleUserIds)
    } catch (error) {
      console.error('載入可見性設置錯誤:', error)
    }
  }

  const addStamp = async (title, description) => {
    if (!user) return

    try {
      const newStamp = await stampAPI.createStamp(user.id, title, description)
      await loadStamps()
      return newStamp
    } catch (error) {
      throw error
    }
  }

  const toggleStamp = async (stampId) => {
    try {
      await stampAPI.toggleStamp(stampId)
      await loadStamps()
    } catch (error) {
      console.error('切換集點卡狀態錯誤:', error)
      throw error
    }
  }

  const deleteStamp = async (stampId) => {
    try {
      await stampAPI.deleteStamp(stampId)
      await loadStamps()
    } catch (error) {
      console.error('刪除集點卡錯誤:', error)
      throw error
    }
  }

  const toggleUserVisibility = async (friendId) => {
    if (!user) return

    try {
      await stampAPI.toggleVisibility(user.id, friendId)
      await loadVisibleUsers()
    } catch (error) {
      console.error('切換可見性設置錯誤:', error)
      throw error
    }
  }

  const getStampsByUserId = async (userId) => {
    try {
      const stamps = await stampAPI.getStamps(userId)
      return stamps
    } catch (error) {
      console.error('獲取用戶集點卡錯誤:', error)
      return []
    }
  }

  const value = {
    stamps,
    visibleUsers,
    addStamp,
    toggleStamp,
    deleteStamp,
    toggleUserVisibility,
    getStampsByUserId
  }

  return <StampContext.Provider value={value}>{children}</StampContext.Provider>
}
