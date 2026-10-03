import { describe, expect, it } from 'vitest'
import { getLifeModule, INTELLIGENCE_OPERATIVE_TRAINING_ID, MILITARY_ACADEMY_ID, MILITARY_ENLISTMENT_ID, POLICE_ACADEMY_ID, TECHNICAL_COLLEGE_ID } from './catalog'

const offers = (moduleId: string) => getLifeModule(moduleId).skillFieldSelection!.offers.map(({ fieldId, category, chronologyYears }) => ({ fieldId, category, chronologyYears }))

describe('Alpha Slice 68 promoted Stage 3 Field offers', () => {
  it('exposes each promoted Field through its source-listed schools and durations', () => {
    expect(offers(TECHNICAL_COLLEGE_ID)).toEqual(expect.arrayContaining([
      { fieldId: 'field.communications', category: 'basic', chronologyYears: 1 },
      { fieldId: 'field.pilot-aircraft-civilian', category: 'basic', chronologyYears: 1 },
      { fieldId: 'field.engineer', category: 'advanced', chronologyYears: 2 },
      { fieldId: 'field.merchant-marine', category: 'advanced', chronologyYears: 2 },
    ]))
    expect(offers(POLICE_ACADEMY_ID)).toEqual(expect.arrayContaining([
      { fieldId: 'field.analysis', category: 'advanced', chronologyYears: 1 },
      { fieldId: 'field.communications', category: 'advanced', chronologyYears: 1 },
      { fieldId: 'field.covert-operations', category: 'special', chronologyYears: 2 },
      { fieldId: 'field.police-tactical-officer', category: 'special', chronologyYears: 2 },
      { fieldId: 'field.special-forces', category: 'special', chronologyYears: 2 },
    ]))
    expect(offers(INTELLIGENCE_OPERATIVE_TRAINING_ID)).toEqual(expect.arrayContaining([
      { fieldId: 'field.analysis', category: 'advanced', chronologyYears: 1 },
      { fieldId: 'field.covert-operations', category: 'advanced', chronologyYears: 1 },
      { fieldId: 'field.police-tactical-officer', category: 'special', chronologyYears: 2 },
      { fieldId: 'field.special-forces', category: 'special', chronologyYears: 2 },
    ]))
    expect(offers(MILITARY_ACADEMY_ID)).toEqual(expect.arrayContaining([
      { fieldId: 'field.analysis', category: 'advanced', chronologyYears: 1 },
      { fieldId: 'field.scientist', category: 'advanced', chronologyYears: 1 },
      { fieldId: 'field.doctor', category: 'special', chronologyYears: 2 },
      { fieldId: 'field.military-scientist', category: 'special', chronologyYears: 2 },
      { fieldId: 'field.special-forces', category: 'special', chronologyYears: 2 },
    ]))
    expect(offers(MILITARY_ENLISTMENT_ID)).toEqual(expect.arrayContaining([
      { fieldId: 'field.medical-assistant', category: 'advanced', chronologyYears: 1.5 },
      { fieldId: 'field.police-officer', category: 'advanced', chronologyYears: 1.5 },
      { fieldId: 'field.detective', category: 'special', chronologyYears: 1 },
      { fieldId: 'field.police-tactical-officer', category: 'special', chronologyYears: 1 },
      { fieldId: 'field.technician-aerospace', category: 'special', chronologyYears: 1 },
      { fieldId: 'field.technician-mech', category: 'special', chronologyYears: 1 },
      { fieldId: 'field.technician-vehicle', category: 'special', chronologyYears: 1 },
      { fieldId: 'field.special-forces', category: 'special', chronologyYears: 1 },
    ]))
  })
})
