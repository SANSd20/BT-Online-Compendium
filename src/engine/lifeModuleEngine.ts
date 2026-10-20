import type {
  CharacterDefinition,
  ChronologyEntry,
  LifeModulePrerequisiteIssue,
  PendingLifeModuleAward,
  ProvenanceRecord,
  ResolvedLifeModuleAward,
  ResolvedLifeModuleDestination,
  SkillAddress,
  XpAward,
} from '../domain/character/model'
import type { ClanPackageHistoryRecord } from '../domain/character/clanPackageHistory'
import type { SourceCitation } from '../domain/rules/model'
import type { ConditionalLifeModulePackageDefinition, ConditionalPackageDraftState } from '../domain/lifeModules/model'
import {
  AGITATOR_ID,
  TRAVEL_ID,
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  FARM_ID,
  CAPELLAN_COMMONALITY_ID,
  COMSTAR_ORDER_ID,
  COMSTAR_WOB_SERVICE_ID,
  FEDERATED_SUNS_CRUCIS_MARCH_ID,
  FAMILY_TRAINING_ID,
  getLifeModule,
  INTELLIGENCE_OPERATIVE_TRAINING_ID,
  LIFE_MODULE_RULES_SOURCE,
  MILITARY_ACADEMY_ID,
  MILITARY_SCHOOL_ID,
  MILITARY_ENLISTMENT_ID,
  OFFICER_TRAINING_SCHOOL_ID,
  POLICE_ACADEMY_ID,
  SOLARIS_INTERNSHIP_ID,
  TRUEBORN_CRECHE_ID,
  TRUEBORN_SIBKO_ID,
  CLAN_WATCH_OPERATIVE_ID,
  CLAN_CIVILIAN_JOB_ID,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
  WAR_ORPHAN_ID,
  TECHNICAL_COLLEGE_ID,
  TRADE_SCHOOL_ID,
  UNIVERSITY_ID,
  UNIVERSAL_STAGE_0_ID,
  WORD_OF_BLAKE_ORDER_ID,
} from '../domain/lifeModules/catalog'
import type { LifeModuleAward, LifeModuleDefinition, LifeModuleDestination, LifeModulePrerequisite } from '../domain/lifeModules/model'
import { knownPendingChoiceValues, modeledSkillChoiceOptions, pendingOpenSubject } from '../domain/lifeModules/awardOptions'
import { isOpenSubjectSkillId, openSkillSubjectDestination } from '../domain/skillFields/openSkillSubjects'
import { CAPELLAN_COMMONALITY_CONTEXT, DRACONIS_AZAMI_ID, DRACONIS_BENJAMIN_ID, DRACONIS_COMBINE_CONTEXT, DRACONIS_COMBINE_ID, DRACONIS_DIERON_ID, DRACONIS_NEW_SAMARKAND_ID, DRACONIS_PESHT_ID, FEDERATED_SUNS_CAPELLAN_MARCH_ID, FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT, FEDERATED_SUNS_DRACONIS_MARCH_ID, FEDERATED_SUNS_OUTBACK_CONTEXT, FEDERATED_SUNS_OUTBACK_ID, getLifeModuleAffiliationContextByAffiliationId, getLifeModuleLanguageSelectorOptions, ORDER_AFFILIATION_IDS, resolveLifeModuleAffiliationContext, SIAN_COMMONALITY_ID, type OrderAffiliationSelection } from '../domain/lifeModules/affiliations'
import { DRACONIS_COMBINE_CATALOG_AWARDS, DRACONIS_SUB_AFFILIATION_CATALOG_AWARDS } from '../domain/lifeModules/catalog'
import { stage3SchoolEligibility } from '../domain/lifeModules/stage3Schooling'
import { STANDARD_SKILL_XP_COSTS } from '../domain/pointBuy/catalog'
import { BASIC_TRAINING_FIELD_ID, CAVALRY_FIELD_ID, CLAN_MECHWARRIOR_FIELD_ID, getSkillField, INFANTRY_FIELD_ID, MECHWARRIOR_FIELD_ID, PILOT_BATTLE_ARMOR_FIELD_ID, skillFieldCost, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_SUBSKILLS, TECHNICIAN_VEHICLE_FIELD_ID } from '../domain/skillFields/catalog'
import { createCharacterDraft, type CharacterFactoryDependencies } from './characterFactory'
import { validateCharacter } from '../validation/validateCharacter'
import { CLAN_AFFILIATION_PACKAGES, CLAN_CASTE_PACKAGES, type ClanAffiliationPackageId, type ClanCastePackageId } from '../domain/character/clanPackages'
import { clanWarriorStage3Bypass, evaluateClanStage4Eligibility, CLAN_STAGE4_ELIGIBILITY_RULES } from '../domain/lifeModules/clanStage4Eligibility'
import { CLAN_AFFILIATION_CONTEXTS } from '../domain/lifeModules/affiliations'
import { attributeLegality } from '../domain/character/attributeLegality'
import { isHomeworldClanId, type HomeworldClanId } from '../domain/character/clanIdentity'
import { HOMEWORLD_CLAN_PACKAGES } from '../domain/character/clanPackages'
import { resolveClanDestination } from '../domain/character/clanDestinations'
import { evaluateDurationEligibility } from '../domain/character/chronology'
import { capellanCitizenshipEligibility } from '../domain/lifeModules/capellanRestrictions'

const ATTRIBUTE_IDS = ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG'] as const

export type LifeModuleTransactionOperation = {
  kind: 'set-age'
  ageYears: number
  sourceRelationId?: string
  source?: { sourceId: string; edition: string; page?: number; ruleId?: string }
} | {
  kind: 'grant-capellan-civilian-job'
  relationId: 'relation.capellan.stage-2-civilian-job-substitution'
} | {
  kind: 'add-years'
  years: number
  source?: { sourceId: string; edition: string; page?: number; ruleId?: string }
} | {
  kind: 'resolve-pending-award'
  pendingAwardId: string
  destination: ResolvedLifeModuleDestination
  xpAmount?: number
} | {
  kind: 'grant-governed-field'
  packageId: string
  optionId: string
  awardId: string
  fieldId: string
  schoolModuleId: string
  offerId: string
  xpPerSkill: number
  purchaseCostXp: number
  chronologyYears: number
  category: 'basic' | 'advanced' | 'special'
  choices?: Record<string, string>
} | {
  kind: 'allocate-clan-warrior-field-xp'
  awardId: string
  moduleId: string
  source: { sourceId: string; edition: string; page?: number; ruleId?: string }
  selections: Array<{ fieldId: string; destination: ResolvedLifeModuleDestination }>
} | {
  kind: 'allocate-career-field-xp'
  awardId: string
  moduleId: string
  source: { sourceId: string; edition: string; page?: number; ruleId?: string }
  fieldId: string
  selections: Array<{ destination: ResolvedLifeModuleDestination }>
} | {
  kind: 'grant-clan-package'
  awardId: string
  packageId: ClanAffiliationPackageId | ClanCastePackageId
  choices?: Record<string, string>
} | {
  kind: 'grant-homeworld-clan-package'
  clanId: HomeworldClanId
} | {
  kind: 'grant-trueborn-creche'
  choices: ResolvedLifeModuleDestination[]
} | {
  kind: 'grant-trueborn-sibko-mechwarrior'
} | {
  kind: 'grant-clan-watch-operative'
  branch: 'homeworld-clan' | 'invader-clan'
  choices: Record<string, string>
}

export type LifeModuleTransactionErrorKind = 'unsupported-operation' | 'invalid-operation' | 'unresolved-choice' | 'illegal-prospective-state'

export interface LifeModuleTransactionError {
  kind: LifeModuleTransactionErrorKind
  operationIndex?: number
  message: string
  validationIssueIds?: string[]
}

export interface LifeModuleTransaction {
  readonly baseState: CharacterDefinition
  readonly operations: readonly LifeModuleTransactionOperation[]
  readonly provenanceContext?: string
  readonly sourceContext?: string
  prospectiveState: CharacterDefinition | null
  errors: LifeModuleTransactionError[]
  status: 'built' | 'validated' | 'failed' | 'committed'
}

const SET_AGE_RELATIONS = new Set(['relation.capellan.stage-2-civilian-job-substitution'])
const CAPELLAN_AFFILIATION_ID = 'affiliation.capellan-confederation'
function currentProgressionAge(character: CharacterDefinition): number {
  const explicit = character.chronology.at(-1)?.ageAfter
  if (explicit !== undefined) return explicit
  const ages = character.chronology.map((entry) => /^age:(\d+(?:\.\d+)?)$/.exec(entry.date)?.[1]).filter(Boolean).map(Number)
  return ages.length ? Math.max(...ages) : 0
}

function applyChronologyOperation(character: CharacterDefinition, operation: Extract<LifeModuleTransactionOperation, { kind: 'set-age' | 'add-years' }>): CharacterDefinition {
  const next = structuredClone(character)
  const before = currentProgressionAge(next)
  const after = operation.kind === 'set-age' ? operation.ageYears : before + operation.years
  if (!Number.isFinite(after) || after < 0) throw new Error('Chronology age must be a finite non-negative number.')
  if (operation.kind === 'add-years' && (!Number.isFinite(operation.years) || operation.years < 0)) throw new Error('Chronology duration must be a finite non-negative number.')
  if (operation.kind === 'set-age' && operation.sourceRelationId && !SET_AGE_RELATIONS.has(operation.sourceRelationId)) throw new Error(`Unauthorized chronology source relation: ${operation.sourceRelationId}`)
  const source = operation.source
  const provenanceId = next.provenance.find((entry) => entry.source?.sourceId === source?.sourceId && entry.source?.page === source?.page)?.id ?? next.provenance[0]?.id ?? ''
  const event: ChronologyEntry = { date: `age:${after}`, eventId: `chronology.${operation.kind}.${next.chronology.length}`, provenanceId, operation: operation.kind === 'set-age' ? 'SET_AGE' : 'ADD_YEARS', ageBefore: before, ageAfter: after, elapsedDurationYears: operation.kind === 'add-years' ? operation.years : 0, sourceRelationId: operation.kind === 'set-age' ? operation.sourceRelationId : undefined, source }
  next.chronology.push(event)
  if (next.chronologyProfile?.mode === 'progression-derived') next.chronologyProfile.derivedAgeYears = after
  return next
}

function applyCapellanCivilianJobSubstitution(character: CharacterDefinition, relationId: string): CharacterDefinition {
  const state = requireLifeModules(character)
  if (relationId !== 'relation.capellan.stage-2-civilian-job-substitution') throw new Error(`Unsupported substitution relation: ${relationId}`)
  if (state.phase !== 'stage-2-selection' || state.currentStage !== 2) throw new Error('Capellan Civilian Job substitution requires the active Stage 2 selection slot.')
  if (!character.affiliations.some((entry) => entry.affiliationId === CAPELLAN_AFFILIATION_ID)) throw new Error('Capellan Civilian Job substitution requires Capellan Confederation affiliation.')
  if (character.lifeModuleHistory.some((entry) => entry.stage === 2)) throw new Error('Exactly one Stage 2 module may be selected.')
  const module = getLifeModule(CLAN_CIVILIAN_JOB_ID)
  const next = applyModule(character, module, {}, { appliedStage: 2, sourceRelationId: relationId, actualDurationYears: 0, partialDurationReason: 'capellan-substitution' })
  return applyChronologyOperation(next, { kind: 'set-age', ageYears: 18, sourceRelationId: relationId, source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 64, ruleId: relationId } })
}

export interface ConditionalLifeModulePackage {
  id: string
  source: { sourceId: string; edition: string; page?: number; ruleId?: string }
  choices: Array<{
    id: string
    label: string
    awards: LifeModuleAward[]
  }>
}

export interface LifeModulePackageResolution {
  packageId: string
  optionId: string
  operations: LifeModuleTransactionOperation[]
  source: ConditionalLifeModulePackage['source']
}

export function selectConditionalPackageOption(
  character: CharacterDefinition,
  packageDefinition: ConditionalLifeModulePackageDefinition,
  choiceId: string | null,
  nestedSelections: Record<string, string> = {},
): CharacterDefinition {
  const next = structuredClone(character)
  const option = choiceId ? packageDefinition.choices.find((entry) => entry.id === choiceId) : undefined
  const errors: string[] = []
  if (choiceId && !option) errors.push(`Unknown conditional package option: ${choiceId}`)
  for (const nested of option?.nestedChoices ?? []) {
    const selected = nestedSelections[nested.id]
    if (!selected) errors.push(`Required package choice is unresolved: ${nested.id}`)
    else if (!nested.validOptionIds.includes(selected)) errors.push(`Invalid package choice: ${nested.id}`)
  }
  const status: ConditionalPackageDraftState['status'] = !choiceId ? 'not-selected' : errors.length > 0 ? 'incomplete' : 'ready'
  next.creation.lifeModules!.conditionalPackageDraft = {
    packageId: packageDefinition.id,
    choiceId,
    nestedSelections: structuredClone(nestedSelections),
    status,
    errors,
    source: { ...packageDefinition.source },
  }
  return next
}

export function resolveConditionalPackageDraft(
  character: CharacterDefinition,
  packageDefinition: ConditionalLifeModulePackageDefinition,
): LifeModulePackageResolution {
  const draft = character.creation.lifeModules?.conditionalPackageDraft
  if (!draft || draft.packageId !== packageDefinition.id || !draft.choiceId || draft.status !== 'ready') throw new Error('Conditional package draft is incomplete and cannot be resolved.')
  const resolution = resolveLifeModulePackage({
    id: packageDefinition.id,
    source: packageDefinition.source,
    choices: packageDefinition.choices.map((choice) => ({ id: choice.id, label: choice.displayName, awards: choice.awards })),
  }, draft.choiceId, draft.nestedSelections)
  return resolution
}

export interface GovernedFieldGrantContext {
  fieldId: string
  schoolModuleId: string
  offerId: string
  category: 'basic' | 'advanced' | 'special'
  chronologyYears: number
  xpPerSkill: number
  purchaseCostXp: number
  source: { sourceId: string; edition: string; page?: number; ruleId?: string }
}

export function resolveGovernedFieldGrantContext(award: Extract<LifeModuleAward, { kind: 'field-grant' }>): GovernedFieldGrantContext {
  if (!award.schoolModuleId || !award.offerId || award.chronologyYears === undefined || !award.category) throw new Error(`Field grant ${award.fieldId} lacks complete governed school offer context.`)
  const school = getLifeModule(award.schoolModuleId)
  const offer = school.skillFieldSelection?.offers.find((entry) => entry.fieldId === award.fieldId)
  if (!offer || award.offerId !== `${school.id}/${award.fieldId}`) throw new Error(`Field grant ${award.fieldId} does not match its governed school offer.`)
  const field = getSkillField(award.fieldId)
  if (offer.category !== award.category || offer.awardedXpPerSkill !== award.xpPerSkill || skillFieldCost(field, offer.costXpPerSkill) !== award.purchaseCostXp || offer.chronologyYears !== award.chronologyYears) throw new Error(`Field grant ${award.fieldId} has inconsistent governed offer values.`)
  return { fieldId: award.fieldId, schoolModuleId: school.id, offerId: award.offerId, category: offer.category, chronologyYears: offer.chronologyYears, xpPerSkill: offer.awardedXpPerSkill, purchaseCostXp: skillFieldCost(field, offer.costXpPerSkill), source: { ...field.source } }
}

export function resolveLifeModulePackage(
  packageDefinition: ConditionalLifeModulePackage,
  optionId: string,
  choices: Record<string, string> = {},
): LifeModulePackageResolution {
  if (!packageDefinition.id || !packageDefinition.source.sourceId) throw new Error('Conditional package identity and source provenance are required.')
  const option = packageDefinition.choices.find((entry) => entry.id === optionId)
  if (!option) throw new Error(`Unknown conditional package option: ${optionId}`)
  const operations: LifeModuleTransactionOperation[] = []
  const expand = (award: LifeModuleAward): void => {
    if (award.kind === 'fixed') {
      operations.push({ kind: 'resolve-pending-award', pendingAwardId: `${packageDefinition.id}/${option.id}/${award.id}`, destination: lifeModuleDestinationToResolved(award.destination), xpAmount: award.xp })
      return
    }
    if (award.kind === 'conditional') {
      for (const nested of award.awards) expand(nested)
      return
    }
    if (award.kind === 'choice-package') {
      const nestedOptionId = choices[award.id]
      if (!nestedOptionId) throw new Error(`Required nested choice is unresolved: ${award.id}`)
      const nestedOption = award.options.find((entry) => entry[0]?.type === 'skill' && entry[0].address.skillId === nestedOptionId)
      if (!nestedOption) throw new Error(`Invalid nested choice for package award: ${award.id}`)
      for (const nested of nestedOption) expand({ id: `${award.id}/${nestedOptionId}`, kind: 'fixed', xp: 0, destination: nested })
      return
    }
    if (award.kind === 'field-grant') {
      const context = resolveGovernedFieldGrantContext(award)
      operations.push({ kind: 'grant-governed-field', packageId: packageDefinition.id, optionId: option.id, awardId: award.id, ...context })
      return
    }
    throw new Error(`Unsupported conditional package award: ${award.kind}`)
  }
  for (const award of option.awards) expand(award)
  return { packageId: packageDefinition.id, optionId, operations, source: { ...packageDefinition.source } }
}

function lifeModuleDestinationToResolved(destination: LifeModuleDestination): ResolvedLifeModuleDestination {
  if (destination.type === 'attribute') return { type: 'attribute', targetId: destination.attributeId, displayName: destination.attributeId }
  if (destination.type === 'trait') return { type: 'trait', targetId: destination.traitId, displayName: destination.displayName, ...(destination.parameters ? { parameters: { ...destination.parameters } } : {}) }
  return { type: 'skill', targetId: destination.address.skillId, displayName: destination.displayName, ...(destination.address.parameter ? { parameter: { ...destination.address.parameter } } : {}) }
}

function applyGovernedFieldGrant(character: CharacterDefinition, operation: Extract<LifeModuleTransactionOperation, { kind: 'grant-governed-field' }>): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  const school = getLifeModule(operation.schoolModuleId)
  const offer = school.skillFieldSelection?.offers.find((entry) => entry.fieldId === operation.fieldId)
  const field = getSkillField(operation.fieldId)
  if (!offer || operation.offerId !== `${school.id}/${operation.fieldId}`) throw new Error(`Field grant ${operation.fieldId} does not match a governed school offer.`)
  if (offer.category !== operation.category || offer.awardedXpPerSkill !== operation.xpPerSkill || offer.chronologyYears !== operation.chronologyYears || skillFieldCost(field, offer.costXpPerSkill) !== operation.purchaseCostXp) throw new Error(`Field grant ${operation.fieldId} has inconsistent XP, category, or chronology.`)
  if (state.selectedSkillFields.some((entry) => entry.fieldId === operation.fieldId)) throw new Error(`Skill Field is already acquired: ${operation.fieldId}`)
  if (!next.lifeModuleHistory.some((entry) => entry.moduleId === operation.schoolModuleId)) throw new Error(`Field grant requires its governed school: ${operation.schoolModuleId}`)
  const provenanceId = makeId(undefined, `package-field-${operation.packageId}-${operation.optionId}-${operation.awardId}`)
  next.provenance.push({ id: provenanceId, kind: 'published', description: `${field.displayName} Skill Field package grant`, source: { ...field.source } })
  for (const component of field.componentSkills) applyDestinationAward(next, component, operation.xpPerSkill, provenanceId)
  for (const component of field.affiliationBoundComponentSkills ?? []) applyDestinationAward(next, resolveAffiliationBoundLifeModuleDestination(next, component.skillId, component.displayName), operation.xpPerSkill, provenanceId)
  const variableChoices = field.variableComponentSkills?.map((component) => {
    const selected = operation.choices?.[component.id]
    if (!selected || !component.legalSubskills.includes(selected)) throw new Error(`Required concrete Field Skill choice is missing or invalid: ${component.id}`)
    const destination: LifeModuleDestination = { type: 'skill', address: { skillId: component.skillId, parameter: { kind: 'subskill', value: selected } }, displayName: `${component.displayName}/${selected}` }
    applyDestinationAward(next, destination, operation.xpPerSkill, provenanceId)
    return { componentId: component.id, destination: lifeModuleDestinationToResolved(destination) }
  }) ?? []
  state.selectedSkillFields.push({ id: makeId(undefined, 'field-grant'), schoolModuleId: operation.schoolModuleId, fieldId: field.id, displayName: field.displayName, category: operation.category, purchaseCostXp: operation.purchaseCostXp, xpPerSkill: operation.xpPerSkill, chronologyYears: operation.chronologyYears, selectedAt: new Date().toISOString(), provenanceId, source: { ...field.source }, variableSkillChoices: variableChoices, prerequisiteSkillChoices: [] })
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.updatedAt = new Date().toISOString()
  return next
}

const CLAN_WARRIOR_ALLOCATION_FIELD_IDS = new Set(['field.clan-aerospace-warrior', 'field.clan-elemental', 'field.clan-mechwarrior'])

function destinationKey(destination: ResolvedLifeModuleDestination): string {
  return `${destination.type}/${destination.targetId}/${destination.parameter?.kind ?? ''}/${destination.parameter?.value ?? ''}/${JSON.stringify(destination.parameters ?? {})}`
}

function applyClanWarriorFieldSkillAllocation(character: CharacterDefinition, operation: Extract<LifeModuleTransactionOperation, { kind: 'allocate-clan-warrior-field-xp' }>): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (!operation.awardId || !operation.moduleId || operation.selections.length !== 3) throw new Error('Clan Warrior Field allocation requires exactly three Skill selections.')
  if (operation.selections.some((selection) => selection.destination.type !== 'skill')) throw new Error('Clan Warrior Field allocation destinations must be concrete Skills.')
  const keys = operation.selections.map((selection) => destinationKey(selection.destination))
  if (new Set(keys).size !== keys.length) throw new Error('Clan Warrior Field allocation cannot select a Skill more than once.')
  if (state.clanWarriorFieldSkillAllocations?.some((entry) => entry.awardId === operation.awardId)) throw new Error(`Clan Warrior Field allocation is already resolved: ${operation.awardId}`)
  const provenanceId = makeId(undefined, `clan-warrior-allocation-${operation.awardId}`)
  next.provenance.push({ id: provenanceId, kind: 'published', description: 'Clan Warrior Field Skill allocation', source: { ...operation.source } })
  const records = state.clanWarriorFieldSkillAllocations ?? (state.clanWarriorFieldSkillAllocations = [])
  for (const selection of operation.selections) {
    if (!CLAN_WARRIOR_ALLOCATION_FIELD_IDS.has(selection.fieldId)) throw new Error(`Skill Field is not a supported mechanical Clan Warrior Field: ${selection.fieldId}`)
    const grant = state.selectedSkillFields.find((entry) => entry.fieldId === selection.fieldId)
    if (!grant) throw new Error(`Clan Warrior Field has not been acquired: ${selection.fieldId}`)
    const field = getSkillField(selection.fieldId)
    const allowed = [...field.componentSkills.map(lifeModuleDestinationToResolved), ...(grant.variableSkillChoices ?? []).map((entry) => entry.destination)]
    if (!allowed.some((entry) => destinationKey(entry) === destinationKey(selection.destination))) throw new Error(`Selected Skill is not a concrete Skill in ${field.displayName}.`)
    applyDestinationAward(next, { type: 'skill', address: { skillId: selection.destination.targetId, ...(selection.destination.parameter ? { parameter: selection.destination.parameter } : {}) }, displayName: selection.destination.displayName }, 25, provenanceId)
    records.push({ id: makeId(undefined, 'clan-warrior-allocation'), awardId: operation.awardId, moduleId: operation.moduleId, fieldId: selection.fieldId, destination: structuredClone(selection.destination), xp: 25, provenanceId, source: { ...operation.source }, allocatedAt: new Date().toISOString() })
  }
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.updatedAt = new Date().toISOString()
  return updateLifeModuleProgress(next)
}

function applyCareerFieldSkillAllocation(character: CharacterDefinition, operation: Extract<LifeModuleTransactionOperation, { kind: 'allocate-career-field-xp' }>): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (operation.selections.length !== 4) throw new Error('Civilian Job career Field allocation requires exactly four Skill selections.')
  if (operation.selections.some((selection) => selection.destination.type !== 'skill')) throw new Error('Career Field allocation destinations must be concrete Skills.')
  const keys = operation.selections.map((selection) => destinationKey(selection.destination))
  if (new Set(keys).size !== keys.length) throw new Error('Career Field allocation cannot select a Skill more than once.')
  if (state.careerFieldSkillAllocations?.some((entry) => entry.awardId === operation.awardId)) throw new Error(`Career Field allocation is already resolved: ${operation.awardId}`)
  const grant = state.selectedSkillFields.find((entry) => entry.fieldId === operation.fieldId)
  if (!grant) throw new Error(`Career Field has not been acquired: ${operation.fieldId}`)
  const field = getSkillField(operation.fieldId)
  const allowed = [...field.componentSkills.map(lifeModuleDestinationToResolved), ...(grant.variableSkillChoices ?? []).map((entry) => entry.destination)]
  if (operation.selections.some((selection) => !allowed.some((entry) => destinationKey(entry) === destinationKey(selection.destination)))) throw new Error(`A selected Skill is not a concrete component of ${field.displayName}.`)
  const provenanceId = makeId(undefined, `career-field-allocation-${operation.awardId}`)
  next.provenance.push({ id: provenanceId, kind: 'published', description: 'Civilian Job career Field Skill allocation', source: { ...operation.source } })
  const records = state.careerFieldSkillAllocations ?? (state.careerFieldSkillAllocations = [])
  for (const selection of operation.selections) {
    applyDestinationAward(next, { type: 'skill', address: { skillId: selection.destination.targetId, ...(selection.destination.parameter ? { parameter: selection.destination.parameter } : {}) }, displayName: selection.destination.displayName }, 20, provenanceId)
    records.push({ id: makeId(undefined, 'career-field-allocation'), awardId: operation.awardId, moduleId: operation.moduleId, fieldId: operation.fieldId, destination: structuredClone(selection.destination), xp: 20, provenanceId, source: { ...operation.source }, allocatedAt: new Date().toISOString() })
  }
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.updatedAt = new Date().toISOString()
  return updateLifeModuleProgress(next)
}

function applyClanPackage(character: CharacterDefinition, operation: Extract<LifeModuleTransactionOperation, { kind: 'grant-clan-package' }>): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (next.clanIdentity?.id !== 'affiliation.clan' || !next.affiliations.some((entry) => entry.affiliationId === 'affiliation.clan')) throw new Error('Clan package requires the canonical Clan affiliation foundation.')
  if (operation.packageId === next.clanAffiliationPackageId || operation.packageId === next.clanCastePackageId) throw new Error(`Clan package is already committed: ${operation.packageId}`)
  const affiliation = CLAN_AFFILIATION_PACKAGES.find((entry) => entry.id === operation.packageId)
  const caste = CLAN_CASTE_PACKAGES.find((entry) => entry.id === operation.packageId)
  if (!affiliation && !caste) throw new Error(`Unknown Clan package: ${operation.packageId}`)
  if (caste && !next.clanCaste) throw new Error('Clan caste package requires a canonical caste foundation.')
  const cost = affiliation?.moduleCostXp ?? 0
  if (state.moduleXp.remaining < cost) throw new Error(`Selecting ${operation.packageId} would overspend the Life Module XP pool.`)
  const source = { ...(affiliation ?? caste)!.source }
  const provenanceId = makeId(undefined, `clan-package-${operation.packageId}`)
  next.provenance.push({ id: provenanceId, kind: 'published', description: `${(affiliation ?? caste)!.displayName} package awards`, source })
  const award = (destination: LifeModuleDestination, xp: number) => applyDestinationAward(next, destination, xp, provenanceId)
  if (operation.packageId === 'invading-clan') {
    award({ type: 'trait', traitId: 'trait.compulsion', displayName: 'Compulsion/Arrogance', parameters: { compulsion: 'Arrogance' } }, -50)
    award({ type: 'trait', traitId: 'trait.compulsion', displayName: 'Compulsion/Distrust of Inner Sphere', parameters: { compulsion: 'Distrust of Inner Sphere' } }, -100)
    award({ type: 'skill', address: { skillId: 'skill.interest', parameter: { kind: 'subskill', value: 'Clan Remembrance' } }, displayName: 'Interest/Clan Remembrance' }, 25)
    award({ type: 'skill', address: { skillId: 'skill.protocol', parameter: { kind: 'subskill', value: 'Clan' } }, displayName: 'Protocol/Clan' }, 25)
  } else if (operation.packageId === 'homeworld-clan') {
    award({ type: 'trait', traitId: 'trait.compulsion', displayName: 'Compulsion/Distrust of Inner Sphere', parameters: { compulsion: 'Distrust of Inner Sphere' } }, -100)
    award({ type: 'trait', traitId: 'trait.compulsion', displayName: 'Compulsion/Hate Invading Clans', parameters: { compulsion: 'Hate Invading Clans' } }, -100)
    award({ type: 'skill', address: { skillId: 'skill.interest', parameter: { kind: 'subskill', value: 'Clan Remembrance' } }, displayName: 'Interest/Clan Remembrance' }, 25)
    award({ type: 'skill', address: { skillId: 'skill.protocol', parameter: { kind: 'subskill', value: 'Clan' } }, displayName: 'Protocol/Clan' }, 25)
  } else if (operation.packageId === 'mechwarrior') {
    award({ type: 'attribute', attributeId: 'DEX' }, 75)
    award({ type: 'attribute', attributeId: 'RFL' }, 75)
    award({ type: 'attribute', attributeId: 'WIL' }, 75)
    award({ type: 'attribute', attributeId: 'CHA' }, -25)
    award({ type: 'attribute', attributeId: 'EDG' }, -50)
    award({ type: 'trait', traitId: 'trait.fit', displayName: 'Fit' }, 25)
    award({ type: 'trait', traitId: 'trait.impatient', displayName: 'Impatient' }, -50)
  } else {
    throw new Error(`Caste package awards require a source-defined concrete choice bundle: ${operation.packageId}`)
  }
  state.moduleXp.spent += cost
  state.moduleXp.remaining -= cost
  next.lifeModuleHistory.push({ moduleId: `stage0.clan-package.${operation.packageId}`, displayName: (affiliation ?? caste)!.displayName, stage: 0, costXp: cost, chronologyYears: 0, selectedAt: new Date().toISOString(), provenanceIds: [provenanceId], source, notes: ['Internal Clan package award integration; Clan creation remains player-facing unsupported.'] })
  state.selectedModuleIds.push(`stage0.clan-package.${operation.packageId}`)
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.xp.creation.remaining = state.moduleXp.remaining
  if (affiliation) next.clanAffiliationPackageId = operation.packageId
  else next.clanCastePackageId = operation.packageId
  next.updatedAt = new Date().toISOString()
  return next
}

function applyHomeworldClanPackage(character: CharacterDefinition, operation: Extract<LifeModuleTransactionOperation, { kind: 'grant-homeworld-clan-package' }>): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (!isHomeworldClanId(operation.clanId) || !['blood-spirit', 'ice-hellion'].includes(operation.clanId)) throw new Error('This bounded transaction supports only the source-complete Blood Spirit and Ice Hellion packages.')
  if (next.clanIdentity?.id !== 'affiliation.clan' || !next.affiliations.some((entry) => entry.affiliationId === 'affiliation.clan')) throw new Error('Specific Clan package requires the canonical Clan affiliation foundation.')
  if (next.clanAffiliationPackageId !== 'homeworld-clan') throw new Error('Specific Clan package requires the committed generic Homeworld Clan package.')
  if (next.clanSubAffiliationId || next.clanPackageHistory?.length) throw new Error('A specific Homeworld Clan package is already committed.')
  const pkg = HOMEWORLD_CLAN_PACKAGES.find((entry) => entry.identity.id === operation.clanId)!
  if (pkg.choices.length > 0) throw new Error('This candidate has unresolved governed choices and is not transaction-supported.')
  const provenanceId = makeId(undefined, `clan-sub-affiliation-${operation.clanId}`)
  next.provenance.push({ id: provenanceId, kind: 'published', description: `${pkg.identity.displayName} specific Clan package awards`, source: { ...pkg.identity.source } })
  for (const award of pkg.fixedAwards) {
    const resolved = resolveClanDestination(award.subject)
    if (resolved.status !== 'SUPPORTED_CONCRETE' || !resolved.canonicalId) throw new Error(`Specific Clan package award has an unresolved destination: ${award.subject}`)
    const destination: LifeModuleDestination = award.kind === 'attribute' && resolved.canonicalId.startsWith('attribute.')
      ? { type: 'attribute', attributeId: resolved.canonicalId.slice('attribute.'.length).toUpperCase() }
      : award.kind === 'trait' && resolved.family === 'trait'
        ? {
            type: 'trait', traitId: resolved.canonicalId, displayName: award.subject,
            parameters: resolved.subject
              ? resolved.canonicalId === 'trait.compulsion'
                ? { compulsion: resolved.subject }
                : resolved.canonicalId === 'trait.exceptional-attribute'
                  ? { attribute: resolved.subject }
                  : { subject: resolved.subject }
              : {},
          }
        : award.kind === 'skill' && resolved.family === 'skill'
          ? { type: 'skill', address: { skillId: resolved.canonicalId, ...(resolved.subject ? { parameter: { kind: 'subskill', value: resolved.subject } } : {}) }, displayName: award.subject }
          : (() => { throw new Error(`Specific Clan package award destination type does not match ${award.kind}: ${award.subject}`) })()
    applyDestinationAward(next, destination, award.xp, provenanceId)
  }
  const packageId = `stage0.clan-sub-affiliation.${operation.clanId}`
  const history: ClanPackageHistoryRecord = { version: 1, transactionId: makeId(undefined, `txn-${packageId}`), characterId: next.id, clanId: operation.clanId, parentAffiliationId: 'affiliation.clan', packageId, status: 'committed', awards: pkg.fixedAwards.map((award) => ({ id: award.id, type: award.kind === 'attribute' ? 'attribute-xp' : award.kind === 'trait' ? 'trait-xp' : 'skill-xp', destination: award.subject, amount: award.xp, packageId, source: { ...award.source } })), choices: [], source: { ...pkg.identity.source }, committedAt: new Date().toISOString() }
  next.clanPackageHistory = [history]
  next.clanSubAffiliationId = operation.clanId
  state.selectedModuleIds.push(packageId)
  next.lifeModuleHistory.push({ moduleId: packageId, displayName: pkg.identity.displayName, stage: 0, costXp: 0, chronologyYears: 0, selectedAt: history.committedAt, provenanceIds: [provenanceId], source: { ...pkg.identity.source }, notes: ['Internal specific Clan transaction; player-facing Clan creation remains unsupported.'] })
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.updatedAt = history.committedAt
  return next
}

function applyTruebornSibkoMechWarrior(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  const now = new Date().toISOString()
  if (next.clanIdentity?.id !== 'affiliation.clan' || !next.affiliations.some((entry) => entry.affiliationId === 'affiliation.clan')) throw new Error('Trueborn Sibko requires the canonical Clan affiliation foundation.')
  if (next.clanCaste?.id !== 'warrior') throw new Error('Trueborn Sibko MechWarrior requires the Warrior caste.')
  if (next.clanBirthOrigin?.id !== 'trueborn') throw new Error('Trueborn Sibko MechWarrior requires Trueborn identity.')
  if (next.phenotypeId !== 'phenotype.mechwarrior') throw new Error('Trueborn Sibko MechWarrior requires the MechWarrior Phenotype.')
  if (!next.lifeModuleHistory.some((entry) => entry.moduleId === TRUEBORN_CRECHE_ID)) throw new Error('Trueborn Sibko requires Trueborn Crèche history.')
  if (next.lifeModuleHistory.some((entry) => entry.moduleId === TRUEBORN_SIBKO_ID)) throw new Error('Trueborn Sibko is already committed.')
  if (state.moduleXp.remaining < 1600 + 384) throw new Error('Trueborn Sibko MechWarrior would overspend the Life Module XP pool.')
  const source = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 79, ruleId: 'stage-2-trueborn-sibko-mechwarrior' }
  const provenanceId = makeId(undefined, 'trueborn-sibko-mechwarrior')
  next.provenance.push({ id: provenanceId, kind: 'published', description: 'Trueborn Sibko MechWarrior branch awards', source })
  const award = (destination: LifeModuleDestination, xp: number) => applyDestinationAward(next, destination, xp, provenanceId)
  award({ type: 'attribute', attributeId: 'BOD' }, 40)
  award({ type: 'attribute', attributeId: 'DEX' }, 60)
  award({ type: 'attribute', attributeId: 'RFL' }, 50)
  award({ type: 'attribute', attributeId: 'WIL' }, 20)
  award({ type: 'attribute', attributeId: 'CHA' }, -30)
  award({ type: 'trait', traitId: 'trait.compulsion', displayName: 'Compulsion/Clan Honor', parameters: { compulsion: 'Clan Honor' } }, -50)
  award({ type: 'trait', traitId: 'trait.rank', displayName: 'Rank' }, 200)
  award({ type: 'skill', address: { skillId: 'skill.career', parameter: { kind: 'subskill', value: 'Soldier' } }, displayName: 'Career/Soldier' }, 80)
  award({ type: 'skill', address: { skillId: 'skill.interest', parameter: { kind: 'subskill', value: 'Clan Remembrance' } }, displayName: 'Interest/Clan Remembrance' }, 50)
  award({ type: 'skill', address: { skillId: 'skill.negotiation' }, displayName: 'Negotiation' }, 50)
  award({ type: 'trait', traitId: 'trait.custom-vehicle', displayName: 'Custom Vehicle' }, 200)
  award({ type: 'trait', traitId: 'trait.vehicle', displayName: 'Vehicle' }, 70)
  award({ type: 'skill', address: { skillId: 'skill.gunnery', parameter: { kind: 'subskill', value: "'Mech" } }, displayName: "Gunnery/'Mech" }, 15)
  award({ type: 'skill', address: { skillId: 'skill.piloting', parameter: { kind: 'subskill', value: 'BattleMech' } }, displayName: 'Piloting/BattleMech' }, 15)
  const field = getSkillField(CLAN_MECHWARRIOR_FIELD_ID)
  for (const component of field.componentSkills) applyDestinationAward(next, component, 80, provenanceId)
  state.selectedSkillFields.push({ id: makeId(undefined, 'trueborn-sibko-mechwarrior-field'), schoolModuleId: TRUEBORN_SIBKO_ID, fieldId: CLAN_MECHWARRIOR_FIELD_ID, displayName: field.displayName, category: 'advanced', purchaseCostXp: 384, xpPerSkill: 80, chronologyYears: 0, selectedAt: now, provenanceId, source: { ...field.source }, variableSkillChoices: [], prerequisiteSkillChoices: [] })
  state.pendingAwards.push({ id: `${TRUEBORN_SIBKO_ID}/flexible`, moduleId: TRUEBORN_SIBKO_ID, provenanceId, awardId: 'sibko.flexible', kind: 'flexible-xp', description: 'Allocate 50 flexible XP under the Trueborn Sibko MechWarrior source restrictions.', xpPerGrant: 0, remainingGrants: 0, allocationMode: 'pool', remainingXp: 50, allowedTargetTypes: ['attribute', 'trait', 'skill'], source })
  state.choiceGrantRequirements.push({ moduleId: TRUEBORN_SIBKO_ID, awardId: 'sibko.flexible', requiredGrants: 0, requiredXp: 50, allocationMode: 'pool' })
  state.moduleXp.spent += 1600 + 384
  state.moduleXp.remaining -= 1600 + 384
  state.selectedModuleIds.push(TRUEBORN_SIBKO_ID)
  next.lifeModuleHistory.push({ moduleId: TRUEBORN_SIBKO_ID, displayName: 'Trueborn Sibko', stage: 2, costXp: 1984, baseCostXp: 1600, fieldCostXp: 384, chronologyYears: 16, selectedAt: now, provenanceIds: [provenanceId], source, notes: ['Source-backed MechWarrior branch; the included Skill Field does not add chronology beyond the Sibko module.'] })
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.xp.creation.remaining = state.moduleXp.remaining
  next.updatedAt = now
  return updateLifeModuleProgress(next)
}

function applyTruebornCreche(character: CharacterDefinition, operation: Extract<LifeModuleTransactionOperation, { kind: 'grant-trueborn-creche' }>): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  const now = new Date().toISOString()
  if (next.clanIdentity?.id !== 'affiliation.clan' || !next.affiliations.some((entry) => entry.affiliationId === 'affiliation.clan')) throw new Error('Trueborn Crèche requires the canonical Clan affiliation foundation.')
  if (!next.clanBirthOrigin || next.clanBirthOrigin.id !== 'trueborn') throw new Error('Trueborn Crèche requires Trueborn identity.')
  if (!['phenotype.aerospace', 'phenotype.elemental', 'phenotype.mechwarrior'].includes(next.phenotypeId)) throw new Error('Trueborn Crèche requires an eligible Clan Phenotype.')
  if (!next.lifeModuleHistory.some((entry) => entry.moduleId.startsWith('stage0.clan-package.'))) throw new Error('Trueborn Crèche requires committed Stage 0 Clan package history.')
  if (next.lifeModuleHistory.some((entry) => entry.moduleId === TRUEBORN_CRECHE_ID)) throw new Error('Trueborn Crèche is already committed.')
  if (operation.choices.length !== 5 || operation.choices.some((choice) => choice.type !== 'attribute' && choice.type !== 'trait' && choice.type !== 'skill')) throw new Error('Trueborn Crèche requires exactly five concrete flexible-XP destinations.')
  if (state.moduleXp.remaining < 300) throw new Error('Trueborn Crèche would overspend the Life Module XP pool.')
  const source = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 76, ruleId: 'stage-1-trueborn-creche' }
  const provenanceId = makeId(undefined, 'trueborn-creche')
  next.provenance.push({ id: provenanceId, kind: 'published', description: 'Trueborn Crèche module awards', source })
  const crecheModule = getLifeModule(TRUEBORN_CRECHE_ID)
  const flexibleAward = crecheModule.awards.find((entry) => entry.id === 'creche.flexible')
  if (!flexibleAward || flexibleAward.kind !== 'flexible-xp' || flexibleAward.allocationMode === 'pool') throw new Error('Trueborn Crèche flexible award definition is unavailable.')
  const flexiblePending = pendingAwardFrom(crecheModule, flexibleAward, provenanceId)
  state.choiceGrantRequirements.push({ moduleId: TRUEBORN_CRECHE_ID, awardId: flexibleAward.id, requiredGrants: flexibleAward.count })
  const award = (destination: LifeModuleDestination, xp: number) => applyDestinationAward(next, destination, xp, provenanceId)
  award({ type: 'attribute', attributeId: 'STR' }, 100)
  award({ type: 'attribute', attributeId: 'BOD' }, 125)
  award({ type: 'attribute', attributeId: 'RFL' }, 125)
  award({ type: 'attribute', attributeId: 'WIL' }, 100)
  award({ type: 'attribute', attributeId: 'CHA' }, -75)
  award({ type: 'trait', traitId: 'trait.compulsion', displayName: 'Compulsion/Clan Honor', parameters: { compulsion: 'Clan Honor' } }, -100)
  award({ type: 'trait', traitId: 'trait.phenotype', displayName: 'Phenotype' }, 0)
  award({ type: 'trait', traitId: 'trait.slow-learner', displayName: 'Slow Learner' }, -300)
  award({ type: 'trait', traitId: 'trait.trueborn', displayName: 'Trueborn' }, 200)
  for (const [skillId, displayName, subject, xp] of [['skill.interest', 'Interest/Clan Remembrance', 'Clan Remembrance', 10], ['skill.martial-arts', 'Martial Arts', undefined, 10], ['skill.melee-weapons', 'Melee Weapons', undefined, 5], ['skill.protocol', 'Protocol/Clan', 'Clan', 10], ['skill.small-arms', 'Small Arms', undefined, 5], ['skill.swimming', 'Swimming', undefined, 10]] as const) award({ type: 'skill', address: { skillId, ...(subject ? { parameter: { kind: 'subskill', value: subject } } : {}) }, displayName }, xp)
  operation.choices.forEach((choice) => {
    const destination = { type: choice.type, targetId: choice.targetId, displayName: choice.displayName, ...(choice.parameter ? { parameter: choice.parameter } : {}), ...(choice.parameters ? { parameters: choice.parameters } : {}) } as ResolvedLifeModuleDestination
    validateResolutionDestination(next, flexiblePending, destination)
    const ledgerDestination = choice.type === 'attribute'
      ? { type: 'attribute', attributeId: choice.targetId }
      : choice.type === 'trait'
        ? { type: 'trait', traitId: choice.targetId, displayName: choice.displayName, ...(choice.parameters ? { parameters: choice.parameters } : {}) }
        : { type: 'skill', address: { skillId: choice.targetId, ...(choice.parameter ? { parameter: choice.parameter } : {}) }, displayName: choice.displayName }
    award(ledgerDestination as LifeModuleDestination, 15)
    recordResolvedAward(state.resolvedAwards, flexiblePending, destination, provenanceId, 15)
  })
  state.moduleXp.spent += 300
  state.moduleXp.remaining -= 300
  state.selectedModuleIds.push(TRUEBORN_CRECHE_ID)
  next.lifeModuleHistory.push({ moduleId: TRUEBORN_CRECHE_ID, displayName: 'Trueborn Crèche', stage: 1, costXp: 300, chronologyYears: 10, selectedAt: now, provenanceIds: [provenanceId], source, notes: ['Source-backed Trueborn Crèche; five flexible awards resolved through explicit internal choices.'] })
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.xp.creation.remaining = state.moduleXp.remaining
  next.updatedAt = now
  return updateLifeModuleProgress(next)
}

function applyClanWatchOperative(character: CharacterDefinition, operation: Extract<LifeModuleTransactionOperation, { kind: 'grant-clan-watch-operative' }>): CharacterDefinition {
  let next = structuredClone(character)
  let state = requireLifeModules(next)
  const now = new Date().toISOString()
  const rule = CLAN_STAGE4_ELIGIBILITY_RULES.find((entry) => entry.moduleId === CLAN_WATCH_OPERATIVE_ID)!
  const eligibility = evaluateClanStage4Eligibility(next, rule)
  if (eligibility.status !== 'ELIGIBLE' && !clanWarriorStage3Bypass(next)) throw new Error(`Clan Watch Operative is not eligible: ${eligibility.reasons.join('; ')}`)
  const context = CLAN_AFFILIATION_CONTEXTS.find((entry) => entry.id === state.stage0AffiliationContext)
  if (!context?.clanCategory) throw new Error('Clan Watch Operative requires a canonical Homeworld or Invader Clan affiliation context.')
  const expectedCategory = operation.branch === 'invader-clan' ? 'invading-clan' : operation.branch
  if (context.clanCategory !== expectedCategory) throw new Error(`Watch Operative branch ${operation.branch} does not match the canonical Clan affiliation category ${context.clanCategory}.`)
  const requiredChoiceIds = operation.branch === 'homeworld-clan'
    ? ['watch.tracking', 'homeworld.security-systems', 'homeworld.streetwise', 'homeworld.survival', 'homeworld.technician']
    : ['watch.tracking', 'invader.streetwise', 'invader.survival']
  if (requiredChoiceIds.some((choiceId) => !operation.choices[choiceId]?.trim())) throw new Error(`Concrete Watch Operative Skill choices are incomplete: ${requiredChoiceIds.filter((choiceId) => !operation.choices[choiceId]?.trim()).join(', ')}`)
  if (next.lifeModuleHistory.some((entry) => entry.moduleId === CLAN_WATCH_OPERATIVE_ID)) throw new Error('Clan Watch Operative cannot be repeated.')
  if (state.moduleXp.remaining < 1200) throw new Error('Clan Watch Operative would overspend the Life Module XP pool.')
  const source = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 84, ruleId: `stage-4-clan-watch-operative-${operation.branch}` }
  const watchModule = getLifeModule(CLAN_WATCH_OPERATIVE_ID)
  const provenanceId = makeId(undefined, 'clan-watch-operative')
  next.provenance.push({ id: provenanceId, kind: 'published', description: `Clan Watch Operative ${operation.branch} awards`, source })
  const award = (destination: LifeModuleDestination, xp: number) => applyDestinationAward(next, destination, xp, provenanceId)
  award({ type: 'attribute', attributeId: 'INT' }, 70)
  award({ type: 'attribute', attributeId: 'RFL' }, 50)
  award({ type: 'attribute', attributeId: 'CHA' }, -75)
  award({ type: 'trait', traitId: 'trait.connections', displayName: 'Connections' }, 100)
  award({ type: 'trait', traitId: 'trait.dark-secret', displayName: 'Dark Secret' }, -50)
  award({ type: 'trait', traitId: 'trait.in-for-life', displayName: 'In For Life' }, -100)
  award({ type: 'trait', traitId: 'trait.reputation', displayName: 'Reputation' }, -50)
  for (const [skillId, displayName, xp] of [
    ['skill.acting', 'Acting', 30], ['skill.computers', 'Computers', 75], ['skill.cryptography', 'Cryptography', 50], ['skill.demolitions', 'Demolitions', 40], ['skill.martial-arts', 'Martial Arts', 75], ['skill.perception', 'Perception', 75], ['skill.protocol', 'Protocol/Affiliation', 50], ['skill.small-arms', 'Small Arms', 80], ['skill.stealth', 'Stealth', 50], ['skill.streetwise', 'Streetwise/Affiliation', 50],
  ] as const) award({ type: 'skill', address: { skillId, ...(skillId === 'skill.protocol' || skillId === 'skill.streetwise' ? { parameter: { kind: 'subskill', value: operation.choices[skillId] ?? 'Affiliation' } } : {}) }, displayName }, xp)
  const trackingAward = watchModule.awards.find((entry) => entry.id === 'watch.skill.tracking-any')
  if (!trackingAward || trackingAward.kind !== 'any-skill-choice') throw new Error('Watch Operative Tracking choice definition is unavailable.')
  const trackingPending = pendingAwardFrom(watchModule, trackingAward, provenanceId)
  state.pendingAwards.push(trackingPending)
  next = resolvePendingLifeModuleAward(next, trackingPending.id, { type: 'skill', targetId: 'skill.tracking', displayName: `Tracking/${operation.choices['watch.tracking']}`, parameter: { kind: 'subskill', value: operation.choices['watch.tracking'] } }, 80)
  state = requireLifeModules(next)
  const required = operation.branch === 'homeworld-clan'
    ? [['skill.career', 'Career/Soldier', 60, 'Soldier'], ['skill.interrogation', 'Interrogation', 50], ['skill.investigation', 'Investigation', 50], ['skill.melee-weapons', 'Melee Weapons', 40], ['skill.protocol', 'Protocol/Any Clan', 75, operation.choices['homeworld.protocol'] ?? 'Clan'], ['skill.security-systems', 'Security Systems', 35, operation.choices['homeworld.security-systems']], ['skill.streetwise', 'Streetwise/Any Homeworld Clan', 50, operation.choices['homeworld.streetwise']], ['skill.survival', 'Survival', 25, operation.choices['homeworld.survival']], ['skill.technician', 'Technician', 40, operation.choices['homeworld.technician']]] as const
    : [['skill.equipped', 'Equipped', 50, undefined], ['skill.dark-secret', 'Dark Secret', -50, undefined], ['skill.computers', 'Computers', 50, undefined], ['skill.disguise', 'Disguise', 35, undefined], ['skill.interrogation', 'Interrogation', 75, undefined], ['skill.investigation', 'Investigation', 75, undefined], ['skill.negotiation', 'Negotiation', 40, undefined], ['skill.perception', 'Perception', 50, undefined], ['skill.streetwise', 'Streetwise/Any Invader Clan or Inner Sphere', 50, operation.choices['invader.streetwise']], ['skill.survival', 'Survival', 50, operation.choices['invader.survival']]] as const
  for (const [skillId, displayName, xp, subject] of required) {
    if (skillId === 'skill.equipped' || skillId === 'skill.dark-secret') award({ type: 'trait', traitId: skillId === 'skill.equipped' ? 'trait.equipped' : 'trait.dark-secret', displayName }, xp)
    else award({ type: 'skill', address: { skillId, ...(subject ? { parameter: { kind: 'subskill', value: subject } } : {}) }, displayName }, xp)
  }
  state.choiceGrantRequirements.push({ moduleId: CLAN_WATCH_OPERATIVE_ID, provenanceId, awardId: 'watch.skill.tracking-any', requiredGrants: 1 })
  state.choiceGrantRequirements.push({ moduleId: CLAN_WATCH_OPERATIVE_ID, provenanceId, awardId: 'watch.flexible', requiredGrants: 0, requiredXp: 175, allocationMode: 'pool' })
  state.pendingAwards.push({ id: `${CLAN_WATCH_OPERATIVE_ID}/${operation.branch}/flexible`, moduleId: CLAN_WATCH_OPERATIVE_ID, provenanceId, awardId: 'watch.flexible', kind: 'flexible-xp', description: 'Allocate 175 flexible XP under the Clan Watch Operative source restrictions.', xpPerGrant: 0, remainingGrants: 0, allocationMode: 'pool', remainingXp: 175, allowedTargetTypes: ['attribute', 'trait', 'skill'], source })
  state.moduleXp.spent += 1200
  state.moduleXp.remaining -= 1200
  state.selectedModuleIds.push(CLAN_WATCH_OPERATIVE_ID)
  next.lifeModuleHistory.push({ moduleId: CLAN_WATCH_OPERATIVE_ID, displayName: 'Clan Watch Operative', stage: 4, costXp: 1200, chronologyYears: 3, repeatPolicy: { sameModuleRepeat: 'deferred', repeatCost: 'full-module-cost', repeatAwards: { skills: 'repeat', flexibleXp: 'repeat', attributes: 'first-occurrence-only', traits: 'first-occurrence-only' } }, selectedAt: now, provenanceIds: [provenanceId], source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 84, ruleId: 'stage-4-clan-watch-operative' }, notes: [`Source-backed ${operation.branch} branch; Clan readiness remains unsupported.`] })
  const stage3And4Years = next.lifeModuleHistory
    .filter((entry) => entry.stage === 3 || entry.stage === 4)
    .reduce((total, entry) => total + (entry.chronologyYears ?? 0), 0)
  next.chronology.push({ date: `age:${16 + stage3And4Years}`, eventId: `${CLAN_WATCH_OPERATIVE_ID}.complete`, provenanceId })
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.xp.creation.remaining = state.moduleXp.remaining
  next.updatedAt = now
  return updateLifeModuleProgress(next)
}

export function buildLifeModuleTransaction(
  character: CharacterDefinition,
  operations: readonly LifeModuleTransactionOperation[],
  context: { provenanceContext?: string; sourceContext?: string } = {},
): LifeModuleTransaction {
  const transaction: LifeModuleTransaction = {
    baseState: structuredClone(character),
    operations: structuredClone(operations),
    ...context,
    prospectiveState: structuredClone(character),
    errors: [],
    status: 'built',
  }

  for (const [operationIndex, operation] of operations.entries()) {
    if (operation.kind === 'grant-capellan-civilian-job') {
      try { transaction.prospectiveState = applyCapellanCivilianJobSubstitution(transaction.prospectiveState!, operation.relationId) }
      catch (error) { transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) }) }
      continue
    }
    if (operation.kind === 'set-age' || operation.kind === 'add-years') {
      try { transaction.prospectiveState = applyChronologyOperation(transaction.prospectiveState!, operation) }
      catch (error) { transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) }) }
      continue
    }
    if (operation.kind === 'grant-governed-field') {
      try {
        transaction.prospectiveState = applyGovernedFieldGrant(transaction.prospectiveState!, operation)
      } catch (error) {
        transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) })
      }
      continue
    }
    if (operation.kind === 'allocate-clan-warrior-field-xp') {
      try { transaction.prospectiveState = applyClanWarriorFieldSkillAllocation(transaction.prospectiveState!, operation) }
      catch (error) { transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) }) }
      continue
    }
    if (operation.kind === 'allocate-career-field-xp') {
      try { transaction.prospectiveState = applyCareerFieldSkillAllocation(transaction.prospectiveState!, operation) }
      catch (error) { transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) }) }
      continue
    }
  if (operation.kind === 'grant-clan-package') {
      try { transaction.prospectiveState = applyClanPackage(transaction.prospectiveState!, operation) }
      catch (error) { transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) }) }
      continue
    }
    if (operation.kind === 'grant-homeworld-clan-package') {
      try { transaction.prospectiveState = applyHomeworldClanPackage(transaction.prospectiveState!, operation) }
      catch (error) { transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) }) }
      continue
    }
    if (operation.kind === 'grant-trueborn-sibko-mechwarrior') {
      try { transaction.prospectiveState = applyTruebornSibkoMechWarrior(transaction.prospectiveState!) }
      catch (error) { transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) }) }
      continue
    }
    if (operation.kind === 'grant-trueborn-creche') {
      try { transaction.prospectiveState = applyTruebornCreche(transaction.prospectiveState!, operation) }
      catch (error) { transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) }) }
      continue
    }
    if (operation.kind === 'grant-clan-watch-operative') {
      try { transaction.prospectiveState = applyClanWatchOperative(transaction.prospectiveState!, operation) }
      catch (error) { transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) }) }
      continue
    }
    if (operation.kind !== 'resolve-pending-award') {
      transaction.errors.push({ kind: 'unsupported-operation', operationIndex, message: `Unsupported Life Module transaction operation: ${String((operation as { kind?: unknown }).kind)}` })
      continue
    }
    if (!operation.pendingAwardId || !operation.destination?.type || !operation.destination.targetId || !operation.destination.displayName) {
      transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: 'A pending-award operation requires an award ID and complete destination.' })
      continue
    }
    const pending = transaction.prospectiveState!.creation.lifeModules?.pendingAwards.find((entry) => entry.id === operation.pendingAwardId)
    if (!pending) {
      transaction.errors.push({ kind: 'unresolved-choice', operationIndex, message: `Pending Life Module award is not available: ${operation.pendingAwardId}` })
      continue
    }
    try {
      transaction.prospectiveState = resolvePendingLifeModuleAward(transaction.prospectiveState!, operation.pendingAwardId, operation.destination, operation.xpAmount)
    } catch (error) {
      transaction.errors.push({ kind: 'invalid-operation', operationIndex, message: error instanceof Error ? error.message : String(error) })
    }
  }
  if (transaction.errors.length > 0) {
    transaction.prospectiveState = null
    transaction.status = 'failed'
  }
  return transaction
}

export function validateLifeModuleTransaction(transaction: LifeModuleTransaction): LifeModuleTransaction {
  if (transaction.status === 'committed') throw new Error('A committed Life Module transaction cannot be validated again.')
  if (transaction.status === 'failed' || !transaction.prospectiveState) return transaction
  const validation = validateCharacter(transaction.prospectiveState)
  const errors = validation.issues.filter((entry) => entry.severity === 'error')
  if (errors.length > 0) {
    transaction.errors = errors.map((entry) => ({
      kind: 'illegal-prospective-state' as const,
      message: entry.message,
      validationIssueIds: [entry.id],
    }))
    transaction.prospectiveState = null
    transaction.status = 'failed'
  } else {
    transaction.status = 'validated'
  }
  return transaction
}

export function commitLifeModuleTransaction(transaction: LifeModuleTransaction): CharacterDefinition {
  if (transaction.status !== 'validated' || !transaction.prospectiveState) throw new Error('Only a validated Life Module transaction can be committed.')
  transaction.status = 'committed'
  return structuredClone(transaction.prospectiveState)
}

export function createLifeModuleCharacter(
  displayName: string,
  startingXp = 5000,
  dependencies?: CharacterFactoryDependencies,
): CharacterDefinition {
  if (!Number.isInteger(startingXp) || startingXp <= 0) throw new RangeError('Life Module starting XP must be a positive whole number.')
  const character = createCharacterDraft('life-modules', displayName, dependencies)
  const provenanceId = makeId(dependencies, 'life-module-rules')
  character.creation.lifeModules = {
    awardResolutionVersion: 1,
    awardSelectorVersion: 1,
    source: { ...LIFE_MODULE_RULES_SOURCE },
    startingAllotment: startingXp === 5000 ? 'standard' : 'gm-adjusted',
    phase: 'stage-0-universal',
    currentStage: 0,
    moduleXp: { starting: startingXp, spent: 0, remaining: startingXp },
    selectedModuleIds: [],
    selectedSkillFields: [],
    pendingAwards: [],
    resolvedAwards: [],
    choiceGrantRequirements: [],
    prerequisiteIssues: [],
    stopState: 'not-eligible',
    limitations: [
      'Alpha Slice 63 includes the Stage 0/1/2 bounded catalog, Technical College, Military Academy, Military Enlistment, fifteen source-audited mechanically acquirable Skill Fields, bounded variable Field-Skill choices, Agitator at Stage 4, and final-review/Optimization foundations.',
      'The current minimal catalog can resolve language, /Affiliation, /Any, multi-choice, and flexible awards.',
      'Broad Stage 3/4 and Skill Field catalogs, repeated schooling and Stage 4 execution, Changing Affiliations, Life Events, equipment, PDF export, and true finalization are deferred.',
    ],
  }
  character.provenance.push({ id: provenanceId, kind: 'published', description: 'Life Module character creation rules', source: { ...LIFE_MODULE_RULES_SOURCE } })
  character.xp.creation = { starting: startingXp, remaining: startingXp, allocated: 0 }
  const next = applyModule(character, getLifeModule(UNIVERSAL_STAGE_0_ID), {})
  requireLifeModules(next).phase = 'stage-0-affiliation'
  return next
}

export function applyUniversalStage0(
  character: CharacterDefinition,
  affiliationContextModuleId: string,
  affiliationLanguage: string,
): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-0-universal' && state.phase !== 'stage-0-affiliation') throw new Error('The universal Stage 0 package is not the current legal action.')
  const resolution = resolveLifeModuleAffiliationContext(affiliationContextModuleId)
  if (resolution.support === 'deferred') {
    throw new Error('Choose an explicit Stage 0 affiliation context before resolving the Universal affiliation-language award.')
  }
  const language = affiliationLanguage.trim()
  if (!getLifeModuleLanguageSelectorOptions(resolution.context.affiliationLanguageSelector).includes(language)) {
    throw new Error('Universal affiliation language must be a listed primary or secondary language for the selected affiliation context.')
  }
  const destination: ResolvedLifeModuleDestination = {
    type: 'skill', targetId: 'skill.language', displayName: `Language/${language}`,
    parameter: { kind: 'subskill', value: language },
  }
  const universalAlreadyIncluded = state.selectedModuleIds.includes(UNIVERSAL_STAGE_0_ID)
  const universalLanguageAward = state.pendingAwards.find((entry) => entry.moduleId === UNIVERSAL_STAGE_0_ID && entry.awardId === 'universal.language.affiliation')
  const resolutionCharacter = universalAlreadyIncluded && universalLanguageAward
    ? structuredClone(character)
    : character
  if (universalAlreadyIncluded && universalLanguageAward) {
    const pendingAward = requireLifeModules(resolutionCharacter).pendingAwards.find((entry) => entry.id === universalLanguageAward.id)
    if (pendingAward) pendingAward.choiceSource = resolution.context.affiliationLanguageSelector
  }
  const next = universalAlreadyIncluded
    ? resolvePendingLifeModuleAward(resolutionCharacter, universalLanguageAward?.id ?? '', destination)
    : applyModule(character, getLifeModule(UNIVERSAL_STAGE_0_ID), {
        'universal.language.affiliation': toLifeModuleDestination(destination),
      })
  requireLifeModules(next).stage0AffiliationContext = affiliationContextModuleId
  requireLifeModules(next).affiliationLanguage = language
  requireLifeModules(next).phase = 'stage-0-affiliation'
  return next
}

type DraconisSubId = typeof DRACONIS_AZAMI_ID | typeof DRACONIS_BENJAMIN_ID | typeof DRACONIS_DIERON_ID | typeof DRACONIS_NEW_SAMARKAND_ID | typeof DRACONIS_PESHT_ID | 'no'

export function applyDraconisCombine(
  character: CharacterDefinition,
  subAffiliation: DraconisSubId = 'no',
  traitChoice?: 'Pain Resistance' | 'Combat Sense',
  weaponChoice?: 'Archery' | 'Melee Weapons' | 'Thrown Weapons/Blade',
  languageChoice?: string,
  openChoices: Record<string, string> = {},
): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-0-affiliation' || state.stage0AffiliationContext !== DRACONIS_COMBINE_ID) throw new Error('The Draconis Combine package requires the explicit Draconis Stage 0 context.')
  if (!traitChoice || !['Pain Resistance', 'Combat Sense'].includes(traitChoice)) throw new Error('Choose Pain Resistance or Combat Sense.')
  if (!weaponChoice || !['Archery', 'Melee Weapons', 'Thrown Weapons/Blade'].includes(weaponChoice)) throw new Error('Choose a supported Draconis flexible Skill.')
  if (!languageChoice || !getLifeModuleLanguageSelectorOptions('draconis-languages').includes(languageChoice)) throw new Error('Choose a supported Draconis language.')
  const requiredChoice = (key: string, label: string) => {
    const value = openChoices[key]?.trim()
    if (!value || value === 'Any' || value === 'Other') throw new Error(`Choose a concrete ${label} for the Draconis Combine package.`)
    return value
  }
  if (subAffiliation === DRACONIS_AZAMI_ID) requiredChoice('survival', 'Survival subject')
  if (subAffiliation === DRACONIS_DIERON_ID) {
    requiredChoice('language', 'Language subject')
    requiredChoice('art', 'Art subject')
  }
  const source = { ...DRACONIS_COMBINE_CONTEXT.source }
  const skillDestination = (skillId: string, displayName: string, subject?: string): LifeModuleDestination => ({ type: 'skill', address: { skillId, ...(subject ? { parameter: { kind: 'subskill', value: subject } } : {}) }, displayName })
  const awards: LifeModuleAward[] = DRACONIS_COMBINE_CATALOG_AWARDS.map((award): LifeModuleAward => {
    if (award.id === 'draconis.trait.choice' && award.kind === 'choice-package') return { id: award.id, kind: 'fixed', xp: 100, destination: { type: 'trait', traitId: traitChoice === 'Pain Resistance' ? 'trait.pain-resistance' : 'trait.combat-sense', displayName: traitChoice } }
    if (award.id === 'draconis.skill.weapon-choice' && award.kind === 'fixed') return { ...award, destination: skillDestination(weaponChoice === 'Archery' ? 'skill.archery' : weaponChoice === 'Melee Weapons' ? 'skill.melee-weapons' : 'skill.thrown-weapons', weaponChoice, weaponChoice === 'Thrown Weapons/Blade' ? 'Blade' : undefined) }
    return award
  })
  awards.push({ id: 'draconis.language.primary', kind: 'fixed', xp: 0, destination: skillDestination('skill.language', `Language/${languageChoice}`, languageChoice) })
  const subAwards = (DRACONIS_SUB_AFFILIATION_CATALOG_AWARDS[subAffiliation] ?? []).map((award): LifeModuleAward => {
    if (award.id === 'azami.skill.survival' && award.kind === 'any-skill-choice') return { id: award.id, kind: 'fixed', xp: award.xp, destination: skillDestination('skill.survival', `Survival/${openChoices.survival}`, openChoices.survival) }
    if (award.id === 'dieron.language.any' && award.kind === 'language-choice') return { id: award.id, kind: 'fixed', xp: award.xp, destination: skillDestination('skill.language', `Language/${openChoices.language}`, openChoices.language) }
    if (award.id === 'dieron.skill.art' && award.kind === 'any-skill-choice') return { id: award.id, kind: 'fixed', xp: award.xp, destination: skillDestination('skill.art', `Art/${openChoices.art}`, openChoices.art) }
    return award
  })
  const resolvedContext = subAffiliation === 'no' ? null : resolveLifeModuleAffiliationContext(subAffiliation)
  const module: LifeModuleDefinition = { id: DRACONIS_COMBINE_ID, displayName: resolvedContext?.support === 'supported' ? resolvedContext.context.displayName : 'Draconis Combine / House Kurita', stage: 0, kind: 'affiliation', source, costXp: 150, primaryLanguage: 'Japanese', secondaryLanguages: [...DRACONIS_COMBINE_CONTEXT.secondaryLanguages], prerequisites: [], awards: [...awards, ...(subAffiliation !== 'no' ? subAwards : [])], notes: ['Child labor is legal. Civilian Job may replace a Stage 2 module and advances age to 18.'], deferredRules: ['Military/Stage 3 Citizenship dependencies remain governed by later-stage rules.'] }
  const subSource = resolvedContext?.support === 'supported' ? resolvedContext.context.source : undefined
  const next = applyModule(character, module, {}, subSource ? { awardSource: (awardId) => awardId.startsWith('draconis.') ? undefined : subSource } : {})
  const provenanceId = next.lifeModuleHistory.at(-1)?.provenanceIds[0]
  if (!provenanceId) throw new Error('Draconis provenance was not recorded.')
  next.affiliations.push({ affiliationId: DRACONIS_COMBINE_CONTEXT.affiliationId, role: 'birth', provenanceId }, { affiliationId: DRACONIS_COMBINE_CONTEXT.affiliationId, role: 'final', provenanceId })
  requireLifeModules(next).stage0SubAffiliation = subAffiliation
  requireLifeModules(next).phase = 'stage-1-selection'
  requireLifeModules(next).currentStage = 1
  return next
}

export function applyStage0Affiliation(
  character: CharacterDefinition,
  affiliationContextModuleId: string,
  affiliationLanguage: string,
  capellanSecondaryLanguage?: string,
  davionNaturalAptitude?: 'Protocol' | 'Strategy',
  davionArt?: string,
  orderAffiliation: OrderAffiliationSelection = 'no',
  orderNearestStateContext?: string,
  orderSecondaryLanguage?: string,
  orderTechnicianSubskill?: string,
  subAffiliationSelection?: string,
  survivalSubject?: string,
  draconisTraitChoice?: 'Pain Resistance' | 'Combat Sense',
  draconisWeaponChoice?: 'Archery' | 'Melee Weapons' | 'Thrown Weapons/Blade',
  draconisChoices?: Record<string, string>,
): CharacterDefinition {
  const resolvedAffiliation = resolveLifeModuleAffiliationContext(affiliationContextModuleId)
  const draconisSelected = resolvedAffiliation.support === 'supported' && resolvedAffiliation.context.affiliationId === DRACONIS_COMBINE_CONTEXT.affiliationId
  const universalContextId = draconisSelected ? DRACONIS_COMBINE_ID : affiliationContextModuleId
  const withUniversal = applyUniversalStage0(character, universalContextId, affiliationLanguage)
  const includeSubAffiliation = subAffiliationSelection === undefined || subAffiliationSelection === affiliationContextModuleId || subAffiliationSelection === SIAN_COMMONALITY_ID
  const withBirth = draconisSelected
    ? applyDraconisCombine(withUniversal, subAffiliationSelection as DraconisSubId || 'no', draconisTraitChoice, draconisWeaponChoice, affiliationLanguage, draconisChoices)
    : affiliationContextModuleId === FEDERATED_SUNS_CRUCIS_MARCH_ID
    ? applyFederatedSunsCrucisMarch(withUniversal, davionNaturalAptitude, davionArt, includeSubAffiliation)
    : affiliationContextModuleId === FEDERATED_SUNS_CAPELLAN_MARCH_ID || affiliationContextModuleId === FEDERATED_SUNS_DRACONIS_MARCH_ID || affiliationContextModuleId === FEDERATED_SUNS_OUTBACK_ID
      ? applyFederatedSunsMarch(withUniversal, affiliationContextModuleId, davionNaturalAptitude, davionArt, includeSubAffiliation, survivalSubject)
      : applyCapellanCommonality(withUniversal, capellanSecondaryLanguage, includeSubAffiliation, subAffiliationSelection)
  requireLifeModules(withBirth).stage0SubAffiliation = includeSubAffiliation ? (subAffiliationSelection ?? affiliationContextModuleId) : 'no'
  return applyOrderAffiliation(withBirth, orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill)
}

export function applyOrderAffiliation(
  character: CharacterDefinition,
  selection: OrderAffiliationSelection,
  nearestStateContextId?: string,
  secondaryLanguage?: string,
  technicianSubskill?: string,
): CharacterDefinition {
  if (selection === 'no') return character
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-1-selection') throw new Error('The ComStar/Word of Blake layer commits with the Stage 0 birth affiliation.')
  if (character.traits.some((entry) => entry.active && (entry.traitId === 'trait.extra-income' || entry.traitId === 'trait.property'))) {
    throw new Error('ComStar/Word of Blake affiliation conflicts with active Extra Income or Property.')
  }
  const nearest = resolveLifeModuleAffiliationContext(nearestStateContextId?.trim() ?? '')
  if (nearest.support !== 'supported') throw new Error('Choose a supported nearest state for the ComStar/Word of Blake affiliation layer.')
  const language = secondaryLanguage?.trim() ?? ''
  const languages = getLifeModuleLanguageSelectorOptions(nearest.context.affiliationLanguageSelector)
  if (!languages.includes(language)) throw new Error('Choose a modeled language from the declared nearest state.')
  const technician = technicianSubskill?.trim() ?? ''
  if (!TECHNICIAN_SUBSKILLS.includes(technician as (typeof TECHNICIAN_SUBSKILLS)[number])) throw new Error('Choose a canonical Technician subskill.')
  const moduleId = selection === 'comstar' ? COMSTAR_ORDER_ID : WORD_OF_BLAKE_ORDER_ID
  const published = getLifeModule(moduleId)
  const nearestProtocol = nearest.context.protocolContextLabel
  const module: LifeModuleDefinition = {
    ...published,
    awards: [
      ...published.awards,
      { id: 'order.language.nearest-state', kind: 'fixed', xp: 0, destination: { type: 'skill', address: { skillId: 'skill.language', parameter: { kind: 'subskill', value: language } }, displayName: `Language/${language}` } },
      { id: 'order.skill.protocol-nearest-state', kind: 'fixed', xp: selection === 'comstar' ? 15 : 5, destination: { type: 'skill', address: { skillId: 'skill.protocol', parameter: { kind: 'subskill', value: nearestProtocol } }, displayName: `Protocol/${nearestProtocol}` } },
      { id: 'order.skill.technician', kind: 'fixed', xp: 10, destination: { type: 'skill', address: { skillId: 'skill.technician', parameter: { kind: 'subskill', value: technician } }, displayName: `Technician/${technician}` } },
    ],
  }
  const next = applyModule(character, module, {})
  const nextState = requireLifeModules(next)
  const provenanceId = next.lifeModuleHistory.at(-1)?.provenanceIds[0]
  if (!provenanceId) throw new Error('Order affiliation provenance was not recorded.')
  next.affiliations.push({ affiliationId: ORDER_AFFILIATION_IDS[selection], role: 'order', provenanceId })
  nextState.orderAffiliation = selection
  nextState.orderNearestStateContext = nearest.context.id
  nextState.orderSecondaryLanguage = language
  nextState.orderTechnicianSubskill = technician
  return next
}

export function previewOrderAffiliation(
  character: CharacterDefinition,
  selection: OrderAffiliationSelection,
  nearestStateContextId?: string,
  secondaryLanguage?: string,
  technicianSubskill?: string,
): CharacterDefinition {
  if (selection === 'no') return character
  try {
    return applyOrderAffiliation(character, selection, nearestStateContextId, secondaryLanguage, technicianSubskill)
  } catch {
    const moduleId = selection === 'comstar' ? COMSTAR_ORDER_ID : WORD_OF_BLAKE_ORDER_ID
    const next = applyModule(character, getLifeModule(moduleId), {})
    const state = requireLifeModules(next)
    state.orderAffiliation = selection
    const source = getLifeModule(moduleId).source
    if (!nearestStateContextId) state.pendingAwards.push({ id: `preview-${moduleId}-nearest`, moduleId, awardId: 'order.nearest-state', kind: 'affiliation-skill-choice', description: 'Choose the nearest modeled state.', xpPerGrant: 0, remainingGrants: 1, allowedTargetTypes: ['skill'], requiredSkillId: 'skill.protocol', source: { ...source } })
    if (!secondaryLanguage) state.pendingAwards.push({ id: `preview-${moduleId}-language`, moduleId, awardId: 'order.language.nearest-state', kind: 'language-choice', description: 'Choose a modeled language from the nearest state.', xpPerGrant: 0, remainingGrants: 1, allowedTargetTypes: ['skill'], choiceSource: 'affiliation-languages', requiredSkillId: 'skill.language', source: { ...source } })
    if (!technicianSubskill) state.pendingAwards.push({ id: `preview-${moduleId}-technician`, moduleId, awardId: 'order.skill.technician', kind: 'any-skill-choice', description: 'Technician/Any: choose 1 concrete subskill.', xpPerGrant: 10, remainingGrants: 1, allowedTargetTypes: ['skill'], requiredSkillId: 'skill.technician', source: { ...source } })
    return next
  }
}

export function applyCapellanCommonality(character: CharacterDefinition, capellanSecondaryLanguage?: string, includeSubAffiliation = true, subAffiliationSelection?: string): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-0-affiliation') throw new Error('The Stage 0 affiliation is not the current legal action.')
  if (state.stage0AffiliationContext !== CAPELLAN_COMMONALITY_CONTEXT.id) {
    throw new Error('The selected Stage 0 affiliation package must match the explicit Universal affiliation context.')
  }
  const resolutions: Record<string, LifeModuleDestination> = {}
  const language = capellanSecondaryLanguage?.trim()
  if (language) {
    if (!getLifeModuleLanguageSelectorOptions(CAPELLAN_COMMONALITY_CONTEXT.secondaryLanguageSelector).includes(language)) {
      throw new Error('Capellan secondary-language award must resolve to a listed secondary language.')
    }
    resolutions['capellan.language.secondary'] = {
      type: 'skill', address: { skillId: 'skill.language', parameter: { kind: 'subskill', value: language } }, displayName: `Language/${language}`,
    }
  }
  const published = getLifeModule(CAPELLAN_COMMONALITY_ID)
  const sianSelected = includeSubAffiliation && subAffiliationSelection === SIAN_COMMONALITY_ID
  const module = sianSelected ? {
    ...published,
    displayName: 'Capellan Confederation / Sian Commonality',
    source: { ...published.source, ruleId: 'capellan-confederation-sian-commonality' },
    awards: [...published.awards, { id: 'sian.trait.citizenship', kind: 'fixed' as const, xp: 50, destination: { type: 'trait' as const, traitId: 'trait.citizenship', displayName: 'Citizenship', parameters: { subject: 'Capellan Confederation' } } }],
  } : includeSubAffiliation ? published : {
    ...published,
    displayName: CAPELLAN_COMMONALITY_CONTEXT.affiliationName,
    awards: published.awards.filter((award) => award.id.startsWith('capellan.')),
  }
  const next = applyModule(character, module, resolutions)
  const nextState = requireLifeModules(next)
  const provenanceId = next.lifeModuleHistory.at(-1)?.provenanceIds[0]
  if (!provenanceId) throw new Error('Affiliation provenance was not recorded.')
  next.affiliations.push(
    { affiliationId: CAPELLAN_COMMONALITY_CONTEXT.affiliationId, role: 'birth', provenanceId },
    { affiliationId: CAPELLAN_COMMONALITY_CONTEXT.affiliationId, role: 'final', provenanceId },
  )
  nextState.phase = 'stage-1-selection'
  nextState.currentStage = 1
  return next
}

export function applyFederatedSunsCrucisMarch(character: CharacterDefinition, naturalAptitude?: 'Protocol' | 'Strategy', art?: string, includeSubAffiliation = true): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-0-affiliation') throw new Error('The Stage 0 affiliation is not the current legal action.')
  if (state.stage0AffiliationContext !== FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.id) throw new Error('The selected Stage 0 affiliation package must match the explicit Universal affiliation context.')
  if (naturalAptitude !== 'Protocol' && naturalAptitude !== 'Strategy') throw new Error('Choose the published Federated Suns Natural Aptitude option.')
  if (includeSubAffiliation && art !== 'Painting') throw new Error('Choose a supported Crucis March Art subskill.')
  const published = getLifeModule(FEDERATED_SUNS_CRUCIS_MARCH_ID)
  const module: LifeModuleDefinition = {
    ...published,
    displayName: includeSubAffiliation ? published.displayName : FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.affiliationName,
    awards: published.awards.flatMap((award): LifeModuleAward[] => {
      if (!includeSubAffiliation && award.id.startsWith('crucis.')) return []
      if (award.id === 'fedsuns.trait.natural-aptitude') return [{ id: award.id, kind: 'fixed', xp: 100, destination: { type: 'trait', traitId: 'trait.natural-aptitude', displayName: `Natural Aptitude/${naturalAptitude}`, parameters: { skill: naturalAptitude } } }]
      if (award.id === 'crucis.skill.art') return [{ id: award.id, kind: 'fixed', xp: 10, destination: { type: 'skill', address: { skillId: 'skill.art', parameter: { kind: 'subskill', value: art! } }, displayName: `Art/${art}` } }]
      return [award]
    }),
  }
  const next = applyModule(character, module, {})
  const nextState = requireLifeModules(next)
  const provenanceId = next.lifeModuleHistory.at(-1)?.provenanceIds[0]
  if (!provenanceId) throw new Error('Affiliation provenance was not recorded.')
  if (includeSubAffiliation) {
    const artDestination: ResolvedLifeModuleDestination = {
    type: 'skill',
    targetId: 'skill.art',
    displayName: 'Art/Painting',
    parameter: { kind: 'subskill', value: art! },
  }
    nextState.choiceGrantRequirements.push({ moduleId: published.id, awardId: 'crucis.skill.art', requiredGrants: 1 })
    recordResolvedAward(nextState.resolvedAwards, {
    moduleId: published.id,
    awardId: 'crucis.skill.art',
    kind: 'any-skill-choice',
    xpPerGrant: 10,
    source: { ...published.source },
    }, artDestination, provenanceId, 10)
    next.creation.resolvedChoiceIds.push(`${published.id}/crucis.skill.art/${resolvedDestinationKey(artDestination)}`)
  }
  next.affiliations.push(
    { affiliationId: FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.affiliationId, role: 'birth', provenanceId },
    { affiliationId: FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.affiliationId, role: 'final', provenanceId },
  )
  nextState.phase = 'stage-1-selection'
  nextState.currentStage = 1
  return next
}

export function applyFederatedSunsMarch(character: CharacterDefinition, marchId: typeof FEDERATED_SUNS_CAPELLAN_MARCH_ID | typeof FEDERATED_SUNS_DRACONIS_MARCH_ID | typeof FEDERATED_SUNS_OUTBACK_ID, naturalAptitude?: 'Protocol' | 'Strategy', art?: string, includeSubAffiliation = true, survivalSubject = ''): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-0-affiliation') throw new Error('The Stage 0 affiliation is not the current legal action.')
  if (state.stage0AffiliationContext !== marchId) throw new Error('The selected Stage 0 affiliation package must match the explicit Universal affiliation context.')
  if (naturalAptitude !== 'Protocol' && naturalAptitude !== 'Strategy') throw new Error('Choose the published Federated Suns Natural Aptitude option.')
  const march = getLifeModule(marchId)
  const parent = getLifeModule(FEDERATED_SUNS_CRUCIS_MARCH_ID)
  const resolutions: Record<string, LifeModuleDestination> = {
    'fedsuns.trait.natural-aptitude': { type: 'trait', traitId: 'trait.natural-aptitude', displayName: `Natural Aptitude/${naturalAptitude}`, parameters: { skill: naturalAptitude } },
  }
  const awards: LifeModuleAward[] = parent.awards.filter((award) => award.id.startsWith('fedsuns.')).flatMap((award): LifeModuleAward[] => {
    if (award.kind === 'choice-package') return [{ id: award.id, kind: 'fixed', xp: 100, destination: resolutions['fedsuns.trait.natural-aptitude'] }]
    return [award]
  })
  if (includeSubAffiliation) awards.push(...march.awards)
  const module: LifeModuleDefinition = { ...march, costXp: 150, displayName: includeSubAffiliation ? march.displayName : 'Federated Suns', awards }
  if (includeSubAffiliation && marchId === FEDERATED_SUNS_CAPELLAN_MARCH_ID) {
    const language = art?.trim() ?? ''
    if (!getLifeModuleLanguageSelectorOptions('capellan-march-languages').includes(language)) throw new Error('Choose a valid Capellan March language.')
    resolutions['capellan-march.language'] = { type: 'skill', address: { skillId: 'skill.language', parameter: { kind: 'subskill', value: language } }, displayName: `Language/${language}` }
  }
  const draconisArt = includeSubAffiliation && marchId === FEDERATED_SUNS_DRACONIS_MARCH_ID && art?.trim()
  const outbackSubject = includeSubAffiliation && marchId === FEDERATED_SUNS_OUTBACK_ID ? art?.trim() : ''
  if (marchId === FEDERATED_SUNS_OUTBACK_ID && (!outbackSubject || !survivalSubject.trim() || outbackSubject === '__other__')) throw new Error('Choose an Outback Art or Interest subject and Survival environment.')
  let next = applyModule(character, module, resolutions)
  if (draconisArt) {
    const pendingArt = requireLifeModules(next).pendingAwards.find((award) => award.awardId === 'draconis-march.skill.art')
    if (!pendingArt) throw new Error('Draconis March Art award was not recorded as a pending choice.')
    const destination: ResolvedLifeModuleDestination = { type: 'skill', targetId: 'skill.art', displayName: `Art/${art!.trim()}`, parameter: { kind: 'subskill', value: art!.trim() } }
    next = resolvePendingLifeModuleAward(next, pendingArt.id, destination)
  }
  if (outbackSubject) {
    const pending = requireLifeModules(next).pendingAwards.find((award) => award.awardId === 'outback.skill.art-or-interest')
    const survival = requireLifeModules(next).pendingAwards.find((award) => award.awardId === 'outback.skill.survival')
    if (!pending || !survival) throw new Error('Outback governed choices were not recorded.')
    const isInterest = outbackSubject.startsWith('Interest/')
    const subject = outbackSubject.replace(/^(Art|Interest)\//, '').trim()
    if (!subject) throw new Error('Choose a valid Outback subject.')
    next = resolvePendingLifeModuleAward(next, pending.id, { type: 'skill', targetId: isInterest ? 'skill.interest' : 'skill.art', displayName: `${isInterest ? 'Interest' : 'Art'}/${subject}`, parameter: { kind: 'subskill', value: subject } })
    next = resolvePendingLifeModuleAward(next, survival.id, { type: 'skill', targetId: 'skill.survival', displayName: `Survival/${survivalSubject.trim()}`, parameter: { kind: 'subskill', value: survivalSubject.trim() } })
  }
  const nextState = requireLifeModules(next)
  const provenanceId = next.lifeModuleHistory.at(-1)?.provenanceIds[0]
  if (!provenanceId) throw new Error('Federated Suns March provenance was not recorded.')
  next.affiliations.push({ affiliationId: FEDERATED_SUNS_OUTBACK_CONTEXT.affiliationId, role: 'birth', provenanceId }, { affiliationId: FEDERATED_SUNS_OUTBACK_CONTEXT.affiliationId, role: 'final', provenanceId })
  nextState.phase = 'stage-1-selection'
  nextState.currentStage = 1
  return next
}

export function previewFederatedSunsCrucisMarch(character: CharacterDefinition, includeSubAffiliation = true): CharacterDefinition {
  const preview = structuredClone(character)
  requireLifeModules(preview).stage0AffiliationContext = FEDERATED_SUNS_CRUCIS_MARCH_ID
  const published = getLifeModule(FEDERATED_SUNS_CRUCIS_MARCH_ID)
  const fixedOnly = { ...published, displayName: includeSubAffiliation ? published.displayName : FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.affiliationName, awards: published.awards.filter((award) => award.kind === 'fixed' && (includeSubAffiliation || !award.id.startsWith('crucis.'))) }
  const next = applyModule(preview, fixedOnly, {})
  const state = requireLifeModules(next)
  state.pendingAwards.push({ id: 'preview-fedsuns-natural-aptitude', moduleId: published.id, awardId: 'fedsuns.trait.natural-aptitude', kind: 'flexible-xp', description: 'Choose Natural Aptitude/Protocol or Natural Aptitude/Strategy.', xpPerGrant: 100, remainingGrants: 1, allocationMode: 'fixed-grants', allowedTargetTypes: ['trait'], source: { ...published.source } })
  if (includeSubAffiliation) state.pendingAwards.push({ id: 'preview-crucis-art', moduleId: published.id, awardId: 'crucis.skill.art', kind: 'any-skill-choice', description: 'Art/Any: choose 1 concrete subskill.', xpPerGrant: 10, remainingGrants: 1, allocationMode: 'fixed-grants', allowedTargetTypes: ['skill'], requiredSkillId: 'skill.art', source: { ...published.source } })
  return next
}

export function applyStage1Module(character: CharacterDefinition, moduleId: typeof BLUE_COLLAR_ID | typeof BACK_WOODS_ID | typeof FARM_ID | typeof WAR_ORPHAN_ID): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-1-selection') throw new Error('A Stage 1 module is not the current legal action.')
  if (![BLUE_COLLAR_ID, BACK_WOODS_ID, FARM_ID, WAR_ORPHAN_ID].includes(moduleId)) throw new Error(`Unknown Alpha Stage 1 module: ${moduleId}`)
  const module = getLifeModule(moduleId)
  const next = applyModule(character, module, {})
  next.chronology.push({ date: 'age:10', eventId: `${module.id}.complete`, provenanceId: next.lifeModuleHistory.at(-1)?.provenanceIds[0] ?? '' })
  return updateLifeModuleProgress(next)
}

export function continueToStage2(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (state.phase !== 'alpha-partial-stop' || state.stopState !== 'alpha-partial-stop') {
    throw new Error('Stage 2 continuation requires a resolved, prerequisite-satisfied Stage 1 Alpha stop.')
  }
  state.phase = 'stage-2-selection'
  state.currentStage = 2
  state.stopState = 'not-eligible'
  next.updatedAt = new Date().toISOString()
  return next
}

export function applyStage2Module(
  character: CharacterDefinition,
  moduleId: typeof STAGE_2_BACK_WOODS_ID | typeof STAGE_2_HIGH_SCHOOL_ID | typeof MILITARY_SCHOOL_ID,
): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-2-selection') throw new Error('A Stage 2 module is not the current legal action.')
  if (![STAGE_2_BACK_WOODS_ID, STAGE_2_HIGH_SCHOOL_ID, MILITARY_SCHOOL_ID].includes(moduleId)) throw new Error(`Unknown Alpha Stage 2 module: ${moduleId}`)
  if (character.lifeModuleHistory.some((entry) => entry.stage === 2)) throw new Error('Exactly one Stage 2 module may be selected.')
  const citizenship = capellanCitizenshipEligibility(character, 2, moduleId)
  if (!citizenship.eligible) throw new Error(citizenship.reason)
  const next = applyModule(character, getLifeModule(moduleId), {})
  next.chronology.push({ date: 'age:16', eventId: `${moduleId}.complete`, provenanceId: next.lifeModuleHistory.at(-1)?.provenanceIds[0] ?? '' })
  return updateLifeModuleProgress(next)
}

export function applyCapellanCivilianJob(
  character: CharacterDefinition,
): CharacterDefinition {
  const transaction = buildLifeModuleTransaction(character, [{ kind: 'grant-capellan-civilian-job', relationId: 'relation.capellan.stage-2-civilian-job-substitution' }])
  const validated = validateLifeModuleTransaction(transaction)
  if (validated.status !== 'validated') throw new Error(validated.errors.map((entry) => entry.message).join(' '))
  return commitLifeModuleTransaction(validated)
}

export function continueToStage3(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (state.phase !== 'alpha-stage-2-stop' || state.stopState !== 'alpha-stage-2-stop') {
    throw new Error('Stage 3 continuation requires a resolved, prerequisite-satisfied Stage 2 Alpha stop.')
  }
  state.phase = 'stage-3-selection'
  state.currentStage = 3
  state.stopState = 'not-eligible'
  next.updatedAt = new Date().toISOString()
  return next
}

export function applyTechnicalCollege(
  character: CharacterDefinition,
  fieldIds: string[] = [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID],
): CharacterDefinition {
  return applyStage3SchoolDefinition(character, TECHNICAL_COLLEGE_ID, fieldIds)
}

export function applyMilitaryAcademy(
  character: CharacterDefinition,
  fieldIds: string[] = [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID],
): CharacterDefinition {
  return applyStage3SchoolDefinition(character, MILITARY_ACADEMY_ID, fieldIds)
}

export function applyMilitaryEnlistment(
  character: CharacterDefinition,
  fieldIds: string[] = [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID],
): CharacterDefinition {
  return applyStage3SchoolDefinition(character, MILITARY_ENLISTMENT_ID, fieldIds)
}

function applyStage3SchoolDefinition(character: CharacterDefinition, moduleId: string, fieldIds: string[], personalDetail?: string, availableYears?: number): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-3-selection') throw new Error('A Stage 3 school is not the current legal action.')
  const preparedCharacter = structuredClone(character)
  if (moduleId === FAMILY_TRAINING_ID) {
    const normalizedHomeworld = normalizeHomeworld(personalDetail ?? preparedCharacter.personalDescription?.homeworld ?? '')
    preparedCharacter.personalDescription ??= { physicalDescription: '', backgroundNotes: '', homeworld: '' }
    preparedCharacter.personalDescription.homeworld = normalizedHomeworld
  }
  if (moduleId === SOLARIS_INTERNSHIP_ID) {
    const residence = normalizeResidence(personalDetail ?? preparedCharacter.personalDescription?.residence ?? '')
    preparedCharacter.personalDescription ??= { physicalDescription: '', backgroundNotes: '', homeworld: '' }
    preparedCharacter.personalDescription.residence = residence
  }
  const publishedSchool = getLifeModule(moduleId)
  if (publishedSchool.stage !== 3 || !publishedSchool.skillFieldSelection) throw new Error(`Unknown Alpha Stage 3 school: ${moduleId}`)
  const eligibility = stage3SchoolEligibility(
    character.lifeModuleHistory.filter((entry) => entry.stage === 3).map((entry) => entry.moduleId),
    moduleId,
    { completedFieldCategories: state.selectedSkillFields.map((grant) => grant.category) },
  )
  if (!eligibility.eligible) throw new Error(eligibility.reason)
  const citizenship = capellanCitizenshipEligibility(character, 3, moduleId)
  if (!citizenship.eligible) throw new Error(citizenship.reason)
  const conditional = publishedSchool.conditionalPriorModuleAwards
  const conditionalApplies = Boolean(conditional && conditional.absentModuleIds.every((id) => !character.lifeModuleHistory.some((entry) => entry.moduleId === id)))
  const school: LifeModuleDefinition = conditionalApplies
    ? { ...publishedSchool, awards: [...conditional!.awards, ...publishedSchool.awards], notes: [...publishedSchool.notes, conditional!.description] }
    : publishedSchool
  validateSchoolFieldSelection(preparedCharacter, school, fieldIds)
  const selections = fieldIds.map((fieldId) => ({ field: getSkillField(fieldId), offer: school.skillFieldSelection!.offers.find((entry) => entry.fieldId === fieldId)! }))
  const fieldCostXp = selections.reduce((total, selection) => total + skillFieldCost(selection.field, selection.offer.costXpPerSkill), 0)
  const totalCostXp = school.costXp + fieldCostXp
  const duration = selections.reduce((total, selection) => total + selection.offer.chronologyYears, 0)
  const durationEligibility = evaluateDurationEligibility(character.chronologyProfile, duration, 3, availableYears)
  if (!durationEligibility.eligible) throw new Error(durationEligibility.reason)
  const next = applyModule(preparedCharacter, school, {}, { totalCostXp, fieldCostXp })
  const selectedAt = next.lifeModuleHistory.at(-1)?.selectedAt ?? new Date().toISOString()
  for (const { field, offer } of selections) {
    const provenanceId = makeId(undefined, `field-${field.id}`)
    next.provenance.push({ id: provenanceId, kind: 'published', description: `${field.displayName} Skill Field grant`, source: { ...field.source } })
    for (const component of field.componentSkills) applyDestinationAward(next, component, offer.awardedXpPerSkill, provenanceId)
    for (const component of field.affiliationBoundComponentSkills ?? []) {
      applyDestinationAward(next, resolveAffiliationBoundLifeModuleDestination(next, component.skillId, component.displayName), offer.awardedXpPerSkill, provenanceId)
    }
    const prerequisiteWaivers = solarisPrerequisiteWaivers(school.id, field.id)
    requireLifeModules(next).selectedSkillFields.push({
      id: makeId(undefined, 'field-grant'),
      schoolModuleId: school.id,
      fieldId: field.id,
      displayName: field.displayName,
      category: offer.category,
      purchaseCostXp: skillFieldCost(field, offer.costXpPerSkill),
      xpPerSkill: offer.awardedXpPerSkill,
      chronologyYears: offer.chronologyYears,
      selectedAt,
      provenanceId,
      source: { ...field.source },
      variableSkillChoices: [],
      prerequisiteSkillChoices: [],
      ...(prerequisiteWaivers.length > 0 ? { prerequisiteWaivers } : {}),
    })
    if (field.relatedSkillPrerequisite) {
      const eligibleSkillKeys = character.skills
        .filter((entry) => entry.level !== null && !entry.displayName?.includes('/Any'))
        .map((entry) => skillKey(entry.address))
      requireLifeModules(next).pendingAwards.push({
        id: makeId(undefined, 'pending-field-prerequisite'),
        moduleId: school.id,
        awardId: `skill-field-prerequisite/${field.id}/${field.relatedSkillPrerequisite.id}`,
        kind: 'related-skill-prerequisite',
        description: `${field.relatedSkillPrerequisite.description}. Select an already possessed concrete Skill; this selection grants no XP.`,
        xpPerGrant: 0,
        remainingGrants: 1,
        allocationMode: 'fixed-grants',
        allowedTargetTypes: ['skill'],
        skillFieldPrerequisiteChoice: { fieldId: field.id, prerequisiteId: field.relatedSkillPrerequisite.id, eligibleSkillKeys },
        source: { ...field.source },
      })
    }
    for (const component of field.variableComponentSkills ?? []) {
      requireLifeModules(next).pendingAwards.push({
        id: makeId(undefined, 'pending-field-skill'),
        moduleId: school.id,
        awardId: `skill-field/${field.id}/${component.id}`,
        kind: 'any-skill-choice',
        description: component.inputMode === 'open-subject'
          ? `${component.displayName}: enter one open, GM-defined subject.`
          : `${component.displayName}: choose one governed subskill.`,
        xpPerGrant: offer.awardedXpPerSkill,
        remainingGrants: 1,
        allocationMode: 'fixed-grants',
        allowedTargetTypes: ['skill'],
        requiredSkillId: component.skillId,
        skillFieldChoice: { fieldId: field.id, componentId: component.id },
        source: { ...field.source },
      })
    }
  }
  next.xp.creation.allocated = calculateLedgerXp(next)
  const age = 16 + requireLifeModules(next).selectedSkillFields.reduce((total, grant) => total + grant.chronologyYears, 0)
  next.chronology.push({ date: `age:${age}`, eventId: `${school.id}.complete`, provenanceId: next.lifeModuleHistory.at(-1)?.provenanceIds[0] ?? '' })
  return updateLifeModuleProgress(next)
}

export function applyStage3School(character: CharacterDefinition, moduleId: string, fieldIds: string[], personalDetail?: string, availableYears?: number): CharacterDefinition {
  if (![TECHNICAL_COLLEGE_ID, TRADE_SCHOOL_ID, UNIVERSITY_ID, SOLARIS_INTERNSHIP_ID, POLICE_ACADEMY_ID, INTELLIGENCE_OPERATIVE_TRAINING_ID, MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID, FAMILY_TRAINING_ID, OFFICER_TRAINING_SCHOOL_ID].includes(moduleId)) throw new Error(`Unknown Alpha Stage 3 school: ${moduleId}`)
  return applyStage3SchoolDefinition(character, moduleId, fieldIds, personalDetail, availableYears)
}

export function continueStage3Schooling(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (state.phase !== 'alpha-stage-3-stop' || state.stopState !== 'alpha-stage-3-stop') {
    throw new Error('Additional Stage 3 schooling requires a resolved, prerequisite-satisfied Stage 3 Alpha stop.')
  }
  const completed = next.lifeModuleHistory.filter((entry) => entry.stage === 3).map((entry) => entry.moduleId)
  const implementedSchools = [TECHNICAL_COLLEGE_ID, TRADE_SCHOOL_ID, UNIVERSITY_ID, SOLARIS_INTERNSHIP_ID, POLICE_ACADEMY_ID, INTELLIGENCE_OPERATIVE_TRAINING_ID, MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID, FAMILY_TRAINING_ID, OFFICER_TRAINING_SCHOOL_ID]
  const completedFieldCategories = state.selectedSkillFields.map((grant) => grant.category)
  if (!implementedSchools.some((moduleId) => stage3SchoolEligibility(completed, moduleId, { completedFieldCategories }).eligible)) {
    throw new Error('No additional implemented Stage 3 school family is available.')
  }
  state.phase = 'stage-3-selection'
  state.currentStage = 3
  state.stopState = 'not-eligible'
  next.updatedAt = new Date().toISOString()
  return next
}

export function continueToStage4(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (state.phase !== 'alpha-stage-3-stop' || state.stopState !== 'alpha-stage-3-stop') {
    throw new Error('Stage 4 continuation requires a resolved, prerequisite-satisfied Stage 3 Alpha stop.')
  }
  state.phase = 'stage-4-selection'
  state.currentStage = 4
  state.stopState = 'not-eligible'
  next.updatedAt = new Date().toISOString()
  return next
}

export function applyAgitator(character: CharacterDefinition, availableYears?: number): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-4-selection') throw new Error('A Stage 4 module is not the current legal action.')
  if (character.lifeModuleHistory.some((entry) => entry.moduleId === AGITATOR_ID)) {
    throw new Error('Repeated Agitator modules remain deferred.')
  }
  const module = getLifeModule(AGITATOR_ID)
  const durationEligibility = evaluateDurationEligibility(character.chronologyProfile, module.chronologyYears ?? 0, 4, availableYears)
  if (!durationEligibility.eligible) throw new Error(durationEligibility.reason)
  const next = applyModule(character, module, {})
  if (durationEligibility.partial) {
    const history = next.lifeModuleHistory.at(-1)!
    history.actualDurationYears = durationEligibility.availableYears
    history.partialDurationReason = 'campaign-deadline'
    requireLifeModules(next).phase = 'alpha-stage-4-stop'
    requireLifeModules(next).stopState = 'alpha-stage-4-stop'
  }
  const stage3Years = requireLifeModules(next).selectedSkillFields.reduce((total, grant) => total + grant.chronologyYears, 0)
  const stage4Years = next.lifeModuleHistory
    .filter((entry) => entry.stage === 4)
    .reduce((total, entry) => total + (entry.chronologyYears ?? 0), 0)
  const age = 16 + stage3Years + stage4Years
  next.chronology.push({ date: `age:${age}`, eventId: `${module.id}.complete`, provenanceId: next.lifeModuleHistory.at(-1)?.provenanceIds[0] ?? '' })
  return updateLifeModuleProgress(next)
}

export function applyStage4Module(character: CharacterDefinition, moduleId: string, availableYears?: number): CharacterDefinition {
  if (moduleId === AGITATOR_ID) return applyAgitator(character, availableYears)
  if (moduleId === TRAVEL_ID) return applyGenericStage4(character, TRAVEL_ID, availableYears)
  if (moduleId !== COMSTAR_WOB_SERVICE_ID) throw new Error(`Unknown Alpha Stage 4 module: ${moduleId}`)
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-4-selection') throw new Error('A Stage 4 module is not the current legal action.')
  const order = state.orderAffiliation
  if (order !== 'comstar' && order !== 'word-of-blake') throw new Error('ComStar/Word of Blake Service requires a committed ComStar or Word of Blake affiliation.')
  const published = getLifeModule(COMSTAR_WOB_SERVICE_ID)
  const durationEligibility = evaluateDurationEligibility(character.chronologyProfile, published.chronologyYears ?? 0, 4, availableYears)
  if (!durationEligibility.eligible) throw new Error(durationEligibility.reason)
  const repeat = character.lifeModuleHistory.some((entry) => entry.moduleId === COMSTAR_WOB_SERVICE_ID)
  const acquiredFieldProvenance = new Set(state.selectedSkillFields.map((field) => field.provenanceId))
  const fieldSkillKeys = [...new Set(character.skills.filter((entry) => entry.sourceAwards.some((award) => acquiredFieldProvenance.has(award.provenanceId))).map((entry) => `${entry.address.skillId}/${entry.address.parameter?.value ?? ''}`))]
  const module: LifeModuleDefinition = {
    ...published,
    awards: published.awards
      .filter((award) => {
        if (award.id === 'service.shared.skill.protocol-comstar') return order === 'comstar'
        if (award.id === 'service.shared.skill.protocol-wob') return order === 'word-of-blake'
        if (award.id.startsWith('service.comstar.') && order !== 'comstar') return false
        if (award.id.startsWith('service.wob.') && order !== 'word-of-blake') return false
        if (!repeat) return true
        return award.kind === 'fixed' ? award.destination.type === 'skill' : award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice' || award.kind === 'modeled-skill-choice' || (award.kind === 'flexible-xp' && award.allocationMode === 'pool')
      })
      .map((award) => award.id === 'service.branch.skills.any-four' && award.kind === 'modeled-skill-choice' && fieldSkillKeys.length > 0 ? { ...award, allowedDestinationKeys: fieldSkillKeys } : award),
  }
  const next = applyModule(character, module, {}, { allowRepeat: repeat })
  if (durationEligibility.partial) {
    const history = next.lifeModuleHistory.at(-1)!
    history.actualDurationYears = durationEligibility.availableYears
    history.partialDurationReason = 'campaign-deadline'
    requireLifeModules(next).phase = 'alpha-stage-4-stop'
    requireLifeModules(next).stopState = 'alpha-stage-4-stop'
  }
  const years = next.lifeModuleHistory.filter((entry) => entry.stage === 3 || entry.stage === 4).reduce((total, entry) => total + (entry.chronologyYears ?? 0), 0)
  next.chronology.push({ date: `age:${16 + years}`, eventId: `${module.id}.complete`, provenanceId: next.lifeModuleHistory.at(-1)?.provenanceIds[0] ?? '' })
  return updateLifeModuleProgress(next)
}

function applyGenericStage4(character: CharacterDefinition, moduleId: string, availableYears?: number): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-4-selection') throw new Error('A Stage 4 module is not the current legal action.')
  const module = getLifeModule(moduleId)
  const durationEligibility = evaluateDurationEligibility(character.chronologyProfile, module.chronologyYears ?? 0, 4, availableYears)
  if (!durationEligibility.eligible) throw new Error(durationEligibility.reason)
  const repeat = character.lifeModuleHistory.some((entry) => entry.moduleId === moduleId)
  const next = applyModule(character, module, {}, { allowRepeat: repeat })
  if (durationEligibility.partial) {
    const history = next.lifeModuleHistory.at(-1)!
    history.actualDurationYears = durationEligibility.availableYears
    history.partialDurationReason = 'campaign-deadline'
    requireLifeModules(next).phase = 'alpha-stage-4-stop'
    requireLifeModules(next).stopState = 'alpha-stage-4-stop'
  }
  const years = next.lifeModuleHistory.filter((entry) => entry.stage === 3 || entry.stage === 4).reduce((total, entry) => total + (entry.chronologyYears ?? 0), 0)
  next.chronology.push({ date: `age:${16 + years}`, eventId: `${module.id}.complete`, provenanceId: next.lifeModuleHistory.at(-1)?.provenanceIds[0] ?? '' })
  return updateLifeModuleProgress(next)
}

export function continueStage4Modules(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (state.phase !== 'alpha-stage-4-stop' || state.pendingAwards.length > 0) throw new Error('Another Stage 4 module requires a resolved Stage 4 stop.')
  state.phase = 'stage-4-selection'; state.stopState = 'not-eligible'; state.currentStage = 4
  return next
}

export function resolvePendingLifeModuleAward(
  character: CharacterDefinition,
  pendingAwardId: string,
  destination: ResolvedLifeModuleDestination,
  xpAmount?: number,
): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  const pendingIndex = state.pendingAwards.findIndex((entry) => entry.id === pendingAwardId)
  if (pendingIndex < 0) throw new Error(`Unknown pending Life Module award: ${pendingAwardId}`)
  const pending = state.pendingAwards[pendingIndex]
  const openSubject = pendingOpenSubject(pending)
  const outbackArtOrInterest = pending.awardId === 'outback.skill.art-or-interest'
  const normalized = openSubject && !outbackArtOrInterest
    ? openSkillSubjectDestination(openSubject.skillId, destination.parameter?.value ?? '')
    : normalizeResolvedDestination(destination)
  validateResolutionDestination(next, pending, normalized)
  const destinationKey = resolvedDestinationKey(normalized)
  const isPool = pending.allocationMode === 'pool'
  const duplicate = state.resolvedAwards.some((entry) => (!pending.provenanceId || entry.provenanceId === pending.provenanceId) && entry.moduleId === pending.moduleId && entry.awardId === pending.awardId && resolvedDestinationKey(entry.destination) === destinationKey)
  if (duplicate && !isPool) throw new Error('This destination has already been selected for the pending award.')
  const appliedXp = isPool ? xpAmount : pending.xpPerGrant
  if (isPool && (!Number.isInteger(appliedXp) || appliedXp === 0)) throw new Error('Flexible pool allocations require a non-zero whole XP amount.')
  if (!isPool && xpAmount !== undefined && xpAmount !== pending.xpPerGrant) throw new Error('Fixed grants must use their published XP amount.')
  if (isPool) {
    const allocationMagnitude = Math.abs(appliedXp!)
    if (allocationMagnitude > (pending.remainingXp ?? 0)) throw new Error('Flexible allocation exceeds the remaining award XP.')
    const cap = pending.maxXpPerTarget?.[normalized.type]
    const alreadyAllocated = state.resolvedAwards
      .filter((entry) => (!pending.provenanceId || entry.provenanceId === pending.provenanceId) && entry.moduleId === pending.moduleId && entry.awardId === pending.awardId && resolvedDestinationKey(entry.destination) === destinationKey)
      .reduce((total, entry) => total + Math.abs(entry.xp), 0)
    if (cap !== undefined && alreadyAllocated + allocationMagnitude > cap) throw new Error(`This flexible award may allocate no more than ${cap} XP to one ${normalized.type}.`)
  }
  const moduleHistory = [...next.lifeModuleHistory].reverse().find((entry) => entry.moduleId === pending.moduleId && (!pending.provenanceId || entry.provenanceIds.includes(pending.provenanceId)))
  const fieldGrant = pending.skillFieldChoice
    ? state.selectedSkillFields.find((entry) => entry.schoolModuleId === pending.moduleId && entry.fieldId === pending.skillFieldChoice!.fieldId)
    : pending.skillFieldPrerequisiteChoice
      ? state.selectedSkillFields.find((entry) => entry.schoolModuleId === pending.moduleId && entry.fieldId === pending.skillFieldPrerequisiteChoice!.fieldId)
    : undefined
  if (pending.skillFieldChoice && fieldGrant?.variableSkillChoices?.some((choice) => resolvedDestinationKey(choice.destination) === destinationKey)) {
    throw new Error('Each variable component in a Skill Field must use a distinct concrete destination.')
  }
  const provenanceId = fieldGrant?.provenanceId ?? pending.provenanceId ?? moduleHistory?.provenanceIds[0]
  if (!provenanceId) throw new Error('Pending award module provenance is missing.')
  const ledgerDestination = toLifeModuleDestination(normalized)
  if (pending.kind !== 'related-skill-prerequisite') applyDestinationAward(next, ledgerDestination, appliedXp!, provenanceId)
  if (pending.skillFieldPrerequisiteChoice) {
    if (!fieldGrant) throw new Error('Pending Field prerequisite choice has no matching durable Field grant.')
    fieldGrant.prerequisiteSkillChoices ??= []
    fieldGrant.prerequisiteSkillChoices = fieldGrant.prerequisiteSkillChoices.filter((entry) => entry.prerequisiteId !== pending.skillFieldPrerequisiteChoice!.prerequisiteId)
    fieldGrant.prerequisiteSkillChoices.push({
      prerequisiteId: pending.skillFieldPrerequisiteChoice.prerequisiteId,
      destination: structuredClone(normalized),
      gmApprovalRequired: true,
    })
  } else if (pending.skillFieldChoice) {
    if (!fieldGrant) throw new Error('Pending Field-Skill choice has no matching durable Field grant.')
    fieldGrant.variableSkillChoices ??= []
    fieldGrant.variableSkillChoices.push({ componentId: pending.skillFieldChoice.componentId, destination: structuredClone(normalized) })
  } else {
    recordResolvedAward(state.resolvedAwards, pending, normalized, provenanceId, appliedXp!)
    next.creation.resolvedChoiceIds.push(`${pending.moduleId}/${pending.awardId}/${destinationKey}/${appliedXp}`)
  }
  if (isPool) {
    pending.remainingXp = (pending.remainingXp ?? 0) - Math.abs(appliedXp!)
    if (pending.remainingXp === 0) state.pendingAwards.splice(pendingIndex, 1)
  } else {
    pending.remainingGrants -= 1
    if (pending.remainingGrants === 0) state.pendingAwards.splice(pendingIndex, 1)
  }
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.updatedAt = new Date().toISOString()
  return updateLifeModuleProgress(next)
}

function applyModule(
  character: CharacterDefinition,
  module: LifeModuleDefinition,
  resolutions: Record<string, LifeModuleDestination>,
  options: { totalCostXp?: number; fieldCostXp?: number; allowRepeat?: boolean; appliedStage?: 0 | 1 | 2 | 3 | 4; sourceRelationId?: string; actualDurationYears?: number; partialDurationReason?: 'campaign-deadline' | 'capellan-substitution'; awardSource?: (awardId: string) => SourceCitation | undefined } = {},
): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (state.selectedModuleIds.includes(module.id) && !options.allowRepeat) throw new Error(`Life Module already selected: ${module.id}`)
  const totalCostXp = options.totalCostXp ?? module.costXp
  if (state.moduleXp.remaining < totalCostXp) throw new RangeError(`Selecting ${module.displayName} would overspend the Life Module XP pool.`)
  const selectedAt = new Date().toISOString()
  const provenanceId = makeId(undefined, `module-${module.id}`)
  const provenance: ProvenanceRecord = { id: provenanceId, kind: 'published', description: `${module.displayName} module awards`, source: { ...module.source } }
  next.provenance.push(provenance)
  const provenanceIds = new Set([provenanceId])
  const awardProvenanceId = (awardId: string) => {
    const source = options.awardSource?.(awardId)
    if (!source) return provenanceId
    const id = makeId(undefined, `award-source-${source.ruleId}`)
    if (!provenanceIds.has(id)) {
      next.provenance.push({ id, kind: 'published', description: `${module.displayName} ${source.ruleId} awards`, source: { ...source } })
      provenanceIds.add(id)
    }
    return id
  }

  for (const award of module.awards) {
    const awardProvenance = awardProvenanceId(award.id)
    const requiredGrants = awardGrantCount(award)
    if (requiredGrants !== null) state.choiceGrantRequirements.push({
      moduleId: module.id,
      ...(module.repeatPolicy?.sameModuleRepeat === 'allowed' ? { provenanceId } : {}),
      awardId: award.id,
      requiredGrants,
      ...(award.kind === 'flexible-xp' && award.allocationMode === 'pool' ? { requiredXp: award.totalXp, allocationMode: 'pool' as const } : {}),
    })
    if (award.kind === 'fixed') applyDestinationAward(next, award.id === 'family-training.skill.homeworld-history' ? homeworldHistoryDestination(next) : award.destination, award.xp, awardProvenance)
    else if (award.kind === 'affiliation-bound-skill') applyDestinationAward(next, resolveAffiliationBoundLifeModuleDestination(next, award.skillId, award.displayName), award.xp, awardProvenance)
    else if (award.kind === 'language-choice' && resolutions[award.id]) {
      applyDestinationAward(next, resolutions[award.id], award.xp, awardProvenance)
      const pendingShape = pendingAwardFrom(module, award, module.repeatPolicy?.sameModuleRepeat === 'allowed' ? provenanceId : undefined)
      const resolved = fromLifeModuleDestination(resolutions[award.id])
      recordResolvedAward(state.resolvedAwards, pendingShape, resolved, provenanceId)
      next.creation.resolvedChoiceIds.push(`${module.id}/${award.id}/${resolvedDestinationKey(resolved)}`)
    }
    else addPendingAward(state.pendingAwards, module, award, module.repeatPolicy?.sameModuleRepeat === 'allowed' ? provenanceId : undefined)
  }
  state.moduleXp.spent += totalCostXp
  state.moduleXp.remaining -= totalCostXp
  state.selectedModuleIds.push(module.id)
  next.xp.creation.remaining = state.moduleXp.remaining
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.lifeModuleHistory.push({
    moduleId: module.id,
    displayName: module.displayName,
    stage: options.appliedStage ?? module.stage,
    costXp: totalCostXp,
    ...(options.totalCostXp !== undefined ? { baseCostXp: module.costXp, fieldCostXp: options.fieldCostXp ?? 0 } : {}),
    ...(module.chronologyYears !== undefined ? { chronologyYears: module.chronologyYears } : {}),
    ...(options.actualDurationYears !== undefined ? { actualDurationYears: options.actualDurationYears } : {}),
    ...(options.partialDurationReason ? { partialDurationReason: options.partialDurationReason } : {}),
    ...(options.sourceRelationId ? { sourceRelationId: options.sourceRelationId } : {}),
    ...(module.repeatPolicy ? { repeatPolicy: structuredClone(module.repeatPolicy) } : {}),
    selectedAt,
      provenanceIds: [...provenanceIds],
    source: { ...module.source },
    notes: [...module.notes, ...module.deferredRules],
  })
  state.prerequisiteIssues.push(...module.prerequisites.map((entry) => evaluatePrerequisite(next, module.id, entry)))
  next.updatedAt = selectedAt
  return next
}

function validateSchoolFieldSelection(character: CharacterDefinition, school: LifeModuleDefinition, fieldIds: string[]): void {
  const policy = school.skillFieldSelection
  if (!policy) throw new Error(`${school.displayName} has no Skill Field selection policy.`)
  if (new Set(fieldIds).size !== fieldIds.length) throw new Error('Skill Fields may not be selected more than once.')
  const acquiredFieldIds = new Set(requireLifeModules(character).selectedSkillFields.map((grant) => grant.fieldId))
  const repeatedFieldId = fieldIds.find((fieldId) => acquiredFieldIds.has(fieldId))
  if (repeatedFieldId) throw new Error(`Skill Field ${repeatedFieldId} has already been acquired.`)
  const offered = new Map(policy.offers.map((entry) => [entry.fieldId, entry]))
  const selections = fieldIds.map((fieldId) => {
    const offer = offered.get(fieldId)
    if (!offer) throw new Error(`Skill Field ${fieldId} is not offered by ${school.displayName}.`)
    return { field: getSkillField(fieldId), offer }
  })
  const basicCount = selections.filter((entry) => entry.offer.category === 'basic').length
  const advancedCount = selections.filter((entry) => entry.offer.category === 'advanced').length
  const specialCount = selections.filter((entry) => entry.offer.category === 'special').length
  if (basicCount !== policy.exactlyBasic) throw new Error(`${school.displayName} requires exactly one Basic Skill Field.`)
  if (advancedCount < policy.minimumAdvanced) throw new Error(`${school.displayName} requires at least one Advanced Skill Field.`)
  if (selections.length > policy.maximumTotal) throw new Error(`${school.displayName} permits no more than ${policy.maximumTotal} Skill Fields.`)
  if (specialCount > 0 && advancedCount === 0) throw new Error('Special Skill Fields require at least one Advanced Skill Field.')
}

function awardGrantCount(award: LifeModuleAward): number | null {
  if (award.kind === 'language-choice' || award.kind === 'affiliation-skill-choice') return 1
  if (award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice' || award.kind === 'modeled-skill-choice') return award.count
  if (award.kind === 'flexible-xp') return award.allocationMode === 'pool' ? 0 : award.count
  return null
}

export function resolveAffiliationBoundLifeModuleDestination(
  character: CharacterDefinition,
  skillId: 'skill.language' | 'skill.protocol' | 'skill.streetwise',
  displayName: string,
): Extract<LifeModuleDestination, { type: 'skill' }> {
  const finalAffiliation = [...character.affiliations].reverse().find((entry) => entry.role === 'final')
  if (!finalAffiliation) throw new Error(`${displayName} requires an established final affiliation.`)
  const context = getLifeModuleAffiliationContextByAffiliationId(finalAffiliation.affiliationId)
  if (!context) throw new Error(`${displayName} cannot be resolved for unsupported affiliation ${finalAffiliation.affiliationId}.`)
  const parameter = skillId === 'skill.language'
    ? requireLifeModules(character).affiliationLanguage
    : skillId === 'skill.streetwise'
      ? context.streetwiseContextLabel
      : context.protocolContextLabel
  if (!parameter) throw new Error(`${displayName} requires an established affiliation language.`)
  return {
    type: 'skill',
    address: { skillId, parameter: { kind: 'subskill', value: parameter } },
    displayName: `${displayName.split('/')[0]}/${parameter}`,
  }
}

function applyDestinationAward(character: CharacterDefinition, destination: LifeModuleDestination, xp: number, provenanceId: string): void {
  const sourceAward: XpAward = { id: makeId(undefined, 'award'), xp, provenanceId }
  if (destination.type === 'attribute') {
    let entry = character.attributes.find((item) => item.attributeId === destination.attributeId)
    if (!entry) {
      entry = { attributeId: destination.attributeId, accumulatedXp: 0, purchasedLevel: null, phenotypeModifier: 0, sourceAwards: [] }
      character.attributes.push(entry)
    }
    entry.accumulatedXp += xp
    entry.purchasedLevel = entry.accumulatedXp >= 0 ? Math.floor(entry.accumulatedXp / 100) : null
    entry.sourceAwards.push(sourceAward)
    return
  }
  if (destination.type === 'trait') {
    const key = JSON.stringify(destination.parameters ?? {})
    let entry = character.traits.find((item) => item.traitId === destination.traitId && JSON.stringify(item.parameters) === key)
    if (!entry) {
      entry = { traitId: destination.traitId, displayName: destination.displayName, accumulatedXp: 0, attainedTp: null, active: false, parameters: destination.parameters ?? {}, sourceAwards: [] }
      character.traits.push(entry)
    }
    entry.accumulatedXp += xp
    const attained = entry.traitId === 'trait.citizenship'
      ? (entry.accumulatedXp >= 50 ? 1 : 0)
      : entry.traitId === 'trait.exceptional-attribute' && entry.accumulatedXp < 200 ? 0 : Math.trunc(entry.accumulatedXp / 100)
    entry.attainedTp = attained === 0 ? null : attained
    entry.active = attained !== 0
    entry.sourceAwards.push(sourceAward)
    return
  }
  const key = skillKey(destination.address)
  let entry = character.skills.find((item) => skillKey(item.address) === key)
  if (!entry) {
    entry = { address: structuredClone(destination.address), displayName: destination.displayName, accumulatedXp: 0, level: null, sourceAwards: [] }
    character.skills.push(entry)
  }
  entry.accumulatedXp += xp
  entry.level = attainedSkillLevel(entry.accumulatedXp)
  entry.sourceAwards.push(sourceAward)
}

function addPendingAward(pending: PendingLifeModuleAward[], module: LifeModuleDefinition, award: Exclude<LifeModuleAward, { kind: 'fixed' }>, provenanceId?: string): void {
  if (award.kind === 'affiliation-bound-skill') throw new Error('Affiliation-bound awards must resolve automatically from the established final affiliation.')
  if (award.kind === 'choice-package' || award.kind === 'conditional' || award.kind === 'field-grant') {
    throw new Error(`Award type ${award.kind} is modeled but not supported by the Alpha Slice 9 engine.`)
  }
  pending.push(pendingAwardFrom(module, award, provenanceId))
}

function pendingAwardFrom(module: LifeModuleDefinition, award: Exclude<LifeModuleAward, { kind: 'fixed' | 'affiliation-bound-skill' | 'choice-package' | 'conditional' | 'field-grant' }>, provenanceId?: string): PendingLifeModuleAward {
  const kind = award.kind
  const isPool = kind === 'flexible-xp' && award.allocationMode === 'pool'
  const xpPerGrant = kind === 'flexible-xp' ? (isPool ? 0 : award.xpPerGrant) : award.xp
  const remainingGrants = kind === 'flexible-xp' ? (isPool ? 0 : award.count) : kind === 'language-choice' || kind === 'affiliation-skill-choice' ? 1 : award.count
  const allowedTargetTypes = kind === 'flexible-xp' ? award.allowedTargetTypes : ['skill' as const]
  return {
    id: makeId(undefined, 'pending-award'), moduleId: module.id, ...(provenanceId ? { provenanceId } : {}), awardId: award.id, kind,
    description: kind === 'language-choice' || kind === 'affiliation-skill-choice' ? award.description : kind === 'flexible-xp' ? (isPool ? `Allocate ${award.totalXp} flexible XP under its source restrictions.` : `Allocate ${remainingGrants} grants of ${xpPerGrant} XP.`) : `${award.displayName}: choose ${remainingGrants} concrete subskill${remainingGrants === 1 ? '' : 's'}.`,
    xpPerGrant,
    remainingGrants,
    ...(isPool ? { allocationMode: 'pool' as const, remainingXp: award.totalXp, ...(award.maxXpPerTarget ? { maxXpPerTarget: { ...award.maxXpPerTarget } } : {}) } : { allocationMode: 'fixed-grants' as const }),
    allowedTargetTypes: [...allowedTargetTypes],
    ...(kind === 'flexible-xp' && !isPool && award.excludedTargetIds ? { excludedTargetIds: [...award.excludedTargetIds] } : {}),
    ...(kind === 'flexible-xp' && !isPool && award.allowedTargetIds ? { allowedTargetIds: [...award.allowedTargetIds] } : {}),
    ...(kind === 'modeled-skill-choice' ? { distinctDestinations: award.distinct, ...(award.allowedDestinationKeys ? { allowedDestinationKeys: [...award.allowedDestinationKeys] } : {}) } : {}),
    ...(kind === 'language-choice' ? { choiceSource: award.choicesFrom, requiredSkillId: 'skill.language' } : {}),
    ...(kind === 'affiliation-skill-choice' || kind === 'any-skill-choice' || kind === 'multi-skill-choice' ? { requiredSkillId: award.skillId } : {}),
    source: { ...module.source },
  }
}

function updateLifeModuleProgress(character: CharacterDefinition): CharacterDefinition {
  const state = requireLifeModules(character)
  reevaluateLifeModulePrerequisites(character)
  const hasStage1 = character.lifeModuleHistory.some((entry) => entry.stage === 1)
  if (!hasStage1) return character
  const hasStage2 = character.lifeModuleHistory.some((entry) => entry.stage === 2)
  const hasStage3 = character.lifeModuleHistory.some((entry) => entry.stage === 3)
  const hasStage4 = character.lifeModuleHistory.some((entry) => entry.stage === 4)
  state.currentStage = hasStage4 ? 4 : hasStage3 ? 3 : hasStage2 ? 2 : 1
  state.stopState = 'not-eligible'
  if (state.pendingAwards.length > 0) {
    state.phase = hasStage4 ? 'stage-4-resolution' : hasStage3 ? 'stage-3-resolution' : hasStage2 ? 'stage-2-resolution' : 'stage-1-resolution'
  } else if (hasStage4) {
    state.phase = 'alpha-stage-4-stop'
    state.stopState = 'alpha-stage-4-stop'
  } else if (hasStage3) {
    state.phase = 'alpha-stage-3-stop'
    state.stopState = 'alpha-stage-3-stop'
  } else if (hasStage2) {
    state.phase = 'alpha-stage-2-stop'
    state.stopState = 'alpha-stage-2-stop'
  } else {
    state.phase = 'alpha-partial-stop'
    state.stopState = 'alpha-partial-stop'
  }
  return character
}

export function reevaluateLifeModulePrerequisites(character: CharacterDefinition): CharacterDefinition {
  const state = requireLifeModules(character)
  const moduleIssues: LifeModulePrerequisiteIssue[] = state.selectedModuleIds.filter((moduleId) => !moduleId.startsWith('stage0.clan-package.') && !moduleId.startsWith('stage0.clan-sub-affiliation.')).flatMap((moduleId) => {
    const module = getLifeModule(moduleId)
    return module.prerequisites.map((entry) => evaluatePrerequisite(character, moduleId, entry, state.prerequisiteIssues))
  })
  const fieldIssues: LifeModulePrerequisiteIssue[] = state.selectedSkillFields.flatMap((grant) => {
    const field = getSkillField(grant.fieldId)
    const ordinary = field.prerequisites.map((entry) => {
      const issue = evaluatePrerequisite(character, grant.fieldId, entry, state.prerequisiteIssues)
      const waiver = grant.prerequisiteWaivers?.find((candidate) => candidate.prerequisiteId === entry.id)
      return waiver && issue.status === 'outstanding' ? { ...issue, description: `${entry.description} — waived only for this Solaris Internship Field acquisition`, status: 'waived' as const } : issue
    })
    if (!field.relatedSkillPrerequisite) return ordinary
    const selected = grant.prerequisiteSkillChoices?.find((entry) => entry.prerequisiteId === field.relatedSkillPrerequisite?.id)
    const selectedSkillKey = selected?.destination.type === 'skill'
      ? `${selected.destination.targetId}/${selected.destination.parameter?.kind ?? ''}/${selected.destination.parameter?.value.toLowerCase() ?? ''}`
      : null
    const satisfied = Boolean(selectedSkillKey && character.skills.some((entry) => entry.level !== null && skillKey(entry.address) === selectedSkillKey))
    return [...ordinary, {
      id: `${grant.fieldId}/${field.relatedSkillPrerequisite.id}`,
      moduleId: grant.fieldId,
      prerequisiteId: field.relatedSkillPrerequisite.id,
      description: selected ? `${field.relatedSkillPrerequisite.description}: ${selected.destination.displayName}` : field.relatedSkillPrerequisite.description,
      status: satisfied ? 'satisfied' as const : 'outstanding' as const,
      finalValidationRequired: true,
    }]
  })
  state.prerequisiteIssues = [...moduleIssues, ...fieldIssues]
  return character
}

function evaluatePrerequisite(
  character: CharacterDefinition,
  moduleId: string,
  prerequisite: LifeModulePrerequisite,
  existing: LifeModulePrerequisiteIssue[] = [],
) {
  const prior = existing.find((entry) => entry.moduleId === moduleId && entry.prerequisiteId === prerequisite.id)
  if (prior?.status === 'gm-override') {
    return { id: `${moduleId}/${prerequisite.id}`, moduleId, prerequisiteId: prerequisite.id, description: prerequisite.description, status: 'gm-override' as const, finalValidationRequired: true }
  }
  let satisfied = false
  if (prerequisite.kind === 'phenotype') satisfied = character.phenotypeId === prerequisite.phenotypeId
  if (prerequisite.kind === 'clan-caste') satisfied = character.clanCaste?.id === prerequisite.casteId
  if (prerequisite.kind === 'path' && prerequisite.id === 'watch.caste' && moduleId === CLAN_WATCH_OPERATIVE_ID) satisfied = ['warrior', 'scientist', 'technician'].includes(character.clanCaste?.id ?? '')
  if (prerequisite.kind === 'birth-origin') satisfied = character.clanBirthOrigin?.id === prerequisite.birthOrigin
  if (prerequisite.kind === 'affiliation') {
    satisfied = prerequisite.affiliationId
      ? character.affiliations.some((entry) => entry.affiliationId === prerequisite.affiliationId)
      : character.affiliations.length > 0
    if (satisfied && prerequisite.classification === 'non-clan') satisfied = character.affiliations.every((entry) => !entry.affiliationId.startsWith('affiliation.clan'))
  }
  if (prerequisite.kind === 'attribute-minimum') satisfied = attributeLegality(character, prerequisite.attributeId).effectiveScore >= prerequisite.minimum
  if (prerequisite.kind === 'trait') satisfied = character.traits.some((item) => item.traitId === prerequisite.traitId && item.active)
  if (prerequisite.kind === 'trait-minimum') satisfied = character.traits.some((item) => item.traitId === prerequisite.traitId && (item.attainedTp ?? 0) >= prerequisite.minimum)
  if (prerequisite.kind === 'trait-absent') satisfied = !character.traits.some((item) => item.traitId === prerequisite.traitId && item.active)
  if (prerequisite.kind === 'trait-level-maximum') satisfied = !character.traits.some((item) => item.traitId === prerequisite.traitId && Math.abs(item.attainedTp ?? 0) > prerequisite.maximumMagnitude)
  if (prerequisite.kind === 'skill-field') satisfied = prerequisite.fieldIds.some((fieldId) => character.creation.lifeModules?.selectedSkillFields.some((grant) => grant.fieldId === fieldId))
  if (prerequisite.kind === 'module-history') satisfied = prerequisite.moduleIds.some((moduleId) => character.lifeModuleHistory.some((entry) => entry.moduleId === moduleId))
  if (prerequisite.kind === 'residence') satisfied = normalizeComparableLocation(character.personalDescription?.residence) === normalizeComparableLocation(prerequisite.location)
  if (prerequisite.kind === 'any-of') satisfied = prerequisite.options.some((option) => prerequisiteSatisfied(character, option))
  return {
    id: `${moduleId}/${prerequisite.id}`,
    moduleId,
    prerequisiteId: prerequisite.id,
    description: prerequisite.description,
    status: satisfied ? 'satisfied' as const : 'outstanding' as const,
    finalValidationRequired: true,
  }
}

function prerequisiteSatisfied(character: CharacterDefinition, prerequisite: Exclude<LifeModulePrerequisite, { kind: 'any-of' }>): boolean {
  if (prerequisite.kind === 'phenotype') return character.phenotypeId === prerequisite.phenotypeId
  if (prerequisite.kind === 'clan-caste') return character.clanCaste?.id === prerequisite.casteId
  if (prerequisite.kind === 'path' && prerequisite.id === 'watch.caste') return ['warrior', 'scientist', 'technician'].includes(character.clanCaste?.id ?? '')
  if (prerequisite.kind === 'birth-origin') return character.clanBirthOrigin?.id === prerequisite.birthOrigin
  if (prerequisite.kind === 'affiliation') {
    const matchesIdentity = prerequisite.affiliationId
      ? character.affiliations.some((entry) => entry.affiliationId === prerequisite.affiliationId)
      : character.affiliations.length > 0
    return matchesIdentity && (prerequisite.classification !== 'non-clan' || character.affiliations.every((entry) => !entry.affiliationId.startsWith('affiliation.clan')))
  }
  if (prerequisite.kind === 'attribute-minimum') return attributeLegality(character, prerequisite.attributeId).effectiveScore >= prerequisite.minimum
  if (prerequisite.kind === 'trait') return character.traits.some((entry) => entry.traitId === prerequisite.traitId && entry.active)
  if (prerequisite.kind === 'trait-minimum') return character.traits.some((entry) => entry.traitId === prerequisite.traitId && (entry.attainedTp ?? 0) >= prerequisite.minimum)
  if (prerequisite.kind === 'trait-absent') return !character.traits.some((entry) => entry.traitId === prerequisite.traitId && entry.active)
  if (prerequisite.kind === 'trait-level-maximum') return !character.traits.some((entry) => entry.traitId === prerequisite.traitId && Math.abs(entry.attainedTp ?? 0) > prerequisite.maximumMagnitude)
  if (prerequisite.kind === 'skill-field') return prerequisite.fieldIds.some((fieldId) => character.creation.lifeModules?.selectedSkillFields.some((grant) => grant.fieldId === fieldId))
  if (prerequisite.kind === 'module-history') return prerequisite.moduleIds.some((moduleId) => character.lifeModuleHistory.some((entry) => entry.moduleId === moduleId))
  if (prerequisite.kind === 'residence') return normalizeComparableLocation(character.personalDescription?.residence) === normalizeComparableLocation(prerequisite.location)
  return false
}

function normalizeHomeworld(value: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ')
  if (!normalized) throw new Error('Family Training requires a concrete named homeworld before its Homeworld History award can be previewed.')
  if (normalized.length > 100) throw new Error('Homeworld must be 100 characters or fewer.')
  if ([...normalized].some((character) => {
    const code = character.charCodeAt(0)
    return code < 32 || code === 127
  })) throw new Error('Homeworld contains unsupported control characters.')
  return normalized
}

function normalizeResidence(value: string): string {
  const normalized = value.trim().replace(/\s+/g, ' ')
  if (!normalized) return ''
  if (normalized.length > 100) throw new Error('Residence must be 100 characters or fewer.')
  if ([...normalized].some((character) => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127)) throw new Error('Residence contains unsupported control characters.')
  return normalized
}

function normalizeComparableLocation(value: string | undefined): string {
  return (value ?? '').trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}

function solarisPrerequisiteWaivers(schoolModuleId: string, fieldId: string) {
  if (schoolModuleId !== SOLARIS_INTERNSHIP_ID) return []
  if (fieldId === CAVALRY_FIELD_ID) return [{ prerequisiteId: 'cavalry.field', sourceModuleId: schoolModuleId, description: 'Solaris Cavalry does not require Basic Training.' }]
  if (fieldId === MECHWARRIOR_FIELD_ID) return [{ prerequisiteId: 'mechwarrior.field', sourceModuleId: schoolModuleId, description: 'Solaris MechWarrior does not require Basic Training.' }]
  if (fieldId === PILOT_BATTLE_ARMOR_FIELD_ID) return [{ prerequisiteId: 'pilot-battle-armor.field', sourceModuleId: schoolModuleId, description: 'Solaris-trained Pilot/Battle Armor does not require the Infantry Field.' }]
  return []
}

function homeworldHistoryDestination(character: CharacterDefinition): Extract<LifeModuleDestination, { type: 'skill' }> {
  const homeworld = normalizeHomeworld(character.personalDescription?.homeworld ?? '')
  const subject = `${homeworld} History`
  return { type: 'skill', address: { skillId: 'skill.interest', parameter: { kind: 'subskill', value: subject } }, displayName: `Interest/${subject}` }
}

function validateResolutionDestination(character: CharacterDefinition, pending: PendingLifeModuleAward, destination: ResolvedLifeModuleDestination): void {
  const outbackArtOrInterest = pending.awardId === 'outback.skill.art-or-interest'
  if (!pending.allowedTargetTypes.includes(destination.type)) throw new Error(`${destination.type} is not an allowed target for this award.`)
  if (pending.excludedTargetIds?.includes(destination.targetId)) throw new Error(`${destination.targetId} is not a legal destination for this award.`)
  if (pending.allowedTargetIds && !pending.allowedTargetIds.includes(destination.targetId)) throw new Error(`${destination.targetId} is not a legal destination for this award.`)
  if (destination.type === 'attribute') {
    if (!ATTRIBUTE_IDS.includes(destination.targetId as (typeof ATTRIBUTE_IDS)[number]) || destination.parameter) throw new Error('Flexible Attribute awards require a valid Attribute ID and no parameter.')
    return
  }
  if (!destination.targetId.startsWith(destination.type === 'trait' ? 'trait.' : 'skill.')) throw new Error(`A stable ${destination.type} rule ID is required.`)
  if (pending.kind === 'related-skill-prerequisite') {
    if (destination.type !== 'skill') throw new Error('A related-Skill prerequisite must identify a Skill.')
    const key = `${destination.targetId}/${destination.parameter?.kind ?? ''}/${destination.parameter?.value.toLowerCase() ?? ''}`
    if (!pending.skillFieldPrerequisiteChoice?.eligibleSkillKeys.includes(key)) throw new Error('The related-Skill prerequisite must use a concrete Skill the character already possesses.')
    if (!character.skills.some((entry) => entry.level !== null && skillKey(entry.address) === key)) throw new Error('The selected related Skill is no longer possessed.')
    return
  }
  if (destination.type === 'skill' && pending.requiredSkillId && !outbackArtOrInterest && destination.targetId !== pending.requiredSkillId) throw new Error(`This award must resolve to ${pending.requiredSkillId}.`)
  if (pending.kind === 'modeled-skill-choice') {
    if (destination.type !== 'skill') throw new Error('This award must resolve to a Skill.')
    const available = modeledSkillChoiceOptions(character).filter((option) => !pending.allowedDestinationKeys || pending.allowedDestinationKeys.includes(option.value))
    const key = `${destination.targetId}/${destination.parameter?.value ?? ''}`
    const exact = available.some((option) => option.value === key && option.displayName === destination.displayName)
    const open = isOpenSubjectSkillId(destination.targetId) && available.some((option) => option.value === `${destination.targetId}/__open__`)
    if (open) {
      const canonical = openSkillSubjectDestination(destination.targetId, destination.parameter?.value ?? '')
      if (canonical.displayName !== destination.displayName || canonical.parameter?.value !== destination.parameter?.value) throw new Error('Open subject destination must use its canonical parent Skill identity.')
    } else if (!exact) throw new Error('This Skill is not currently represented by the governed Alpha catalog.')
  }
  if ((pending.kind === 'language-choice' || pending.kind === 'affiliation-skill-choice' || pending.kind === 'any-skill-choice' || pending.kind === 'multi-skill-choice') && !destination.parameter?.value) {
    throw new Error('A concrete language or subskill choice is required.')
  }
  if (pending.kind === 'language-choice' && destination.targetId !== 'skill.language') throw new Error('Language awards must resolve to a Language subskill.')
  if (pending.kind === 'affiliation-skill-choice') {
    if (pending.requiredSkillId !== 'skill.protocol' && pending.requiredSkillId !== 'skill.streetwise') throw new Error('Legacy affiliation-bound award has an unsupported Skill destination.')
    const expected = resolveAffiliationBoundLifeModuleDestination(character, pending.requiredSkillId, pending.description)
    if (destination.targetId !== expected.address.skillId || destination.parameter?.value !== expected.address.parameter?.value) {
      throw new Error('This legacy affiliation-bound award must resolve from the character’s established final affiliation.')
    }
  }
  const knownChoices = knownPendingChoiceValues(pending)
  const openSubject = pendingOpenSubject(pending)
  if (openSubject && !outbackArtOrInterest) {
    const canonical = openSkillSubjectDestination(openSubject.skillId, destination.parameter?.value ?? '')
    if (destination.targetId !== canonical.targetId || destination.displayName !== canonical.displayName || destination.parameter?.value !== canonical.parameter?.value) {
      throw new Error('Open subject destination must use its canonical parent Skill identity.')
    }
  }
  if (knownChoices.length > 0 && !openSubject && !knownChoices.includes(destination.parameter?.value ?? '')) {
    throw new Error('This award must resolve to a safe known choice from the current Alpha data.')
  }
}

function normalizeResolvedDestination(destination: ResolvedLifeModuleDestination): ResolvedLifeModuleDestination {
  const targetId = destination.targetId.trim()
  const displayName = destination.displayName.trim()
  const parameter = destination.parameter
    ? { kind: destination.parameter.kind.trim(), value: destination.parameter.value.trim() }
    : undefined
  if (!targetId || !displayName || (parameter && (!parameter.kind || !parameter.value))) throw new Error('Award destination ID, name, and any parameter must be non-empty.')
  if (targetId === 'skill.driving' && parameter) {
    const aliases: Record<string, string> = { Ground: 'Ground Vehicles', 'Ground Car': 'Ground Vehicles', 'Ground Vehicle': 'Ground Vehicles' }
    const value = aliases[parameter.value] ?? parameter.value
    return { ...destination, targetId, displayName: `Driving/${value}`, parameter: { ...parameter, value } }
  }
  return { ...destination, targetId, displayName, ...(parameter ? { parameter } : {}) }
}

function toLifeModuleDestination(destination: ResolvedLifeModuleDestination): LifeModuleDestination {
  if (destination.type === 'attribute') return { type: 'attribute', attributeId: destination.targetId }
  if (destination.type === 'trait') return { type: 'trait', traitId: destination.targetId, displayName: destination.displayName, parameters: destination.parameters }
  return {
    type: 'skill',
    address: { skillId: destination.targetId, ...(destination.parameter ? { parameter: { ...destination.parameter } } : {}) },
    displayName: destination.displayName,
  }
}

function fromLifeModuleDestination(destination: LifeModuleDestination): ResolvedLifeModuleDestination {
  if (destination.type === 'attribute') return { type: 'attribute', targetId: destination.attributeId, displayName: destination.attributeId }
  if (destination.type === 'trait') return { type: 'trait', targetId: destination.traitId, displayName: destination.displayName, parameters: destination.parameters }
  return { type: 'skill', targetId: destination.address.skillId, displayName: destination.displayName, parameter: destination.address.parameter }
}

function recordResolvedAward(
  resolvedAwards: ResolvedLifeModuleAward[],
  pending: Pick<PendingLifeModuleAward, 'moduleId' | 'awardId' | 'kind' | 'xpPerGrant' | 'source'>,
  destination: ResolvedLifeModuleDestination,
  provenanceId: string,
  xp = pending.xpPerGrant,
): void {
  resolvedAwards.push({
    id: makeId(undefined, 'resolved-award'),
    moduleId: pending.moduleId,
    awardId: pending.awardId,
    kind: pending.kind,
    xp,
    destination: structuredClone(destination),
    provenanceId,
    resolvedAt: new Date().toISOString(),
    source: { ...pending.source },
  })
}

function resolvedDestinationKey(destination: ResolvedLifeModuleDestination): string {
  return `${destination.type}/${destination.targetId.toLowerCase()}/${destination.parameter?.kind.toLowerCase() ?? ''}/${destination.parameter?.value.toLowerCase() ?? ''}/${JSON.stringify(destination.parameters ?? {})}`
}

function attainedSkillLevel(xp: number): number | null {
  if (xp < STANDARD_SKILL_XP_COSTS[0]) return null
  let level = 0
  STANDARD_SKILL_XP_COSTS.forEach((cost, index) => { if (xp >= cost) level = index })
  return level
}

function calculateLedgerXp(character: CharacterDefinition): number {
  return [...character.attributes, ...character.traits, ...character.skills].reduce((total, entry) => total + entry.accumulatedXp, 0)
}

function skillKey(address: SkillAddress): string {
  return `${address.skillId}/${address.parameter?.kind ?? ''}/${address.parameter?.value.toLowerCase() ?? ''}`
}

function requireLifeModules(character: CharacterDefinition) {
  if (character.creation.method !== 'life-modules' || !character.creation.lifeModules) throw new Error('Life Module operations require a Life Module character.')
  return character.creation.lifeModules
}

function makeId(dependencies: CharacterFactoryDependencies | undefined, prefix: string): string {
  return dependencies?.id() ?? globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random()}`
}
