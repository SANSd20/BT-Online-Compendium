import type { CharacterDefinition, EquipmentOwnership, EquipmentRatingCode, PersonalDescription } from '../domain/character/model'
import { getEquipmentCatalogItem } from '../domain/equipment/catalog'
import {
  effectivePrimaryTraitTp,
  equipmentLimitsForEquipped,
  FINAL_TOUCHES_RULES_SOURCE,
  getEquipmentFoundationIssues,
  ownedInventoryCost,
  startingCBillsForWealth,
} from '../domain/finalTouches/rules'

export interface ManualInventoryInput {
  name: string
  quantity: number
  costPerItemCBills: number
  rating: { tech: EquipmentRatingCode; availability: EquipmentRatingCode; legality: EquipmentRatingCode }
  ownership: EquipmentOwnership
  affiliationCode?: string
  notes?: string
  location?: string
  carriedNote?: string
  issuerOrEmployer?: string
}

export interface CatalogInventoryInput {
  catalogItemId: string
  quantity: number
  ownership: EquipmentOwnership
  location?: string
  carriedNote?: string
  issuerOrEmployer?: string
}

export function enterFinalTouches(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const lifeModules = next.creation.lifeModules
  if (next.creation.method !== 'life-modules' || lifeModules?.phase !== 'ready-for-final-touches' || lifeModules.finalReview?.readiness !== 'ready-for-final-touches') {
    throw new Error('Final Touches can begin only after a Life Modules character passes final review.')
  }
  if (next.creation.finalTouches) throw new Error('Final Touches has already been initialized.')
  const wealthTp = effectivePrimaryTraitTp(next, 'trait.wealth')
  const equippedTp = effectivePrimaryTraitTp(next, 'trait.equipped')
  const startingCBills = startingCBillsForWealth(wealthTp)
  const limits = equipmentLimitsForEquipped(equippedTp)
  const enteredAt = new Date().toISOString()
  const provenanceId = makeId('final-touches-provenance')
  next.provenance.push({ id: provenanceId, kind: 'derived', description: 'Final Touches starting funds and equipment access', source: { ...FINAL_TOUCHES_RULES_SOURCE } })
  next.creation.finalTouches = {
    version: 1,
    enteredAt,
    startingCBillSource: 'wealth-trait',
    startingCBillTotal: startingCBills,
    spentCBillTotal: 0,
    remainingCBillTotal: startingCBills,
    wealthTpUsed: wealthTp,
    equippedTpUsed: equippedTp,
    maxTechRating: limits.tech,
    maxAvailabilityRating: limits.availability,
    maxLegalityRating: limits.legality,
    issuedGearEnabled: false,
    equipmentReviewState: 'equipment-draft',
    provenanceId,
  }
  next.personalDescription ??= { physicalDescription: '', backgroundNotes: '', homeworld: '' }
  next.cBills = startingCBills
  setOptionalRule(next, false)
  next.updatedAt = enteredAt
  return next
}

export function updatePersonalDescription(character: CharacterDefinition, patch: Partial<PersonalDescription>): CharacterDefinition {
  const next = structuredClone(character)
  requireFinalTouches(next)
  const current = next.personalDescription ?? { physicalDescription: '', backgroundNotes: '', homeworld: '' }
  const updated = { ...current, ...patch }
  if (updated.heightCm !== undefined && (!Number.isFinite(updated.heightCm) || updated.heightCm <= 0)) throw new RangeError('Height must be a positive metric value when supplied.')
  if (updated.weightKg !== undefined && (!Number.isFinite(updated.weightKg) || updated.weightKg <= 0)) throw new RangeError('Weight must be a positive metric value when supplied.')
  next.personalDescription = updated
  next.updatedAt = new Date().toISOString()
  markEquipmentDraft(next)
  return next
}

export function setIssuedGearEnabled(character: CharacterDefinition, enabled: boolean): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireFinalTouches(next)
  state.issuedGearEnabled = enabled
  setOptionalRule(next, enabled)
  next.updatedAt = new Date().toISOString()
  markEquipmentDraft(next)
  return next
}

export function addManualInventoryItem(character: CharacterDefinition, input: ManualInventoryInput): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireFinalTouches(next)
  const name = input.name.trim()
  if (!name) throw new Error('Inventory item name is required.')
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) throw new RangeError('Inventory quantity must be a positive whole number.')
  if (!Number.isFinite(input.costPerItemCBills) || input.costPerItemCBills < 0) throw new RangeError('Inventory unit cost must be zero or greater.')
  if (input.ownership === 'Issued' && !state.issuedGearEnabled) throw new Error('Enable the Issued Gear optional rule before recording an Issued item.')
  const id = makeId('manual-equipment')
  const provenanceId = makeId('manual-equipment-provenance')
  next.provenance.push({ id: provenanceId, kind: 'player-choice', description: `Manual Final Touches inventory entry: ${name}`, source: { ...FINAL_TOUCHES_RULES_SOURCE } })
  next.inventory.push({
    id,
    displayName: name,
    quantity: input.quantity,
    ownership: input.ownership,
    entryKind: 'manual',
    costPerItemCBills: input.costPerItemCBills,
    totalCostCBills: input.quantity * input.costPerItemCBills,
    equipmentRating: { ...input.rating },
    ...(input.affiliationCode?.trim() ? { affiliationCode: input.affiliationCode.trim() } : {}),
    personalProperty: input.ownership === 'Owned',
    ...(input.issuerOrEmployer?.trim() ? { issuerOrEmployer: input.issuerOrEmployer.trim() } : {}),
    reviewState: input.ownership === 'Issued' ? 'gm-review' : 'recorded',
    notes: input.notes?.trim() ? [input.notes.trim()] : [],
    ...(input.location?.trim() ? { location: input.location.trim() } : {}),
    ...(input.carriedNote?.trim() ? { carriedNote: input.carriedNote.trim() } : {}),
    carried: null,
    provenanceId,
    source: { ...FINAL_TOUCHES_RULES_SOURCE },
  })
  synchronizeCurrency(next)
  next.updatedAt = new Date().toISOString()
  markEquipmentDraft(next)
  return next
}

export function addCatalogInventoryItem(character: CharacterDefinition, input: CatalogInventoryInput): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireFinalTouches(next)
  const item = getEquipmentCatalogItem(input.catalogItemId)
  if (!Number.isInteger(input.quantity) || input.quantity <= 0) throw new RangeError('Inventory quantity must be a positive whole number.')
  if (input.ownership === 'Issued' && !state.issuedGearEnabled) throw new Error('Enable the Issued Gear optional rule before recording an Issued item.')
  const id = makeId('catalog-equipment')
  const provenanceId = makeId('catalog-equipment-provenance')
  next.provenance.push({ id: provenanceId, kind: 'player-choice', description: `Starter equipment catalog selection: ${item.displayName}`, source: { ...item.source } })
  next.inventory.push({
    id,
    catalogItemId: item.id,
    displayName: item.displayName,
    quantity: input.quantity,
    ownership: input.ownership,
    entryKind: 'catalog',
    costPerItemCBills: item.costCBills,
    totalCostCBills: input.quantity * item.costCBills,
    equipmentRating: { ...item.ratings },
    catalogSnapshot: {
      categoryPath: [...item.categoryPath],
      sourceKey: item.sourceKey,
      sourceStatus: item.sourceStatus,
      metadata: { ...item.metadata },
    },
    ...(item.affiliationCode ? { affiliationCode: item.affiliationCode } : {}),
    personalProperty: input.ownership === 'Owned',
    ...(input.issuerOrEmployer?.trim() ? { issuerOrEmployer: input.issuerOrEmployer.trim() } : {}),
    reviewState: input.ownership === 'Issued' ? 'gm-review' : 'recorded',
    notes: [...item.notes],
    ...(input.location?.trim() ? { location: input.location.trim() } : {}),
    ...(input.carriedNote?.trim() ? { carriedNote: input.carriedNote.trim() } : {}),
    carried: null,
    provenanceId,
    source: { ...item.source },
  })
  synchronizeCurrency(next)
  next.updatedAt = new Date().toISOString()
  markEquipmentDraft(next)
  return next
}

export function removeInventoryItem(character: CharacterDefinition, itemId: string): CharacterDefinition {
  const next = structuredClone(character)
  requireFinalTouches(next)
  const before = next.inventory.length
  next.inventory = next.inventory.filter((entry) => entry.id !== itemId)
  if (next.inventory.length === before) throw new Error(`Unknown inventory item: ${itemId}`)
  synchronizeCurrency(next)
  next.updatedAt = new Date().toISOString()
  markEquipmentDraft(next)
  return next
}

export function markReadyForEquipmentReview(character: CharacterDefinition): CharacterDefinition {
  const next = structuredClone(character)
  const state = requireFinalTouches(next)
  const issues = getEquipmentFoundationIssues(next)
  if (issues.length > 0) throw new Error(`Equipment draft has unresolved validation issues: ${issues.map((entry) => entry.message).join(' ')}`)
  state.equipmentReviewState = 'ready-for-equipment-review'
  next.updatedAt = new Date().toISOString()
  return next
}

function synchronizeCurrency(character: CharacterDefinition): void {
  const state = requireFinalTouches(character)
  state.spentCBillTotal = ownedInventoryCost(character.inventory)
  state.remainingCBillTotal = state.startingCBillTotal - state.spentCBillTotal
  character.cBills = state.remainingCBillTotal
}

function markEquipmentDraft(character: CharacterDefinition): void {
  requireFinalTouches(character).equipmentReviewState = 'equipment-draft'
}

function requireFinalTouches(character: CharacterDefinition) {
  if (!character.creation.finalTouches) throw new Error('Final Touches has not been initialized.')
  return character.creation.finalTouches
}

function setOptionalRule(character: CharacterDefinition, enabled: boolean): void {
  const ruleId = 'core.optional-issued-gear'
  const existing = character.creation.rulesSnapshot.optionalRules.find((entry) => entry.ruleId === ruleId)
  if (existing) existing.enabled = enabled
  else character.creation.rulesSnapshot.optionalRules.push({ ruleId, enabled, source: { ...FINAL_TOUCHES_RULES_SOURCE } })
}

function makeId(prefix: string): string {
  return globalThis.crypto?.randomUUID?.() ?? `${prefix}-${Date.now()}-${Math.random()}`
}
