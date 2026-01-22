// 在生產環境中使用相對路徑，開發環境使用代理
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? '/api' : '/api')

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  if (config.body && typeof config.body === 'object') {
    config.body = JSON.stringify(config.body)
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || '請求失敗')
    }

    return data
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error('網絡錯誤，請檢查服務器是否運行')
  }
}

// 用戶 API
export const userAPI = {
  register: (username, password, email) =>
    apiRequest('/users/register', {
      method: 'POST',
      body: { username, password, email },
    }),

  login: (username, password) =>
    apiRequest('/users/login', {
      method: 'POST',
      body: { username, password },
    }),

  getUser: (id) => apiRequest(`/users/${id}`),

  getAllUsers: () => apiRequest('/users'),
}

// 好友 API
export const friendAPI = {
  sendRequest: (userId1, userId2) =>
    apiRequest('/friends/request', {
      method: 'POST',
      body: { userId1, userId2 },
    }),

  getFriends: (userId) => apiRequest(`/friends/${userId}`),

  getRequests: (userId) => apiRequest(`/friends/${userId}/requests`),

  acceptRequest: (requestId) =>
    apiRequest('/friends/accept', {
      method: 'POST',
      body: { requestId },
    }),

  rejectRequest: (requestId) =>
    apiRequest(`/friends/reject/${requestId}`, {
      method: 'DELETE',
    }),
}

// 集點卡 API
export const stampAPI = {
  getStamps: (userId) => apiRequest(`/stamps/${userId}`),

  createStamp: (userId, title, description) =>
    apiRequest('/stamps', {
      method: 'POST',
      body: { userId, title, description },
    }),

  toggleStamp: (stampId) =>
    apiRequest(`/stamps/${stampId}/toggle`, {
      method: 'PATCH',
    }),

  deleteStamp: (stampId) =>
    apiRequest(`/stamps/${stampId}`, {
      method: 'DELETE',
    }),

  getVisibility: (userId) => apiRequest(`/stamps/${userId}/visibility`),

  toggleVisibility: (userId, friendId) =>
    apiRequest(`/stamps/${userId}/visibility`, {
      method: 'POST',
      body: { friendId },
    }),
}
