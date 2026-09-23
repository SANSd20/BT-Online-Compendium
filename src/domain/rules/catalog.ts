import type { RulesCatalog, RulesSnapshot } from './model'

export const ALPHA_RULES_CATALOG: RulesCatalog = {
  id: 'atow.core-companion',
  version: 'alpha-slice-7',
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
  // Slices 2-4 add focused creation-method catalogs separately; general rules data entry remains deferred.
  rules: [],
}

export function createRulesSnapshot(capturedAt: string): RulesSnapshot {
  return {
    catalogId: ALPHA_RULES_CATALOG.id,
    catalogVersion: ALPHA_RULES_CATALOG.version,
    capturedAt,
    sources: ALPHA_RULES_CATALOG.sources.map((source) => ({ ...source })),
    optionalRules: [],
  }
}
