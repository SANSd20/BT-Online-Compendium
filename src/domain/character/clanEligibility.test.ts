import { describe, expect, it } from 'vitest'
import { createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { clanIdentityState } from './clanIdentity'
import { createClanSubAffiliationDraft } from './clanSubAffiliation'
import { evaluateHomeworldClanEligibility } from './clanEligibility'

describe('Alpha Slice 165-B2 Clan eligibility foundation', () => {
  function character() {
    const value = createLifeModuleCharacter('eligibility', 5000)
    value.clanIdentity = clanIdentityState()
    value.clanSubAffiliationDraft = createClanSubAffiliationDraft('blood-spirit')
    value.phenotypeId = 'phenotype.mechwarrior'
    return value
  }
  it('classifies a structurally valid Clan draft as eligible without applying awards', () => {
    const value = character()
    const before = JSON.stringify(value.attributes)
    const result = evaluateHomeworldClanEligibility(value)
    expect(result.status).toBe('ELIGIBLE')
    expect(JSON.stringify(value.attributes)).toBe(before)
  })
  it('distinguishes missing phenotype and unresolved required choices', () => {
    const value = character()
    value.phenotypeId = 'phenotype.normal-human'
    expect(evaluateHomeworldClanEligibility(value).status).toBe('INELIGIBLE')
    value.phenotypeId = 'phenotype.mechwarrior'
    value.clanSubAffiliationDraft = createClanSubAffiliationDraft('cloud-cobra')
    expect(evaluateHomeworldClanEligibility(value).status).toBe('UNRESOLVED_REQUIRED_CHOICE')
  })
  it('rejects opposing Trait choices', () => {
    const value = character()
    value.clanSubAffiliationDraft = { ...createClanSubAffiliationDraft('fire-mandrill'), choices: [{ id: 'trait', packageId: 'stage0.clan-sub-affiliation.fire-mandrill', choiceId: 'fire-mandrill.trait', requiredCount: 1, selectedDestinations: ['Patient'], status: 'ready', source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 70, ruleId: 'test' } }], status: 'ready' }
    value.traits.push({ traitId: 'trait.impatient', displayName: 'Impatient', accumulatedXp: -100, attainedTp: -1, active: true, parameters: {}, sourceAwards: [] })
    expect(evaluateHomeworldClanEligibility(value).status).toBe('INELIGIBLE')
  })
})
