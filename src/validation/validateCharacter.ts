import type { CharacterDefinition } from '../domain/character/model'
import {
  POINT_BUY_ATTRIBUTE_MAXIMUMS,
  getPointBuySkill,
  getPointBuyTrait,
  standardSkillXpCost,
} from '../domain/pointBuy/catalog'
import { calculateNegativeTraitXp, calculatePointBuyAllocatedXp } from '../domain/pointBuy/calculations'
import type { ValidationIssue, ValidationResult } from './model'

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
    if ((character.creation.method === 'archetype' || character.creation.method === 'point-buy') && awards.length === 0) {
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
