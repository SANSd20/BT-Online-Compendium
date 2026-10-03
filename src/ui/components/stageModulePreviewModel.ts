import type { CharacterDefinition } from '../../domain/character/model'
import {
  AGITATOR_ID,
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
  TECHNICAL_COLLEGE_ID,
} from '../../domain/lifeModules/catalog'
import { getSkillField, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID } from '../../domain/skillFields/catalog'
import { applyStage1Module, applyStage2Module, applyStage4Module, applyTechnicalCollege } from '../../engine/lifeModuleEngine'

export type SupportedStageModuleId =
  | typeof BLUE_COLLAR_ID
  | typeof BACK_WOODS_ID
  | typeof STAGE_2_BACK_WOODS_ID
  | typeof STAGE_2_HIGH_SCHOOL_ID
  | typeof TECHNICAL_COLLEGE_ID
  | typeof AGITATOR_ID

export interface Stage3FieldSelectionStatus {
  state: 'available' | 'final-prerequisites-outstanding' | 'unavailable'
  reasons: string[]
}

export function applySupportedStageModule(character: CharacterDefinition, moduleId: SupportedStageModuleId, stage3FieldIds?: string[]): CharacterDefinition {
  switch (moduleId) {
    case BLUE_COLLAR_ID:
    case BACK_WOODS_ID:
      return applyStage1Module(character, moduleId)
    case STAGE_2_BACK_WOODS_ID:
    case STAGE_2_HIGH_SCHOOL_ID:
      return applyStage2Module(character, moduleId)
    case TECHNICAL_COLLEGE_ID:
      return applyTechnicalCollege(character, stage3FieldIds ?? [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID])
    case AGITATOR_ID:
      return applyStage4Module(character, moduleId)
  }
}

export function previewSupportedStageModule(character: CharacterDefinition, moduleId: SupportedStageModuleId | '', stage3FieldIds?: string[]): CharacterDefinition | null {
  if (!moduleId) return null
  try {
    return applySupportedStageModule(character, moduleId, stage3FieldIds)
  } catch {
    return null
  }
}

export function stage3FieldSelectionStatus(character: CharacterDefinition, fieldId: string, selectedFieldIds: string[]): Stage3FieldSelectionStatus {
  const field = getSkillField(fieldId)
  const proposed = field.category === 'basic'
    ? [fieldId, ...selectedFieldIds.filter((id) => getSkillField(id).category !== 'basic')]
    : selectedFieldIds.includes(fieldId) ? selectedFieldIds : [...selectedFieldIds, fieldId]
  const candidate = previewSupportedStageModule(character, TECHNICAL_COLLEGE_ID, proposed)
  if (!candidate) return { state: 'unavailable', reasons: ['Technical College selection limits are not satisfied.'] }
  const outstanding = candidate.creation.lifeModules!.prerequisiteIssues.filter((issue) => issue.moduleId === fieldId && issue.status === 'outstanding')
  const blockingIds = new Set(field.prerequisites.filter((entry) => entry.kind === 'skill-field').map((entry) => entry.id))
  return {
    state: outstanding.some((issue) => blockingIds.has(issue.prerequisiteId))
      ? 'unavailable'
      : outstanding.length > 0 ? 'final-prerequisites-outstanding' : 'available',
    reasons: outstanding.map((issue) => issue.description),
  }
}
