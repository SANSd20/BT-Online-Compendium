import { SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS } from '../lifeModules/affiliations'
import { MODELED_LANGUAGE_SUBSKILLS } from '../skills/languages'

export type VariableSkillDomainSemantics =
  | 'closed-canonical'
  | 'modeled-bounded-subset'
  | 'affiliation-constrained-choice'
  | 'named-source-option-set'
  | 'open-gm-defined'

export interface VariableSkillDomain {
  id: string
  skillId: string
  semantics: VariableSkillDomainSemantics
  completeness: 'exhaustive' | 'modeled-bounded'
  options: readonly string[]
  description: string
}

const affiliationLabels = (key: 'protocolContextLabel' | 'streetwiseContextLabel') =>
  [...new Set(SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.map((context) => context[key]))]

export const VARIABLE_SKILL_DOMAINS = {
  technician: domain('technician', 'skill.technician', 'closed-canonical', 'exhaustive', ['Aeronautics', 'Cybernetics', 'Electronic', 'Jets', 'Mechanical', 'Myomer', 'Nuclear', 'Weapons'], 'Complete Technician subskill list.'),
  securitySystems: domain('security-systems', 'skill.security-systems', 'closed-canonical', 'exhaustive', ['Electronic', 'Mechanical'], 'Complete Security Systems subskill list.'),
  driving: domain('driving', 'skill.driving', 'closed-canonical', 'exhaustive', ['Ground Vehicles', 'Rail Vehicles', 'Sea Vehicles'], 'Complete Driving subskill list.'),
  vehicleGunnery: domain('vehicle-gunnery', 'skill.gunnery', 'closed-canonical', 'exhaustive', ['Air Vehicle', 'Ground Vehicle', 'Sea Vehicle'], 'Source-bounded vehicle Gunnery choices.'),
  cavalryTactics: domain('cavalry-tactics', 'skill.tactics', 'closed-canonical', 'exhaustive', ['Land', 'Sea'], 'Source-bounded Cavalry Tactics choices.'),
  tactics: domain('tactics', 'skill.tactics', 'closed-canonical', 'exhaustive', ['Infantry', 'Land', 'Sea', 'Air', 'Space'], 'Complete Tactics subskill list.'),
  tracking: domain('tracking', 'skill.tracking', 'closed-canonical', 'exhaustive', ['Urban', 'Wilds'], 'Complete Tracking subskill list.'),
  thrownWeapons: domain('thrown-weapons', 'skill.thrown-weapons', 'closed-canonical', 'exhaustive', ['Blade', 'Blunt'], 'Complete Thrown Weapons subskill list.'),
  medTech: domain('medtech', 'skill.medtech', 'closed-canonical', 'exhaustive', ['General', 'Veterinary'], 'Complete MedTech subskill list.'),
  surgery: domain('surgery', 'skill.surgery', 'closed-canonical', 'exhaustive', ['General', 'Veterinary'], 'Complete Surgery subskill list.'),
  navalCareer: domain('naval-career', 'skill.career', 'named-source-option-set', 'exhaustive', ['Pilot', 'Ship’s Crew'], 'Options named by Basic Training (Naval).'),
  aircraftPiloting: domain('aircraft-piloting', 'skill.piloting', 'named-source-option-set', 'exhaustive', ['Air Vehicle', 'VTOL'], 'Options named by Pilot – Aircraft (Civilian).'),
  languages: domain('modeled-languages', 'skill.language', 'modeled-bounded-subset', 'modeled-bounded', MODELED_LANGUAGE_SUBSKILLS, 'Concrete languages supported by current character-creation data; not a claim of a complete setting language list.'),
  protocolAffiliations: domain('modeled-protocol-affiliations', 'skill.protocol', 'affiliation-constrained-choice', 'modeled-bounded', affiliationLabels('protocolContextLabel'), 'Protocol choices derived from supported affiliation contexts.'),
  streetwiseAffiliations: domain('modeled-streetwise-affiliations', 'skill.streetwise', 'affiliation-constrained-choice', 'modeled-bounded', affiliationLabels('streetwiseContextLabel'), 'Streetwise choices derived from supported affiliation contexts.'),
} as const satisfies Record<string, VariableSkillDomain>

export const VARIABLE_SKILL_DOMAIN_CATALOG: readonly VariableSkillDomain[] = Object.values(VARIABLE_SKILL_DOMAINS)

export function getVariableSkillDomain(id: string): VariableSkillDomain {
  const result = VARIABLE_SKILL_DOMAIN_CATALOG.find((entry) => entry.id === id)
  if (!result) throw new Error(`Unknown variable Skill domain: ${id}`)
  return result
}

function domain(id: string, skillId: string, semantics: VariableSkillDomainSemantics, completeness: VariableSkillDomain['completeness'], options: readonly string[], description: string): VariableSkillDomain {
  return { id, skillId, semantics, completeness, options, description }
}
