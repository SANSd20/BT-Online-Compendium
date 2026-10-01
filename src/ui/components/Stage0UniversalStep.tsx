import { CAPELLAN_COMMONALITY_CONTEXT, getLifeModuleLanguageSelectorOptions, SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS } from '../../domain/lifeModules/affiliations'

interface Stage0UniversalStepProps {
  affiliationContext: string
  affiliationLanguage: string
  onContextChange: (value: string) => void
  onLanguageChange: (value: string) => void
  onApply: () => void
}

export function Stage0UniversalStep({ affiliationContext, affiliationLanguage, onContextChange, onLanguageChange, onApply }: Stage0UniversalStepProps) {
  const context = SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.find((entry) => entry.id === affiliationContext)
  const languages = context ? getLifeModuleLanguageSelectorOptions(context.affiliationLanguageSelector) : []
  const ready = Boolean(context && affiliationLanguage && languages.includes(affiliationLanguage))

  return <div className="stage0-universal-step">
    <header className="stage0-universal-intro">
      <h3>Universal Fixed Experience Points</h3>
      <p>850 XP · +100 XP to every Attribute, two Language awards, and Perception +10 XP.</p>
      <p className="stage0-universal-helper"><strong>Universal is not an affiliation.</strong> Choose an affiliation context only to resolve its linked language award.</p>
    </header>

    <fieldset className="stage0-choice-card">
      <legend>Affiliation choices</legend>
      <div className="stage0-choice-grid">
        <label htmlFor="stage0-affiliation-context">Affiliation context
          <select id="stage0-affiliation-context" value={affiliationContext} onChange={(event) => onContextChange(event.target.value)} title={context?.displayName ?? 'Choose an affiliation context'}>
            <option value="">Choose an affiliation context…</option>
            {SUPPORTED_LIFE_MODULE_AFFILIATION_CONTEXTS.map((entry) => <option key={entry.id} value={entry.id} title={entry.displayName}>{entry.id === CAPELLAN_COMMONALITY_CONTEXT.id ? 'Capellan Confederation / Commonality' : entry.displayName}</option>)}
          </select>
          <small>This identifies the source-backed affiliation package used by the linked Language award.</small>
        </label>

        <label htmlFor="stage0-affiliation-language">Affiliation language
          <select id="stage0-affiliation-language" value={affiliationLanguage} disabled={!context} onChange={(event) => onLanguageChange(event.target.value)}>
            <option value="">{context ? 'Choose a language…' : 'Choose a context first…'}</option>
            {languages.map((language) => <option key={language}>{language}</option>)}
          </select>
          <small>{context ? `${CAPELLAN_COMMONALITY_CONTEXT.affiliationName} primary or secondary language.` : 'Available after an affiliation context is selected.'}</small>
        </label>
      </div>
      <div className="stage0-choice-action">
        <button className="button" type="button" disabled={!ready} onClick={onApply}>Apply universal package</button>
        {!ready && <span>Select both an affiliation context and language to continue.</span>}
      </div>
    </fieldset>
  </div>
}
