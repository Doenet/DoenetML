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
            entry: {
                index: "./src/index.ts",
            },
            formats: ["es"],
        },
        rollupOptions: {
            external: [
                "ariakit",
                "classnames",
                "react",
                "react-dom",
                "styled-components",
                "@fortawesome/free-solid-svg-icons",
                "@fortawesome/react-fontawesome",
                "better-react-mathjax",
            ],
        },
    },
});
