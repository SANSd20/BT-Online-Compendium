import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import type { CharacterDefinition, EquipmentAffiliationCategory, EquipmentCatalogSourceStatus, EquipmentOwnership, EquipmentRatingCode, PendingLifeModuleAward, ResolvedLifeModuleDestination } from '../../domain/character/model'
import { EQUIPMENT_CATALOG, EQUIPMENT_CATALOG_CATEGORIES, filterEquipmentCatalog } from '../../domain/equipment/catalog'
import { adjustedOwnedEquipmentLimits, calculateEquipmentAccess } from '../../domain/finalTouches/rules'
import { AGITATOR_ID, BACK_WOODS_ID, BLUE_COLLAR_ID, COMSTAR_WOB_SERVICE_ID, FAMILY_TRAINING_ID, getLifeModule, INTELLIGENCE_OPERATIVE_TRAINING_ID, MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID, OFFICER_TRAINING_SCHOOL_ID, POLICE_ACADEMY_ID, SOLARIS_INTERNSHIP_ID, STAGE_2_BACK_WOODS_ID, STAGE_2_HIGH_SCHOOL_ID, TECHNICAL_COLLEGE_ID, TRADE_SCHOOL_ID, UNIVERSITY_ID } from '../../domain/lifeModules/catalog'
import { getLifeModuleAffiliationContextByAffiliationId, type OrderAffiliationSelection } from '../../domain/lifeModules/affiliations'
import { openSubjectChoiceOptions, pendingAwardOptions, pendingAwardUnsupportedMessage, pendingOpenSubject, type PendingAwardOption } from '../../domain/lifeModules/awardOptions'
import { stage3SchoolEligibility } from '../../domain/lifeModules/stage3Schooling'
import { getFinalReviewBlockers, getModeledOpposedTraitConflicts } from '../../domain/lifeModules/finalReview'
import { POINT_BUY_TRAITS } from '../../domain/pointBuy/catalog'
import { lifeModuleGoalContributions, masterSkillFieldGoalStatus, setMasterSkillFieldGoal, SUPPORTED_MASTER_SKILL_FIELD_GOALS } from '../../domain/skillFields/goals'
import { MASTER_SKILL_FIELD_GOAL_CATEGORY_LABELS, type MasterSkillFieldGoalCategory } from '../../domain/skillFields/goalCatalog'
import { getSkillField, skillFieldCost, TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID } from '../../domain/skillFields/catalog'
import { applyStage0Affiliation, applyUniversalStage0, continueStage3Schooling, continueStage4Modules, continueToStage2, continueToStage3, continueToStage4, createLifeModuleCharacter, resolvePendingLifeModuleAward } from '../../engine/lifeModuleEngine'
import { allocateFinalReviewXp, applyLifeModuleOptimization, enterLifeModuleFinalReview, previewLifeModuleOptimization, purchaseAdditionalNegativeTraitXp, removeAdditionalNegativeTraitXp, removeFinalReviewAllocation, resolveLifeModuleOpposedTraits } from '../../engine/lifeModuleFinalReview'
import { addCatalogInventoryItem, addManualInventoryItem, enterFinalTouches, markReadyForEquipmentReview, removeInventoryItem, setEquipmentAccessProfile, setIssuedGearEnabled, updatePersonalDescription } from '../../engine/finalTouchesEngine'
import { downloadCharacter } from '../../persistence/browserFiles'
import { validateCharacter } from '../../validation/validateCharacter'
import { LifeModuleAuditDrawer, LifeModuleDashboard, LifeModuleReviewSummary, LifeModulesVersionBadge, LifeModuleStageHeading, LifeModuleStageStatus } from '../components/LifeModulesWizard'
import { controlStatus, controlStatusProps } from '../components/controlStatus'
import { genericPendingAwardsForPhase, lifeModuleStagePresentation, nonControlPendingAwards } from '../components/lifeModulesWizardModel'
import { Stage0WizardStep } from '../components/Stage0WizardStep'
import { lifeModulesThemeIdentity, previewStage0Affiliation } from '../components/stage0PreviewModel'
import { defaultStage3FieldIds, previewSupportedStageModule, stage3FieldSelectionStatus, type SupportedStageModuleId } from '../components/stageModulePreviewModel'
import { catalogAvailability, catalogAvailabilityLabel } from '../components/catalogAvailability'
import { shouldFocusLifeModuleStageHeading } from '../components/lifeModulesFocusBehavior'
import { emptyStageChoiceSlot, filterSiblingDestinationOptions, modeledOpenSubjectStageChoiceSlot, openSubjectStageChoiceSlot, previewStageModuleChoiceSlots, relatedStageChoiceSlotValues, slotValueComplete, stageChoicePoolProgress, stageChoicePoolProgressLabel, stageChoicePresentationPending, stageChoiceSlotCount, stageSlotContinueEnabled, stageSlotPendingAwards, type StageChoiceSlotValue, type StageChoiceSlotValues } from '../components/stageModuleChoiceSlotsModel'

interface LifeModulesScreenProps {
  onSave: (character: CharacterDefinition) => void
}

const STAGE_3_SCHOOL_IDS = [TECHNICAL_COLLEGE_ID, TRADE_SCHOOL_ID, UNIVERSITY_ID, SOLARIS_INTERNSHIP_ID, POLICE_ACADEMY_ID, INTELLIGENCE_OPERATIVE_TRAINING_ID, MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID, FAMILY_TRAINING_ID, OFFICER_TRAINING_SCHOOL_ID] as const
type Stage3SchoolId = (typeof STAGE_3_SCHOOL_IDS)[number]

interface ResolutionDraft {
  targetType: 'attribute' | 'trait' | 'skill'
  targetId: string
  parameter: string
  displayName: string
  xpAmount: number
  choiceOptionValue?: string
  subjectInput?: string
}

interface EquipmentDraft {
  name: string
  quantity: number
  costPerItemCBills: number
  ownership: EquipmentOwnership
  tech: EquipmentRatingCode
  availability: EquipmentRatingCode
  legality: EquipmentRatingCode
  affiliationCode: string
  notes: string
  location: string
  carriedNote: string
  issuerOrEmployer: string
}

const EMPTY_EQUIPMENT_DRAFT: EquipmentDraft = {
  name: '', quantity: 1, costPerItemCBills: 0, ownership: 'Owned', tech: 'A', availability: 'A', legality: 'A',
  affiliationCode: '', notes: '', location: '', carriedNote: '', issuerOrEmployer: '',
}
const EQUIPMENT_RATINGS: EquipmentRatingCode[] = ['A', 'B', 'C', 'D', 'E', 'F']

export function LifeModulesScreen({ onSave }: LifeModulesScreenProps) {
  const stageHeadingRef = useRef<HTMLHeadingElement>(null)
  const previousPhaseRef = useRef<string | undefined>(undefined)
  const [name, setName] = useState('')
  const [startingXp, setStartingXp] = useState(5000)
  const [masterSkillFieldGoalId, setMasterSkillFieldGoalId] = useState('')
  const [stage0AffiliationContext, setStage0AffiliationContext] = useState('')
  const [stage0SubAffiliation, setStage0SubAffiliation] = useState('no')
  const [birthAffiliationId, setBirthAffiliationId] = useState('')
  const [affiliationLanguage, setAffiliationLanguage] = useState('')
  const [secondaryLanguage, setSecondaryLanguage] = useState('')
  const [davionNaturalAptitude, setDavionNaturalAptitude] = useState('')
  const [davionArt, setDavionArt] = useState('')
  const [orderAffiliation, setOrderAffiliation] = useState<OrderAffiliationSelection>('no')
  const [orderNearestStateContext, setOrderNearestStateContext] = useState('')
  const [orderSecondaryLanguage, setOrderSecondaryLanguage] = useState('')
  const [orderTechnicianSubskill, setOrderTechnicianSubskill] = useState('')
  const [stageModulePreviewId, setStageModulePreviewId] = useState<SupportedStageModuleId | ''>('')
  const [stage3FieldIds, setStage3FieldIds] = useState<string[]>([TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID])
  const [stage3Homeworld, setStage3Homeworld] = useState('')
  const [stage3Residence, setStage3Residence] = useState('')
  const [stageChoiceSlotValues, setStageChoiceSlotValues] = useState<StageChoiceSlotValues>({})
  const [character, setCharacter] = useState<CharacterDefinition | null>(null)
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, ResolutionDraft>>({})
  const [finalAllocationTarget, setFinalAllocationTarget] = useState('attribute:STR')
  const [finalAllocationXp, setFinalAllocationXp] = useState(1)
  const [additionalTraitId, setAdditionalTraitId] = useState('trait.unattractive')
  const [additionalTraitTp, setAdditionalTraitTp] = useState(-1)
  const [equipmentDraft, setEquipmentDraft] = useState<EquipmentDraft>(EMPTY_EQUIPMENT_DRAFT)
  const [catalogSearch, setCatalogSearch] = useState('')
  const [catalogCategory, setCatalogCategory] = useState('all')
  const [catalogSourceStatus, setCatalogSourceStatus] = useState<EquipmentCatalogSourceStatus | 'all'>('all')
  const [catalogQuantity, setCatalogQuantity] = useState(1)
  const [catalogOwnership, setCatalogOwnership] = useState<EquipmentOwnership>('Owned')
  const [message, setMessage] = useState('')

  function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setStage3FieldIds([TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID])
    operate(() => setMasterSkillFieldGoal(createLifeModuleCharacter(name, startingXp), masterSkillFieldGoalId || null), 'Life Module draft created and saved locally.')
  }

  function operate(operation: () => CharacterDefinition, success: string, preserveStagePreview = false) {
    try {
      const next = operation()
      setCharacter(next)
      if (!preserveStagePreview) {
        setStageModulePreviewId('')
        setStageChoiceSlotValues({})
      }
      onSave(next)
      setMessage(success)
      return true
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Life Module operation failed.')
      return false
    }
  }

  function updateResolutionDraft(pending: PendingLifeModuleAward, change: Partial<ResolutionDraft>) {
    setResolutionDrafts((current) => ({ ...current, [pending.id]: { ...defaultResolutionDraft(pending), ...current[pending.id], ...change } }))
  }

  function resolve(pending: PendingLifeModuleAward) {
    if (!character) return
    const draft = { ...defaultResolutionDraft(pending), ...resolutionDrafts[pending.id] }
    const destination: ResolvedLifeModuleDestination = {
      type: draft.targetType,
      targetId: draft.targetId,
      displayName: draft.displayName || destinationDisplayName(draft),
      ...(draft.parameter.trim() ? { parameter: { kind: 'subskill', value: draft.parameter } } : {}),
    }
    operate(() => resolvePendingLifeModuleAward(character, pending.id, destination, pending.allocationMode === 'pool' ? draft.xpAmount : undefined), 'Existing pending award resolved and applied.', Boolean(stageModulePreviewId))
  }

  const state = character?.creation.lifeModules
  useEffect(() => {
    if (shouldFocusLifeModuleStageHeading(previousPhaseRef.current, state?.phase, Boolean(character))) stageHeadingRef.current?.focus()
    previousPhaseRef.current = state?.phase
  }, [character, state?.phase])
  const genericPendingAwards = state ? genericPendingAwardsForPhase(state.phase, state.pendingAwards) : []
  const stageExistingSlotAwards = stageModulePreviewId && character
    ? genericPendingAwards.filter((pending) => pendingAwardSupportsSlot(pending, character))
    : []
  const stageExistingFallbackAwards = genericPendingAwards.filter((pending) => !stageExistingSlotAwards.some((candidate) => candidate.id === pending.id))
  const stagePresentation = state ? lifeModuleStagePresentation(state.phase) : null
  const stage0Preview = useMemo(() => character && state?.phase === 'stage-0-affiliation'
    ? previewStage0Affiliation(character, stage0AffiliationContext, affiliationLanguage, secondaryLanguage, davionNaturalAptitude, davionArt, orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill, stage0SubAffiliation)
    : null, [character, state?.phase, stage0AffiliationContext, stage0SubAffiliation, affiliationLanguage, secondaryLanguage, davionNaturalAptitude, davionArt, orderAffiliation, orderNearestStateContext, orderSecondaryLanguage, orderTechnicianSubskill])
  const stage0PreviewSelections = state?.phase === 'stage-0-affiliation' ? [
    ...(stage0AffiliationContext ? ['Affiliation context selected'] : []),
    ...(stage0AffiliationContext ? [`Affiliation Sub: ${stage0SubAffiliation === 'no' ? 'No' : 'Selected'}`] : []),
    ...(affiliationLanguage ? [`Affiliation language: ${affiliationLanguage}`] : []),
    ...(secondaryLanguage ? [`Secondary language: ${secondaryLanguage}`] : []),
    ...(orderAffiliation !== 'no' ? [`Order affiliation: ${orderAffiliation === 'comstar' ? 'ComStar' : 'Word of Blake'}`] : []),
  ] : []
  const stage3PersonalDetail = stageModulePreviewId === SOLARIS_INTERNSHIP_ID ? stage3Residence : stage3Homeworld
  const stageModuleBasePreview = useMemo(() => character
    ? previewSupportedStageModule(character, stageModulePreviewId, stage3FieldIds, stage3PersonalDetail)
    : null, [character, stageModulePreviewId, stage3FieldIds, stage3PersonalDetail])
  const stageModulePreview = useMemo(() => character
    ? previewStageModuleChoiceSlots(character, stageModulePreviewId, stageChoiceSlotValues, stage3FieldIds, stage3PersonalDetail)
    : null, [character, stageModulePreviewId, stageChoiceSlotValues, stage3FieldIds, stage3PersonalDetail])
  const activePreview = stage0Preview ?? stageModulePreview?.character ?? null
  const activePreviewSelections = stage0PreviewSelections.length > 0
    ? stage0PreviewSelections
    : stageModulePreviewId ? [`Selected module: ${stageModulePreview?.character.lifeModuleHistory.at(-1)?.displayName ?? stageModulePreviewId}`] : []
  const previewState = activePreview?.creation.lifeModules
  const visiblePendingAwards = stageModulePreview ? stageSlotPendingAwards(stageModulePreview) : genericPendingAwards
  const controlMappedPendingIds = new Set(character ? visiblePendingAwards.filter((pending) => pendingAwardSupportsSlot(pending, stageModulePreview?.character ?? character)).map((pending) => pending.id) : [])
  const sectionPendingAwards = nonControlPendingAwards(visiblePendingAwards, controlMappedPendingIds)
  const validation = character ? validateCharacter(character) : null
  const optimizationPreview = character && state?.finalReview ? previewLifeModuleOptimization(character) : []
  const goalStatus = character ? masterSkillFieldGoalStatus(character) : null
  const finalReviewBlockers = character && state?.finalReview ? getFinalReviewBlockers(character) : []
  const opposedTraitConflicts = character && state?.finalReview ? getModeledOpposedTraitConflicts(character) : []
  const catalogItems = filterEquipmentCatalog({ search: catalogSearch, category: catalogCategory, sourceStatus: catalogSourceStatus })
  const accessProfile = character?.creation.finalTouches?.equipmentAccessProfile ?? { enabled: false, affiliationCategory: 'inner-sphere' as const, nativeAffiliationCode: '' }
  const effectiveOwnedLimits = character?.creation.finalTouches ? adjustedOwnedEquipmentLimits(character.creation.finalTouches.equippedTpUsed, accessProfile.affiliationCategory) : null
  const stageModulePendingAwards = stageModuleBasePreview?.creation.lifeModules?.pendingAwards.filter((entry) => entry.moduleId === stageModulePreviewId) ?? []
  const completedStage3ModuleIds = character?.lifeModuleHistory.filter((entry) => entry.stage === 3).map((entry) => entry.moduleId) ?? []
  const completedStage3FieldCategories = state?.selectedSkillFields.map((grant) => grant.category) ?? []
  const additionalStage3Available = STAGE_3_SCHOOL_IDS.some((moduleId) => stage3SchoolEligibility(completedStage3ModuleIds, moduleId, { completedFieldCategories: completedStage3FieldCategories }).eligible)
  const activeBirthContext = state?.phase === 'stage-0-affiliation' ? stage0AffiliationContext : state?.stage0AffiliationContext ?? stage0AffiliationContext
  const activeOrderAffiliation: OrderAffiliationSelection = state?.phase === 'stage-0-affiliation' ? orderAffiliation : state?.orderAffiliation ?? 'no'
  const themeIdentity = lifeModulesThemeIdentity(activeBirthContext, activeOrderAffiliation)

  function selectStageModule(moduleId: SupportedStageModuleId) {
    if (STAGE_3_SCHOOL_IDS.includes(moduleId as Stage3SchoolId)) {
      setStage3FieldIds(defaultStage3FieldIds(moduleId as Stage3SchoolId))
    }
    if (moduleId === FAMILY_TRAINING_ID) setStage3Homeworld(character?.personalDescription?.homeworld ?? '')
    if (moduleId === SOLARIS_INTERNSHIP_ID) setStage3Residence(character?.personalDescription?.residence ?? '')
    setStageModulePreviewId(moduleId)
    setStageChoiceSlotValues({})
  }

  function updateStageChoiceSlot(pending: PendingLifeModuleAward, index: number, change: Partial<StageChoiceSlotValue>) {
    setStageChoiceSlotValues((current) => {
      const values = [...(current[pending.awardId] ?? [])]
      values[index] = { ...emptyStageChoiceSlot(pending), ...values[index], ...change }
      return { ...current, [pending.awardId]: values }
    })
  }

  function addPoolSlot(pending: PendingLifeModuleAward) {
    setStageChoiceSlotValues((current) => ({
      ...current,
      [pending.awardId]: [...(current[pending.awardId] ?? []), emptyStageChoiceSlot(pending)],
    }))
  }

  function commitStageModuleChoices(success: string) {
    if (!stageModulePreview || !stageSlotContinueEnabled(stageModulePreview)) {
      setMessage(stageModulePreview?.error ?? 'Complete every required choice slot before continuing.')
      return
    }
    operate(() => stageModulePreview.character, success)
  }

  function renderStageChoiceSlots(stageName: string, success: string) {
    const moduleName = stageModuleBasePreview?.lifeModuleHistory.at(-1)?.displayName ?? stageModulePreviewId
    return <section className="stage-choice-slots" aria-label={`Pending choices from ${moduleName}`} aria-describedby="stage-choice-help">
      {stageExistingSlotAwards.length > 0 && <section className="existing-pending-choices" aria-label="Existing pending choices">
        <h3>Existing pending choices</h3>
        <p>Fill these earlier required slots as well as the selected module’s slots. Nothing is committed until Continue.</p>
        {stageExistingSlotAwards.map((pending) => renderStageChoiceAward(pending, stageExistingSlotAwards, character!))}
      </section>}
      {stageExistingFallbackAwards.length > 0 && <section className="existing-pending-choices" aria-label="Fallback pending choices">
        <h3>Fallback pending choices</h3>
        <p>These legacy or unsupported awards cannot safely join the slot transaction and retain the generic resolver.</p>
        {renderPendingAwardRows(stageExistingFallbackAwards)}
      </section>}
      <h3>Pending choices from {moduleName}</h3>
      <p id="stage-choice-help">Fill every slot below. These selections and the module remain uncommitted until Continue.</p>
      {stageModulePendingAwards.map((pending) => renderStageChoiceAward(pending, stageModulePendingAwards, stageModulePreview?.character ?? stageModuleBasePreview ?? character!))}
      {stageModulePreview?.error && <p className="notice">{stageModulePreview.error}</p>}
      <div className="life-action">
        <p className="notice">Previewing this {stageName} module and filled choice slots. Continue commits them together.</p>
        <button className="button" type="button" aria-label={`Continue with ${moduleName}`} aria-describedby="stage-choice-continue-help" disabled={!stageSlotContinueEnabled(stageModulePreview)} onClick={() => commitStageModuleChoices(success)}>Continue</button>
        <span id="stage-choice-continue-help" className="sr-only">Continue commits the selected module and all completed choice slots.</span>
      </div>
    </section>
  }

  function renderStage3School(schoolId: Stage3SchoolId) {
    const school = getLifeModule(schoolId)
    const schoolEligibility = stage3SchoolEligibility(completedStage3ModuleIds, schoolId, { completedFieldCategories: completedStage3FieldCategories })
    const availabilityId = `${schoolId}-availability`
    const offers = school.skillFieldSelection!.offers
    const isSelected = stageModulePreviewId === schoolId
    const defaultFieldIds = defaultStage3FieldIds(schoolId)
    const candidateFieldIds = isSelected ? stage3FieldIds : defaultFieldIds
    const selectedOffers = offers.filter((offer) => candidateFieldIds.includes(offer.fieldId))
    const basicOffers = offers.filter((offer) => offer.category === 'basic')
    const advancedOffers = offers.filter((offer) => offer.category === 'advanced')
    const specialOffers = offers.filter((offer) => offer.category === 'special')
    const selectedBasicId = candidateFieldIds.find((id) => basicOffers.some((offer) => offer.fieldId === id)) ?? ''
    const selectedAdvancedIds = candidateFieldIds.filter((id) => advancedOffers.some((offer) => offer.fieldId === id))
    const selectedSpecialId = candidateFieldIds.find((id) => specialOffers.some((offer) => offer.fieldId === id)) ?? ''
    const advancedCount = selectedOffers.filter((entry) => entry.category === 'advanced').length
    const selectedFieldCount = selectedOffers.length
    const years = selectedOffers.reduce((total, offer) => total + offer.chronologyYears, 0)
    const cost = selectedOffers.reduce((total, offer) => total + skillFieldCost(getSkillField(offer.fieldId), offer.costXpPerSkill), school.costXp)
    return <article key={schoolId} className={isSelected ? 'preview-selected' : ''} aria-disabled={!schoolEligibility.eligible}>
      <h3>{school.displayName}</h3>
      <p>{school.stage3School?.classification === 'secondary'
        ? `${school.costXp} XP base cost · includes the required Officer Field. Each of its five Skills receives +30 XP at a cost of 24 XP.`
        : `${school.costXp} XP base cost · choose exactly one Basic Field, at least one Advanced Field, and no more than three Fields total. Special Fields require an Advanced Field. Each Field Skill receives +30 XP at a cost of 24 XP.`}</p>
      {school.conditionalPriorModuleAwards && <p><strong>Conditional entry adjustment:</strong> {school.conditionalPriorModuleAwards.description}</p>}
      {isSelected && <section className="field-selector-group" aria-label="Stage 3 Field selectors">
        <label className="field-selector-row" htmlFor={`${schoolId}-basic`}><strong>Basic Field</strong>
          <select id={`${schoolId}-basic`} value={selectedBasicId} onChange={(event) => {
            const next = event.target.value
            setStage3FieldIds((current) => [...(next ? [next] : []), ...current.filter((id) => !basicOffers.some((offer) => offer.fieldId === id))])
            setStageChoiceSlotValues({})
          }}>
            <option value="">Choose a Basic Field…</option>
            {basicOffers.map((offer) => {
              const field = getSkillField(offer.fieldId)
              const availability = stage3FieldSelectionStatus(character!, schoolId, field.id, candidateFieldIds, stage3PersonalDetail)
              return <option key={field.id} value={field.id} disabled={availability.state === 'unavailable'}>{field.displayName}</option>
            })}
          </select>
        </label>
        {advancedOffers.length > 0 && <div className="field-selector-row"><strong>Advanced Fields</strong>
          {Array.from({ length: Math.min(2, advancedOffers.length, Math.max(1, selectedAdvancedIds.length + 1)) }, (_, index) => {
            const selectedId = selectedAdvancedIds[index] ?? ''
            return <select key={`${schoolId}-advanced-${index}`} aria-label={`Advanced Field ${index + 1}`} value={selectedId} onChange={(event) => {
              const next = event.target.value
              setStage3FieldIds((current) => {
                const selected = current.filter((id) => advancedOffers.some((offer) => offer.fieldId === id))
                const replacement = [...selected]
                if (next) replacement[index] = next
                else replacement.splice(index, 1)
                const unique = replacement.filter((id, position) => id && replacement.indexOf(id) === position)
                return [...current.filter((id) => !advancedOffers.some((offer) => offer.fieldId === id)), ...unique]
              })
              setStageChoiceSlotValues({})
            }}>
              <option value="">{index === 0 ? 'Choose an Advanced Field…' : 'Add another Advanced Field…'}</option>
              {advancedOffers.map((offer) => {
                const field = getSkillField(offer.fieldId)
                const availability = stage3FieldSelectionStatus(character!, schoolId, field.id, candidateFieldIds, stage3PersonalDetail)
                const alreadySelected = selectedAdvancedIds.includes(field.id) && field.id !== selectedId
                const atMaximum = selectedFieldCount >= 3 && !selectedId
                return <option key={field.id} value={field.id} disabled={alreadySelected || atMaximum || availability.state === 'unavailable'}>{field.displayName}</option>
              })}
            </select>
          })}
        </div>}
        {specialOffers.length > 0 && <label className="field-selector-row" htmlFor={`${schoolId}-special`}><strong>Special Field</strong>
          <select id={`${schoolId}-special`} value={selectedSpecialId} onChange={(event) => {
            const next = event.target.value
            setStage3FieldIds((current) => [...current.filter((id) => !specialOffers.some((offer) => offer.fieldId === id)), ...(next ? [next] : [])])
            setStageChoiceSlotValues({})
          }}>
            <option value="">{advancedCount > 0 ? 'Choose a Special Field…' : 'Requires an Advanced Field…'}</option>
            {specialOffers.map((offer) => {
              const field = getSkillField(offer.fieldId)
              const availability = stage3FieldSelectionStatus(character!, schoolId, field.id, candidateFieldIds, stage3PersonalDetail)
              return <option key={field.id} value={field.id} disabled={selectedFieldCount >= 3 && field.id !== selectedSpecialId || advancedCount === 0 || availability.state === 'unavailable'}>{field.displayName}</option>
            })}
          </select>
        </label>}
        <ul className="selected-field-details" aria-label="Selected Field details">
          {selectedOffers.map((offer) => {
            const field = getSkillField(offer.fieldId)
            const availability = stage3FieldSelectionStatus(character!, schoolId, field.id, candidateFieldIds, stage3PersonalDetail)
            const status = availability.state === 'available' ? 'Available' : availability.state === 'unavailable' ? `Unavailable: ${availability.reasons.join('; ')}` : `Available · final prerequisites outstanding: ${availability.reasons.join('; ')}`
            return <li key={field.id}><strong>{field.displayName}</strong> · {offer.category} · {skillFieldCost(field, offer.costXpPerSkill)} XP · +{offer.chronologyYears} year{offer.chronologyYears === 1 ? '' : 's'} · {status}</li>
          })}
        </ul>
      </section>}
      {isSelected && <p><strong>Total: {cost} XP · +{years} years · expected age {(currentAge(character!) ?? 16) + years}</strong></p>}
      {schoolId === FAMILY_TRAINING_ID && isSelected && <label htmlFor="family-training-homeworld">Homeworld
        <input id="family-training-homeworld" value={stage3Homeworld} onChange={(event) => { setStage3Homeworld(event.target.value); setStageChoiceSlotValues({}) }} placeholder="Named planet, e.g. Sian" maxLength={100} />
        <span>Required to resolve Interest/Homeworld History. This value and the school remain unsaved until Continue.</span>
      </label>}
      {schoolId === SOLARIS_INTERNSHIP_ID && isSelected && <label htmlFor="solaris-residence">Current residence
        <input id="solaris-residence" value={stage3Residence} onChange={(event) => { setStage3Residence(event.target.value); setStageChoiceSlotValues({}) }} placeholder="Solaris VII" maxLength={100} />
        <span>The source requires actual Solaris VII residency. Residence is distinct from homeworld and affiliation, and remains unsaved until Continue.</span>
      </label>}
      {school.skillFieldSelection!.referenceOnlyOffers && <details><summary>Source-offered reference-only Fields</summary><ul>{school.skillFieldSelection!.referenceOnlyOffers!.map((offer) => <li key={`${offer.category}/${offer.displayName}`}><strong>{offer.displayName}</strong> ({offer.category}, +{offer.chronologyYears} year{offer.chronologyYears === 1 ? '' : 's'}): {offer.reason}</li>)}</ul></details>}
      {!schoolEligibility.eligible && <p className="notice" id={availabilityId}>{schoolEligibility.reason}</p>}
    </article>
  }

  function renderStageChoiceAward(pending: PendingLifeModuleAward, siblingAwards: PendingLifeModuleAward[], optionCharacter: CharacterDefinition) {
    const presentationPending = stageChoicePresentationPending(pending)
    const values = stageChoiceSlotValues[pending.awardId] ?? []
    const count = stageChoiceSlotCount(pending, stageChoiceSlotValues)
    const poolProgress = pending.allocationMode === 'pool' ? stageChoicePoolProgress(pending, values) : null
    return <div className="stage-choice-award" key={pending.id}>
          <p className="stage-choice-audit" aria-live="polite"><strong>Source award:</strong> {pending.description} · {poolProgress ? stageChoicePoolProgressLabel(poolProgress) : pending.kind === 'related-skill-prerequisite' ? 'Prerequisite selection · 0 XP' : `${count} separate slot${count === 1 ? '' : 's'} · ${signed(pending.xpPerGrant)} XP each`}</p>
          {Array.from({ length: count }, (_, index) => {
            const value = { ...emptyStageChoiceSlot(presentationPending), ...values[index] }
            const optionPending = presentationPending.kind === 'flexible-xp' && value.targetType
              ? { ...presentationPending, allowedTargetTypes: [value.targetType] }
              : presentationPending
            const unfilteredOptions = pending.kind === 'flexible-xp' && !value.targetType ? [] : pendingAwardOptions(optionPending, optionCharacter)
            const relatedSiblingValues = relatedStageChoiceSlotValues(pending, siblingAwards, stageChoiceSlotValues)
            const options = filterSiblingDestinationOptions(unfilteredOptions, values, index, relatedSiblingValues)
            const openSubject = pendingOpenSubject(pending)
            const openSubjectOptions = openSubject ? filterSiblingDestinationOptions(openSubjectChoiceOptions(pending, optionCharacter), values, index, relatedSiblingValues) : []
            const openSubjectOtherSelected = Boolean(openSubject && value.choiceOptionValue === `${openSubject.skillId}/__open__`)
            const openSubjectResult = openSubjectOtherSelected ? openSubjectStageChoiceSlot(pending, value.subjectInput ?? '') : null
            const modeledOpenOption = pending.kind === 'modeled-skill-choice' ? unfilteredOptions.find((option) => option.value === value.choiceOptionValue && option.inputMode === 'open-subject') : undefined
            const modeledOpenResult = modeledOpenOption ? modeledOpenSubjectStageChoiceSlot(pending, modeledOpenOption.targetId, modeledOpenOption.value, value.subjectInput ?? '') : null
            const unsupported = value.targetType ? pendingAwardUnsupportedMessage(optionPending, options) : null
            const slotLabel = stageChoiceSlotLabel(pending, index)
            const slotId = `${pending.id.replace(/[^a-zA-Z0-9_-]/g, '-')}-${index}`
            const complete = slotValueComplete(value)
            const slotHelp = pending.kind === 'related-skill-prerequisite' ? 'Choose an already possessed concrete Skill. The relationship remains subject to GM approval and grants no XP.' : pending.allocationMode === 'pool' ? 'Choose a legal destination and XP amount.' : `${signed(pending.xpPerGrant)} XP`
            return <div className="stage-choice-slot" key={`${pending.id}/${index}`}>
              <div className="stage-choice-slot-header">
                <div className="stage-choice-slot-title">
                  <strong id={`${slotId}-label`}>{slotLabel}</strong>
                  <span id={`${slotId}-help`}> · {slotHelp}</span>
                </div>
                {!complete && <span className="slot-pending">Pending</span>}
              </div>
              <div className="stage-choice-slot-controls">
              {presentationPending.kind === 'flexible-xp' && presentationPending.allowedTargetTypes.length > 1 && <label htmlFor={`${slotId}-type`}>Target type
                <select id={`${slotId}-type`} {...controlStatusProps(controlStatus({ required: true, resolved: Boolean(value.targetType) }), `${slotId}-label ${slotId}-help`)} value={value.targetType} onChange={(event) => updateStageChoiceSlot(pending, index, { targetType: event.target.value as StageChoiceSlotValue['targetType'], targetId: '', parameter: '', displayName: '' })}>
                  <option value="">Choose a target type…</option>
                  {presentationPending.allowedTargetTypes.map((type) => <option key={type} value={type}>{type}</option>)}
                </select>
              </label>}
              {pending.allocationMode === 'pool' && <label htmlFor={`${slotId}-xp`}>XP
                <input id={`${slotId}-xp`} type="number" min="1" max={pending.remainingXp} step="1" {...controlStatusProps(controlStatus({ required: true, resolved: value.xpAmount >= 1 && value.xpAmount <= (pending.remainingXp ?? 0), invalid: value.xpAmount < 1 || value.xpAmount > (pending.remainingXp ?? 0) }), `${slotId}-label ${slotId}-help`)} value={value.xpAmount} onChange={(event) => updateStageChoiceSlot(pending, index, { xpAmount: Number(event.target.value) })} />
              </label>}
              {openSubject && <label htmlFor={`${slotId}-subject-choice`}>{openSubject.parentLabel}
                <select id={`${slotId}-subject-choice`} {...controlStatusProps(controlStatus({ required: true, resolved: Boolean(optionValue(value)) }), `${slotId}-label ${slotId}-help`)} value={optionValue(value)} onChange={(event) => {
                  const option = openSubjectOptions.find((candidate) => candidate.value === event.target.value)
                  if (option?.inputMode === 'open-subject') updateStageChoiceSlot(pending, index, { ...emptyStageChoiceSlot(presentationPending), choiceOptionValue: option.value, subjectInput: '' })
                  else if (option) updateStageChoiceSlot(pending, index, { ...optionDraft(option, value.xpAmount), choiceOptionValue: undefined, subjectInput: undefined })
                  else updateStageChoiceSlot(pending, index, { ...emptyStageChoiceSlot(presentationPending), choiceOptionValue: undefined, subjectInput: undefined })
                }}>
                  <option value="">Choose a subject…</option>
                  {openSubjectOptions.map((option) => <option key={option.value} value={option.value}>{option.inputMode === 'open-subject' ? 'Other…' : option.parameter?.value ?? option.displayName}</option>)}
                </select>
              </label>}
              {openSubjectOtherSelected && <label htmlFor={`${slotId}-subject`}>Custom {openSubject!.parentLabel} subject
                <input id={`${slotId}-subject`} type="text" value={value.subjectInput ?? ''} maxLength={60} {...controlStatusProps(controlStatus({ required: true, resolved: !openSubjectResult?.error, invalid: Boolean((value.subjectInput ?? '').trim() && openSubjectResult?.error) }), `${slotId}-label ${slotId}-help ${slotId}-subject-help${openSubjectResult?.error ? ` ${slotId}-subject-error` : ''}`)} onChange={(event) => {
                  const result = openSubjectStageChoiceSlot(pending, event.target.value)
                  updateStageChoiceSlot(pending, index, { ...result.value, choiceOptionValue: `${openSubject!.skillId}/__open__` })
                }} />
                <span id={`${slotId}-subject-help`}>{openSubject!.description} Examples are illustrative, not a closed list.</span>
              </label>}
              {openSubjectResult?.error && <p id={`${slotId}-subject-error`} className="notice" role="alert">{openSubjectResult.error}</p>}
              {modeledOpenOption && <label htmlFor={`${slotId}-modeled-subject`}>{modeledOpenOption.displayName.replace('/Other…', '')} subject
                <input id={`${slotId}-modeled-subject`} type="text" value={value.subjectInput ?? ''} maxLength={60} {...controlStatusProps(controlStatus({ required: true, resolved: !modeledOpenResult?.error, invalid: Boolean((value.subjectInput ?? '').trim() && modeledOpenResult?.error) }), `${slotId}-label ${slotId}-help ${slotId}-modeled-subject-help${modeledOpenResult?.error ? ` ${slotId}-modeled-subject-error` : ''}`)} onChange={(event) => updateStageChoiceSlot(pending, index, modeledOpenSubjectStageChoiceSlot(pending, modeledOpenOption.targetId, modeledOpenOption.value, event.target.value).value)} />
                <span id={`${slotId}-modeled-subject-help`}>{modeledOpenOption.description} Examples are illustrative, not a closed list.</span>
              </label>}
              {modeledOpenResult?.error && <p id={`${slotId}-modeled-subject-error`} className="notice" role="alert">{modeledOpenResult.error}</p>}
              {!openSubject && options.length > 0 && <label htmlFor={`${slotId}-destination`}>{pending.kind === 'related-skill-prerequisite' ? 'Related existing Skill' : pending.skillFieldChoice ? 'Field Skill subskill' : pending.kind === 'language-choice' ? 'Language' : value.targetType === 'trait' ? 'Trait' : value.targetType === 'attribute' ? 'Attribute' : 'Skill'}
                <select id={`${slotId}-destination`} {...controlStatusProps(controlStatus({ required: true, resolved: Boolean(optionValue(value)) }), `${slotId}-label ${slotId}-help`)} value={optionValue(value)} onChange={(event) => {
                  const option = options.find((candidate) => candidate.value === event.target.value)
                  if (option?.inputMode === 'open-subject') updateStageChoiceSlot(pending, index, { ...emptyStageChoiceSlot(presentationPending), choiceOptionValue: option.value, subjectInput: '' })
                  else if (option) updateStageChoiceSlot(pending, index, { ...optionDraft(option, value.xpAmount), choiceOptionValue: undefined, subjectInput: undefined })
                  else updateStageChoiceSlot(pending, index, { ...emptyStageChoiceSlot(presentationPending), choiceOptionValue: undefined, subjectInput: undefined })
                }}>
                  <option value="">Choose a valid target…</option>
                  {options.map((option) => <option key={option.value} value={option.value}>{option.displayName}</option>)}
                </select>
              </label>}
                {unsupported && <p className="notice">{unsupported}</p>}
              </div>
            </div>
          })}
          {pending.allocationMode === 'pool' && <div className="row-actions">
            <button className="button secondary" type="button" disabled={values.length === 0 || !slotValueComplete(values.at(-1))} onClick={() => addPoolSlot(pending)}>Add allocation slot</button>
            {values.length > 1 && <button className="button secondary" type="button" onClick={() => setStageChoiceSlotValues((current) => ({ ...current, [pending.awardId]: current[pending.awardId].slice(0, -1) }))}>Remove last slot</button>}
          </div>}
        </div>
  }

  function renderPendingAwardRows(pendingAwards: PendingLifeModuleAward[]) {
    return <div className="pending-awards">{pendingAwards.map((entry) => {
      const draft = { ...defaultResolutionDraft(entry), ...resolutionDrafts[entry.id] }
      const optionEntry = entry.kind === 'flexible-xp' ? { ...entry, allowedTargetTypes: [draft.targetType] } : entry
      const options = pendingAwardOptions(optionEntry, character!)
      const openSubject = pendingOpenSubject(entry)
      const openSubjectOptions = openSubject ? openSubjectChoiceOptions(entry, character!) : []
      const openSubjectOtherSelected = Boolean(openSubject && draft.choiceOptionValue === `${openSubject.skillId}/__open__`)
      const openSubjectResult = openSubjectOtherSelected ? openSubjectStageChoiceSlot(entry, draft.subjectInput ?? '') : null
      const unsupported = pendingAwardUnsupportedMessage(optionEntry, options)
      const selectedOption = optionValue(draft)
      return (
        <article key={entry.id} className={entry.kind === 'flexible-xp' ? 'flexible-award' : ''}>
          <div><strong>{entry.description}</strong><p>{entry.allocationMode === 'pool' ? `${entry.remainingXp} XP remaining` : `${entry.remainingGrants} grant${entry.remainingGrants === 1 ? '' : 's'} remaining · ${signed(entry.xpPerGrant)} XP each`}</p>{entry.kind === 'flexible-xp' && <span className="award-type-badge">Flexible XP</span>}</div>
          {entry.kind === 'flexible-xp' && (
            <><label>Target type
              <select {...controlStatusProps(controlStatus({ required: true, resolved: Boolean(draft.targetType) }))} value={draft.targetType} onChange={(event) => updateResolutionDraft(entry, { targetType: event.target.value as ResolutionDraft['targetType'], targetId: '', parameter: '', displayName: '' })}>
                {entry.allowedTargetTypes.map((type) => <option key={type}>{type}</option>)}
              </select>
            </label>{entry.allocationMode === 'pool' && <label>XP to allocate<input type="number" min="1" max={entry.remainingXp} step="1" {...controlStatusProps(controlStatus({ required: true, resolved: draft.xpAmount >= 1 && draft.xpAmount <= (entry.remainingXp ?? 0), invalid: draft.xpAmount < 1 || draft.xpAmount > (entry.remainingXp ?? 0) }))} value={draft.xpAmount} onChange={(event) => updateResolutionDraft(entry, { xpAmount: Number(event.target.value) })} /></label>}</>
          )}
          {openSubject && <label>{openSubject.parentLabel}
            <select {...controlStatusProps(controlStatus({ required: true, resolved: Boolean(selectedOption) }))} value={selectedOption} onChange={(event) => {
              const option = openSubjectOptions.find((candidate) => candidate.value === event.target.value)
              if (option?.inputMode === 'open-subject') updateResolutionDraft(entry, { targetType: 'skill', targetId: '', parameter: '', displayName: '', choiceOptionValue: option.value, subjectInput: '' })
              else if (option) updateResolutionDraft(entry, { ...optionDraft(option, draft.xpAmount), choiceOptionValue: undefined, subjectInput: undefined })
              else updateResolutionDraft(entry, { targetId: '', parameter: '', displayName: '', choiceOptionValue: undefined, subjectInput: undefined })
            }}>
              <option value="">Choose a subject…</option>
              {openSubjectOptions.map((option) => <option key={option.value} value={option.value}>{option.inputMode === 'open-subject' ? 'Other…' : option.parameter?.value ?? option.displayName}</option>)}
            </select>
          </label>}
          {openSubjectOtherSelected && <label>Custom {openSubject!.parentLabel} subject
            <input type="text" {...controlStatusProps(controlStatus({ required: true, resolved: !openSubjectResult?.error, invalid: Boolean((draft.subjectInput ?? '').trim() && openSubjectResult?.error) }))} value={draft.subjectInput ?? ''} maxLength={60} onChange={(event) => {
              const result = openSubjectStageChoiceSlot(entry, event.target.value)
              updateResolutionDraft(entry, { ...result.value, targetType: 'skill', choiceOptionValue: `${openSubject!.skillId}/__open__` })
            }} />
            <span>{openSubject!.description} Examples are illustrative, not a closed list.</span>
          </label>}
          {openSubjectResult?.error && <p className="notice" role="alert">{openSubjectResult.error}</p>}
          {!openSubject && options.length > 0 && <label>{entry.kind === 'language-choice' ? 'Language' : draft.targetType === 'trait' ? 'Trait' : draft.targetType === 'attribute' ? 'Attribute' : 'Skill'}
            <select {...controlStatusProps(controlStatus({ required: true, resolved: Boolean(selectedOption), invalid: Boolean(selectedOption && unsupported) }))} value={selectedOption} onChange={(event) => {
              const option = options.find((candidate) => candidate.value === event.target.value)
              if (option) updateResolutionDraft(entry, optionDraft(option, draft.xpAmount))
              else updateResolutionDraft(entry, { targetId: '', parameter: '', displayName: '' })
            }}>
              <option value="">Choose a valid target…</option>
              {options.map((option) => <option key={option.value} value={option.value}>{option.displayName}</option>)}
            </select>
          </label>}
          {unsupported && <p className="notice">{unsupported}</p>}
          <button className="button" type="button" disabled={!draft.targetId || Boolean(unsupported)} onClick={() => resolve(entry)}>{entry.allocationMode === 'pool' ? 'Allocate XP' : 'Apply one grant'}</button>
        </article>
      )
    })}</div>
  }

  function allocateFinalXp() {
    if (!character) return
    operate(() => allocateFinalReviewXp(character, finalReviewDestination(character, finalAllocationTarget), finalAllocationXp), 'Final-allocation XP applied.')
  }

  function purchaseAdditionalXp() {
    if (!character) return
    operate(() => purchaseAdditionalNegativeTraitXp(character, additionalTraitId, additionalTraitTp), 'Optional Additional XP proposed.')
  }

  function updateDescription(patch: Parameters<typeof updatePersonalDescription>[1]) {
    if (!character) return
    operate(() => updatePersonalDescription(character, patch), 'Final Touches description saved.')
  }

  function addEquipment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!character) return
    const added = operate(() => addManualInventoryItem(character, {
      name: equipmentDraft.name,
      quantity: equipmentDraft.quantity,
      costPerItemCBills: equipmentDraft.costPerItemCBills,
      ownership: equipmentDraft.ownership,
      rating: { tech: equipmentDraft.tech, availability: equipmentDraft.availability, legality: equipmentDraft.legality },
      affiliationCode: equipmentDraft.affiliationCode,
      notes: equipmentDraft.notes,
      location: equipmentDraft.location,
      carriedNote: equipmentDraft.carriedNote,
      issuerOrEmployer: equipmentDraft.issuerOrEmployer,
    }), 'Manual inventory item added.')
    if (added) setEquipmentDraft(EMPTY_EQUIPMENT_DRAFT)
  }

  function addCatalogItem(itemId: string) {
    if (!character) return
    operate(() => addCatalogInventoryItem(character, {
      catalogItemId: itemId,
      quantity: catalogQuantity,
      ownership: catalogOwnership,
    }), 'Catalog item added to inventory.')
  }

  function updateAccessProfile(patch: Partial<typeof accessProfile>) {
    if (!character) return
    operate(() => setEquipmentAccessProfile(character, { ...accessProfile, ...patch }), 'Equipment affiliation access profile updated.')
  }

  function goalGuidance(moduleId: string) {
    if (!character || !goalStatus) return null
    const contributions = lifeModuleGoalContributions(character, getLifeModule(moduleId))
    return contributions.length > 0 ? <ul className="goal-contributions" aria-label={`${goalStatus.displayName} goal contributions`}>{contributions.map((entry) => <li key={entry}>{entry}</li>)}</ul> : null
  }

  return (
    <main className={`creation-page life-modules-page ${themeIdentity.className}`.trim()} data-theme-identity={themeIdentity.dominantLabel || 'Default'}>
      <a className="back-link" href="#/">← Character Creator</a>
      <section className="hero compact">
        <LifeModulesVersionBadge />
        <h1>Life Modules</h1>
        {activeOrderAffiliation !== 'no' && <p className="life-theme-identity" aria-label={`Dominant affiliation theme: ${themeIdentity.dominantLabel}. Birth affiliation: ${themeIdentity.birthLabel || 'Not selected'}.`}><strong>{themeIdentity.dominantLabel}</strong><span>Order identity · dominant theme</span>{themeIdentity.birthLabel && <small>Birth affiliation · {themeIdentity.birthLabel}</small>}</p>}
        <p>Build through audited Core Life Modules including Agitator and ComStar/Word of Blake Service, complete final review, and use the 84-item audited equipment catalog with affiliation-adjusted access or manual fallback. Full catalog coverage and finalization remain deferred.</p>
      </section>

      {!character ? (
        <section className="draft-panel">
          <h2>Start a Life Modules draft</h2>
          <form onSubmit={start}>
            <label htmlFor="life-module-name">Character name</label>
            <input id="life-module-name" value={name} onChange={(event) => setName(event.target.value)} required />
            <label htmlFor="life-module-starting-xp">Starting XP</label>
            <input id="life-module-starting-xp" type="number" min="1" step="1" value={startingXp} onChange={(event) => setStartingXp(Number(event.target.value))} required />
            <label htmlFor="life-module-field-goal">Master Skill Field goal</label>
            <select id="life-module-field-goal" value={masterSkillFieldGoalId} onChange={(event) => setMasterSkillFieldGoalId(event.target.value)}>
              <option value="">No goal</option>
              {(Object.keys(MASTER_SKILL_FIELD_GOAL_CATEGORY_LABELS) as MasterSkillFieldGoalCategory[]).map((category) => <optgroup key={category} label={MASTER_SKILL_FIELD_GOAL_CATEGORY_LABELS[category]}>{SUPPORTED_MASTER_SKILL_FIELD_GOALS.filter((field) => field.category === category).map((field) => <option key={field.id} value={field.id}>{field.displayName}</option>)}</optgroup>)}
            </select>
            <button className="button" type="submit">Create Life Module draft</button>
          </form>
          <p className="scope-note">The Core default is 5,000 XP. The optional Field goal is guidance only: it grants no Field, awards, XP, or Stage 3 discount.</p>
        </section>
      ) : state ? (
        <>
          <LifeModuleDashboard
            character={character}
            previewCharacter={activePreview}
            previewSelections={activePreviewSelections}
            toolbar={<>
                <a className="button secondary" href="#/" title="Return without undoing applied Life Module choices">Return to character creator</a>
                <button className="button" type="button" onClick={() => { onSave(character); setMessage('Life Module draft saved locally.') }}>Save draft</button>
                <button className="button secondary" type="button" onClick={() => downloadCharacter(character)}>Export character JSON</button>
            </>}
          >

          <section className="life-stage-panel" aria-labelledby="life-stage-heading">
            <LifeModuleStageHeading phase={state.phase} headingRef={stageHeadingRef} />
            {(state.phase === 'stage-0-universal' || state.phase === 'stage-0-affiliation') && (
              <Stage0WizardStep
                phase={state.phase}
                affiliationContext={stage0AffiliationContext}
                subAffiliation={stage0SubAffiliation}
                birthAffiliationId={birthAffiliationId}
                affiliationLanguage={affiliationLanguage}
                secondaryLanguage={secondaryLanguage}
                davionNaturalAptitude={davionNaturalAptitude}
                davionArt={davionArt}
                orderAffiliation={orderAffiliation}
                orderNearestStateContext={orderNearestStateContext}
                orderSecondaryLanguage={orderSecondaryLanguage}
                orderTechnicianSubskill={orderTechnicianSubskill}
                onBirthAffiliationChange={(value) => { const context = getLifeModuleAffiliationContextByAffiliationId(value); setBirthAffiliationId(value); setStage0AffiliationContext(context?.id ?? ''); setStage0SubAffiliation('no'); setAffiliationLanguage(''); setSecondaryLanguage(''); setDavionNaturalAptitude(''); setDavionArt(''); setOrderNearestStateContext(''); setOrderSecondaryLanguage('') }}
                onContextChange={(value) => { setStage0AffiliationContext(value); setAffiliationLanguage(''); setSecondaryLanguage(''); setDavionNaturalAptitude(''); setDavionArt('') }}
                onSubAffiliationChange={(value) => { setStage0SubAffiliation(value); setDavionArt('') }}
                onLanguageChange={setAffiliationLanguage}
                onSecondaryLanguageChange={setSecondaryLanguage}
                onDavionNaturalAptitudeChange={setDavionNaturalAptitude}
                onDavionArtChange={setDavionArt}
                onOrderAffiliationChange={(value) => { setOrderAffiliation(value); setOrderNearestStateContext(''); setOrderSecondaryLanguage(''); setOrderTechnicianSubskill('') }}
                onOrderNearestStateChange={(value) => { setOrderNearestStateContext(value); setOrderSecondaryLanguage('') }}
                onOrderSecondaryLanguageChange={setOrderSecondaryLanguage}
                onOrderTechnicianSubskillChange={setOrderTechnicianSubskill}
                onApplyUniversal={() => operate(() => applyUniversalStage0(character, stage0AffiliationContext, affiliationLanguage), 'Universal Stage 0 package applied with explicit affiliation context.')}
                onApplyAffiliation={() => operate(() => applyStage0Affiliation(character, stage0AffiliationContext, affiliationLanguage, secondaryLanguage, davionNaturalAptitude ? davionNaturalAptitude as 'Protocol' | 'Strategy' : undefined, davionArt || undefined, orderAffiliation, orderNearestStateContext || undefined, orderSecondaryLanguage || undefined, orderTechnicianSubskill || undefined, stage0SubAffiliation), 'Stage 0 birth, optional sub-affiliation, and optional order affiliation packages applied with explicit choices.')}
              />
            )}
            {state.phase === 'stage-1-selection' && (
              <><label className="catalog-selector" htmlFor="stage1-module">Early Childhood module
                <select id="stage1-module" value={stageModulePreviewId.startsWith('stage1.') ? stageModulePreviewId : ''} onChange={(event) => event.target.value && selectStageModule(event.target.value as SupportedStageModuleId)}>
                  <option value="">Choose an Early Childhood module…</option>
                  {[BLUE_COLLAR_ID, BACK_WOODS_ID].map((moduleId) => <option key={moduleId} value={moduleId}>{getLifeModule(moduleId).displayName} · Available</option>)}
                </select>
              </label>{stageModulePreviewId.startsWith('stage1.') && <section className="selected-module-detail"><h3>{getLifeModule(stageModulePreviewId).displayName}</h3><p>{getLifeModule(stageModulePreviewId).costXp} XP · selected module preview. Pending choices and source details appear below.</p>{goalGuidance(stageModulePreviewId)}{renderStageChoiceSlots('Early Childhood', 'Stage 1 module and choices committed.')}</section>}</>)}
            {state.phase === 'stage-1-resolution' && <p className="notice">Stage 1 is selected. Resolve every source-bound choice and flexible grant below before reaching an Alpha partial stop.</p>}
            {state.phase === 'stage-1-prerequisite-review' && <p className="notice">All awards are resolved, but one or more module prerequisites remain outstanding for eventual final validation.</p>}
            {state.phase === 'alpha-partial-stop' && <div className="life-action"><p className="notice">Stage 0 and Stage 1 are complete. This is a valid Alpha partial stop—not a finalized Beta 1 character.</p><button className="button" type="button" onClick={() => operate(() => continueToStage2(character), 'Stage 2 continuation opened.')}>Continue to Stage 2</button></div>}
            {state.phase === 'stage-2-selection' && (
              <><label className="catalog-selector" htmlFor="stage2-module">Late Childhood module
                <select id="stage2-module" value={stageModulePreviewId.startsWith('stage2.') ? stageModulePreviewId : ''} onChange={(event) => event.target.value && selectStageModule(event.target.value as SupportedStageModuleId)}>
                  <option value="">Choose a Late Childhood module…</option>
                  {[STAGE_2_BACK_WOODS_ID, STAGE_2_HIGH_SCHOOL_ID].map((moduleId) => <option key={moduleId} value={moduleId}>{getLifeModule(moduleId).displayName} · Available</option>)}
                </select>
              </label>{stageModulePreviewId.startsWith('stage2.') && <section className="selected-module-detail"><h3>{getLifeModule(stageModulePreviewId).displayName}</h3><p>{getLifeModule(stageModulePreviewId).costXp} XP · selected module preview. Flexible XP limits remain enforced by the existing slot engine.</p>{goalGuidance(stageModulePreviewId)}{renderStageChoiceSlots('Late Childhood', 'Stage 2 module and choices committed.')}</section>}</>)}
            {state.phase === 'stage-2-resolution' && <p className="notice">Stage 2 is selected. Resolve all Stage 2 source-bound choices and flexible XP below.</p>}
            {state.phase === 'stage-2-prerequisite-review' && <p className="notice">All Stage 2 awards are resolved, but one or more prerequisites remain outstanding for eventual final validation.</p>}
            {state.phase === 'alpha-stage-2-stop' && <div className="life-action"><p className="notice">Stage 0 through Stage 2 are complete. This is a valid Alpha partial stop—not a finalized Beta 1 character.</p><button className="button" type="button" onClick={() => operate(() => continueToStage3(character), 'Stage 3 continuation opened.')}>Continue to Stage 3</button></div>}
            {state.phase === 'stage-3-selection' && (
              <><label className="catalog-selector" htmlFor="stage3-school">Higher Education school
                <select id="stage3-school" value={STAGE_3_SCHOOL_IDS.includes(stageModulePreviewId as Stage3SchoolId) ? stageModulePreviewId : ''} onChange={(event) => event.target.value && selectStageModule(event.target.value as SupportedStageModuleId)}>
                  <option value="">Choose a Higher Education school…</option>
                  {STAGE_3_SCHOOL_IDS.map((schoolId) => { const eligibility = stage3SchoolEligibility(completedStage3ModuleIds, schoolId, { completedFieldCategories: completedStage3FieldCategories }); return <option key={schoolId} value={schoolId} disabled={!eligibility.eligible}>{getLifeModule(schoolId).displayName} · {eligibility.eligible ? 'Available' : `Unavailable · ${eligibility.reason}`}</option> })}
                </select>
                <span>School selection is dropdown-first; the selected school’s specialized Basic/Advanced/Special Field workflow remains below.</span>
              </label>{STAGE_3_SCHOOL_IDS.includes(stageModulePreviewId as Stage3SchoolId) && <section className="selected-module-detail">{renderStage3School(stageModulePreviewId as Stage3SchoolId)}{renderStageChoiceSlots('Higher Education', 'Stage 3 school, Fields, and choices committed.')}</section>}</>
            )}
            {state.phase === 'stage-3-resolution' && <p className="notice">A Stage 3 school is selected. Resolve all source-bound choices and flexible XP below.</p>}
            {state.phase === 'stage-3-prerequisite-review' && <p className="notice">All Stage 3 awards are resolved, but one or more Skill Field prerequisites remain outstanding for eventual final validation.</p>}
            {state.phase === 'alpha-stage-3-stop' && <div className="life-action"><p className="notice">The selected Stage 3 schooling is complete. You may continue to Stage 4 or choose another implemented school from an unused general family.</p>{additionalStage3Available && <button className="button secondary" type="button" onClick={() => operate(() => continueStage3Schooling(character), 'Additional Stage 3 schooling opened.')}>Choose another Stage 3 school</button>}<button className="button" type="button" onClick={() => operate(() => continueToStage4(character), 'Stage 4 continuation opened.')}>Continue to Stage 4</button></div>}
            {state.phase === 'stage-4-selection' && (
              <><label className="catalog-selector" htmlFor="stage4-module">Real Life module
                <select id="stage4-module" value={stageModulePreviewId.startsWith('stage4.') ? stageModulePreviewId : ''} onChange={(event) => event.target.value && selectStageModule(event.target.value as SupportedStageModuleId)}>
                  <option value="">Choose a Real Life module…</option>
                  <option value={AGITATOR_ID}>{getLifeModule(AGITATOR_ID).displayName} · Available</option>
                  <option value={COMSTAR_WOB_SERVICE_ID} disabled={!state.orderAffiliation}>{getLifeModule(COMSTAR_WOB_SERVICE_ID).displayName} · {state.orderAffiliation ? 'Available' : catalogAvailabilityLabel(catalogAvailability('ineligible', 'Requires ComStar or Word of Blake'))}</option>
                </select>
                <span>Unavailable options remain visible during Public Alpha with their current eligibility reason.</span>
              </label>{(stageModulePreviewId === AGITATOR_ID || stageModulePreviewId === COMSTAR_WOB_SERVICE_ID) && <section className="selected-module-detail"><h3>{getLifeModule(stageModulePreviewId).displayName}</h3><p>{getLifeModule(stageModulePreviewId).costXp} XP · selected module preview · chronology and repetition remain governed by the existing engine.</p>{renderStageChoiceSlots('Real Life', 'Stage 4 module and choices committed.')}</section>}</>)}
            {state.phase === 'stage-4-resolution' && <p className="notice">Stage 4 is selected. Resolve every source-bound choice and flexible XP allocation below.</p>}
            {state.phase === 'stage-4-prerequisite-review' && <div className="life-action"><p className="notice">All Stage 4 awards are resolved, but one or more prerequisites remain outstanding. Enter final review to allocate XP and re-evaluate them.</p><button className="button" type="button" onClick={() => operate(() => enterLifeModuleFinalReview(character), 'Life Module final review opened with outstanding prerequisites.')}>Enter final review</button></div>}
            {state.phase === 'alpha-stage-4-stop' && <div className="life-action"><p className="notice">Stage 4 is complete at age {currentAge(character) ?? 'unknown'}. You may take another source-legal Stage 4 module or enter final review.</p><button className="button secondary" type="button" onClick={() => operate(() => continueStage4Modules(character), 'Another Stage 4 selection opened.')}>Choose another Stage 4 module</button><button className="button" type="button" onClick={() => operate(() => enterLifeModuleFinalReview(character), 'Life Module final review opened.')}>Enter final review</button></div>}
            {state.phase === 'alpha-final-review' && <><LifeModuleReviewSummary character={character} /><p className="notice">Final review is in progress. Resolve every blocker below before the character can be marked ready for Final Touches.</p></>}
            {state.phase === 'ready-for-final-touches' && !character.creation.finalTouches && <div className="life-action"><p className="notice">This draft passed final review and may enter the Alpha Final Touches/equipment foundation.</p><button className="button" type="button" onClick={() => operate(() => enterFinalTouches(character), 'Final Touches opened with Wealth-derived funds and Equipped-derived limits.')}>Enter Final Touches</button></div>}
            {state.phase === 'ready-for-final-touches' && character.creation.finalTouches && <p className="notice">Final Touches equipment state: {formatPhase(character.creation.finalTouches.equipmentReviewState)}. This is not a finalized or ready-for-play character.</p>}
            <LifeModuleStageStatus
              pendingAwards={sectionPendingAwards}
              emptyBlockerMessage={state.phase === 'stage-0-affiliation'
                ? 'No additional non-control blockers. Complete the marked required controls above.'
                : visiblePendingAwards.length > 0 && sectionPendingAwards.length === 0
                  ? 'No additional non-control blockers. Complete the marked required controls above.'
                  : undefined}
              showResolutionLink={!stageModulePreviewId || stageExistingFallbackAwards.length > 0}
              warnings={(previewState ?? state).prerequisiteIssues.filter((entry) => entry.status === 'outstanding').map((entry) => `${moduleName(activePreview ?? character, entry.moduleId)}: ${entry.description}`)}
            />
          </section>

          {!stageModulePreviewId && (state.phase !== 'stage-0-affiliation' || genericPendingAwards.length > 0) && <section className="life-stage-panel pending-resolution-panel" id="pending-awards">
            <p className="eyebrow">{stagePresentation?.stage} work</p>
            <h2>{stagePresentation?.title} · pending choices</h2>
            <p>These choices were created by the current module and must be resolved here before its blocking transition.</p>
            {genericPendingAwards.length === 0 ? <p>No unresolved award allocations. Follow the current-stage action above.</p> : renderPendingAwardRows(genericPendingAwards)}
          </section>}
          </LifeModuleDashboard>

          {character.creation.finalTouches && <section className="life-stage-panel">
            <p className="eyebrow">Final Touches</p>
            <h2>Personal description and equipment draft</h2>
            <div className="xp-dashboard" aria-label="Starting equipment currency">
              <div><span>Wealth used</span><strong>{signed(character.creation.finalTouches.wealthTpUsed)} TP</strong></div>
              <div><span>Starting C-bills</span><strong>{character.creation.finalTouches.startingCBillTotal.toLocaleString()}</strong></div>
              <div><span>Owned spending</span><strong>{character.creation.finalTouches.spentCBillTotal.toLocaleString()}</strong></div>
              <div><span>Remaining C-bills</span><strong>{character.creation.finalTouches.remainingCBillTotal.toLocaleString()}</strong></div>
            </div>
            <p><strong>Equipped {signed(character.creation.finalTouches.equippedTpUsed)} TP:</strong> base maximum {character.creation.finalTouches.maxTechRating}/{character.creation.finalTouches.maxAvailabilityRating}/{character.creation.finalTouches.maxLegalityRating}; affiliation-adjusted Owned maximum {effectiveOwnedLimits?.tech}/{effectiveOwnedLimits?.availability}/{effectiveOwnedLimits?.legality}.</p>

            <h3>Personal details</h3>
            <div className="form-grid">
              <label>Hair color<input value={character.personalDescription?.hairColor ?? ''} onChange={(event) => updateDescription({ hairColor: event.target.value })} /></label>
              <label>Eye color<input value={character.personalDescription?.eyeColor ?? ''} onChange={(event) => updateDescription({ eyeColor: event.target.value })} /></label>
              <label>Height (cm)<input type="number" min="1" value={character.personalDescription?.heightCm ?? ''} onChange={(event) => updateDescription({ heightCm: event.target.value ? Number(event.target.value) : undefined })} /></label>
              <label>Weight (kg)<input type="number" min="1" value={character.personalDescription?.weightKg ?? ''} onChange={(event) => updateDescription({ weightKg: event.target.value ? Number(event.target.value) : undefined })} /></label>
              <label>Homeworld<input value={character.personalDescription?.homeworld ?? ''} readOnly={character.lifeModuleHistory.some((entry) => entry.moduleId === FAMILY_TRAINING_ID)} onChange={(event) => updateDescription({ homeworld: event.target.value })} /></label>
              {character.lifeModuleHistory.some((entry) => entry.moduleId === FAMILY_TRAINING_ID) && <p className="scope-note">Homeworld is read-only because Family Training used it to create a source-bound History Skill.</p>}
              <p className="scope-note"><strong>Affiliation:</strong> {displayAffiliation(character)}{displayOrderAffiliation(character) ? ` · Order: ${displayOrderAffiliation(character)}` : ''} (established in Stage 0; not editable here)</p>
              <label>Physical description<textarea value={character.personalDescription?.physicalDescription ?? ''} onChange={(event) => updateDescription({ physicalDescription: event.target.value })} /></label>
              <label>Background notes<textarea value={character.personalDescription?.backgroundNotes ?? ''} onChange={(event) => updateDescription({ backgroundNotes: event.target.value })} /></label>
            </div>

            <h3>Issued Gear option</h3>
            <label><input type="checkbox" checked={character.creation.finalTouches.issuedGearEnabled} onChange={(event) => operate(() => setIssuedGearEnabled(character, event.target.checked), `Issued Gear ${event.target.checked ? 'enabled' : 'disabled'}.`)} /> Enable optional Issued Gear prospectively</label>
            <p className="scope-note">Issued items are employer property, cost no personal C-bills, and remain recorded if this option is later disabled.</p>

            <h3>Equipment affiliation access</h3>
            <div className="form-grid">
              <label>Character affiliation category<select value={accessProfile.affiliationCategory} onChange={(event) => updateAccessProfile({ affiliationCategory: event.target.value as EquipmentAffiliationCategory })}><option value="inner-sphere">Inner Sphere / ordinary</option><option value="periphery">Periphery</option><option value="clan">Clan</option></select></label>
              <label>Native affiliation code<input value={accessProfile.nativeAffiliationCode} onChange={(event) => updateAccessProfile({ nativeAffiliationCode: event.target.value })} placeholder="For example CC or LA" /></label>
              <label><input type="checkbox" checked={accessProfile.enabled} onChange={(event) => updateAccessProfile({ enabled: event.target.checked })} /> Apply native/foreign affiliation adjustment</label>
            </div>
            <p className="scope-note">Periphery reduces the character’s Tech cap one step (minimum B); Clan increases it one step (maximum F). A non-neutral item with a different affiliation code increases effective Availability and Legality one step.</p>

            <h3>Starter Core equipment catalog</h3>
            <div className="form-grid equipment-catalog-controls">
              <label>Search<input type="search" value={catalogSearch} onChange={(event) => setCatalogSearch(event.target.value)} placeholder="Name, category, source, or note" /></label>
              <label>Category<select value={catalogCategory} onChange={(event) => setCatalogCategory(event.target.value)}><option value="all">All categories</option>{EQUIPMENT_CATALOG_CATEGORIES.map((value) => <option key={value}>{value}</option>)}</select></label>
              <label>Source status<select value={catalogSourceStatus} onChange={(event) => setCatalogSourceStatus(event.target.value as EquipmentCatalogSourceStatus | 'all')}><option value="all">All source statuses</option><option value="audited-core">Audited Core</option><option value="example-backed">Example-backed</option></select></label>
              <label>Quantity<input type="number" min="1" step="1" value={catalogQuantity} onChange={(event) => setCatalogQuantity(Number(event.target.value))} /></label>
              <label>Ownership<select value={catalogOwnership} onChange={(event) => setCatalogOwnership(event.target.value as EquipmentOwnership)}><option>Owned</option><option>Issued</option></select></label>
            </div>
            <p>{catalogItems.length} of {EQUIPMENT_CATALOG.length} current catalog items shown.</p>
            <div className="equipment-catalog-grid">{catalogItems.map((item) => {
              const access = calculateEquipmentAccess({
                equippedTp: character.creation.finalTouches!.equippedTpUsed,
                affiliationCategory: accessProfile.affiliationCategory,
                nativeAffiliationCode: accessProfile.enabled ? accessProfile.nativeAffiliationCode : '',
                itemAffiliationCode: item.affiliationCode,
                itemRating: item.ratings,
                ownership: catalogOwnership,
                issuedGearEnabled: character.creation.finalTouches!.issuedGearEnabled,
              })
              return <article key={item.id}>
                <p className="eyebrow">{item.categoryPath.join(' / ')}</p>
                <h4>{item.displayName}</h4>
                <p><strong>{item.costCBills.toLocaleString()} C-bills</strong>{item.affiliationCode ? ` · Affiliation ${item.affiliationCode}` : ' · Neutral'}</p>
                <p>Printed: {item.rawEquipmentRating ?? 'not included in current audit'}<br />Normalized: {formatEquipmentRating(item.ratings)}<br />Effective: {formatEquipmentRating(access.effectiveItemRating)} · limit {formatEquipmentRating(access.characterLimits)}</p>
                <p>{formatCatalogMetadata(item.metadata)}</p>
                <p>{item.sourceKey} · {item.sourceStatus}</p>
                {item.notes.length > 0 && <p className="scope-note">{item.notes.join(' ')}</p>}
                <p className={access.allowed ? 'success' : 'error'}>{access.allowed ? 'Allowed' : 'Blocked'} · {access.reasons.join(', ')}{access.foreignAffiliation ? ' · foreign-affiliation adjustment applied' : ''}</p>
                <button className="button secondary" type="button" disabled={!access.allowed} onClick={() => addCatalogItem(item.id)}>Add × {catalogQuantity} as {catalogOwnership}</button>
              </article>
            })}</div>

            <h3>Add manual inventory item</h3>
            <form onSubmit={addEquipment} className="form-grid">
              <label>Item name<input required value={equipmentDraft.name} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, name: event.target.value })} /></label>
              <label>Quantity<input type="number" min="1" step="1" required value={equipmentDraft.quantity} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, quantity: Number(event.target.value) })} /></label>
              <label>Cost per item (C-bills)<input type="number" min="0" step="1" required value={equipmentDraft.costPerItemCBills} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, costPerItemCBills: Number(event.target.value) })} /></label>
              <label>Ownership<select value={equipmentDraft.ownership} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, ownership: event.target.value as EquipmentOwnership })}><option>Owned</option><option>Issued</option></select></label>
              {(['tech', 'availability', 'legality'] as const).map((rating) => <label key={rating}>{rating.charAt(0).toUpperCase() + rating.slice(1)} rating<select value={equipmentDraft[rating]} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, [rating]: event.target.value as EquipmentRatingCode })}>{EQUIPMENT_RATINGS.map((value) => <option key={value}>{value}</option>)}</select></label>)}
              <label>Affiliation code (optional)<input value={equipmentDraft.affiliationCode} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, affiliationCode: event.target.value })} /></label>
              <label>Location (optional)<input value={equipmentDraft.location} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, location: event.target.value })} /></label>
              <label>Carried note (optional)<input value={equipmentDraft.carriedNote} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, carriedNote: event.target.value })} /></label>
              {equipmentDraft.ownership === 'Issued' && <label>Issuer/employer (optional)<input value={equipmentDraft.issuerOrEmployer} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, issuerOrEmployer: event.target.value })} /></label>}
              <label>Notes<textarea value={equipmentDraft.notes} onChange={(event) => setEquipmentDraft({ ...equipmentDraft, notes: event.target.value })} /></label>
              <button className="button" type="submit">Add inventory item</button>
            </form>

            <h3>Inventory draft</h3>
            {character.inventory.length === 0 ? <p>No personal equipment recorded.</p> : <ul className="module-history">{character.inventory.map((item) => <li key={item.id}><div><strong>{item.displayName} × {item.quantity}</strong><span>{item.entryKind === 'catalog' ? 'Catalog' : 'Manual'} · {item.ownership} · {item.totalCostCBills?.toLocaleString()} C-bills · {formatEquipmentRating(item.equipmentRating)}{item.ownership === 'Issued' ? ' · employer property' : ' · personal property'}</span></div><button className="button secondary" type="button" onClick={() => operate(() => removeInventoryItem(character, item.id), 'Inventory item removed.')}>Remove</button></li>)}</ul>}
            <div className="row-actions"><button className="button" type="button" onClick={() => operate(() => markReadyForEquipmentReview(character), 'Equipment draft marked ready for equipment review.')}>Mark ready for equipment review</button></div>
            <p className="scope-note">The catalog contains 84 current audited items, including the Slice 18 Clan power-pack batch; every current record preserves its supplied raw rating and Availability triplet. PP capacity, quick-charge, and other item rules remain inert metadata. Manual entry remains available. Combat/heavy Vehicle Trait entitlements, PDF export, final lock, and ready-for-play status are not implemented.</p>
          </section>}

          {state.finalReview && <section className="life-stage-panel">
            <p className="eyebrow">Final review</p>
            <h2>{state.finalReview.readiness === 'ready-for-final-touches' ? 'Ready for Final Touches' : 'Review required'}</h2>
            <div className="xp-dashboard" aria-label="Final allocation XP status">
              <div><span>Starting final pool</span><strong>{state.finalReview.allocationPool.starting.toLocaleString()}</strong></div>
              <div><span>Allocated</span><strong>{state.finalReview.allocationPool.allocated.toLocaleString()}</strong></div>
              <div><span>Optimization returned</span><strong>{state.finalReview.allocationPool.optimizationReturned.toLocaleString()}</strong></div>
              <div><span>Remaining</span><strong>{state.finalReview.allocationPool.remaining.toLocaleString()}</strong></div>
            </div>
            <h3>1. Determine levels and requirements</h3>
            <p>Attained scores and levels use the final XP totals. Resolve minimums, maximums, prerequisites, and opposed Traits before Optimization.</p>
            {opposedTraitConflicts.length === 0 ? <p>No opposed-Trait conflicts remain.</p> : <ul className="module-history">{opposedTraitConflicts.map((entry) => <li key={entry.id}><div><strong>Opposed Traits</strong><span>{entry.description}</span></div><button className="button secondary" type="button" onClick={() => operate(() => resolveLifeModuleOpposedTraits(character, entry.id), 'Opposed Traits resolved.')}>Resolve</button></li>)}</ul>}
            <h3>2. Optimization</h3>
            {optimizationPreview.length === 0 ? <p>No supported Optimization opportunities remain.</p> : <ul className="module-history">{optimizationPreview.map((entry) => <li key={entry.id}><div><strong>{entry.destination.displayName}</strong><span>Current {signed(entry.beforeXp)} XP · attained threshold {signed(entry.afterXp)} XP · recover {entry.returnedXp} XP · {entry.reason}</span></div><button className="button secondary" type="button" disabled={opposedTraitConflicts.length > 0} onClick={() => operate(() => applyLifeModuleOptimization(character, entry.id), 'Optimization applied and returned XP to final allocation.')}>Optimize</button></li>)}</ul>}
            <h3>3. Spend final XP</h3>
            <p>Spend the available pool on existing modeled Attributes, Traits, and Skills. Optimization recovers excess; it does not purchase improvements.</p>
            <div className="row-actions">
              <label>Existing statistic
                <select value={finalAllocationTarget} onChange={(event) => setFinalAllocationTarget(event.target.value)}>
                  {character.attributes.map((entry) => <option key={`attribute:${entry.attributeId}`} value={`attribute:${entry.attributeId}`}>Attribute · {entry.attributeId}</option>)}
                  {character.traits.map((entry, index) => <option key={`trait:${index}`} value={`trait:${index}`}>Trait · {entry.displayName}</option>)}
                  {character.skills.map((entry, index) => <option key={`skill:${index}`} value={`skill:${index}`}>Skill · {entry.displayName}</option>)}
                </select>
              </label>
              <label>XP<input type="number" min="1" max={state.finalReview.allocationPool.remaining} step="1" {...controlStatusProps(controlStatus({ required: state.finalReview.allocationPool.remaining > 0, resolved: finalAllocationXp >= 1 && finalAllocationXp <= state.finalReview.allocationPool.remaining, invalid: state.finalReview.allocationPool.remaining > 0 && (finalAllocationXp < 1 || finalAllocationXp > state.finalReview.allocationPool.remaining), disabled: state.finalReview.allocationPool.remaining === 0 }))} disabled={state.finalReview.allocationPool.remaining === 0} value={finalAllocationXp} onChange={(event) => setFinalAllocationXp(Number(event.target.value))} /></label>
              <button className="button" type="button" disabled={state.finalReview.allocationPool.remaining === 0} onClick={allocateFinalXp}>Allocate XP</button>
            </div>
            {state.finalReview.allocations.length > 0 && <ul className="purchase-list" aria-label="Proposed final improvements">{state.finalReview.allocations.map((allocation) => <li key={allocation.id}><div><strong>{allocation.destination.displayName}</strong><span>Proposed +{allocation.xp} XP · {allocation.destination.type}</span></div><button className="button secondary danger" type="button" onClick={() => operate(() => removeFinalReviewAllocation(character, allocation.id), 'Proposed final improvement removed and XP returned.')}>Remove</button></li>)}</ul>}
            {goalStatus && <section className="goal-review" aria-labelledby="goal-review-heading">
              <h3 id="goal-review-heading">{goalStatus.displayName} goal gaps</h3>
              <p>{goalStatus.satisfied} / {goalStatus.total} guidance requirements satisfied. Goal gaps are shown before ordinary Optimization; selecting a goal never grants the Field.</p>
              {goalStatus.requirements.every((entry) => entry.satisfied) ? <p>All tracked guidance requirements are satisfied.</p> : <ul className="module-history">{goalStatus.requirements.filter((entry) => !entry.satisfied).map((entry) => <li key={entry.id}><div><strong>{entry.label}</strong><span>Current: {entry.current}{entry.xpRequired !== null ? ` · ${entry.xpRequired} XP required` : ' · structural requirement'}</span></div>{entry.destination && entry.xpRequired && entry.xpRequired <= state.finalReview!.allocationPool.remaining ? <button className="button secondary" type="button" onClick={() => operate(() => allocateFinalReviewXp(character, entry.destination!, entry.xpRequired!), `${entry.label} goal gap funded through final allocation.`)}>Apply required XP</button> : null}</li>)}</ul>}
            </section>}
            <h3>Review blockers</h3>
            {finalReviewBlockers.length === 0 ? <p>No final-review blockers remain.</p> : <ul>{finalReviewBlockers.map((entry) => <li key={entry.id}>{entry.message}</li>)}</ul>}
            <h3>4. Optional additional XP and final validation</h3>
            <p className="scope-note"><strong>Optional rule:</strong> work with the gamemaster before adding or enhancing a negative Trait. Additional XP purchased: {state.finalReview.negativeTraitXpPurchase.purchasedXp} / {state.finalReview.negativeTraitXpPurchase.capXp} XP · remaining allowance: {state.finalReview.negativeTraitXpPurchase.capXp - state.finalReview.negativeTraitXpPurchase.purchasedXp} XP · Pool: {state.finalReview.allocationPool.remaining} XP.</p>
            <div className="row-actions">
              <label>Negative Trait
                <select value={additionalTraitId} onChange={(event) => setAdditionalTraitId(event.target.value)}>
                  {POINT_BUY_TRAITS.filter((entry) => Math.min(...entry.allowedTp) < 0 && !entry.parameter).map((entry) => <option key={entry.id} value={entry.id}>{entry.displayName}</option>)}
                  {character.traits.filter((entry) => entry.accumulatedXp < 0 && !POINT_BUY_TRAITS.some((definition) => definition.id === entry.traitId)).map((entry) => <option key={entry.traitId} value={entry.traitId}>{entry.displayName ?? entry.traitId} (existing only)</option>)}
                </select>
              </label>
              <label>Fully attained negative TP<input type="number" max="-1" step="1" value={additionalTraitTp} onChange={(event) => setAdditionalTraitTp(Number(event.target.value))} /></label>
              <button className="button secondary" type="button" onClick={purchaseAdditionalXp}>Add / enhance negative Trait</button>
            </div>
            {(state.finalReview.additionalTraitXp ?? []).length > 0 && <ul className="purchase-list" aria-label="Proposed optional Additional XP">{(state.finalReview.additionalTraitXp ?? []).map((entry) => <li key={entry.id}><div><strong>{entry.displayName}</strong><span>{entry.beforeXp} → {entry.afterXp} XP · gained {entry.gainedXp} XP</span></div><button className="button secondary danger" type="button" onClick={() => operate(() => removeAdditionalNegativeTraitXp(character, entry.id), 'Optional Additional XP proposal removed.')}>Remove</button></li>)}</ul>}
            <p className="scope-note">Final review does not purchase equipment, export PDF, lock the character, or mark it ready for play.</p>
          </section>}

          <LifeModuleAuditDrawer open={state.phase === 'alpha-final-review'}>
          <details className="life-stage-panel life-audit-details" open={state.phase === 'alpha-final-review'}>
            <summary>Show selected-module timeline</summary>
            {character.lifeModuleHistory.length === 0 ? <p className="empty">No modules selected.</p> : (
              <ul className="module-history">{character.lifeModuleHistory.map((entry) => <li key={entry.moduleId}><div><strong>{entry.displayName}</strong><span>Stage {entry.stage} · {entry.costXp} XP{entry.baseCostXp !== undefined ? ` (${entry.baseCostXp} base + ${entry.fieldCostXp} Fields)` : ''}{entry.chronologyYears ? ` · +${entry.chronologyYears} years` : ''}{entry.source.page ? ` · Core p. ${entry.source.page}` : ''}</span></div></li>)}</ul>
            )}
          </details>

          {state.selectedSkillFields.length > 0 && <section className="life-stage-panel">
            <h2>Selected Skill Fields</h2>
            <ul className="module-history">{state.selectedSkillFields.map((entry) => <li key={entry.id}><div><strong>{entry.displayName}</strong><span>{entry.category} · {entry.purchaseCostXp} XP · +{entry.xpPerSkill} XP per Skill · +{entry.chronologyYears} year{entry.chronologyYears === 1 ? '' : 's'}</span></div></li>)}</ul>
            <p>Current recorded age: {currentAge(character) ?? 'not established'}</p>
          </section>}

          <details className="life-stage-panel life-audit-details" open={state.phase === 'alpha-final-review'}>
            <summary>Show applied awards</summary>
            <div className="award-columns">
              <div><h3>Attributes</h3><ul>{character.attributes.map((entry) => <li key={entry.attributeId}>{entry.attributeId}: {signed(entry.accumulatedXp)} XP · attained {entry.purchasedLevel ?? '—'}</li>)}</ul></div>
              <div><h3>Traits</h3><ul>{character.traits.map((entry, index) => <li key={`${entry.traitId}-${index}`}>{entry.displayName}{entry.active && entry.attainedTp !== null ? ` (${entry.attainedTp})` : ''}: {entry.active ? `${signed(entry.accumulatedXp)} XP` : entry.accumulatedXp !== 0 ? `pending · ${signed(entry.accumulatedXp)} XP` : 'pending'}</li>)}</ul></div>
              <div><h3>Skills</h3><ul>{character.skills.map((entry) => <li key={`${entry.address.skillId}-${entry.address.parameter?.value ?? ''}`}>{entry.displayName}: {signed(entry.accumulatedXp)} XP · {entry.level === null ? 'untrained' : `Level +${entry.level}`}</li>)}</ul></div>
            </div>
          </details>

          <details className="life-stage-panel life-audit-details" open={state.phase === 'alpha-final-review'}>
            <summary>Show resolved choices</summary>
            {state.resolvedAwards.length === 0 ? <p>No choice awards resolved.</p> : <ul className="module-history">{state.resolvedAwards.map((entry) => <li key={entry.id}><div><strong>{entry.destination.displayName}</strong><span>{entry.awardId} · {signed(entry.xp)} XP{entry.source.page ? ` · Core p. ${entry.source.page}` : ''}</span></div></li>)}</ul>}
          </details>

          <section className="life-stage-panel">
            <h2>Rule and validation details</h2>
            <details className="life-audit-inline" open={state.phase === 'alpha-final-review'}><summary>Show rule and validation details</summary>
              {state.prerequisiteIssues.map((entry) => <p className={entry.status === 'outstanding' ? 'notice' : ''} key={entry.id}>{entry.description}: {entry.status}</p>)}
              <h3>Validation</h3>
              <ul>{validation?.issues.map((entry) => <li className={entry.severity} key={`${entry.id}/${entry.path}`}>{entry.message}</li>)}</ul>
            </details>
          </section>
          </LifeModuleAuditDrawer>
        </>
      ) : null}
      {message && <p className="notice" role="status">{message}</p>}
    </main>
  )
}

function formatPhase(phase: string): string {
  return phase.split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function signed(value: number): string {
  return value > 0 ? `+${value}` : String(value)
}

function formatEquipmentRating(rating: { tech: EquipmentRatingCode | null; availability: EquipmentRatingCode | null; legality: EquipmentRatingCode | null } | undefined): string {
  if (!rating || Object.values(rating).every((value) => value === null)) return 'ratings not audited'
  return `${rating.tech ?? '—'}/${rating.availability ?? '—'}/${rating.legality ?? '—'}`
}

function formatCatalogMetadata(metadata: Record<string, string | number | boolean>): string {
  return Object.entries(metadata).map(([key, value]) => `${key}: ${String(value)}`).join(' · ')
}

function defaultResolutionDraft(pending: PendingLifeModuleAward): ResolutionDraft {
  if (pending.requiredSkillId) {
    return { targetType: 'skill', targetId: '', parameter: '', displayName: '', xpAmount: pending.remainingXp ?? pending.xpPerGrant }
  }
  const targetType = pending.allowedTargetTypes[0]
  const targetCap = pending.maxXpPerTarget?.[targetType] ?? (pending.remainingXp ?? pending.xpPerGrant)
  return { targetType, targetId: '', parameter: '', displayName: '', xpAmount: Math.min(pending.remainingXp ?? pending.xpPerGrant, targetCap) }
}

function destinationDisplayName(draft: ResolutionDraft): string {
  const base = draft.displayName || draft.targetId
  return draft.parameter.trim() ? `${base}/${draft.parameter.trim()}` : base
}

function optionDraft(option: PendingAwardOption, xpAmount: number): ResolutionDraft {
  return {
    targetType: option.type,
    targetId: option.targetId,
    parameter: option.parameter?.value ?? '',
    displayName: option.displayName,
    xpAmount,
    ...(option.inputMode ? { choiceOptionValue: option.value } : {}),
  }
}

function optionValue(draft: Pick<StageChoiceSlotValue, 'targetType' | 'targetId' | 'parameter' | 'choiceOptionValue'>): string {
  if (draft.choiceOptionValue) return draft.choiceOptionValue
  if (!draft.targetId) return ''
  return draft.targetType === 'skill' ? `${draft.targetId}/${draft.parameter}` : draft.targetId
}

function pendingAwardSupportsSlot(pending: PendingLifeModuleAward, character: CharacterDefinition): boolean {
  if (pendingOpenSubject(pending)) return true
  if (pending.kind !== 'flexible-xp') return pendingAwardOptions(pending, character).length > 0
  return pending.allowedTargetTypes.some((targetType) => pendingAwardOptions({ ...pending, allowedTargetTypes: [targetType] }, character).length > 0)
}

function stageChoiceSlotLabel(pending: PendingLifeModuleAward, index: number): string {
  const suffix = pending.remainingGrants > 1 ? ` ${index + 1}` : ''
  if (pending.kind === 'flexible-xp') return `Flexible XP grant ${index + 1}`
  if (pending.kind === 'related-skill-prerequisite') return 'Related existing Skill prerequisite'
  if (pending.kind === 'modeled-skill-choice') return `Trade School Skill award ${index + 1}`
  if (pending.requiredSkillId === 'skill.career') return `Career choice${suffix}`
  if (pending.requiredSkillId === 'skill.interest') return `Interest choice${suffix}`
  if (pending.kind === 'language-choice') return `Language choice${suffix}`
  if (pending.kind === 'affiliation-skill-choice') return `Affiliation skill choice${suffix}`
  return `${pending.description}${suffix}`
}

function moduleName(character: CharacterDefinition, moduleId: string): string {
  return character.lifeModuleHistory.find((entry) => entry.moduleId === moduleId)?.displayName ?? moduleId
}

function currentAge(character: CharacterDefinition): number | null {
  const ages = character.chronology.map((entry) => Number(entry.date.match(/^age:(\d+)$/)?.[1])).filter(Number.isFinite)
  return ages.length > 0 ? Math.max(...ages) : null
}

function displayAffiliation(character: CharacterDefinition): string {
  const entry = character.affiliations.find((candidate) => candidate.role === 'final')
  return entry ? getLifeModuleAffiliationContextByAffiliationId(entry.affiliationId)?.affiliationName ?? entry.affiliationId : 'Not established'
}

function displayOrderAffiliation(character: CharacterDefinition): string | null {
  const entry = character.affiliations.find((candidate) => candidate.role === 'order')
  return entry ? getLifeModuleAffiliationContextByAffiliationId(entry.affiliationId)?.affiliationName ?? entry.affiliationId : null
}

function finalReviewDestination(character: CharacterDefinition, selection: string): ResolvedLifeModuleDestination {
  const [type, identifier] = selection.split(':')
  if (type === 'attribute') return { type, targetId: identifier, displayName: identifier }
  const index = Number(identifier)
  if (type === 'trait') {
    const entry = character.traits[index]
    if (!entry) throw new Error('Select a valid existing Trait destination.')
    return { type, targetId: entry.traitId, displayName: entry.displayName ?? entry.traitId, parameters: { ...entry.parameters } }
  }
  if (type === 'skill') {
    const entry = character.skills[index]
    if (!entry) throw new Error('Select a valid existing Skill destination.')
    return { type, targetId: entry.address.skillId, displayName: entry.displayName ?? entry.address.skillId, ...(entry.address.parameter ? { parameter: { ...entry.address.parameter } } : {}) }
  }
  throw new Error('Select a valid final-allocation destination.')
}
