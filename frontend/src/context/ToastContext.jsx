import { createContext, useCallback, useContext, useState } from 'react'
import './Toast.css'

const ToastContext = createContext(null)

// Biến ngoài component để mỗi toast có 1 id riêng (React cần key duy nhất)
let idCounter = 0

export function ToastProvider({ children }) {
  // Danh sách toast đang hiển thị
  const [toasts, setToasts] = useState([])

  // Xóa 1 toast khỏi list (gọi khi timeout xong hoặc user bấm x)
  const removeToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  // Tạo toast mới, tự đóng sau `duration` ms (0 = không tự đóng)
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++idCounter
    setToasts((list) => [...list, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }, [removeToast])

  // Shortcut cho 3 loại toast hay dùng
  const success = useCallback((msg, d) => showToast(msg, 'success', d), [showToast])
  const error   = useCallback((msg, d) => showToast(msg, 'error', d),   [showToast])
  const info    = useCallback((msg, d) => showToast(msg, 'info', d),    [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, removeToast }}>
      {children}
      {/* Container fixed top-right, hiển thị chồng các toast */}
      <div className="toast-container">
        {toasts.map((t) => (
          // Click vào toast cũng đóng được
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => removeToast(t.id)}>
            <span className="toast-icon">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'i'}
            </span>
            <span className="toast-message">{t.message}</span>
            {/* stopPropagation: ngăn click x lan ra div cha (đỡ gọi removeToast 2 lần) */}
            <button className="toast-close" onClick={(e) => { e.stopPropagation(); removeToast(t.id) }}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
