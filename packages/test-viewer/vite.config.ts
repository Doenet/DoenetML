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
                        require.resolve(
                            "@doenet/doenetml-worker-rust/index.js",
                        ),
                        "../*",
                    ),
                    dest: "doenetml-worker/",
                },
                // Note: we need to copy fonts only with @doenetml, not @doenetml-prototype
                // {
                //     src: path.join(
                //         require.resolve("@doenet/doenetml-prototype"),
                //         "../fonts/*",
                //     ),
                //     dest: "fonts/",
                // },
            ],
        }),
    ],
    server: {
        port: 8012,
    },
});
