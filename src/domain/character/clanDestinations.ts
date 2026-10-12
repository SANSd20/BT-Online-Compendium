import type { SourceCitation } from '../rules/model'

export type ClanDestinationStatus = 'SUPPORTED_CONCRETE' | 'SUPPORTED_GOVERNED_CHOICE' | 'UNSUPPORTED_DESTINATION' | 'SOURCE_AMBIGUITY'
export type ClanDestinationFamily = 'skill' | 'trait' | 'language' | 'domain'
export interface ClanDestinationResolution { status: ClanDestinationStatus; family: ClanDestinationFamily; canonicalId?: string; subject?: string; reason?: string; source: SourceCitation }

const SOURCE: SourceCitation = { sourceId: 'atow-core-corrected-third', edition: 'Corrected Third Printing', page: 70, ruleId: 'homeworld-clan-destination' }
const skill = (canonicalId: string, subject?: string): ClanDestinationResolution => ({ status: 'SUPPORTED_CONCRETE', family: 'skill', canonicalId, ...(subject ? { subject } : {}), source: SOURCE })
const trait = (canonicalId: string, subject?: string): ClanDestinationResolution => ({ status: 'SUPPORTED_CONCRETE', family: 'trait', canonicalId, ...(subject ? { subject } : {}), source: SOURCE })

const FIXED_SKILLS: Readonly<Record<string, ClanDestinationResolution>> = {
  'Interest/Clan History': skill('skill.interest', 'Clan History'), 'Interest/Clan Remembrance': skill('skill.interest', 'Clan Remembrance'), 'Interest/Star League History': skill('skill.interest', 'Star League History'),
  'Martial Arts': skill('skill.martial-arts'), 'Small Arms': skill('skill.small-arms'), Negotiation: skill('skill.negotiation'), Leadership: skill('skill.leadership'), Perception: skill('skill.perception'), Swimming: skill('skill.swimming'),
  'Protocol/Clan': skill('skill.protocol', 'Clan'), 'Protocol/Blood Spirit': skill('skill.protocol', 'Blood Spirit'), 'Protocol/Cloud Cobra': skill('skill.protocol', 'Cloud Cobra'), 'Protocol/Coyote': skill('skill.protocol', 'Coyote'), 'Protocol/Fire Mandrill': skill('skill.protocol', 'Fire Mandrill'), 'Protocol/Kindraa': skill('skill.protocol', 'Kindraa'), 'Protocol/Goliath Scorpion': skill('skill.protocol', 'Goliath Scorpion'), 'Protocol/Ice Hellion': skill('skill.protocol', 'Ice Hellion'), 'Protocol/Star Adder': skill('skill.protocol', 'Star Adder'), 'Protocol/Steel Viper': skill('skill.protocol', 'Steel Viper'),
}

const FIXED_TRAITS: Readonly<Record<string, ClanDestinationResolution>> = {
  'Combat Sense': trait('trait.combat-sense'), Fit: trait('trait.fit'), Patient: trait('trait.patient'), Impatient: trait('trait.impatient'), Introvert: trait('trait.introvert'), Reputation: trait('trait.reputation'), Equipped: trait('trait.equipped'), Connections: trait('trait.connections'),
  'Compulsion/Blood Spirit Fanaticism': trait('trait.compulsion', 'Blood Spirit Fanaticism'), 'Compulsion/Hate Star Adder': trait('trait.compulsion', 'Hate Star Adder'), 'Compulsion/Religious Faith': trait('trait.compulsion', 'Religious Faith'), 'Compulsion/Necrosia Addiction': trait('trait.compulsion', 'Necrosia Addiction'), 'Compulsion/Nostalgic': trait('trait.compulsion', 'Nostalgic'), 'Compulsion/Clan Honor': trait('trait.compulsion', 'Clan Honor'), 'Compulsion/Fire Mandrill Fanaticism': trait('trait.compulsion', 'Fire Mandrill Fanaticism'), 'Compulsion/Kindraa Fanaticism': trait('trait.compulsion', 'Kindraa Fanaticism'), 'Compulsion/Adder Arrogance': trait('trait.compulsion', 'Adder Arrogance'), 'Compulsion/Burrock Forever!': trait('trait.compulsion', 'Burrock Forever!'), 'Fast Learner': trait('trait.fast-learner'), 'Sixth Sense': trait('trait.sixth-sense'), 'Custom Vehicle': trait('trait.custom-vehicle'), 'Vehicle Level': trait('trait.vehicle-level'), 'Enemy/Rival Kindraa': trait('trait.enemy', 'Rival Kindraa'),
}

const SECONDARY_LANGUAGES = ['Chinese', 'French', 'German', 'Japanese', 'Russian', 'Spanish'] as const
const OPEN_DOMAINS: Readonly<Record<string, string>> = {
  'Interest/Theology/Any': 'Theology', 'Survival/Any': 'Survival', 'Tactics/Any': 'Tactics', 'Natural Aptitude/Any': 'Natural Aptitude', 'Natural Aptitude/Computers': 'Natural Aptitude/Computers', 'Natural Aptitude/Technician/Any': 'Natural Aptitude/Technician', 'Natural Aptitude/Gunnery/Any': 'Natural Aptitude/Gunnery', 'Natural Aptitude/Melee Weapons': 'Natural Aptitude/Melee Weapons', 'Natural Aptitude/Interest/Any': 'Natural Aptitude/Interest',
}

export function resolveClanDestination(destination: string): ClanDestinationResolution {
  if (['BOD', 'STR', 'DEX', 'RFL', 'INT', 'WIL', 'CHA', 'EDG'].includes(destination)) return { status: 'SUPPORTED_CONCRETE', family: 'domain', canonicalId: `attribute.${destination}`, reason: 'Concrete Attribute destination.', source: SOURCE }
  if (FIXED_SKILLS[destination]) return FIXED_SKILLS[destination]
  if (destination === 'Survival/Arctic') return skill('skill.survival', 'Arctic')
  if (destination === 'Exceptional Attribute/WIL') return trait('trait.exceptional-attribute', 'WIL')
  if (FIXED_TRAITS[destination]) return FIXED_TRAITS[destination]
  if (destination.startsWith('Language/Secondary/')) {
    const language = destination.slice('Language/Secondary/'.length)
    if ((SECONDARY_LANGUAGES as readonly string[]).includes(language)) return { status: 'SUPPORTED_CONCRETE', family: 'language', canonicalId: 'skill.language', subject: language, source: SOURCE }
    return { status: 'UNSUPPORTED_DESTINATION', family: 'language', reason: 'Language is not in the source-defined Fire Mandrill secondary-language set.', source: SOURCE }
  }
  if (OPEN_DOMAINS[destination]) return { status: 'SUPPORTED_GOVERNED_CHOICE', family: 'domain', canonicalId: `domain.${OPEN_DOMAINS[destination].toLowerCase().replaceAll(' ', '-')}`, subject: OPEN_DOMAINS[destination], reason: 'Source-defined open domain requires a later complete governed subject catalog.', source: SOURCE }
  return { status: 'UNSUPPORTED_DESTINATION', family: 'domain', reason: 'Destination is not a canonical Homeworld Clan destination.', source: SOURCE }
}

export const HOMEWORLD_CLAN_SECONDARY_LANGUAGES = SECONDARY_LANGUAGES
