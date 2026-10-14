import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'
import { describe, expect, it } from 'vitest'
import { createServer } from 'vite'
import { createLifeModuleCharacter, applyUniversalStage0, applyCapellanCommonality, applyStage1Module, applyStage2Module, applyTechnicalCollege, applyAgitator, continueToStage2, continueToStage3, continueToStage4, resolvePendingLifeModuleAward } from '../src/engine/lifeModuleEngine'
import { BLUE_COLLAR_ID, CAPELLAN_COMMONALITY_ID, STAGE_2_HIGH_SCHOOL_ID } from '../src/domain/lifeModules/catalog'
import { getOptimizationPreview } from '../src/domain/lifeModules/finalReview'
import { enterLifeModuleFinalReview } from '../src/engine/lifeModuleFinalReview'
import { enterFinalTouches, markReadyForEquipmentReview } from '../src/engine/finalTouchesEngine'
import { finalizeCharacterSnapshot } from '../src/domain/character/readiness'
import { encodeCharacter } from '../src/persistence/characterCodec'
import { addStasisEvent, createAnnualCheckOutcome, createFreezingCheckOutcome, createStasisEvent } from '../src/domain/character/stasis'
import { B12_FIXTURES, V1D_FIXTURES, assertFixtureSummary, completeV1dFinalReview, completeV1dProgression, createMarchThroughStage0 } from './browserVerification.mjs'

const pwExpect = (locator: { waitFor: (options: { state: 'visible' }) => Promise<void>; count: () => Promise<number>; first: () => { waitFor: (options: { state: 'visible' }) => Promise<void> } }) => ({ toBeVisible: () => locator.first().waitFor({ state: 'visible' }), toHaveCount: async (expected: number) => { const actual = await locator.count(); if (actual !== expected) throw new Error(`Expected ${expected} matching elements, found ${actual}.`) } })

const browserExecutablePath = process.env.ATOW_BROWSER_EXECUTABLE_PATH
const launchBrowser = () => chromium.launch({ headless: true, ...(browserExecutablePath ? { executablePath: browserExecutablePath } : {}) })
const award = (c: ReturnType<typeof createLifeModuleCharacter>, id: string, targetId: string, displayName: string, parameter?: string) => { const p = c.creation.lifeModules!.pendingAwards.find((x) => x.awardId === id)!; return resolvePendingLifeModuleAward(c, p.id, { type: p.allowedTargetTypes[0], targetId, displayName, ...(parameter ? { parameter: { kind: 'subskill', value: parameter } } : {}) }) }
function fixture(includeStasis = true) {
  let c = createLifeModuleCharacter('Export Import Fixture')
  c = applyUniversalStage0(c, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'); c = applyCapellanCommonality(c, 'Russian'); c = applyStage1Module(c, BLUE_COLLAR_ID)
  c = award(c, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French'); c = award(c, 'blue-collar.career', 'skill.career', 'Career/Technician', 'Technician'); c = award(c, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History'); c = award(c, 'blue-collar.interests', 'skill.interest', 'Interest/Science', 'Science')
  for (const id of ['STR', 'BOD', 'DEX', 'RFL']) c = award(c, 'blue-collar.flexible', id, id)
  c = applyStage2Module(continueToStage2(c), STAGE_2_HIGH_SCHOOL_ID); c = award(c, 'high-school.interest-40', 'skill.interest', 'Interest/Physics', 'Physics'); c = award(c, 'high-school.interest-35', 'skill.interest', 'Interest/Art', 'Art')
  let p = c.creation.lifeModules!.pendingAwards.find((x) => x.awardId === 'high-school.flexible')!; c = resolvePendingLifeModuleAward(c, p.id, { type: 'attribute', targetId: 'DEX', displayName: 'DEX' }, 185)
  c = applyTechnicalCollege(continueToStage3(c)); c = award(c, 'technical-college.interest', 'skill.interest', 'Interest/Engineering', 'Engineering'); p = c.creation.lifeModules!.pendingAwards.find((x) => x.awardId === 'technical-college.flexible')!; c = resolvePendingLifeModuleAward(c, p.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 150); c = resolvePendingLifeModuleAward(c, p.id, { type: 'trait', targetId: 'trait.patient', displayName: 'Patient' }, 50)
  c = applyAgitator(continueToStage4(c)); c = award(c, 'agitator.skill.driving', 'skill.driving', 'Driving/Ground Car', 'Ground Car'); c = award(c, 'agitator.skill.prestidigitation', 'skill.prestidigitation', 'Prestidigitation/Sleight of Hand', 'Sleight of Hand'); p = c.creation.lifeModules!.pendingAwards.find((x) => x.awardId === 'agitator.flexible')!; c = resolvePendingLifeModuleAward(c, p.id, { type: 'attribute', targetId: 'STR', displayName: 'STR' }, 50); c = resolvePendingLifeModuleAward(c, p.id, { type: 'skill', targetId: 'skill.acting', displayName: 'Acting' }, 75)
  for (const o of getOptimizationPreview(c)) { const t = o.destination.type === 'attribute' ? c.attributes.find((x) => x.attributeId === o.destination.targetId) : o.destination.type === 'trait' ? c.traits.find((x) => x.traitId === o.destination.targetId) : c.skills.find((x) => x.address.skillId === o.destination.targetId && x.address.parameter?.value === o.destination.parameter?.value); if (t) t.accumulatedXp = o.afterXp }
  c.creation.lifeModules!.moduleXp.starting = c.creation.lifeModules!.moduleXp.spent; c.creation.lifeModules!.moduleXp.remaining = 0; c.xp.creation.starting = c.creation.lifeModules!.moduleXp.spent; c.xp.creation.remaining = 0; c = enterLifeModuleFinalReview(c); c = enterFinalTouches(c); c = markReadyForEquipmentReview(c); if (includeStasis) c = addStasisEvent(c, createStasisEvent('fixture-stasis', 30, 1, 'fixture-stasis-provenance', { brain: createFreezingCheckOutcome('fixture-brain', 'freezing-brain', 'success', 10, 10), body: createFreezingCheckOutcome('fixture-body', 'freezing-body', 'success', 10, 10) }, [createAnnualCheckOutcome('fixture-annual', 'success', 10, 10)])); c = finalizeCharacterSnapshot(c, '2026-10-11T00:00:00.000Z', '00000000-0000-4000-8000-000000000101'); c.displayName = 'Export Import Fixture - revised draft'; return finalizeCharacterSnapshot(c, '2026-10-11T00:01:00.000Z', '00000000-0000-4000-8000-000000000102')
}
const startViteServer = async (repo: string) => {
  const server = await createServer({ root: repo, server: { host: '127.0.0.1', port: 0, strictPort: true } })
  await server.listen()
  const address = server.httpServer?.address()
  if (!address || typeof address === 'string') { await server.close(); throw new Error('Vite server did not expose an assigned loopback port.') }
  return { url: `http://127.0.0.1:${address.port}`, close: () => server.close() }
}

describe('browser export/import integration', () => {
  it('round-trips through isolated contexts twice', async () => {
    const root = await mkdtemp(join(tmpdir(), 'atow-export-import-')); const fixturePath = join(root, 'fixture.json'); const repo = fileURLToPath(new URL('..', import.meta.url)); const server = await startViteServer(repo); const source = fixture(); await writeFile(fixturePath, encodeCharacter(source, '2026-10-11T00:02:00.000Z'))
    try { const browser = await launchBrowser(); try { for (let run = 0; run < 2; run++) {
      const sourceContext = await browser.newContext({ acceptDownloads: true }); const sourcePage = await sourceContext.newPage(); await sourcePage.goto(`${server.url}/`); const input = sourcePage.locator('input[type="file"]'); await input.setInputFiles(fixturePath); await pwExpect(sourcePage.getByText('Export Import Fixture')).toBeVisible(); await sourcePage.getByRole('button', { name: 'Open' }).click(); const downloadPromise = sourcePage.waitForEvent('download'); await sourcePage.getByRole('button', { name: 'Export character JSON' }).click(); const download = await downloadPromise; const exportedPath = join(root, `export-${run}.json`); await download.saveAs(exportedPath); const exported = JSON.parse(await readFile(exportedPath, 'utf8')); expect(exported.character).toEqual(source); expect(exported.character.finalizedSnapshots).toHaveLength(2)
      const destinationContext = await browser.newContext({ acceptDownloads: true }); const destinationPage = await destinationContext.newPage(); await destinationPage.goto(`${server.url}/`); await pwExpect(destinationPage.getByText('Export Import Fixture')).toHaveCount(0); await destinationPage.locator('input[type="file"]').setInputFiles(exportedPath); await pwExpect(destinationPage.getByText('Export Import Fixture - revised draft')).toBeVisible(); await destinationPage.getByRole('button', { name: 'Open' }).click(); await pwExpect(destinationPage.getByText('2 finalized snapshots preserved. Draft edits remain independent.')).toBeVisible(); const importedDownloadPromise = destinationPage.waitForEvent('download'); await destinationPage.getByRole('button', { name: 'Export character JSON' }).click(); const importedDownload = await importedDownloadPromise; const importedPath = join(root, `imported-${run}.json`); await importedDownload.saveAs(importedPath); expect(JSON.parse(await readFile(importedPath, 'utf8')).character).toEqual(source); await sourceContext.close(); await destinationContext.close()
    } } finally { await browser.close() } } finally { await server.close(); await rm(root, { recursive: true, force: true }) }
  }, 120000)

  it('exercises player-facing Stasis controls and round-trips the resulting event', async () => {
    const root = await mkdtemp(join(tmpdir(), 'atow-stasis-ui-')); const fixturePath = join(root, 'fixture.json'); const repo = fileURLToPath(new URL('..', import.meta.url)); const server = await startViteServer(repo); const source = fixture(false); const startingXp = source.xp.creation.remaining; await writeFile(fixturePath, encodeCharacter(source, '2026-10-11T00:03:00.000Z'))
    try { const browser = await launchBrowser(); try { const context = await browser.newContext({ acceptDownloads: true }); const page = await context.newPage(); await page.goto(`${server.url}/`); await page.locator('input[type="file"]').setInputFiles(fixturePath); await pwExpect(page.getByText('Export Import Fixture')).toBeVisible(); await page.getByRole('button', { name: 'Open' }).click(); await pwExpect(page.getByRole('region', { name: 'Stasis history' })).toBeVisible(); const scoreBefore = async (id: string) => Number(await page.locator('table tbody tr').filter({ has: page.getByRole('cell', { name: id, exact: true }) }).first().locator('td').nth(1).textContent()); const bodBefore = await scoreBefore('BOD'); const intBefore = await scoreBefore('INT'); await page.getByLabel('Duration (years)').fill('0'); await page.getByRole('button', { name: 'Record Stasis event' }).click(); await pwExpect(page.getByText('Stasis duration must be positive.')).toBeVisible(); await page.getByLabel('Duration (years)').fill('2'); await page.getByLabel('Brain freezing check').selectOption('success'); await page.getByLabel('Body freezing check').selectOption('success'); await page.getByLabel('Annual failures').fill('1'); await page.getByLabel('Power interruption').selectOption('failure'); await page.getByLabel('MedTech MoS').fill('4'); await page.getByRole('button', { name: 'Record Stasis event' }).click(); await pwExpect(page.getByText('Stasis history event recorded. Resolve any required annual checks before finalization.')).toBeVisible(); await pwExpect(page.getByText('2 year Stasis event')).toHaveCount(1); expect(await page.getByText(/Chronological age:/).count()).toBe(1); expect(await page.getByText(/biological age:/).count()).toBe(1); const downloadPromise = page.waitForEvent('download'); await page.getByRole('button', { name: 'Export character JSON' }).click(); const download = await downloadPromise; const exportedPath = join(root, 'stasis-ui-export.json'); await download.saveAs(exportedPath); const exported = JSON.parse(await readFile(exportedPath, 'utf8')).character; expect(exported.stasisHistory).toHaveLength(1); const stasis = exported.stasisHistory[0]; expect(stasis.durationYears).toBe(2); expect(stasis.startYear + stasis.durationYears).toBeGreaterThan(stasis.startYear); expect(stasis.biologicalAgeDays).toBe(2); expect(stasis.freezing.brain.modifier).toBe(-2); expect(stasis.freezing.body.modifier).toBe(-2); expect(stasis.annualChecks).toHaveLength(2); expect(stasis.annualChecks[0]).toMatchObject({ modifier: -1, outcome: 'failure', bodLoss: 1, intLoss: 1 }); expect(stasis.powerInterruptions[0]).toMatchObject({ modifier: -3, medtechEligible: true, medtechMoS: 4, fatal: false, intervention: 'prevented-death' }); expect(stasis.attributeLosses).toEqual({ BOD: 2, INT: 1 }); expect(stasis.thawStatus).toBe('forced-thaw'); expect(exported.xp.creation.remaining).toBe(startingXp); await page.getByRole('button', { name: 'Save draft' }).click(); await page.getByRole('link', { name: 'Return to character creator' }).click(); await pwExpect(page.getByText('Export Import Fixture - revised draft')).toBeVisible(); await page.getByRole('button', { name: 'Open' }).click(); await pwExpect(page.getByRole('region', { name: 'Stasis history' })).toBeVisible(); await pwExpect(page.getByText('2 year Stasis event')).toHaveCount(1); const bodAfter = await scoreBefore('BOD'); const intAfter = await scoreBefore('INT'); expect(bodAfter).toBe(Math.max(0, bodBefore - stasis.attributeLosses.BOD)); expect(intAfter).toBe(Math.max(0, intBefore - stasis.attributeLosses.INT)); await context.close() } finally { await browser.close() } } finally { await server.close(); await rm(root, { recursive: true, force: true }) }
  }, 120000)

  it('exercises fatal freezing outcomes and player-facing readiness blocking', async () => {
    const root = await mkdtemp(join(tmpdir(), 'atow-stasis-fatal-')); const fixturePath = join(root, 'fixture.json'); const repo = fileURLToPath(new URL('..', import.meta.url)); const server = await startViteServer(repo); await writeFile(fixturePath, encodeCharacter(fixture(false), '2026-10-11T00:04:00.000Z'))
    try { const browser = await launchBrowser(); try { for (const failedCheck of ['Brain freezing check', 'Body freezing check']) { const context = await browser.newContext(); const page = await context.newPage(); await page.goto(`${server.url}/`); await page.locator('input[type="file"]').setInputFiles(fixturePath); await page.getByRole('button', { name: 'Open' }).click(); await pwExpect(page.getByRole('region', { name: 'Stasis history' })).toBeVisible(); await page.getByLabel(failedCheck).selectOption('failure'); await page.getByRole('button', { name: 'Record Stasis event' }).click(); await pwExpect(page.getByText(/1 year Stasis event · fatal/)).toBeVisible(); await pwExpect(page.getByText('A Stasis event records a fatal outcome; the character cannot be ready for play.')).toBeVisible(); await context.close() } } finally { await browser.close() } } finally { await server.close(); await rm(root, { recursive: true, force: true }) }
  }, 120000)

  it('preserves a real Capellan Stage 0 checkpoint across browser sessions and reuses the workflow for Draconis', async () => {
    const root = await mkdtemp(join(tmpdir(), 'atow-b12-checkpoint-'))
    const capellanPath = join(root, 'capellan-stage0.json')
    const capellanStage1Path = join(root, 'capellan-stage1.json')
    const draconisPath = join(root, 'draconis-stage0.json')
    const repo = fileURLToPath(new URL('..', import.meta.url))
    const server = await startViteServer(repo)
    try {
      const browser = await launchBrowser()
      try {
        const capellan = B12_FIXTURES.capellan
        const first = await browser.newPage()
        await first.goto(`${server.url}/#/`, { waitUntil: 'domcontentloaded' })
        await createMarchThroughStage0(first, capellan)
        await assertFixtureSummary(first, capellan)
        const firstExport = first.waitForEvent('download')
        await first.getByRole('button', { name: 'Export character JSON' }).click()
        await (await firstExport).saveAs(capellanPath)
        await first.close()

        const resumed = await browser.newPage()
        await resumed.goto(`${server.url}/#/`, { waitUntil: 'domcontentloaded' })
        await resumed.locator('input[type=file]').setInputFiles(capellanPath)
        await resumed.getByText(`Imported ${capellan.name}.`, { exact: true }).waitFor({ state: 'visible' })
        const card = resumed.locator('li').filter({ hasText: capellan.name })
        await card.getByRole('button', { name: 'Resume' }).click()
        await resumed.locator('select').first().selectOption({ label: 'Blue Collar · Available' })
        const stage1Selects = resumed.locator('select')
        for (let index = 1; index < await stage1Selects.count(); index++) await stage1Selects.nth(index).selectOption({ index: 1 })
        await resumed.getByRole('button', { name: 'Continue' }).click()
        await resumed.getByText('Late Childhood', { exact: true }).waitFor({ state: 'visible' })
        const secondExport = resumed.waitForEvent('download')
        await resumed.getByRole('button', { name: 'Export character JSON' }).click()
        await (await secondExport).saveAs(capellanStage1Path)
        const stage1Text = await resumed.locator('body').innerText()
        if (!stage1Text.includes('Capellan')) throw new Error('Stage 0 Capellan identity was not preserved after Stage 1.')
        await resumed.close()

        const draconis = B12_FIXTURES.draconis
        const dracPage = await browser.newPage()
        await dracPage.goto(`${server.url}/#/`, { waitUntil: 'domcontentloaded' })
        await createMarchThroughStage0(dracPage, draconis)
        await assertFixtureSummary(dracPage, draconis)
        const dracExport = dracPage.waitForEvent('download')
        await dracPage.getByRole('button', { name: 'Export character JSON' }).click()
        await (await dracExport).saveAs(draconisPath)
        await dracPage.close()
        const dracResumed = await browser.newPage()
        await dracResumed.goto(`${server.url}/#/`, { waitUntil: 'domcontentloaded' })
        await dracResumed.locator('input[type=file]').setInputFiles(draconisPath)
        await dracResumed.getByText(`Imported ${draconis.name}.`, { exact: true }).waitFor({ state: 'visible' })
        await dracResumed.locator('li').filter({ hasText: draconis.name }).getByRole('button', { name: 'Resume' }).click()
        await assertFixtureSummary(dracResumed, draconis)
        await dracResumed.close()
      } finally { await browser.close() }
    } finally { await server.close(); await rm(root, { recursive: true, force: true }) }
  }, 120000)

  it('executes the source-valid Capellan progression through legal final review', async () => {
    const root = await mkdtemp(join(tmpdir(), 'atow-v1d-progression-'))
    const checkpointPath = join(root, 'stage3-checkpoint.json')
    const repo = fileURLToPath(new URL('..', import.meta.url))
    const server = await startViteServer(repo)
    try {
      const browser = await launchBrowser()
      try {
        const fixture = V1D_FIXTURES.capellanProgression
        const first = await browser.newPage({ acceptDownloads: true })
        await first.goto(`${server.url}/#/`, { waitUntil: 'domcontentloaded' })
        await completeV1dProgression(first, fixture)
        await assertFixtureSummary(first, fixture)
        expect(await first.getByText('Review character readiness', { exact: true }).count()).toBe(1)

        const checkpoint = first.waitForEvent('download')
        await first.getByRole('button', { name: 'Export character JSON' }).click()
        await (await checkpoint).saveAs(checkpointPath)
        await first.close()

        const resumed = await browser.newPage({ acceptDownloads: true })
        await resumed.goto(`${server.url}/#/`, { waitUntil: 'domcontentloaded' })
        await resumed.locator('input[type=file]').setInputFiles(checkpointPath)
        await resumed.getByText(`Imported ${fixture.name}.`, { exact: true }).waitFor({ state: 'visible' })
        await resumed.locator('li').filter({ hasText: fixture.name }).getByRole('button', { name: 'Resume' }).click()
        await resumed.getByText('Review character readiness', { exact: true }).waitFor({ state: 'visible' })
        await completeV1dFinalReview(resumed, fixture)
        if (await resumed.getByText('No final-review blockers remain.', { exact: true }).count() === 0) throw new Error(`Final legality blockers:\n${(await resumed.locator('body').innerText()).slice(-5000)}`)
        expect(await resumed.getByText('Ready for Final Touches', { exact: true }).count()).toBe(1)
        expect(await resumed.getByText('Optimization opportunities remain unresolved.', { exact: true }).count()).toBe(0)
        expect(await resumed.locator('body').innerText()).toContain('Pending choices\n0')
        expect(await resumed.getByText('Technician/Civilian: DEX 3+', { exact: false }).count()).toBe(0)
        await resumed.close()
      } finally { await browser.close() }
    } finally { await server.close(); await rm(root, { recursive: true, force: true }) }
  }, 120000)
})
