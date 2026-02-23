import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "node:path";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(new URL(import.meta.url).pathname);

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
                    src: path.join(
                        __dirname,
                        "../standalone/dist/doenet-standalone.js",
                    ),
                    dest: "standalone/",
                },
                {
                    src: path.join(__dirname, "../standalone/dist/style.css"),
                    dest: "standalone/",
                },
            ],
        }),
    ],
    server: {
        port: 8012,
    },
});
