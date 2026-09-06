import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  // Restore the session after a page refresh within the current browser session.
  const [user, setUser] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('user')) } catch { return null }
  })

  const login = (data) => {
    // Keep the session only until the browser is closed.
    sessionStorage.setItem('token', data.token)
    sessionStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
  }

  const logout = () => {
    sessionStorage.removeItem('token')
    sessionStorage.removeItem('user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
