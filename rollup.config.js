import typescript from 'rollup-plugin-typescript2';
import {terser} from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';

export default [
    {
        input: './src/index.ts',
        plugins: [
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        module: "ES2015"
                    }
                }
            }),
            commonjs({
                extensions: ['.js', '.ts']
            })
        ],
        output: {
            format: 'umd',
            file: './dist/eventproxy.js', 
            name: 'EventProxy',
            extend: false,
            sourcemap: false,
        },
    },
    {
        input: './src/index.ts',
        plugins: [
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        module: "ES2015"
                    }
                }
            }),
            commonjs({
                extensions: ['.js', '.ts']
            }),
            terser({
                output: {
                    comments: false
                },
                exclude: ['node_moudles/**'],
                sourcemap: false
            })
        ],
        output: {
            format: 'umd',
            file: './dist/eventproxy.min.js', 
            name: 'EventProxy',
            extend: false,
            sourcemap: false,
        },
    },
    {
        input: './src/index.ts',
        plugins: [
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        module: "ES2015",
                        target: "ES2015"
                    }
                }
            }),
            commonjs({
                extensions: ['.js', '.ts']
            })
        ],
        output: {
            format: 'es',
            file: './dist/eventproxy.esm.js', 
            name: 'EventProxy',
            extend: false,
            sourcemap: false,
        },
    },
]