/// <reference types="vite/client" />

// Stub types when test deps are not yet installed (run pnpm install)
declare module 'vitest' {
  export function afterEach(fn: () => void | Promise<void>): void
  export function describe(name: string, fn: () => void): void
  export function it(name: string, fn: () => void | Promise<void>): void
  export const expect: {
  extend: (matchers: Record<string, unknown>) => void
  (value: unknown): {
    toBeInTheDocument: () => void
    toBeTruthy: () => void
    toBe: (value: unknown) => void
    [key: string]: unknown
  }
}
}
declare module 'vitest/config' {
  import { UserConfigExport } from 'vite'
  interface VitestConfigExport extends UserConfigExport {
    test?: Record<string, unknown>
  }
  export function defineConfig(config: VitestConfigExport): UserConfigExport
}
declare module '@testing-library/react' {
  export function cleanup(): void
  export function render(ui: unknown, options?: unknown): { unmount: () => void }
  export const screen: { getByText: (text: string | RegExp) => HTMLElement }
}
declare module '@testing-library/jest-dom/matchers' {
  const matchers: Record<string, unknown>
  export default matchers
}
