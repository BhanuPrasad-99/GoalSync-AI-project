import { createContext, useContext, useState, useCallback } from 'react'
import { USERS } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('goalsync_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = useCallback((email, password) => {
    const found = USERS.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, error: 'Invalid email or password' }
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('goalsync_user', JSON.stringify(safeUser))
    return { success: true, user: safeUser }
  }, [])

  const switchRole = useCallback((role) => {
    const found = USERS.find(u => u.role === role)
    if (!found) return
    const { password: _, ...safeUser } = found
    setUser(safeUser)
    localStorage.setItem('goalsync_user', JSON.stringify(safeUser))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('goalsync_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
