import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('shared government/faction theme palettes', () => {
  it.each([
    ['capellan', ['#00a86b', '#0b3a2b', '#174c3b', '#173c2f', '#205242', '#4c9b7a', '#c9a83d', '#e2c36e', '#ecf5f0', '#111111']],
    ['davion', ['#d6ae3d', '#6b4d12', '#4b3a18', '#241f18', '#332a1d', '#806e48', '#a83a32', '#f0d77a', '#f4eedc', '#111111']],
    ['comstar', ['#aab5bf', '#4b555e', '#737d86', '#394249', '#596771', '#beccd4', '#22272b', '#bfc9ce', '#f1f6f8', '#111111']],
    ['wob', ['#22272b', '#121a20', '#191f25', '#131a1f', '#1c272e', '#bca752', '#b9c2c8', '#765a99', '#f1f6f8', '#111111']],
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
    expect(css).toContain('government-ui.yaml at 8fb1dde0e10c2f455fef7d822b6bd6e2ae43d760')
    expect(css).toContain('UI_ADAPTATION')
    for (const superseded of ['#9ae3bb', '#4a202d', '#713445', '#202b22', '#2b3829', '#687962', '#d7b66a', '#a7c979']) expect(css).not.toContain(superseded)
  })
})
