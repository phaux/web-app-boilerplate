// tslint:disable:no-implicit-dependencies
import babel from "rollup-plugin-babel"
import cpy from "rollup-plugin-cpy"
import resolve from "rollup-plugin-node-resolve"

const extensions = [".js", ".mjs", ".jsx", ".ts", ".tsx"]

const production = process.env.NODE_ENV === "production"

export default {
  input: "src/index.tsx",
  output: {
    dir: "app",
    format: "esm",
    sourcemap: !production,
  },
  plugins: [
    resolve({
      main: false,
      modulesOnly: true,
      extensions,
    }),
    babel({
      exclude: "node_modules/**",
      extensions,
    }),
    cpy({
      files: "src/**/*.css",
      dest: "app",
    }),
  ],
  experimentalCodeSplitting: true,
}
