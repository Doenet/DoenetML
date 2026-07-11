import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
                    overwrite: false,
                },
                {
                    src: path.join(
                        require.resolve("@doenet/doenetml"),
                        "../fonts/*",
                    ),
                    dest: "fonts/",
                    overwrite: false,
                },
                // Coordinator e2e (public/coordination-*.html): serve
                // @doenet/standalone and its co-located worker same-origin,
                // mimicking a PreTeXt site's layout. (Path-relative rather
                // than require.resolve: the standalone package's exports map
                // only declares the `import` condition.)
                {
                    src: [
                        path.resolve(
                            __dirname,
                            "../standalone/dist/doenet-standalone.js",
                        ),
                        path.resolve(__dirname, "../standalone/dist/style.css"),
                        path.resolve(
                            __dirname,
                            "../standalone/dist/coordinator.js",
                        ),
                    ],
                    dest: "standalone/",
                    overwrite: false,
                },
                {
                    src: path.join(
                        require.resolve("@doenet/doenetml-worker/index.js"),
                        "../*",
                    ),
                    dest: "standalone/doenetml-worker/",
                    overwrite: false,
                },
            ],
        }),
    ],
    server: {
        port: 8012,
    },
});
