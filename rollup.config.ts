import resolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import cssnano from 'cssnano'
import dts from 'rollup-plugin-dts'
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
    plugins: [dts()],
  },
  {
    input: './src/styles/style.css',
    output: {
      dir: 'dist',
    },
    plugins: [
      postcss({
        plugins: [
          cssnano(),
        ],
      }),
    ],
  },
]
