import { describe, expect, it } from 'vitest'
import { clanBirthOriginState, clanCasteState, clanIdentityState } from '../character/clanIdentity'
import { createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { CLAN_STAGE4_ELIGIBILITY_RULES, clanWarriorStage3Bypass, evaluateClanStage4Eligibility } from './clanStage4Eligibility'

function clanCharacter() {
  const character = createLifeModuleCharacter('Clan fixture')
  character.clanIdentity = clanIdentityState()
  character.clanCaste = clanCasteState('warrior')
  character.clanBirthOrigin = clanBirthOriginState('trueborn')
  character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'birth', provenanceId: character.provenance[0]?.id ?? 'fixture' })
  character.creation.lifeModules!.stage0AffiliationContext = 'stage0.clan.homeworld-clan'
  return character
}

describe('Clan Stage 4 eligibility foundation', () => {
  it('returns eligible, ineligible, unsupported, and unresolved outcomes without mutation', () => {
    const character = clanCharacter()
    const before = structuredClone(character)
    expect(evaluateClanStage4Eligibility(character, CLAN_STAGE4_ELIGIBILITY_RULES[0]).status).toBe('ELIGIBLE')
    expect(evaluateClanStage4Eligibility(character, CLAN_STAGE4_ELIGIBILITY_RULES.find((rule) => rule.moduleId === 'stage4.civilian-job')!).status).toBe('INELIGIBLE')
    expect(evaluateClanStage4Eligibility(character, CLAN_STAGE4_ELIGIBILITY_RULES.find((rule) => rule.moduleId === 'stage4.protomech-pilot-training')!).status).toBe('UNSUPPORTED_DEPENDENCY')
    expect(evaluateClanStage4Eligibility(character, CLAN_STAGE4_ELIGIBILITY_RULES.find((rule) => rule.moduleId === 'stage4.merchant')!).status).toBe('UNRESOLVED_REQUIRED_CHOICE')
    expect(character).toEqual(before)
  })

  it('derives the Clan warrior Stage 3 bypass from committed history', () => {
    const character = clanCharacter()
    character.lifeModuleHistory.push({ moduleId: 'stage2.trueborn-sibko', displayName: 'Trueborn Sibko', stage: 2, costXp: 1600, selectedAt: new Date().toISOString(), provenanceIds: ['fixture'], source: { sourceId: 'fixture', edition: 'fixture', page: 79 }, notes: [] })
    expect(clanWarriorStage3Bypass(character)).toBe(true)
    character.lifeModuleHistory.push({ moduleId: 'stage3.fake', displayName: 'Fake Stage 3', stage: 3, costXp: 0, selectedAt: new Date().toISOString(), provenanceIds: ['fixture'], source: { sourceId: 'fixture', edition: 'fixture' }, notes: [] })
    expect(clanWarriorStage3Bypass(character)).toBe(false)
  })
})
