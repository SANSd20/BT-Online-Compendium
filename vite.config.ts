import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

export const GITHUB_PAGES_BASE_PATH = '/BT-Online-Compendium/'

export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project below the repository name. Keep the
  // development server at / while emitting production assets for that path.
  base: command === 'build' ? GITHUB_PAGES_BASE_PATH : '/',
  plugins: [react()],
  test: {
    environment: 'node',
  },
}))
