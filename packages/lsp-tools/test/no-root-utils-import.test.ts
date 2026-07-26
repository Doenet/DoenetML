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
 * 1.1 MB minified against 2.3 MB with it (317 KB gzipped against 640 KB).
 *
 * That reasoning lived only in a code comment, and a second import reached the
 * root barrel anyway. A comment cannot fail; this can.
 *
 * A bundle-size assertion would catch more — including a subpath that itself
 * grows heavy — but it would have to build the server to do it. This costs
 * nothing and catches the mistake at the point it is made: someone typing the
 * import they are used to.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import ts from "typescript";
import { describe, expect, it } from "vitest";

/** The `packages/` directory, which the scanned roots are relative to. */
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

/** The root barrel: the specifier with no subpath after it. */
const ROOT_BARREL = "@doenet/utils";

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

/** The literal text of `node` if it is a string literal, else `undefined`. */
function literalText(node: ts.Node): string | undefined {
    return ts.isStringLiteralLike(node) ? node.text : undefined;
}

/**
 * The module `node` pulls in *at runtime*, or `undefined` if it pulls in
 * nothing — either because it is not an import at all, or because TypeScript
 * erases it before a bundler ever sees it.
 *
 * Type-only statements are erased and so cost no bytes; they are deliberately
 * allowed through. An inline `import { type Foo }` is not erased — the
 * statement is still emitted — so it counts as a runtime import.
 */
function runtimeImportOf(node: ts.Node): string | undefined {
    if (ts.isImportDeclaration(node)) {
        // A side-effect `import "…"` has no clause at all, and is emitted.
        return node.importClause?.isTypeOnly
            ? undefined
            : literalText(node.moduleSpecifier);
    }
    if (ts.isExportDeclaration(node)) {
        // A local `export { x }` has no module specifier to reach through.
        return node.isTypeOnly || !node.moduleSpecifier
            ? undefined
            : literalText(node.moduleSpecifier);
    }
    if (
        ts.isCallExpression(node) &&
        node.expression.kind === ts.SyntaxKind.ImportKeyword
    ) {
        return node.arguments[0] && literalText(node.arguments[0]);
    }
    return undefined;
}

/**
 * Report every runtime import of the root barrel in `source` as
 * `line: statement`, the statement collapsed onto one line so that a
 * prettier-wrapped import still reads in the failure message.
 *
 * The source is parsed rather than pattern-matched. A regex over the raw text
 * looks tempting and is a trap: it fires on a specifier that merely appears in
 * a comment or a string — no small thing in files whose subject matter *is*
 * this import — and it has to guess at the type-only, wrapped and dynamic
 * forms that the parser simply knows.
 */
function rootImportsIn(source: string, fileName = "scan.ts"): string[] {
    const parsed = ts.createSourceFile(
        fileName,
        source,
        ts.ScriptTarget.Latest,
        /* setParentNodes */ true,
    );
    const found: string[] = [];

    ts.forEachChild(parsed, function visit(node: ts.Node) {
        if (runtimeImportOf(node) === ROOT_BARREL) {
            const { line } = parsed.getLineAndCharacterOfPosition(
                node.getStart(parsed),
            );
            const statement = node.getText(parsed).replace(/\s+/g, " ");
            found.push(`${line + 1}: ${statement}`);
        }
        ts.forEachChild(node, visit);
    });

    return found;
}

// The two tables below hold one case per distinction the guard draws, so the
// policy is pinned by the suite rather than re-derived by hand whenever the
// scan is touched.

/** Forms that survive to runtime, and so must be reported. */
const REPORTED = {
    "a named import": `import { cesc } from "@doenet/utils";`,
    "a re-export": `export { deepClone } from "@doenet/utils";`,
    "a star re-export": `export * from "@doenet/utils";`,
    "a side-effect import": `import "@doenet/utils";`,
    "a dynamic import": `const utils = await import("@doenet/utils");`,
    "an inline type modifier, still emitted": `import { type Foo } from "@doenet/utils";`,
};

/**
 * Forms that cost nothing, and so must not be reported: type-only statements
 * are erased before a bundler sees them, a subpath is the whole point, and a
 * specifier sitting in a comment or a string is not an import at all.
 */
const ALLOWED = {
    "a type-only import": `import type { Foo } from "@doenet/utils";`,
    "a type-only re-export": `export type { Foo } from "@doenet/utils";`,
    "a subpath import": `import { STYLE_PALETTES } from "@doenet/utils/style";`,
    "a dynamic subpath import": `const s = await import("@doenet/utils/style");`,
    "another package entirely": `import { toXml } from "@doenet/parser";`,
    "a commented-out import": `// import { cesc } from "@doenet/utils";`,
    "a doc comment naming the barrel": `/** Never import "@doenet/utils". */\nexport const a = 1;`,
    "the specifier inside a string": `const barrel = "@doenet/utils";`,
};

describe("the guard's scan", () => {
    it.each(Object.entries(REPORTED))("reports %s", (_form, source) => {
        expect(rootImportsIn(source)).toHaveLength(1);
    });

    it.each(Object.entries(ALLOWED))("allows %s", (_form, source) => {
        expect(rootImportsIn(source)).toEqual([]);
    });

    it("points at the head of a wrapped statement, collapsed onto one line", () => {
        expect(
            rootImportsIn(
                `const x = 1;\nimport {\n    cesc,\n} from "@doenet/utils";\n`,
            ),
        ).toEqual([`2: import { cesc, } from "@doenet/utils";`]);
    });
});

describe("the language server's dependency on @doenet/utils", () => {
    it("goes through a subpath, never the root barrel", () => {
        const offenders: string[] = [];
        let scanned = 0;

        for (const root of SCANNED_ROOTS) {
            for (const file of sourceFiles(root)) {
                scanned++;
                const relative = path.relative(PACKAGES, file);
                const contents = fs.readFileSync(file, "utf-8");
                for (const found of rootImportsIn(contents, file)) {
                    offenders.push(`${relative}:${found}`);
                }
            }
        }

        // Without this the guard would pass silently if the scanned roots
        // were ever moved or renamed out from under it.
        expect(scanned, "no source files were scanned").toBeGreaterThan(0);

        expect(
            offenders,
            "Import the specific entry instead, adding one to @doenet/utils'" +
                " `exports` and its vite `lib.entry` if it does not exist yet.",
        ).toEqual([]);
    });
});
