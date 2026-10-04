export type ControlStatus = 'valid' | 'required-unresolved' | 'invalid' | 'disabled' | 'optional-empty'

export function controlStatus({
  required = false,
  resolved = false,
  invalid = false,
  disabled = false,
}: {
  required?: boolean
  resolved?: boolean
  invalid?: boolean
  disabled?: boolean
}): ControlStatus {
  if (disabled) return 'disabled'
  if (invalid) return 'invalid'
  if (required && !resolved) return 'required-unresolved'
  if (!required && !resolved) return 'optional-empty'
  return 'valid'
}

export function controlStatusProps(status: ControlStatus, describedBy?: string) {
  return {
    'data-control-status': status,
    'aria-invalid': status === 'invalid' ? true : undefined,
    'aria-required': status === 'required-unresolved' ? true : undefined,
    'aria-describedby': describedBy || undefined,
  } as const
}
