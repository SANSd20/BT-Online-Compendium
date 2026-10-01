import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, UNIVERSAL_STAGE_0_ID } from './catalog'
import {
  CAPELLAN_COMMONALITY_CONTEXT,
  getLifeModuleLanguageSelectorOptions,
  resolveLifeModuleAffiliationContext,
  SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS,
  UNIVERSAL_LIFE_MODULE_CONTEXT,
} from './affiliations'

describe('Life Module affiliation framework', () => {
  it('keeps Universal distinct from selectable affiliation contexts', () => {
    expect(UNIVERSAL_LIFE_MODULE_CONTEXT).toMatchObject({ id: UNIVERSAL_STAGE_0_ID, kind: 'universal', isAffiliation: false })
    expect(SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.map((entry) => entry.id)).not.toContain(UNIVERSAL_STAGE_0_ID)
  })

  it('centralizes only the current Capellan/Commonality context', () => {
    expect(SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS).toEqual([CAPELLAN_COMMONALITY_CONTEXT])
    expect(CAPELLAN_COMMONALITY_CONTEXT).toMatchObject({
      id: CAPELLAN_COMMONALITY_ID,
      affiliationId: 'affiliation.capellan-confederation',
      affiliationName: 'Capellan Confederation',
      subAffiliationName: 'Capellan Commonality',
      primaryLanguage: 'Mandarin Chinese',
      protocolContextLabel: 'Capellan',
      streetwiseContextLabel: 'Capellan',
    })
    expect(getLifeModuleLanguageSelectorOptions(CAPELLAN_COMMONALITY_CONTEXT.affiliationLanguageSelector)).toEqual([
      'Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English',
    ])
    expect(getLifeModuleLanguageSelectorOptions(CAPELLAN_COMMONALITY_CONTEXT.secondaryLanguageSelector)).toEqual([
      'Russian', 'Cantonese', 'Vietnamese', 'English',
    ])
  })

  it('marks unknown affiliation contexts deferred instead of inventing choices', () => {
    expect(resolveLifeModuleAffiliationContext('stage0.not-modeled')).toEqual({ support: 'deferred', contextId: 'stage0.not-modeled' })
  })
})
