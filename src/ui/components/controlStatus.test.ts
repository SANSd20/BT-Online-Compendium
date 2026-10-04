import { describe, expect, it } from 'vitest'
import { controlStatus, controlStatusProps } from './controlStatus'

describe('generic required-control status', () => {
  it('distinguishes unresolved, invalid, disabled, optional, and resolved controls', () => {
    expect(controlStatus({ required: true })).toBe('error')
    expect(controlStatus({ required: true, resolved: true })).toBe('valid')
    expect(controlStatus({ required: true, resolved: true, invalid: true })).toBe('error')
    expect(controlStatus({ required: true, disabled: true })).toBe('disabled')
    expect(controlStatus({ required: false })).toBe('optional')
  })

  it('exposes semantic invalid state only for concrete errors', () => {
    expect(controlStatusProps('error', 'choice-error')).toEqual({ 'data-control-status': 'error', 'aria-invalid': true, 'aria-describedby': 'choice-error' })
    expect(controlStatusProps('disabled')).toEqual({ 'data-control-status': 'disabled', 'aria-invalid': undefined, 'aria-describedby': undefined })
    expect(controlStatusProps('valid')).toEqual({ 'data-control-status': 'valid', 'aria-invalid': undefined, 'aria-describedby': undefined })
  })
})
