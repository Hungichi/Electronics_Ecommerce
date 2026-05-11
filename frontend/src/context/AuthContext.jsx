import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/api'

// React Context object that will carry the auth state down the tree.
// Any component inside <AuthProvider> can read it via useAuth().
export const AuthContext = createContext(null)

// Key used in localStorage so the login survives a page refresh.
const STORAGE_KEY = 'auth.user'

export function AuthProvider({ children }) {
  // Lazy initializer: this function only runs ONCE on first mount.
  // It restores the user object from localStorage so refreshing the page keeps the session.
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  // Keep localStorage in sync with state whenever the user changes (login/logout).
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  // Calls the backend login endpoint and stores the returned user in context.
  const login = async ({ username, password }) => {
    const data = await authApi.login({ username, password })
    setUser(data)
    return data
  }

  // Calls the backend register endpoint and auto-logs the new user in.
  const register = async ({ username, email, password }) => {
    const data = await authApi.register({ username, email, password })
    setUser(data)
    return data
  }

  // Clears the user; useEffect above will wipe localStorage as well.
  const logout = () => setUser(null)

  // Provide the auth state + helpers + a derived isAdmin flag to every child.
  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, isAdmin: !!user?.admin }}>
      {children}
    </AuthContext.Provider>
  )
}

// Convenience hook so components can do: const { user, login } = useAuth().
// Throws if used outside the provider to catch wiring mistakes early.
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
