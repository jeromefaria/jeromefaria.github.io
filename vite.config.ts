import vue from '@vitejs/plugin-vue';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

import { worksData } from './src/data/works';

// One shareable, richly-unfurling page per release, pre-rendered alongside the static routes.
const releasePaths = Object.values(worksData).flatMap(section =>
  section.items.map(item => `/works/${item.id}`));

export default defineConfig({
  plugins: [
    vue(),
    ViteImageOptimizer({
      // Re-optimizing would strip the embedded IPTC credits from the downloads.
      exclude: /epk[/\\]photos/,
      jpg: {
        quality: 65,
      },
      png: {
        quality: 75,
      },
      webp: {
        quality: 65,
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/styles/variables" as *;`,
      },
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: true,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths: string[]) {
      // Exclude dynamic routes (the 404 catch-all and /works/:releaseId), then add a
      // concrete pre-render path for every release.
      return [...paths.filter(path => !path.includes(':')), ...releasePaths];
    },
  },
});
