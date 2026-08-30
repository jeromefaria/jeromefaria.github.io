import { fileURLToPath } from 'node:url';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test-setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/e2e/**',
      // The Worker targets the Cloudflare Workers runtime, not happy-dom — it has its own vitest.
      '**/worker/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build,playwright}.config.*',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'json-summary', 'html'],
      // Instrument all source files, not only those a test imports, so the
      // reported coverage reflects the whole codebase rather than the tested subset.
      all: true,
      include: ['src/**/*.{ts,vue}'],
      exclude: [
        'node_modules/',
        'dist/',
        'e2e/',
        '**/*.d.ts',
        '**/*.config.ts',
        '**/*.test.ts',
        '**/types/**',
        'src/main.ts',
        'src/test-support/**',
      ],
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
