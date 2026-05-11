import { createContext, useCallback, useContext, useState } from 'react'
import './Toast.css'

// Shared context that exposes the toast API (success / error / info) globally.
const ToastContext = createContext(null)

// Module-level counter that gives each toast a unique id (so React can key them).
let idCounter = 0

export function ToastProvider({ children }) {
  // List of currently visible toasts. Each item: { id, message, type }
  const [toasts, setToasts] = useState([])

  // Removes a toast by id (called by auto-dismiss timer or the close button).
  const removeToast = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id))
  }, [])

  // Creates a new toast and schedules auto-removal after `duration` ms (0 = stay forever).
  const showToast = useCallback((message, type = 'success', duration = 3000) => {
    const id = ++idCounter
    setToasts((list) => [...list, { id, message, type }])
    if (duration > 0) {
      setTimeout(() => removeToast(id), duration)
    }
    return id
  }, [removeToast])

  // Shortcut helpers so callers can do toast.success('...') instead of showToast('...', 'success').
  const success = useCallback((msg, d) => showToast(msg, 'success', d), [showToast])
  const error   = useCallback((msg, d) => showToast(msg, 'error', d),   [showToast])
  const info    = useCallback((msg, d) => showToast(msg, 'info', d),    [showToast])

  return (
    <ToastContext.Provider value={{ showToast, success, error, info, removeToast }}>
      {children}
      {/* The fixed-position container that paints toasts on top of every page. */}
      <div className="toast-container">
        {toasts.map((t) => (
          // Clicking anywhere on the toast also dismisses it.
          <div key={t.id} className={`toast toast-${t.type}`} onClick={() => removeToast(t.id)}>
            <span className="toast-icon">
              {t.type === 'success' ? '✓' : t.type === 'error' ? '✕' : 'i'}
            </span>
            <span className="toast-message">{t.message}</span>
            {/* stopPropagation prevents the toast's onClick from firing twice. */}
            <button className="toast-close" onClick={(e) => { e.stopPropagation(); removeToast(t.id) }}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

// Hook used by pages to fire toasts: const toast = useToast(); toast.success('...').
export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside ToastProvider')
  return ctx
}
