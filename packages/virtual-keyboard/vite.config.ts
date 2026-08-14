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
                // Resolves to the `@doenet/math` seam, which inlines the Rust
                // core as ~2.3 MiB of base64. Nothing here imports it today, so
                // this entry is defensive: this package is embedded by every
                // application bundle, so a single future import would bake a
                // private copy of the seam into all of them. Keep it external
                // and the application bundle resolves it once.
                "math-expressions",
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
