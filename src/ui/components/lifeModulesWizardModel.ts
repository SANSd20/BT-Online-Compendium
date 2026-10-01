export interface LifeModuleWizardStep {
  id: string
  label: string
  detail?: string
}

export const LIFE_MODULE_WIZARD_STEPS: readonly LifeModuleWizardStep[] = [
  { id: 'stage-0', label: 'Stage 0', detail: 'Affiliation' },
  { id: 'stage-1', label: 'Stage 1', detail: 'Early Childhood' },
  { id: 'stage-2', label: 'Stage 2', detail: 'Late Childhood' },
  { id: 'stage-3', label: 'Stage 3', detail: 'Higher Education' },
  { id: 'stage-4', label: 'Stage 4', detail: 'Real Life' },
  { id: 'review', label: 'Review' },
]

export function lifeModuleWizardStepIndex(phase: string): number {
  if (phase.startsWith('stage-0')) return 0
  if (phase.includes('stage-1') || phase === 'alpha-partial-stop') return 1
  if (phase.includes('stage-2')) return 2
  if (phase.includes('stage-3')) return 3
  if (phase.includes('stage-4')) return 4
  return 5
}
import type { PendingLifeModuleAward } from '../../domain/character/model'


export function genericPendingAwardsForPhase(phase: string, pendingAwards: PendingLifeModuleAward[]): PendingLifeModuleAward[] {
  if (phase !== 'stage-0-affiliation') return pendingAwards
  return pendingAwards.filter((entry) => !(
    entry.moduleId === 'stage0.universal-fixed-xp' &&
    entry.awardId === 'universal.language.affiliation'
  ))
}
