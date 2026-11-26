import { describe, expect, it } from 'vitest'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, buildLifeModuleTransaction, commitLifeModuleTransaction, createLifeModuleCharacter, continueToStage2, validateLifeModuleTransaction } from '../../engine/lifeModuleEngine'
import { CAPELLAN_COMMONALITY_ID } from '../lifeModules/affiliations'
import { decodeCharacter, encodeCharacter } from '../../persistence/characterCodec'
import { validateCharacter } from '../../validation/validateCharacter'
import { evaluateDeferredEligibility, hasBlockingDeferredEligibility, hasIneligibleDeferredEligibility, reevaluateDeferredEligibility, setDeferredEligibility, type DeferredEligibilityRecord } from './deferredEligibility'

const record: DeferredEligibilityRecord = {
  id: 'terran.venusian.birth-year', stage: 0, subjectId: 'stage0.terran.venusian-citizen', requirementId: 'terran.venusian.birth-year-cutoff',
  dependencyKeys: ['birthYear'], rule: { kind: 'numeric-cutoff', field: 'birthYear', maximum: 3059 }, status: 'pending', deferredResolutionAllowed: true,
  requiredInformation: 'Birth Year must be selected from the chronology-derived range', source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 72, ruleId: 'terran-venusian-birth-year-cutoff' },
}

describe('deferred eligibility contract', () => {
  it('distinguishes pending, eligible, and ineligible cutoff results', () => {
    expect(evaluateDeferredEligibility(record, {})).toBe('pending')
    expect(evaluateDeferredEligibility(record, { birthYear: 3059 })).toBe('eligible')
    expect(evaluateDeferredEligibility(record, { birthYear: 3060 })).toBe('ineligible')
  })

  it('persists pending state and blocks final review without blocking provisional validation', () => {
    const character = setDeferredEligibility(createLifeModuleCharacter('Deferred'), record)
    expect(hasBlockingDeferredEligibility(character.creation.lifeModules!)).toBe(true)
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('life-modules.deferred-eligibility.pending.terran.venusian.birth-year')
    const restored = decodeCharacter(encodeCharacter(character))
    expect(restored.creation.lifeModules?.deferredEligibility).toEqual([record])
  })

  it('reevaluates without duplicating awards or records', () => {
    const character = setDeferredEligibility(createLifeModuleCharacter('Deferred'), record)
    const eligible = reevaluateDeferredEligibility(character, record.id, { birthYear: 3059 })
    expect(eligible.creation.lifeModules?.deferredEligibility).toEqual([{ ...record, status: 'eligible' }])
    const ineligible = reevaluateDeferredEligibility(eligible, record.id, { birthYear: 3060 })
    expect(ineligible.creation.lifeModules?.deferredEligibility).toEqual([{ ...record, status: 'ineligible' }])
  })

  it('records pending eligibility through an atomic transaction and permits provisional progression', () => {
    const stage0 = applyCapellanCommonality(applyUniversalStage0(createLifeModuleCharacter('Deferred transaction'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
    const base = applyStage1Module(setDeferredEligibility(stage0, record), 'stage1.blue-collar')
    const transaction = validateLifeModuleTransaction(buildLifeModuleTransaction(base, [{ kind: 'reevaluate-deferred-eligibility', id: record.id, values: {} }]))
    expect(transaction.status).toBe('validated')
    const committed = commitLifeModuleTransaction(transaction)
    expect(committed.creation.lifeModules?.deferredEligibility).toEqual([record])
    committed.creation.lifeModules!.phase = 'alpha-partial-stop'
    committed.creation.lifeModules!.stopState = 'alpha-partial-stop'
    expect(continueToStage2(committed).creation.lifeModules?.currentStage).toBe(2)
    expect(hasIneligibleDeferredEligibility(committed.creation.lifeModules!)).toBe(false)
  })

  it('rejects ineligible deferred reevaluation atomically at the next progression boundary', () => {
    const stage0 = applyCapellanCommonality(applyUniversalStage0(createLifeModuleCharacter('Invalid deferred transaction'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
    const base = applyStage1Module(stage0, 'stage1.blue-collar')
    const transaction = validateLifeModuleTransaction(buildLifeModuleTransaction(base, [
      { kind: 'set-deferred-eligibility', record, values: { birthYear: 3060 } },
    ]))
    expect(transaction.status).toBe('validated')
    const committed = commitLifeModuleTransaction(transaction)
    expect(committed.creation.lifeModules?.deferredEligibility?.[0].status).toBe('ineligible')
    committed.creation.lifeModules!.phase = 'alpha-partial-stop'
    committed.creation.lifeModules!.stopState = 'alpha-partial-stop'
    expect(() => continueToStage2(committed)).toThrow('ineligible deferred condition')
  })
})
