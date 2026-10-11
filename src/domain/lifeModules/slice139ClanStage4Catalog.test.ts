import { describe, expect, it } from 'vitest'
import { CLAN_CIVILIAN_JOB_ID, CLAN_SCIENTIST_CASTE_SERVICE_ID, CLAN_WATCH_OPERATIVE_BRANCH_PACKAGE_ID, CLAN_WATCH_OPERATIVE_ID, CLAN_SCIENTIST_CASTE_SERVICE_TRAIT_PACKAGE_ID, CONDITIONAL_LIFE_MODULE_PACKAGE_CATALOG, getLifeModule } from './catalog'

describe('Alpha Slice 139 Clan Stage 4 catalog', () => {
  it.each([
    [CLAN_WATCH_OPERATIVE_ID, 1200, 3, 84],
    [CLAN_CIVILIAN_JOB_ID, 600, 6, 84],
    [CLAN_SCIENTIST_CASTE_SERVICE_ID, 1200, 4, 90],
  ])('records the source module identity, cost, duration, and page', (id, costXp, chronologyYears, page) => {
    expect(getLifeModule(id)).toMatchObject({ id, costXp, chronologyYears, source: { page } })
  })

  it('keeps Clan creation and unresolved branches explicitly deferred', () => {
    expect(getLifeModule(CLAN_WATCH_OPERATIVE_ID).deferredRules.length).toBeGreaterThan(0)
    expect(getLifeModule(CLAN_SCIENTIST_CASTE_SERVICE_ID).deferredRules.length).toBeGreaterThan(0)
  })

  it('records governed Watch branches and atomic Scientist Trait-pair choices', () => {
    const watch = CONDITIONAL_LIFE_MODULE_PACKAGE_CATALOG.find((entry) => entry.id === CLAN_WATCH_OPERATIVE_BRANCH_PACKAGE_ID)!
    expect(watch.choices.map((choice) => choice.id)).toEqual(['branch.homeworld-clan', 'branch.invader-clan'])
    const traits = CONDITIONAL_LIFE_MODULE_PACKAGE_CATALOG.find((entry) => entry.id === CLAN_SCIENTIST_CASTE_SERVICE_TRAIT_PACKAGE_ID)!
    expect(traits.choices[0].awards).toHaveLength(2)
    expect(traits.choices[1].unsupportedReasons).toEqual(expect.arrayContaining([expect.stringContaining('Natural Aptitude')]))
  })
})
