export interface LifeModuleWizardStep {
  id: string
  label: string
  detail?: string
}

export interface LifeModuleStagePresentation {
  stage: string
  title: string
  instruction: string
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

export function lifeModuleStagePresentation(phase: string): LifeModuleStagePresentation {
  if (phase.startsWith('stage-0')) return { stage: 'Stage 0 · Affiliation', title: 'Choose affiliation details', instruction: 'Complete every required affiliation and language choice, then apply and continue.' }
  if (phase.includes('stage-1') || phase === 'alpha-partial-stop') return { stage: 'Stage 1 · Early Childhood', title: phase === 'stage-1-selection' ? 'Choose one early childhood module' : 'Complete early childhood', instruction: phase === 'stage-1-selection' ? 'Compare the supported modules and select one path.' : 'Resolve this stage’s choices and review any final-validation warnings.' }
  if (phase.includes('stage-2') || phase === 'alpha-stage-2-stop') return { stage: 'Stage 2 · Late Childhood', title: phase === 'stage-2-selection' ? 'Choose one late childhood module' : 'Complete late childhood', instruction: phase === 'stage-2-selection' ? 'Compare the supported modules and select one path.' : 'Resolve this stage’s choices; warnings marked final-validation do not block the current continuation.' }
  if (phase.includes('stage-3') || phase === 'alpha-stage-3-stop') return { stage: 'Stage 3 · Higher Education', title: phase === 'stage-3-selection' ? 'Choose an education module' : 'Complete higher education', instruction: phase === 'stage-3-selection' ? 'Select the supported education path and its Skill Fields.' : 'Resolve the education module’s Interest and flexible-XP choices below.' }
  if (phase.includes('stage-4') || phase.includes('stage-4-stop')) return { stage: 'Stage 4 · Real Life', title: phase === 'stage-4-selection' ? 'Choose a real-life module' : 'Complete real life', instruction: phase === 'stage-4-selection' ? 'The current Alpha supports the Agitator path; other Real Life modules remain future work.' : 'Resolve the selected module’s choices, then enter Review when allowed.' }
  return { stage: 'Review', title: 'Review character readiness', instruction: 'Check modules, unresolved choices, warnings, and XP before proceeding to Final Touches.' }
}
