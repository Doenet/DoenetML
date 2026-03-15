import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "node:path";
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
                    src: path.join(
                        require.resolve("@doenet/doenetml-worker/index.js"),
                        "../*",
                    ),
                    dest: "doenetml-worker/",
                },
                {
                    src: path.join(
                        require.resolve("@doenet/doenetml"),
                        "../fonts/*",
                    ),
                    dest: "fonts/",
                },
                {
                    // Include local prefigure runtime artifacts in preview output
                    // so Cypress timing probes can compare local vs jsDelivr with
                    // the same preview-based test harness.
                    src: path.resolve(process.cwd(), "../prefigure/dist/*"),
                    dest: "prefigure-local/",
                },
            ],
        }),
    ],
    server: {
        port: 8012,
    },
});
