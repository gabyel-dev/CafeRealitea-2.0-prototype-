import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './app.css'
import App from './App.jsx'
import { UserProvider } from './Main/UserContext.jsx'

createRoot(document.getElementById('root')).render(
  <UserProvider>
  <App />
</UserProvider>
)
