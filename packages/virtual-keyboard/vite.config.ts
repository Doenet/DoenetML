import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import compileTime from "vite-plugin-compile-time";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true }), compileTime()],
    build: {
        minify: false,
        sourcemap: true,
        lib: {
            entry: {
                index: "./src/virtual-keyboard/index.ts",
                "managed-keyboard": "./src/virtual-keyboard-new/managed-keyboard.tsx",
                "math-input": "./src/MathInputSelector.tsx",
            },
            formats: ["es"],
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "styled-components",
                "recoil",
                "@chakra-ui/react",
                "@chakra-ui/icons",
                "@fortawesome/free-solid-svg-icons",
                "@fortawesome/react-fontawesome",
                "better-react-mathjax",
            ],
        },
    },
});
