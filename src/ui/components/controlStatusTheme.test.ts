import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('generic required-control visual treatment', () => {
  it('uses one semantic error token that overrides theme borders without replacing focus', () => {
    const css = readFileSync(new URL('../../styles.css', import.meta.url), 'utf8')
    expect(css).toContain('--control-error: #ff6b6b')
    expect(css).toContain('[data-control-status="error"]')
    expect(css).toContain('border-color: var(--control-error) !important')
    expect(css).toContain('[data-control-status="error"]:focus-visible')
    expect(css).toContain('outline: 3px solid var(--amber)')
  })
})
