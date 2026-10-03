import { describe, expect, it } from 'vitest'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { BACK_WOODS_ID, CAPELLAN_COMMONALITY_ID } from './catalog'
import { pendingAwardOptions, pendingOpenSubject } from './awardOptions'
import { CAVALRY_FIELD_ID, DRIVING_SUBSKILLS, MARINE_FIELD_ID, SECURITY_SYSTEMS_SUBSKILLS, VEHICLE_GUNNERY_SUBSKILLS } from '../skillFields/catalog'

function backWoodsDraft() {
  let character = createLifeModuleCharacter('Selector Test')
  character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
  character = applyCapellanCommonality(character)
  return applyStage1Module(character, BACK_WOODS_ID)
}

describe('Life Module pending award options', () => {
  it('uses the selected Field component’s bounded source-backed options', () => {
    const character = createLifeModuleCharacter('Marine options')
    const options = pendingAwardOptions({
      id: 'pending-marine',
      moduleId: 'stage3.military-academy',
      awardId: 'skill-field/field.marine/marine.security-systems-any',
      kind: 'any-skill-choice',
      description: 'Security Systems subskill',
      xpPerGrant: 30,
      remainingGrants: 1,
      allowedTargetTypes: ['skill'],
      requiredSkillId: 'skill.security-systems',
      skillFieldChoice: { fieldId: MARINE_FIELD_ID, componentId: 'marine.security-systems-any' },
      source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 94 },
    }, character)
    expect(options.map((entry) => entry.parameter?.value)).toEqual([...SECURITY_SYSTEMS_SUBSKILLS])
  })
  it('uses each Cavalry component’s exact canonical source-defined option set', () => {
    const character = createLifeModuleCharacter('Cavalry options')
    const base = {
      id: 'pending-cavalry', moduleId: 'stage3.military-academy', kind: 'any-skill-choice' as const,
      xpPerGrant: 30, remainingGrants: 1, allowedTargetTypes: ['skill' as const],
      source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 94 },
    }
    const driving = pendingAwardOptions({
      ...base, awardId: 'skill-field/field.cavalry/cavalry.driving-any', description: 'Driving subskill', requiredSkillId: 'skill.driving',
      skillFieldChoice: { fieldId: CAVALRY_FIELD_ID, componentId: 'cavalry.driving-any' },
    }, character)
    const gunnery = pendingAwardOptions({
      ...base, awardId: 'skill-field/field.cavalry/cavalry.gunnery-any-vehicle', description: 'Vehicle Gunnery subskill', requiredSkillId: 'skill.gunnery',
      skillFieldChoice: { fieldId: CAVALRY_FIELD_ID, componentId: 'cavalry.gunnery-any-vehicle' },
    }, character)
    expect(driving.map((entry) => entry.parameter?.value)).toEqual([...DRIVING_SUBSKILLS])
    expect(gunnery.map((entry) => entry.parameter?.value)).toEqual([...VEHICLE_GUNNERY_SUBSKILLS])
  })
  it('offers known Federated Suns languages without raw text entry', () => {
    const character = backWoodsDraft()
    const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'commonality.language.fedsuns')!
    expect(pendingAwardOptions(pending, character)).toEqual(expect.arrayContaining([
      expect.objectContaining({ targetId: 'skill.language', displayName: 'Language/English' }),
      expect.objectContaining({ targetId: 'skill.language', displayName: 'Language/French' }),
    ]))
  })

  it('classifies Survival as an explicit open environment subject without a fabricated option list', () => {
    const character = backWoodsDraft()
    const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'back-woods.skill.survival')!
    expect(pendingAwardOptions(pending, character)).toEqual([])
    expect(pendingOpenSubject(pending)).toMatchObject({ skillId: 'skill.survival', parentLabel: 'Survival' })
  })

  it('uses the same open subject entry for multi-grant Interest awards', () => {
    expect(pendingOpenSubject({ kind: 'multi-skill-choice', requiredSkillId: 'skill.interest' })).toMatchObject({
      skillId: 'skill.interest', parentLabel: 'Interest',
    })
  })

  it('shows readable Trait choices while retaining stable IDs internally', () => {
    const character = backWoodsDraft()
    const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'back-woods.flexible')!
    const options = pendingAwardOptions({ ...pending, allowedTargetTypes: ['trait'] }, character)
    expect(options).toContainEqual(expect.objectContaining({ displayName: 'Fit', targetId: 'trait.fit', type: 'trait' }))
  })
})
