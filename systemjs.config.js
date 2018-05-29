/* global SystemJS */

SystemJS.config({
  baseURL: 'node_modules',
  transpiler: 'systemjs-plugin-babel',
  // map: {
  //   'systemjs-plugin-babel': 'systemjs-plugin-babel/plugin-babel.js',
  //   'systemjs-babel-build': 'systemjs-plugin-babel/systemjs-babel-browser.js',
  // },
  // meta: {
  //   '*': {babelOptions: {es2015: false}},
  // },
  packageConfigPaths: [
    '*/package.json',
    '@*/*/package.json',
  ],
})

SystemJS.import('./scripts/main.js')
