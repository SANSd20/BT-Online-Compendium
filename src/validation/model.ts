export type ValidationSeverity = 'error' | 'warning' | 'information'
export type ValidationKind =
  | 'hard-requirement'
  | 'prerequisite'
  | 'availability'
  | 'campaign-configuration'
  | 'gm-arbitrable'
  | 'unresolved'

export interface ValidationIssue {
  id: string
  severity: ValidationSeverity
  kind: ValidationKind
  path: string
  message: string
  ruleId?: string
  gmOverrideAllowed: boolean
}

export interface ValidationResult {
  valid: boolean
  issues: ValidationIssue[]
}

