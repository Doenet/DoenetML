import react from "@vitejs/plugin-react";
import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import * as path from "node:path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    // Copy everything from the same directory as `CoreWorker.js`. This will include
                    // `CoreWorker.js.map`
                    src: path.join(
                        require.resolve("@doenet/doenetml-worker/CoreWorker.js"),
                        "../*"
                    ),
                    dest: "doenetml-worker/",
                },
            ],
        }),
    ],
    server: {
        port: 8012,
    },
    build: {
        minify: false,
        lib: {
            entry: "index.js",
            name: "DoenetML",
            fileName: "doenetml",
            formats: [
                "es",
                //"umd"
            ],
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
