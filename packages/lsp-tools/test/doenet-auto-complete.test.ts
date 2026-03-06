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

    it("Includes styleDefinition and feedbackDefinition in top-level completions from Doenet schema", () => {
        const source = `<`;
        const autoCompleter = new AutoCompleter(source, doenetSchema.elements);

        const items = autoCompleter.getCompletionItems(source.indexOf("<") + 1);
        const labels = items.map((item) => item.label);

        expect(labels).toContain("styleDefinition");
        expect(labels).toContain("feedbackDefinition");
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

    describe("Snippet completions", () => {
        it("Includes snippets after top-level `<`", () => {
            let source: string;
            let autoCompleter: AutoCompleter;

            source = `<`;
            autoCompleter = new AutoCompleter(source, schema.elements);

            // Manually inject test snippets directly into the snippet map
            // "aa" is the only top-level element, so snippets for "aa" should appear
            const testSnippets = {
                aa: [
                    {
                        key: "test-snippet-aa",
                        element: "aa",
                        normalizedElement: "aa",
                        snippet: "<aa>test snippet</aa>",
                        description: "Test snippet for aa element",
                    },
                ],
            };
            autoCompleter.snippetsByNormalizedElement = new Map(
                Object.entries(testSnippets),
            );

            let offset = source.indexOf("<") + 1;
            let items = autoCompleter.getCompletionItems(offset);

            // Should have both schema items (aa) and snippet items
            // CompletionItemKind.Snippet = 15
            const snippetItems = items.filter((item) => item.kind === 15);

            expect(snippetItems.length).toBeGreaterThan(0);
            expect(
                snippetItems.some((item) => item.label === "test-snippet-aa"),
            ).toBe(true);
        });

        it("Filters snippets by typed prefix", () => {
            let source: string;
            let autoCompleter: AutoCompleter;

            source = `<ta`;
            autoCompleter = new AutoCompleter(source, schema.elements);

            // Manually inject test snippets
            const testSnippets = {
                aa: [
                    {
                        key: "test-aa-snippet",
                        element: "aa",
                        normalizedElement: "aa",
                        snippet: "<aa>test</aa>",
                        description: "Test snippet for aa",
                    },
                ],
            };
            autoCompleter.snippetsByNormalizedElement = new Map(
                Object.entries(testSnippets) as [string, any[]][],
            );

            let offset = source.indexOf("<ta") + 3;
            let items = autoCompleter.getCompletionItems(offset);

            // The prefix "ta" doesn't match any snippet key, so no snippets should appear
            // Even though "aa" is an allowed element
            const snippetItems = items.filter((item) => item.kind === 15); // CompletionItemKind.Snippet = 15
            // Since no snippet key starts with "ta", expect empty results
            expect(snippetItems.length).toBe(0);

            // Now test with a matching prefix
            source = `<te`;
            autoCompleter = new AutoCompleter(source, schema.elements);
            autoCompleter.snippetsByNormalizedElement = new Map(
                Object.entries(testSnippets) as [string, any[]][],
            );

            offset = source.indexOf("<te") + 3;
            items = autoCompleter.getCompletionItems(offset);

            const matchingSnippets = items.filter((item) => item.kind === 15);
            expect(matchingSnippets.length).toBeGreaterThan(0);
            expect(
                matchingSnippets.some(
                    (item) => item.label === "test-aa-snippet",
                ),
            ).toBe(true);
        });

        it("Snippet items include textEdit with proper range", () => {
            let source: string;
            let autoCompleter: AutoCompleter;

            source = `<`;
            autoCompleter = new AutoCompleter(source, schema.elements);

            // Manually inject test snippet for "aa" (the top-level element)
            const testSnippets = {
                aa: [
                    {
                        key: "test-snippet",
                        element: "aa",
                        normalizedElement: "aa",
                        snippet: "<aa>snippet</aa>",
                        description: "Test",
                    },
                ],
            };
            autoCompleter.snippetsByNormalizedElement = new Map(
                Object.entries(testSnippets) as [string, any[]][],
            );

            let offset = source.indexOf("<") + 1;
            let items = autoCompleter.getCompletionItems(offset);

            const snippetItem = items.find(
                (item) => item.label === "test-snippet",
            );
            expect(snippetItem).toBeDefined();
            expect(snippetItem?.textEdit).toBeDefined();
            expect(snippetItem?.textEdit?.newText).toBe("<aa>snippet</aa>");
            expect(
                snippetItem?.textEdit && "range" in snippetItem.textEdit,
            ).toBe(true);
            expect(snippetItem?.filterText).toBe("test-snippet");
        });

        it("Snippet items indent multiline text", () => {
            let source: string;
            let autoCompleter: AutoCompleter;

            source = "  <";
            autoCompleter = new AutoCompleter(source, schema.elements);

            const testSnippets = {
                aa: [
                    {
                        key: "test-multiline",
                        element: "aa",
                        normalizedElement: "aa",
                        snippet: "<aa>\n<bb></bb>\n</aa>",
                        description: "Test",
                    },
                ],
            };
            autoCompleter.snippetsByNormalizedElement = new Map(
                Object.entries(testSnippets) as [string, any[]][],
            );

            const offset = source.indexOf("<") + 1;
            const items = autoCompleter.getCompletionItems(offset);

            const snippetItem = items.find(
                (item) => item.label === "test-multiline",
            );
            expect(snippetItem?.textEdit?.newText).toBe(
                "<aa>\n  <bb></bb>\n  </aa>",
            );
        });
    });
});
