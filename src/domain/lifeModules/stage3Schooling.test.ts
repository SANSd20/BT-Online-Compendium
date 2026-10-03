import { describe, expect, it } from 'vitest'
import { OFFICER_TRAINING_SCHOOL_ID, sourceAllowsStage3Repeat, STAGE3_GENERAL_SCHOOL_TYPES, stage3SchoolClassification, stage3SchoolEligibility, usedStage3SchoolFamilies } from './stage3Schooling'

describe('Stage 3 general schooling type audit', () => {
  it('preserves every corrected-printing general school group', () => {
    expect(STAGE3_GENERAL_SCHOOL_TYPES).toEqual({
      civilian: ['Technical College', 'Trade School', 'University', 'Solaris Internship'],
      'intelligence-police': ['Police Academy', 'Intelligence Operative Training'],
      military: ['Military Academy', 'Military Enlistment', 'Family Training'],
    })
    expect(stage3SchoolClassification(OFFICER_TRAINING_SCHOOL_ID)).toMatchObject({ classification: 'secondary' })
  })

  it('uses stable module IDs and allows only unused general families', () => {
    expect(sourceAllowsStage3Repeat(['stage3.military-academy'], 'stage3.military-enlistment')).toBe(false)
    expect(sourceAllowsStage3Repeat(['stage3.military-academy'], 'stage3.technical-college')).toBe(true)
    expect(sourceAllowsStage3Repeat(['stage3.police-academy'], 'stage3.intelligence-operative-training')).toBe(false)
    expect(sourceAllowsStage3Repeat(['stage3.military-academy'], OFFICER_TRAINING_SCHOOL_ID)).toBe(true)
    expect(sourceAllowsStage3Repeat(['stage3.unknown'], 'stage3.technical-college')).toBe(true)
    expect(sourceAllowsStage3Repeat([], 'stage3.unknown')).toBe(false)
  })

  it('supports all three general families without a one-repeat ceiling', () => {
    expect([...usedStage3SchoolFamilies(['stage3.military-academy', 'stage3.technical-college'])]).toEqual(['military', 'civilian'])
    expect(stage3SchoolEligibility(['stage3.military-academy', 'stage3.technical-college'], 'stage3.police-academy')).toEqual({ eligible: true })
    expect(stage3SchoolEligibility(['stage3.military-academy'], 'stage3.military-enlistment')).toEqual({
      eligible: false,
      reason: 'Another Military Stage 3 school has already been completed.',
    })
  })
})
