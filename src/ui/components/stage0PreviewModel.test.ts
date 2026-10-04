import { describe, expect, it } from 'vitest'
import { CAPELLAN_COMMONALITY_ID, FEDERATED_SUNS_CRUCIS_MARCH_ID } from '../../domain/lifeModules/catalog'
import { applyStage0Affiliation, createLifeModuleCharacter } from '../../engine/lifeModuleEngine'
import { decodeCharacter, encodeCharacter } from '../../persistence/characterCodec'
import { committedLifeModulesThemeIdentity, lifeModulesAffiliationTheme, lifeModulesThemeIdentity, previewStage0Affiliation } from './stage0PreviewModel'

type Stage0Character = ReturnType<typeof createLifeModuleCharacter>

function stage0Signature(character: Stage0Character) {
  const state = character.creation.lifeModules!
  return {
    attributes: character.attributes.map(({ attributeId, accumulatedXp }) => [attributeId, accumulatedXp]),
    traits: character.traits.map(({ displayName, accumulatedXp }) => [displayName, accumulatedXp]).sort(),
    skills: character.skills.map(({ displayName, accumulatedXp }) => [displayName, accumulatedXp]).sort(),
    pendingAwards: state.pendingAwards.map(({ moduleId, awardId, xpPerGrant, remainingGrants, choiceSource }) => ({ moduleId, awardId, xpPerGrant, remainingGrants, choiceSource })).sort((left, right) => left.awardId.localeCompare(right.awardId)),
    selectedModuleIds: [...state.selectedModuleIds],
    moduleXp: { ...state.moduleXp },
    affiliationContext: state.stage0AffiliationContext,
    affiliationLanguage: state.affiliationLanguage,
    affiliations: character.affiliations.map(({ affiliationId, role }) => ({ affiliationId, role })),
  }
}

describe('Stage 0 preview model', () => {
  it('waits for an explicit context before building a preview', () => {
    const character = createLifeModuleCharacter('Preview')
    expect(previewStage0Affiliation(character, '', '', '')).toBeNull()
    expect(character.creation.lifeModules?.stage0AffiliationContext).toBeUndefined()
    expect(character.creation.lifeModules?.affiliationLanguage).toBeUndefined()
  })

  it('previews deterministic package effects when only the Capellan context is selected', () => {
    const character = createLifeModuleCharacter('Partial Preview')
    const committedJson = JSON.stringify(character)
    const preview = previewStage0Affiliation(character, CAPELLAN_COMMONALITY_ID, '', '')
    expect(preview?.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(150)
    expect(preview?.traits).toContainEqual(expect.objectContaining({ displayName: 'Exceptional Attribute/EDG', accumulatedXp: 100 }))
    expect(preview?.skills).toContainEqual(expect.objectContaining({ displayName: 'Protocol/Capellan', accumulatedXp: 10 }))
    expect(preview?.creation.lifeModules?.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining([
      'universal.language.affiliation',
      'capellan.language.secondary',
      'commonality.language.fedsuns',
    ]))
    expect(JSON.stringify(character)).toBe(committedJson)
  })

  it('activates the Capellan theme only for the Capellan context', () => {
    expect(lifeModulesAffiliationTheme(CAPELLAN_COMMONALITY_ID)).toBe('capellan-theme')
    expect(lifeModulesAffiliationTheme('')).toBe('')
    expect(lifeModulesAffiliationTheme('stage0.some-future-context')).toBe('')
  })

  it('activates and previews the source-backed Davion context without leaking the Capellan theme', () => {
    const character = createLifeModuleCharacter('Davion preview')
    const preview = previewStage0Affiliation(character, FEDERATED_SUNS_CRUCIS_MARCH_ID, '', '')
    expect(lifeModulesAffiliationTheme(FEDERATED_SUNS_CRUCIS_MARCH_ID)).toBe('davion-theme')
    expect(lifeModulesAffiliationTheme(CAPELLAN_COMMONALITY_ID)).toBe('capellan-theme')
    expect(preview?.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(150)
    expect(preview?.skills.find((entry) => entry.displayName === 'Protocol/FedSuns')?.accumulatedXp).toBe(25)
    expect(preview?.creation.lifeModules?.pendingAwards.map((entry) => entry.awardId)).toEqual(expect.arrayContaining(['fedsuns.trait.natural-aptitude', 'crucis.skill.art']))
  })

  it('gives canonical Order affiliation priority while retaining birth identity as secondary', () => {
    expect(lifeModulesThemeIdentity(FEDERATED_SUNS_CRUCIS_MARCH_ID, 'no')).toEqual({ className: 'davion-theme', dominantLabel: 'Federated Suns', birthLabel: 'Federated Suns' })
    expect(lifeModulesThemeIdentity(CAPELLAN_COMMONALITY_ID, 'no')).toEqual({ className: 'capellan-theme', dominantLabel: 'Capellan Confederation', birthLabel: 'Capellan Confederation' })
    expect(lifeModulesThemeIdentity(FEDERATED_SUNS_CRUCIS_MARCH_ID, 'comstar')).toEqual({ className: 'order-theme comstar-theme birth-davion', dominantLabel: 'ComStar', birthLabel: 'Federated Suns' })
    expect(lifeModulesThemeIdentity(CAPELLAN_COMMONALITY_ID, 'comstar')).toEqual({ className: 'order-theme comstar-theme birth-capellan', dominantLabel: 'ComStar', birthLabel: 'Capellan Confederation' })
    expect(lifeModulesThemeIdentity(FEDERATED_SUNS_CRUCIS_MARCH_ID, 'word-of-blake')).toEqual({ className: 'order-theme wob-theme birth-davion', dominantLabel: 'Word of Blake', birthLabel: 'Federated Suns' })
    expect(lifeModulesThemeIdentity(CAPELLAN_COMMONALITY_ID, 'word-of-blake')).toEqual({ className: 'order-theme wob-theme birth-capellan', dominantLabel: 'Word of Blake', birthLabel: 'Capellan Confederation' })
  })

  it('switches Order themes without stale palette classes and restores the birth theme', () => {
    const transitions = ['no', 'comstar', 'word-of-blake', 'comstar', 'no'] as const
    expect(transitions.map((order) => lifeModulesAffiliationTheme(FEDERATED_SUNS_CRUCIS_MARCH_ID, order))).toEqual([
      'davion-theme',
      'order-theme comstar-theme birth-davion',
      'order-theme wob-theme birth-davion',
      'order-theme comstar-theme birth-davion',
      'davion-theme',
    ])
    expect(lifeModulesAffiliationTheme(CAPELLAN_COMMONALITY_ID, 'word-of-blake')).toBe('order-theme wob-theme birth-capellan')
  })

  it('derives the dominant theme from committed canonical state after persistence', () => {
    const committed = applyStage0Affiliation(
      createLifeModuleCharacter('Persistent ComStar theme'),
      FEDERATED_SUNS_CRUCIS_MARCH_ID,
      'English',
      undefined,
      'Strategy',
      undefined,
      'comstar',
      CAPELLAN_COMMONALITY_ID,
      'Russian',
      'Electronic',
      'no',
    )
    const decoded = decodeCharacter(encodeCharacter(committed, '2026-10-04T00:00:00.000Z'))
    expect(committedLifeModulesThemeIdentity(decoded)).toEqual({ className: 'order-theme comstar-theme birth-davion', dominantLabel: 'ComStar', birthLabel: 'Federated Suns' })
    const legacyNoOrder = structuredClone(decoded)
    delete legacyNoOrder.creation.lifeModules!.orderAffiliation
    expect(committedLifeModulesThemeIdentity(legacyNoOrder).className).toBe('davion-theme')
  })

  it('previews through the existing engine without mutating the committed character', () => {
    const character = createLifeModuleCharacter('Preview')
    const committedJson = JSON.stringify(character)
    const preview = previewStage0Affiliation(character, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')
    expect(preview?.creation.lifeModules?.phase).toBe('stage-1-selection')
    expect(preview?.affiliations).toHaveLength(2)
    expect(preview?.skills).toContainEqual(expect.objectContaining({ displayName: 'Language/Mandarin Chinese', accumulatedXp: 20 }))
    expect(preview?.skills).toContainEqual(expect.objectContaining({ displayName: 'Language/Russian', accumulatedXp: 10 }))
    expect(JSON.stringify(character)).toBe(committedJson)
    expect(character.creation.lifeModules?.phase).toBe('stage-0-affiliation')
    expect(character.affiliations).toHaveLength(0)
  })

  it('matches the source-backed clean Capellan/Commonality and Federated Suns/Crucis signatures', () => {
    const capellan = previewStage0Affiliation(createLifeModuleCharacter('Capellan baseline'), CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')!
    expect(stage0Signature(capellan)).toMatchObject({
      moduleXp: { spent: 1000, remaining: 4000 },
      affiliationContext: CAPELLAN_COMMONALITY_ID,
      affiliationLanguage: 'Mandarin Chinese',
      affiliations: [
        { affiliationId: 'affiliation.capellan-confederation', role: 'birth' },
        { affiliationId: 'affiliation.capellan-confederation', role: 'final' },
      ],
    })
    expect(capellan.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(150)
    expect(capellan.attributes.find((entry) => entry.attributeId === 'EDG')?.accumulatedXp).toBe(150)
    expect(capellan.traits.map(({ displayName, accumulatedXp }) => [displayName, accumulatedXp])).toEqual(expect.arrayContaining([
      ['Exceptional Attribute/EDG', 100], ['Compulsion/Paranoia', -100], ['Wealth', 15],
    ]))
    expect(capellan.skills.map(({ displayName, accumulatedXp }) => [displayName, accumulatedXp])).toEqual(expect.arrayContaining([
      ['Language/Mandarin Chinese', 20], ['Language/Russian', 10], ['Protocol/Capellan', 10], ['Protocol/FedSuns', 5], ['Martial Arts', 5],
    ]))
    expect(capellan.creation.lifeModules!.pendingAwards).toContainEqual(expect.objectContaining({
      awardId: 'commonality.language.fedsuns', xpPerGrant: 5, choiceSource: 'federated-suns-languages', description: 'Choose any Federated Suns language.',
    }))
    expect(capellan.creation.lifeModules!.pendingAwards.map((entry) => entry.awardId)).not.toEqual(expect.arrayContaining(['fedsuns.trait.natural-aptitude', 'crucis.skill.art']))

    const davion = previewStage0Affiliation(createLifeModuleCharacter('Davion baseline'), FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English', '', 'Strategy', 'Painting')!
    expect(stage0Signature(davion)).toMatchObject({
      moduleXp: { spent: 1000, remaining: 4000 },
      affiliationContext: FEDERATED_SUNS_CRUCIS_MARCH_ID,
      affiliationLanguage: 'English',
      affiliations: [
        { affiliationId: 'affiliation.federated-suns', role: 'birth' },
        { affiliationId: 'affiliation.federated-suns', role: 'final' },
      ],
    })
    expect(davion.attributes.find((entry) => entry.attributeId === 'WIL')?.accumulatedXp).toBe(150)
    expect(davion.attributes.find((entry) => entry.attributeId === 'EDG')?.accumulatedXp).toBe(50)
    expect(davion.traits).toContainEqual(expect.objectContaining({ displayName: 'Natural Aptitude/Strategy', accumulatedXp: 100 }))
    expect(davion.skills.map(({ displayName, accumulatedXp }) => [displayName, accumulatedXp])).toEqual(expect.arrayContaining([
      ['Language/English', 40], ['Protocol/FedSuns', 25], ['Art/Painting', 10], ['Interest/FedSuns History', 15],
    ]))
    expect(davion.creation.lifeModules!.pendingAwards).toHaveLength(0)
    expect(davion.skills.some((entry) => entry.displayName === 'Protocol/Capellan')).toBe(false)
  })

  it('rebuilds both switch directions and repeated switches from the committed draft without abandoned state', () => {
    const committed = createLifeModuleCharacter('Switch isolation')
    const committedJson = JSON.stringify(committed)
    const cleanCapellan = previewStage0Affiliation(committed, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')!
    const cleanDavion = previewStage0Affiliation(committed, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English', '', 'Protocol', 'Painting')!

    previewStage0Affiliation(committed, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English', '', 'Strategy', 'Painting')
    const afterDavionToCapellan = previewStage0Affiliation(committed, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')!
    expect(stage0Signature(afterDavionToCapellan)).toEqual(stage0Signature(cleanCapellan))
    expect(afterDavionToCapellan.traits.some((entry) => entry.displayName?.startsWith('Natural Aptitude/'))).toBe(false)
    expect(afterDavionToCapellan.skills.some((entry) => entry.displayName === 'Art/Painting')).toBe(false)

    previewStage0Affiliation(committed, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')
    const afterCapellanToDavion = previewStage0Affiliation(committed, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English', '', 'Protocol', 'Painting')!
    expect(stage0Signature(afterCapellanToDavion)).toEqual(stage0Signature(cleanDavion))
    expect(afterCapellanToDavion.creation.lifeModules!.pendingAwards.some((entry) => entry.awardId === 'commonality.language.fedsuns')).toBe(false)
    expect(afterCapellanToDavion.skills.some((entry) => entry.displayName === 'Protocol/Capellan')).toBe(false)

    const repeatedCapellan = previewStage0Affiliation(committed, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')!
    const repeatedDavion = previewStage0Affiliation(committed, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English', '', 'Protocol', 'Painting')!
    expect(stage0Signature(repeatedCapellan)).toEqual(stage0Signature(cleanCapellan))
    expect(stage0Signature(repeatedDavion)).toEqual(stage0Signature(cleanDavion))
    expect(new Set(repeatedCapellan.creation.lifeModules!.pendingAwards.map((entry) => entry.awardId)).size).toBe(repeatedCapellan.creation.lifeModules!.pendingAwards.length)
    expect(JSON.stringify(committed)).toBe(committedJson)
  })

  it('rejects an abandoned Universal language and exports only the final committed affiliation', () => {
    const committed = createLifeModuleCharacter('Committed boundary')
    expect(previewStage0Affiliation(committed, CAPELLAN_COMMONALITY_ID, 'German', 'Russian')).toBeNull()
    expect(previewStage0Affiliation(committed, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'Mandarin Chinese', '', 'Protocol', 'Painting')).toBeNull()

    const capellanPreview = previewStage0Affiliation(committed, CAPELLAN_COMMONALITY_ID, 'Mandarin Chinese', 'Russian')!
    expect(encodeCharacter(committed)).not.toContain(CAPELLAN_COMMONALITY_ID)
    expect(JSON.stringify(committed)).not.toContain('Language/Mandarin Chinese')

    const finalCommitted = applyStage0Affiliation(committed, FEDERATED_SUNS_CRUCIS_MARCH_ID, 'English', undefined, 'Protocol', 'Painting')
    const exported = encodeCharacter(finalCommitted, '2026-10-02T00:00:00.000Z')
    expect(exported).toContain(FEDERATED_SUNS_CRUCIS_MARCH_ID)
    expect(exported).toContain('Natural Aptitude/Protocol')
    expect(exported).not.toContain(CAPELLAN_COMMONALITY_ID)
    expect(exported).not.toContain('Protocol/Capellan')
    expect(exported).not.toContain('Language/Mandarin Chinese')
    expect(stage0Signature(capellanPreview)).not.toEqual(stage0Signature(finalCommitted))
  })

  it('resolves Federated Suns affiliation languages against the selected context and can continue', () => {
    const committed = createLifeModuleCharacter('Federated Suns language regression')
    const committedExport = encodeCharacter(committed, '2026-10-04T00:00:00.000Z')
    const preview = previewStage0Affiliation(
      committed,
      FEDERATED_SUNS_CRUCIS_MARCH_ID,
      'French',
      '',
      'Strategy',
      'Painting',
      'no',
      '',
      '',
      '',
      FEDERATED_SUNS_CRUCIS_MARCH_ID,
    )!

    expect(preview).not.toBeNull()
    expect(preview.creation.lifeModules?.phase).toBe('stage-1-selection')
    expect(preview.creation.lifeModules?.pendingAwards).toHaveLength(0)
    expect(preview.skills).toContainEqual(expect.objectContaining({ displayName: 'Language/French', accumulatedXp: 20 }))
    expect(encodeCharacter(committed, '2026-10-04T00:00:00.000Z')).toBe(committedExport)

    const continued = applyStage0Affiliation(
      committed,
      FEDERATED_SUNS_CRUCIS_MARCH_ID,
      'French',
      undefined,
      'Strategy',
      'Painting',
      'no',
      undefined,
      undefined,
      undefined,
      FEDERATED_SUNS_CRUCIS_MARCH_ID,
    )
    expect(continued.creation.lifeModules?.phase).toBe('stage-1-selection')
    expect(continued.creation.lifeModules?.pendingAwards).toHaveLength(0)
  })

  it('does not retain language blockers while switching sub-affiliation, language, or order layer', () => {
    const committed = createLifeModuleCharacter('Stage 0 switching regression')
    const cases = [
      { language: 'German', sub: 'no', order: 'no' as const, nearest: '', orderLanguage: '', technician: '' },
      { language: 'Russian', sub: FEDERATED_SUNS_CRUCIS_MARCH_ID, order: 'no' as const, nearest: '', orderLanguage: '', technician: '' },
      { language: 'French', sub: 'no', order: 'comstar' as const, nearest: CAPELLAN_COMMONALITY_ID, orderLanguage: 'Russian', technician: 'Electronic' },
      { language: 'Hindi', sub: FEDERATED_SUNS_CRUCIS_MARCH_ID, order: 'word-of-blake' as const, nearest: CAPELLAN_COMMONALITY_ID, orderLanguage: 'Russian', technician: 'Electronic' },
    ]

    for (const entry of cases) {
      const preview = previewStage0Affiliation(
        committed,
        FEDERATED_SUNS_CRUCIS_MARCH_ID,
        entry.language,
        '',
        'Strategy',
        entry.sub === 'no' ? '' : 'Painting',
        entry.order,
        entry.nearest,
        entry.orderLanguage,
        entry.technician,
        entry.sub,
      )!
      expect(preview).not.toBeNull()
      expect(preview.creation.lifeModules?.phase).toBe('stage-1-selection')
      expect(preview.creation.lifeModules?.pendingAwards).toHaveLength(0)
      expect(preview.skills).toContainEqual(expect.objectContaining({ displayName: `Language/${entry.language}` }))
      if (entry.sub === 'no') expect(preview.skills.some((skill) => skill.displayName === 'Art/Painting')).toBe(false)
    }

    expect(committed.creation.lifeModules?.phase).toBe('stage-0-affiliation')
    expect(committed.creation.lifeModules?.pendingAwards).toContainEqual(expect.objectContaining({ awardId: 'universal.language.affiliation' }))
  })
})
