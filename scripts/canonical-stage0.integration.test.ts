import { mkdtemp, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { createServer } from 'vite'
import { describe, expect, it } from 'vitest'

const browserExecutablePath = process.env.ATOW_BROWSER_EXECUTABLE_PATH

async function startServer(root: string) {
  const server = await createServer({ root, server: { host: '127.0.0.1', port: 0, strictPort: true } })
  await server.listen()
  const address = server.httpServer?.address()
  if (!address || typeof address === 'string') throw new Error('Canonical pilot server did not expose a port.')
  return { url: `http://127.0.0.1:${address.port}`, close: () => server.close() }
}

describe('canonical Stage 0 browser pilot', () => {
  it('loads both families, resolves Other FWL Worlds, switches context, and commits Stage 0', async () => {
    const scratch = await mkdtemp(join(tmpdir(), 'atow-canonical-stage0-'))
    const server = await startServer(fileURLToPath(new URL('..', import.meta.url)))
    const browser = await chromium.launch({ headless: true, ...(browserExecutablePath ? { executablePath: browserExecutablePath } : {}) })
    try {
      const page = await browser.newPage()
      await page.goto(`${server.url}/__experimental-canonical-stage0`, { waitUntil: 'networkidle' })
      await page.getByRole('heading', { name: 'Canonical Stage 0' }).waitFor({ state: 'visible' })
      await page.getByText('Canonical exports loaded.').waitFor({ state: 'visible' })
      await page.getByLabel('Canonical affiliation context').selectOption({ label: 'Other FWL Worlds · Child' })
      await page.waitForTimeout(250)
      const pendingText = await page.locator('body').innerText()
      expect(pendingText).toContain('Pending choices: 7')
      const choices = page.locator('fieldset select')
      for (let index = 0; index < await choices.count(); index++) await choices.nth(index).selectOption({ index: 1 })
      await page.getByText('Pending choices: 0').waitFor({ state: 'visible' })
      expect(await page.getByRole('button', { name: 'Commit Stage 0' }).isEnabled()).toBe(true)
      await page.getByLabel('Canonical affiliation family').selectOption('capellan')
      expect(await page.getByLabel('Canonical affiliation context').inputValue()).toBe('affiliation.capellan-confederation')
      await page.getByLabel('Canonical affiliation family').selectOption('fwl')
      await page.getByLabel('Canonical affiliation context').selectOption({ label: 'Other FWL Worlds · Child' })
      const restoredChoices = page.locator('fieldset select')
      for (let index = 0; index < await restoredChoices.count(); index++) await restoredChoices.nth(index).selectOption({ index: 1 })
      await page.getByRole('button', { name: 'Commit Stage 0' }).click()
      expect(await page.getByRole('status').textContent()).toBe('Canonical Stage 0 committed; advanced to Stage 1.')
      await page.getByRole('button', { name: 'Save draft' }).click()
      await page.getByRole('button', { name: 'Resume' }).click()
      expect(await page.getByRole('status').textContent()).toBe('Canonical draft resumed.')
    } finally {
      await browser.close()
      await server.close()
      await rm(scratch, { recursive: true, force: true })
    }
  }, 120000)

  it.each([
    ['FWL parent', 'affiliation.free-worlds-league', 'fwl'],
    ['Marik Commonwealth', 'affiliation.free-worlds-league.marik-commonwealth', 'fwl'],
    ['Principality of Regulus', 'affiliation.free-worlds-league.principality-of-regulus', 'fwl'],
    ['Duchy of Oriente', 'affiliation.free-worlds-league.duchy-of-oriente', 'fwl'],
    ['Duchy of Andurien', 'affiliation.free-worlds-league.duchy-of-andurien', 'fwl'],
    ['Other FWL Worlds', 'affiliation.free-worlds-league.other-fwl-worlds', 'fwl'],
    ['Capellan parent', 'affiliation.capellan-confederation', 'capellan'],
    ['Capellan Commonality', 'affiliation.capellan-confederation.capellan-commonality', 'capellan'],
    ['Liao Commonality', 'affiliation.capellan-confederation.liao-commonality', 'capellan'],
    ['Sian Commonality', 'affiliation.capellan-confederation.sian-commonality', 'capellan'],
    ['St. Ives Commonality', 'affiliation.capellan-confederation.st-ives-commonality', 'capellan'],
    ['Victoria Commonality', 'affiliation.capellan-confederation.victoria-commonality', 'capellan'],
  ])('%s completes independently through Stage 0 and save/resume', async (_label, packageId, family) => {
    const scratch = await mkdtemp(join(tmpdir(), 'atow-canonical-context-'))
    const server = await startServer(fileURLToPath(new URL('..', import.meta.url)))
    const browser = await chromium.launch({ headless: true, ...(browserExecutablePath ? { executablePath: browserExecutablePath } : {}) })
    try {
      const context = await browser.newContext()
      const page = await context.newPage()
      await page.goto(`${server.url}/__experimental-canonical-stage0`, { waitUntil: 'networkidle' })
      await page.getByText('Canonical exports loaded.').waitFor({ state: 'visible' })
      await page.getByLabel('Canonical affiliation family').selectOption(family)
      await page.getByLabel('Canonical affiliation context').selectOption(packageId)
      const choices = page.locator('fieldset select')
      for (let index = 0; index < await choices.count(); index++) await choices.nth(index).selectOption({ index: 1 })
      const pending = page.getByText('Pending choices: 0')
      await pending.waitFor({ state: 'visible' })
      expect(await page.getByRole('button', { name: 'Commit Stage 0' }).isEnabled()).toBe(true)
      await page.getByRole('button', { name: 'Commit Stage 0' }).click()
      expect(await page.getByRole('status').textContent()).toBe('Canonical Stage 0 committed; advanced to Stage 1.')
      await page.getByRole('button', { name: 'Save draft' }).click()
      await page.getByRole('button', { name: 'Resume' }).click()
      expect(await page.getByRole('status').textContent()).toBe('Canonical draft resumed.')
      expect(await page.locator('code').textContent()).toBe(packageId)
      await context.close()
    } finally { await browser.close(); await server.close(); await rm(scratch, { recursive: true, force: true }) }
  }, 120000)

  it('accepts desktop, tablet, mobile, and keyboard interaction without overflow', async () => {
    const scratch = await mkdtemp(join(tmpdir(), 'atow-canonical-responsive-'))
    const server = await startServer(fileURLToPath(new URL('..', import.meta.url)))
    const browser = await chromium.launch({ headless: true, ...(browserExecutablePath ? { executablePath: browserExecutablePath } : {}) })
    try {
      for (const viewport of [{ name: 'desktop', width: 1440, height: 900 }, { name: 'tablet', width: 768, height: 1024 }, { name: 'mobile', width: 390, height: 844 }]) {
        const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } })
        await page.goto(`${server.url}/__experimental-canonical-stage0`, { waitUntil: 'networkidle' })
        await page.getByText('Canonical exports loaded.').waitFor({ state: 'visible' })
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
        await page.screenshot({ path: join(scratch, `${viewport.name}.png`), fullPage: true })
        await page.keyboard.press('Tab')
        expect(await page.locator(':focus').count()).toBe(1)
        await page.keyboard.press('Tab')
        expect(await page.locator(':focus').count()).toBe(1)
        await page.keyboard.press('Shift+Tab')
        expect(await page.locator(':focus').count()).toBe(1)
        await page.close()
      }
    } finally { await browser.close(); await server.close(); await rm(scratch, { recursive: true, force: true }) }
  }, 120000)
})
