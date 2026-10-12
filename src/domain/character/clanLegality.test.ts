import { describe, expect, it } from 'vitest'
import { createCharacterDraft } from '../../engine/characterFactory'
import { clanIdentityState, clanCasteState } from './clanIdentity'
import { evaluateClanDestinationLegality, evaluateHomeworldClanLegality } from './clanLegality'

function character() { return createCharacterDraft('life-modules', 'Clan legality fixture') }
describe('specific Clan legality foundation', () => {
  it('classifies concrete destinations, signed trait opposition, and duplicate languages', () => {
    const value = character()
    value.traits.push({ traitId: 'trait.impatient', displayName: 'Impatient', accumulatedXp: -100, attainedTp: -1, active: true, parameters: {}, sourceAwards: [] })
    expect(evaluateClanDestinationLegality(value, 'Patient').status).toBe('INELIGIBLE')
    value.skills.push({ address: { skillId: 'skill.language', parameter: { kind: 'subskill', value: 'Russian' } }, displayName: 'Language/Russian', accumulatedXp: 20, level: 0, sourceAwards: [] })
    expect(evaluateClanDestinationLegality(value, 'Language/Secondary/Russian').status).toBe('INELIGIBLE')
    expect(evaluateClanDestinationLegality(value, 'Unknown/Any').status).toBe('UNSUPPORTED_DEPENDENCY')
  })
  it('does not invent missing Phenotype, caste, or service-era context', () => {
    const value = character()
    value.clanIdentity = clanIdentityState()
    const findings = evaluateHomeworldClanLegality(value, 'star-adder')
    expect(findings.map((entry) => entry.status)).toEqual(expect.arrayContaining(['UNRESOLVED_REQUIRED_CHOICE', 'UNSUPPORTED_DEPENDENCY']))
    value.clanCaste = clanCasteState('warrior')
    expect(evaluateHomeworldClanLegality(value, 'star-adder').some((entry) => entry.id === 'service-era.unsupported')).toBe(true)
  })
})
