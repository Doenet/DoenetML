import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";

/**
 * The language server must reach `@doenet/utils` through a subpath, never
 * through its root export.
 *
 * The root barrel pulls in math-expressions, the AST helpers and the URL
 * utilities. This worker loads on the critical path before the editor can
 * answer a cursor-help request, and boot lag here has surfaced before as a
 * flaky "no help on first cursor change" in CI — which is why
 * `resolve-active-style.ts` imports `@doenet/utils/style` rather than the
 * root.
 *
 * That reasoning lived only in a code comment, and a second import reached the
 * root barrel anyway: `computeContextHelp.ts` pulled the whole thing in for a
 * single self-contained function, which now has its own entry. A comment
 * cannot fail; this can.
 *
 * A bundle-size assertion would catch more, but it would have to build the
 * extension to do it. This costs nothing and catches the mistake at the point
 * it is made — someone typing the import they are used to.
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

/** The `import`/`export` opening a statement, searched for backwards. */
const STATEMENT_KEYWORD = /\b(?:import|export)\b/g;

function* sourceFiles(dir: string): Generator<string> {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        // The Lezer parser the `compile_grammar` script writes here is
        // machine-generated, and not ours to hold to this rule.
        if (entry.name === "generated-assets") {
            continue;
        }
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
 * Statements are located from the specifier backwards rather than line by
 * line, so a multi-line `import type { … } from "@doenet/utils"` is still
 * recognized as type-only. Type-only imports are allowed through: they cost
 * nothing at runtime, being erased before the bundler ever sees them. An
 * inline `import { type Foo }` is not — that statement is still emitted.
 */
function rootImportsIn(contents: string): string[] {
    const found: string[] = [];
    for (const match of contents.matchAll(ROOT_IMPORT)) {
        // A bare or dynamic `import` is matched from its own keyword, so it
        // opens its own statement; a `from` has the keyword somewhere behind
        // it, possibly several lines back.
        const head = contents.slice(0, match.index);
        const start = match[0].startsWith("import")
            ? match.index
            : ([...head.matchAll(STATEMENT_KEYWORD)].at(-1)?.index ??
              match.index);
        const statement = contents.slice(start, match.index + match[0].length);
        if (/^(?:import|export)\s+type\b/.test(statement)) {
            continue;
        }
        const line = contents.slice(0, start).split("\n").length;
        found.push(`${line}: ${statement.replace(/\s+/g, " ")}`);
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
