export type Stage3GeneralSchoolFamily = 'civilian' | 'intelligence-police' | 'military'

export interface Stage3GeneralSchoolClassification {
  moduleId: string
  displayName: string
  classification: 'general'
  family: Stage3GeneralSchoolFamily
}

export interface Stage3SecondarySchoolClassification {
  moduleId: string
  displayName: string
  classification: 'secondary'
}

export interface Stage3SchoolEligibilityContext {
  completedFieldCategories?: readonly ('basic' | 'advanced' | 'special')[]
}

export type Stage3SchoolClassification = Stage3GeneralSchoolClassification | Stage3SecondarySchoolClassification

/** Canonical corrected-printing Stage 3 school classification. */
export const STAGE3_SCHOOLS: readonly Stage3SchoolClassification[] = [
  { moduleId: 'stage3.technical-college', displayName: 'Technical College', classification: 'general', family: 'civilian' },
  { moduleId: 'stage3.trade-school', displayName: 'Trade School', classification: 'general', family: 'civilian' },
  { moduleId: 'stage3.university', displayName: 'University', classification: 'general', family: 'civilian' },
  { moduleId: 'stage3.solaris-internship', displayName: 'Solaris Internship', classification: 'general', family: 'civilian' },
  { moduleId: 'stage3.police-academy', displayName: 'Police Academy', classification: 'general', family: 'intelligence-police' },
  { moduleId: 'stage3.intelligence-operative-training', displayName: 'Intelligence Operative Training', classification: 'general', family: 'intelligence-police' },
  { moduleId: 'stage3.military-academy', displayName: 'Military Academy', classification: 'general', family: 'military' },
  { moduleId: 'stage3.military-enlistment', displayName: 'Military Enlistment', classification: 'general', family: 'military' },
  { moduleId: 'stage3.family-training', displayName: 'Family Training', classification: 'general', family: 'military' },
  { moduleId: 'stage3.officer-training', displayName: 'Officer Candidate School', classification: 'secondary' },
]

export const OFFICER_TRAINING_SCHOOL_ID = 'stage3.officer-training'

export const STAGE3_GENERAL_SCHOOL_TYPES: Readonly<Record<Stage3GeneralSchoolFamily, readonly string[]>> = {
  civilian: STAGE3_SCHOOLS.filter((school) => school.classification === 'general' && school.family === 'civilian').map((school) => school.displayName),
  'intelligence-police': STAGE3_SCHOOLS.filter((school) => school.classification === 'general' && school.family === 'intelligence-police').map((school) => school.displayName),
  military: STAGE3_SCHOOLS.filter((school) => school.classification === 'general' && school.family === 'military').map((school) => school.displayName),
}

export function stage3SchoolClassification(moduleId: string): Stage3SchoolClassification | undefined {
  return STAGE3_SCHOOLS.find((school) => school.moduleId === moduleId)
}

export function usedStage3SchoolFamilies(moduleIds: readonly string[]): Set<Stage3GeneralSchoolFamily> {
  return new Set(moduleIds.flatMap((moduleId) => {
    const school = stage3SchoolClassification(moduleId)
    return school?.classification === 'general' ? [school.family] : []
  }))
}

export function stage3SchoolEligibility(completedModuleIds: readonly string[], candidateModuleId: string, context: Stage3SchoolEligibilityContext = {}): { eligible: boolean; reason?: string } {
  const candidate = stage3SchoolClassification(candidateModuleId)
  if (!candidate) return { eligible: false, reason: 'This Stage 3 school has no governed school-family classification.' }
  if (completedModuleIds.includes(candidateModuleId)) return { eligible: false, reason: `${candidate.displayName} has already been completed.` }
  if (candidate.classification === 'secondary') {
    const priorGeneralSchools = completedModuleIds.map(stage3SchoolClassification).filter((school): school is Stage3GeneralSchoolClassification => school?.classification === 'general')
    if (priorGeneralSchools.length === 0) return { eligible: false, reason: 'Officer Candidate School requires prior Intelligence/Police or Military schooling.' }
    if (priorGeneralSchools.some((school) => school.family === 'civilian')) return { eligible: false, reason: 'Officer Candidate School requires the character to have used only Intelligence/Police or Military Stage 3 schools.' }
    const categories = context.completedFieldCategories ?? []
    if (!categories.includes('basic') || !categories.includes('advanced')) {
      return { eligible: false, reason: 'Officer Candidate School requires at least one previously acquired Basic Field and one Advanced Field.' }
    }
    return { eligible: true }
  }
  if (!usedStage3SchoolFamilies(completedModuleIds).has(candidate.family)) return { eligible: true }
  const familyLabel = candidate.family === 'intelligence-police' ? 'Intelligence/Police' : candidate.family[0].toUpperCase() + candidate.family.slice(1)
  return { eligible: false, reason: `Another ${familyLabel} Stage 3 school has already been completed.` }
}

export function sourceAllowsStage3Repeat(priorModuleIds: readonly string[], nextModuleId: string): boolean {
  return stage3SchoolEligibility(priorModuleIds, nextModuleId).eligible
}
