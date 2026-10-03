import type { CharacterDefinition, PendingLifeModuleAward, ResolvedLifeModuleDestination } from '../character/model'
import { POINT_BUY_SKILLS, POINT_BUY_TRAITS } from '../pointBuy/catalog'
import { getLifeModuleAffiliationContextByAffiliationId, getLifeModuleLanguageSelectorOptions } from './affiliations'
import { getSkillField, TECHNICIAN_SUBSKILLS } from '../skillFields/catalog'
import { MASTER_SKILL_FIELD_GOAL_CATALOG } from '../skillFields/goalCatalog'
import { openSkillSubjectLabel } from '../skillFields/openSkillSubjects'
import { getVariableSkillDomain, VARIABLE_SKILL_DOMAIN_CATALOG } from '../skillFields/variableSkillDomains'

export interface PendingAwardOption extends ResolvedLifeModuleDestination {
  value: string
  inputMode?: 'open-subject'
  description?: string
}

export interface PendingOpenSubject {
  skillId: string
  parentLabel: string
  description: string
}

export function pendingOpenSubject(pending: Pick<PendingLifeModuleAward, 'kind' | 'requiredSkillId' | 'skillFieldChoice'>): PendingOpenSubject | null {
  let skillId: string | undefined
  let description: string | undefined
  if (pending.skillFieldChoice) {
    const component = getSkillField(pending.skillFieldChoice.fieldId).variableComponentSkills
      ?.find((entry) => entry.id === pending.skillFieldChoice?.componentId)
    if (!component) return null
    const domain = getVariableSkillDomain(component.choiceDomainId)
    if (domain.inputMode !== 'open-subject') return null
    skillId = component.skillId
    description = domain.description
  } else if ((pending.kind === 'any-skill-choice' || pending.kind === 'multi-skill-choice') && pending.requiredSkillId) {
    const domain = VARIABLE_OPEN_DOMAINS.find((entry) => entry.skillId === pending.requiredSkillId)
    if (!domain) return null
    skillId = domain.skillId
    description = domain.description
  }
  if (!skillId || !description) return null
  return { skillId, parentLabel: skillName(skillId), description }
}

const VARIABLE_OPEN_DOMAINS = [
  getVariableSkillDomain('open-career-subject'),
  getVariableSkillDomain('open-interest-subject'),
  getVariableSkillDomain('open-science-subject'),
  getVariableSkillDomain('open-survival-environment'),
]

const KNOWN_SUBSKILLS: Readonly<Record<string, readonly string[]>> = {
  'skill.driving': ['Ground', 'Ground Car'],
  'skill.prestidigitation': ['Sleight of Hand'],
  'skill.art': ['Painting'],
  'skill.technician': TECHNICIAN_SUBSKILLS,
}

export function knownPendingChoiceValues(pending: Pick<PendingLifeModuleAward, 'choiceSource' | 'kind' | 'requiredSkillId' | 'skillFieldChoice'>): readonly string[] {
  if (pending.choiceSource) return getLifeModuleLanguageSelectorOptions(pending.choiceSource)
  if (pending.skillFieldChoice) {
    return getSkillField(pending.skillFieldChoice.fieldId).variableComponentSkills
      ?.find((entry) => entry.id === pending.skillFieldChoice?.componentId)?.legalSubskills ?? []
  }
  if (pending.kind === 'affiliation-skill-choice') {
    return []
  }
  return pending.requiredSkillId ? KNOWN_SUBSKILLS[pending.requiredSkillId] ?? [] : []
}

export function pendingAwardOptions(pending: PendingLifeModuleAward, character: CharacterDefinition): PendingAwardOption[] {
  if (pending.kind === 'related-skill-prerequisite') {
    const legalKeys = new Set(pending.skillFieldPrerequisiteChoice?.eligibleSkillKeys ?? [])
    return uniqueOptions(character.skills
      .filter((entry) => entry.level !== null && legalKeys.has(`${entry.address.skillId}/${entry.address.parameter?.kind ?? ''}/${entry.address.parameter?.value.toLowerCase() ?? ''}`))
      .map((entry) => ({
        value: `${entry.address.skillId}/${entry.address.parameter?.value ?? ''}`,
        type: 'skill' as const,
        targetId: entry.address.skillId,
        displayName: entry.displayName ?? entry.address.skillId,
        parameter: entry.address.parameter,
      })))
  }
  if (pending.choiceSource) {
    return knownPendingChoiceValues(pending).map((language) => skillOption('skill.language', 'Language', language))
  }
  if (pending.kind === 'affiliation-skill-choice' && pending.requiredSkillId) {
    const affiliation = [...character.affiliations].reverse().find((entry) => entry.role === 'final')
    const context = affiliation ? getLifeModuleAffiliationContextByAffiliationId(affiliation.affiliationId) : undefined
    if (!context) return []
    const label = pending.requiredSkillId === 'skill.streetwise' ? context.streetwiseContextLabel : context.protocolContextLabel
    return [skillOption(pending.requiredSkillId, skillName(pending.requiredSkillId), label)]
  }
  if (pending.kind === 'modeled-skill-choice') return modeledSkillChoiceOptions(character)
  if (pending.requiredSkillId) {
    return knownPendingChoiceValues(pending).map((parameter) => skillOption(pending.requiredSkillId!, skillName(pending.requiredSkillId!), parameter))
  }
  return flexibleTargetOptions(pending, character)
}

export function pendingAwardUnsupportedMessage(pending: PendingLifeModuleAward, options: PendingAwardOption[]): string | null {
  if (pendingOpenSubject(pending)) return null
  if (options.length > 0) return null
  if (pending.kind === 'related-skill-prerequisite') return 'No already possessed concrete Skill is available. General Studies remains blocked until the character possesses one and the GM approves its relationship.'
  if (pending.requiredSkillId) return `No source-backed ${skillName(pending.requiredSkillId)} choices are available in the current Alpha data. This award remains pending.`
  return 'No safe existing destination is available for this target type. Choose another target type or leave this award pending.'
}

function flexibleTargetOptions(pending: PendingLifeModuleAward, character: CharacterDefinition): PendingAwardOption[] {
  const type = pending.allowedTargetTypes[0]
  if (type === 'attribute') return character.attributes.filter((entry) => !pending.excludedTargetIds?.includes(entry.attributeId)).map((entry) => ({ value: entry.attributeId, type, targetId: entry.attributeId, displayName: entry.attributeId }))
  if (type === 'trait') {
    const candidates = [
      ...character.traits.map((entry) => ({ targetId: entry.traitId, displayName: entry.displayName ?? entry.traitId, parameters: entry.parameters })),
      ...POINT_BUY_TRAITS.filter((entry) => !entry.parameter).map((entry) => ({ targetId: entry.id, displayName: entry.displayName, parameters: {} })),
    ]
    return uniqueOptions(candidates.map((entry) => ({ value: entry.targetId, type, ...entry })))
  }
  const candidates = [
    ...character.skills.map((entry) => ({ targetId: entry.address.skillId, displayName: entry.displayName ?? entry.address.skillId, parameter: entry.address.parameter })),
    ...POINT_BUY_SKILLS.filter((entry) => !entry.parameter).map((entry) => ({ targetId: entry.id, displayName: entry.displayName, parameter: undefined })),
  ]
  return uniqueOptions(candidates.map((entry) => ({ value: `${entry.targetId}/${entry.parameter?.value ?? ''}`, type, ...entry })))
}

export function modeledSkillChoiceOptions(character: CharacterDefinition): PendingAwardOption[] {
  const existing = character.skills.map((entry) => ({
    value: `${entry.address.skillId}/${entry.address.parameter?.value ?? ''}`,
    type: 'skill' as const,
    targetId: entry.address.skillId,
    displayName: entry.displayName ?? entry.address.skillId,
    parameter: entry.address.parameter,
  }))
  const fixedFieldSkills = MASTER_SKILL_FIELD_GOAL_CATALOG.flatMap((field) => field.fieldSkills)
    .filter((entry) => !entry.variable)
    .map((entry) => ({
      value: `${entry.skillId}/${entry.parameter ?? ''}`,
      type: 'skill' as const,
      targetId: entry.skillId,
      displayName: entry.displayName,
      ...(entry.parameter ? { parameter: { kind: 'subskill', value: entry.parameter } } : {}),
    }))
  const governed = VARIABLE_SKILL_DOMAIN_CATALOG.flatMap((domain): PendingAwardOption[] => {
    if (domain.inputMode === 'open-subject') {
      const label = openSkillSubjectLabel(domain.skillId)
      return label ? [{
        value: `${domain.skillId}/__open__`, type: 'skill', targetId: domain.skillId,
        displayName: `${label}/Other…`, inputMode: 'open-subject', description: domain.description,
      }] : []
    }
    return domain.options.map((parameter) => skillOption(domain.skillId, skillName(domain.skillId), parameter))
  })
  const basic = POINT_BUY_SKILLS.filter((entry) => !entry.parameter).map((entry) => ({
    value: `${entry.id}/`, type: 'skill' as const, targetId: entry.id, displayName: entry.displayName,
  }))
  return uniqueOptions([...existing, ...fixedFieldSkills, ...governed, ...basic])
}

function uniqueOptions(options: PendingAwardOption[]): PendingAwardOption[] {
  return [...new Map(options.map((entry) => [entry.value, entry])).values()].sort((left, right) => left.displayName.localeCompare(right.displayName))
}

function skillOption(targetId: string, baseName: string, parameter: string): PendingAwardOption {
  return { value: `${targetId}/${parameter}`, type: 'skill', targetId, parameter: { kind: 'subskill', value: parameter }, displayName: `${baseName}/${parameter}` }
}

function skillName(skillId: string): string {
  return skillId.replace('skill.', '').split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}
