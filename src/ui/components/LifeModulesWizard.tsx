import type { ReactNode, Ref } from 'react'
import type { CharacterDefinition, PendingLifeModuleAward } from '../../domain/character/model'
import { APP_VERSION } from '../../appMetadata'
import { LIFE_MODULE_WIZARD_STEPS, lifeModuleStagePresentation, lifeModuleWizardStepIndex } from './lifeModulesWizardModel'

export function LifeModulesVersionBadge() {
  return <p className="eyebrow">Public Alpha · v{APP_VERSION}</p>
}

export function LifeModuleDashboard({ character, previewCharacter, previewSelections = [], toolbar, children }: { character: CharacterDefinition; previewCharacter?: CharacterDefinition | null; previewSelections?: string[]; toolbar: ReactNode; children: ReactNode }) {
  const state = character.creation.lifeModules!
  return <section className="life-dashboard" aria-label="Life Modules compact dashboard">
    <header className="life-dashboard-header">
      <section className="xp-dashboard" aria-label="Life Module XP status">
        <div><span>Module pool</span><strong>{state.moduleXp.starting.toLocaleString()}</strong></div>
        <div><span>Module costs</span><strong>{state.moduleXp.spent.toLocaleString()}</strong></div>
        <div><span>Remaining</span><strong>{state.moduleXp.remaining.toLocaleString()}</strong></div>
        <div><span>Stat XP (net)</span><strong>{character.xp.creation.allocated.toLocaleString()}</strong></div>
      </section>
      <LifeModuleProgress phase={state.phase} />
      <div className="life-dashboard-toolbar" aria-label="Life Modules navigation and draft actions">{toolbar}</div>
    </header>
    <div className="life-wizard-layout">
      <LifeModuleCharacterSummary character={character} previewCharacter={previewCharacter} previewSelections={previewSelections} />
      <div className="life-wizard-workspace" aria-label="Current Life Modules stage">{children}</div>
    </div>
  </section>
}

export function LifeModuleAuditDrawer({ open = false, children }: { open?: boolean; children: ReactNode }) {
  return <details className="life-dashboard-details" open={open}>
    <summary>Audit and details</summary>
    <div className="life-dashboard-details-body">{children}</div>
  </details>
}

export function LifeModuleProgress({ phase }: { phase: string }) {
  const current = lifeModuleWizardStepIndex(phase)
  return <nav className="life-progress" aria-label="Life Modules progress">
    <ol>{LIFE_MODULE_WIZARD_STEPS.map((step, index) => <li key={step.id} className={index < current ? 'complete' : index === current ? 'current' : ''} aria-current={index === current ? 'step' : undefined}>
      <span aria-hidden="true">{index < current ? '✓' : index + 1}</span>
      <span className="sr-only">{index < current ? 'Complete: ' : index === current ? 'Current stage: ' : 'Upcoming stage: '}</span>
      <div><strong>{step.label}</strong>{step.detail && <small>{step.detail}</small>}</div>
    </li>)}</ol>
  </nav>
}

export function LifeModuleStageHeading({ phase, headingRef }: { phase: string; headingRef?: Ref<HTMLHeadingElement> }) {
  const presentation = lifeModuleStagePresentation(phase)
  return <header className="life-stage-heading">
    <h2 id="life-stage-heading" ref={headingRef} tabIndex={-1}>{presentation.title}</h2>
    <p>{presentation.instruction}</p>
  </header>
}

export function LifeModuleReviewSummary({ character }: { character: CharacterDefinition }) {
  const state = character.creation.lifeModules!
  const warnings = state.prerequisiteIssues.filter((entry) => entry.status === 'outstanding')
  return <section className="life-review-summary" aria-label="Life Modules review summary">
    <div><span>Selected modules</span><strong>{character.lifeModuleHistory.length}</strong></div>
    <div><span>Pending choices</span><strong>{state.pendingAwards.length}</strong></div>
    <div><span>Final warnings</span><strong>{warnings.length}</strong></div>
    <div><span>Module XP left</span><strong>{state.moduleXp.remaining.toLocaleString()}</strong></div>
    <ol>{character.lifeModuleHistory.map((entry) => <li key={entry.moduleId}><span>Stage {entry.stage}</span><strong>{entry.displayName}</strong></li>)}</ol>
  </section>
}

export function LifeModuleCharacterSummary({ character, previewCharacter, previewSelections = [] }: { character: CharacterDefinition; previewCharacter?: CharacterDefinition | null; previewSelections?: string[] }) {
  const effectiveCharacter = previewCharacter ?? character
  const effectiveState = effectiveCharacter.creation.lifeModules!
  const previewActive = previewSelections.length > 0 || Boolean(previewCharacter)
  const isPreviewAttribute = (attributeId: string, xp: number) => previewCharacter?.attributes.some((entry) => entry.attributeId === attributeId && entry.accumulatedXp === xp) && character.attributes.find((entry) => entry.attributeId === attributeId)?.accumulatedXp !== xp
  const isPreviewTrait = (traitId: string, displayName: string | undefined, xp: number) => Boolean(previewCharacter) && !character.traits.some((entry) => entry.traitId === traitId && entry.displayName === displayName && entry.accumulatedXp === xp)
  const isPreviewSkill = (displayName: string | undefined, xp: number) => Boolean(previewCharacter) && !character.skills.some((entry) => entry.displayName === displayName && entry.accumulatedXp === xp)
  const committedModules = new Set(character.lifeModuleHistory.map((entry) => entry.moduleId))
  const previewPendingAwards = previewCharacter
    ? effectiveState.pendingAwards
    : []
  return <aside className="life-summary" aria-label="Current character summary">
    <p className="eyebrow">Character summary</p>
    <h2>{character.displayName || 'Unnamed character'}</h2>
    {previewActive && <section className="life-summary-preview-status" aria-label="Uncommitted live preview">
      <strong>Previewing selected choices</strong>
      <span>Not saved until Continue</span>
      {previewSelections.length > 0 && <ul>{previewSelections.map((selection) => <li key={selection}>{selection}</li>)}</ul>}
      {previewCharacter && effectiveState.pendingAwards.length > 0 && <p>Known package effects are shown now; choice-dependent awards remain pending.</p>}
    </section>}
    <dl className="life-summary-xp">
      <div><dt>Module XP left</dt><dd>{effectiveState.moduleXp.remaining.toLocaleString()}</dd></div>
      <div><dt>Net stat XP</dt><dd>{effectiveCharacter.xp.creation.allocated.toLocaleString()}</dd></div>
      <div><dt>Pending choices</dt><dd>{effectiveState.pendingAwards.length}</dd></div>
    </dl>
    <details open className="life-summary-attributes"><summary>Attributes</summary><ul>{effectiveCharacter.attributes.map((entry) => <li key={entry.attributeId} className={isPreviewAttribute(entry.attributeId, entry.accumulatedXp) ? 'preview-row' : ''}><span>{entry.attributeId}</span><strong>{entry.accumulatedXp.toLocaleString()}</strong></li>)}</ul></details>
    <details open><summary>Traits ({effectiveCharacter.traits.length})</summary><ul>{effectiveCharacter.traits.map((entry, index) => <li key={`${entry.traitId}-${index}`} className={isPreviewTrait(entry.traitId, entry.displayName, entry.accumulatedXp) ? 'preview-row' : ''}><span>{entry.displayName ?? entry.traitId}</span><strong>{entry.active ? `${entry.attainedTp ?? 0} TP · ${entry.accumulatedXp.toLocaleString()} XP` : entry.accumulatedXp !== 0 ? `pending · ${entry.accumulatedXp.toLocaleString()} XP` : 'pending'}</strong></li>)}</ul></details>
    <details open><summary>Skills ({effectiveCharacter.skills.length})</summary><ul>{effectiveCharacter.skills.map((entry, index) => <li key={`${entry.address.skillId}-${index}`} className={isPreviewSkill(entry.displayName, entry.accumulatedXp) ? 'preview-row' : ''}><span>{entry.displayName ?? entry.address.skillId}</span><strong>{entry.accumulatedXp.toLocaleString()} XP</strong></li>)}</ul></details>
    <details open><summary>Chosen modules</summary>{effectiveCharacter.lifeModuleHistory.length === 0 ? <p>None yet.</p> : <ol>{effectiveCharacter.lifeModuleHistory.map((entry) => <li key={entry.moduleId} className={!committedModules.has(entry.moduleId) ? 'preview-row' : ''}>{entry.displayName}</li>)}</ol>}{previewPendingAwards.length > 0 && <div className="life-summary-pending"><h3>Pending preview choices</h3><ul>{previewPendingAwards.map((entry) => <li key={entry.id} className="preview-row pending-row"><span>{entry.description}</span><strong>pending · {(entry.allocationMode === 'pool' ? entry.remainingXp : entry.xpPerGrant * entry.remainingGrants)?.toLocaleString()} XP</strong></li>)}</ul></div>}</details>
  </aside>
}

export function LifeModuleStageStatus({ pendingAwards, warnings, specializedPendingMessage }: { pendingAwards: PendingLifeModuleAward[]; warnings: string[]; specializedPendingMessage?: string }) {
  return <div className="life-stage-status" aria-label="Current stage status">
    <section className={pendingAwards.length ? 'stage-blockers has-items' : 'stage-blockers'} aria-labelledby="stage-blockers-heading">
      <h3 id="stage-blockers-heading">Current-stage blockers</h3>
      {pendingAwards.length === 0 ? <p>{specializedPendingMessage ?? 'No unresolved award blockers.'}</p> : <><p>Continue is blocked until these awards are resolved:</p><ul>{pendingAwards.map((entry) => <li key={entry.id}>{entry.kind === 'flexible-xp' && <strong>Flexible XP · </strong>}{entry.description} ({entry.allocationMode === 'pool' ? `${entry.remainingXp} XP remaining` : `${entry.remainingGrants} grant${entry.remainingGrants === 1 ? '' : 's'} remaining`})</li>)}</ul><a href="#pending-awards">Resolve pending awards</a></>}
    </section>
    <section className={warnings.length ? 'stage-warnings has-items' : 'stage-warnings'} aria-labelledby="stage-warnings-heading">
      <h3 id="stage-warnings-heading">Final-validation warnings</h3>
      {warnings.length === 0 ? <p>No deferred warnings recorded.</p> : <><p>These do not block Continue at the current stage.</p><ul>{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></>}
    </section>
  </div>
}
