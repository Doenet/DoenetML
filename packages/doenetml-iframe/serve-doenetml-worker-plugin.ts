import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Plugin } from "vite";

const HERE = path.dirname(fileURLToPath(import.meta.url));

const MIME: Record<string, string> = {
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".map": "application/json",
    ".wasm": "application/wasm",
};

/**
 * Dev-server plugin that serves the externalized core worker at
 * `/doenetml-worker/*`.
 *
 * The `@doenet/standalone` bundle no longer embeds the core worker — it loads
 * it from a URL. Both the dev harness (`src/test-main.tsx`) and the Cypress
 * component specs load the bundle from a Blob URL, so "next to the bundle"
 * does not exist and `doenetml-external-worker.ts` falls back to
 * `<origin>/doenetml-worker/index.js` (resolved against `document.baseURI`).
 * This middleware serves the built worker there so that fallback resolves.
 *
 * Not needed in production: on npm/CDN the `doenetml-worker/` directory is
 * served next to the bundle and resolved relative to the bundle URL.
 */
export function serveDoenetmlWorkerPlugin(): Plugin {
    const workerDist = path.resolve(HERE, "../doenetml-worker/dist");
    return {
        name: "serve-doenetml-worker",
        configureServer(server) {
            server.middlewares.use("/doenetml-worker", (req, res, next) => {
                const rel = (req.url ?? "")
                    .replace(/[?#].*$/, "")
                    .replace(/^\/+/, "");
                const file = path.join(workerDist, rel || "index.js");
                if (
                    !file.startsWith(workerDist) ||
                    !fs.existsSync(file) ||
                    fs.statSync(file).isDirectory()
                ) {
                    return next();
                }
                res.setHeader(
                    "content-type",
                    MIME[path.extname(file)] ?? "application/octet-stream",
                );
                fs.createReadStream(file).pipe(res);
            });
        },
    };
}
