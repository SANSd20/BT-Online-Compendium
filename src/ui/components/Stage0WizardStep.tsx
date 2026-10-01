import { CAPELLAN_COMMONALITY_CONTEXT, getLifeModuleLanguageSelectorOptions } from '../../domain/lifeModules/affiliations'
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

  return <div className="stage0-package-stack">
    <section className={`stage0-package-section ${universalComplete ? 'complete' : 'current'}`} aria-labelledby="stage0-universal-heading">
      <header className="stage0-package-heading">
        <div><p className="eyebrow">Mandatory baseline</p><h3 id="stage0-universal-heading">Universal Package</h3></div>
        <strong className="stage0-package-status">{universalComplete ? 'Complete' : 'Current'}</strong>
      </header>
      {universalComplete
        ? <div className="stage0-package-complete"><p>Universal Package applied with the explicit affiliation context and linked language choice.</p><p><strong>Universal remains non-affiliation.</strong> The context only resolves its linked language award.</p></div>
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
        ? <div className="life-action">
            <div><h4>Capellan Confederation / Capellan Commonality</h4><p>150 XP · the audited Alpha affiliation and sub-affiliation package.</p></div>
            <label>Capellan secondary-language award
              <select value={props.secondaryLanguage} onChange={(event) => props.onSecondaryLanguageChange(event.target.value)}>
                <option value="">Leave pending for explicit resolution…</option>
                {getLifeModuleLanguageSelectorOptions(CAPELLAN_COMMONALITY_CONTEXT.secondaryLanguageSelector).map((language) => <option key={language}>{language}</option>)}
              </select>
            </label>
            <button className="button" type="button" onClick={props.onApplyAffiliation}>Apply</button>
          </div>
        : <p className="stage0-package-pending">Apply the Universal Package first. This affiliation package remains visible here and will unlock without becoming a separate wizard step.</p>}
    </section>
  </div>
}
