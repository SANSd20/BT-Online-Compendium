import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { createCharacterFromArchetype } from '../../engine/archetypeFactory'
import { CharacterSummary } from './CharacterSummary'

describe('CharacterSummary Archetype foundation', () => {
  it('renders read-only shared accounting without presenting a method switch', () => {
    const character = createCharacterFromArchetype('archetype.core.mechwarrior', 'Foundation Test')
    const markup = renderToStaticMarkup(<CharacterSummary character={character} />)

    expect(markup).toContain('Archetype foundation accounting')
    expect(markup).toContain('same XP accounting model as Point Buy')
    expect(markup).toContain('preserving the original Archetype source')
    expect(markup).toContain('Source-backed preset')
    expect(markup).toContain('None · customization deferred')
    expect(markup).not.toContain('Switch to Point Buy')
  })
})
