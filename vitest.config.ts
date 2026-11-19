import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  css: {
    postcss: {
      plugins: []
    }
  },
  resolve: {
    alias: {
      '@monbilan/domain': resolve(__dirname, 'packages/domain/src/index.ts'),
      '@monbilan/contracts': resolve(__dirname, 'packages/contracts/src/index.ts'),
      '@monbilan/config': resolve(__dirname, 'packages/config/src/index.ts'),
      '@monbilan/ai-adapters': resolve(__dirname, 'packages/ai-adapters/src/index.ts')
    }
  },
  test: {
    environment: 'node',
    include: ['tests/**/*.spec.ts', 'packages/**/*.spec.ts']
  }
});
