import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

import { worksData } from './src/data/works.ts';

// One shareable, richly-unfurling page per release, pre-rendered alongside the static routes.
// Engineering credits are excluded — they link out (third-party) or back to a real entry (own).
const releasePaths = Object.values(worksData).flatMap(section =>
  section.items.filter(item => item.meta.kind !== 'engineering').map(item => `/works/${item.id}`));

export default defineConfig({
  plugins: [
    vue(),
    ViteImageOptimizer({
      // Skip assets that are already optimized upstream, so the build doesn't
      // re-compress them: epk/photos keep their embedded IPTC credits, and the
      // responsive variants + hyphema webp come from generate-responsive-images.mjs;
      // a second pass here would only degrade them.
      exclude: /epk[/\\]photos|images[/\\]responsive|images[/\\]hyphema\.webp/,
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
      // Runs only during the production SSG build, so read the flag from
      // .env.production (or the shell env) here — process.env inside the config
      // isn't populated from .env files the way import.meta.env is for app code.
      const i18nEnabled = loadEnv('production', process.cwd()).VITE_I18N === 'true';
      const releases = i18nEnabled
        ? [...releasePaths, ...releasePaths.map(path => `/pt${path}`)]
        : releasePaths;
      return [...paths.filter(path => !path.includes(':')), ...releases];
    },
  },
});
