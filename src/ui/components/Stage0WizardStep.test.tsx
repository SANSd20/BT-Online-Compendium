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

  it('marks Universal complete and unlocks the affiliation Apply action', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} affiliationLanguage="Mandarin Chinese" secondaryLanguage="" {...handlers} />)
    expect(markup).toContain('Universal Package applied')
    expect(markup).toContain('Universal remains non-affiliation')
    expect(markup).toContain('Capellan Confederation / Capellan Commonality')
    expect(markup.match(/>Apply</g)).toHaveLength(1)
  })
})
