import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import external from 'rollup-plugin-peer-deps-external'
import url from 'rollup-plugin-url'
import resolve from 'rollup-plugin-node-resolve'
import json from 'rollup-plugin-json'

import pkg from './package.json'

export default {
  input: 'src/index.js',
  external: ['stream', 'http', 'url', 'https', 'zlib', 'string_decoder'],
  output: [
    {
      file: pkg.main,
      format: 'cjs',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins: [
    external(),
    url(),
    babel({
      exclude: 'node_modules/**',
      plugins: [ 'external-helpers' ]
    }),
    commonjs(),
    resolve({ 
      jsnext: true, 
      preferBuiltins: true, 
      browser: false 
    }),
    json()
  ]
}
