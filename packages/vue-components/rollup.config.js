import commonjs from '@rollup/plugin-commonjs'; // Convert CommonJS modules to ES6
import vue from 'rollup-plugin-vue'; // Handle .vue SFC files
import babel from '@rollup/plugin-babel';
import typescript from 'rollup-plugin-typescript2';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import dts from 'rollup-plugin-dts';

const extensions = ['.js', '.ts', '.vue'];

export default [{
  input: 'src/index.ts', // Path relative to package.json
  output: [{
    name: 'vueComponents',
    file: 'dist/index.js',
    format: 'umd'
  }, {
    name: 'utils',
    file: 'dist/index.min.js',
    format: 'umd',
    plugins: [
      terser(),
    ]
  }],
  external: ['vue'],
  plugins: [
    resolve({
      modulesOnly: true,
      extensions,
    }),
    commonjs(),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
    }),
    typescript({
      useTsconfigDeclarationDir: true,
      emitDeclarationOnly: true,
    }),
    babel({
      exclude: 'node_modules/**',
      extensions,
      babelHelpers: 'bundled',
    }),
  ],
}, {
  input: 'src/index.ts',
  output: {
    file: 'dist/index.d.ts',
    format: 'es'
  },
  plugins: [
    typescript({
      useTsconfigDeclarationDir: true,
      emitDeclarationOnly: true,
    }),
    vue({
      css: true, // Dynamically inject css as a <style> tag
      compileTemplate: true, // Explicitly convert template to render function
    }),
    dts(),
  ]
}];