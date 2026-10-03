import type {
  CharacterDefinition,
  LifeModulePrerequisiteIssue,
  PendingLifeModuleAward,
  ProvenanceRecord,
  ResolvedLifeModuleAward,
  ResolvedLifeModuleDestination,
  SkillAddress,
  XpAward,
} from '../domain/character/model'
import {
  AGITATOR_ID,
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  CAPELLAN_COMMONALITY_ID,
  FEDERATED_SUNS_CRUCIS_MARCH_ID,
  getLifeModule,
  LIFE_MODULE_RULES_SOURCE,
  MILITARY_ACADEMY_ID,
  MILITARY_ENLISTMENT_ID,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
  TECHNICAL_COLLEGE_ID,
  UNIVERSAL_STAGE_0_ID,
} from '../domain/lifeModules/catalog'
import type { LifeModuleAward, LifeModuleDefinition, LifeModuleDestination, LifeModulePrerequisite } from '../domain/lifeModules/model'
import { knownPendingChoiceValues } from '../domain/lifeModules/awardOptions'
import { CAPELLAN_COMMONALITY_CONTEXT, FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT, getLifeModuleAffiliationContextByAffiliationId, getLifeModuleLanguageSelectorOptions, resolveLifeModuleAffiliationContext } from '../domain/lifeModules/affiliations'
import { STANDARD_SKILL_XP_COSTS } from '../domain/pointBuy/catalog'
import { BASIC_TRAINING_FIELD_ID, getSkillField, INFANTRY_FIELD_ID, skillFieldCost, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID } from '../domain/skillFields/catalog'
import { createCharacterDraft, type CharacterFactoryDependencies } from './characterFactory'

const ATTRIBUTE_IDS = ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG'] as const

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
      'Alpha Slice 61 includes the Stage 0/1/2 bounded catalog, Technical College, Military Academy, Military Enlistment, ten source-audited mechanically acquirable Skill Fields, bounded variable Field-Skill choices, Agitator at Stage 4, and final-review/Optimization foundations.',
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
  const next = universalAlreadyIncluded
    ? resolvePendingLifeModuleAward(character, state.pendingAwards.find((entry) => entry.moduleId === UNIVERSAL_STAGE_0_ID && entry.awardId === 'universal.language.affiliation')?.id ?? '', destination)
    : applyModule(character, getLifeModule(UNIVERSAL_STAGE_0_ID), {
        'universal.language.affiliation': toLifeModuleDestination(destination),
      })
  requireLifeModules(next).stage0AffiliationContext = affiliationContextModuleId
  requireLifeModules(next).affiliationLanguage = language
  requireLifeModules(next).phase = 'stage-0-affiliation'
  return next
}

export function applyStage0Affiliation(
  character: CharacterDefinition,
  affiliationContextModuleId: string,
  affiliationLanguage: string,
  capellanSecondaryLanguage?: string,
  davionNaturalAptitude?: 'Protocol' | 'Strategy',
  davionArt?: string,
): CharacterDefinition {
  const withUniversal = applyUniversalStage0(character, affiliationContextModuleId, affiliationLanguage)
  return affiliationContextModuleId === FEDERATED_SUNS_CRUCIS_MARCH_ID
    ? applyFederatedSunsCrucisMarch(withUniversal, davionNaturalAptitude, davionArt)
    : applyCapellanCommonality(withUniversal, capellanSecondaryLanguage)
}

export function applyCapellanCommonality(character: CharacterDefinition, capellanSecondaryLanguage?: string): CharacterDefinition {
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
  const next = applyModule(character, getLifeModule(CAPELLAN_COMMONALITY_ID), resolutions)
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

export function applyFederatedSunsCrucisMarch(character: CharacterDefinition, naturalAptitude?: 'Protocol' | 'Strategy', art?: string): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-0-affiliation') throw new Error('The Stage 0 affiliation is not the current legal action.')
  if (state.stage0AffiliationContext !== FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.id) throw new Error('The selected Stage 0 affiliation package must match the explicit Universal affiliation context.')
  if (naturalAptitude !== 'Protocol' && naturalAptitude !== 'Strategy') throw new Error('Choose the published Federated Suns Natural Aptitude option.')
  if (art !== 'Painting') throw new Error('Choose a supported Crucis March Art subskill.')
  const published = getLifeModule(FEDERATED_SUNS_CRUCIS_MARCH_ID)
  const module: LifeModuleDefinition = {
    ...published,
    awards: published.awards.flatMap((award): LifeModuleAward[] => {
      if (award.id === 'fedsuns.trait.natural-aptitude') return [{ id: award.id, kind: 'fixed', xp: 100, destination: { type: 'trait', traitId: 'trait.natural-aptitude', displayName: `Natural Aptitude/${naturalAptitude}`, parameters: { skill: naturalAptitude } } }]
      if (award.id === 'crucis.skill.art') return [{ id: award.id, kind: 'fixed', xp: 10, destination: { type: 'skill', address: { skillId: 'skill.art', parameter: { kind: 'subskill', value: art } }, displayName: `Art/${art}` } }]
      return [award]
    }),
  }
  const next = applyModule(character, module, {})
  const nextState = requireLifeModules(next)
  const provenanceId = next.lifeModuleHistory.at(-1)?.provenanceIds[0]
  if (!provenanceId) throw new Error('Affiliation provenance was not recorded.')
  const artDestination: ResolvedLifeModuleDestination = {
    type: 'skill',
    targetId: 'skill.art',
    displayName: 'Art/Painting',
    parameter: { kind: 'subskill', value: art },
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
  next.affiliations.push(
    { affiliationId: FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.affiliationId, role: 'birth', provenanceId },
    { affiliationId: FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.affiliationId, role: 'final', provenanceId },
  )
  nextState.phase = 'stage-1-selection'
  nextState.currentStage = 1
  return next
}

export function previewFederatedSunsCrucisMarch(character: CharacterDefinition): CharacterDefinition {
  const preview = structuredClone(character)
  requireLifeModules(preview).stage0AffiliationContext = FEDERATED_SUNS_CRUCIS_MARCH_ID
  const published = getLifeModule(FEDERATED_SUNS_CRUCIS_MARCH_ID)
  const fixedOnly = { ...published, awards: published.awards.filter((award) => award.kind === 'fixed') }
  const next = applyModule(preview, fixedOnly, {})
  const state = requireLifeModules(next)
  state.pendingAwards.push(
    { id: 'preview-fedsuns-natural-aptitude', moduleId: published.id, awardId: 'fedsuns.trait.natural-aptitude', kind: 'flexible-xp', description: 'Choose Natural Aptitude/Protocol or Natural Aptitude/Strategy.', xpPerGrant: 100, remainingGrants: 1, allocationMode: 'fixed-grants', allowedTargetTypes: ['trait'], source: { ...published.source } },
    { id: 'preview-crucis-art', moduleId: published.id, awardId: 'crucis.skill.art', kind: 'any-skill-choice', description: 'Art/Any: choose 1 concrete subskill.', xpPerGrant: 10, remainingGrants: 1, allocationMode: 'fixed-grants', allowedTargetTypes: ['skill'], requiredSkillId: 'skill.art', source: { ...published.source } },
  )
  return next
}

export function applyStage1Module(character: CharacterDefinition, moduleId: typeof BLUE_COLLAR_ID | typeof BACK_WOODS_ID): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-1-selection') throw new Error('A Stage 1 module is not the current legal action.')
  if (moduleId !== BLUE_COLLAR_ID && moduleId !== BACK_WOODS_ID) throw new Error(`Unknown Alpha Stage 1 module: ${moduleId}`)
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
  moduleId: typeof STAGE_2_BACK_WOODS_ID | typeof STAGE_2_HIGH_SCHOOL_ID,
): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-2-selection') throw new Error('A Stage 2 module is not the current legal action.')
  if (moduleId !== STAGE_2_BACK_WOODS_ID && moduleId !== STAGE_2_HIGH_SCHOOL_ID) throw new Error(`Unknown Alpha Stage 2 module: ${moduleId}`)
  if (character.lifeModuleHistory.some((entry) => entry.stage === 2)) throw new Error('Exactly one Stage 2 module may be selected.')
  const next = applyModule(character, getLifeModule(moduleId), {})
  next.chronology.push({ date: 'age:16', eventId: `${moduleId}.complete`, provenanceId: next.lifeModuleHistory.at(-1)?.provenanceIds[0] ?? '' })
  return updateLifeModuleProgress(next)
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

function applyStage3SchoolDefinition(character: CharacterDefinition, moduleId: string, fieldIds: string[]): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-3-selection') throw new Error('A Stage 3 school is not the current legal action.')
  if (character.lifeModuleHistory.some((entry) => entry.stage === 3)) throw new Error('Repeated Stage 3 schooling is not supported in Alpha Slice 61.')
  const publishedSchool = getLifeModule(moduleId)
  if (publishedSchool.stage !== 3 || !publishedSchool.skillFieldSelection) throw new Error(`Unknown Alpha Stage 3 school: ${moduleId}`)
  const conditional = publishedSchool.conditionalPriorModuleAwards
  const conditionalApplies = Boolean(conditional && conditional.absentModuleIds.every((id) => !character.lifeModuleHistory.some((entry) => entry.moduleId === id)))
  const school: LifeModuleDefinition = conditionalApplies
    ? { ...publishedSchool, awards: [...conditional!.awards, ...publishedSchool.awards], notes: [...publishedSchool.notes, conditional!.description] }
    : publishedSchool
  validateSchoolFieldSelection(school, fieldIds)
  const selections = fieldIds.map((fieldId) => ({ field: getSkillField(fieldId), offer: school.skillFieldSelection!.offers.find((entry) => entry.fieldId === fieldId)! }))
  const fieldCostXp = selections.reduce((total, selection) => total + skillFieldCost(selection.field, selection.offer.costXpPerSkill), 0)
  const totalCostXp = school.costXp + fieldCostXp
  const next = applyModule(character, school, {}, { totalCostXp, fieldCostXp })
  const selectedAt = next.lifeModuleHistory.at(-1)?.selectedAt ?? new Date().toISOString()
  for (const { field, offer } of selections) {
    const provenanceId = makeId(undefined, `field-${field.id}`)
    next.provenance.push({ id: provenanceId, kind: 'published', description: `${field.displayName} Skill Field grant`, source: { ...field.source } })
    for (const component of field.componentSkills) applyDestinationAward(next, component, offer.awardedXpPerSkill, provenanceId)
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
    })
    for (const component of field.variableComponentSkills ?? []) {
      requireLifeModules(next).pendingAwards.push({
        id: makeId(undefined, 'pending-field-skill'),
        moduleId: school.id,
        awardId: `skill-field/${field.id}/${component.id}`,
        kind: 'any-skill-choice',
        description: `${component.displayName}: choose one Technician subskill.`,
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
  const age = 16 + selections.reduce((total, selection) => total + selection.offer.chronologyYears, 0)
  next.chronology.push({ date: `age:${age}`, eventId: `${school.id}.complete`, provenanceId: next.lifeModuleHistory.at(-1)?.provenanceIds[0] ?? '' })
  return updateLifeModuleProgress(next)
}

export function applyStage3School(character: CharacterDefinition, moduleId: string, fieldIds: string[]): CharacterDefinition {
  if (![TECHNICAL_COLLEGE_ID, MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID].includes(moduleId)) throw new Error(`Unknown Alpha Stage 3 school: ${moduleId}`)
  return applyStage3SchoolDefinition(character, moduleId, fieldIds)
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

export function applyAgitator(character: CharacterDefinition): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-4-selection') throw new Error('A Stage 4 module is not the current legal action.')
  if (character.lifeModuleHistory.some((entry) => entry.stage === 4)) {
    throw new Error('Repeated or multiple Stage 4 modules are not supported in Alpha Slice 9.')
  }
  const module = getLifeModule(AGITATOR_ID)
  const next = applyModule(character, module, {})
  const stage3Years = requireLifeModules(next).selectedSkillFields.reduce((total, grant) => total + grant.chronologyYears, 0)
  const stage4Years = next.lifeModuleHistory
    .filter((entry) => entry.stage === 4)
    .reduce((total, entry) => total + (entry.chronologyYears ?? 0), 0)
  const age = 16 + stage3Years + stage4Years
  next.chronology.push({ date: `age:${age}`, eventId: `${module.id}.complete`, provenanceId: next.lifeModuleHistory.at(-1)?.provenanceIds[0] ?? '' })
  return updateLifeModuleProgress(next)
}

export function applyStage4Module(character: CharacterDefinition, moduleId: string): CharacterDefinition {
  if (moduleId !== AGITATOR_ID) throw new Error(`Unknown Alpha Stage 4 module: ${moduleId}`)
  return applyAgitator(character)
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
  const normalized = normalizeResolvedDestination(destination)
  validateResolutionDestination(next, pending, normalized)
  const destinationKey = resolvedDestinationKey(normalized)
  const isPool = pending.allocationMode === 'pool'
  const duplicate = state.resolvedAwards.some((entry) => entry.moduleId === pending.moduleId && entry.awardId === pending.awardId && resolvedDestinationKey(entry.destination) === destinationKey)
  if (duplicate && !isPool) throw new Error('This destination has already been selected for the pending award.')
  const appliedXp = isPool ? xpAmount : pending.xpPerGrant
  if (isPool && (!Number.isInteger(appliedXp) || appliedXp! <= 0)) throw new Error('Flexible pool allocations require a positive whole XP amount.')
  if (!isPool && xpAmount !== undefined && xpAmount !== pending.xpPerGrant) throw new Error('Fixed grants must use their published XP amount.')
  if (isPool) {
    if (appliedXp! > (pending.remainingXp ?? 0)) throw new Error('Flexible allocation exceeds the remaining award XP.')
    const cap = pending.maxXpPerTarget?.[normalized.type]
    const alreadyAllocated = state.resolvedAwards
      .filter((entry) => entry.moduleId === pending.moduleId && entry.awardId === pending.awardId && resolvedDestinationKey(entry.destination) === destinationKey)
      .reduce((total, entry) => total + entry.xp, 0)
    if (cap !== undefined && alreadyAllocated + appliedXp! > cap) throw new Error(`This flexible award may allocate no more than ${cap} XP to one ${normalized.type}.`)
  }
  const moduleHistory = next.lifeModuleHistory.find((entry) => entry.moduleId === pending.moduleId)
  const fieldGrant = pending.skillFieldChoice
    ? state.selectedSkillFields.find((entry) => entry.schoolModuleId === pending.moduleId && entry.fieldId === pending.skillFieldChoice!.fieldId)
    : undefined
  const provenanceId = fieldGrant?.provenanceId ?? moduleHistory?.provenanceIds[0]
  if (!provenanceId) throw new Error('Pending award module provenance is missing.')
  const ledgerDestination = toLifeModuleDestination(normalized)
  applyDestinationAward(next, ledgerDestination, appliedXp!, provenanceId)
  if (pending.skillFieldChoice) {
    if (!fieldGrant) throw new Error('Pending Field-Skill choice has no matching durable Field grant.')
    fieldGrant.variableSkillChoices ??= []
    fieldGrant.variableSkillChoices.push({ componentId: pending.skillFieldChoice.componentId, destination: structuredClone(normalized) })
  } else {
    recordResolvedAward(state.resolvedAwards, pending, normalized, provenanceId, appliedXp!)
    next.creation.resolvedChoiceIds.push(`${pending.moduleId}/${pending.awardId}/${destinationKey}/${appliedXp}`)
  }
  if (isPool) {
    pending.remainingXp = (pending.remainingXp ?? 0) - appliedXp!
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
  options: { totalCostXp?: number; fieldCostXp?: number } = {},
): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (state.selectedModuleIds.includes(module.id)) throw new Error(`Life Module already selected: ${module.id}`)
  const totalCostXp = options.totalCostXp ?? module.costXp
  if (state.moduleXp.remaining < totalCostXp) throw new RangeError(`Selecting ${module.displayName} would overspend the Life Module XP pool.`)
  const selectedAt = new Date().toISOString()
  const provenanceId = makeId(undefined, `module-${module.id}`)
  const provenance: ProvenanceRecord = { id: provenanceId, kind: 'published', description: `${module.displayName} module awards`, source: { ...module.source } }
  next.provenance.push(provenance)

  for (const award of module.awards) {
    const requiredGrants = awardGrantCount(award)
    if (requiredGrants !== null) state.choiceGrantRequirements.push({
      moduleId: module.id,
      awardId: award.id,
      requiredGrants,
      ...(award.kind === 'flexible-xp' && award.allocationMode === 'pool' ? { requiredXp: award.totalXp, allocationMode: 'pool' as const } : {}),
    })
    if (award.kind === 'fixed') applyDestinationAward(next, award.destination, award.xp, provenanceId)
    else if (award.kind === 'affiliation-bound-skill') applyDestinationAward(next, resolveAffiliationBoundLifeModuleDestination(next, award.skillId, award.displayName), award.xp, provenanceId)
    else if (award.kind === 'language-choice' && resolutions[award.id]) {
      applyDestinationAward(next, resolutions[award.id], award.xp, provenanceId)
      const pendingShape = pendingAwardFrom(module, award)
      const resolved = fromLifeModuleDestination(resolutions[award.id])
      recordResolvedAward(state.resolvedAwards, pendingShape, resolved, provenanceId)
      next.creation.resolvedChoiceIds.push(`${module.id}/${award.id}/${resolvedDestinationKey(resolved)}`)
    }
    else addPendingAward(state.pendingAwards, module, award)
  }
  state.moduleXp.spent += totalCostXp
  state.moduleXp.remaining -= totalCostXp
  state.selectedModuleIds.push(module.id)
  next.xp.creation.remaining = state.moduleXp.remaining
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.lifeModuleHistory.push({
    moduleId: module.id,
    displayName: module.displayName,
    stage: module.stage,
    costXp: totalCostXp,
    ...(options.totalCostXp !== undefined ? { baseCostXp: module.costXp, fieldCostXp: options.fieldCostXp ?? 0 } : {}),
    ...(module.chronologyYears !== undefined ? { chronologyYears: module.chronologyYears } : {}),
    ...(module.repeatPolicy ? { repeatPolicy: structuredClone(module.repeatPolicy) } : {}),
    selectedAt,
    provenanceIds: [provenanceId],
    source: { ...module.source },
    notes: [...module.notes, ...module.deferredRules],
  })
  state.prerequisiteIssues.push(...module.prerequisites.map((entry) => evaluatePrerequisite(next, module.id, entry)))
  next.updatedAt = selectedAt
  return next
}

function validateSchoolFieldSelection(school: LifeModuleDefinition, fieldIds: string[]): void {
  const policy = school.skillFieldSelection
  if (!policy) throw new Error(`${school.displayName} has no Skill Field selection policy.`)
  if (new Set(fieldIds).size !== fieldIds.length) throw new Error('Skill Fields may not be selected more than once.')
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
  if (award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice') return award.count
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
    const attained = Math.trunc(entry.accumulatedXp / 100)
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

function addPendingAward(pending: PendingLifeModuleAward[], module: LifeModuleDefinition, award: Exclude<LifeModuleAward, { kind: 'fixed' }>): void {
  if (award.kind === 'affiliation-bound-skill') throw new Error('Affiliation-bound awards must resolve automatically from the established final affiliation.')
  if (award.kind === 'choice-package' || award.kind === 'conditional' || award.kind === 'field-grant') {
    throw new Error(`Award type ${award.kind} is modeled but not supported by the Alpha Slice 9 engine.`)
  }
  pending.push(pendingAwardFrom(module, award))
}

function pendingAwardFrom(module: LifeModuleDefinition, award: Exclude<LifeModuleAward, { kind: 'fixed' | 'affiliation-bound-skill' | 'choice-package' | 'conditional' | 'field-grant' }>): PendingLifeModuleAward {
  const kind = award.kind
  const isPool = kind === 'flexible-xp' && award.allocationMode === 'pool'
  const xpPerGrant = kind === 'flexible-xp' ? (isPool ? 0 : award.xpPerGrant) : award.xp
  const remainingGrants = kind === 'flexible-xp' ? (isPool ? 0 : award.count) : kind === 'language-choice' || kind === 'affiliation-skill-choice' ? 1 : award.count
  const allowedTargetTypes = kind === 'flexible-xp' ? award.allowedTargetTypes : ['skill' as const]
  return {
    id: makeId(undefined, 'pending-award'), moduleId: module.id, awardId: award.id, kind,
    description: kind === 'language-choice' || kind === 'affiliation-skill-choice' ? award.description : kind === 'flexible-xp' ? (isPool ? `Allocate ${award.totalXp} flexible XP under its source restrictions.` : `Allocate ${remainingGrants} grants of ${xpPerGrant} XP.`) : `${award.displayName}: choose ${remainingGrants} concrete subskill${remainingGrants === 1 ? '' : 's'}.`,
    xpPerGrant,
    remainingGrants,
    ...(isPool ? { allocationMode: 'pool' as const, remainingXp: award.totalXp, ...(award.maxXpPerTarget ? { maxXpPerTarget: { ...award.maxXpPerTarget } } : {}) } : { allocationMode: 'fixed-grants' as const }),
    allowedTargetTypes: [...allowedTargetTypes],
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
  state.prerequisiteIssues = state.selectedModuleIds.flatMap((moduleId) => {
    const module = getLifeModule(moduleId)
    return module.prerequisites.map((entry) => evaluatePrerequisite(character, moduleId, entry, state.prerequisiteIssues))
  }).concat(state.selectedSkillFields.flatMap((grant) => getSkillField(grant.fieldId).prerequisites.map((entry) => evaluatePrerequisite(character, grant.fieldId, entry, state.prerequisiteIssues))))
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
  if (prerequisite.kind === 'affiliation') {
    satisfied = character.affiliations.length > 0
    if (satisfied && prerequisite.classification === 'non-clan') satisfied = character.affiliations.every((entry) => !entry.affiliationId.startsWith('affiliation.clan'))
  }
  if (prerequisite.kind === 'attribute-minimum') {
    const entry = character.attributes.find((item) => item.attributeId === prerequisite.attributeId)
    satisfied = (entry?.purchasedLevel ?? 0) >= prerequisite.minimum
  }
  if (prerequisite.kind === 'trait') satisfied = character.traits.some((item) => item.traitId === prerequisite.traitId && item.active)
  if (prerequisite.kind === 'trait-absent') satisfied = !character.traits.some((item) => item.traitId === prerequisite.traitId && item.active)
  if (prerequisite.kind === 'skill-field') satisfied = prerequisite.fieldIds.some((fieldId) => character.creation.lifeModules?.selectedSkillFields.some((grant) => grant.fieldId === fieldId))
  return {
    id: `${moduleId}/${prerequisite.id}`,
    moduleId,
    prerequisiteId: prerequisite.id,
    description: prerequisite.description,
    status: satisfied ? 'satisfied' as const : 'outstanding' as const,
    finalValidationRequired: true,
  }
}

function validateResolutionDestination(character: CharacterDefinition, pending: PendingLifeModuleAward, destination: ResolvedLifeModuleDestination): void {
  if (!pending.allowedTargetTypes.includes(destination.type)) throw new Error(`${destination.type} is not an allowed target for this award.`)
  if (destination.type === 'attribute') {
    if (!ATTRIBUTE_IDS.includes(destination.targetId as (typeof ATTRIBUTE_IDS)[number]) || destination.parameter) throw new Error('Flexible Attribute awards require a valid Attribute ID and no parameter.')
    return
  }
  if (!destination.targetId.startsWith(destination.type === 'trait' ? 'trait.' : 'skill.')) throw new Error(`A stable ${destination.type} rule ID is required.`)
  if (destination.type === 'skill' && pending.requiredSkillId && destination.targetId !== pending.requiredSkillId) throw new Error(`This award must resolve to ${pending.requiredSkillId}.`)
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
  if (knownChoices.length > 0 && !knownChoices.includes(destination.parameter?.value ?? '')) {
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
