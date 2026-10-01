import type { CharacterDefinition } from '../../domain/character/model'
import {
  AGITATOR_ID,
  BACK_WOODS_ID,
  BLUE_COLLAR_ID,
  STAGE_2_BACK_WOODS_ID,
  STAGE_2_HIGH_SCHOOL_ID,
  TECHNICAL_COLLEGE_ID,
} from '../../domain/lifeModules/catalog'
import { TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID } from '../../domain/skillFields/catalog'
import { applyStage1Module, applyStage2Module, applyStage4Module, applyTechnicalCollege } from '../../engine/lifeModuleEngine'

export type SupportedStageModuleId =
  | typeof BLUE_COLLAR_ID
  | typeof BACK_WOODS_ID
  | typeof STAGE_2_BACK_WOODS_ID
  | typeof STAGE_2_HIGH_SCHOOL_ID
  | typeof TECHNICAL_COLLEGE_ID
  | typeof AGITATOR_ID

export function applySupportedStageModule(character: CharacterDefinition, moduleId: SupportedStageModuleId): CharacterDefinition {
  switch (moduleId) {
    case BLUE_COLLAR_ID:
    case BACK_WOODS_ID:
      return applyStage1Module(character, moduleId)
    case STAGE_2_BACK_WOODS_ID:
    case STAGE_2_HIGH_SCHOOL_ID:
      return applyStage2Module(character, moduleId)
    case TECHNICAL_COLLEGE_ID:
      return applyTechnicalCollege(character, [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID])
    case AGITATOR_ID:
      return applyStage4Module(character, moduleId)
  }
}

export function previewSupportedStageModule(character: CharacterDefinition, moduleId: SupportedStageModuleId | ''): CharacterDefinition | null {
  if (!moduleId) return null
  try {
    return applySupportedStageModule(character, moduleId)
  } catch {
    return null
  }
}
