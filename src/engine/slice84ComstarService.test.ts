import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, COMSTAR_WOB_SERVICE_ID, getLifeModule } from '../domain/lifeModules/catalog'
import { pendingAwardOptions } from '../domain/lifeModules/awardOptions'
import { encodeCharacter } from '../persistence/characterCodec'
import { applyStage0Affiliation, applyStage4Module, continueStage4Modules, createLifeModuleCharacter, resolvePendingLifeModuleAward } from './lifeModuleEngine'

function serviceDraft(order: 'comstar' | 'word-of-blake') {
  const character = applyStage0Affiliation(createLifeModuleCharacter(order), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian', undefined, undefined, order, CAPELLAN_COMMONALITY_ID, 'Russian', 'Electronic', 'no')
  const state = character.creation.lifeModules!
  state.phase = 'stage-4-selection'
  state.currentStage = 4
  state.pendingAwards = []
  state.choiceGrantRequirements = []
  state.resolvedAwards = []
  character.lifeModuleHistory.push({ moduleId: 'test.stage1', displayName: 'Test Stage 1', stage: 1, costXp: 0, selectedAt: character.updatedAt, provenanceIds: [], source: { sourceId: 'test', edition: 'test' }, notes: [] })
  return character
}

function resolveService(character: ReturnType<typeof serviceDraft>) {
  let next = character
  while (next.creation.lifeModules!.pendingAwards.length > 0) {
    const pending = next.creation.lifeModules!.pendingAwards[0]
    if (pending.allocationMode === 'pool') {
      next = resolvePendingLifeModuleAward(next, pending.id, { type: 'skill', targetId: 'skill.perception', displayName: 'Perception' }, pending.remainingXp)
      continue
    }
    const options = pendingAwardOptions(pending, next)
    const used = new Set(next.creation.lifeModules!.resolvedAwards.filter((entry) => entry.provenanceId === pending.provenanceId && entry.awardId === pending.awardId).map((entry) => `${entry.destination.targetId}/${entry.destination.parameter?.value ?? ''}`))
    const option = options.find((entry) => !used.has(entry.value) && entry.inputMode !== 'open-subject')!
    next = resolvePendingLifeModuleAward(next, pending.id, option)
  }
  return next
}

describe('Alpha Slice 84 ComStar/Word of Blake Service', () => {
  it('models the exact shared package, branch awards, choices, cost, time, and repeat policy', () => {
    expect(getLifeModule(COMSTAR_WOB_SERVICE_ID)).toMatchObject({
      costXp: 900,
      chronologyYears: 5,
      repeatPolicy: { sameModuleRepeat: 'allowed', repeatCost: 'full-module-cost' },
      awards: expect.arrayContaining([
        expect.objectContaining({ id: 'service.shared.attribute.dex', xp: 50 }),
        expect.objectContaining({ id: 'service.shared.skill.communications-hpg', xp: 55 }),
        expect.objectContaining({ id: 'service.shared.trait.choice', xpPerGrant: 100, allowedTargetIds: ['trait.equipped', 'trait.vehicle', 'trait.wealth'] }),
        expect.objectContaining({ id: 'service.branch.skills.any-four', xp: 40, count: 4, distinct: true }),
        expect.objectContaining({ id: 'service.flexible', totalXp: 50 }),
      ]),
    })
  })

  it.each(['comstar', 'word-of-blake'] as const)('uses the committed %s branch without leakage and round-trips', (order) => {
    const selected = applyStage4Module(serviceDraft(order), COMSTAR_WOB_SERVICE_ID)
    const ids = selected.creation.lifeModules!.pendingAwards.map((entry) => entry.awardId)
    expect(ids).toEqual(expect.arrayContaining(['service.shared.trait.choice', 'service.shared.skill.communications-any', 'service.shared.skill.language-any', 'service.shared.skill.protocol-any', 'service.branch.skills.any-four', 'service.flexible']))
    expect(selected.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: COMSTAR_WOB_SERVICE_ID, costXp: 900, chronologyYears: 5 })
    expect(selected.attributes.find((entry) => entry.attributeId === (order === 'comstar' ? 'WIL' : 'CHA'))?.sourceAwards.some((award) => award.provenanceId === selected.lifeModuleHistory.at(-1)?.provenanceIds[0])).toBe(true)
    expect(selected.traits.some((entry) => entry.displayName?.includes(order === 'comstar' ? 'Hatred of Word of Blake' : 'Hatred of ComStar'))).toBe(true)
    expect(selected.traits.some((entry) => entry.displayName?.includes(order === 'comstar' ? 'Hatred of ComStar' : 'Hatred of Word of Blake'))).toBe(false)
    const completed = resolveService(selected)
    expect(completed.creation.lifeModules!.phase).toBe('alpha-stage-4-stop')
    const encoded = encodeCharacter(completed)
    expect(encoded).toContain(COMSTAR_WOB_SERVICE_ID)
    expect(encoded).toContain('service.branch.skills.any-four')
  })

  it('rejects No Order, reports prohibited Trait levels, and repeats only Skills/Flexible XP at full cost and time', () => {
    const noOrder = serviceDraft('comstar')
    noOrder.creation.lifeModules!.orderAffiliation = undefined
    noOrder.affiliations = noOrder.affiliations.filter((entry) => entry.role !== 'order')
    expect(() => applyStage4Module(noOrder, COMSTAR_WOB_SERVICE_ID)).toThrow('committed ComStar or Word of Blake')

    const prohibited = serviceDraft('comstar')
    prohibited.traits.push({ traitId: 'trait.tds', displayName: 'TDS', accumulatedXp: -200, attainedTp: -2, active: true, parameters: {}, sourceAwards: [] })
    const selected = applyStage4Module(prohibited, COMSTAR_WOB_SERVICE_ID)
    expect(selected.creation.lifeModules!.prerequisiteIssues).toContainEqual(expect.objectContaining({ prerequisiteId: 'service.trait.tds', status: 'outstanding' }))

    const first = resolveService(applyStage4Module(serviceDraft('comstar'), COMSTAR_WOB_SERVICE_ID))
    const repeated = applyStage4Module(continueStage4Modules(first), COMSTAR_WOB_SERVICE_ID)
    const provenance = repeated.lifeModuleHistory.at(-1)!.provenanceIds[0]
    expect(repeated.lifeModuleHistory.filter((entry) => entry.moduleId === COMSTAR_WOB_SERVICE_ID)).toHaveLength(2)
    expect(repeated.attributes.flatMap((entry) => entry.sourceAwards).filter((award) => award.provenanceId === provenance)).toEqual([])
    expect(repeated.traits.flatMap((entry) => entry.sourceAwards).some((award) => award.provenanceId === provenance)).toBe(false)
    expect(repeated.skills.flatMap((entry) => entry.sourceAwards).some((award) => award.provenanceId === provenance)).toBe(true)
    expect(repeated.chronology.at(-1)?.date).toBe('age:26')
  })
})
