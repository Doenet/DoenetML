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
                            "@doenet/doenetml-worker/CoreWorker.js",
                        ),
                        "../*",
                    ),
                    dest: "doenetml-worker/",
                },
            ],
        }),
    ],
    server: {
        port: 8012,
    },
});
