/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Resolve the SDK from the linked location
      '@signal-core/catalog-react-sdk': path.resolve(
        __dirname,
        '../signal-catalog/packages/react-sdk/dist/index.js'
      ),
    },
    // Ensure symlinks are followed
    preserveSymlinks: false,
  },
  optimizeDeps: {
    // Include the SDK in dependency optimization
    include: ['@signal-core/catalog-react-sdk'],
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
