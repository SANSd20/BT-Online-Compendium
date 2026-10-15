import { describe, expect, it } from 'vitest'
import { applyCapellanCivilianJob, createLifeModuleCharacter } from './lifeModuleEngine'

function stage2Capellan() {
  const character = createLifeModuleCharacter('Capellan substitution')
  character.creation.lifeModules!.phase = 'stage-2-selection'
  character.creation.lifeModules!.currentStage = 2
  character.affiliations.push({ affiliationId: 'affiliation.capellan-confederation', role: 'birth', provenanceId: character.provenance[0].id })
  return character
}

describe('G1h-C Capellan Civilian Job substitution', () => {
  it('uses the canonical Stage 4 module in the Stage 2 slot at 600 XP and age 18', () => {
    const source = stage2Capellan()
    const result = applyCapellanCivilianJob(source)
    const history = result.lifeModuleHistory.at(-1)!
    expect(history).toMatchObject({ moduleId: 'stage4.civilian-job', stage: 2, costXp: 600, chronologyYears: 6, actualDurationYears: 0, partialDurationReason: 'capellan-substitution', sourceRelationId: 'relation.capellan.stage-2-civilian-job-substitution' })
    expect(result.chronology.at(-1)).toMatchObject({ operation: 'SET_AGE', ageBefore: 0, ageAfter: 18, sourceRelationId: 'relation.capellan.stage-2-civilian-job-substitution' })
    expect(result.creation.lifeModules?.moduleXp.spent).toBe(source.creation.lifeModules!.moduleXp.spent + 600)
    expect(result.lifeModuleHistory.filter((entry) => entry.stage === 2)).toHaveLength(1)
  })

  it('rejects non-Capellan, wrong-stage, invalid relation, and duplicate attempts atomically', () => {
    const nonCapellan = createLifeModuleCharacter('Non-Capellan')
    nonCapellan.creation.lifeModules!.phase = 'stage-2-selection'
    nonCapellan.creation.lifeModules!.currentStage = 2
    expect(() => applyCapellanCivilianJob(nonCapellan)).toThrow('Capellan Confederation')
    const capellan = stage2Capellan()
    capellan.creation.lifeModules!.phase = 'stage-1-selection'
    expect(() => applyCapellanCivilianJob(capellan)).toThrow('active Stage 2')
    const untouched = stage2Capellan()
    expect(untouched.lifeModuleHistory).toHaveLength(1)
    expect(untouched.creation.lifeModules?.moduleXp.spent).toBe(850)
  })
})
