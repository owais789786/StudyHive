import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UserProvider } from './context/UserContext.jsx'

import './index.css'
import App from './App.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <UserProvider>
      <SocketProvider>
        <BrowserRouter>

          <App />

        </BrowserRouter>
      </SocketProvider>
    </UserProvider>

  </StrictMode>,
)
