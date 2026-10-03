import { describe, expect, it } from 'vitest'
import { getSkillField, MANAGER_FIELD_ID, PLANETARY_SURVEYOR_FIELD_ID, POLITICIAN_FIELD_ID, skillFieldCost } from './catalog'

describe('Alpha Slice 70 University-promoted Skill Fields', () => {
  it('models Manager with exact prerequisites, Skills, affiliation award, and cost', () => {
    const field = getSkillField(MANAGER_FIELD_ID)
    expect(field.prerequisites).toEqual([
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 5 }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'CHA', minimum: 5 }),
    ])
    expect(field.componentSkills.map((entry) => entry.displayName)).toEqual(['Administration', 'Career/Management', 'Leadership', 'Negotiation', 'Training'])
    expect(field.affiliationBoundComponentSkills).toEqual([{ skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' }])
    expect(skillFieldCost(field, 24)).toBe(144)
  })

  it('models Planetary Surveyor with the Scientist prerequisite and governed Driving and Survival choices', () => {
    const field = getSkillField(PLANETARY_SURVEYOR_FIELD_ID)
    expect(field.prerequisites).toEqual([
      expect.objectContaining({ kind: 'skill-field', fieldIds: ['field.scientist'] }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'INT', minimum: 6 }),
    ])
    expect(field.componentSkills.map((entry) => entry.displayName)).toEqual(['Appraisal', 'Navigation/Ground', 'Tracking/Wilds'])
    expect(field.variableComponentSkills).toEqual([
      expect.objectContaining({ id: 'planetary-surveyor.driving-any', skillId: 'skill.driving', inputMode: 'select' }),
      expect.objectContaining({ id: 'planetary-surveyor.survival-any', skillId: 'skill.survival', inputMode: 'open-subject', legalSubskills: [] }),
    ])
    expect(skillFieldCost(field, 24)).toBe(120)
  })

  it('models Politician as an Advanced Field requiring Manager', () => {
    const field = getSkillField(POLITICIAN_FIELD_ID)
    expect(field.prerequisites).toEqual([
      expect.objectContaining({ kind: 'skill-field', fieldIds: [MANAGER_FIELD_ID] }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'CHA', minimum: 4 }),
    ])
    expect(field.componentSkills.map((entry) => entry.displayName)).toEqual(['Acting', 'Career/Politician', 'Leadership', 'Negotiation'])
    expect(field.affiliationBoundComponentSkills).toEqual([{ skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' }])
    expect(skillFieldCost(field, 24)).toBe(120)
  })
})
