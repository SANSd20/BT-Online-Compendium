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
    if (selectedIds.has(entry.moduleId)) issues.push(issue('life-modules.module.duplicate', `lifeModuleHistory.${index}.moduleId`, 'A Life Module cannot be selected more than once in Slice 4.'))
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
  state.pendingAwards.forEach((award, index) => {
    if (
      !selectedIds.has(award.moduleId) ||
      !award.awardId ||
      !Number.isFinite(award.xpPerGrant) ||
      !Number.isInteger(award.remainingGrants) ||
      award.remainingGrants <= 0 ||
      award.allowedTargetTypes.length === 0 ||
      !award.source.sourceId
    ) {
      issues.push(issue('life-modules.pending-award.malformed', `creation.lifeModules.pendingAwards.${index}`, 'Pending Life Module award state is malformed.'))
    }
  })
  if (state.pendingAwards.length > 0) issues.push(issue('life-modules.awards.unresolved', 'creation.lifeModules.pendingAwards', `${state.pendingAwards.length} source-bound award allocation${state.pendingAwards.length === 1 ? ' remains' : 's remain'} unresolved.`, { severity: 'warning' }))
  if (state.prerequisiteIssues.some((entry) => entry.status === 'outstanding')) {
    issues.push(issue('life-modules.prerequisites.outstanding', 'creation.lifeModules.prerequisiteIssues', 'One or more Life Module prerequisites remain outstanding for final validation.', { severity: 'warning', kind: 'prerequisite', gmOverrideAllowed: true }))
  }
  if (character.creation.status === 'finalized' && (state.pendingAwards.length > 0 || state.prerequisiteIssues.some((entry) => entry.status === 'outstanding'))) {
    issues.push(issue('life-modules.finalization.blocked', 'creation.status', 'A Life Module character cannot be finalized with unresolved awards or outstanding prerequisites.'))
  }
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
