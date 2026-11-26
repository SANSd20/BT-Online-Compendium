import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { describe, expect, it } from 'vitest'
import { normalizeCanonicalExport } from './canonicalAreNormalization'

const capellanPath = 'C:/Users/boill/Documents/ChatGPT/AToW Codex/AToW-Reference-Data/exports/capellan-confederation-export.json'
const capellan = JSON.parse(readFileSync(capellanPath, 'utf8'))
const fwlPath = 'C:/Users/boill/Documents/ChatGPT/AToW Codex/AToW-Reference-Data/exports/free-worlds-league-export.json'
const fwl = JSON.parse(readFileSync(fwlPath, 'utf8'))
const revision = 'c83652c36cb5078aaadc072dea5f57dcad1fd563'
function redigest(value: Record<string, unknown>) { const copy = structuredClone(value); delete copy.contentDigest; copy.contentDigest = createHash('sha256').update(JSON.stringify(copy)).digest('hex'); return copy }

describe('generic canonical ARD to ARE normalization', () => {
  it('normalizes all six Capellan contexts and preserves restrictions', () => {
    const normalized = normalizeCanonicalExport(capellan, revision)
    expect(normalized.packages).toHaveLength(6)
    expect(normalized.packages.map((entry) => entry.identity)).toEqual([...normalized.packages].map((entry) => entry.identity).sort())
    expect(normalized.packages.filter((entry) => entry.parentId)).toHaveLength(5)
    expect(normalized.restrictions).toHaveLength(3)
    expect(normalized.dependencyIds).toContain('trait.citizenship')
    expect(normalized.packages.flatMap((entry) => entry.awards).some((award) => award.destination.type === 'skill' && award.destination.subject === 'subject.capellan')).toBe(true)
    expect(normalized.packages.flatMap((entry) => entry.choices).every((choice) => choice.occurrenceId.includes(':'))).toBe(true)
  })

  it('retains stable occurrence identities and parameterized destinations', () => {
    const normalized = normalizeCanonicalExport(capellan, revision)
    const sian = normalized.packages.find((entry) => entry.identity.endsWith('sian-commonality'))!
    expect(sian.choices).toEqual([expect.objectContaining({ domainId: 'domain.great-house.capellan.secondary-language', minimum: 1, maximum: 1 })])
    expect(sian.awards.find((award) => award.destination.type === 'trait' && award.destination.traitId === 'trait.citizenship')?.destination).toMatchObject({ subject: 'capellan' })
  })

  it('normalizes all six FWL contexts and preserves choice-level XP contracts', () => {
    const normalized = normalizeCanonicalExport(fwl, revision)
    expect(normalized.packages).toHaveLength(6)
    expect(normalized.packages.filter((entry) => entry.parentId)).toHaveLength(5)
    const other = normalized.packages.find((entry) => entry.identity.endsWith('other-fwl-worlds'))!
    expect(other.choices.map((choice) => choice.award?.xp)).toEqual([20, 35, 10, 10, 25])
    expect(other.choices.every((choice) => choice.award?.destinationBinding === 'SELECTED_CHOICE')).toBe(true)
    expect(new Set(other.choices.map((choice) => choice.occurrenceId)).size).toBe(5)
  })

  it('rejects tampering, unsupported effects, malformed domains, and missing parents', () => {
    expect(() => normalizeCanonicalExport({ ...capellan, contentDigest: 'tampered' }, revision)).toThrow('content digest')
    const unsupported = structuredClone(capellan)
    unsupported.records[0].mechanics.effects[0].effectType = 'UNSUPPORTED'
    const unsupportedRedigested = redigest(unsupported)
    expect(() => normalizeCanonicalExport(unsupportedRedigested, revision)).toThrow('unsupported effect')
    const badParent = structuredClone(capellan)
    badParent.records[1].contract.parentId = 'affiliation.missing'
    expect(() => normalizeCanonicalExport(redigest(badParent), revision)).toThrow('missing parent')
    const badChoiceAward = structuredClone(fwl)
    const badRecord = badChoiceAward.records.find((record: { id: string }) => record.id.endsWith('other-fwl-worlds')) as { mechanics: { choices: Array<{ choices: Array<{ award: { destinationBinding: string } }> }> } }
    badRecord.mechanics.choices[0].choices[0].award.destinationBinding = 'UNSUPPORTED'
    expect(() => normalizeCanonicalExport(redigest(badChoiceAward), revision)).toThrow('unsupported award contract')
  })

  it('supports an unfamiliar family without identity dispatch', () => {
    const synthetic = {
      ...structuredClone(capellan),
      family: 'synthetic-family',
      records: [
        { ...structuredClone(capellan.records[0]), id: 'affiliation.synthetic', displayName: 'Synthetic Parent', contract: { costXp: 150 } },
        { ...structuredClone(capellan.records[1]), id: 'affiliation.synthetic.child', displayName: 'Synthetic Child', contract: { costXp: 0, parentId: 'affiliation.synthetic' } },
      ],
      restrictionRecords: [],
      restrictionDependencyIds: [],
    }
    const normalized = normalizeCanonicalExport(redigest(synthetic), revision)
    expect(normalized.packages.map((entry) => entry.identity)).toEqual(['affiliation.synthetic', 'affiliation.synthetic.child'])
  })
})
