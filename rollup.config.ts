import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import dts from 'rollup-plugin-dts'
import css from 'rollup-plugin-css-only'
import pkg from './package.json'

export default [
  {
    input: './src/index.ts',
    output: [
      {
        format: 'cjs',
        file: 'dist/index.cjs',
        exports: 'default',
      },
      {
        format: 'es',
        file: pkg.module,
        exports: 'default',
      },
    ],
    plugins: [
      resolve(),
      commonjs(),
      typescript(),
      css({ output: 'bundle.css' }),
    ],
  },
  {
    input: './src/index.ts',
    output: [
      {
        file: pkg.types,
        format: 'es',
      },
    ],
    plugins: [
      dts(),
      css({ output: 'bundle.css' }),
    ],
  },
]
