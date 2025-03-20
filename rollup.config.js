import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';
import { readFileSync } from 'fs';

const pkg = JSON.parse(readFileSync('./package.json', 'utf8'));

// Base configuration for all bundles
const baseConfig = {
  input: 'src/index.js',
  external: [],
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
      presets: [
        [
          '@babel/preset-env',
          {
            targets: '> 0.25%, not dead',
            modules: false,
          },
        ],
      ],
    }),
  ],
};

// Configuration for production bundles
export default [
  // UMD build
  {
    ...baseConfig,
    output: {
      name: 'GeoBlock',
      file: 'dist/geoblock.js',
      format: 'umd',
      sourcemap: true,
      exports: 'default',
    },
  },
  // Minified UMD build
  {
    ...baseConfig,
    output: {
      name: 'GeoBlock',
      file: 'dist/geoblock.min.js',
      format: 'umd',
      sourcemap: true,
      exports: 'default',
    },
    plugins: [...baseConfig.plugins, terser()],
  },
  // ESM build
  {
    ...baseConfig,
    output: {
      file: 'dist/geoblock.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  },
  // TypeScript declarations
  {
    input: 'src/geoblock.d.ts',
    output: {
      file: 'dist/geoblock.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
];
