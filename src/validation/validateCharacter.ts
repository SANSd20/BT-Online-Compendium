import type { CharacterDefinition, LifeModuleOptimizationRecord } from '../domain/character/model'
import { getCoreArchetype } from '../domain/archetypes/coreArchetypes'
import {
  archetypeSkillAddressId as archetypeSkillTargetId,
  findKnownSafeSkillSwapTarget,
} from '../domain/archetypes/skillSwapTargets'
import {
  POINT_BUY_ATTRIBUTE_MAXIMUMS,
  XP_COST_TABLE_SOURCE,
  getPointBuySkill,
  getPointBuyTrait,
  standardSkillXpCost,
} from '../domain/pointBuy/catalog'
import {
  calculateArchetypeAdjustmentNetXp,
  calculateNegativeTraitXp,
  calculatePointBuyAllocatedXp,
  evaluateSharedXpAccounting,
  standardAttributeXpCost,
} from '../domain/pointBuy/calculations'
import type { ValidationIssue, ValidationResult } from './model'
import { getLifeModule } from '../domain/lifeModules/catalog'
import type { LifeModuleAward, LifeModuleDefinition, LifeModulePrerequisite } from '../domain/lifeModules/model'
import { getSkillField, skillFieldCost } from '../domain/skillFields/catalog'
import {
  deriveAttributeLevel,
  deriveStandardSkillLevel,
  deriveTraitPoints,
  finalReviewDestinationKey,
  getFinalReviewBlockers,
  getModeledOpposedTraitConflicts,
  getOptimizationPreview,
  isModeledNegativeTrait,
  negativeTraitXpPurchaseCap,
  traitModeledRange,
} from '../domain/lifeModules/finalReview'
import {
  effectivePrimaryTraitTp,
  equipmentLimitsForEquipped,
  getEquipmentFoundationIssues,
  startingCBillsForWealth,
} from '../domain/finalTouches/rules'
import { getEquipmentCatalogItem, parseRawEquipmentRating } from '../domain/equipment/catalog'

const SAFE_AFFILIATION_CODE = /^[A-Z][A-Z0-9-]*$/
const FORBIDDEN_INVENTORY_RUNTIME_KEYS = [
  'currentPower', 'remainingPower', 'powerState', 'ammo', 'ammunition', 'magazineCount', 'reloadState',
  'armorCondition', 'barCurrent', 'fatigue', 'addiction', 'consciousness', 'healing', 'sensorState',
  'networkState', 'movementState', 'repairJobs', 'remainingUses', 'bar', 'coverage', 'facing',
  'dexRelatedRollModifier', 'protection',
] as const

function issue(
  id: string,
  path: string,
  message: string,
  options: Partial<Pick<ValidationIssue, 'severity' | 'kind' | 'gmOverrideAllowed'>> = {},
): ValidationIssue {
  return {
    id,
    path,
    message,
    severity: options.severity ?? 'error',
    kind: options.kind ?? 'hard-requirement',
    gmOverrideAllowed: options.gmOverrideAllowed ?? false,
  }
}

export function validateCharacter(character: CharacterDefinition): ValidationResult {
  const issues: ValidationIssue[] = []

  if (!character.id.trim()) {
    issues.push(issue('character.id.required', 'id', 'Character ID is required.'))
  }
  if (!character.displayName.trim()) {
    issues.push(issue('character.name.required', 'displayName', 'Character name is required.'))
  }
  if (character.creation.rulesSnapshot.sources.length === 0) {
    issues.push(issue('rules.sources.required', 'creation.rulesSnapshot.sources', 'At least one rules source is required.'))
  }

  if (character.creation.method === 'archetype') {
    if (!character.creation.archetype?.archetypeId || !character.creation.archetype.source.sourceId) {
      issues.push(issue('archetype.selection.required', 'creation.archetype', 'A published archetype selection and source are required.'))
    }
    if (
      character.attributes.length === 0 ||
      character.traits.length === 0 ||
      character.skills.length === 0
    ) {
      issues.push(issue('archetype.package.required', 'creation', 'Archetype Attributes, Traits, and Skills are required.'))
    }
  }

  if (character.creation.method === 'point-buy') {
    validatePointBuy(character, issues)
  }
  if (character.creation.method === 'life-modules') {
    validateLifeModules(character, issues)
  } else if (character.creation.lifeModules?.finalReview) {
    issues.push(issue('life-modules.optimization.method.invalid', 'creation.lifeModules.finalReview', 'Life Module final review and Optimization cannot be applied to a non-Life-Modules character.'))
  }

  const identityIds = new Set(character.identities.entries.map((identity) => identity.id))
  const primaryIdentities = character.identities.entries.filter((identity) => identity.kind === 'primary')
  if (primaryIdentities.length !== 1) {
    issues.push(issue('identity.primary.exactly-one', 'identities.entries', 'Exactly one primary identity is required.'))
  }
  if (!identityIds.has(character.identities.primaryIdentityId)) {
    issues.push(issue('identity.primary.reference', 'identities.primaryIdentityId', 'Primary identity reference is invalid.'))
  }

  if (
    character.xp.creation.starting < 0 ||
    character.xp.creation.remaining < 0 ||
    character.xp.creation.allocated < 0 ||
    character.xp.earnedGameplayUnspent < 0
  ) {
    issues.push(issue('xp.nonnegative', 'xp', 'XP pools cannot be negative.'))
  }

  character.traits.forEach((trait, index) => {
    if (trait.identityId && !identityIds.has(trait.identityId)) {
      issues.push(issue('trait.identity.reference', `traits.${index}.identityId`, 'Trait identity reference is invalid.'))
    }
  })

  character.skills.forEach((skill, index) => {
    if (skill.level !== null && (!Number.isInteger(skill.level) || skill.level < 0)) {
      issues.push(issue('skill.level.valid', `skills.${index}.level`, 'Skill level must be null or a non-negative integer.'))
    }
  })

  const provenanceIds = new Set(character.provenance.map((entry) => entry.id))
  if (character.creation.method === 'archetype') {
    validateArchetypeFoundation(character, issues, provenanceIds)
  }
  if (character.creation.method === 'point-buy' && character.creation.pointBuy) {
    if (
      !provenanceIds.has(character.creation.pointBuy.rulesProvenanceId) ||
      !provenanceIds.has(character.creation.pointBuy.costProvenanceId)
    ) {
      issues.push(issue('point-buy.provenance.reference', 'creation.pointBuy', 'Point Buy provenance references are invalid.'))
    }
  }
  const validateAwards = (path: string, awards: Array<{ provenanceId: string }>) => {
    const requiresCreationProvenance = character.creation.method !== 'life-modules' || character.creation.lifeModules !== undefined
    if (requiresCreationProvenance && awards.length === 0) {
      issues.push(issue('creation.provenance.required', path, 'Creation-derived values require source awards.'))
    }
    awards.forEach((award, index) => {
      if (!provenanceIds.has(award.provenanceId)) {
        issues.push(issue('provenance.reference', `${path}.${index}.provenanceId`, 'Source-award provenance reference is invalid.'))
      }
    })
  }

  character.attributes.forEach((entry, index) => validateAwards(`attributes.${index}.sourceAwards`, entry.sourceAwards))
  character.traits.forEach((entry, index) => validateAwards(`traits.${index}.sourceAwards`, entry.sourceAwards))
  character.skills.forEach((entry, index) => validateAwards(`skills.${index}.sourceAwards`, entry.sourceAwards))
  character.inventory.forEach((entry, index) => {
    if (!provenanceIds.has(entry.provenanceId)) {
      issues.push(issue('provenance.reference', `inventory.${index}.provenanceId`, 'Equipment provenance reference is invalid.'))
    }
    if (character.creation.method === 'archetype' && !entry.source?.sourceId) {
      issues.push(issue('archetype.equipment.source.required', `inventory.${index}.source`, 'Archetype equipment requires a source.'))
    }
  })

  validateFinalTouches(character, issues, provenanceIds)

  return {
    valid: !issues.some((item) => item.severity === 'error'),
    issues,
  }
}

function validateArchetypeFoundation(
  character: CharacterDefinition,
  issues: ValidationIssue[],
  provenanceIds: Set<string>,
): void {
  const state = character.creation.archetype
  if (!state) return

  let definition
  try {
    definition = getCoreArchetype(state.archetypeId)
  } catch {
    issues.push(issue('archetype.foundation.unknown', 'creation.archetype.archetypeId', 'Archetype foundation ID is not in the Core catalog.'))
    return
  }

  if (state.version !== 2 || state.kind !== 'source-backed-preset' || !Array.isArray(state.adjustmentLedger)) {
    issues.push(issue('archetype.foundation.malformed', 'creation.archetype', 'Archetype foundation metadata or controlled adjustment ledger is malformed.'))
  }
  const expectedCustomizationStatus = state.adjustmentLedger.length === 0 ? 'original-package' : 'controlled-adjustments'
  if (state.customizationStatus !== expectedCustomizationStatus) {
    issues.push(issue('archetype.adjustments.status-mismatch', 'creation.archetype.customizationStatus', 'Archetype customization status must match its adjustment ledger.'))
  }
  if (
    state.displayName !== definition.displayName ||
    !sameCitation(state.source, definition.source)
  ) {
    issues.push(issue('archetype.foundation.source-mismatch', 'creation.archetype', 'Original Archetype name and source provenance must match the selected Core foundation.'))
  }
  const adjustmentKeys = new Set<string>()
  const replacementTargetIds = new Set<string>()
  state.adjustmentLedger.forEach((adjustment, index) => {
    const path = `creation.archetype.adjustmentLedger.${index}`
    const key = `${adjustment.targetType}:${adjustment.targetId}`
    if (adjustmentKeys.has(key)) {
      issues.push(issue('archetype.adjustment.target.duplicate', `${path}.targetId`, 'Only one controlled adjustment may exist for each Archetype target.'))
    }
    adjustmentKeys.add(key)

    if (
      !adjustment.id || !adjustment.targetId || !adjustment.provenanceId || !adjustment.awardId ||
      !adjustment.createdAt || !adjustment.modifiedAt ||
      adjustment.sourceFoundationId !== state.foundationProvenanceId
    ) {
      issues.push(issue('archetype.adjustment.malformed', path, 'Controlled Archetype adjustment identity, provenance, or foundation reference is malformed.'))
    }

    if (adjustment.operation === 'skill-swap') {
      if (!adjustment.sourceSkill || !adjustment.replacementSkill) {
        issues.push(issue('archetype.skill-swap.malformed', path, 'Skill swap must preserve complete source and replacement snapshots.'))
        return
      }
      const source = definition.skills.find((entry) => archetypeSkillTargetId(entry.address) === adjustment.targetId)
      const replacement = findKnownSafeSkillSwapTarget(definition.id, adjustment.targetId, adjustment.replacementSkill.targetId)
      if (!source) {
        issues.push(issue('archetype.skill-swap.source.invalid', `${path}.sourceSkill`, 'Skill swap source must exist in the selected Archetype foundation.'))
      }
      if (!replacement) {
        issues.push(issue('archetype.skill-swap.target.invalid', `${path}.replacementSkill`, 'Skill swap replacement must be an audited, unambiguous target with a valid subskill identity where required.'))
      }
      if (replacementTargetIds.has(adjustment.replacementSkill.targetId)) {
        issues.push(issue('archetype.skill-swap.target.duplicate', `${path}.replacementSkill.targetId`, 'A replacement Skill may be used by only one controlled swap.'))
      }
      replacementTargetIds.add(adjustment.replacementSkill.targetId)
      const sharedSourceXp = source ? standardSkillXpCost(source.level) : undefined
      const sharedReplacementXp = replacement ? standardSkillXpCost(replacement.level) : undefined
      if (sharedSourceXp !== undefined && sharedReplacementXp !== undefined && sharedSourceXp !== sharedReplacementXp) {
        issues.push(issue('archetype.skill-swap.xp-mismatch', path, 'Skill swap source and replacement must have exactly equal shared Point Buy XP values.'))
      }
      if (
        !source || !replacement || !adjustment.sourceSkill.sourceAwardId ||
        adjustment.sourceSkill.targetId !== adjustment.targetId ||
        !sameSkillAddress(adjustment.sourceSkill.address, source.address) ||
        adjustment.sourceSkill.displayName !== source.displayName ||
        adjustment.sourceSkill.level !== source.level || adjustment.sourceSkill.xp !== source.xp ||
        adjustment.replacementSkill.targetId !== replacement.targetId ||
        !sameSkillAddress(adjustment.replacementSkill.address, replacement.address) ||
        adjustment.replacementSkill.displayName !== replacement.displayName ||
        adjustment.replacementSkill.level !== replacement.level || adjustment.replacementSkill.xp !== replacement.xp ||
        adjustment.replacementSkill.catalogArchetypeId !== replacement.catalogArchetypeId ||
        !sameCitation(adjustment.replacementSkill.catalogSource, replacement.catalogSource) ||
        adjustment.beforeValue !== source.level || adjustment.afterValue !== replacement.level ||
        adjustment.beforeXp !== sharedSourceXp || adjustment.afterXp !== sharedReplacementXp ||
        adjustment.xpDelta !== 0
      ) {
        issues.push(issue('archetype.skill-swap.malformed', path, 'Skill swap snapshots, source award, audited target provenance, or shared XP accounting are malformed.'))
      }
    } else {
      let beforeValue: number | undefined
      let beforeXp: number | undefined
      let afterXp: number | undefined
      if (adjustment.targetType === 'attribute') {
      const source = definition.attributes.find((entry) => entry.attributeId === adjustment.targetId)
      beforeValue = source?.purchasedLevel
      if (source) beforeXp = standardAttributeXpCost(source.purchasedLevel)
      if (Number.isInteger(adjustment.afterValue) && adjustment.afterValue >= 1 && adjustment.afterValue <= 10) {
        afterXp = standardAttributeXpCost(adjustment.afterValue)
      }
      } else {
        const source = definition.skills.find((entry) => archetypeSkillTargetId(entry.address) === adjustment.targetId)
        beforeValue = source?.level
        if (source) beforeXp = standardSkillXpCost(source.level)
        if (Number.isInteger(adjustment.afterValue) && adjustment.afterValue >= 0 && adjustment.afterValue <= 10) {
          afterXp = standardSkillXpCost(adjustment.afterValue)
        }
      }
      const expectedOperation = adjustment.afterValue > adjustment.beforeValue ? 'increase' : 'decrease'
      if (
        beforeValue === undefined || beforeXp === undefined || afterXp === undefined ||
        adjustment.beforeValue !== beforeValue || adjustment.beforeXp !== beforeXp ||
        adjustment.afterValue === adjustment.beforeValue || adjustment.afterXp !== afterXp ||
        adjustment.xpDelta !== afterXp - beforeXp || adjustment.operation !== expectedOperation
      ) {
        issues.push(issue('archetype.adjustment.malformed', path, 'Controlled Archetype adjustment values, Point Buy XP delta, or operation are malformed.'))
      }
    }
    const provenance = character.provenance.find((entry) => entry.id === adjustment.provenanceId)
    if (!provenanceIds.has(adjustment.provenanceId) || provenance?.kind !== 'player-choice' || !sameCitation(provenance.source, state.source)) {
      issues.push(issue('archetype.adjustment.provenance-reference', `${path}.provenanceId`, 'Controlled Archetype adjustment provenance is invalid.'))
    }
  })

  const originalAllocationsMatch =
    character.attributes.length === definition.attributes.length &&
    character.attributes.every((entry, index) => {
      const original = definition.attributes[index]
      const adjustment = state.adjustmentLedger.find((candidate) => candidate.targetType === 'attribute' && candidate.targetId === original.attributeId)
      const adjustmentAward = adjustment
        ? entry.sourceAwards.find((award) => award.id === adjustment.awardId && award.provenanceId === adjustment.provenanceId && award.xp === adjustment.xpDelta)
        : undefined
      const sourceAward = entry.sourceAwards.some((award) => award.provenanceId === state.foundationProvenanceId && award.xp === original.xp)
      return entry.attributeId === original.attributeId &&
        entry.purchasedLevel === (adjustment?.afterValue ?? original.purchasedLevel) &&
        entry.phenotypeModifier === original.phenotypeModifier &&
        entry.accumulatedXp === original.xp + (adjustment?.xpDelta ?? 0) &&
        sourceAward && Boolean(adjustment ? adjustmentAward : true)
    }) &&
    character.traits.length === definition.traits.length &&
    character.traits.every((entry, index) => {
      const original = definition.traits[index]
      return entry.traitId === original.traitId && entry.accumulatedXp === original.xp &&
        entry.attainedTp === original.tp &&
        entry.sourceAwards.some((award) => award.provenanceId === state.foundationProvenanceId && award.xp === original.xp)
    }) &&
    character.skills.length === definition.skills.length &&
    character.skills.every((entry, index) => {
      const original = definition.skills[index]
      const targetId = archetypeSkillTargetId(original.address)
      const adjustment = state.adjustmentLedger.find((candidate) => candidate.targetType === 'skill' && candidate.targetId === targetId)
      if (adjustment?.operation === 'skill-swap') {
        const replacement = adjustment.replacementSkill
        if (!replacement) return false
        const adjustmentAward = entry.sourceAwards.length === 1 && entry.sourceAwards.some((award) => (
          award.id === adjustment.awardId &&
          award.provenanceId === adjustment.provenanceId &&
          award.xp === replacement.xp
        ))
        return sameSkillAddress(entry.address, replacement.address) &&
          entry.displayName === replacement.displayName &&
          entry.level === replacement.level &&
          entry.accumulatedXp === replacement.xp &&
          entry.specialty === undefined && adjustmentAward
      }
      const adjustmentAward = adjustment
        ? entry.sourceAwards.find((award) => award.id === adjustment.awardId && award.provenanceId === adjustment.provenanceId && award.xp === adjustment.xpDelta)
        : undefined
      const sourceAward = entry.sourceAwards.some((award) => award.provenanceId === state.foundationProvenanceId && award.xp === original.xp)
      return sameSkillAddress(entry.address, original.address) &&
        entry.level === (adjustment?.afterValue ?? original.level) &&
        entry.accumulatedXp === original.xp + (adjustment?.xpDelta ?? 0) &&
        sourceAward && Boolean(adjustment ? adjustmentAward : true)
    })
  if (!originalAllocationsMatch) {
    issues.push(issue('archetype.foundation.package-allocation-mismatch', 'creation.archetype', 'The character ledgers must equal the original source-backed Archetype package plus its recorded controlled adjustments.'))
  }
  const foundationProvenance = character.provenance.find((entry) => entry.id === state.foundationProvenanceId)
  if (
    !state.foundationProvenanceId ||
    !provenanceIds.has(state.foundationProvenanceId) ||
    foundationProvenance?.kind !== 'published' ||
    !sameCitation(foundationProvenance.source, state.source)
  ) {
    issues.push(issue('archetype.foundation.provenance-reference', 'creation.archetype.foundationProvenanceId', 'Archetype foundation provenance reference is invalid.'))
  }

  const evaluation = evaluateSharedXpAccounting(character)
  const accounting = state.accounting
  if (
    !accounting ||
    accounting.model !== 'shared-point-buy' ||
    !sameCitation(accounting.costTableSource, XP_COST_TABLE_SOURCE) ||
    accounting.publishedXpTotal !== definition.publishedXpTotal ||
    accounting.evaluatedAllocation.attributeXp !== evaluation.attributeXp ||
    accounting.evaluatedAllocation.traitXp !== evaluation.traitXp ||
    accounting.evaluatedAllocation.skillXp !== evaluation.skillXp ||
    accounting.evaluatedAllocation.totalXp !== evaluation.totalXp ||
    accounting.differenceFromPublishedXp !== evaluation.totalXp - definition.publishedXpTotal ||
    character.xp.creation.starting !== definition.publishedXpTotal ||
    character.xp.creation.allocated !== evaluation.totalXp
  ) {
    issues.push(issue('archetype.foundation.accounting-mismatch', 'creation.archetype.accounting', 'Archetype allocations must retain a current shared Point Buy accounting evaluation without changing the published package total.'))
  }
  const netAdjustmentXp = calculateArchetypeAdjustmentNetXp(character)
  if (netAdjustmentXp !== 0) {
    issues.push(issue('archetype.adjustments.unbalanced', 'creation.archetype.adjustmentLedger', `Controlled Archetype adjustments must balance to 0 XP; current net is ${netAdjustmentXp > 0 ? '+' : ''}${netAdjustmentXp} XP.`))
  }
  const expectedStatus = netAdjustmentXp === 0 ? 'ready-for-final-validation' : 'draft'
  if (character.creation.status !== expectedStatus) {
    issues.push(issue('archetype.adjustments.progression-state', 'creation.status', 'Unbalanced Archetype adjustments must remain a draft; balanced foundations may proceed to final validation.'))
  }
}

function sameSkillAddress(
  left: { skillId: string; parameter?: { kind: string; value: string } } | undefined,
  right: { skillId: string; parameter?: { kind: string; value: string } } | undefined,
): boolean {
  return Boolean(left && right && left.skillId === right.skillId &&
    left.parameter?.kind === right.parameter?.kind &&
    left.parameter?.value === right.parameter?.value)
}

function sameCitation(
  left: { sourceId: string; edition: string; errataVersion?: string; page?: number; ruleId?: string } | undefined,
  right: { sourceId: string; edition: string; errataVersion?: string; page?: number; ruleId?: string } | undefined,
): boolean {
  return Boolean(left && right && left.sourceId === right.sourceId && left.edition === right.edition && left.errataVersion === right.errataVersion && left.page === right.page && left.ruleId === right.ruleId)
}

function validateFinalTouches(character: CharacterDefinition, issues: ValidationIssue[], provenanceIds: Set<string>): void {
  const state = character.creation.finalTouches
  const hasFinalTouchesInventory = character.inventory.some((entry) => entry.entryKind === 'manual' || entry.entryKind === 'catalog')
  if (!state) {
    if (character.personalDescription || hasFinalTouchesInventory) issues.push(issue('final-touches.state.required', 'creation.finalTouches', 'Final Touches state is required for descriptive or equipment-draft data.'))
    return
  }
  const lifeModules = character.creation.lifeModules
  if (character.creation.method !== 'life-modules' || lifeModules?.phase !== 'ready-for-final-touches' || lifeModules.finalReview?.readiness !== 'ready-for-final-touches') {
    issues.push(issue('final-touches.sequence.invalid', 'creation.finalTouches', 'Final Touches cannot begin before the Life Modules character passes final review.'))
  }
  const wealthTp = effectivePrimaryTraitTp(character, 'trait.wealth')
  const equippedTp = effectivePrimaryTraitTp(character, 'trait.equipped')
  let startingCBills: number | null = null
  let limits: ReturnType<typeof equipmentLimitsForEquipped> | null = null
  try { startingCBills = startingCBillsForWealth(wealthTp) } catch { /* reported as malformed below */ }
  try { limits = equipmentLimitsForEquipped(equippedTp) } catch { /* reported as malformed below */ }
  if (
    state.version !== 1 || !state.enteredAt || state.startingCBillSource !== 'wealth-trait' ||
    !Number.isInteger(state.startingCBillTotal) || state.startingCBillTotal < 0 ||
    !Number.isInteger(state.spentCBillTotal) || state.spentCBillTotal < 0 ||
    !Number.isInteger(state.remainingCBillTotal) ||
    state.wealthTpUsed !== wealthTp || state.equippedTpUsed !== equippedTp ||
    state.startingCBillTotal !== startingCBills ||
    !limits || state.maxTechRating !== limits.tech || state.maxAvailabilityRating !== limits.availability || state.maxLegalityRating !== limits.legality ||
    !['equipment-draft', 'ready-for-equipment-review'].includes(state.equipmentReviewState) ||
    !provenanceIds.has(state.provenanceId)
  ) issues.push(issue('final-touches.state.malformed', 'creation.finalTouches', 'Final Touches funds, Trait-derived limits, review state, or provenance are malformed.'))

  const optionalRule = character.creation.rulesSnapshot.optionalRules.find((entry) => entry.ruleId === 'core.optional-issued-gear')
  if (!optionalRule || optionalRule.enabled !== state.issuedGearEnabled) issues.push(issue('final-touches.issued-gear.snapshot', 'creation.rulesSnapshot.optionalRules', 'Issued Gear state must be preserved in the character rules snapshot.'))
  const accessProfile = state.equipmentAccessProfile
  if (accessProfile) {
    if (!['inner-sphere', 'periphery', 'clan'].includes(accessProfile.affiliationCategory)) issues.push(issue('final-touches.affiliation-category.invalid', 'creation.finalTouches.equipmentAccessProfile.affiliationCategory', 'Equipment affiliation category must be Inner Sphere, Periphery, or Clan.'))
    if (accessProfile.enabled && !accessProfile.nativeAffiliationCode.trim()) issues.push(issue('final-touches.native-affiliation.required', 'creation.finalTouches.equipmentAccessProfile.nativeAffiliationCode', 'Native affiliation code is required while affiliation-based equipment adjustment is enabled.'))
  }

  const description = character.personalDescription
  if (!description || typeof description.physicalDescription !== 'string' || typeof description.backgroundNotes !== 'string' || typeof description.homeworld !== 'string') {
    issues.push(issue('final-touches.description.malformed', 'personalDescription', 'Final Touches requires a durable personal-description record.'))
  } else {
    if (description.heightCm !== undefined && (!Number.isFinite(description.heightCm) || description.heightCm <= 0)) issues.push(issue('final-touches.height.invalid', 'personalDescription.heightCm', 'Height must be a positive metric value.'))
    if (description.weightKg !== undefined && (!Number.isFinite(description.weightKg) || description.weightKg <= 0)) issues.push(issue('final-touches.weight.invalid', 'personalDescription.weightKg', 'Weight must be a positive metric value.'))
  }

  for (const equipmentIssue of getEquipmentFoundationIssues(character)) {
    issues.push(issue(equipmentIssue.id, equipmentIssue.itemId ? `inventory.${equipmentIssue.itemId}` : 'creation.finalTouches', equipmentIssue.message))
  }
  character.inventory.forEach((entry, index) => {
    if (!['manual', 'catalog'].includes(entry.entryKind ?? '') || !entry.source?.sourceId || !entry.id || !provenanceIds.has(entry.provenanceId)) {
      issues.push(issue('final-touches.inventory.provenance', `inventory.${index}`, 'Final Touches inventory requires a supported entry kind, source, stable ID, and valid provenance.'))
    }
    if (entry.affiliationCode !== undefined && (!entry.affiliationCode || !SAFE_AFFILIATION_CODE.test(entry.affiliationCode))) {
      issues.push(issue('inventory.affiliation-code.invalid', `inventory.${index}.affiliationCode`, 'Inventory affiliation codes must be uppercase, non-empty, and safe to preserve as raw codes.'))
    }
    const runtimeKeys = FORBIDDEN_INVENTORY_RUNTIME_KEYS.filter((key) => Object.prototype.hasOwnProperty.call(entry, key))
    if (runtimeKeys.length > 0) issues.push(issue('inventory.runtime-state.unsupported', `inventory.${index}`, `Equipment metadata must not create runtime item state (${runtimeKeys.join(', ')}).`))
    if (entry.entryKind === 'manual' && (entry.catalogItemId !== undefined || entry.catalogSnapshot !== undefined)) {
      issues.push(issue('inventory.manual.catalog-data', `inventory.${index}`, 'Manual inventory entries must remain non-catalog records without a catalog ID or catalog snapshot.'))
    }
    if (entry.entryKind === 'catalog') {
      try {
        getEquipmentCatalogItem(entry.catalogItemId ?? '')
      } catch {
        issues.push(issue('final-touches.inventory.catalog-id', `inventory.${index}.catalogItemId`, 'Catalog inventory requires a known stable catalog item ID.'))
      }
      const snapshot = entry.catalogSnapshot
      if (!snapshot?.sourceKey || !Array.isArray(snapshot.categoryPath) || snapshot.categoryPath.length === 0 || !['audited-core', 'example-backed'].includes(snapshot.sourceStatus) || !snapshot.metadata || typeof snapshot.metadata !== 'object' || Array.isArray(snapshot.metadata)) {
        issues.push(issue('final-touches.inventory.catalog-snapshot', `inventory.${index}.catalogSnapshot`, 'Catalog inventory requires a durable category, source-status, metadata, and source-key snapshot.'))
      }
      if (snapshot?.snapshotVersion !== undefined && snapshot.snapshotVersion !== 2) {
        issues.push(issue('inventory.catalog-snapshot.version', `inventory.${index}.catalogSnapshot.snapshotVersion`, 'Catalog snapshot version is unsupported.'))
      }
      if (snapshot?.snapshotVersion === 2 && (
        snapshot.displayName !== entry.displayName ||
        snapshot.costCBills !== entry.costPerItemCBills ||
        snapshot.affiliationCode !== (entry.affiliationCode ?? null) ||
        !Array.isArray(snapshot.notes) || JSON.stringify(snapshot.notes) !== JSON.stringify(entry.notes ?? []) ||
        snapshot.sourceKey !== entry.source?.ruleId
      )) {
        issues.push(issue('inventory.catalog-snapshot.durable-metadata', `inventory.${index}.catalogSnapshot`, 'Current catalog purchases require a complete and internally consistent purchase-time name, cost, affiliation, notes, and source snapshot.'))
      }
      if (snapshot?.rawRatingStatus === 'preserved' && !snapshot.rawEquipmentRating) {
        issues.push(issue('inventory.raw-rating.missing', `inventory.${index}.catalogSnapshot.rawEquipmentRating`, 'Catalog snapshot marks the raw rating preserved but does not contain it.'))
      }
      if (snapshot?.rawRatingStatus === 'not-supplied-in-audit' && snapshot.rawEquipmentRating) {
        issues.push(issue('inventory.raw-rating.status-mismatch', `inventory.${index}.catalogSnapshot.rawRatingStatus`, 'Catalog snapshot raw-rating status conflicts with its preserved printed rating.'))
      }
      if (snapshot?.rawEquipmentRating) {
        const parsed = parseRawEquipmentRating(snapshot.rawEquipmentRating)
        const normalized = snapshot.normalizedEquipmentRating
        if (!parsed) issues.push(issue('inventory.raw-rating.malformed', `inventory.${index}.catalogSnapshot.rawEquipmentRating`, 'Catalog purchase has a malformed raw printed equipment rating.'))
        else if (!normalized || normalized.tech !== parsed.tech || normalized.legality !== parsed.legality || !normalized.availability || !parsed.availabilityCodes.includes(normalized.availability)) {
          issues.push(issue('inventory.normalized-rating.mismatch', `inventory.${index}.catalogSnapshot.normalizedEquipmentRating`, 'Catalog purchase normalized ratings do not reconcile with the preserved raw printed rating.'))
        }
        if (parsed && (!Array.isArray(snapshot.rawAvailabilityCodes) || snapshot.rawAvailabilityCodes.length !== 3 || snapshot.rawAvailabilityCodes.some((value, tripletIndex) => value !== parsed.availabilityCodes[tripletIndex]))) {
          issues.push(issue('inventory.raw-rating.triplet-mismatch', `inventory.${index}.catalogSnapshot.rawAvailabilityCodes`, 'Stored raw Availability triplet does not match the printed rating.'))
        }
        if (normalized && JSON.stringify(normalized) !== JSON.stringify(entry.equipmentRating)) issues.push(issue('inventory.normalized-rating.snapshot-mismatch', `inventory.${index}.equipmentRating`, 'Inventory effective base ratings do not match the purchase-time normalized rating snapshot.'))
      }
    }
  })
  if (state.equipmentReviewState === 'ready-for-equipment-review' && getEquipmentFoundationIssues(character).length > 0) {
    issues.push(issue('final-touches.review-state.invalid', 'creation.finalTouches.equipmentReviewState', 'An equipment draft with validation errors cannot be ready for equipment review.'))
  }
  issues.push(issue('final-touches.scope.alpha', 'creation.finalTouches', 'Equipment remains an Alpha draft with an 84-item audited catalog and manual fallback; active item effects, the full catalog, PDF export, true finalization, and ready-for-play status are unsupported.', { severity: 'information', kind: 'availability' }))
}

function validateLifeModules(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const state = character.creation.lifeModules
  if (!state?.source.sourceId) {
    const isUninitializedFoundation = character.lifeModuleHistory.length === 0 && character.xp.creation.starting === 0
    if (!isUninitializedFoundation) {
      issues.push(issue('life-modules.state.required', 'creation.lifeModules', 'Life Module creation state and source are required.'))
    }
    return
  }
  const { starting, spent, remaining } = state.moduleXp
  if (!Array.isArray(state.selectedSkillFields)) {
    issues.push(issue('life-modules.skill-fields.state.malformed', 'creation.lifeModules.selectedSkillFields', 'Durable Skill Field records are required.'))
    return
  }
  if (!Number.isInteger(starting) || starting <= 0 || !Number.isInteger(spent) || spent < 0 || !Number.isInteger(remaining) || remaining < 0) {
    issues.push(issue('life-modules.xp.valid', 'creation.lifeModules.moduleXp', 'Life Module XP values must be non-negative whole numbers with a positive starting pool.'))
  }
  const expectedCreationRemaining = state.finalReview?.allocationPool.remaining ?? remaining
  if (remaining !== starting - spent || character.xp.creation.remaining !== expectedCreationRemaining) {
    issues.push(issue('life-modules.xp.balance', 'creation.lifeModules.moduleXp', 'Life Module spending and remaining XP do not reconcile.'))
  }
  const selectedIds = new Set<string>()
  const provenanceIds = new Set(character.provenance.map((entry) => entry.id))
  let calculatedCost = 0
  for (const [index, entry] of character.lifeModuleHistory.entries()) {
    if (selectedIds.has(entry.moduleId)) issues.push(issue('life-modules.module.duplicate', `lifeModuleHistory.${index}.moduleId`, 'A Life Module cannot be selected more than once in the current Alpha catalog.'))
    selectedIds.add(entry.moduleId)
    try {
      const definition = getLifeModule(entry.moduleId)
      const selectedFieldCost = state.selectedSkillFields.filter((grant) => grant.schoolModuleId === entry.moduleId).reduce((total, grant) => total + grant.purchaseCostXp, 0)
      const expectedCost = definition.skillFieldSelection ? definition.costXp + selectedFieldCost : definition.costXp
      calculatedCost += expectedCost
      if (
        entry.costXp !== expectedCost ||
        entry.stage !== definition.stage ||
        !entry.source.sourceId ||
        (definition.chronologyYears !== undefined && entry.chronologyYears !== definition.chronologyYears) ||
        JSON.stringify(entry.repeatPolicy ?? null) !== JSON.stringify(definition.repeatPolicy ?? null) ||
        (definition.skillFieldSelection && (entry.baseCostXp !== definition.costXp || entry.fieldCostXp !== selectedFieldCost))
      ) {
        issues.push(issue('life-modules.module.malformed', `lifeModuleHistory.${index}`, 'Life Module history does not match its catalog definition.'))
      }
    } catch (error) {
      issues.push(issue('life-modules.module.unknown', `lifeModuleHistory.${index}.moduleId`, error instanceof Error ? error.message : 'Unknown Life Module.'))
    }
    if (entry.provenanceIds.length === 0 || entry.provenanceIds.some((id) => !provenanceIds.has(id))) {
      issues.push(issue('life-modules.module.provenance', `lifeModuleHistory.${index}.provenanceIds`, 'Selected Life Modules require valid provenance references.'))
    }
  }
  if (calculatedCost !== spent) issues.push(issue('life-modules.cost.balance', 'creation.lifeModules.moduleXp.spent', 'Selected module costs do not match recorded Life Module spending.'))
  if (state.selectedModuleIds.length !== character.lifeModuleHistory.length || state.selectedModuleIds.some((id) => !selectedIds.has(id))) {
    issues.push(issue('life-modules.selection.balance', 'creation.lifeModules.selectedModuleIds', 'Selected module state does not match module history.'))
  }
  const hasUniversal = selectedIds.has('stage0.universal-fixed-xp')
  const hasAffiliation = selectedIds.has('stage0.capellan-confederation.capellan-commonality')
  const universalAffiliationResolution = state.resolvedAwards?.find((entry) => entry.moduleId === 'stage0.universal-fixed-xp' && entry.awardId === 'universal.language.affiliation')
  const stage1Count = character.lifeModuleHistory.filter((entry) => entry.stage === 1).length
  const stage2Count = character.lifeModuleHistory.filter((entry) => entry.stage === 2).length
  const stage3Count = character.lifeModuleHistory.filter((entry) => entry.stage === 3).length
  const stage4Entries = character.lifeModuleHistory.filter((entry) => entry.stage === 4)
  const stage4Count = stage4Entries.length
  if (!hasUniversal) issues.push(issue('life-modules.universal.outstanding', 'lifeModuleHistory', 'The universal Stage 0 package is still required.', { severity: 'warning' }))
  if (!hasAffiliation) issues.push(issue('life-modules.affiliation.outstanding', 'lifeModuleHistory', 'A Stage 0 affiliation is still required.', { severity: 'warning' }))
  if (hasUniversal && state.awardResolutionVersion === 1 && (
    state.stage0AffiliationContext !== 'stage0.capellan-confederation.capellan-commonality' ||
    !state.affiliationLanguage ||
    universalAffiliationResolution?.destination.parameter?.value !== state.affiliationLanguage
  )) {
    issues.push(issue('life-modules.stage-0.affiliation-context.required', 'creation.lifeModules.stage0AffiliationContext', 'Stage 0 Universal requires an explicit affiliation context and matching affiliation-language resolution.'))
  }
  if (hasAffiliation && state.stage0AffiliationContext !== 'stage0.capellan-confederation.capellan-commonality') {
    issues.push(issue('life-modules.stage-0.affiliation-context.mismatch', 'creation.lifeModules.stage0AffiliationContext', 'The selected Stage 0 affiliation must match the explicit Universal affiliation context.'))
  }
  if (stage1Count !== 1) issues.push(issue('life-modules.stage-1.outstanding', 'lifeModuleHistory', 'Exactly one Stage 1 module is required.', { severity: stage1Count === 0 ? 'warning' : 'error' }))
  if (stage2Count > 1) issues.push(issue('life-modules.stage-2.multiple', 'lifeModuleHistory', 'No more than one Stage 2 module may be selected.'))
  if (state.currentStage === 2 && stage2Count === 0 && state.phase !== 'stage-2-selection') issues.push(issue('life-modules.stage-2.outstanding', 'lifeModuleHistory', 'Stage 2 has not been selected for this continuation.', { severity: 'warning' }))
  if (stage3Count > 1) issues.push(issue('life-modules.stage-3.multiple', 'lifeModuleHistory', 'Repeated Stage 3 schooling is not supported.'))
  if (state.currentStage === 3 && stage3Count === 0) issues.push(issue('life-modules.stage-3.outstanding', 'lifeModuleHistory', 'A Stage 3 school has not yet been selected for this continuation.', { severity: 'warning' }))
  validateSkillFieldGrants(character, issues, provenanceIds, stage3Count)
  if (stage4Count > 1) issues.push(issue('life-modules.stage-4.multiple', 'lifeModuleHistory', 'Multiple Stage 4 modules are not supported in Alpha Slice 9.'))
  if (new Set(stage4Entries.map((entry) => entry.moduleId)).size !== stage4Count) issues.push(issue('life-modules.stage-4.repeat.unsupported', 'lifeModuleHistory', 'Repeated Stage 4 execution is not supported in Alpha Slice 9.'))
  if (state.currentStage === 4 && stage4Count === 0 && state.phase !== 'stage-4-selection') issues.push(issue('life-modules.stage-4.outstanding', 'lifeModuleHistory', 'A Stage 4 module has not yet been selected for this continuation.', { severity: 'warning' }))
  validateStage4(character, issues, provenanceIds, stage4Entries)
  validateFinalReview(character, issues, stage4Count)
  if (!Array.isArray(state.pendingAwards) || !Array.isArray(state.resolvedAwards) || !Array.isArray(state.choiceGrantRequirements)) {
    issues.push(issue('life-modules.award-state.malformed', 'creation.lifeModules', 'Pending and resolved Life Module award collections are required.'))
    return
  }
  state.pendingAwards.forEach((award, index) => {
    let catalogAward: LifeModuleAward | undefined
    try { catalogAward = getLifeModule(award.moduleId).awards.find((entry) => entry.id === award.awardId) } catch { /* malformed below */ }
    const poolAward = catalogAward?.kind === 'flexible-xp' && catalogAward.allocationMode === 'pool' ? catalogAward : undefined
    const isPool = poolAward !== undefined
    const expectedXp = catalogAward?.kind === 'flexible-xp' ? (catalogAward.allocationMode === 'pool' ? 0 : catalogAward.xpPerGrant) : catalogAward && 'xp' in catalogAward ? catalogAward.xp : undefined
    const expectedTypes = catalogAward?.kind === 'flexible-xp' ? catalogAward.allowedTargetTypes : catalogAward && ['language-choice', 'affiliation-skill-choice', 'any-skill-choice', 'multi-skill-choice'].includes(catalogAward.kind) ? ['skill'] : []
    const expectedSkill = catalogAward?.kind === 'language-choice' ? 'skill.language' : catalogAward?.kind === 'affiliation-skill-choice' || catalogAward?.kind === 'any-skill-choice' || catalogAward?.kind === 'multi-skill-choice' ? catalogAward.skillId : undefined
    if (
      !selectedIds.has(award.moduleId) ||
      !award.awardId ||
      !Number.isFinite(award.xpPerGrant) ||
      !Number.isInteger(award.remainingGrants) ||
      (isPool ? award.remainingGrants !== 0 || !Number.isInteger(award.remainingXp) || award.remainingXp! <= 0 || award.remainingXp! > poolAward.totalXp : award.remainingGrants <= 0) ||
      award.allowedTargetTypes.length === 0 ||
      !award.source.sourceId ||
      !catalogAward ||
      catalogAward.kind !== award.kind ||
      expectedXp !== award.xpPerGrant ||
      expectedTypes.length !== award.allowedTargetTypes.length ||
      expectedTypes.some((type) => !award.allowedTargetTypes.includes(type as 'attribute' | 'trait' | 'skill')) ||
      expectedSkill !== award.requiredSkillId ||
      (isPool && (award.allocationMode !== 'pool' || JSON.stringify(award.maxXpPerTarget ?? {}) !== JSON.stringify(poolAward.maxXpPerTarget ?? {})))
    ) {
      issues.push(issue('life-modules.pending-award.malformed', `creation.lifeModules.pendingAwards.${index}`, 'Pending Life Module award state is malformed.'))
    }
  })
  validateResolvedLifeModuleAwards(character, issues, selectedIds)
  validateChoiceGrantBalance(character, issues)
  if (state.pendingAwards.length > 0) issues.push(issue('life-modules.awards.unresolved', 'creation.lifeModules.pendingAwards', `${state.pendingAwards.length} source-bound award allocation${state.pendingAwards.length === 1 ? ' remains' : 's remain'} unresolved.`, { severity: 'warning' }))
  const hasOutstandingPrerequisite = state.prerequisiteIssues.some((entry) => entry.status === 'outstanding')
  if (hasOutstandingPrerequisite) {
    issues.push(issue('life-modules.prerequisites.outstanding', 'creation.lifeModules.prerequisiteIssues', 'One or more Life Module prerequisites remain outstanding for final validation.', { severity: 'warning', kind: 'prerequisite', gmOverrideAllowed: true }))
  }
  if (stage1Count === 1) {
    const expectedPhase = state.finalReview
      ? getFinalReviewBlockers(character).length === 0 ? 'ready-for-final-touches' : 'alpha-final-review'
      : state.phase === 'stage-4-selection' && stage4Count === 0 && stage3Count === 1 && state.pendingAwards.length === 0 && !hasOutstandingPrerequisite
      ? 'stage-4-selection'
      : stage4Count === 1
        ? state.pendingAwards.length > 0
          ? 'stage-4-resolution'
          : hasOutstandingPrerequisite
            ? 'stage-4-prerequisite-review'
            : 'alpha-stage-4-stop'
      : state.phase === 'stage-3-selection' && stage3Count === 0 && stage2Count === 1 && state.pendingAwards.length === 0 && !hasOutstandingPrerequisite
      ? 'stage-3-selection'
      : stage3Count === 1
        ? state.pendingAwards.length > 0
          ? 'stage-3-resolution'
          : hasOutstandingPrerequisite
            ? 'stage-3-prerequisite-review'
            : 'alpha-stage-3-stop'
        : state.phase === 'stage-2-selection' && stage2Count === 0 && state.pendingAwards.length === 0 && !hasOutstandingPrerequisite
          ? 'stage-2-selection'
          : stage2Count === 1
            ? state.pendingAwards.length > 0
              ? 'stage-2-resolution'
              : hasOutstandingPrerequisite
                ? 'stage-2-prerequisite-review'
                : 'alpha-stage-2-stop'
            : state.pendingAwards.length > 0
              ? 'stage-1-resolution'
              : hasOutstandingPrerequisite
                ? 'stage-1-prerequisite-review'
                : 'alpha-partial-stop'
    if (state.phase !== expectedPhase) issues.push(issue('life-modules.phase.malformed', 'creation.lifeModules.phase', `Life Module phase should be ${expectedPhase}.`))
    if (expectedPhase === 'alpha-partial-stop' || expectedPhase === 'alpha-stage-2-stop' || expectedPhase === 'alpha-stage-3-stop' || expectedPhase === 'alpha-stage-4-stop') {
      if (state.stopState !== expectedPhase) issues.push(issue('life-modules.stop-state.malformed', 'creation.lifeModules.stopState', 'Completed Life Module award resolution requires the matching Alpha partial-stop state.'))
      const message = expectedPhase === 'alpha-stage-4-stop'
        ? 'Stage 0 through the minimal Stage 4 branch are complete; repeated Stage 4 execution and finalization remain unsupported.'
        : expectedPhase === 'alpha-stage-3-stop'
        ? 'Stage 0 through the minimal Stage 3 branch are complete; the draft may explicitly continue to the minimal Stage 4 branch.'
        : expectedPhase === 'alpha-stage-2-stop'
          ? 'Stage 0 through Stage 2 are complete; the draft may stop here or explicitly continue to the minimal Stage 3 branch.'
          : 'Stage 0 and Stage 1 are complete; the draft may stop here or explicitly continue to Stage 2.'
      issues.push(issue('life-modules.alpha-stop.valid', 'creation.lifeModules.stopState', message, { severity: 'information', kind: 'availability' }))
    } else if (state.stopState !== 'not-eligible') {
      issues.push(issue('life-modules.stop-state.malformed', 'creation.lifeModules.stopState', 'This draft is not eligible for an Alpha partial stop.'))
    }
  }
  if (character.creation.status === 'finalized') {
    issues.push(issue('life-modules.finalization.unsupported', 'creation.status', 'Full Life Module finalization is not implemented in Alpha Slice 9.'))
  }
}

function validateFinalReview(
  character: CharacterDefinition,
  issues: ValidationIssue[],
  stage4Count: number,
): void {
  const state = character.creation.lifeModules!
  const review = state.finalReview
  if (!review) return
  const pool = review.allocationPool
  if (
    review.version !== 1 ||
    !review.enteredAt ||
    stage4Count !== 1 ||
    !Array.isArray(review.allocations) ||
    !Array.isArray(review.optimizations) ||
    !Number.isInteger(pool.starting) || pool.starting < 0 ||
    !Number.isInteger(pool.allocated) || pool.allocated < 0 ||
    !Number.isInteger(pool.optimizationReturned) || pool.optimizationReturned < 0 ||
    !Number.isInteger(pool.remaining) || pool.remaining < 0 ||
    pool.starting !== state.moduleXp.remaining ||
    pool.remaining !== pool.starting + pool.optimizationReturned - pool.allocated
  ) issues.push(issue('life-modules.final-review.pool.malformed', 'creation.lifeModules.finalReview', 'Final-review state and allocation-pool accounting are malformed.'))
  if (pool.remaining > 0) issues.push(issue('life-modules.final-review.xp.unallocated', 'creation.lifeModules.finalReview.allocationPool.remaining', `${pool.remaining} XP remains for final allocation.`, { severity: 'warning' }))

  for (const [index, allocation] of review.allocations.entries()) {
    const provenance = character.provenance.find((entry) => entry.id === allocation.provenanceId)
    if (!allocation.id || !allocation.allocatedAt || !Number.isInteger(allocation.xp) || allocation.xp <= 0 || provenance?.kind !== 'player-choice' || !provenance.source?.sourceId || !finalReviewTargetExists(character, allocation.destination)) {
      issues.push(issue('life-modules.final-allocation.malformed', `creation.lifeModules.finalReview.allocations.${index}`, 'Final-allocation entry has an invalid amount, target, timestamp, or provenance.'))
    }
  }
  if (review.allocations.reduce((total, entry) => total + entry.xp, 0) !== pool.allocated) {
    issues.push(issue('life-modules.final-allocation.balance', 'creation.lifeModules.finalReview.allocations', 'Final-allocation records do not match the allocated XP total.'))
  }

  for (const [index, optimization] of review.optimizations.entries()) {
    const provenance = character.provenance.find((entry) => entry.id === optimization.provenanceId)
    if (
      !optimization.id || !optimization.appliedAt ||
      !Number.isInteger(optimization.beforeXp) || !Number.isInteger(optimization.afterXp) ||
      !Number.isInteger(optimization.returnedXp) || optimization.returnedXp <= 0 ||
      optimization.returnedXp !== Math.abs(optimization.beforeXp - optimization.afterXp) ||
      provenance?.kind !== 'derived' || !provenance.source?.sourceId ||
      !optimizationRecordTargetsFullyAttained(optimization) ||
      !finalReviewTargetExists(character, optimization.destination)
    ) issues.push(issue('life-modules.optimization.malformed', `creation.lifeModules.finalReview.optimizations.${index}`, 'Optimization record has invalid XP, target, timestamp, or provenance.'))
  }
  if (review.optimizations.reduce((total, entry) => total + entry.returnedXp, 0) !== pool.optimizationReturned) {
    issues.push(issue('life-modules.optimization.balance', 'creation.lifeModules.finalReview.optimizations', 'Optimization records do not match the XP returned to the final-allocation pool.'))
  }

  character.attributes.forEach((entry, index) => {
    const derived = deriveAttributeLevel(entry.accumulatedXp)
    if (entry.purchasedLevel !== derived) issues.push(issue('life-modules.final-level.attribute.malformed', `attributes.${index}.purchasedLevel`, 'Attribute score does not match its fully attained XP threshold.'))
    if ((derived ?? 0) < 1) issues.push(issue('life-modules.final-level.attribute.minimum', `attributes.${index}`, `${entry.attributeId} must attain score 1 before Final Touches.`))
    const maximum = POINT_BUY_ATTRIBUTE_MAXIMUMS[entry.attributeId]
    if (maximum !== undefined && (derived ?? 0) > maximum) issues.push(issue('life-modules.final-level.attribute.maximum', `attributes.${index}`, `${entry.attributeId} exceeds the modeled Normal Human maximum of ${maximum}.`))
  })
  character.skills.forEach((entry, index) => {
    const derived = deriveStandardSkillLevel(entry.accumulatedXp)
    if (entry.level !== derived) issues.push(issue('life-modules.final-level.skill.malformed', `skills.${index}.level`, 'Skill level does not match its highest fully attained Standard threshold.'))
    if (entry.accumulatedXp > 570) issues.push(issue('life-modules.final-level.skill.maximum', `skills.${index}.accumulatedXp`, 'Skill XP exceeds the modeled Standard Level +10 maximum and must be optimized.'))
  })
  character.traits.forEach((entry, index) => {
    const derived = deriveTraitPoints(entry.accumulatedXp)
    if (entry.attainedTp !== derived || entry.active !== (derived !== null)) issues.push(issue('life-modules.final-level.trait.malformed', `traits.${index}`, 'Trait TP/active state does not match its fully attained XP threshold.'))
    const range = traitModeledRange(entry.traitId)
    if (range && derived !== null && (derived < range.minimum || derived > range.maximum)) issues.push(issue('life-modules.final-level.trait.range', `traits.${index}`, `${entry.displayName ?? entry.traitId} is outside its modeled TP range.`))
    if (isModeledNegativeTrait(entry.traitId) && entry.accumulatedXp > 0) issues.push(issue('life-modules.negative-trait.positive-xp', `traits.${index}`, `${entry.displayName ?? entry.traitId} is a modeled negative Trait with positive XP and requires explicit Optimization.`))
  })

  for (const conflict of getModeledOpposedTraitConflicts(character)) {
    issues.push(issue('life-modules.opposed-traits.conflict', 'traits', conflict.description))
  }
  if (getOptimizationPreview(character).length > 0) issues.push(issue('life-modules.optimization.outstanding', 'creation.lifeModules.finalReview', 'One or more explicit Optimization opportunities remain.', { severity: 'warning' }))
  validateConflictingPrerequisites(character, issues)

  const cap = negativeTraitXpPurchaseCap(state.moduleXp.starting)
  if (
    review.negativeTraitXpPurchase.capXp !== cap ||
    review.negativeTraitXpPurchase.purchasedXp !== 0 ||
    review.negativeTraitXpPurchase.uiStatus !== 'deferred'
  ) issues.push(issue('life-modules.negative-trait-xp.malformed', 'creation.lifeModules.finalReview.negativeTraitXpPurchase', 'Negative-Trait XP purchase metadata is malformed or unsupported.'))
  issues.push(issue('life-modules.negative-trait-xp.deferred', 'creation.lifeModules.finalReview.negativeTraitXpPurchase', `Up to ${cap} XP may eventually be purchased through fully attained negative Traits; the purchase UI is deferred.`, { severity: 'information', kind: 'availability' }))

  const blockers = getFinalReviewBlockers(character)
  const expectedReadiness = blockers.length === 0 ? 'ready-for-final-touches' : 'review-required'
  if (review.readiness !== expectedReadiness) issues.push(issue('life-modules.final-review.readiness.malformed', 'creation.lifeModules.finalReview.readiness', `Final-review readiness should be ${expectedReadiness}.`))
  if (expectedReadiness === 'ready-for-final-touches') {
    issues.push(issue('life-modules.final-touches.ready', 'creation.lifeModules.finalReview.readiness', 'Character is ready for Final Touches; equipment purchasing, PDF export, and full finalization remain unsupported.', { severity: 'information', kind: 'availability' }))
  } else {
    blockers.forEach((blocker) => issues.push(issue(`life-modules.final-review.blocked.${blocker.id}`, 'creation.lifeModules.finalReview', blocker.message, { severity: 'warning' })))
  }
}

function optimizationRecordTargetsFullyAttained(record: LifeModuleOptimizationRecord): boolean {
  if (record.reason === 'negative-trait-positive-xp') return record.beforeXp > 0 && record.afterXp === 0
  if (record.reason === 'negative-trait-threshold') return record.beforeXp < 0 && record.afterXp < record.beforeXp && Math.abs(record.afterXp) % 100 === 0
  if (record.afterXp < 0 || record.afterXp >= record.beforeXp) return false
  if (record.destination.type === 'attribute' || record.destination.type === 'trait') return record.afterXp % 100 === 0
  if (record.afterXp === 0) return record.beforeXp < standardSkillXpCost(0)
  return deriveStandardSkillLevel(record.afterXp) !== null && record.afterXp === standardSkillXpCost(deriveStandardSkillLevel(record.afterXp))
}

function finalReviewTargetExists(character: CharacterDefinition, destination: { type: string; targetId: string; parameter?: { kind: string; value: string }; parameters?: Record<string, string | number | boolean> }): boolean {
  if (destination.type === 'attribute') return character.attributes.some((entry) => entry.attributeId === destination.targetId)
  if (destination.type === 'trait') return character.traits.some((entry) => entry.traitId === destination.targetId && JSON.stringify(entry.parameters) === JSON.stringify(destination.parameters ?? {}))
  if (destination.type === 'skill') return character.skills.some((entry) => finalReviewDestinationKey({ type: 'skill', targetId: entry.address.skillId, displayName: entry.displayName ?? entry.address.skillId, parameter: entry.address.parameter }) === finalReviewDestinationKey({ ...destination, type: 'skill', displayName: destination.targetId }))
  return false
}

function validateConflictingPrerequisites(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const selected = character.creation.lifeModules?.selectedModuleIds ?? []
  const prerequisites = selected.flatMap((moduleId) => {
    try { return getLifeModule(moduleId).prerequisites.map((entry) => ({ moduleId, entry })) } catch { return [] }
  })
  for (const required of prerequisites) {
    if (required.entry.kind !== 'trait') continue
    const traitId = required.entry.traitId
    const conflict = prerequisites.find((item) => item.entry.kind === 'trait-absent' && item.entry.traitId === traitId)
    if (conflict) issues.push(issue('life-modules.prerequisites.conflict', 'creation.lifeModules.prerequisiteIssues', `Conflicting prerequisites for ${traitId} affect ${required.moduleId} and ${conflict.moduleId}.`, { kind: 'prerequisite', gmOverrideAllowed: true }))
  }
}

function validateStage4(
  character: CharacterDefinition,
  issues: ValidationIssue[],
  provenanceIds: Set<string>,
  stage4Entries: CharacterDefinition['lifeModuleHistory'],
): void {
  if (stage4Entries.length !== 1) return
  const entry = stage4Entries[0]
  let definition: LifeModuleDefinition
  try { definition = getLifeModule(entry.moduleId) } catch { return }
  if (definition.stage !== 4) return
  const expectedAge = 16 + (character.creation.lifeModules?.selectedSkillFields.reduce((total, grant) => total + grant.chronologyYears, 0) ?? 0) + (definition.chronologyYears ?? 0)
  const chronology = character.chronology.find((item) => item.eventId === `${entry.moduleId}.complete`)
  if (!chronology || chronology.date !== `age:${expectedAge}` || !provenanceIds.has(chronology.provenanceId)) {
    issues.push(issue('life-modules.stage-4.age.malformed', 'chronology', 'Stage 4 chronology must equal age 16 plus Stage 3 and Stage 4 time and retain valid provenance.'))
  }
  if (!definition.repeatPolicy || JSON.stringify(entry.repeatPolicy) !== JSON.stringify(definition.repeatPolicy)) {
    issues.push(issue('life-modules.stage-4.repeat-policy.malformed', 'lifeModuleHistory', 'Stage 4 history must preserve the published repeat-policy metadata for future implementation.'))
  }
}

function validateResolvedLifeModuleAwards(character: CharacterDefinition, issues: ValidationIssue[], selectedIds: Set<string>): void {
  const state = character.creation.lifeModules!
  const provenanceIds = new Set(character.provenance.map((entry) => entry.id))
  const seen = new Set<string>()
  state.resolvedAwards.forEach((resolved, index) => {
    let module: LifeModuleDefinition | undefined
    try { module = getLifeModule(resolved.moduleId) } catch { /* reported below */ }
    const award = module?.awards.find((entry) => entry.id === resolved.awardId)
    const key = `${resolved.moduleId}/${resolved.awardId}/${lifeModuleDestinationKey(resolved.destination)}`
    if (seen.has(key) && !(award?.kind === 'flexible-xp' && award.allocationMode === 'pool')) issues.push(issue('life-modules.resolution.duplicate', `creation.lifeModules.resolvedAwards.${index}`, 'A required choice cannot use the same destination more than once.'))
    seen.add(key)
    if (!selectedIds.has(resolved.moduleId) || !award || award.kind === 'fixed' || award.kind === 'choice-package' || award.kind === 'conditional' || award.kind === 'field-grant') {
      issues.push(issue('life-modules.resolution.unknown', `creation.lifeModules.resolvedAwards.${index}`, 'Resolved award does not identify a selectable award on a selected module.'))
      return
    }
    const expectedXp = award.kind === 'flexible-xp' ? (award.allocationMode === 'pool' ? null : award.xpPerGrant) : award.xp
    const allowedTypes = award.kind === 'flexible-xp' ? award.allowedTargetTypes : ['skill']
    const requiredSkillId = award.kind === 'affiliation-skill-choice' || award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice' ? award.skillId : award.kind === 'language-choice' ? 'skill.language' : undefined
    const targetIdValid = resolved.destination.type === 'attribute'
      ? LIFE_MODULE_ATTRIBUTE_IDS.includes(resolved.destination.targetId)
      : resolved.destination.targetId.startsWith(resolved.destination.type === 'trait' ? 'trait.' : 'skill.')
    const languageValid = award.kind !== 'language-choice' || award.choicesFrom === 'federated-suns-languages' || (
      award.choicesFrom === 'capellan-secondary'
        ? CAPELLAN_SECONDARY_LANGUAGE_IDS.includes(resolved.destination.parameter?.value ?? '')
        : CAPELLAN_AFFILIATION_LANGUAGE_IDS.includes(resolved.destination.parameter?.value ?? '')
    )
    if (
      resolved.kind !== award.kind ||
      (expectedXp === null ? !Number.isInteger(resolved.xp) || resolved.xp <= 0 : resolved.xp !== expectedXp) ||
      !allowedTypes.includes(resolved.destination.type) ||
      (requiredSkillId && resolved.destination.targetId !== requiredSkillId) ||
      ((award.kind === 'language-choice' || award.kind === 'affiliation-skill-choice' || award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice') && !resolved.destination.parameter?.value) ||
      !targetIdValid ||
      !languageValid ||
      !resolved.source.sourceId ||
      !provenanceIds.has(resolved.provenanceId)
    ) {
      issues.push(issue('life-modules.resolution.malformed', `creation.lifeModules.resolvedAwards.${index}`, 'Resolved Life Module award violates its source award structure or provenance.'))
    }
  })
  for (const moduleId of selectedIds) {
    let module: LifeModuleDefinition | undefined
    try { module = getLifeModule(moduleId) } catch { continue }
    for (const award of module.awards) {
      if (award.kind !== 'flexible-xp' || award.allocationMode !== 'pool') continue
      const resolved = state.resolvedAwards.filter((entry) => entry.moduleId === moduleId && entry.awardId === award.id)
      for (const target of resolved) {
        const total = resolved.filter((entry) => lifeModuleDestinationKey(entry.destination) === lifeModuleDestinationKey(target.destination)).reduce((sum, entry) => sum + entry.xp, 0)
        const cap = award.maxXpPerTarget?.[target.destination.type]
        if (cap !== undefined && total > cap) issues.push(issue('life-modules.flexible-cap.exceeded', 'creation.lifeModules.resolvedAwards', `${module.displayName} flexible XP exceeds the ${cap} XP cap for one ${target.destination.type}.`))
      }
    }
  }
}

function validateSkillFieldGrants(character: CharacterDefinition, issues: ValidationIssue[], provenanceIds: Set<string>, stage3Count: number): void {
  const state = character.creation.lifeModules!
  const seen = new Set<string>()
  for (const [index, grant] of state.selectedSkillFields.entries()) {
    let field
    try { field = getSkillField(grant.fieldId) } catch (error) {
      issues.push(issue('life-modules.skill-field.unknown', `creation.lifeModules.selectedSkillFields.${index}.fieldId`, error instanceof Error ? error.message : 'Unknown Skill Field.'))
      continue
    }
    if (seen.has(grant.fieldId)) issues.push(issue('life-modules.skill-field.duplicate', `creation.lifeModules.selectedSkillFields.${index}.fieldId`, 'A Skill Field may not be selected more than once in Alpha Slice 9.'))
    seen.add(grant.fieldId)
    const school = character.lifeModuleHistory.find((entry) => entry.moduleId === grant.schoolModuleId && entry.stage === 3)
    let schoolDefinition: LifeModuleDefinition | undefined
    try { schoolDefinition = school ? getLifeModule(school.moduleId) : undefined } catch { /* school validation reports this */ }
    const offer = schoolDefinition?.skillFieldSelection?.offers.find((entry) => entry.fieldId === grant.fieldId)
    if (
      !grant.id ||
      !school ||
      !offer ||
      grant.displayName !== field.displayName ||
      grant.category !== offer?.category ||
      grant.purchaseCostXp !== skillFieldCost(field, offer?.costXpPerSkill ?? 0) ||
      grant.xpPerSkill !== offer?.awardedXpPerSkill ||
      grant.chronologyYears !== offer?.chronologyYears ||
      !grant.selectedAt ||
      !grant.source.sourceId ||
      !provenanceIds.has(grant.provenanceId)
    ) {
      issues.push(issue('life-modules.skill-field.malformed', `creation.lifeModules.selectedSkillFields.${index}`, 'Durable Skill Field record does not match its catalog definition, school, cost, chronology, or provenance.'))
    }
    for (const prerequisite of field.prerequisites) {
      const tracked = state.prerequisiteIssues.find((entry) => entry.moduleId === field.id && entry.prerequisiteId === prerequisite.id)
      if (!tracked || tracked.description !== prerequisite.description) {
        issues.push(issue('life-modules.skill-field.prerequisite.missing', 'creation.lifeModules.prerequisiteIssues', `${field.displayName} prerequisite ${prerequisite.description} is not tracked durably.`))
      } else if (tracked.status !== 'gm-override' && tracked.status !== (skillFieldPrerequisiteSatisfied(character, prerequisite) ? 'satisfied' : 'outstanding')) {
        issues.push(issue('life-modules.skill-field.prerequisite.malformed', 'creation.lifeModules.prerequisiteIssues', `${field.displayName} prerequisite ${prerequisite.description} has an incorrect status.`))
      }
    }
  }

  const stage3 = character.lifeModuleHistory.find((entry) => entry.stage === 3)
  if (!stage3) {
    if (state.selectedSkillFields.length > 0) issues.push(issue('life-modules.skill-field.without-school', 'creation.lifeModules.selectedSkillFields', 'Skill Fields require a selected Stage 3 school.'))
    return
  }
  let school: LifeModuleDefinition | undefined
  try { school = getLifeModule(stage3.moduleId) } catch { return }
  const policy = school.skillFieldSelection
  if (!policy) {
    issues.push(issue('life-modules.skill-field.policy.missing', 'lifeModuleHistory', 'Selected Stage 3 school has no Skill Field policy.'))
    return
  }
  const grants = state.selectedSkillFields.filter((grant) => grant.schoolModuleId === stage3.moduleId)
  const basicCount = grants.filter((grant) => grant.category === 'basic').length
  const advancedCount = grants.filter((grant) => grant.category === 'advanced').length
  if (basicCount !== policy.exactlyBasic) issues.push(issue('life-modules.skill-field.basic.required', 'creation.lifeModules.selectedSkillFields', 'Technical College requires exactly one Basic Skill Field.'))
  if (advancedCount < policy.minimumAdvanced) issues.push(issue('life-modules.skill-field.advanced.required', 'creation.lifeModules.selectedSkillFields', 'Technical College requires at least one Advanced Skill Field.'))
  if (grants.length > policy.maximumTotal) issues.push(issue('life-modules.skill-field.maximum', 'creation.lifeModules.selectedSkillFields', `Technical College permits no more than ${policy.maximumTotal} Skill Fields.`))
  if (stage3Count === 1) {
    const expectedAge = 16 + grants.reduce((total, grant) => total + grant.chronologyYears, 0)
    const chronology = character.chronology.find((entry) => entry.eventId === `${stage3.moduleId}.complete`)
    if (!chronology || chronology.date !== `age:${expectedAge}` || !provenanceIds.has(chronology.provenanceId)) {
      issues.push(issue('life-modules.stage-3.age.malformed', 'chronology', 'Stage 3 chronology must equal age 16 plus the selected Skill Field time and retain valid provenance.'))
    }
  }
}

function skillFieldPrerequisiteSatisfied(character: CharacterDefinition, prerequisite: LifeModulePrerequisite): boolean {
  if (prerequisite.kind === 'attribute-minimum') return (character.attributes.find((entry) => entry.attributeId === prerequisite.attributeId)?.purchasedLevel ?? 0) >= prerequisite.minimum
  if (prerequisite.kind === 'skill-field') return prerequisite.fieldIds.some((fieldId) => character.creation.lifeModules?.selectedSkillFields.some((grant) => grant.fieldId === fieldId))
  if (prerequisite.kind === 'trait') return character.traits.some((entry) => entry.traitId === prerequisite.traitId && entry.active)
  if (prerequisite.kind === 'trait-absent') return !character.traits.some((entry) => entry.traitId === prerequisite.traitId && entry.active)
  if (prerequisite.kind === 'affiliation') return character.affiliations.length > 0 && (prerequisite.classification !== 'non-clan' || character.affiliations.every((entry) => !entry.affiliationId.startsWith('affiliation.clan')))
  return false
}

const LIFE_MODULE_ATTRIBUTE_IDS = ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG']
const CAPELLAN_AFFILIATION_LANGUAGE_IDS = ['Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English']
const CAPELLAN_SECONDARY_LANGUAGE_IDS = ['Russian', 'Cantonese', 'Vietnamese', 'English']

function validateChoiceGrantBalance(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const state = character.creation.lifeModules!
  const seen = new Set<string>()
  for (const requirement of state.choiceGrantRequirements) {
    const key = `${requirement.moduleId}/${requirement.awardId}`
    let module: LifeModuleDefinition | undefined
    try { module = getLifeModule(requirement.moduleId) } catch { /* handled below */ }
    const award = module?.awards.find((entry) => entry.id === requirement.awardId)
    const catalogCount = award ? lifeModuleAwardGrantCount(award) : null
    if (seen.has(key) || !state.selectedModuleIds.includes(requirement.moduleId) || catalogCount === null || requirement.requiredGrants !== catalogCount) {
      issues.push(issue('life-modules.choice-requirement.malformed', 'creation.lifeModules.choiceGrantRequirements', 'Choice grant requirements must uniquely match selected catalog awards.'))
      continue
    }
    seen.add(key)
    const matchingResolved = state.resolvedAwards.filter((entry) => entry.moduleId === requirement.moduleId && entry.awardId === requirement.awardId)
    const resolved = matchingResolved.length
    const matchingPending = state.pendingAwards.filter((entry) => entry.moduleId === requirement.moduleId && entry.awardId === requirement.awardId)
    const pending = matchingPending.reduce((total, entry) => total + entry.remainingGrants, 0)
    const poolBalanced = requirement.allocationMode === 'pool'
      ? matchingResolved.reduce((total, entry) => total + entry.xp, 0) + matchingPending.reduce((total, entry) => total + (entry.remainingXp ?? 0), 0) === requirement.requiredXp
      : resolved + pending === requirement.requiredGrants
    if (!poolBalanced || matchingPending.length > 1) {
      issues.push(issue('life-modules.choice-count.malformed', 'creation.lifeModules', `${module?.displayName ?? requirement.moduleId}: ${requirement.awardId} does not preserve its required choice count.`))
    }
  }
  if (state.awardResolutionVersion === 1) {
    for (const moduleId of state.selectedModuleIds) {
      let module: LifeModuleDefinition | undefined
      try { module = getLifeModule(moduleId) } catch { continue }
      for (const award of module.awards) {
        if (lifeModuleAwardGrantCount(award) !== null && !seen.has(`${moduleId}/${award.id}`)) {
          issues.push(issue('life-modules.choice-requirement.missing', 'creation.lifeModules.choiceGrantRequirements', `${module.displayName}: ${award.id} is missing its required grant record.`))
        }
      }
    }
  } else if (state.awardResolutionVersion !== 0) {
    issues.push(issue('life-modules.award-resolution-version.unsupported', 'creation.lifeModules.awardResolutionVersion', 'Life Module award-resolution state version is unsupported.'))
  }
}

function lifeModuleAwardGrantCount(award: LifeModuleAward): number | null {
  if (award.kind === 'language-choice' || award.kind === 'affiliation-skill-choice') return 1
  if (award.kind === 'any-skill-choice' || award.kind === 'multi-skill-choice') return award.count
  if (award.kind === 'flexible-xp') return award.allocationMode === 'pool' ? 0 : award.count
  return null
}

function lifeModuleDestinationKey(destination: { type: string; targetId: string; parameter?: { kind: string; value: string }; parameters?: Record<string, string | number | boolean> }): string {
  return `${destination.type}/${destination.targetId.toLowerCase()}/${destination.parameter?.kind.toLowerCase() ?? ''}/${destination.parameter?.value.toLowerCase() ?? ''}/${JSON.stringify(destination.parameters ?? {})}`
}

function validatePointBuy(character: CharacterDefinition, issues: ValidationIssue[]): void {
  const pointBuy = character.creation.pointBuy
  if (!pointBuy?.source.sourceId || !pointBuy.costTableSource.sourceId) {
    issues.push(issue('point-buy.source.required', 'creation.pointBuy', 'Point Buy rules and XP-cost sources are required.'))
  }
  const { starting, remaining, allocated } = character.xp.creation
  if (!Number.isInteger(starting) || starting < 800) {
    issues.push(issue('point-buy.starting-xp.valid', 'xp.creation.starting', 'Point Buy starting XP must be a whole number of at least 800.'))
  }
  const attributeIds = new Set<string>()
  if (character.attributes.length !== 8) {
    issues.push(issue('point-buy.attributes.complete', 'attributes', 'Point Buy requires all eight Attributes.'))
  }
  character.attributes.forEach((entry, index) => {
    const maximum = POINT_BUY_ATTRIBUTE_MAXIMUMS[entry.attributeId]
    if (attributeIds.has(entry.attributeId)) {
      issues.push(issue('point-buy.attribute.duplicate', `attributes.${index}.attributeId`, 'Point Buy Attribute IDs must be unique.'))
    }
    attributeIds.add(entry.attributeId)
    if (
      maximum === undefined ||
      !Number.isInteger(entry.purchasedLevel) ||
      (entry.purchasedLevel ?? 0) < 1 ||
      (entry.purchasedLevel ?? 0) > maximum ||
      entry.accumulatedXp !== (entry.purchasedLevel ?? 0) * 100
    ) {
      issues.push(issue('point-buy.attribute.valid', `attributes.${index}`, 'Point Buy Attribute level or XP is malformed.'))
    }
  })
  character.skills.forEach((entry, index) => {
    if (!entry.address.skillId || (entry.address.parameter && !entry.address.parameter.value.trim())) {
      issues.push(issue('point-buy.skill.address.valid', `skills.${index}.address`, 'Point Buy Skill/subskill address is malformed.'))
    }
    try {
      const definition = getPointBuySkill(entry.address.skillId)
      if (definition.parameter?.required && !entry.address.parameter?.value.trim()) {
        issues.push(issue('point-buy.skill.subskill.required', `skills.${index}.address.parameter`, `${definition.displayName} requires a concrete subskill.`))
      }
      if (!definition.parameter && entry.address.parameter) {
        issues.push(issue('point-buy.skill.subskill.prohibited', `skills.${index}.address.parameter`, `${definition.displayName} does not accept a subskill.`))
      }
      if (entry.accumulatedXp !== standardSkillXpCost(entry.level)) {
        issues.push(issue('point-buy.skill.xp.valid', `skills.${index}.accumulatedXp`, 'Point Buy Skill XP does not match its standard level cost.'))
      }
    } catch (error) {
      issues.push(issue('point-buy.skill.valid', `skills.${index}`, error instanceof Error ? error.message : 'Point Buy Skill is malformed.'))
    }
  })
  character.traits.forEach((entry, index) => {
    if (
      !entry.traitId ||
      !Number.isInteger(entry.attainedTp) ||
      entry.attainedTp === 0 ||
      entry.accumulatedXp !== (entry.attainedTp ?? 0) * 100 ||
      !entry.active
    ) {
      issues.push(issue('point-buy.trait.valid', `traits.${index}`, 'Point Buy Trait purchase is malformed.'))
    }
    try {
      const definition = getPointBuyTrait(entry.traitId)
      if (!definition.allowedTp.includes(entry.attainedTp ?? 0)) {
        issues.push(issue('point-buy.trait.tp.valid', `traits.${index}.attainedTp`, `${definition.displayName} TP is outside the Point Buy v0.1 catalog range.`))
      }
      if (definition.parameter?.required) {
        const value = entry.parameters[definition.parameter.key]
        if (typeof value !== 'string' || !value.trim()) {
          issues.push(issue('point-buy.trait.parameter.required', `traits.${index}.parameters`, `${definition.displayName} requires a concrete ${definition.parameter.label.toLowerCase()}.`))
        }
      }
    } catch (error) {
      issues.push(issue('point-buy.trait.catalog.valid', `traits.${index}.traitId`, error instanceof Error ? error.message : 'Point Buy Trait is malformed.'))
    }
  })
  const calculatedAllocated = calculatePointBuyAllocatedXp(character)
  if (allocated !== calculatedAllocated || remaining !== starting - calculatedAllocated) {
    issues.push(issue('point-buy.xp.balance', 'xp.creation', 'Point Buy allocated and remaining XP do not reconcile with the ledgers.'))
  }
  if (remaining < 0) {
    issues.push(issue('point-buy.xp.overspent', 'xp.creation.remaining', 'Point Buy creation XP cannot be overspent.'))
  }
  const negativeCeiling = Math.floor(starting * 0.1)
  if (calculateNegativeTraitXp(character) > negativeCeiling) {
    issues.push(issue('point-buy.negative-trait-xp.limit', 'traits', `Negative Traits may generate at most ${negativeCeiling} XP.`))
  }
  if (remaining > 0) {
    issues.push(issue('point-buy.xp.unspent', 'xp.creation.remaining', 'Creation XP remains unspent; the character is a draft and cannot enter play.', { severity: 'warning' }))
  }
  if (character.creation.status === 'finalized' && remaining !== 0) {
    issues.push(issue('point-buy.finalization.xp', 'creation.status', 'A finalized Point Buy character must have no unspent creation XP.'))
  }
  const hasPerception = character.skills.some((entry) => entry.address.skillId === 'skill.perception' && entry.level !== null)
  const languages = character.skills.filter((entry) => entry.address.skillId === 'skill.language' && entry.level !== null)
  const hasEnglish = languages.some((entry) => entry.address.parameter?.value.toLowerCase() === 'english')
  if (!hasPerception || !hasEnglish || languages.length < 2) {
    issues.push(issue('point-buy.required-skills.outstanding', 'skills', 'Required Skills remain outstanding: Perception +0, Language/English +0, and another affiliation language +0.', { severity: 'warning' }))
  }
}
