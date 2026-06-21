import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'
import { CartProvider } from './context/CartContext'

// Provider order matters:
// - BrowserRouter must wrap anything that uses React Router hooks (useNavigate, useParams, ...)
// - ToastProvider sits outside AuthProvider so auth-related toasts can still fire
// - AuthProvider wraps the whole app so any page can call useAuth()
// - CartProvider must sit inside AuthProvider because it depends on useAuth() to know the user
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <App />
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
