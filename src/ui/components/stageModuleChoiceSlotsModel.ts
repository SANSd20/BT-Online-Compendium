import type { CharacterDefinition, PendingLifeModuleAward, ResolvedLifeModuleDestination } from '../../domain/character/model'
import { resolvePendingLifeModuleAward } from '../../engine/lifeModuleEngine'
import { applySupportedStageModule, type SupportedStageModuleId } from './stageModulePreviewModel'

export interface StageChoiceSlotValue {
  targetType: '' | ResolvedLifeModuleDestination['type']
  targetId: string
  parameter: string
  displayName: string
  xpAmount: number
}

export type StageChoiceSlotValues = Record<string, StageChoiceSlotValue[]>

export interface StageChoiceSlotPreview {
  character: CharacterDefinition
  pendingAwards: PendingLifeModuleAward[]
  complete: boolean
  error: string | null
}

export function stageChoiceSlotCount(pending: PendingLifeModuleAward, values: StageChoiceSlotValues): number {
  if (pending.allocationMode !== 'pool') return pending.remainingGrants
  return Math.max(1, values[pending.awardId]?.length ?? 0)
}

export function previewStageModuleChoiceSlots(
  character: CharacterDefinition,
  moduleId: SupportedStageModuleId | '',
  values: StageChoiceSlotValues,
): StageChoiceSlotPreview | null {
  if (!moduleId) return null
  let preview = applySupportedStageModule(character, moduleId)
  const modulePending = () => preview.creation.lifeModules!.pendingAwards.filter((entry) => entry.moduleId === moduleId)
  const initialAwards = modulePending().map((entry) => structuredClone(entry))

  try {
    for (const pending of initialAwards) {
      for (const value of values[pending.awardId] ?? []) {
        if (!slotValueComplete(value)) continue
        const current = modulePending().find((entry) => entry.awardId === pending.awardId)
        if (!current) throw new Error(`${pending.description} has more filled slots than required.`)
        preview = resolvePendingLifeModuleAward(
          preview,
          current.id,
          toDestination(value),
          current.allocationMode === 'pool' ? value.xpAmount : undefined,
        )
      }
    }
    return { character: preview, pendingAwards: modulePending(), complete: modulePending().length === 0, error: null }
  } catch (error) {
    return {
      character: preview,
      pendingAwards: modulePending(),
      complete: false,
      error: error instanceof Error ? error.message : 'The selected choice slots are invalid.',
    }
  }
}

export function slotValueComplete(value: StageChoiceSlotValue | undefined): value is StageChoiceSlotValue {
  return Boolean(value?.targetType && value.targetId && Number.isInteger(value.xpAmount) && value.xpAmount !== 0)
}

export function emptyStageChoiceSlot(pending: PendingLifeModuleAward): StageChoiceSlotValue {
  return { targetType: '', targetId: '', parameter: '', displayName: '', xpAmount: pending.xpPerGrant }
}

function toDestination(value: StageChoiceSlotValue): ResolvedLifeModuleDestination {
  return {
    type: value.targetType as ResolvedLifeModuleDestination['type'],
    targetId: value.targetId,
    displayName: value.displayName,
    ...(value.parameter ? { parameter: { kind: 'subskill', value: value.parameter } } : {}),
  }
}
