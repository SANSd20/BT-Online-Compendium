import type { CharacterDefinition, EquipmentAffiliationCategory, EquipmentItem, EquipmentOwnership, EquipmentRatingCode } from '../character/model'
import type { SourceCitation } from '../rules/model'

export const FINAL_TOUCHES_RULES_SOURCE: SourceCitation = {
  sourceId: 'atow-core-corrected-third',
  edition: 'Corrected Third Printing',
  ruleId: 'final-touches-and-starting-equipment',
}

const WEALTH_STARTING_CBILLS: Readonly<Record<number, number>> = {
  [-1]: 100,
  0: 1000,
  1: 2500,
  2: 5000,
  3: 10000,
  4: 25000,
  5: 50000,
  6: 100000,
  7: 250000,
  8: 500000,
  9: 1000000,
  10: 2000000,
}

const EQUIPPED_LIMITS: Readonly<Record<number, readonly [EquipmentRatingCode, EquipmentRatingCode, EquipmentRatingCode]>> = {
  [-1]: ['C', 'A', 'B'],
  0: ['D', 'B', 'B'],
  1: ['D', 'B', 'C'],
  2: ['D', 'C', 'C'],
  3: ['E', 'C', 'D'],
  4: ['E', 'D', 'D'],
  5: ['E', 'D', 'E'],
  6: ['E', 'E', 'E'],
  7: ['E', 'E', 'F'],
  8: ['F', 'F', 'F'],
}

const RATING_ORDER: EquipmentRatingCode[] = ['A', 'B', 'C', 'D', 'E', 'F']

export interface EquipmentAccessLimits {
  tech: EquipmentRatingCode
  availability: EquipmentRatingCode
  legality: EquipmentRatingCode
}

export interface EquipmentFoundationIssue {
  id: string
  itemId?: string
  message: string
}

export type EquipmentAccessReason =
  | 'allowed'
  | 'ratings-not-audited'
  | 'issued-gear-disabled'
  | 'tech-exceeded'
  | 'availability-exceeded'
  | 'legality-exceeded'

export interface EquipmentAccessResult {
  allowed: boolean
  reasons: EquipmentAccessReason[]
  characterLimits: EquipmentAccessLimits
  effectiveItemRating: {
    tech: EquipmentRatingCode | null
    availability: EquipmentRatingCode | null
    legality: EquipmentRatingCode | null
  }
  foreignAffiliation: boolean
}

export function startingCBillsForWealth(wealthTp: number): number {
  const amount = WEALTH_STARTING_CBILLS[wealthTp]
  if (amount === undefined) throw new RangeError('Wealth TP must be an integer from -1 through +10 for the modeled starting-C-bill table.')
  return amount
}

export function equipmentLimitsForEquipped(equippedTp: number): EquipmentAccessLimits {
  const limits = EQUIPPED_LIMITS[equippedTp]
  if (!limits) throw new RangeError('Equipped TP must be an integer from -1 through +8 for the modeled equipment-access table.')
  return { tech: limits[0], availability: limits[1], legality: limits[2] }
}

export function effectivePrimaryTraitTp(character: CharacterDefinition, traitId: string): number {
  const primaryIdentityId = character.identities.primaryIdentityId
  return character.traits
    .filter((entry) => entry.traitId === traitId && (!entry.identityId || entry.identityId === primaryIdentityId))
    .reduce((total, entry) => total + (entry.attainedTp ?? 0), 0)
}

export function ratingWithinLimit(rating: EquipmentRatingCode, limit: EquipmentRatingCode): boolean {
  return RATING_ORDER.indexOf(rating) <= RATING_ORDER.indexOf(limit)
}

export function adjustedOwnedEquipmentLimits(equippedTp: number, affiliationCategory: EquipmentAffiliationCategory): EquipmentAccessLimits {
  const limits = equipmentLimitsForEquipped(equippedTp)
  return {
    ...limits,
    tech: affiliationCategory === 'periphery'
      ? shiftRating(limits.tech, -1, 'B')
      : affiliationCategory === 'clan'
        ? shiftRating(limits.tech, 1, 'F')
        : limits.tech,
  }
}

export function calculateEquipmentAccess(input: {
  equippedTp: number
  affiliationCategory: EquipmentAffiliationCategory
  nativeAffiliationCode: string
  itemAffiliationCode: string | null
  itemRating: { tech: EquipmentRatingCode | null; availability: EquipmentRatingCode | null; legality: EquipmentRatingCode | null }
  ownership: EquipmentOwnership
  issuedGearEnabled: boolean
}): EquipmentAccessResult {
  const characterLimits = input.ownership === 'Issued'
    ? { tech: input.affiliationCategory === 'clan' ? 'F' as const : 'E' as const, availability: 'D' as const, legality: 'D' as const }
    : adjustedOwnedEquipmentLimits(input.equippedTp, input.affiliationCategory)
  const native = input.nativeAffiliationCode.trim().toUpperCase()
  const itemAffiliation = input.itemAffiliationCode?.trim().toUpperCase() ?? ''
  const foreignAffiliation = Boolean(itemAffiliation && native && itemAffiliation !== native)
  const effectiveItemRating = {
    tech: input.itemRating.tech,
    availability: input.itemRating.availability && foreignAffiliation ? shiftRating(input.itemRating.availability, 1, 'F') : input.itemRating.availability,
    legality: input.itemRating.legality && foreignAffiliation ? shiftRating(input.itemRating.legality, 1, 'F') : input.itemRating.legality,
  }
  if (input.ownership === 'Issued' && !input.issuedGearEnabled) return { allowed: false, reasons: ['issued-gear-disabled'], characterLimits, effectiveItemRating, foreignAffiliation }
  if (Object.values(effectiveItemRating).every((rating) => rating === null)) return { allowed: true, reasons: ['ratings-not-audited'], characterLimits, effectiveItemRating, foreignAffiliation }
  const reasons: EquipmentAccessReason[] = []
  if (effectiveItemRating.tech && !ratingWithinLimit(effectiveItemRating.tech, characterLimits.tech)) reasons.push('tech-exceeded')
  if (effectiveItemRating.availability && !ratingWithinLimit(effectiveItemRating.availability, characterLimits.availability)) reasons.push('availability-exceeded')
  if (effectiveItemRating.legality && !ratingWithinLimit(effectiveItemRating.legality, characterLimits.legality)) reasons.push('legality-exceeded')
  return { allowed: reasons.length === 0, reasons: reasons.length ? reasons : ['allowed'], characterLimits, effectiveItemRating, foreignAffiliation }
}

export function ownedInventoryCost(inventory: EquipmentItem[]): number {
  return inventory.filter((entry) => entry.ownership === 'Owned').reduce((total, entry) => total + (entry.totalCostCBills ?? 0), 0)
}

export function getEquipmentFoundationIssues(character: CharacterDefinition): EquipmentFoundationIssue[] {
  const state = character.creation.finalTouches
  if (!state) return [{ id: 'final-touches.required', message: 'Final Touches state has not been initialized.' }]
  const issues: EquipmentFoundationIssue[] = []
  const profile = state.equipmentAccessProfile ?? { enabled: false, affiliationCategory: 'inner-sphere' as const, nativeAffiliationCode: '' }

  for (const item of character.inventory) {
    if (!item.displayName.trim()) issues.push({ id: 'inventory.name.required', itemId: item.id, message: 'Inventory item name is required.' })
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) issues.push({ id: 'inventory.quantity.invalid', itemId: item.id, message: `${item.displayName || 'Inventory item'} requires a positive whole-number quantity.` })
    if (!Number.isFinite(item.costPerItemCBills) || (item.costPerItemCBills ?? -1) < 0) issues.push({ id: 'inventory.cost.invalid', itemId: item.id, message: `${item.displayName || 'Inventory item'} has an invalid unit cost.` })
    const completeRatings = hasCompleteRatings(item.equipmentRating) ? item.equipmentRating : null
    const hasFullRatings = completeRatings !== null
    const hasNullExampleRatings = item.entryKind === 'catalog' && item.catalogSnapshot?.sourceStatus === 'example-backed' && item.equipmentRating != null && Object.values(item.equipmentRating).every((rating) => rating === null)
    if (!hasFullRatings && !hasNullExampleRatings) {
      issues.push({ id: 'inventory.rating.invalid', itemId: item.id, message: `${item.displayName || 'Inventory item'} requires complete ratings unless it is an example-backed catalog item whose unaudited ratings remain null.` })
      continue
    }
    const expectedTotal = item.quantity * (item.costPerItemCBills ?? 0)
    if (item.totalCostCBills !== expectedTotal) issues.push({ id: 'inventory.cost.total.invalid', itemId: item.id, message: `${item.displayName || 'Inventory item'} total cost does not match quantity × unit cost.` })
    if (item.ownership !== 'Owned' && item.ownership !== 'Issued') {
      issues.push({ id: 'inventory.ownership.invalid', itemId: item.id, message: `${item.displayName || 'Inventory item'} must use Owned or Issued ownership.` })
      continue
    }
    const access = calculateEquipmentAccess({
      equippedTp: state.equippedTpUsed,
      affiliationCategory: profile.affiliationCategory,
      nativeAffiliationCode: profile.enabled ? profile.nativeAffiliationCode : '',
      itemAffiliationCode: item.affiliationCode ?? null,
      itemRating: item.equipmentRating ?? { tech: null, availability: null, legality: null },
      ownership: item.ownership,
      issuedGearEnabled: state.issuedGearEnabled,
    })
    if (item.ownership === 'Owned') {
      if (item.personalProperty !== true) issues.push({ id: 'inventory.owned.personal-property', itemId: item.id, message: `${item.displayName} is Owned and must be recorded as personal property.` })
      if (completeRatings && !access.allowed) issues.push({ id: 'inventory.owned.rating.exceeded', itemId: item.id, message: `${item.displayName} exceeds the character's affiliation-adjusted Equipped limits (${access.reasons.join(', ')}).` })
    } else {
      if (!state.issuedGearEnabled) issues.push({ id: 'inventory.issued.option-disabled', itemId: item.id, message: `${item.displayName} is Issued, but the Issued Gear optional rule is disabled.` })
      if (item.personalProperty !== false) issues.push({ id: 'inventory.issued.personal-property', itemId: item.id, message: `${item.displayName} is Issued and cannot be personal property.` })
      if (completeRatings && state.issuedGearEnabled && !access.allowed) issues.push({ id: 'inventory.issued.rating.exceeded', itemId: item.id, message: `${item.displayName} exceeds the modeled Issued Gear limits (${access.reasons.join(', ')}).` })
    }
  }

  const spent = ownedInventoryCost(character.inventory)
  if (spent > state.startingCBillTotal) issues.push({ id: 'inventory.owned.unaffordable', message: `Owned equipment exceeds starting funds by ${spent - state.startingCBillTotal} C-bills.` })
  if (state.spentCBillTotal !== spent || state.remainingCBillTotal !== state.startingCBillTotal - spent || character.cBills !== state.remainingCBillTotal) {
    issues.push({ id: 'final-touches.c-bills.balance', message: 'Owned-item spending, remaining C-bills, and character currency do not reconcile.' })
  }
  return issues
}

function isRating(value: unknown): value is EquipmentRatingCode {
  return typeof value === 'string' && RATING_ORDER.includes(value as EquipmentRatingCode)
}

function hasCompleteRatings(rating: EquipmentItem['equipmentRating']): rating is { tech: EquipmentRatingCode; availability: EquipmentRatingCode; legality: EquipmentRatingCode } {
  return Boolean(rating && isRating(rating.tech) && isRating(rating.availability) && isRating(rating.legality))
}

function shiftRating(rating: EquipmentRatingCode, amount: -1 | 1, boundary: EquipmentRatingCode): EquipmentRatingCode {
  const current = RATING_ORDER.indexOf(rating)
  const limit = RATING_ORDER.indexOf(boundary)
  const shifted = amount < 0 ? Math.max(limit, current + amount) : Math.min(limit, current + amount)
  return RATING_ORDER[shifted]
}
