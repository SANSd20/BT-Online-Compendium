import { useMemo, useState } from 'react'
import type { CharacterDefinition, CreationMethod } from '../domain/character/model'
import { LocalStorageCharacterRepository } from '../persistence/characterRepository'
import { APP_PHASE, APP_PUBLIC_ALPHA_LABEL, APP_PUBLIC_TITLE, APP_RELEASE_LABEL, APP_VERSION } from '../appMetadata'
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
  const [openedCharacter, setOpenedCharacter] = useState<CharacterDefinition | null>(null)

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

  function open(id: string) {
    const saved = repository.get(id)
    if (!saved) return
    setOpenedCharacter(saved)
    window.location.hash = `/${saved.creation.method}`
  }

  const method = route === '/' ? null : route.slice(1) as CreationMethod

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#/" aria-label={`${APP_PUBLIC_TITLE} home`}>
          <span className="brand-mark">BT</span>
          <span>{APP_PUBLIC_TITLE}</span>
        </a>
        <div className="site-status">
          <span className="local-badge">{APP_PUBLIC_ALPHA_LABEL} · Local-first</span>
          <span className="header-version">v{APP_VERSION}</span>
        </div>
      </header>
      <PublicAlphaNotice />
      {method === 'archetype' ? (
        <ArchetypeScreen onSave={save} initialCharacter={openedCharacter} />
      ) : method === 'point-buy' ? (
        <PointBuyScreen onSave={save} initialCharacter={openedCharacter} />
      ) : method === 'life-modules' ? (
        <LifeModulesScreen onSave={save} initialCharacter={openedCharacter} />
      ) : method ? (
        <HomeScreen characters={characters} onImport={save} onDelete={remove} onOpen={open} />
      ) : (
        <HomeScreen characters={characters} onImport={save} onDelete={remove} onOpen={open} />
      )}
      <footer>{APP_RELEASE_LABEL} · {APP_PHASE} · v{APP_VERSION} · Local browser storage · JSON portability · No account or cloud save</footer>
    </div>
  )
}
