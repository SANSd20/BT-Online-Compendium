import { describe, expect, it } from 'vitest'
import { VARIABLE_SKILL_DOMAIN_CATALOG, VARIABLE_SKILL_DOMAINS } from './variableSkillDomains'

describe('variable Skill choice governance', () => {
  it('publishes explicit nonempty domains without silent defaults', () => {
    expect(VARIABLE_SKILL_DOMAIN_CATALOG.length).toBeGreaterThanOrEqual(15)
    for (const domain of VARIABLE_SKILL_DOMAIN_CATALOG) {
      expect(domain.inputMode === 'open-subject' || domain.options.length > 0).toBe(true)
      expect(new Set(domain.options).size).toBe(domain.options.length)
    }
    expect(VARIABLE_SKILL_DOMAINS.languages).toMatchObject({ semantics: 'modeled-bounded-subset', completeness: 'modeled-bounded' })
    expect(VARIABLE_SKILL_DOMAINS.protocolAffiliations.options).toEqual(['Capellan', 'FedSuns'])
    expect(VARIABLE_SKILL_DOMAINS.streetwiseAffiliations.options).toEqual(['Capellan', 'FedSuns'])
    expect(VARIABLE_SKILL_DOMAINS.tactics.options).toEqual(['Infantry', 'Land', 'Sea', 'Air', 'Space'])
    expect(VARIABLE_SKILL_DOMAINS.medTech.options).toEqual(['General', 'Veterinary'])
    expect(VARIABLE_SKILL_DOMAINS.aircraftPiloting).toMatchObject({ semantics: 'named-source-option-set', options: ['Air Vehicle', 'VTOL'] })
    expect(VARIABLE_SKILL_DOMAINS.careerOpen).toMatchObject({ semantics: 'open-gm-defined', completeness: 'open', inputMode: 'open-subject', options: [] })
    expect(VARIABLE_SKILL_DOMAINS.interestOpen).toMatchObject({ semantics: 'open-gm-defined', completeness: 'open', inputMode: 'open-subject', options: [] })
    expect(VARIABLE_SKILL_DOMAINS.scienceOpen).toMatchObject({ semantics: 'open-gm-defined', completeness: 'open', inputMode: 'open-subject', options: [] })
    expect(VARIABLE_SKILL_DOMAINS.survivalOpen).toMatchObject({ semantics: 'open-gm-defined', completeness: 'open', inputMode: 'open-subject', options: [] })
  })
})
