import { describe, expect, it } from 'vitest'
import { AGITATOR_ID, BLUE_COLLAR_ID, CAPELLAN_COMMONALITY_ID, MILITARY_ACADEMY_ID, STAGE_2_BACK_WOODS_ID, STAGE_2_HIGH_SCHOOL_ID, TECHNICAL_COLLEGE_ID, UNIVERSITY_ID } from '../../domain/lifeModules/catalog'
import { pendingAwardOptions } from '../../domain/lifeModules/awardOptions'
import { ANTHROPOLOGIST_FIELD_ID, BASIC_TRAINING_FIELD_ID, CAVALRY_FIELD_ID, GENERAL_STUDIES_FIELD_ID, MECHWARRIOR_FIELD_ID, PLANETARY_SURVEYOR_FIELD_ID, SCIENTIST_FIELD_ID, SCOUT_FIELD_ID } from '../../domain/skillFields/catalog'
import { applyCapellanCommonality, applyUniversalStage0, createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { previewSupportedStageModule } from './stageModulePreviewModel'
import { filterSiblingDestinationOptions, openSubjectStageChoiceSlot, previewStageModuleChoiceSlots, relatedStageChoiceSlotValues, stageChoicePoolProgress, stageChoicePoolProgressLabel, stageChoiceSlotCount, stageSlotContinueEnabled, stageSlotPendingAwards, type StageChoiceSlotValue, type StageChoiceSlotValues } from './stageModuleChoiceSlotsModel'

function draftAt(phase: 'stage-1-selection' | 'stage-2-selection' | 'stage-3-selection' | 'stage-4-selection') {
  let character = createLifeModuleCharacter(`Slots ${phase}`)
  character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
  character.creation.lifeModules!.phase = phase
  character.creation.lifeModules!.currentStage = phase === 'stage-1-selection' ? 1 : phase === 'stage-2-selection' ? 2 : phase === 'stage-3-selection' ? 3 : 4
  character.creation.lifeModules!.pendingAwards = []
  return character
}

function value(type: StageChoiceSlotValue['targetType'], targetId: string, displayName: string, xpAmount: number, parameter = ''): StageChoiceSlotValue {
  return { targetType: type, targetId, displayName, xpAmount, parameter }
}

function keyedValues(character: ReturnType<typeof draftAt>, moduleId: Parameters<typeof previewSupportedStageModule>[1], byAward: Readonly<Record<string, readonly StageChoiceSlotValue[]>>): StageChoiceSlotValues {
  const preview = previewSupportedStageModule(character, moduleId)!
  return Object.fromEntries(preview.creation.lifeModules!.pendingAwards.filter((entry) => entry.moduleId === moduleId).map((entry) => [entry.awardId, [...(byAward[entry.awardId] ?? [])]]))
}

describe('Stage 1–4 choice slot preview and commit model', () => {
  it('replaces and removes General Studies related-Skill preview provenance without changing Skill XP', () => {
    const character = draftAt('stage-3-selection')
    const fields = [GENERAL_STUDIES_FIELD_ID, ANTHROPOLOGIST_FIELD_ID]
    const base = previewSupportedStageModule(character, UNIVERSITY_ID, fields)!
    const related = base.creation.lifeModules!.pendingAwards.find((entry) => entry.kind === 'related-skill-prerequisite')!
    const options = pendingAwardOptions(related, base)
    expect(options.length).toBeGreaterThan(1)
    const previewXp = new Map(base.skills.map((entry) => [entry.displayName, entry.accumulatedXp]))
    const first = options[0]
    const firstPreview = previewStageModuleChoiceSlots(character, UNIVERSITY_ID, {
      [related.awardId]: [value('skill', first.targetId, first.displayName, 0, first.parameter?.value)],
    }, fields)!
    expect(firstPreview.character.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === GENERAL_STUDIES_FIELD_ID)?.prerequisiteSkillChoices?.[0].destination.displayName).toBe(first.displayName)

    const second = options[1]
    const replacement = previewStageModuleChoiceSlots(character, UNIVERSITY_ID, {
      [related.awardId]: [value('skill', second.targetId, second.displayName, 0, second.parameter?.value)],
    }, fields)!
    expect(replacement.character.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === GENERAL_STUDIES_FIELD_ID)?.prerequisiteSkillChoices).toEqual([
      expect.objectContaining({ destination: expect.objectContaining({ displayName: second.displayName }) }),
    ])
    for (const [name, xp] of previewXp) expect(replacement.character.skills.find((entry) => entry.displayName === name)?.accumulatedXp).toBe(xp)

    const deselected = previewSupportedStageModule(character, UNIVERSITY_ID, [SCIENTIST_FIELD_ID, PLANETARY_SURVEYOR_FIELD_ID])!
    expect(deselected.creation.lifeModules!.selectedSkillFields.some((entry) => entry.fieldId === GENERAL_STUDIES_FIELD_ID)).toBe(false)
    expect(deselected.creation.lifeModules!.pendingAwards.some((entry) => entry.kind === 'related-skill-prerequisite')).toBe(false)
  })

  it('expands Blue Collar multi-grant awards into separate slots and keeps committed state untouched', () => {
    const character = draftAt('stage-1-selection')
    const committed = JSON.stringify(character)
    const preview = previewSupportedStageModule(character, BLUE_COLLAR_ID)!
    const interests = preview.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'blue-collar.interests')!
    const flexible = preview.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'blue-collar.flexible')!

    expect(stageChoiceSlotCount(interests, {})).toBe(2)
    expect(stageChoiceSlotCount(flexible, {})).toBe(4)
    expect(previewStageModuleChoiceSlots(character, BLUE_COLLAR_ID, {})?.complete).toBe(false)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it.each([
    ['stage-1-selection', BLUE_COLLAR_ID, {
      'blue-collar.career': [value('skill', 'skill.career', 'Career/Soldier', 10, 'Soldier')],
      'blue-collar.interests': [value('skill', 'skill.interest', 'Interest/History', 5, 'History'), value('skill', 'skill.interest', 'Interest/Engineering', 5, 'Engineering')],
      'blue-collar.flexible': [value('attribute', 'STR', 'STR', 10), value('attribute', 'BOD', 'BOD', 10), value('attribute', 'DEX', 'DEX', 10), value('attribute', 'RFL', 'RFL', 10)],
    }],
    ['stage-2-selection', STAGE_2_BACK_WOODS_ID, {
      'stage2.back-woods.flexible': [value('attribute', 'STR', 'STR', 125)],
    }],
    ['stage-3-selection', TECHNICAL_COLLEGE_ID, {
      'technical-college.interest': [value('skill', 'skill.interest', 'Interest/Engineering', 30, 'Engineering')],
      'technical-college.flexible': [value('attribute', 'INT', 'INT', 200)],
    }],
    ['stage-4-selection', AGITATOR_ID, {
      'agitator.skill.driving': [value('skill', 'skill.driving', 'Driving/Ground Car', 65, 'Ground Car')],
      'agitator.skill.prestidigitation': [value('skill', 'skill.prestidigitation', 'Prestidigitation/Sleight of Hand', 100, 'Sleight of Hand')],
      'agitator.flexible': [value('skill', 'skill.acting', 'Acting', 125)],
    }],
  ] as const)('resolves every %s module choice through existing engine behavior before Continue', (phase, moduleId, byAward) => {
    const character = draftAt(phase)
    const committed = JSON.stringify(character)
    const result = previewStageModuleChoiceSlots(character, moduleId, keyedValues(character, moduleId, byAward))!

    expect(result.error).toBeNull()
    expect(result.complete).toBe(true)
    expect(result.pendingAwards).toEqual([])
    expect(result.character.lifeModuleHistory.at(-1)?.moduleId).toBe(moduleId)
    expect(result.character.creation.lifeModules!.resolvedAwards.some((entry) => entry.moduleId === moduleId)).toBe(true)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it('keeps a module preview active and updates it after one filled slot', () => {
    const character = draftAt('stage-1-selection')
    const base = previewSupportedStageModule(character, BLUE_COLLAR_ID)!
    const career = base.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'blue-collar.career')!
    const result = previewStageModuleChoiceSlots(character, BLUE_COLLAR_ID, {
      [career.awardId]: [value('skill', 'skill.career', 'Career/Soldier', 10, 'Soldier')],
    })!

    expect(result.character.lifeModuleHistory.at(-1)?.moduleId).toBe(BLUE_COLLAR_ID)
    expect(result.character.skills.find((entry) => entry.displayName === 'Career/Soldier')?.accumulatedXp).toBe(10)
    expect(result.pendingAwards.some((entry) => entry.awardId === 'blue-collar.career')).toBe(false)
    expect(result.complete).toBe(false)
  })

  it('replaces the MechWarrior Technician preview choice without stale XP or mutation', () => {
    const character = draftAt('stage-3-selection')
    const committed = JSON.stringify(character)
    const fields = [BASIC_TRAINING_FIELD_ID, MECHWARRIOR_FIELD_ID]
    const base = previewSupportedStageModule(character, MILITARY_ACADEMY_ID, fields)!
    const pending = base.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.fieldId === MECHWARRIOR_FIELD_ID)!

    const weapons = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, {
      [pending.awardId]: [value('skill', 'skill.technician', 'Technician/Weapons', 30, 'Weapons')],
    }, fields)!
    const electronic = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, {
      [pending.awardId]: [value('skill', 'skill.technician', 'Technician/Electronic', 30, 'Electronic')],
    }, fields)!

    expect(weapons.character.skills.find((entry) => entry.displayName === 'Technician/Weapons')?.accumulatedXp).toBe(30)
    expect(electronic.character.skills.some((entry) => entry.displayName === 'Technician/Weapons')).toBe(false)
    expect(electronic.character.skills.filter((entry) => entry.displayName === 'Technician/Electronic')).toHaveLength(1)
    expect(electronic.character.skills.find((entry) => entry.displayName === 'Technician/Electronic')?.accumulatedXp).toBe(30)
    expect(electronic.pendingAwards.some((entry) => entry.skillFieldChoice?.fieldId === MECHWARRIOR_FIELD_ID)).toBe(false)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it('replaces a Cavalry governed choice without stale XP or provenance and keeps Continue blocked until all choices are set', () => {
    const character = draftAt('stage-3-selection')
    const committed = JSON.stringify(character)
    const fields = [BASIC_TRAINING_FIELD_ID, CAVALRY_FIELD_ID]
    const base = previewSupportedStageModule(character, MILITARY_ACADEMY_ID, fields)!
    const pending = base.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.componentId === 'cavalry.driving-any')!
    const ground = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, {
      [pending.awardId]: [value('skill', 'skill.driving', 'Driving/Ground Vehicles', 30, 'Ground Vehicles')],
    }, fields)!
    const sea = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, {
      [pending.awardId]: [value('skill', 'skill.driving', 'Driving/Sea Vehicles', 30, 'Sea Vehicles')],
    }, fields)!
    expect(ground.character.skills.find((entry) => entry.displayName === 'Driving/Ground Vehicles')?.accumulatedXp).toBe(30)
    expect(sea.character.skills.some((entry) => entry.displayName === 'Driving/Ground Vehicles')).toBe(false)
    expect(sea.character.skills.filter((entry) => entry.displayName === 'Driving/Sea Vehicles')).toHaveLength(1)
    expect(sea.character.skills.find((entry) => entry.displayName === 'Driving/Sea Vehicles')?.sourceAwards).toHaveLength(1)
    expect(sea.complete).toBe(false)
    expect(stageSlotContinueEnabled(sea)).toBe(false)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it('replaces the Scout language preview without stale XP or provenance and never mutates committed state', () => {
    const character = draftAt('stage-3-selection')
    const committed = JSON.stringify(character)
    const fields = [BASIC_TRAINING_FIELD_ID, SCOUT_FIELD_ID]
    const base = previewSupportedStageModule(character, MILITARY_ACADEMY_ID, fields)!
    const pending = base.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.componentId === 'scout.language-any')!
    const english = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, {
      [pending.awardId]: [value('skill', 'skill.language', 'Language/English', 30, 'English')],
    }, fields)!
    const french = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, {
      [pending.awardId]: [value('skill', 'skill.language', 'Language/French', 30, 'French')],
    }, fields)!
    expect(english.character.skills.find((entry) => entry.displayName === 'Language/English')?.sourceAwards.some((award) => award.xp === 30)).toBe(true)
    expect(french.character.skills.find((entry) => entry.displayName === 'Language/English')?.sourceAwards.some((award) => award.xp === 30)).toBe(false)
    expect(french.character.skills.filter((entry) => entry.displayName === 'Language/French')).toHaveLength(1)
    expect(french.character.skills.find((entry) => entry.displayName === 'Language/French')?.sourceAwards.filter((award) => award.xp === 30)).toHaveLength(1)
    expect(french.character.creation.lifeModules!.resolvedAwards.some((entry) => entry.destination.displayName === 'Language/English' && entry.xp === 30)).toBe(false)
    expect(french.complete).toBe(false)
    expect(stageSlotContinueEnabled(french)).toBe(false)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it('previews, replaces, and deselects an open Scientist subject without stale state', () => {
    const character = draftAt('stage-3-selection')
    const committed = JSON.stringify(character)
    const fields = [BASIC_TRAINING_FIELD_ID, SCIENTIST_FIELD_ID]
    const base = previewSupportedStageModule(character, MILITARY_ACADEMY_ID, fields)!
    const pending = base.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.componentId === 'scientist.science-any')!
    const invalid = openSubjectStageChoiceSlot(pending, '   ')
    expect(invalid.error).toBe('Enter a subject.')
    expect(invalid.value.targetId).toBe('')

    const biologyValue = openSubjectStageChoiceSlot(pending, 'Biology').value
    const physicsValue = openSubjectStageChoiceSlot(pending, 'K-F  Drive Physics').value
    const biology = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, { [pending.awardId]: [biologyValue] }, fields)!
    const physics = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, { [pending.awardId]: [physicsValue] }, fields)!
    const deselected = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, {}, [BASIC_TRAINING_FIELD_ID, CAVALRY_FIELD_ID])!

    expect(biology.character.skills.filter((entry) => entry.displayName === 'Science/Biology')).toHaveLength(1)
    expect(physics.character.skills.some((entry) => entry.displayName === 'Science/Biology')).toBe(false)
    expect(physics.character.skills.find((entry) => entry.displayName === 'Science/K-F Drive Physics')).toMatchObject({ accumulatedXp: 30 })
    expect(physics.character.provenance.some((entry) => entry.description.includes('Scientist'))).toBe(true)
    expect(physics.complete).toBe(false)
    expect(stageSlotContinueEnabled(physics)).toBe(false)
    expect(deselected.character.skills.some((entry) => entry.address.skillId === 'skill.science')).toBe(false)
    expect(deselected.character.creation.lifeModules!.selectedSkillFields.some((entry) => entry.fieldId === SCIENTIST_FIELD_ID)).toBe(false)
    expect(JSON.stringify(character)).toBe(committed)

    const interestPending = base.creation.lifeModules!.pendingAwards.find((entry) => entry.skillFieldChoice?.componentId === 'scientist.interest-any')!
    const flexible = base.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'military-academy.flexible')!
    const complete = previewStageModuleChoiceSlots(character, MILITARY_ACADEMY_ID, {
      [interestPending.awardId]: [openSubjectStageChoiceSlot(interestPending, 'Astrobiology').value],
      [pending.awardId]: [physicsValue],
      [flexible.awardId]: [value('attribute', 'INT', 'INT', 100)],
    }, fields)!
    expect(complete.error).toBeNull()
    expect(complete.complete).toBe(true)
    expect(stageSlotContinueEnabled(complete)).toBe(true)
    expect(complete.character.skills.filter((entry) => entry.displayName === 'Interest/Astrobiology')).toHaveLength(1)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it('reports assigned, remaining, and over-limit flexible XP as slot amounts change', () => {
    const preview = previewSupportedStageModule(draftAt('stage-2-selection'), STAGE_2_HIGH_SCHOOL_ID)!
    const flexible = preview.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!

    const partial = stageChoicePoolProgress(flexible, [
      value('trait', 'trait.ambidextrous', 'Ambidextrous', 20),
      value('attribute', 'STR', 'STR', 50),
    ])
    expect(partial).toEqual({ assigned: 70, remaining: 115, overage: 0 })
    expect(stageChoicePoolProgressLabel(partial)).toBe('70 assigned · 115 remaining')

    const complete = stageChoicePoolProgress(flexible, [value('attribute', 'STR', 'STR', 185)])
    expect(stageChoicePoolProgressLabel(complete)).toBe('185 assigned · 0 remaining')

    const over = stageChoicePoolProgress(flexible, [
      value('attribute', 'STR', 'STR', 150),
      value('attribute', 'BOD', 'BOD', 50),
    ])
    expect(over).toEqual({ assigned: 200, remaining: 0, overage: 15 })
    expect(stageChoicePoolProgressLabel(over)).toBe('200 assigned · 15 XP over limit')
  })

  it('resolves a complete legal High School 185 XP allocation in the integrated preview', () => {
    const character = draftAt('stage-2-selection')
    const committed = JSON.stringify(character)
    const values = keyedValues(character, STAGE_2_HIGH_SCHOOL_ID, {
      'high-school.interest-40': [value('skill', 'skill.interest', 'Interest/History', 40, 'History')],
      'high-school.interest-35': [value('skill', 'skill.interest', 'Interest/Engineering', 35, 'Engineering')],
      'high-school.flexible': [
        value('attribute', 'STR', 'STR', 50),
        value('attribute', 'BOD', 'BOD', 50),
        value('attribute', 'DEX', 'DEX', 50),
        value('attribute', 'RFL', 'RFL', 35),
      ],
    })
    const result = previewStageModuleChoiceSlots(character, STAGE_2_HIGH_SCHOOL_ID, values)!

    expect(stageChoicePoolProgress(
      previewSupportedStageModule(character, STAGE_2_HIGH_SCHOOL_ID)!.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!,
      values['high-school.flexible'],
    )).toEqual({ assigned: 185, remaining: 0, overage: 0 })
    expect(result.error).toBeNull()
    expect(result.pendingAwards).toEqual([])
    expect(result.complete).toBe(true)
    expect(stageSlotPendingAwards(result)).toEqual([])
    expect(stageSlotContinueEnabled(result)).toBe(true)
    expect(result.character.lifeModuleHistory.at(-1)?.moduleId).toBe(STAGE_2_HIGH_SCHOOL_ID)
    expect(result.character.creation.lifeModules!.resolvedAwards.filter((entry) => entry.moduleId === STAGE_2_HIGH_SCHOOL_ID)).toHaveLength(6)
    expect(JSON.stringify(character)).toBe(committed)
  })

  it('filters sibling destinations within one award while preserving and restoring the current selection', () => {
    const options = [
      { value: 'STR', displayName: 'STR' },
      { value: 'trait.ambidextrous', displayName: 'Ambidextrous' },
      { value: 'skill.language/French', displayName: 'Language/French' },
    ]
    const values = [
      value('attribute', 'STR', 'STR', 50),
      value('trait', 'trait.ambidextrous', 'Ambidextrous', 20),
      value('skill', 'skill.language', 'Language/French', 35, 'French'),
    ]

    expect(filterSiblingDestinationOptions(options, values, 0).map((entry) => entry.value)).toEqual(['STR'])
    expect(filterSiblingDestinationOptions(options, values, 1).map((entry) => entry.value)).toEqual(['trait.ambidextrous'])
    expect(filterSiblingDestinationOptions(options, values, 2).map((entry) => entry.value)).toEqual(['skill.language/French'])

    const clearedSibling = [values[0], { ...values[1], targetId: '', displayName: '' }, values[2]]
    expect(filterSiblingDestinationOptions(options, clearedSibling, 0).map((entry) => entry.value)).toEqual(['STR', 'trait.ambidextrous'])
    expect(filterSiblingDestinationOptions(options, [], 0)).toEqual(options)
  })

  it('limits duplicate filtering to sibling slots in the same award group', () => {
    const options = [{ value: 'STR', displayName: 'STR' }, { value: 'BOD', displayName: 'BOD' }]
    const oneAwardValues = [value('attribute', 'STR', 'STR', 50)]

    expect(filterSiblingDestinationOptions(options, oneAwardValues, 1).map((entry) => entry.value)).toEqual(['BOD'])
    expect(filterSiblingDestinationOptions(options, [], 0).map((entry) => entry.value)).toEqual(['STR', 'BOD'])
  })

  it('groups separate same-module Interest awards without crossing unrelated award identities', () => {
    const character = draftAt('stage-2-selection')
    const preview = previewSupportedStageModule(character, STAGE_2_HIGH_SCHOOL_ID)!
    const pending = preview.creation.lifeModules!.pendingAwards.filter((entry) => entry.moduleId === STAGE_2_HIGH_SCHOOL_ID)
    const interest40 = pending.find((entry) => entry.awardId === 'high-school.interest-40')!
    const interest35 = pending.find((entry) => entry.awardId === 'high-school.interest-35')!
    const values = {
      [interest40.awardId]: [value('skill', 'skill.interest', 'Interest/History', 40, 'History')],
    }

    expect(relatedStageChoiceSlotValues(interest35, pending, values)).toEqual(values[interest40.awardId])

    const options = [
      { value: 'skill.interest/History', displayName: 'Interest/History' },
      { value: 'skill.interest/Engineering', displayName: 'Interest/Engineering' },
    ]
    const related = relatedStageChoiceSlotValues(interest35, pending, values)
    expect(filterSiblingDestinationOptions(options, [], 0, related).map((entry) => entry.value)).toEqual(['skill.interest/Engineering'])
  })

  it('keeps an earlier pending choice local and commits it with the selected module clone', () => {
    let character = createLifeModuleCharacter('Existing pending choice')
    character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
    character = applyCapellanCommonality(character, 'Russian')
    const existing = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'commonality.language.fedsuns')!
    const byAward = {
      'blue-collar.career': [value('skill', 'skill.career', 'Career/Soldier', 10, 'Soldier')],
      'blue-collar.interests': [value('skill', 'skill.interest', 'Interest/History', 5, 'History'), value('skill', 'skill.interest', 'Interest/Engineering', 5, 'Engineering')],
      'blue-collar.flexible': [value('attribute', 'STR', 'STR', 10), value('attribute', 'BOD', 'BOD', 10), value('attribute', 'DEX', 'DEX', 10), value('attribute', 'RFL', 'RFL', 10)],
    }
    const committed = JSON.stringify(character)
    const moduleValues = keyedValues(character, BLUE_COLLAR_ID, byAward)
    const preview = previewStageModuleChoiceSlots(character, BLUE_COLLAR_ID, moduleValues)!

    expect(preview.complete).toBe(false)
    expect(preview.existingPendingAwards.map((entry) => entry.id)).toContain(existing.id)
    expect(preview.character.lifeModuleHistory.at(-1)?.moduleId).toBe(BLUE_COLLAR_ID)
    expect(stageSlotPendingAwards(preview).map((entry) => entry.id)).toContain(existing.id)
    expect(stageSlotContinueEnabled(preview)).toBe(false)
    expect(JSON.stringify(character)).toBe(committed)

    const completed = previewStageModuleChoiceSlots(character, BLUE_COLLAR_ID, {
      ...moduleValues,
      [existing.awardId]: [value('skill', 'skill.language', 'Language/French', 5, 'French')],
    })!
    expect(completed.existingPendingAwards).toEqual([])
    expect(completed.pendingAwards).toEqual([])
    expect(completed.complete).toBe(true)
    expect(completed.character.creation.lifeModules!.resolvedAwards).toEqual(expect.arrayContaining([
      expect.objectContaining({ awardId: existing.awardId, destination: expect.objectContaining({ displayName: 'Language/French' }) }),
    ]))
    expect(completed.character.lifeModuleHistory.at(-1)?.moduleId).toBe(BLUE_COLLAR_ID)
    expect(stageSlotContinueEnabled(completed)).toBe(true)
    expect(JSON.stringify(character)).toBe(committed)
  })
})
