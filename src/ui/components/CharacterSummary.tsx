import type { CharacterDefinition } from '../../domain/character/model'

interface CharacterSummaryProps {
  character: CharacterDefinition
}

export function CharacterSummary({ character }: CharacterSummaryProps) {
  const source = character.creation.archetype?.source

  return (
    <section className="character-sheet" aria-labelledby="character-result-heading">
      <div className="sheet-heading">
        <div>
          <p className="eyebrow">Created character</p>
          <h2 id="character-result-heading">{character.displayName}</h2>
          <p>{character.creation.archetype?.displayName} · {character.xp.creation.starting.toLocaleString()} XP declared · {character.xp.creation.allocated.toLocaleString()} XP listed</p>
        </div>
        <dl className="source-card">
          <div><dt>Source</dt><dd>Corrected Third Printing</dd></div>
          <div><dt>Page</dt><dd>{source?.page}</dd></div>
          <div><dt>C-bills</dt><dd>{character.cBills.toLocaleString()}</dd></div>
          <div><dt>Phenotype</dt><dd>{character.phenotypeId.replace('phenotype.', '')}</dd></div>
        </dl>
      </div>

      {character.creation.archetype?.notes.map((note) => (
        <p className="notice" key={note.code}>{note.message}</p>
      ))}

      <div className="sheet-grid">
        <section>
          <h3>Attributes</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Attribute</th><th>Base</th><th>Phenotype</th><th>Effective</th><th>XP</th></tr></thead>
              <tbody>
                {character.attributes.map((attribute) => (
                  <tr key={attribute.attributeId}>
                    <th>{attribute.attributeId}</th>
                    <td>{attribute.purchasedLevel}</td>
                    <td>{formatModifier(attribute.phenotypeModifier)}</td>
                    <td>{(attribute.purchasedLevel ?? 0) + attribute.phenotypeModifier}</td>
                    <td>{attribute.accumulatedXp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h3>Traits</h3>
          <div className="table-wrap">
            <table>
              <thead><tr><th>Trait</th><th>TP</th><th>XP</th><th>Scope</th></tr></thead>
              <tbody>
                {character.traits.map((trait, index) => (
                  <tr key={`${trait.traitId}-${index}`}>
                    <th>{trait.displayName ?? formatRuleName(trait.traitId, trait.parameters)}</th>
                    <td>{trait.attainedTp}</td>
                    <td>{trait.accumulatedXp}</td>
                    <td>{trait.identityId ? 'Identity' : 'Character'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <details open>
        <summary>Skills ({character.skills.length})</summary>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Skill</th><th>Specialty</th><th>Level</th><th>XP</th></tr></thead>
            <tbody>
              {character.skills.map((skill) => (
                <tr key={`${skill.address.skillId}-${skill.address.parameter?.value ?? ''}`}>
                  <th>{skill.displayName ?? formatSkill(skill.address.skillId, skill.address.parameter?.value)}</th>
                  <td>{skill.specialty ?? '—'}</td>
                  <td>{skill.level}</td>
                  <td>{skill.accumulatedXp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <details>
        <summary>Starting equipment ({character.inventory.length})</summary>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Item</th><th>Qty.</th><th>Ownership</th><th>Published cost</th><th>Weight</th></tr></thead>
            <tbody>
              {character.inventory.map((item) => (
                <tr key={item.id}>
                  <th>{item.displayName}</th>
                  <td>{item.quantity}</td>
                  <td>{item.ownership}{item.publishedOwnershipLabel ? ` (${item.publishedOwnershipLabel} in source)` : ''}</td>
                  <td>{formatCost(item.publishedCostCBills, item.publishedAdditionalCostCBills)}</td>
                  <td>{item.publishedWeightKg} kg</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>

      <details>
        <summary>Provenance ({character.provenance.length})</summary>
        <ul className="provenance-list">
          {character.provenance.map((entry) => (
            <li key={entry.id}>
              <strong>{entry.kind}</strong> — {entry.description}
              {entry.source?.page ? ` (p. ${entry.source.page})` : ''}
            </li>
          ))}
        </ul>
      </details>
    </section>
  )
}

function formatModifier(value: number): string {
  return value >= 0 ? `+${value}` : String(value)
}

function formatSkill(skillId: string, subskill?: string): string {
  const root = skillId.replace('skill.', '').split('-').map(capitalize).join(' ')
  return subskill ? `${root}/${subskill}` : root
}

function formatRuleName(traitId: string, parameters: Record<string, string | number | boolean>): string {
  const root = traitId.replace('trait.', '').split('-').map(capitalize).join(' ')
  const qualifier = parameters.subtype ?? parameters.enemy ?? parameters.phenotype
  return qualifier ? `${root}/${qualifier}` : root
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1)
}

function formatCost(base?: number, additional?: number): string {
  if (base === undefined) return '—'
  return additional === undefined ? `${base} C-bills` : `${base} (+${additional}) C-bills`
}
