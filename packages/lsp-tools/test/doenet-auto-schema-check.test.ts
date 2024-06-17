import { describe, expect, it } from "vitest";
import util from "util";

import { filterPositionInfo, DastMacro, DastElement } from "@doenet/parser";
import { DoenetSourceObject, isOldMacro } from "../src/doenet-source-object";
import { doenetSchema } from "@doenet/static-assets";
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
            attributes: [{ name: "foo", values: ["true", "false"] }],
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
    it("Can detect schema violations for elements", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<a>
            <b  foo="true">
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toHaveLength(0);

        source = `<c></c>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(`
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
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(`
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
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(`
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

    it("Can detect schema violations for elements not in the schema", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<e>xxx</e>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(`
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

    it("Can detect schema violations for elements with differently capitalized names", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<A>
            <B  foo="true">
            </B>
            <C>hi</C>
        </A>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toHaveLength(0);

        source = `<C></C>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(`
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
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(`
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

    it("Can detect schema violations for attributes", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<a>
            <b  food="true">
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(`
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
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(`
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

    it("Can detect schema violations for attribute values", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        // No error for correct values
        source = `<a>
            <b  foo="true">
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot("[]");

        // No error if an explicit list of attribute values is NOT values is given
        source = `<a x="77">
            <b>
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot("[]");

        // No error if a function or macro is used in the attribute value
        source = `<a><b  foo="true $x that"></b></a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot("[]");

        source = `<a><b  foo="true $$f(1) that"></b></a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot("[]");

        // Error if an explicit list is given and the attribute value is plain text and not on the list
        source = `<a>
            <b  foo="tru">
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(`
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
        () => {
            let source: string;
            let autoCompleter: AutoCompleter;

            // No error for correct values
            source = `<a>
            <b  foo="True">
            </b>
            <c>hi</c>
        </a>`;
            autoCompleter = new AutoCompleter(source, schema.elements);
            expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(
                "[]",
            );

            // Error if an explicit list is given and the attribute value is plain text and not on the list
            source = `<a xyx="z" />`;
            autoCompleter = new AutoCompleter(source, schema.elements);
            expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot(`
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

    it("substitutes `true` in for the value of an attribute that is not specified", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        // No error for correct values
        source = `<b  foo />`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        expect(autoCompleter.getSchemaViolations()).toMatchInlineSnapshot("[]");
    });
});
