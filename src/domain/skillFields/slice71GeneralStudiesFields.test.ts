import { describe, expect, it } from 'vitest'
import { getSkillField, ANTHROPOLOGIST_FIELD_ID, ARCHAEOLOGIST_FIELD_ID, GENERAL_STUDIES_FIELD_ID, LAWYER_FIELD_ID, skillFieldCost } from './catalog'

describe('Alpha Slice 71 General Studies dependency chain', () => {
  it('models General Studies with the source related-Skill prerequisite and exact five-Skill cost', () => {
    const field = getSkillField(GENERAL_STUDIES_FIELD_ID)
    expect(field.category).toBe('basic')
    expect(field.prerequisites).toEqual([expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 3 })])
    expect(field.relatedSkillPrerequisite).toEqual(expect.objectContaining({ id: 'general-studies.related-skill', gmApprovalRequired: true }))
    expect(field.componentSkills.map((entry) => entry.displayName)).toEqual(['Computers', 'Perception'])
    expect(field.variableComponentSkills?.map((entry) => [entry.id, entry.skillId, entry.inputMode])).toEqual([
      ['general-studies.career-any', 'skill.career', 'open-subject'],
      ['general-studies.interest-any', 'skill.interest', 'open-subject'],
      ['general-studies.protocol-affiliation', 'skill.protocol', 'select'],
    ])
    expect(skillFieldCost(field, 24)).toBe(120)
  })

  it('models every dependent University Field with its exact prerequisites, Skills, and cost', () => {
    expect(getSkillField(ANTHROPOLOGIST_FIELD_ID)).toMatchObject({
      category: 'advanced',
      prerequisites: [
        expect.objectContaining({ kind: 'skill-field', fieldIds: [GENERAL_STUDIES_FIELD_ID] }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 4 }),
      ],
    })
    expect(getSkillField(ANTHROPOLOGIST_FIELD_ID).variableComponentSkills?.map((entry) => entry.id)).toEqual([
      'anthropologist.history-culture', 'anthropologist.language-one', 'anthropologist.language-two', 'anthropologist.protocol-any',
    ])
    expect(skillFieldCost(getSkillField(ANTHROPOLOGIST_FIELD_ID), 24)).toBe(144)

    expect(getSkillField(ARCHAEOLOGIST_FIELD_ID)).toMatchObject({
      category: 'advanced',
      prerequisites: [
        expect.objectContaining({ kind: 'skill-field', fieldIds: [GENERAL_STUDIES_FIELD_ID] }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 4 }),
      ],
    })
    expect(getSkillField(ARCHAEOLOGIST_FIELD_ID).componentSkills.map((entry) => entry.displayName)).toEqual([
      'Career/Archaeologist', 'Appraisal', 'Interest/Geology', 'Navigation/Ground', 'Perception',
    ])
    expect(skillFieldCost(getSkillField(ARCHAEOLOGIST_FIELD_ID), 24)).toBe(144)

    expect(getSkillField(LAWYER_FIELD_ID)).toMatchObject({
      category: 'special',
      prerequisites: [
        expect.objectContaining({ kind: 'skill-field', fieldIds: [GENERAL_STUDIES_FIELD_ID] }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 4 }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'CHA', minimum: 4 }),
        expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'WIL', minimum: 5 }),
      ],
    })
    expect(getSkillField(LAWYER_FIELD_ID).componentSkills.map((entry) => entry.displayName)).toEqual([
      'Acting', 'Administration', 'Career/Lawyer', 'Interest/Law', 'Negotiation',
    ])
    expect(skillFieldCost(getSkillField(LAWYER_FIELD_ID), 24)).toBe(144)
  })
})
