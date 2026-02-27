import fs from 'node:fs'
import path from 'node:path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { defineConfig, loadEnv } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf-8')) as { version: string }

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl = env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1'
  const apiOrigin = new URL(apiBaseUrl).origin
  const aiApiOrigin = env.VITE_AI_API_URL ?? 'http://localhost:8001'
  const appVersion = process.env.VITE_APP_VERSION ?? env.VITE_APP_VERSION ?? pkg.version

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_APP_VERSION': JSON.stringify(appVersion),
    },
    build: {
      chunkSizeWarningLimit: 800,
      commonjsOptions: {
        include: [/node_modules/],
        transformMixedEsModules: true,
      },
      // No manualChunks – avoids production blank screen / icon registration order issues
    },
    optimizeDeps: {
      include: ['antd', '@ant-design/icons', 'react', 'react-dom'],
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api/v1': {
          target: apiOrigin,
          changeOrigin: true,
          secure: false,
        },
        '/ai-api': {
          target: aiApiOrigin,
          changeOrigin: true,
          secure: false,
          ws: true,
          rewrite: (path) => path.replace(/^\/ai-api/, ''),
        },
      },
    },
    preview: {
      port: 3000,
    },
  }
})
