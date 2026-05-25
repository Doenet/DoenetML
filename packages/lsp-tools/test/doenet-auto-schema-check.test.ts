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
});
