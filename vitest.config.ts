import { mergeConfig } from 'vite'
import base from './vite.config'
import { defineConfig } from 'vitest/config'

export default mergeConfig(
  base as import('vite').UserConfig,
  defineConfig({
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./vitest.setup.ts'],
      include: ['src/**/*.{test,spec}.{ts,tsx}'],
    },
  }) as import('vite').UserConfig,
)
