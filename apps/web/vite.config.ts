import react from '@vitejs/plugin-react'
import path from 'path'
import { fileURLToPath } from 'url'
import { defineConfig } from 'vite'

// These two lines safely recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default defineConfig({
  plugins: [react()],
  root: '.',
  resolve: {
    alias: {
      '@booknest/ui': path.resolve(__dirname, '../../packages/ui/src'),
      '@booknest/utils': path.resolve(__dirname, '../../packages/utils/src'),
      '@booknest/pages': path.resolve(__dirname, '../../packages/pages/src'),
      '@booknest/services': path.resolve(__dirname, '../../packages/api/src'),
      '@booknest/ui-helpers': path.resolve(
        __dirname,
        '../../packages/ui-helpers/src'
      ),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
  server: {
    port: 3000,
    open: true,
  },
})
