import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID, UNIVERSAL_STAGE_0_ID } from './catalog'
import {
  CAPELLAN_COMMONALITY_CONTEXT,
  SIAN_COMMONALITY_CONTEXT,
  CLAN_AFFILIATION_CONTEXTS,
  FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT,
  getLifeModuleLanguageSelectorOptions,
  resolveLifeModuleAffiliationContext,
  SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS,
  getClanAffiliationContext,
  getLifeModuleAffiliationContextByAffiliationId,
  UNIVERSAL_LIFE_MODULE_CONTEXT,
} from './affiliations'

describe('Life Module affiliation framework', () => {
  it('keeps Universal distinct from selectable affiliation contexts', () => {
    expect(UNIVERSAL_LIFE_MODULE_CONTEXT).toMatchObject({ id: UNIVERSAL_STAGE_0_ID, kind: 'universal', isAffiliation: false })
    expect(SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.map((entry) => entry.id)).not.toContain(UNIVERSAL_STAGE_0_ID)
  })

  it('centralizes the supported Capellan and Federated Suns contexts', () => {
    expect(SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS).toEqual([CAPELLAN_COMMONALITY_CONTEXT, SIAN_COMMONALITY_CONTEXT, FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT, expect.objectContaining({ subAffiliationName: 'Capellan March' }), expect.objectContaining({ subAffiliationName: 'Draconis March' }), expect.objectContaining({ subAffiliationName: 'Outback' })])
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
    expect(FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT).toMatchObject({ id: FEDERATED_SUNS_CRUCIS_MARCH_ID, affiliationId: 'affiliation.federated-suns', subAffiliationName: 'Crucis March' })
    expect(getLifeModuleLanguageSelectorOptions(FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.affiliationLanguageSelector)).toEqual(['English', 'French', 'German', 'Hindi', 'Russian'])
  })

  it('marks unknown affiliation contexts deferred instead of inventing choices', () => {
    expect(resolveLifeModuleAffiliationContext('stage0.not-modeled')).toEqual({ support: 'deferred', contextId: 'stage0.not-modeled' })
  })

  it('provides governed internal Invading and Homeworld Clan contexts without exposing them as birth options', () => {
    expect(CLAN_AFFILIATION_CONTEXTS.map((entry) => entry.clanCategory)).toEqual(['invading-clan', 'homeworld-clan'])
    expect(getClanAffiliationContext('invading-clan')).toMatchObject({ affiliationId: 'affiliation.clan', protocolContextLabel: 'Clan', source: { page: 69 } })
    expect(getClanAffiliationContext('homeworld-clan')).toMatchObject({ affiliationId: 'affiliation.clan', protocolContextLabel: 'Clan', source: { page: 70 } })
    expect(getLifeModuleAffiliationContextByAffiliationId('affiliation.clan')).toMatchObject({ affiliationId: 'affiliation.clan', protocolContextLabel: 'Clan' })
    expect(SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.some((entry) => entry.affiliationId === 'affiliation.clan')).toBe(false)
  })
})
