import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { BACK_WOODS_ID, CAPELLAN_COMMONALITY_ID } from '../../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { LifeModuleAuditDrawer, LifeModuleCharacterSummary, LifeModuleDashboard, LifeModuleProgress, LifeModuleReviewSummary, LifeModulesVersionBadge, LifeModuleStageHeading, LifeModuleStageStatus } from './LifeModulesWizard'
import { genericPendingAwardsForPhase, LIFE_MODULE_WIZARD_STEPS, lifeModuleStagePresentation, lifeModuleWizardStepIndex } from './lifeModulesWizardModel'
import { previewStage0Affiliation } from './stage0PreviewModel'
import { previewSupportedStageModule } from './stageModulePreviewModel'

function stage1Draft() {
  let character = createLifeModuleCharacter('Wizard Review')
  character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
  character = applyCapellanCommonality(character, 'Russian')
  return applyStage1Module(character, BACK_WOODS_ID)
}

describe('Life Modules wizard presentation', () => {
  it('derives the Life Modules page badge from the current application version', () => {
    const markup = renderToStaticMarkup(<LifeModulesVersionBadge />)
    expect(markup).toContain('Public Alpha · Slice 84 · v0.1.0-alpha.84')
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
    expect(markup).toContain('Current stage: ')
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
    expect(markup).not.toContain('<dt>Current stage</dt>')
  })

  it('renders compact dashboard landmarks with summary, progress, stage action, and draft controls together', () => {
    const character = createLifeModuleCharacter('Dashboard')
    const preview = previewStage0Affiliation(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')
    const markup = renderToStaticMarkup(
      <LifeModuleDashboard character={character} previewCharacter={preview} previewSelections={['Affiliation context selected', 'Affiliation language: Mandarin Chinese', 'Secondary language: Russian']} toolbar={<><button>Save draft</button><button>Export character JSON</button></>}>
        <LifeModuleStageHeading phase="stage-0-affiliation" />
        <button>Continue</button>
      </LifeModuleDashboard>,
    )
    expect(markup).toContain('aria-label="Life Modules compact dashboard"')
    expect(markup).toContain('aria-label="Life Modules progress"')
    expect(markup).toContain('aria-label="Current character summary"')
    expect(markup).toContain('aria-label="Current Life Modules stage"')
    expect(markup).not.toContain('aria-label="Pending Stage 0 changes"')
    expect(markup).toContain('aria-label="Uncommitted live preview"')
    expect(markup).toContain('aria-label="Life Modules navigation and draft actions"')
    expect(markup).toContain('Choose affiliation details')
    expect(markup).not.toContain('STAGE 0 · AFFILIATION')
    expect(markup).toContain('Continue')
    expect(markup).toContain('Save draft')
    expect(markup).toContain('Not saved until Continue')
  })

  it('keeps audit material in a secondary drawer that opens for Review only', () => {
    const closed = renderToStaticMarkup(<LifeModuleAuditDrawer><p>Applied awards</p></LifeModuleAuditDrawer>)
    const review = renderToStaticMarkup(<LifeModuleAuditDrawer open><p>Applied awards</p></LifeModuleAuditDrawer>)
    expect(closed).toContain('<summary>Audit and details</summary>')
    expect(closed).not.toContain('open=""')
    expect(review).toContain('<details class="life-dashboard-details" open="">')
  })

  it('renders full sheet Attribute values instead of normalized purchased levels', () => {
    const markup = renderToStaticMarkup(<LifeModuleCharacterSummary character={createLifeModuleCharacter('Baseline')} />)
    for (const attribute of ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG']) {
      expect(markup).toContain(`<span>${attribute}</span><strong>100</strong>`)
    }
  })

  it('renders resolved Trait ratings beside full names and leaves XP on the right', () => {
    const character = createLifeModuleCharacter('XP Summary')
    const preview = previewStage0Affiliation(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')
    const markup = renderToStaticMarkup(<LifeModuleCharacterSummary character={character} previewCharacter={preview} />)
    expect(markup).toContain('<span>Exceptional Attribute/EDG (1)</span><strong>100 XP</strong>')
    expect(markup).toContain('<span>Compulsion/Paranoia (-1)</span><strong>-100 XP</strong>')
    expect(markup).toContain('<span>Wealth</span><strong>pending · 15 XP</strong>')
    expect(markup).not.toContain(' TP · ')
    expect(markup).toContain('<span>Language/Mandarin Chinese</span><strong>20 XP</strong>')
    expect(markup).toContain('<span>Language/Russian</span><strong>10 XP</strong>')
    expect(markup).toContain('<span>Language/English</span><strong>20 XP</strong>')
    expect(markup).not.toContain('<strong>—</strong>')
    expect(markup).not.toContain('<strong>+0</strong>')
  })

  it('integrates the complete Stage 0 preview into the running character summary', () => {
    const character = createLifeModuleCharacter('Complete Stage 0')
    const preview = previewStage0Affiliation(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')
    expect(preview).not.toBeNull()
    const markup = renderToStaticMarkup(<LifeModuleCharacterSummary character={character} previewCharacter={preview} />)
    expect(markup).toContain('Previewing selected choices')
    expect(markup).toContain('Not saved until Continue')
    expect(markup).not.toContain('After Continue')
    expect(markup).toContain('4,000')
    expect(markup).toContain('<li class="preview-row"><span>WIL</span><strong>150</strong></li>')
    expect(markup).toContain('Language/Mandarin Chinese')
    expect(markup).toContain('Language/Russian')
    expect(markup).not.toContain('<em>Preview</em>')
    expect(markup).not.toContain('>Preview<')
  })

  it('shows safe known effects and pending choice rows after context selection', () => {
    const character = createLifeModuleCharacter('Partial Preview')
    const preview = previewStage0Affiliation(character, CAPELLAN_COMMONALITY_ID, '', '')
    const markup = renderToStaticMarkup(<LifeModuleCharacterSummary character={character} previewCharacter={preview} previewSelections={['Affiliation context selected']} />)
    expect(markup).toContain('Affiliation context selected')
    expect(markup).toContain('Not saved until Continue')
    expect(markup).toContain('Known package effects are shown now; choice-dependent awards remain pending.')
    expect(markup).toContain('<li class="preview-row"><span>WIL</span><strong>150</strong></li>')
    expect(markup).toContain('Exceptional Attribute/EDG')
    expect(markup).toContain('Protocol/Capellan')
    expect(markup).toContain('Choose an affiliation primary or secondary language.')
    expect(markup).toContain('pending · 20 XP')
    expect(markup).toContain('Choose any Capellan secondary language.')
    expect(markup).toContain('pending · 10 XP')
    expect(markup).toContain('Choose any Federated Suns language.')
    expect(markup).toContain('pending · 5 XP')
    expect(markup).toContain('<dt>Module XP left</dt><dd>4,000</dd>')
    expect(markup).not.toContain('After Continue')
    expect(markup.match(/<details/g)).toHaveLength(4)
    expect(markup.match(/open=""/g)).toHaveLength(4)
  })

  it('integrates a later-stage module preview without committing its history or provenance', () => {
    let character = createLifeModuleCharacter('Later Stage Preview')
    character = applyCapellanCommonality(applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese'), 'Russian')
    character.creation.lifeModules!.phase = 'stage-1-selection'
    character.creation.lifeModules!.currentStage = 1
    const committedJson = JSON.stringify(character)
    const preview = previewSupportedStageModule(character, BACK_WOODS_ID)
    const markup = renderToStaticMarkup(<LifeModuleCharacterSummary character={character} previewCharacter={preview} previewSelections={['Selected module: Back Woods']} />)

    expect(markup).toContain('Not saved until Continue')
    expect(markup).toContain('<li class="preview-row">Back Woods</li>')
    expect(markup).toContain('<span>BOD</span><strong>200</strong>')
    expect(markup).toContain('<span>Fit (1)</span><strong>100 XP</strong>')
    expect(markup).toContain('<span>Martial Arts</span><strong>15 XP</strong>')
    expect(markup).toContain('Pending preview choices')
    expect(markup).toContain('pending · 50 XP')
    expect(markup).not.toContain('<em>Preview</em>')
    expect(JSON.stringify(character)).toBe(committedJson)
    expect(character.lifeModuleHistory.some((entry) => entry.moduleId === BACK_WOODS_ID)).toBe(false)
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

  it('hides the generic resolver link for integrated slots but preserves it for fallback contexts', () => {
    const state = stage1Draft().creation.lifeModules!
    const integrated = renderToStaticMarkup(<LifeModuleStageStatus pendingAwards={state.pendingAwards} warnings={[]} showResolutionLink={false} />)
    const fallback = renderToStaticMarkup(<LifeModuleStageStatus pendingAwards={state.pendingAwards} warnings={[]} />)

    expect(integrated).not.toContain('Resolve pending awards')
    expect(fallback).toContain('Resolve pending awards')
    expect(fallback).toContain('href="#pending-awards"')
  })
})
