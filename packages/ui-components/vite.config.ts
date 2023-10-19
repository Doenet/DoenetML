import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { externalizeDoenetDeps } from "../../scripts/vite-plugin-externalize-doenet-deps";

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [dts({ rollupTypes: true }), externalizeDoenetDeps()],
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
