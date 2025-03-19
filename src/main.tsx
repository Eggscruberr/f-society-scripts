
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { startMockServer } from './api/mockServer.ts'
import { initAuth, setupInactivityMonitor } from './lib/auth.ts'

// Start the mock server in development mode
if (import.meta.env.DEV) {
  startMockServer();
}

// Initialize authentication system and security measures
initAuth();
setupInactivityMonitor();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)

