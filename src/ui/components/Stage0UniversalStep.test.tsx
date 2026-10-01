import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID } from '../../domain/lifeModules/catalog'
import { Stage0UniversalStep } from './Stage0UniversalStep'

const noop = () => undefined

function render(affiliationContext = '', affiliationLanguage = '') {
  return renderToStaticMarkup(<Stage0UniversalStep
    affiliationContext={affiliationContext}
    affiliationLanguage={affiliationLanguage}
    onContextChange={noop}
    onLanguageChange={noop}
    onApply={noop}
  />)
}

describe('Stage 0 Universal wizard layout', () => {
  it('renders the grouped selectors, full context label, and non-affiliation helper', () => {
    const markup = render()
    expect(markup).toContain('stage0-choice-card')
    expect(markup).toContain('Affiliation choices')
    expect(markup).toContain('Universal is not an affiliation.')
    expect(markup).toContain('Choose an affiliation context only to resolve its linked language award.')
    expect(markup).toContain('id="stage0-affiliation-context"')
    expect(markup).toContain('title="Capellan Confederation / Capellan Commonality"')
    expect(markup).toContain('Capellan Confederation / Commonality')
    expect(markup).toContain('id="stage0-affiliation-language" disabled=""')
    expect(markup).toContain('>Apply</button>')
  })

  it('enables the language selector only after an explicit context choice', () => {
    const markup = render(CAPELLAN_COMMONALITY_ID)
    expect(markup).not.toContain('id="stage0-affiliation-language" disabled=""')
    expect(markup).toContain('Mandarin Chinese')
    expect(markup).toContain('Russian')
    expect(markup).toContain('Select both an affiliation context and language to continue.')
  })

  it('enables the separated apply action only after both choices are valid', () => {
    const incomplete = render(CAPELLAN_COMMONALITY_ID)
    const complete = render(CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
    expect(incomplete).toContain('<button class="button" type="button" disabled="">Apply</button>')
    expect(complete).toContain('<button class="button" type="button">Apply</button>')
    expect(complete).not.toContain('Select both an affiliation context and language to continue.')
  })
})
