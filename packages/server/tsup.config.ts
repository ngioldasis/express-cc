import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  shims: true,
  skipNodeModulesBundle: true,
  sourcemap: true,
  clean: true,
  esbuildOptions(options) {
    options.drop = ['console']; // 👈 This removes all console.* statements
  },
});
