import { useMemo, useState, type FormEvent } from 'react'
import type { CharacterDefinition } from '../../domain/character/model'
import {
  archetypeSkillTargetId,
  getArchetypeAdjustmentBalance,
  getArchetypeDefinition,
  getArchetypeSkillSwapTargets,
  removeArchetypeAdjustment,
  setArchetypeAttributeAdjustment,
  setArchetypeSkillAdjustment,
  swapArchetypeSkill,
} from '../../engine/archetypeAdjustmentEngine'

interface ArchetypeAdjustmentPanelProps {
  character: CharacterDefinition
  onChange: (character: CharacterDefinition) => void
}

export function ArchetypeAdjustmentPanel({ character, onChange }: ArchetypeAdjustmentPanelProps) {
  const definition = getArchetypeDefinition(character)
  const [targetType, setTargetType] = useState<'attribute' | 'skill'>('attribute')
  const targets = useMemo(() => targetType === 'attribute'
    ? definition.attributes.map((entry) => ({ id: entry.attributeId, label: entry.attributeId, level: entry.purchasedLevel }))
    : definition.skills.map((entry) => ({ id: archetypeSkillTargetId(entry.address), label: entry.displayName, level: entry.level })),
  [definition, targetType])
  const [targetId, setTargetId] = useState(targets[0]?.id ?? '')
  const selectedTarget = targets.find((entry) => entry.id === targetId) ?? targets[0]
  const [afterLevel, setAfterLevel] = useState(selectedTarget?.level ?? 0)
  const [note, setNote] = useState('')
  const swapSources = useMemo(() => definition.skills
    .map((entry) => ({
      id: archetypeSkillTargetId(entry.address),
      label: entry.displayName,
      level: entry.level,
    }))
    .filter((entry) => getArchetypeSkillSwapTargets(character, entry.id).length > 0),
  [character, definition])
  const [swapSourceId, setSwapSourceId] = useState(swapSources[0]?.id ?? '')
  const selectedSwapSourceId = swapSources.some((entry) => entry.id === swapSourceId) ? swapSourceId : (swapSources[0]?.id ?? '')
  const swapTargets = useMemo(() => selectedSwapSourceId ? getArchetypeSkillSwapTargets(character, selectedSwapSourceId) : [], [character, selectedSwapSourceId])
  const [swapTargetId, setSwapTargetId] = useState(swapTargets[0]?.targetId ?? '')
  const selectedSwapTargetId = swapTargets.some((entry) => entry.targetId === swapTargetId) ? swapTargetId : (swapTargets[0]?.targetId ?? '')
  const [swapNote, setSwapNote] = useState('')
  const [message, setMessage] = useState('')
  const state = character.creation.archetype!
  const balance = getArchetypeAdjustmentBalance(character)

  function changeTargetType(nextType: 'attribute' | 'skill') {
    setTargetType(nextType)
    if (nextType === 'attribute') {
      setTargetId(definition.attributes[0]?.attributeId ?? '')
      setAfterLevel(definition.attributes[0]?.purchasedLevel ?? 1)
    } else {
      setTargetId(definition.skills[0] ? archetypeSkillTargetId(definition.skills[0].address) : '')
      setAfterLevel(definition.skills[0]?.level ?? 0)
    }
    setMessage('')
  }

  function changeTarget(nextId: string) {
    setTargetId(nextId)
    const target = targets.find((entry) => entry.id === nextId)
    if (target) setAfterLevel(target.level)
    setMessage('')
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedTarget) return
    try {
      const updated = targetType === 'attribute'
        ? setArchetypeAttributeAdjustment(character, selectedTarget.id, afterLevel, note)
        : setArchetypeSkillAdjustment(character, selectedTarget.id, afterLevel, note)
      onChange(updated)
      setNote('')
      setMessage(afterLevel === selectedTarget.level ? 'The target remains at its source value; any prior adjustment was removed.' : 'Controlled adjustment recorded.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Adjustment failed.')
    }
  }

  function remove(adjustmentId: string) {
    try {
      onChange(removeArchetypeAdjustment(character, adjustmentId))
      setMessage('Adjustment removed and the source-backed value restored.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Adjustment removal failed.')
    }
  }

  function submitSwap(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!selectedSwapSourceId || !selectedSwapTargetId) return
    try {
      onChange(swapArchetypeSkill(character, selectedSwapSourceId, selectedSwapTargetId, swapNote))
      setSwapNote('')
      setMessage('XP-balanced Skill swap recorded. The original Skill remains preserved in the Archetype foundation.')
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Skill swap failed.')
    }
  }

  return (
    <section className="adjustment-panel" aria-labelledby="archetype-adjustment-heading">
      <div className="adjustment-heading">
        <div>
          <p className="eyebrow">Before Final Touches</p>
          <h2 id="archetype-adjustment-heading">Controlled Archetype Adjustments</h2>
        </div>
        <span className={balance.balanced ? 'balance-badge balanced' : 'balance-badge unbalanced'}>
          {balance.balanced ? 'Balanced' : 'Unbalanced'} · {signed(balance.netXp)} XP
        </span>
      </div>
      <p>You may adjust this Archetype before Final Touches by making XP-balanced changes. The original Archetype is preserved as the source foundation, and all adjustments are tracked separately.</p>
      <p className="notice">Total increases must equal total decreases. There is no GM override or freeform unbalanced completion. Trait adjustments remain deferred.</p>

      <form className="adjustment-form" onSubmit={submit}>
        <label>Target type
          <select value={targetType} onChange={(event) => changeTargetType(event.target.value as 'attribute' | 'skill')}>
            <option value="attribute">Attribute</option>
            <option value="skill">Existing Skill</option>
          </select>
        </label>
        <label>Foundation target
          <select value={selectedTarget?.id ?? ''} onChange={(event) => changeTarget(event.target.value)}>
            {targets.map((entry) => <option key={entry.id} value={entry.id}>{entry.label} · source level {entry.level}</option>)}
          </select>
        </label>
        <label>Adjusted level
          <input type="number" min={targetType === 'attribute' ? 1 : 0} max={10} value={afterLevel} onChange={(event) => setAfterLevel(Number(event.target.value))} />
        </label>
        <label>Note (optional)
          <input value={note} onChange={(event) => setNote(event.target.value)} placeholder="Reason for this adjustment" />
        </label>
        <button className="button" type="submit">Record adjustment</button>
      </form>

      <section className="skill-swap-panel" aria-labelledby="skill-swap-heading">
        <h3 id="skill-swap-heading">Bounded Skill swap</h3>
        <p>Skill swaps are limited to safe, XP-balanced replacements already audited in the Core Archetype data. The original Skill remains preserved in the foundation; the swap is recorded separately as an adjustment.</p>
        <p className="notice">Some Skills require a subskill. Ambiguous or unresolved subskills are blocked rather than guessed. Full Skill catalog selection, specialties, and arbitrary new Skills remain future work.</p>
        {swapSources.length === 0 ? (
          <p>No currently unadjusted foundation Skill has an available safe replacement.</p>
        ) : (
          <form className="adjustment-form" onSubmit={submitSwap}>
            <label>Source foundation Skill
              <select value={selectedSwapSourceId} onChange={(event) => { setSwapSourceId(event.target.value); setSwapTargetId(''); setMessage('') }}>
                {swapSources.map((entry) => <option key={entry.id} value={entry.id}>{entry.label} · level {entry.level}</option>)}
              </select>
            </label>
            <label>Audited XP-equivalent replacement
              <select value={selectedSwapTargetId} onChange={(event) => { setSwapTargetId(event.target.value); setMessage('') }}>
                {swapTargets.map((entry) => <option key={entry.targetId} value={entry.targetId}>{entry.displayName} · level {entry.level} · {entry.xp} XP</option>)}
              </select>
            </label>
            <label>Swap note (optional)
              <input value={swapNote} onChange={(event) => setSwapNote(event.target.value)} placeholder="Reason for this Skill swap" />
            </label>
            <button className="button" type="submit">Record Skill swap</button>
          </form>
        )}
      </section>

      {message && <p className="notice" role="status">{message}</p>}
      <dl className="source-card adjustment-balance">
        <div><dt>Increases</dt><dd>+{balance.positiveXp} XP</dd></div>
        <div><dt>Decreases</dt><dd>{balance.negativeXp} XP</dd></div>
        <div><dt>Net adjustment</dt><dd>{signed(balance.netXp)} XP</dd></div>
        <div><dt>Completion</dt><dd>{balance.balanced ? 'Save/export allowed' : 'Save/export blocked'}</dd></div>
      </dl>

      {state.adjustmentLedger.length === 0 ? (
        <p>No controlled adjustments recorded. The character still matches the original source package.</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead><tr><th>Target</th><th>Change</th><th>XP delta</th><th>Note</th><th>Action</th></tr></thead>
            <tbody>
              {state.adjustmentLedger.map((entry) => (
                <tr key={entry.id}>
                  <th>{entry.operation === 'skill-swap' ? `${entry.sourceSkill.displayName} → ${entry.replacementSkill.displayName}` : labelForAdjustment(character, entry.targetType, entry.targetId)}</th>
                  <td>{entry.operation === 'skill-swap' ? `Skill swap · level ${entry.beforeValue}` : `${entry.beforeValue} → ${entry.afterValue}`}</td>
                  <td>{signed(entry.xpDelta)} XP</td>
                  <td>{entry.note ?? '—'}</td>
                  <td><button className="button secondary" type="button" onClick={() => remove(entry.id)}>Remove</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}

function labelForAdjustment(character: CharacterDefinition, targetType: 'attribute' | 'skill', targetId: string): string {
  if (targetType === 'attribute') return targetId
  return character.skills.find((entry) => archetypeSkillTargetId(entry.address) === targetId)?.displayName ?? targetId
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value)
}
