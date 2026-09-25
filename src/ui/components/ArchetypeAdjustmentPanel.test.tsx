import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { createCharacterFromArchetype } from '../../engine/archetypeFactory'
import { setArchetypeAttributeAdjustment } from '../../engine/archetypeAdjustmentEngine'
import { ArchetypeAdjustmentPanel } from './ArchetypeAdjustmentPanel'

describe('ArchetypeAdjustmentPanel', () => {
  it('renders controlled adjustment controls and the zero-net completion boundary', () => {
    const character = createCharacterFromArchetype('archetype.core.mechwarrior', 'Adjustable')
    const markup = renderToStaticMarkup(<ArchetypeAdjustmentPanel character={character} onChange={() => undefined} />)
    expect(markup).toContain('Controlled Archetype Adjustments')
    expect(markup).toContain('original Archetype is preserved as the source foundation')
    expect(markup).toContain('Attribute')
    expect(markup).toContain('Existing Skill')
    expect(markup).toContain('Balanced')
    expect(markup).toContain('Save/export allowed')
    expect(markup).toContain('Trait adjustments')
  })

  it('shows an unbalanced adjustment and reversible removal', () => {
    const character = setArchetypeAttributeAdjustment(
      createCharacterFromArchetype('archetype.core.mechwarrior', 'Draft'),
      'STR',
      5,
    )
    const markup = renderToStaticMarkup(<ArchetypeAdjustmentPanel character={character} onChange={() => undefined} />)
    expect(markup).toContain('Unbalanced')
    expect(markup).toContain('+100 XP')
    expect(markup).toContain('Save/export blocked')
    expect(markup).toContain('Remove')
  })
})
