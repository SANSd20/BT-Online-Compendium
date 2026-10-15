import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, SIAN_COMMONALITY_ID } from '../domain/lifeModules/catalog'
import { capellanCitizenshipEligibility } from '../domain/lifeModules/capellanRestrictions'
import { applyStage0Affiliation, createLifeModuleCharacter } from './lifeModuleEngine'
import { deriveTraitPointsForTrait, getOptimizationPreview } from '../domain/lifeModules/finalReview'

describe('Sian Commonality Citizenship award', () => {
  it('awards active Citizenship +50 XP only for Sian Commonality', () => {
    const base = createLifeModuleCharacter('Sian')
    const sian = applyStage0Affiliation(base, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian', undefined, undefined, 'no', undefined, undefined, undefined, SIAN_COMMONALITY_ID)
    expect(sian.traits).toContainEqual(expect.objectContaining({ traitId: 'trait.citizenship', accumulatedXp: 50, active: true, parameters: { subject: 'Capellan Confederation' } }))
    expect(capellanCitizenshipEligibility(sian, 2, 'stage2.military-school').eligible).toBe(true)
    expect(capellanCitizenshipEligibility(sian, 3, 'stage3.university').eligible).toBe(true)
    const parent = applyStage0Affiliation(createLifeModuleCharacter('Parent'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian', undefined, undefined, 'no', undefined, undefined, undefined, 'no')
    expect(parent.traits.some((entry) => entry.traitId === 'trait.citizenship')).toBe(false)
  })

  it('retains and resolves the governed Commonality language award', () => {
    const pending = applyStage0Affiliation(createLifeModuleCharacter('Sian pending'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', undefined, undefined, undefined, 'no', undefined, undefined, undefined, SIAN_COMMONALITY_ID)
    expect(pending.creation.lifeModules?.pendingAwards).toEqual(expect.arrayContaining([expect.objectContaining({ awardId: 'commonality.language.fedsuns', choiceSource: 'federated-suns-languages' })]))
    const resolved = applyStage0Affiliation(createLifeModuleCharacter('Sian resolved'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian', undefined, undefined, 'no', undefined, undefined, undefined, SIAN_COMMONALITY_ID)
    expect(resolved.skills.filter((entry) => entry.address.skillId === 'skill.language' && entry.address.parameter?.value === 'Russian')).toHaveLength(1)
    expect(resolved.creation.lifeModules?.pendingAwards.some((entry) => entry.awardId === 'commonality.language.fedsuns')).toBe(true)
    expect(resolved.traits.filter((entry) => entry.traitId === 'trait.citizenship')).toHaveLength(1)
  })

  it('preserves the source-backed Citizenship threshold during derived recalculation', () => {
    expect(deriveTraitPointsForTrait('trait.citizenship', 49)).toBeNull()
    expect(deriveTraitPointsForTrait('trait.citizenship', 50)).toBe(1)
    expect(deriveTraitPointsForTrait('trait.citizenship', 100)).toBe(1)
  })

  it('does not optimize attained Citizenship below its 50-XP threshold', () => {
    const character = applyStage0Affiliation(createLifeModuleCharacter('Sian optimization'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', undefined, undefined, undefined, 'no', undefined, undefined, undefined, SIAN_COMMONALITY_ID)
    const citizenship = character.traits.find((entry) => entry.traitId === 'trait.citizenship')!
    expect(getOptimizationPreview(character).some((entry) => entry.destination.type === 'trait' && entry.destination.targetId === 'trait.citizenship')).toBe(false)
    expect(citizenship).toMatchObject({ accumulatedXp: 50, attainedTp: 1, active: true })
  })
})
