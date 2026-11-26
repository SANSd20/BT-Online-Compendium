import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { normalizeCanonicalExport } from './src/experimental/canonicalAreNormalization'

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
  plugins: [react(), ...(command === 'serve' ? [canonicalExportDevPlugin()] : [])],
  define: { __ATOW_BUILD_METADATA__: JSON.stringify(buildMetadata(process.cwd(), command === 'build' ? 'Production' : 'Development')) },
  test: {
    environment: 'node',
  },
}))

function canonicalExportDevPlugin() {
  return {
    name: 'atow-canonical-export-dev-only',
    configureServer(server: { middlewares: { use: (handler: (request: { url?: string }, response: { setHeader: (name: string, value: string) => void; end: (body: string) => void }, next: () => void) => void) => void } }) {
      server.middlewares.use((request, response, next) => {
        const file = request.url === '/__canonical-export/fwl' ? 'free-worlds-league-export.json' : request.url === '/__canonical-export/capellan' ? 'capellan-confederation-export.json' : ''
        if (!file) { next(); return }
        try {
          const root = resolve(process.cwd(), 'src', 'experimental', 'generated', 'canonical')
          const value = JSON.parse(readFileSync(resolve(root, file), 'utf8'))
          const normalized = normalizeCanonicalExport(value, 'c83652c36cb5078aaadc072dea5f57dcad1fd563')
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify(normalized))
        } catch (error) {
          response.setHeader('Content-Type', 'application/json')
          response.end(JSON.stringify({ error: error instanceof Error ? error.message : 'Canonical export unavailable.' }))
        }
      })
    },
  }
}
