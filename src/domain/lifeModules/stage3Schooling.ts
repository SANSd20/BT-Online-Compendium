export type Stage3GeneralSchoolType = 'civilian' | 'intelligence-police' | 'military'

export const STAGE3_GENERAL_SCHOOL_TYPES: Readonly<Record<Stage3GeneralSchoolType, readonly string[]>> = {
  civilian: ['Technical College', 'Trade School', 'University', 'Solaris Internship'],
  'intelligence-police': ['Police Academy', 'Intelligence Operative Training'],
  military: ['Military Academy', 'Military Enlistment', 'Family Training'],
}

export const OFFICER_TRAINING_SCHOOL = 'Officer Training'

export function stage3GeneralSchoolType(schoolName: string): Stage3GeneralSchoolType | 'secondary' | undefined {
  if (schoolName === OFFICER_TRAINING_SCHOOL) return 'secondary'
  return (Object.entries(STAGE3_GENERAL_SCHOOL_TYPES) as Array<[Stage3GeneralSchoolType, readonly string[]]>)
    .find(([, schools]) => schools.includes(schoolName))?.[0]
}

export function sourceAllowsStage3Repeat(priorSchoolName: string, nextSchoolName: string): boolean {
  const prior = stage3GeneralSchoolType(priorSchoolName)
  const next = stage3GeneralSchoolType(nextSchoolName)
  if (!prior || !next) return false
  if (prior === 'secondary' || next === 'secondary') return true
  return prior !== next
}
