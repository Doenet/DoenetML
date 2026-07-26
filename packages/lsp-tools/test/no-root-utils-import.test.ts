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
const SRC = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "src",
);

/** `@doenet/utils` with nothing after it: the root export. */
const ROOT_IMPORT = /from\s*["']@doenet\/utils["']/;

function* sourceFiles(dir: string): Generator<string> {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (
            entry.name === "generated-assets" ||
            entry.name === "node_modules"
        ) {
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

describe("the language server's dependency on @doenet/utils", () => {
    it("goes through a subpath, never the root barrel", () => {
        const offenders: string[] = [];
        for (const file of sourceFiles(SRC)) {
            const contents = fs.readFileSync(file, "utf-8");
            contents.split("\n").forEach((line, index) => {
                // A `import type` costs nothing at runtime, so it is allowed
                // through: it is erased before the bundler ever sees it.
                if (/^\s*import\s+type\b/.test(line)) {
                    return;
                }
                if (ROOT_IMPORT.test(line)) {
                    offenders.push(
                        `${path.relative(SRC, file)}:${index + 1}: ${line.trim()}`,
                    );
                }
            });
        }

        expect(
            offenders,
            `Import the specific entry instead, adding one to @doenet/utils'
\`exports\` and its vite \`lib.entry\` if it does not exist yet:\n  ${offenders.join("\n  ")}\n`,
        ).toEqual([]);
    });
});
