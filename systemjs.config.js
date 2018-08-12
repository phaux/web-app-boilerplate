/* global SystemJS */

SystemJS.config({
  baseURL: 'node_modules',
  transpiler: 'systemjs-plugin-babel',
  meta: {'*': {babelOptions: {es2015: false}}},
  map: {
    'react': 'preact-compat',
    'react-dom': 'preact-compat',
  },
  packages: {
    'preact': {defaultExtension: 'mjs'},
  },
  packageConfigPaths: [
    '*/package.json',
    '@*/*/package.json',
  ],
})
