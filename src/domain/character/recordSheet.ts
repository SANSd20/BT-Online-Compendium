import type { CharacterDefinition, CharacterRecordSheet, EquipmentItem, RecordSheetValue, SkillLedgerEntry } from './model'
import { attributeLegality } from './attributeLegality'
import { characterSkillProgression, deriveSkillLevel } from '../lifeModules/finalReview'

const LINK_MODIFIERS: Readonly<Record<number, number>> = { 0: -4, 1: -2, 2: -1, 3: -1, 4: 0, 5: 0, 6: 0, 7: 1, 8: 1, 9: 1, 10: 2 }
const supported = <T>(value: T, ...sources: string[]): RecordSheetValue<T> => ({ value, status: 'supported', sources })
const unsupported = <T>(...missing: string[]): RecordSheetValue<T> => ({ value: null, status: 'unsupported', sources: [], missing })

export function deriveCharacterRecordSheet(character: CharacterDefinition): CharacterRecordSheet {
  const attributes = character.attributes.map((entry) => {
    const legality = attributeLegality(character, entry.attributeId)
    const score = legality.effectiveScore
    return {
      attributeId: entry.attributeId,
      score: supported(score, 'AToW Corrected Third Printing pp. 34-35', 'Phenotype/Exceptional Attribute rules'),
      linkModifier: supported(linkModifier(score), 'AToW Corrected Third Printing p. 41'),
      xp: entry.accumulatedXp,
      legal: legality.legal,
    }
  })
  const progression = characterSkillProgression(character)
  const skills = character.skills.map((entry) => ({
    displayName: entry.displayName ?? entry.address.skillId,
    skillId: entry.address.skillId,
    ...(entry.address.parameter ? { parameter: entry.address.parameter.value } : {}),
    ...(entry.specialty ? { specialty: entry.specialty } : {}),
    level: levelValue(entry, progression),
    xp: entry.accumulatedXp,
    links: unsupported<string[]>('Skill catalog link metadata is not yet complete.'),
    tnComplexity: unsupported<string>('Skill catalog TN/Complexity metadata is not yet complete.'),
  }))
  const value = (id: string) => attributeScore(character, id)
  const walk = value('STR') + value('RFL')
  const running = skillLevel(character, 'skill.running')
  const climbing = skillLevel(character, 'skill.climbing')
  const swimming = skillLevel(character, 'skill.swimming')
  const run = 10 + walk + running
  const climb = Math.ceil(walk / 2) + climbing
  const crawl = Math.ceil(walk / 4)
  const swim = swimming > 0 ? walk + swimming : Math.floor(walk / 2)
  const tough = traitActive(character, 'trait.toughness') ? supported('0.75× personal damage, round up', 'AToW Corrected Third Printing p. 128') : unsupported<string>('No modeled Toughness modifier.')
  const equipment = character.inventory.map((item) => equipmentRecord(item))
  const outstanding = [
    ...skills.filter((entry) => entry.tnComplexity.status === 'unsupported').map((entry) => `${entry.displayName}: TN/Complexity unavailable`),
    ...(character.creation.finalTouches ? [] : ['Final Touches equipment state is not initialized.']),
  ]
  return {
    attributes,
    skills,
    combat: {
      standardDamage: supported(value('BOD') * 2, 'AToW Corrected Third Printing p. 165'),
      fatigueDamage: supported(value('WIL') * 2, 'AToW Corrected Third Printing p. 165'),
      movement: {
        walk: supported(walk, 'AToW Corrected Third Printing p. 167'),
        run: supported(run, 'AToW Corrected Third Printing p. 167'),
        sprint: supported(run * 2, 'AToW Corrected Third Printing p. 167'),
        climb: supported(climb, 'AToW Corrected Third Printing p. 167'),
        crawl: supported(crawl, 'AToW Corrected Third Printing p. 167'),
        evade: supported(run, 'AToW Corrected Third Printing p. 167'),
        swim: supported(swim, 'AToW Corrected Third Printing p. 167'),
      },
      initiative: supported(`2D6${traitActive(character, 'trait.combat-sense') ? ' best 2 of 3D6' : traitActive(character, 'trait.combat-paralysis') ? ' worst 2 of 3D6' : ''}`, 'AToW Corrected Third Printing p. 165', 'AToW v4.0 Errata p. 4'),
      toughness: tough,
    },
    equipment,
    outstanding,
  }
}

function levelValue(entry: SkillLedgerEntry, progression: ReturnType<typeof characterSkillProgression>): RecordSheetValue<number> {
  const level = deriveSkillLevel(entry.accumulatedXp, progression)
  return level === null ? unsupported<number>('Skill has not reached Level 0.') : supported(level, 'AToW Corrected Third Printing pp. 95, 140-142')
}

function attributeScore(character: CharacterDefinition, id: string): number {
  return attributeLegality(character, id).effectiveScore
}

function skillLevel(character: CharacterDefinition, id: string): number {
  const entry = character.skills.find((item) => item.address.skillId === id)
  return entry?.level ?? 0
}

function traitActive(character: CharacterDefinition, id: string): boolean {
  return character.traits.some((entry) => entry.traitId === id && entry.active)
}

function linkModifier(score: number): number {
  if (score >= 11) return Math.min(5, score - 3)
  return LINK_MODIFIERS[Math.max(0, score)] ?? 0
}

function equipmentRecord(item: EquipmentItem): CharacterRecordSheet['equipment'][number] {
  const metadata = item.catalogSnapshot?.metadata
  const effects: string[] = []
  if (metadata?.perceptionModifier !== undefined) effects.push(`Perception ${Number(metadata.perceptionModifier) >= 0 ? '+' : ''}${metadata.perceptionModifier}`)
  if (metadata?.navigationGroundModifier !== undefined) effects.push(`Navigation/Ground ${Number(metadata.navigationGroundModifier) >= 0 ? '+' : ''}${metadata.navigationGroundModifier}`)
  if (metadata?.survivalModifier !== undefined) effects.push(`Survival ${Number(metadata.survivalModifier) >= 0 ? '+' : ''}${metadata.survivalModifier}`)
  const active = Object.keys(metadata ?? {}).some((key) => ['apBd', 'shots', 'reloadCostCBills', 'usesPowerPacks', 'jamOnFumble'].includes(key))
  if (active) effects.push('Active combat/ammunition effect retained as metadata; not automated.')
  return { id: item.id, displayName: item.displayName, quantity: item.quantity, ownership: item.ownership, costCBills: item.totalCostCBills ?? 0, ratings: item.equipmentRating, effects: effects.length ? supported(effects, 'Catalog item source snapshot') : unsupported<string[]>('No passive effect is modeled for this item.') }
}
