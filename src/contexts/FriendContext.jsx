import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { friendAPI, userAPI } from '../utils/api'

const FriendContext = createContext()

export function useFriend() {
  return useContext(FriendContext)
}

export function FriendProvider({ children }) {
  const { user } = useAuth()
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])

  useEffect(() => {
    if (user) {
      loadFriends()
      loadFriendRequests()
    } else {
      setFriends([])
      setFriendRequests([])
    }
  }, [user])

  const loadFriends = async () => {
    if (!user) return
    try {
      const friendsList = await friendAPI.getFriends(user.id)
      setFriends(friendsList)
    } catch (error) {
      console.error('載入好友列表錯誤:', error)
    }
  }

  const loadFriendRequests = async () => {
    if (!user) return
    try {
      const requests = await friendAPI.getRequests(user.id)
      setFriendRequests(requests)
    } catch (error) {
      console.error('載入好友請求錯誤:', error)
    }
  }

  const sendFriendRequest = async (friendUsername) => {
    if (!user) return

    try {
      // 先獲取所有用戶以找到好友
      const allUsers = await userAPI.getAllUsers()
      const friend = allUsers.find(u => u.username === friendUsername)

      if (!friend) {
        throw new Error('找不到該用戶')
      }

      if (friend.id === user.id) {
        throw new Error('不能添加自己為好友')
      }

      // 發送好友請求
      await friendAPI.sendRequest(user.id, friend.id)
      
      // 重新載入請求列表
      await loadFriendRequests()
    } catch (error) {
      throw error
    }
  }

  const acceptFriendRequest = async (requestId) => {
    try {
      await friendAPI.acceptRequest(requestId)
      await loadFriends()
      await loadFriendRequests()
    } catch (error) {
      console.error('接受好友請求錯誤:', error)
      throw error
    }
  }

  const rejectFriendRequest = async (requestId) => {
    try {
      await friendAPI.rejectRequest(requestId)
      await loadFriendRequests()
    } catch (error) {
      console.error('拒絕好友請求錯誤:', error)
      throw error
    }
  }

  const value = {
    friends,
    friendRequests,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest
  }

  return <FriendContext.Provider value={value}>{children}</FriendContext.Provider>
}
