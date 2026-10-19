// Static servers for the browser harness: the cells viewer build on one
// port (its index.html uses absolute asset paths), the JS core's page with
// the standalone build on another, and the Rust core's page (rust-viewer/,
// with the core worker it loads from /doenetml-worker/) on a third. The
// cells viewer is served twice: on CELLS_PORT with nothing cached, and on
// CELLS_CACHED_PORT as a host would serve a build, its hashed assets
// cached for good and its page revalidated, which is what lets a repeat
// visit reuse the browser's caches (the trace layer's warm and hot visits).
// Both serve the benchmark's documents as text under /fixtures/. Started
// by Playwright (see playwright.config.ts) or by hand: `node browser/serve.mjs`.
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { repoRoot } from "../src/fixtures.mjs";

export const CELLS_PORT = 4173;
export const JS_PORT = 4174;
export const RUST_PORT = 4175;
export const CELLS_CACHED_PORT = 4176;
const TYPES = {
    ".html": "text/html",
    ".js": "text/javascript",
    ".mjs": "text/javascript",
    ".css": "text/css",
    ".wasm": "application/wasm",
    ".json": "application/json",
    ".map": "application/json",
    ".ftl": "text/plain",
    ".svg": "image/svg+xml",
    ".woff2": "font/woff2",
    ".woff": "font/woff",
    ".ttf": "font/ttf",
    ".png": "image/png",
    ".doenet": "text/plain; charset=utf-8",
};

/** No caching at all. */
const NO_STORE = () => "no-store";
/** A deployed build: content-hashed assets forever, everything else revalidated. */
const DEPLOYED = (url) =>
    url.startsWith("/assets/")
        ? "public, max-age=31536000, immutable"
        : "no-cache";

/** Serve `roots` (url prefix -> directory), cached as `cache` says. */
function serve(port, roots, cache = NO_STORE) {
    createServer((req, res) => {
        const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (url === "/health") return res.end("ok");
        for (const [prefix, dir] of roots) {
            if (!url.startsWith(prefix)) continue;
            let file = resolve(
                dir,
                "." + normalize("/" + url.slice(prefix.length)),
            );
            if (!file.startsWith(resolve(dir))) break;
            if (existsSync(file) && statSync(file).isDirectory())
                file = join(file, "index.html");
            if (!existsSync(file)) break;
            res.writeHead(200, {
                "content-type":
                    TYPES[extname(file)] ?? "application/octet-stream",
                "cache-control": cache(url),
                "cross-origin-opener-policy": "same-origin",
                "cross-origin-embedder-policy": "require-corp",
            });
            return createReadStream(file).pipe(res);
        }
        res.writeHead(404).end(`not found: ${url}`);
    }).listen(port);
}

const here = resolve(new URL(".", import.meta.url).pathname);
const cellsRoots = [
    ["/fixtures/generated/", resolve(here, "../fixtures/generated")],
    ["/fixtures/", resolve(here, "../fixtures")],
    ["/", resolve(repoRoot, "packages/cells-viewer/dist")],
];
serve(CELLS_PORT, cellsRoots);
serve(CELLS_CACHED_PORT, cellsRoots, DEPLOYED);
serve(JS_PORT, [
    ["/standalone/", resolve(repoRoot, "packages/standalone/dist")],
    ["/", here],
]);
serve(RUST_PORT, [
    ["/doenetml-worker/", resolve(repoRoot, "packages/doenetml-worker/dist")],
    ["/rust/", resolve(here, "rust-viewer/dist")],
]);
console.log(
    `cells viewer on :${CELLS_PORT} (cached as deployed on :${CELLS_CACHED_PORT}), JS core page on :${JS_PORT}, Rust core page on :${RUST_PORT}`,
);
