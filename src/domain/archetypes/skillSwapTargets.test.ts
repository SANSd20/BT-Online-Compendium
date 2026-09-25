import { describe, expect, it } from 'vitest'
import { CORE_ARCHETYPES } from './coreArchetypes'
import {
  archetypeSkillAddressId,
  getKnownSafeSkillSwapTargets,
} from './skillSwapTargets'
import { standardSkillXpCost } from '../pointBuy/catalog'

describe('bounded Archetype Skill-swap targets', () => {
  it('derives only absent, exact-XP targets from the audited Core Archetype data', () => {
    let offered = 0
    for (const archetype of CORE_ARCHETYPES) {
      const foundationIds = new Set(archetype.skills.map((skill) => archetypeSkillAddressId(skill.address)))
      for (const source of archetype.skills) {
        const sourceId = archetypeSkillAddressId(source.address)
        const targets = getKnownSafeSkillSwapTargets(archetype.id, sourceId)
        offered += targets.length
        for (const target of targets) {
          expect(foundationIds.has(target.targetId)).toBe(false)
          expect(target.xp).toBe(source.xp)
          expect(standardSkillXpCost(target.level)).toBe(standardSkillXpCost(source.level))
          if (target.address.parameter) {
            expect(target.address.parameter).toMatchObject({ kind: 'subskill' })
            expect(target.address.parameter.value.trim()).not.toBe('')
          }
          expect(CORE_ARCHETYPES.some((candidate) => (
            candidate.id === target.catalogArchetypeId &&
            candidate.skills.some((skill) => archetypeSkillAddressId(skill.address) === target.targetId)
          ))).toBe(true)
        }
      }
    }
    expect(offered).toBeGreaterThan(0)
  })

  it('blocks mixed subskill identity and specialty targets instead of guessing', () => {
    const mechWarrior = CORE_ARCHETYPES.find((entry) => entry.id === 'archetype.core.mechwarrior')!
    const art = mechWarrior.skills.find((entry) => entry.displayName === 'Art/Painting')!
    const targets = getKnownSafeSkillSwapTargets(mechWarrior.id, archetypeSkillAddressId(art.address))
    expect(targets.some((entry) => entry.targetId === archetypeSkillAddressId({ skillId: 'skill.medtech' }))).toBe(false)
    expect(targets.some((entry) => entry.targetId === archetypeSkillAddressId({ skillId: 'skill.acting' }))).toBe(false)
    expect(targets.some((entry) => entry.targetId === archetypeSkillAddressId({ skillId: 'skill.small-arms' }))).toBe(false)
  })
})
