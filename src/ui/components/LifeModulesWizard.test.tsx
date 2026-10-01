import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BACK_WOODS_ID, CAPELLAN_COMMONALITY_ID } from '../../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { LifeModuleCharacterSummary, LifeModuleProgress, LifeModuleStageStatus } from './LifeModulesWizard'
import { LIFE_MODULE_WIZARD_STEPS, lifeModuleWizardStepIndex } from './lifeModulesWizardModel'

function stage1Draft() {
  let character = createLifeModuleCharacter('Wizard Review')
  character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
  character = applyCapellanCommonality(character, 'Russian')
  return applyStage1Module(character, BACK_WOODS_ID)
}

describe('Life Modules wizard presentation', () => {
  it('maps every Life Modules stage to the visible progress tracker', () => {
    expect(lifeModuleWizardStepIndex('stage-0-universal')).toBe(0)
    expect(lifeModuleWizardStepIndex('stage-0-affiliation')).toBe(0)
    expect(lifeModuleWizardStepIndex('stage-1-selection')).toBe(1)
    expect(lifeModuleWizardStepIndex('stage-2-resolution')).toBe(2)
    expect(lifeModuleWizardStepIndex('stage-3-selection')).toBe(3)
    expect(lifeModuleWizardStepIndex('stage-4-resolution')).toBe(4)
    expect(lifeModuleWizardStepIndex('alpha-final-review')).toBe(5)
    expect(LIFE_MODULE_WIZARD_STEPS).toHaveLength(6)
    expect(LIFE_MODULE_WIZARD_STEPS[0]).toMatchObject({ id: 'stage-0', label: 'Stage 0' })
    expect(LIFE_MODULE_WIZARD_STEPS.some((step) => step.id === 'universal')).toBe(false)
    const markup = renderToStaticMarkup(<LifeModuleProgress phase="stage-2-selection" />)
    expect(markup).toContain('Life Modules progress')
    expect(markup).toContain('aria-current="step"')
    expect(markup).toContain('Late Childhood')
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
