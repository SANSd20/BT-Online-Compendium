import { describe, expect, it } from 'vitest'
import { applyStage0Affiliation, createLifeModuleCharacter } from './lifeModuleEngine'
import { MAJOR_PERIPHERY_CANOPUS_ID, MAJOR_PERIPHERY_CIRCINUS_ID, MAJOR_PERIPHERY_ID, MAJOR_PERIPHERY_MARIAN_ID, MAJOR_PERIPHERY_OUTWORLDS_ID, MAJOR_PERIPHERY_TAURIAN_ID } from '../domain/lifeModules/affiliations'

const commit = (context: string, choices: Record<string, string> = {}) => applyStage0Affiliation(
  createLifeModuleCharacter(`Major Periphery ${context}`), context, 'English', undefined, undefined, undefined, 'no', undefined, undefined, undefined, context === MAJOR_PERIPHERY_ID ? 'no' : context,
  undefined, undefined, undefined, choices,
)

describe('Major Periphery Stage 0 integration', () => {
  it.each([MAJOR_PERIPHERY_ID, MAJOR_PERIPHERY_CIRCINUS_ID, MAJOR_PERIPHERY_CANOPUS_ID, MAJOR_PERIPHERY_MARIAN_ID, MAJOR_PERIPHERY_OUTWORLDS_ID, MAJOR_PERIPHERY_TAURIAN_ID])('commits %s with complete parent/realm awards', (context) => {
    const choices: Record<string, string> = { flexible1Type: 'attribute', flexible1Id: 'INT', flexible2Type: 'attribute', flexible2Id: 'WIL', flexible3Type: 'trait', flexible3Id: 'trait.wealth' }
    if (context === MAJOR_PERIPHERY_CIRCINUS_ID) Object.assign(choices, { skillOne: 'skill.animal-handling|', skillTwo: 'skill.martial-arts', skillThree: 'skill.medtech|General' })
    if (context === MAJOR_PERIPHERY_CANOPUS_ID) choices['canopus.skill.choice'] = 'skill.acting'
    if (context === MAJOR_PERIPHERY_OUTWORLDS_ID) choices['outworlds.skill.choice'] = 'skill.martial-arts'
    if (context === MAJOR_PERIPHERY_TAURIAN_ID) Object.assign(choices, { flexible4Type: 'attribute', flexible4Id: 'CHA', flexible5Type: 'skill', flexible5Id: 'skill.negotiation' })
    const character = commit(context, choices)
    expect(character.lifeModuleHistory.at(-1)?.moduleId).toBe(MAJOR_PERIPHERY_ID)
    expect(character.creation.lifeModules?.pendingAwards).toHaveLength(0)
    expect(character.affiliations.some((entry) => entry.affiliationId === 'affiliation.major-periphery')).toBe(true)
  })
})
