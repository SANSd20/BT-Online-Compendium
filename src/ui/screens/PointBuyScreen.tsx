import { useState, type FormEvent } from 'react'
import type { CharacterDefinition } from '../../domain/character/model'
import {
  POINT_BUY_ATTRIBUTE_MAXIMUMS,
  POINT_BUY_SKILLS,
  POINT_BUY_TRAITS,
  getPointBuyTrait,
  standardSkillXpCost,
} from '../../domain/pointBuy/catalog'
import { calculateNegativeTraitXp } from '../../domain/pointBuy/calculations'
import {
  createPointBuyCharacter,
  setPointBuyAttribute,
  setPointBuySkill,
  setPointBuyTrait,
} from '../../engine/pointBuyEngine'
import { downloadCharacter } from '../../persistence/browserFiles'
import { validateCharacter } from '../../validation/validateCharacter'

interface PointBuyScreenProps {
  onSave: (character: CharacterDefinition) => void
}

export function PointBuyScreen({ onSave }: PointBuyScreenProps) {
  const [name, setName] = useState('')
  const [startingXp, setStartingXp] = useState(5000)
  const [character, setCharacter] = useState<CharacterDefinition | null>(null)
  const [skillId, setSkillId] = useState(POINT_BUY_SKILLS[0].id)
  const [subskill, setSubskill] = useState('')
  const [traitId, setTraitId] = useState(POINT_BUY_TRAITS[0].id)
  const [traitTp, setTraitTp] = useState(POINT_BUY_TRAITS[0].allowedTp[0])
  const [traitParameter, setTraitParameter] = useState('')
  const [message, setMessage] = useState('')

  function create(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const next = createPointBuyCharacter(name, startingXp)
      setCharacter(next)
      onSave(next)
      setMessage('Point Buy draft created and saved locally.')
    } catch (error) {
      setMessage(errorMessage(error))
    }
  }

  function update(operation: (current: CharacterDefinition) => CharacterDefinition) {
    if (!character) return
    try {
      const next = operation(character)
      setCharacter(next)
      onSave(next)
      setMessage('Purchase applied and draft saved locally.')
    } catch (error) {
      setMessage(errorMessage(error))
    }
  }

  function changeTraitSelection(nextTraitId: string) {
    const definition = getPointBuyTrait(nextTraitId)
    setTraitId(nextTraitId)
    setTraitTp(definition.allowedTp[0])
    setTraitParameter('')
  }

  const selectedSkill = POINT_BUY_SKILLS.find((entry) => entry.id === skillId) ?? POINT_BUY_SKILLS[0]
  const selectedTrait = getPointBuyTrait(traitId)
  const validation = character ? validateCharacter(character) : null

  return (
    <main className="creation-page point-buy-page">
      <a className="back-link" href="#/">← Character Creator</a>
      <section className="hero compact">
        <p className="eyebrow">Beta 1 · Slice 3</p>
        <h1>Point Buy</h1>
        <p>Spend a creation XP pool on Normal Human Attributes and a focused Core Skill and Trait catalog. Every purchase uses the shared character schema and retains its Core source.</p>
      </section>

      {!character ? (
        <section className="draft-panel">
          <h2>Start a Point Buy draft</h2>
          <form onSubmit={create}>
            <label htmlFor="point-buy-name">Character name</label>
            <input id="point-buy-name" value={name} onChange={(event) => setName(event.target.value)} required />
            <label htmlFor="point-buy-starting-xp">Starting XP</label>
            <input id="point-buy-starting-xp" type="number" min="800" step="100" value={startingXp} onChange={(event) => setStartingXp(Number(event.target.value))} required />
            <button className="button" type="submit">Create Point Buy draft</button>
          </form>
          <p className="scope-note">The Core standard is 5,000 XP. A different allotment is recorded as GM-adjusted. The eight minimum Attribute scores consume 800 XP when the draft is created.</p>
        </section>
      ) : (
        <>
          <section className="xp-dashboard" aria-label="Point Buy XP status">
            <div><span>Starting</span><strong>{character.xp.creation.starting.toLocaleString()}</strong></div>
            <div><span>Allocated</span><strong>{character.xp.creation.allocated.toLocaleString()}</strong></div>
            <div><span>Remaining</span><strong>{character.xp.creation.remaining.toLocaleString()}</strong></div>
            <div><span>Negative Trait XP</span><strong>{calculateNegativeTraitXp(character).toLocaleString()} / {Math.floor(character.xp.creation.starting * 0.1).toLocaleString()}</strong></div>
          </section>

          <section className="purchase-panel">
            <div className="section-heading"><div><p className="eyebrow">Attributes</p><h2>Normal Human scores</h2></div></div>
            <div className="attribute-purchases">
              {character.attributes.map((attribute) => (
                <article key={attribute.attributeId}>
                  <strong>{attribute.attributeId}</strong>
                  <div className="stepper">
                    <button type="button" disabled={attribute.purchasedLevel === 1} onClick={() => update((current) => setPointBuyAttribute(current, attribute.attributeId, (attribute.purchasedLevel ?? 1) - 1))}>−</button>
                    <span>{attribute.purchasedLevel}</span>
                    <button type="button" disabled={attribute.purchasedLevel === POINT_BUY_ATTRIBUTE_MAXIMUMS[attribute.attributeId]} onClick={() => update((current) => setPointBuyAttribute(current, attribute.attributeId, (attribute.purchasedLevel ?? 1) + 1))}>+</button>
                  </div>
                  <small>{attribute.accumulatedXp} XP · max {POINT_BUY_ATTRIBUTE_MAXIMUMS[attribute.attributeId]}</small>
                </article>
              ))}
            </div>
          </section>

          <section className="purchase-panel">
            <div className="section-heading"><div><p className="eyebrow">Skills</p><h2>Skills and subskills</h2></div></div>
            <div className="purchase-form">
              <select value={skillId} onChange={(event) => { setSkillId(event.target.value); setSubskill('') }} aria-label="Skill">
                {POINT_BUY_SKILLS.map((skill) => <option value={skill.id} key={skill.id}>{skill.displayName}</option>)}
              </select>
              {selectedSkill.parameter && <input value={subskill} onChange={(event) => setSubskill(event.target.value)} placeholder={selectedSkill.parameter.label} aria-label={selectedSkill.parameter.label} />}
              <button className="button" type="button" onClick={() => update((current) => setPointBuySkill(current, skillId, 0, subskill))}>Add at +0 · 20 XP</button>
            </div>
            {character.skills.length === 0 ? <p className="empty">No trained Skills yet. A purchased Level +0 Skill is distinct from being untrained.</p> : (
              <ul className="purchase-list">
                {character.skills.map((skill) => (
                  <li key={`${skill.address.skillId}/${skill.address.parameter?.value ?? ''}`}>
                    <div><strong>{skill.displayName}</strong><span>{skill.level === null ? 'Untrained' : `Level +${skill.level}`} · {skill.accumulatedXp} XP</span></div>
                    <div className="row-actions">
                      <button type="button" disabled={skill.level === null || skill.level === 0} onClick={() => update((current) => setPointBuySkill(current, skill.address.skillId, (skill.level ?? 1) - 1, skill.address.parameter?.value))}>−</button>
                      <button type="button" disabled={skill.level === 10} onClick={() => update((current) => setPointBuySkill(current, skill.address.skillId, skill.level === null ? 0 : skill.level + 1, skill.address.parameter?.value))}>+ ({skill.level === 10 ? 'max' : standardSkillXpCost(skill.level === null ? 0 : skill.level + 1) + ' XP total'})</button>
                      <button className="danger" type="button" disabled={skill.level === null} onClick={() => update((current) => setPointBuySkill(current, skill.address.skillId, null, skill.address.parameter?.value))}>Mark untrained</button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="purchase-panel">
            <div className="section-heading"><div><p className="eyebrow">Traits</p><h2>Focused Trait foundation</h2></div></div>
            <div className="purchase-form">
              <select value={traitId} onChange={(event) => changeTraitSelection(event.target.value)} aria-label="Trait">
                {POINT_BUY_TRAITS.map((trait) => <option value={trait.id} key={trait.id}>{trait.displayName}</option>)}
              </select>
              <select value={traitTp} onChange={(event) => setTraitTp(Number(event.target.value))} aria-label="Trait Points">
                {selectedTrait.allowedTp.map((tp) => <option value={tp} key={tp}>{tp > 0 ? '+' : ''}{tp} TP ({tp * 100} XP)</option>)}
              </select>
              {selectedTrait.parameter && <input value={traitParameter} onChange={(event) => setTraitParameter(event.target.value)} placeholder={selectedTrait.parameter.label} aria-label={selectedTrait.parameter.label} />}
              <button className="button" type="button" onClick={() => update((current) => setPointBuyTrait(current, traitId, traitTp, traitParameter))}>Add or update Trait</button>
            </div>
            {character.traits.length === 0 ? <p className="empty">No Traits purchased.</p> : (
              <ul className="purchase-list">
                {character.traits.map((trait) => (
                  <li key={trait.traitId}>
                    <div><strong>{trait.displayName}{trait.parameters.scope ? `/${trait.parameters.scope}` : ''}</strong><span>{(trait.attainedTp ?? 0) > 0 ? '+' : ''}{trait.attainedTp} TP · {trait.accumulatedXp} XP</span></div>
                    <button className="danger" type="button" onClick={() => update((current) => setPointBuyTrait(current, trait.traitId, null))}>Remove</button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="point-buy-status">
            <h2>Draft status</h2>
            <p>{character.displayName} · Normal Human · {character.cBills.toLocaleString()} starting C-bills</p>
            <ul>{validation?.issues.map((entry) => <li className={entry.severity} key={`${entry.id}/${entry.path}`}>{entry.message}</li>)}</ul>
            <div className="row-actions">
              <button className="button" type="button" onClick={() => { onSave(character); setMessage('Point Buy draft saved locally.') }}>Save draft</button>
              <button className="button secondary" type="button" onClick={() => downloadCharacter(character)}>Export character JSON</button>
            </div>
          </section>
        </>
      )}
      {message && <p className="notice" role="status">{message}</p>}
    </main>
  )
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : 'Point Buy operation failed.'
}
