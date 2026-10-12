import type { SourceCitation } from '../rules/model'
import { HOMEWORLD_CLAN_IDS, type HomeworldClanId, homeworldClanIdentity } from './clanIdentity'

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

export type ClanSubAffiliationAwardKind = 'attribute' | 'trait' | 'skill' | 'conditional'
export interface ClanSubAffiliationAward { id: string; kind: ClanSubAffiliationAwardKind; subject: string; xp: number; source: SourceCitation }
export interface ClanSubAffiliationChoice { id: string; kind: 'attribute-allocation' | 'trait' | 'skill' | 'multi-skill'; requiredCount: number; allowedSubjects: readonly string[]; xp: number; source: SourceCitation }
export interface HomeworldClanPackage {
  identity: ReturnType<typeof homeworldClanIdentity>
  moduleCostXp: 0
  support: 'unsupported'
  fixedAwards: readonly ClanSubAffiliationAward[]
  choices: readonly ClanSubAffiliationChoice[]
  conditionalRestrictions: readonly string[]
  unsupportedDependencies: readonly string[]
}

const SOURCE_HOMEWORLD: SourceCitation = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 70, ruleId: 'homeworld-clan-sub-affiliations' }
const award = (id: string, kind: ClanSubAffiliationAwardKind, subject: string, xp: number): ClanSubAffiliationAward => ({ id, kind, subject, xp, source: SOURCE_HOMEWORLD })
const choice = (id: string, kind: ClanSubAffiliationChoice['kind'], requiredCount: number, allowedSubjects: readonly string[], xp: number): ClanSubAffiliationChoice => ({ id, kind, requiredCount, allowedSubjects, xp, source: SOURCE_HOMEWORLD })
const commonRestrictions = ['Clan characters may not take Property or Extra Income.', 'Title requires Trueborn.', 'Clan Phenotype, caste, service-era, and Field Aptitude restrictions remain governed dependencies.'] as const

const HOMEWORLD_AWARDS: Record<HomeworldClanId, Omit<HomeworldClanPackage, 'identity'>> = {
  'blood-spirit': { moduleCostXp: 0, support: 'unsupported', fixedAwards: [award('blood-spirit.bod', 'attribute', 'BOD', 25), award('blood-spirit.wil', 'attribute', 'WIL', 100), award('blood-spirit.cha', 'attribute', 'CHA', -50), award('blood-spirit.combat-sense', 'trait', 'Combat Sense', 100), award('blood-spirit.fanaticism', 'trait', 'Compulsion/Blood Spirit Fanaticism', -100), award('blood-spirit.hate-star-adder', 'trait', 'Compulsion/Hate Star Adder', -100), award('blood-spirit.equipped', 'trait', 'Equipped', -65), award('blood-spirit.exceptional-wil', 'trait', 'Exceptional Attribute/WIL', 200), award('blood-spirit.introvert', 'trait', 'Introvert', -50), award('blood-spirit.reputation', 'trait', 'Reputation', -50), award('blood-spirit.clan-history', 'skill', 'Interest/Clan History', 25), award('blood-spirit.martial-arts', 'skill', 'Martial Arts', 15), award('blood-spirit.small-arms', 'skill', 'Small Arms', 15), award('blood-spirit.protocol', 'skill', 'Protocol/Blood Spirit', 10)], choices: [], conditionalRestrictions: commonRestrictions, unsupportedDependencies: DEFERRED },
  'cloud-cobra': { moduleCostXp: 0, support: 'unsupported', fixedAwards: [award('cloud-cobra.int', 'attribute', 'INT', 50), award('cloud-cobra.wil', 'attribute', 'WIL', 50), award('cloud-cobra.faith', 'trait', 'Compulsion/Religious Faith', -75), award('cloud-cobra.equipped', 'trait', 'Equipped', -25), award('cloud-cobra.patient', 'trait', 'Patient', 100), award('cloud-cobra.reputation', 'trait', 'Reputation', -75), award('cloud-cobra.theology', 'skill', 'Interest/Theology/Any', 20), award('cloud-cobra.protocol', 'skill', 'Protocol/Cloud Cobra', 20)], choices: [choice('cloud-cobra.other-skill', 'skill', 1, ['domain.supported-skills'], 10)], conditionalRestrictions: commonRestrictions, unsupportedDependencies: DEFERRED },
  coyote: { moduleCostXp: 0, support: 'unsupported', fixedAwards: [award('coyote.int', 'attribute', 'INT', 100), award('coyote.wil', 'attribute', 'WIL', -60), award('coyote.edg', 'attribute', 'EDG', 25), award('coyote.equipped', 'trait', 'Equipped', 25), award('coyote.reputation', 'trait', 'Reputation', -60), award('coyote.interest-rituals', 'skill', 'Interest/Coyote Rituals', 15), award('coyote.protocol', 'skill', 'Protocol/Coyote', 10), award('coyote.survival', 'skill', 'Survival/Any', 10)], choices: [choice('coyote.trait', 'trait', 1, ['Custom Vehicle', 'Natural Aptitude/Computers', 'Natural Aptitude/Technician/Any', 'Vehicle Level'], 10)], conditionalRestrictions: commonRestrictions, unsupportedDependencies: DEFERRED },
  'fire-mandrill': { moduleCostXp: 0, support: 'unsupported', fixedAwards: [award('fire-mandrill.wil', 'attribute', 'WIL', 25), award('fire-mandrill.fanaticism', 'trait', 'Compulsion/Fire Mandrill Fanaticism', -100), award('fire-mandrill.kindraa-fanaticism', 'trait', 'Compulsion/Kindraa Fanaticism', -100), award('fire-mandrill.enemy', 'trait', 'Enemy/Rival Kindraa', -25), award('fire-mandrill.reputation', 'trait', 'Reputation', -25), award('fire-mandrill.secondary-language', 'skill', 'Language/Secondary', 20), award('fire-mandrill.martial-arts', 'skill', 'Martial Arts', 15), award('fire-mandrill.protocol', 'skill', 'Protocol/Fire Mandrill', 15), award('fire-mandrill.kindraa', 'skill', 'Protocol/Kindraa', 25)], choices: [choice('fire-mandrill.attributes', 'attribute-allocation', 2, ['any one Attribute +75 XP', 'any one other Attribute -20 XP'], 0), choice('fire-mandrill.trait', 'trait', 1, ['Combat Sense', 'Exceptional Attribute/Any', 'Fast Learner', 'Natural Aptitude/Any', 'Sixth Sense'], 150), choice('fire-mandrill.skills', 'multi-skill', 2, ['Leadership', 'Melee Weapons', 'Negotiation', 'Perception', 'Tactics/Any'], 10)], conditionalRestrictions: [...commonRestrictions, 'Secondary Language must be one of Chinese, French, German, Japanese, Russian, or Spanish.'], unsupportedDependencies: DEFERRED },
  'goliath-scorpion': { moduleCostXp: 0, support: 'unsupported', fixedAwards: [award('goliath-scorpion.dex', 'attribute', 'DEX', 50), award('goliath-scorpion.int', 'attribute', 'INT', 50), award('goliath-scorpion.wil', 'attribute', 'WIL', -50), award('goliath-scorpion.edg', 'attribute', 'EDG', -50), award('goliath-scorpion.necrosia', 'trait', 'Compulsion/Necrosia Addiction', -50), award('goliath-scorpion.nostalgic', 'trait', 'Compulsion/Nostalgic', -50), award('goliath-scorpion.fit', 'trait', 'Fit', 55), award('goliath-scorpion.reputation', 'trait', 'Reputation', -25), award('goliath-scorpion.star-league', 'skill', 'Interest/Star League History', 20), award('goliath-scorpion.melee', 'skill', 'Melee Weapons', 15), award('goliath-scorpion.protocol', 'skill', 'Protocol/Goliath Scorpion', 10)], choices: [choice('goliath-scorpion.trait', 'trait', 1, ['Exceptional Attribute/INT', 'Natural Aptitude/Gunnery/Any', 'Natural Aptitude/Melee Weapons', 'Natural Aptitude/Interest/Any'], 100)], conditionalRestrictions: [...commonRestrictions, 'Goliath Scorpion Battle Language is warrior-caste only; Russian is also available.'], unsupportedDependencies: DEFERRED },
  'ice-hellion': { moduleCostXp: 0, support: 'unsupported', fixedAwards: [award('ice-hellion.dex', 'attribute', 'DEX', 75), award('ice-hellion.rfl', 'attribute', 'RFL', 100), award('ice-hellion.wil', 'attribute', 'WIL', 50), award('ice-hellion.cha', 'attribute', 'CHA', -75), award('ice-hellion.combat-sense', 'trait', 'Combat Sense', 50), award('ice-hellion.impatient', 'trait', 'Impatient', -100), award('ice-hellion.reputation', 'trait', 'Reputation', -95), award('ice-hellion.clan-remembrance', 'skill', 'Interest/Clan Remembrance', 15), award('ice-hellion.martial-arts', 'skill', 'Martial Arts', 10), award('ice-hellion.negotiation', 'skill', 'Negotiation', 15), award('ice-hellion.protocol', 'skill', 'Protocol/Ice Hellion', 10), award('ice-hellion.swimming', 'skill', 'Swimming', 10), award('ice-hellion.survival', 'skill', 'Survival/Arctic', 10)], choices: [], conditionalRestrictions: commonRestrictions, unsupportedDependencies: DEFERRED },
  'star-adder': { moduleCostXp: 0, support: 'unsupported', fixedAwards: [award('star-adder.int', 'attribute', 'INT', 50), award('star-adder.wil', 'attribute', 'WIL', 75), award('star-adder.cha', 'attribute', 'CHA', -70), award('star-adder.combat-sense', 'trait', 'Combat Sense', 50), award('star-adder.clan-honor', 'trait', 'Compulsion/Clan Honor', -50), award('star-adder.equipped', 'trait', 'Equipped', 25), award('star-adder.reputation', 'trait', 'Reputation', 25), award('star-adder.leadership', 'skill', 'Leadership', 10), award('star-adder.perception', 'skill', 'Perception', 10), award('star-adder.protocol', 'skill', 'Protocol/Star Adder', 10)], choices: [choice('star-adder.compulsion', 'trait', 1, ['Compulsion/Adder Arrogance', 'Compulsion/Burrock Forever!'], -60)], conditionalRestrictions: commonRestrictions, unsupportedDependencies: DEFERRED },
  'steel-viper': { moduleCostXp: 0, support: 'unsupported', fixedAwards: [award('steel-viper.int', 'attribute', 'INT', 75), award('steel-viper.wil', 'attribute', 'WIL', 100), award('steel-viper.cha', 'attribute', 'CHA', -50), award('steel-viper.clan-honor', 'trait', 'Compulsion/Clan Honor', -100), award('steel-viper.hate-jade-falcon', 'trait', 'Compulsion/Hate Jade Falcons', -100), award('steel-viper.hate-snow-raven', 'trait', 'Compulsion/Hate Snow Ravens', -50), award('steel-viper.connections', 'trait', 'Connections', 50), award('steel-viper.equipped', 'trait', 'Equipped', 50), award('steel-viper.reputation', 'trait', 'Reputation', 50), award('steel-viper.negotiation', 'skill', 'Negotiation', 15), award('steel-viper.protocol', 'skill', 'Protocol/Steel Viper', 15), award('steel-viper.survival', 'skill', 'Survival/Any', 20)], choices: [], conditionalRestrictions: commonRestrictions, unsupportedDependencies: DEFERRED },
}

export const HOMEWORLD_CLAN_PACKAGES: readonly HomeworldClanPackage[] = HOMEWORLD_CLAN_IDS.map((id) => ({ identity: homeworldClanIdentity(id), ...HOMEWORLD_AWARDS[id] }))

export function validateHomeworldClanPackages(packages: readonly HomeworldClanPackage[] = HOMEWORLD_CLAN_PACKAGES): string[] {
  const issues: string[] = []
  const ids = new Set<string>()
  for (const pkg of packages) {
    if (ids.has(pkg.identity.id)) issues.push(`Duplicate Homeworld Clan identity: ${pkg.identity.id}`)
    ids.add(pkg.identity.id)
    if (pkg.identity.category !== 'homeworld-clan' || pkg.identity.parentAffiliationId !== 'affiliation.clan') issues.push(`Invalid category or parent for ${pkg.identity.id}`)
    if (!pkg.identity.source.sourceId || pkg.fixedAwards.length === 0 || !pkg.unsupportedDependencies.length) issues.push(`Incomplete package: ${pkg.identity.id}`)
    for (const item of [...pkg.fixedAwards, ...pkg.choices]) if (!item.id || !item.source.sourceId) issues.push(`Incomplete provenance in ${pkg.identity.id}`)
    for (const item of pkg.choices) if (item.requiredCount < 1 || item.allowedSubjects.length === 0) issues.push(`Invalid choice in ${pkg.identity.id}: ${item.id}`)
  }
  if (ids.size !== HOMEWORLD_CLAN_IDS.length) issues.push('Homeworld Clan catalog must contain all eight source identities')
  return issues
}

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
