import {
  APP_ALPHA_SLICE,
  APP_PHASE,
  APP_PUBLIC_ALPHA_LABEL,
  APP_PUBLIC_TITLE,
  APP_RELEASE_LABEL,
  APP_VERSION,
} from './appMetadata'
import { describe, expect, it } from 'vitest'

describe('current application release metadata', () => {
  it('centralizes the active public title, release, and version', () => {
    expect(APP_PUBLIC_TITLE).toBe('AToW Online Character Creator')
    expect(APP_ALPHA_SLICE).toBe(98)
    expect(APP_RELEASE_LABEL).toBe('Alpha Slice 98')
    expect(APP_PHASE).toBe('Public Alpha')
    expect(APP_PUBLIC_ALPHA_LABEL).toBe('Public Alpha · Slice 98')
    expect(APP_VERSION).toBe('0.1.0-alpha.98')
  })
})
