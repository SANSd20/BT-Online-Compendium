import { APP_PHASE, APP_VERSION } from '../../appMetadata'

export function PublicAlphaNotice({ defaultExpanded = false }: { defaultExpanded?: boolean }) {
  return (
    <aside className="public-alpha-notice" aria-labelledby="public-alpha-title">
      <details open={defaultExpanded}>
        <summary>
          <div className="public-alpha-heading">
            <div>
              <p className="eyebrow">{APP_PHASE}</p>
              <h2 id="public-alpha-title">Public Alpha Notice</h2>
              <p className="public-alpha-summary">Local-only Alpha · incomplete rules and equipment coverage</p>
            </div>
            <span className="version-badge">v{APP_VERSION}</span>
          </div>
          <span className="public-alpha-toggle"><span className="when-closed">Show details</span><span className="when-open">Hide details</span></span>
        </summary>
        <div className="public-alpha-details">
          <p>
            This is an incomplete local-first Alpha version of the <em>A Time of War</em> character creator.
            Rules coverage, equipment coverage, final validation, and PDF export are not complete.
          </p>
          <ul>
            <li><strong>Public access:</strong> The hosted Alpha opens at a normal browser URL. No special platform login is required.</li>
            <li><strong>Local storage only:</strong> Character data is stored only in this browser. Clearing browser data may remove saved work, so export JSON backups for portability.</li>
            <li><strong>No accounts yet:</strong> No application account is required in this Alpha, and no backend or cloud save exists. Account, login, and cloud save are planned before v1.0.</li>
            <li><strong>Incomplete coverage:</strong> The current scope is Core <em>A Time of War</em> first, with Companion support later. This Alpha does not guarantee a finalized or play-ready character.</li>
            <li><strong>Current portability:</strong> JSON export/import is available. PDF export is not yet available.</li>
          </ul>
        </div>
      </details>
    </aside>
  )
}
