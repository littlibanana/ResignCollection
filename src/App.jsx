import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { FriendProvider } from './contexts/FriendContext'
import { StampProvider } from './contexts/StampContext'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Friends from './pages/Friends'
import Navbar from './components/Navbar'
import './App.css'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/friends"
        element={
          <ProtectedRoute>
            <Friends />
          </ProtectedRoute>
        }
      />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <FriendProvider>
        <StampProvider>
          <Router>
            <div className="app">
              <Navbar />
              <AppRoutes />
            </div>
          </Router>
        </StampProvider>
      </FriendProvider>
    </AuthProvider>
  )
}

export default App
