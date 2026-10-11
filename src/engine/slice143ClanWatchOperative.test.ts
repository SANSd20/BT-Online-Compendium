import { describe, expect, it } from 'vitest'
import { clanBirthOriginState, clanCasteState, clanIdentityState } from '../domain/character/clanIdentity'
import { createLifeModuleCharacter, buildLifeModuleTransaction } from './lifeModuleEngine'

function fixture(category: 'homeworld-clan' | 'invader-clan') {
  const character = createLifeModuleCharacter('Slice 143 disposable', 5000)
  character.clanIdentity = clanIdentityState()
  character.clanCaste = clanCasteState('warrior')
  character.clanBirthOrigin = clanBirthOriginState('trueborn')
  character.affiliations.push({ affiliationId: 'affiliation.clan', role: 'final', provenanceId: 'slice143-test' })
  character.creation.lifeModules!.stage0AffiliationContext = category === 'homeworld-clan' ? 'stage0.clan.homeworld-clan' : 'stage0.clan.invading-clan'
  character.lifeModuleHistory.push({ moduleId: 'stage2.trueborn-sibko', displayName: 'Trueborn Sibko', stage: 2, costXp: 1600, chronologyYears: 16, selectedAt: new Date().toISOString(), provenanceIds: [], source: { sourceId: 'slice143-test', edition: 'test' }, notes: [] })
  return character
}

const choices = { 'watch.tracking': 'Wilderness', 'homeworld.security-systems': 'Security', 'homeworld.streetwise': 'Clan Wolf', 'homeworld.survival': 'Wilderness', 'homeworld.technician': 'Vehicle' }

describe('Slice 143 Clan Watch Operative', () => {
  it.each(['homeworld-clan', 'invader-clan'] as const)('commits the %s branch with exact chronology and flexible XP', (branch) => {
    const transaction = buildLifeModuleTransaction(fixture(branch), [{ kind: 'grant-clan-watch-operative', branch, choices: branch === 'homeworld-clan' ? choices : { 'watch.tracking': 'Wilderness', 'invader.streetwise': 'Clan', 'invader.survival': 'Wilderness' } }])
    expect(transaction.errors).toEqual([])
    expect(transaction.prospectiveState?.lifeModuleHistory.at(-1)).toMatchObject({ moduleId: 'stage4.clan-watch-operative', costXp: 1200, chronologyYears: 3 })
    expect(transaction.prospectiveState?.creation.lifeModules?.pendingAwards.at(-1)).toMatchObject({ remainingXp: 175 })
    expect(transaction.prospectiveState?.provenance.at(-1)?.source?.page).toBe(84)
  })

  it('rejects a mismatched branch atomically', () => {
    const character = fixture('homeworld-clan')
    const transaction = buildLifeModuleTransaction(character, [{ kind: 'grant-clan-watch-operative', branch: 'invader-clan', choices: { 'watch.tracking': 'Wilderness', 'invader.streetwise': 'Clan', 'invader.survival': 'Wilderness' } }])
    expect(transaction.status).toBe('failed')
    expect(transaction.prospectiveState).toBeNull()
    expect(character.lifeModuleHistory).toHaveLength(2)
  })

  it('round-trips the committed branch without replaying awards', () => {
    const transaction = buildLifeModuleTransaction(fixture('homeworld-clan'), [{ kind: 'grant-clan-watch-operative', branch: 'homeworld-clan', choices }])
    const committed = transaction.prospectiveState!
    const resumed = JSON.parse(JSON.stringify(committed)) as typeof committed
    expect(resumed.lifeModuleHistory.filter((entry) => entry.moduleId === 'stage4.clan-watch-operative')).toHaveLength(1)
    expect(resumed.creation.lifeModules?.pendingAwards.at(-1)?.remainingXp).toBe(175)
    expect(resumed.xp.creation.allocated).toBe(committed.xp.creation.allocated)
  })
})
