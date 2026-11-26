export type SkillDestination = { type: 'skill'; skillId: string; subject: string }
export type AttributeDestination = { type: 'attribute'; attributeId: string }
export type TraitDestination = { type: 'trait'; traitId: string; subject?: string }
export type LegacySkillDestination = { skillId: string; subject: string }
export type ChoiceDestination = SkillDestination | AttributeDestination | TraitDestination | LegacySkillDestination
export type ChoiceDestinationType = 'attribute' | 'trait' | 'skill'

export type ChoiceGrant = {
  occurrenceId: string
  domain: string
  xp: number
  provenanceId: string
  allowedSkillIds?: readonly string[]
  allowedDestinationTypes?: readonly ChoiceDestinationType[]
  allowedAttributeIds?: readonly string[]
  allowedTraitIds?: readonly string[]
}

export type ChoiceSelection = ChoiceDestination & { occurrenceId: string }

export type ChoiceState = {
  grants: readonly ChoiceGrant[]
  selections: readonly ChoiceSelection[]
}

export type ReconciledChoices = {
  pendingOccurrenceIds: string[]
  resolved: Array<ChoiceSelection & { xp: number; provenanceId: string }>
  totalXp: number
}

function grantFor(state: ChoiceState, occurrenceId: string): ChoiceGrant {
  const grant = state.grants.find((entry) => entry.occurrenceId === occurrenceId)
  if (!grant) throw new Error(`Unknown choice occurrence: ${occurrenceId}`)
  return grant
}

function validateDestination(grant: ChoiceGrant, destination: ChoiceDestination): void {
  const type = 'type' in destination ? destination.type : 'skill'
  if (grant.allowedDestinationTypes && !grant.allowedDestinationTypes.includes(type)) throw new Error(`Destination type is not valid for choice domain ${grant.domain}.`)
  if (type === 'skill') {
    const skillDestination = ('type' in destination ? destination : { ...destination, type: 'skill' as const }) as SkillDestination
    if (!skillDestination.skillId || !skillDestination.subject) throw new Error('A concrete Skill destination is required.')
    if (grant.allowedSkillIds && !grant.allowedSkillIds.includes(skillDestination.skillId)) throw new Error(`Skill is not valid for choice domain ${grant.domain}.`)
  } else if (type === 'attribute') {
    const attributeDestination = destination as AttributeDestination
    if (!attributeDestination.attributeId) throw new Error('A canonical Attribute destination is required.')
    if (grant.allowedAttributeIds && !grant.allowedAttributeIds.includes(attributeDestination.attributeId)) throw new Error(`Attribute is not valid for choice domain ${grant.domain}.`)
  } else {
    const traitDestination = destination as TraitDestination
    if (!traitDestination.traitId) throw new Error('A canonical Trait destination is required.')
    if (grant.allowedTraitIds && !grant.allowedTraitIds.includes(traitDestination.traitId)) throw new Error(`Trait is not valid for choice domain ${grant.domain}.`)
  }
}

export function selectChoice(state: ChoiceState, occurrenceId: string, destination: ChoiceDestination): ChoiceState {
  const grant = grantFor(state, occurrenceId)
  validateDestination(grant, destination)
  return { ...state, selections: [...state.selections.filter((entry) => entry.occurrenceId !== occurrenceId), { occurrenceId, ...destination }] }
}

export function clearChoice(state: ChoiceState, occurrenceId: string): ChoiceState {
  grantFor(state, occurrenceId)
  return { ...state, selections: state.selections.filter((entry) => entry.occurrenceId !== occurrenceId) }
}

export function replaceChoice(state: ChoiceState, occurrenceId: string, destination: ChoiceDestination): ChoiceState {
  return selectChoice(state, occurrenceId, destination)
}

export function reconcileChoices(state: ChoiceState): ReconciledChoices {
  const grants = new Map(state.grants.map((grant) => [grant.occurrenceId, grant]))
  const resolved = [...state.selections].sort((left, right) => left.occurrenceId.localeCompare(right.occurrenceId)).map((selection) => {
    const grant = grants.get(selection.occurrenceId)
    if (!grant) throw new Error(`Unknown choice occurrence: ${selection.occurrenceId}`)
    validateDestination(grant, selection)
    return { ...selection, xp: grant.xp, provenanceId: grant.provenanceId }
  })
  const resolvedIds = new Set(resolved.map((entry) => entry.occurrenceId))
  return { pendingOccurrenceIds: state.grants.filter((grant) => !resolvedIds.has(grant.occurrenceId)).map((grant) => grant.occurrenceId), resolved, totalXp: resolved.reduce((total, entry) => total + entry.xp, 0) }
}
