import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgrPlugin from 'vite-plugin-svgr'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [react(), tsconfigPaths(), svgrPlugin()],
  build: {
    outDir: 'build',
    sourcemap: true,
  },
  preview: {
    // eslint-disable-next-line no-undef
    port: process.env.PORT || 3000,
  },
})
