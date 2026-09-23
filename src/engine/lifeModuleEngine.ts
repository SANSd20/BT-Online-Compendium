import type {
  CharacterDefinition,
  PendingLifeModuleAward,
  ProvenanceRecord,
  SkillAddress,
  XpAward,
} from '../domain/character/model'
import {
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  CAPELLAN_COMMONALITY_ID,
  getLifeModule,
  LIFE_MODULE_RULES_SOURCE,
  UNIVERSAL_STAGE_0_ID,
} from '../domain/lifeModules/catalog'
import type { LifeModuleAward, LifeModuleDefinition, LifeModuleDestination, LifeModulePrerequisite } from '../domain/lifeModules/model'
import { STANDARD_SKILL_XP_COSTS } from '../domain/pointBuy/catalog'
import { createCharacterDraft, type CharacterFactoryDependencies } from './characterFactory'

const CAPELLAN_LANGUAGES = ['Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English'] as const
const CAPELLAN_SECONDARY_LANGUAGES = ['Russian', 'Cantonese', 'Vietnamese', 'English'] as const

export function createLifeModuleCharacter(
  displayName: string,
  startingXp = 5000,
  dependencies?: CharacterFactoryDependencies,
): CharacterDefinition {
  if (!Number.isInteger(startingXp) || startingXp <= 0) throw new RangeError('Life Module starting XP must be a positive whole number.')
  const character = createCharacterDraft('life-modules', displayName, dependencies)
  const provenanceId = makeId(dependencies, 'life-module-rules')
  character.creation.lifeModules = {
    source: { ...LIFE_MODULE_RULES_SOURCE },
    startingAllotment: startingXp === 5000 ? 'standard' : 'gm-adjusted',
    phase: 'stage-0-universal',
    currentStage: 0,
    moduleXp: { starting: startingXp, spent: 0, remaining: startingXp },
    selectedModuleIds: [],
    pendingAwards: [],
    prerequisiteIssues: [],
    limitations: [
      'Slice 4 includes only the universal Stage 0 package, Capellan Confederation/Capellan Commonality, Blue Collar, and Back Woods.',
      'Unresolved choice and flexible awards are retained but cannot yet be allocated in the UI.',
      'Stage 2 through Stage 4, Changing Affiliations, Skill Fields, Life Events, Optimization, and exhaustive final validation are deferred.',
    ],
  }
  character.provenance.push({ id: provenanceId, kind: 'published', description: 'Life Module character creation rules', source: { ...LIFE_MODULE_RULES_SOURCE } })
  character.xp.creation = { starting: startingXp, remaining: startingXp, allocated: 0 }
  return character
}

export function applyUniversalStage0(character: CharacterDefinition, affiliationLanguage: string): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-0-universal') throw new Error('The universal Stage 0 package is not the current legal action.')
  const language = affiliationLanguage.trim()
  if (!CAPELLAN_LANGUAGES.includes(language as (typeof CAPELLAN_LANGUAGES)[number])) {
    throw new Error('Universal affiliation language must be a Capellan primary or secondary language in this Slice 4 catalog.')
  }
  const next = applyModule(character, getLifeModule(UNIVERSAL_STAGE_0_ID), {
    'universal.language.affiliation': {
      type: 'skill', address: { skillId: 'skill.language', parameter: { kind: 'subskill', value: language } }, displayName: `Language/${language}`,
    },
  })
  requireLifeModules(next).affiliationLanguage = language
  requireLifeModules(next).phase = 'stage-0-affiliation'
  return next
}

export function applyCapellanCommonality(character: CharacterDefinition, capellanSecondaryLanguage?: string): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-0-affiliation') throw new Error('The Stage 0 affiliation is not the current legal action.')
  const resolutions: Record<string, LifeModuleDestination> = {}
  const language = capellanSecondaryLanguage?.trim()
  if (language) {
    if (!CAPELLAN_SECONDARY_LANGUAGES.includes(language as (typeof CAPELLAN_SECONDARY_LANGUAGES)[number])) {
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
    { affiliationId: 'affiliation.capellan-confederation', role: 'birth', provenanceId },
    { affiliationId: 'affiliation.capellan-confederation', role: 'final', provenanceId },
  )
  nextState.phase = 'stage-1-selection'
  nextState.currentStage = 1
  return next
}

export function applyStage1Module(character: CharacterDefinition, moduleId: typeof BLUE_COLLAR_ID | typeof BACK_WOODS_ID): CharacterDefinition {
  const state = requireLifeModules(character)
  if (state.phase !== 'stage-1-selection') throw new Error('A Stage 1 module is not the current legal action.')
  if (moduleId !== BLUE_COLLAR_ID && moduleId !== BACK_WOODS_ID) throw new Error(`Unknown Slice 4 Stage 1 module: ${moduleId}`)
  const module = getLifeModule(moduleId)
  const resolutions: Record<string, LifeModuleDestination> = {}
  if (moduleId === BACK_WOODS_ID && state.affiliationLanguage) {
    resolutions['back-woods.language.affiliation'] = {
      type: 'skill',
      address: { skillId: 'skill.language', parameter: { kind: 'subskill', value: state.affiliationLanguage } },
      displayName: `Language/${state.affiliationLanguage}`,
    }
  }
  const next = applyModule(character, module, resolutions)
  const nextState = requireLifeModules(next)
  nextState.phase = nextState.pendingAwards.length > 0 ? 'stage-1-resolution' : 'stage-2-or-finalization'
  nextState.currentStage = nextState.pendingAwards.length > 0 ? 1 : 2
  next.chronology.push({ date: 'age:10', eventId: `${module.id}.complete`, provenanceId: next.lifeModuleHistory.at(-1)?.provenanceIds[0] ?? '' })
  return next
}

function applyModule(
  character: CharacterDefinition,
  module: LifeModuleDefinition,
  resolutions: Record<string, LifeModuleDestination>,
): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireLifeModules(next)
  if (state.selectedModuleIds.includes(module.id)) throw new Error(`Life Module already selected: ${module.id}`)
  if (state.moduleXp.remaining < module.costXp) throw new RangeError(`Selecting ${module.displayName} would overspend the Life Module XP pool.`)
  const selectedAt = new Date().toISOString()
  const provenanceId = makeId(undefined, `module-${module.id}`)
  const provenance: ProvenanceRecord = { id: provenanceId, kind: 'published', description: `${module.displayName} module awards`, source: { ...module.source } }
  next.provenance.push(provenance)

  for (const award of module.awards) {
    if (award.kind === 'fixed') applyDestinationAward(next, award.destination, award.xp, provenanceId)
    else if (award.kind === 'language-choice' && resolutions[award.id]) applyDestinationAward(next, resolutions[award.id], award.xp, provenanceId)
    else addPendingAward(state.pendingAwards, module, award)
  }
  state.moduleXp.spent += module.costXp
  state.moduleXp.remaining -= module.costXp
  state.selectedModuleIds.push(module.id)
  next.xp.creation.remaining = state.moduleXp.remaining
  next.xp.creation.allocated = calculateLedgerXp(next)
  next.lifeModuleHistory.push({
    moduleId: module.id,
    displayName: module.displayName,
    stage: module.stage,
    costXp: module.costXp,
    selectedAt,
    provenanceIds: [provenanceId],
    source: { ...module.source },
    notes: [...module.notes, ...module.deferredRules],
  })
  state.prerequisiteIssues.push(...module.prerequisites.map((entry) => evaluatePrerequisite(next, module.id, entry)))
  next.updatedAt = selectedAt
  return next
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
  if (award.kind === 'choice-package' || award.kind === 'conditional' || award.kind === 'field-grant') {
    throw new Error(`Award type ${award.kind} is modeled but not supported by the Slice 4 engine.`)
  }
  const kind = award.kind
  const xpPerGrant = kind === 'flexible-xp' ? award.xpPerGrant : award.xp
  const remainingGrants = kind === 'flexible-xp' ? award.count : kind === 'language-choice' ? 1 : award.count
  const allowedTargetTypes = kind === 'flexible-xp' ? award.allowedTargetTypes : ['skill' as const]
  pending.push({
    id: makeId(undefined, 'pending-award'), moduleId: module.id, awardId: award.id, kind,
    description: kind === 'language-choice' ? award.description : kind === 'flexible-xp' ? `Allocate ${remainingGrants} grants of ${xpPerGrant} XP.` : `${award.displayName}: choose ${remainingGrants} concrete subskill${remainingGrants === 1 ? '' : 's'}.`,
    xpPerGrant, remainingGrants, allowedTargetTypes: [...allowedTargetTypes], source: { ...module.source },
  })
}

function evaluatePrerequisite(character: CharacterDefinition, moduleId: string, prerequisite: LifeModulePrerequisite) {
  let satisfied = false
  if (prerequisite.kind === 'affiliation') satisfied = character.affiliations.length > 0
  if (prerequisite.kind === 'attribute-minimum') {
    const entry = character.attributes.find((item) => item.attributeId === prerequisite.attributeId)
    satisfied = (entry?.purchasedLevel ?? 0) >= prerequisite.minimum
  }
  if (prerequisite.kind === 'trait') satisfied = character.traits.some((item) => item.traitId === prerequisite.traitId && item.active)
  return {
    id: `${moduleId}/${prerequisite.id}`,
    moduleId,
    prerequisiteId: prerequisite.id,
    description: prerequisite.description,
    status: satisfied ? 'satisfied' as const : 'outstanding' as const,
    finalValidationRequired: true,
  }
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
