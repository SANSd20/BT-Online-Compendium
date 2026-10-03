import { describe, expect, it } from 'vitest'
import { MODELED_LANGUAGE_SUBSKILLS, normalizeModeledLanguage } from './languages'

describe('governed modeled language source', () => {
  it('exposes the explicit safe subset without duplicate semantic identities', () => {
    expect(MODELED_LANGUAGE_SUBSKILLS).toEqual([
      'Cantonese', 'English', 'French', 'German', 'Hindi', 'Japanese',
      'Mandarin Chinese', 'Romanian', 'Russian', 'Vietnamese',
    ])
    expect(new Set(MODELED_LANGUAGE_SUBSKILLS).size).toBe(MODELED_LANGUAGE_SUBSKILLS.length)
    expect(normalizeModeledLanguage('Mandarin')).toBe('Mandarin Chinese')
    expect(normalizeModeledLanguage(' Russian ')).toBe('Russian')
  })
})
