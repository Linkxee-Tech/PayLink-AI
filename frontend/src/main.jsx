import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#ffffff',
            color: '#1f3440',
            border: '1px solid #d8ecf7',
            borderRadius: '18px',
            boxShadow: '0 18px 40px rgba(15, 58, 92, 0.12)',
            padding: '14px 16px',
          },
          success: {
            iconTheme: {
              primary: '#2f8f5b',
              secondary: '#ffffff',
            },
          },
          error: {
            iconTheme: {
              primary: '#dc2626',
              secondary: '#ffffff',
            },
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>,
)
