import { describe, expect, it } from 'vitest'
import { BLUE_COLLAR_ID, CAPELLAN_COMMONALITY_ID, validateConditionalPackageCatalog } from '../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, buildLifeModuleTransaction, commitLifeModuleTransaction, createLifeModuleCharacter, resolveConditionalPackageDraft, resolveLifeModulePackage, selectConditionalPackageOption, validateLifeModuleTransaction } from './lifeModuleEngine'

function stage1Character() {
  let character = createLifeModuleCharacter('Transaction Test')
  character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
  character = applyCapellanCommonality(character, 'Russian')
  return applyStage1Module(character, BLUE_COLLAR_ID)
}

function operation(character: ReturnType<typeof stage1Character>, awardId: string, targetId: string, displayName: string, parameter: string) {
  const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === awardId)
  if (!pending) throw new Error(`Missing pending award ${awardId}`)
  return { kind: 'resolve-pending-award' as const, pendingAwardId: pending.id, destination: { type: 'skill' as const, targetId, displayName, parameter: { kind: 'subskill', value: parameter } } }
}

describe('Life Module transaction foundation', () => {
  const packageFixture = {
    id: 'package.test-draft', displayName: 'Test package', source: { sourceId: 'test-source', edition: 'Test' },
    choices: [{ id: 'option.alpha', displayName: 'Alpha', awards: [{ id: 'attribute', kind: 'fixed' as const, xp: 50, destination: { type: 'attribute' as const, attributeId: 'STR' } }], nestedChoices: [{ id: 'technician-choice', label: 'Technician', required: true as const, validOptionIds: ['Electronic', 'Mechanical'], awardId: 'attribute', source: { sourceId: 'test-source', edition: 'Test' } }] }],
  }

  it('validates the production package catalog contract and isolates draft selection', () => {
    expect(validateConditionalPackageCatalog()).toEqual([])
    const base = createLifeModuleCharacter('Package Draft')
    const incomplete = selectConditionalPackageOption(base, packageFixture, 'option.alpha')
    expect(incomplete.creation.lifeModules?.conditionalPackageDraft?.status).toBe('incomplete')
    expect(base.creation.lifeModules?.conditionalPackageDraft).toBeUndefined()
    const complete = selectConditionalPackageOption(incomplete, packageFixture, 'option.alpha', { 'technician-choice': 'Electronic' })
    expect(complete.creation.lifeModules?.conditionalPackageDraft?.status).toBe('ready')
    expect(resolveConditionalPackageDraft(complete, packageFixture).operations).toHaveLength(1)
  })

  it('replaces an option and invalidates stale nested selections', () => {
    const secondOption = { ...packageFixture, choices: [...packageFixture.choices, { id: 'option.beta', displayName: 'Beta', awards: packageFixture.choices[0].awards, nestedChoices: [{ ...packageFixture.choices[0].nestedChoices![0], validOptionIds: ['Mechanical'] }] }] }
    const base = createLifeModuleCharacter('Replacement')
    const selected = selectConditionalPackageOption(base, packageFixture, 'option.alpha', { 'technician-choice': 'Electronic' })
    const replaced = selectConditionalPackageOption(selected, secondOption, 'option.beta', { 'technician-choice': 'Electronic' })
    expect(replaced.creation.lifeModules?.conditionalPackageDraft).toMatchObject({ packageId: secondOption.id, choiceId: 'option.beta', status: 'incomplete' })
    expect(replaced.creation.lifeModules?.conditionalPackageDraft?.nestedSelections).toEqual({ 'technician-choice': 'Electronic' })
  })

  it('expands a canonical conditional package option into ordered mixed award operations', () => {
    const resolution = resolveLifeModulePackage({
      id: 'package.test-mixed',
      source: { sourceId: 'test-source', edition: 'Test', page: 1 },
      choices: [{
        id: 'option.alpha', label: 'Alpha', awards: [
          { id: 'attribute', kind: 'fixed', xp: 50, destination: { type: 'attribute', attributeId: 'STR' } },
          { id: 'trait', kind: 'fixed', xp: 20, destination: { type: 'trait', traitId: 'trait.patient', displayName: 'Patient' } },
          { id: 'skill', kind: 'fixed', xp: 30, destination: { type: 'skill', address: { skillId: 'skill.acting' }, displayName: 'Acting' } },
        ],
      }],
    }, 'option.alpha')
    expect(resolution.packageId).toBe('package.test-mixed')
    expect(resolution.optionId).toBe('option.alpha')
    expect(resolution.operations.map((entry) => entry.kind === 'resolve-pending-award' ? entry.pendingAwardId : entry.awardId)).toEqual([
      'package.test-mixed/option.alpha/attribute',
      'package.test-mixed/option.alpha/trait',
      'package.test-mixed/option.alpha/skill',
    ])
    expect(resolution.source.sourceId).toBe('test-source')
  })

  it('rejects a Field grant without a governed school-offer context', () => {
    expect(() => resolveLifeModulePackage({
      id: 'package.test-field', source: { sourceId: 'test-source', edition: 'Test' },
      choices: [{ id: 'option.field', label: 'Field', awards: [{ id: 'field', kind: 'field-grant', description: 'Field', fieldId: 'field.technician-civilian', xpPerSkill: 30, purchaseCostXp: 120 }] }],
    }, 'option.field')).toThrow('governed school offer context')
  })

  it('resolves a canonical Technical College Field offer with governed context', () => {
    const resolution = resolveLifeModulePackage({
      id: 'package.test-governed-field', source: { sourceId: 'test-source', edition: 'Test' },
      choices: [{ id: 'option.field', label: 'Technician', awards: [{ id: 'field', kind: 'field-grant', description: 'Technician Civilian', fieldId: 'field.technician-civilian', xpPerSkill: 30, purchaseCostXp: 120, schoolModuleId: 'stage3.technical-college', offerId: 'stage3.technical-college/field.technician-civilian', chronologyYears: 1, category: 'basic' }] }],
    }, 'option.field')
    expect(resolution.operations[0]).toMatchObject({ kind: 'grant-governed-field', fieldId: 'field.technician-civilian', schoolModuleId: 'stage3.technical-college', offerId: 'stage3.technical-college/field.technician-civilian' })
  })

  it('builds and validates multiple supported award resolutions without mutating the base', () => {
    const base = stage1Character()
    const transaction = buildLifeModuleTransaction(base, [
      operation(base, 'blue-collar.career', 'skill.career', 'Career/Soldier', 'Soldier'),
      operation(base, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History'),
    ], { provenanceContext: 'test-transaction', sourceContext: 'Slice 129-A' })

    expect(transaction.status).toBe('built')
    expect(transaction.errors).toEqual([])
    expect(base.creation.lifeModules!.resolvedAwards).toHaveLength(2)
    validateLifeModuleTransaction(transaction)
    expect(transaction.status).toBe('validated')
    const committed = commitLifeModuleTransaction(transaction)
    expect(committed.creation.lifeModules!.resolvedAwards).toHaveLength(4)
    expect(transaction.status).toBe('committed')
    expect(() => commitLifeModuleTransaction(transaction)).toThrow('validated')
  })

  it('returns structured failure and leaves the original state unchanged', () => {
    const base = stage1Character()
    const before = structuredClone(base)
    const transaction = buildLifeModuleTransaction(base, [
      operation(base, 'blue-collar.career', 'skill.career', 'Career/Soldier', 'Soldier'),
      { ...operation(base, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History'), destination: { type: 'skill' as const, targetId: '', displayName: 'Interest/History', parameter: { kind: 'subskill', value: 'History' } } },
    ])

    expect(transaction.status).toBe('failed')
    expect(transaction.errors[0]?.kind).toBe('invalid-operation')
    expect(transaction.prospectiveState).toBeNull()
    expect(base).toEqual(before)
    expect(() => commitLifeModuleTransaction(transaction)).toThrow('validated')
  })

  it('classifies an unavailable choice separately from an invalid destination', () => {
    const base = stage1Character()
    const transaction = buildLifeModuleTransaction(base, [{
      kind: 'resolve-pending-award',
      pendingAwardId: 'missing-pending-award',
      destination: { type: 'skill', targetId: 'skill.career', displayName: 'Career/Soldier', parameter: { kind: 'subskill', value: 'Soldier' } },
    }])
    expect(transaction.status).toBe('failed')
    expect(transaction.errors[0]?.kind).toBe('unresolved-choice')
  })
})
