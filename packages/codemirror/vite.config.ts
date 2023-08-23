import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true })],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: "./src/CodeMirror.tsx",
            fileName: "index",
            formats: ["es"],
        },
        rollupOptions: {
            external: ["react", "react-dom", "styled-components"],
        }
    },
});
