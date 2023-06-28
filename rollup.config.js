import babel from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { defineConfig } from "rollup";
import css from "rollup-plugin-import-css";

export default defineConfig({
  input: "index.js",
  output: [
    {
      file: "build/doenetml.js",
      format: "es",
    },
    {
      file: "build/doenetml.umd.js",
      format: "umd",
      name: "DoenetML",
      globals: {
        "react-dom": "react-dom",
        "styled-components": "styled-components",
      },
    },
  ],
  plugins: [
    // nodePolyfills(),
    nodeResolve({
      extensions: [".jsx", ".js"],
      browser: true,
    }),
    css(),
    json(),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["@babel/preset-react"],
      extensions: [".jsx"],
    }),
  ],
  external: ["react-dom", "styled-components"],
});
