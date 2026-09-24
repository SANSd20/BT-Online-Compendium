import { describe, expect, it } from 'vitest'
import { CORE_ARCHETYPES, calculateArchetypeXp } from '../domain/archetypes/coreArchetypes'
import { XP_COST_TABLE_SOURCE } from '../domain/pointBuy/catalog'
import { evaluateSharedXpAccounting } from '../domain/pointBuy/calculations'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { validateCharacter } from '../validation/validateCharacter'
import { createCharacterFromArchetype } from './archetypeFactory'

const golden = [
  ['archetype.core.mechwarrior', '4/5/5/6/4/4/4/3', 4, 20, 10, 552],
  ['archetype.core.tanker', '5/4/3/3/4/5/3/4', 5, 23, 8, 727],
  ['archetype.core.aerospace-pilot', '2/3/5/5/4/4/5/4', 5, 25, 13, 482],
  ['archetype.core.elemental', '9/7/3/5/3/4/2/3', 7, 15, 3, 735],
  ['archetype.core.scout', '3/4/3/4/4/5/4/3', 5, 29, 17, 85],
  ['archetype.core.faceman', '3/3/3/4/6/3/6/3', 4, 16, 10, 402],
  ['archetype.core.renegade-warrior', '5/5/4/5/4/6/3/4', 3, 17, 11, 4074],
  ['archetype.core.battlefield-tech', '5/4/3/3/5/4/3/5', 3, 15, 13, 7898],
] as const

function dependencies() {
  let id = 0
  return {
    now: () => '3071-01-01T00:00:00.000Z',
    id: () => `id-${++id}`,
  }
}

describe('createCharacterFromArchetype', () => {
  it.each(golden)('creates the golden %s package', (archetypeId, attributeSignature, traitCount, skillCount, equipmentCount, cBills) => {
    const character = createCharacterFromArchetype(archetypeId, 'Golden Character', dependencies())
    const effectiveAttributes = character.attributes
      .map((entry) => (entry.purchasedLevel ?? 0) + entry.phenotypeModifier)
      .join('/')

    expect(effectiveAttributes).toBe(attributeSignature)
    expect(character.traits).toHaveLength(traitCount)
    expect(character.skills).toHaveLength(skillCount)
    expect(character.inventory).toHaveLength(equipmentCount)
    expect(character.cBills).toBe(cBills)
    expect(character.creation.method).toBe('archetype')
    expect(character.creation.archetype?.archetypeId).toBe(archetypeId)
    expect(character.creation.archetype).toMatchObject({
      version: 1,
      kind: 'source-backed-preset',
      customizationStatus: 'original-package',
      adjustmentLedger: [],
      accounting: {
        model: 'shared-point-buy',
        costTableSource: XP_COST_TABLE_SOURCE,
        publishedXpTotal: 4500,
      },
    })
    expect(character.creation.archetype?.accounting.evaluatedAllocation).toEqual(evaluateSharedXpAccounting(character))
    expect(character.provenance.find((entry) => entry.id === character.creation.archetype?.foundationProvenanceId)).toMatchObject({
      kind: 'published',
      source: character.creation.archetype?.source,
    })
    expect(character.xp.creation).toEqual({
      starting: 4500,
      allocated: [
        ...character.attributes.map((entry) => entry.accumulatedXp),
        ...character.traits.map((entry) => entry.accumulatedXp),
        ...character.skills.map((entry) => entry.accumulatedXp),
      ].reduce((total, xp) => total + xp, 0),
      remaining: 0,
    })
    expect(validateCharacter(character).valid).toBe(true)
  })

  it.each(CORE_ARCHETYPES)('keeps the current $displayName package totals unchanged', (archetype) => {
    const character = createCharacterFromArchetype(archetype.id, 'Accounting Audit', dependencies())
    const evaluation = evaluateSharedXpAccounting(character)
    expect(evaluation.totalXp).toBe(calculateArchetypeXp(archetype))
    expect(character.creation.archetype?.accounting.differenceFromPublishedXp).toBe(
      calculateArchetypeXp(archetype) - archetype.publishedXpTotal,
    )
  })

  it.each(CORE_ARCHETYPES)('round-trips $displayName through the portable JSON format', (archetype) => {
    const character = createCharacterFromArchetype(archetype.id, `${archetype.displayName} Test`, dependencies())
    const restored = decodeCharacter(encodeCharacter(character, '3071-01-02T00:00:00.000Z'))
    expect(restored).toEqual(character)
    expect(restored.provenance.some((entry) => entry.source?.page === archetype.source.page)).toBe(true)
    expect(restored.attributes.every((entry) => entry.sourceAwards.length > 0)).toBe(true)
  })

  it('preserves specialties, phenotype modifiers, source anomalies, and assigned labels', () => {
    const faceman = createCharacterFromArchetype('archetype.core.faceman', 'Face', dependencies())
    const elemental = createCharacterFromArchetype('archetype.core.elemental', 'Elemental', dependencies())
    const tanker = createCharacterFromArchetype('archetype.core.tanker', 'Tanker', dependencies())
    const scout = createCharacterFromArchetype('archetype.core.scout', 'Scout', dependencies())

    expect(faceman.skills.find((entry) => entry.address.skillId === 'skill.acting')?.specialty).toBe('Deception')
    expect(elemental.phenotypeId).toBe('phenotype.elemental')
    expect(elemental.attributes.find((entry) => entry.attributeId === 'STR')?.phenotypeModifier).toBe(2)
    expect(tanker.creation.archetype?.notes[0]?.code).toBe('published-attribute-score-xp-mismatch')
    expect(scout.inventory.find((entry) => entry.catalogItemId === 'equipment.noteputer')).toMatchObject({
      ownership: 'Issued',
      publishedOwnershipLabel: 'Assigned',
      carried: null,
    })
  })

  it('rejects a stale Archetype foundation accounting snapshot', () => {
    const character = createCharacterFromArchetype('archetype.core.mechwarrior', 'Stale', dependencies())
    character.attributes[0].accumulatedXp += 100
    const validation = validateCharacter(character)
    expect(validation.valid).toBe(false)
    expect(validation.issues.some((entry) => entry.id === 'archetype.foundation.accounting-mismatch')).toBe(true)
  })
})
