import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import type { Diagnostic } from "vscode-languageserver/browser";
import { formatEnglishDiagnostic, isDiagnosticCode } from "@doenet/i18n";
import { doenetSchema } from "@doenet/static-assets/schema";

import { AutoCompleter } from "../src";

/**
 * The schema checker writes its own English and names it with a code; the
 * catalog in `@doenet/i18n` holds the same sentence for translators. These
 * tests are what stop the two from drifting.
 *
 * The checker cannot render its messages from the catalog the way the worker
 * does, because `@doenet/lsp` bundles it and a catalog on the editor's
 * critical path is what `packages/lsp/scripts/check-server-bundle.mjs` exists
 * to reject — see the header of `src/coded-lsp-diagnostic.ts`. So
 * `@doenet/i18n` is a devDependency, used here and nowhere in `src/`, and the
 * guarantee it buys is checked rather than assumed: run the checker over
 * broken DoenetML, and assert that every coded violation it produces renders,
 * through the catalog, to exactly the string the checker wrote.
 *
 * A message edited on one side and not the other fails here. So does a missing
 * or misnamed argument: an argument the catalog reads and the checker does not
 * pass renders as `{$name}`, which no hand-written English will match. And so
 * does a list joined one way in the sentence and another in the catalog, which
 * is the failure the `type: "unit"` on the allowed-values argument avoids.
 *
 * Run against the real DoenetML schema rather than a fixture, so the snippets
 * below are documents an author could actually type — which is the only way
 * the "every code is reachable" assertion at the end means anything.
 */

const REPO_SRC = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "src",
);

/** Every `code: "doenet-…"` literal in `src`, which is every code the checker can raise. */
function codesNamedInSource(): Set<string> {
    const codes = new Set<string>();
    const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (entry.name.endsWith(".ts")) {
                for (const match of fs
                    .readFileSync(full, "utf-8")
                    .matchAll(/code:\s*"(doenet-[a-z]\d+)"/g)) {
                    codes.add(match[1]);
                }
            }
        }
    };
    walk(REPO_SRC);
    return codes;
}

function violations(source: string): Promise<Diagnostic[]> {
    return new AutoCompleter(
        source,
        doenetSchema.elements,
    ).getSchemaViolations();
}

/**
 * Broken DoenetML, one snippet per shape of violation.
 *
 * Named by what the author did wrong rather than by code: which code a snippet
 * produces is the checker's business, and `doenet-auto-schema-check.test.ts`
 * already pins the exact messages and ranges.
 */
const BROKEN_DOENETML: Record<string, string> = {
    "a tag that is not a Doenet element": `<abc></abc>`,
    "an element that cannot stand at the root": `<li>an item</li>`,
    "an element in a parent that does not accept it": `<p><section /></p>`,
    "an attribute the element does not have": `<p bogus="1">hi</p>`,
    "a name that does not start with a letter": `<p name="1st">hi</p>`,
    "a value outside the attribute's enumeration": `<p hide="maybe">hi</p>`,
    "a list value outside the attribute's enumeration": `<sideBySide valigns="top sideways" />`,
};

describe("Coded schema violations render to the English the checker wrote", () => {
    const exercised = new Set<string>();

    /** Assert every coded violation round-trips, and record which codes were seen. */
    function expectRoundTrip(diagnostics: Diagnostic[]) {
        const coded = diagnostics.filter((d) => d.code !== undefined);
        expect(coded.length).toBeGreaterThan(0);
        for (const diagnostic of coded) {
            const code = String(diagnostic.code);
            expect(isDiagnosticCode(code)).toBe(true);
            exercised.add(code);
            const args = (diagnostic.data as { args?: never } | undefined)
                ?.args;
            expect(
                formatEnglishDiagnostic(code as never, args),
                `${code} rendered from the catalog does not match the English the checker wrote`,
            ).toBe(diagnostic.message);
        }
    }

    for (const [name, source] of Object.entries(BROKEN_DOENETML)) {
        it(name, async () => {
            expectRoundTrip(await violations(source));
        });
    }

    it("an attribute name the schema has never heard of", async () => {
        // The other half of `schema-attribute-unrecognized`: a name that is
        // not an attribute of *any* element takes the `UNKNOWN_NAME` branch
        // and reports the author's own spelling, where a name that exists
        // elsewhere is reported normalized. One code, two call sites, and the
        // arguments differ — so both are exercised.
        expectRoundTrip(
            await violations(`<p thisIsNotAnAttributeAnywhere="1">hi</p>`),
        );
    });

    it("exercises every code the checker can raise", () => {
        expect(
            [...codesNamedInSource()].filter((code) => !exercised.has(code)),
            "add a snippet above for each of these",
        ).toEqual([]);
    });
});
