export const APP_PUBLIC_TITLE = 'AToW Online Character Creator'
export const APP_PHASE = 'Public Alpha'
export const APP_VERSION = '0.1.0-alpha.165-b22'
const APP_VERSION_MATCH = /^0\.1\.0-alpha\.(\d+)-(b\d+)$/i.exec(APP_VERSION)
if (!APP_VERSION_MATCH) throw new Error(`Unsupported application version: ${APP_VERSION}`)
export const APP_ALPHA_SLICE = Number(APP_VERSION_MATCH[1])
export const APP_ALPHA_SLICE_SUFFIX = APP_VERSION_MATCH[2].toUpperCase()
export const APP_RELEASE_LABEL = `Alpha Slice ${APP_ALPHA_SLICE}-${APP_ALPHA_SLICE_SUFFIX}`
export const APP_PUBLIC_ALPHA_LABEL = `${APP_PHASE} · Slice ${APP_ALPHA_SLICE}-${APP_ALPHA_SLICE_SUFFIX}`
export const APP_DOCUMENT_TITLE = `${APP_PUBLIC_TITLE} — ${APP_PUBLIC_ALPHA_LABEL}`
