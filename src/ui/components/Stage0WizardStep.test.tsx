import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it, vi } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, DRACONIS_AZAMI_ID, DRACONIS_BENJAMIN_ID, DRACONIS_COMBINE_ID, DRACONIS_DIERON_ID, DRACONIS_NEW_SAMARKAND_ID, DRACONIS_PESHT_ID, FEDERATED_SUNS_OUTBACK_ID, LIAO_COMMONALITY_ID, SIAN_COMMONALITY_ID, ST_IVES_COMMONALITY_ID, VICTORIA_COMMONALITY_ID } from '../../domain/lifeModules/catalog'
import { Stage0WizardStep } from './Stage0WizardStep'

const handlers = {
  onContextChange: vi.fn(),
  onLanguageChange: vi.fn(),
  onSecondaryLanguageChange: vi.fn(),
  onDavionNaturalAptitudeChange: vi.fn(),
  onDavionArtChange: vi.fn(),
  onSurvivalSubjectChange: vi.fn(),
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
  survivalSubject: '',
}
const orderChoices = {
  birthAffiliationId: '',
  orderAffiliation: 'no' as const,
  orderNearestStateContext: '',
  orderSecondaryLanguage: '',
  orderTechnicianSubskill: '',
}

describe('merged Stage 0 wizard step', () => {
  it('renders the selected Capellan Commonality detail heading without stale context', () => {
    const cases = [
      [CAPELLAN_COMMONALITY_ID, 'Capellan Confederation / Capellan Commonality'],
      [LIAO_COMMONALITY_ID, 'Capellan Confederation / Liao Commonality'],
      [SIAN_COMMONALITY_ID, 'Capellan Confederation / Sian Commonality'],
      [ST_IVES_COMMONALITY_ID, 'Capellan Confederation / St. Ives Commonality'],
      [VICTORIA_COMMONALITY_ID, 'Capellan Confederation / Victoria Commonality'],
    ] as const
    for (const [contextId, heading] of cases) {
      const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={contextId} subAffiliation={contextId} affiliationLanguage="Mandarin Chinese" secondaryLanguage="Russian" {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.capellan-confederation" {...handlers} />)
      expect(markup).toContain(heading)
      expect(markup).not.toContain(contextId === CAPELLAN_COMMONALITY_ID ? 'Capellan Confederation / Liao Commonality' : 'Capellan Confederation / Capellan Commonality')
    }
  })

  it('gates only the Commonalities with published Art/Any choices', () => {
    const sian = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={SIAN_COMMONALITY_ID} subAffiliation={SIAN_COMMONALITY_ID} affiliationLanguage="Mandarin Chinese" secondaryLanguage="" draconisLanguageSubject="Russian" {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.capellan-confederation" {...handlers} />)
    expect(sian).toContain('<div class="stage0-requirements ready" role="status">')
    const liao = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={LIAO_COMMONALITY_ID} subAffiliation={LIAO_COMMONALITY_ID} affiliationLanguage="Mandarin Chinese" secondaryLanguage="" {...davionChoices} davionNaturalAptitude="Lyran" draconisLanguageSubject="German" draconisArtSubject="Painting" {...orderChoices} birthAffiliationId="affiliation.capellan-confederation" {...handlers} />)
    expect(liao).toContain('<div class="stage0-requirements ready" role="status">')
  })

  it('marks only the most specific enabled unresolved Stage 0 control required', () => {
    const initial = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext="" affiliationLanguage="" secondaryLanguage="" {...davionChoices} {...orderChoices} {...handlers} />)
    expect(initial).toContain('id="stage0-affiliation" data-control-status="required-unresolved" aria-required="true"')
    expect(initial).toContain('id="stage0-affiliation-language" data-control-status="disabled"')
    expect(initial).not.toContain('id="stage0-affiliation-language" data-control-status="disabled" aria-invalid')
    expect(initial).toContain('id="stage0-affiliation-context" data-control-status="disabled"')
    expect(initial).not.toContain('Required before continuing:')

    const selected = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} subAffiliation="no" affiliationLanguage="" secondaryLanguage="" {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.capellan-confederation" {...handlers} />)
    expect(selected).toContain('id="stage0-affiliation" data-control-status="valid"')
    expect(selected).toContain('id="stage0-affiliation-language" data-control-status="required-unresolved" aria-required="true"')
    expect(selected).toContain('id="stage0-affiliation-context" data-control-status="valid"')
  })

  it('keeps the ComStar/WoB surface unavailable for new characters', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} subAffiliation="no" affiliationLanguage="Mandarin Chinese" secondaryLanguage="Russian" {...davionChoices} {...orderChoices} orderAffiliation="comstar" birthAffiliationId="affiliation.capellan-confederation" {...handlers} />)
    expect(markup).toContain('id="stage0-order-enabled" type="checkbox" disabled=""')
    expect(markup).toContain('id="stage0-order-comstar" type="radio" disabled=""')
    expect(markup).toContain('id="stage0-order-wob" type="radio" disabled=""')
    expect(markup).not.toContain('id="stage0-order-nearest-state"')
    expect(markup).toContain('ComStar and Word of Blake character creation will be available in a future release.')
  })

  it('uses an unchecked master control for No order with disabled visible choices', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} subAffiliation="no" affiliationLanguage="Mandarin Chinese" secondaryLanguage="Russian" {...davionChoices} {...orderChoices} {...handlers} />)
    expect(markup).toContain('id="stage0-order-enabled" type="checkbox" disabled=""')
    expect(markup).toContain('id="stage0-order-comstar" type="radio" disabled=""')
    expect(markup).toContain('id="stage0-order-wob" type="radio" disabled=""')
    expect(markup).not.toContain('id="stage0-order-nearest-state"')
  })

  it('does not expose order controls through a requested open state', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} subAffiliation="no" affiliationLanguage="Mandarin Chinese" secondaryLanguage="Russian" {...davionChoices} {...orderChoices} orderSelectorOpen {...handlers} />)
    expect(markup).toContain('id="stage0-order-enabled" type="checkbox" disabled=""')
    expect(markup).toContain('id="stage0-order-comstar" type="radio" disabled=""')
    expect(markup).toContain('id="stage0-order-wob" type="radio" disabled=""')
  })

  it('does not expose nearest-state choices while order creation is unavailable', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} subAffiliation="no" affiliationLanguage="Mandarin Chinese" secondaryLanguage="Russian" {...davionChoices} {...orderChoices} orderAffiliation="comstar" orderSelectorOpen {...handlers} />)
    expect(markup).not.toContain('id="stage0-order-nearest-state"')
    expect(markup).not.toContain('id="stage0-order-language"')
    expect(markup).not.toContain('id="stage0-order-technician"')
  })

  it('shows both packages while Universal is active without a silent default', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-universal" affiliationContext="" affiliationLanguage="" secondaryLanguage="" {...davionChoices} {...orderChoices} {...handlers} />)
    expect(markup).toContain('Universal Package')
    expect(markup).toContain('Affiliation Package')
    expect(markup).toContain('Universal is not an affiliation')
    expect(markup).toContain('Choose an affiliation context…')
    expect(markup.match(/>Apply</g)).toHaveLength(1)
  })

  it('hides the Universal card for a normal draft and requires a real secondary language', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} subAffiliation={CAPELLAN_COMMONALITY_ID} affiliationLanguage="Mandarin Chinese" secondaryLanguage="" {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.capellan-confederation" {...handlers} />)
    expect(markup).not.toContain('Universal Package')
    expect(markup).not.toContain('Mandatory baseline')
    expect(markup).toContain('Capellan Confederation / Capellan Commonality')
    expect(markup).not.toContain('Leave pending')
    expect(markup).toContain('Choose a secondary language…')
    expect(markup).toContain('award remains unresolved until you choose a listed language')
    expect(markup).not.toContain('Required before continuing:')
    expect(markup).not.toContain('Choose a Capellan secondary language.')
    expect(markup).toContain('<div class="stage0-requirements" role="status">')
    expect(markup).toContain('<button class="button" type="button" disabled="">Continue</button>')
  })

  it('previews complete choices and enables Continue', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} subAffiliation={CAPELLAN_COMMONALITY_ID} affiliationLanguage="Mandarin Chinese" secondaryLanguage="Russian" {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.capellan-confederation" {...handlers} />)
    expect(markup).toContain('Previewing selected Stage 0 choices')
    expect(markup).toContain('Continue to apply them and advance to Stage 1')
    expect(markup).toContain('<div class="stage0-requirements ready" role="status">')
    expect(markup).toContain('<button class="button" type="button">Continue</button>')
  })

  it('surfaces a failed active preview without showing committed values or enabling Continue', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={FEDERATED_SUNS_OUTBACK_ID} subAffiliation="no" affiliationLanguage="English" secondaryLanguage="" {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.federated-suns" previewFailed {...handlers} />)
    expect(markup).toContain('The selected Stage 0 choices could not be previewed.')
    expect(markup).toContain('role="alert"')
    expect(markup).toContain('<button class="button" type="button" disabled="">Continue</button>')
  })

  it('uses No as the optional sub-affiliation default and preserves the approved hierarchy', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={CAPELLAN_COMMONALITY_ID} subAffiliation="no" affiliationLanguage="Mandarin Chinese" secondaryLanguage="Russian" {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.capellan-confederation" {...handlers} />)
    expect(markup).toContain('stage0-birth-affiliation-region')
    expect(markup).toContain('stage0-birth-affiliation-details')
    expect(markup).toContain('stage0-order-region')
    expect(markup).toContain('<option value="no" selected="">No Sub-affiliation</option>')
    expect(markup).toContain('full affiliation cost with no sub-affiliation awards')
  })

  it('offers suggested Draconis Art specialties without narrowing the open domain', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext="stage0.federated-suns.draconis-march" subAffiliation="stage0.federated-suns.draconis-march" affiliationLanguage="English" secondaryLanguage="" davionNaturalAptitude="Strategy" davionArt="" survivalSubject="" {...orderChoices} birthAffiliationId="affiliation.federated-suns" {...handlers} />)
    for (const subject of ['Dance', 'Drawing', 'Music', 'Painting', 'Poetry', 'Sculpture', 'Writing']) expect(markup).toContain(`Art/${subject}`)
    expect(markup).not.toContain('Art/Songwriting')
    expect(markup).not.toContain('Other (specify)')
    expect(markup).toContain('id="stage0-davion-art"')
    expect(markup).toContain('value="" selected=""')
    const outback = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={FEDERATED_SUNS_OUTBACK_ID} subAffiliation={FEDERATED_SUNS_OUTBACK_ID} affiliationLanguage="English" secondaryLanguage="" davionNaturalAptitude="Strategy" davionArt="" survivalSubject="" {...orderChoices} birthAffiliationId="affiliation.federated-suns" {...handlers} />)
    expect(outback).toContain('id="stage0-davion-art-outback"')
    expect(outback).not.toContain('id="stage0-davion-art"')
  })

  it('offers governed Survival environments while preserving Other and saved custom subjects', () => {
    const base = { phase: 'stage-0-affiliation' as const, affiliationContext: DRACONIS_AZAMI_ID, subAffiliation: DRACONIS_AZAMI_ID, affiliationLanguage: 'Japanese', secondaryLanguage: '', survivalSubject: '', draconisTraitChoice: 'Combat Sense' as const, draconisWeaponChoice: 'Archery' as const, davionNaturalAptitude: 'Strategy' as const, davionArt: '', ...orderChoices, ...handlers, birthAffiliationId: 'affiliation.draconis-combine' }
    const empty = renderToStaticMarkup(<Stage0WizardStep {...base} />)
    for (const subject of ['Arctic', 'Desert', 'Forests', 'Jungle', 'Mountain', 'Ocean', 'Steppe']) expect(empty).toContain(`Survival/${subject}`)
    expect(empty).toContain('Other (specify)')
    expect(empty).toContain('Choose a Survival environment')
    const custom = renderToStaticMarkup(<Stage0WizardStep {...base} survivalSubject="Swamp" />)
    expect(custom).toContain('value="__other__" selected=""')
    expect(custom).toContain('value="Swamp"')
  })

  it('keeps Draconis parent choices visible for every supported sub-affiliation', () => {
    for (const subAffiliation of [DRACONIS_AZAMI_ID, DRACONIS_BENJAMIN_ID, DRACONIS_DIERON_ID, DRACONIS_NEW_SAMARKAND_ID, DRACONIS_PESHT_ID]) {
      const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={subAffiliation} subAffiliation={subAffiliation} affiliationLanguage="Japanese" secondaryLanguage="" draconisTraitChoice="Combat Sense" draconisWeaponChoice="Archery" draconisLanguageSubject={subAffiliation === DRACONIS_DIERON_ID ? 'English' : ''} draconisArtSubject={subAffiliation === DRACONIS_DIERON_ID ? 'Painting' : ''} {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.draconis-combine" {...handlers} />)
      expect(markup).toContain('id="stage0-draconis-trait"')
      expect(markup).toContain('id="stage0-draconis-weapon"')
      expect(markup).toContain('Combat Sense')
      expect(markup).toContain('Archery')
    }
    const parent = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={DRACONIS_COMBINE_ID} subAffiliation="no" affiliationLanguage="Japanese" secondaryLanguage="" draconisTraitChoice="Combat Sense" draconisWeaponChoice="Archery" {...davionChoices} {...orderChoices} birthAffiliationId="affiliation.draconis-combine" {...handlers} />)
    expect(parent).toContain('id="stage0-draconis-trait"')
    expect(parent).toContain('<option value="no" selected="">No Sub-affiliation</option>')
    expect(parent).not.toContain(`<option value="${DRACONIS_COMBINE_ID}">No sub-affiliation</option>`)
    expect(parent.match(/>No Sub-affiliation<\/option>/g)).toHaveLength(1)
    for (const child of [DRACONIS_AZAMI_ID, DRACONIS_BENJAMIN_ID, DRACONIS_DIERON_ID, DRACONIS_NEW_SAMARKAND_ID, DRACONIS_PESHT_ID]) expect(parent).toContain(`<option value="${child}"`)
  })

  it('keeps the Stage 0 semantic sections in one stable DOM order', () => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext="" subAffiliation="no" affiliationLanguage="" secondaryLanguage="" {...davionChoices} {...orderChoices} accumulatedValues={<section aria-label="Current accumulated values">values</section>} {...handlers} />)
    const order = [
      'stage0-affiliation-order-grid',
      'Current accumulated values',
      'stage0-contextual-stack',
      'stage0-order-attributes',
      'class="stage0-requirements',
    ].map((marker) => markup.indexOf(marker))
    expect(order.every((index) => index >= 0)).toBe(true)
    expect(order).toEqual([...order].sort((a, b) => a - b))
    expect(markup.match(/>Continue<\/button>/g)).toHaveLength(1)
    expect(markup.match(/aria-label="Current accumulated values"/g)).toHaveLength(1)
  })

  it.each([
    ['Capellan', CAPELLAN_COMMONALITY_ID, 'no'],
    ['Federated Suns', FEDERATED_SUNS_OUTBACK_ID, FEDERATED_SUNS_OUTBACK_ID],
    ['Draconis', DRACONIS_AZAMI_ID, DRACONIS_AZAMI_ID],
  ])('keeps %s affiliation and sub-affiliation panels in fixed DOM order', (_label, context, subAffiliation) => {
    const markup = renderToStaticMarkup(<Stage0WizardStep phase="stage-0-affiliation" affiliationContext={context} subAffiliation={subAffiliation} affiliationLanguage="English" secondaryLanguage="" {...davionChoices} {...orderChoices} accumulatedValues={<section aria-label="Current accumulated values">values</section>} {...handlers} />)
    const affiliationPanel = markup.indexOf('class="stage0-contextual-section stage0-affiliation-attributes"')
    const subAffiliationPanel = markup.indexOf('class="stage0-contextual-section stage0-sub-affiliation-attributes')
    expect(affiliationPanel).toBeGreaterThanOrEqual(0)
    expect(subAffiliationPanel).toBeGreaterThan(affiliationPanel)
    expect(markup.indexOf('>Affiliation Attributes</h4>', affiliationPanel)).toBeGreaterThan(affiliationPanel)
    expect(markup.indexOf('>Sub-Affiliation Attributes</h4>', subAffiliationPanel)).toBeGreaterThan(subAffiliationPanel)
  })
})
