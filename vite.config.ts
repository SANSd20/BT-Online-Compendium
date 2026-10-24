import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

export const GITHUB_PAGES_BASE_PATH = '/BT-Online-Compendium/'

function git(root: string, args: string[]): string | null {
  try { return execFileSync('git', ['-C', root, ...args], { encoding: 'utf8' }).trim() } catch { return null }
}

function buildMetadata(root: string, mode: 'Development' | 'Production') {
  const revision = git(root, ['rev-parse', '--short', 'HEAD']) ?? 'Unknown'
  const status = git(root, ['status', '--short'])
  const worktree = status === null ? 'Unknown' : status.split(/\r?\n/).filter((line) => line && !line.endsWith(' debug.log')).length === 0 ? 'Clean' : 'Modified'
  const files = (git(root, ['ls-files', '--cached', '--others', '--exclude-standard']) ?? '').split(/\r?\n/)
    .filter((file) => file && file !== 'debug.log' && (file.startsWith('src/') || file.startsWith('public/') || file === 'package.json' || file === 'package-lock.json' || file === 'vite.config.ts' || file === 'index.html'))
    .sort()
  const hash = createHash('sha256')
  for (const file of files) {
    hash.update(file).update('\0').update(readFileSync(resolve(root, file))).update('\0')
  }
  const candidate = files.length ? `candidate-${hash.digest('hex').slice(0, 12)}` : 'candidate-unknown'
  return { revision, worktree, mode, candidate }
}

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project below the repository name. Keep the
  // development server at / while emitting production assets for that path.
  base: command === 'build' ? GITHUB_PAGES_BASE_PATH : '/',
  plugins: [react()],
  define: { __ATOW_BUILD_METADATA__: JSON.stringify(buildMetadata(process.cwd(), command === 'build' ? 'Production' : 'Development')) },
  test: {
    environment: 'node',
  },
}))
