import { describe, expect, it } from 'vitest'
import { genericStage0ChoiceState, genericStage0Packages } from './genericStage0Metadata'

describe('generic Stage 0 pilot metadata', () => {
  it('generates the six ARD packages without faction-specific UI metadata', () => {
    const packages = genericStage0Packages()
    expect(packages).toHaveLength(6)
    expect(packages.map((entry) => entry.id)).toEqual([
      'affiliation.fwl.parent',
      'affiliation.fwl.duchy-of-andurien',
      'affiliation.fwl.duchy-of-oriente',
      'affiliation.fwl.marik-commonwealth',
      'affiliation.fwl.other-fwl-worlds',
      'affiliation.fwl.principality-of-regulus',
    ])
    expect(packages.every((entry) => entry.controls.every((control) => control.required))).toBe(true)
  })

  it('preserves repeated occurrence identity and generic flexible domains', () => {
    const other = genericStage0Packages().find((entry) => entry.id.endsWith('other-fwl-worlds'))!
    expect(other.controls.map((control) => control.id)).toContain('affiliation.fwl.other-fwl-worlds.skill-any/1')
    expect(other.controls.map((control) => control.id)).toContain('affiliation.fwl.other-fwl-worlds.skill-any/2')
    expect(other.controls.find((control) => control.id.endsWith('.flexible'))?.type).toBe('flexible')
    expect(genericStage0ChoiceState('affiliation.fwl.other-fwl-worlds').selections).toHaveLength(0)
  })
})
