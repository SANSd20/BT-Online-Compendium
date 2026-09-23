import { useRef, useState, type ChangeEvent } from 'react'
import type { CharacterDefinition, CreationMethod } from '../../domain/character/model'
import { downloadCharacter, importCharacterFile } from '../../persistence/browserFiles'

interface HomeScreenProps {
  characters: CharacterDefinition[]
  onImport: (character: CharacterDefinition) => void
  onDelete: (id: string) => void
}

const methods: Array<{ method: CreationMethod; label: string; description: string }> = [
  { method: 'archetype', label: 'Archetype', description: 'First implementation target; rules content is not in this slice.' },
  { method: 'point-buy', label: 'Point Buy', description: 'Foundation route only; purchasing rules remain deferred.' },
  { method: 'life-modules', label: 'Life Modules', description: 'Foundation route only; no fixed wizard or module data is added.' },
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
        <p className="eyebrow">Beta 1 · Slice 1</p>
        <h1>Character Creator foundation</h1>
        <p>Create a local draft through the shared Character/Rules engine. Published creation content remains intentionally deferred.</p>
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
              <a className="button" href={`#/${method}`}>Open placeholder</a>
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
                  <span>{character.creation.method} · schema-backed local draft</span>
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

