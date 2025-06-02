import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  // strict mode is used only in devicePixelRatio, also it calls the API twice
  <StrictMode>

      <App />
   
  </StrictMode>,
)
