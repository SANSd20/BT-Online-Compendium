import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { chromium } from 'playwright-core'
import { createServer } from 'vite'
import { describe, it } from 'vitest'

const browserExecutablePath = process.env.ATOW_BROWSER_EXECUTABLE_PATH
const evidenceRoot = 'C:/Users/boill/Documents/ChatGPT/AToW Codex/R1 Stage Rebuild Evidence/S0D-6B-R4'

async function startServer(root: string) {
  const server = await createServer({ root, server: { host: '127.0.0.1', port: 0, strictPort: true } })
  await server.listen()
  const address = server.httpServer?.address()
  if (!address || typeof address === 'string') throw new Error('Terran browser server did not expose a port.')
  return { url: `http://127.0.0.1:${address.port}`, close: () => server.close() }
}

describe('Terran Stage 0 player-facing workflows', () => {
  it('completes all seven contexts with isolated preview, validation, commit, and screenshots', async () => {
    await mkdir(evidenceRoot, { recursive: true })
    const server = await startServer(fileURLToPath(new URL('..', import.meta.url)))
    const browser = await chromium.launch({ headless: true, ...(browserExecutablePath ? { executablePath: browserExecutablePath } : {}) })
    const contexts = [
      ['parent', 'No Sub-affiliation'],
      ['belter', 'Belter'],
      ['lunar', 'Lunar Citizen'],
      ['martian', 'Martian Citizen'],
      ['outer', 'Outer System Citizen'],
      ['citizen', 'Terran Citizen'],
      ['venusian', 'Venusian Citizen'],
    ] as const
    try {
      for (const [name, subLabel] of contexts) {
        const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
        await page.goto(`${server.url}/#/`, { waitUntil: 'networkidle' })
        await page.getByRole('link', { name: 'Start Life Modules' }).click()
        await page.getByLabel('Character name').fill(`Terran ${name}`)
        await page.getByLabel('Campaign Year').fill('3059')
        await page.getByRole('button', { name: 'Next' }).click()
        await page.selectOption('#stage0-affiliation', { label: 'Terran' })
        await page.selectOption('#stage0-affiliation-language', { index: 1 })
        await page.selectOption('#stage0-affiliation-context', { label: subLabel })
        await page.getByLabel('Attribute choice 1').selectOption('STR')
        await page.getByLabel('Attribute choice 2').selectOption('BOD')
        await page.getByLabel('Language choice 1').selectOption('Mandarin Chinese')
        await page.getByLabel('Language choice 2').selectOption('Russian')
        if (name === 'belter') {
          await page.getByLabel('Belter Trait 1').fill('trait.fast-learner')
          await page.getByLabel('Belter Trait 2').fill('trait.good-hearing')
          await page.locator('#stage0-terran-skill-one').fill('skill.perception')
          await page.getByLabel('Skill choice 2').fill('skill.negotiation')
        } else if (name === 'citizen') {
          await page.getByLabel('Skill choice 1').fill('skill.perception')
          await page.getByLabel('Skill choice 2').fill('skill.negotiation')
          await page.getByLabel('Skill choice 3').fill('skill.art|Painting')
          await page.getByLabel('Skill choice 4').fill('skill.interest|History')
        } else if (name !== 'parent') {
          await page.locator('#stage0-terran-skill-one').fill('skill.perception')
          if (name === 'outer') await page.getByLabel('Skill choice 2').fill('skill.negotiation')
          if (name === 'martian' || name === 'venusian') await page.getByLabel('Dependent secondary Language').selectOption('Mandarin Chinese')
        }
        const continueButton = page.getByRole('button', { name: 'Continue' }).last()
        if (!(await continueButton.isEnabled())) throw new Error(`${name} remained incomplete: ${await page.locator('.stage0-requirements').innerText()}`)
        await page.screenshot({ path: join(evidenceRoot, `terran-${name}-desktop.png`), fullPage: true })
        await page.getByRole('button', { name: 'Continue' }).last().click()
        await page.waitForTimeout(500)
        if (await page.locator('#stage1-module').count() === 0) throw new Error(`${name} did not advance: ${await page.locator('body').innerText()}`)
        await page.close()
      }
    } finally {
      await browser.close()
      await server.close()
    }
  }, 120000)
})
