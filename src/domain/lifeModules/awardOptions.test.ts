import { describe, expect, it } from 'vitest'
import { applyCapellanCommonality, applyStage1Module, applyUniversalStage0, createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { BACK_WOODS_ID, CAPELLAN_COMMONALITY_ID } from './catalog'
import { pendingAwardOptions } from './awardOptions'

function backWoodsDraft() {
  let character = createLifeModuleCharacter('Selector Test')
  character = applyUniversalStage0(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese')
  character = applyCapellanCommonality(character)
  return applyStage1Module(character, BACK_WOODS_ID)
}

describe('Life Module pending award options', () => {
  it('offers known Federated Suns languages without raw text entry', () => {
    const character = backWoodsDraft()
    const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'commonality.language.fedsuns')!
    expect(pendingAwardOptions(pending, character)).toEqual(expect.arrayContaining([
      expect.objectContaining({ targetId: 'skill.language', displayName: 'Language/English' }),
      expect.objectContaining({ targetId: 'skill.language', displayName: 'Language/French' }),
    ]))
  })

  it('offers safe Survival subskills from current Alpha data', () => {
    const character = backWoodsDraft()
    const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'back-woods.skill.survival')!
    expect(pendingAwardOptions(pending, character).map((entry) => entry.displayName)).toEqual([
      'Survival/Badlands', 'Survival/Desert', 'Survival/Forest',
    ])
  })

  it('shows readable Trait choices while retaining stable IDs internally', () => {
    const character = backWoodsDraft()
    const pending = character.creation.lifeModules!.pendingAwards.find((entry) => entry.awardId === 'back-woods.flexible')!
    const options = pendingAwardOptions({ ...pending, allowedTargetTypes: ['trait'] }, character)
    expect(options).toContainEqual(expect.objectContaining({ displayName: 'Fit', targetId: 'trait.fit', type: 'trait' }))
  })
})
