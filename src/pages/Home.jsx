import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useFriend } from '../contexts/FriendContext'
import { useStamp } from '../contexts/StampContext'
import './Home.css'

function Home() {
  const { user } = useAuth()
  const { friends } = useFriend()
  const { stamps, visibleUsers, addStamp, toggleStamp, deleteStamp, toggleUserVisibility, getStampsByUserId } = useStamp()
  const [newStampTitle, setNewStampTitle] = useState('')
  const [newStampDesc, setNewStampDesc] = useState('')
  const [selectedFriendId, setSelectedFriendId] = useState(null)
  const [friendStamps, setFriendStamps] = useState([])
  const [loadingFriendStamps, setLoadingFriendStamps] = useState(false)

  useEffect(() => {
    if (selectedFriendId) {
      setLoadingFriendStamps(true)
      getStampsByUserId(selectedFriendId)
        .then(stamps => {
          setFriendStamps(stamps)
        })
        .catch(error => {
          console.error('載入好友集點卡錯誤:', error)
          setFriendStamps([])
        })
        .finally(() => {
          setLoadingFriendStamps(false)
        })
    } else {
      setFriendStamps([])
    }
  }, [selectedFriendId, getStampsByUserId])

  const handleAddStamp = async (e) => {
    e.preventDefault()
    if (newStampTitle.trim()) {
      try {
        await addStamp(newStampTitle, newStampDesc)
        setNewStampTitle('')
        setNewStampDesc('')
      } catch (error) {
        console.error('新增集點卡錯誤:', error)
      }
    }
  }

  const completedCount = stamps.filter(s => s.completed).length
  const totalCount = stamps.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  const visibleFriends = friends.filter(f => visibleUsers.includes(f.id))

  return (
    <div className="home-container">
      <div className="home-content">
        <div className="stamp-section">
          <h1>我的集點卡</h1>
          
          <div className="progress-card">
            <div className="progress-info">
              <span className="progress-text">
                進度: {completedCount} / {totalCount}
              </span>
              <span className="progress-percent">{Math.round(progress)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <form onSubmit={handleAddStamp} className="add-stamp-form">
            <input
              type="text"
              placeholder="集點項目名稱"
              value={newStampTitle}
              onChange={(e) => setNewStampTitle(e.target.value)}
              className="stamp-input"
            />
            <input
              type="text"
              placeholder="描述（選填）"
              value={newStampDesc}
              onChange={(e) => setNewStampDesc(e.target.value)}
              className="stamp-input"
            />
            <button type="submit" className="add-button">
              新增集點
            </button>
          </form>

          <div className="stamps-grid">
            {stamps.map(stamp => (
              <div 
                key={stamp.id} 
                className={`stamp-card ${stamp.completed ? 'completed' : ''}`}
              >
                <div className="stamp-header">
                  <h3>{stamp.title}</h3>
                  <button 
                    onClick={() => deleteStamp(stamp.id)}
                    className="delete-button"
                  >
                    ×
                  </button>
                </div>
                {stamp.description && (
                  <p className="stamp-desc">{stamp.description}</p>
                )}
                <button
                  onClick={() => toggleStamp(stamp.id)}
                  className={`stamp-toggle ${stamp.completed ? 'checked' : ''}`}
                >
                  {stamp.completed ? '✓ 已完成' : '○ 未完成'}
                </button>
              </div>
            ))}
            {stamps.length === 0 && (
              <div className="empty-state">
                <p>還沒有集點項目，快來新增一個吧！</p>
              </div>
            )}
          </div>
        </div>

        <div className="friends-stamp-section">
          <h2>好友集點卡</h2>
          
          <div className="friend-visibility">
            <h3>選擇要查看的好友</h3>
            {friends.length === 0 ? (
              <p className="no-friends">還沒有好友，先去添加好友吧！</p>
            ) : (
              <div className="friend-checkboxes">
                {friends.map(friend => (
                  <label key={friend.id} className="friend-checkbox">
                    <input
                      type="checkbox"
                      checked={visibleUsers.includes(friend.id)}
                      onChange={() => toggleUserVisibility(friend.id)}
                    />
                    <span>{friend.username}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {visibleFriends.length > 0 && (
            <div className="friend-selector">
              <label>選擇好友查看集點卡：</label>
              <select
                value={selectedFriendId || ''}
                onChange={(e) => setSelectedFriendId(e.target.value || null)}
                className="friend-select"
              >
                <option value="">請選擇好友</option>
                {visibleFriends.map(friend => (
                  <option key={friend.id} value={friend.id}>
                    {friend.username}
                  </option>
                ))}
              </select>
            </div>
          )}

          {selectedFriendId && (
            <div className="friend-stamps">
              <h3>{friends.find(f => f.id === selectedFriendId)?.username} 的集點卡</h3>
              <div className="stamps-grid">
                {loadingFriendStamps ? (
                  <div className="empty-state">
                    <p>載入中...</p>
                  </div>
                ) : friendStamps.length > 0 ? (
                  friendStamps.map(stamp => (
                    <div 
                      key={stamp.id} 
                      className={`stamp-card ${stamp.completed ? 'completed' : ''} friend-stamp`}
                    >
                      <div className="stamp-header">
                        <h3>{stamp.title}</h3>
                      </div>
                      {stamp.description && (
                        <p className="stamp-desc">{stamp.description}</p>
                      )}
                      <div className={`stamp-status ${stamp.completed ? 'checked' : ''}`}>
                        {stamp.completed ? '✓ 已完成' : '○ 未完成'}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <p>這位好友還沒有集點項目</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home
