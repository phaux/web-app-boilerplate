module.exports = api => {
  api.cache(true)
  return {
    presets: [
      ["@babel/typescript", {jsxPragma: "h"}],
      ["@babel/react", {pragma: "h"}],
    ],
  }
}
