import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('Federated Suns / Davion theme palette', () => {
  it('uses the exact Combat Infantry palette without Liao burgundy, red, or blue variables', () => {
    const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
    const block = css.match(/\.life-modules-page\.davion-theme \{([\s\S]*?)\}/)?.[1] ?? ''
    expect(block).toContain('--panel: #202b22')
    expect(block).toContain('--panel-light: #2b3829')
    expect(block).toContain('--line: #687962')
    expect(block).toContain('--amber: #d7b66a')
    expect(block).toContain('--success: #a7c979')
    expect(block).not.toMatch(/#4a202d|#713445|#6b1f2b|--[^:]*red|--[^:]*blue/i)
  })
})
