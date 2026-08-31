import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

import { worksData } from './src/data/works';

// One shareable, richly-unfurling page per release, pre-rendered alongside the static routes.
// Engineering credits are excluded — they link out (third-party) or back to a real entry (own).
const releasePaths = Object.values(worksData).flatMap(section =>
  section.items.filter(item => item.meta.kind !== 'engineering').map(item => `/works/${item.id}`));

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
        additionalData: '@use "@/styles/variables" as *;',
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
      // Static routes (incl. the crawled /pt tree when the flag is on) minus dynamic
      // ones, plus a concrete pre-render path per release — mirrored under /pt too.
      const releases = process.env.VITE_I18N === 'true'
        ? [...releasePaths, ...releasePaths.map(path => `/pt${path}`)]
        : releasePaths;
      return [...paths.filter(path => !path.includes(':')), ...releases];
    },
  },
});
