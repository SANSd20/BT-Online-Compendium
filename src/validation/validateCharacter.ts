import type { CharacterDefinition } from '../domain/character/model'
import {
  POINT_BUY_ATTRIBUTE_MAXIMUMS,
  getPointBuySkill,
  getPointBuyTrait,
  standardSkillXpCost,
} from '../domain/pointBuy/catalog'
import { calculateNegativeTraitXp, calculatePointBuyAllocatedXp } from '../domain/pointBuy/calculations'
import type { ValidationIssue, ValidationResult } from './model'
import { getLifeModule } from '../domain/lifeModules/catalog'
import type { LifeModuleAward, LifeModuleDefinition } from '../domain/lifeModules/model'

function issue(
  id: string,
  path: string,
  message: string,
  options: Partial<Pick<ValidationIssue, 'severity' | 'kind' | 'gmOverrideAllowed'>> = {},
): ValidationIssue {
  return {
    id,
    path,
    message,
    severity: options.severity ?? 'error',
    kind: options.kind ?? 'hard-requirement',
    gmOverrideAllowed: options.gmOverrideAllowed ?? false,
  }
}

export function validateCharacter(character: CharacterDefinition): ValidationResult {
  const issues: ValidationIssue[] = []

  if (!character.id.trim()) {
    issues.push(issue('character.id.required', 'id', 'Character ID is required.'))
  }
  if (!character.displayName.trim()) {
    issues.push(issue('character.name.required', 'displayName', 'Character name is required.'))
  }
  if (character.creation.rulesSnapshot.sources.length === 0) {
    issues.push(issue('rules.sources.required', 'creation.rulesSnapshot.sources', 'At least one rules source is required.'))
  }

  if (character.creation.method === 'archetype') {
    if (!character.creation.archetype?.archetypeId || !character.creation.archetype.source.sourceId) {
      issues.push(issue('archetype.selection.required', 'creation.archetype', 'A published archetype selection and source are required.'))
    }
    if (
      character.attributes.length === 0 ||
      character.traits.length === 0 ||
      character.skills.length === 0
    ) {
      issues.push(issue('archetype.package.required', 'creation', 'Archetype Attributes, Traits, and Skills are required.'))
    }
  }

  if (character.creation.method === 'point-buy') {
    validatePointBuy(character, issues)
  }
  if (character.creation.method === 'life-modules') {
    validateLifeModules(character, issues)
  }

  const identityIds = new Set(character.identities.entries.map((identity) => identity.id))
  const primaryIdentities = character.identities.entries.filter((identity) => identity.kind === 'primary')
  if (primaryIdentities.length !== 1) {
    issues.push(issue('identity.primary.exactly-one', 'identities.entries', 'Exactly one primary identity is required.'))
  }
  if (!identityIds.has(character.identities.primaryIdentityId)) {
    issues.push(issue('identity.primary.reference', 'identities.primaryIdentityId', 'Primary identity reference is invalid.'))
  }

  if (
    character.xp.creation.starting < 0 ||
    character.xp.creation.remaining < 0 ||
    character.xp.creation.allocated < 0 ||
    character.xp.earnedGameplayUnspent < 0
  ) {
    issues.push(issue('xp.nonnegative', 'xp', 'XP pools cannot be negative.'))
  }

  character.traits.forEach((trait, index) => {
    if (trait.identityId && !identityIds.has(trait.identityId)) {
      issues.push(issue('trait.identity.reference', `traits.${index}.identityId`, 'Trait identity reference is invalid.'))
    }
  })

  character.skills.forEach((skill, index) => {
    if (skill.level !== null && (!Number.isInteger(skill.level) || skill.level < 0)) {
      issues.push(issue('skill.level.valid', `skills.${index}.level`, 'Skill level must be null or a non-negative integer.'))
    }
  })

  const provenanceIds = new Set(character.provenance.map((entry) => entry.id))
  if (character.creation.method === 'point-buy' && character.creation.pointBuy) {
    if (
      !provenanceIds.has(character.creation.pointBuy.rulesProvenanceId) ||
      !provenanceIds.has(character.creation.pointBuy.costProvenanceId)
    ) {
      issues.push(issue('point-buy.provenance.reference', 'creation.pointBuy', 'Point Buy provenance references are invalid.'))
    }
  }
  const validateAwards = (path: string, awards: Array<{ provenanceId: string }>) => {
    const requiresCreationProvenance = character.creation.method !== 'life-modules' || character.creation.lifeModules !== undefined
    if (requiresCreationProvenance && awards.length === 0) {
      issues.push(issue('creation.provenance.required', path, 'Creation-derived values require source awards.'))
    }
    awards.forEach((award, index) => {
      if (!provenanceIds.has(award.provenanceId)) {
        issues.push(issue('provenance.reference', `${path}.${index}.provenanceId`, 'Source-award provenance reference is invalid.'))
      }
    })
  }

  character.attributes.forEach((entry, index) => validateAwards(`attributes.${index}.sourceAwards`, entry.sourceAwards))
  character.traits.forEach((entry, index) => validateAwards(`traits.${index}.sourceAwards`, entry.sourceAwards))
  character.skills.forEach((entry, index) => validateAwards(`skills.${index}.sourceAwards`, entry.sourceAwards))
  character.inventory.forEach((entry, index) => {
    if (!provenanceIds.has(entry.provenanceId)) {
      issues.push(issue('provenance.reference', `inventory.${index}.provenanceId`, 'Equipment provenance reference is invalid.'))
    }
    if (character.creation.method === 'archetype' && !entry.source?.sourceId) {
      issues.push(issue('archetype.equipment.source.required', `inventory.${index}.source`, 'Archetype equipment requires a source.'))
    }
  })

  return {
    valid: !issues.some((item) => item.severity === 'error'),
    issues,
  }
}

function validateLifeModules(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const state = character.creation.lifeModules
  if (!state?.source.sourceId) {
    const isUninitializedFoundation = character.lifeModuleHistory.length === 0 && character.xp.creation.starting === 0
    if (!isUninitializedFoundation) {
      issues.push(issue('life-modules.state.required', 'creation.lifeModules', 'Life Module creation state and source are required.'))
    }
    return
  }
  const { starting, spent, remaining } = state.moduleXp
  if (!Number.isInteger(starting) || starting <= 0 || !Number.isInteger(spent) || spent < 0 || !Number.isInteger(remaining) || remaining < 0) {
    issues.push(issue('life-modules.xp.valid', 'creation.lifeModules.moduleXp', 'Life Module XP values must be non-negative whole numbers with a positive starting pool.'))
  }
  if (remaining !== starting - spent || character.xp.creation.remaining !== remaining) {
    issues.push(issue('life-modules.xp.balance', 'creation.lifeModules.moduleXp', 'Life Module spending and remaining XP do not reconcile.'))
  }
  const selectedIds = new Set<string>()
  const provenanceIds = new Set(character.provenance.map((entry) => entry.id))
  let calculatedCost = 0
  for (const [index, entry] of character.lifeModuleHistory.entries()) {
    if (selectedIds.has(entry.moduleId)) issues.push(issue('life-modules.module.duplicate', `lifeModuleHistory.${index}.moduleId`, 'A Life Module cannot be selected more than once in the current Alpha catalog.'))
    selectedIds.add(entry.moduleId)
    try {
      const definition = getLifeModule(entry.moduleId)
      calculatedCost += definition.costXp
      if (entry.costXp !== definition.costXp || entry.stage !== definition.stage || !entry.source.sourceId) {
        issues.push(issue('life-modules.module.malformed', `lifeModuleHistory.${index}`, 'Life Module history does not match its catalog definition.'))
      }
    } catch (error) {
      issues.push(issue('life-modules.module.unknown', `lifeModuleHistory.${index}.moduleId`, error instanceof Error ? error.message : 'Unknown Life Module.'))
    }
    if (entry.provenanceIds.length === 0 || entry.provenanceIds.some((id) => !provenanceIds.has(id))) {
      issues.push(issue('life-modules.module.provenance', `lifeModuleHistory.${index}.provenanceIds`, 'Selected Life Modules require valid provenance references.'))
    }
  }
  if (calculatedCost !== spent) issues.push(issue('life-modules.cost.balance', 'creation.lifeModules.moduleXp.spent', 'Selected module costs do not match recorded Life Module spending.'))
  if (state.selectedModuleIds.length !== character.lifeModuleHistory.length || state.selectedModuleIds.some((id) => !selectedIds.has(id))) {
    issues.push(issue('life-modules.selection.balance', 'creation.lifeModules.selectedModuleIds', 'Selected module state does not match module history.'))
  }
  const hasUniversal = selectedIds.has('stage0.universal-fixed-xp')
  const hasAffiliation = selectedIds.has('stage0.capellan-confederation.capellan-commonality')
  const stage1Count = character.lifeModuleHistory.filter((entry) => entry.stage === 1).length
  if (!hasUniversal) issues.push(issue('life-modules.universal.outstanding', 'lifeModuleHistory', 'The universal Stage 0 package is still required.', { severity: 'warning' }))
  if (!hasAffiliation) issues.push(issue('life-modules.affiliation.outstanding', 'lifeModuleHistory', 'A Stage 0 affiliation is still required.', { severity: 'warning' }))
  if (stage1Count !== 1) issues.push(issue('life-modules.stage-1.outstanding', 'lifeModuleHistory', 'Exactly one Stage 1 module is required.', { severity: stage1Count === 0 ? 'warning' : 'error' }))
  if (!Array.isArray(state.pendingAwards) || !Array.isArray(state.resolvedAwards) || !Array.isArray(state.choiceGrantRequirements)) {
    issues.push(issue('life-modules.award-state.malformed', 'creation.lifeModules', 'Pending and resolved Life Module award collections are required.'))
    return
  }
  state.pendingAwards.forEach((award, index) => {
    let catalogAward: LifeModuleAward | undefined
    try { catalogAward = getLifeModule(award.moduleId).awards.find((entry) => entry.id === award.awardId) } catch { /* malformed below */ }
    const expectedXp = catalogAward?.kind === 'flexible-xp' ? catalogAward.xpPerGrant : catalogAward && 'xp' in catalogAward ? catalogAward.xp : undefined
    const expectedTypes = catalogAward?.kind === 'flexible-xp' ? catalogAward.allowedTargetTypes : catalogAward && ['language-choice', 'any-skill-choice', 'multi-skill-choice'].includes(catalogAward.kind) ? ['skill'] : []
    const expectedSkill = catalogAward?.kind === 'language-choice' ? 'skill.language' : catalogAward?.kind === 'any-skill-choice' || catalogAward?.kind === 'multi-skill-choice' ? catalogAward.skillId : undefined
    if (
      !selectedIds.has(award.moduleId) ||
      !award.awardId ||
      !Number.isFinite(award.xpPerGrant) ||
      !Number.isInteger(award.remainingGrants) ||
      award.remainingGrants <= 0 ||
      award.allowedTargetTypes.length === 0 ||
      !award.source.sourceId ||
      !catalogAward ||
      catalogAward.kind !== award.kind ||
      expectedXp !== award.xpPerGrant ||
      expectedTypes.length !== award.allowedTargetTypes.length ||
      expectedTypes.some((type) => !award.allowedTargetTypes.includes(type as 'attribute' | 'trait' | 'skill')) ||
      expectedSkill !== award.requiredSkillId
    ) {
      issues.push(issue('life-modules.pending-award.malformed', `creation.lifeModules.pendingAwards.${index}`, 'Pending Life Module award state is malformed.'))
    }
  })
  validateResolvedLifeModuleAwards(character, issues, selectedIds)
  validateChoiceGrantBalance(character, issues)
  if (state.pendingAwards.length > 0) issues.push(issue('life-modules.awards.unresolved', 'creation.lifeModules.pendingAwards', `${state.pendingAwards.length} source-bound award allocation${state.pendingAwards.length === 1 ? ' remains' : 's remain'} unresolved.`, { severity: 'warning' }))
  const hasOutstandingPrerequisite = state.prerequisiteIssues.some((entry) => entry.status === 'outstanding')
  if (hasOutstandingPrerequisite) {
    issues.push(issue('life-modules.prerequisites.outstanding', 'creation.lifeModules.prerequisiteIssues', 'One or more Life Module prerequisites remain outstanding for final validation.', { severity: 'warning', kind: 'prerequisite', gmOverrideAllowed: true }))
  }
  if (stage1Count === 1) {
    const expectedPhase = state.pendingAwards.length > 0
      ? 'stage-1-resolution'
      : hasOutstandingPrerequisite
        ? 'stage-1-prerequisite-review'
        : 'alpha-partial-stop'
    if (state.phase !== expectedPhase) issues.push(issue('life-modules.phase.malformed', 'creation.lifeModules.phase', `Life Module phase should be ${expectedPhase}.`))
    if (expectedPhase === 'alpha-partial-stop') {
      if (state.stopState !== 'alpha-partial-stop') issues.push(issue('life-modules.stop-state.malformed', 'creation.lifeModules.stopState', 'Completed Stage 0/1 award resolution requires the Alpha partial-stop state.'))
      issues.push(issue('life-modules.alpha-stop.valid', 'creation.lifeModules.stopState', 'Stage 0 and Stage 1 are complete for the implemented Alpha catalog; later progression and full finalization remain unsupported.', { severity: 'information', kind: 'availability' }))
    } else if (state.stopState !== 'not-eligible') {
      issues.push(issue('life-modules.stop-state.malformed', 'creation.lifeModules.stopState', 'This draft is not eligible for an Alpha partial stop.'))
    }
  }
  if (state.phase === 'stage-2-or-finalization' || state.currentStage > 1) {
    issues.push(issue('life-modules.continuation.unsupported', 'creation.lifeModules.phase', 'Continuation into Stage 2 or later is not supported in Alpha Slice 5.', { severity: 'warning', kind: 'availability' }))
  }
  if (character.creation.status === 'finalized') {
    issues.push(issue('life-modules.finalization.unsupported', 'creation.status', 'Full Life Module finalization is not implemented in Alpha Slice 5.'))
  }
}

function validateResolvedLifeModuleAwards(character: CharacterDefinition, issues: ValidationIssue[], selectedIds: Set<string>): void {
  const state = character.creation.lifeModules!
  const provenanceIds = new Set(character.provenance.map((entry) => entry.id))
  const seen = new Set<string>()
  state.resolvedAwards.forEach((resolved, index) => {
    let module: LifeModuleDefinition | undefined
    try { module = getLifeModule(resolved.moduleId) } catch { /* reported below */ }
    const award = module?.awards.find((entry) => entry.id === resolved.awardId)
    const key = `${resolved.moduleId}/${resolved.awardId}/${lifeModuleDestinationKey(resolved.destination)}`
    if (seen.has(key)) issues.push(issue('life-modules.resolution.duplicate', `creation.lifeModules.resolvedAwards.${index}`, 'A required choice cannot use the same destination more than once.'))
    seen.add(key)
    if (!selectedIds.has(resolved.moduleId) || !award || award.kind === 'fixed' || award.kind === 'choice-package' || award.kind === 'conditional' || award.kind === 'field-grant') {
      issues.push(issue('life-modules.resolution.unknown', `creation.lifeModules.resolvedAwards.${index}`, 'Resolved award does not identify a selectable award on a selected module.'))
      return
    }
    const expectedXp = award.kind === 'flexible-xp' ? award.xpPerGrant : award.xp
    const allowedTypes = award.kind === 'flexible-xp' ? award.allowedTargetTypes : ['skill']
    const requiredSkillId = award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice' ? award.skillId : award.kind === 'language-choice' ? 'skill.language' : undefined
    const targetIdValid = resolved.destination.type === 'attribute'
      ? LIFE_MODULE_ATTRIBUTE_IDS.includes(resolved.destination.targetId)
      : resolved.destination.targetId.startsWith(resolved.destination.type === 'trait' ? 'trait.' : 'skill.')
    const languageValid = award.kind !== 'language-choice' || award.choicesFrom === 'federated-suns-languages' || (
      award.choicesFrom === 'capellan-secondary'
        ? CAPELLAN_SECONDARY_LANGUAGE_IDS.includes(resolved.destination.parameter?.value ?? '')
        : CAPELLAN_AFFILIATION_LANGUAGE_IDS.includes(resolved.destination.parameter?.value ?? '')
    )
    if (
      resolved.kind !== award.kind ||
      resolved.xp !== expectedXp ||
      !allowedTypes.includes(resolved.destination.type) ||
      (requiredSkillId && resolved.destination.targetId !== requiredSkillId) ||
      ((award.kind === 'language-choice' || award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice') && !resolved.destination.parameter?.value) ||
      !targetIdValid ||
      !languageValid ||
      !resolved.source.sourceId ||
      !provenanceIds.has(resolved.provenanceId)
    ) {
      issues.push(issue('life-modules.resolution.malformed', `creation.lifeModules.resolvedAwards.${index}`, 'Resolved Life Module award violates its source award structure or provenance.'))
    }
  })
}

const LIFE_MODULE_ATTRIBUTE_IDS = ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG']
const CAPELLAN_AFFILIATION_LANGUAGE_IDS = ['Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English']
const CAPELLAN_SECONDARY_LANGUAGE_IDS = ['Russian', 'Cantonese', 'Vietnamese', 'English']

function validateChoiceGrantBalance(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const state = character.creation.lifeModules!
  const seen = new Set<string>()
  for (const requirement of state.choiceGrantRequirements) {
    const key = `${requirement.moduleId}/${requirement.awardId}`
    let module: LifeModuleDefinition | undefined
    try { module = getLifeModule(requirement.moduleId) } catch { /* handled below */ }
    const award = module?.awards.find((entry) => entry.id === requirement.awardId)
    const catalogCount = award ? lifeModuleAwardGrantCount(award) : null
    if (seen.has(key) || !state.selectedModuleIds.includes(requirement.moduleId) || catalogCount === null || requirement.requiredGrants !== catalogCount) {
      issues.push(issue('life-modules.choice-requirement.malformed', 'creation.lifeModules.choiceGrantRequirements', 'Choice grant requirements must uniquely match selected catalog awards.'))
      continue
    }
    seen.add(key)
    const resolved = state.resolvedAwards.filter((entry) => entry.moduleId === requirement.moduleId && entry.awardId === requirement.awardId).length
    const matchingPending = state.pendingAwards.filter((entry) => entry.moduleId === requirement.moduleId && entry.awardId === requirement.awardId)
    const pending = matchingPending.reduce((total, entry) => total + entry.remainingGrants, 0)
    if (resolved + pending !== requirement.requiredGrants || matchingPending.length > 1) {
      issues.push(issue('life-modules.choice-count.malformed', 'creation.lifeModules', `${module?.displayName ?? requirement.moduleId}: ${requirement.awardId} does not preserve its required choice count.`))
    }
  }
  if (state.awardResolutionVersion === 1) {
    for (const moduleId of state.selectedModuleIds) {
      let module: LifeModuleDefinition | undefined
      try { module = getLifeModule(moduleId) } catch { continue }
      for (const award of module.awards) {
        if (lifeModuleAwardGrantCount(award) !== null && !seen.has(`${moduleId}/${award.id}`)) {
          issues.push(issue('life-modules.choice-requirement.missing', 'creation.lifeModules.choiceGrantRequirements', `${module.displayName}: ${award.id} is missing its required grant record.`))
        }
      }
    }
  } else if (state.awardResolutionVersion !== 0) {
    issues.push(issue('life-modules.award-resolution-version.unsupported', 'creation.lifeModules.awardResolutionVersion', 'Life Module award-resolution state version is unsupported.'))
  }
}

function lifeModuleAwardGrantCount(award: LifeModuleAward): number | null {
  if (award.kind === 'language-choice') return 1
  if (award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice' || award.kind === 'flexible-xp') return award.count
  return null
}

function lifeModuleDestinationKey(destination: { type: string; targetId: string; parameter?: { kind: string; value: string }; parameters?: Record<string, string | number | boolean> }): string {
  return `${destination.type}/${destination.targetId.toLowerCase()}/${destination.parameter?.kind.toLowerCase() ?? ''}/${destination.parameter?.value.toLowerCase() ?? ''}/${JSON.stringify(destination.parameters ?? {})}`
}

function validatePointBuy(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const pointBuy = character.creation.pointBuy
  if (!pointBuy?.source.sourceId || !pointBuy.costTableSource.sourceId) {
    issues.push(issue('point-buy.source.required', 'creation.pointBuy', 'Point Buy rules and XP-cost sources are required.'))
  }
  const { starting, remaining, allocated } = character.xp.creation
  if (!Number.isInteger(starting) || starting < 800) {
    issues.push(issue('point-buy.starting-xp.valid', 'xp.creation.starting', 'Point Buy starting XP must be a whole number of at least 800.'))
  }
  const attributeIds = new Set<string>()
  if (character.attributes.length !== 8) {
    issues.push(issue('point-buy.attributes.complete', 'attributes', 'Point Buy requires all eight Attributes.'))
  }
  character.attributes.forEach((entry, index) => {
    const maximum = POINT_BUY_ATTRIBUTE_MAXIMUMS[entry.attributeId]
    if (attributeIds.has(entry.attributeId)) {
      issues.push(issue('point-buy.attribute.duplicate', `attributes.${index}.attributeId`, 'Point Buy Attribute IDs must be unique.'))
    }
    attributeIds.add(entry.attributeId)
    if (
      maximum === undefined ||
      !Number.isInteger(entry.purchasedLevel) ||
      (entry.purchasedLevel ?? 0) < 1 ||
      (entry.purchasedLevel ?? 0) > maximum ||
      entry.accumulatedXp !== (entry.purchasedLevel ?? 0) * 100
    ) {
      issues.push(issue('point-buy.attribute.valid', `attributes.${index}`, 'Point Buy Attribute level or XP is malformed.'))
    }
  })
  character.skills.forEach((entry, index) => {
    if (!entry.address.skillId || (entry.address.parameter && !entry.address.parameter.value.trim())) {
      issues.push(issue('point-buy.skill.address.valid', `skills.${index}.address`, 'Point Buy Skill/subskill address is malformed.'))
    }
    try {
      const definition = getPointBuySkill(entry.address.skillId)
      if (definition.parameter?.required && !entry.address.parameter?.value.trim()) {
        issues.push(issue('point-buy.skill.subskill.required', `skills.${index}.address.parameter`, `${definition.displayName} requires a concrete subskill.`))
      }
      if (!definition.parameter && entry.address.parameter) {
        issues.push(issue('point-buy.skill.subskill.prohibited', `skills.${index}.address.parameter`, `${definition.displayName} does not accept a subskill.`))
      }
      if (entry.accumulatedXp !== standardSkillXpCost(entry.level)) {
        issues.push(issue('point-buy.skill.xp.valid', `skills.${index}.accumulatedXp`, 'Point Buy Skill XP does not match its standard level cost.'))
      }
    } catch (error) {
      issues.push(issue('point-buy.skill.valid', `skills.${index}`, error instanceof Error ? error.message : 'Point Buy Skill is malformed.'))
    }
  })
  character.traits.forEach((entry, index) => {
    if (
      !entry.traitId ||
      !Number.isInteger(entry.attainedTp) ||
      entry.attainedTp === 0 ||
      entry.accumulatedXp !== (entry.attainedTp ?? 0) * 100 ||
      !entry.active
    ) {
      issues.push(issue('point-buy.trait.valid', `traits.${index}`, 'Point Buy Trait purchase is malformed.'))
    }
    try {
      const definition = getPointBuyTrait(entry.traitId)
      if (!definition.allowedTp.includes(entry.attainedTp ?? 0)) {
        issues.push(issue('point-buy.trait.tp.valid', `traits.${index}.attainedTp`, `${definition.displayName} TP is outside the Point Buy v0.1 catalog range.`))
      }
      if (definition.parameter?.required) {
        const value = entry.parameters[definition.parameter.key]
        if (typeof value !== 'string' || !value.trim()) {
          issues.push(issue('point-buy.trait.parameter.required', `traits.${index}.parameters`, `${definition.displayName} requires a concrete ${definition.parameter.label.toLowerCase()}.`))
        }
      }
    } catch (error) {
      issues.push(issue('point-buy.trait.catalog.valid', `traits.${index}.traitId`, error instanceof Error ? error.message : 'Point Buy Trait is malformed.'))
    }
  })
  const calculatedAllocated = calculatePointBuyAllocatedXp(character)
  if (allocated !== calculatedAllocated || remaining !== starting - calculatedAllocated) {
    issues.push(issue('point-buy.xp.balance', 'xp.creation', 'Point Buy allocated and remaining XP do not reconcile with the ledgers.'))
  }
  if (remaining < 0) {
    issues.push(issue('point-buy.xp.overspent', 'xp.creation.remaining', 'Point Buy creation XP cannot be overspent.'))
  }
  const negativeCeiling = Math.floor(starting * 0.1)
  if (calculateNegativeTraitXp(character) > negativeCeiling) {
    issues.push(issue('point-buy.negative-trait-xp.limit', 'traits', `Negative Traits may generate at most ${negativeCeiling} XP.`))
  }
  if (remaining > 0) {
    issues.push(issue('point-buy.xp.unspent', 'xp.creation.remaining', 'Creation XP remains unspent; the character is a draft and cannot enter play.', { severity: 'warning' }))
  }
  if (character.creation.status === 'finalized' && remaining !== 0) {
    issues.push(issue('point-buy.finalization.xp', 'creation.status', 'A finalized Point Buy character must have no unspent creation XP.'))
  }
  const hasPerception = character.skills.some((entry) => entry.address.skillId === 'skill.perception' && entry.level !== null)
  const languages = character.skills.filter((entry) => entry.address.skillId === 'skill.language' && entry.level !== null)
  const hasEnglish = languages.some((entry) => entry.address.parameter?.value.toLowerCase() === 'english')
  if (!hasPerception || !hasEnglish || languages.length < 2) {
    issues.push(issue('point-buy.required-skills.outstanding', 'skills', 'Required Skills remain outstanding: Perception +0, Language/English +0, and another affiliation language +0.', { severity: 'warning' }))
  }
}
