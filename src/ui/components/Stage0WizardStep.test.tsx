import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { CAPELLAN_COMMONALITY_ID } from '../../domain/lifeModules/catalog'
import { Stage0WizardStep } from './Stage0WizardStep'

const handlers = {
  onContextChange: vi.fn(),
  onLanguageChange: vi.fn(),
  onSecondaryLanguageChange: vi.fn(),
  onDavionNaturalAptitudeChange: vi.fn(),
  onDavionArtChange: vi.fn(),
  onBirthAffiliationChange: vi.fn(),
  onOrderAffiliationChange: vi.fn(),
  onOrderNearestStateChange: vi.fn(),
  onOrderSecondaryLanguageChange: vi.fn(),
  onOrderTechnicianSubskillChange: vi.fn(),
  onApplyUniversal: vi.fn(),
  onApplyAffiliation: vi.fn(),
}

const davionChoices = {
  davionNaturalAptitude: '',
  davionArt: '',
}
const orderChoices = {
  birthAffiliationId: '',
  orderAffiliation: 'no' as const,
  orderNearestStateContext: '',
  orderSecondaryLanguage: '',
  orderTechnicianSubskill: '',
}

describe('merged Stage 0 wizard step', () => {
  it('shows both packages while Universal is active without a silent default', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-universal" affiliationContext="" affiliationLanguage="" secondaryLanguage="" {...davionChoices} {...orderChoices} {...handlers} />)
    expect(markup).toContain('Universal Package')
    expect(markup).toContain('Affiliation Package')
    expect(markup).toContain('Universal is not an affiliation')
    expect(markup).toContain('Choose an affiliation context…')
    expect(markup.match(/>Apply</g)).toHaveLength(1)
  })

  it('hides the Universal card for a normal draft and requires a real secondary language', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} affiliationLanguage="Mandarin Chinese" secondaryLanguage="" {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.capellan-confederation" {...handlers} />)
    expect(markup).not.toContain('Universal Package')
    expect(markup).not.toContain('Mandatory baseline')
    expect(markup).toContain('Capellan Confederation / Capellan Commonality')
    expect(markup).not.toContain('Leave pending')
    expect(markup).toContain('Choose a secondary language…')
    expect(markup).toContain('award remains unresolved until you choose a listed language')
    expect(markup).toContain('Required before continuing:')
    expect(markup).toContain('Choose a Capellan secondary language.')
    expect(markup).toContain('<button class="button" type="button" disabled="">Continue</button>')
  })

  it('previews complete choices and enables Continue', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} affiliationLanguage="Mandarin Chinese" secondaryLanguage="Russian" {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.capellan-confederation" {...handlers} />)
    expect(markup).toContain('Previewing selected Stage 0 choices')
    expect(markup).toContain('Continue to apply them and advance to Stage 1')
    expect(markup).toContain('<button class="button" type="button">Continue</button>')
  })
})
