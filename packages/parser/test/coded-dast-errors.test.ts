import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { describe, expect, it } from "vitest";
import { formatEnglishDiagnostic, isDiagnosticCode } from "@doenet/i18n";

import {
    extractDastErrors,
    expandExternalReferences,
    isDastElement,
} from "../src";
import { lezerToDast } from "../src/lezer-to-dast";
import { lezerToDastV6 } from "../src/lezer-to-dast/lezer-to-dast-v6";
import { normalizeDocumentDast } from "../src/dast-normalize/normalize-dast";
import { answerSugar } from "../src/dast-normalize/component-sugar/answer";
import type { DastError } from "../src/types";

/**
 * The parser writes its own English and names it with a code; the catalog in
 * `@doenet/i18n` holds the same sentence for translators. These tests are what
 * stop the two from drifting.
 *
 * The parser cannot render its messages from the catalog the way the worker
 * does, because `@doenet/lsp` bundles it and a catalog on the editor's
 * critical path is what `packages/lsp/scripts/check-server-bundle.mjs` exists
 * to reject — see the header of `src/coded-dast-error.ts`. So `@doenet/i18n`
 * is a devDependency, used here and nowhere in `src/`, and the guarantee it
 * buys is checked rather than assumed: parse broken DoenetML, and assert that
 * every coded error the parser produces renders, through the catalog, to
 * exactly the string the parser wrote.
 *
 * A message edited on one side and not the other fails here. So does a missing
 * or misnamed argument: an argument the catalog reads and the parser does not
 * pass renders as `{$name}`, which no hand-written English will match.
 */

const REPO_SRC = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "..",
    "src",
);

/** Every `code: "doenet-…"` literal in `src`, which is every code the parser can raise. */
function codesNamedInSource(): Set<string> {
    const codes = new Set<string>();
    const walk = (dir: string) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                walk(full);
            } else if (entry.name.endsWith(".ts")) {
                const contents = fs.readFileSync(full, "utf-8");
                for (const match of contents.matchAll(
                    /code:\s*"(doenet-[a-z]\d+)"/g,
                )) {
                    codes.add(match[1]);
                }
            }
        }
    };
    walk(REPO_SRC);
    return codes;
}

/**
 * Codes no snippet in this file can reach, and why.
 *
 * Kept explicit so the coverage assertion below stays a real check: a code
 * added without a case that exercises it fails unless someone writes down why
 * it cannot be exercised.
 */
const UNREACHABLE_BY_PARSING: Record<string, string> = {
    "doenet-e0007":
        "an error node with no parent at all; every tree lezer produces roots its errors somewhere, so this is a guard rather than a case",
    "doenet-e0009":
        "an error inside an element that has both an open and a close tag and is not in either of them; every such shape found so far is reported by the tag that contains it instead",
    "doenet-e0023":
        "the fall-through for a lezer node shape the conversion has no case for — reaching it means the grammar and the conversion have gone out of step, which is a bug rather than a document",
};

function codedErrors(errors: DastError[]): DastError[] {
    return errors.filter((error) => error.code !== undefined);
}

/** Every DAST error in `source`, after the normalization passes have run. */
function normalizedErrors(source: string): DastError[] {
    return extractDastErrors(normalizeDocumentDast(lezerToDast(source)));
}

/** Every DAST error in `source`, straight out of the lezer conversion. */
function parseErrors(source: string): DastError[] {
    return extractDastErrors(lezerToDast(source));
}

/**
 * Broken DoenetML, one snippet per shape of parse error.
 *
 * Named by what the author did wrong rather than by code, because which code a
 * snippet produces is the parser's business and this file is not the place to
 * pin it down — `dast-errors.test.ts` already asserts the exact messages.
 */
const BROKEN_DOENETML: Record<string, string> = {
    "unclosed element": `<p>hello`,
    "attribute with no value": `<p name=>hello</p>`,
    "unquoted attribute value": `<p name=hello>there</p>`,
    "mismatched quote marks": `<p name="hello'>there</p>`,
    "an opening bracket and nothing else": `<`,
    "open tag missing its bracket": `<p name="a"`,
    "self-closing tag missing its bracket": `<point x="1" `,
    "self-closing tag missing its slash-bracket": `<point x="1" /`,
    "self-closing tag with junk for attributes": `<point @ />`,
    "closing tag with no opening tag": `</p>`,
    "mismatched closing tag": `<foo>bar</baz>`,
    "attribute junk": `<p @@@>hi</p>`,
    "an attribute value that is only a quote": `<p p="`,
    // The last three are gibberish rather than a plausible typo. They are here
    // because they are what reaches three of the branches at all: each one
    // leaves lezer with a shape no realistic mistake seems to produce, and a
    // branch with no case exercising it is a branch that can rot.
    "brackets inside an attribute name": `<p<p<`,
    "nested brackets before a self-closing tag": `<<</>`,
    "nested brackets before a closing tag": `<<</-`,
};

describe("Coded DAST errors render to the English the parser wrote", () => {
    const exercised = new Set<string>();

    /** Assert every coded error round-trips, and record which codes were seen. */
    function expectRoundTrip(errors: DastError[]) {
        for (const error of codedErrors(errors)) {
            expect(isDiagnosticCode(error.code!)).toBe(true);
            exercised.add(error.code!);
            expect(
                formatEnglishDiagnostic(error.code as never, error.args),
                `${error.code} rendered from the catalog does not match the English the parser wrote`,
            ).toBe(error.message);
        }
    }

    for (const [name, source] of Object.entries(BROKEN_DOENETML)) {
        it(name, () => {
            const errors = parseErrors(source);
            expect(codedErrors(errors).length).toBeGreaterThan(0);
            expectRoundTrip(errors);
        });
    }

    it("v0.6 documents", () => {
        for (const source of Object.values(BROKEN_DOENETML)) {
            expectRoundTrip(extractDastErrors(lezerToDastV6(source)));
        }
    });

    it("invalid names", () => {
        // A component whose name starts with `_`, a `name` attribute starting
        // with a digit, and one holding a character names may not contain.
        const errors = [
            ...normalizedErrors(`<_p>hi</_p>`),
            ...normalizedErrors(`<p name="1st">hi</p>`),
            ...normalizedErrors(`<p name="a!b">hi</p>`),
        ];
        expect(codedErrors(errors).length).toBe(3);
        expectRoundTrip(errors);
    });

    it("answer sugar", () => {
        const errors = [
            ...normalizedErrors(`<answer type="videoWatched" />`),
            ...normalizedErrors(
                `<answer type="videoWatched" video="notAReference" />`,
            ),
        ];
        expect(codedErrors(errors).length).toBe(2);
        expectRoundTrip(errors);
    });

    it("an answer whose name is not plain text", () => {
        // Driven through `answerSugar` rather than the whole normalization,
        // because the name-validation pass rejects `name="$x"` first and this
        // branch never sees it. It is still the branch that runs for any
        // caller applying the sugar on its own.
        const dast = lezerToDast(
            `<answer type="videoWatched" video="$v" name="$x" />`,
        );
        const answer = dast.children.find(isDastElement)!;
        answerSugar(answer);

        const errors = extractDastErrors(dast);
        expect(codedErrors(errors).length).toBe(1);
        expectRoundTrip(errors);
    });

    it("deprecated attributes", () => {
        const errors = [
            // A rename that applies to every scored section, so the message
            // names no component.
            ...normalizedErrors(
                `<p forceIndividualAnswerColoring="true">hi</p>`,
            ),
            // A rename scoped to one component, and the same rename in
            // conflict with the attribute that replaced it.
            ...normalizedErrors(
                `<selectFromSequence sortResults="true" from="1" to="3" />`,
            ),
            ...normalizedErrors(
                `<selectFromSequence sortResults="true" sort="ascending" from="1" to="3" />`,
            ),
            // An attribute that is dropped rather than renamed.
            ...normalizedErrors(`<description weight="2">hi</description>`),
            // An attribute replaced by a child element, warned about by the
            // sugar that rewrites it rather than by the deprecation registry.
            ...normalizedErrors(
                `<image description="a tree" source="t.png" />`,
            ),
        ];
        expect(codedErrors(errors).length).toBe(5);
        expectRoundTrip(errors);
    });

    it("external references", async () => {
        const fetchExternalDoenetML = (uri: string) =>
            uri === "doenet:selfReferential"
                ? Promise.resolve(`<p copy="doenet:selfReferential" />`)
                : uri === "doenet:aParagraph"
                  ? Promise.resolve(`<p name="par">hi</p>`)
                  : Promise.reject(`no DoenetML at "${uri}"`);

        const errors = [
            // Fetch fails.
            ...extractDastErrors(
                await expandExternalReferences(
                    lezerToDast(`<p copy="doenet:missing" />`),
                    fetchExternalDoenetML,
                ),
            ),
            // Fetch succeeds but the document is the wrong component type.
            ...extractDastErrors(
                await expandExternalReferences(
                    lezerToDast(`<point copy="doenet:aParagraph" />`),
                    fetchExternalDoenetML,
                ),
            ),
            // A document that copies itself, forever.
            ...extractDastErrors(
                await expandExternalReferences(
                    lezerToDast(`<p copy="doenet:selfReferential" />`),
                    fetchExternalDoenetML,
                ),
            ),
        ];
        expect(codedErrors(errors).length).toBe(3);
        expectRoundTrip(errors);
    });

    it("exercises every code the parser can raise", () => {
        const missing = [...codesNamedInSource()]
            .filter((code) => !exercised.has(code))
            .filter((code) => UNREACHABLE_BY_PARSING[code] === undefined);
        expect(
            missing,
            "add a case above for each of these, or record in UNREACHABLE_BY_PARSING why it cannot be reached",
        ).toEqual([]);
    });
});
