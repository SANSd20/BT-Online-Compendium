import type { SourceCitation } from '../rules/model'

export const CLAN_IDENTITY_ID = 'affiliation.clan' as const
export const CLAN_CASTE_IDS = ['warrior', 'scientist', 'merchant', 'technician', 'laborer'] as const
export type ClanCasteId = typeof CLAN_CASTE_IDS[number]

export interface ClanIdentityState {
  id: typeof CLAN_IDENTITY_ID
  displayName: 'Clan affiliation'
  support: 'unsupported'
  source: SourceCitation
  eligibilityDependencies: readonly string[]
}

export interface ClanCasteState {
  id: ClanCasteId
  displayName: string
  support: 'unsupported'
  source: SourceCitation
  eligibilityDependencies: readonly string[]
}

export const CLAN_IDENTITY_SOURCE: SourceCitation = {
  sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 63, ruleId: 'clan-affiliation-and-caste-foundation',
}

export const CLAN_CASTE_DISPLAY_NAMES: Readonly<Record<ClanCasteId, string>> = {
  warrior: 'Warrior', scientist: 'Scientist', merchant: 'Merchant', technician: 'Technician', laborer: 'Laborer',
}

export function isClanCasteId(value: unknown): value is ClanCasteId {
  return typeof value === 'string' && (CLAN_CASTE_IDS as readonly string[]).includes(value)
}

export function clanIdentityState(): ClanIdentityState {
  return { id: CLAN_IDENTITY_ID, displayName: 'Clan affiliation', support: 'unsupported', source: { ...CLAN_IDENTITY_SOURCE }, eligibilityDependencies: ['Clan affiliation package', 'caste rules', 'Clan Phenotype eligibility', 'Clan Life Modules'] }
}

export function clanCasteState(id: ClanCasteId): ClanCasteState {
  return { id, displayName: CLAN_CASTE_DISPLAY_NAMES[id], support: 'unsupported', source: { ...CLAN_IDENTITY_SOURCE, ruleId: 'clan-caste-foundation' }, eligibilityDependencies: ['Clan affiliation package', 'caste-specific restrictions', 'Clan Life Modules'] }
}
