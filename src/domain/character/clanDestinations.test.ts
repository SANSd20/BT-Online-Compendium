import { describe, expect, it } from 'vitest'
import { resolveClanDestination } from './clanDestinations'

describe('Alpha Slice 165-B4 governed Clan destinations', () => {
  it('resolves concrete Skills, Clan Protocol, Traits, and language subjects canonically', () => {
    expect(resolveClanDestination('Interest/Clan History')).toMatchObject({ status: 'SUPPORTED_CONCRETE', canonicalId: 'skill.interest', subject: 'Clan History' })
    expect(resolveClanDestination('Protocol/Steel Viper')).toMatchObject({ status: 'SUPPORTED_CONCRETE', canonicalId: 'skill.protocol', subject: 'Steel Viper' })
    expect(resolveClanDestination('Combat Sense')).toMatchObject({ status: 'SUPPORTED_CONCRETE', canonicalId: 'trait.combat-sense' })
    expect(resolveClanDestination('Exceptional Attribute/WIL')).toMatchObject({ status: 'SUPPORTED_CONCRETE', canonicalId: 'trait.exceptional-attribute', subject: 'WIL' })
    expect(resolveClanDestination('Survival/Arctic')).toMatchObject({ status: 'SUPPORTED_CONCRETE', canonicalId: 'skill.survival', subject: 'Arctic' })
    expect(resolveClanDestination('Language/Secondary/Russian')).toMatchObject({ status: 'SUPPORTED_CONCRETE', canonicalId: 'skill.language', subject: 'Russian' })
    expect(resolveClanDestination('Survival/Unknown').status).toBe('UNSUPPORTED_DESTINATION')
  })
  it('preserves open /Any domains as governed, unresolved destinations', () => {
    expect(resolveClanDestination('Interest/Theology/Any')).toMatchObject({ status: 'SUPPORTED_GOVERNED_CHOICE', canonicalId: 'domain.theology' })
    expect(resolveClanDestination('Survival/Any')).toMatchObject({ status: 'SUPPORTED_GOVERNED_CHOICE', canonicalId: 'domain.survival' })
    expect(resolveClanDestination('Natural Aptitude/Any')).toMatchObject({ status: 'SUPPORTED_GOVERNED_CHOICE' })
    expect(resolveClanDestination('Interest/Unknown/Any').status).toBe('UNSUPPORTED_DESTINATION')
  })
})
