import { describe, expect, it } from 'vitest'
import { OPEN_SKILL_SUBJECT_MAX_LENGTH, isOpenSubjectSkillId, openSkillSubjectDestination, validateOpenSkillSubject } from './openSkillSubjects'

describe('open Skill subject identity', () => {
  it.each(['', '   ', '\t\n'])('rejects an empty subject %#', (input) => {
    expect(validateOpenSkillSubject(input).error).toBe('Enter a subject.')
  })

  it('normalizes boundary and repeated whitespace while preserving meaningful case and punctuation', () => {
    expect(validateOpenSkillSubject('  K-F   Drive Physics  ')).toEqual({ subject: 'K-F Drive Physics', error: null })
    expect(openSkillSubjectDestination('skill.science', '  K-F   Drive Physics  ')).toEqual({
      type: 'skill', targetId: 'skill.science', displayName: 'Science/K-F Drive Physics', parameter: { kind: 'subskill', value: 'K-F Drive Physics' },
    })
  })

  it.each(['History/Art', 'History\\Art', `Bad\u0000Subject`, 'x'.repeat(OPEN_SKILL_SUBJECT_MAX_LENGTH + 1)])('rejects unsafe or excessive input %#', (input) => {
    expect(validateOpenSkillSubject(input).error).not.toBeNull()
  })

  it('keeps the parent Skill fixed and rejects unsupported parents', () => {
    expect(isOpenSubjectSkillId('skill.career')).toBe(true)
    expect(() => openSkillSubjectDestination('skill.language', 'English')).toThrow('does not authorize')
    expect(() => openSkillSubjectDestination('skill.career/skill.gunnery', 'Pilot')).toThrow('does not authorize')
  })
})
