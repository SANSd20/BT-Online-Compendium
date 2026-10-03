import { describe, expect, it } from 'vitest'
import { AGITATOR_ID, BACK_WOODS_ID, BLUE_COLLAR_ID, CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID, INTELLIGENCE_OPERATIVE_TRAINING_ID, MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID, OFFICER_TRAINING_SCHOOL_ID, POLICE_ACADEMY_ID, STAGE_2_BACK_WOODS_ID, STAGE_2_HIGH_SCHOOL_ID, TECHNICAL_COLLEGE_ID, UNIVERSAL_STAGE_0_ID } from '../domain/lifeModules/catalog'
import { getOptimizationPreview as getDomainOptimizationPreview } from '../domain/lifeModules/finalReview'
import { ANALYSIS_FIELD_ID, BASIC_TRAINING_FIELD_ID, BASIC_TRAINING_NAVAL_FIELD_ID, CARTOGRAPHER_FIELD_ID, CAVALRY_FIELD_ID, DETECTIVE_FIELD_ID, INFANTRY_FIELD_ID, INTELLIGENCE_FIELD_ID, MARINE_FIELD_ID, MECHWARRIOR_FIELD_ID, OFFICER_FIELD_ID, PILOT_EXOSKELETON_FIELD_ID, PILOT_INDUSTRIALMECH_FIELD_ID, POLICE_OFFICER_FIELD_ID, SCOUT_FIELD_ID, SHIPS_CREW_FIELD_ID, TECHNICIAN_AEROSPACE_FIELD_ID, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_MECH_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID, TECHNICIAN_SUBSKILLS, TECHNICIAN_VEHICLE_FIELD_ID } from '../domain/skillFields/catalog'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { validateCharacter } from '../validation/validateCharacter'
import { applyAgitator, applyCapellanCommonality, applyFederatedSunsCrucisMarch, applyMilitaryAcademy, applyMilitaryEnlistment, applyStage1Module, applyStage2Module, applyStage3School, applyStage4Module, applyTechnicalCollege, applyUniversalStage0, continueStage3Schooling, continueToStage2, continueToStage3, continueToStage4, createLifeModuleCharacter, reevaluateLifeModulePrerequisites, resolvePendingLifeModuleAward } from './lifeModuleEngine'
import { allocateFinalReviewXp, applyLifeModuleOptimization, enterLifeModuleFinalReview, previewLifeModuleOptimization } from './lifeModuleFinalReview'
import { createPointBuyCharacter } from './pointBuyEngine'

function completeStage0(startingXp = 5000) {
  let character = createLifeModuleCharacter('Xiang', startingXp)
  character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
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

function completeBlueCollarStage1(startingXp = 5000) {
  let character = applyStage1Module(completeStage0(startingXp), BLUE_COLLAR_ID)
  character = resolveByAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
  character = resolveByAward(character, 'blue-collar.career', 'skill.career', 'Career/Soldier', 'Soldier')
  character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History')
  character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/Engineering', 'Engineering')
  for (const attributeId of ['STR', 'BOD', 'DEX', 'RFL']) character = resolveByAward(character, 'blue-collar.flexible', attributeId, attributeId)
  return character
}

function completeHighSchoolStage2(startingXp = 5000) {
  let character = applyStage2Module(continueToStage2(completeBlueCollarStage1(startingXp)), STAGE_2_HIGH_SCHOOL_ID)
  character = resolveByAward(character, 'high-school.interest-40', 'skill.interest', 'Interest/Science', 'Science')
  character = resolveByAward(character, 'high-school.interest-35', 'skill.interest', 'Interest/Art', 'Art')
  const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!
  return resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'DEX', displayName: 'DEX' }, 185)
}

function completeTechnicalCollegeStage3(startingXp = 5000) {
  let character = applyTechnicalCollege(continueToStage3(completeHighSchoolStage2(startingXp)))
  character = resolveByAward(character, 'technical-college.interest', 'skill.interest', 'Interest/Engineering', 'Engineering')
  const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'technical-college.flexible')!
  character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 150)
  return resolvePendingLifeModuleAward(character, flexible.id, { type: 'trait', targetId: 'trait.patient', displayName: 'Patient' }, 50)
}

function completePoliceAcademy(character = continueToStage3(completeHighSchoolStage2())) {
  let next = applyStage3School(character, POLICE_ACADEMY_ID, [POLICE_OFFICER_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID])
  next = resolveByAward(next, 'police-academy.skill.driving', 'skill.driving', 'Driving/Ground', 'Ground')
  const fieldDriving = next.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.fieldId === POLICE_OFFICER_FIELD_ID)!
  next = resolvePendingLifeModuleAward(next, fieldDriving.id, {
    type: 'skill', targetId: 'skill.driving', displayName: 'Driving/Ground Vehicles', parameter: { kind: 'subskill', value: 'Ground Vehicles' },
  })
  const flexible = next.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'police-academy.flexible')!
  return resolvePendingLifeModuleAward(next, flexible.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 140)
}

function completeAgitatorStage4() {
  let character = applyAgitator(continueToStage4(completeTechnicalCollegeStage3()))
  character = resolveByAward(character, 'agitator.skill.driving', 'skill.driving', 'Driving/Ground Car', 'Ground Car')
  character = resolveByAward(character, 'agitator.skill.prestidigitation', 'skill.prestidigitation', 'Prestidigitation/Sleight of Hand', 'Sleight of Hand')
  const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'agitator.flexible')!
  character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'STR', displayName: 'STR' }, 50)
  return resolvePendingLifeModuleAward(character, flexible.id, { type: 'skill', targetId: 'skill.acting', displayName: 'Acting' }, 75)
}

describe('Life Module engine', () => {
  it('creates a sourced draft with a separate module-purchasing pool', () => {
    const character = createLifeModuleCharacter('Xiang')
    expect(character.creation.method).toBe('life-modules')
    expect(character.creation.lifeModules?.moduleXp).toEqual({ starting: 5000, spent: 850, remaining: 4150 })
    expect(character.creation.lifeModules?.phase).toBe('stage-0-affiliation')
    expect(character.creation.lifeModules?.selectedModuleIds).toContain(UNIVERSAL_STAGE_0_ID)
    expect(character.creation.lifeModules?.pendingAwards).toContainEqual(expect.objectContaining({ awardId: 'universal.language.affiliation' }))
    expect(character.attributes.every((entry) => entry.accumulatedXp === 100)).toBe(true)
    expect(character.skills.find((entry) => entry.displayName === 'Language/English')?.accumulatedXp).toBe(20)
    expect(character.skills.find((entry) => entry.displayName === 'Perception')?.accumulatedXp).toBe(10)
    expect(validateCharacter(character).issues.map((entry) => entry.id)).not.toContain('life-modules.stage-0.affiliation-context.required')
    expect(character.provenance.some((entry) => entry.source?.ruleId === 'life-module-character-creation')).toBe(true)
  })

  it('requires explicit Stage 0 affiliation context and language choices', () => {
    const character = createLifeModuleCharacter('No implicit affiliation')
    expect(character.creation.lifeModules?.stage0AffiliationContext).toBeUndefined()
    expect(character.creation.lifeModules?.affiliationLanguage).toBeUndefined()
    expect(character.skills.some((entry) => entry.displayName === 'Language/Mandarin Chinese')).toBe(false)
    expect(() => applyUniversalStage0(character, '', 'Mandarin Chinese')).toThrow('explicit Stage 0 affiliation context')
    expect(() => applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, '')).toThrow('listed primary or secondary language')
  })

  it('records Mandarin Chinese only after an explicit Capellan context choice', () => {
    const character = applyUniversalStage0(createLifeModuleCharacter('Explicit choice'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
    expect(character.creation.lifeModules).toMatchObject({
      stage0AffiliationContext: CAPELLAN_COMMONALITY_ID,
      affiliationLanguage: 'Mandarin Chinese',
    })
    expect(character.skills.find((entry) => entry.displayName === 'Language/Mandarin Chinese')?.accumulatedXp).toBe(20)
    expect(validateCharacter(character).issues.map((entry) => entry.id)).not.toContain('life-modules.stage-0.affiliation-context.required')
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

  it('applies Federated Suns / Crucis March only after explicit source-backed choices', () => {
    const base = createLifeModuleCharacter('Davion')
    const withUniversal = applyUniversalStage0(base, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English')
    expect(() => applyFederatedSunsCrucisMarch(withUniversal)).toThrow('Natural Aptitude')
    const character = applyFederatedSunsCrucisMarch(withUniversal, 'Strategy', 'Painting')
    expect(character.creation.lifeModules).toMatchObject({ phase: 'stage-1-selection', moduleXp: { spent: 1000, remaining: 4000 } })
    expect(character.affiliations).toEqual(expect.arrayContaining([expect.objectContaining({ affiliationId: 'affiliation.federated-suns', role: 'birth' })]))
    expect(character.traits).toContainEqual(expect.objectContaining({ displayName: 'Natural Aptitude/Strategy', accumulatedXp: 100 }))
    expect(character.skills).toContainEqual(expect.objectContaining({ displayName: 'Art/Painting', accumulatedXp: 10 }))
    expect(character.skills).toContainEqual(expect.objectContaining({ displayName: 'Protocol/FedSuns', accumulatedXp: 25 }))
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
    const character = applyUniversalStage0(createLifeModuleCharacter('Short Pool', 900), CAPELLAN_COMMONALITY_ID, 'English')
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

  it('allows stage progression when only final-validation prerequisites remain', () => {
    let character = applyStage1Module(completeStage0(), BACK_WOODS_ID)
    character = resolveByAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
    character = resolveByAward(character, 'back-woods.skill.survival', 'skill.survival', 'Survival/Forest', 'Forest')
    character = resolveByAward(character, 'back-woods.flexible', 'STR', 'STR')
    character = resolveByAward(character, 'back-woods.flexible', 'BOD', 'BOD')
    const state = character.creation.lifeModules!
    expect(state.pendingAwards).toEqual([])
    expect(state.prerequisiteIssues.filter((entry) => entry.status === 'outstanding').map((entry) => entry.description)).toEqual(['STR 4+', 'BOD 5+'])
    expect(state.phase).toBe('alpha-partial-stop')
    expect(continueToStage2(character).creation.lifeModules?.phase).toBe('stage-2-selection')
  })

  it('rejects values outside safe known pending-award choices', () => {
    const character = applyStage1Module(completeStage0(), BACK_WOODS_ID)
    expect(() => resolveByAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/Klingon', 'Klingon')).toThrow('safe known choice')
    expect(() => resolveByAward(character, 'back-woods.skill.survival', 'skill.survival', 'Survival/Ocean', 'Ocean')).toThrow('safe known choice')
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

  it('reports malformed premature Stage 4 continuation and unsupported finalization', () => {
    const character = applyStage1Module(completeStage0(), BLUE_COLLAR_ID)
    character.creation.lifeModules!.phase = 'stage-4-selection'
    character.creation.status = 'finalized'
    const validation = validateCharacter(character)
    expect(validation.valid).toBe(false)
    expect(validation.issues.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'life-modules.phase.malformed',
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
      expect.objectContaining({ awardId: 'stage2.back-woods.flexible', allocationMode: 'pool', remainingXp: 125 }),
    ]))
    expect(state.pendingAwards.some((entry) => entry.awardId === 'stage2.back-woods.skill.protocol-affiliation')).toBe(false)
    expect(character.skills.find((entry) => entry.displayName === 'Protocol/Capellan')?.accumulatedXp).toBe(-5)
    expect(character.chronology.at(-1)?.date).toBe('age:16')
  })

  it('selects High School, tracks its prerequisites, choices, cost, and only-one Stage 2 rule', () => {
    const selecting = continueToStage2(completeBlueCollarStage1())
    const character = applyStage2Module(selecting, STAGE_2_HIGH_SCHOOL_ID)
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 1610, remaining: 3390 })
    expect(state.prerequisiteIssues.every((entry) => entry.status === 'satisfied')).toBe(true)
    expect(state.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining([
      'high-school.interest-40', 'high-school.interest-35', 'high-school.flexible',
    ]))
    expect(state.pendingAwards.some((entry) => entry.awardId.includes('affiliation'))).toBe(false)
    expect(character.skills.find((entry) => entry.displayName === 'Language/Mandarin Chinese')?.accumulatedXp).toBe(30)
    expect(character.skills.find((entry) => entry.displayName === 'Streetwise/Capellan')?.accumulatedXp).toBe(20)
    expect(() => applyStage2Module(character, STAGE_2_BACK_WOODS_ID)).toThrow('not the current legal action')
  })

  it('re-evaluates the High School no-Illiterate prerequisite', () => {
    let character = completeBlueCollarStage1()
    const provenanceId = character.provenance[0].id
    character.traits.push({ traitId: 'trait.illiterate', displayName: 'Illiterate', accumulatedXp: 100, attainedTp: 1, active: true, parameters: {}, sourceAwards: [{ id: 'test-illiterate', xp: 100, provenanceId }] })
    character = applyStage2Module(continueToStage2(character), STAGE_2_HIGH_SCHOOL_ID)
    expect(character.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'high-school.not-illiterate')?.status).toBe('outstanding')
  })

  it('resolves /Affiliation destinations from each established final affiliation without creating choices', () => {
    let capellan = completeStage0()
    capellan.creation.lifeModules!.phase = 'stage-2-selection'
    capellan.creation.lifeModules!.pendingAwards = []
    capellan = applyStage2Module(capellan, STAGE_2_BACK_WOODS_ID)
    expect(capellan.skills.find((entry) => entry.displayName === 'Protocol/Capellan')?.accumulatedXp).toBe(-5)
    expect(capellan.creation.lifeModules!.pendingAwards.some((entry) => entry.awardId.includes('protocol-affiliation'))).toBe(false)

    let federated = createLifeModuleCharacter('Morgan')
    federated = applyUniversalStage0(federated, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English')
    federated = applyFederatedSunsCrucisMarch(federated, 'Strategy', 'Painting')
    federated.creation.lifeModules!.phase = 'stage-2-selection'
    federated.creation.lifeModules!.pendingAwards = []
    federated = applyStage2Module(federated, STAGE_2_BACK_WOODS_ID)
    expect(federated.skills.find((entry) => entry.displayName === 'Protocol/FedSuns')?.accumulatedXp).toBe(10)
    expect(federated.skills.some((entry) => entry.displayName === 'Protocol/Capellan' && entry.accumulatedXp < 0)).toBe(false)
  })

  it('resolves Stage 2 affiliation, /Any, and flexible-pool awards with source caps', () => {
    let character = applyStage2Module(continueToStage2(completeBlueCollarStage1()), STAGE_2_HIGH_SCHOOL_ID)
    character = resolveByAward(character, 'high-school.interest-40', 'skill.interest', 'Interest/Science', 'Science')
    character = resolveByAward(character, 'high-school.interest-35', 'skill.interest', 'Interest/Art', 'Art')
    const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!
    expect(flexible.maxXpPerTarget).toEqual({ attribute: 200, trait: 200, skill: 35 })
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

  it('continues from Stage 2 and applies Technical College with both required Skill Fields', () => {
    let character = continueToStage3(completeHighSchoolStage2())
    expect(character.creation.lifeModules!.phase).toBe('stage-3-selection')
    character = applyTechnicalCollege(character, [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID])
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 2426, remaining: 2574 })
    expect(character.lifeModuleHistory.at(-1)).toMatchObject({ costXp: 816, baseCostXp: 600, fieldCostXp: 216, stage: 3 })
    expect(state.selectedSkillFields.map((entry) => [entry.fieldId, entry.purchaseCostXp, entry.chronologyYears])).toEqual([
      [TECHNICIAN_CIVILIAN_FIELD_ID, 120, 1],
      [TECHNICIAN_VEHICLE_FIELD_ID, 96, 2],
    ])
    expect(character.chronology.at(-1)?.date).toBe('age:19')
    expect(state.phase).toBe('stage-3-resolution')
  })

  it('applies Technical College automatic and overlapping Field Skill awards', () => {
    const character = applyTechnicalCollege(continueToStage3(completeHighSchoolStage2()))
    expect(character.attributes.find((entry) => entry.attributeId === 'DEX')?.accumulatedXp).toBe(445)
    expect(character.attributes.find((entry) => entry.attributeId === 'INT')?.accumulatedXp).toBe(250)
    expect(character.traits.find((entry) => entry.traitId === 'trait.equipped')?.accumulatedXp).toBe(150)
    expect(character.skills.find((entry) => entry.displayName === 'Computers')?.accumulatedXp).toBe(70)
    expect(character.skills.find((entry) => entry.displayName === 'Technician/Electronic')?.accumulatedXp).toBe(60)
    expect(character.skills.find((entry) => entry.displayName === 'Technician/Mechanical')?.accumulatedXp).toBe(60)
    expect(character.skills.find((entry) => entry.displayName === 'Technician/Nuclear')?.accumulatedXp).toBe(60)
    expect(character.skills.find((entry) => entry.displayName === 'Career/Technician')?.accumulatedXp).toBe(30)
    expect(character.creation.lifeModules!.pendingAwards).toEqual(expect.arrayContaining([
      expect.objectContaining({ awardId: 'technical-college.interest', xpPerGrant: 30 }),
      expect.objectContaining({ awardId: 'technical-college.flexible', allocationMode: 'pool', remainingXp: 200 }),
    ]))
  })

  it('applies Military Academy source awards, conditional entry adjustment, Fields, cost, and time together', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const before = JSON.stringify(selecting)
    const beforeXp = Object.fromEntries(selecting.attributes.map((entry) => [entry.attributeId, entry.accumulatedXp]))
    const character = applyMilitaryAcademy(selecting)
    const state = character.creation.lifeModules!
    expect(character.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: MILITARY_ACADEMY_ID, costXp: 1094, baseCostXp: 830, fieldCostXp: 264 })
    expect(state.selectedSkillFields.map((entry) => [entry.fieldId, entry.purchaseCostXp, entry.chronologyYears])).toEqual([
      [BASIC_TRAINING_FIELD_ID, 120, 1],
      [INFANTRY_FIELD_ID, 144, 1],
    ])
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')?.accumulatedXp).toBe(beforeXp.STR + 50)
    expect(character.attributes.find((entry) => entry.attributeId === 'BOD')?.accumulatedXp).toBe(beforeXp.BOD + 100)
    expect(character.attributes.find((entry) => entry.attributeId === 'RFL')?.accumulatedXp).toBe(beforeXp.RFL + 125)
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(beforeXp.WIL + 200)
    expect(character.attributes.find((entry) => entry.attributeId === 'EDG')?.accumulatedXp).toBe(beforeXp.EDG - 100)
    expect(character.traits.find((entry) => entry.traitId === 'trait.rank')?.accumulatedXp).toBe(200)
    expect(character.traits.find((entry) => entry.traitId === 'trait.connections')?.accumulatedXp).toBe(220)
    expect(character.skills.find((entry) => entry.displayName === 'Protocol/Capellan')?.sourceAwards.some((award) => award.xp === 15)).toBe(true)
    expect(character.skills.find((entry) => entry.displayName === 'Tactics/Infantry')?.accumulatedXp).toBe(30)
    expect(state.prerequisiteIssues.find((entry) => entry.moduleId === INFANTRY_FIELD_ID && entry.prerequisiteId === 'infantry.field')?.status).toBe('satisfied')
    expect(state.pendingAwards).toContainEqual(expect.objectContaining({ awardId: 'military-academy.flexible', remainingXp: 100 }))
    expect(character.chronology.at(-1)?.date).toBe('age:18')
    expect(JSON.stringify(selecting)).toBe(before)
  })

  it('applies Military Enlistment exact fixed awards and half-year Field timings', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const beforeXp = Object.fromEntries(selecting.attributes.map((entry) => [entry.attributeId, entry.accumulatedXp]))
    const character = applyMilitaryEnlistment(selecting)
    expect(character.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: MILITARY_ENLISTMENT_ID, costXp: 984, baseCostXp: 720, fieldCostXp: 264 })
    expect(character.creation.lifeModules!.selectedSkillFields.map((entry) => [entry.fieldId, entry.chronologyYears])).toEqual([
      [BASIC_TRAINING_FIELD_ID, 0.5],
      [INFANTRY_FIELD_ID, 1.5],
    ])
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')?.accumulatedXp).toBe(beforeXp.STR + 125)
    expect(character.attributes.find((entry) => entry.attributeId === 'BOD')?.accumulatedXp).toBe(beforeXp.BOD + 125)
    expect(character.attributes.find((entry) => entry.attributeId === 'RFL')?.accumulatedXp).toBe(beforeXp.RFL + 100)
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(beforeXp.WIL + 100)
    expect(character.attributes.find((entry) => entry.attributeId === 'CHA')?.accumulatedXp).toBe(beforeXp.CHA - 100)
    expect(character.traits.find((entry) => entry.traitId === 'trait.rank')?.accumulatedXp).toBe(100)
    expect(character.skills.find((entry) => entry.displayName === 'Swimming')?.sourceAwards.some((award) => award.xp === 20)).toBe(true)
    expect(character.creation.lifeModules!.pendingAwards).toContainEqual(expect.objectContaining({ awardId: 'military-enlistment.flexible', remainingXp: 200 }))
    expect(character.chronology.at(-1)?.date).toBe('age:18')
  })

  it('acquires Marine through both authorized schools with one canonical Field and a bounded Security Systems choice', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const before = JSON.stringify(selecting)
    let academy = applyMilitaryAcademy(selecting, [BASIC_TRAINING_NAVAL_FIELD_ID, MARINE_FIELD_ID])
    const academyPending = academy.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.fieldId === MARINE_FIELD_ID)!
    expect(academy.lifeModuleHistory.at(-1)).toMatchObject({ fieldCostXp: 264, costXp: 1094 })
    expect(academy.creation.lifeModules!.selectedSkillFields.map((entry) => [entry.fieldId, entry.purchaseCostXp, entry.chronologyYears])).toEqual([
      [BASIC_TRAINING_NAVAL_FIELD_ID, 144, 1],
      [MARINE_FIELD_ID, 120, 1],
    ])
    expect(academyPending).toMatchObject({ requiredSkillId: 'skill.security-systems', xpPerGrant: 30 })
    expect(() => resolvePendingLifeModuleAward(academy, academyPending.id, {
      type: 'skill', targetId: 'skill.security-systems', displayName: 'Security Systems/Software', parameter: { kind: 'subskill', value: 'Software' },
    })).toThrow('safe known choice')
    academy = resolvePendingLifeModuleAward(academy, academyPending.id, {
      type: 'skill', targetId: 'skill.security-systems', displayName: 'Security Systems/Electronic', parameter: { kind: 'subskill', value: 'Electronic' },
    })
    expect(academy.skills.find((entry) => entry.displayName === 'Security Systems/Electronic')?.accumulatedXp).toBe(30)

    const enlistment = applyMilitaryEnlistment(selecting, [BASIC_TRAINING_NAVAL_FIELD_ID, MARINE_FIELD_ID])
    expect(enlistment.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === MARINE_FIELD_ID)).toMatchObject({ chronologyYears: 1.5 })
    expect(JSON.stringify(selecting)).toBe(before)
  })

  it('acquires Cavalry through both military schools with exact no-default governed choices and durable provenance', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const before = JSON.stringify(selecting)
    let academy = applyMilitaryAcademy(selecting, [BASIC_TRAINING_FIELD_ID, CAVALRY_FIELD_ID])
    const cavalryPending = () => academy.creation.lifeModules!.pendingAwards.filter((entry) => entry.skillFieldChoice?.fieldId === CAVALRY_FIELD_ID)
    expect(academy.lifeModuleHistory.at(-1)).toMatchObject({ fieldCostXp: 264, costXp: 1094 })
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === CAVALRY_FIELD_ID)).toMatchObject({ purchaseCostXp: 144, xpPerSkill: 30, chronologyYears: 1, variableSkillChoices: [] })
    expect(cavalryPending().map((entry) => [entry.requiredSkillId, entry.xpPerGrant])).toEqual([
      ['skill.driving', 30], ['skill.gunnery', 30], ['skill.tactics', 30],
    ])
    expect(academy.skills.find((entry) => entry.displayName === 'Artillery')?.sourceAwards.some((entry) => entry.xp === 30)).toBe(true)
    expect(academy.skills.find((entry) => entry.displayName === 'Sensor Operations')?.sourceAwards.some((entry) => entry.xp === 30)).toBe(true)
    expect(academy.skills.find((entry) => entry.displayName === 'Technician/Mechanical')?.sourceAwards.some((entry) => entry.xp === 30)).toBe(true)
    expect(academy.skills.some((entry) => ['skill.driving', 'skill.gunnery', 'skill.tactics'].includes(entry.address.skillId) && entry.sourceAwards.some((award) => award.xp === 30))).toBe(false)
    expect(() => resolvePendingLifeModuleAward(academy, cavalryPending()[0].id, {
      type: 'skill', targetId: 'skill.driving', displayName: 'Driving/Tracked', parameter: { kind: 'subskill', value: 'Tracked' },
    })).toThrow('safe known choice')

    const choices = [
      ['skill.driving', 'Driving/Ground Vehicles', 'Ground Vehicles'],
      ['skill.gunnery', 'Gunnery/Ground Vehicle', 'Ground Vehicle'],
      ['skill.tactics', 'Tactics/Land', 'Land'],
    ] as const
    for (const [skillId, displayName, parameter] of choices) {
      const pending = cavalryPending().find((entry) => entry.requiredSkillId === skillId)!
      academy = resolvePendingLifeModuleAward(academy, pending.id, { type: 'skill', targetId: skillId, displayName, parameter: { kind: 'subskill', value: parameter } })
    }
    const grant = academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === CAVALRY_FIELD_ID)!
    expect(grant.variableSkillChoices).toHaveLength(3)
    expect(grant.variableSkillChoices?.map((entry) => entry.destination.displayName)).toEqual(choices.map((entry) => entry[1]))
    expect(cavalryPending()).toEqual([])

    const decoded = decodeCharacter(encodeCharacter(academy, '2026-10-02T00:00:00.000Z'))
    expect(decoded).toEqual(academy)
    expect(decoded.creation.lifeModules!.selectedSkillFields.filter((entry) => entry.fieldId === CAVALRY_FIELD_ID)).toHaveLength(1)
    expect(decoded.skills.filter((entry) => choices.some((choice) => choice[1] === entry.displayName))).toHaveLength(3)
    expect(decoded.creation.lifeModules!.pendingAwards.some((entry) => entry.skillFieldChoice?.fieldId === CAVALRY_FIELD_ID)).toBe(false)
    expect(validateCharacter(decoded).valid).toBe(true)

    const enlistment = applyMilitaryEnlistment(selecting, [BASIC_TRAINING_FIELD_ID, CAVALRY_FIELD_ID])
    expect(enlistment.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === CAVALRY_FIELD_ID)).toMatchObject({ purchaseCostXp: 144, chronologyYears: 1.5 })
    expect(JSON.stringify(selecting)).toBe(before)
  })

  it('requires actual Basic Training for Cavalry rather than its component Skills', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const withFields = applyMilitaryAcademy(selecting, [BASIC_TRAINING_FIELD_ID, CAVALRY_FIELD_ID])
    expect(withFields.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'cavalry.field')?.status).toBe('satisfied')
    const componentSkillsOnly = structuredClone(selecting)
    componentSkillsOnly.skills.push(...withFields.skills.filter((entry) => ['Career/Soldier', 'Martial Arts', 'MedTech/General', 'Navigation/Ground', 'Small Arms'].includes(entry.displayName ?? '')).map((entry) => structuredClone(entry)))
    componentSkillsOnly.creation.lifeModules!.selectedSkillFields.push({ ...structuredClone(withFields.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === CAVALRY_FIELD_ID)!), id: 'component-only-cavalry' })
    reevaluateLifeModulePrerequisites(componentSkillsOnly)
    expect(componentSkillsOnly.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'cavalry.field')?.status).toBe('outstanding')
  })

  it('acquires Scout through both military schools with four no-default governed choices and durable persistence', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const before = JSON.stringify(selecting)
    let academy = applyMilitaryAcademy(selecting, [BASIC_TRAINING_FIELD_ID, SCOUT_FIELD_ID])
    const scoutPending = () => academy.creation.lifeModules!.pendingAwards.filter((entry) => entry.skillFieldChoice?.fieldId === SCOUT_FIELD_ID)
    expect(academy.lifeModuleHistory.at(-1)).toMatchObject({ fieldCostXp: 288, costXp: 1118 })
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === SCOUT_FIELD_ID)).toMatchObject({
      purchaseCostXp: 168, xpPerSkill: 30, chronologyYears: 1, variableSkillChoices: [],
    })
    expect(scoutPending().map((entry) => [entry.requiredSkillId, entry.xpPerGrant])).toEqual([
      ['skill.language', 30], ['skill.security-systems', 30], ['skill.streetwise', 30], ['skill.tracking', 30],
    ])
    expect(academy.skills.find((entry) => entry.displayName === 'Comms/Conventional')?.sourceAwards.some((award) => award.xp === 30)).toBe(true)
    expect(academy.skills.find((entry) => entry.displayName === 'Disguise')?.sourceAwards.some((award) => award.xp === 30)).toBe(true)
    expect(academy.skills.find((entry) => entry.displayName === 'Stealth')?.sourceAwards.some((award) => award.xp === 30)).toBe(true)
    expect(academy.skills.some((entry) => ['skill.language', 'skill.security-systems', 'skill.streetwise', 'skill.tracking'].includes(entry.address.skillId) && entry.sourceAwards.some((award) => award.xp === 30))).toBe(false)
    const language = scoutPending().find((entry) => entry.requiredSkillId === 'skill.language')!
    expect(() => resolvePendingLifeModuleAward(academy, language.id, {
      type: 'skill', targetId: 'skill.language', displayName: 'Language/Klingon', parameter: { kind: 'subskill', value: 'Klingon' },
    })).toThrow('safe known choice')

    const frenchBefore = academy.skills.find((entry) => entry.displayName === 'Language/French')!.accumulatedXp
    const choices = [
      ['skill.language', 'Language/French', 'French'],
      ['skill.security-systems', 'Security Systems/Electronic', 'Electronic'],
      ['skill.streetwise', 'Streetwise/Capellan', 'Capellan'],
      ['skill.tracking', 'Tracking/Wilds', 'Wilds'],
    ] as const
    for (const [skillId, displayName, parameter] of choices) {
      const pending = scoutPending().find((entry) => entry.requiredSkillId === skillId)!
      academy = resolvePendingLifeModuleAward(academy, pending.id, { type: 'skill', targetId: skillId, displayName, parameter: { kind: 'subskill', value: parameter } })
    }
    expect(academy.skills.filter((entry) => entry.displayName === 'Language/French')).toHaveLength(1)
    expect(academy.skills.find((entry) => entry.displayName === 'Language/French')?.accumulatedXp).toBe(frenchBefore + 30)
    expect(scoutPending()).toEqual([])
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === SCOUT_FIELD_ID)?.variableSkillChoices).toHaveLength(4)

    const decoded = decodeCharacter(encodeCharacter(academy, '2026-10-03T00:00:00.000Z'))
    expect(decoded).toEqual(academy)
    expect(decoded.creation.lifeModules!.selectedSkillFields.filter((entry) => entry.fieldId === SCOUT_FIELD_ID)).toHaveLength(1)
    expect(decoded.skills.filter((entry) => entry.displayName === 'Language/French')).toHaveLength(1)
    expect(decoded.creation.lifeModules!.pendingAwards.some((entry) => entry.skillFieldChoice?.fieldId === SCOUT_FIELD_ID)).toBe(false)
    expect(validateCharacter(decoded).valid).toBe(true)

    const enlistment = applyMilitaryEnlistment(selecting, [BASIC_TRAINING_FIELD_ID, SCOUT_FIELD_ID])
    expect(enlistment.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === SCOUT_FIELD_ID)).toMatchObject({ purchaseCostXp: 168, chronologyYears: 1.5 })
    expect(JSON.stringify(selecting)).toBe(before)
  })

  it('acquires Ship’s Crew through both authorized schools and preserves its Technician choice through JSON', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    let character = applyMilitaryEnlistment(selecting, [BASIC_TRAINING_NAVAL_FIELD_ID, SHIPS_CREW_FIELD_ID])
    const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.fieldId === SHIPS_CREW_FIELD_ID)!
    expect(character.lifeModuleHistory.at(-1)).toMatchObject({ fieldCostXp: 264, costXp: 984 })
    expect(character.creation.lifeModules!.selectedSkillFields.map((entry) => [entry.fieldId, entry.purchaseCostXp, entry.chronologyYears])).toEqual([
      [BASIC_TRAINING_NAVAL_FIELD_ID, 144, 0.5],
      [SHIPS_CREW_FIELD_ID, 120, 1.5],
    ])
    character = resolvePendingLifeModuleAward(character, pending.id, {
      type: 'skill', targetId: 'skill.technician', displayName: 'Technician/Weapons', parameter: { kind: 'subskill', value: 'Weapons' },
    })
    const decoded = decodeCharacter(encodeCharacter(character, '2026-10-02T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(decoded.skills.filter((entry) => entry.displayName === 'Technician/Weapons')).toHaveLength(1)
    expect(decoded.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === SHIPS_CREW_FIELD_ID)?.variableSkillChoices).toHaveLength(1)
    expect(validateCharacter(decoded).valid).toBe(true)

    const academy = applyMilitaryAcademy(selecting, [BASIC_TRAINING_NAVAL_FIELD_ID, SHIPS_CREW_FIELD_ID])
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === SHIPS_CREW_FIELD_ID)).toMatchObject({ chronologyYears: 1 })
  })

  it('offers Technician/Military only through Military Enlistment with exact fixed awards', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const character = applyMilitaryEnlistment(selecting, [BASIC_TRAINING_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID])
    expect(character.lifeModuleHistory.at(-1)).toMatchObject({ fieldCostXp: 264, costXp: 984 })
    expect(character.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === TECHNICIAN_MILITARY_FIELD_ID)).toMatchObject({ purchaseCostXp: 144, chronologyYears: 1.5 })
    expect(character.skills.find((entry) => entry.displayName === 'Technician/Weapons')?.sourceAwards.some((entry) => entry.xp === 30)).toBe(true)
    expect(character.skills.find((entry) => entry.displayName === 'Career/Technician')?.sourceAwards.some((entry) => entry.xp === 30)).toBe(true)
    expect(() => applyMilitaryAcademy(selecting, [BASIC_TRAINING_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID])).toThrow('not offered')
  })

  it('previews and commits Police Academy with exact costs, awards, governed choices, and persistence', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const before = structuredClone(selecting)
    let character = applyStage3School(selecting, POLICE_ACADEMY_ID, [POLICE_OFFICER_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID])

    expect(selecting).toEqual(before)
    expect(character.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: POLICE_ACADEMY_ID, baseCostXp: 680, fieldCostXp: 312, costXp: 992 })
    expect(character.creation.lifeModules!.selectedSkillFields.map((entry) => [entry.fieldId, entry.category, entry.chronologyYears])).toEqual([
      [POLICE_OFFICER_FIELD_ID, 'basic', 0.5],
      [TECHNICIAN_MILITARY_FIELD_ID, 'advanced', 1],
    ])
    expect(character.attributes.find((entry) => entry.attributeId === 'RFL')?.sourceAwards.some((entry) => entry.xp === 100)).toBe(true)
    expect(character.traits.find((entry) => entry.traitId === 'trait.rank')?.sourceAwards.some((entry) => entry.xp === 100)).toBe(true)
    expect(character.skills.find((entry) => entry.displayName === 'Protocol/Capellan')?.sourceAwards.some((entry) => entry.xp === 25)).toBe(true)
    expect(character.skills.find((entry) => entry.displayName === 'Streetwise/Capellan')?.sourceAwards.filter((entry) => entry.xp === 30).length).toBeGreaterThanOrEqual(2)
    expect(character.creation.lifeModules!.pendingAwards).toEqual(expect.arrayContaining([
      expect.objectContaining({ awardId: 'police-academy.skill.driving', requiredSkillId: 'skill.driving' }),
      expect.objectContaining({ awardId: 'police-academy.flexible', remainingXp: 140 }),
      expect.objectContaining({ skillFieldChoice: { fieldId: POLICE_OFFICER_FIELD_ID, componentId: 'police-officer.driving-any' } }),
    ]))

    character = completePoliceAcademy(selecting)
    expect(character.creation.lifeModules!.phase).toBe('alpha-stage-3-stop')
    expect(character.creation.lifeModules!.pendingAwards).toHaveLength(0)
    const decoded = decodeCharacter(encodeCharacter(character, '2026-10-02T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(validateCharacter(decoded).valid).toBe(true)
    expect(continueToStage4(decoded).creation.lifeModules!.phase).toBe('stage-4-selection')
  })

  it('implements Intelligence Operative Training with exact prerequisites and unresolved governed choices', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const character = applyStage3School(selecting, INTELLIGENCE_OPERATIVE_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, POLICE_OFFICER_FIELD_ID])
    const prerequisites = character.creation.lifeModules!.prerequisiteIssues.filter((entry) => entry.moduleId === INTELLIGENCE_OPERATIVE_TRAINING_ID)

    expect(character.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: INTELLIGENCE_OPERATIVE_TRAINING_ID, baseCostXp: 760, fieldCostXp: 288, costXp: 1048 })
    expect(prerequisites.map((entry) => [entry.description, entry.status])).toEqual(expect.arrayContaining([
      ['INT 4+', expect.any(String)],
      ['WIL 5+', expect.any(String)],
      ['Connections +2 TP or higher', expect.any(String)],
    ]))
    expect(character.creation.lifeModules!.pendingAwards).toEqual(expect.arrayContaining([
      expect.objectContaining({ awardId: 'intelligence-operative.attribute.any', allowedTargetTypes: ['attribute'], xpPerGrant: 50 }),
      expect.objectContaining({ awardId: 'intelligence-operative.flexible', remainingXp: 150 }),
      expect.objectContaining({ skillFieldChoice: { fieldId: POLICE_OFFICER_FIELD_ID, componentId: 'police-officer.driving-any' } }),
    ]))
    expect(character.traits.find((entry) => entry.traitId === 'trait.in-for-life')?.sourceAwards.some((entry) => entry.xp === -300)).toBe(true)
    expect(character.skills.find((entry) => entry.displayName === 'Protocol/Capellan')?.sourceAwards.some((entry) => entry.xp === 20)).toBe(true)
  })

  it('governs Detective and Intelligence Field choices without accepting reference guidance as acquisition', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const detective = applyStage3School(selecting, POLICE_ACADEMY_ID, [POLICE_OFFICER_FIELD_ID, DETECTIVE_FIELD_ID])
    expect(detective.creation.lifeModules!.pendingAwards).toEqual(expect.arrayContaining([
      expect.objectContaining({ skillFieldChoice: { fieldId: DETECTIVE_FIELD_ID, componentId: 'detective.security-systems-any' }, requiredSkillId: 'skill.security-systems' }),
    ]))
    expect(detective.skills.find((entry) => entry.displayName === 'Streetwise/Capellan')?.sourceAwards.some((entry) => entry.xp === 30)).toBe(true)

    const intelligence = applyStage3School(selecting, POLICE_ACADEMY_ID, [POLICE_OFFICER_FIELD_ID, INTELLIGENCE_FIELD_ID])
    expect(intelligence.creation.lifeModules!.pendingAwards).toEqual(expect.arrayContaining([
      expect.objectContaining({ skillFieldChoice: { fieldId: INTELLIGENCE_FIELD_ID, componentId: 'intelligence.language-any' }, requiredSkillId: 'skill.language' }),
    ]))
    expect(intelligence.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.moduleId === INTELLIGENCE_FIELD_ID && entry.prerequisiteId === 'intelligence.entry')?.status).toBe('satisfied')
  })

  it('requires the actual Naval Field for Marine rather than its component Skills or goal guidance', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const withFields = applyMilitaryAcademy(selecting, [BASIC_TRAINING_NAVAL_FIELD_ID, MARINE_FIELD_ID])
    const componentSkillsOnly = structuredClone(selecting)
    componentSkillsOnly.skills.push(...withFields.skills.filter((entry) => ['Martial Arts', 'MedTech/General', 'Navigation/Space', 'Small Arms', 'Zero-G Operations'].includes(entry.displayName ?? '')).map((entry) => structuredClone(entry)))
    componentSkillsOnly.creation.lifeModules!.masterSkillFieldGoalId = MARINE_FIELD_ID
    componentSkillsOnly.creation.lifeModules!.selectedSkillFields.push({ ...structuredClone(withFields.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === MARINE_FIELD_ID)!), id: 'component-only-marine' })
    reevaluateLifeModulePrerequisites(componentSkillsOnly)
    expect(componentSkillsOnly.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'marine.field')?.status).toBe('outstanding')
  })

  it('blocks the same Military family while allowing an unused Civilian family', () => {
    let military = applyMilitaryAcademy(continueToStage3(completeHighSchoolStage2()))
    const flexible = military.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'military-academy.flexible')!
    military = resolvePendingLifeModuleAward(military, flexible.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 100)
    const selecting = continueStage3Schooling(military)

    expect(() => applyStage3School(selecting, MILITARY_ENLISTMENT_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID])).toThrow('Another Military Stage 3 school has already been completed.')
    expect(() => applyStage3School(selecting, MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID])).toThrow('Military Academy has already been completed.')
    expect(applyStage3School(selecting, TECHNICAL_COLLEGE_ID, [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID]).lifeModuleHistory.at(-1)?.moduleId).toBe(TECHNICAL_COLLEGE_ID)
  })

  it('blocks both Intelligence/Police same-family directions while preserving unused-family routes', () => {
    const police = completePoliceAcademy()
    const afterPolice = continueStage3Schooling(police)
    expect(() => applyStage3School(afterPolice, INTELLIGENCE_OPERATIVE_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, SCOUT_FIELD_ID])).toThrow('Another Intelligence/Police Stage 3 school has already been completed.')
    expect(applyMilitaryAcademy(afterPolice).lifeModuleHistory.at(-1)?.moduleId).toBe(MILITARY_ACADEMY_ID)

    let intelligence = applyStage3School(continueToStage3(completeHighSchoolStage2()), INTELLIGENCE_OPERATIVE_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, POLICE_OFFICER_FIELD_ID])
    intelligence = resolveByAward(intelligence, 'intelligence-operative.attribute.any', 'DEX', 'DEX')
    const driving = intelligence.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.fieldId === POLICE_OFFICER_FIELD_ID)!
    intelligence = resolvePendingLifeModuleAward(intelligence, driving.id, { type: 'skill', targetId: 'skill.driving', displayName: 'Driving/Sea Vehicles', parameter: { kind: 'subskill', value: 'Sea Vehicles' } })
    const flexible = intelligence.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'intelligence-operative.flexible')!
    intelligence = resolvePendingLifeModuleAward(intelligence, flexible.id, { type: 'attribute', targetId: 'WIL', displayName: 'WIL' }, 150)
    expect(() => applyStage3School(continueStage3Schooling(intelligence), POLICE_ACADEMY_ID, [POLICE_OFFICER_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID])).toThrow('Another Intelligence/Police Stage 3 school has already been completed.')
  })

  it('applies Officer Candidate School as an optional secondary school without consuming a normal family', () => {
    let military = applyMilitaryAcademy(continueToStage3(completeHighSchoolStage2(10000)), [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID])
    const militaryFlexible = military.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'military-academy.flexible')!
    military = resolvePendingLifeModuleAward(military, militaryFlexible.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 100)
    const committedBefore = structuredClone(military)

    let officer = applyStage3School(continueStage3Schooling(military), OFFICER_TRAINING_SCHOOL_ID, [OFFICER_FIELD_ID])
    expect(military).toEqual(committedBefore)
    expect(officer.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: OFFICER_TRAINING_SCHOOL_ID, displayName: 'Officer Candidate School', baseCostXp: 550, fieldCostXp: 120, costXp: 670 })
    expect(officer.creation.lifeModules!.selectedSkillFields.at(-1)).toMatchObject({ fieldId: OFFICER_FIELD_ID, purchaseCostXp: 120, chronologyYears: 1 })
    expect(officer.creation.lifeModules!.pendingAwards).toContainEqual(expect.objectContaining({ awardId: 'officer-candidate-school.flexible', remainingXp: 115 }))
    expect(officer.traits.find((entry) => entry.traitId === 'trait.rank')).toMatchObject({ accumulatedXp: 450, attainedTp: 4 })
    expect(officer.attributes.find((entry) => entry.attributeId === 'CHA')!.accumulatedXp - military.attributes.find((entry) => entry.attributeId === 'CHA')!.accumulatedXp).toBe(100)
    expect(officer.attributes.find((entry) => entry.attributeId === 'EDG')!.accumulatedXp - military.attributes.find((entry) => entry.attributeId === 'EDG')!.accumulatedXp).toBe(-200)
    const expectedOfficerSkills = ['Administration', 'Leadership', 'Melee Weapons', 'Protocol/Capellan', 'Training']
    expect(expectedOfficerSkills.every((name) => officer.skills.some((entry) => entry.displayName === name))).toBe(true)
    expect(officer.creation.lifeModules!.prerequisiteIssues.filter((entry) => entry.moduleId === OFFICER_FIELD_ID).every((entry) => entry.status === 'satisfied')).toBe(true)
    expect(officer.chronology.find((entry) => entry.eventId === `${OFFICER_TRAINING_SCHOOL_ID}.complete`)?.date).toBe('age:19')

    const officerFlexible = officer.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'officer-candidate-school.flexible')!
    officer = resolvePendingLifeModuleAward(officer, officerFlexible.id, { type: 'attribute', targetId: 'WIL', displayName: 'WIL' }, 115)
    expect(officer.creation.lifeModules!.phase).toBe('alpha-stage-3-stop')
    const selecting = continueStage3Schooling(officer)
    expect(() => applyMilitaryEnlistment(selecting)).toThrow('Another Military Stage 3 school has already been completed.')
    expect(applyStage3School(selecting, TECHNICAL_COLLEGE_ID, [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID]).lifeModuleHistory.at(-1)?.moduleId).toBe(TECHNICAL_COLLEGE_ID)
    expect(continueToStage4(officer).creation.lifeModules!.phase).toBe('stage-4-selection')

    const decoded = decodeCharacter(encodeCharacter(officer, '2026-10-03T00:00:00.000Z'))
    expect(decoded).toEqual(officer)
    expect(decoded.creation.lifeModules!.selectedSkillFields.filter((entry) => entry.fieldId === OFFICER_FIELD_ID)).toHaveLength(1)
    expect(validateCharacter(decoded).valid).toBe(true)
  })

  it('enforces Officer Candidate School entry while supporting the Intelligence/Police route', () => {
    const initial = continueToStage3(completeHighSchoolStage2(10000))
    expect(() => applyStage3School(initial, OFFICER_TRAINING_SCHOOL_ID, [OFFICER_FIELD_ID])).toThrow('requires prior Intelligence/Police or Military schooling')
    expect(() => applyStage3School(continueStage3Schooling(completeTechnicalCollegeStage3(10000)), OFFICER_TRAINING_SCHOOL_ID, [OFFICER_FIELD_ID])).toThrow('only Intelligence/Police or Military')

    let intelligence = applyStage3School(initial, INTELLIGENCE_OPERATIVE_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, POLICE_OFFICER_FIELD_ID])
    intelligence = resolveByAward(intelligence, 'intelligence-operative.attribute.any', 'DEX', 'DEX')
    const driving = intelligence.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.fieldId === POLICE_OFFICER_FIELD_ID)!
    intelligence = resolvePendingLifeModuleAward(intelligence, driving.id, { type: 'skill', targetId: 'skill.driving', displayName: 'Driving/Ground Vehicles', parameter: { kind: 'subskill', value: 'Ground Vehicles' } })
    const intelligenceFlexible = intelligence.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'intelligence-operative.flexible')!
    intelligence = resolvePendingLifeModuleAward(intelligence, intelligenceFlexible.id, { type: 'attribute', targetId: 'WIL', displayName: 'WIL' }, 150)

    let officer = applyStage3School(continueStage3Schooling(intelligence), OFFICER_TRAINING_SCHOOL_ID, [OFFICER_FIELD_ID])
    expect(officer.creation.lifeModules!.prerequisiteIssues.filter((entry) => entry.moduleId === OFFICER_FIELD_ID).every((entry) => entry.status === 'satisfied')).toBe(true)
    expect(officer.traits.find((entry) => entry.traitId === 'trait.rank')).toMatchObject({ accumulatedXp: 500, attainedTp: 5 })
    const officerFlexible = officer.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'officer-candidate-school.flexible')!
    officer = resolvePendingLifeModuleAward(officer, officerFlexible.id, { type: 'attribute', targetId: 'CHA', displayName: 'CHA' }, 115)
    const selecting = continueStage3Schooling(officer)
    expect(() => applyStage3School(selecting, POLICE_ACADEMY_ID, [POLICE_OFFICER_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID])).toThrow('Another Intelligence/Police Stage 3 school has already been completed.')
    expect(() => applyStage3School(selecting, OFFICER_TRAINING_SCHOOL_ID, [OFFICER_FIELD_ID])).toThrow('Officer Candidate School has already been completed.')
  })

  it('represents all three general Stage 3 families cumulatively and exhausts normal family choices', () => {
    let character = completeTechnicalCollegeStage3(10000)
    character = applyMilitaryAcademy(continueStage3Schooling(character), [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID])
    const militaryFlexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'military-academy.flexible')!
    character = resolvePendingLifeModuleAward(character, militaryFlexible.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 100)
    character = completePoliceAcademy(continueStage3Schooling(character))

    expect(character.lifeModuleHistory.filter((entry) => entry.stage === 3).map((entry) => entry.moduleId)).toEqual([
      TECHNICAL_COLLEGE_ID, MILITARY_ACADEMY_ID, POLICE_ACADEMY_ID,
    ])
    expect(character.creation.lifeModules!.selectedSkillFields).toHaveLength(6)
    expect(character.chronology.find((entry) => entry.eventId === `${POLICE_ACADEMY_ID}.complete`)?.date).toBe('age:22.5')
    expect(() => continueStage3Schooling(character)).toThrow('No additional implemented Stage 3 school family is available.')
    expect(continueToStage4(character).creation.lifeModules!.phase).toBe('stage-4-selection')
    const decoded = decodeCharacter(encodeCharacter(character, '2026-10-02T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(validateCharacter(decoded).valid).toBe(true)
  })

  it('commits legal cross-family Stage 3 schooling cumulatively and round-trips without drift', () => {
    const first = completeTechnicalCollegeStage3()
    const beforeSecond = structuredClone(first)
    let character = applyMilitaryAcademy(continueStage3Schooling(first), [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID])

    expect(first).toEqual(beforeSecond)
    expect(character.lifeModuleHistory.filter((entry) => entry.stage === 3).map((entry) => entry.moduleId)).toEqual([TECHNICAL_COLLEGE_ID, MILITARY_ACADEMY_ID])
    expect(character.creation.lifeModules!.selectedSkillFields.map((entry) => entry.fieldId)).toEqual([
      TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID, BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID,
    ])
    expect(character.chronology.find((entry) => entry.eventId === `${TECHNICAL_COLLEGE_ID}.complete`)?.date).toBe('age:19')
    expect(character.chronology.find((entry) => entry.eventId === `${MILITARY_ACADEMY_ID}.complete`)?.date).toBe('age:21')
    expect(character.creation.lifeModules!.moduleXp).toEqual({ starting: 5000, spent: 3520, remaining: 1480 })

    const technicalAwardsBefore = character.skills.flatMap((entry) => entry.sourceAwards).filter((award) => beforeSecond.provenance.some((entry) => entry.id === award.provenanceId)).length
    const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'military-academy.flexible')!
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 100)
    expect(character.creation.lifeModules!.phase).toBe('alpha-stage-3-stop')
    expect(character.skills.flatMap((entry) => entry.sourceAwards).filter((award) => beforeSecond.provenance.some((entry) => entry.id === award.provenanceId))).toHaveLength(technicalAwardsBefore)

    const decoded = decodeCharacter(encodeCharacter(character, '2026-10-02T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(validateCharacter(decoded).valid).toBe(true)
    expect(decoded.creation.lifeModules!.moduleXp).toEqual(character.creation.lifeModules!.moduleXp)
    expect(decoded.creation.lifeModules!.selectedSkillFields).toHaveLength(4)
    expect(decoded.creation.lifeModules!.pendingAwards).toHaveLength(0)
    expect(continueToStage4(decoded).creation.lifeModules!.phase).toBe('stage-4-selection')
  })

  it('keeps repetition optional and preserves the reverse same-family rejection', () => {
    expect(continueToStage4(completeTechnicalCollegeStage3()).creation.lifeModules!.phase).toBe('stage-4-selection')
    let enlistment = applyMilitaryEnlistment(continueToStage3(completeHighSchoolStage2()))
    const flexible = enlistment.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'military-enlistment.flexible')!
    enlistment = resolvePendingLifeModuleAward(enlistment, flexible.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 200)
    const selecting = continueStage3Schooling(enlistment)
    expect(() => applyMilitaryAcademy(selecting)).toThrow('Another Military Stage 3 school has already been completed.')
  })

  it('requires actual Basic Training for Infantry and does not accept component Skills alone', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const withTraining = applyMilitaryEnlistment(selecting)
    expect(withTraining.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'infantry.field')?.status).toBe('satisfied')
    const componentSkillsOnly = structuredClone(selecting)
    componentSkillsOnly.skills.push(...withTraining.skills.filter((entry) => ['Career/Soldier', 'Martial Arts', 'MedTech/General', 'Navigation/Ground', 'Small Arms'].includes(entry.displayName ?? '')).map((entry) => structuredClone(entry)))
    componentSkillsOnly.creation.lifeModules!.selectedSkillFields.push({ ...structuredClone(withTraining.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === INFANTRY_FIELD_ID)!), id: 'component-only-infantry' })
    reevaluateLifeModulePrerequisites(componentSkillsOnly)
    expect(componentSkillsOnly.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'infantry.field')?.status).toBe('outstanding')
  })

  it('round-trips committed Military Academy, Infantry, and unresolved flexible XP', () => {
    const character = applyMilitaryAcademy(continueToStage3(completeHighSchoolStage2()))
    const decoded = decodeCharacter(encodeCharacter(character, '2026-10-02T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(decoded.creation.lifeModules!.selectedSkillFields.map((entry) => entry.fieldId)).toEqual([BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID])
    expect(decoded.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'military-academy.flexible')?.remainingXp).toBe(100)
    expect(validateCharacter(decoded).valid).toBe(true)
  })

  it('requires and durably resolves the source-backed MechWarrior Technician/Any Field Skill', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const before = JSON.stringify(selecting)
    let character = applyMilitaryAcademy(selecting, [BASIC_TRAINING_FIELD_ID, MECHWARRIOR_FIELD_ID])
    const state = character.creation.lifeModules!
    const pending = state.pendingAwards.find((entry) => entry.skillFieldChoice?.fieldId === MECHWARRIOR_FIELD_ID)!

    expect(character.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: MILITARY_ACADEMY_ID, costXp: 1070, fieldCostXp: 240 })
    expect(state.selectedSkillFields.find((entry) => entry.fieldId === MECHWARRIOR_FIELD_ID)).toMatchObject({ purchaseCostXp: 120, xpPerSkill: 30, chronologyYears: 1, variableSkillChoices: [] })
    expect(pending).toMatchObject({ kind: 'any-skill-choice', requiredSkillId: 'skill.technician', xpPerGrant: 30, remainingGrants: 1 })
    expect(character.skills.some((entry) => entry.address.skillId === 'skill.technician' && TECHNICIAN_SUBSKILLS.includes(entry.address.parameter?.value as typeof TECHNICIAN_SUBSKILLS[number]))).toBe(false)
    expect(state.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'mechwarrior.field')?.status).toBe('satisfied')
    expect(JSON.stringify(selecting)).toBe(before)

    character = resolvePendingLifeModuleAward(character, pending.id, {
      type: 'skill', targetId: 'skill.technician', displayName: 'Technician/Weapons', parameter: { kind: 'subskill', value: 'Weapons' },
    })
    expect(character.skills.find((entry) => entry.displayName === 'Technician/Weapons')).toMatchObject({ accumulatedXp: 30 })
    expect(character.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === MECHWARRIOR_FIELD_ID)?.variableSkillChoices).toEqual([
      expect.objectContaining({ componentId: 'mechwarrior.technician-any', destination: expect.objectContaining({ displayName: 'Technician/Weapons' }) }),
    ])
    expect(character.creation.lifeModules!.pendingAwards.some((entry) => entry.skillFieldChoice?.fieldId === MECHWARRIOR_FIELD_ID)).toBe(false)

    const decoded = decodeCharacter(encodeCharacter(character, '2026-10-02T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(decoded.skills.filter((entry) => entry.displayName === 'Technician/Weapons')).toHaveLength(1)
    expect(validateCharacter(decoded).valid).toBe(true)
  })

  it('does not accept MechWarrior component Skills in place of actual Basic Training', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const withFields = applyMilitaryAcademy(selecting, [BASIC_TRAINING_FIELD_ID, MECHWARRIOR_FIELD_ID])
    const componentSkillsOnly = structuredClone(selecting)
    componentSkillsOnly.skills.push(...withFields.skills.filter((entry) => ['Career/Soldier', 'Martial Arts', 'MedTech/General', 'Navigation/Ground', 'Small Arms'].includes(entry.displayName ?? '')).map((entry) => structuredClone(entry)))
    componentSkillsOnly.creation.lifeModules!.selectedSkillFields.push({ ...structuredClone(withFields.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === MECHWARRIOR_FIELD_ID)!), id: 'component-only-mechwarrior' })
    reevaluateLifeModulePrerequisites(componentSkillsOnly)
    expect(componentSkillsOnly.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'mechwarrior.field')?.status).toBe('outstanding')
  })

  it('adds the variable Field award to an existing concrete Technician Skill without duplication', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    selecting.skills.push({
      address: { skillId: 'skill.technician', parameter: { kind: 'subskill', value: 'Weapons' } },
      displayName: 'Technician/Weapons', accumulatedXp: 10, level: null, sourceAwards: [],
    })
    let character = applyMilitaryAcademy(selecting, [BASIC_TRAINING_FIELD_ID, MECHWARRIOR_FIELD_ID])
    const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.fieldId === MECHWARRIOR_FIELD_ID)!
    character = resolvePendingLifeModuleAward(character, pending.id, {
      type: 'skill', targetId: 'skill.technician', displayName: 'Technician/Weapons', parameter: { kind: 'subskill', value: 'Weapons' },
    })
    expect(character.skills.filter((entry) => entry.displayName === 'Technician/Weapons')).toHaveLength(1)
    expect(character.skills.find((entry) => entry.displayName === 'Technician/Weapons')?.accumulatedXp).toBe(40)
  })

  it('requires Analysis to use two distinct explicit Language choices', () => {
    let character = applyStage3School(continueToStage3(completeHighSchoolStage2()), POLICE_ACADEMY_ID, [POLICE_OFFICER_FIELD_ID, ANALYSIS_FIELD_ID])
    const languageChoices = character.creation.lifeModules!.pendingAwards.filter((entry) => entry.skillFieldChoice?.fieldId === ANALYSIS_FIELD_ID && entry.requiredSkillId === 'skill.language')
    expect(languageChoices).toHaveLength(2)
    expect(languageChoices.every((entry) => entry.remainingGrants === 1)).toBe(true)
    character = resolvePendingLifeModuleAward(character, languageChoices[0].id, {
      type: 'skill', targetId: 'skill.language', displayName: 'Language/Mandarin Chinese', parameter: { kind: 'subskill', value: 'Mandarin Chinese' },
    })
    expect(() => resolvePendingLifeModuleAward(character, languageChoices[1].id, {
      type: 'skill', targetId: 'skill.language', displayName: 'Language/Mandarin Chinese', parameter: { kind: 'subskill', value: 'Mandarin Chinese' },
    })).toThrow('distinct concrete destination')
  })

  it.each([
    [CARTOGRAPHER_FIELD_ID, 144, 6, 'Career/Cartographer'],
    [PILOT_INDUSTRIALMECH_FIELD_ID, 120, 5, 'Piloting/Mech'],
    [TECHNICIAN_AEROSPACE_FIELD_ID, 120, 5, 'Technician/Aeronautics'],
    [TECHNICIAN_MECH_FIELD_ID, 120, 5, 'Technician/Jet'],
  ] as const)('acquires bounded Advanced Field %s with exact cost and +30 XP awards', (fieldId, cost, skillCount, representativeSkill) => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    const committedJson = JSON.stringify(selecting)
    const character = applyTechnicalCollege(selecting, [TECHNICIAN_CIVILIAN_FIELD_ID, fieldId])
    const grant = character.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === fieldId)
    expect(grant).toMatchObject({ purchaseCostXp: cost, xpPerSkill: 30, chronologyYears: 2 })
    expect(character.skills.find((entry) => entry.displayName === representativeSkill)?.sourceAwards.some((award) => award.xp === 30)).toBe(true)
    expect(character.creation.lifeModules!.selectedSkillFields).toHaveLength(2)
    expect(JSON.parse(committedJson).creation.lifeModules.selectedSkillFields).toEqual([])
    expect(character.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === fieldId)).toBeDefined()
    expect(skillCount).toBeGreaterThan(0)
  })

  it('acquires Pilot/Exoskeleton as the alternate Basic Field and preserves exact awards', () => {
    const character = applyTechnicalCollege(continueToStage3(completeHighSchoolStage2()), [PILOT_EXOSKELETON_FIELD_ID, CARTOGRAPHER_FIELD_ID])
    expect(character.creation.lifeModules!.selectedSkillFields.map((entry) => [entry.fieldId, entry.purchaseCostXp])).toEqual([
      [PILOT_EXOSKELETON_FIELD_ID, 120],
      [CARTOGRAPHER_FIELD_ID, 144],
    ])
    expect(character.skills.find((entry) => entry.displayName === 'Piloting/Battlesuit')?.accumulatedXp).toBe(30)
    expect(character.skills.find((entry) => entry.displayName === 'Technician/Myomer')?.accumulatedXp).toBe(30)
    expect(character.creation.lifeModules!.prerequisiteIssues.filter((entry) => entry.moduleId === PILOT_EXOSKELETON_FIELD_ID).map((entry) => entry.prerequisiteId)).toEqual(['pilot-exoskeleton.str', 'pilot-exoskeleton.bod'])
  })

  it('requires an actually acquired Technician Field for dependent Fields', () => {
    const withActualField = applyTechnicalCollege(continueToStage3(completeHighSchoolStage2()), [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_AEROSPACE_FIELD_ID])
    expect(withActualField.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'technician-aerospace.prior-field')?.status).toBe('satisfied')

    const componentSkillsOnly = continueToStage3(completeHighSchoolStage2())
    componentSkillsOnly.skills.push(...withActualField.skills.filter((entry) => entry.displayName?.startsWith('Technician/')).map((entry) => structuredClone(entry)))
    const withoutField = applyTechnicalCollege(componentSkillsOnly, [PILOT_EXOSKELETON_FIELD_ID, TECHNICIAN_AEROSPACE_FIELD_ID])
    expect(withoutField.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'technician-aerospace.prior-field')?.status).toBe('outstanding')
  })

  it('does not duplicate Field grants or Skill awards', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    expect(() => applyTechnicalCollege(selecting, [TECHNICIAN_CIVILIAN_FIELD_ID, CARTOGRAPHER_FIELD_ID, CARTOGRAPHER_FIELD_ID])).toThrow('more than once')
    const character = applyTechnicalCollege(selecting, [TECHNICIAN_CIVILIAN_FIELD_ID, CARTOGRAPHER_FIELD_ID])
    expect(character.creation.lifeModules!.selectedSkillFields.filter((entry) => entry.fieldId === CARTOGRAPHER_FIELD_ID)).toHaveLength(1)
    expect(character.skills.find((entry) => entry.displayName === 'Career/Cartographer')?.sourceAwards.filter((award) => award.xp === 30)).toHaveLength(1)
  })

  it('tracks and re-evaluates Technical College Skill Field prerequisites', () => {
    let character = applyTechnicalCollege(continueToStage3(completeHighSchoolStage2()))
    const state = character.creation.lifeModules!
    expect(state.prerequisiteIssues.filter((entry) => entry.status === 'outstanding').map((entry) => entry.prerequisiteId)).toEqual([
      'technician-civilian.int', 'technician-vehicle.int',
    ])
    expect(state.prerequisiteIssues.find((entry) => entry.prerequisiteId === 'technician-vehicle.prior-field')?.status).toBe('satisfied')
    character = resolveByAward(character, 'technical-college.interest', 'skill.interest', 'Interest/Engineering', 'Engineering')
    const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'technical-college.flexible')!
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 150)
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'trait', targetId: 'trait.patient', displayName: 'Patient' }, 50)
    expect(character.attributes.find((entry) => entry.attributeId === 'INT')).toMatchObject({ accumulatedXp: 400, purchasedLevel: 4 })
    expect(character.creation.lifeModules!.prerequisiteIssues.every((entry) => entry.status === 'satisfied')).toBe(true)
    expect(character.creation.lifeModules!.phase).toBe('alpha-stage-3-stop')
    expect(character.creation.lifeModules!.stopState).toBe('alpha-stage-3-stop')
  })

  it('rejects invalid Technical College Field selections', () => {
    const selecting = continueToStage3(completeHighSchoolStage2())
    expect(() => applyStage3School(selecting, 'stage3.unknown', [])).toThrow('Unknown Alpha Stage 3 school')
    expect(() => applyTechnicalCollege(selecting, [])).toThrow('exactly one Basic')
    expect(() => applyTechnicalCollege(selecting, [TECHNICIAN_CIVILIAN_FIELD_ID])).toThrow('at least one Advanced')
    expect(() => applyTechnicalCollege(selecting, [TECHNICIAN_CIVILIAN_FIELD_ID, 'field.unknown'])).toThrow('not offered')
    expect(() => applyTechnicalCollege(selecting, [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID])).toThrow('more than once')
  })

  it('validates missing, excessive, and unknown durable Skill Field records', () => {
    const missing = applyTechnicalCollege(continueToStage3(completeHighSchoolStage2()))
    missing.creation.lifeModules!.selectedSkillFields = missing.creation.lifeModules!.selectedSkillFields.filter((entry) => entry.category !== 'advanced')
    expect(validateCharacter(missing).issues.map((entry) => entry.id)).toContain('life-modules.skill-field.advanced.required')

    const excessive = applyTechnicalCollege(continueToStage3(completeHighSchoolStage2()))
    const basic = excessive.creation.lifeModules!.selectedSkillFields[0]
    excessive.creation.lifeModules!.selectedSkillFields.push(
      { ...structuredClone(basic), id: 'extra-field-1' },
      { ...structuredClone(basic), id: 'extra-field-2' },
    )
    expect(validateCharacter(excessive).issues.map((entry) => entry.id)).toContain('life-modules.skill-field.maximum')

    const unknown = applyTechnicalCollege(continueToStage3(completeHighSchoolStage2()))
    unknown.creation.lifeModules!.selectedSkillFields[0].fieldId = 'field.unknown'
    expect(validateCharacter(unknown).issues.map((entry) => entry.id)).toContain('life-modules.skill-field.unknown')
  })

  it('validates malformed Stage 3 Field records, cost, age, and premature Stage 4 selection', () => {
    const character = applyTechnicalCollege(continueToStage3(completeHighSchoolStage2()))
    character.creation.lifeModules!.selectedSkillFields[0].purchaseCostXp = 121
    character.chronology.at(-1)!.date = 'age:18'
    character.creation.lifeModules!.phase = 'stage-4-selection'
    const ids = validateCharacter(character).issues.map((entry) => entry.id)
    expect(ids).toEqual(expect.arrayContaining([
      'life-modules.module.malformed',
      'life-modules.skill-field.malformed',
      'life-modules.stage-3.age.malformed',
      'life-modules.phase.malformed',
    ]))
  })

  it('round-trips durable Stage 3 school, Field, resolved, and unresolved state', () => {
    let character = applyTechnicalCollege(continueToStage3(completeHighSchoolStage2()))
    character = resolveByAward(character, 'technical-college.interest', 'skill.interest', 'Interest/Engineering', 'Engineering')
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-23T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(decoded.creation.lifeModules!.selectedSkillFields).toHaveLength(2)
    expect(decoded.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'technical-college.flexible')?.remainingXp).toBe(200)
    expect(validateCharacter(decoded).valid).toBe(true)
  })

  it('continues from Stage 3 and applies Agitator cost, fixed awards, pending awards, and age', () => {
    let character = continueToStage4(completeTechnicalCollegeStage3())
    expect(character.creation.lifeModules!.phase).toBe('stage-4-selection')
    character = applyAgitator(character)
    const state = character.creation.lifeModules!
    expect(state.moduleXp).toEqual({ starting: 5000, spent: 3326, remaining: 1674 })
    expect(character.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: AGITATOR_ID, stage: 4, costXp: 900, chronologyYears: 4 })
    expect(character.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(215)
    expect(Object.fromEntries(character.traits.filter((entry) => ['trait.bloodmark', 'trait.gregarious', 'trait.toughness', 'trait.reputation'].includes(entry.traitId)).map((entry) => [entry.traitId, entry.accumulatedXp]))).toMatchObject({
      'trait.bloodmark': -50,
      'trait.gregarious': 80,
      'trait.toughness': 80,
      'trait.reputation': -150,
    })
    expect(Object.fromEntries(character.skills.filter((entry) => ['Acting', 'Disguise', 'Leadership', 'Negotiation', 'Perception', 'Small Arms', 'Tactics/Infantry', 'Training'].includes(entry.displayName ?? '')).map((entry) => [entry.displayName!, entry.accumulatedXp]))).toMatchObject({
      Acting: 50,
      Disguise: 75,
      Leadership: 60,
      Negotiation: 80,
      Perception: 80,
      'Small Arms': 75,
      'Tactics/Infantry': 40,
      Training: 50,
    })
    expect(state.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining([
      'agitator.skill.driving',
      'agitator.skill.prestidigitation',
      'agitator.flexible',
    ]))
    expect(state.pendingAwards.find((entry) => entry.awardId === 'agitator.flexible')).toMatchObject({ remainingXp: 125, maxXpPerTarget: { attribute: 50 } })
    expect(character.chronology.at(-1)).toMatchObject({ date: 'age:23', eventId: `${AGITATOR_ID}.complete` })
    expect(state.phase).toBe('stage-4-resolution')
  })

  it('resolves Agitator choices and enforces its flexible Attribute cap', () => {
    let character = applyAgitator(continueToStage4(completeTechnicalCollegeStage3()))
    character = resolveByAward(character, 'agitator.skill.driving', 'skill.driving', 'Driving/Ground Car', 'Ground Car')
    character = resolveByAward(character, 'agitator.skill.prestidigitation', 'skill.prestidigitation', 'Prestidigitation/Sleight of Hand', 'Sleight of Hand')
    const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'agitator.flexible')!
    expect(() => resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'STR', displayName: 'STR' }, 51)).toThrow('no more than 50 XP')
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'STR', displayName: 'STR' }, 50)
    character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'skill', targetId: 'skill.acting', displayName: 'Acting' }, 75)
    expect(character.skills.find((entry) => entry.displayName === 'Driving/Ground Car')?.accumulatedXp).toBe(65)
    expect(character.skills.find((entry) => entry.displayName === 'Prestidigitation/Sleight of Hand')?.accumulatedXp).toBe(100)
    expect(character.skills.find((entry) => entry.displayName === 'Streetwise/Capellan')?.accumulatedXp).toBe(95)
    expect(character.creation.lifeModules!.pendingAwards).toEqual([])
    expect(character.creation.lifeModules!.phase).toBe('alpha-stage-4-stop')
    expect(character.creation.lifeModules!.stopState).toBe('alpha-stage-4-stop')
    expect(validateCharacter(character).valid).toBe(true)
  })

  it('preserves Agitator repeat policy and rejects unsupported Stage 4 paths', () => {
    const selecting = continueToStage4(completeTechnicalCollegeStage3())
    expect(() => applyStage4Module(selecting, 'stage4.unknown')).toThrow('Unknown Alpha Stage 4 module')
    const character = applyStage4Module(selecting, AGITATOR_ID)
    expect(character.lifeModuleHistory.at(-1)?.repeatPolicy).toEqual({
      sameModuleRepeat: 'deferred',
      repeatCost: 'full-module-cost',
      repeatAwards: { skills: 'repeat', flexibleXp: 'repeat', attributes: 'first-occurrence-only', traits: 'first-occurrence-only' },
    })
    expect(() => applyAgitator(character)).toThrow('not the current legal action')

    const repeated = structuredClone(character)
    repeated.lifeModuleHistory.push({ ...structuredClone(repeated.lifeModuleHistory.at(-1)!), selectedAt: 'later' })
    repeated.creation.lifeModules!.selectedModuleIds.push(AGITATOR_ID)
    repeated.creation.lifeModules!.moduleXp.spent += 900
    repeated.creation.lifeModules!.moduleXp.remaining -= 900
    repeated.xp.creation.remaining -= 900
    const ids = validateCharacter(repeated).issues.map((entry) => entry.id)
    expect(ids).toEqual(expect.arrayContaining(['life-modules.module.duplicate', 'life-modules.stage-4.multiple', 'life-modules.stage-4.repeat.unsupported']))
  })

  it('validates malformed Agitator age, repeat metadata, and unsupported finalization', () => {
    const character = applyAgitator(continueToStage4(completeTechnicalCollegeStage3()))
    character.chronology.at(-1)!.date = 'age:22'
    delete character.lifeModuleHistory.at(-1)!.repeatPolicy
    character.creation.status = 'finalized'
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toEqual(expect.arrayContaining([
      'life-modules.module.malformed',
      'life-modules.stage-4.age.malformed',
      'life-modules.stage-4.repeat-policy.malformed',
      'life-modules.finalization.unsupported',
    ]))
  })

  it('round-trips durable Stage 4 module, repeat policy, resolved, and unresolved state', () => {
    let character = applyAgitator(continueToStage4(completeTechnicalCollegeStage3()))
    character = resolveByAward(character, 'agitator.skill.driving', 'skill.driving', 'Driving/Ground Car', 'Ground Car')
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-23T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(decoded.lifeModuleHistory.at(-1)?.repeatPolicy?.sameModuleRepeat).toBe('deferred')
    expect(decoded.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'agitator.flexible')?.remainingXp).toBe(125)
    expect(decoded.chronology.at(-1)?.date).toBe('age:23')
    expect(validateCharacter(decoded).valid).toBe(true)
  })

  it('enters final review with a separate allocation pool and deferred negative-Trait cap', () => {
    const character = enterLifeModuleFinalReview(completeAgitatorStage4())
    const review = character.creation.lifeModules!.finalReview!
    expect(character.creation.lifeModules!.phase).toBe('alpha-final-review')
    expect(character.creation.lifeModules!.moduleXp).toEqual({ starting: 5000, spent: 3326, remaining: 1674 })
    expect(review.allocationPool).toEqual({ starting: 1674, allocated: 0, optimizationReturned: 0, remaining: 1674 })
    expect(review.negativeTraitXpPurchase).toEqual({ capXp: 500, purchasedXp: 0, uiStatus: 'deferred' })
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('life-modules.final-review.xp.unallocated')
  })

  it('allocates final XP to existing Attributes, Skills, and modeled Traits without overspending', () => {
    let character = enterLifeModuleFinalReview(completeAgitatorStage4())
    character = allocateFinalReviewXp(character, { type: 'attribute', targetId: 'STR', displayName: 'STR' }, 25)
    character = allocateFinalReviewXp(character, { type: 'skill', targetId: 'skill.acting', displayName: 'Acting' }, 5)
    character = allocateFinalReviewXp(character, { type: 'trait', targetId: 'trait.patient', displayName: 'Patient' }, 50)
    expect(character.creation.lifeModules!.finalReview!.allocationPool).toMatchObject({ allocated: 80, remaining: 1594 })
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')).toMatchObject({ accumulatedXp: 230, purchasedLevel: 2 })
    expect(character.skills.find((entry) => entry.address.skillId === 'skill.acting')).toMatchObject({ accumulatedXp: 130, level: 4 })
    expect(character.traits.find((entry) => entry.traitId === 'trait.patient')).toMatchObject({ accumulatedXp: 100, attainedTp: 1, active: true })
    expect(() => allocateFinalReviewXp(character, { type: 'attribute', targetId: 'STR', displayName: 'STR' }, 1595)).toThrow('overspend')
    expect(character.creation.lifeModules!.finalReview!.allocations.every((entry) => character.provenance.some((provenance) => provenance.id === entry.provenanceId))).toBe(true)
  })

  it('derives only fully attained levels and previews supported Optimization', () => {
    const character = enterLifeModuleFinalReview(completeAgitatorStage4())
    const str = character.attributes.find((entry) => entry.attributeId === 'STR')!
    const acting = character.skills.find((entry) => entry.address.skillId === 'skill.acting')!
    const patient = character.traits.find((entry) => entry.traitId === 'trait.patient')!
    str.accumulatedXp = 325
    acting.accumulatedXp = 75
    patient.accumulatedXp = 200
    const preview = previewLifeModuleOptimization(character)
    expect(preview).toEqual(expect.arrayContaining([
      expect.objectContaining({ beforeXp: 325, afterXp: 300, returnedXp: 25 }),
      expect.objectContaining({ beforeXp: 75, afterXp: 50, returnedXp: 25 }),
      expect.objectContaining({ beforeXp: 200, afterXp: 100, returnedXp: 100 }),
    ]))
  })

  it('re-evaluates final prerequisites after final allocation', () => {
    let character = enterLifeModuleFinalReview(completeAgitatorStage4())
    const intelligence = character.attributes.find((entry) => entry.attributeId === 'INT')!
    intelligence.accumulatedXp = 399
    intelligence.purchasedLevel = 3
    reevaluateLifeModulePrerequisites(character)
    expect(character.creation.lifeModules!.prerequisiteIssues.some((entry) => entry.prerequisiteId === 'technician-vehicle.int' && entry.status === 'outstanding')).toBe(true)
    character = allocateFinalReviewXp(character, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 1)
    expect(character.creation.lifeModules!.prerequisiteIssues.some((entry) => entry.prerequisiteId === 'technician-vehicle.int' && entry.status === 'satisfied')).toBe(true)
  })

  it('applies Optimization explicitly, returns XP, and records provenance', () => {
    let character = enterLifeModuleFinalReview(completeAgitatorStage4())
    const str = character.attributes.find((entry) => entry.attributeId === 'STR')!
    str.accumulatedXp = 325
    str.purchasedLevel = 3
    const opportunity = previewLifeModuleOptimization(character).find((entry) => entry.destination.type === 'attribute' && entry.destination.targetId === 'STR')!
    character = applyLifeModuleOptimization(character, opportunity.id)
    const review = character.creation.lifeModules!.finalReview!
    expect(character.attributes.find((entry) => entry.attributeId === 'STR')).toMatchObject({ accumulatedXp: 300, purchasedLevel: 3 })
    expect(review.allocationPool).toMatchObject({ optimizationReturned: 25, remaining: 1699 })
    expect(review.optimizations[0]).toMatchObject({ beforeXp: 325, afterXp: 300, returnedXp: 25 })
    expect(character.provenance.some((entry) => entry.id === review.optimizations[0].provenanceId && entry.kind === 'derived')).toBe(true)
    const insufficientSkill = previewLifeModuleOptimization(character).find((entry) => entry.destination.type === 'skill' && entry.beforeXp > 0 && entry.beforeXp < 20)!
    character = applyLifeModuleOptimization(character, insufficientSkill.id)
    expect(character.creation.lifeModules!.finalReview!.optimizations.at(-1)).toMatchObject({ afterXp: 0 })
    expect(validateCharacter(character).issues.map((entry) => entry.id)).not.toContain('life-modules.optimization.malformed')
    expect(() => previewLifeModuleOptimization(createPointBuyCharacter('Not Life Modules'))).toThrow('only to Life Module')
  })

  it('validates modeled opposed Traits and Illiterate against Language Level +4', () => {
    const character = enterLifeModuleFinalReview(completeAgitatorStage4())
    const provenanceId = character.provenance[0].id
    character.traits.push(
      { traitId: 'trait.introvert', displayName: 'Introvert', accumulatedXp: -100, attainedTp: -1, active: true, parameters: {}, sourceAwards: [{ id: 'test-introvert', xp: -100, provenanceId }] },
      { traitId: 'trait.illiterate', displayName: 'Illiterate', accumulatedXp: -100, attainedTp: -1, active: true, parameters: {}, sourceAwards: [{ id: 'test-illiterate', xp: -100, provenanceId }] },
    )
    character.traits.find((entry) => entry.traitId === 'trait.gregarious')!.accumulatedXp = 100
    character.traits.find((entry) => entry.traitId === 'trait.gregarious')!.attainedTp = 1
    character.traits.find((entry) => entry.traitId === 'trait.gregarious')!.active = true
    const language = character.skills.find((entry) => entry.address.skillId === 'skill.language')!
    language.accumulatedXp = 120
    language.level = 4
    const conflicts = validateCharacter(character).issues.filter((entry) => entry.id === 'life-modules.opposed-traits.conflict')
    expect(conflicts).toHaveLength(2)
    expect(() => applyLifeModuleOptimization(character, previewLifeModuleOptimization(character)[0].id)).toThrow('opposed Trait conflicts')
  })

  it('round-trips final-review allocations and Optimization history', () => {
    let character = enterLifeModuleFinalReview(completeAgitatorStage4())
    character = allocateFinalReviewXp(character, { type: 'attribute', targetId: 'STR', displayName: 'STR' }, 25)
    const opportunity = previewLifeModuleOptimization(character).find((entry) => entry.destination.type === 'attribute' && entry.destination.targetId === 'STR')!
    character = applyLifeModuleOptimization(character, opportunity.id)
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-23T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    expect(decoded.creation.lifeModules!.finalReview!.allocations).toHaveLength(1)
    expect(decoded.creation.lifeModules!.finalReview!.optimizations.length).toBeGreaterThan(0)
  })

  it('marks a fully allocated, prerequisite-satisfied, fully attained draft ready only for Final Touches', () => {
    const character = completeAgitatorStage4()
    for (const opportunity of getDomainOptimizationPreview(character)) {
      if (opportunity.destination.type === 'attribute') character.attributes.find((entry) => entry.attributeId === opportunity.destination.targetId)!.accumulatedXp = opportunity.afterXp
      if (opportunity.destination.type === 'trait') character.traits.find((entry) => entry.traitId === opportunity.destination.targetId && JSON.stringify(entry.parameters) === JSON.stringify(opportunity.destination.parameters ?? {}))!.accumulatedXp = opportunity.afterXp
      if (opportunity.destination.type === 'skill') character.skills.find((entry) => entry.address.skillId === opportunity.destination.targetId && entry.address.parameter?.value === opportunity.destination.parameter?.value)!.accumulatedXp = opportunity.afterXp
    }
    character.creation.lifeModules!.moduleXp.starting = character.creation.lifeModules!.moduleXp.spent
    character.creation.lifeModules!.moduleXp.remaining = 0
    character.xp.creation.starting = character.creation.lifeModules!.moduleXp.spent
    character.xp.creation.remaining = 0
    const reviewed = enterLifeModuleFinalReview(character)
    expect(reviewed.creation.lifeModules!.phase).toBe('ready-for-final-touches')
    expect(reviewed.creation.lifeModules!.finalReview!.readiness).toBe('ready-for-final-touches')
    expect(validateCharacter(reviewed).issues.map((entry) => entry.id)).toContain('life-modules.final-touches.ready')
    expect(reviewed.creation.status).toBe('draft')
  })
})
