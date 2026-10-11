import { renderToStaticMarkup } from 'react-dom/server'
import { describe, expect, it } from 'vitest'
import { clanIdentityState } from '../../domain/character/clanIdentity'
import { createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { ConditionalPackagePanel } from './ConditionalPackagePanel'

const packageDefinition = { id: 'package.test-clan', displayName: 'Test Clan package', source: { sourceId: 'test', edition: 'test' }, eligibility: [{ id: 'test.affiliation', kind: 'affiliation' as const, affiliationId: 'affiliation.clan', description: 'Clan affiliation' }], choices: [{ id: 'test.option', displayName: 'Test option', awards: [{ id: 'test.award', kind: 'fixed' as const, xp: 1, destination: { type: 'attribute' as const, attributeId: 'STR' } }] }] }

describe('Conditional Package panel visibility', () => {
  it('hides when no package is applicable and shows for a matching Clan context', () => {
    const character = createLifeModuleCharacter('Panel fixture')
    const props = { character, packages: [packageDefinition], onChange: () => undefined }
    expect(renderToStaticMarkup(<ConditionalPackagePanel {...props} />)).toBe('')
    character.clanIdentity = clanIdentityState()
    character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'birth', provenanceId: character.provenance[0]?.id ?? 'fixture' })
    expect(renderToStaticMarkup(<ConditionalPackagePanel {...props} />)).toContain('Test Clan package')
  })
})
