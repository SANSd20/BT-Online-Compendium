import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './ui/App'
import { APP_PUBLIC_ALPHA_LABEL, APP_PUBLIC_TITLE } from './appMetadata'
import './styles.css'

document.title = `${APP_PUBLIC_TITLE} — ${APP_PUBLIC_ALPHA_LABEL}`

const root = createRoot(document.getElementById('root')!)
if (import.meta.env.DEV && window.location.pathname === '/__experimental-canonical-stage0') {
  import('./experimental/CanonicalStage0Pilot').then(({ CanonicalStage0Pilot }) => root.render(<CanonicalStage0Pilot />))
} else if (import.meta.env.DEV && window.location.pathname === '/__experimental-stage0') {
  import('./experimental/GenericStage0Pilot').then(({ GenericStage0Pilot }) => root.render(<GenericStage0Pilot />))
} else {
  root.render(<StrictMode><App /></StrictMode>)
}

