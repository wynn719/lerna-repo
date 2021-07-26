const json = require('@rollup/plugin-json');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { babel } = require('@rollup/plugin-babel');

const extensions = ['.js', '.ts'];

module.exports = {
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
    nodeResolve({
      modulesOnly: true,
      extensions,
    }),
    babel({
      exclude: 'node_modules/**',
      babelrc: true,
      babelHelpers: 'bundled',
      extensions,
    })
  ]
};