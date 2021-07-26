import json from '@rollup/plugin-json';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import typescript from 'rollup-plugin-typescript2';
import { babel } from '@rollup/plugin-babel';
import dts from 'rollup-plugin-dts';

const extensions = ['.js', '.ts'];

export default [{
  input: 'src/index',
  output: [
    {
      name: 'utils',
      file: 'dist/index.js',
      format: 'umd'
    },
    {
      name: 'utils',
      file: 'dist/index.min.js',
      format: 'umd',
      plugins: [
        terser(),
      ]
    }
  ],
  external: ['vue'],
  plugins: [
    json(),
    resolve({
      modulesOnly: true,
      extensions,
    }),
    typescript({
      
    }),
    babel({
      exclude: 'node_modules/**',
      babelrc: true,
      babelHelpers: 'bundled',
      extensions,
    })
  ]
}, {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es'
  },
  plugins: [
    dts(),
  ]
}];