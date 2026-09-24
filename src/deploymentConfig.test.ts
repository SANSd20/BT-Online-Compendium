import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import viteConfig, { GITHUB_PAGES_BASE_PATH } from '../vite.config'

describe('GitHub Pages deployment configuration', () => {
  it('uses the repository path for production builds and root for local development', async () => {
    expect(GITHUB_PAGES_BASE_PATH).toBe('/BT-Online-Compendium/')
    expect(typeof viteConfig).toBe('function')
    if (typeof viteConfig !== 'function') return

    const buildConfig = await viteConfig({ command: 'build', mode: 'production', isSsrBuild: false, isPreview: false })
    const devConfig = await viteConfig({ command: 'serve', mode: 'development', isSsrBuild: false, isPreview: false })

    expect(buildConfig.base).toBe('/BT-Online-Compendium/')
    expect(devConfig.base).toBe('/')
  })

  it('deploys the checked static dist artifact with minimal Pages permissions', () => {
    const workflow = readFileSync(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8')

    expect(workflow).toContain('branches: [main]')
    expect(workflow).toContain('workflow_dispatch:')
    expect(workflow).toContain('contents: read')
    expect(workflow).toContain('pages: write')
    expect(workflow).toContain('id-token: write')
    expect(workflow).toContain('run: npm ci')
    expect(workflow).toContain('run: npm run check')
    expect(workflow).toContain('run: npm run build')
    expect(workflow).toContain('uses: actions/upload-pages-artifact@v4')
    expect(workflow).toContain('path: dist')
    expect(workflow).toContain('uses: actions/deploy-pages@v4')
  })
})
