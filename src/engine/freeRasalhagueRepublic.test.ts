import { describe, expect, it } from 'vitest'
import { FREE_RASALHAGUE_REPUBLIC_ID, RASALHAGUE_CLAN_WAR_EXPATRIATE_ID, RASALHAGUE_GHOST_BEAR_ID } from '../domain/lifeModules/affiliations'
import { applyStage0Affiliation, createLifeModuleCharacter } from './lifeModuleEngine'

const commit = (subAffiliation: string, choices: Record<string, string> = {}) => applyStage0Affiliation(
  createLifeModuleCharacter(`Rasalhague ${subAffiliation}`), FREE_RASALHAGUE_REPUBLIC_ID, 'Swedish', undefined, undefined, undefined, 'no', undefined, undefined, undefined,
  subAffiliation, undefined, undefined, undefined, { ...choices, protocol: subAffiliation === RASALHAGUE_CLAN_WAR_EXPATRIATE_ID ? 'Lyran' : choices.protocol },
)

describe('Free Rasalhague Republic Stage 0 integration', () => {
  it('commits the parent package with the required Interest/Any destination', () => {
    const character = commit('no', { interest: 'History' })
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(125)
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.interest' && entry.address.parameter?.value === 'History')).toBe(true)
    expect(character.creation.lifeModules?.pendingAwards).toHaveLength(0)
  })

  it('commits Clan War Expatriate only with both source-defined choices', () => {
    const character = commit(RASALHAGUE_CLAN_WAR_EXPATRIATE_ID, { interest: 'History', language: 'German' })
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(250)
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.language' && entry.address.parameter?.value === 'German')).toBe(true)
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.protocol' && entry.address.parameter?.value === 'Lyran')).toBe(true)
    expect(character.creation.lifeModules?.pendingAwards).toHaveLength(0)
  })

  it('commits Ghost Bear Dominion with corrected Page 67 martial and melee awards', () => {
    const character = commit(RASALHAGUE_GHOST_BEAR_ID, { interest: 'History' })
    expect(character.traits.find((entry) => entry.traitId === 'trait.equipped')?.accumulatedXp).toBe(50)
    expect(character.skills.find((entry) => entry.address.skillId === 'skill.martial-arts')?.accumulatedXp).toBe(15)
    expect(character.skills.find((entry) => entry.address.skillId === 'skill.melee-weapons')?.accumulatedXp).toBe(15)
    expect(character.creation.lifeModules?.pendingAwards).toHaveLength(0)
  })
})
