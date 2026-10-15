import { describe, expect, it } from 'vitest'
import { createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { capellanCitizenshipEligibility } from './capellanRestrictions'

describe('Capellan Citizenship restrictions', () => {
  it('requires a Citizenship trait with a non-empty subject', () => {
    const character = createLifeModuleCharacter('Capellan restriction')
    character.affiliations.push({ affiliationId: 'affiliation.capellan-confederation', role: 'birth', provenanceId: character.provenance[0].id })
    expect(capellanCitizenshipEligibility(character, 3, 'stage3.university').eligible).toBe(false)
    character.traits.push({ traitId: 'trait.citizenship', displayName: 'Citizenship', accumulatedXp: 0, attainedTp: null, active: true, parameters: { subject: 'Capellan Confederation' }, sourceAwards: [] })
    expect(capellanCitizenshipEligibility(character, 2, 'stage2.military-school').eligible).toBe(true)
    expect(capellanCitizenshipEligibility(character, 3, 'stage3.university').eligible).toBe(true)
  })

  it('does not affect non-Capellan characters or the Civilian Job substitution', () => {
    const character = createLifeModuleCharacter('Unrestricted')
    expect(capellanCitizenshipEligibility(character, 2, 'stage2.military-school').eligible).toBe(true)
    character.affiliations.push({ affiliationId: 'affiliation.capellan-confederation', role: 'birth', provenanceId: character.provenance[0].id })
    expect(capellanCitizenshipEligibility(character, 2, 'stage2.high-school').eligible).toBe(true)
    expect(capellanCitizenshipEligibility(character, 2, 'stage4.civilian-job').eligible).toBe(true)
  })
})
