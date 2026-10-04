import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID } from '../domain/lifeModules/catalog'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { validateCharacter } from '../validation/validateCharacter'
import { previewStage0Affiliation } from '../ui/components/stage0PreviewModel'
import {
  applyStage0Affiliation,
  createLifeModuleCharacter,
  previewOrderAffiliation,
} from './lifeModuleEngine'

function capellanOrder(order: 'comstar' | 'word-of-blake') {
  return applyStage0Affiliation(
    createLifeModuleCharacter(order),
    CAPELLAN_COMMONALITY_ID,
    'Mandarin Chinese',
    'Russian',
    undefined,
    undefined,
    order,
    FEDERATED_SUNS_CRUCIS_MARCH_ID,
    'French',
    'Electronic',
  )
}

describe('Alpha Slice 79 ComStar / Word of Blake affiliation layer', () => {
  it('keeps No as a backward-compatible no-overlay path', () => {
    const character = applyStage0Affiliation(
      createLifeModuleCharacter('ordinary'),
      CAPELLAN_COMMONALITY_ID,
      'Mandarin Chinese',
      'Russian',
    )
    expect(character.creation.lifeModules?.orderAffiliation).toBeUndefined()
    expect(character.creation.lifeModules?.moduleXp.spent).toBe(1000)
    expect(character.affiliations.map((entry) => entry.role)).toEqual(['birth', 'final'])
    expect(decodeCharacter(encodeCharacter(character, '2026-10-03T00:00:00.000Z'))).toEqual(character)
  })

  it('layers the exact ComStar package over the full birth affiliation', () => {
    const character = capellanOrder('comstar')
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 1050, remaining: 3950 })
    expect(state).toMatchObject({
      orderAffiliation: 'comstar',
      orderNearestStateContext: FEDERATED_SUNS_CRUCIS_MARCH_ID,
      orderSecondaryLanguage: 'French',
      orderTechnicianSubskill: 'Electronic',
    })
    expect(character.affiliations).toEqual(expect.arrayContaining([
      expect.objectContaining({ affiliationId: 'affiliation.capellan-confederation', role: 'birth' }),
      expect.objectContaining({ affiliationId: 'affiliation.comstar', role: 'order' }),
    ]))
    expect(character.attributes.find((entry) => entry.attributeId === 'INT')?.accumulatedXp).toBe(125)
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(135)
    expect(character.traits).toEqual(expect.arrayContaining([
      expect.objectContaining({ displayName: 'Enemy/Word of Blake', accumulatedXp: -100 }),
      expect.objectContaining({ displayName: 'Connections', accumulatedXp: 50 }),
    ]))
    expect(character.skills).toEqual(expect.arrayContaining([
      expect.objectContaining({ displayName: 'Protocol/ComStar', accumulatedXp: 15 }),
      expect.objectContaining({ displayName: 'Protocol/FedSuns', accumulatedXp: 20 }),
      expect.objectContaining({ displayName: 'Technician/Electronic', accumulatedXp: 10 }),
      expect.objectContaining({ displayName: 'Language/French' }),
    ]))
    expect(character.skills.find((entry) => entry.displayName === 'Language/French')?.sourceAwards).toContainEqual(expect.objectContaining({ xp: 0 }))
    expect(validateCharacter(character).valid).toBe(true)
    expect(decodeCharacter(encodeCharacter(character, '2026-10-03T00:00:00.000Z'))).toEqual(character)
  })

  it('layers the exact Word of Blake branch without retaining ComStar effects', () => {
    const character = capellanOrder('word-of-blake')
    expect(character.creation.lifeModules?.moduleXp.spent).toBe(1050)
    expect(character.affiliations).toContainEqual(expect.objectContaining({ affiliationId: 'affiliation.word-of-blake', role: 'order' }))
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(200)
    expect(character.attributes.find((entry) => entry.attributeId === 'CHA')?.accumulatedXp).toBe(50)
    expect(character.traits).toEqual(expect.arrayContaining([
      expect.objectContaining({ displayName: 'Compulsion/Paranoid', accumulatedXp: -50 }),
      expect.objectContaining({ displayName: 'Enemy/ComStar', accumulatedXp: -100 }),
    ]))
    expect(character.skills).toEqual(expect.arrayContaining([
      expect.objectContaining({ displayName: 'Interest/Writings of the Master', accumulatedXp: 15 }),
      expect.objectContaining({ displayName: 'Protocol/Word of Blake', accumulatedXp: 10 }),
      expect.objectContaining({ displayName: 'Protocol/FedSuns', accumulatedXp: 10 }),
    ]))
    expect(character.skills.some((entry) => entry.displayName === 'Protocol/ComStar')).toBe(false)
    expect(character.traits.some((entry) => entry.displayName === 'Enemy/Word of Blake')).toBe(false)
    expect(validateCharacter(character).valid).toBe(true)
  })

  it('requires every governed order choice and rejects unsupported values', () => {
    const birth = applyStage0Affiliation(createLifeModuleCharacter('choices'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')
    expect(() => previewOrderAffiliation(birth, 'comstar')).not.toThrow()
    expect(() => applyStage0Affiliation(
      createLifeModuleCharacter('missing'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian', undefined, undefined,
      'comstar', undefined, undefined, undefined,
    )).toThrow('nearest state')
    expect(() => applyStage0Affiliation(
      createLifeModuleCharacter('bad language'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian', undefined, undefined,
      'comstar', FEDERATED_SUNS_CRUCIS_MARCH_ID, 'Cantonese', 'Electronic',
    )).toThrow('modeled language')
    expect(() => applyStage0Affiliation(
      createLifeModuleCharacter('bad tech'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian', undefined, undefined,
      'comstar', FEDERATED_SUNS_CRUCIS_MARCH_ID, 'French', 'Imaginary',
    )).toThrow('canonical Technician')
  })

  it('shows known birth and order effects while required choices remain pending', () => {
    const original = createLifeModuleCharacter('partial preview')
    const preview = previewStage0Affiliation(
      original,
      FEDERATED_SUNS_CRUCIS_MARCH_ID,
      'English',
      '',
      '',
      '',
      'comstar',
    )!
    expect(preview.creation.lifeModules?.moduleXp.spent).toBe(1050)
    expect(preview.attributes.find((entry) => entry.attributeId === 'INT')?.accumulatedXp).toBe(125)
    expect(preview.skills).toEqual(expect.arrayContaining([
      expect.objectContaining({ displayName: 'Protocol/FedSuns', accumulatedXp: 25 }),
      expect.objectContaining({ displayName: 'Protocol/ComStar', accumulatedXp: 15 }),
    ]))
    expect(preview.creation.lifeModules?.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining([
      'fedsuns.trait.natural-aptitude',
      'crucis.skill.art',
      'order.nearest-state',
      'order.language.nearest-state',
      'order.skill.technician',
    ]))
    expect(original.creation.lifeModules?.moduleXp.spent).toBe(850)
    expect(original.affiliations).toEqual([])
  })

  it('previews branch switching from the same committed birth state without stale branch effects', () => {
    const birth = applyStage0Affiliation(createLifeModuleCharacter('switch'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')
    const comstar = previewOrderAffiliation(birth, 'comstar', FEDERATED_SUNS_CRUCIS_MARCH_ID, 'French', 'Electronic')
    const wob = previewOrderAffiliation(birth, 'word-of-blake', FEDERATED_SUNS_CRUCIS_MARCH_ID, 'French', 'Electronic')
    expect(birth.creation.lifeModules?.moduleXp.spent).toBe(1000)
    expect(birth.affiliations.some((entry) => entry.role === 'order')).toBe(false)
    expect(comstar.skills.some((entry) => entry.displayName === 'Protocol/Word of Blake')).toBe(false)
    expect(wob.skills.some((entry) => entry.displayName === 'Protocol/ComStar')).toBe(false)
    expect(comstar.creation.lifeModules?.moduleXp.spent).toBe(1050)
    expect(wob.creation.lifeModules?.moduleXp.spent).toBe(1050)
  })
})
