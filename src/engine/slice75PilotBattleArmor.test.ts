import { describe, expect, it } from 'vitest'
import { BLUE_COLLAR_ID, CAPELLAN_COMMONALITY_ID, FAMILY_TRAINING_ID, MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID, SOLARIS_INTERNSHIP_ID, STAGE_2_HIGH_SCHOOL_ID } from '../domain/lifeModules/catalog'
import { BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, JOURNALIST_FIELD_ID, MANAGER_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID } from '../domain/skillFields/catalog'
import { applyCapellanCommonality, applyStage1Module, applyStage2Module, applyStage3School, applyUniversalStage0, continueToStage2, continueToStage3, createLifeModuleCharacter, resolvePendingLifeModuleAward } from './lifeModuleEngine'
import { validateCharacter } from '../validation/validateCharacter'

function stage3Draft() {
  let character = createLifeModuleCharacter('Pilot Battle Armor')
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character.creation.lifeModules!.phase = 'stage-3-selection'
  character.creation.lifeModules!.currentStage = 3
  character.creation.lifeModules!.pendingAwards = []
  character.traits.push({ traitId: 'trait.connections', displayName: 'Connections', accumulatedXp: 200, attainedTp: 2, active: true, parameters: {}, sourceAwards: [] })
  return character
}

function resolveByAward(character: ReturnType<typeof stage3Draft>, awardId: string, targetId: string, displayName: string, parameter?: string) {
  const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === awardId)!
  return resolvePendingLifeModuleAward(character, pending.id, {
    type: pending.allowedTargetTypes[0], targetId, displayName,
    ...(parameter ? { parameter: { kind: 'subskill' as const, value: parameter } } : {}),
  })
}

function completeStage2() {
  let character = createLifeModuleCharacter('Pilot Battle Armor')
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character = applyStage1Module(character, BLUE_COLLAR_ID)
  character = resolveByAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
  character = resolveByAward(character, 'blue-collar.career', 'skill.career', 'Career/Soldier', 'Soldier')
  character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History')
  character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/Engineering', 'Engineering')
  for (const attributeId of ['STR', 'BOD', 'DEX', 'RFL']) character = resolveByAward(character, 'blue-collar.flexible', attributeId, attributeId)
  character = applyStage2Module(continueToStage2(character), STAGE_2_HIGH_SCHOOL_ID)
  character = resolveByAward(character, 'high-school.interest-40', 'skill.interest', 'Interest/Science', 'Science')
  character = resolveByAward(character, 'high-school.interest-35', 'skill.interest', 'Interest/Art', 'Art')
  const flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!
  character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'DEX', displayName: 'DEX' }, 185)
  character.traits.push({ traitId: 'trait.connections', displayName: 'Connections', accumulatedXp: 200, attainedTp: 2, active: true, parameters: {}, sourceAwards: [] })
  return continueToStage3(character)
}

function resolveSolarisPackage(character: ReturnType<typeof stage3Draft>) {
  const resolutions = [
    ['solaris-internship.attribute.other', { type: 'attribute', targetId: 'STR', displayName: 'STR' }, undefined],
    ['solaris-internship.trait.equipped-or-vehicle', { type: 'trait', targetId: 'trait.vehicle', displayName: 'Vehicle', parameters: {} }, undefined],
    ['solaris-internship.skill.streetwise', { type: 'skill', targetId: 'skill.streetwise', displayName: 'Streetwise/Capellan', parameter: { kind: 'subskill', value: 'Capellan' } }, undefined],
    ['solaris-internship.flexible', { type: 'attribute', targetId: 'BOD', displayName: 'BOD' }, 100],
  ] as const
  let next = character
  for (const [awardId, destination, xp] of resolutions) {
    const pending = next.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === awardId)!
    next = resolvePendingLifeModuleAward(next, pending.id, destination, xp)
  }
  return next
}

describe('Alpha Slice 75 Pilot/Battle Armor', () => {
  it('uses the exact canonical Field, cost, Skills, and source-authorized school offers', () => {
    const solaris = applyStage3School(stage3Draft(), SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID], 'Solaris VII')
    const grant = solaris.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_BATTLE_ARMOR_FIELD_ID)!
    expect(grant).toMatchObject({ displayName: 'Pilot/Battle Armor', category: 'advanced', purchaseCostXp: 144, xpPerSkill: 30, chronologyYears: 2 })
    expect(grant.prerequisiteWaivers).toEqual([expect.objectContaining({ prerequisiteId: 'pilot-battle-armor.field', sourceModuleId: SOLARIS_INTERNSHIP_ID })])
    expect(solaris.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.moduleId === PILOT_BATTLE_ARMOR_FIELD_ID && entry.prerequisiteId === 'pilot-battle-armor.field')).toMatchObject({ status: 'waived' })
    expect(['Climbing', 'Gunnery/Battlesuit', 'Martial Arts', 'Piloting/Battlesuit', 'Sensor Operations', 'Tactics/Land'].map((name) => solaris.skills.find((entry) => entry.displayName === name)?.accumulatedXp)).toEqual([30, 30, 35, 30, 30, 30])

    const academy = applyStage3School(stage3Draft(), MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID])
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_BATTLE_ARMOR_FIELD_ID)).toMatchObject({ category: 'special', chronologyYears: 2 })
    expect(academy.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_BATTLE_ARMOR_FIELD_ID)?.prerequisiteWaivers).toBeUndefined()

    const family = applyStage3School(stage3Draft(), FAMILY_TRAINING_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID], 'Sian')
    expect(family.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_BATTLE_ARMOR_FIELD_ID)).toMatchObject({ category: 'special', chronologyYears: 2 })
    expect(() => applyStage3School(stage3Draft(), MILITARY_ENLISTMENT_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID])).toThrow('not offered')
  })

  it('keeps preview transactional and removes all Battle Armor effects when the Field is deselected', () => {
    const input = stage3Draft()
    const before = JSON.stringify(input)
    const selected = applyStage3School(input, SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID], 'Solaris VII')
    expect(JSON.stringify(input)).toBe(before)
    expect(selected.skills.some((entry) => entry.displayName === 'Gunnery/Battlesuit')).toBe(true)

    const deselected = applyStage3School(input, SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, JOURNALIST_FIELD_ID], 'Solaris VII')
    expect(deselected.creation.lifeModules!.selectedSkillFields.some((entry) => entry.fieldId === PILOT_BATTLE_ARMOR_FIELD_ID)).toBe(false)
    expect(deselected.skills.some((entry) => entry.displayName === 'Gunnery/Battlesuit')).toBe(false)
    expect(deselected.creation.lifeModules!.prerequisiteIssues.some((entry) => entry.moduleId === PILOT_BATTLE_ARMOR_FIELD_ID)).toBe(false)
  })

  it('commits once, round-trips Field, Skills and waiver provenance, and does not reopen or duplicate awards', () => {
    const preview = applyStage3School(completeStage2(), SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID], 'Solaris VII')
    const committed = resolveSolarisPackage(preview)
    expect(committed.creation.lifeModules!.pendingAwards).toEqual([])
    const restored = JSON.parse(JSON.stringify(committed)) as typeof committed
    expect(restored).toEqual(committed)
    expect(restored.creation.lifeModules!.selectedSkillFields.filter((entry) => entry.fieldId === PILOT_BATTLE_ARMOR_FIELD_ID)).toHaveLength(1)
    expect(restored.skills.filter((entry) => entry.displayName === 'Gunnery/Battlesuit')).toHaveLength(1)
    expect(restored.skills.filter((entry) => entry.displayName === 'Piloting/Battlesuit')).toHaveLength(1)
    expect(restored.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_BATTLE_ARMOR_FIELD_ID)?.prerequisiteWaivers).toHaveLength(1)
  })

  it('accepts only the exact Solaris acquisition waiver provenance', () => {
    const solaris = applyStage3School(stage3Draft(), SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID], 'Solaris VII')
    expect(validateCharacter(solaris).issues.some((entry) => entry.id === 'life-modules.skill-field.prerequisite-waiver.malformed')).toBe(false)

    const forged = applyStage3School(stage3Draft(), MILITARY_ACADEMY_ID, [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID])
    forged.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === PILOT_BATTLE_ARMOR_FIELD_ID)!.prerequisiteWaivers = [{ prerequisiteId: 'pilot-battle-armor.field', sourceModuleId: MILITARY_ACADEMY_ID, description: 'forged' }]
    expect(validateCharacter(forged).issues.some((entry) => entry.id === 'life-modules.skill-field.prerequisite-waiver.malformed')).toBe(true)
  })
})
