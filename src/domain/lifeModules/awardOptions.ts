import type { CharacterDefinition, PendingLifeModuleAward, ResolvedLifeModuleDestination } from '../character/model'
import { POINT_BUY_SKILLS, POINT_BUY_TRAITS } from '../pointBuy/catalog'

export interface PendingAwardOption extends ResolvedLifeModuleDestination {
  value: string
}

const LANGUAGE_CHOICES: Readonly<Record<NonNullable<PendingLifeModuleAward['choiceSource']>, readonly string[]>> = {
  'affiliation-languages': ['Mandarin Chinese', 'Russian', 'Cantonese', 'Vietnamese', 'English'],
  'capellan-secondary': ['Russian', 'Cantonese', 'Vietnamese', 'English'],
  'federated-suns-languages': ['English', 'French'],
}

const KNOWN_SUBSKILLS: Readonly<Record<string, readonly string[]>> = {
  'skill.career': ['Journalist', 'Lawyer', 'Pilot', 'Soldier', 'Technician'],
  'skill.interest': ['Art', 'BattleMechs', 'Clan Remembrance', 'Engineering', 'FedSuns History', 'History', 'Law', 'Modern Fashion', 'Music', 'Physics', 'Science'],
  'skill.survival': ['Badlands', 'Desert', 'Forest'],
  'skill.driving': ['Ground', 'Ground Car'],
  'skill.prestidigitation': ['Sleight of Hand'],
}

export function knownPendingChoiceValues(pending: Pick<PendingLifeModuleAward, 'choiceSource' | 'kind' | 'requiredSkillId'>): readonly string[] {
  if (pending.choiceSource) return LANGUAGE_CHOICES[pending.choiceSource]
  if (pending.kind === 'affiliation-skill-choice') return ['Capellan']
  return pending.requiredSkillId ? KNOWN_SUBSKILLS[pending.requiredSkillId] ?? [] : []
}

export function pendingAwardOptions(pending: PendingLifeModuleAward, character: CharacterDefinition): PendingAwardOption[] {
  if (pending.choiceSource) {
    return knownPendingChoiceValues(pending).map((language) => skillOption('skill.language', 'Language', language))
  }
  if (pending.kind === 'affiliation-skill-choice' && pending.requiredSkillId) {
    return [skillOption(pending.requiredSkillId, skillName(pending.requiredSkillId), 'Capellan')]
  }
  if (pending.requiredSkillId) {
    return knownPendingChoiceValues(pending).map((parameter) => skillOption(pending.requiredSkillId!, skillName(pending.requiredSkillId!), parameter))
  }
  return flexibleTargetOptions(pending, character)
}

export function pendingAwardUnsupportedMessage(pending: PendingLifeModuleAward, options: PendingAwardOption[]): string | null {
  if (options.length > 0) return null
  if (pending.requiredSkillId) return `No source-backed ${skillName(pending.requiredSkillId)} choices are available in the current Alpha data. This award remains pending.`
  return 'No safe existing destination is available for this target type. Choose another target type or leave this award pending.'
}

function flexibleTargetOptions(pending: PendingLifeModuleAward, character: CharacterDefinition): PendingAwardOption[] {
  const type = pending.allowedTargetTypes[0]
  if (type === 'attribute') return character.attributes.map((entry) => ({ value: entry.attributeId, type, targetId: entry.attributeId, displayName: entry.attributeId }))
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

function uniqueOptions(options: PendingAwardOption[]): PendingAwardOption[] {
  return [...new Map(options.map((entry) => [entry.value, entry])).values()].sort((left, right) => left.displayName.localeCompare(right.displayName))
}

function skillOption(targetId: string, baseName: string, parameter: string): PendingAwardOption {
  return { value: `${targetId}/${parameter}`, type: 'skill', targetId, parameter: { kind: 'subskill', value: parameter }, displayName: `${baseName}/${parameter}` }
}

function skillName(skillId: string): string {
  return skillId.replace('skill.', '').split('-').map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(' ')
}
