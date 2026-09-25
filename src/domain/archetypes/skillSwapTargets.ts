import type { SkillAddress } from '../character/model'
import { standardSkillXpCost } from '../pointBuy/catalog'
import type { SourceCitation } from '../rules/model'
import { CORE_ARCHETYPES, getCoreArchetype } from './coreArchetypes'

export interface KnownSafeSkillSwapTarget {
  targetId: string
  address: SkillAddress
  displayName: string
  level: number
  xp: number
  catalogArchetypeId: string
  catalogSource: SourceCitation
}

interface CatalogSkillInstance extends KnownSafeSkillSwapTarget {
  specialty?: string
  notes?: string[]
}

export function archetypeSkillAddressId(address: SkillAddress): string {
  return [address.skillId, address.parameter?.kind ?? '', address.parameter?.value ?? '']
    .map((part) => encodeURIComponent(part))
    .join('|')
}

const catalogInstances: readonly CatalogSkillInstance[] = CORE_ARCHETYPES.flatMap((archetype) => (
  archetype.skills.map((skill) => ({
    targetId: archetypeSkillAddressId(skill.address),
    address: cloneAddress(skill.address),
    displayName: skill.displayName,
    level: skill.level,
    xp: skill.xp,
    catalogArchetypeId: archetype.id,
    catalogSource: { ...archetype.source },
    ...(skill.specialty ? { specialty: skill.specialty } : {}),
    ...(skill.notes ? { notes: [...skill.notes] } : {}),
  }))
))

const parameterizedRootIds = new Set(catalogInstances
  .filter((entry) => entry.address.parameter)
  .map((entry) => entry.address.skillId))

const instancesByTargetId = new Map<string, CatalogSkillInstance[]>()
for (const entry of catalogInstances) {
  const instances = instancesByTargetId.get(entry.targetId) ?? []
  instances.push(entry)
  instancesByTargetId.set(entry.targetId, instances)
}

const safeTargetIds = new Set([...instancesByTargetId]
  .filter(([, instances]) => isUnambiguousKnownIdentity(instances))
  .map(([targetId]) => targetId))

export function getKnownSafeSkillSwapTargets(
  archetypeId: string,
  sourceTargetId: string,
): KnownSafeSkillSwapTarget[] {
  const definition = getCoreArchetype(archetypeId)
  const source = definition.skills.find((skill) => archetypeSkillAddressId(skill.address) === sourceTargetId)
  if (!source || !safeTargetIds.has(sourceTargetId) || source.specialty || source.notes?.length || source.xp !== standardSkillXpCost(source.level)) return []

  const foundationTargetIds = new Set(definition.skills.map((skill) => archetypeSkillAddressId(skill.address)))
  const results: KnownSafeSkillSwapTarget[] = []
  for (const [targetId, instances] of instancesByTargetId) {
    if (!safeTargetIds.has(targetId) || foundationTargetIds.has(targetId)) continue
    const match = instances.find((entry) => entry.level === source.level && entry.xp === source.xp)
    if (!match) continue
    results.push(cloneTarget(match))
  }
  return results.sort((left, right) => left.displayName.localeCompare(right.displayName) || left.targetId.localeCompare(right.targetId))
}

export function findKnownSafeSkillSwapTarget(
  archetypeId: string,
  sourceTargetId: string,
  replacementTargetId: string,
): KnownSafeSkillSwapTarget | undefined {
  return getKnownSafeSkillSwapTargets(archetypeId, sourceTargetId)
    .find((entry) => entry.targetId === replacementTargetId)
}

export function isKnownSafeSkillSwapSource(archetypeId: string, sourceTargetId: string): boolean {
  return getKnownSafeSkillSwapTargets(archetypeId, sourceTargetId).length > 0
}

function isUnambiguousKnownIdentity(instances: readonly CatalogSkillInstance[]): boolean {
  if (instances.length === 0) return false
  const first = instances[0]
  const parameter = first.address.parameter
  if (parameter && (parameter.kind !== 'subskill' || !parameter.value.trim())) return false
  if (!parameter && parameterizedRootIds.has(first.address.skillId)) return false
  if (instances.some((entry) => entry.specialty)) return false
  if (instances.some((entry) => entry.notes?.length)) return false
  if (instances.some((entry) => entry.displayName !== first.displayName)) return false
  return instances.every((entry) => (
    sameAddress(entry.address, first.address) &&
    entry.xp === standardSkillXpCost(entry.level)
  ))
}

function sameAddress(left: SkillAddress, right: SkillAddress): boolean {
  return left.skillId === right.skillId &&
    left.parameter?.kind === right.parameter?.kind &&
    left.parameter?.value === right.parameter?.value
}

function cloneAddress(address: SkillAddress): SkillAddress {
  return {
    skillId: address.skillId,
    ...(address.parameter ? { parameter: { ...address.parameter } } : {}),
  }
}

function cloneTarget(entry: CatalogSkillInstance): KnownSafeSkillSwapTarget {
  return {
    targetId: entry.targetId,
    address: cloneAddress(entry.address),
    displayName: entry.displayName,
    level: entry.level,
    xp: entry.xp,
    catalogArchetypeId: entry.catalogArchetypeId,
    catalogSource: { ...entry.catalogSource },
  }
}
