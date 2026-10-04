import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID } from '../domain/lifeModules/catalog'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { previewStage0Affiliation } from '../ui/components/stage0PreviewModel'
import { applyStage0Affiliation, createLifeModuleCharacter } from './lifeModuleEngine'

describe('Alpha Slice 80 optional Stage 0 sub-affiliation', () => {
  it('keeps the full Federated Suns cost and main awards when Affiliation Sub is No', () => {
    const character = applyStage0Affiliation(
      createLifeModuleCharacter('No sub'),
      FEDERATED_SUNS_CRUCIS_MARCH_ID,
      'English',
      undefined,
      'Protocol',
      undefined,
      'no',
      undefined,
      undefined,
      undefined,
      'no',
    )
    expect(character.creation.lifeModules).toMatchObject({
      stage0SubAffiliation: 'no',
      moduleXp: { starting: 5000, spent: 1000, remaining: 4000 },
    })
    expect(character.traits).toContainEqual(expect.objectContaining({ displayName: 'Natural Aptitude/Protocol', accumulatedXp: 100 }))
    expect(character.skills).toContainEqual(expect.objectContaining({ displayName: 'Protocol/FedSuns', accumulatedXp: 10 }))
    expect(character.skills.some((entry) => entry.displayName === 'Art/Painting')).toBe(false)
    expect(character.skills.some((entry) => entry.displayName === 'Interest/FedSuns History')).toBe(false)
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(100)
    expect(character.attributes.find((entry) => entry.attributeId === 'EDG')?.accumulatedXp).toBe(100)
  })

  it('keeps Capellan main choices but removes Commonality awards when Sub is No', () => {
    const character = applyStage0Affiliation(
      createLifeModuleCharacter('Capellan no sub'),
      CAPELLAN_COMMONALITY_ID,
      'Mandarin Chinese',
      'Russian',
      undefined,
      undefined,
      'no',
      undefined,
      undefined,
      undefined,
      'no',
    )
    expect(character.creation.lifeModules?.moduleXp.spent).toBe(1000)
    expect(character.creation.lifeModules?.stage0SubAffiliation).toBe('no')
    expect(character.skills).toEqual(expect.arrayContaining([
      expect.objectContaining({ displayName: 'Language/Russian', accumulatedXp: 10 }),
      expect.objectContaining({ displayName: 'Protocol/Capellan', accumulatedXp: 10 }),
    ]))
    expect(character.traits.some((entry) => entry.displayName === 'Wealth')).toBe(false)
    expect(character.skills.some((entry) => entry.displayName === 'Protocol/FedSuns')).toBe(false)
    expect(character.creation.lifeModules?.pendingAwards.some((entry) => entry.awardId.startsWith('commonality.'))).toBe(false)
    expect(decodeCharacter(encodeCharacter(character, '2026-10-04T00:00:00.000Z'))).toEqual(character)
  })

  it('supports No-sub with either order overlay and keeps previews transactional', () => {
    const committed = createLifeModuleCharacter('Orders')
    const comstar = previewStage0Affiliation(committed, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English', '', 'Strategy', '', 'comstar', CAPELLAN_COMMONALITY_ID, 'Russian', 'Electronic', 'no')!
    const wob = previewStage0Affiliation(committed, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English', '', 'Strategy', '', 'word-of-blake', CAPELLAN_COMMONALITY_ID, 'Russian', 'Electronic', 'no')!
    expect(comstar.creation.lifeModules).toMatchObject({ stage0SubAffiliation: 'no', orderAffiliation: 'comstar', moduleXp: { spent: 1050 } })
    expect(wob.creation.lifeModules).toMatchObject({ stage0SubAffiliation: 'no', orderAffiliation: 'word-of-blake', moduleXp: { spent: 1050 } })
    expect(comstar.skills.some((entry) => entry.displayName === 'Art/Painting')).toBe(false)
    expect(wob.skills.some((entry) => entry.displayName === 'Art/Painting')).toBe(false)
    expect(committed.creation.lifeModules?.moduleXp.spent).toBe(850)
    expect(committed.creation.lifeModules?.stage0SubAffiliation).toBeUndefined()
  })

  it('preserves pre-Slice-80 combined-context saves as selected sub-affiliations', () => {
    const legacy = applyStage0Affiliation(createLifeModuleCharacter('Legacy'), FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English', undefined, 'Strategy', 'Painting')
    delete legacy.creation.lifeModules!.stage0SubAffiliation
    const restored = decodeCharacter(encodeCharacter(legacy, '2026-10-04T00:00:00.000Z'))
    expect(restored.creation.lifeModules?.stage0SubAffiliation).toBeUndefined()
    expect(restored.skills).toContainEqual(expect.objectContaining({ displayName: 'Art/Painting', accumulatedXp: 10 }))
  })
})
