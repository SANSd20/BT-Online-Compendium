import { describe, expect, it } from 'vitest'
import { controlStatus, controlStatusProps } from './controlStatus'

describe('generic required-control status', () => {
  it('distinguishes unresolved, invalid, disabled, optional, and resolved controls', () => {
    expect(controlStatus({ required: true })).toBe('required-unresolved')
    expect(controlStatus({ required: true, resolved: true })).toBe('valid')
    expect(controlStatus({ required: true, resolved: true, invalid: true })).toBe('invalid')
    expect(controlStatus({ required: true, disabled: true })).toBe('disabled')
    expect(controlStatus({ required: false })).toBe('optional-empty')
  })

  it('exposes semantic invalid state only for concrete errors', () => {
    expect(controlStatusProps('invalid', 'choice-error')).toEqual({ 'data-control-status': 'invalid', 'aria-invalid': true, 'aria-required': undefined, 'aria-describedby': 'choice-error' })
    expect(controlStatusProps('required-unresolved', 'choice-help')).toEqual({ 'data-control-status': 'required-unresolved', 'aria-invalid': undefined, 'aria-required': true, 'aria-describedby': 'choice-help' })
    expect(controlStatusProps('disabled')).toEqual({ 'data-control-status': 'disabled', 'aria-invalid': undefined, 'aria-required': undefined, 'aria-describedby': undefined })
    expect(controlStatusProps('valid')).toEqual({ 'data-control-status': 'valid', 'aria-invalid': undefined, 'aria-required': undefined, 'aria-describedby': undefined })
  })
})
