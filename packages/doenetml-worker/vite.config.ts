import nodePolyfills from "rollup-plugin-polyfill-node";
import { defineConfig } from "vite";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    build: {
        minify: true,
        sourcemap: true,
        lib: {
            entry: "src/index.ts",
            fileName: "CoreWorker",
            formats: ["es"],
        },
        rollupOptions: {
            // @ts-ignore
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
