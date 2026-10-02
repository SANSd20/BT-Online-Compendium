import type { CharacterDefinition, ResolvedLifeModuleDestination } from '../character/model'
import type { LifeModuleDefinition, LifeModulePrerequisite } from '../lifeModules/model'
import { deriveAttributeLevel, deriveStandardSkillLevel, deriveTraitPoints, standardSkillThreshold } from '../lifeModules/finalReview'
import { getSkillField, SKILL_FIELD_CATALOG } from './catalog'

export const SUPPORTED_MASTER_SKILL_FIELD_GOALS = SKILL_FIELD_CATALOG

export type MasterSkillFieldGoalRequirementKind = 'attribute' | 'trait' | 'skill' | 'skill-field' | 'structural'

export interface MasterSkillFieldGoalRequirementStatus {
  id: string
  kind: MasterSkillFieldGoalRequirementKind
  label: string
  satisfied: boolean
  current: string
  xpRequired: number | null
  destination?: ResolvedLifeModuleDestination
}

export interface MasterSkillFieldGoalStatus {
  fieldId: string
  displayName: string
  satisfied: number
  total: number
  requirements: MasterSkillFieldGoalRequirementStatus[]
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
  const field = getSkillField(fieldId)
  const requirements = [
    ...field.prerequisites.map((entry) => prerequisiteStatus(character, entry)),
    ...field.componentSkills.map((entry) => {
      const skill = character.skills.find((candidate) => skillKey(candidate.address) === skillKey(entry.address))
      const currentLevel = skill?.level ?? deriveStandardSkillLevel(skill?.accumulatedXp ?? 0)
      const satisfied = currentLevel !== null
      const currentXp = skill?.accumulatedXp ?? 0
      return {
        id: `${field.id}.skill.${skillKey(entry.address)}`,
        kind: 'skill' as const,
        label: entry.displayName,
        satisfied,
        current: satisfied ? `Level +${currentLevel}` : `${currentXp} XP (untrained)`,
        xpRequired: skill ? Math.max(0, standardSkillThreshold(0) - currentXp) : null,
        ...(skill ? { destination: { type: 'skill' as const, targetId: entry.address.skillId, displayName: entry.displayName, ...(entry.address.parameter ? { parameter: { ...entry.address.parameter } } : {}) } } : {}),
      }
    }),
  ]
  return { fieldId, displayName: field.displayName, satisfied: requirements.filter((entry) => entry.satisfied).length, total: requirements.length, requirements }
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
    }
  }
  return [...messages]
}

function prerequisiteStatus(character: CharacterDefinition, prerequisite: LifeModulePrerequisite): MasterSkillFieldGoalRequirementStatus {
  if (prerequisite.kind === 'attribute-minimum') {
    const entry = character.attributes.find((candidate) => candidate.attributeId === prerequisite.attributeId)
    const xp = entry?.accumulatedXp ?? 0
    const level = deriveAttributeLevel(xp) ?? 0
    return { id: prerequisite.id, kind: 'attribute', label: prerequisite.description, satisfied: level >= prerequisite.minimum, current: `${prerequisite.attributeId} ${level}`, xpRequired: Math.max(0, prerequisite.minimum * 100 - xp), destination: { type: 'attribute', targetId: prerequisite.attributeId, displayName: prerequisite.attributeId } }
  }
  if (prerequisite.kind === 'trait') {
    const entry = character.traits.find((candidate) => candidate.traitId === prerequisite.traitId)
    const tp = entry ? deriveTraitPoints(entry.accumulatedXp) : null
    return { id: prerequisite.id, kind: 'trait', label: prerequisite.description, satisfied: (tp ?? 0) > 0, current: tp ? `+${tp} TP` : 'Not active', xpRequired: entry ? Math.max(0, 100 - entry.accumulatedXp) : null, ...(entry ? { destination: { type: 'trait', targetId: entry.traitId, displayName: entry.displayName ?? entry.traitId, parameters: { ...entry.parameters } } as ResolvedLifeModuleDestination } : {}) }
  }
  if (prerequisite.kind === 'skill-field') {
    const owned = character.creation.lifeModules?.selectedSkillFields.find((entry) => prerequisite.fieldIds.includes(entry.fieldId))
    return { id: prerequisite.id, kind: 'skill-field', label: prerequisite.description, satisfied: Boolean(owned), current: owned ? owned.displayName : 'Required Field not completed', xpRequired: null }
  }
  const satisfied = prerequisite.kind === 'affiliation'
    ? character.affiliations.some((entry) => !prerequisite.affiliationId || entry.affiliationId === prerequisite.affiliationId)
    : prerequisite.kind === 'trait-absent'
      ? !character.traits.some((entry) => entry.traitId === prerequisite.traitId && entry.active)
      : false
  return { id: prerequisite.id, kind: 'structural', label: prerequisite.description, satisfied, current: satisfied ? 'Satisfied' : 'Not satisfied', xpRequired: null }
}

function skillKey(address: { skillId: string; parameter?: { value: string } }): string {
  return `${address.skillId}/${address.parameter?.value.toLowerCase() ?? ''}`
}
