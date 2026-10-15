// Bundle src/measure-one.ts and the workspace source it imports into one
// file that plain node runs, so a measurement process starts in a fraction
// of a second instead of the ten seconds vite-node spent transforming the
// JS core from source. Packages are bundled too: the JS core uses deep
// imports without extensions, which Vite resolves and node's loader does
// not. Files that find their wasm or fixtures relative
// to their own location keep working: `import.meta.dirname` and
// `import.meta.url` (and `__dirname`, `__filename`) are rewritten to the
// source file's.
import { build } from "esbuild";
import { readFileSync, statSync, existsSync, readdirSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { packageRoot, repoRoot } from "../src/fixtures.mjs";

export const bundlePath = resolve(repoRoot, "packages/doenetml-worker-javascript/.bench/measure-one.mjs");
const entry = resolve(packageRoot, "src/measure-one.ts");

const sourceLocations = {
    name: "source-locations",
    setup(b) {
        b.onLoad({ filter: /\.(m?[jt]s|tsx)$/ }, (args) => {
            if (args.path.includes("/node_modules/")) return undefined;
            let text = readFileSync(args.path, "utf8");
            if (!/import\.meta\.|__dirname|__filename/.test(text)) return undefined;
            text = text
                .replace(/import\.meta\.dirname/g, JSON.stringify(dirname(args.path)))
                .replace(/import\.meta\.url/g, JSON.stringify(pathToFileURL(args.path).href))
                .replace(/\b__dirname\b/g, JSON.stringify(dirname(args.path)))
                .replace(/\b__filename\b/g, JSON.stringify(args.path));
            const ext = extname(args.path);
            return { contents: text, loader: ext === ".tsx" ? "tsx" : ext === ".ts" ? "ts" : "js" };
        });
    },
};

/** Newest mtime under the directories the bundle is built from. */
function newest(dir, acc = 0) {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
        if (e.name === "node_modules" || e.name === "dist" || e.name === "target" || e.name.startsWith(".")) continue;
        const p = resolve(dir, e.name);
        acc = e.isDirectory() ? newest(p, acc) : Math.max(acc, statSync(p).mtimeMs);
    }
    return acc;
}

/** Build the bundle if any source is newer than it; returns its path. */
export async function ensureBundle() {
    const stale = !existsSync(bundlePath) ||
        statSync(bundlePath).mtimeMs < Math.max(
            newest(resolve(packageRoot, "src")),
            newest(resolve(repoRoot, "packages/doenetml-worker-javascript/src")),
            newest(resolve(repoRoot, "packages/doenetml/src")),
        );
    if (!stale) return bundlePath;
    const t = Date.now();
    await build({
        entryPoints: [entry],
        bundle: true,
        platform: "node",
        format: "esm",
        target: "node22",
        outfile: bundlePath,
        plugins: [sourceLocations],
        logLevel: "error",
    });
    console.error(`bundled the driver in ${Date.now() - t} ms`);
    return bundlePath;
}

if (process.argv[1] && resolve(process.argv[1]) === new URL(import.meta.url).pathname) {
    await ensureBundle();
    console.log(bundlePath);
}
