import { useMemo, useState } from 'react'
import type { CharacterDefinition, CreationMethod } from '../domain/character/model'
import { LocalStorageCharacterRepository } from '../persistence/characterRepository'
import { APP_PHASE, APP_VERSION } from '../appMetadata'
import { PublicAlphaNotice } from './components/PublicAlphaNotice'
import { ArchetypeScreen } from './screens/ArchetypeScreen'
import { HomeScreen } from './screens/HomeScreen'
import { LifeModulesScreen } from './screens/LifeModulesScreen'
import { PointBuyScreen } from './screens/PointBuyScreen'
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
        <div className="site-status">
          <span className="local-badge">{APP_PHASE} · Local-first</span>
          <span className="header-version">v{APP_VERSION}</span>
        </div>
      </header>
      <PublicAlphaNotice />
      {method === 'archetype' ? (
        <ArchetypeScreen onSave={save} />
      ) : method === 'point-buy' ? (
        <PointBuyScreen onSave={save} />
      ) : method === 'life-modules' ? (
        <LifeModulesScreen onSave={save} />
      ) : method ? (
        <HomeScreen characters={characters} onImport={save} onDelete={remove} />
      ) : (
        <HomeScreen characters={characters} onImport={save} onDelete={remove} />
      )}
      <footer>{APP_PHASE} · v{APP_VERSION} · Local browser storage · JSON portability · No account or cloud save</footer>
    </div>
  )
}
