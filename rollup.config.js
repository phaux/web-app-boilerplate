// tslint:disable:no-implicit-dependencies
import babel from "rollup-plugin-babel"
import cpy from "rollup-plugin-cpy"
import resolve from "rollup-plugin-node-resolve"
import serve from "rollup-plugin-serve"

const extensions = [".js", ".mjs", ".jsx", ".ts", ".tsx"]

const prod = process.env.NODE_ENV === "production"

export default args => ({
  input: "src/index.tsx",
  output: {
    dir: "app",
    format: "esm",
  },
  plugins: [
    resolve({
      main: false,
      modulesOnly: true,
      extensions,
    }),
    babel({
      externalHelpers: true,
      exclude: "node_modules/**",
      extensions,
    }),
    cpy({
      files: "src/**/*.css",
      dest: "app",
    }),
    args.watch && serve({
      port: +process.env.PORT || 8000,
      contentBase: "",
      historyApiFallback: true,
    }),
  ],
  external: mod => !prod && args.watch ? /\bnode_modules\b/.exec(mod) : false,
  experimentalCodeSplitting: true,
})
