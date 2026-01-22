import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!user) {
    return null
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          集點卡系統
        </Link>
        <div className="navbar-links">
          <Link to="/" className="navbar-link">
            首頁
          </Link>
          <Link to="/friends" className="navbar-link">
            好友
          </Link>
          <span className="navbar-user">歡迎, {user.username}</span>
          <button onClick={handleLogout} className="navbar-logout">
            登出
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
