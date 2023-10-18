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
            attributes: [{ name: "x" }, { name: "y" }, { name: "xyx" }],
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
                  "character": 16,
                  "line": 2,
                },
                "start": {
                  "character": 12,
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
                  "character": 12,
                  "line": 4,
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
});
