import type { CharacterDefinition } from '../../domain/character/model'
import type { ConditionalLifeModulePackageDefinition } from '../../domain/lifeModules/model'
import { resolveConditionalPackageDraft, selectConditionalPackageOption } from '../../engine/lifeModuleEngine'

interface ConditionalPackagePanelProps {
  character: CharacterDefinition
  packages: readonly ConditionalLifeModulePackageDefinition[]
  onChange: (character: CharacterDefinition) => void
  onContinue?: (character: CharacterDefinition) => void
}

export function ConditionalPackagePanel({ character, packages, onChange, onContinue }: ConditionalPackagePanelProps) {
  if (packages.length === 0) return null
  const draft = character.creation.lifeModules?.conditionalPackageDraft
  const selectedPackage = packages.find((entry) => entry.id === draft?.packageId)
  const selectedOption = selectedPackage?.choices.find((entry) => entry.id === draft?.choiceId)
  const selectPackage = (packageId: string) => {
    const definition = packages.find((entry) => entry.id === packageId)
    if (definition) onChange(selectConditionalPackageOption(character, definition, null))
  }
  const selectOption = (optionId: string) => {
    if (selectedPackage) onChange(selectConditionalPackageOption(character, selectedPackage, optionId, {}))
  }
  const selectNested = (choiceId: string, value: string) => {
    if (selectedPackage && selectedOption) onChange(selectConditionalPackageOption(character, selectedPackage, selectedOption.id, { ...(draft?.nestedSelections ?? {}), [choiceId]: value }))
  }
  return <section className="life-stage-panel conditional-package-panel" aria-labelledby="conditional-package-heading">
    <p className="eyebrow">Conditional package</p>
    <h2 id="conditional-package-heading">Choose one governed package</h2>
    <label htmlFor="conditional-package-select">Package
      <select id="conditional-package-select" value={draft?.packageId ?? ''} onChange={(event) => selectPackage(event.target.value)}>
        <option value="">Choose a package…</option>
        {packages.map((entry) => <option key={entry.id} value={entry.id}>{entry.displayName}</option>)}
      </select>
    </label>
    {selectedPackage && <label htmlFor="conditional-package-option">Option
      <select id="conditional-package-option" value={draft?.choiceId ?? ''} onChange={(event) => selectOption(event.target.value)}>
        <option value="">Choose an option…</option>
        {selectedPackage.choices.map((entry) => <option key={entry.id} value={entry.id} disabled={(entry.unsupportedReasons?.length ?? 0) > 0}>{entry.displayName}{entry.unsupportedReasons?.length ? ' · unavailable' : ''}</option>)}
      </select>
    </label>}
    {selectedOption && <>
      <div className="selected-module-detail" aria-live="polite">
        <h3>{selectedOption.displayName} preview</h3>
        <ul>{selectedOption.awards.map((award) => <li key={award.id}>{award.kind} · {award.id}</li>)}</ul>
        {selectedOption.nestedChoices?.map((choice) => <label key={choice.id} htmlFor={`conditional-nested-${choice.id}`}>{choice.label}
          <select id={`conditional-nested-${choice.id}`} value={draft?.nestedSelections[choice.id] ?? ''} onChange={(event) => selectNested(choice.id, event.target.value)}>
            <option value="">Choose a governed value…</option>
            {choice.validOptionIds.map((value) => <option key={value} value={value}>{value}</option>)}
          </select>
        </label>)}
        {draft?.errors.map((error) => <p className="error" key={error}>{error}</p>)}
        <p>{draft?.status === 'ready' ? 'Complete package preview is ready to validate and commit.' : 'Required package choices remain unresolved.'}</p>
        <button className="button" type="button" disabled={draft?.status !== 'ready'} onClick={() => onContinue?.(character)}>Continue with package</button>
      </div>
      {draft?.status === 'ready' && selectedPackage && <p className="sr-only">{resolveConditionalPackageDraft(character, selectedPackage).operations.length} governed award operations selected.</p>}
    </>}
  </section>
}
