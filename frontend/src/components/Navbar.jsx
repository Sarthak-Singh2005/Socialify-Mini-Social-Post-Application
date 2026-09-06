import { Link } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header className="navbar">
      <Link className="brand" to="/">Socialify</Link>
      <div className="nav-right">
        <div className="profile-menu">
          <button
            className="profile-trigger"
            type="button"
            aria-label="Open profile"
            aria-expanded={showProfile}
            onClick={() => setShowProfile(!showProfile)}
          >
            <svg className="profile-icon" aria-hidden="true" viewBox="0 0 24 24">
              <circle className="profile-icon-head" cx="12" cy="7.5" r="3" />
              <path className="profile-icon-body" d="M6.5 18.5c.8-2.7 2.7-4.2 5.5-4.2s4.7 1.5 5.5 4.2" />
            </svg>
          </button>
          {showProfile && (
            <div className="profile-popover" role="dialog" aria-label="Profile details">
              <div className="profile-detail">
                <span className="profile-label">Username</span>
                <strong className="profile-value">@{user?.username || 'User'}</strong>
              </div>
              <div className="profile-detail">
                <span className="profile-label">Email</span>
                <strong className="profile-value profile-email">{user?.email || 'No email available'}</strong>
              </div>
            </div>
          )}
        </div>
        <button onClick={logout}>Logout</button>
      </div>
    </header>
  )
}
