import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BLUE_COLLAR_ID, getLifeModule } from '../lifeModules/catalog'
import { allocateFinalReviewXp } from '../../engine/lifeModuleFinalReview'
import { createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { LifeModuleCharacterSummary } from '../../ui/components/LifeModulesWizard'
import { LifeModulesScreen } from '../../ui/screens/LifeModulesScreen'
import { BASIC_TRAINING_FIELD_ID, getSkillField, TECHNICIAN_VEHICLE_FIELD_ID } from './catalog'
import { getMasterSkillFieldGoal, MASTER_SKILL_FIELD_GOAL_CATALOG, MECHWARRIOR_GOAL_ID } from './goalCatalog'
import { lifeModuleGoalContributions, masterSkillFieldGoalStatus, masterSkillFieldReferenceStatus, setMasterSkillFieldGoal, SUPPORTED_MASTER_SKILL_FIELD_GOALS } from './goals'

describe('Master Skill Field goal guidance', () => {
  it('renders No goal and the broad reference catalog, including MechWarrior, in initial setup', () => {
    const markup = renderToStaticMarkup(<LifeModulesScreen onSave={() => undefined} />)
    expect(markup).toContain('<option value="" selected="">No goal</option>')
    expect(markup).toContain('MechWarrior')
    expect(markup).toContain('Clan ProtoMech Warrior')
  })

  it('supports No goal and stores a supported goal without granting rules effects', () => {
    const character = createLifeModuleCharacter('Goal test')
    const before = structuredClone(character)
    const noGoal = setMasterSkillFieldGoal(character, null)
    const withGoal = setMasterSkillFieldGoal(character, BASIC_TRAINING_FIELD_ID)

    expect(SUPPORTED_MASTER_SKILL_FIELD_GOALS).toHaveLength(56)
    expect(masterSkillFieldGoalStatus(noGoal)).toBeNull()
    expect(withGoal.creation.lifeModules?.masterSkillFieldGoalId).toBe(BASIC_TRAINING_FIELD_ID)
    expect(withGoal.creation.lifeModules?.selectedSkillFields).toEqual([])
    expect(withGoal.attributes).toEqual(before.attributes)
    expect(withGoal.traits).toEqual(before.traits)
    expect(withGoal.skills).toEqual(before.skills)
    expect(withGoal.xp).toEqual(before.xp)
    expect(withGoal.creation.lifeModules?.moduleXp).toEqual(before.creation.lifeModules?.moduleXp)
  })

  it('stores MechWarrior from the reference catalog without granting its Field, Skills, XP, or discount', () => {
    const base = createLifeModuleCharacter('MechWarrior goal')
    base.skills.push(...getSkillField(BASIC_TRAINING_FIELD_ID).componentSkills.map((entry) => ({ address: structuredClone(entry.address), displayName: entry.displayName, accumulatedXp: 20, level: 0, sourceAwards: [] })))
    const before = structuredClone(base)
    const character = setMasterSkillFieldGoal(base, MECHWARRIOR_GOAL_ID)
    const status = masterSkillFieldGoalStatus(character)!

    expect(MASTER_SKILL_FIELD_GOAL_CATALOG.some((entry) => entry.displayName === 'MechWarrior')).toBe(true)
    expect(character.creation.lifeModules?.masterSkillFieldGoalId).toBe(MECHWARRIOR_GOAL_ID)
    expect(character.creation.lifeModules?.selectedSkillFields).toEqual([])
    expect(character.skills).toEqual(before.skills)
    expect(character.xp).toEqual(before.xp)
    expect(character.creation.lifeModules?.moduleXp).toEqual(before.creation.lifeModules?.moduleXp)
    expect(status.requirements.filter((entry) => entry.section === 'prerequisite').map((entry) => entry.label)).toEqual(['Basic Training Field', 'DEX 4+', 'RFL 4+'])
    expect(status.requirements.filter((entry) => entry.section === 'field-skill').map((entry) => entry.label)).toEqual(['Gunnery/Mech', 'Piloting/Mech', 'Sensor Operations', 'Tactics/Land', 'Technician/Any'])
    expect(status.requirements.find((entry) => entry.label === 'Basic Training Field')).toMatchObject({ satisfied: false, xpRequired: null })
    const technicianAny = status.requirements.find((entry) => entry.label === 'Technician/Any')!
    expect(technicianAny).toMatchObject({ kind: 'variable-skill', xpRequired: null })
    expect(technicianAny.destination).toBeUndefined()
  })

  it('distinguishes Attribute, Trait, Skill, and prerequisite-Field progress', () => {
    const basic = masterSkillFieldGoalStatus(setMasterSkillFieldGoal(createLifeModuleCharacter('Basic'), BASIC_TRAINING_FIELD_ID))!
    expect(basic.total).toBe(8)
    expect(basic.requirements).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'attribute', label: 'INT 3+', satisfied: false, xpRequired: 200 }),
      expect.objectContaining({ kind: 'trait', label: 'Rank Trait', satisfied: false, xpRequired: null }),
      expect.objectContaining({ kind: 'skill', label: 'Career/Soldier', satisfied: false }),
    ]))

    const vehicle = masterSkillFieldGoalStatus(setMasterSkillFieldGoal(createLifeModuleCharacter('Vehicle'), TECHNICIAN_VEHICLE_FIELD_ID))!
    expect(vehicle.requirements).toContainEqual(expect.objectContaining({ kind: 'skill-field', satisfied: false, xpRequired: null, current: 'Required Field not completed' }))
  })

  it('explains module contributions without changing the character or selecting the module', () => {
    const character = setMasterSkillFieldGoal(createLifeModuleCharacter('Guidance'), BASIC_TRAINING_FIELD_ID)
    const before = JSON.stringify(character)
    expect(lifeModuleGoalContributions(character, getLifeModule(BLUE_COLLAR_ID))).toContain('Provides INT XP toward INT 3+')
    expect(JSON.stringify(character)).toBe(before)
    expect(character.creation.lifeModules?.selectedModuleIds).not.toContain(BLUE_COLLAR_ID)
  })

  it('renders compact Character Summary progress and funds a legal existing Attribute gap through final allocation', () => {
    let character = setMasterSkillFieldGoal(createLifeModuleCharacter('Review goal'), BASIC_TRAINING_FIELD_ID)
    const state = character.creation.lifeModules!
    state.phase = 'alpha-final-review'
    state.finalReview = {
      version: 1,
      enteredAt: new Date(0).toISOString(),
      readiness: 'review-required',
      allocationPool: { starting: 500, allocated: 0, optimizationReturned: 0, remaining: 500 },
      allocations: [], optimizations: [],
      negativeTraitXpPurchase: { capXp: 500, purchasedXp: 0, uiStatus: 'deferred' },
    }
    const markup = renderToStaticMarkup(<LifeModuleCharacterSummary character={character} />)
    expect(markup).toContain('Basic Training goal · 0 / 8')
    expect(markup).toContain('Prerequisites')
    expect(markup).toContain('Field Skills')
    expect(markup).toContain('Guidance only')

    const intGap = masterSkillFieldGoalStatus(character)!.requirements.find((entry) => entry.label === 'INT 3+')!
    character = allocateFinalReviewXp(character, intGap.destination!, intGap.xpRequired!)
    expect(masterSkillFieldGoalStatus(character)!.requirements.find((entry) => entry.label === 'INT 3+')).toMatchObject({ satisfied: true, xpRequired: 0 })
    expect(character.creation.lifeModules?.selectedSkillFields).toEqual([])
  })

  it('renders Infantry - Anti-Mech prerequisite Fields as nested native disclosures', () => {
    const antiMechId = MASTER_SKILL_FIELD_GOAL_CATALOG.find((entry) => entry.displayName === 'Infantry - Anti-Mech')!.id
    const character = setMasterSkillFieldGoal(createLifeModuleCharacter('Anti-Mech guidance'), antiMechId)
    const status = masterSkillFieldGoalStatus(character)!
    const infantry = status.prerequisiteFields[0]

    expect(status.requirements.find((entry) => entry.label === 'Infantry Field')).toMatchObject({ kind: 'skill-field', satisfied: false, current: 'Required Field not completed', xpRequired: null })
    expect(infantry).toMatchObject({ displayName: 'Infantry', acquired: false, cycle: false })
    expect(infantry.requirements.filter((entry) => entry.section === 'prerequisite').map((entry) => entry.label)).toEqual(['Basic Training Field'])
    expect(infantry.requirements.filter((entry) => entry.section === 'field-skill').map((entry) => entry.label)).toEqual(['Acrobatics/Free-Fall', 'Artillery', 'Climbing', 'Comms/Conventional', 'Support Weapons', 'Tactics/Infantry'])
    expect(infantry.prerequisiteFields[0]).toMatchObject({ displayName: 'Basic Training', cycle: false })

    const markup = renderToStaticMarkup(<LifeModuleCharacterSummary character={character} />)
    expect(markup).toContain('<details class="goal-field-disclosure"><summary>Infantry Field details · not acquired</summary>')
    expect(markup).toContain('<summary>Basic Training Field details · not acquired</summary>')
    expect(markup.indexOf('Prerequisites')).toBeLessThan(markup.indexOf('Field Skills'))
    expect(markup).not.toContain('Apply required XP')
  })

  it('does not mistake every Infantry component Skill for actual Field acquisition', () => {
    const infantry = getMasterSkillFieldGoal('field.infantry')
    const character = createLifeModuleCharacter('Skills are not a Field')
    character.skills.push(...infantry.fieldSkills.map((entry) => ({
      address: { skillId: entry.skillId, ...(entry.parameter ? { parameter: { kind: 'subskill' as const, value: entry.parameter } } : {}) },
      displayName: entry.displayName,
      accumulatedXp: 20,
      level: 0,
      sourceAwards: [],
    })))
    const reference = masterSkillFieldReferenceStatus(character, infantry.id)
    expect(reference.requirements.filter((entry) => entry.section === 'field-skill').every((entry) => entry.satisfied)).toBe(true)
    expect(reference.acquired).toBe(false)

    character.creation.lifeModules!.selectedSkillFields.push({
      id: 'test-infantry-grant', schoolModuleId: 'test-school', fieldId: infantry.id, displayName: infantry.displayName, category: 'basic', purchaseCostXp: 0, xpPerSkill: 20, chronologyYears: 0, selectedAt: new Date(0).toISOString(), provenanceId: 'test-provenance', source: structuredClone(infantry.source),
    })
    expect(masterSkillFieldReferenceStatus(character, infantry.id).acquired).toBe(true)
  })

  it('expands a second generic Field chain while preserving variable /Any requirements', () => {
    const anthropologistId = MASTER_SKILL_FIELD_GOAL_CATALOG.find((entry) => entry.displayName === 'Anthropologist')!.id
    const status = masterSkillFieldGoalStatus(setMasterSkillFieldGoal(createLifeModuleCharacter('Generic chain'), anthropologistId))!
    expect(status.prerequisiteFields[0]).toMatchObject({ displayName: 'General Studies', acquired: false, cycle: false })
    expect(status.prerequisiteFields[0].requirements).toContainEqual(expect.objectContaining({ label: 'Career/Any', kind: 'variable-skill', xpRequired: null }))
  })

  it('stops recursive Field expansion when an ancestor would repeat', () => {
    const cycle = masterSkillFieldReferenceStatus(createLifeModuleCharacter('Cycle guard'), 'field.infantry', ['field.infantry'])
    expect(cycle).toMatchObject({ displayName: 'Infantry', cycle: true, requirements: [], prerequisiteFields: [] })
  })
})
