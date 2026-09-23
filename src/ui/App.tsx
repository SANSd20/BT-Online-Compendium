import { useMemo, useState } from 'react'
import type { CharacterDefinition, CreationMethod } from '../domain/character/model'
import { LocalStorageCharacterRepository } from '../persistence/characterRepository'
import { ArchetypeScreen } from './screens/ArchetypeScreen'
import { CreationMethodScreen } from './screens/CreationMethodScreen'
import { HomeScreen } from './screens/HomeScreen'
import { useHashRoute } from './useHashRoute'

export function App() {
  const route = useHashRoute()
  const repository = useMemo(() => new LocalStorageCharacterRepository(window.localStorage), [])
  const [characters, setCharacters] = useState<CharacterDefinition[]>(() => repository.list())

  function refresh() {
    setCharacters(repository.list())
  }

  function save(character: CharacterDefinition) {
    repository.save(character)
    refresh()
  }

  function remove(id: string) {
    repository.delete(id)
    refresh()
  }

  const method = route === '/' ? null : route.slice(1) as CreationMethod

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#/">
          <span className="brand-mark">BT</span>
          <span>Online Compendium</span>
        </a>
        <span className="local-badge">Local-first</span>
      </header>
      {method === 'archetype' ? (
        <ArchetypeScreen onSave={save} />
      ) : method ? (
        <CreationMethodScreen method={method} onSave={save} />
      ) : (
        <HomeScreen characters={characters} onImport={save} onDelete={remove} />
      )}
      <footer>Core + Companion foundation · No server account required</footer>
    </div>
  )
}
