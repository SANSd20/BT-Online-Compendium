import type { CharacterDefinition } from '../domain/character/model'
import { decodeCharacter, encodeCharacter } from './characterCodec'

export function downloadCharacter(character: CharacterDefinition): void {
  const blob = new Blob([encodeCharacter(character)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `${safeFilename(character.displayName || 'character')}.btoc.json`
  document.body.append(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export async function importCharacterFile(file: File): Promise<CharacterDefinition> {
  return decodeCharacter(await file.text())
}

function safeFilename(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'character'
}
