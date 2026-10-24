export type BuildMetadata = {
  revision: string
  worktree: 'Clean' | 'Modified' | 'Unknown'
  mode: 'Development' | 'Production'
  candidate: string
}

declare const __ATOW_BUILD_METADATA__: BuildMetadata | undefined

export const BUILD_METADATA: BuildMetadata = typeof __ATOW_BUILD_METADATA__ === 'undefined'
  ? { revision: 'Unknown', worktree: 'Unknown', mode: 'Development', candidate: 'candidate-unknown' }
  : __ATOW_BUILD_METADATA__
