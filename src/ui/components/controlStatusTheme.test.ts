import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('generic required-control visual treatment', () => {
  it('uses one semantic error token that overrides theme borders without replacing focus', () => {
    const css = readFileSync(new URL('../../styles.css', import.meta.url), 'utf8')
    expect(css).toContain('--control-required: #9B5555')
    expect(css).toContain('[data-control-status="required-unresolved"]')
    expect(css).toContain('border: 1px solid var(--control-required) !important')
    expect(css).toContain('box-shadow: none')
    expect(css).toContain('--control-error: #ff6b6b')
    expect(css).toContain('[data-control-status="invalid"]')
    expect(css).toContain('border-color: var(--control-error) !important')
    expect(css).toContain('[data-control-status="required-unresolved"]:focus-visible')
    expect(css).toContain('[data-control-status="invalid"]:focus-visible')
    expect(css).toContain('outline: 3px solid var(--faction-accent, var(--amber))')
  })
})
