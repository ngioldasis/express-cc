import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom', 'axios'],
  target: 'es2018',
  env: {
    NODE_ENV: 'production',
  },
  esbuildOptions(options) {
    options.drop = ['console']; // 👈 This removes all console.* statements
  },
});
