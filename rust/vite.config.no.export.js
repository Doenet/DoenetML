import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";
import { libInjectCss } from "vite-plugin-lib-inject-css";
import webWorkerLoader from "rollup-plugin-web-worker-loader";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        nodePolyfills({
            // To exclude specific polyfills, add them to this list.
            exclude: [
                "fs", // Excludes the polyfill for `fs` and `node:fs`.
            ],
            // Whether to polyfill specific globals.
            globals: {
                Buffer: true, // can also be 'build', 'dev', or false
                global: true,
                process: true,
            },
            // Whether to polyfill `node:` protocol imports.
            protocolImports: true,
        }),
    ],
    //optimizeDeps: {include: ["*"]},
    // plugins: [react(), libInjectCss()],
    // optimizeDeps: {
    //   // Node.js global to browser globalThis
    //   define: {
    //     global: "globalThis",
    //   },
    //   // Enable esbuild polyfill plugins
    //   plugins: [
    //     NodeGlobalsPolyfillPlugin({
    //       process: true,
    //       buffer: true,
    //     }),
    //     NodeModulesPolyfillPlugin(),
    //   ],
    // },
    build: {
        //commonjsOptions: {exclude: ["hi-base32/*"]},
        emptyOutDir: false,
        // minify: true,
        lib: {
            entry: "src/no-export.jsx",
            name: "DoenetML",
            fileName: "doenetml-no-export",
            formats: ["es"],
        },
        rollupOptions: {
            plugins: [webWorkerLoader()],
        },
        // rollupOptions: {
        //   plugins: [nodePolyfills()],
        //   output: {
        //     DoenetML: {
        //       react: "react",
        //       "reDoenetMLact-dom": "react-dom",
        //       "styled-components": "styled-components",
        //     },
        //   },
        // },
    },
    worker: {
        format: "iife",
    },
    commonjsOptions: {
        transformMixedEsModules: true,
        // Bugfix required to handle issue with vite, rollup and libs (like react-datetime)
        // https://github.com/vitejs/vite/issues/2139#issuecomment-1399098579
        defaultIsModuleExports(id) {
            try {
                const module = require(id);
                if (module?.default) return false;
                return "auto";
            } catch (error) {
                return "auto";
            }
        },
    },
});
