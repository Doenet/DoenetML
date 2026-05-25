import { describe, expect, it } from "vitest";
import util from "util";
import { doenetSchema } from "@doenet/static-assets/schema";

import { AutoCompleter } from "../src";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

const schema = {
    elements: [
        {
            name: "a",
            children: ["b", "c", "d"],
            attributes: [
                { name: "x" },
                { name: "y" },
                { name: "xyx", values: ["a", "B"] },
            ],
            top: true,
            acceptsStringChildren: false,
        },
        {
            name: "b",
            children: ["www"],
            attributes: [
                { name: "foo", values: ["true", "false"] },
                {
                    name: "mode",
                    values: ["none", "full", "true", "false"],
                    autocompleteValues: [
                        { value: "none", description: "None." },
                        { value: "full", description: "Full." },
                    ],
                },
                {
                    name: "modeOneSided",
                    values: ["none", "full", "true"],
                    autocompleteValues: [
                        { value: "none", description: "None." },
                        { value: "full", description: "Full." },
                    ],
                },
            ],
            top: true,
            acceptsStringChildren: false,
        },
        {
            name: "c",
            children: [],
            attributes: [],
            top: false,
            acceptsStringChildren: true,
        },
    ],
};

describe("AutoCompleter", () => {
    it("Can detect schema violations for elements", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<a>
            <b  foo="true">
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toHaveLength(0);

        source = `<c></c>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations())
            .toMatchInlineSnapshot(`
          [
            {
              "message": "Element \`<c>\` is not allowed at the root of the document.",
              "range": {
                "end": {
                  "character": 7,
                  "line": 0,
                },
                "start": {
                  "character": 0,
                  "line": 0,
                },
              },
              "severity": 2,
            },
          ]
        `);

        source = `<c>xxx</c>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations())
            .toMatchInlineSnapshot(`
          [
            {
              "message": "Element \`<c>\` is not allowed at the root of the document.",
              "range": {
                "end": {
                  "character": 3,
                  "line": 0,
                },
                "start": {
                  "character": 0,
                  "line": 0,
                },
              },
              "severity": 2,
            },
          ]
        `);

        source = `<b><c></c></b>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations())
            .toMatchInlineSnapshot(`
          [
            {
              "message": "Element \`<c>\` is not allowed inside of \`<b>\`.",
              "range": {
                "end": {
                  "character": 10,
                  "line": 0,
                },
                "start": {
                  "character": 3,
                  "line": 0,
                },
              },
              "severity": 2,
            },
          ]
        `);
    });

    it("Can detect schema violations for elements not in the schema", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<e>xxx</e>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations())
            .toMatchInlineSnapshot(`
          [
            {
              "message": "Element \`<e>\` is not a recognized Doenet element.",
              "range": {
                "end": {
                  "character": 3,
                  "line": 0,
                },
                "start": {
                  "character": 0,
                  "line": 0,
                },
              },
              "severity": 2,
            },
          ]
        `);
    });

    it("Can detect schema violations for elements with differently capitalized names", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<A>
            <B  foo="true">
            </B>
            <C>hi</C>
        </A>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toHaveLength(0);

        source = `<C></C>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations())
            .toMatchInlineSnapshot(`
          [
            {
              "message": "Element \`<c>\` is not allowed at the root of the document.",
              "range": {
                "end": {
                  "character": 7,
                  "line": 0,
                },
                "start": {
                  "character": 0,
                  "line": 0,
                },
              },
              "severity": 2,
            },
          ]
        `);

        source = `<B><C></C></B>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations())
            .toMatchInlineSnapshot(`
          [
            {
              "message": "Element \`<c>\` is not allowed inside of \`<b>\`.",
              "range": {
                "end": {
                  "character": 10,
                  "line": 0,
                },
                "start": {
                  "character": 3,
                  "line": 0,
                },
              },
              "severity": 2,
            },
          ]
        `);
    });

    it("Can detect schema violations for attributes", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<a>
            <b  food="true">
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations())
            .toMatchInlineSnapshot(`
          [
            {
              "message": "Element \`<b>\` doesn't have an attribute called \`food\`.",
              "range": {
                "end": {
                  "character": 27,
                  "line": 1,
                },
                "start": {
                  "character": 16,
                  "line": 1,
                },
              },
              "severity": 2,
            },
          ]
        `);

        source = `<a foo="true">
            <b >
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations())
            .toMatchInlineSnapshot(`
          [
            {
              "message": "Element \`<a>\` doesn't have an attribute called \`foo\`.",
              "range": {
                "end": {
                  "character": 13,
                  "line": 0,
                },
                "start": {
                  "character": 3,
                  "line": 0,
                },
              },
              "severity": 2,
            },
          ]
        `);
    });

    it("Can detect schema violations for attribute values", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        // No error for correct values
        source = `<a>
            <b  foo="true">
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
            "[]",
        );

        // No error if an explicit list of attribute values is NOT values is given
        source = `<a x="77">
            <b>
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
            "[]",
        );

        // No error if a function or macro is used in the attribute value
        source = `<a><b  foo="true $x that"></b></a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
            "[]",
        );

        source = `<a><b  foo="true $$f(1) that"></b></a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
            "[]",
        );

        // Error if an explicit list is given and the attribute value is plain text and not on the list
        source = `<a>
            <b  foo="tru">
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations())
            .toMatchInlineSnapshot(`
          [
            {
              "message": "Attribute \`foo\` of element \`<b>\` must be one of: "true", "false"",
              "range": {
                "end": {
                  "character": 25,
                  "line": 1,
                },
                "start": {
                  "character": 20,
                  "line": 1,
                },
              },
              "severity": 2,
            },
          ]
        `);
    });

    it(
        "Can detect schema violations for attribute values while ignoring case " +
            "but still suggests the correct case if a value is wrong",
        async () => {
            let source: string;
            let autoCompleter: AutoCompleter;

            // No error for correct values
            source = `<a>
            <b  foo="True">
            </b>
            <c>hi</c>
        </a>`;
            autoCompleter = new AutoCompleter(source, schema.elements);
            expect(
                await autoCompleter.getSchemaViolations(),
            ).toMatchInlineSnapshot("[]");

            // Error if an explicit list is given and the attribute value is plain text and not on the list
            source = `<a xyx="z" />`;
            autoCompleter = new AutoCompleter(source, schema.elements);
            expect(await autoCompleter.getSchemaViolations())
                .toMatchInlineSnapshot(`
              [
                {
                  "message": "Attribute \`xyx\` of element \`<a>\` must be one of: "a", "B"",
                  "range": {
                    "end": {
                      "character": 10,
                      "line": 0,
                    },
                    "start": {
                      "character": 7,
                      "line": 0,
                    },
                  },
                  "severity": 2,
                },
              ]
            `);
        },
    );

    it("substitutes `true` in for the value of an attribute that is not specified", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        // No error for correct values
        source = `<b  foo />`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
            "[]",
        );

        source = `<b mode />`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
            "[]",
        );

        source = `<b mode="true" />`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
            "[]",
        );

        source = `<b mode="false" />`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
            "[]",
        );

        source = `<b modeOneSided />`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
            "[]",
        );

        source = `<b modeOneSided="true" />`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
            "[]",
        );

        source = `<b modeOneSided="false" />`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(await autoCompleter.getSchemaViolations())
            .toMatchInlineSnapshot(`
          [
            {
              "message": "Attribute \`modeOneSided\` of element \`<b>\` must be one of: \"none\", \"full\", \"true\"",
              "range": {
                "end": {
                  "character": 23,
                  "line": 0,
                },
                "start": {
                  "character": 16,
                  "line": 0,
                },
              },
              "severity": 2,
            },
          ]
        `);
    });

    it("allows styleDefinition and feedbackDefinition at the root with Doenet schema", async () => {
        const source = `<styleDefinition /><feedbackDefinition />`;
        const autoCompleter = new AutoCompleter(source, doenetSchema.elements);

        const diagnostics = await autoCompleter.getSchemaViolations();
        expect(diagnostics).toMatchInlineSnapshot("[]");
    });

    describe("childContextHelp alias-aware validation (#1174, #1092)", () => {
        // Schema with the same `<matrix>` / `<row>` / `<matrixRow>` shape as
        // the runtime: `<row>` inside `<matrix>` is the `matrixRow` alias,
        // whose children are `<math>` and whose attributes include
        // `unordered` (with an enumerated value set). The non-alias-aware
        // path (`<row>` at the top of the doc) still validates against the
        // tabular `<row>` schema (children `cell`, no `unordered`).
        const aliasSchema = [
            {
                name: "doc",
                children: ["matrix", "row"],
                attributes: [],
                top: true,
                acceptsStringChildren: true,
            },
            {
                name: "matrix",
                children: ["row"],
                attributes: [],
                top: false,
                acceptsStringChildren: false,
                childContextHelp: { row: "matrixRow" },
            },
            {
                name: "row",
                children: ["cell"],
                attributes: [{ name: "rowNum", values: ["1", "2"] }],
                top: false,
                acceptsStringChildren: false,
            },
            {
                name: "cell",
                children: [],
                attributes: [],
                top: false,
                acceptsStringChildren: true,
            },
            {
                name: "math",
                children: [],
                attributes: [],
                top: false,
                acceptsStringChildren: true,
            },
        ];
        const aliasedElements = {
            matrixRow: {
                name: "matrixRow",
                attributes: [
                    {
                        name: "unordered",
                        values: ["true", "false"],
                    },
                ],
                children: ["math"],
                acceptsStringChildren: false,
            },
        };

        function createAliasAutoCompleter(source: string) {
            const ac = new AutoCompleter(source, aliasSchema);
            ac.setSchema(aliasSchema, aliasedElements);
            return ac;
        }

        it("Accepts alias-permitted children that the canonical entry forbids (#1174)", async () => {
            // `<math>` inside `<row>` inside `<matrix>` is allowed by the
            // `matrixRow` alias (`children: ["math"]`), even though the
            // tabular `<row>`'s canonical entry only accepts `<cell>`.
            const source = `<doc><matrix><row><math></math></row></matrix></doc>`;
            const ac = createAliasAutoCompleter(source);
            expect(await ac.getSchemaViolations()).toMatchInlineSnapshot("[]");
        });

        it("Accepts alias-permitted attributes that the canonical entry forbids (#1174)", async () => {
            // `unordered` only exists on `matrixRow`; the tabular `<row>`'s
            // canonical entry doesn't declare it.  An explicit value from
            // the alias's values list passes through clean.
            const source = `<doc><matrix><row unordered="true"></row></matrix></doc>`;
            const ac = createAliasAutoCompleter(source);
            expect(await ac.getSchemaViolations()).toMatchInlineSnapshot("[]");
        });

        it("Flags alias-attribute values that aren't in the alias's enumeration (#1092)", async () => {
            // `unordered`'s enumeration is "true" / "false" — `"maybe"`
            // must trip the value diagnostic via the alias-aware path,
            // not silently fall back to a permissive canonical lookup.
            const source = `<doc><matrix><row unordered="maybe"></row></matrix></doc>`;
            const ac = createAliasAutoCompleter(source);
            const diags = await ac.getSchemaViolations();
            expect(diags).toHaveLength(1);
            expect(diags[0].message).toBe(
                'Attribute `unordered` of element `<row>` must be one of: "true", "false"',
            );
        });

        it("Still flags children invalid for both canonical and alias entries", async () => {
            // `<cell>` is fine inside the tabular `<row>` but NOT inside
            // `<row>` when nested in `<matrix>` (the alias's children are
            // `["math"]`).  This pins the alias's child set as
            // authoritative — the canonical fallback must not leak in.
            const source = `<doc><matrix><row><cell></cell></row></matrix></doc>`;
            const ac = createAliasAutoCompleter(source);
            const diags = await ac.getSchemaViolations();
            expect(diags).toHaveLength(1);
            expect(diags[0].message).toBe(
                "Element `<cell>` is not allowed inside of `<row>`.",
            );
        });

        it("Falls back to the canonical entry when no alias applies", async () => {
            // `<row>` at the top of the doc has no `<matrix>` parent, so
            // the canonical `row` entry validates it: `<cell>` is OK,
            // `<math>` is not.
            const source = `<doc><row><cell></cell><math></math></row></doc>`;
            const ac = createAliasAutoCompleter(source);
            const diags = await ac.getSchemaViolations();
            expect(diags).toHaveLength(1);
            expect(diags[0].message).toBe(
                "Element `<math>` is not allowed inside of `<row>`.",
            );
        });

        it("Falls back to the canonical entry's attribute set when no alias applies", async () => {
            // `<row unordered>` outside `<matrix>` is invalid — the tabular
            // `<row>`'s canonical attribute set excludes `unordered`.
            const source = `<doc><row unordered="true"></row></doc>`;
            const ac = createAliasAutoCompleter(source);
            const diags = await ac.getSchemaViolations();
            expect(diags).toHaveLength(1);
            expect(diags[0].message).toBe(
                "Element `<row>` doesn't have an attribute called `unordered`.",
            );
        });
    });

    describe("Bundled Doenet schema: matrix/row/column alias validation (#1174)", () => {
        // The end-to-end version of the focused tests above: drive the
        // bundled `doenetSchema` (with `matrix`/`row`/`column` carrying
        // real `childContextHelp` redirects) against the exact authoring
        // shape from the row_matrix.mdx / column_matrix.mdx docs that
        // motivated #1174, and confirm no spurious diagnostics fire.
        it("Accepts <math> children inside <row>/<column> inside <matrix>", async () => {
            const source = `<matrix><row><math>x</math></row><column><math>y</math></column></matrix>`;
            const ac = new AutoCompleter(source, doenetSchema.elements);
            const diags = await ac.getSchemaViolations();
            const messages = diags.map((d) => d.message);
            // No "not allowed inside" or "doesn't have an attribute"
            // diagnostics on the row/column/math triplets.
            expect(
                messages.filter(
                    (m) =>
                        m.includes("<row>") ||
                        m.includes("<column>") ||
                        m.includes("<math>"),
                ),
            ).toEqual([]);
        });

        it("Accepts matrix-flavored attributes on <row>/<column> inside <matrix>", async () => {
            const source = `<matrix><row unordered="true" maxNumber="3"><math>x</math></row></matrix>`;
            const ac = new AutoCompleter(source, doenetSchema.elements);
            const diags = await ac.getSchemaViolations();
            expect(
                diags
                    .map((d) => d.message)
                    .filter(
                        (m) =>
                            m.includes("unordered") || m.includes("maxNumber"),
                    ),
            ).toEqual([]);
        });
    });

    describe("Unquoted attribute values (#1104)", () => {
        // Catches authors who type `<math name=foo>` and never open the
        // autocomplete menu (which would have offered the quoted form).
        // The parser splits the unquoted assignment into two value-less
        // attributes; the diagnostic points at the bare token and names
        // the corrected form in the hover message.  The tests use the
        // top-level test schema's `<a>` element, whose `x`/`y` attributes
        // both accept arbitrary values — `x=bar` thus exercises the new
        // warning in isolation without tripping the standard
        // "unknown attribute" / enumerated-value paths.

        it("warns on a bare attribute value and names the corrected form", async () => {
            const source = `<a x=bar />`;
            const ac = new AutoCompleter(source, schema.elements);
            const diags = await ac.getSchemaViolations();
            // Exactly one diagnostic — the "unknown attribute" warning
            // that would otherwise fire on the bare-value half must be
            // suppressed.
            expect(diags).toHaveLength(1);
            expect(diags[0].severity).toBe(2); // Warning
            expect(diags[0].message).toBe(
                'Attribute values must be enclosed in quotes: `x="bar"`',
            );
            // Range covers the bare token `bar` (offset 5-8 in the
            // source `<a x=bar />`).
            expect(diags[0].range).toEqual({
                start: { line: 0, character: 5 },
                end: { line: 0, character: 8 },
            });
        });

        it("does not warn when the value is quoted", async () => {
            const source = `<a x="bar" />`;
            const ac = new AutoCompleter(source, schema.elements);
            expect(await ac.getSchemaViolations()).toEqual([]);
        });

        it("warns on a bare value with whitespace between `=` and the token", async () => {
            // `<a x=   bar />`: the parser absorbs the trailing spaces
            // into `x`'s source range (so it ends `x=   `), and `bar`
            // becomes the value-less follower. Detection must tolerate
            // the whitespace and still emit the warning.
            const source = `<a x=   bar />`;
            const ac = new AutoCompleter(source, schema.elements);
            const diags = await ac.getSchemaViolations();
            expect(diags).toHaveLength(1);
            expect(diags[0].message).toBe(
                'Attribute values must be enclosed in quotes: `x="bar"`',
            );
        });

        it("flags only the unquoted attribute when mixed with a quoted one", async () => {
            // The quoted `y="bar"` parses cleanly and stays quiet; only
            // the unquoted `x=foo` half fires the new warning.
            const source = `<a x=foo y="bar" />`;
            const ac = new AutoCompleter(source, schema.elements);
            const diags = await ac.getSchemaViolations();
            expect(diags).toHaveLength(1);
            expect(diags[0].message).toBe(
                'Attribute values must be enclosed in quotes: `x="foo"`',
            );
            // The bare `foo` is offset 5-8 in `<a x=foo y="bar" />`.
            expect(diags[0].range.start.character).toBe(5);
            expect(diags[0].range.end.character).toBe(8);
        });

        it("does not flag two attributes separated by whitespace", async () => {
            // `<a x foo />` — two value-less boolean attributes, NOT an
            // unquoted assignment. The `x` half doesn't end in `=`, so
            // no pair forms; only the standard "unknown attribute"
            // warning on `foo` survives (and `x` itself is a known
            // attribute on the test `<a>` element).
            const source = `<a x foo />`;
            const ac = new AutoCompleter(source, schema.elements);
            const diags = await ac.getSchemaViolations();
            const messages = diags.map((d) => d.message);
            expect(messages).not.toContain(
                'Attribute values must be enclosed in quotes: `x="foo"`',
            );
            // Standard unknown-attribute warning still fires on `foo`.
            expect(messages).toContain(
                "Element `<a>` doesn't have an attribute called `foo`.",
            );
        });

        it("still warns when the assignment half itself is an unknown attribute", async () => {
            // `<a foo=bar />` — `foo` is not on `<a>`'s attribute list,
            // so the standard "unknown attribute" warning still fires
            // on the `foo=` half (the author should know `foo` isn't a
            // real attribute) AND the bare-value warning fires on the
            // `bar` half.  The two diagnostics are independent and both
            // useful.
            const source = `<a foo=bar />`;
            const ac = new AutoCompleter(source, schema.elements);
            const diags = await ac.getSchemaViolations();
            const messages = diags.map((d) => d.message).sort();
            expect(messages).toEqual([
                'Attribute values must be enclosed in quotes: `foo="bar"`',
                "Element `<a>` doesn't have an attribute called `foo`.",
            ]);
        });

        it("does not flag the next attribute when the assignment half is empty", async () => {
            // `<a x= y="bar" />` — `x`'s source is `x= ` (ends in `=`
            // plus whitespace), but `y="bar"` is a real attribute with
            // its own quoted value, not a bare token. Flagging the
            // pair would emit a misleading `x="y"` suggestion; the
            // value-half-also-empty guard prevents that.
            const source = `<a x= y="bar" />`;
            const ac = new AutoCompleter(source, schema.elements);
            const diags = await ac.getSchemaViolations();
            const messages = diags.map((d) => d.message);
            expect(messages).not.toContain(
                'Attribute values must be enclosed in quotes: `x="y"`',
            );
        });

        it("stays silent on macro-valued unquoted assignments", async () => {
            // `<a x=$y z=foo />` — the lezer parser absorbs `$y` as an
            // element child and drops `z`/`foo` out of the attribute
            // list entirely, leaving only `x` as a lone assignment half
            // with no sibling to pair with.  No bare-value warning
            // fires, even on the visually-bare `z=foo` portion —
            // documenting that the pre-pass relies on the parser
            // surfacing the second half as an attribute slot.
            const source = `<a x=$y z=foo />`;
            const ac = new AutoCompleter(source, schema.elements);
            const diags = await ac.getSchemaViolations();
            expect(
                diags
                    .map((d) => d.message)
                    .filter((m) => m.includes("must be enclosed in quotes")),
            ).toEqual([]);
        });

        it("does not emit a misleading `name=''` error on the assignment half", async () => {
            // `<math name=foo />` — the actual #1104 target. The
            // assignment half (`name=`) has `children.length === 0`, so
            // the standard `name`-must-start-with-a-letter check would
            // see `toXml([]) === ""` and emit an Error claiming the
            // author wrote `name=''`. They didn't — they wrote
            // `name=foo`, which is already reported by the new
            // bare-value warning. Suppress the misleading Error on the
            // paired assignment half.
            const source = `<math name=foo />`;
            const ac = new AutoCompleter(source, doenetSchema.elements);
            const diags = await ac.getSchemaViolations();
            const messages = diags.map((d) => d.message);
            expect(messages).toContain(
                'Attribute values must be enclosed in quotes: `name="foo"`',
            );
            expect(messages).not.toContain(
                "Invalid attribute name=''. Names must start with a letter.",
            );
        });

        it("tolerates the no-space self-closing form `name=foo/>`", async () => {
            // `<math name=foo/>` (no space before `/>`) — the form an
            // author is most likely to type. Lezer tokenizes this
            // identically to the space-separated `<math name=foo />`
            // case: the bare token is still `foo`, the assignment half
            // is still `name=`. Pin the behavior so a future grammar
            // tweak that absorbs `/` into the token surfaces here
            // instead of as a garbled hover.
            const source = `<math name=foo/>`;
            const ac = new AutoCompleter(source, doenetSchema.elements);
            const diags = await ac.getSchemaViolations();
            const messages = diags.map((d) => d.message);
            expect(messages).toContain(
                'Attribute values must be enclosed in quotes: `name="foo"`',
            );
        });

        it("does not emit a bare-value warning for two consecutive unquoted values", async () => {
            // `<a x=foo y=bar />` — the parser greedily reads through
            // the second `=` and reports its own quote-mismatch error
            // covering the whole run; emitting a bare-value warning
            // here would either misattribute the suggestion
            // (`x="foo"`? `x="y"`? neither is right) or duplicate the
            // parser's error.  Documented as out-of-scope on
            // `findBareAttributeValuePairs`; pin it with a test so a
            // future grammar change that surfaces clean attribute
            // slots for this case surfaces here instead of in the
            // wild.
            const source = `<a x=foo y=bar />`;
            const ac = new AutoCompleter(source, schema.elements);
            const diags = await ac.getSchemaViolations();
            expect(
                diags
                    .map((d) => d.message)
                    .filter((m) => m.includes("must be enclosed in quotes")),
            ).toEqual([]);
        });

        it("does not emit a misleading enum-mismatch on a paired assignment half", async () => {
            // `<b mode=foo />` — `mode` has allowedValues
            // `["none", "full", "true", "false"]`. The standard
            // enum-mismatch check defaults an empty value to `"true"`,
            // which IS in the set for `mode` — so this particular
            // attribute would be silent anyway. But `<b modeOneSided=foo />`
            // uses `["none", "full", "true"]` (also contains `"true"`),
            // so neither test schema attribute exercises a default-to-
            // `"true"` MISS. Use a synthetic schema with an enum that
            // excludes `"true"` to pin the suppression.
            const localSchema = {
                elements: [
                    {
                        name: "a",
                        children: [],
                        attributes: [
                            { name: "kind", values: ["one", "two"] },
                            { name: "k" },
                        ],
                        top: true,
                        acceptsStringChildren: false,
                    },
                ],
            };
            const source = `<a kind=foo />`;
            const ac = new AutoCompleter(source, localSchema.elements);
            const diags = await ac.getSchemaViolations();
            const messages = diags.map((d) => d.message);
            // The bare-value warning is the only diagnostic — no
            // "must be one of: ..." warning on the assignment half.
            expect(messages).toContain(
                'Attribute values must be enclosed in quotes: `kind="foo"`',
            );
            expect(
                messages.filter((m) => m.includes("must be one of")),
            ).toEqual([]);
        });
    });
});
