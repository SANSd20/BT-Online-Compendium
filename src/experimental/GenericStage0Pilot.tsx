import { useLayoutEffect, useMemo, useRef, useState, type ChangeEvent, type RefObject } from 'react'
import { clearChoice, selectChoice, type ChoiceDestination, type ChoiceState } from './choiceEditing'
import { genericStage0ChoiceState, genericStage0Packages, type GenericStage0Control } from './genericStage0Metadata'
import { applyUniversalStage0, createLifeModuleCharacter } from '../engine/lifeModuleEngine'
import { FREE_WORLDS_LEAGUE_ID } from '../domain/lifeModules/affiliations'
import { buildAreStage0Transaction, commitAreStage0Transaction } from './stage0TransactionAdapter'
import { dataDrivenRecordsFromArdExport } from './ardExportAdapter'
import { areFwlHistoryAuthority } from './stage0TransactionAdapter'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { downloadCharacter, importCharacterFile } from '../persistence/browserFiles'

export function GenericStage0Pilot() {
  const packages = useMemo(() => genericStage0Packages(), [])
  const [recordId, setRecordId] = useState(packages[0]?.id ?? '')
  const [choiceState, setChoiceState] = useState<ChoiceState>(() => genericStage0ChoiceState(packages[0]?.id ?? ''))
  const [character, setCharacter] = useState(() => applyUniversalStage0(createLifeModuleCharacter('ARE browser pilot'), FREE_WORLDS_LEAGUE_ID, 'English'))
  const [message, setMessage] = useState('')
  const importRef = useRef<HTMLInputElement>(null)
  const firstChoiceRef = useRef<HTMLSelectElement>(null)
  const choiceRefs = useRef<Record<string, HTMLSelectElement | null>>({})
  const initialRecordId = packages[0]?.id ?? ''
  const selected = packages.find((entry) => entry.id === recordId) ?? packages[0]
  const transactionRecordId = dataDrivenRecordsFromArdExport().find((entry) => entry.sourceRuleId === selected?.sourcePath)?.id ?? recordId
  const pending = choiceState.grants.filter((grant) => !choiceState.selections.some((selection) => selection.occurrenceId === grant.occurrenceId)).length
  const resolvedXp = choiceState.selections.reduce((total, selection) => total + (choiceState.grants.find((grant) => grant.occurrenceId === selection.occurrenceId)?.xp ?? 0), 0)
  const transaction = (() => { try { return buildAreStage0Transaction({ character, recordId: transactionRecordId, choiceState }) } catch (error) { return { status: 'failed' as const, errors: [error instanceof Error ? error.message : 'Invalid ARE transaction'] } } })()

  useLayoutEffect(() => {
    if (recordId !== initialRecordId) firstChoiceRef.current?.focus()
  }, [initialRecordId, recordId])
  useLayoutEffect(() => {
    if (recordId === initialRecordId) return
    const next = selected.controls.find((control) => !choiceState.selections.some((selection) => selection.occurrenceId === control.id))
    if (next) choiceRefs.current[next.id]?.focus()
  }, [choiceState, initialRecordId, recordId, selected.controls])

  function selectPackage(id: string) {
    setRecordId(id)
    setChoiceState(genericStage0ChoiceState(id))
    setMessage('')
  }

  function commit() { try { setCharacter(commitAreStage0Transaction({ character, recordId: transactionRecordId, choiceState })); setMessage('Committed through ARE; advanced to Stage 1.') } catch (error) { setMessage(error instanceof Error ? error.message : 'ARE commitment failed.') } }
  function save() { try { localStorage.setItem('atow-are-pilot', encodeCharacter(character)); setMessage('Saved locally.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Save failed.') } }
  function resume() { try { const saved = localStorage.getItem('atow-are-pilot'); if (!saved) throw new Error('No saved pilot character.'); setCharacter(decodeCharacter(saved, { lifeModuleHistoryAuthority: areFwlHistoryAuthority() })); setMessage('Resumed from JSON.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Resume failed.') } }
  function exportJson() { try { downloadCharacter(character); setMessage('JSON exported.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Export failed.') } }
  async function importJson(event: ChangeEvent<HTMLInputElement>) { const file = event.target.files?.[0]; event.target.value = ''; if (!file) return; try { setCharacter(await importCharacterFile(file, { lifeModuleHistoryAuthority: areFwlHistoryAuthority() })); setMessage('JSON imported and validated.') } catch (error) { setMessage(error instanceof Error ? error.message : 'Import failed.') } }

  function update(control: GenericStage0Control, value: string) {
    if (!value) { setChoiceState((state) => clearChoice(state, control.id)); return }
    const destination: ChoiceDestination = control.type === 'trait' ? { type: 'trait', traitId: value } : control.type === 'flexible' && value.startsWith('attribute:') ? { type: 'attribute', attributeId: value.slice('attribute:'.length) } : control.type === 'flexible' && value.startsWith('trait:') ? { type: 'trait', traitId: value.slice('trait:'.length) } : { type: 'skill', skillId: value, subject: 'Pilot choice' }
    try { setChoiceState((state) => selectChoice(state, control.id, destination)) } catch { /* Invalid values remain uncommitted. */ }
  }

  if (!selected) return null
  return <section className="experimental-stage0-pilot" aria-label="Experimental generic Stage 0 pilot">
    <p className="eyebrow">Experimental ARE pilot</p>
    <h1>Generic Stage 0</h1>
    <p>Controls are generated from the ARD export; this pilot is not connected to production routing.</p>
    <label>Affiliation context<select value={recordId} onChange={(event) => selectPackage(event.target.value)}>{packages.map((entry) => <option key={entry.id} value={entry.id}>{entry.label}</option>)}</select></label>
    <p>Source: <code>{selected.sourcePath}</code></p>
    <h2>Fixed awards</h2><ul>{selected.fixedAwards.map((award, index) => <li key={`${award.kind}-${index}`}>{award.kind} · {award.target ?? 'flexible'} · {award.xp} XP</li>)}</ul>
    <h2>Required choices</h2>
    {selected.controls.length === 0 ? <p>No additional choices.</p> : selected.controls.map((control, index) => <PilotControl key={control.id} control={control} state={choiceState} onChange={update} selectRef={index === 0 ? firstChoiceRef : undefined} registerRef={(element) => { choiceRefs.current[control.id] = element }} />)}
    <p aria-live="polite">Pending: <strong>{pending}</strong> · Choice XP: <strong>{resolvedXp}</strong></p>
    <div className="pilot-actions"><button type="button" disabled={pending !== 0 || transaction.status !== 'validated'} onClick={commit}>Continue / commit</button><button type="button" onClick={save}>Save</button><button type="button" onClick={resume}>Resume</button><button type="button" onClick={exportJson}>Export JSON</button><button type="button" onClick={() => importRef.current?.click()}>Import JSON</button><input ref={importRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={importJson} /></div><p role="status">{message}</p>
  </section>
}

function PilotControl({ control, state, onChange, selectRef, registerRef }: { control: GenericStage0Control; state: ChoiceState; onChange: (control: GenericStage0Control, value: string) => void; selectRef?: RefObject<HTMLSelectElement | null>; registerRef: (element: HTMLSelectElement | null) => void }) {
  const selection = state.selections.find((entry) => entry.occurrenceId === control.id)
  const options = control.type === 'flexible' ? [...control.allowedAttributeIds.map((id) => `attribute:${id}`), ...control.allowedTraitIds.map((id) => `trait:${id}`), ...control.allowedSkillIds] : control.type === 'trait' ? control.allowedTraitIds : control.allowedSkillIds
  const value = selection && 'type' in selection ? selection.type === 'attribute' ? `attribute:${selection.attributeId}` : selection.type === 'trait' ? `trait:${selection.traitId}` : selection.skillId : ''
  return <fieldset className="pilot-choice"><legend>{control.label} · {control.xp} XP</legend><select ref={(element) => { registerRef(element); if (selectRef) selectRef.current = element }} aria-label={control.label} value={value} onChange={(event) => onChange(control, event.target.value)}><option value="">Choose…</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></fieldset>
}
