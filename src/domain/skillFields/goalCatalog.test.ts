import { describe, expect, it } from 'vitest'
import { SKILL_FIELD_CATALOG } from './catalog'
import { getMasterSkillFieldGoal, MASTER_SKILL_FIELD_GOAL_CATALOG, MECHWARRIOR_GOAL_ID } from './goalCatalog'

describe('Master Skill Field goal/reference catalog', () => {
  it('separates all 56 published goal references from the bounded mechanically acquirable Fields', () => {
    expect(MASTER_SKILL_FIELD_GOAL_CATALOG).toHaveLength(56)
    expect(new Set(MASTER_SKILL_FIELD_GOAL_CATALOG.map((entry) => entry.id)).size).toBe(56)
    expect(SKILL_FIELD_CATALOG).toHaveLength(16)
    expect(MASTER_SKILL_FIELD_GOAL_CATALOG.length).toBeGreaterThan(SKILL_FIELD_CATALOG.length)
    expect(MASTER_SKILL_FIELD_GOAL_CATALOG.filter((entry) => entry.category === 'civilian')).toHaveLength(27)
    expect(MASTER_SKILL_FIELD_GOAL_CATALOG.filter((entry) => entry.category === 'intelligence-police')).toHaveLength(6)
    expect(MASTER_SKILL_FIELD_GOAL_CATALOG.filter((entry) => entry.category === 'military')).toHaveLength(17)
    expect(MASTER_SKILL_FIELD_GOAL_CATALOG.filter((entry) => entry.category === 'clan-military')).toHaveLength(6)
  })

  it('keeps MechWarrior prerequisites separate from Field Skills and preserves Technician/Any', () => {
    const field = getMasterSkillFieldGoal(MECHWARRIOR_GOAL_ID)
    expect(field.displayName).toBe('MechWarrior')
    expect(field.source).toMatchObject({ edition: 'Corrected Third Printing', page: 94 })
    expect(field.prerequisites).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: 'skill-field', fieldIds: ['field.basic-training'] }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'DEX', minimum: 4 }),
      expect.objectContaining({ kind: 'attribute-minimum', attributeId: 'RFL', minimum: 4 }),
    ]))
    expect(field.fieldSkills.map((entry) => entry.displayName)).toContain('Gunnery/Mech')
    expect(field.fieldSkills.find((entry) => entry.displayName === 'Technician/Any')).toMatchObject({ variable: true, parameter: 'Any' })
  })
})
