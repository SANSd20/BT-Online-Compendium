import { CAPELLAN_COMMONALITY_CONTEXT, FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT, getBirthAffiliationOptions, getBirthSubAffiliationOptions, getLifeModuleLanguageSelectorOptions, getNearestStateOptions, SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS, type OrderAffiliationSelection } from '../../domain/lifeModules/affiliations'
import { TECHNICIAN_SUBSKILLS } from '../../domain/skillFields/catalog'
import { controlStatus, controlStatusProps } from './controlStatus'
import { Stage0UniversalStep } from './Stage0UniversalStep'

interface Stage0WizardStepProps {
  phase: 'stage-0-universal' | 'stage-0-affiliation'
  affiliationContext: string
  subAffiliation?: string
  birthAffiliationId: string
  affiliationLanguage: string
  secondaryLanguage: string
  davionNaturalAptitude: string
  davionArt: string
  orderAffiliation: OrderAffiliationSelection
  orderNearestStateContext: string
  orderSecondaryLanguage: string
  orderTechnicianSubskill: string
  onBirthAffiliationChange: (value: string) => void
  onContextChange: (value: string) => void
  onSubAffiliationChange?: (value: string) => void
  onLanguageChange: (value: string) => void
  onSecondaryLanguageChange: (value: string) => void
  onDavionNaturalAptitudeChange: (value: string) => void
  onDavionArtChange: (value: string) => void
  onOrderAffiliationChange: (value: OrderAffiliationSelection) => void
  onOrderNearestStateChange: (value: string) => void
  onOrderSecondaryLanguageChange: (value: string) => void
  onOrderTechnicianSubskillChange: (value: string) => void
  onApplyUniversal: () => void
  onApplyAffiliation: () => void
}

export function Stage0WizardStep(props: Stage0WizardStepProps) {
  const universalComplete = props.phase === 'stage-0-affiliation'
  const context = SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.find((entry) => entry.id === props.affiliationContext)
  const effectiveBirthAffiliationId = props.birthAffiliationId || context?.affiliationId || ''
  const effectiveOrderAffiliation = props.orderAffiliation ?? 'no'
  const birthAffiliations = getBirthAffiliationOptions()
  const birthSubs = getBirthSubAffiliationOptions(effectiveBirthAffiliationId)
  const effectiveSubAffiliation = props.subAffiliation ?? 'no'
  const subSelected = effectiveSubAffiliation === context?.id
  const affiliationLanguages = context ? getLifeModuleLanguageSelectorOptions(context.affiliationLanguageSelector) : []
  const capellanSelected = context?.id === CAPELLAN_COMMONALITY_CONTEXT.id
  const davionSelected = context?.id === FEDERATED_SUNS_CRUCIS_MARCH_CONTEXT.id
  const secondaryLanguages = capellanSelected ? getLifeModuleLanguageSelectorOptions(CAPELLAN_COMMONALITY_CONTEXT.secondaryLanguageSelector) : []
  const orderSelected = effectiveOrderAffiliation !== 'no'
  const nearestState = getNearestStateOptions().find((entry) => entry.id === props.orderNearestStateContext)
  const nearestLanguages = nearestState ? getLifeModuleLanguageSelectorOptions(nearestState.affiliationLanguageSelector) : []
  const orderReady = !orderSelected || Boolean(nearestState && nearestLanguages.includes(props.orderSecondaryLanguage) && TECHNICIAN_SUBSKILLS.includes(props.orderTechnicianSubskill as (typeof TECHNICIAN_SUBSKILLS)[number]))
  const requirementDescriptionId = 'stage0-requirements-summary'
  const affiliationReady = Boolean(
    context &&
    props.affiliationLanguage &&
    affiliationLanguages.includes(props.affiliationLanguage) &&
    (capellanSelected ? secondaryLanguages.includes(props.secondaryLanguage) : davionSelected && ['Protocol', 'Strategy'].includes(props.davionNaturalAptitude) && (!subSelected || props.davionArt === 'Painting')) && orderReady,
  )
  return <div className="stage0-package-stack">
    {!universalComplete && <section className="stage0-package-section current" aria-labelledby="stage0-universal-heading">
      <header className="stage0-package-heading">
        <div><p className="eyebrow">Mandatory baseline</p><h3 id="stage0-universal-heading">Universal Package</h3></div>
        <strong className="stage0-package-status">Legacy draft</strong>
      </header>
      <p className="stage0-package-pending">This pre-Slice-34 draft still needs its Universal compatibility step. Universal is not an affiliation.</p>
      <Stage0UniversalStep
        affiliationContext={props.affiliationContext}
        affiliationLanguage={props.affiliationLanguage}
        onContextChange={props.onContextChange}
        onLanguageChange={props.onLanguageChange}
        onApply={props.onApplyUniversal}
      />
    </section>}

    <section className={`stage0-package-section ${universalComplete ? 'current' : 'pending'}`} aria-labelledby="stage0-affiliation-heading">
      <header className="stage0-package-heading">
        <div><p className="eyebrow">Affiliation and sub-affiliation</p><h3 id="stage0-affiliation-heading">Affiliation Package</h3></div>
        <div className="stage0-package-controls">
          <strong className="stage0-package-status">{universalComplete ? 'Current' : 'Next'}</strong>
          {universalComplete && <button className="button" type="button" disabled={!affiliationReady} onClick={props.onApplyAffiliation}>Continue</button>}
        </div>
      </header>
      {universalComplete
        ? <div className="stage0-affiliation-form">
            <p>Choose the required affiliation and language. A sub-affiliation is optional; choosing No keeps the full affiliation cost without sub-affiliation awards.</p>
            <div className="stage0-affiliation-order-grid">
              <div className="stage0-birth-affiliation-region">
              <label htmlFor="stage0-affiliation">Affiliation
                <select id="stage0-affiliation" {...controlStatusProps(controlStatus({ required: true, resolved: Boolean(context) }), requirementDescriptionId)} value={effectiveBirthAffiliationId} onChange={(event) => props.onBirthAffiliationChange?.(event.target.value)}>
                  <option value="">Choose an affiliation…</option>
                  {birthAffiliations.map((entry) => <option key={entry.id} value={entry.id}>{entry.name}</option>)}
                </select>
              </label>
              <div className="stage0-birth-affiliation-details">
              <label htmlFor="stage0-affiliation-language">Affiliation language
                <select id="stage0-affiliation-language" {...controlStatusProps(controlStatus({ required: true, resolved: affiliationLanguages.includes(props.affiliationLanguage), disabled: !context }), requirementDescriptionId)} value={props.affiliationLanguage} disabled={!context} onChange={(event) => props.onLanguageChange(event.target.value)}>
                  <option value="">{context ? 'Choose a language…' : 'Choose a context first…'}</option>
                  {affiliationLanguages.map((language) => <option key={language}>{language}</option>)}
                </select>
              </label>
              <label htmlFor="stage0-affiliation-context">Affiliation Sub
                <select id="stage0-affiliation-context" {...controlStatusProps(controlStatus({ resolved: Boolean(effectiveBirthAffiliationId), disabled: !effectiveBirthAffiliationId }))} value={effectiveSubAffiliation} disabled={!effectiveBirthAffiliationId} onChange={(event) => props.onSubAffiliationChange?.(event.target.value)} title={subSelected ? context?.displayName : 'No sub-affiliation'}>
                  <option value="no">No</option>
                  {birthSubs.map((entry) => <option key={entry.id} value={entry.id}>{entry.subAffiliationName}</option>)}
                </select>
              </label>
              </div>
              </div>
              <div className="stage0-order-region">
                <label htmlFor="stage0-order-affiliation">ComStar / Word of Blake?
                  <select id="stage0-order-affiliation" {...controlStatusProps(controlStatus({ resolved: true }))} value={effectiveOrderAffiliation} onChange={(event) => props.onOrderAffiliationChange?.(event.target.value as OrderAffiliationSelection)}>
                    <option value="no">No</option><option value="comstar">ComStar</option><option value="word-of-blake">Word of Blake</option>
                  </select>
                </label>
            {orderSelected && <div className="order-affiliation-choices">
              <div><h4>{effectiveOrderAffiliation === 'comstar' ? 'ComStar' : 'Word of Blake'} affiliation layer</h4><p>50 XP in addition to the full birth-affiliation package. Nearest state is an explicit bounded choice because geographic resolution remains deferred.</p></div>
              <div className="stage0-choice-grid">
                <label htmlFor="stage0-order-nearest-state">Nearest modeled state
                  <select id="stage0-order-nearest-state" {...controlStatusProps(controlStatus({ required: true, resolved: Boolean(nearestState) }), requirementDescriptionId)} value={props.orderNearestStateContext} onChange={(event) => props.onOrderNearestStateChange(event.target.value)}><option value="">Choose a state…</option>{getNearestStateOptions().map((entry) => <option key={entry.id} value={entry.id}>{entry.affiliationName}</option>)}</select>
                </label>
                <label htmlFor="stage0-order-language">Nearest-state language
                  <select id="stage0-order-language" {...controlStatusProps(controlStatus({ required: true, resolved: nearestLanguages.includes(props.orderSecondaryLanguage), disabled: !nearestState }), requirementDescriptionId)} value={props.orderSecondaryLanguage} disabled={!nearestState} onChange={(event) => props.onOrderSecondaryLanguageChange(event.target.value)}><option value="">{nearestState ? 'Choose a language…' : 'Choose a state first…'}</option>{nearestLanguages.map((language) => <option key={language}>{language}</option>)}</select>
                </label>
                <label htmlFor="stage0-order-technician">Technician subskill
                  <select id="stage0-order-technician" {...controlStatusProps(controlStatus({ required: true, resolved: TECHNICIAN_SUBSKILLS.includes(props.orderTechnicianSubskill as (typeof TECHNICIAN_SUBSKILLS)[number]) }), requirementDescriptionId)} value={props.orderTechnicianSubskill} onChange={(event) => props.onOrderTechnicianSubskillChange(event.target.value)}><option value="">Choose a Technician subskill…</option>{TECHNICIAN_SUBSKILLS.map((skill) => <option key={skill}>{skill}</option>)}</select>
                </label>
              </div>
              <small>Characters with this affiliation may not possess Extra Income or Property.</small>
            </div>}
              </div>
            </div>
            {capellanSelected && <div className="stage0-secondary-action">
              <div><h4>{subSelected ? 'Capellan Confederation / Capellan Commonality' : 'Capellan Confederation'}</h4><p>150 XP · full affiliation cost{subSelected ? ' with the selected sub-affiliation package' : ' with no sub-affiliation awards'}.</p></div>
              <label htmlFor="stage0-secondary-language">Capellan secondary-language award
                <select id="stage0-secondary-language" {...controlStatusProps(controlStatus({ required: true, resolved: secondaryLanguages.includes(props.secondaryLanguage) }), requirementDescriptionId)} value={props.secondaryLanguage} onChange={(event) => props.onSecondaryLanguageChange(event.target.value)}>
                  <option value="" disabled>Choose a secondary language…</option>
                  {secondaryLanguages.map((language) => <option key={language}>{language}</option>)}
                </select>
                <small>This award remains unresolved until you choose a listed language.</small>
              </label>
            </div>}
            {davionSelected && <div className="stage0-secondary-action davion-choices">
              <div><h4>{subSelected ? 'Federated Suns / Crucis March' : 'Federated Suns'}</h4><p>150 XP · full affiliation cost{subSelected ? ' with the Crucis March package' : ' with no sub-affiliation awards'}.</p></div>
              <div className="stage0-choice-grid">
                <label htmlFor="stage0-davion-aptitude">Natural Aptitude award
                  <select id="stage0-davion-aptitude" {...controlStatusProps(controlStatus({ required: true, resolved: ['Protocol', 'Strategy'].includes(props.davionNaturalAptitude) }), requirementDescriptionId)} value={props.davionNaturalAptitude} onChange={(event) => props.onDavionNaturalAptitudeChange(event.target.value)}>
                    <option value="">Choose an aptitude…</option><option>Protocol</option><option>Strategy</option>
                  </select>
                </label>
                {subSelected && <label htmlFor="stage0-davion-art">Crucis March Art award
                  <select id="stage0-davion-art" {...controlStatusProps(controlStatus({ required: true, resolved: props.davionArt === 'Painting' }), requirementDescriptionId)} value={props.davionArt} onChange={(event) => props.onDavionArtChange(event.target.value)}>
                    <option value="">Choose a supported Art subskill…</option><option>Painting</option>
                  </select>
                </label>}
              </div>
            </div>}
            <p id={requirementDescriptionId} className="sr-only">Complete each marked required control before continuing. Disabled controls become available after their prerequisite selection.</p>
            {affiliationReady && <div className="stage0-requirements ready" role="status"><p>Previewing selected Stage 0 choices. Continue to apply them and advance to Stage 1.</p></div>}
          </div>
        : <p className="stage0-package-pending">Complete the legacy compatibility step above to unlock the affiliation package.</p>}
    </section>
  </div>
}
