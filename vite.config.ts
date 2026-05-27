import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

import { cloudflare } from "@cloudflare/vite-plugin";

export default defineConfig({
  plugins: [react(), tailwindcss(), cloudflare()],
  build: {
    // Target modern browsers — smaller output, fewer polyfills
    target: 'es2022',
    sourcemap: false,
    cssCodeSplit: true,
    assetsInlineLimit: 4096,
    rollupOptions: {
      output: {
        // Split heavy vendors into their own long-cacheable chunks.
        // Motion is ~50KB gzipped — separating it means revisits don't re-download
        // app code when only Motion bumps versions (and vice-versa).
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-dom') || id.includes('/react/')) return 'react'
            if (id.includes('motion')) return 'motion'
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'motion'],
  },
})