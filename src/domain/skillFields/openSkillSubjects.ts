import type { ResolvedLifeModuleDestination } from '../character/model'

export const OPEN_SKILL_SUBJECT_MAX_LENGTH = 60
const OPEN_SUBJECT_SKILLS: ReadonlyMap<string, string> = new Map([
  ['skill.career', 'Career'],
  ['skill.interest', 'Interest'],
  ['skill.science', 'Science'],
  ['skill.survival', 'Survival'],
] as const)

export interface OpenSkillSubjectResult {
  subject: string
  error: string | null
}

export function validateOpenSkillSubject(input: string): OpenSkillSubjectResult {
  const subject = input.normalize('NFC').trim().replace(/\s+/g, ' ')
  if (!subject) return { subject: '', error: 'Enter a subject.' }
  if (subject.length > OPEN_SKILL_SUBJECT_MAX_LENGTH) return { subject, error: `Use ${OPEN_SKILL_SUBJECT_MAX_LENGTH} characters or fewer.` }
  if ([...subject].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) return { subject, error: 'Control characters are not allowed.' }
  if (/[\\/]/u.test(subject)) return { subject, error: 'Slash characters are not allowed in a subject.' }
  return { subject, error: null }
}

export function openSkillSubjectDestination(skillId: string, input: string): ResolvedLifeModuleDestination {
  const baseName = OPEN_SUBJECT_SKILLS.get(skillId)
  if (!baseName) throw new Error('This parent Skill does not authorize an open subject.')
  const result = validateOpenSkillSubject(input)
  if (result.error) throw new Error(result.error)
  return {
    type: 'skill',
    targetId: skillId,
    parameter: { kind: 'subskill', value: result.subject },
    displayName: `${baseName}/${result.subject}`,
  }
}

export function isOpenSubjectSkillId(skillId: string): boolean {
  return OPEN_SUBJECT_SKILLS.has(skillId)
}
