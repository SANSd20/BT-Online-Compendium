import type { CharacterDefinition } from '../../domain/character/model'
import {
  AGITATOR_ID,
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  getLifeModule,
  INTELLIGENCE_OPERATIVE_TRAINING_ID,
  MILITARY_ACADEMY_ID,
  MILITARY_ENLISTMENT_ID,
  OFFICER_TRAINING_SCHOOL_ID,
  POLICE_ACADEMY_ID,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
  TECHNICAL_COLLEGE_ID,
  TRADE_SCHOOL_ID,
  UNIVERSITY_ID,
} from '../../domain/lifeModules/catalog'
import { BASIC_TRAINING_FIELD_ID, getSkillField, INFANTRY_FIELD_ID, JOURNALIST_FIELD_ID, MERCHANT_FIELD_ID, OFFICER_FIELD_ID, POLICE_OFFICER_FIELD_ID, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID } from '../../domain/skillFields/catalog'
import { applyStage1Module, applyStage2Module, applyStage3School, applyStage4Module } from '../../engine/lifeModuleEngine'

export type SupportedStageModuleId =
  | typeof BLUE_COLLAR_ID
  | typeof BACK_WOODS_ID
  | typeof STAGE_2_BACK_WOODS_ID
  | typeof STAGE_2_HIGH_SCHOOL_ID
  | typeof TECHNICAL_COLLEGE_ID
  | typeof TRADE_SCHOOL_ID
  | typeof UNIVERSITY_ID
  | typeof POLICE_ACADEMY_ID
  | typeof INTELLIGENCE_OPERATIVE_TRAINING_ID
  | typeof MILITARY_ACADEMY_ID
  | typeof MILITARY_ENLISTMENT_ID
  | typeof OFFICER_TRAINING_SCHOOL_ID
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
    case TRADE_SCHOOL_ID:
    case UNIVERSITY_ID:
    case POLICE_ACADEMY_ID:
    case INTELLIGENCE_OPERATIVE_TRAINING_ID:
    case MILITARY_ACADEMY_ID:
    case MILITARY_ENLISTMENT_ID:
    case OFFICER_TRAINING_SCHOOL_ID:
      return applyStage3School(character, moduleId, stage3FieldIds ?? defaultStage3FieldIds(moduleId))
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

export function defaultStage3FieldIds(moduleId: typeof TECHNICAL_COLLEGE_ID | typeof TRADE_SCHOOL_ID | typeof UNIVERSITY_ID | typeof POLICE_ACADEMY_ID | typeof INTELLIGENCE_OPERATIVE_TRAINING_ID | typeof MILITARY_ACADEMY_ID | typeof MILITARY_ENLISTMENT_ID | typeof OFFICER_TRAINING_SCHOOL_ID): string[] {
  if (moduleId === TECHNICAL_COLLEGE_ID) return [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID]
  if (moduleId === TRADE_SCHOOL_ID) return [MERCHANT_FIELD_ID, JOURNALIST_FIELD_ID]
  if (moduleId === UNIVERSITY_ID) return [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID]
  if (moduleId === POLICE_ACADEMY_ID) return [POLICE_OFFICER_FIELD_ID, TECHNICIAN_MILITARY_FIELD_ID]
  if (moduleId === INTELLIGENCE_OPERATIVE_TRAINING_ID) return [BASIC_TRAINING_FIELD_ID, POLICE_OFFICER_FIELD_ID]
  if (moduleId === OFFICER_TRAINING_SCHOOL_ID) return [OFFICER_FIELD_ID]
  return [BASIC_TRAINING_FIELD_ID, INFANTRY_FIELD_ID]
}

export function stage3FieldSelectionStatus(character: CharacterDefinition, moduleId: typeof TECHNICAL_COLLEGE_ID | typeof TRADE_SCHOOL_ID | typeof UNIVERSITY_ID | typeof POLICE_ACADEMY_ID | typeof INTELLIGENCE_OPERATIVE_TRAINING_ID | typeof MILITARY_ACADEMY_ID | typeof MILITARY_ENLISTMENT_ID | typeof OFFICER_TRAINING_SCHOOL_ID, fieldId: string, selectedFieldIds: string[]): Stage3FieldSelectionStatus {
  const field = getSkillField(fieldId)
  const offers = getLifeModule(moduleId).skillFieldSelection!.offers
  const offeredCategory = offers.find((entry) => entry.fieldId === fieldId)!.category
  const proposed = offeredCategory === 'basic'
    ? [fieldId, ...selectedFieldIds.filter((id) => offers.find((entry) => entry.fieldId === id)?.category !== 'basic')]
    : selectedFieldIds.includes(fieldId) ? selectedFieldIds : [...selectedFieldIds, fieldId]
  const candidate = previewSupportedStageModule(character, moduleId, proposed)
  if (!candidate) return { state: 'unavailable', reasons: ['School selection limits are not satisfied.'] }
  const outstanding = candidate.creation.lifeModules!.prerequisiteIssues.filter((issue) => issue.moduleId === fieldId && issue.status === 'outstanding')
  const blockingIds = new Set(moduleId === OFFICER_TRAINING_SCHOOL_ID ? [] : field.prerequisites.filter((entry) => entry.kind === 'skill-field').map((entry) => entry.id))
  return {
    state: outstanding.some((issue) => blockingIds.has(issue.prerequisiteId))
      ? 'unavailable'
      : outstanding.length > 0 ? 'final-prerequisites-outstanding' : 'available',
    reasons: outstanding.map((issue) => issue.description),
  }
}
