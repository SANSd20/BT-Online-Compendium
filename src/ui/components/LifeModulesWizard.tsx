import type { ReactNode } from 'react'
import type { CharacterDefinition, PendingLifeModuleAward } from '../../domain/character/model'
import { APP_VERSION } from '../../appMetadata'
import { LIFE_MODULE_WIZARD_STEPS, lifeModuleStagePresentation, lifeModuleWizardStepIndex } from './lifeModulesWizardModel'

export function LifeModulesVersionBadge() {
  return <p className="eyebrow">Public Alpha · v{APP_VERSION}</p>
}

export function LifeModuleDashboard({ character, previewCharacter, toolbar, children }: { character: CharacterDefinition; previewCharacter?: CharacterDefinition | null; toolbar: ReactNode; children: ReactNode }) {
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
    <div className={previewCharacter ? 'life-wizard-layout has-preview' : 'life-wizard-layout'}>
      <LifeModuleCharacterSummary character={character} />
      <div className="life-wizard-workspace" aria-label="Current Life Modules stage">{children}</div>
      {previewCharacter && <aside className="life-preview-rail" aria-label="Pending Stage 0 changes"><LifeModulePreviewSummary character={character} previewCharacter={previewCharacter} /></aside>}
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
      <span>{index < current ? '✓' : index + 1}</span>
      <div><strong>{step.label}</strong>{step.detail && <small>{step.detail}</small>}</div>
    </li>)}</ol>
  </nav>
}

export function LifeModuleStageHeading({ phase }: { phase: string }) {
  const presentation = lifeModuleStagePresentation(phase)
  return <header className="life-stage-heading">
    <p className="eyebrow">{presentation.stage}</p>
    <h2>{presentation.title}</h2>
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

export function LifeModuleCharacterSummary({ character, previewCharacter }: { character: CharacterDefinition; previewCharacter?: CharacterDefinition | null }) {
  const state = character.creation.lifeModules!
  const stage = lifeModuleStagePresentation(state.phase)
  return <aside className="life-summary" aria-label="Current character summary">
    <p className="eyebrow">Character summary</p>
    <h2>{character.displayName || 'Unnamed character'}</h2>
    <dl className="life-summary-xp">
      <div><dt>Current stage</dt><dd>{stage.stage}</dd></div>
      <div><dt>Module XP left</dt><dd>{state.moduleXp.remaining.toLocaleString()}</dd></div>
      <div><dt>Net stat XP</dt><dd>{character.xp.creation.allocated.toLocaleString()}</dd></div>
      <div><dt>Pending choices</dt><dd>{state.pendingAwards.length}</dd></div>
    </dl>
    <details open className="life-summary-attributes"><summary>Attributes</summary><ul>{character.attributes.map((entry) => <li key={entry.attributeId}><span>{entry.attributeId}</span><strong>{entry.accumulatedXp.toLocaleString()}</strong></li>)}</ul></details>
    <details><summary>Traits ({character.traits.length})</summary><ul>{character.traits.map((entry, index) => <li key={`${entry.traitId}-${index}`}><span>{entry.displayName ?? entry.traitId}</span><strong>{entry.active ? `${entry.attainedTp ?? 0} TP` : 'pending'}</strong></li>)}</ul></details>
    <details><summary>Skills ({character.skills.length})</summary><ul>{character.skills.map((entry, index) => <li key={`${entry.address.skillId}-${index}`}><span>{entry.displayName ?? entry.address.skillId}</span><strong>{entry.level === null ? '—' : `+${entry.level}`}</strong></li>)}</ul></details>
    <details open><summary>Chosen modules</summary>{character.lifeModuleHistory.length === 0 ? <p>None yet.</p> : <ol>{character.lifeModuleHistory.map((entry) => <li key={entry.moduleId}>{entry.displayName}</li>)}</ol>}</details>
    {previewCharacter && <LifeModulePreviewSummary character={character} previewCharacter={previewCharacter} />}
  </aside>
}

export function LifeModulePreviewSummary({ character, previewCharacter }: { character: CharacterDefinition; previewCharacter: CharacterDefinition }) {
  const committedState = character.creation.lifeModules!
  const previewState = previewCharacter.creation.lifeModules!
  const attributeChanges = previewCharacter.attributes.filter((preview) => preview.accumulatedXp !== character.attributes.find((entry) => entry.attributeId === preview.attributeId)?.accumulatedXp)
  const traitChanges = previewCharacter.traits.filter((preview) => !character.traits.some((entry) => entry.traitId === preview.traitId && entry.displayName === preview.displayName && entry.accumulatedXp === preview.accumulatedXp))
  const skillChanges = previewCharacter.skills.filter((preview) => !character.skills.some((entry) => entry.displayName === preview.displayName && entry.accumulatedXp === preview.accumulatedXp))
  return <section className="life-preview-summary" aria-label="Uncommitted Stage 0 preview">
    <p className="eyebrow">Preview · Not saved</p>
    <h3>After Continue</h3>
    <p>Previewing selected Stage 0 choices. Continue to apply these changes.</p>
    <dl><div><dt>Module XP left</dt><dd>{committedState.moduleXp.remaining.toLocaleString()} → {previewState.moduleXp.remaining.toLocaleString()}</dd></div></dl>
    {attributeChanges.length > 0 && <><h4>Attributes</h4><ul>{attributeChanges.map((entry) => <li key={entry.attributeId}><span>{entry.attributeId}</span><strong>{entry.accumulatedXp}</strong></li>)}</ul></>}
    {traitChanges.length > 0 && <><h4>Traits</h4><ul>{traitChanges.map((entry, index) => <li key={`${entry.traitId}-${index}`}><span>{entry.displayName}</span><strong>{entry.accumulatedXp > 0 ? '+' : ''}{entry.accumulatedXp} XP</strong></li>)}</ul></>}
    {skillChanges.length > 0 && <><h4>Skills</h4><ul>{skillChanges.map((entry, index) => <li key={`${entry.address.skillId}-${index}`}><span>{entry.displayName}</span><strong>{entry.accumulatedXp > 0 ? '+' : ''}{entry.accumulatedXp} XP</strong></li>)}</ul></>}
  </section>
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
