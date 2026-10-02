import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID } from '../../domain/lifeModules/catalog'
import { createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { lifeModulesAffiliationTheme, previewStage0Affiliation } from './stage0PreviewModel'

describe('Stage 0 preview model', () => {
  it('waits for an explicit context before building a preview', () => {
    const character = createLifeModuleCharacter('Preview')
    expect(previewStage0Affiliation(character, '', '', '')).toBeNull()
    expect(character.creation.lifeModules?.stage0AffiliationContext).toBeUndefined()
    expect(character.creation.lifeModules?.affiliationLanguage).toBeUndefined()
  })

  it('previews deterministic package effects when only the Capellan context is selected', () => {
    const character = createLifeModuleCharacter('Partial Preview')
    const committedJson = JSON.stringify(character)
    const preview = previewStage0Affiliation(character, CAPELLAN_COMMONALITY_ID, '', '')
    expect(preview?.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(150)
    expect(preview?.traits).toContainEqual(expect.objectContaining({ displayName: 'Exceptional Attribute/EDG', accumulatedXp: 100 }))
    expect(preview?.skills).toContainEqual(expect.objectContaining({ displayName: 'Protocol/Capellan', accumulatedXp: 10 }))
    expect(preview?.creation.lifeModules?.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining([
      'universal.language.affiliation',
      'capellan.language.secondary',
      'commonality.language.fedsuns',
    ]))
    expect(JSON.stringify(character)).toBe(committedJson)
  })

  it('activates the Capellan theme only for the Capellan context', () => {
    expect(lifeModulesAffiliationTheme(CAPELLAN_COMMONALITY_ID)).toBe('capellan-theme')
    expect(lifeModulesAffiliationTheme('')).toBe('')
    expect(lifeModulesAffiliationTheme('stage0.some-future-context')).toBe('')
  })

  it('activates and previews the source-backed Davion context without leaking the Capellan theme', () => {
    const character = createLifeModuleCharacter('Davion preview')
    const preview = previewStage0Affiliation(character, FEDERATED_SUNS_CRUCIS_MARCH_ID, '', '')
    expect(lifeModulesAffiliationTheme(FEDERATED_SUNS_CRUCIS_MARCH_ID)).toBe('davion-theme')
    expect(lifeModulesAffiliationTheme(CAPELLAN_COMMONALITY_ID)).toBe('capellan-theme')
    expect(preview?.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(150)
    expect(preview?.skills.find((entry) => entry.displayName === 'Protocol/FedSuns')?.accumulatedXp).toBe(25)
    expect(preview?.creation.lifeModules?.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining(['fedsuns.trait.natural-aptitude', 'crucis.skill.art']))
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
