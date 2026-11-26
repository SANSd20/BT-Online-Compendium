import { describe, expect, it } from 'vitest'
import artifact from './generated/fwl-export.json'
import { dataDrivenRecordsFromArdExport, EXPECTED_ARD_DIGEST, EXPECTED_ARD_REVISION, validateArdFwlExport } from './ardExportAdapter'

describe('ARE ARD export adapter', () => {
  it('loads the pinned export and recognizes all six contexts', () => {
    const records = dataDrivenRecordsFromArdExport()
    expect(records).toHaveLength(6)
    expect(records.map((record) => record.id)).toEqual(expect.arrayContaining(['stage0.free-worlds-league', 'stage0.free-worlds-league.other-worlds']))
  })
  it('pins revision and digest and rejects invalid metadata', () => {
    expect(EXPECTED_ARD_REVISION).toBe('c83652c36cb5078aaadc072dea5f57dcad1fd563')
    expect(EXPECTED_ARD_DIGEST).toBe('e48a2b5859fbf2bca453a901908a7c2102a38d5bfa05d5a90d06c0d09f6f51e9')
    expect(() => validateArdFwlExport({ ...artifact, contentDigest: 'bad' })).toThrow('digest')
  })
})
