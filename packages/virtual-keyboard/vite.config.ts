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
                // core as ~1.8 MiB of base64. Bundling it here baked a private
                // copy into this dist, which then rode into every bundle that
                // embeds this package — the second of the two copies the
                // standalone bundle was carrying. The application bundle
                // resolves it once instead.
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
