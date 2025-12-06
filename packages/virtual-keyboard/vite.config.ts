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
                index: "./src/virtual-keyboard/index.ts",
            },
            formats: ["es"],
            cssFileName: "style",
        },
        rollupOptions: {
            external: [
                "react",
                "react-dom",
                "react-dom/client",
                "@fortawesome/free-solid-svg-icons",
                "@fortawesome/react-fontawesome",
                "better-react-mathjax",
            ],
            onwarn(warning, warn) {
                if (warning.code === "MODULE_LEVEL_DIRECTIVE") {
                    return;
                }
                warn(warning);
            },
        },
    },
});
