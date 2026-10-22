// Write a prerendered page: a DoenetML document rendered to HTML by the
// server build (`dist-prerender/render.js`, `npm run build:prerender`),
// with the client build's files (`dist/`, `npm run build`) to load the
// live viewer once its scripts arrive. The page's asset URLs are the
// client build's, under `--base` (default `/`): serve the page from the
// same origin as `dist/`.
//
//   node scripts/prerender.mjs <document.doenet> --out <page.html>
//       [--seed <n>] [--state <state.json>] [--base <url>] [--title <text>]
//
// `prerenderPage` does the same for a caller with the source in hand (the
// benchmark's fixtures).
import { readFileSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const packageRoot = fileURLToPath(new URL("..", import.meta.url));
const dist = resolve(packageRoot, "dist");
const serverBuild = resolve(packageRoot, "dist-prerender/render.js");

/** The client module that replaces a prerendered page's HTML with the
 * live viewer, as the build's manifest names it. */
const ENTRY = "src/snapshot-entry.tsx";

/** The client build's manifest (`build.manifest` in `vite.config.ts`). */
function readManifest() {
    try {
        return JSON.parse(
            readFileSync(resolve(dist, ".vite/manifest.json"), "utf8"),
        );
    } catch {
        throw new Error(
            "no client build manifest in dist/: run `npm run build -w @doenet/cells-viewer`",
        );
    }
}

/** The client build's files a page uses: the wasm, and the entry with the
 * modules it imports (statically, and the parser's chunk). */
function clientFiles(manifest) {
    const chunks = Object.values(manifest);
    const wasm = chunks.find((c) => c.file.endsWith(".wasm"))?.file ?? null;
    const entry = manifest[ENTRY];
    if (!entry) return { wasm, entry: null, preload: [] };
    const preload = new Set();
    const visit = (key) => {
        const chunk = manifest[key];
        if (!chunk || preload.has(chunk.file)) return;
        preload.add(chunk.file);
        for (const k of chunk.imports ?? []) visit(k);
    };
    for (const k of entry.imports ?? []) visit(k);
    // The manifest names a workspace package's module by its path from
    // this package: the parser's is `../parser/dist/index.js`.
    for (const k of entry.dynamicImports ?? [])
        if (k.startsWith("../parser/")) visit(k);
    return { wasm, entry: entry.file, preload: [...preload] };
}

let server = null;

/** The server build, its core instantiated from the client build's wasm. */
async function loadServer(wasmFile) {
    if (server) return server;
    let module;
    try {
        module = await import(pathToFileURL(serverBuild).href);
    } catch (e) {
        throw new Error(
            `no server build at dist-prerender/: run \`npm run build:prerender -w @doenet/cells-viewer\` (${e.message})`,
        );
    }
    if (!wasmFile)
        throw new Error(
            "the client build in dist/ has no wasm in its manifest",
        );
    await module.initCore(readFileSync(resolve(dist, wasmFile)));
    return (server = module);
}

/**
 * Prerender `source` into a page. Returns the page's HTML, what the load
 * reported (`diagnostics`), and whether the page loads the live viewer
 * (`live`: false while the client build has no snapshot entry, and the
 * page stays as rendered).
 */
export async function prerenderPage({
    source,
    seed = 0,
    state,
    base = "/",
    title,
}) {
    const files = clientFiles(readManifest());
    const s = await loadServer(files.wasm);
    const url = (file) => (file ? `${base.replace(/\/?$/, "/")}${file}` : null);
    const rendered = await s.prerender({
        source,
        seed,
        state,
        viewer: files.entry,
    });
    const page = s.writePage({
        html: rendered.html,
        meta: rendered.meta,
        source,
        title,
        assets: {
            css: s.viewerCss,
            wasm: url(files.wasm),
            entry: url(files.entry),
            preload: files.preload.map(url),
        },
    });
    return { page, diagnostics: rendered.diagnostics, live: !!files.entry };
}

function parseArgs(argv) {
    const args = { input: null };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === "--out") args.out = argv[++i];
        else if (a === "--seed") args.seed = Number(argv[++i]);
        else if (a === "--state") args.stateFile = argv[++i];
        else if (a === "--base") args.base = argv[++i];
        else if (a === "--title") args.title = argv[++i];
        else if (!a.startsWith("--") && args.input === null) args.input = a;
        else throw new Error(`unknown argument ${a}`);
    }
    if (!args.input || !args.out)
        throw new Error(
            "usage: node scripts/prerender.mjs <document.doenet> --out <page.html> [--seed <n>] [--state <state.json>] [--base <url>] [--title <text>]",
        );
    if (args.seed !== undefined && !Number.isFinite(args.seed))
        throw new Error("--seed takes a number");
    return args;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        const args = parseArgs(process.argv.slice(2));
        const { page, diagnostics, live } = await prerenderPage({
            source: readFileSync(args.input, "utf8"),
            seed: args.seed,
            state: args.stateFile
                ? readFileSync(args.stateFile, "utf8")
                : undefined,
            base: args.base,
            title: args.title ?? basename(args.input, ".doenet"),
        });
        writeFileSync(args.out, page);
        const errors = diagnostics.filter((d) => d.kind === "error").length;
        console.log(
            `${args.out}: ${(page.length / 1024).toFixed(1)} KB` +
                (errors ? `, ${errors} error(s) in the document` : "") +
                (live
                    ? ""
                    : "; the client build has no snapshot entry, so the page stays as rendered"),
        );
    } catch (e) {
        console.error(e.message);
        process.exit(1);
    }
}
