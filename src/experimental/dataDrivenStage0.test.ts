import { describe, expect, it } from 'vitest'
import { createLifeModuleCharacter, applyModule, applyStage0Affiliation, resolvePendingLifeModuleAward } from '../engine/lifeModuleEngine'
import { FREE_WORLDS_LEAGUE_ID, FWL_ANDURIEN_ID, FWL_OTHER_WORLDS_ID } from '../domain/lifeModules/affiliations'
import { applyDataDrivenStage0Package, applyUniversalStage0, expandRepeatedModeledAwards, FREE_WORLDS_LEAGUE_DATA } from './dataDrivenStage0'
import { LIFE_MODULE_RULES_SOURCE } from '../domain/lifeModules/catalog'

const choices = { language: 'Greek', art: 'Painting' }
const projection = (character: ReturnType<typeof createLifeModuleCharacter>) => ({
  attributes: character.attributes.map((entry) => [entry.attributeId, entry.accumulatedXp]),
  traits: character.traits.filter((entry) => entry.active).map((entry) => [entry.traitId, entry.accumulatedXp, entry.parameters]),
  skills: character.skills.map((entry) => [entry.address.skillId, entry.address.parameter?.value, entry.accumulatedXp]).sort((a, b) => `${a[0]}${a[1]}`.localeCompare(`${b[0]}${b[1]}`)),
  pending: character.creation.lifeModules?.pendingAwards.map((entry) => [entry.awardId, entry.remainingGrants]),
})

describe('data-driven Stage 0 proof of concept', () => {
  it('resolves three synthetic repeated choices independently with stable occurrence identities', () => {
    const synthetic = { id: 'synthetic.repeated', displayName: 'Synthetic Repeated Choices', sourceRuleId: 'synthetic-repeated', costXp: 0, awards: [{ id: 'synthetic.skills', kind: 'modeled-skill-choice' as const, xp: 10, count: 3, displayName: 'Synthetic Skills', distinct: true as const }] }
    const awards = expandRepeatedModeledAwards(synthetic.awards)
    let character = applyModule(createLifeModuleCharacter('synthetic'), { id: 'stage0.universal-fixed-xp', displayName: synthetic.displayName, stage: 0, kind: 'universal', source: { ...LIFE_MODULE_RULES_SOURCE, ruleId: synthetic.sourceRuleId }, costXp: 0, prerequisites: [], awards, notes: [], deferredRules: [] }, {}, { allowRepeat: true })
    for (const [index, subject] of ['Painting', 'History', 'Negotiation'].entries()) {
      const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === `synthetic.skills/${index + 1}`)!
      character = resolvePendingLifeModuleAward(character, pending.id, { type: 'skill', targetId: 'skill.art', parameter: { kind: 'subskill', value: subject }, displayName: `Art/${subject}` })
    }
    expect(character.creation.lifeModules?.pendingAwards.filter((entry) => entry.awardId.startsWith('synthetic.skills/'))).toHaveLength(0)
    const resolved = character.creation.lifeModules?.resolvedAwards.filter((entry) => entry.awardId.startsWith('synthetic.skills/')) ?? []
    expect(resolved).toHaveLength(3)
    expect(resolved.map((entry) => entry.xp)).toEqual([10, 10, 10])
  })

  it('matches the specialized FWL parent path for resolved effects', () => {
    const specialized = applyStage0Affiliation(createLifeModuleCharacter('specialized'), FREE_WORLDS_LEAGUE_ID, 'English', 'Greek', undefined, 'Painting', 'no', undefined, undefined, undefined, FREE_WORLDS_LEAGUE_ID)
    const experimental = applyDataDrivenStage0Package(applyUniversalStage0(createLifeModuleCharacter('experimental'), FREE_WORLDS_LEAGUE_ID, 'English'), FREE_WORLDS_LEAGUE_ID, choices)
    expect(projection(experimental)).toEqual(projection(specialized))
  })

  it('matches a complete FWL sub-affiliation effect set without a faction branch', () => {
    const experimental = applyDataDrivenStage0Package(applyUniversalStage0(createLifeModuleCharacter('experimental'), FREE_WORLDS_LEAGUE_ID, 'English'), FWL_ANDURIEN_ID, choices)
    expect(experimental.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(150)
    expect(experimental.skills.some((entry) => entry.address.skillId === 'skill.protocol')).toBe(true)
    expect(experimental.creation.lifeModules?.stage0SubAffiliation).toBe(FWL_ANDURIEN_ID)
  })

  it('supports a data-only extension record through the same interpreter', () => {
    const extension = { id: 'experimental.fwl-extension', displayName: 'Experimental FWL Extension', sourceRuleId: 'experimental-extension', costXp: 0, awards: [{ id: 'extension.attribute', kind: 'fixed' as const, xp: 20, destination: { type: 'attribute' as const, attributeId: 'CHA' } }] }
    const character = applyDataDrivenStage0Package(applyUniversalStage0(createLifeModuleCharacter('extension'), FREE_WORLDS_LEAGUE_ID, 'English'), extension.id, choices, [...FREE_WORLDS_LEAGUE_DATA, extension])
    expect(character.attributes.find((entry) => entry.attributeId === 'CHA')?.accumulatedXp).toBe(120)
  })

  it('uses generated Other FWL awards through the existing resolver', () => {
    const character = applyDataDrivenStage0Package(applyUniversalStage0(createLifeModuleCharacter('other'), FREE_WORLDS_LEAGUE_ID, 'English'), FWL_OTHER_WORLDS_ID, choices)
    expect(character.creation.lifeModules?.stage0SubAffiliation).toBe(FWL_OTHER_WORLDS_ID)
    expect(character.creation.lifeModules?.pendingAwards.filter((entry) => entry.awardId.startsWith('other-fwl.'))).toHaveLength(0)
    expect(character.attributes.find((entry) => entry.attributeId === 'INT')?.accumulatedXp).toBe(160)
  })
})
