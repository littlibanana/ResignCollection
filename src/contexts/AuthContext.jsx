import { createContext, useContext, useState, useEffect } from 'react'
import { userAPI } from '../utils/api'

const AuthContext = createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 從 localStorage 載入用戶資料（用於保持登入狀態）
    const savedUser = localStorage.getItem('currentUser')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        // 驗證用戶是否仍然有效
        userAPI.getUser(userData.id)
          .then(() => {
            setUser(userData)
          })
          .catch(() => {
            // 用戶不存在，清除保存的資料
            localStorage.removeItem('currentUser')
          })
          .finally(() => {
            setLoading(false)
          })
      } catch (error) {
        localStorage.removeItem('currentUser')
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])

  const register = async (username, password, email) => {
    try {
      const newUser = await userAPI.register(username, password, email)
      
      // 自動登入
      setUser(newUser)
      localStorage.setItem('currentUser', JSON.stringify(newUser))
      
      return newUser
    } catch (error) {
      throw error
    }
  }

  const login = async (username, password) => {
    try {
      const user = await userAPI.login(username, password)
      
      setUser(user)
      localStorage.setItem('currentUser', JSON.stringify(user))
      return user
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('currentUser')
  }

  const value = {
    user,
    register,
    login,
    logout,
    loading
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
