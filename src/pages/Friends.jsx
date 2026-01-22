import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFriend } from '../contexts/FriendContext'
import './Friends.css'

function Friends() {
  const { user } = useAuth()
  const { friends, friendRequests, sendFriendRequest, acceptFriendRequest, rejectFriendRequest } = useFriend()
  const [friendUsername, setFriendUsername] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSendRequest = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await sendFriendRequest(friendUsername)
      setSuccess(`已發送好友請求給 ${friendUsername}`)
      setFriendUsername('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAccept = async (requestId) => {
    try {
      await acceptFriendRequest(requestId)
      setSuccess('已接受好友請求')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || '接受好友請求失敗')
    }
  }

  const handleReject = async (requestId) => {
    try {
      await rejectFriendRequest(requestId)
      setSuccess('已拒絕好友請求')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || '拒絕好友請求失敗')
    }
  }

  return (
    <div className="friends-container">
      <div className="friends-content">
        <h1>好友管理</h1>

        <div className="add-friend-section">
          <h2>添加好友</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          <form onSubmit={handleSendRequest} className="add-friend-form">
            <input
              type="text"
              placeholder="輸入好友的用戶名"
              value={friendUsername}
              onChange={(e) => setFriendUsername(e.target.value)}
              className="friend-input"
            />
            <button type="submit" className="send-request-button">
              發送好友請求
            </button>
          </form>
        </div>

        <div className="friend-requests-section">
          <h2>好友請求</h2>
          {friendRequests.length === 0 ? (
            <p className="no-requests">目前沒有待處理的好友請求</p>
          ) : (
            <div className="requests-list">
              {friendRequests.map(request => {
                const requester = request.requester || { username: '未知用戶' }
                
                return (
                  <div key={request.id} className="request-card">
                    <div className="request-info">
                      <span className="request-username">{requester.username}</span>
                      <span className="request-time">
                        {new Date(request.createdAt).toLocaleDateString('zh-TW')}
                      </span>
                    </div>
                    <div className="request-actions">
                      <button
                        onClick={() => handleAccept(request.id)}
                        className="accept-button"
                      >
                        接受
                      </button>
                      <button
                        onClick={() => handleReject(request.id)}
                        className="reject-button"
                      >
                        拒絕
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <div className="friends-list-section">
          <h2>我的好友 ({friends.length})</h2>
          {friends.length === 0 ? (
            <p className="no-friends">還沒有好友，快來添加第一個好友吧！</p>
          ) : (
            <div className="friends-grid">
              {friends.map(friend => (
                <div key={friend.id} className="friend-card">
                  <div className="friend-avatar">
                    {friend.username.charAt(0).toUpperCase()}
                  </div>
                  <div className="friend-info">
                    <h3>{friend.username}</h3>
                    <p className="friend-email">{friend.email}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Friends
