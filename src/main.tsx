import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './ui/App'
import { APP_PUBLIC_ALPHA_LABEL, APP_PUBLIC_TITLE } from './appMetadata'
import './styles.css'

document.title = `${APP_PUBLIC_TITLE} — ${APP_PUBLIC_ALPHA_LABEL}`

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

