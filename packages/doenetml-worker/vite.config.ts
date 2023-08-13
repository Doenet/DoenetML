import { NodeGlobalsPolyfillPlugin } from "@esbuild-plugins/node-globals-polyfill";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    //    optimizeDeps: {
    //        // Node.js global to browser globalThis
    //        // @ts-ignore
    //        define: {
    //            global: "globalThis",
    //        },
    //        // Enable esbuild polyfill plugins
    //        plugins: [
    //            NodeGlobalsPolyfillPlugin({
    //                process: true,
    //                buffer: true,
    //            }),
    //            NodeModulesPolyfillPlugin(),
    //        ],
    //    },
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            //entry: "../doenetml/src/Core/CoreWorker.js",
            entry: "index.ts",
            fileName: "CoreWorker",
            formats: ["es"],
        },
        rollupOptions: {
            plugins: [nodePolyfills()],
            external: ["react", "react-dom", "styled-components"],
            output: {
                globals: {
                    react: "react",
                    "react-dom": "react-dom",
                    "styled-components": "styled-components",
                },
            },
        },
    },
});
