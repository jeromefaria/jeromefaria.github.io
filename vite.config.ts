import { fileURLToPath, URL } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig, loadEnv } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';

import { worksData } from './src/data/works.ts';

const releasePaths = Object.values(worksData).flatMap(section =>
  section.items.filter(item => item.meta.kind !== 'engineering').map(item => `/works/${item.id}`));

export default defineConfig({
  plugins: [
    vue(),
    ViteImageOptimizer({
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
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (
            id.includes('/node_modules/vue/') ||
            id.includes('/node_modules/vue-router/') ||
            id.includes('/node_modules/@vue/')
          ) {
            return 'vendor';
          }
          return undefined;
        },
      },
    },
  },
  ssgOptions: {
    script: 'async',
    formatting: 'minify',
    includedRoutes(paths: string[]) {
      const i18nEnabled = loadEnv('production', process.cwd()).VITE_I18N === 'true';
      const releases = i18nEnabled
        ? [...releasePaths, ...releasePaths.map(path => `/pt${path}`)]
        : releasePaths;
      return [...paths.filter(path => !path.includes(':')), ...releases];
    },
  },
});
