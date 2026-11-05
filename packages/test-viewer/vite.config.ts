import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "node:path";
import { createRequire } from "module";
import {
    ignoreWireitCachesPlugin,
    suppressLogPlugin,
} from "../../scripts/vite-plugins";
const require = createRequire(import.meta.url);

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        ignoreWireitCachesPlugin(),
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
            ],
        }),
        suppressLogPlugin(),
    ],
    server: {
        host: "0.0.0.0",
        port: 8012,
    },
});
