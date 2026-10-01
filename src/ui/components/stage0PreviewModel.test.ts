import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID } from '../../domain/lifeModules/catalog'
import { createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { previewStage0Affiliation } from './stage0PreviewModel'

describe('Stage 0 preview model', () => {
  it('requires every explicit Stage 0 choice before building a preview', () => {
    const character = createLifeModuleCharacter('Preview')
    expect(previewStage0Affiliation(character, '', '', '')).toBeNull()
    expect(character.creation.lifeModules?.stage0AffiliationContext).toBeUndefined()
    expect(character.creation.lifeModules?.affiliationLanguage).toBeUndefined()
  })

  it('previews through the existing engine without mutating the committed character', () => {
    const character = createLifeModuleCharacter('Preview')
    const committedJson = JSON.stringify(character)
    const preview = previewStage0Affiliation(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')
    expect(preview?.creation.lifeModules?.phase).toBe('stage-1-selection')
    expect(preview?.affiliations).toHaveLength(2)
    expect(preview?.skills).toContainEqual(expect.objectContaining({ displayName: 'Language/Mandarin Chinese', accumulatedXp: 20 }))
    expect(preview?.skills).toContainEqual(expect.objectContaining({ displayName: 'Language/Russian', accumulatedXp: 10 }))
    expect(JSON.stringify(character)).toBe(committedJson)
    expect(character.creation.lifeModules?.phase).toBe('stage-0-affiliation')
    expect(character.affiliations).toHaveLength(0)
  })
})
