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
  existingPendingAwards: PendingLifeModuleAward[]
  pendingAwards: PendingLifeModuleAward[]
  complete: boolean
  error: string | null
}

export interface StageChoicePoolProgress {
  assigned: number
  remaining: number
  overage: number
}

export function stageSlotPendingAwards(preview: StageChoiceSlotPreview | null): PendingLifeModuleAward[] {
  return preview ? [...preview.existingPendingAwards, ...preview.pendingAwards] : []
}

export function stageSlotContinueEnabled(preview: StageChoiceSlotPreview | null): boolean {
  return Boolean(preview && !preview.error && preview.complete && stageSlotPendingAwards(preview).length === 0)
}

export function stageChoiceSlotCount(pending: PendingLifeModuleAward, values: StageChoiceSlotValues): number {
  if (pending.allocationMode !== 'pool') return pending.remainingGrants
  return Math.max(1, values[pending.awardId]?.length ?? 0)
}

export function stageChoicePoolProgress(pending: PendingLifeModuleAward, values: readonly StageChoiceSlotValue[]): StageChoicePoolProgress {
  const assigned = values.filter(slotValueComplete).reduce((total, value) => total + value.xpAmount, 0)
  const limit = pending.remainingXp ?? 0
  return {
    assigned,
    remaining: Math.max(0, limit - assigned),
    overage: Math.max(0, assigned - limit),
  }
}

export function stageChoicePoolProgressLabel(progress: StageChoicePoolProgress): string {
  return progress.overage > 0
    ? `${progress.assigned} assigned · ${progress.overage} XP over limit`
    : `${progress.assigned} assigned · ${progress.remaining} remaining`
}

export function filterSiblingDestinationOptions<T extends { value: string }>(
  options: readonly T[],
  values: readonly StageChoiceSlotValue[],
  currentIndex: number,
  relatedSiblingValues: readonly StageChoiceSlotValue[] = [],
): T[] {
  const currentValue = optionValue(values[currentIndex])
  const siblingValues = new Set([
    ...values.flatMap((value, index) => index === currentIndex ? [] : [optionValue(value)]),
    ...relatedSiblingValues.map(optionValue),
  ].filter(Boolean))
  return options.filter((option) => option.value === currentValue || !siblingValues.has(option.value))
}

export function relatedStageChoiceSlotValues(
  pending: PendingLifeModuleAward,
  modulePendingAwards: readonly PendingLifeModuleAward[],
  values: StageChoiceSlotValues,
): StageChoiceSlotValue[] {
  if (!pending.requiredSkillId) return []
  return modulePendingAwards
    .filter((candidate) => candidate.awardId !== pending.awardId && candidate.requiredSkillId === pending.requiredSkillId)
    .flatMap((candidate) => values[candidate.awardId] ?? [])
}

export function previewStageModuleChoiceSlots(
  character: CharacterDefinition,
  moduleId: SupportedStageModuleId | '',
  values: StageChoiceSlotValues,
): StageChoiceSlotPreview | null {
  if (!moduleId) return null
  const initialExistingAwards = character.creation.lifeModules!.pendingAwards.map((entry) => structuredClone(entry))
  const existingAwardIds = new Set(initialExistingAwards.map((entry) => entry.id))
  let preview = applySupportedStageModule(character, moduleId)
  const existingPending = () => preview.creation.lifeModules!.pendingAwards.filter((entry) => existingAwardIds.has(entry.id))
  const modulePending = () => preview.creation.lifeModules!.pendingAwards.filter((entry) => entry.moduleId === moduleId)

  try {
    for (const pending of initialExistingAwards) {
      for (const value of values[pending.awardId] ?? []) {
        if (!slotValueComplete(value)) continue
        const current = existingPending().find((entry) => entry.id === pending.id)
        if (!current) throw new Error(`${pending.description} has more filled slots than required.`)
        preview = resolvePendingLifeModuleAward(
          preview,
          current.id,
          toDestination(value),
          current.allocationMode === 'pool' ? value.xpAmount : undefined,
        )
      }
    }

    const initialModuleAwards = modulePending().map((entry) => structuredClone(entry))
    for (const pending of initialModuleAwards) {
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
    return {
      character: preview,
      existingPendingAwards: existingPending(),
      pendingAwards: modulePending(),
      complete: existingPending().length === 0 && modulePending().length === 0,
      error: null,
    }
  } catch (error) {
    return {
      character: preview,
      existingPendingAwards: existingPending(),
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

function optionValue(value: StageChoiceSlotValue | undefined): string {
  if (!value?.targetId) return ''
  return value.targetType === 'skill' ? `${value.targetId}/${value.parameter}` : value.targetId
}
