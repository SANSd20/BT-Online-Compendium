import type { SourceCitation } from '../rules/model'
import { isHomeworldClanId, type HomeworldClanId } from './clanIdentity'
import { HOMEWORLD_CLAN_PACKAGES } from './clanPackages'
import { resolveClanDestination } from './clanDestinations'

export type ClanHistoryAwardType = 'attribute-xp' | 'trait-xp' | 'skill-xp' | 'conditional'
export type ClanHistoryStatus = 'committed'

export interface ClanHistoryAward {
  id: string
  type: ClanHistoryAwardType
  destination: string
  subject?: string
  amount: number
  packageId: string
  source: SourceCitation
  condition?: { id: string; applies: boolean; branch?: string }
}

export interface ClanHistoryChoice {
  id: string
  option: string
  resolvedDestination: string
  awardId: string
  packageId: string
  source: SourceCitation
}

export interface ClanPackageHistoryRecord {
  version: 1
  transactionId: string
  characterId: string
  clanId: HomeworldClanId
  parentAffiliationId: 'affiliation.clan'
  packageId: string
  status: ClanHistoryStatus
  awards: ClanHistoryAward[]
  choices: ClanHistoryChoice[]
  source: SourceCitation
  committedAt: string
}

export function clanPackageHistoryPackageId(clanId: HomeworldClanId): string {
  return `stage0.clan-sub-affiliation.${clanId}`
}

export function validateClanPackageHistory(
  history: readonly ClanPackageHistoryRecord[] | undefined,
  characterId?: string,
): string[] {
  if (!history) return []
  const issues: string[] = []
  const transactionIds = new Set<string>()
  const awardIds = new Set<string>()
  const packageIds = new Set<string>()
  for (const [index, record] of history.entries()) {
    const path = `clanPackageHistory.${index}`
    if (record.version !== 1 || record.status !== 'committed' || !record.transactionId || !record.characterId || !record.committedAt) issues.push(`${path} has an invalid commitment identity or status.`)
    if (characterId !== undefined && record.characterId !== characterId) issues.push(`${path} belongs to a different character.`)
    if (!isHomeworldClanId(record.clanId) || record.parentAffiliationId !== 'affiliation.clan') issues.push(`${path} has an invalid Clan identity or parent affiliation.`)
    const expectedPackageId = isHomeworldClanId(record.clanId) ? clanPackageHistoryPackageId(record.clanId) : ''
    if (record.packageId !== expectedPackageId || packageIds.has(record.packageId)) issues.push(`${path} has a duplicate or invalid package identity.`)
    packageIds.add(record.packageId)
    if (transactionIds.has(record.transactionId)) issues.push(`${path} duplicates transaction identity ${record.transactionId}.`)
    transactionIds.add(record.transactionId)
    if (!record.source?.sourceId) issues.push(`${path} is missing source provenance.`)
    const catalog = HOMEWORLD_CLAN_PACKAGES.find((pkg) => pkg.identity.id === record.clanId)
    for (const [awardIndex, award] of (record.awards ?? []).entries()) {
      const awardPath = `${path}.awards.${awardIndex}`
      if (!award.id || awardIds.has(award.id)) issues.push(`${awardPath} has a duplicate award identity.`)
      awardIds.add(award.id)
      if (!['attribute-xp', 'trait-xp', 'skill-xp', 'conditional'].includes(award.type) || !Number.isInteger(award.amount) || award.amount === 0 || award.packageId !== record.packageId || !award.source?.sourceId) issues.push(`${awardPath} has an invalid award shape, signed amount, package, or provenance.`)
      if (award.type !== 'conditional') {
        const resolved = resolveClanDestination(award.destination)
        if (resolved.status === 'UNSUPPORTED_DESTINATION' || resolved.status === 'SOURCE_AMBIGUITY') issues.push(`${awardPath} has an unsupported destination.`)
      }
      if (catalog && !catalog.fixedAwards.some((item) => item.id === award.id) && !catalog.choices.some((item) => item.id === award.id)) issues.push(`${awardPath} is not defined by the selected package.`)
      if (award.type === 'conditional' && (!award.condition?.id || typeof award.condition.applies !== 'boolean')) issues.push(`${awardPath} is missing its condition identity.`)
    }
    const choiceIds = new Set<string>()
    for (const [choiceIndex, choice] of (record.choices ?? []).entries()) {
      const choicePath = `${path}.choices.${choiceIndex}`
      if (!choice.id || choiceIds.has(choice.id) || !choice.option || !choice.awardId || choice.packageId !== record.packageId || !choice.source?.sourceId) issues.push(`${choicePath} has missing, duplicate, stale, or inconsistent choice provenance.`)
      choiceIds.add(choice.id)
      const resolved = resolveClanDestination(choice.resolvedDestination)
      if (resolved.status === 'UNSUPPORTED_DESTINATION' || resolved.status === 'SOURCE_AMBIGUITY') issues.push(`${choicePath} has an unsupported resolved destination.`)
      if (!record.awards.some((award) => award.id === choice.awardId && award.packageId === record.packageId)) issues.push(`${choicePath} references an unknown award identity.`)
    }
  }
  if (history.filter((record) => record.clanId && record.packageId).length > 1) issues.push('Only one specific Homeworld Clan package may be committed per character.')
  return issues
}

export function isValidClanPackageHistory(history: readonly ClanPackageHistoryRecord[] | undefined, characterId?: string): boolean {
  return validateClanPackageHistory(history, characterId).length === 0
}
