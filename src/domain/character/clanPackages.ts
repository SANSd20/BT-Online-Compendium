import type { SourceCitation } from '../rules/model'

export type ClanAffiliationPackageId = 'invading-clan' | 'homeworld-clan'
export type ClanCastePackageId = 'mechwarrior' | 'elemental' | 'elemental-advanced' | 'aerospace-protomech' | 'aerospace-naval' | 'warrior-other' | 'scientist' | 'technician' | 'merchant' | 'laborer'

export interface ClanPackageMetadata {
  id: string
  displayName: string
  moduleCostXp: number
  source: SourceCitation
  support: 'unsupported'
  fixedAwardSummary: string
  eligibilitySummary: string
  deferredDependencies: readonly string[]
}

const SOURCE_71: SourceCitation = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 71, ruleId: 'clan-castes' }
const SOURCE_70: SourceCitation = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 70, ruleId: 'clan-affiliation-packages' }
const DEFERRED = ['Clan Phenotype and Field Aptitude', 'Clan Fields and Skills', 'Clan Life Modules', 'chronology and service era', 'unsupported Trait/Skill subject choices'] as const

export const CLAN_AFFILIATION_PACKAGES: readonly ClanPackageMetadata[] = [
  { id: 'invading-clan', displayName: 'Invading Clan', moduleCostXp: 75, source: SOURCE_70, support: 'unsupported', fixedAwardSummary: 'Compulsion/Arrogance −50; Compulsion/Distrust of Inner Sphere −100; Interest/Clan Remembrance +25; Protocol/Clan +25', eligibilitySummary: 'Clan affiliation; caste/sub-caste rules apply', deferredDependencies: DEFERRED },
  { id: 'homeworld-clan', displayName: 'Homeworld Clan', moduleCostXp: 50, source: SOURCE_71, support: 'unsupported', fixedAwardSummary: 'Compulsion/Distrust of Inner Sphere −100; Compulsion/Hate Invading Clans −100; Interest/Clan Remembrance +25; Protocol/Clan +25', eligibilitySummary: 'Clan affiliation; caste/sub-caste rules apply', deferredDependencies: DEFERRED },
]

export const CLAN_CASTE_PACKAGES: readonly ClanPackageMetadata[] = [
  ['mechwarrior', 'MechWarrior', 'DEX +75, RFL +75, WIL +75, CHA −25, EDG −50; Fit +25, Impatient −50'],
  ['elemental', 'Elemental', 'BOD +125, STR +125, DEX −75, CHA −75; Martial Arts +25'],
  ['elemental-advanced', 'Elemental-Advanced', 'BOD +200, STR +175, DEX −100, RFL −75, CHA −100, EDG −100; Patient +25, Reputation +100'],
  ['aerospace-protomech', 'Aerospace or ProtoMech', 'BOD −50, STR −50, DEX +150, RFL +150, CHA −25, EDG −25; Fit +25, Impatient −50'],
  ['aerospace-naval', 'Aerospace-Naval', 'BOD −50, STR −50, DEX +125, RFL +125, INT +50, CHA −25, EDG −100; Compulsion/Arrogance −100, Patient +75, Reputation +75'],
  ['warrior-other', 'Warrior Caste (Other)', 'BOD +75, STR +50, DEX +50, RFL +50, CHA −25; Reputation −75'],
  ['scientist', 'Scientist Caste', 'STR −50, INT +100; Compulsion/Arrogance −25, Patient +100, Reputation −25; Interest/Any +10, Science/Any +15'],
  ['technician', 'Technician Caste', 'DEX +100, INT +20, CHA −50; Patient +100, Reputation −75; Interest/Any +15, Technician/Any +15'],
  ['merchant', 'Merchant Caste', 'BOD −50, INT +25, CHA +75; Gregarious +100, Reputation −75; Appraisal +10, Negotiation +15, Protocol/Any +10, Streetwise/Clan +15'],
  ['laborer', 'Laborer Caste', 'BOD +100, STR +125, DEX +50, RFL +50, INT −50, CHA −50; Reputation −125; Career/Any +15, Interest/Any +10'],
].map(([id, displayName, fixedAwardSummary]) => ({ id, displayName, moduleCostXp: 0, source: SOURCE_71, support: 'unsupported' as const, fixedAwardSummary, eligibilitySummary: 'Clan affiliation; caste restrictions and source notes apply', deferredDependencies: DEFERRED }))

export function isClanAffiliationPackageId(value: unknown): value is ClanAffiliationPackageId { return CLAN_AFFILIATION_PACKAGES.some((item) => item.id === value) }
export function isClanCastePackageId(value: unknown): value is ClanCastePackageId { return CLAN_CASTE_PACKAGES.some((item) => item.id === value) }
