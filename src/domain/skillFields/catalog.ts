import type { SourceCitation } from '../rules/model'
import type { LifeModuleDestination } from '../lifeModules/model'
import type { SkillFieldCatalogValidationIssue, SkillFieldDefinition } from './model'
import { MODELED_LANGUAGE_SUBSKILLS } from '../skills/languages'
import { getVariableSkillDomain, VARIABLE_SKILL_DOMAINS } from './variableSkillDomains'

const source = (ruleId: string): SourceCitation => ({
  sourceId: 'atow-core-corrected-third',
  edition: 'Corrected Third Printing',
  ruleId,
})

const skill = (skillId: string, displayName: string, parameter?: string): Extract<LifeModuleDestination, { type: 'skill' }> => ({
  type: 'skill',
  address: { skillId, ...(parameter ? { parameter: { kind: 'subskill', value: parameter } } : {}) },
  displayName,
})

export const TECHNICIAN_CIVILIAN_FIELD_ID = 'field.technician-civilian'
export const TECHNICIAN_VEHICLE_FIELD_ID = 'field.technician-vehicle'
export const BASIC_TRAINING_FIELD_ID = 'field.basic-training'
export const BASIC_TRAINING_NAVAL_FIELD_ID = 'field.basic-training-naval'
export const PILOT_EXOSKELETON_FIELD_ID = 'field.pilot-exoskeleton'
export const CARTOGRAPHER_FIELD_ID = 'field.cartographer'
export const PILOT_INDUSTRIALMECH_FIELD_ID = 'field.pilot-industrialmech'
export const TECHNICIAN_AEROSPACE_FIELD_ID = 'field.technician-aerospace'
export const TECHNICIAN_MECH_FIELD_ID = 'field.technician-mech'
export const INFANTRY_FIELD_ID = 'field.infantry'
export const MECHWARRIOR_FIELD_ID = 'field.mechwarrior'
export const MARINE_FIELD_ID = 'field.marine'
export const SHIPS_CREW_FIELD_ID = 'field.ships-crew'
export const TECHNICIAN_MILITARY_FIELD_ID = 'field.technician-military'
export const CAVALRY_FIELD_ID = 'field.cavalry'
export const SCOUT_FIELD_ID = 'field.scout'
export const POLICE_OFFICER_FIELD_ID = 'field.police-officer'
export const DETECTIVE_FIELD_ID = 'field.detective'
export const INTELLIGENCE_FIELD_ID = 'field.intelligence'
export const OFFICER_FIELD_ID = 'field.officer'
export const COMMUNICATIONS_FIELD_ID = 'field.communications'
export const ENGINEER_FIELD_ID = 'field.engineer'
export const MERCHANT_MARINE_FIELD_ID = 'field.merchant-marine'
export const PILOT_AIRCRAFT_CIVILIAN_FIELD_ID = 'field.pilot-aircraft-civilian'
export const MEDICAL_ASSISTANT_FIELD_ID = 'field.medical-assistant'
export const DOCTOR_FIELD_ID = 'field.doctor'
export const ANALYSIS_FIELD_ID = 'field.analysis'
export const COVERT_OPERATIONS_FIELD_ID = 'field.covert-operations'
export const POLICE_TACTICAL_OFFICER_FIELD_ID = 'field.police-tactical-officer'
export const MILITARY_SCIENTIST_FIELD_ID = 'field.military-scientist'
export const SCIENTIST_FIELD_ID = 'field.scientist'
export const SPECIAL_FORCES_FIELD_ID = 'field.special-forces'
export const MANAGER_FIELD_ID = 'field.manager'
export const PLANETARY_SURVEYOR_FIELD_ID = 'field.planetary-surveyor'
export const POLITICIAN_FIELD_ID = 'field.politician'
export const GENERAL_STUDIES_FIELD_ID = 'field.general-studies'
export const ANTHROPOLOGIST_FIELD_ID = 'field.anthropologist'
export const ARCHAEOLOGIST_FIELD_ID = 'field.archaeologist'
export const LAWYER_FIELD_ID = 'field.lawyer'
export const MERCHANT_FIELD_ID = 'field.merchant'
export const JOURNALIST_FIELD_ID = 'field.journalist'

export const SECURITY_SYSTEMS_SUBSKILLS = VARIABLE_SKILL_DOMAINS.securitySystems.options
export const NAVAL_CAREER_SUBSKILLS = VARIABLE_SKILL_DOMAINS.navalCareer.options
export const DRIVING_SUBSKILLS = VARIABLE_SKILL_DOMAINS.driving.options
export const VEHICLE_GUNNERY_SUBSKILLS = VARIABLE_SKILL_DOMAINS.vehicleGunnery.options
export const CAVALRY_TACTICS_SUBSKILLS = VARIABLE_SKILL_DOMAINS.cavalryTactics.options
export const SCOUT_STREETWISE_SUBSKILLS = VARIABLE_SKILL_DOMAINS.streetwiseAffiliations.options
export const TRACKING_SUBSKILLS = VARIABLE_SKILL_DOMAINS.tracking.options
export const TECHNICIAN_SUBSKILLS = VARIABLE_SKILL_DOMAINS.technician.options

const variableSkill = (id: string, displayName: string, domain: { id: string; skillId: string; options: readonly string[] }) => ({
  id, displayName, skillId: domain.skillId, choiceDomainId: domain.id, inputMode: getVariableSkillDomain(domain.id).inputMode, legalSubskills: [...domain.options],
})

export const SKILL_FIELD_CATALOG: readonly SkillFieldDefinition[] = [
  {
    id: BASIC_TRAINING_FIELD_ID,
    displayName: 'Basic Training',
    category: 'basic',
    source: { ...source('skill-field-basic-training'), page: 94 },
    prerequisites: [
      { id: 'basic-training.rank', kind: 'trait', traitId: 'trait.rank', description: 'Rank Trait' },
      { id: 'basic-training.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' },
      { id: 'basic-training.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 3, description: 'WIL 3+' },
    ],
    componentSkills: [
      skill('skill.career', 'Career/Soldier', 'Soldier'),
      skill('skill.martial-arts', 'Martial Arts'),
      skill('skill.medtech', 'MedTech/General', 'General'),
      skill('skill.navigation', 'Navigation/Ground', 'Ground'),
      skill('skill.small-arms', 'Small Arms'),
    ],
  },
  {
    id: BASIC_TRAINING_NAVAL_FIELD_ID,
    displayName: 'Basic Training (Naval)',
    category: 'basic',
    source: { ...source('skill-field-basic-training-naval'), page: 94 },
    prerequisites: [
      { id: 'basic-training-naval.rank', kind: 'trait', traitId: 'trait.rank', description: 'Rank Trait' },
      { id: 'basic-training-naval.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
      { id: 'basic-training-naval.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 3, description: 'RFL 3+' },
      { id: 'basic-training-naval.tds', kind: 'trait-absent', traitId: 'trait.tds', description: 'Cannot have TDS Trait' },
    ],
    componentSkills: [
      skill('skill.martial-arts', 'Martial Arts'),
      skill('skill.medtech', 'MedTech/General', 'General'),
      skill('skill.navigation', 'Navigation/Space', 'Space'),
      skill('skill.small-arms', 'Small Arms'),
      skill('skill.zero-g-operations', 'Zero-G Operations'),
    ],
    variableComponentSkills: [{
      id: 'basic-training-naval.career',
      displayName: 'Naval Career subskill',
      skillId: 'skill.career',
      choiceDomainId: VARIABLE_SKILL_DOMAINS.navalCareer.id,
      legalSubskills: [...NAVAL_CAREER_SUBSKILLS],
    }],
  },
  {
    id: POLICE_OFFICER_FIELD_ID,
    displayName: 'Police Officer',
    category: 'basic',
    source: { ...source('skill-field-police-officer'), page: 93 },
    prerequisites: [
      { id: 'police-officer.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 3, description: 'WIL 3+' },
    ],
    componentSkills: [
      skill('skill.acting', 'Acting'),
      skill('skill.career', 'Career/Police', 'Police'),
      skill('skill.martial-arts', 'Martial Arts'),
      skill('skill.medtech', 'MedTech/General', 'General'),
      skill('skill.small-arms', 'Small Arms'),
    ],
    variableComponentSkills: [{
      id: 'police-officer.driving-any',
      displayName: 'Driving subskill',
      skillId: 'skill.driving',
      choiceDomainId: VARIABLE_SKILL_DOMAINS.driving.id,
      legalSubskills: [...DRIVING_SUBSKILLS],
    }],
    affiliationBoundComponentSkills: [{ skillId: 'skill.streetwise', displayName: 'Streetwise/Affiliation' }],
  },
  {
    id: DETECTIVE_FIELD_ID,
    displayName: 'Detective',
    category: 'advanced',
    source: { ...source('skill-field-detective'), page: 93 },
    prerequisites: [{ id: 'detective.int-floor', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' }, {
      id: 'detective.entry',
      kind: 'any-of',
      description: 'INT 4+ and WIL 4+, or INT 3+ and WIL 4+ with the Police Officer Field',
      options: [
        { id: 'detective.standard-int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
        { id: 'detective.police-officer', kind: 'skill-field', fieldIds: [POLICE_OFFICER_FIELD_ID], description: 'Police Officer Field' },
      ],
    }, { id: 'detective.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 4, description: 'WIL 4+' }],
    componentSkills: [
      skill('skill.career', 'Career/Detective', 'Detective'),
      skill('skill.computers', 'Computers'),
      skill('skill.interrogation', 'Interrogation'),
      skill('skill.investigation', 'Investigation'),
      skill('skill.perception', 'Perception'),
    ],
    variableComponentSkills: [{
      id: 'detective.security-systems-any',
      displayName: 'Security Systems subskill',
      skillId: 'skill.security-systems',
      choiceDomainId: VARIABLE_SKILL_DOMAINS.securitySystems.id,
      legalSubskills: [...SECURITY_SYSTEMS_SUBSKILLS],
    }],
    affiliationBoundComponentSkills: [{ skillId: 'skill.streetwise', displayName: 'Streetwise/Affiliation' }],
  },
  {
    id: INTELLIGENCE_FIELD_ID,
    displayName: 'Intelligence',
    category: 'advanced',
    source: { ...source('skill-field-intelligence'), page: 93 },
    prerequisites: [{ id: 'intelligence.int-floor', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' }, {
      id: 'intelligence.entry',
      kind: 'any-of',
      description: 'INT 4+ and WIL 4+, or INT 3+ and WIL 4+ with the Police Officer Field',
      options: [
        { id: 'intelligence.standard-int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
        { id: 'intelligence.police-officer', kind: 'skill-field', fieldIds: [POLICE_OFFICER_FIELD_ID], description: 'Police Officer Field' },
      ],
    }, { id: 'intelligence.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 4, description: 'WIL 4+' }],
    componentSkills: [
      skill('skill.communications', 'Comms/Conventional', 'Conventional'),
      skill('skill.computers', 'Computers'),
      skill('skill.cryptography', 'Cryptography'),
      skill('skill.sensor-operations', 'Sensor Operations'),
    ],
    variableComponentSkills: [{
      id: 'intelligence.language-any',
      displayName: 'Language (currently modeled choices)',
      skillId: 'skill.language',
      choiceDomainId: VARIABLE_SKILL_DOMAINS.languages.id,
      legalSubskills: [...MODELED_LANGUAGE_SUBSKILLS],
    }],
  },
  {
    id: TECHNICIAN_CIVILIAN_FIELD_ID,
    displayName: 'Technician/Civilian',
    category: 'basic',
    source: source('skill-field-technician-civilian'),
    prerequisites: [
      { id: 'technician-civilian.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' },
      { id: 'technician-civilian.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3, description: 'DEX 3+' },
    ],
    componentSkills: [
      skill('skill.appraisal', 'Appraisal'),
      skill('skill.career', 'Career/Technician', 'Technician'),
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Nuclear', 'Nuclear'),
    ],
  },
  {
    id: OFFICER_FIELD_ID,
    displayName: 'Officer',
    category: 'basic',
    source: { ...source('skill-field-officer'), page: 94 },
    prerequisites: [
      { id: 'officer.basic-training', kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID, BASIC_TRAINING_NAVAL_FIELD_ID], description: 'Basic Training or Basic Training (Naval) Field' },
      { id: 'officer.rank', kind: 'trait-minimum', traitId: 'trait.rank', minimum: 4, description: 'Rank O1 (+4 TP) or higher' },
    ],
    componentSkills: [
      skill('skill.administration', 'Administration'),
      skill('skill.leadership', 'Leadership'),
      skill('skill.melee-weapons', 'Melee Weapons'),
      skill('skill.training', 'Training'),
    ],
    affiliationBoundComponentSkills: [{ skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' }],
  },
  {
    id: TECHNICIAN_VEHICLE_FIELD_ID,
    displayName: 'Technician/Vehicle',
    category: 'advanced',
    source: source('skill-field-technician-vehicle'),
    prerequisites: [
      { id: 'technician-vehicle.prior-field', kind: 'skill-field', fieldIds: [TECHNICIAN_CIVILIAN_FIELD_ID, 'field.technician-military'], description: 'Technician/Civilian or Technician/Military Field' },
      { id: 'technician-vehicle.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
    ],
    componentSkills: [
      skill('skill.computers', 'Computers'),
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Nuclear', 'Nuclear'),
    ],
  },
  {
    id: PILOT_EXOSKELETON_FIELD_ID,
    displayName: 'Pilot/Exoskeleton',
    category: 'basic',
    source: { ...source('skill-field-pilot-exoskeleton'), page: 93 },
    prerequisites: [
      { id: 'pilot-exoskeleton.str', kind: 'attribute-minimum', attributeId: 'STR', minimum: 5, description: 'STR 5+' },
      { id: 'pilot-exoskeleton.bod', kind: 'attribute-minimum', attributeId: 'BOD', minimum: 5, description: 'BOD 5+' },
    ],
    componentSkills: [
      skill('skill.piloting', 'Piloting/Battlesuit', 'Battlesuit'),
      skill('skill.sensor-operations', 'Sensor Operations'),
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Myomer', 'Myomer'),
    ],
  },
  {
    id: CARTOGRAPHER_FIELD_ID,
    displayName: 'Cartographer',
    category: 'advanced',
    source: { ...source('skill-field-cartographer'), page: 92 },
    prerequisites: [{ id: 'cartographer.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' }],
    componentSkills: [
      skill('skill.career', 'Career/Cartographer', 'Cartographer'),
      skill('skill.computers', 'Computers'),
      skill('skill.navigation', 'Navigation/Air', 'Air'),
      skill('skill.navigation', 'Navigation/Ground', 'Ground'),
      skill('skill.perception', 'Perception'),
      skill('skill.sensor-operations', 'Sensor Operations'),
    ],
  },
  {
    id: PILOT_INDUSTRIALMECH_FIELD_ID,
    displayName: 'Pilot/IndustrialMech',
    category: 'advanced',
    source: { ...source('skill-field-pilot-industrialmech'), page: 93 },
    prerequisites: [
      { id: 'pilot-industrialmech.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3, description: 'DEX 3+' },
      { id: 'pilot-industrialmech.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 3, description: 'RFL 3+' },
    ],
    componentSkills: [
      skill('skill.piloting', 'Piloting/Mech', 'Mech'),
      skill('skill.sensor-operations', 'Sensor Operations'),
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Myomer', 'Myomer'),
    ],
  },
  {
    id: TECHNICIAN_AEROSPACE_FIELD_ID,
    displayName: 'Technician/Aerospace',
    category: 'advanced',
    source: { ...source('skill-field-technician-aerospace'), page: 93 },
    prerequisites: [
      { id: 'technician-aerospace.prior-field', kind: 'skill-field', fieldIds: [TECHNICIAN_CIVILIAN_FIELD_ID, 'field.technician-military'], description: 'Technician/Civilian or Technician/Military Field' },
      { id: 'technician-aerospace.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
    ],
    componentSkills: [
      skill('skill.computers', 'Computers'),
      skill('skill.technician', 'Technician/Aeronautics', 'Aeronautics'),
      skill('skill.technician', 'Technician/Nuclear', 'Nuclear'),
      skill('skill.technician', 'Technician/Jets', 'Jets'),
      skill('skill.zero-g-operations', 'Zero-G Operations'),
    ],
  },
  {
    id: TECHNICIAN_MECH_FIELD_ID,
    displayName: 'Technician/Mech',
    category: 'advanced',
    source: { ...source('skill-field-technician-mech'), page: 93 },
    prerequisites: [
      { id: 'technician-mech.prior-field', kind: 'skill-field', fieldIds: [TECHNICIAN_CIVILIAN_FIELD_ID, 'field.technician-military'], description: 'Technician/Civilian or Technician/Military Field' },
      { id: 'technician-mech.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
    ],
    componentSkills: [
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Jet', 'Jet'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Myomer', 'Myomer'),
      skill('skill.technician', 'Technician/Nuclear', 'Nuclear'),
    ],
  },
  {
    id: INFANTRY_FIELD_ID,
    displayName: 'Infantry',
    category: 'advanced',
    source: { ...source('skill-field-infantry'), page: 94 },
    prerequisites: [
      { id: 'infantry.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID], description: 'Basic Training Field' },
    ],
    componentSkills: [
      skill('skill.acrobatics', 'Acrobatics/Free-Fall', 'Free-Fall'),
      skill('skill.artillery', 'Artillery'),
      skill('skill.climbing', 'Climbing'),
      skill('skill.communications', 'Comms/Conventional', 'Conventional'),
      skill('skill.support-weapons', 'Support Weapons'),
      skill('skill.tactics', 'Tactics/Infantry', 'Infantry'),
    ],
  },
  {
    id: CAVALRY_FIELD_ID,
    displayName: 'Cavalry',
    category: 'advanced',
    source: { ...source('skill-field-cavalry'), page: 94 },
    prerequisites: [
      { id: 'cavalry.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID], description: 'Basic Training Field' },
      { id: 'cavalry.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3, description: 'DEX 3+' },
    ],
    componentSkills: [
      skill('skill.artillery', 'Artillery'),
      skill('skill.sensor-operations', 'Sensor Operations'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
    ],
    variableComponentSkills: [
      {
        id: 'cavalry.driving-any',
        displayName: 'Driving subskill',
        skillId: 'skill.driving',
        choiceDomainId: VARIABLE_SKILL_DOMAINS.driving.id,
        legalSubskills: [...DRIVING_SUBSKILLS],
      },
      {
        id: 'cavalry.gunnery-any-vehicle',
        displayName: 'Vehicle Gunnery subskill',
        skillId: 'skill.gunnery',
        choiceDomainId: VARIABLE_SKILL_DOMAINS.vehicleGunnery.id,
        legalSubskills: [...VEHICLE_GUNNERY_SUBSKILLS],
      },
      {
        id: 'cavalry.tactics-land-or-sea',
        displayName: 'Cavalry Tactics subskill',
        skillId: 'skill.tactics',
        choiceDomainId: VARIABLE_SKILL_DOMAINS.cavalryTactics.id,
        legalSubskills: [...CAVALRY_TACTICS_SUBSKILLS],
      },
    ],
  },
  {
    id: MECHWARRIOR_FIELD_ID,
    displayName: 'MechWarrior',
    category: 'advanced',
    source: { ...source('skill-field-mechwarrior'), page: 94 },
    prerequisites: [
      { id: 'mechwarrior.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID], description: 'Basic Training Field' },
      { id: 'mechwarrior.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 4, description: 'DEX 4+' },
      { id: 'mechwarrior.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 4, description: 'RFL 4+' },
    ],
    componentSkills: [
      skill('skill.gunnery', 'Gunnery/Mech', 'Mech'),
      skill('skill.piloting', 'Piloting/Mech', 'Mech'),
      skill('skill.sensor-operations', 'Sensor Operations'),
      skill('skill.tactics', 'Tactics/Land', 'Land'),
    ],
    variableComponentSkills: [{
      id: 'mechwarrior.technician-any',
      displayName: 'Technician Field Skill',
      skillId: 'skill.technician',
      choiceDomainId: VARIABLE_SKILL_DOMAINS.technician.id,
      legalSubskills: [...TECHNICIAN_SUBSKILLS],
    }],
  },
  {
    id: SCOUT_FIELD_ID,
    displayName: 'Scout',
    category: 'advanced',
    source: { ...source('skill-field-scout'), page: 94 },
    prerequisites: [
      { id: 'scout.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_FIELD_ID], description: 'Basic Training Field' },
      { id: 'scout.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
      { id: 'scout.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 3, description: 'WIL 3+' },
      { id: 'scout.illiterate', kind: 'trait-absent', traitId: 'trait.illiterate', description: 'Cannot have Illiterate Trait' },
    ],
    componentSkills: [
      skill('skill.communications', 'Comms/Conventional', 'Conventional'),
      skill('skill.disguise', 'Disguise'),
      skill('skill.stealth', 'Stealth'),
    ],
    variableComponentSkills: [
      {
        id: 'scout.language-any',
        displayName: 'Language (currently modeled choices)',
        skillId: 'skill.language',
        choiceDomainId: VARIABLE_SKILL_DOMAINS.languages.id,
        legalSubskills: [...MODELED_LANGUAGE_SUBSKILLS],
      },
      {
        id: 'scout.security-systems-any',
        displayName: 'Security Systems subskill',
        skillId: 'skill.security-systems',
        choiceDomainId: VARIABLE_SKILL_DOMAINS.securitySystems.id,
        legalSubskills: [...SECURITY_SYSTEMS_SUBSKILLS],
      },
      {
        id: 'scout.streetwise-any',
        displayName: 'Streetwise affiliation',
        skillId: 'skill.streetwise',
        choiceDomainId: VARIABLE_SKILL_DOMAINS.streetwiseAffiliations.id,
        legalSubskills: [...SCOUT_STREETWISE_SUBSKILLS],
      },
      {
        id: 'scout.tracking-any',
        displayName: 'Tracking subskill',
        skillId: 'skill.tracking',
        choiceDomainId: VARIABLE_SKILL_DOMAINS.tracking.id,
        legalSubskills: [...TRACKING_SUBSKILLS],
      },
    ],
  },
  {
    id: MARINE_FIELD_ID,
    displayName: 'Marine',
    category: 'advanced',
    source: { ...source('skill-field-marine'), page: 94 },
    prerequisites: [
      { id: 'marine.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_NAVAL_FIELD_ID], description: 'Basic Training (Naval) Field' },
      { id: 'marine.tds', kind: 'trait-absent', traitId: 'trait.tds', description: 'Cannot have TDS Trait' },
    ],
    componentSkills: [
      skill('skill.acrobatics', 'Acrobatics/Free-Fall', 'Free-Fall'),
      skill('skill.demolitions', 'Demolitions'),
      skill('skill.gunnery', 'Gunnery/Spacecraft', 'Spacecraft'),
      skill('skill.zero-g-operations', 'Zero-G Operations'),
    ],
    variableComponentSkills: [{
      id: 'marine.security-systems-any',
      displayName: 'Security Systems subskill',
      skillId: 'skill.security-systems',
      choiceDomainId: VARIABLE_SKILL_DOMAINS.securitySystems.id,
      legalSubskills: [...SECURITY_SYSTEMS_SUBSKILLS],
    }],
  },
  {
    id: SHIPS_CREW_FIELD_ID,
    displayName: 'Ship’s Crew',
    category: 'advanced',
    source: { ...source('skill-field-ships-crew'), page: 94 },
    prerequisites: [
      { id: 'ships-crew.field', kind: 'skill-field', fieldIds: [BASIC_TRAINING_NAVAL_FIELD_ID], description: 'Basic Training (Naval) Field' },
      { id: 'ships-crew.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 3, description: 'RFL 3+' },
      { id: 'ships-crew.tds', kind: 'trait-absent', traitId: 'trait.tds', description: 'Cannot have TDS Trait' },
    ],
    componentSkills: [
      skill('skill.career', 'Career/Ship’s Crew', 'Ship’s Crew'),
      skill('skill.computers', 'Computers'),
      skill('skill.gunnery', 'Gunnery/Spacecraft', 'Spacecraft'),
      skill('skill.zero-g-operations', 'Zero-G Operations'),
    ],
    variableComponentSkills: [{
      id: 'ships-crew.technician-any',
      displayName: 'Technician subskill',
      skillId: 'skill.technician',
      choiceDomainId: VARIABLE_SKILL_DOMAINS.technician.id,
      legalSubskills: [...TECHNICIAN_SUBSKILLS],
    }],
  },
  {
    id: TECHNICIAN_MILITARY_FIELD_ID,
    displayName: 'Technician/Military',
    category: 'advanced',
    source: { ...source('skill-field-technician-military'), page: 94 },
    prerequisites: [
      { id: 'technician-military.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' },
      { id: 'technician-military.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3, description: 'DEX 3+' },
    ],
    componentSkills: [
      skill('skill.appraisal', 'Appraisal'),
      skill('skill.career', 'Career/Technician', 'Technician'),
      skill('skill.technician', 'Technician/Electronic', 'Electronic'),
      skill('skill.technician', 'Technician/Mechanical', 'Mechanical'),
      skill('skill.technician', 'Technician/Nuclear', 'Nuclear'),
      skill('skill.technician', 'Technician/Weapons', 'Weapons'),
    ],
  },
  {
    id: COMMUNICATIONS_FIELD_ID, displayName: 'Communications', category: 'advanced', source: { ...source('skill-field-communications'), page: 92 },
    prerequisites: [{ id: 'communications.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' }],
    componentSkills: [skill('skill.acting', 'Acting'), skill('skill.career', 'Career/Communications', 'Communications'), skill('skill.communications', 'Comms/Conventional', 'Conventional'), skill('skill.computers', 'Computers'), skill('skill.sensor-operations', 'Sensor Operations')],
    variableComponentSkills: [variableSkill('communications.protocol-any', 'Protocol affiliation', VARIABLE_SKILL_DOMAINS.protocolAffiliations)],
  },
  {
    id: ENGINEER_FIELD_ID, displayName: 'Engineer', category: 'advanced', source: { ...source('skill-field-engineer'), page: 92 },
    prerequisites: [{ id: 'engineer.field', kind: 'skill-field', fieldIds: [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID], description: 'Technician/Civilian or Technician/Military Field' }, { id: 'engineer.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' }],
    componentSkills: [skill('skill.appraisal', 'Appraisal'), skill('skill.career', 'Career/Engineer', 'Engineer'), skill('skill.perception', 'Perception'), skill('skill.technician', 'Technician/Nuclear', 'Nuclear')],
    variableComponentSkills: [variableSkill('engineer.technician-any', 'Technician subskill', VARIABLE_SKILL_DOMAINS.technician)],
  },
  {
    id: MERCHANT_MARINE_FIELD_ID, displayName: 'Merchant Marine', category: 'advanced', source: { ...source('skill-field-merchant-marine'), page: 92 },
    prerequisites: [{ id: 'merchant-marine.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 3, description: 'RFL 3+' }, { id: 'merchant-marine.tds', kind: 'trait-absent', traitId: 'trait.tds', description: 'Cannot have TDS Trait' }],
    componentSkills: [skill('skill.career', 'Career/Merchant Marine', 'Merchant Marine'), skill('skill.technician', 'Technician/Aeronautics', 'Aeronautics'), skill('skill.zero-g-operations', 'Zero-G Operations')],
    variableComponentSkills: [variableSkill('merchant-marine.protocol-any', 'Protocol affiliation', VARIABLE_SKILL_DOMAINS.protocolAffiliations), variableSkill('merchant-marine.technician-any', 'Technician subskill', VARIABLE_SKILL_DOMAINS.technician)],
  },
  {
    id: PILOT_AIRCRAFT_CIVILIAN_FIELD_ID, displayName: 'Pilot - Aircraft (Civilian)', category: 'basic', source: { ...source('skill-field-pilot-aircraft-civilian'), page: 93 },
    prerequisites: [{ id: 'pilot-aircraft-civilian.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3, description: 'DEX 3+' }, { id: 'pilot-aircraft-civilian.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 3, description: 'RFL 3+' }],
    componentSkills: [skill('skill.career', 'Career/Aircraft Pilot', 'Aircraft Pilot'), skill('skill.communications', 'Comms/Conventional', 'Conventional'), skill('skill.navigation', 'Navigation/Air', 'Air'), skill('skill.sensor-operations', 'Sensor Operations')],
    variableComponentSkills: [variableSkill('pilot-aircraft-civilian.piloting', 'Aircraft Piloting subskill', VARIABLE_SKILL_DOMAINS.aircraftPiloting)],
  },
  {
    id: MEDICAL_ASSISTANT_FIELD_ID, displayName: 'Medical Assistant', category: 'advanced', source: { ...source('skill-field-medical-assistant'), page: 92 },
    prerequisites: [{ id: 'medical-assistant.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 3, description: 'DEX 3+' }, { id: 'medical-assistant.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' }],
    componentSkills: [skill('skill.career', 'Career/MedTech', 'MedTech'), skill('skill.computers', 'Computers'), skill('skill.interest', 'Interest/Pharmacology', 'Pharmacology'), skill('skill.perception', 'Perception')],
    variableComponentSkills: [variableSkill('medical-assistant.medtech-any', 'MedTech subskill', VARIABLE_SKILL_DOMAINS.medTech)],
  },
  {
    id: DOCTOR_FIELD_ID, displayName: 'Doctor', category: 'special', source: { ...source('skill-field-doctor'), page: 92 },
    prerequisites: [{ id: 'doctor.field', kind: 'skill-field', fieldIds: [MEDICAL_ASSISTANT_FIELD_ID, 'field.scientist'], description: 'Medical Assistant or Scientist Field' }, { id: 'doctor.dex', kind: 'attribute-minimum', attributeId: 'DEX', minimum: 4, description: 'DEX 4+' }, { id: 'doctor.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 5, description: 'INT 5+' }, { id: 'doctor.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 3, description: 'WIL 3+' }],
    componentSkills: [skill('skill.administration', 'Administration'), skill('skill.career', 'Career/Doctor', 'Doctor')],
    variableComponentSkills: [variableSkill('doctor.medtech-any', 'MedTech subskill', VARIABLE_SKILL_DOMAINS.medTech), variableSkill('doctor.surgery-any', 'Surgery subskill', VARIABLE_SKILL_DOMAINS.surgery)],
    affiliationBoundComponentSkills: [{ skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' }],
  },
  {
    id: ANALYSIS_FIELD_ID, displayName: 'Analysis', category: 'advanced', source: { ...source('skill-field-analysis'), page: 93 },
    prerequisites: [{ id: 'analysis.int-floor', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' }, { id: 'analysis.entry', kind: 'any-of', description: 'INT 4+ and WIL 4+, or INT 3+ and WIL 4+ with the Police Officer Field', options: [{ id: 'analysis.standard-int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' }, { id: 'analysis.police', kind: 'skill-field', fieldIds: [POLICE_OFFICER_FIELD_ID], description: 'Police Officer Field' }] }, { id: 'analysis.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 4, description: 'WIL 4+' }],
    componentSkills: [skill('skill.computers', 'Computers'), skill('skill.investigation', 'Investigation'), skill('skill.sensor-operations', 'Sensor Operations'), skill('skill.strategy', 'Strategy')],
    variableComponentSkills: [variableSkill('analysis.language-one', 'First Language', VARIABLE_SKILL_DOMAINS.languages), variableSkill('analysis.language-two', 'Second Language', VARIABLE_SKILL_DOMAINS.languages), variableSkill('analysis.tactics-any', 'Tactics subskill', VARIABLE_SKILL_DOMAINS.tactics)],
  },
  {
    id: COVERT_OPERATIONS_FIELD_ID, displayName: 'Covert Operations', category: 'advanced', source: { ...source('skill-field-covert-operations'), page: 93 },
    prerequisites: [{ id: 'covert.int-floor', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' }, { id: 'covert.entry', kind: 'any-of', description: 'INT 4+ and WIL 4+, or INT 3+ and WIL 4+ with the Police Officer Field', options: [{ id: 'covert.standard-int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' }, { id: 'covert.police', kind: 'skill-field', fieldIds: [POLICE_OFFICER_FIELD_ID], description: 'Police Officer Field' }] }, { id: 'covert.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 4, description: 'WIL 4+' }],
    componentSkills: [skill('skill.acting', 'Acting'), skill('skill.escape-artist', 'Escape Artist'), skill('skill.perception', 'Perception')],
    variableComponentSkills: [variableSkill('covert.language-any', 'Language', VARIABLE_SKILL_DOMAINS.languages), variableSkill('covert.protocol-any', 'Protocol affiliation', VARIABLE_SKILL_DOMAINS.protocolAffiliations), variableSkill('covert.streetwise-any', 'Streetwise affiliation', VARIABLE_SKILL_DOMAINS.streetwiseAffiliations), variableSkill('covert.tracking-any', 'Tracking subskill', VARIABLE_SKILL_DOMAINS.tracking)],
  },
  {
    id: POLICE_TACTICAL_OFFICER_FIELD_ID, displayName: 'Police Tactical Officer', category: 'special', source: { ...source('skill-field-police-tactical-officer'), page: 93 },
    prerequisites: [{ id: 'police-tactical-officer.field', kind: 'skill-field', fieldIds: [POLICE_OFFICER_FIELD_ID], description: 'Police Officer Field' }, { id: 'police-tactical-officer.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 4, description: 'RFL 4+' }],
    componentSkills: [skill('skill.climbing', 'Climbing'), skill('skill.demolitions', 'Demolitions'), skill('skill.running', 'Running'), skill('skill.support-weapons', 'Support Weapons'), skill('skill.tactics', 'Tactics/Infantry', 'Infantry'), skill('skill.tracking', 'Tracking/Urban', 'Urban')],
    variableComponentSkills: [variableSkill('police-tactical-officer.thrown-weapons-any', 'Thrown Weapons subskill', VARIABLE_SKILL_DOMAINS.thrownWeapons)],
  },
  {
    id: MILITARY_SCIENTIST_FIELD_ID, displayName: 'Military Scientist', category: 'special', source: { ...source('skill-field-military-scientist'), page: 94 },
    prerequisites: [{ id: 'military-scientist.field', kind: 'skill-field', fieldIds: [ANALYSIS_FIELD_ID], description: 'Analysis Field' }, { id: 'military-scientist.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 5, description: 'INT 5+' }],
    componentSkills: [skill('skill.career', 'Career/Military Scientist', 'Military Scientist'), skill('skill.computers', 'Computers'), skill('skill.cryptography', 'Cryptography'), skill('skill.interest', 'Interest/Military History', 'Military History'), skill('skill.strategy', 'Strategy')],
    variableComponentSkills: [variableSkill('military-scientist.tactics-any', 'Tactics subskill', VARIABLE_SKILL_DOMAINS.tactics)],
  },
  {
    id: SCIENTIST_FIELD_ID, displayName: 'Scientist', category: 'advanced', source: { ...source('skill-field-scientist'), page: 93 },
    prerequisites: [{ id: 'scientist.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' }],
    componentSkills: [skill('skill.career', 'Career/Scientist', 'Scientist'), skill('skill.computers', 'Computers'), skill('skill.investigation', 'Investigation'), skill('skill.perception', 'Perception'), skill('skill.training', 'Training')],
    variableComponentSkills: [
      variableSkill('scientist.interest-any', 'Interest subject', VARIABLE_SKILL_DOMAINS.interestOpen),
      variableSkill('scientist.science-any', 'Science subject', VARIABLE_SKILL_DOMAINS.scienceOpen),
    ],
  },
  {
    id: SPECIAL_FORCES_FIELD_ID, displayName: 'Special Forces', category: 'special', source: { ...source('skill-field-special-forces'), page: 94 },
    prerequisites: [
      { id: 'special-forces.field', kind: 'skill-field', fieldIds: [INFANTRY_FIELD_ID, MECHWARRIOR_FIELD_ID, SCOUT_FIELD_ID], description: 'Infantry, MechWarrior, or Scout Field' },
      { id: 'special-forces.bod', kind: 'attribute-minimum', attributeId: 'BOD', minimum: 4, description: 'BOD 4+' },
      { id: 'special-forces.rfl', kind: 'attribute-minimum', attributeId: 'RFL', minimum: 4, description: 'RFL 4+' },
      { id: 'special-forces.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 5, description: 'WIL 5+' },
    ],
    componentSkills: [skill('skill.acrobatics', 'Acrobatics/Free-Fall', 'Free-Fall'), skill('skill.demolitions', 'Demolitions'), skill('skill.small-arms', 'Small Arms'), skill('skill.stealth', 'Stealth')],
    variableComponentSkills: [
      variableSkill('special-forces.survival-any', 'Survival environment', VARIABLE_SKILL_DOMAINS.survivalOpen),
      variableSkill('special-forces.tracking-any', 'Tracking subskill', VARIABLE_SKILL_DOMAINS.tracking),
    ],
  },
  {
    id: MANAGER_FIELD_ID, displayName: 'Manager', category: 'basic', source: { ...source('skill-field-manager'), page: 92 },
    prerequisites: [
      { id: 'manager.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 5, description: 'INT 5+' },
      { id: 'manager.cha', kind: 'attribute-minimum', attributeId: 'CHA', minimum: 5, description: 'CHA 5+' },
    ],
    componentSkills: [skill('skill.administration', 'Administration'), skill('skill.career', 'Career/Management', 'Management'), skill('skill.leadership', 'Leadership'), skill('skill.negotiation', 'Negotiation'), skill('skill.training', 'Training')],
    affiliationBoundComponentSkills: [{ skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' }],
  },
  {
    id: PLANETARY_SURVEYOR_FIELD_ID, displayName: 'Planetary Surveyor', category: 'advanced', source: { ...source('skill-field-planetary-surveyor'), page: 93 },
    prerequisites: [
      { id: 'planetary-surveyor.field', kind: 'skill-field', fieldIds: [SCIENTIST_FIELD_ID], description: 'Scientist Field' },
      { id: 'planetary-surveyor.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 6, description: 'INT 6+' },
    ],
    componentSkills: [skill('skill.appraisal', 'Appraisal'), skill('skill.navigation', 'Navigation/Ground', 'Ground'), skill('skill.tracking', 'Tracking/Wilds', 'Wilds')],
    variableComponentSkills: [
      variableSkill('planetary-surveyor.driving-any', 'Driving subskill', VARIABLE_SKILL_DOMAINS.driving),
      variableSkill('planetary-surveyor.survival-any', 'Survival environment', VARIABLE_SKILL_DOMAINS.survivalOpen),
    ],
  },
  {
    id: POLITICIAN_FIELD_ID, displayName: 'Politician', category: 'advanced', source: { ...source('skill-field-politician'), page: 93 },
    prerequisites: [
      { id: 'politician.field', kind: 'skill-field', fieldIds: [MANAGER_FIELD_ID], description: 'Manager Field' },
      { id: 'politician.cha', kind: 'attribute-minimum', attributeId: 'CHA', minimum: 4, description: 'CHA 4+' },
    ],
    componentSkills: [skill('skill.acting', 'Acting'), skill('skill.career', 'Career/Politician', 'Politician'), skill('skill.leadership', 'Leadership'), skill('skill.negotiation', 'Negotiation')],
    affiliationBoundComponentSkills: [{ skillId: 'skill.protocol', displayName: 'Protocol/Affiliation' }],
  },
  {
    id: MERCHANT_FIELD_ID, displayName: 'Merchant', category: 'basic', source: { ...source('skill-field-merchant'), page: 92 },
    prerequisites: [
      { id: 'merchant.cha', kind: 'attribute-minimum', attributeId: 'CHA', minimum: 3, description: 'CHA 3+' },
      { id: 'merchant.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 3, description: 'WIL 3+' },
    ],
    componentSkills: [skill('skill.administration', 'Administration'), skill('skill.appraisal', 'Appraisal'), skill('skill.career', 'Career/Merchant', 'Merchant'), skill('skill.negotiation', 'Negotiation')],
    variableComponentSkills: [
      variableSkill('merchant.protocol-any', 'Protocol affiliation', VARIABLE_SKILL_DOMAINS.protocolAffiliations),
      variableSkill('merchant.streetwise-any', 'Streetwise affiliation', VARIABLE_SKILL_DOMAINS.streetwiseAffiliations),
    ],
  },
  {
    id: JOURNALIST_FIELD_ID, displayName: 'Journalist', category: 'advanced', source: { ...source('skill-field-journalist'), page: 92 },
    prerequisites: [
      { id: 'journalist.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' },
      { id: 'journalist.cha', kind: 'attribute-minimum', attributeId: 'CHA', minimum: 4, description: 'CHA 4+' },
      { id: 'journalist.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 4, description: 'WIL 4+' },
    ],
    componentSkills: [skill('skill.acting', 'Acting'), skill('skill.art', 'Art/Writing', 'Writing'), skill('skill.career', 'Career/Journalist', 'Journalist'), skill('skill.computers', 'Computers'), skill('skill.investigation', 'Investigation'), skill('skill.perception', 'Perception')],
  },
  {
    id: GENERAL_STUDIES_FIELD_ID, displayName: 'General Studies', category: 'basic', source: { ...source('skill-field-general-studies'), page: 92 },
    prerequisites: [{ id: 'general-studies.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 3, description: 'INT 3+' }],
    relatedSkillPrerequisite: {
      id: 'general-studies.related-skill',
      description: 'At least one other Skill related to the General Studies Field Skills (subject to GM approval)',
      gmApprovalRequired: true,
    },
    componentSkills: [skill('skill.computers', 'Computers'), skill('skill.perception', 'Perception')],
    variableComponentSkills: [
      variableSkill('general-studies.career-any', 'Career subject', VARIABLE_SKILL_DOMAINS.careerOpen),
      variableSkill('general-studies.interest-any', 'Interest subject', VARIABLE_SKILL_DOMAINS.interestOpen),
      variableSkill('general-studies.protocol-affiliation', 'Protocol affiliation', VARIABLE_SKILL_DOMAINS.protocolAffiliations),
    ],
  },
  {
    id: ANTHROPOLOGIST_FIELD_ID, displayName: 'Anthropologist', category: 'advanced', source: { ...source('skill-field-anthropologist'), page: 92 },
    prerequisites: [
      { id: 'anthropologist.field', kind: 'skill-field', fieldIds: [GENERAL_STUDIES_FIELD_ID], description: 'General Studies Field' },
      { id: 'anthropologist.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
    ],
    componentSkills: [skill('skill.career', 'Career/Anthropologist', 'Anthropologist'), skill('skill.investigation', 'Investigation')],
    variableComponentSkills: [
      variableSkill('anthropologist.history-culture', 'History subject (one culture)', VARIABLE_SKILL_DOMAINS.interestOpen),
      variableSkill('anthropologist.language-one', 'First Language', VARIABLE_SKILL_DOMAINS.languages),
      variableSkill('anthropologist.language-two', 'Second Language', VARIABLE_SKILL_DOMAINS.languages),
      variableSkill('anthropologist.protocol-any', 'Protocol affiliation', VARIABLE_SKILL_DOMAINS.protocolAffiliations),
    ],
  },
  {
    id: ARCHAEOLOGIST_FIELD_ID, displayName: 'Archaeologist', category: 'advanced', source: { ...source('skill-field-archaeologist'), page: 92 },
    prerequisites: [
      { id: 'archaeologist.field', kind: 'skill-field', fieldIds: [GENERAL_STUDIES_FIELD_ID], description: 'General Studies Field' },
      { id: 'archaeologist.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
    ],
    componentSkills: [
      skill('skill.career', 'Career/Archaeologist', 'Archaeologist'),
      skill('skill.appraisal', 'Appraisal'),
      skill('skill.interest', 'Interest/Geology', 'Geology'),
      skill('skill.navigation', 'Navigation/Ground', 'Ground'),
      skill('skill.perception', 'Perception'),
    ],
    variableComponentSkills: [variableSkill('archaeologist.history-any', 'History subject', VARIABLE_SKILL_DOMAINS.interestOpen)],
  },
  {
    id: LAWYER_FIELD_ID, displayName: 'Lawyer', category: 'special', source: { ...source('skill-field-lawyer'), page: 92 },
    prerequisites: [
      { id: 'lawyer.field', kind: 'skill-field', fieldIds: [GENERAL_STUDIES_FIELD_ID], description: 'General Studies Field' },
      { id: 'lawyer.int', kind: 'attribute-minimum', attributeId: 'INT', minimum: 4, description: 'INT 4+' },
      { id: 'lawyer.cha', kind: 'attribute-minimum', attributeId: 'CHA', minimum: 4, description: 'CHA 4+' },
      { id: 'lawyer.wil', kind: 'attribute-minimum', attributeId: 'WIL', minimum: 5, description: 'WIL 5+' },
    ],
    componentSkills: [skill('skill.acting', 'Acting'), skill('skill.administration', 'Administration'), skill('skill.career', 'Career/Lawyer', 'Lawyer'), skill('skill.interest', 'Interest/Law', 'Law'), skill('skill.negotiation', 'Negotiation')],
    variableComponentSkills: [variableSkill('lawyer.protocol-any', 'Protocol affiliation', VARIABLE_SKILL_DOMAINS.protocolAffiliations)],
  },
]

export function getSkillField(fieldId: string): SkillFieldDefinition {
  const field = SKILL_FIELD_CATALOG.find((entry) => entry.id === fieldId)
  if (!field) throw new Error(`Unknown Skill Field ID: ${fieldId}`)
  return field
}

export function skillFieldCost(field: SkillFieldDefinition, costXpPerSkill: number): number {
  return (field.componentSkills.length + (field.variableComponentSkills?.length ?? 0) + (field.affiliationBoundComponentSkills?.length ?? 0)) * costXpPerSkill
}

export function validateSkillFieldCatalog(catalog: readonly SkillFieldDefinition[] = SKILL_FIELD_CATALOG): SkillFieldCatalogValidationIssue[] {
  const issues: SkillFieldCatalogValidationIssue[] = []
  const ids = new Set<string>()
  for (const field of catalog) {
    if (!field.id || ids.has(field.id)) issues.push({ fieldId: field.id, message: `Duplicate or missing Skill Field ID: ${field.id || '(missing)'}` })
    ids.add(field.id)
    if (!field.displayName || !field.source.sourceId || field.componentSkills.length + (field.variableComponentSkills?.length ?? 0) === 0) issues.push({ fieldId: field.id, message: 'Skill Field name, source, and component Skills are required.' })
    const skills = new Set<string>()
    for (const component of field.componentSkills) {
      const key = `${component.address.skillId}/${component.address.parameter?.value ?? ''}`
      if (!component.address.skillId || skills.has(key)) issues.push({ fieldId: field.id, message: `Malformed or duplicate component Skill: ${key}` })
      skills.add(key)
    }
    for (const component of field.variableComponentSkills ?? []) {
      if (!component.id || !component.displayName || !component.skillId || ((component.inputMode ?? 'select') === 'select' && component.legalSubskills.length === 0) || new Set(component.legalSubskills).size !== component.legalSubskills.length) {
        issues.push({ fieldId: field.id, message: `Malformed variable component Skill: ${component.id || '(missing)'}` })
      }
      const domain = getVariableSkillDomain(component.choiceDomainId)
      if (domain.skillId !== component.skillId || domain.inputMode !== (component.inputMode ?? 'select') || domain.options.join('\0') !== component.legalSubskills.join('\0')) {
        issues.push({ fieldId: field.id, message: `Variable component domain mismatch: ${component.id}` })
      }
    }
    for (const component of field.affiliationBoundComponentSkills ?? []) {
      if (!component.displayName || !['skill.language', 'skill.protocol', 'skill.streetwise'].includes(component.skillId)) {
        issues.push({ fieldId: field.id, message: `Malformed affiliation-bound component Skill: ${component.displayName || '(missing)'}` })
      }
    }
  }
  return issues
}
