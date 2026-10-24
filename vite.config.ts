/* Author: Nithish Kaliannan Ananth */
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Sub-path hosting (e.g. GitHub Pages at /r2/). Defaults to root for Vercel.
  base: process.env.VITE_BASE || '/',
  plugins: [react()],
  build: {
    // three.js and the admin editor are large by nature; both are lazy
    // chunks that never load on first paint.
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          // Don't drag shared deps (react, scheduler…) into the named groups,
          // or the entry would have to import the WebGL chunk eagerly.
          includeDependenciesRecursively: false,
          groups: [
            // WebGL: loaded after first paint, only on public/RobotX routes.
            { name: 'three', test: /node_modules[\\/](three|three-stdlib|@react-three|@monogrid|troika|camera-controls|maath|meshline|stats-gl|@use-gesture|zustand|suspend-react|its-fine)/ },
            // Admin rich-text editor: only in the admin console chunk.
            { name: 'editor', test: /node_modules[\\/](@tiptap|prosemirror|linkifyjs|orderedmap|rope-sequence|w3c-keyname)/ },
          ],
        },
      },
    },
  },
})
