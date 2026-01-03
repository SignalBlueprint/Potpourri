/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// TODO: Uncomment when @signal-core/catalog-react-sdk is available
// import path from 'path'

export default defineConfig({
  plugins: [react()],
  // TODO: Uncomment when @signal-core/catalog-react-sdk is available
  // resolve: {
  //   alias: {
  //     '@signal-core/catalog-react-sdk': path.resolve(
  //       __dirname,
  //       '../signal-catalog/packages/react-sdk/dist/index.js'
  //     ),
  //   },
  //   preserveSymlinks: false,
  // },
  // optimizeDeps: {
  //   include: ['@signal-core/catalog-react-sdk'],
  // },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
  },
})
