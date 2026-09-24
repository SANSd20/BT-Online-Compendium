import { describe, expect, it } from 'vitest'
import { AGITATOR_ID, BLUE_COLLAR_ID, STAGE_2_HIGH_SCHOOL_ID } from '../domain/lifeModules/catalog'
import { getOptimizationPreview as getDomainOptimizationPreview } from '../domain/lifeModules/finalReview'
import { equipmentLimitsForEquipped, getEquipmentFoundationIssues, startingCBillsForWealth } from '../domain/finalTouches/rules'
import { decodeCharacter, encodeCharacter } from '../persistence/characterCodec'
import { LocalStorageCharacterRepository, type StorageLike } from '../persistence/characterRepository'
import { validateCharacter } from '../validation/validateCharacter'
import {
  applyCapellanCommonality,
  applyStage1Module,
  applyStage2Module,
  applyStage4Module,
  applyTechnicalCollege,
  applyUniversalStage0,
  continueToStage2,
  continueToStage3,
  continueToStage4,
  createLifeModuleCharacter,
  resolvePendingLifeModuleAward,
} from './lifeModuleEngine'
import { enterLifeModuleFinalReview } from './lifeModuleFinalReview'
import {
  addCatalogInventoryItem,
  addManualInventoryItem,
  enterFinalTouches,
  markReadyForEquipmentReview,
  setEquipmentAccessProfile,
  setIssuedGearEnabled,
  updatePersonalDescription,
} from './finalTouchesEngine'

class MemoryStorage implements StorageLike {
  private readonly values = new Map<string, string>()
  get length() { return this.values.size }
  key(index: number) { return [...this.values.keys()][index] ?? null }
  getItem(key: string) { return this.values.get(key) ?? null }
  setItem(key: string, value: string) { this.values.set(key, value) }
  removeItem(key: string) { this.values.delete(key) }
}

function resolveByAward(character: ReturnType<typeof createLifeModuleCharacter>, awardId: string, targetId: string, displayName: string, parameter?: string) {
  const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === awardId)
  if (!pending) throw new Error(`Missing pending fixture award: ${awardId}`)
  return resolvePendingLifeModuleAward(character, pending.id, {
    type: pending.allowedTargetTypes[0], targetId, displayName,
    ...(parameter ? { parameter: { kind: 'subskill', value: parameter } } : {}),
  })
}

function readyForFinalTouches() {
  let character = createLifeModuleCharacter('Final Touches Fixture')
  character = applyUniversalStage0(character, 'Mandarin Chinese')
  character = applyCapellanCommonality(character, 'Russian')
  character = applyStage1Module(character, BLUE_COLLAR_ID)
  character = resolveByAward(character, 'commonality.language.fedsuns', 'skill.language', 'Language/French', 'French')
  character = resolveByAward(character, 'blue-collar.career', 'skill.career', 'Career/Technician', 'Technician')
  character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/History', 'History')
  character = resolveByAward(character, 'blue-collar.interests', 'skill.interest', 'Interest/Science', 'Science')
  for (const attribute of ['STR', 'BOD', 'DEX', 'RFL']) character = resolveByAward(character, 'blue-collar.flexible', attribute, attribute)
  character = applyStage2Module(continueToStage2(character), STAGE_2_HIGH_SCHOOL_ID)
  character = resolveByAward(character, 'high-school.interest-40', 'skill.interest', 'Interest/Physics', 'Physics')
  character = resolveByAward(character, 'high-school.interest-35', 'skill.interest', 'Interest/Art', 'Art')
  character = resolveByAward(character, 'high-school.language-affiliation', 'skill.language', 'Language/English', 'English')
  character = resolveByAward(character, 'high-school.streetwise-affiliation', 'skill.streetwise', 'Streetwise/Capellan', 'Capellan')
  let flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'high-school.flexible')!
  character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'DEX', displayName: 'DEX' }, 185)
  character = applyTechnicalCollege(continueToStage3(character))
  character = resolveByAward(character, 'technical-college.interest', 'skill.interest', 'Interest/Engineering', 'Engineering')
  flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'technical-college.flexible')!
  character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'INT', displayName: 'INT' }, 150)
  character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'trait', targetId: 'trait.patient', displayName: 'Patient' }, 50)
  character = applyStage4Module(continueToStage4(character), AGITATOR_ID)
  character = resolveByAward(character, 'agitator.skill.driving', 'skill.driving', 'Driving/Ground Car', 'Ground Car')
  character = resolveByAward(character, 'agitator.skill.prestidigitation', 'skill.prestidigitation', 'Prestidigitation/Sleight of Hand', 'Sleight of Hand')
  character = resolveByAward(character, 'agitator.skill.streetwise-affiliation', 'skill.streetwise', 'Streetwise/Capellan', 'Capellan')
  flexible = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'agitator.flexible')!
  character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'attribute', targetId: 'STR', displayName: 'STR' }, 50)
  character = resolvePendingLifeModuleAward(character, flexible.id, { type: 'skill', targetId: 'skill.acting', displayName: 'Acting' }, 75)

  for (const opportunity of getDomainOptimizationPreview(character)) {
    if (opportunity.destination.type === 'attribute') character.attributes.find((entry) => entry.attributeId === opportunity.destination.targetId)!.accumulatedXp = opportunity.afterXp
    if (opportunity.destination.type === 'trait') character.traits.find((entry) => entry.traitId === opportunity.destination.targetId && JSON.stringify(entry.parameters) === JSON.stringify(opportunity.destination.parameters ?? {}))!.accumulatedXp = opportunity.afterXp
    if (opportunity.destination.type === 'skill') character.skills.find((entry) => entry.address.skillId === opportunity.destination.targetId && entry.address.parameter?.value === opportunity.destination.parameter?.value)!.accumulatedXp = opportunity.afterXp
  }
  character.creation.lifeModules!.moduleXp.starting = character.creation.lifeModules!.moduleXp.spent
  character.creation.lifeModules!.moduleXp.remaining = 0
  character.xp.creation.starting = character.creation.lifeModules!.moduleXp.spent
  character.xp.creation.remaining = 0
  return enterLifeModuleFinalReview(character)
}

describe('Final Touches and equipment foundation', () => {
  it('models the audited Wealth and Equipped tables', () => {
    expect(startingCBillsForWealth(-1)).toBe(100)
    expect(startingCBillsForWealth(0)).toBe(1000)
    expect(startingCBillsForWealth(2)).toBe(5000)
    expect(equipmentLimitsForEquipped(0)).toEqual({ tech: 'D', availability: 'B', legality: 'B' })
    expect(equipmentLimitsForEquipped(1)).toEqual({ tech: 'D', availability: 'B', legality: 'C' })
  })

  it('enters Final Touches only after final review and defaults Issued Gear off', () => {
    expect(() => enterFinalTouches(createLifeModuleCharacter('Too Early'))).toThrow('only after')
    const character = enterFinalTouches(readyForFinalTouches())
    expect(character.creation.finalTouches).toMatchObject({
      startingCBillSource: 'wealth-trait', startingCBillTotal: 1000, spentCBillTotal: 0, remainingCBillTotal: 1000,
      wealthTpUsed: 0, equippedTpUsed: 1, maxTechRating: 'D', maxAvailabilityRating: 'B', maxLegalityRating: 'C',
      issuedGearEnabled: false, equipmentReviewState: 'equipment-draft',
    })
    expect(character.cBills).toBe(1000)
    expect(character.creation.rulesSnapshot.optionalRules).toContainEqual(expect.objectContaining({ ruleId: 'core.optional-issued-gear', enabled: false }))
  })

  it('records metric personal details durably', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = updatePersonalDescription(character, { hairColor: 'Black', eyeColor: 'Brown', heightCm: 178, weightKg: 77, homeworld: 'Sian', physicalDescription: 'Compact build.', backgroundNotes: 'Technical College graduate.' })
    expect(character.personalDescription).toMatchObject({ homeworld: 'Sian', heightCm: 178, weightKg: 77 })
    expect(() => updatePersonalDescription(character, { heightCm: 0 })).toThrow('positive metric')
  })

  it('subtracts only Owned equipment and carries unspent C-bills', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addManualInventoryItem(character, { name: 'Field Kit', quantity: 2, costPerItemCBills: 100, ownership: 'Owned', rating: { tech: 'D', availability: 'B', legality: 'C' } })
    expect(character.creation.finalTouches).toMatchObject({ spentCBillTotal: 200, remainingCBillTotal: 800 })
    expect(character.cBills).toBe(800)
    expect(character.inventory[0]).toMatchObject({ ownership: 'Owned', totalCostCBills: 200, personalProperty: true, entryKind: 'manual' })
  })

  it('adds catalog equipment with quantity, catalog data, source, and provenance', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.personalWeapon.autoPistol.standard', quantity: 2, ownership: 'Owned' })
    expect(character.creation.finalTouches).toMatchObject({ spentCBillTotal: 100, remainingCBillTotal: 900 })
    expect(character.inventory[0]).toMatchObject({
      catalogItemId: 'core.personalWeapon.autoPistol.standard', entryKind: 'catalog', displayName: 'Auto-Pistol', quantity: 2,
      costPerItemCBills: 50, totalCostCBills: 100, equipmentRating: { tech: 'C', availability: 'A', legality: 'C' },
      catalogSnapshot: {
        snapshotVersion: 2, displayName: 'Auto-Pistol', costCBills: 50, affiliationCode: null,
        sourceKey: 'AToW-CTP-p265', sourceStatus: 'audited-core', categoryPath: ['Weapon', 'Small Arms', 'Pistol'], metadata: { shots: 10 },
        rawRatingStatus: 'preserved', rawEquipmentRating: 'C/A-A-A/C', rawAvailabilityCodes: ['A', 'A', 'A'],
      },
    })
    expect(character.inventory[0].source?.ruleId).toBe('AToW-CTP-p265')
    expect(character.provenance.some((entry) => entry.id === character.inventory[0].provenanceId)).toBe(true)
    expect(getEquipmentFoundationIssues(character)).toEqual([])
    expect(() => addCatalogInventoryItem(character, { catalogItemId: 'missing.item', quantity: 1, ownership: 'Owned' })).toThrow('Unknown equipment catalog item')
    expect(() => addCatalogInventoryItem(character, { catalogItemId: 'core.clothing.fatigues', quantity: 0, ownership: 'Owned' })).toThrow('positive whole number')
  })

  it('preserves raw and normalized ratings in the purchase-time snapshot and JSON', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.weaponAccessory.sight.laserSight', quantity: 1, ownership: 'Owned' })
    expect(character.inventory[0].catalogSnapshot).toMatchObject({
      snapshotVersion: 2, displayName: 'Laser Sight', costCBills: 25, affiliationCode: null,
      rawEquipmentRating: 'C/A-A-A/A', rawAvailabilityCodes: ['A', 'A', 'A'],
      normalizedEquipmentRating: { tech: 'C', availability: 'A', legality: 'A' },
      metadata: { attackModifier: 1 }, notes: ['Attack and power effects are metadata only.'],
    })
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-24T00:00:00.000Z'))
    expect(decoded.inventory[0].catalogSnapshot).toEqual(character.inventory[0].catalogSnapshot)
  })

  it('preserves Slice 17 clothing snapshots and inert metadata for Owned and Issued purchases', () => {
    let character = setIssuedGearEnabled(enterFinalTouches(readyForFinalTouches()), true)
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.clothing.leather.jacket', quantity: 2, ownership: 'Owned' })
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.clothing.leather.gloves', quantity: 1, ownership: 'Issued' })

    expect(character.creation.finalTouches).toMatchObject({ spentCBillTotal: 100, remainingCBillTotal: 900 })
    expect(character.inventory[0]).toMatchObject({
      entryKind: 'catalog', ownership: 'Owned', personalProperty: true, totalCostCBills: 100,
      equipmentRating: { tech: 'A', availability: 'A', legality: 'A' },
      catalogSnapshot: {
        snapshotVersion: 2, displayName: 'Leather Jacket', costCBills: 50,
        categoryPath: ['Clothing', 'Leatherwear'], affiliationCode: null,
        sourceKey: 'AToW-CTP-p299', sourceStatus: 'audited-core',
        rawRatingStatus: 'preserved', rawEquipmentRating: 'A/A-A-A/A', rawAvailabilityCodes: ['A', 'A', 'A'],
        normalizedEquipmentRating: { tech: 'A', availability: 'A', legality: 'A' },
        metadata: { massKg: 2, coverage: 'Torso, Arms', bar: '1/1/0/1' },
      },
    })
    expect(character.inventory[1]).toMatchObject({
      entryKind: 'catalog', ownership: 'Issued', personalProperty: false, totalCostCBills: 20,
      catalogSnapshot: { metadata: { coverage: 'Hands', bar: '1/1/0/1', dexRelatedRollModifier: -1 } },
    })
    for (const item of character.inventory) {
      expect(item).not.toHaveProperty('bar')
      expect(item).not.toHaveProperty('coverage')
      expect(item).not.toHaveProperty('dexRelatedRollModifier')
    }
    expect(getEquipmentFoundationIssues(character)).toEqual([])
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-24T00:00:00.000Z'))
    expect(decoded.inventory).toEqual(character.inventory)
  })

  it('preserves Slice 18 Clan pack snapshots and existing Clan access behavior without runtime power state', () => {
    const ready = readyForFinalTouches()
    const equipped = ready.traits.find((entry) => entry.traitId === 'trait.equipped')!
    equipped.accumulatedXp = 700
    equipped.attainedTp = 7
    equipped.active = true
    let character = enterFinalTouches(ready)
    character = setEquipmentAccessProfile(character, { enabled: true, affiliationCategory: 'clan', nativeAffiliationCode: 'CLAN' })
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.power.clan.microPowerPack.standard', quantity: 2, ownership: 'Owned' })
    expect(character.inventory[0]).toMatchObject({
      catalogItemId: 'core.power.clan.microPowerPack.standard', displayName: 'Micro Power Pack, Clan',
      affiliationCode: 'CLAN', totalCostCBills: 100, personalProperty: true,
      catalogSnapshot: {
        sourceKey: 'AToW-CTP-p306', sourceStatus: 'audited-core', categoryPath: ['Power', 'Micro Power Pack', 'Clan'],
        rawEquipmentRating: 'F/X-E-C/A', rawAvailabilityCodes: ['X', 'E', 'C'],
        normalizedEquipmentRating: { tech: 'F', availability: 'E', legality: 'A' },
        metadata: { massKg: 0.015, capacityPp: 20, quickCharge: true },
      },
    })
    expect(getEquipmentFoundationIssues(character)).toEqual([])
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-24T00:00:00.000Z'))
    expect(decoded.inventory[0]).toEqual(character.inventory[0])
    character = setEquipmentAccessProfile(character, { enabled: true, affiliationCategory: 'clan', nativeAffiliationCode: 'CC' })
    expect(getEquipmentFoundationIssues(character).map((entry) => entry.id)).toContain('inventory.owned.rating.exceeded')
    expect(character.inventory[0]).not.toHaveProperty('currentPower')
    expect(character.inventory[0]).not.toHaveProperty('powerCapacity')
    expect(character.inventory[0]).not.toHaveProperty('rechargeState')
    expect(character.inventory[0]).not.toHaveProperty('quickChargeState')

    let issued = setIssuedGearEnabled(enterFinalTouches(readyForFinalTouches()), true)
    issued = setEquipmentAccessProfile(issued, { enabled: true, affiliationCategory: 'clan', nativeAffiliationCode: 'CLAN' })
    issued = addCatalogInventoryItem(issued, { catalogItemId: 'core.power.clan.powerPack.standard', quantity: 1, ownership: 'Issued' })
    expect(issued.cBills).toBe(1000)
    expect(issued.inventory[0]).toMatchObject({ displayName: 'Power Pack, Clan', ownership: 'Issued', personalProperty: false })
    expect(getEquipmentFoundationIssues(issued)).toEqual([])
  })

  it('rejects clothing-rule metadata promoted into inventory runtime state', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.clothing.leather.vestApron', quantity: 1, ownership: 'Owned' })
    ;(character.inventory[0] as unknown as Record<string, unknown>).bar = '1/1/0/1'
    ;(character.inventory[0] as unknown as Record<string, unknown>).coverage = 'Torso'
    ;(character.inventory[0] as unknown as Record<string, unknown>).facing = 'Front'
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('inventory.runtime-state.unsupported')
  })

  it('accepts and preserves a pre-backfill normalized-only Slice 11 purchase snapshot', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.personalWeapon.autoPistol.standard', quantity: 1, ownership: 'Owned' })
    const snapshot = character.inventory[0].catalogSnapshot!
    snapshot.rawRatingStatus = 'not-supplied-in-audit'
    delete snapshot.rawEquipmentRating
    delete snapshot.rawAvailabilityCodes

    expect(validateCharacter(character).valid).toBe(true)
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-24T00:00:00.000Z'))
    expect(decoded.inventory[0].catalogSnapshot).toEqual(snapshot)
    expect(decoded.inventory[0].catalogItemId).toBe('core.personalWeapon.autoPistol.standard')
    expect(decoded.inventory[0].catalogSnapshot).toMatchObject({
      rawRatingStatus: 'not-supplied-in-audit',
      normalizedEquipmentRating: { tech: 'C', availability: 'A', legality: 'C' },
    })
  })

  it('validates malformed raw snapshots, normalization mismatches, and missing native affiliation', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.personalWeapon.needlerPistol.standard', quantity: 1, ownership: 'Owned' })
    character.inventory[0].catalogSnapshot!.rawEquipmentRating = 'bad-rating'
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('inventory.raw-rating.malformed')
    character.inventory[0].catalogSnapshot!.rawEquipmentRating = 'D/A-A-A/D'
    character.inventory[0].catalogSnapshot!.normalizedEquipmentRating.availability = 'B'
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('inventory.normalized-rating.mismatch')
    character = setEquipmentAccessProfile(character, { enabled: true, affiliationCategory: 'inner-sphere', nativeAffiliationCode: '' })
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('final-touches.native-affiliation.required')
  })

  it('applies native and foreign affiliation review to purchased catalog items', () => {
    const ready = readyForFinalTouches()
    const equipped = ready.traits.find((entry) => entry.traitId === 'trait.equipped')!
    equipped.accumulatedXp = 200
    equipped.attainedTp = 2
    equipped.active = true
    let character = enterFinalTouches(ready)
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.meleeWeapon.vibroblade.vibrodagger', quantity: 1, ownership: 'Owned' })
    expect(validateCharacter(character).issues.map((entry) => entry.id)).not.toContain('inventory.owned.rating.exceeded')
    character = setEquipmentAccessProfile(character, { enabled: true, affiliationCategory: 'inner-sphere', nativeAffiliationCode: 'LA' })
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('inventory.owned.rating.exceeded')
  })

  it('uses the audited replacement for a formerly example-backed medical item', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.medical.medipatch', quantity: 2, ownership: 'Owned' })
    expect(character.inventory[0]).toMatchObject({
      totalCostCBills: 20,
      equipmentRating: { tech: 'D', availability: 'B', legality: 'B' },
      catalogSnapshot: { sourceStatus: 'audited-core', sourceKey: 'AToW-CTP-p313', rawEquipmentRating: 'D/A-B-A/B' },
    })
    expect(validateCharacter(character).issues.map((entry) => entry.id)).not.toContain('inventory.rating.invalid')
  })

  it('accepts historical example-backed medical snapshots without rewriting them', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.medical.medipatch', quantity: 2, ownership: 'Owned' })
    const item = character.inventory[0]
    item.equipmentRating = { tech: null, availability: null, legality: null }
    item.source = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', ruleId: 'AToW-CTP-example-final-touches' }
    item.catalogSnapshot = {
      categoryPath: ['Medical'], sourceKey: 'AToW-CTP-example-final-touches', sourceStatus: 'example-backed',
      normalizedEquipmentRating: { tech: null, availability: null, legality: null },
      metadata: { massKg: 0, exampleBacked: true },
    }
    expect(validateCharacter(character).valid).toBe(true)
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-24T00:00:00.000Z'))
    expect(decoded.inventory[0].catalogSnapshot).toEqual(item.catalogSnapshot)
  })

  it('requires complete durable metadata on current versioned purchase snapshots', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.power.recharger.solar', quantity: 1, ownership: 'Owned' })
    delete character.inventory[0].catalogSnapshot!.displayName
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('inventory.catalog-snapshot.durable-metadata')
  })

  it('preserves Batch 3 catalog metadata and provenance through JSON round-trip', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.electronics.recorder.microRecorder', quantity: 1, ownership: 'Owned' })
    expect(character.inventory[0].catalogSnapshot).toMatchObject({
      sourceKey: 'AToW-CTP-p302',
      rawEquipmentRating: 'C/A-B-B/A',
      normalizedEquipmentRating: { tech: 'C', availability: 'B', legality: 'A' },
      metadata: { highQualityRecordingHours: 1, lowQualityRecordingHours: 10 },
    })
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-24T00:00:00.000Z'))
    expect(decoded.inventory[0].catalogSnapshot).toEqual(character.inventory[0].catalogSnapshot)
  })

  it('preserves Slice 14 metadata without creating runtime tracking state', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.power.recharger.solar', quantity: 1, ownership: 'Owned' })
    expect(character.inventory[0].catalogSnapshot).toMatchObject({
      sourceKey: 'AToW-CTP-p306',
      rawEquipmentRating: 'D/A-B-B/A',
      normalizedEquipmentRating: { tech: 'D', availability: 'B', legality: 'A' },
      metadata: { massKg: 1.5, powerGenerationPph: 45 },
    })
    expect(character.inventory[0]).not.toHaveProperty('currentPower')
    expect(character.inventory[0]).not.toHaveProperty('sensorState')
    expect(character.inventory[0]).not.toHaveProperty('remainingUses')
    expect(character.inventory[0]).not.toHaveProperty('movementState')
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-24T00:00:00.000Z'))
    expect(decoded.inventory[0]).toEqual(character.inventory[0])
  })

  it('applies Issued Gear behavior to catalog items', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    expect(() => addCatalogInventoryItem(character, { catalogItemId: 'core.electronics.communicator.military', quantity: 1, ownership: 'Issued' })).toThrow('Enable the Issued Gear')
    character = setIssuedGearEnabled(character, true)
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.electronics.communicator.military', quantity: 1, ownership: 'Issued' })
    expect(character.cBills).toBe(1000)
    expect(character.inventory[0]).toMatchObject({ ownership: 'Issued', personalProperty: false, totalCostCBills: 50 })
  })

  it('regression-tests Owned catalog purchases across equipment categories', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    const ids = [
      'core.personalWeapon.autoPistol.standard', 'core.armor.flak.vest', 'core.electronics.communicator.civilian',
      'core.power.powerPack.standard', 'core.medical.kit.standard', 'core.repair.smallArms.slugThrowerKit',
      'core.fieldGear.survival.basicFieldKit',
    ]
    for (const catalogItemId of ids) character = addCatalogInventoryItem(character, { catalogItemId, quantity: 1, ownership: 'Owned' })
    expect(character.inventory.every((item) => item.personalProperty && item.ownership === 'Owned')).toBe(true)
    expect(character.creation.finalTouches).toMatchObject({ spentCBillTotal: 270, remainingCBillTotal: 730 })
    expect(getEquipmentFoundationIssues(character)).toEqual([])
  })

  it('regression-tests Issued catalog purchases across equipment categories', () => {
    let character = setIssuedGearEnabled(enterFinalTouches(readyForFinalTouches()), true)
    const ids = [
      'core.personalWeapon.laserPistol.standard', 'core.armor.ballisticPlate.vest', 'core.electronics.communicator.military',
      'core.power.recharger.solar', 'core.medical.lifeSupportUnit.standard', 'core.repair.smallArms.energyWeaponKit',
      'core.fieldGear.survival.advancedFieldKit',
    ]
    for (const catalogItemId of ids) character = addCatalogInventoryItem(character, { catalogItemId, quantity: 1, ownership: 'Issued' })
    expect(character.inventory.every((item) => !item.personalProperty && item.ownership === 'Issued')).toBe(true)
    expect(character.creation.finalTouches).toMatchObject({ spentCBillTotal: 0, remainingCBillTotal: 1000 })
    expect(character.cBills).toBe(1000)
    expect(getEquipmentFoundationIssues(character)).toEqual([])
  })

  it('validates unaffordable and above-limit Owned equipment', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addManualInventoryItem(character, { name: 'Restricted Prototype', quantity: 1, costPerItemCBills: 1200, ownership: 'Owned', rating: { tech: 'E', availability: 'C', legality: 'D' } })
    const ids = validateCharacter(character).issues.map((entry) => entry.id)
    expect(ids).toContain('inventory.owned.unaffordable')
    expect(ids).toContain('inventory.owned.rating.exceeded')
    expect(character.cBills).toBe(-200)
    expect(() => markReadyForEquipmentReview(character)).toThrow('unresolved validation issues')
  })

  it('requires the Issued Gear option and never charges or transfers ownership', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    const issued = { name: 'Employer Communicator', quantity: 1, costPerItemCBills: 500, ownership: 'Issued' as const, rating: { tech: 'E' as const, availability: 'D' as const, legality: 'D' as const }, issuerOrEmployer: 'Capellan service' }
    expect(() => addManualInventoryItem(character, issued)).toThrow('Enable the Issued Gear')
    character = setIssuedGearEnabled(character, true)
    character = addManualInventoryItem(character, issued)
    expect(character.cBills).toBe(1000)
    expect(character.inventory[0]).toMatchObject({ ownership: 'Issued', personalProperty: false, reviewState: 'gm-review', issuerOrEmployer: 'Capellan service' })
    expect(getEquipmentFoundationIssues(character)).toEqual([])
    character = setIssuedGearEnabled(character, false)
    expect(character.inventory).toHaveLength(1)
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('inventory.issued.option-disabled')
  })

  it('marks a valid draft ready only for equipment review', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addManualInventoryItem(character, { name: 'Civilian Clothing', quantity: 1, costPerItemCBills: 50, ownership: 'Owned', rating: { tech: 'A', availability: 'A', legality: 'A' } })
    character = markReadyForEquipmentReview(character)
    expect(character.creation.finalTouches?.equipmentReviewState).toBe('ready-for-equipment-review')
    expect(character.creation.status).toBe('draft')
    expect(validateCharacter(character).valid).toBe(true)
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('final-touches.scope.alpha')
  })

  it('round-trips Final Touches and inventory through JSON and local storage', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = updatePersonalDescription(character, { homeworld: 'Sian', backgroundNotes: 'Organizer and technician.' })
    character = addManualInventoryItem(character, { name: 'Datapad', quantity: 1, costPerItemCBills: 250, ownership: 'Owned', rating: { tech: 'D', availability: 'B', legality: 'B' }, location: 'Satchel' })
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.clothing.fatigues', quantity: 2, ownership: 'Owned' })
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-23T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    const repository = new LocalStorageCharacterRepository(new MemoryStorage())
    repository.save(character)
    expect(repository.get(character.id)).toEqual(character)
  })

  it('keeps manual fallback non-catalog, durable, and subject to ownership rules', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addManualInventoryItem(character, {
      name: 'Locally Built Analyzer', quantity: 2, costPerItemCBills: 75, ownership: 'Owned',
      rating: { tech: 'C', availability: 'A', legality: 'A' }, affiliationCode: 'local-code', notes: 'Player-entered item.',
    })
    expect(character.inventory[0]).toMatchObject({ entryKind: 'manual', affiliationCode: 'LOCAL-CODE', notes: ['Player-entered item.'], totalCostCBills: 150 })
    expect(character.inventory[0]).not.toHaveProperty('catalogItemId')
    expect(character.inventory[0]).not.toHaveProperty('catalogSnapshot')
    expect(decodeCharacter(encodeCharacter(character, '2026-09-24T00:00:00.000Z')).inventory[0]).toEqual(character.inventory[0])
    character.inventory[0].catalogItemId = 'core.clothing.fatigues'
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('inventory.manual.catalog-data')
  })

  it('rejects runtime state derived from inert equipment metadata', () => {
    let character = enterFinalTouches(readyForFinalTouches())
    character = addCatalogInventoryItem(character, { catalogItemId: 'core.power.powerPack.standard', quantity: 1, ownership: 'Owned' })
    ;(character.inventory[0] as unknown as Record<string, unknown>).currentPower = 20
    ;(character.inventory[0] as unknown as Record<string, unknown>).ammo = 10
    ;(character.inventory[0] as unknown as Record<string, unknown>).armorCondition = 4
    ;(character.inventory[0] as unknown as Record<string, unknown>).sensorState = 'active'
    const issues = validateCharacter(character).issues
    expect(issues.map((entry) => entry.id)).toContain('inventory.runtime-state.unsupported')
    expect(issues.find((entry) => entry.id === 'inventory.runtime-state.unsupported')?.message).toContain('currentPower')
  })

  it('continues to reject full finalization', () => {
    const character = enterFinalTouches(readyForFinalTouches())
    character.creation.status = 'finalized'
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('life-modules.finalization.unsupported')
  })
})
