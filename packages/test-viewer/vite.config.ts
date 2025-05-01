import react from "@vitejs/plugin-react";
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "node:path";
import { createRequire } from "module";
import { suppressLogPlugin } from "../../scripts/vite-plugins";
const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: normalizePath(path.join(
                        require.resolve("@doenet/doenetml-worker/index.js"),
                        "../*",
                    )),
                    dest: "doenetml-worker/",
                },
            ],
        }),
        suppressLogPlugin(),
    ],
    server: {
        port: 8012,
    },
});
