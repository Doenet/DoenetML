// Static servers for the browser harness: the cells viewer build on one
// port (its index.html uses absolute asset paths) and the JS core's page
// with the standalone build on another. Started by Playwright (see
// playwright.config.ts) or by hand: `node browser/serve.mjs`.
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { repoRoot } from "../src/fixtures.mjs";

export const CELLS_PORT = 4173;
export const JS_PORT = 4174;
const TYPES = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".css": "text/css", ".wasm": "application/wasm", ".json": "application/json", ".map": "application/json", ".ftl": "text/plain", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".png": "image/png" };

/** Serve `roots` (url prefix -> directory) with no caching. */
function serve(port, roots) {
    createServer((req, res) => {
        const url = decodeURIComponent(new URL(req.url, "http://x").pathname);
        if (url === "/health") return res.end("ok");
        for (const [prefix, dir] of roots) {
            if (!url.startsWith(prefix)) continue;
            let file = resolve(dir, "." + normalize("/" + url.slice(prefix.length)));
            if (!file.startsWith(resolve(dir))) break;
            if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
            if (!existsSync(file)) break;
            res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream", "cache-control": "no-store", "cross-origin-opener-policy": "same-origin", "cross-origin-embedder-policy": "require-corp" });
            return createReadStream(file).pipe(res);
        }
        res.writeHead(404).end(`not found: ${url}`);
    }).listen(port);
}

const here = resolve(new URL(".", import.meta.url).pathname);
serve(CELLS_PORT, [["/", resolve(repoRoot, "packages/cells-viewer/dist")]]);
serve(JS_PORT, [
    ["/standalone/", resolve(repoRoot, "packages/standalone/dist")],
    ["/", here],
]);
console.log(`cells viewer on :${CELLS_PORT}, JS core page on :${JS_PORT}`);
