import { describe, expect, it } from 'vitest'
import { applyStage0Affiliation, createLifeModuleCharacter } from './lifeModuleEngine'
import { FREE_WORLDS_LEAGUE_ID, FWL_ANDURIEN_ID, FWL_MARIK_COMMONWEALTH_ID, FWL_ORIENTE_ID, FWL_OTHER_WORLDS_ID, FWL_REGULUS_ID } from '../domain/lifeModules/affiliations'

const commit = (context: string, secondary = 'Greek', art = 'Painting') => applyStage0Affiliation(
  createLifeModuleCharacter(`FWL ${context}`), context, 'English', secondary, undefined, art, 'no', undefined, undefined, undefined, context,
)

describe('Free Worlds League Stage 0 integration', () => {
  it('commits the parent package with its resolved language and Art/Any choice', () => {
    const character = commit(FREE_WORLDS_LEAGUE_ID)
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.language' && entry.address.parameter?.value === 'Greek')).toBe(true)
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.art' && entry.address.parameter?.value === 'Painting')).toBe(true)
    expect(character.creation.lifeModules?.stage0SubAffiliation).toBe('no')
  })

  it.each([FWL_MARIK_COMMONWEALTH_ID, FWL_REGULUS_ID, FWL_ORIENTE_ID, FWL_ANDURIEN_ID])('commits the %s package with parent awards', (context) => {
    const character = commit(context)
    expect(character.lifeModuleHistory.at(-1)?.moduleId).toBe(context)
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.language' && entry.address.parameter?.value === 'Greek')).toBe(true)
    expect(character.creation.lifeModules?.pendingAwards).toHaveLength(0)
  })

  it('commits Other FWL Worlds only after every source-defined choice is supplied', () => {
    const character = applyStage0Affiliation(
      createLifeModuleCharacter('Other FWL Worlds'), FWL_OTHER_WORLDS_ID, 'English', 'Greek', undefined, 'Painting', 'no', undefined, undefined, undefined, FWL_OTHER_WORLDS_ID,
      undefined, undefined, undefined, undefined,
      { language: 'Urdu', traitId: 'trait.gregarious', skillOne: 'skill.art|Painting', skillTwo: 'skill.protocol|Free Worlds', flexibleTargetType: 'attribute', flexibleTargetId: 'INT', flexibleXp: '25' },
    )
    expect(character.creation.lifeModules?.pendingAwards).toHaveLength(0)
    expect(character.attributes.find((entry) => entry.attributeId === 'INT')?.accumulatedXp).toBe(125)
    expect(character.traits.some((entry) => entry.traitId === 'trait.gregarious')).toBe(true)
  })
})
