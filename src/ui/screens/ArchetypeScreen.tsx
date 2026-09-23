import { useState, type FormEvent } from 'react'
import { CORE_ARCHETYPES } from '../../domain/archetypes/coreArchetypes'
import type { CharacterDefinition } from '../../domain/character/model'
import { createCharacterFromArchetype } from '../../engine/archetypeFactory'
import { downloadCharacter } from '../../persistence/browserFiles'
import { validateCharacter } from '../../validation/validateCharacter'
import { CharacterSummary } from '../components/CharacterSummary'

interface ArchetypeScreenProps {
  onSave: (character: CharacterDefinition) => void
}

export function ArchetypeScreen({ onSave }: ArchetypeScreenProps) {
  const [name, setName] = useState('')
  const [archetypeId, setArchetypeId] = useState(CORE_ARCHETYPES[0].id)
  const [character, setCharacter] = useState<CharacterDefinition | null>(null)
  const [message, setMessage] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    try {
      const created = createCharacterFromArchetype(archetypeId, name)
      const validation = validateCharacter(created)
      if (!validation.valid) {
        setMessage(validation.issues.map((item) => item.message).join(' '))
        return
      }
      onSave(created)
      setCharacter(created)
      setMessage(`${created.creation.archetype?.displayName} character created and saved locally.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Character creation failed.')
    }
  }

  return (
    <main className="creation-page archetype-page">
      <a className="back-link" href="#/">← Character Creator</a>
      <section className="hero compact">
        <p className="eyebrow">Beta 1 · Slice 2</p>
        <h1>Choose an Archetype</h1>
        <p>Select one of the eight published Core packages. Values are copied into the shared character schema with their Corrected Third Printing source and provenance.</p>
      </section>

      <form className="archetype-form" onSubmit={handleSubmit}>
        <fieldset>
          <legend>Core archetypes</legend>
          <div className="archetype-grid">
            {CORE_ARCHETYPES.map((archetype) => (
              <label className={`archetype-option ${archetypeId === archetype.id ? 'selected' : ''}`} key={archetype.id}>
                <input
                  type="radio"
                  name="archetype"
                  value={archetype.id}
                  checked={archetypeId === archetype.id}
                  onChange={() => setArchetypeId(archetype.id)}
                />
                <strong>{archetype.displayName}</strong>
                <span>{archetype.attributes.length} Attributes · {archetype.skills.length} Skills</span>
                <small>Core p. {archetype.source.page}</small>
              </label>
            ))}
          </div>
        </fieldset>

        <div className="name-panel">
          <label htmlFor="archetype-character-name">Character name</label>
          <input
            id="archetype-character-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Enter a character name"
            required
          />
          <button className="button" type="submit">Create and save character</button>
        </div>
      </form>

      {message && <p className="notice" role="status">{message}</p>}
      {character && (
        <>
          <CharacterSummary character={character} />
          <button className="button secondary export-character" type="button" onClick={() => downloadCharacter(character)}>Export character JSON</button>
        </>
      )}
    </main>
  )
}
