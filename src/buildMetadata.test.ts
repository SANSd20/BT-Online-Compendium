import { describe, expect, it } from 'vitest'
import { BUILD_METADATA } from './buildMetadata'

describe('build metadata contract', () => {
  it('provides safe candidate metadata without exposing local paths', () => {
    expect(BUILD_METADATA.candidate).toMatch(/^candidate-[a-f0-9]{12}$|^candidate-unknown$/)
    expect(BUILD_METADATA.revision).not.toContain('\\')
    expect(BUILD_METADATA.worktree).toMatch(/^(Clean|Modified|Unknown)$/)
    expect(BUILD_METADATA.mode).toMatch(/^(Development|Production)$/)
  })
})
