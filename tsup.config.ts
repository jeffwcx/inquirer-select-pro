import { defineConfig } from 'tsup';

export default defineConfig([
  {
    name: 'select-pro',
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    platform: 'node',
    dts: true,
    sourcemap: true,
  },
]);
