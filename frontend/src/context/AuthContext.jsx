import { createContext, useContext, useEffect, useState } from 'react'
import { authApi } from '../services/api'

// Context để chia sẻ state user cho toàn bộ app
export const AuthContext = createContext(null)

const STORAGE_KEY = 'auth.user'

export function AuthProvider({ children }) {
  // Lazy init: chỉ chạy 1 lần khi mount, đọc user cũ từ localStorage
  // → reload trang vẫn còn đăng nhập
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : null
    } catch {
      return null
    }
  })

  // Mỗi khi user đổi (login/logout) thì đồng bộ vào localStorage
  useEffect(() => {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    else localStorage.removeItem(STORAGE_KEY)
  }, [user])

  // Gọi API login, lưu user trả về vào state
  const login = async ({ username, password }) => {
    const data = await authApi.login({ username, password })
    setUser(data)
    return data
  }

  // Gọi API register, tự đăng nhập luôn
  const register = async ({ username, email, password }) => {
    const data = await authApi.register({ username, email, password })
    setUser(data)
    return data
  }

  // Đăng xuất → set null → useEffect ở trên sẽ xóa localStorage
  const logout = () => setUser(null)

  // Merge thông tin mới (vd sau khi sửa profile) vào user, giữ nguyên token
  const updateUser = (patch) => {
    setUser((prev) => (prev ? { ...prev, ...patch } : prev))
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, updateUser, isAdmin: !!user?.admin }}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook tiện dùng — gọi const { user, login } = useAuth() ở component bất kỳ
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
