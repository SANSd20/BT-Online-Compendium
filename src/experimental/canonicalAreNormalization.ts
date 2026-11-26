import { createHash } from 'node:crypto'

export type NormalizedAward = {
  occurrenceId: string
  destination: { type: 'attribute'; attributeId: string } | { type: 'trait'; traitId: string; subject?: string } | { type: 'skill'; skillId: string; subject?: string }
  xp: number
  provenance: { claimRefs: string[]; sourceLocators: Array<{ sourceId: string; printedPage: string; pdfPageIndex: number }> }
}

export type NormalizedChoice = {
  occurrenceId: string
  domainId: string
  minimum: number
  maximum: number
  required: boolean
  duplicatePolicy?: string
  branchPath: string[]
  award?: { xp: number; destinationBinding: 'SELECTED_CHOICE'; claimRefs: string[]; repeatBehavior: string; sourceLocators: Array<{ sourceId: string; printedPage: string; pdfPageIndex: number }> }
}

export type NormalizedPackage = {
  identity: string
  displayName: string
  exportIdentity: { format: string; schema: string; revision: string; digest: string }
  parentId?: string
  costXp: number
  awards: NormalizedAward[]
  choices: NormalizedChoice[]
  restrictions: readonly Record<string, unknown>[]
  dependencyIds: readonly string[]
  provenance: Array<{ claimId: string; sourceLocators: Array<{ sourceId: string; printedPage: string; pdfPageIndex: number }> }>
}

export type NormalizedExport = { metadata: NormalizedPackage['exportIdentity']; packages: NormalizedPackage[]; restrictions: readonly Record<string, unknown>[]; dependencyIds: readonly string[] }

type CanonicalRecord = { id: string; recordType: string; displayName?: string; parentId?: string; contract?: { costXp?: number; parentId?: string }; claims?: Array<{ id: string; sourceLocators?: Array<{ sourceId: string; printedPage: string; pdfPageIndex: number }> }>; mechanics?: { effects?: Array<Record<string, unknown>>; choices?: Array<Record<string, unknown>>; composition?: { includes?: Array<{ packageId: string }> } } }

function fail(message: string): never { throw new Error(`Canonical ARE normalization rejected: ${message}`) }

function destination(raw: Record<string, unknown>): NormalizedAward['destination'] {
  const kind = raw.kind
  const entityId = raw.entityId
  const address = raw.address as Record<string, unknown> | undefined
  const parameters = (address?.parameters as Array<{ name?: string; value?: string }> | undefined) ?? []
  const subject = typeof address?.subject === 'object' && address.subject ? (address.subject as { id?: string }).id : parameters.find((entry) => entry.name === 'subject')?.value
  if (kind === 'ATTRIBUTE' && typeof entityId === 'string' && /^attribute\.[a-z0-9-]+$/.test(entityId)) return { type: 'attribute', attributeId: entityId.slice('attribute.'.length).toUpperCase() }
  if (kind === 'TRAIT' && typeof address?.traitId === 'string' && /^trait\.[a-z0-9-]+$/.test(address.traitId)) return { type: 'trait', traitId: address.traitId, ...(subject ? { subject } : {}) }
  if (kind === 'SKILL' && typeof address?.skillId === 'string' && /^skill\.[a-z0-9-]+$/.test(address.skillId)) return { type: 'skill', skillId: address.skillId, ...(subject ? { subject } : {}) }
  fail(`unsupported or invalid destination ${JSON.stringify(raw)}`)
}

function sourceFor(record: CanonicalRecord): Array<{ sourceId: string; printedPage: string; pdfPageIndex: number }> {
  return (record.claims ?? []).flatMap((claim) => claim.sourceLocators ?? [])
}

function choicesFrom(value: unknown, recordId: string, sourceLocators: Array<{ sourceId: string; printedPage: string; pdfPageIndex: number }>, path: string[] = []): NormalizedChoice[] {
  if (!Array.isArray(value)) fail(`choice branch in ${recordId} is not an array`)
  return value.flatMap((branch, index) => {
    if (!branch || typeof branch !== 'object') fail(`choice branch ${recordId}/${index + 1} is invalid`)
    const entry = branch as Record<string, unknown>
    if (Array.isArray(entry.choices)) return choicesFrom(entry.choices, recordId, sourceLocators, [...path, String(entry.id ?? index + 1)])
    if (typeof entry.domainId !== 'string' || typeof entry.minimum !== 'number' || typeof entry.maximum !== 'number' || typeof entry.required !== 'boolean' || entry.minimum < 0 || entry.maximum < entry.minimum) fail(`choice ${recordId}/${String(entry.id ?? index + 1)} has unsupported cardinality or domain`)
    const rawAward = entry.award
    let award: NormalizedChoice['award']
    if (rawAward !== undefined) {
      if (!rawAward || typeof rawAward !== 'object') fail(`choice ${recordId}/${String(entry.id ?? index + 1)} has an invalid award`)
      const choiceAward = rawAward as Record<string, unknown>
      const quantity = choiceAward.quantity as Record<string, unknown> | undefined
      const claimRefs = Array.isArray(choiceAward.claimRefs) ? choiceAward.claimRefs.filter((ref): ref is string => typeof ref === 'string') : []
      if (!quantity || quantity.unit !== 'XP' || typeof quantity.value !== 'number' || quantity.value < 0 || choiceAward.destinationBinding !== 'SELECTED_CHOICE' || !claimRefs.length || typeof choiceAward.repeatBehavior !== 'string') fail(`choice ${recordId}/${String(entry.id ?? index + 1)} has an unsupported award contract`)
      award = { xp: quantity.value, destinationBinding: 'SELECTED_CHOICE', claimRefs, repeatBehavior: choiceAward.repeatBehavior, sourceLocators }
    }
    return [{ occurrenceId: `${recordId}:${[...path, String(entry.id ?? index + 1)].join('/')}`, domainId: entry.domainId, minimum: entry.minimum, maximum: entry.maximum, required: entry.required, ...(typeof entry.duplicatePolicy === 'string' ? { duplicatePolicy: entry.duplicatePolicy } : {}), branchPath: path, ...(award ? { award } : {}) }]
  })
}

export function normalizeCanonicalExport(value: unknown, expectedRevision: string): NormalizedExport {
  if (!value || typeof value !== 'object') fail('export is not an object')
  const exportValue = value as Record<string, unknown>
  if (exportValue.exportFormatVersion !== '0.1.0' || exportValue.canonicalSchemaVersion !== '0.4b') fail('unsupported export format or schema')
  const repository = exportValue.referenceRepository as Record<string, unknown> | undefined
  if (repository?.revision !== expectedRevision) fail('unexpected ARD revision')
  if (typeof exportValue.contentDigest !== 'string') fail('missing content digest')
  const { contentDigest, ...base } = exportValue
  const serialized = JSON.stringify(base)
  if (createHash('sha256').update(serialized).digest('hex') !== contentDigest) fail('content digest mismatch')
  if (!Array.isArray(exportValue.records)) fail('missing affiliation records')
  const records = exportValue.records as CanonicalRecord[]
  const restrictions = (exportValue.restrictionRecords as Record<string, unknown>[] | undefined) ?? []
  if (restrictions.some((record) => !['restriction', 'relation'].includes(String(record.recordType)))) fail('invalid restriction record type')
  const packages = records.map((record) => {
    const effects = record.mechanics?.effects ?? []
    const awards = effects.map((effect, index) => {
      if (effect.effectType !== 'XP_AWARD' || typeof effect.id !== 'string' || typeof effect.quantity !== 'object' || !effect.quantity || typeof (effect.quantity as Record<string, unknown>).value !== 'number') fail(`unsupported effect in ${record.id}`)
      const claimRefs = Array.isArray(effect.claimRefs) ? effect.claimRefs.filter((ref): ref is string => typeof ref === 'string') : []
      if (!claimRefs.length) fail(`effect ${effect.id} has no provenance`)
      return { occurrenceId: `${record.id}:${effect.id}:${index + 1}`, destination: destination(effect.destination as Record<string, unknown>), xp: (effect.quantity as { value: number }).value, provenance: { claimRefs, sourceLocators: sourceFor(record) } }
    })
    const parentId = record.contract?.parentId
    return { identity: record.id, displayName: record.displayName ?? record.id, exportIdentity: { format: String(exportValue.exportFormatVersion), schema: String(exportValue.canonicalSchemaVersion), revision: String(repository.revision), digest: contentDigest }, ...(parentId ? { parentId } : {}), costXp: record.contract?.costXp ?? 0, awards, choices: choicesFrom(record.mechanics?.choices ?? [], record.id, sourceFor(record)), restrictions, dependencyIds: (exportValue.restrictionDependencyIds as string[] | undefined) ?? [], provenance: (record.claims ?? []).map((claim) => ({ claimId: claim.id, sourceLocators: claim.sourceLocators ?? [] })) }
  })
  const ids = new Set(packages.map((entry) => entry.identity))
  for (const entry of packages) if (entry.parentId && !ids.has(entry.parentId)) fail(`missing parent ${entry.parentId}`)
  return { metadata: packages[0]?.exportIdentity ?? { format: String(exportValue.exportFormatVersion), schema: String(exportValue.canonicalSchemaVersion), revision: String(repository.revision), digest: contentDigest }, packages, restrictions, dependencyIds: [...new Set((exportValue.restrictionDependencyIds as string[] | undefined) ?? [])].sort() }
}
