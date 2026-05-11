import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext'
import { ToastProvider } from './context/ToastContext'

// Provider order matters:
// - BrowserRouter must wrap anything that uses React Router hooks (useNavigate, useParams, ...)
// - ToastProvider sits outside AuthProvider so auth-related toasts can still fire
// - AuthProvider wraps the whole app so any page can call useAuth()
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ToastProvider>
    </BrowserRouter>
  </StrictMode>,
)
