import type { CharacterDefinition, PendingLifeModuleAward } from '../../domain/character/model'
import { APP_VERSION } from '../../appMetadata'
import { LIFE_MODULE_WIZARD_STEPS, lifeModuleWizardStepIndex } from './lifeModulesWizardModel'

export function LifeModulesVersionBadge() {
  return <p className="eyebrow">Public Alpha · v{APP_VERSION}</p>
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

export function LifeModuleCharacterSummary({ character }: { character: CharacterDefinition }) {
  const state = character.creation.lifeModules!
  return <aside className="life-summary" aria-label="Current character summary">
    <p className="eyebrow">Character summary</p>
    <h2>{character.displayName || 'Unnamed character'}</h2>
    <dl className="life-summary-xp">
      <div><dt>Module XP left</dt><dd>{state.moduleXp.remaining.toLocaleString()}</dd></div>
      <div><dt>Net stat XP</dt><dd>{character.xp.creation.allocated.toLocaleString()}</dd></div>
      <div><dt>Pending choices</dt><dd>{state.pendingAwards.length}</dd></div>
    </dl>
    <details open><summary>Attributes</summary><ul>{character.attributes.map((entry) => <li key={entry.attributeId}><span>{entry.attributeId}</span><strong>{entry.purchasedLevel ?? '—'}</strong></li>)}</ul></details>
    <details><summary>Traits ({character.traits.length})</summary><ul>{character.traits.map((entry, index) => <li key={`${entry.traitId}-${index}`}><span>{entry.displayName ?? entry.traitId}</span><strong>{entry.active ? `${entry.attainedTp ?? 0} TP` : 'pending'}</strong></li>)}</ul></details>
    <details><summary>Skills ({character.skills.length})</summary><ul>{character.skills.map((entry, index) => <li key={`${entry.address.skillId}-${index}`}><span>{entry.displayName ?? entry.address.skillId}</span><strong>{entry.level === null ? '—' : `+${entry.level}`}</strong></li>)}</ul></details>
    <details open><summary>Chosen modules</summary>{character.lifeModuleHistory.length === 0 ? <p>None yet.</p> : <ol>{character.lifeModuleHistory.map((entry) => <li key={entry.moduleId}>{entry.displayName}</li>)}</ol>}</details>
  </aside>
}

export function LifeModuleStageStatus({ pendingAwards, warnings }: { pendingAwards: PendingLifeModuleAward[]; warnings: string[] }) {
  return <div className="life-stage-status" aria-label="Current stage status">
    <section className={pendingAwards.length ? 'stage-blockers has-items' : 'stage-blockers'} aria-labelledby="stage-blockers-heading">
      <h3 id="stage-blockers-heading">Current-stage blockers</h3>
      {pendingAwards.length === 0 ? <p>No unresolved award blockers.</p> : <><p>Continue is blocked until these awards are resolved:</p><ul>{pendingAwards.map((entry) => <li key={entry.id}>{entry.kind === 'flexible-xp' && <strong>Flexible XP · </strong>}{entry.description} ({entry.allocationMode === 'pool' ? `${entry.remainingXp} XP remaining` : `${entry.remainingGrants} grant${entry.remainingGrants === 1 ? '' : 's'} remaining`})</li>)}</ul><a href="#pending-awards">Resolve pending awards</a></>}
    </section>
    <section className={warnings.length ? 'stage-warnings has-items' : 'stage-warnings'} aria-labelledby="stage-warnings-heading">
      <h3 id="stage-warnings-heading">Final-validation warnings</h3>
      {warnings.length === 0 ? <p>No deferred warnings recorded.</p> : <><p>These do not block Continue at the current stage.</p><ul>{warnings.map((warning) => <li key={warning}>{warning}</li>)}</ul></>}
    </section>
  </div>
}
