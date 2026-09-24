import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { APP_VERSION } from '../../appMetadata'
import { EQUIPMENT_CATALOG } from '../../domain/equipment/catalog'
import { PublicAlphaNotice } from './PublicAlphaNotice'

describe('Public Alpha notice', () => {
  it('renders the version, local-only warning, portability path, and deferred capabilities', () => {
    const markup = renderToStaticMarkup(<PublicAlphaNotice />)

    expect(markup).toContain('Public Alpha Notice')
    expect(markup).toContain(`v${APP_VERSION}`)
    expect(markup).toContain('stored only in this browser')
    expect(markup).toContain('Clearing browser data may remove saved work')
    expect(markup).toContain('export JSON backups')
    expect(markup).toContain('No ChatGPT or app login is required')
    expect(markup).toContain('no backend or cloud save exists')
    expect(markup).toContain('planned before v1.0')
    expect(markup).toContain('Core <em>A Time of War</em> first')
    expect(markup).toContain('Companion support later')
    expect(markup).toContain('does not guarantee a finalized or play-ready character')
    expect(markup).toContain('PDF export is not yet available')
  })

  it('does not change the Slice 18 equipment catalog', () => {
    expect(EQUIPMENT_CATALOG).toHaveLength(84)
    expect(new Set(EQUIPMENT_CATALOG.map((item) => item.id)).size).toBe(84)
  })
})
