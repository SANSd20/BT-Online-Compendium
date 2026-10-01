import { CAPELLAN_COMMONALITY_CONTEXT, getLifeModuleLanguageSelectorOptions, SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS } from '../../domain/lifeModules/affiliations'
import { Stage0UniversalStep } from './Stage0UniversalStep'

interface Stage0WizardStepProps {
  phase: 'stage-0-universal' | 'stage-0-affiliation'
  affiliationContext: string
  affiliationLanguage: string
  secondaryLanguage: string
  onContextChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onSecondaryLanguageChange: (value: string) => void
  onApplyUniversal: () => void
  onApplyAffiliation: () => void
}

export function Stage0WizardStep(props: Stage0WizardStepProps) {
  const universalComplete = props.phase === 'stage-0-affiliation'
  const context = SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.find((entry) => entry.id === props.affiliationContext)
  const affiliationLanguages = context ? getLifeModuleLanguageSelectorOptions(context.affiliationLanguageSelector) : []
  const affiliationReady = Boolean(context && props.affiliationLanguage && affiliationLanguages.includes(props.affiliationLanguage))

  return <div className="stage0-package-stack">
    <section className={`stage0-package-section ${universalComplete ? 'complete' : 'current'}`} aria-labelledby="stage0-universal-heading">
      <header className="stage0-package-heading">
        <div><p className="eyebrow">Mandatory baseline</p><h3 id="stage0-universal-heading">Universal Package</h3></div>
        <strong className="stage0-package-status">{universalComplete ? 'Complete' : 'Current'}</strong>
      </header>
      {universalComplete
        ? <div className="stage0-package-complete"><p><strong>Baseline Awards / Universal Fixed Experience Points are included in this draft.</strong> The affiliation-language award remains pending until the explicit choices below are applied.</p><p><strong>Universal remains non-affiliation.</strong></p></div>
        : <Stage0UniversalStep
            affiliationContext={props.affiliationContext}
            affiliationLanguage={props.affiliationLanguage}
            onContextChange={props.onContextChange}
            onLanguageChange={props.onLanguageChange}
            onApply={props.onApplyUniversal}
          />}
    </section>

    <section className={`stage0-package-section ${universalComplete ? 'current' : 'pending'}`} aria-labelledby="stage0-affiliation-heading">
      <header className="stage0-package-heading">
        <div><p className="eyebrow">Affiliation and sub-affiliation</p><h3 id="stage0-affiliation-heading">Affiliation Package</h3></div>
        <strong className="stage0-package-status">{universalComplete ? 'Current' : 'Next'}</strong>
      </header>
      {universalComplete
        ? <div className="stage0-affiliation-form">
            <p>Choose the context and linked Universal language explicitly, then apply the audited affiliation and sub-affiliation package.</p>
            <div className="stage0-choice-grid">
              <label htmlFor="stage0-affiliation-context">Affiliation context
                <select id="stage0-affiliation-context" value={props.affiliationContext} onChange={(event) => props.onContextChange(event.target.value)} title={context?.displayName ?? 'Choose an affiliation context'}>
                  <option value="">Choose an affiliation context…</option>
                  {SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.map((entry) => <option key={entry.id} value={entry.id} title={entry.displayName}>{entry.id === CAPELLAN_COMMONALITY_CONTEXT.id ? 'Capellan Confederation / Commonality' : entry.displayName}</option>)}
                </select>
              </label>
              <label htmlFor="stage0-affiliation-language">Affiliation language
                <select id="stage0-affiliation-language" value={props.affiliationLanguage} disabled={!context} onChange={(event) => props.onLanguageChange(event.target.value)}>
                  <option value="">{context ? 'Choose a language…' : 'Choose a context first…'}</option>
                  {affiliationLanguages.map((language) => <option key={language}>{language}</option>)}
                </select>
              </label>
            </div>
            <div className="life-action">
              <div><h4>Capellan Confederation / Capellan Commonality</h4><p>150 XP · the audited Alpha affiliation and sub-affiliation package.</p></div>
            <label>Capellan secondary-language award
              <select value={props.secondaryLanguage} onChange={(event) => props.onSecondaryLanguageChange(event.target.value)}>
                <option value="">Leave pending for explicit resolution…</option>
                {getLifeModuleLanguageSelectorOptions(CAPELLAN_COMMONALITY_CONTEXT.secondaryLanguageSelector).map((language) => <option key={language}>{language}</option>)}
              </select>
            </label>
              <button className="button" type="button" disabled={!affiliationReady} onClick={props.onApplyAffiliation}>Apply</button>
            </div>
          </div>
        : <p className="stage0-package-pending">Apply the Universal Package first. This affiliation package remains visible here and will unlock without becoming a separate wizard step.</p>}
    </section>
  </div>
}
