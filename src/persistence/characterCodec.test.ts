import { describe, expect, it } from 'vitest'
import { APP_PUBLIC_TITLE, APP_VERSION } from '../appMetadata'
import { createCharacterDraft } from '../engine/characterFactory'
import { createCharacterFromArchetype } from '../engine/archetypeFactory'
import { BLUE_COLLAR_ID, CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID } from '../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyFederatedSunsCrucisMarch, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter } from '../engine/lifeModuleEngine'
import { validateCharacter } from '../validation/validateCharacter'
import { decodeCharacter, encodeCharacter } from './characterCodec'

function character() {
  let id = 0
  return createCharacterDraft('life-modules', 'Test Pilot', {
    now: () => '3025-01-01T00:00:00.000Z',
    id: () => `id-${++id}`,
  })
}

describe('character codec', () => {
  it('round-trips a versioned character envelope', () => {
    const source = character()
    const encoded = encodeCharacter(source, '3025-01-02T00:00:00.000Z')
    expect(JSON.parse(encoded).application).toEqual({ name: APP_PUBLIC_TITLE, version: APP_VERSION })
    const restored = decodeCharacter(encoded)
    expect(restored).toEqual(source)
  })

  it('preserves the distinction between untrained and level zero', () => {
    const source = character()
    source.skills = [
      { address: { skillId: 'skill.climbing' }, accumulatedXp: 0, level: null, sourceAwards: [] },
      { address: { skillId: 'skill.swimming' }, accumulatedXp: 20, level: 0, sourceAwards: [] },
    ]
    const restored = decodeCharacter(encodeCharacter(source))
    expect(restored.skills.map((skill) => skill.level)).toEqual([null, 0])
  })

  it('round-trips a committed Federated Suns / Crucis March Stage 0 character without losing Art/Painting metadata', () => {
    const source = applyFederatedSunsCrucisMarch(
      applyUniversalStage0(createLifeModuleCharacter('Crucis Round Trip'), FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English'),
      'Protocol',
      'Painting',
    )
    const before = {
      affiliationContext: source.creation.lifeModules?.stage0AffiliationContext,
      affiliationLanguage: source.creation.lifeModules?.affiliationLanguage,
      affiliations: source.affiliations,
      art: source.skills.find((entry) => entry.displayName === 'Art/Painting'),
      naturalAptitude: source.traits.find((entry) => entry.displayName === 'Natural Aptitude/Protocol'),
      choiceRequirements: source.creation.lifeModules?.choiceGrantRequirements,
      resolvedAwards: source.creation.lifeModules?.resolvedAwards,
      pendingAwards: source.creation.lifeModules?.pendingAwards,
      xp: source.xp,
    }
    expect(validateCharacter(source).valid).toBe(true)

    const restored = decodeCharacter(encodeCharacter(source, '3025-01-02T00:00:00.000Z'))

    expect(validateCharacter(restored).valid).toBe(true)
    expect({
      affiliationContext: restored.creation.lifeModules?.stage0AffiliationContext,
      affiliationLanguage: restored.creation.lifeModules?.affiliationLanguage,
      affiliations: restored.affiliations,
      art: restored.skills.find((entry) => entry.displayName === 'Art/Painting'),
      naturalAptitude: restored.traits.find((entry) => entry.displayName === 'Natural Aptitude/Protocol'),
      choiceRequirements: restored.creation.lifeModules?.choiceGrantRequirements,
      resolvedAwards: restored.creation.lifeModules?.resolvedAwards,
      pendingAwards: restored.creation.lifeModules?.pendingAwards,
      xp: restored.xp,
    }).toEqual(before)
    expect(restored.creation.lifeModules?.pendingAwards).toEqual([])
    expect(restored.creation.lifeModules?.resolvedAwards).toContainEqual(expect.objectContaining({
      awardId: 'crucis.skill.art',
      kind: 'any-skill-choice',
      destination: expect.objectContaining({ displayName: 'Art/Painting' }),
    }))
  })

  it('preserves committed Capellan/Commonality awards and intentional pending FedSuns language through round trip', () => {
    const source = applyCapellanCommonality(
      applyUniversalStage0(createLifeModuleCharacter('Capellan Round Trip'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'),
      'Russian',
    )
    const restored = decodeCharacter(encodeCharacter(source, '3025-01-02T00:00:00.000Z'))

    expect(validateCharacter(restored).valid).toBe(true)
    expect(restored.affiliations).toEqual(source.affiliations)
    expect(restored.skills).toEqual(source.skills)
    expect(restored.traits).toEqual(source.traits)
    expect(restored.xp).toEqual(source.xp)
    expect(restored.creation.lifeModules?.pendingAwards).toEqual(source.creation.lifeModules?.pendingAwards)
    expect(restored.creation.lifeModules?.pendingAwards).toContainEqual(expect.objectContaining({ awardId: 'commonality.language.fedsuns', xpPerGrant: 5 }))
    expect(restored.skills).toContainEqual(expect.objectContaining({ displayName: 'Protocol/FedSuns', accumulatedXp: 5 }))
    expect(restored.creation.resolvedChoiceIds).not.toContain(expect.stringContaining('commonality.language.fedsuns'))
  })

  it('rejects an unrelated JSON document', () => {
    expect(() => decodeCharacter('{"hello":"world"}')).toThrow('Unsupported character file format')
  })

  it('rejects a missing creation method', () => {
    const envelope = JSON.parse(encodeCharacter(character()))
    delete envelope.character.creation.method
    expect(() => decodeCharacter(JSON.stringify(envelope))).toThrow('Character creation method is invalid')
  })

  it('migrates Alpha Slice 4 pending-award saves without losing unresolved grants', () => {
    let source = createLifeModuleCharacter('Older Alpha Draft')
    source = applyUniversalStage0(source, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
    source = applyCapellanCommonality(source, 'Russian')
    source = applyStage1Module(source, BLUE_COLLAR_ID)
    const envelope = JSON.parse(encodeCharacter(source))
    delete envelope.character.creation.lifeModules.resolvedAwards
    delete envelope.character.creation.lifeModules.choiceGrantRequirements
    delete envelope.character.creation.lifeModules.stopState
    delete envelope.character.creation.lifeModules.awardResolutionVersion
    delete envelope.character.creation.lifeModules.selectedSkillFields
    envelope.character.creation.lifeModules.pendingAwards.forEach((entry: Record<string, unknown>) => {
      delete entry.choiceSource
      delete entry.requiredSkillId
    })
    const restored = decodeCharacter(JSON.stringify(envelope))
    expect(restored.creation.lifeModules?.resolvedAwards).toEqual([])
    expect(restored.creation.lifeModules?.awardResolutionVersion).toBe(0)
    expect(restored.creation.lifeModules?.stopState).toBe('not-eligible')
    expect(restored.creation.lifeModules?.pendingAwards.find((entry) => entry.awardId === 'blue-collar.career')?.requiredSkillId).toBe('skill.career')
    expect(restored.creation.lifeModules?.choiceGrantRequirements).toHaveLength(4)
    expect(restored.creation.lifeModules?.selectedSkillFields).toEqual([])
  })

  it('migrates an older Stage 0 save to the only compatible explicit affiliation context', () => {
    let source = createLifeModuleCharacter('Older Stage 0 Draft')
    source = applyUniversalStage0(source, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
    const envelope = JSON.parse(encodeCharacter(source))
    delete envelope.character.creation.lifeModules.stage0AffiliationContext
    const restored = decodeCharacter(JSON.stringify(envelope))
    expect(restored.creation.lifeModules?.stage0AffiliationContext).toBe(CAPELLAN_COMMONALITY_ID)
    expect(restored.creation.lifeModules?.affiliationLanguage).toBe('Mandarin Chinese')
    expect(validateCharacter(restored).valid).toBe(true)
  })

  it('migrates final-validation-only prerequisite review to a continuable Alpha stop', () => {
    let source = createLifeModuleCharacter('Older prerequisite review')
    source = applyUniversalStage0(source, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
    source = applyCapellanCommonality(source, 'Russian')
    source = applyStage1Module(source, BLUE_COLLAR_ID)
    const envelope = JSON.parse(encodeCharacter(source))
    envelope.character.creation.lifeModules.pendingAwards = []
    envelope.character.creation.lifeModules.choiceGrantRequirements = []
    envelope.character.creation.lifeModules.resolvedAwards = []
    envelope.character.creation.lifeModules.awardResolutionVersion = 0
    envelope.character.creation.lifeModules.phase = 'stage-1-prerequisite-review'
    envelope.character.creation.lifeModules.stopState = 'not-eligible'
    const restored = decodeCharacter(JSON.stringify(envelope))
    expect(restored.creation.lifeModules?.phase).toBe('alpha-partial-stop')
    expect(restored.creation.lifeModules?.stopState).toBe('alpha-partial-stop')
  })

  it('migrates older Alpha Archetype saves into a source-backed foundation without changing allocations', () => {
    const source = createCharacterFromArchetype('archetype.core.tanker', 'Legacy Tanker')
    const originalAllocation = source.xp.creation.allocated
    const envelope = JSON.parse(encodeCharacter(source))
    const legacy = envelope.character.creation.archetype
    delete legacy.version
    delete legacy.kind
    delete legacy.foundationProvenanceId
    delete legacy.accounting
    delete legacy.adjustmentLedger
    delete legacy.customizationStatus

    const restored = decodeCharacter(JSON.stringify(envelope))
    expect(restored.creation.archetype).toMatchObject({
      version: 2,
      kind: 'source-backed-preset',
      archetypeId: 'archetype.core.tanker',
      displayName: 'Tanker',
      customizationStatus: 'original-package',
      adjustmentLedger: [],
      accounting: {
        model: 'shared-point-buy',
        evaluatedAllocation: { totalXp: originalAllocation },
      },
    })
    expect(restored.xp.creation.allocated).toBe(originalAllocation)
    expect(restored.provenance.find((entry) => entry.id === restored.creation.archetype?.foundationProvenanceId)).toMatchObject({
      kind: 'published',
      source: restored.creation.archetype?.source,
    })
  })

  it('migrates a Slice 22 Archetype foundation to an empty Slice 23 adjustment ledger', () => {
    const source = createCharacterFromArchetype('archetype.core.mechwarrior', 'Slice 22 Save')
    const envelope = JSON.parse(encodeCharacter(source))
    envelope.character.creation.archetype.version = 1
    envelope.character.creation.archetype.adjustmentLedger = []
    envelope.character.creation.archetype.customizationStatus = 'original-package'

    const restored = decodeCharacter(JSON.stringify(envelope))
    expect(restored.creation.archetype).toMatchObject({
      version: 2,
      customizationStatus: 'original-package',
      adjustmentLedger: [],
    })
    expect(restored.creation.archetype?.accounting.evaluatedAllocation.totalXp).toBe(source.xp.creation.allocated)
  })
})
