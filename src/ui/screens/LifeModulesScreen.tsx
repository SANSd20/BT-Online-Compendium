import { useState, type FormEvent } from 'react'
import type { CharacterDefinition, EquipmentAffiliationCategory, EquipmentCatalogSourceStatus, EquipmentOwnership, EquipmentRatingCode, PendingLifeModuleAward, ResolvedLifeModuleDestination } from '../../domain/character/model'
import { EQUIPMENT_CATALOG, EQUIPMENT_CATALOG_CATEGORIES, filterEquipmentCatalog } from '../../domain/equipment/catalog'
import { adjustedOwnedEquipmentLimits, calculateEquipmentAccess } from '../../domain/finalTouches/rules'
import { AGITATOR_ID, BACK_WOODS_ID, BLUE_COLLAR_ID, STAGE_2_BACK_WOODS_ID, STAGE_2_HIGH_SCHOOL_ID } from '../../domain/lifeModules/catalog'
import { TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID } from '../../domain/skillFields/catalog'
import { getFinalReviewBlockers } from '../../domain/lifeModules/finalReview'
import { applyCapellanCommonality, applyStage1Module, applyStage2Module, applyStage4Module, applyTechnicalCollege, applyUniversalStage0, continueToStage2, continueToStage3, continueToStage4, createLifeModuleCharacter, resolvePendingLifeModuleAward } from '../../engine/lifeModuleEngine'
import { allocateFinalReviewXp, applyLifeModuleOptimization, enterLifeModuleFinalReview, previewLifeModuleOptimization } from '../../engine/lifeModuleFinalReview'
import { addCatalogInventoryItem, addManualInventoryItem, enterFinalTouches, markReadyForEquipmentReview, removeInventoryItem, setEquipmentAccessProfile, setIssuedGearEnabled, updatePersonalDescription } from '../../engine/finalTouchesEngine'
import { downloadCharacter } from '../../persistence/browserFiles'
import { validateCharacter } from '../../validation/validateCharacter'

interface LifeModulesScreenProps {
  onSave: (character: CharacterDefinition) => void
}

const AFFILIATION_LANGUAGES = ['Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English']
const SECONDARY_LANGUAGES = ['Russian', 'Cantonese', 'Vietnamese', 'English']
const ATTRIBUTE_IDS = ['STR', 'BOD', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG']

interface ResolutionDraft {
  targetType: 'attribute' | 'trait' | 'skill'
  targetId: string
  parameter: string
  displayName: string
  xpAmount: number
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
  const [name, setName] = useState('')
  const [startingXp, setStartingXp] = useState(5000)
  const [affiliationLanguage, setAffiliationLanguage] = useState('Mandarin Chinese')
  const [secondaryLanguage, setSecondaryLanguage] = useState('Russian')
  const [character, setCharacter] = useState<CharacterDefinition | null>(null)
  const [resolutionDrafts, setResolutionDrafts] = useState<Record<string, ResolutionDraft>>({})
  const [finalAllocationTarget, setFinalAllocationTarget] = useState('attribute:STR')
  const [finalAllocationXp, setFinalAllocationXp] = useState(1)
  const [equipmentDraft, setEquipmentDraft] = useState<EquipmentDraft>(EMPTY_EQUIPMENT_DRAFT)
  const [catalogSearch, setCatalogSearch] = useState('')
  const [catalogCategory, setCatalogCategory] = useState('all')
  const [catalogSourceStatus, setCatalogSourceStatus] = useState<EquipmentCatalogSourceStatus | 'all'>('all')
  const [catalogQuantity, setCatalogQuantity] = useState(1)
  const [catalogOwnership, setCatalogOwnership] = useState<EquipmentOwnership>('Owned')
  const [message, setMessage] = useState('')

  function start(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    operate(() => createLifeModuleCharacter(name, startingXp), 'Life Module draft created and saved locally.')
  }

  function operate(operation: () => CharacterDefinition, success: string) {
    try {
      const next = operation()
      setCharacter(next)
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
    operate(() => resolvePendingLifeModuleAward(character, pending.id, destination, pending.allocationMode === 'pool' ? draft.xpAmount : undefined), 'Award grant resolved and applied.')
  }

  const state = character?.creation.lifeModules
  const validation = character ? validateCharacter(character) : null
  const optimizationPreview = character && state?.finalReview ? previewLifeModuleOptimization(character) : []
  const finalReviewBlockers = character && state?.finalReview ? getFinalReviewBlockers(character) : []
  const catalogItems = filterEquipmentCatalog({ search: catalogSearch, category: catalogCategory, sourceStatus: catalogSourceStatus })
  const accessProfile = character?.creation.finalTouches?.equipmentAccessProfile ?? { enabled: false, affiliationCategory: 'inner-sphere' as const, nativeAffiliationCode: '' }
  const effectiveOwnedLimits = character?.creation.finalTouches ? adjustedOwnedEquipmentLimits(character.creation.finalTouches.equippedTpUsed, accessProfile.affiliationCategory) : null

  function allocateFinalXp() {
    if (!character) return
    operate(() => allocateFinalReviewXp(character, finalReviewDestination(character, finalAllocationTarget), finalAllocationXp), 'Final-allocation XP applied.')
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

  return (
    <main className="creation-page life-modules-page">
      <a className="back-link" href="#/">← Character Creator</a>
      <section className="hero compact">
        <p className="eyebrow">Alpha · Slice 13</p>
        <h1>Life Modules</h1>
        <p>Build through the audited Agitator branch, complete final review, and use the 55-item audited Core equipment catalog with affiliation-adjusted access or the manual inventory fallback. Full catalog coverage and finalization remain deferred.</p>
      </section>

      {!character ? (
        <section className="draft-panel">
          <h2>Start a Life Modules draft</h2>
          <form onSubmit={start}>
            <label htmlFor="life-module-name">Character name</label>
            <input id="life-module-name" value={name} onChange={(event) => setName(event.target.value)} required />
            <label htmlFor="life-module-starting-xp">Starting XP</label>
            <input id="life-module-starting-xp" type="number" min="1" step="1" value={startingXp} onChange={(event) => setStartingXp(Number(event.target.value))} required />
            <button className="button" type="submit">Create Life Module draft</button>
          </form>
          <p className="scope-note">The Core default is 5,000 XP. Any other positive whole-number allotment is recorded as GM-adjusted.</p>
        </section>
      ) : state ? (
        <>
          <section className="xp-dashboard" aria-label="Life Module XP status">
            <div><span>Module pool</span><strong>{state.moduleXp.starting.toLocaleString()}</strong></div>
            <div><span>Module costs</span><strong>{state.moduleXp.spent.toLocaleString()}</strong></div>
            <div><span>Remaining</span><strong>{state.moduleXp.remaining.toLocaleString()}</strong></div>
            <div><span>Stat XP (net)</span><strong>{character.xp.creation.allocated.toLocaleString()}</strong></div>
          </section>

          <section className="life-stage-panel">
            <p className="eyebrow">Current state</p>
            <h2>{formatPhase(state.phase)}</h2>
            {state.phase === 'stage-0-universal' && (
              <div className="life-action">
                <div><h3>Universal Fixed Experience Points</h3><p>850 XP · +100 XP to every Attribute, two Language awards, and Perception +10 XP.</p></div>
                <label>Affiliation language
                  <select value={affiliationLanguage} onChange={(event) => setAffiliationLanguage(event.target.value)}>
                    {AFFILIATION_LANGUAGES.map((language) => <option key={language}>{language}</option>)}
                  </select>
                </label>
                <button className="button" type="button" onClick={() => operate(() => applyUniversalStage0(character, affiliationLanguage), 'Universal Stage 0 package applied.')}>Apply universal package</button>
              </div>
            )}
            {state.phase === 'stage-0-affiliation' && (
              <div className="life-action">
                <div><h3>Capellan Confederation / Capellan Commonality</h3><p>150 XP · the audited Alpha affiliation and sub-affiliation package.</p></div>
                <label>Capellan secondary-language award
                  <select value={secondaryLanguage} onChange={(event) => setSecondaryLanguage(event.target.value)}>
                    {SECONDARY_LANGUAGES.map((language) => <option key={language}>{language}</option>)}
                  </select>
                </label>
                <button className="button" type="button" onClick={() => operate(() => applyCapellanCommonality(character, secondaryLanguage), 'Capellan affiliation package applied.')}>Select affiliation</button>
              </div>
            )}
            {state.phase === 'stage-1-selection' && (
              <div className="stage-options">
                <article><h3>Blue Collar</h3><p>210 XP · fixed Attribute awards plus unresolved Career, Interest, and flexible awards.</p><button className="button" type="button" onClick={() => operate(() => applyStage1Module(character, BLUE_COLLAR_ID), 'Blue Collar selected; unresolved awards retained.')}>Select Blue Collar</button></article>
                <article><h3>Back Woods</h3><p>290 XP · fixed Attribute, Trait, and Skill awards; STR 4+ and BOD 5+ are checked for final validation.</p><button className="button" type="button" onClick={() => operate(() => applyStage1Module(character, BACK_WOODS_ID), 'Back Woods selected; unresolved awards and prerequisites retained.')}>Select Back Woods</button></article>
              </div>
            )}
            {state.phase === 'stage-1-resolution' && <p className="notice">Stage 1 is selected. Resolve every source-bound choice and flexible grant below before reaching an Alpha partial stop.</p>}
            {state.phase === 'stage-1-prerequisite-review' && <p className="notice">All awards are resolved, but one or more module prerequisites remain outstanding for eventual final validation.</p>}
            {state.phase === 'alpha-partial-stop' && <div className="life-action"><p className="notice">Stage 0 and Stage 1 are complete. This is a valid Alpha partial stop—not a finalized Beta 1 character.</p><button className="button" type="button" onClick={() => operate(() => continueToStage2(character), 'Stage 2 continuation opened.')}>Continue to Stage 2</button></div>}
            {state.phase === 'stage-2-selection' && (
              <div className="stage-options">
                <article><h3>Back Woods</h3><p>500 XP · fixed awards, Protocol/Affiliation, and a 125 XP flexible pool.</p><button className="button" type="button" onClick={() => operate(() => applyStage2Module(character, STAGE_2_BACK_WOODS_ID), 'Stage 2 Back Woods selected.')}>Select Back Woods</button></article>
                <article><h3>High School</h3><p>400 XP · requires a non-Clan affiliation and no active Illiterate Trait; includes Interest, affiliation, and 185 flexible XP awards.</p><button className="button" type="button" onClick={() => operate(() => applyStage2Module(character, STAGE_2_HIGH_SCHOOL_ID), 'Stage 2 High School selected.')}>Select High School</button></article>
              </div>
            )}
            {state.phase === 'stage-2-resolution' && <p className="notice">Stage 2 is selected. Resolve all Stage 2 source-bound choices and flexible XP below.</p>}
            {state.phase === 'stage-2-prerequisite-review' && <p className="notice">All Stage 2 awards are resolved, but one or more prerequisites remain outstanding for eventual final validation.</p>}
            {state.phase === 'alpha-stage-2-stop' && <div className="life-action"><p className="notice">Stage 0 through Stage 2 are complete. This is a valid Alpha partial stop—not a finalized Beta 1 character.</p><button className="button" type="button" onClick={() => operate(() => continueToStage3(character), 'Stage 3 continuation opened.')}>Continue to Stage 3</button></div>}
            {state.phase === 'stage-3-selection' && (
              <div className="stage-options">
                <article>
                  <h3>Technical College</h3>
                  <p>600 XP base cost · civilian Higher Education school.</p>
                  <label><input type="checkbox" checked readOnly /> Technician/Civilian — Basic, 120 XP, +1 year</label>
                  <label><input type="checkbox" checked readOnly /> Technician/Vehicle — Advanced, 96 XP, +2 years</label>
                  <p><strong>Total: 816 XP · +3 years · expected age 19</strong></p>
                  <button className="button" type="button" onClick={() => operate(() => applyTechnicalCollege(character, [TECHNICIAN_CIVILIAN_FIELD_ID, TECHNICIAN_VEHICLE_FIELD_ID]), 'Technical College and selected Skill Fields applied.')}>Select Technical College path</button>
                </article>
              </div>
            )}
            {state.phase === 'stage-3-resolution' && <p className="notice">Technical College is selected. Resolve Interest/Any and all flexible XP below.</p>}
            {state.phase === 'stage-3-prerequisite-review' && <p className="notice">All Stage 3 awards are resolved, but one or more Skill Field prerequisites remain outstanding for eventual final validation.</p>}
            {state.phase === 'alpha-stage-3-stop' && <div className="life-action"><p className="notice">The minimal Technical College Stage 3 branch is complete. This is an Alpha partial stop—not a finalized character.</p><button className="button" type="button" onClick={() => operate(() => continueToStage4(character), 'Stage 4 continuation opened.')}>Continue to Stage 4</button></div>}
            {state.phase === 'stage-4-selection' && (
              <div className="stage-options">
                <article>
                  <h3>Agitator</h3>
                  <p>900 XP · Real Life module · +4 years.</p>
                  <p>Includes fixed Attribute, Trait, and Skill awards; three concrete subskill choices; and 125 flexible XP with a 50-XP cap per Attribute.</p>
                  <p><strong>Expected age: 23</strong></p>
                  <button className="button" type="button" onClick={() => operate(() => applyStage4Module(character, AGITATOR_ID), 'Agitator selected; pending awards retained.')}>Select Agitator</button>
                </article>
              </div>
            )}
            {state.phase === 'stage-4-resolution' && <p className="notice">Agitator is selected. Resolve Driving/Any, Prestidigitation/Any, Streetwise/Affiliation, and all flexible XP below.</p>}
            {state.phase === 'stage-4-prerequisite-review' && <div className="life-action"><p className="notice">All Stage 4 awards are resolved, but one or more prerequisites remain outstanding. Enter final review to allocate XP and re-evaluate them.</p><button className="button" type="button" onClick={() => operate(() => enterLifeModuleFinalReview(character), 'Life Module final review opened with outstanding prerequisites.')}>Enter final review</button></div>}
            {state.phase === 'alpha-stage-4-stop' && <div className="life-action"><p className="notice">The minimal Agitator Stage 4 branch is complete at age {currentAge(character) ?? 'unknown'}. Enter final review to allocate remaining XP and explicitly apply Optimization.</p><button className="button" type="button" onClick={() => operate(() => enterLifeModuleFinalReview(character), 'Life Module final review opened.')}>Enter final review</button></div>}
            {state.phase === 'alpha-final-review' && <p className="notice">Final review is in progress. Resolve every blocker below before the character can be marked ready for Final Touches.</p>}
            {state.phase === 'ready-for-final-touches' && !character.creation.finalTouches && <div className="life-action"><p className="notice">This draft passed final review and may enter the Alpha Final Touches/equipment foundation.</p><button className="button" type="button" onClick={() => operate(() => enterFinalTouches(character), 'Final Touches opened with Wealth-derived funds and Equipped-derived limits.')}>Enter Final Touches</button></div>}
            {state.phase === 'ready-for-final-touches' && character.creation.finalTouches && <p className="notice">Final Touches equipment state: {formatPhase(character.creation.finalTouches.equipmentReviewState)}. This is not a finalized or ready-for-play character.</p>}
          </section>

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
              <label>Homeworld<input value={character.personalDescription?.homeworld ?? ''} onChange={(event) => updateDescription({ homeworld: event.target.value })} /></label>
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
            <p className="scope-note">The starter catalog contains 17 audited/example-backed items; manual entry remains available. Catalog metadata does not automate combat, ammunition, power, armor, healing, or play state. Combat/heavy Vehicle Trait entitlements, PDF export, final lock, and ready-for-play status are not implemented.</p>
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
            <h3>Allocate remaining XP</h3>
            <div className="row-actions">
              <label>Existing statistic
                <select value={finalAllocationTarget} onChange={(event) => setFinalAllocationTarget(event.target.value)}>
                  {character.attributes.map((entry) => <option key={`attribute:${entry.attributeId}`} value={`attribute:${entry.attributeId}`}>Attribute · {entry.attributeId}</option>)}
                  {character.traits.map((entry, index) => <option key={`trait:${index}`} value={`trait:${index}`}>Trait · {entry.displayName}</option>)}
                  {character.skills.map((entry, index) => <option key={`skill:${index}`} value={`skill:${index}`}>Skill · {entry.displayName}</option>)}
                </select>
              </label>
              <label>XP<input type="number" min="1" max={state.finalReview.allocationPool.remaining} step="1" value={finalAllocationXp} onChange={(event) => setFinalAllocationXp(Number(event.target.value))} /></label>
              <button className="button" type="button" disabled={state.finalReview.allocationPool.remaining === 0} onClick={allocateFinalXp}>Allocate XP</button>
            </div>
            <h3>Optimization preview</h3>
            {optimizationPreview.length === 0 ? <p>No supported Optimization opportunities remain.</p> : <ul className="module-history">{optimizationPreview.map((entry) => <li key={entry.id}><div><strong>{entry.destination.displayName}</strong><span>{signed(entry.beforeXp)} → {signed(entry.afterXp)} XP · return {entry.returnedXp} XP · {entry.reason}</span></div><button className="button secondary" type="button" onClick={() => operate(() => applyLifeModuleOptimization(character, entry.id), 'Optimization applied and returned XP to final allocation.')}>Apply</button></li>)}</ul>}
            <h3>Review blockers</h3>
            {finalReviewBlockers.length === 0 ? <p>No final-review blockers remain.</p> : <ul>{finalReviewBlockers.map((entry) => <li key={entry.id}>{entry.message}</li>)}</ul>}
            <p className="scope-note">Negative-Trait XP purchase cap: {state.finalReview.negativeTraitXpPurchase.capXp} XP. The purchase UI is intentionally deferred.</p>
            <p className="scope-note">Final review does not purchase equipment, export PDF, lock the character, or mark it ready for play.</p>
          </section>}

          <section className="life-stage-panel">
            <h2>Selected modules</h2>
            {character.lifeModuleHistory.length === 0 ? <p className="empty">No modules selected.</p> : (
              <ul className="module-history">{character.lifeModuleHistory.map((entry) => <li key={entry.moduleId}><div><strong>{entry.displayName}</strong><span>Stage {entry.stage} · {entry.costXp} XP{entry.baseCostXp !== undefined ? ` (${entry.baseCostXp} base + ${entry.fieldCostXp} Fields)` : ''}{entry.chronologyYears ? ` · +${entry.chronologyYears} years` : ''}{entry.source.page ? ` · Core p. ${entry.source.page}` : ''}</span></div></li>)}</ul>
            )}
          </section>

          {state.selectedSkillFields.length > 0 && <section className="life-stage-panel">
            <h2>Selected Skill Fields</h2>
            <ul className="module-history">{state.selectedSkillFields.map((entry) => <li key={entry.id}><div><strong>{entry.displayName}</strong><span>{entry.category} · {entry.purchaseCostXp} XP · +{entry.xpPerSkill} XP per Skill · +{entry.chronologyYears} year{entry.chronologyYears === 1 ? '' : 's'}</span></div></li>)}</ul>
            <p>Current recorded age: {currentAge(character) ?? 'not established'}</p>
          </section>}

          <section className="life-stage-panel">
            <h2>Applied awards</h2>
            <div className="award-columns">
              <div><h3>Attributes</h3><ul>{character.attributes.map((entry) => <li key={entry.attributeId}>{entry.attributeId}: {signed(entry.accumulatedXp)} XP · attained {entry.purchasedLevel ?? '—'}</li>)}</ul></div>
              <div><h3>Traits</h3><ul>{character.traits.map((entry, index) => <li key={`${entry.traitId}-${index}`}>{entry.displayName}: {signed(entry.accumulatedXp)} XP · {entry.active ? `${signed(entry.attainedTp ?? 0)} TP active` : 'not yet active'}</li>)}</ul></div>
              <div><h3>Skills</h3><ul>{character.skills.map((entry) => <li key={`${entry.address.skillId}-${entry.address.parameter?.value ?? ''}`}>{entry.displayName}: {signed(entry.accumulatedXp)} XP · {entry.level === null ? 'untrained' : `Level +${entry.level}`}</li>)}</ul></div>
            </div>
          </section>

          <section className="life-stage-panel">
            <h2>Pending award resolution</h2>
            {state.pendingAwards.length === 0 ? <p>No unresolved award allocations.</p> : (
              <div className="pending-awards">{state.pendingAwards.map((entry) => {
                const draft = { ...defaultResolutionDraft(entry), ...resolutionDrafts[entry.id] }
                return (
                  <article key={entry.id}>
                    <div><strong>{entry.description}</strong><p>{entry.allocationMode === 'pool' ? `${entry.remainingXp} XP remaining` : `${entry.remainingGrants} grant${entry.remainingGrants === 1 ? '' : 's'} remaining · ${signed(entry.xpPerGrant)} XP each`}</p></div>
                    {entry.kind === 'flexible-xp' && (
                      <><label>Target type
                        <select value={draft.targetType} onChange={(event) => updateResolutionDraft(entry, { targetType: event.target.value as ResolutionDraft['targetType'], targetId: '', parameter: '', displayName: '' })}>
                          {entry.allowedTargetTypes.map((type) => <option key={type}>{type}</option>)}
                        </select>
                      </label>{entry.allocationMode === 'pool' && <label>XP to allocate<input type="number" min="1" max={entry.remainingXp} step="1" value={draft.xpAmount} onChange={(event) => updateResolutionDraft(entry, { xpAmount: Number(event.target.value) })} /></label>}</>
                    )}
                    {draft.targetType === 'attribute' ? (
                      <label>Attribute
                        <select value={draft.targetId} onChange={(event) => updateResolutionDraft(entry, { targetId: event.target.value, displayName: event.target.value })}>
                          {ATTRIBUTE_IDS.map((id) => <option key={id}>{id}</option>)}
                        </select>
                      </label>
                    ) : entry.requiredSkillId ? (
                      <label>{entry.kind === 'language-choice' ? 'Language' : 'Concrete subskill'}
                        <input value={draft.parameter} onChange={(event) => updateResolutionDraft(entry, { parameter: event.target.value, displayName: `${skillName(entry.requiredSkillId!)}/${event.target.value}` })} placeholder={entry.kind === 'language-choice' ? 'Concrete language' : 'Concrete subskill'} />
                      </label>
                    ) : (
                      <>
                        <label>Stable rule ID
                          <input value={draft.targetId} onChange={(event) => updateResolutionDraft(entry, { targetId: event.target.value })} placeholder={draft.targetType === 'trait' ? 'trait.fit' : 'skill.perception'} />
                        </label>
                        {draft.targetType === 'skill' && <label>Subskill, if applicable<input value={draft.parameter} onChange={(event) => updateResolutionDraft(entry, { parameter: event.target.value })} /></label>}
                        <label>Display name
                          <input value={draft.displayName} onChange={(event) => updateResolutionDraft(entry, { displayName: event.target.value })} placeholder="Published destination name" />
                        </label>
                      </>
                    )}
                    <button className="button" type="button" onClick={() => resolve(entry)}>{entry.allocationMode === 'pool' ? 'Allocate XP' : 'Apply one grant'}</button>
                  </article>
                )
              })}</div>
            )}
          </section>

          <section className="life-stage-panel">
            <h2>Resolved choices</h2>
            {state.resolvedAwards.length === 0 ? <p>No choice awards resolved.</p> : <ul className="module-history">{state.resolvedAwards.map((entry) => <li key={entry.id}><div><strong>{entry.destination.displayName}</strong><span>{entry.awardId} · {signed(entry.xp)} XP{entry.source.page ? ` · Core p. ${entry.source.page}` : ''}</span></div></li>)}</ul>}
          </section>

          <section className="life-stage-panel">
            <h2>Rule status</h2>
            {state.prerequisiteIssues.map((entry) => <p className={entry.status === 'outstanding' ? 'notice' : ''} key={entry.id}>{entry.description}: {entry.status}</p>)}
            <h3>Validation</h3>
            <ul>{validation?.issues.map((entry) => <li className={entry.severity} key={`${entry.id}/${entry.path}`}>{entry.message}</li>)}</ul>
            <div className="row-actions">
              <button className="button" type="button" onClick={() => { onSave(character); setMessage('Life Module draft saved locally.') }}>Save draft</button>
              <button className="button secondary" type="button" onClick={() => downloadCharacter(character)}>Export character JSON</button>
            </div>
          </section>
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
    return { targetType: 'skill', targetId: pending.requiredSkillId, parameter: '', displayName: skillName(pending.requiredSkillId), xpAmount: Math.min(pending.remainingXp ?? pending.xpPerGrant, 35) }
  }
  const targetType = pending.allowedTargetTypes[0]
  const targetCap = pending.maxXpPerTarget?.[targetType] ?? (targetType === 'skill' ? 35 : 200)
  return { targetType, targetId: targetType === 'attribute' ? 'STR' : '', parameter: '', displayName: targetType === 'attribute' ? 'STR' : '', xpAmount: Math.min(pending.remainingXp ?? pending.xpPerGrant, targetCap) }
}

function destinationDisplayName(draft: ResolutionDraft): string {
  const base = draft.displayName || draft.targetId
  return draft.parameter.trim() ? `${base}/${draft.parameter.trim()}` : base
}

function skillName(skillId: string): string {
  return skillId.replace('skill.', '').split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}

function currentAge(character: CharacterDefinition): number | null {
  const ages = character.chronology.map((entry) => Number(entry.date.match(/^age:(\d+)$/)?.[1])).filter(Number.isFinite)
  return ages.length > 0 ? Math.max(...ages) : null
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
