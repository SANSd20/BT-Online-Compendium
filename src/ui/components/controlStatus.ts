export type ControlStatus = 'valid' | 'error' | 'disabled' | 'optional'

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
  if (invalid || (required && !resolved)) return 'error'
  if (!required && !resolved) return 'optional'
  return 'valid'
}

export function controlStatusProps(status: ControlStatus, describedBy?: string) {
  return {
    'data-control-status': status,
    'aria-invalid': status === 'error' ? true : undefined,
    'aria-describedby': describedBy || undefined,
  } as const
}
