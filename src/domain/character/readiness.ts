import type { CharacterDefinition, CharacterRecordSheet, FinalizedCharacterSnapshot } from './model'
import { deriveAging } from './aging'
import { deriveCharacterRecordSheet } from './recordSheet'
import { getFinalReviewBlockers } from '../lifeModules/finalReview'
import { getEquipmentFoundationIssues } from '../finalTouches/rules'
import { validateCharacter } from '../../validation/validateCharacter'
import { APP_VERSION } from '../../appMetadata'
import { deriveStasisAttributeLosses } from './stasis'

export type ReadinessStatus = 'incomplete' | 'ready-for-final-touches' | 'ready-for-play'
export interface ReadinessFinding {
  id: string
  area: 'creation' | 'final-review' | 'aging' | 'final-touches' | 'record-sheet' | 'equipment' | 'specialty'
  message: string
  resolution?: string
  sources: string[]
}
export interface ReadinessEvaluation {
  status: ReadinessStatus
  blockers: ReadinessFinding[]
  advisories: ReadinessFinding[]
  sources: string[]
  recordSheet: CharacterRecordSheet
}

const source = 'AToW Corrected Third Printing'
const finding = (id: string, area: ReadinessFinding['area'], message: string, resolution?: string, sources = [source]): ReadinessFinding => ({ id, area, message, ...(resolution ? { resolution } : {}), sources })

export function evaluateCharacterReadiness(character: CharacterDefinition): ReadinessEvaluation {
  const blockers: ReadinessFinding[] = []
  const advisories: ReadinessFinding[] = []
  const validation = validateCharacter(character)
  for (const issue of validation.issues.filter((entry) => entry.severity === 'error' || entry.severity === 'warning')) {
    blockers.push(finding(`validation.${issue.id}`, issue.path.startsWith('creation.finalTouches') ? 'final-touches' : issue.path.startsWith('creation.lifeModules') ? 'creation' : 'creation', issue.message, 'Resolve the indicated validation issue.'))
  }
  for (const issue of validation.issues.filter((entry) => entry.severity === 'information')) advisories.push(finding(`advisory.${issue.id}`, 'creation', issue.message))

  if (!character.displayName.trim()) blockers.push(finding('identity.name.required', 'creation', 'A character name is required.', 'Enter a character name.'))
  if (character.creation.method === 'life-modules') {
    const state = character.creation.lifeModules
    if (!state || state.phase !== 'ready-for-final-touches' || !state.finalReview) blockers.push(finding('life-modules.incomplete', 'creation', 'Life Module creation has not reached completed Final Review.', 'Complete the supported Life Module path and Final Review.'))
    if (state) {
      for (const item of getFinalReviewBlockers(character)) blockers.push(finding(`final-review.${item.id}`, item.id === 'specialty-gm-approval' ? 'specialty' : 'final-review', item.message, 'Resolve the Final Review blocker before finalizing.'))
      if (state.pendingAwards.length > 0) blockers.push(finding('life-modules.pending-awards', 'creation', 'Mandatory Life Module awards remain unresolved.', 'Resolve all pending awards.'))
      if (state.prerequisiteIssues.some((item) => item.status === 'outstanding' && item.finalValidationRequired)) blockers.push(finding('life-modules.prerequisites', 'creation', 'Mandatory Life Module prerequisites remain unresolved.', 'Resolve or remove the affected selection.'))
    }
  }

  const aging = deriveAging(character)
  if (aging.unsupported.length > 0) blockers.push(finding('aging.unsupported', 'aging', aging.unsupported.join(' '), 'Use a source-supported age or defer finalization.'))
  if (!aging.legal) blockers.push(finding('aging.illegal', 'aging', 'Derived aging effects leave an Attribute below the supported minimum.', 'Review the resulting Attribute state.'))
  for (const event of character.stasisHistory ?? []) {
    if (event.survivalStatus === 'fatal') blockers.push(finding(`stasis.${event.id}.fatal`, 'aging', 'A Stasis event records a fatal outcome; the character cannot be ready for play.', 'Preserve the event and resolve it outside character creation.'))
    if (event.survivalStatus === 'unresolved' || event.unresolvedConditions.length > 0) blockers.push(finding(`stasis.${event.id}.unresolved`, 'aging', 'A Stasis event has unresolved mandatory checks or adjudication.', 'Record all required checks and resolve mandatory outcomes.'))
  }
  const losses = deriveStasisAttributeLosses(character)
  if (losses.BOD >= 1 && losses.INT >= 1 && character.attributes.some((entry) => entry.attributeId === 'BOD' || entry.attributeId === 'INT')) advisories.push(finding('stasis.attribute-losses', 'record-sheet', `Stasis has recorded BOD -${losses.BOD} and INT -${losses.INT}; these are not XP changes.`))

  if (!character.creation.finalTouches) blockers.push(finding('final-touches.required', 'final-touches', 'Final Touches must be completed before a character is ready for play.', 'Enter Final Touches and complete the supported identity and equipment review.'))
  if (character.creation.finalTouches) {
    const description = character.personalDescription
    const familyTraining = character.lifeModuleHistory.some((entry) => entry.moduleId === 'stage3.family-training')
    const solaris = character.lifeModuleHistory.some((entry) => entry.moduleId === 'stage3.solaris-internship')
    if (familyTraining && !description?.homeworld?.trim()) blockers.push(finding('final-touches.homeworld.required', 'final-touches', 'Family Training requires a recorded homeworld.', 'Enter the source-bound homeworld.'))
    if (solaris && !description?.residence?.trim()) blockers.push(finding('final-touches.residence.required', 'final-touches', 'Solaris Internship requires recorded residence.', 'Enter the source-bound residence.'))
    const equipmentIssues = getEquipmentFoundationIssues(character)
    for (const issue of equipmentIssues) blockers.push(finding(`equipment.${issue.id}`, 'equipment', issue.message, 'Correct the equipment draft.'))
    if (character.creation.finalTouches.equipmentReviewState !== 'ready-for-equipment-review') blockers.push(finding('equipment.review.required', 'equipment', 'The equipment draft has not been marked ready for equipment review.', 'Review the equipment draft and mark it ready.'))
  }

  const recordSheet = deriveCharacterRecordSheet(character)
  for (const item of recordSheet.outstanding.filter((entry) => !entry.includes('TN/Complexity unavailable'))) advisories.push(finding(`record-sheet.${item}`, 'record-sheet', item))
  advisories.push(finding('record-sheet.tn-complexity', 'record-sheet', 'Some Skill TN/Complexity metadata remains unavailable; this does not prevent a supported character from being playable.'))
  advisories.push(finding('scope.equipment', 'equipment', 'The equipment catalog and active gameplay effects remain partial Alpha coverage.'))
  advisories.push(finding('scope.pdf', 'record-sheet', 'PDF record-sheet export is not implemented.'))

  const status: ReadinessStatus = blockers.length > 0
    ? (character.creation.lifeModules?.phase === 'ready-for-final-touches' ? 'ready-for-final-touches' : 'incomplete')
    : 'ready-for-play'
  return { status, blockers, advisories, sources: [source, 'AToW v4.0 Errata'], recordSheet }
}

export function finalizeCharacterSnapshot(character: CharacterDefinition, now = new Date().toISOString(), id = globalThis.crypto?.randomUUID?.() ?? `snapshot-${Date.now()}`): CharacterDefinition {
  const evaluation = evaluateCharacterReadiness(character)
  if (evaluation.status !== 'ready-for-play') throw new Error(`Character is not ready for play: ${evaluation.blockers.map((item) => item.message).join(' ')}`)
  const snapshotCharacter = structuredClone(character)
  delete snapshotCharacter.finalizedSnapshots
  const snapshot: FinalizedCharacterSnapshot = {
    id,
    characterId: character.id,
    createdAt: now,
    sourceVersion: APP_VERSION,
    readiness: 'ready-for-play',
    character: snapshotCharacter,
    recordSheet: evaluation.recordSheet,
    provenanceIds: character.provenance.map((item) => item.id),
  }
  return { ...character, finalizedSnapshots: [...(character.finalizedSnapshots ?? []), snapshot], updatedAt: now }
}
