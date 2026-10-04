import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, SOLARIS_INTERNSHIP_ID, TECHNICAL_COLLEGE_ID } from '../domain/lifeModules/catalog'
import { stage3SchoolEligibility } from '../domain/lifeModules/stage3Schooling'
import { CAVALRY_FIELD_ID, COMMUNICATIONS_FIELD_ID, JOURNALIST_FIELD_ID, MANAGER_FIELD_ID, MECHWARRIOR_FIELD_ID } from '../domain/skillFields/catalog'
import { pendingAwardOptions } from '../domain/lifeModules/awardOptions'
import { applyCapellanCommonality, applyStage3School, applyUniversalStage0, createLifeModuleCharacter, resolvePendingLifeModuleAward } from './lifeModuleEngine'

function stage3Draft() {
  let character = createLifeModuleCharacter('Solaris Internship')
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character.creation.lifeModules!.phase = 'stage-3-selection'
  character.creation.lifeModules!.currentStage = 3
  character.creation.lifeModules!.pendingAwards = []
  return character
}

function addConnections(character: ReturnType<typeof stage3Draft>, tp = 2) {
  character.traits.push({ traitId: 'trait.connections', displayName: 'Connections', accumulatedXp: tp * 100, attainedTp: tp, active: true, parameters: {}, sourceAwards: [] })
  return character
}

describe('Alpha Slice 74 Solaris Internship', () => {
  it('uses distinct durable residence and exact Connections TP without inferring either from homeworld or affiliation', () => {
    const input = stage3Draft()
    input.personalDescription = { physicalDescription: '', backgroundNotes: '', homeworld: 'Solaris VII' }
    const preview = applyStage3School(input, SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, JOURNALIST_FIELD_ID], '')
    expect(preview.creation.lifeModules!.prerequisiteIssues).toEqual(expect.arrayContaining([
      expect.objectContaining({ prerequisiteId: 'solaris-internship.residence', status: 'outstanding' }),
      expect.objectContaining({ prerequisiteId: 'solaris-internship.connections', status: 'outstanding' }),
    ]))
    expect(input.personalDescription.residence).toBeUndefined()

    const eligible = applyStage3School(addConnections(stage3Draft()), SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, JOURNALIST_FIELD_ID], '  Solaris VII  ')
    expect(eligible.personalDescription?.residence).toBe('Solaris VII')
    expect(eligible.creation.lifeModules!.prerequisiteIssues.filter((entry) => entry.moduleId === SOLARIS_INTERNSHIP_ID).map((entry) => entry.status)).toEqual(['satisfied', 'satisfied'])
  })

  it('applies the exact package and exposes only legal no-default package, Attribute, Streetwise, and flexible choices', () => {
    const input = addConnections(stage3Draft())
    const before = JSON.stringify(input)
    const solaris = applyStage3School(input, SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, JOURNALIST_FIELD_ID], 'Solaris VII')
    expect(JSON.stringify(input)).toBe(before)
    expect(solaris.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: SOLARIS_INTERNSHIP_ID, baseCostXp: 700, fieldCostXp: 288, costXp: 988 })
    expect(solaris.attributes.find((entry) => entry.attributeId === 'CHA')?.accumulatedXp).toBe(250)
    expect(solaris.attributes.find((entry) => entry.attributeId === 'EDG')?.accumulatedXp).toBe(200)
    expect(solaris.skills.find((entry) => entry.displayName === 'Interest/Solaris Games')?.accumulatedXp).toBe(30)
    const pending = solaris.creation.lifeModules!.pendingAwards
    expect(pending.map((entry) => entry.awardId)).toEqual(expect.arrayContaining([
      'solaris-internship.attribute.other',
      'solaris-internship.trait.equipped-or-vehicle',
      'solaris-internship.skill.streetwise',
      'solaris-internship.flexible',
    ]))
    expect(pendingAwardOptions(pending.find((entry) => entry.awardId === 'solaris-internship.attribute.other')!, solaris).map((entry) => entry.targetId)).not.toEqual(expect.arrayContaining(['CHA', 'EDG']))
    expect(pendingAwardOptions(pending.find((entry) => entry.awardId === 'solaris-internship.trait.equipped-or-vehicle')!, solaris).map((entry) => entry.targetId)).toEqual(['trait.equipped', 'trait.vehicle'])
    expect(pendingAwardOptions(pending.find((entry) => entry.awardId === 'solaris-internship.skill.streetwise')!, solaris).map((entry) => entry.displayName)).toEqual(['Streetwise/Capellan'])
  })

  it('records narrow automatic waiver provenance without granting or globally satisfying Basic Training', () => {
    const cavalry = applyStage3School(addConnections(stage3Draft()), SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, CAVALRY_FIELD_ID], 'Solaris VII')
    const cavalryGrant = cavalry.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === CAVALRY_FIELD_ID)!
    expect(cavalryGrant.prerequisiteWaivers).toEqual([expect.objectContaining({ prerequisiteId: 'cavalry.field', sourceModuleId: SOLARIS_INTERNSHIP_ID })])
    expect(cavalry.creation.lifeModules!.prerequisiteIssues.find((entry) => entry.moduleId === CAVALRY_FIELD_ID && entry.prerequisiteId === 'cavalry.field')).toMatchObject({ status: 'waived' })
    expect(cavalry.creation.lifeModules!.selectedSkillFields.some((entry) => entry.fieldId === 'field.basic-training')).toBe(false)

    const mech = applyStage3School(addConnections(stage3Draft()), SOLARIS_INTERNSHIP_ID, [COMMUNICATIONS_FIELD_ID, MECHWARRIOR_FIELD_ID], 'Solaris VII')
    expect(mech.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === MECHWARRIOR_FIELD_ID)?.prerequisiteWaivers?.[0].prerequisiteId).toBe('mechwarrior.field')

    const outside = applyStage3School(addConnections(stage3Draft()), SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, JOURNALIST_FIELD_ID], 'Solaris VII')
    expect(outside.creation.lifeModules!.selectedSkillFields.every((entry) => !entry.prerequisiteWaivers?.length)).toBe(true)
  })

  it('round-trips resolved state, preserves waiver scope, and consumes only the Civilian family', () => {
    let solaris = applyStage3School(addConnections(stage3Draft()), SOLARIS_INTERNSHIP_ID, [MANAGER_FIELD_ID, CAVALRY_FIELD_ID], 'Solaris VII')
    const resolutions = [
      ['solaris-internship.attribute.other', { type: 'attribute', targetId: 'STR', displayName: 'STR' }, undefined],
      ['solaris-internship.trait.equipped-or-vehicle', { type: 'trait', targetId: 'trait.vehicle', displayName: 'Vehicle', parameters: {} }, undefined],
      ['solaris-internship.skill.streetwise', { type: 'skill', targetId: 'skill.streetwise', displayName: 'Streetwise/Capellan', parameter: { kind: 'subskill', value: 'Capellan' } }, undefined],
      ['solaris-internship.flexible', { type: 'attribute', targetId: 'DEX', displayName: 'DEX' }, 100],
      ['skill-field/field.cavalry/cavalry.driving-any', { type: 'skill', targetId: 'skill.driving', displayName: 'Driving/Ground Vehicles', parameter: { kind: 'subskill', value: 'Ground Vehicles' } }, undefined],
      ['skill-field/field.cavalry/cavalry.gunnery-any-vehicle', { type: 'skill', targetId: 'skill.gunnery', displayName: 'Gunnery/Ground Vehicle', parameter: { kind: 'subskill', value: 'Ground Vehicle' } }, undefined],
      ['skill-field/field.cavalry/cavalry.tactics-land-or-sea', { type: 'skill', targetId: 'skill.tactics', displayName: 'Tactics/Land', parameter: { kind: 'subskill', value: 'Land' } }, undefined],
    ] as const
    for (const [awardId, destination, xp] of resolutions) {
      const pending = solaris.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === awardId)!
      solaris = resolvePendingLifeModuleAward(solaris, pending.id, destination, xp)
    }
    const restored = JSON.parse(JSON.stringify(solaris)) as typeof solaris
    expect(restored.personalDescription?.residence).toBe('Solaris VII')
    expect(restored.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === CAVALRY_FIELD_ID)?.prerequisiteWaivers).toHaveLength(1)
    expect(restored.creation.lifeModules!.pendingAwards.filter((entry) => entry.moduleId === SOLARIS_INTERNSHIP_ID)).toEqual([])
    expect(stage3SchoolEligibility([SOLARIS_INTERNSHIP_ID], TECHNICAL_COLLEGE_ID).eligible).toBe(false)
    expect(stage3SchoolEligibility([SOLARIS_INTERNSHIP_ID], 'stage3.military-academy').eligible).toBe(true)
    expect(stage3SchoolEligibility([SOLARIS_INTERNSHIP_ID], 'stage3.police-academy').eligible).toBe(true)
    expect(stage3SchoolEligibility([SOLARIS_INTERNSHIP_ID], 'stage3.officer-training', { completedFieldCategories: ['basic', 'advanced'] }).eligible).toBe(false)
  })
})
