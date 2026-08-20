import react from "@vitejs/plugin-react";
import { defineConfig, type Plugin } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** The exact @doenet/standalone version the copied bundle was built as. */
const standaloneVersion: string = JSON.parse(
    fs.readFileSync(
        path.resolve(__dirname, "../standalone/package.json"),
        "utf-8",
    ),
).version as string;

/**
 * Serve the copied `standalone/` files under jsDelivr-style paths, so
 * `e2e/standalone/chunkUrlPinning.cy.js` can prove the bundle's runtime
 * chunk-URL pinning (`packages/standalone/scripts/pin-chunk-urls-plugin.ts`)
 * against the emitted artifact:
 *
 *  - `/npm/@doenet/standalone@<exact version>/<file>` serves `<file>` — the
 *    immutable release URL every pinned reference resolves to.
 *  - Under any other specifier (`@latest`, a range) only the entry
 *    `doenet-standalone.js` is served; everything else answers a hard 404
 *    (hard, because the server's SPA HTML fallback would otherwise answer
 *    200). That models the cache-skew moment the pinning exists for: an
 *    entry cached under a floating tag whose chunk names the edge can no
 *    longer serve. A pinning regression therefore fails the spec's render
 *    assertion as well as its URL assertions.
 *
 * The rewrite is registered ahead of the static middleware for both `vite
 * preview` (how the Cypress e2e runs serve, see
 * TEST_RUN_INSTRUCTIONS_FOR_AGENTS.md) and the dev server.
 */
function standaloneCdnPathsPlugin(): Plugin {
    const cdnPath = /^\/npm\/@doenet\/standalone@([^/]+)(\/.*)$/;
    function rewrite(url: string | undefined): string | null {
        const match = url ? cdnPath.exec(url) : null;
        if (!match) {
            return null;
        }
        const [, spec, rest] = match;
        if (spec === standaloneVersion || rest === "/doenet-standalone.js") {
            return `/standalone${rest}`;
        }
        return null;
    }
    function middleware(
        req: { url?: string },
        res: { statusCode: number; end: (body: string) => void },
        next: () => void,
    ) {
        if (req.url && cdnPath.test(req.url)) {
            const rewritten = rewrite(req.url);
            if (rewritten === null) {
                res.statusCode = 404;
                res.end("Not found under this version specifier");
                return;
            }
            req.url = rewritten;
        }
        next();
    }
    return {
        name: "standalone-cdn-paths",
        configurePreviewServer(server) {
            server.middlewares.use(middleware);
        },
        configureServer(server) {
            server.middlewares.use(middleware);
        },
    };
}

// https://vitejs.dev/config/
export default defineConfig({
    base: "./",
    plugins: [
        react(),
        standaloneCdnPathsPlugin(),
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
                        // The bundle is code-split: renderers and the editor
                        // stack live in lazy chunks resolved relative to
                        // doenet-standalone.js, so they must be served beside
                        // it just as a CDN would.
                        path.resolve(__dirname, "../standalone/dist/chunks"),
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
