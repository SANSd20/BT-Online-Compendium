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
  addManualInventoryItem,
  enterFinalTouches,
  markReadyForEquipmentReview,
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
    const decoded = decodeCharacter(encodeCharacter(character, '2026-09-23T00:00:00.000Z'))
    expect(decoded).toEqual(character)
    const repository = new LocalStorageCharacterRepository(new MemoryStorage())
    repository.save(character)
    expect(repository.get(character.id)).toEqual(character)
  })

  it('continues to reject full finalization', () => {
    const character = enterFinalTouches(readyForFinalTouches())
    character.creation.status = 'finalized'
    expect(validateCharacter(character).issues.map((entry) => entry.id)).toContain('life-modules.finalization.unsupported')
  })
})
