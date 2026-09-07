import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
    coverage: {
      // Report-only for now. To enforce a minimum, uncomment `thresholds`.
      provider: 'v8',
      reporter: ['text', 'json-summary', 'html'],
      reportsDirectory: './coverage',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.spec.ts', 'src/main.ts', 'src/cli/main.ts'],
      // thresholds: {
      //   lines: 80,
      //   functions: 80,
      //   statements: 80,
      //   branches: 80,
      // },
    },
  },
});
