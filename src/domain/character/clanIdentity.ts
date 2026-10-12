import type { SourceCitation } from '../rules/model'

export const CLAN_IDENTITY_ID = 'affiliation.clan' as const
export const HOMEWORLD_CLAN_IDS = ['blood-spirit', 'cloud-cobra', 'coyote', 'fire-mandrill', 'goliath-scorpion', 'ice-hellion', 'star-adder', 'steel-viper'] as const
export type HomeworldClanId = typeof HOMEWORLD_CLAN_IDS[number]
export const HOMEWORLD_CLAN_DISPLAY_NAMES: Readonly<Record<HomeworldClanId, string>> = {
  'blood-spirit': 'Blood Spirit', 'cloud-cobra': 'Cloud Cobra', coyote: 'Coyote', 'fire-mandrill': 'Fire Mandrill',
  'goliath-scorpion': 'Goliath Scorpion', 'ice-hellion': 'Ice Hellion', 'star-adder': 'Star Adder', 'steel-viper': 'Steel Viper',
}
export const CLAN_CASTE_IDS = ['warrior', 'scientist', 'merchant', 'technician', 'laborer'] as const
export type ClanCasteId = typeof CLAN_CASTE_IDS[number]
export const CLAN_BIRTH_ORIGINS = ['trueborn', 'freeborn'] as const
export type ClanBirthOrigin = typeof CLAN_BIRTH_ORIGINS[number]
export type ClanDepartureState = 'within-clan' | 'left-clan' | 'dark-caste'

export interface ClanCareerContext {
  departureState: ClanDepartureState
  transitionCause?: string
  support: 'unsupported'
  source: SourceCitation
}

export interface ClanIdentityState {
  id: typeof CLAN_IDENTITY_ID
  displayName: 'Clan affiliation'
  support: 'unsupported'
  source: SourceCitation
  eligibilityDependencies: readonly string[]
}

export interface ClanSubAffiliationIdentity {
  id: HomeworldClanId
  displayName: string
  category: 'homeworld-clan'
  parentAffiliationId: typeof CLAN_IDENTITY_ID
  support: 'unsupported'
  source: SourceCitation
  eligibilityDependencies: readonly string[]
}

export function isHomeworldClanId(value: unknown): value is HomeworldClanId {
  return typeof value === 'string' && (HOMEWORLD_CLAN_IDS as readonly string[]).includes(value)
}

export function homeworldClanIdentity(id: HomeworldClanId): ClanSubAffiliationIdentity {
  return {
    id, displayName: HOMEWORLD_CLAN_DISPLAY_NAMES[id], category: 'homeworld-clan', parentAffiliationId: CLAN_IDENTITY_ID,
    support: 'unsupported', source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 70, ruleId: 'homeworld-clan-sub-affiliations' },
    eligibilityDependencies: ['Clan Phenotype and Field Aptitude', 'Clan caste and sub-caste restrictions', 'service era', 'governed award choices'],
  }
}

export interface ClanCasteState {
  id: ClanCasteId
  displayName: string
  support: 'unsupported'
  source: SourceCitation
  eligibilityDependencies: readonly string[]
}

export interface ClanBirthOriginState {
  id: ClanBirthOrigin
  displayName: string
  support: 'unsupported'
  source: SourceCitation
  eligibilityDependencies: readonly string[]
}

export interface ClanFieldAptitudeState {
  id: string
  displayName: string
  phenotypeId: string
  associatedFieldIds: readonly string[]
  support: 'supported'
  source: SourceCitation
  eligibilityDependencies: readonly string[]
}

export const CLAN_IDENTITY_SOURCE: SourceCitation = {
  sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 63, ruleId: 'clan-affiliation-and-caste-foundation',
}

export const CLAN_CASTE_DISPLAY_NAMES: Readonly<Record<ClanCasteId, string>> = {
  warrior: 'Warrior', scientist: 'Scientist', merchant: 'Merchant', technician: 'Technician', laborer: 'Laborer',
}
export const CLAN_BIRTH_ORIGIN_DISPLAY_NAMES: Readonly<Record<ClanBirthOrigin, string>> = { trueborn: 'Trueborn', freeborn: 'Freeborn' }

export function isClanCasteId(value: unknown): value is ClanCasteId {
  return typeof value === 'string' && (CLAN_CASTE_IDS as readonly string[]).includes(value)
}
export function isClanBirthOrigin(value: unknown): value is ClanBirthOrigin { return typeof value === 'string' && (CLAN_BIRTH_ORIGINS as readonly string[]).includes(value) }

export function clanIdentityState(): ClanIdentityState {
  return { id: CLAN_IDENTITY_ID, displayName: 'Clan affiliation', support: 'unsupported', source: { ...CLAN_IDENTITY_SOURCE }, eligibilityDependencies: ['Clan affiliation package', 'caste rules', 'Clan Phenotype eligibility', 'Clan Life Modules'] }
}

export function clanCasteState(id: ClanCasteId): ClanCasteState {
  return { id, displayName: CLAN_CASTE_DISPLAY_NAMES[id], support: 'unsupported', source: { ...CLAN_IDENTITY_SOURCE, ruleId: 'clan-caste-foundation' }, eligibilityDependencies: ['Clan affiliation package', 'caste-specific restrictions', 'Clan Life Modules'] }
}

export function clanBirthOriginState(id: ClanBirthOrigin): ClanBirthOriginState {
  return { id, displayName: CLAN_BIRTH_ORIGIN_DISPLAY_NAMES[id], support: 'unsupported', source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 109, ruleId: 'trueborn-freeborn-distinction' }, eligibilityDependencies: ['Clan affiliation', 'caste rules', 'Sibko training', 'Bloodname restrictions'] }
}

export function clanCareerContextState(departureState: ClanDepartureState, transitionCause?: string): ClanCareerContext {
  return { departureState, ...(transitionCause ? { transitionCause } : {}), support: 'unsupported', source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 84, ruleId: 'clan-stage-4-career-context' } }
}

export function clanFieldAptitudeState(phenotypeId: string, associatedFieldIds: readonly string[]): ClanFieldAptitudeState {
  return { id: `field-aptitude.${phenotypeId}`, displayName: 'Clan Field Aptitude', phenotypeId, associatedFieldIds: [...associatedFieldIds], support: 'supported', source: { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 121, ruleId: 'phenotype-field-aptitude' }, eligibilityDependencies: ['Clan affiliation', 'Trueborn birth origin', 'Clan Phenotype', 'Clan training Field prerequisites', 'Field-specific Skill requirements'] }
}
