import { describe, expect, it } from 'vitest'
import { CLAN_BIRTH_ORIGINS, CLAN_CASTE_IDS, CLAN_IDENTITY_ID, clanBirthOriginState, clanCasteState, clanFieldAptitudeState, clanIdentityState, isClanBirthOrigin, isClanCasteId } from './clanIdentity'
import { createCharacterFromArchetype } from '../../engine/archetypeFactory'
import { encodeCharacter, decodeCharacter } from '../../persistence/characterCodec'
import { validateCharacter } from '../../validation/validateCharacter'

describe('Clan identity and caste foundation', () => {
  it('defines stable unsupported identity and caste records with provenance', () => {
    expect(CLAN_IDENTITY_ID).toBe('affiliation.clan')
    expect(CLAN_CASTE_IDS).toEqual(['warrior', 'scientist', 'merchant', 'technician', 'laborer'])
    expect(clanIdentityState()).toMatchObject({ id: 'affiliation.clan', support: 'unsupported', source: { page: 63 } })
    expect(clanCasteState('warrior')).toMatchObject({ id: 'warrior', displayName: 'Warrior', support: 'unsupported', source: { ruleId: 'clan-caste-foundation' } })
  })

  it('rejects unknown caste identities without exposing a fallback', () => {
    expect(isClanCasteId('warrior')).toBe(true)
    expect(isClanCasteId('unknown')).toBe(false)
    expect(isClanCasteId(undefined)).toBe(false)
  })

  it('preserves unsupported Trueborn/Freeborn and mechanically defined Field Aptitude metadata', () => {
    expect(CLAN_BIRTH_ORIGINS).toEqual(['trueborn', 'freeborn'])
    expect(isClanBirthOrigin('trueborn')).toBe(true)
    expect(isClanBirthOrigin('unknown')).toBe(false)
    expect(clanBirthOriginState('trueborn')).toMatchObject({ support: 'unsupported', source: { page: 109 } })
    expect(clanFieldAptitudeState('phenotype.mechwarrior', ['field.clan-mechwarrior'])).toMatchObject({ support: 'supported', phenotypeId: 'phenotype.mechwarrior', source: { page: 121 } })
  })

  it('round-trips optional unsupported Clan state without changing XP or character identity', () => {
    const character = createCharacterFromArchetype('archetype.core.mechwarrior', 'Clan foundation fixture', { now: () => '2026-01-01T00:00:00.000Z', id: (() => { let n = 0; return () => `fixture-${++n}` })() })
    character.clanIdentity = clanIdentityState()
    character.clanCaste = clanCasteState('warrior')
    character.clanBirthOrigin = clanBirthOriginState('trueborn')
    character.clanFieldAptitude = clanFieldAptitudeState('phenotype.mechwarrior', ['field.clan-mechwarrior'])
    const beforeXp = JSON.stringify(character.xp)
    const encoded = encodeCharacter(character)
    expect(() => decodeCharacter(encoded)).toThrow('Clan character import is not enabled')
    const restored = decodeCharacter(encoded, { allowInternalClanRecord: true })
    expect(restored.id).toBe(character.id)
    expect(restored.clanIdentity).toEqual(character.clanIdentity)
    expect(restored.clanCaste).toEqual(character.clanCaste)
    expect(restored.clanBirthOrigin).toEqual(character.clanBirthOrigin)
    expect(restored.clanFieldAptitude).toEqual(character.clanFieldAptitude)
    expect(JSON.stringify(restored.xp)).toBe(beforeXp)
    expect(validateCharacter(restored).issues).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 'clan.identity.unsupported', severity: 'warning' }),
      expect.objectContaining({ id: 'clan.caste.unsupported', severity: 'warning' }),
    ]))
  })
})
