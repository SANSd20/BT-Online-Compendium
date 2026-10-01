import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { CAPELLAN_COMMONALITY_ID } from '../../domain/lifeModules/catalog'
import { Stage0WizardStep } from './Stage0WizardStep'

const handlers = {
  onContextChange: vi.fn(),
  onLanguageChange: vi.fn(),
  onSecondaryLanguageChange: vi.fn(),
  onApplyUniversal: vi.fn(),
  onApplyAffiliation: vi.fn(),
}

describe('merged Stage 0 wizard step', () => {
  it('shows both packages while Universal is active without a silent default', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-universal" affiliationContext="" affiliationLanguage="" secondaryLanguage="" {...handlers} />)
    expect(markup).toContain('Universal Package')
    expect(markup).toContain('Affiliation Package')
    expect(markup).toContain('Universal is not an affiliation')
    expect(markup).toContain('Choose an affiliation context…')
    expect(markup.match(/>Apply</g)).toHaveLength(1)
  })

  it('hides the Universal card for a normal draft and requires a real secondary language', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} affiliationLanguage="Mandarin Chinese" secondaryLanguage="" {...handlers} />)
    expect(markup).not.toContain('Universal Package')
    expect(markup).not.toContain('Mandatory baseline')
    expect(markup).toContain('Capellan Confederation / Capellan Commonality')
    expect(markup).not.toContain('Leave pending')
    expect(markup).toContain('Choose a secondary language…')
    expect(markup).toContain('award remains unresolved until you choose a listed language')
    expect(markup).toContain('<button class="button" type="button" disabled="">Apply</button>')
  })

  it('enables affiliation Apply after explicit context and language choices', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} affiliationLanguage="Mandarin Chinese" secondaryLanguage="Russian" {...handlers} />)
    expect(markup).toContain('<button class="button" type="button">Apply</button>')
  })
})
