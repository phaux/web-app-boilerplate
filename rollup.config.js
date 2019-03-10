// tslint:disable:no-implicit-dependencies
import babel from "rollup-plugin-babel"
import resolve from "rollup-plugin-node-resolve"
import { terser } from "rollup-plugin-terser"

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
      extensions,
      main: false,
      modulesOnly: true,
    }),
    babel({
      exclude: "node_modules/**",
      extensions,
    }),
    production && terser(),
  ],
}
