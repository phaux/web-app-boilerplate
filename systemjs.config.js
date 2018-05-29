/* global SystemJS */

SystemJS.config({
  baseURL: 'node_modules',
  transpiler: 'systemjs-plugin-babel',
  packageConfigPaths: [
    '*/package.json',
    '@*/*/package.json',
  ],
})
