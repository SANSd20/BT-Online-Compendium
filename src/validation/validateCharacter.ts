import type { CharacterDefinition } from '../domain/character/model'
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

  return {
    valid: !issues.some((item) => item.severity === 'error'),
    issues,
  }
}

