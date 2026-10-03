import { describe, expect, it } from 'vitest'
import { getSkillField, SCIENTIST_FIELD_ID, SPECIAL_FORCES_FIELD_ID, skillFieldCost } from './catalog'

describe('Alpha Slice 69 open-subject Skill Fields', () => {
  it('models Scientist with exact prerequisites, Skills, choices, and reduced cost', () => {
    const field = getSkillField(SCIENTIST_FIELD_ID)
    expect(field.prerequisites).toEqual([{ id: 'scientist.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' }])
    expect(field.componentSkills.map((entry) => entry.displayName)).toEqual(['Career/Scientist', 'Computers', 'Investigation', 'Perception', 'Training'])
    expect(field.variableComponentSkills).toEqual([
      expect.objectContaining({ id: 'scientist.interest-any', skillId: 'skill.interest', inputMode: 'open-subject', legalSubskills: [] }),
      expect.objectContaining({ id: 'scientist.science-any', skillId: 'skill.science', inputMode: 'open-subject', legalSubskills: [] }),
    ])
    expect(skillFieldCost(field, 24)).toBe(168)
  })

  it('models Special Forces with exact prerequisites, Skills, choices, and reduced cost', () => {
    const field = getSkillField(SPECIAL_FORCES_FIELD_ID)
    expect(field.prerequisites).toEqual([
      expect.objectContaining({ kind: 'skill-field', fieldIds: ['field.infantry', 'field.mechwarrior', 'field.scout'] }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'BOD', minimum: 4 }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'RFL', minimum: 4 }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'WIL', minimum: 5 }),
    ])
    expect(field.componentSkills.map((entry) => entry.displayName)).toEqual(['Acrobatics/Free-Fall', 'Demolitions', 'Small Arms', 'Stealth'])
    expect(field.variableComponentSkills).toEqual([
      expect.objectContaining({ id: 'special-forces.survival-any', skillId: 'skill.survival', inputMode: 'open-subject', legalSubskills: [] }),
      expect.objectContaining({ id: 'special-forces.tracking-any', skillId: 'skill.tracking', legalSubskills: ['Urban', 'Wilds'] }),
    ])
    expect(skillFieldCost(field, 24)).toBe(144)
  })
})
