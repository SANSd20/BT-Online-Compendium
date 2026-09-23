import { describe, expect, it } from 'vitest'
import { BACK_WOODS_ID, BLUE_COLLAR_ID, STAGE_2_BACK_WOODS_ID, STAGE_2_HIGH_SCHOOL_ID } from '../domain/lifeModules/catalog'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { validateCharacter } from '../validation/validateCharacter'
import { applyCapellanCommonality, applyStage1Module, applyStage2Module, applyUniversalStage0, continueToStage2, createLifeModuleCharacter, resolvePendingLifeModuleAward } from './lifeModuleEngine'

function completeStage0() {
  let character = createLifeModuleCharacter('Xiang', 5000)
  character = applyUniversalStage0(character, 'Mandarin Chinese')
  return applyCapellanCommonality(character, 'Russian')
}

function resolveByAward(character: ReturnType<typeof completeStage0>, awardId: string, targetId: string, displayName: string, parameter?: string) {
  const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === awardId)
  if (!pending) throw new Error(`Missing pending test award: ${awardId}`)
  const type = pending.allowedTargetTypes[0]
  return resolvePendingLifeModuleAward(character, pending.id, {
    type,
    targetId,
    displayName,
    ...(parameter ? { parameter: { kind: 'subskill', value: parameter } } : {}),
  })
}

function completeBlueCollarStage1() {
  let character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
  character = resolveByAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
  character = resolveByAward(character, 'blue-collar.career', 'skill.career', 'Career/Soldier', 'Soldier')
  character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History')
  character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/Engineering', 'Engineering')
  for (const attributeId of ['STR', 'BOD', 'DEX', 'RFL']) character = resolveByAward(character, 'blue-collar.flexible', attributeId, attributeId)
  return character
}

describe('Life Module engine', () => {
  it('creates a sourced draft with a separate module-purchasing pool', () => {
    const character = createLifeModuleCharacter('Xiang')
    expect(character.creation.method).toBe('life-modules')
    expect(character.creation.lifeModules?.moduleXp).toEqual({ starting: 5000, spent: 0, remaining: 5000 })
    expect(character.creation.lifeModules?.phase).toBe('stage-0-universal')
    expect(character.provenance.some((entry) => entry.source?.ruleId === 'life-module-character-creation')).toBe(true)
  })

  it('applies the universal package and Capellan/Commonality without cross-financing the module pool', () => {
    const character = completeStage0()
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 1000, remaining: 4000 })
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(150)
    expect(character.attributes.find((entry) => entry.attributeId === 'EDG')?.accumulatedXp).toBe(150)
    expect(character.skills.find((entry) => entry.displayName === 'Language/Mandarin Chinese')?.accumulatedXp).toBe(20)
    expect(character.skills.find((entry) => entry.displayName === 'Language/Russian')?.accumulatedXp).toBe(10)
    expect(character.traits.find((entry) => entry.displayName === 'Compulsion/Paranoia')).toMatchObject({ accumulatedXp: -100, attainedTp: -1, active: true })
    expect(state.pendingAwards).toEqual(expect.arrayContaining([expect.objectContaining({ awardId: 'commonality.language.fedsuns', xpPerGrant: 5 })]))
    expect(character.affiliations.map((entry) => entry.role)).toEqual(['birth', 'final'])
  })

  it('applies Blue Collar fixed awards and retains every unresolved choice', () => {
    const character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 1210, remaining: 3790 })
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')?.accumulatedXp).toBe(145)
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(140)
    expect(state.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining([
      'commonality.language.fedsuns', 'blue-collar.career', 'blue-collar.interests', 'blue-collar.flexible',
    ]))
    expect(state.pendingAwards.find((entry) => entry.awardId === 'blue-collar.flexible')?.remainingGrants).toBe(4)
    expect(state.phase).toBe('stage-1-resolution')
  })

  it('applies Back Woods while retaining its unmet end-of-creation prerequisites', () => {
    const character = applyStage1Module(completeStage0(), BACK_WOODS_ID)
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 1290, remaining: 3710 })
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')).toMatchObject({ accumulatedXp: 200, purchasedLevel: 2 })
    expect(character.traits.find((entry) => entry.traitId === 'trait.fit')).toMatchObject({ accumulatedXp: 100, attainedTp: 1, active: true })
    expect(character.traits.find((entry) => entry.traitId === 'trait.wealth')).toMatchObject({ accumulatedXp: -60, attainedTp: null, active: false })
    expect(character.skills.find((entry) => entry.displayName === 'Language/Mandarin Chinese')).toMatchObject({ accumulatedXp: 15, level: null })
    expect(state.prerequisiteIssues.filter((entry) => entry.status === 'outstanding').map((entry) => entry.prerequisiteId)).toEqual(['back-woods.str', 'back-woods.bod'])
    expect(state.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining(['back-woods.skill.survival', 'back-woods.flexible']))
  })

  it('rejects an unknown module request and overspending', () => {
    expect(() => applyStage1Module(completeStage0(), 'stage1.unknown' as typeof BLUE_COLLAR_ID)).toThrow('Unknown Alpha Stage 1 module')
    let character = createLifeModuleCharacter('Short Pool', 900)
    character = applyUniversalStage0(character, 'English')
    expect(() => applyCapellanCommonality(character, 'Russian')).toThrow('overspend')
  })

  it('round-trips a Life Module draft with provenance and unresolved awards intact', () => {
    const character = applyStage1Module(completeStage0(), BACK_WOODS_ID)
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-23T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(validateCharacter(decoded).valid).toBe(true)
    expect(decoded.creation.lifeModules?.pendingAwards.length).toBe(3)
    expect(decoded.lifeModuleHistory.every((entry) => entry.provenanceIds.length > 0)).toBe(true)
  })

  it('flags malformed Life Module spending', () => {
    const character = completeStage0()
    character.creation.lifeModules!.moduleXp.remaining = 4999
    const validation = validateCharacter(character)
    expect(validation.valid).toBe(false)
    expect(validation.issues.map((entry) => entry.id)).toContain('life-modules.xp.balance')
  })

  it('flags malformed pending awards and missing module provenance', () => {
    const character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
    character.creation.lifeModules!.pendingAwards[0].remainingGrants = 0
    character.lifeModuleHistory[0].provenanceIds = ['missing-provenance']
    character.attributes[0].sourceAwards = []
    const ids = validateCharacter(character).issues.map((entry) => entry.id)
    expect(ids).toContain('life-modules.pending-award.malformed')
    expect(ids).toContain('life-modules.module.provenance')
    expect(ids).toContain('creation.provenance.required')
  })

  it('resolves language, /Any, multi-choice, and flexible awards into shared ledgers', () => {
    let character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
    character = resolveByAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
    character = resolveByAward(character, 'blue-collar.career', 'skill.career', 'Career/Soldier', 'Soldier')
    character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/BattleMechs', 'BattleMechs')
    character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/FedSuns History', 'FedSuns History')
    character = resolveByAward(character, 'blue-collar.flexible', 'STR', 'STR')
    character = resolveByAward(character, 'blue-collar.flexible', 'BOD', 'BOD')
    const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'blue-collar.flexible')!
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'trait', targetId: 'trait.patient', displayName: 'Patient' })
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'skill', targetId: 'skill.perception', displayName: 'Perception' })

    const state = character.creation.lifeModules!
    expect(state.pendingAwards).toEqual([])
    expect(state.resolvedAwards).toHaveLength(10)
    expect(character.skills.find((entry) => entry.displayName === 'Language/French')?.accumulatedXp).toBe(5)
    expect(character.skills.find((entry) => entry.displayName === 'Career/Soldier')?.accumulatedXp).toBe(10)
    expect(character.skills.find((entry) => entry.displayName === 'Perception')).toMatchObject({ accumulatedXp: 20, level: 0 })
    expect(character.traits.find((entry) => entry.traitId === 'trait.patient')).toMatchObject({ accumulatedXp: 10, attainedTp: null, active: false })
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')?.accumulatedXp).toBe(155)
    expect(state.phase).toBe('alpha-partial-stop')
    expect(state.stopState).toBe('alpha-partial-stop')
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('life-modules.alpha-stop.valid')
  })

  it('rejects duplicate choices, missing subskills, and invalid flexible targets', () => {
    let character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
    character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History')
    expect(() => resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History')).toThrow('already been selected')
    expect(() => resolveByAward(character, 'blue-collar.career', 'skill.career', 'Career', '')).toThrow('concrete language or subskill')

    const backWoods = applyStage1Module(completeStage0(), BACK_WOODS_ID)
    const flexible = backWoods.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'back-woods.flexible')!
    expect(() => resolvePendingLifeModuleAward(backWoods, flexible.id, { type: 'skill', targetId: 'skill.perception', displayName: 'Perception' })).toThrow('not an allowed target')
  })

  it('re-evaluates prerequisites after flexible awards resolve', () => {
    let character = applyStage1Module(completeStage0(), BACK_WOODS_ID)
    character = resolveByAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
    character = resolveByAward(character, 'back-woods.skill.survival', 'skill.survival', 'Survival/Forest', 'Forest')
    const str = character.attributes.find((entry) => entry.attributeId === 'STR')!
    const bod = character.attributes.find((entry) => entry.attributeId === 'BOD')!
    str.accumulatedXp = 375
    str.purchasedLevel = 3
    bod.accumulatedXp = 475
    bod.purchasedLevel = 4
    character = resolveByAward(character, 'back-woods.flexible', 'STR', 'STR')
    character = resolveByAward(character, 'back-woods.flexible', 'BOD', 'BOD')

    expect(character.creation.lifeModules!.prerequisiteIssues.every((entry) => entry.status === 'satisfied')).toBe(true)
    expect(character.creation.lifeModules!.phase).toBe('alpha-partial-stop')
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')).toMatchObject({ accumulatedXp: 400, purchasedLevel: 4 })
    expect(character.attributes.find((entry) => entry.attributeId === 'BOD')).toMatchObject({ accumulatedXp: 500, purchasedLevel: 5 })
  })

  it('round-trips partially resolved and unresolved award state', () => {
    let character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
    character = resolveByAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
    character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History')
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-23T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(decoded.creation.lifeModules!.resolvedAwards.length).toBeGreaterThan(0)
    expect(decoded.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'blue-collar.interests')?.remainingGrants).toBe(1)
  })

  it('validates malformed resolved destinations and missing grant counts', () => {
    let character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
    character = resolveByAward(character, 'blue-collar.career', 'skill.career', 'Career/Soldier', 'Soldier')
    character.creation.lifeModules!.resolvedAwards.at(-1)!.destination.targetId = 'skill.interest'
    character.creation.lifeModules!.choiceGrantRequirements.find((entry) => entry.awardId === 'blue-collar.interests')!.requiredGrants = 1
    character.creation.lifeModules!.choiceGrantRequirements = character.creation.lifeModules!.choiceGrantRequirements.filter((entry) => entry.awardId !== 'blue-collar.flexible')
    const ids = validateCharacter(character).issues.map((entry) => entry.id)
    expect(ids).toContain('life-modules.resolution.malformed')
    expect(ids).toContain('life-modules.choice-requirement.malformed')
    expect(ids).toContain('life-modules.choice-requirement.missing')
  })

  it('reports unsupported later continuation and full finalization', () => {
    const character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
    character.creation.lifeModules!.phase = 'stage-3-unsupported'
    character.creation.status = 'finalized'
    const validation = validateCharacter(character)
    expect(validation.valid).toBe(false)
    expect(validation.issues.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'life-modules.phase.malformed',
      'life-modules.continuation.unsupported',
      'life-modules.finalization.unsupported',
    ]))
  })

  it('continues a resolved Stage 1 stop into Stage 2 Back Woods and applies fixed awards', () => {
    let character = continueToStage2(completeBlueCollarStage1())
    expect(character.creation.lifeModules!.phase).toBe('stage-2-selection')
    character = applyStage2Module(character, STAGE_2_BACK_WOODS_ID)
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 1710, remaining: 3290 })
    expect(state.phase).toBe('stage-2-resolution')
    expect(character.attributes.find((entry) => entry.attributeId === 'BOD')?.accumulatedXp).toBe(220)
    expect(character.attributes.find((entry) => entry.attributeId === 'INT')?.accumulatedXp).toBe(105)
    expect(character.traits.find((entry) => entry.traitId === 'trait.animal-empathy')?.accumulatedXp).toBe(50)
    expect(character.skills.find((entry) => entry.displayName === 'Survival/Forest')?.accumulatedXp).toBe(25)
    expect(state.pendingAwards).toEqual(expect.arrayContaining([
      expect.objectContaining({ awardId: 'stage2.back-woods.skill.protocol-affiliation', xpPerGrant: -15 }),
      expect.objectContaining({ awardId: 'stage2.back-woods.flexible', allocationMode: 'pool', remainingXp: 125 }),
    ]))
    expect(character.chronology.at(-1)?.date).toBe('age:16')
  })

  it('selects High School, tracks its prerequisites, choices, cost, and only-one Stage 2 rule', () => {
    const selecting = continueToStage2(completeBlueCollarStage1())
    const character = applyStage2Module(selecting, STAGE_2_HIGH_SCHOOL_ID)
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 1610, remaining: 3390 })
    expect(state.prerequisiteIssues.every((entry) => entry.status === 'satisfied')).toBe(true)
    expect(state.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining([
      'high-school.interest-40', 'high-school.interest-35', 'high-school.language-affiliation', 'high-school.streetwise-affiliation', 'high-school.flexible',
    ]))
    expect(() => applyStage2Module(character, STAGE_2_BACK_WOODS_ID)).toThrow('not the current legal action')
  })

  it('re-evaluates the High School no-Illiterate prerequisite', () => {
    let character = completeBlueCollarStage1()
    const provenanceId = character.provenance[0].id
    character.traits.push({ traitId: 'trait.illiterate', displayName: 'Illiterate', accumulatedXp: 100, attainedTp: 1, active: true, parameters: {}, sourceAwards: [{ id: 'test-illiterate', xp: 100, provenanceId }] })
    character = applyStage2Module(continueToStage2(character), STAGE_2_HIGH_SCHOOL_ID)
    expect(character.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'high-school.not-illiterate')?.status).toBe('outstanding')
  })

  it('resolves Stage 2 affiliation, /Any, and flexible-pool awards with source caps', () => {
    let character = applyStage2Module(continueToStage2(completeBlueCollarStage1()), STAGE_2_HIGH_SCHOOL_ID)
    character = resolveByAward(character, 'high-school.interest-40', 'skill.interest', 'Interest/Science', 'Science')
    character = resolveByAward(character, 'high-school.interest-35', 'skill.interest', 'Interest/Art', 'Art')
    character = resolveByAward(character, 'high-school.language-affiliation', 'skill.language', 'Language/English', 'English')
    character = resolveByAward(character, 'high-school.streetwise-affiliation', 'skill.streetwise', 'Streetwise/Capellan', 'Capellan')
    const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!
    expect(() => resolvePendingLifeModuleAward(character, flexible.id, { type: 'skill', targetId: 'skill.perception', displayName: 'Perception' }, 36)).toThrow('no more than 35 XP')
    expect(() => resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'STR', displayName: 'STR' }, 201)).toThrow('remaining award XP')
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'skill', targetId: 'skill.perception', displayName: 'Perception' }, 35)
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'STR', displayName: 'STR' }, 150)
    expect(character.creation.lifeModules!.pendingAwards).toEqual([])
    expect(character.creation.lifeModules!.phase).toBe('alpha-stage-2-stop')
    expect(character.creation.lifeModules!.stopState).toBe('alpha-stage-2-stop')
    expect(character.skills.find((entry) => entry.displayName === 'Perception')?.accumulatedXp).toBe(45)
    expect(validateCharacter(character).valid).toBe(true)
  })

  it('round-trips Stage 2 resolved and unresolved state and validates flexible cap tampering', () => {
    let character = applyStage2Module(continueToStage2(completeBlueCollarStage1()), STAGE_2_BACK_WOODS_ID)
    const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'stage2.back-woods.flexible')!
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'skill', targetId: 'skill.perception', displayName: 'Perception' }, 35)
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-23T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(decoded.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'stage2.back-woods.flexible')?.remainingXp).toBe(90)
    decoded.creation.lifeModules!.resolvedAwards.find((entry) => entry.awardId === 'stage2.back-woods.flexible')!.xp = 36
    expect(validateCharacter(decoded).issues.map((entry) => entry.id)).toContain('life-modules.flexible-cap.exceeded')
  })
})
