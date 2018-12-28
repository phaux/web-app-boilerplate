module.exports = api => {
  api.cache(true)
  return {
    plugins: [
      ["@babel/syntax-dynamic-import"],
      ["@babel/syntax-import-meta"],
      ["@babel/proposal-decorators", { legacy: true }],
      ["@babel/proposal-class-properties", { loose: true }],
    ],
    presets: [
      ["@babel/typescript", { jsxPragma: "h" }],
      ["@babel/react", { pragma: "h" }],
    ],
  }
}
