import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

describe('shared government/faction theme palettes', () => {
  it.each([
    ['capellan', ['#00a86b', '#0b3a2b', '#174c3b', '#173c2f', '#205242', '#4c9b7a', '#c9a83d', '#e2c36e', '#ecf5f0', '#111111']],
    ['davion', ['#d6ae3d', '#6b4d12', '#4b3a18', '#241f18', '#332a1d', '#806e48', '#a83a32', '#f0d77a', '#f4eedc', '#111111']],
    ['draconis', ['#9E2B2B', '#4A171A', '#6D2226', '#211D1E', '#30292A', '#A97879', '#2A2D30', '#C8C4B8', '#F4EEEA', '#111111']],
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

  it.each([
    ['free-worlds-league', ['#7047A3', '#382550', '#49345F', '#282232', '#372E43', '#796A8A', '#3F7048', '#E5E2D8', '#F0EBF5', '#111111']],
    ['lyran-commonwealth', ['#356DA8', '#1D3B5D', '#294F73', '#202B35', '#2B3A47', '#657F96', '#75624E', '#D8E2E8', '#F0F4F7', '#111111']],
    ['free-rasalhague-republic', ['#6BAFC5', '#2C5968', '#477F92', '#20353D', '#2E4B55', '#8FB8C4', '#586671', '#B33A3A', '#F1F6F8', '#111111']],
  ])('preserves the prepared %s successor-state palette roles', (theme, colors) => {
    const css = readFileSync(new URL('./styles.css', import.meta.url), 'utf8')
    const block = css.match(new RegExp(`\\.life-modules-page\\.${theme}-theme \\{([\\s\\S]*?)\\}`))?.[1] ?? ''
    for (const color of colors) expect(block).toContain(color)
    expect(block).toContain('--faction-primary:')
    expect(block).toContain('--faction-panel:')
    expect(block).toContain('--faction-accent:')
    expect(block).toContain('--faction-foreground:')
  })

  it('keeps prepared successor-state palettes inactive in the public resolver', async () => {
    const { lifeModulesAffiliationTheme } = await import('./ui/components/stage0PreviewModel')
    expect(lifeModulesAffiliationTheme('affiliation.free-worlds-league')).toBe('')
    expect(lifeModulesAffiliationTheme('affiliation.lyran-commonwealth')).toBe('')
    expect(lifeModulesAffiliationTheme('affiliation.free-rasalhague-republic')).toBe('')
  })
})
