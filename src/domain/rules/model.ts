export type RuleOperation =
  | 'REQUIRE'
  | 'PROHIBIT'
  | 'LIMIT'
  | 'REPLACE'
  | 'CLASSIFY'
  | 'MODIFY'
  | 'GRANT'

export type RuleConditionKind =
  | 'prerequisite'
  | 'availability'
  | 'era'
  | 'path'
  | 'source-exception'
  | 'gm-override'

export interface SourceCitation {
  sourceId: string
  edition: string
  errataVersion?: string
  page?: number
  ruleId?: string
}

export interface RulesSourceDescriptor {
  id: string
  title: string
  edition: string
  errataVersion?: string
  role: 'primary' | 'errata' | 'supplemental'
}

export interface RuleDefinition {
  id: string
  name: string
  operation: RuleOperation
  conditionKind: RuleConditionKind
  source: SourceCitation
}

export interface RulesCatalog {
  id: string
  version: string
  sources: RulesSourceDescriptor[]
  rules: RuleDefinition[]
}

export interface OptionalRuleSetting {
  ruleId: string
  enabled: boolean
  source?: SourceCitation
}

export interface RulesSnapshot {
  catalogId: string
  catalogVersion: string
  capturedAt: string
  sources: RulesSourceDescriptor[]
  optionalRules: OptionalRuleSetting[]
}

export interface GmException {
  id: string
  ruleId: string
  approved: boolean
  note?: string
}

