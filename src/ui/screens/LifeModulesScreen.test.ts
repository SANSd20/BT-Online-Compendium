import { describe, expect, it } from 'vitest'
import { shouldFocusLifeModuleStageHeading } from '../components/lifeModulesFocusBehavior'

describe('Life Modules local-mutation focus behavior', () => {
  it('focuses the stage heading when entering a phase', () => {
    expect(shouldFocusLifeModuleStageHeading('stage-2-selection', 'stage-3-selection', true)).toBe(true)
    expect(shouldFocusLifeModuleStageHeading(undefined, 'stage-0-affiliation', true)).toBe(true)
  })

  it('does not refocus the heading for same-phase local mutations', () => {
    expect(shouldFocusLifeModuleStageHeading('alpha-final-review', 'alpha-final-review', true)).toBe(false)
    expect(shouldFocusLifeModuleStageHeading('stage-3-selection', 'stage-3-selection', true)).toBe(false)
    expect(shouldFocusLifeModuleStageHeading('stage-3-selection', 'stage-4-selection', false)).toBe(false)
  })
})
