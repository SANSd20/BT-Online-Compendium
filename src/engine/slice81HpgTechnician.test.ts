import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID, UNIVERSITY_ID } from '../domain/lifeModules/catalog'
import { ANALYSIS_FIELD_ID, CARTOGRAPHER_FIELD_ID, COMMUNICATIONS_FIELD_ID, HPG_TECHNICIAN_FIELD_ID, SKILL_FIELD_CATALOG, skillFieldCost } from '../domain/skillFields/catalog'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { applyStage0Affiliation, applyStage3School, createLifeModuleCharacter } from './lifeModuleEngine'

function stage3Draft(order?: 'comstar' | 'word-of-blake') {
  const character = applyStage0Affiliation(
    createLifeModuleCharacter(order ?? 'No order'),
    CAPELLAN_COMMONALITY_ID,
    'Mandarin Chinese',
    'Russian',
    undefined,
    undefined,
    order,
    order ? FEDERATED_SUNS_CRUCIS_MARCH_ID : undefined,
    order ? 'French' : undefined,
    order ? 'Electronic' : undefined,
    'no',
  )
  character.creation.lifeModules!.phase = 'stage-3-selection'
  character.creation.lifeModules!.currentStage = 3
  character.creation.lifeModules!.pendingAwards = []
  const intelligence = character.attributes.find((entry) => entry.attributeId === 'INT')!
  intelligence.purchasedLevel = 5
  intelligence.accumulatedXp = Math.max(intelligence.accumulatedXp, 500)
  return character
}

describe('Alpha Slice 81 HPG Technician', () => {
  it('models the corrected five-Skill, 120-XP Field and exact prerequisites', () => {
    const field = SKILL_FIELD_CATALOG.find((entry) => entry.id === HPG_TECHNICIAN_FIELD_ID)!
    expect(field).toMatchObject({ displayName: 'HPG Technician', category: 'advanced' })
    expect(field.prerequisites).toEqual([
      expect.objectContaining({
        kind: 'any-of',
        options: expect.arrayContaining([
          expect.objectContaining({ kind: 'affiliation', affiliationId: 'affiliation.comstar' }),
          expect.objectContaining({ kind: 'affiliation', affiliationId: 'affiliation.word-of-blake' }),
          expect.objectContaining({ kind: 'affiliation', affiliationId: 'affiliation.clan' }),
        ]),
      }),
      expect.objectContaining({ kind: 'skill-field', fieldIds: [COMMUNICATIONS_FIELD_ID] }),
    ])
    expect(field.componentSkills.map((entry) => entry.displayName)).toEqual([
      'Administration', 'Comms/Conventional', 'Comms/HPG', 'Computers', 'Cryptography',
    ])
    expect(skillFieldCost(field, 24)).toBe(120)
  })

  it.each(['comstar', 'word-of-blake'] as const)('accepts %s plus a staged Communications Field at University', (order) => {
    const selected = applyStage3School(stage3Draft(order), UNIVERSITY_ID, [COMMUNICATIONS_FIELD_ID, HPG_TECHNICIAN_FIELD_ID])
    expect(selected.creation.lifeModules!.selectedSkillFields.find((entry) => entry.fieldId === HPG_TECHNICIAN_FIELD_ID)).toMatchObject({
      category: 'advanced', chronologyYears: 2, purchaseCostXp: 120, xpPerSkill: 30,
    })
    expect(selected.creation.lifeModules!.prerequisiteIssues.filter((entry) => entry.moduleId === HPG_TECHNICIAN_FIELD_ID)).toEqual([
      expect.objectContaining({ prerequisiteId: 'hpg-technician.affiliation', status: 'satisfied' }),
      expect.objectContaining({ prerequisiteId: 'hpg-technician.field', status: 'satisfied' }),
    ])
    expect(selected.skills).toContainEqual(expect.objectContaining({ displayName: 'Comms/HPG', accumulatedXp: 30 }))
    expect(decodeCharacter(encodeCharacter(selected, '2026-10-04T00:00:00.000Z'))).toEqual(selected)
  })

  it('rejects No Order and does not accept component Skills or a Field goal in place of Communications', () => {
    const noOrder = applyStage3School(stage3Draft(), UNIVERSITY_ID, [COMMUNICATIONS_FIELD_ID, HPG_TECHNICIAN_FIELD_ID])
    expect(noOrder.creation.lifeModules!.prerequisiteIssues).toContainEqual(expect.objectContaining({
      moduleId: HPG_TECHNICIAN_FIELD_ID, prerequisiteId: 'hpg-technician.affiliation', status: 'outstanding',
    }))

    const componentOnly = stage3Draft('comstar')
    componentOnly.skills.push({ address: { skillId: 'skill.communications', parameter: { kind: 'subskill', value: 'Conventional' } }, displayName: 'Comms/Conventional', accumulatedXp: 100, level: 1, sourceAwards: [] })
    componentOnly.creation.lifeModules!.masterSkillFieldGoalId = COMMUNICATIONS_FIELD_ID
    const selected = applyStage3School(componentOnly, UNIVERSITY_ID, [CARTOGRAPHER_FIELD_ID, HPG_TECHNICIAN_FIELD_ID])
    expect(selected.creation.lifeModules!.prerequisiteIssues).toContainEqual(expect.objectContaining({
      moduleId: HPG_TECHNICIAN_FIELD_ID, prerequisiteId: 'hpg-technician.field', status: 'outstanding',
    }))
  })

  it('keeps preview input unchanged and removes all HPG effects on deselection', () => {
    const input = stage3Draft('comstar')
    const before = JSON.stringify(input)
    const selected = applyStage3School(input, UNIVERSITY_ID, [COMMUNICATIONS_FIELD_ID, HPG_TECHNICIAN_FIELD_ID])
    expect(JSON.stringify(input)).toBe(before)
    expect(selected.skills.some((entry) => entry.displayName === 'Comms/HPG')).toBe(true)

    const deselected = applyStage3School(input, UNIVERSITY_ID, [COMMUNICATIONS_FIELD_ID, ANALYSIS_FIELD_ID])
    expect(deselected.creation.lifeModules!.selectedSkillFields.some((entry) => entry.fieldId === HPG_TECHNICIAN_FIELD_ID)).toBe(false)
    expect(deselected.skills.some((entry) => entry.displayName === 'Comms/HPG')).toBe(false)
  })
})
