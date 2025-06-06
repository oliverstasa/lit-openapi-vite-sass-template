import sass from 'rollup-plugin-sass';
import typescript from '@rollup/plugin-typescript';

const config = [
  {
    input: {
      index: './src/index.js',
    },
    output: {
      dir: 'dist',
      format: 'esm',
      exports: 'named'
    },
    preserveEntrySignatures: 'strict',
    plugins: [
      sass(),
      typescript()
    ],
  }
];

export default config;