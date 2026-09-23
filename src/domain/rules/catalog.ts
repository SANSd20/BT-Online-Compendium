import type { RulesCatalog, RulesSnapshot } from './model'

export const BETA_1_RULES_CATALOG: RulesCatalog = {
  id: 'atow.core-companion',
  version: 'beta-1-slice-3',
  sources: [
    {
      id: 'atow-core-corrected-third',
      title: 'A Time of War — Corrected Third Printing',
      edition: 'Corrected Third Printing',
      role: 'primary',
    },
    {
      id: 'atow-errata',
      title: 'A Time of War Errata',
      edition: 'v4.0',
      role: 'errata',
    },
    {
      id: 'atow-companion-corrected-first',
      title: 'A Time of War Companion',
      edition: 'First Printing Corrected',
      errataVersion: '1.1',
      role: 'supplemental',
    },
  ],
  // Slices 2-3 add focused creation-method catalogs separately; general rules data entry remains deferred.
  rules: [],
}

export function createRulesSnapshot(capturedAt: string): RulesSnapshot {
  return {
    catalogId: BETA_1_RULES_CATALOG.id,
    catalogVersion: BETA_1_RULES_CATALOG.version,
    capturedAt,
    sources: BETA_1_RULES_CATALOG.sources.map((source) => ({ ...source })),
    optionalRules: [],
  }
}
