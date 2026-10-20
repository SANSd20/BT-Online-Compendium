import { describe, expect, it } from 'vitest'
import { DRACONIS_AZAMI_ID, DRACONIS_BENJAMIN_ID, DRACONIS_COMBINE_ID, DRACONIS_DIERON_ID, DRACONIS_NEW_SAMARKAND_ID, DRACONIS_PESHT_ID } from '../domain/lifeModules/affiliations'
import { applyDraconisCombine, applyUniversalStage0, createLifeModuleCharacter } from './lifeModuleEngine'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { LocalStorageCharacterRepository } from '../persistence/characterRepository'
import { DRACONIS_COMBINE_CATALOG_AWARDS, DRACONIS_SUB_AFFILIATION_CATALOG_AWARDS } from '../domain/lifeModules/catalog'

describe('Draconis Combine Stage 0 transaction', () => {
  const universal = () => applyUniversalStage0(createLifeModuleCharacter('Draconis test', 5000), DRACONIS_COMBINE_ID, 'Japanese')

  it('applies the parent package with explicit Trait and weapon choices', () => {
    const character = applyDraconisCombine(universal(), 'no', 'Combat Sense', 'Archery', 'Japanese')
    expect(character.creation.lifeModules?.stage0SubAffiliation).toBe('no')
    expect(character.lifeModuleHistory.at(-1)?.moduleId).toBe(DRACONIS_COMBINE_ID)
    expect(character.traits.some((entry) => entry.traitId === 'trait.combat-sense' && entry.active)).toBe(true)
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.archery')).toBe(true)
    expect(character.affiliations.filter((entry) => entry.affiliationId === 'affiliation.draconis-combine')).toHaveLength(2)
  })

  it('rejects omitted or invalid required parent choices atomically', () => {
    const before = universal()
    expect(() => applyDraconisCombine(before, 'no')).toThrow(/Choose Pain Resistance/)
    expect(() => applyDraconisCombine(before, 'no', 'Invalid' as 'Pain Resistance', 'Melee Weapons', 'Japanese')).toThrow(/Choose Pain Resistance/)
    expect(() => applyDraconisCombine(before, 'no', 'Pain Resistance', 'Invalid' as 'Melee Weapons', 'Japanese')).toThrow(/supported Draconis flexible Skill/)
    expect(before.creation.lifeModules?.selectedModuleIds).toEqual(['stage0.universal-fixed-xp'])
    expect(before.lifeModuleHistory).toHaveLength(1)
  })

  it('requires concrete open subjects for Azami and Dieron', () => {
    expect(() => applyDraconisCombine(universal(), DRACONIS_AZAMI_ID, 'Pain Resistance', 'Melee Weapons', 'Japanese')).toThrow(/Survival subject/)
    expect(() => applyDraconisCombine(universal(), DRACONIS_DIERON_ID, 'Pain Resistance', 'Melee Weapons', 'Japanese', { language: 'English' })).toThrow(/Art subject/)
    expect(() => applyDraconisCombine(universal(), DRACONIS_AZAMI_ID, 'Pain Resistance', 'Melee Weapons', 'Japanese', { survival: 'Desert' })).not.toThrow()
    expect(() => applyDraconisCombine(universal(), DRACONIS_DIERON_ID, 'Pain Resistance', 'Melee Weapons', 'Japanese', { language: 'English', art: 'Painting' })).not.toThrow()
  })

  it('uses the shared open-subject validation for Azami Survival', () => {
    for (const survival of ['', 'x'.repeat(61), 'Desert/Forest', 'Desert\u0000']) {
      expect(() => applyDraconisCombine(universal(), DRACONIS_AZAMI_ID, 'Pain Resistance', 'Melee Weapons', 'Japanese', { survival })).toThrow()
    }
    const normalized = applyDraconisCombine(universal(), DRACONIS_AZAMI_ID, 'Pain Resistance', 'Melee Weapons', 'Japanese', { survival: '  Desert   ' })
    expect(normalized.skills).toContainEqual(expect.objectContaining({ displayName: 'Survival/Desert', address: expect.objectContaining({ parameter: { kind: 'subskill', value: 'Desert' } }) }))
  })

  it('preserves the selected sub-affiliation, XP, choices, and provenance through JSON round-trip', () => {
    const character = applyDraconisCombine(universal(), DRACONIS_AZAMI_ID, 'Combat Sense', 'Archery', 'Japanese', { survival: 'Desert' })
    const restored = decodeCharacter(encodeCharacter(character, '3071-01-02T00:00:00.000Z'))
    expect(restored.creation.lifeModules?.stage0SubAffiliation).toBe(DRACONIS_AZAMI_ID)
    expect(restored.creation.lifeModules?.moduleXp).toEqual(character.creation.lifeModules?.moduleXp)
    expect(restored.provenance.some((entry) => entry.source?.ruleId === 'draconis-combine-azami')).toBe(true)
    expect(restored.traits.some((entry) => entry.traitId === 'trait.combat-sense')).toBe(true)
    expect(restored.skills.some((entry) => entry.address.skillId === 'skill.survival' && entry.address.parameter?.value === 'Desert')).toBe(true)
  })

  it('executes all five source-defined sub-affiliation packages and local save/load', () => {
    const cases: Array<[string, Record<string, string>]> = [[DRACONIS_AZAMI_ID, { survival: 'Desert' }], [DRACONIS_BENJAMIN_ID, {}], [DRACONIS_DIERON_ID, { language: 'English', art: 'Painting' }], [DRACONIS_NEW_SAMARKAND_ID, {}], [DRACONIS_PESHT_ID, {}]]
    for (const [subAffiliation, choices] of cases) {
      const character = applyDraconisCombine(universal(), subAffiliation as Parameters<typeof applyDraconisCombine>[1], 'Pain Resistance', 'Melee Weapons', 'Japanese', choices)
      expect(character.creation.lifeModules?.stage0SubAffiliation).toBe(subAffiliation)
      expect(character.lifeModuleHistory.at(-1)?.costXp).toBe(150)
      expect(character.provenance.some((entry) => entry.source?.ruleId === subAffiliation.replace('stage0.draconis-combine.', 'draconis-combine-'))).toBe(true)
      const store = new Map<string, string>()
      const storage = { get length() { return store.size }, key: (index: number) => [...store.keys()][index] ?? null, getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => { store.set(key, value) }, removeItem: (key: string) => { store.delete(key) } }
      const repository = new LocalStorageCharacterRepository(storage)
      repository.save(character)
      expect(repository.get(character.id)?.creation.lifeModules?.stage0SubAffiliation).toBe(subAffiliation)
    }
  })

  it('A: exposes one catalog award source for the parent package', () => {
    expect(DRACONIS_COMBINE_CATALOG_AWARDS.map((award) => award.id)).toEqual([
      'draconis.attribute.wil', 'draconis.trait.xenophobia', 'draconis.trait.wealth',
      'draconis.skill.oral-tradition', 'draconis.skill.martial-arts', 'draconis.skill.protocol',
      'draconis.trait.choice', 'draconis.skill.weapon-choice',
    ])
  })

  it('B: exposes exactly the five source-defined sub-affiliation bundles', () => {
    expect(Object.keys(DRACONIS_SUB_AFFILIATION_CATALOG_AWARDS).sort()).toEqual([
      DRACONIS_AZAMI_ID, DRACONIS_BENJAMIN_ID, DRACONIS_DIERON_ID, DRACONIS_NEW_SAMARKAND_ID, DRACONIS_PESHT_ID,
    ].sort())
  })

  it('C: derives the selected Trait from the catalog choice award', () => {
    const character = applyDraconisCombine(universal(), 'no', 'Pain Resistance', 'Melee Weapons', 'Japanese')
    expect(character.traits.some((entry) => entry.traitId === 'trait.pain-resistance' && entry.active)).toBe(true)
    expect(character.traits.some((entry) => entry.traitId === 'trait.combat-sense' && entry.active)).toBe(false)
  })

  it('D: derives each supported weapon choice from the catalog weapon award', () => {
    for (const [choice, skillId] of [['Archery', 'skill.archery'], ['Melee Weapons', 'skill.melee-weapons'], ['Thrown Weapons/Blade', 'skill.thrown-weapons']] as const) {
      const character = applyDraconisCombine(universal(), 'no', 'Pain Resistance', choice, 'Japanese')
      expect(character.skills.some((entry) => entry.address.skillId === skillId)).toBe(true)
    }
  })

  it('E: resolves Azami’s catalog open Skill award without retaining a placeholder', () => {
    const character = applyDraconisCombine(universal(), DRACONIS_AZAMI_ID, 'Pain Resistance', 'Melee Weapons', 'Japanese', { survival: 'Desert' })
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.survival' && entry.address.parameter?.value === 'Desert')).toBe(true)
  })

  it('F: resolves Dieron’s catalog language and Art awards without placeholders', () => {
    const character = applyDraconisCombine(universal(), DRACONIS_DIERON_ID, 'Pain Resistance', 'Melee Weapons', 'Japanese', { language: 'English', art: 'Painting' })
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.language' && entry.address.parameter?.value === 'English')).toBe(true)
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.art' && entry.address.parameter?.value === 'Painting')).toBe(true)
  })

  it('G: keeps catalog and transaction fixed-award XP aligned', () => {
    const catalogXp = [...DRACONIS_COMBINE_CATALOG_AWARDS, ...(DRACONIS_SUB_AFFILIATION_CATALOG_AWARDS[DRACONIS_PESHT_ID] ?? [])]
      .filter((award) => award.kind === 'fixed' || award.kind === 'any-skill-choice' || award.kind === 'language-choice')
      .reduce((sum, award) => sum + award.xp, 0)
    expect(catalogXp).toBe(50)
    const character = applyDraconisCombine(universal(), DRACONIS_PESHT_ID, 'Combat Sense', 'Archery', 'Japanese')
    expect(character.creation.lifeModules?.moduleXp.spent).toBe(850 + 150)
  })
})
