import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('shared government/faction theme palettes', () => {
  it.each([
    ['capellan', ['#00a86b', '#0b3a2b', '#174c3b', '#173c2f', '#205242', '#4c9b7a', '#c9a83d', '#e2c36e', '#ecf5f0', '#111111']],
    ['davion', ['#d6ae3d', '#6b4d12', '#4b3a18', '#241f18', '#332a1d', '#806e48', '#a83a32', '#f0d77a', '#f4eedc', '#111111']],
  ])('maps the current shared %s government UI record into explicit faction roles', (theme, colors) => {
    const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
    const block = css.match(new RegExp(`\\.life-modules-page\\.${theme}-theme \\{([\\s\\S]*?)\\}`))?.[1] ?? ''
    for (const color of colors) expect(block).toContain(color)
    expect(block).toContain('--faction-primary:')
    expect(block).toContain('--faction-panel:')
    expect(block).toContain('--faction-accent:')
    expect(block).toContain('--faction-foreground:')
    expect(block).not.toMatch(/military/i)
  })

  it('records the shared palette authority and removes the superseded local theme values', () => {
    const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
    expect(css).toContain('government-ui.yaml at f5ce62194c57e28d3d8a7a31d69b01f901c0672f')
    expect(css).toContain('UI_ADAPTATION')
    for (const superseded of ['#9ae3bb', '#4a202d', '#713445', '#202b22', '#2b3829', '#687962', '#d7b66a', '#a7c979']) expect(css).not.toContain(superseded)
  })
})
