/**
 * Concrete Language subskills already backed by current character-creation data.
 *
 * A Time of War permits any specific language and does not publish an exhaustive
 * list. This is therefore the governed subset the application can currently
 * offer, not a claim about the complete BattleTech language universe.
 */
export const MODELED_LANGUAGE_SUBSKILLS = [
  'Cantonese',
  'English',
  'French',
  'German',
  'Hindi',
  'Japanese',
  'Mandarin Chinese',
  'Romanian',
  'Russian',
  'Vietnamese',
] as const

const LANGUAGE_ALIASES: Readonly<Record<string, (typeof MODELED_LANGUAGE_SUBSKILLS)[number]>> = {
  Mandarin: 'Mandarin Chinese',
}

export function normalizeModeledLanguage(language: string): string {
  const trimmed = language.trim()
  return LANGUAGE_ALIASES[trimmed] ?? trimmed
}
