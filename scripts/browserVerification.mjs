/**
 * Reusable player-facing browser verification primitives.
 *
 * This module deliberately contains workflow and assertion helpers only;
 * faction expectations live in fixtures below and gameplay state is never
 * injected into the browser.
 */
export const BROWSER_EXECUTABLE = process.env.ATOW_BROWSER_EXECUTABLE_PATH ?? 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'

export const B12_FIXTURES = Object.freeze({
  capellan: Object.freeze({
    name: 'B12 Capellan checkpoint', affiliation: 'Federated Suns', language: 'English', march: 'Capellan March',
    marchLanguage: 'Spanish', aptitude: 'Strategy', art: 'Painting',
    expected: Object.freeze(['Capellan March']),
  }),
  draconis: Object.freeze({
    name: 'B12 Draconis checkpoint', affiliation: 'Federated Suns', language: 'English', march: 'Draconis March',
    aptitude: 'Strategy', art: 'Sculpture',
    expected: Object.freeze(['Draconis March']),
  }),
})

export const V1D_FIXTURES = Object.freeze({
  capellanProgression: Object.freeze({
    name: 'V1d Capellan progression', affiliation: 'Federated Suns', language: 'English', march: 'Capellan March',
    marchLanguage: 'Spanish', aptitude: 'Strategy',
    stage1: Object.freeze({ module: 'Blue Collar · Available', career: 'Aerospace Pilot', interests: ['FedSuns History', 'Geology'] }),
    stage2: Object.freeze({ module: 'High School · Available', interests: ['FedSuns History', 'Geology'], flexibleAttribute: 'INT', flexibleXp: 185 }),
    stage3: Object.freeze({ module: 'Technical College · Available', basic: 'Technician/Civilian', advanced: 'Technician/Vehicle', interest: 'FedSuns History', flexibleAttribute: 'INT', flexibleXp: 200 }),
    stage4: Object.freeze({ module: 'Agitator · Available', flexibleAllocations: Object.freeze([['WIL', 50], ['STR', 50], ['DEX', 25]]) }),
    finalAllocations: Object.freeze([['STR', 500], ['BOD', 500], ['DEX', 500], ['RFL', 500], ['CHA', 500], ['EDG', 144], ['STR', 44]]),
    expected: Object.freeze(['Capellan March', 'Blue Collar', 'High School', 'Technical College', 'Agitator']),
  }),
})

export async function launchVerificationBrowser(chromium) {
  return chromium.launch({ headless: true, executablePath: BROWSER_EXECUTABLE })
}
export async function createMarchThroughStage0(page, fixture) {
  await page.getByRole('link', { name: 'Start Life Modules' }).click()
  await page.getByLabel('Character name').fill(fixture.name)
  await page.getByRole('button', { name: 'Create Life Module draft' }).click()
  await page.selectOption('#stage0-affiliation', { label: fixture.affiliation })
  await page.selectOption('#stage0-affiliation-language', { label: fixture.language })
  await page.selectOption('#stage0-affiliation-context', { label: fixture.march })
  await page.selectOption('#stage0-davion-aptitude', { label: fixture.aptitude })
  if (fixture.marchLanguage) await page.selectOption('#stage0-davion-art', { label: fixture.marchLanguage })
  else {
    await page.selectOption('#stage0-davion-art', { label: 'Other (specify)' })
    await page.locator('#stage0-davion-art-other').fill(fixture.art)
  }
  await page.getByRole('button', { name: 'Continue' }).last().click()
  await page.getByText('Early Childhood module', { exact: false }).first().waitFor({ state: 'visible' })
  return page
}
export async function assertFixtureSummary(page, fixture) {
  const summary = await page.locator('body').innerText()
  for (const expected of fixture.expected) {
    const marchAlias = expected.endsWith(' March') ? expected.replace(' March', '') : expected
    if (!summary.includes(expected) && !summary.includes(marchAlias)) throw new Error(`Expected ${expected} in character summary.`)
  }
}
export async function exportAndReopen(page, filePath, displayName) {
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.getByRole('button', { name: 'Export character JSON' }).click(),
  ])
  await download.saveAs(filePath)
  await page.goto(`${new URL(page.url()).origin}/#/`, { waitUntil: 'domcontentloaded' })
  await page.locator('input[type=file]').setInputFiles(filePath)
  await page.getByText(`Imported ${displayName}.`, { exact: true }).waitFor({ state: 'visible' })
  const card = page.locator('li').filter({ hasText: displayName })
  await card.getByRole('button', { name: 'Resume' }).click()
}

export function checkpointSnapshot(page, stage) {
  return page.locator('body').innerText().then((text) => ({ stage, text }))
}

export async function chooseAvailableModule(page, label) {
  const selector = page.locator('select').first()
  await selector.selectOption({ label })
  return selector
}

export async function resolveVisibleChoiceSlots(page, startIndex = 1) {
  const selects = page.locator('select')
  const count = await selects.count()
  for (let index = startIndex; index < count; index++) {
    const options = await selects.nth(index).locator('option').evaluateAll((items) => items.map((item) => ({ value: item.getAttribute('value') ?? '', disabled: (item instanceof HTMLOptionElement) && item.disabled })).filter((item) => !item.disabled && item.value !== ''))
    if (options.length === 0) continue
    await selects.nth(index).selectOption({ value: options[0].value })
  }
}

export async function continueStage(page) {
  await page.getByRole('button', { name: 'Continue' }).last().click()
  await page.waitForTimeout(100)
}

export async function completeV1dProgression(page, fixture) {
  await createMarchThroughStage0(page, fixture)

  await page.selectOption('#stage1-module', { label: fixture.stage1.module })
  const stage1Subjects = page.locator('select[id$="-subject-choice"]')
  await stage1Subjects.nth(0).selectOption({ label: fixture.stage1.career })
  await stage1Subjects.nth(1).selectOption({ label: fixture.stage1.interests[0] })
  await stage1Subjects.nth(2).selectOption({ label: fixture.stage1.interests[1] })
  const stage1Destinations = page.locator('select[id$="-destination"]')
  for (let index = 0; index < await stage1Destinations.count(); index++) await stage1Destinations.nth(index).selectOption({ index: 1 })
  await page.getByRole('button', { name: 'Continue with Blue Collar' }).click()
  await page.getByRole('button', { name: 'Continue to Stage 2' }).click()

  await page.selectOption('#stage2-module', { label: fixture.stage2.module })
  const stage2Subjects = page.locator('select[id$="-subject-choice"]')
  await stage2Subjects.nth(0).selectOption({ label: fixture.stage2.interests[0] })
  await stage2Subjects.nth(1).selectOption({ label: fixture.stage2.interests[1] })
  await page.locator('select[id$="-type"]').last().selectOption({ label: 'attribute' })
  await page.locator('select[id$="-destination"]').last().selectOption({ label: fixture.stage2.flexibleAttribute })
  await page.locator('input[id$="-xp"]').last().fill(String(fixture.stage2.flexibleXp))
  await page.getByRole('button', { name: 'Continue with High School' }).click()
  await page.getByRole('button', { name: 'Continue to Stage 3' }).click()

  await page.selectOption('#stage3-school', { label: fixture.stage3.module })
  await page.locator('[id="stage3.technical-college-basic"]').selectOption({ label: fixture.stage3.basic })
  await page.locator('select[aria-label="Advanced Field 1"]').selectOption({ label: fixture.stage3.advanced })
  await page.locator('select[id$="-subject-choice"]').last().selectOption({ label: fixture.stage3.interest })
  await page.locator('select[id$="-type"]').last().selectOption({ label: 'attribute' })
  await page.locator('select[id$="-destination"]').last().selectOption({ label: fixture.stage3.flexibleAttribute })
  await page.locator('input[id$="-xp"]').last().fill(String(fixture.stage3.flexibleXp))
  await page.getByRole('button', { name: 'Continue with Technical College' }).click()
  await page.getByRole('button', { name: 'Continue to Stage 4' }).click()

  await page.selectOption('#stage4-module', { label: fixture.stage4.module })
  const stage4Destinations = page.locator('select[id$="-destination"]')
  await stage4Destinations.nth(0).selectOption({ index: 1 })
  await stage4Destinations.nth(1).selectOption({ index: 1 })
  const stage4Flexible = page.locator('select[id$="-type"]').last()
  await stage4Flexible.selectOption({ label: 'attribute' })
  await page.waitForTimeout(100)
  const allocateStage4 = async (xp) => {
    const type = page.locator('select[id$="-type"]').last()
    await type.selectOption({ label: 'attribute' })
    await page.waitForTimeout(100)
    const destination = page.locator('select[id$="-destination"]').last()
    const amount = page.locator('input[id$="-xp"]').last()
    const options = await destination.locator('option').evaluateAll((items) => items.map((item) => ({ value: item.getAttribute('value') ?? '', disabled: item.disabled })).filter((item) => item.value !== '' && !item.disabled))
    await destination.selectOption({ value: options[0].value })
    await amount.fill(String(xp))
    await amount.press('Tab')
    await page.waitForTimeout(100)
    if ((await page.getByRole('button', { name: 'Add allocation slot' }).count()) > 0 && xp !== 25) {
      const add = page.getByRole('button', { name: 'Add allocation slot' })
      await page.waitForTimeout(100)
      if (await add.isEnabled()) await add.click()
    }
  }
  await allocateStage4(fixture.stage4.flexibleAllocations[0][1])
  await allocateStage4(fixture.stage4.flexibleAllocations[1][1])
  await allocateStage4(fixture.stage4.flexibleAllocations[2][1])
  const continueAgitator = page.getByRole('button', { name: 'Continue with Agitator' })
  if (!(await continueAgitator.isEnabled())) throw new Error(`Agitator unresolved state:\n${(await page.locator('body').innerText()).slice(-4000)}`)
  await continueAgitator.click()
  await page.getByRole('button', { name: 'Enter final review' }).click()
}

export async function completeV1dFinalReview(page, fixture) {
  await page.getByRole('button', { name: /Optimize All/ }).click()
  const finalSelect = page.locator('select').filter({ hasText: /Attribute · STR/ }).first()
  const numberInputs = page.locator('input[type="number"]')
  const xpInput = numberInputs.nth((await numberInputs.count()) - 2)
  for (const [attribute, xp] of fixture.finalAllocations) {
    await finalSelect.selectOption({ label: `Attribute · ${attribute}` })
    await xpInput.fill(String(xp))
    await page.getByRole('button', { name: 'Allocate XP' }).click()
  }
}
