import { useRef, useState, type ChangeEvent } from 'react'
import type { CharacterDefinition, CreationMethod } from '../../domain/character/model'
import { downloadCharacter, importCharacterFile } from '../../persistence/browserFiles'

interface HomeScreenProps {
  characters: CharacterDefinition[]
  onImport: (character: CharacterDefinition) => void
  onDelete: (id: string) => void
}

const methods: Array<{ method: CreationMethod; label: string; description: string }> = [
  { method: 'archetype', label: 'Archetype', description: 'Choose one of eight published Core packages and create a sourced local character.' },
  { method: 'point-buy', label: 'Point Buy', description: 'Build a Normal Human draft with Core Attribute, Skill/subskill, and focused Trait purchasing.' },
  { method: 'life-modules', label: 'Life Modules', description: 'Build and resolve Stage 0 and Stage 1 with the audited minimal Core module set.' },
]

export function HomeScreen({ characters, onImport, onDelete }: HomeScreenProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<string>('')

  async function handleImport(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    try {
      const character = await importCharacterFile(file)
      onImport(character)
      setMessage(`Imported ${character.displayName}.`)
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Import failed.')
    }
  }

  return (
    <main>
      <section className="hero">
        <p className="eyebrow">Alpha · Slice 6</p>
        <h1>Character Creator</h1>
        <p>Create a sourced Core character through Archetype, Point Buy, or the narrow Life Modules v0.3 Stage 2 state machine on one shared Character/Rules engine.</p>
      </section>

      <section aria-labelledby="methods-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Creation methods</p>
            <h2 id="methods-heading">One engine, three entry points</h2>
          </div>
        </div>
        <div className="method-grid">
          {methods.map(({ method, label, description }, index) => (
            <article className="method-card" key={method}>
              <span className="step">0{index + 1}</span>
              <h3>{label}</h3>
              <p>{description}</p>
              <a className="button" href={`#/${method}`}>{method === 'archetype' ? 'Choose archetype' : method === 'point-buy' ? 'Start Point Buy' : 'Start Life Modules'}</a>
            </article>
          ))}
        </div>
      </section>

      <section className="library" aria-labelledby="library-heading">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Local library</p>
            <h2 id="library-heading">Saved characters</h2>
          </div>
          <button className="button secondary" type="button" onClick={() => inputRef.current?.click()}>Import JSON</button>
          <input ref={inputRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={handleImport} />
        </div>
        {message && <p className="notice" role="status">{message}</p>}
        {characters.length === 0 ? (
          <p className="empty">No local character drafts yet.</p>
        ) : (
          <ul className="character-list">
            {characters.map((character) => (
              <li key={character.id}>
                <div>
                  <strong>{character.displayName}</strong>
                  <span>{character.creation.archetype?.displayName ?? character.creation.method} · schema-backed local character</span>
                </div>
                <div className="row-actions">
                  <button type="button" onClick={() => downloadCharacter(character)}>Export</button>
                  <button className="danger" type="button" onClick={() => onDelete(character.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}
