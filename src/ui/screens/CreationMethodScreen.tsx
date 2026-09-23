import { useState, type FormEvent } from 'react'
import type { CharacterDefinition, CreationMethod } from '../../domain/character/model'
import { createCharacterDraft } from '../../engine/characterFactory'
import { downloadCharacter } from '../../persistence/browserFiles'
import { validateCharacter } from '../../validation/validateCharacter'

interface CreationMethodScreenProps {
  method: Extract<CreationMethod, 'life-modules'>
  onSave: (character: CharacterDefinition) => void
}

const labels: Record<Extract<CreationMethod, 'life-modules'>, string> = {
  'life-modules': 'Life Modules',
}

export function CreationMethodScreen({ method, onSave }: CreationMethodScreenProps) {
  const [name, setName] = useState('')
  const [draft, setDraft] = useState<CharacterDefinition | null>(null)
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const character = createCharacterDraft(method, name)
    const validation = validateCharacter(character)
    if (!validation.valid) {
      setMessage(validation.issues.map((item) => item.message).join(' '))
      return
    }
    onSave(character)
    setDraft(character)
    setMessage('Draft created and saved in this browser.')
  }

  return (
    <main className="creation-page">
      <a className="back-link" href="#/">← Character Creator</a>
      <section className="hero compact">
        <p className="eyebrow">Creation method placeholder</p>
        <h1>{labels[method]}</h1>
        <p>This screen proves the shared creation, validation, persistence, and export path. Method-specific rules are deferred.</p>
      </section>

      <section className="draft-panel" aria-labelledby="draft-heading">
        <h2 id="draft-heading">Create a foundation draft</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="character-name">Character name</label>
          <input
            id="character-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter a character name"
            required
          />
          <button className="button" type="submit">Create and save draft</button>
        </form>
        {message && <p className="notice" role="status">{message}</p>}
        {draft && (
          <div className="draft-summary">
            <div><span>Character ID</span><code>{draft.id}</code></div>
            <div><span>Rules snapshot</span><strong>{draft.creation.rulesSnapshot.catalogVersion}</strong></div>
            <div><span>XP pools</span><strong>Creation 0 · Allocated 0 · Gameplay 0</strong></div>
            <button className="button secondary" type="button" onClick={() => downloadCharacter(draft)}>Export JSON</button>
          </div>
        )}
      </section>
    </main>
  )
}
