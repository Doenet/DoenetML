import { describe, expect, it } from "vitest";
import util from "util";

import { filterPositionInfo, DastMacro, DastElement } from "@doenet/parser";
import { DoenetSourceObject, isOldMacro } from "../src/doenet-source-object";
import { doenetSchema } from "@doenet/static-assets/schema";
import { AutoCompleter } from "../src";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

const schema = {
    elements: [
        {
            name: "aa",
            children: ["b", "c", "d"],
            attributes: [{ name: "x" }, { name: "y" }, { name: "xyx" }],
            top: true,
            acceptsStringChildren: false,
        },
        {
            name: "b",
            children: ["www"],
            attributes: [
                { name: "foo", values: ["true", "false"] },
                { name: "bar", values: ["more", "less"] },
            ],
            top: false,
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
    it("Can suggest completions", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<a > <
            <b  foo="true" bar="less">
            </b>
            <c>hi</c>
        </a>`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<a") + 3;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot("[]");
        }
        {
            let offset = source.indexOf("<a") + 6;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot("[]");
        }
        {
            let offset = source.indexOf("<b") + 3;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 13,
                  "label": "foo",
                },
                {
                  "kind": 13,
                  "label": "bar",
                },
              ]
            `);
        }
        {
            let offset = source.indexOf("<b") + 8;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 12,
                  "label": ""true"",
                },
                {
                  "kind": 12,
                  "label": ""false"",
                },
              ]
            `);
        }
        {
            let offset = source.indexOf("<b") + 19;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 12,
                  "label": ""more"",
                },
                {
                  "kind": 12,
                  "label": ""less"",
                },
              ]
            `);
        }
        {
            let offset = source.indexOf("<b") + 9;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 12,
                  "label": "true",
                },
                {
                  "kind": 12,
                  "label": "false",
                },
              ]
            `);
        }
    });
    it("Can suggest closing tag completion when there is no closing tag", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<a> <   `;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<a") + 5;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 10,
                  "label": "/a>",
                },
              ]
            `);
        }
        source = `<a> </   `;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<a") + 6;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 10,
                  "label": "/a>",
                },
              ]
            `);
        }
    });
    it("Can suggest closing tag completion when there is no closing tag at document end", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<a> <`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<a") + 5;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 10,
                  "label": "/a>",
                },
              ]
            `);
        }
        source = `<a> </`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<a") + 6;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 10,
                  "label": "/a>",
                },
              ]
            `);
        }
    });
    it("Can suggest completions after a top level `<`", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `< `;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<") + 1;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 10,
                  "label": "aa",
                },
              ]
            `);
        }
    });
    it("Can suggest completions after a `<` when it comes at the end of the string", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = ` <`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<") + 1;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 10,
                  "label": "aa",
                },
              ]
            `);
        }
    });
    it("Can suggest completions after a `<a` when a comes at the end of the string", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = ` <a`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<a") + 2;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 10,
                  "label": "aa",
                },
              ]
            `);
        }
    });
    it("Can suggest completions for closing tags at the end of the string", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = ` <aa><`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("><") + 2;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 10,
                  "label": "/aa>",
                },
                {
                  "kind": 10,
                  "label": "b",
                },
                {
                  "kind": 10,
                  "label": "c",
                },
                {
                  "kind": 10,
                  "label": "d",
                },
              ]
            `);
        }
    });
    it("Closing tag suggestions are offered if there is whitespace after the `/` even if there is text", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = ` <aa></  xx`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("><") + 3;
            let elm = autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "kind": 10,
                  "label": "/aa>",
                },
              ]
            `);
        }
    });
    it("Can get completion context", () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = ` $foo.bar. `;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = 0;
            let elm = autoCompleter.getCompletionContext(offset);
            expect(elm).toEqual({
                cursorPos: "body",
            });

            offset = source.indexOf("$foo") + 4;
            elm = autoCompleter.getCompletionContext(offset);
            expect(elm).toMatchObject({
                complete: true,
                cursorPos: "macro",
            });

            // Matching at the . following the macro.
            offset = source.indexOf("bar") + 4;
            elm = autoCompleter.getCompletionContext(offset);
            expect(elm).toMatchObject({
                complete: false,
                cursorPos: "macro",
            });
        }
    });
});
