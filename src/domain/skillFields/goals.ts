import type { CharacterDefinition, ResolvedLifeModuleDestination } from '../character/model'
import type { LifeModuleDefinition } from '../lifeModules/model'
import { deriveAttributeLevel, deriveStandardSkillLevel, deriveTraitPoints, standardSkillThreshold } from '../lifeModules/finalReview'
import { getMasterSkillFieldGoal, MASTER_SKILL_FIELD_GOAL_CATALOG, type MasterSkillFieldGoalPrerequisite } from './goalCatalog'

export const SUPPORTED_MASTER_SKILL_FIELD_GOALS = MASTER_SKILL_FIELD_GOAL_CATALOG

export type MasterSkillFieldGoalRequirementKind = 'attribute' | 'trait' | 'skill' | 'variable-skill' | 'skill-field' | 'structural'

export interface MasterSkillFieldGoalRequirementStatus {
  id: string
  kind: MasterSkillFieldGoalRequirementKind
  section: 'prerequisite' | 'field-skill'
  label: string
  satisfied: boolean
  current: string
  xpRequired: number | null
  skillId?: string
  destination?: ResolvedLifeModuleDestination
}

export interface MasterSkillFieldGoalStatus {
  fieldId: string
  displayName: string
  satisfied: number
  total: number
  requirements: MasterSkillFieldGoalRequirementStatus[]
  prerequisiteFields: MasterSkillFieldReferenceStatus[]
}

export interface MasterSkillFieldReferenceStatus {
  fieldId: string
  displayName: string
  acquired: boolean
  cycle: boolean
  requirements: MasterSkillFieldGoalRequirementStatus[]
  prerequisiteFields: MasterSkillFieldReferenceStatus[]
}

export function setMasterSkillFieldGoal(character: CharacterDefinition, fieldId: string | null): CharacterDefinition {
  const next = structuredClone(character)
  const state = next.creation.lifeModules
  if (!state) throw new Error('Master Skill Field goals are currently supported for Life Modules characters.')
  if (fieldId && !SUPPORTED_MASTER_SKILL_FIELD_GOALS.some((entry) => entry.id === fieldId)) throw new Error(`Unsupported Master Skill Field goal: ${fieldId}`)
  if (fieldId) state.masterSkillFieldGoalId = fieldId
  else delete state.masterSkillFieldGoalId
  next.updatedAt = new Date().toISOString()
  return next
}

export function masterSkillFieldGoalStatus(character: CharacterDefinition): MasterSkillFieldGoalStatus | null {
  const fieldId = character.creation.lifeModules?.masterSkillFieldGoalId
  if (!fieldId) return null
  const field = getMasterSkillFieldGoal(fieldId)
  const requirements = fieldRequirementsStatus(character, field)
  return {
    fieldId,
    displayName: field.displayName,
    satisfied: requirements.filter((entry) => entry.satisfied).length,
    total: requirements.length,
    requirements,
    prerequisiteFields: prerequisiteFieldIds(field.prerequisites).map((id) => masterSkillFieldReferenceStatus(character, id, [field.id])),
  }
}

export function masterSkillFieldReferenceStatus(character: CharacterDefinition, fieldId: string, ancestorFieldIds: readonly string[] = []): MasterSkillFieldReferenceStatus {
  const field = getMasterSkillFieldGoal(fieldId)
  const acquired = Boolean(character.creation.lifeModules?.selectedSkillFields.some((entry) => entry.fieldId === fieldId))
  if (ancestorFieldIds.includes(fieldId)) {
    return { fieldId, displayName: field.displayName, acquired, cycle: true, requirements: [], prerequisiteFields: [] }
  }
  const requirements = fieldRequirementsStatus(character, field)
  const ancestors = [...ancestorFieldIds, fieldId]
  return {
    fieldId,
    displayName: field.displayName,
    acquired,
    cycle: false,
    requirements,
    prerequisiteFields: prerequisiteFieldIds(field.prerequisites).map((id) => masterSkillFieldReferenceStatus(character, id, ancestors)),
  }
}

export function lifeModuleGoalContributions(character: CharacterDefinition, module: LifeModuleDefinition): string[] {
  const status = masterSkillFieldGoalStatus(character)
  if (!status) return []
  const unmet = status.requirements.filter((entry) => !entry.satisfied)
  const messages = new Set<string>()
  for (const award of module.awards) {
    if (award.kind !== 'fixed' || award.xp <= 0) continue
    for (const requirement of unmet) {
      if (requirement.kind === 'attribute' && award.destination.type === 'attribute' && requirement.destination?.targetId === award.destination.attributeId) {
        messages.add(`Provides ${award.destination.attributeId} XP toward ${requirement.label}`)
      }
      if (requirement.kind === 'trait' && award.destination.type === 'trait' && requirement.destination?.targetId === award.destination.traitId) {
        messages.add(`Provides ${award.destination.displayName} XP toward ${requirement.label}`)
      }
      if (requirement.kind === 'skill' && award.destination.type === 'skill' && requirement.destination && skillKey(award.destination.address) === `${requirement.destination.targetId}/${requirement.destination.parameter?.value.toLowerCase() ?? ''}`) {
        messages.add(`Provides ${award.destination.displayName}`)
      }
      if (requirement.kind === 'variable-skill' && award.destination.type === 'skill' && award.destination.address.skillId === requirement.skillId) {
        messages.add(`Provides ${award.destination.displayName} toward ${requirement.label}`)
      }
    }
  }
  return [...messages]
}

function prerequisiteStatus(character: CharacterDefinition, prerequisite: MasterSkillFieldGoalPrerequisite): MasterSkillFieldGoalRequirementStatus {
  if (prerequisite.kind === 'attribute-minimum') {
    const entry = character.attributes.find((candidate) => candidate.attributeId === prerequisite.attributeId)
    const xp = entry?.accumulatedXp ?? 0
    const level = deriveAttributeLevel(xp) ?? 0
    return { id: prerequisite.id, kind: 'attribute', section: 'prerequisite', label: prerequisite.label, satisfied: level >= prerequisite.minimum, current: `${prerequisite.attributeId} ${level}`, xpRequired: Math.max(0, prerequisite.minimum * 100 - xp), destination: { type: 'attribute', targetId: prerequisite.attributeId, displayName: prerequisite.attributeId } }
  }
  if (prerequisite.kind === 'trait') {
    const entry = character.traits.find((candidate) => candidate.traitId === prerequisite.traitId)
    const tp = entry ? deriveTraitPoints(entry.accumulatedXp) : null
    return { id: prerequisite.id, kind: 'trait', section: 'prerequisite', label: prerequisite.label, satisfied: (tp ?? 0) > 0, current: tp ? `+${tp} TP` : 'Not active', xpRequired: entry ? Math.max(0, 100 - entry.accumulatedXp) : null, ...(entry ? { destination: { type: 'trait', targetId: entry.traitId, displayName: entry.displayName ?? entry.traitId, parameters: { ...entry.parameters } } as ResolvedLifeModuleDestination } : {}) }
  }
  if (prerequisite.kind === 'skill-field') {
    const owned = character.creation.lifeModules?.selectedSkillFields.find((entry) => prerequisite.fieldIds.includes(entry.fieldId))
    return { id: prerequisite.id, kind: 'skill-field', section: 'prerequisite', label: prerequisite.label, satisfied: Boolean(owned), current: owned ? owned.displayName : 'Required Field not completed', xpRequired: null }
  }
  if (prerequisite.kind === 'alternative') {
    const satisfied = prerequisite.options.some((option) => option.every((entry) => prerequisiteSatisfied(character, entry)))
    return { id: prerequisite.id, kind: 'structural', section: 'prerequisite', label: prerequisite.label, satisfied, current: satisfied ? 'Satisfied' : 'Alternative prerequisite path not satisfied', xpRequired: null }
  }
  const satisfied = prerequisite.kind === 'affiliation'
    ? character.affiliations.some((entry) => !prerequisite.affiliationIds || prerequisite.affiliationIds.includes(entry.affiliationId))
    : prerequisite.kind === 'trait-absent'
      ? !character.traits.some((entry) => entry.traitId === prerequisite.traitId && entry.active)
      : false
  return { id: prerequisite.id, kind: 'structural', section: 'prerequisite', label: prerequisite.label, satisfied, current: satisfied ? 'Satisfied' : prerequisite.kind === 'phenotype' ? 'Required phenotype not established' : 'Not satisfied', xpRequired: null }
}

function fieldRequirementsStatus(character: CharacterDefinition, field: ReturnType<typeof getMasterSkillFieldGoal>): MasterSkillFieldGoalRequirementStatus[] {
  return [
    ...field.prerequisites.map((entry) => prerequisiteStatus(character, entry)),
    ...field.fieldSkills.map((entry) => fieldSkillStatus(character, field.id, entry)),
  ]
}

function fieldSkillStatus(character: CharacterDefinition, fieldId: string, entry: ReturnType<typeof getMasterSkillFieldGoal>['fieldSkills'][number]): MasterSkillFieldGoalRequirementStatus {
  const skill = character.skills.find((candidate) => entry.variable ? candidate.address.skillId === entry.skillId : skillKey(candidate.address) === skillKey({ skillId: entry.skillId, ...(entry.parameter ? { parameter: { value: entry.parameter } } : {}) }))
  const currentLevel = skill?.level ?? deriveStandardSkillLevel(skill?.accumulatedXp ?? 0)
  const satisfied = currentLevel !== null
  const currentXp = skill?.accumulatedXp ?? 0
  return {
    id: `${fieldId}.${entry.id}`,
    kind: entry.variable ? 'variable-skill' : 'skill',
    section: 'field-skill',
    label: entry.displayName,
    satisfied,
    current: satisfied ? `${skill?.displayName ?? entry.displayName}: Level +${currentLevel} · ${currentXp} XP` : entry.variable ? 'Source-defined choice not yet satisfied' : `${currentXp} XP (untrained)`,
    xpRequired: skill && !entry.variable ? Math.max(0, standardSkillThreshold(0) - currentXp) : null,
    skillId: entry.skillId,
    ...(skill && !entry.variable ? { destination: { type: 'skill' as const, targetId: entry.skillId, displayName: entry.displayName, ...(entry.parameter ? { parameter: { kind: 'subskill' as const, value: entry.parameter } } : {}) } } : {}),
  }
}

function prerequisiteFieldIds(prerequisites: readonly MasterSkillFieldGoalPrerequisite[]): string[] {
  const ids = prerequisites.flatMap((entry): string[] => {
    if (entry.kind === 'skill-field') return entry.fieldIds
    if (entry.kind === 'alternative') return entry.options.flatMap((option) => prerequisiteFieldIds(option))
    return []
  })
  return [...new Set(ids)]
}

function prerequisiteSatisfied(character: CharacterDefinition, prerequisite: MasterSkillFieldGoalPrerequisite): boolean {
  if (prerequisite.kind === 'attribute-minimum') {
    const xp = character.attributes.find((entry) => entry.attributeId === prerequisite.attributeId)?.accumulatedXp ?? 0
    return (deriveAttributeLevel(xp) ?? 0) >= prerequisite.minimum
  }
  if (prerequisite.kind === 'trait') return character.traits.some((entry) => entry.traitId === prerequisite.traitId && entry.active)
  if (prerequisite.kind === 'trait-absent') return !character.traits.some((entry) => entry.traitId === prerequisite.traitId && entry.active)
  if (prerequisite.kind === 'skill-field') return Boolean(character.creation.lifeModules?.selectedSkillFields.some((entry) => prerequisite.fieldIds.includes(entry.fieldId)))
  if (prerequisite.kind === 'affiliation') return character.affiliations.some((entry) => !prerequisite.affiliationIds || prerequisite.affiliationIds.includes(entry.affiliationId))
  if (prerequisite.kind === 'alternative') return prerequisite.options.some((option) => option.every((entry) => prerequisiteSatisfied(character, entry)))
  return false
}

function skillKey(address: { skillId: string; parameter?: { value: string } }): string {
  return `${address.skillId}/${address.parameter?.value.toLowerCase() ?? ''}`
}
