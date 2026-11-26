import { describe, expect, it } from 'vitest'
import { applyTerranAffiliation, applyUniversalStage0, createLifeModuleCharacter } from './lifeModuleEngine'
import { TERRAN_BELTER_ID, TERRAN_ID, TERRAN_VENUSIAN_ID } from '../domain/lifeModules/affiliations'
import { getFinalReviewBlockers } from '../domain/lifeModules/finalReview'

function base(contextId: string) {
  return applyUniversalStage0(createLifeModuleCharacter(`Terran ${contextId}`), contextId, 'English')
}

describe('Terran Stage 0 affiliation', () => {
  it('applies the parent package with distinct other Attribute and Language selections', () => {
    const character = applyTerranAffiliation(base(TERRAN_ID), TERRAN_ID, 'French', {
      attributeOne: 'STR', attributeTwo: 'BOD', languageOne: 'French', languageTwo: 'German',
    })
    expect(character.affiliations.at(-1)?.affiliationId).toBe('affiliation.terran')
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')?.accumulatedXp).toBe(150)
    expect(character.attributes.find((entry) => entry.attributeId === 'BOD')?.accumulatedXp).toBe(150)
    expect(character.skills.filter((entry) => entry.address.skillId === 'skill.language').map((entry) => entry.accumulatedXp)).toContain(15)
    expect(character.creation.lifeModules?.phase).toBe('stage-1-selection')
  })

  it('enforces Belter choices through the same atomic package path', () => {
    const character = applyTerranAffiliation(base(TERRAN_BELTER_ID), TERRAN_BELTER_ID, 'French', {
      attributeOne: 'STR', attributeTwo: 'BOD', languageOne: 'French', languageTwo: 'German', traitOne: 'trait.fast-learner', traitTwo: 'trait.good-hearing', skill1: 'skill.driving|Any', skill2: 'skill.interest|Geology',
    })
    expect(character.lifeModuleHistory.at(-1)?.moduleId).toBe(TERRAN_BELTER_ID)
    expect(character.creation.lifeModules?.pendingAwards).toHaveLength(0)
  })

  it('allows Venusian provisional selection and blocks final review while Birth Year is pending', () => {
    const character = applyTerranAffiliation(base(TERRAN_VENUSIAN_ID), TERRAN_VENUSIAN_ID, 'French', {
      attributeOne: 'STR', attributeTwo: 'BOD', languageOne: 'French', languageTwo: 'German', secondaryLanguage: 'French', skillOne: 'skill.art|Painting',
    })
    expect(character.creation.lifeModules?.deferredEligibility?.[0].status).toBe('pending')
    expect(getFinalReviewBlockers({ ...character, creation: { ...character.creation, lifeModules: { ...character.creation.lifeModules!, finalReview: { version: 1, enteredAt: new Date(0).toISOString(), readiness: 'ready-for-final-touches', allocationPool: { starting: 0, allocated: 0, optimizationReturned: 0, remaining: 0 }, allocations: [], skillPurchases: [], additionalTraitXp: [], negativeTraitXpPurchase: { capXp: 0, purchasedXp: 0, uiStatus: 'deferred' }, optimizations: [] } } } })).toEqual(expect.arrayContaining([expect.objectContaining({ id: 'deferred-eligibility' })]))
  })
})
