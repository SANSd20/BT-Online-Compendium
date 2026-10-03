import { describe, expect, it } from 'vitest'
import { OFFICER_TRAINING_SCHOOL, sourceAllowsStage3Repeat, STAGE3_GENERAL_SCHOOL_TYPES, stage3GeneralSchoolType } from './stage3Schooling'

describe('Stage 3 general schooling type audit', () => {
  it('preserves every corrected-printing general school group', () => {
    expect(STAGE3_GENERAL_SCHOOL_TYPES).toEqual({
      civilian: ['Technical College', 'Trade School', 'University', 'Solaris Internship'],
      'intelligence-police': ['Police Academy', 'Intelligence Operative Training'],
      military: ['Military Academy', 'Military Enlistment', 'Family Training'],
    })
    expect(stage3GeneralSchoolType(OFFICER_TRAINING_SCHOOL)).toBe('secondary')
  })

  it('allows only different general types while exempting secondary Officer Training', () => {
    expect(sourceAllowsStage3Repeat('Military Academy', 'Military Enlistment')).toBe(false)
    expect(sourceAllowsStage3Repeat('Military Academy', 'Technical College')).toBe(true)
    expect(sourceAllowsStage3Repeat('Police Academy', 'Intelligence Operative Training')).toBe(false)
    expect(sourceAllowsStage3Repeat('Military Academy', OFFICER_TRAINING_SCHOOL)).toBe(true)
    expect(sourceAllowsStage3Repeat('Unknown School', 'Technical College')).toBe(false)
  })
})
