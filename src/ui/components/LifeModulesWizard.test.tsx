import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BACK_WOODS_ID, CAPELLAN_COMMONALITY_ID } from '../../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { LifeModuleCharacterSummary, LifeModuleProgress, LifeModuleReviewSummary, LifeModulesVersionBadge, LifeModuleStageHeading, LifeModuleStageStatus } from './LifeModulesWizard'
import { genericPendingAwardsForPhase, LIFE_MODULE_WIZARD_STEPS, lifeModuleStagePresentation, lifeModuleWizardStepIndex } from './lifeModulesWizardModel'

function stage1Draft() {
  let character = createLifeModuleCharacter('Wizard Review')
  character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
  character = applyCapellanCommonality(character, 'Russian')
  return applyStage1Module(character, BACK_WOODS_ID)
}

describe('Life Modules wizard presentation', () => {
  it('derives the Life Modules page badge from the current application version', () => {
    const markup = renderToStaticMarkup(<LifeModulesVersionBadge />)
    expect(markup).toContain('Public Alpha · v0.1.0-alpha.37')
    expect(markup).not.toContain('Slice 22')
  })

  it('maps every Life Modules stage to the visible progress tracker', () => {
    expect(lifeModuleWizardStepIndex('stage-0-universal')).toBe(0)
    expect(lifeModuleWizardStepIndex('stage-0-affiliation')).toBe(0)
    expect(lifeModuleWizardStepIndex('stage-1-selection')).toBe(1)
    expect(lifeModuleWizardStepIndex('stage-2-resolution')).toBe(2)
    expect(lifeModuleWizardStepIndex('stage-3-selection')).toBe(3)
    expect(lifeModuleWizardStepIndex('stage-4-resolution')).toBe(4)
    expect(lifeModuleWizardStepIndex('alpha-final-review')).toBe(5)
    expect(LIFE_MODULE_WIZARD_STEPS).toHaveLength(6)
    expect(LIFE_MODULE_WIZARD_STEPS[0]).toEqual({ id: 'stage-0', label: 'Stage 0', detail: 'Affiliation' })
    expect(LIFE_MODULE_WIZARD_STEPS.some((step) => step.id === 'universal')).toBe(false)
    const markup = renderToStaticMarkup(<LifeModuleProgress phase="stage-2-selection" />)
    expect(markup).toContain('Life Modules progress')
    expect(markup).toContain('aria-current="step"')
    expect(markup).toContain('Late Childhood')
  })

  it('suppresses only the specialized Stage 0 language award from generic resolution', () => {
    const pending = createLifeModuleCharacter('Stage 0').creation.lifeModules!.pendingAwards
    expect(pending).toHaveLength(1)
    expect(genericPendingAwardsForPhase('stage-0-affiliation', pending)).toHaveLength(0)
    expect(genericPendingAwardsForPhase('stage-1-resolution', pending)).toEqual(pending)
    const unsupported = { ...pending[0], id: 'unsupported', awardId: 'stage0.unsupported' }
    expect(genericPendingAwardsForPhase('stage-0-affiliation', [...pending, unsupported])).toEqual([unsupported])
  })

  it('gives Stages 1–4 and Review a clear current action', () => {
    expect(lifeModuleStagePresentation('stage-1-selection').title).toBe('Choose one early childhood module')
    expect(lifeModuleStagePresentation('stage-2-selection').title).toBe('Choose one late childhood module')
    expect(lifeModuleStagePresentation('stage-3-resolution')).toMatchObject({ stage: 'Stage 3 · Higher Education', title: 'Complete higher education' })
    expect(lifeModuleStagePresentation('stage-4-selection').instruction).toContain('Agitator')
    const review = renderToStaticMarkup(<LifeModuleStageHeading phase="alpha-final-review" />)
    expect(review).toContain('Review character readiness')
    expect(review).toContain('modules, unresolved choices, warnings, and XP')
  })

  it('renders a compact Review audit of modules, pending choices, warnings, and XP', () => {
    const markup = renderToStaticMarkup(<LifeModuleReviewSummary character={stage1Draft()} />)
    expect(markup).toContain('Life Modules review summary')
    expect(markup).toContain('Selected modules')
    expect(markup).toContain('Pending choices')
    expect(markup).toContain('Final warnings')
    expect(markup).toContain('Module XP left')
    expect(markup).toContain('Back Woods')
  })

  it('renders a persistent character, XP, statistic, and module summary', () => {
    const markup = renderToStaticMarkup(<LifeModuleCharacterSummary character={stage1Draft()} />)
    expect(markup).toContain('Current character summary')
    expect(markup).toContain('Wizard Review')
    expect(markup).toContain('Module XP left')
    expect(markup).toContain('Attributes')
    expect(markup).toContain('Traits')
    expect(markup).toContain('Skills')
    expect(markup).toContain('Capellan Confederation / Capellan Commonality')
  })

  it('renders full sheet Attribute values instead of normalized purchased levels', () => {
    const markup = renderToStaticMarkup(<LifeModuleCharacterSummary character={createLifeModuleCharacter('Baseline')} />)
    for (const attribute of ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG']) {
      expect(markup).toContain(`<span>${attribute}</span><strong>100</strong>`)
    }
  })

  it('separates exact pending blockers from non-blocking final-validation warnings', () => {
    const character = stage1Draft()
    const state = character.creation.lifeModules!
    const warnings = state.prerequisiteIssues.filter((entry) => entry.status === 'outstanding').map((entry) => entry.description)
    const markup = renderToStaticMarkup(<LifeModuleStageStatus pendingAwards={state.pendingAwards} warnings={warnings} />)
    expect(markup).toContain('Current-stage blockers')
    expect(markup).toContain('Continue is blocked until these awards are resolved')
    expect(markup).toContain('Flexible XP')
    expect(markup).toContain('Final-validation warnings')
    expect(markup).toContain('These do not block Continue at the current stage')
    expect(markup).toContain('STR 4+')
  })
})
