import { describe, expect, it } from 'vitest'
import { applyStage0Affiliation, createLifeModuleCharacter } from './lifeModuleEngine'
import { DEEP_PERIPHERY_CASTILIAN_ID, DEEP_PERIPHERY_HANSEATIC_ID, DEEP_PERIPHERY_ID, DEEP_PERIPHERY_JARNFOLK_ID, DEEP_PERIPHERY_UMAYYAD_ID } from '../domain/lifeModules/affiliations'

const commit = (context: string, choices: Record<string, string> = {}) => applyStage0Affiliation(
  createLifeModuleCharacter(`Deep Periphery ${context}`), context, 'English', undefined, undefined, undefined, 'no', undefined, undefined, undefined, context === DEEP_PERIPHERY_ID ? 'no' : context,
  undefined, undefined, undefined, choices,
)

describe('Deep Periphery Stage 0 integration', () => {
  it.each([DEEP_PERIPHERY_ID, DEEP_PERIPHERY_HANSEATIC_ID, DEEP_PERIPHERY_CASTILIAN_ID, DEEP_PERIPHERY_UMAYYAD_ID, DEEP_PERIPHERY_JARNFOLK_ID])('commits %s with complete parent/realm awards', (context) => {
    const choices: Record<string, string> = { flexible1Type: 'attribute', flexible1Id: 'INT', flexible2Type: 'trait', flexible2Id: 'trait.wealth' }
    if (context === DEEP_PERIPHERY_JARNFOLK_ID) choices['jarnfolk.skill.choice'] = 'skill.art'
    const character = commit(context, choices)
    expect(character.lifeModuleHistory.at(-1)?.moduleId).toBe(DEEP_PERIPHERY_ID)
    expect(character.creation.lifeModules?.pendingAwards).toHaveLength(0)
    expect(character.affiliations.some((entry) => entry.affiliationId === 'affiliation.deep-periphery')).toBe(true)
  })
})
