// The prerendered pages the load and parity layers open: each of the
// benchmark's documents and the cells core's golden documents, prerendered
// by the cells viewer's writer (`packages/cells-viewer/scripts/prerender.mjs`)
// against the viewer build that `browser/serve.mjs` serves, into
// `fixtures/generated/prerendered/<name>.html` (ignored by git), served at
// `/fixtures/generated/prerendered/<name>.html`. Needs both of the viewer's
// builds: `npm run build -w @doenet/cells-viewer` and
// `npm run build:prerender -w @doenet/cells-viewer`.
//
//   node scripts/prerender-fixtures.mjs
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, resolve } from "node:path";
import { packageRoot, repoRoot } from "../src/fixtures.mjs";
import { prerenderPage } from "../../cells-viewer/scripts/prerender.mjs";

export const PRERENDERED_DIR = resolve(
    packageRoot,
    "fixtures/generated/prerendered",
);
/** Where `browser/serve.mjs` serves a prerendered page by its name. */
export const prerenderedUrl = (name) =>
    `/fixtures/generated/prerendered/${name}.html`;

/** The documents: the benchmark's own, and the golden documents, a few of
 * every kind of component the cells core has, prefixed `golden-`. */
export function prerenderedDocuments() {
    const doenet = (dir, prefix = "") =>
        readdirSync(dir)
            .filter((f) => f.endsWith(".doenet"))
            .sort()
            .map((f) => ({
                name: prefix + basename(f, ".doenet"),
                path: resolve(dir, f),
            }));
    return [
        ...doenet(resolve(packageRoot, "fixtures")),
        ...doenet(
            resolve(repoRoot, "packages/cells-core/crates/cells-bench/golden"),
            "golden-",
        ),
    ];
}

if (import.meta.url === `file://${process.argv[1]}`) {
    mkdirSync(PRERENDERED_DIR, { recursive: true });
    for (const { name, path } of prerenderedDocuments()) {
        const { page, live } = await prerenderPage({
            source: readFileSync(path, "utf8"),
            title: name,
        });
        if (!live)
            throw new Error(
                "the cells viewer's build has no snapshot entry: rebuild it (npm run build -w @doenet/cells-viewer)",
            );
        writeFileSync(resolve(PRERENDERED_DIR, `${name}.html`), page);
    }
    console.log(
        `prerendered ${prerenderedDocuments().length} documents into ${PRERENDERED_DIR}`,
    );
}
