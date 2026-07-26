import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * The language server must reach `@doenet/utils` through a subpath, never
 * through its root export.
 *
 * The root barrel re-exports math-expressions, the AST helpers and the URL
 * utilities, and nothing externalizes them on the way into the server bundle.
 * That bundle is not only the VS Code extension's server: `@doenet/codemirror`
 * embeds the built IIFE verbatim (`@doenet/lsp/language-server.js?raw`) to
 * start it as a blob worker, so every byte rides along into the editor too —
 * where it sits on the critical path before the editor can answer a
 * cursor-help request. Boot lag here has surfaced before as a flaky "no help
 * on first cursor change" in CI, which is why `resolve-active-style.ts`
 * imports `@doenet/utils/style` rather than the root.
 *
 * The cost is not marginal. One root import in `computeContextHelp.ts`, for a
 * single self-contained function, more than doubled the built server:
 * 1.0 MB minified against 2.2 MB with it (316 KB gzipped against 642 KB).
 *
 * That reasoning lived only in a code comment, and the second import reached
 * the root barrel anyway. A comment cannot fail; this can.
 *
 * A bundle-size assertion would catch more, but it would have to build the
 * server to do it. This costs nothing and catches the mistake at the point it
 * is made — someone typing the import they are used to.
 */
const PACKAGES = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "..",
);

/**
 * Everything that ends up in the language-server bundle: `@doenet/lsp` is the
 * server itself and bundles `@doenet/lsp-tools` wholesale. Only `lsp-tools`
 * imports `@doenet/utils` today, but the guard is about where the next import
 * could land, not where the current ones are.
 */
const SCANNED_ROOTS = ["lsp-tools/src", "lsp/src"].map((dir) =>
    path.join(PACKAGES, dir),
);

/**
 * A specifier of exactly `@doenet/utils` — no subpath — reached by any form
 * that survives to runtime: `import`/`export … from`, a bare side-effect
 * `import`, and a dynamic `import(…)`.
 */
const ROOT_IMPORT = /(?:from|import)\s*\(?\s*["']@doenet\/utils["']/g;

/**
 * The `import`/`export` opening a statement, searched for backwards. Anchored
 * to the start of a line so that the same word in a trailing comment or in a
 * braced specifier list cannot be mistaken for the head of the statement.
 */
const STATEMENT_START = /^[ \t]*(?:import|export)\b/gm;

function* sourceFiles(dir: string): Generator<string> {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            yield* sourceFiles(full);
        } else if (/\.tsx?$/.test(entry.name) && !/\.test\./.test(entry.name)) {
            yield full;
        }
    }
}

/**
 * Report every root-barrel import in `contents` as `line: statement`, the
 * statement collapsed onto one line so that a wrapped import still reads.
 *
 * Statements are located from the specifier backwards — to the nearest
 * {@link STATEMENT_START} — rather than line by line, so a prettier-wrapped
 * `import type { … } from "@doenet/utils"` is still recognized as type-only
 * instead of failing on its closing `} from "@doenet/utils";` line. Type-only
 * imports are allowed through: they cost nothing at runtime, being erased
 * before the bundler ever sees them. An inline `import { type Foo }` is not —
 * that statement is still emitted.
 */
function rootImportsIn(contents: string): string[] {
    const found: string[] = [];
    for (const match of contents.matchAll(ROOT_IMPORT)) {
        // A bare or dynamic `import` is matched from its own keyword, so it
        // opens its own statement; a `from` has the keyword somewhere behind
        // it, possibly several lines back.
        const heads = match[0].startsWith("import")
            ? []
            : [...contents.slice(0, match.index).matchAll(STATEMENT_START)];
        const start = heads[heads.length - 1]?.index ?? match.index;
        const statement = contents
            .slice(start, match.index + match[0].length)
            .replace(/\s+/g, " ")
            .trim();
        if (/^(?:import|export)\s+type\b/.test(statement)) {
            continue;
        }
        const line = contents.slice(0, start).split("\n").length;
        found.push(`${line}: ${statement}`);
    }
    return found;
}

describe("the language server's dependency on @doenet/utils", () => {
    it("goes through a subpath, never the root barrel", () => {
        const offenders: string[] = [];
        for (const root of SCANNED_ROOTS) {
            for (const file of sourceFiles(root)) {
                const relative = path.relative(PACKAGES, file);
                const contents = fs.readFileSync(file, "utf-8");
                for (const found of rootImportsIn(contents)) {
                    offenders.push(`${relative}:${found}`);
                }
            }
        }

        expect(
            offenders,
            "Import the specific entry instead, adding one to @doenet/utils'" +
                " `exports` and its vite `lib.entry` if it does not exist yet.",
        ).toEqual([]);
    });
});
