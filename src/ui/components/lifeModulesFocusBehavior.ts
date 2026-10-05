export function shouldFocusLifeModuleStageHeading(previousPhase: string | undefined, currentPhase: string | undefined, hasCharacter: boolean) {
  return hasCharacter && Boolean(currentPhase) && previousPhase !== currentPhase
}
