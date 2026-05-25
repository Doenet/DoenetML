import { describe, expect, it } from "vitest";
import { lezerToDast } from "../src/lezer-to-dast";
import util from "util";
import { extractDastErrors } from "../src/extract-dast-errors";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("DAST", async () => {
    it("Shows error for incomplete XML tag", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<a`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<a><b>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(2);

        source = `<a!b`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<-/>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);

        source = `<x " />`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
    });

    it("Shows error for incomplete XML tag that is a child of another element", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<x><a></x>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
    });

    it("Shows error for incomplete XML closing tag", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<x></x `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toMatchInlineSnapshot(
            '"Invalid DoenetML: Tag `</x ` was not closed (a `>` appears to be missing)."',
        );

        source = `<a><x></x </a>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toMatchInlineSnapshot(
            '"Invalid DoenetML: Tag `</x ` was not closed (a `>` appears to be missing)."',
        );
    });

    it("Unmatched and incomplete XML closing tags prioritize incomplete error", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `</x `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toMatchInlineSnapshot(
            '"Invalid DoenetML: Tag `</x ` was not closed (a `>` appears to be missing)."',
        );

        source = `<a></x </a>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toMatchInlineSnapshot(
            '"Invalid DoenetML: Tag `</x ` was not closed (a `>` appears to be missing)."',
        );
    });

    it("Emits one unified warning per unquoted attribute pair (#1197)", () => {
        // `<section name=foo></section>` was the canonical four-error
        // shape (`Invalid attribute "foo"`, two `Invalid attribute
        // name=`, one `Invalid attribute name=''`); `lezer-to-dast` now
        // detects the pair, strips both halves from `node.attributes`,
        // and emits a single `error_type: "warning"` node naming the
        // corrected form.  Downstream layers (dast-normalize, the
        // worker) see no attribute remnant to re-flag.
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<section name=foo></section>`;
        dast = lezerToDast(source);
        const errs = extractDastErrors(dast);
        expect(errs).toHaveLength(1);
        expect(errs[0].message).toBe(
            'Attribute values must be enclosed in quotes: `name="foo"`',
        );
        expect(errs[0].error_type).toBe("warning");
        // The warning's position spans the bare-value token (`foo`,
        // offsets 14-17 in the source) so the editor squiggle covers
        // only what the author needs to fix.
        expect(errs[0].position).toMatchObject({
            start: { offset: 14 },
            end: { offset: 17 },
        });
        // Both halves are stripped from `node.attributes`.
        const root = dast.children[0];
        if (root?.type !== "element") throw new Error("expected element");
        expect(Object.keys(root.attributes)).toEqual([]);

        // Self-closing, no whitespace before `/>` — the form an author
        // is most likely to type.
        source = `<math name=foo/>`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toBe(
            'Attribute values must be enclosed in quotes: `name="foo"`',
        );
    });

    it("Does not double-emit errors that live inside an attribute (#1197)", () => {
        // The OpenTag-level error pickup used to re-emit the same error the
        // per-Attribute loop catches.  Pin a single error for representative
        // shapes that all live inside the first Attribute.
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        // `name=` with no value: error attached to the Attribute itself.
        source = `<x name= />`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toMatch(
            /Invalid attribute `name= ` appears to be missing a value\./,
        );

        // Two unquoted-value pairs in a row: a single quote-mismatch error
        // covers the whole run; the per-Attribute pickup must not duplicate
        // the OpenTag-level one.
        source = `<a x=foo y=bar />`;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)).toHaveLength(1);
        expect(extractDastErrors(dast)[0].message).toMatch(
            /quote marks do not match/,
        );
    });

    it("Errors for missing tags are shown at the location of the starting tag", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `<x   `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)[0].position).toMatchObject({
            start: {
                offset: 0,
            },
            end: {
                offset: 2,
            },
        });

        source = `<x z="">   `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)[0].position).toMatchObject({
            start: {
                offset: 0,
            },
            end: {
                offset: 8,
            },
        });

        source = `</x>   `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)[0].position).toMatchObject({
            start: {
                offset: 0,
            },
            end: {
                offset: 4,
            },
        });

        source = `</x   `;
        dast = lezerToDast(source);
        expect(extractDastErrors(dast)[0].position).toMatchObject({
            start: {
                offset: 0,
            },
            end: {
                offset: 3,
            },
        });
    });
});
