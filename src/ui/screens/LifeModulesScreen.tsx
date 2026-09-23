import { useState, type FormEvent } from 'react'
import type { CharacterDefinition } from '../../domain/character/model'
import { BACK_WOODS_ID, BLUE_COLLAR_ID } from '../../domain/lifeModules/catalog'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { downloadCharacter } from '../../persistence/browserFiles'
import { validateCharacter } from '../../validation/validateCharacter'

interface LifeModulesScreenProps {
  onSave: (character: CharacterDefinition) => void
}

const AFFILIATION_LANGUAGES = ['Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English']
const SECONDARY_LANGUAGES = ['Russian', 'Cantonese', 'Vietnamese', 'English']

export function LifeModulesScreen({ onSave }: LifeModulesScreenProps) {
  const [name, setName] = useState('')
  const [startingXp, setStartingXp] = useState(5000)
  const [affiliationLanguage, setAffiliationLanguage] = useState('Mandarin Chinese')
  const [secondaryLanguage, setSecondaryLanguage] = useState('Russian')
  const [character, setCharacter] = useState<CharacterDefinition | null>(null)
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

  const state = character?.creation.lifeModules
  const validation = character ? validateCharacter(character) : null

  return (
    <main className="creation-page life-modules-page">
      <a className="back-link" href="#/">← Character Creator</a>
      <section className="hero compact">
        <p className="eyebrow">Beta 1 · Slice 4</p>
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
                <div><h3>Capellan Confederation / Capellan Commonality</h3><p>150 XP · the audited Slice 4 affiliation and sub-affiliation package.</p></div>
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
            {state.phase === 'stage-1-resolution' && <p className="notice">Stage 1 is selected, but source-bound choice and flexible awards remain unresolved. Slice 4 preserves them and does not falsely advance or finalize the character.</p>}
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
            <h2>Outstanding rule state</h2>
            {state.pendingAwards.length === 0 ? <p>No unresolved award allocations.</p> : <ul>{state.pendingAwards.map((entry) => <li key={entry.id}><strong>{entry.description}</strong> {entry.remainingGrants} × {signed(entry.xpPerGrant)} XP · {entry.moduleId}</li>)}</ul>}
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

