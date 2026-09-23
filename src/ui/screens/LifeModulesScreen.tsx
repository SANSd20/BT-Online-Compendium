import { useState, type FormEvent } from 'react'
import type { CharacterDefinition, PendingLifeModuleAward, ResolvedLifeModuleDestination } from '../../domain/character/model'
import { AGITATOR_ID, BACK_WOODS_ID, BLUE_COLLAR_ID, STAGE_2_BACK_WOODS_ID, STAGE_2_HIGH_SCHOOL_ID } from '../../domain/lifeModules/catalog'
import { TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID } from '../../domain/skillFields/catalog'
import { getFinalReviewBlockers } from '../../domain/lifeModules/finalReview'
import { applyCapellanCommonality, applyStage1Module, applyStage2Module, applyStage4Module, applyTechnicalCollege, applyUniversalStage0, continueToStage2, continueToStage3, continueToStage4, createLifeModuleCharacter, resolvePendingLifeModuleAward } from '../../engine/lifeModuleEngine'
import { allocateFinalReviewXp, applyLifeModuleOptimization, enterLifeModuleFinalReview, previewLifeModuleOptimization } from '../../engine/lifeModuleFinalReview'
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
  xpAmount: number
}

export function LifeModulesScreen({ onSave }: LifeModulesScreenProps) {
  const [name, setName] = useState('')
  const [startingXp, setStartingXp] = useState(5000)
  const [affiliationLanguage, setAffiliationLanguage] = useState('Mandarin Chinese')
  const [secondaryLanguage, setSecondaryLanguage] = useState('Russian')
  const [character, setCharacter] = useState<CharacterDefinition | null>(null)
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, ResolutionDraft>>({})
  const [finalAllocationTarget, setFinalAllocationTarget] = useState('attribute:STR')
  const [finalAllocationXp, setFinalAllocationXp] = useState(1)
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
    operate(() => resolvePendingLifeModuleAward(character, pending.id, destination, pending.allocationMode === 'pool' ? draft.xpAmount : undefined), 'Award grant resolved and applied.')
  }

  const state = character?.creation.lifeModules
  const validation = character ? validateCharacter(character) : null
  const optimizationPreview = character && state?.finalReview ? previewLifeModuleOptimization(character) : []
  const finalReviewBlockers = character && state?.finalReview ? getFinalReviewBlockers(character) : []

  function allocateFinalXp() {
    if (!character) return
    operate(() => allocateFinalReviewXp(character, finalReviewDestination(character, finalAllocationTarget), finalAllocationXp), 'Final-allocation XP applied.')
  }

  return (
    <main className="creation-page life-modules-page">
      <a className="back-link" href="#/">← Character Creator</a>
      <section className="hero compact">
        <p className="eyebrow">Alpha · Slice 9</p>
        <h1>Life Modules</h1>
        <p>Build a sourced draft through the audited Agitator branch, then explicitly review final XP, derived levels, prerequisites, and Optimization. Equipment and full finalization remain deferred.</p>
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
            {state.phase === 'alpha-partial-stop' && <div className="life-action"><p className="notice">Stage 0 and Stage 1 are complete. This is a valid Alpha partial stop—not a finalized Beta 1 character.</p><button className="button" type="button" onClick={() => operate(() => continueToStage2(character), 'Stage 2 continuation opened.')}>Continue to Stage 2</button></div>}
            {state.phase === 'stage-2-selection' && (
              <div className="stage-options">
                <article><h3>Back Woods</h3><p>500 XP · fixed awards, Protocol/Affiliation, and a 125 XP flexible pool.</p><button className="button" type="button" onClick={() => operate(() => applyStage2Module(character, STAGE_2_BACK_WOODS_ID), 'Stage 2 Back Woods selected.')}>Select Back Woods</button></article>
                <article><h3>High School</h3><p>400 XP · requires a non-Clan affiliation and no active Illiterate Trait; includes Interest, affiliation, and 185 flexible XP awards.</p><button className="button" type="button" onClick={() => operate(() => applyStage2Module(character, STAGE_2_HIGH_SCHOOL_ID), 'Stage 2 High School selected.')}>Select High School</button></article>
              </div>
            )}
            {state.phase === 'stage-2-resolution' && <p className="notice">Stage 2 is selected. Resolve all Stage 2 source-bound choices and flexible XP below.</p>}
            {state.phase === 'stage-2-prerequisite-review' && <p className="notice">All Stage 2 awards are resolved, but one or more prerequisites remain outstanding for eventual final validation.</p>}
            {state.phase === 'alpha-stage-2-stop' && <div className="life-action"><p className="notice">Stage 0 through Stage 2 are complete. This is a valid Alpha partial stop—not a finalized Beta 1 character.</p><button className="button" type="button" onClick={() => operate(() => continueToStage3(character), 'Stage 3 continuation opened.')}>Continue to Stage 3</button></div>}
            {state.phase === 'stage-3-selection' && (
              <div className="stage-options">
                <article>
                  <h3>Technical College</h3>
                  <p>600 XP base cost · civilian Higher Education school.</p>
                  <label><input type="checkbox" checked readOnly /> Technician/Civilian — Basic, 120 XP, +1 year</label>
                  <label><input type="checkbox" checked readOnly /> Technician/Vehicle — Advanced, 96 XP, +2 years</label>
                  <p><strong>Total: 816 XP · +3 years · expected age 19</strong></p>
                  <button className="button" type="button" onClick={() => operate(() => applyTechnicalCollege(character, [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID]), 'Technical College and selected Skill Fields applied.')}>Select Technical College path</button>
                </article>
              </div>
            )}
            {state.phase === 'stage-3-resolution' && <p className="notice">Technical College is selected. Resolve Interest/Any and all flexible XP below.</p>}
            {state.phase === 'stage-3-prerequisite-review' && <p className="notice">All Stage 3 awards are resolved, but one or more Skill Field prerequisites remain outstanding for eventual final validation.</p>}
            {state.phase === 'alpha-stage-3-stop' && <div className="life-action"><p className="notice">The minimal Technical College Stage 3 branch is complete. This is an Alpha partial stop—not a finalized character.</p><button className="button" type="button" onClick={() => operate(() => continueToStage4(character), 'Stage 4 continuation opened.')}>Continue to Stage 4</button></div>}
            {state.phase === 'stage-4-selection' && (
              <div className="stage-options">
                <article>
                  <h3>Agitator</h3>
                  <p>900 XP · Real Life module · +4 years.</p>
                  <p>Includes fixed Attribute, Trait, and Skill awards; three concrete subskill choices; and 125 flexible XP with a 50-XP cap per Attribute.</p>
                  <p><strong>Expected age: 23</strong></p>
                  <button className="button" type="button" onClick={() => operate(() => applyStage4Module(character, AGITATOR_ID), 'Agitator selected; pending awards retained.')}>Select Agitator</button>
                </article>
              </div>
            )}
            {state.phase === 'stage-4-resolution' && <p className="notice">Agitator is selected. Resolve Driving/Any, Prestidigitation/Any, Streetwise/Affiliation, and all flexible XP below.</p>}
            {state.phase === 'stage-4-prerequisite-review' && <div className="life-action"><p className="notice">All Stage 4 awards are resolved, but one or more prerequisites remain outstanding. Enter final review to allocate XP and re-evaluate them.</p><button className="button" type="button" onClick={() => operate(() => enterLifeModuleFinalReview(character), 'Life Module final review opened with outstanding prerequisites.')}>Enter final review</button></div>}
            {state.phase === 'alpha-stage-4-stop' && <div className="life-action"><p className="notice">The minimal Agitator Stage 4 branch is complete at age {currentAge(character) ?? 'unknown'}. Enter final review to allocate remaining XP and explicitly apply Optimization.</p><button className="button" type="button" onClick={() => operate(() => enterLifeModuleFinalReview(character), 'Life Module final review opened.')}>Enter final review</button></div>}
            {state.phase === 'alpha-final-review' && <p className="notice">Final review is in progress. Resolve every blocker below before the character can be marked ready for Final Touches.</p>}
            {state.phase === 'ready-for-final-touches' && <p className="notice">This draft is ready for Final Touches. Equipment purchasing, PDF export, true character locking, and ready-for-play status remain unsupported.</p>}
          </section>

          {state.finalReview && <section className="life-stage-panel">
            <p className="eyebrow">Final review</p>
            <h2>{state.finalReview.readiness === 'ready-for-final-touches' ? 'Ready for Final Touches' : 'Review required'}</h2>
            <div className="xp-dashboard" aria-label="Final allocation XP status">
              <div><span>Starting final pool</span><strong>{state.finalReview.allocationPool.starting.toLocaleString()}</strong></div>
              <div><span>Allocated</span><strong>{state.finalReview.allocationPool.allocated.toLocaleString()}</strong></div>
              <div><span>Optimization returned</span><strong>{state.finalReview.allocationPool.optimizationReturned.toLocaleString()}</strong></div>
              <div><span>Remaining</span><strong>{state.finalReview.allocationPool.remaining.toLocaleString()}</strong></div>
            </div>
            <h3>Allocate remaining XP</h3>
            <div className="row-actions">
              <label>Existing statistic
                <select value={finalAllocationTarget} onChange={(event) => setFinalAllocationTarget(event.target.value)}>
                  {character.attributes.map((entry) => <option key={`attribute:${entry.attributeId}`} value={`attribute:${entry.attributeId}`}>Attribute · {entry.attributeId}</option>)}
                  {character.traits.map((entry, index) => <option key={`trait:${index}`} value={`trait:${index}`}>Trait · {entry.displayName}</option>)}
                  {character.skills.map((entry, index) => <option key={`skill:${index}`} value={`skill:${index}`}>Skill · {entry.displayName}</option>)}
                </select>
              </label>
              <label>XP<input type="number" min="1" max={state.finalReview.allocationPool.remaining} step="1" value={finalAllocationXp} onChange={(event) => setFinalAllocationXp(Number(event.target.value))} /></label>
              <button className="button" type="button" disabled={state.finalReview.allocationPool.remaining === 0} onClick={allocateFinalXp}>Allocate XP</button>
            </div>
            <h3>Optimization preview</h3>
            {optimizationPreview.length === 0 ? <p>No supported Optimization opportunities remain.</p> : <ul className="module-history">{optimizationPreview.map((entry) => <li key={entry.id}><div><strong>{entry.destination.displayName}</strong><span>{signed(entry.beforeXp)} → {signed(entry.afterXp)} XP · return {entry.returnedXp} XP · {entry.reason}</span></div><button className="button secondary" type="button" onClick={() => operate(() => applyLifeModuleOptimization(character, entry.id), 'Optimization applied and returned XP to final allocation.')}>Apply</button></li>)}</ul>}
            <h3>Review blockers</h3>
            {finalReviewBlockers.length === 0 ? <p>No final-review blockers remain.</p> : <ul>{finalReviewBlockers.map((entry) => <li key={entry.id}>{entry.message}</li>)}</ul>}
            <p className="scope-note">Negative-Trait XP purchase cap: {state.finalReview.negativeTraitXpPurchase.capXp} XP. The purchase UI is intentionally deferred.</p>
            <p className="scope-note">Final review does not purchase equipment, export PDF, lock the character, or mark it ready for play.</p>
          </section>}

          <section className="life-stage-panel">
            <h2>Selected modules</h2>
            {character.lifeModuleHistory.length === 0 ? <p className="empty">No modules selected.</p> : (
              <ul className="module-history">{character.lifeModuleHistory.map((entry) => <li key={entry.moduleId}><div><strong>{entry.displayName}</strong><span>Stage {entry.stage} · {entry.costXp} XP{entry.baseCostXp !== undefined ? ` (${entry.baseCostXp} base + ${entry.fieldCostXp} Fields)` : ''}{entry.chronologyYears ? ` · +${entry.chronologyYears} years` : ''}{entry.source.page ? ` · Core p. ${entry.source.page}` : ''}</span></div></li>)}</ul>
            )}
          </section>

          {state.selectedSkillFields.length > 0 && <section className="life-stage-panel">
            <h2>Selected Skill Fields</h2>
            <ul className="module-history">{state.selectedSkillFields.map((entry) => <li key={entry.id}><div><strong>{entry.displayName}</strong><span>{entry.category} · {entry.purchaseCostXp} XP · +{entry.xpPerSkill} XP per Skill · +{entry.chronologyYears} year{entry.chronologyYears === 1 ? '' : 's'}</span></div></li>)}</ul>
            <p>Current recorded age: {currentAge(character) ?? 'not established'}</p>
          </section>}

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
                    <div><strong>{entry.description}</strong><p>{entry.allocationMode === 'pool' ? `${entry.remainingXp} XP remaining` : `${entry.remainingGrants} grant${entry.remainingGrants === 1 ? '' : 's'} remaining · ${signed(entry.xpPerGrant)} XP each`}</p></div>
                    {entry.kind === 'flexible-xp' && (
                      <><label>Target type
                        <select value={draft.targetType} onChange={(event) => updateResolutionDraft(entry, { targetType: event.target.value as ResolutionDraft['targetType'], targetId: '', parameter: '', displayName: '' })}>
                          {entry.allowedTargetTypes.map((type) => <option key={type}>{type}</option>)}
                        </select>
                      </label>{entry.allocationMode === 'pool' && <label>XP to allocate<input type="number" min="1" max={entry.remainingXp} step="1" value={draft.xpAmount} onChange={(event) => updateResolutionDraft(entry, { xpAmount: Number(event.target.value) })} /></label>}</>
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
                    <button className="button" type="button" onClick={() => resolve(entry)}>{entry.allocationMode === 'pool' ? 'Allocate XP' : 'Apply one grant'}</button>
                  </article>
                )
              })}</div>
            )}
          </section>

          <section className="life-stage-panel">
            <h2>Resolved choices</h2>
            {state.resolvedAwards.length === 0 ? <p>No choice awards resolved.</p> : <ul className="module-history">{state.resolvedAwards.map((entry) => <li key={entry.id}><div><strong>{entry.destination.displayName}</strong><span>{entry.awardId} · {signed(entry.xp)} XP{entry.source.page ? ` · Core p. ${entry.source.page}` : ''}</span></div></li>)}</ul>}
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
    return { targetType: 'skill', targetId: pending.requiredSkillId, parameter: '', displayName: skillName(pending.requiredSkillId), xpAmount: Math.min(pending.remainingXp ?? pending.xpPerGrant, 35) }
  }
  const targetType = pending.allowedTargetTypes[0]
  const targetCap = pending.maxXpPerTarget?.[targetType] ?? (targetType === 'skill' ? 35 : 200)
  return { targetType, targetId: targetType === 'attribute' ? 'STR' : '', parameter: '', displayName: targetType === 'attribute' ? 'STR' : '', xpAmount: Math.min(pending.remainingXp ?? pending.xpPerGrant, targetCap) }
}

function destinationDisplayName(draft: ResolutionDraft): string {
  const base = draft.displayName || draft.targetId
  return draft.parameter.trim() ? `${base}/${draft.parameter.trim()}` : base
}

function skillName(skillId: string): string {
  return skillId.replace('skill.', '').split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function currentAge(character: CharacterDefinition): number | null {
  const ages = character.chronology.map((entry) => Number(entry.date.match(/^age:(\d+)$/)?.[1])).filter(Number.isFinite)
  return ages.length > 0 ? Math.max(...ages) : null
}

function finalReviewDestination(character: CharacterDefinition, selection: string): ResolvedLifeModuleDestination {
  const [type, identifier] = selection.split(':')
  if (type === 'attribute') return { type, targetId: identifier, displayName: identifier }
  const index = Number(identifier)
  if (type === 'trait') {
    const entry = character.traits[index]
    if (!entry) throw new Error('Select a valid existing Trait destination.')
    return { type, targetId: entry.traitId, displayName: entry.displayName ?? entry.traitId, parameters: { ...entry.parameters } }
  }
  if (type === 'skill') {
    const entry = character.skills[index]
    if (!entry) throw new Error('Select a valid existing Skill destination.')
    return { type, targetId: entry.address.skillId, displayName: entry.displayName ?? entry.address.skillId, ...(entry.address.parameter ? { parameter: { ...entry.address.parameter } } : {}) }
  }
  throw new Error('Select a valid final-allocation destination.')
}
