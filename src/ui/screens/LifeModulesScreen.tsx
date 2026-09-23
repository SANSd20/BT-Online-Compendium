import { useState, type FormEvent } from 'react'
import type { CharacterDefinition, PendingLifeModuleAward, ResolvedLifeModuleDestination } from '../../domain/character/model'
import { BACK_WOODS_ID, BLUE_COLLAR_ID } from '../../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter, resolvePendingLifeModuleAward } from '../../engine/lifeModuleEngine'
import { downloadCharacter } from '../../persistence/browserFiles'
import { validateCharacter } from '../../validation/validateCharacter'

interface LifeModulesScreenProps {
  onSave: (character: CharacterDefinition) => void
}

const AFFILIATION_LANGUAGES = ['Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English']
const SECONDARY_LANGUAGES = ['Russian', 'Cantonese', 'Vietnamese', 'English']
const ATTRIBUTE_IDS = ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG']

interface ResolutionDraft {
  targetType: 'attribute' | 'trait' | 'skill'
  targetId: string
  parameter: string
  displayName: string
}

export function LifeModulesScreen({ onSave }: LifeModulesScreenProps) {
  const [name, setName] = useState('')
  const [startingXp, setStartingXp] = useState(5000)
  const [affiliationLanguage, setAffiliationLanguage] = useState('Mandarin Chinese')
  const [secondaryLanguage, setSecondaryLanguage] = useState('Russian')
  const [character, setCharacter] = useState<CharacterDefinition | null>(null)
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, ResolutionDraft>>({})
  const [message, setMessage] = useState('')

  function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    operate(() => createLifeModuleCharacter(name, startingXp), 'Life Module draft created and saved locally.')
  }

  function operate(operation: () => CharacterDefinition, success: string) {
    try {
      const next = operation()
      setCharacter(next)
      onSave(next)
      setMessage(success)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Life Module operation failed.')
    }
  }

  function updateResolutionDraft(pending: PendingLifeModuleAward, change: Partial<ResolutionDraft>) {
    setResolutionDrafts((current) => ({ ...current, [pending.id]: { ...defaultResolutionDraft(pending), ...current[pending.id], ...change } }))
  }

  function resolve(pending: PendingLifeModuleAward) {
    if (!character) return
    const draft = { ...defaultResolutionDraft(pending), ...resolutionDrafts[pending.id] }
    const destination: ResolvedLifeModuleDestination = {
      type: draft.targetType,
      targetId: draft.targetId,
      displayName: draft.displayName || destinationDisplayName(draft),
      ...(draft.parameter.trim() ? { parameter: { kind: 'subskill', value: draft.parameter } } : {}),
    }
    operate(() => resolvePendingLifeModuleAward(character, pending.id, destination), 'Award grant resolved and applied.')
  }

  const state = character?.creation.lifeModules
  const validation = character ? validateCharacter(character) : null

  return (
    <main className="creation-page life-modules-page">
      <a className="back-link" href="#/">← Character Creator</a>
      <section className="hero compact">
        <p className="eyebrow">Alpha · Slice 5</p>
        <h1>Life Modules</h1>
        <p>Build a sourced draft through the first two Life Module stages. Module-purchasing XP remains separate from XP awarded to character statistics.</p>
      </section>

      {!character ? (
        <section className="draft-panel">
          <h2>Start a Life Modules draft</h2>
          <form onSubmit={start}>
            <label htmlFor="life-module-name">Character name</label>
            <input id="life-module-name" value={name} onChange={(event) => setName(event.target.value)} required />
            <label htmlFor="life-module-starting-xp">Starting XP</label>
            <input id="life-module-starting-xp" type="number" min="1" step="1" value={startingXp} onChange={(event) => setStartingXp(Number(event.target.value))} required />
            <button className="button" type="submit">Create Life Module draft</button>
          </form>
          <p className="scope-note">The Core default is 5,000 XP. Any other positive whole-number allotment is recorded as GM-adjusted.</p>
        </section>
      ) : state ? (
        <>
          <section className="xp-dashboard" aria-label="Life Module XP status">
            <div><span>Module pool</span><strong>{state.moduleXp.starting.toLocaleString()}</strong></div>
            <div><span>Module costs</span><strong>{state.moduleXp.spent.toLocaleString()}</strong></div>
            <div><span>Remaining</span><strong>{state.moduleXp.remaining.toLocaleString()}</strong></div>
            <div><span>Stat XP (net)</span><strong>{character.xp.creation.allocated.toLocaleString()}</strong></div>
          </section>

          <section className="life-stage-panel">
            <p className="eyebrow">Current state</p>
            <h2>{formatPhase(state.phase)}</h2>
            {state.phase === 'stage-0-universal' && (
              <div className="life-action">
                <div><h3>Universal Fixed Experience Points</h3><p>850 XP · +100 XP to every Attribute, two Language awards, and Perception +10 XP.</p></div>
                <label>Affiliation language
                  <select value={affiliationLanguage} onChange={(event) => setAffiliationLanguage(event.target.value)}>
                    {AFFILIATION_LANGUAGES.map((language) => <option key={language}>{language}</option>)}
                  </select>
                </label>
                <button className="button" type="button" onClick={() => operate(() => applyUniversalStage0(character, affiliationLanguage), 'Universal Stage 0 package applied.')}>Apply universal package</button>
              </div>
            )}
            {state.phase === 'stage-0-affiliation' && (
              <div className="life-action">
                <div><h3>Capellan Confederation / Capellan Commonality</h3><p>150 XP · the audited Alpha affiliation and sub-affiliation package.</p></div>
                <label>Capellan secondary-language award
                  <select value={secondaryLanguage} onChange={(event) => setSecondaryLanguage(event.target.value)}>
                    {SECONDARY_LANGUAGES.map((language) => <option key={language}>{language}</option>)}
                  </select>
                </label>
                <button className="button" type="button" onClick={() => operate(() => applyCapellanCommonality(character, secondaryLanguage), 'Capellan affiliation package applied.')}>Select affiliation</button>
              </div>
            )}
            {state.phase === 'stage-1-selection' && (
              <div className="stage-options">
                <article><h3>Blue Collar</h3><p>210 XP · fixed Attribute awards plus unresolved Career, Interest, and flexible awards.</p><button className="button" type="button" onClick={() => operate(() => applyStage1Module(character, BLUE_COLLAR_ID), 'Blue Collar selected; unresolved awards retained.')}>Select Blue Collar</button></article>
                <article><h3>Back Woods</h3><p>290 XP · fixed Attribute, Trait, and Skill awards; STR 4+ and BOD 5+ are checked for final validation.</p><button className="button" type="button" onClick={() => operate(() => applyStage1Module(character, BACK_WOODS_ID), 'Back Woods selected; unresolved awards and prerequisites retained.')}>Select Back Woods</button></article>
              </div>
            )}
            {state.phase === 'stage-1-resolution' && <p className="notice">Stage 1 is selected. Resolve every source-bound choice and flexible grant below before reaching an Alpha partial stop.</p>}
            {state.phase === 'stage-1-prerequisite-review' && <p className="notice">All awards are resolved, but one or more module prerequisites remain outstanding for eventual final validation.</p>}
            {state.phase === 'alpha-partial-stop' && <p className="notice">Stage 0 and Stage 1 are complete for the implemented catalog. This is a valid Alpha partial stop—not a finalized Beta 1 character. Later-stage continuation and full finalization remain unsupported.</p>}
          </section>

          <section className="life-stage-panel">
            <h2>Selected modules</h2>
            {character.lifeModuleHistory.length === 0 ? <p className="empty">No modules selected.</p> : (
              <ul className="module-history">{character.lifeModuleHistory.map((entry) => <li key={entry.moduleId}><div><strong>{entry.displayName}</strong><span>Stage {entry.stage} · {entry.costXp} XP · Core p. {entry.source.page}</span></div></li>)}</ul>
            )}
          </section>

          <section className="life-stage-panel">
            <h2>Applied awards</h2>
            <div className="award-columns">
              <div><h3>Attributes</h3><ul>{character.attributes.map((entry) => <li key={entry.attributeId}>{entry.attributeId}: {signed(entry.accumulatedXp)} XP · attained {entry.purchasedLevel ?? '—'}</li>)}</ul></div>
              <div><h3>Traits</h3><ul>{character.traits.map((entry, index) => <li key={`${entry.traitId}-${index}`}>{entry.displayName}: {signed(entry.accumulatedXp)} XP · {entry.active ? `${signed(entry.attainedTp ?? 0)} TP active` : 'not yet active'}</li>)}</ul></div>
              <div><h3>Skills</h3><ul>{character.skills.map((entry) => <li key={`${entry.address.skillId}-${entry.address.parameter?.value ?? ''}`}>{entry.displayName}: {signed(entry.accumulatedXp)} XP · {entry.level === null ? 'untrained' : `Level +${entry.level}`}</li>)}</ul></div>
            </div>
          </section>

          <section className="life-stage-panel">
            <h2>Pending award resolution</h2>
            {state.pendingAwards.length === 0 ? <p>No unresolved award allocations.</p> : (
              <div className="pending-awards">{state.pendingAwards.map((entry) => {
                const draft = { ...defaultResolutionDraft(entry), ...resolutionDrafts[entry.id] }
                return (
                  <article key={entry.id}>
                    <div><strong>{entry.description}</strong><p>{entry.remainingGrants} grant{entry.remainingGrants === 1 ? '' : 's'} remaining · {signed(entry.xpPerGrant)} XP each</p></div>
                    {entry.kind === 'flexible-xp' && (
                      <label>Target type
                        <select value={draft.targetType} onChange={(event) => updateResolutionDraft(entry, { targetType: event.target.value as ResolutionDraft['targetType'], targetId: '', parameter: '', displayName: '' })}>
                          {entry.allowedTargetTypes.map((type) => <option key={type}>{type}</option>)}
                        </select>
                      </label>
                    )}
                    {draft.targetType === 'attribute' ? (
                      <label>Attribute
                        <select value={draft.targetId} onChange={(event) => updateResolutionDraft(entry, { targetId: event.target.value, displayName: event.target.value })}>
                          {ATTRIBUTE_IDS.map((id) => <option key={id}>{id}</option>)}
                        </select>
                      </label>
                    ) : entry.requiredSkillId ? (
                      <label>{entry.kind === 'language-choice' ? 'Language' : 'Concrete subskill'}
                        <input value={draft.parameter} onChange={(event) => updateResolutionDraft(entry, { parameter: event.target.value, displayName: `${skillName(entry.requiredSkillId!)}/${event.target.value}` })} placeholder={entry.kind === 'language-choice' ? 'Concrete language' : 'Concrete subskill'} />
                      </label>
                    ) : (
                      <>
                        <label>Stable rule ID
                          <input value={draft.targetId} onChange={(event) => updateResolutionDraft(entry, { targetId: event.target.value })} placeholder={draft.targetType === 'trait' ? 'trait.fit' : 'skill.perception'} />
                        </label>
                        {draft.targetType === 'skill' && <label>Subskill, if applicable<input value={draft.parameter} onChange={(event) => updateResolutionDraft(entry, { parameter: event.target.value })} /></label>}
                        <label>Display name
                          <input value={draft.displayName} onChange={(event) => updateResolutionDraft(entry, { displayName: event.target.value })} placeholder="Published destination name" />
                        </label>
                      </>
                    )}
                    <button className="button" type="button" onClick={() => resolve(entry)}>Apply one grant</button>
                  </article>
                )
              })}</div>
            )}
          </section>

          <section className="life-stage-panel">
            <h2>Resolved choices</h2>
            {state.resolvedAwards.length === 0 ? <p>No choice awards resolved.</p> : <ul className="module-history">{state.resolvedAwards.map((entry) => <li key={entry.id}><div><strong>{entry.destination.displayName}</strong><span>{entry.awardId} · {signed(entry.xp)} XP · Core p. {entry.source.page}</span></div></li>)}</ul>}
          </section>

          <section className="life-stage-panel">
            <h2>Rule status</h2>
            {state.prerequisiteIssues.map((entry) => <p className={entry.status === 'outstanding' ? 'notice' : ''} key={entry.id}>{entry.description}: {entry.status}</p>)}
            <h3>Validation</h3>
            <ul>{validation?.issues.map((entry) => <li className={entry.severity} key={`${entry.id}/${entry.path}`}>{entry.message}</li>)}</ul>
            <div className="row-actions">
              <button className="button" type="button" onClick={() => { onSave(character); setMessage('Life Module draft saved locally.') }}>Save draft</button>
              <button className="button secondary" type="button" onClick={() => downloadCharacter(character)}>Export character JSON</button>
            </div>
          </section>
        </>
      ) : null}
      {message && <p className="notice" role="status">{message}</p>}
    </main>
  )
}

function formatPhase(phase: string): string {
  return phase.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value)
}

function defaultResolutionDraft(pending: PendingLifeModuleAward): ResolutionDraft {
  if (pending.requiredSkillId) {
    return { targetType: 'skill', targetId: pending.requiredSkillId, parameter: '', displayName: skillName(pending.requiredSkillId) }
  }
  const targetType = pending.allowedTargetTypes[0]
  return { targetType, targetId: targetType === 'attribute' ? 'STR' : '', parameter: '', displayName: targetType === 'attribute' ? 'STR' : '' }
}

function destinationDisplayName(draft: ResolutionDraft): string {
  const base = draft.displayName || draft.targetId
  return draft.parameter.trim() ? `${base}/${draft.parameter.trim()}` : base
}

function skillName(skillId: string): string {
  return skillId.replace('skill.', '').split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}
