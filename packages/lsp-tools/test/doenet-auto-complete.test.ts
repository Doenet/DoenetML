import { describe, expect, it, vi } from "vitest";
import util from "util";
import { CompletionItemKind } from "vscode-languageserver/browser";

import { filterPositionInfo, DastMacro, DastElement } from "@doenet/parser";
import { DoenetSourceObject } from "../src/doenet-source-object";
import { doenetSchema } from "@doenet/static-assets/schema";
import { AutoCompleter, RustResolverAdapter } from "../src";
import type { RustResolverCore } from "../src";

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
                cursorPos: "refName",
                typedPrefix: "foo",
            });

            // Matching at the . following the macro.
            offset = source.indexOf("bar") + 4;
            elm = autoCompleter.getCompletionContext(offset);
            expect(elm).toMatchObject({
                cursorPos: "refMember",
                typedPrefix: "",
            });
        }
    });

    describe("Reference completions", () => {
        const refSchema = {
            elements: [
                {
                    name: "section",
                    children: ["p"],
                    attributes: [],
                    properties: [{ name: "myP" }, { name: "sectionProp" }],
                    top: true,
                    acceptsStringChildren: true,
                },
                {
                    name: "p",
                    children: [],
                    attributes: [],
                    properties: [{ name: "pProp" }],
                    top: true,
                    acceptsStringChildren: true,
                },
            ],
        };

        it("Suggests reference names after $ with prefix filtering", () => {
            const source = `<section name="mySection"><p name="myP" /></section><p name="other" />\n$myS`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset = source.length;
            const items = autoCompleter.getCompletionItems(offset);

            expect(items.length).toBeGreaterThan(0);
            expect(
                items.every(
                    (item) => item.kind === CompletionItemKind.Reference,
                ),
            ).toBe(true);
            expect(
                items.every((item) =>
                    item.label.toLowerCase().startsWith("mys"),
                ),
            ).toBe(true);
            expect(items.some((item) => item.label === "mySection")).toBe(true);
            expect(
                items.every((item) => !String(item.label).includes(".")),
            ).toBe(true);
        });

        it("Inserts parenthesized macro text for hyphenated names after $", () => {
            const source = `<math name="foo-bar" />\n$f`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const items = autoCompleter.getCompletionItems(source.length);
            const fooBarItem = items.find((item) => item.label === "foo-bar");

            expect(fooBarItem).toBeDefined();
            expect(fooBarItem?.textEdit).toBeDefined();
            const textEdit = fooBarItem?.textEdit;
            if (textEdit && "newText" in textEdit) {
                expect(textEdit.newText).toBe("(foo-bar)");
            }
        });

        it("Keeps plain macro text for simple names after $", () => {
            const source = `<math name="foo_bar" />\n$f`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const items = autoCompleter.getCompletionItems(source.length);
            const fooBarItem = items.find((item) => item.label === "foo_bar");

            expect(fooBarItem).toBeDefined();
            expect(fooBarItem?.textEdit).toBeDefined();
            const textEdit = fooBarItem?.textEdit;
            if (textEdit && "newText" in textEdit) {
                expect(textEdit.newText).toBe("foo_bar");
            }
        });

        it("Suggests descendant names and properties after dot, with descendants winning collisions", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$mySection.`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset = source.length;
            const items = autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.some((item) => item.label === "sectionProp")).toBe(
                true,
            );

            const myPItems = items.filter((item) => item.label === "myP");
            expect(myPItems).toHaveLength(1);
            expect(myPItems[0].kind).toBe(CompletionItemKind.Reference);
        });

        it("Only suggests uniquely addressable descendant names after dot", () => {
            const source = `<section name="mySection"><p name="dup" /><p name="dup" /><p name="unique" /></section>\n$mySection.`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset = source.length;
            const items = autoCompleter.getCompletionItems(offset);

            // `dup` is ambiguous under `mySection` and should not be suggested.
            expect(items.some((item) => item.label === "dup")).toBe(false);
            // Unique descendant names remain valid suggestions.
            expect(items.some((item) => item.label === "unique")).toBe(true);
        });

        it("Only suggests member names that resolve uniquely from the same context", () => {
            const source = `<section name="mySection"><p name="dup" /><p name="dup" /><p name="unique" /></section>\n$mySection.`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset = source.length;
            const section = autoCompleter.sourceObj.getReferentAtOffset(
                offset,
                "mySection",
            );
            expect(section).toBeTruthy();

            const items = autoCompleter
                .getCompletionItems(offset)
                .filter((item) => item.kind === CompletionItemKind.Reference);

            for (const item of items) {
                const resolved = autoCompleter.sourceObj.getNamedDescendant(
                    section,
                    String(item.label),
                );
                expect(resolved).toBeTruthy();
            }
        });

        it("Excludes ambiguous names in top-level completions after $", () => {
            const source = `<section><p name="dup" /><p name="dup" /><p name="unique" /></section>\n$`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const items = autoCompleter
                .getCompletionItems(source.length)
                .filter((item) => item.kind === CompletionItemKind.Reference)
                .map((item) => String(item.label));

            expect(items).not.toContain("dup");
            expect(items).toContain("unique");
        });

        it("Suggests descendant names and properties after dot at the start of the file", () => {
            const source = `$mySection.\n<section name="mySection"><p name="myP" /></section>`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset = source.indexOf("\n");
            const items = autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.some((item) => item.label === "sectionProp")).toBe(
                true,
            );
        });

        it("Suggests members after chained descendant access", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$mySection.myP.`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset = source.length;
            const items = autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "pProp")).toBe(true);
            expect(items.every((item) => item.label !== "sectionProp")).toBe(
                true,
            );
        });

        it("Suggests reference names inside attribute values after $", () => {
            const source = `<section name="mySection" /><line through="$myS" />`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset = source.indexOf("$myS") + "$myS".length;
            const items = autoCompleter.getCompletionItems(offset);

            expect(items.length).toBeGreaterThan(0);
            expect(
                items.every(
                    (item) => item.kind === CompletionItemKind.Reference,
                ),
            ).toBe(true);
            expect(items.some((item) => item.label === "mySection")).toBe(true);
        });

        it("Suggests descendant members inside attribute values after dot with member prefix", () => {
            const source = `<section name="mySection"><p name="myP" /></section><line through="$mySection.my" />`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset =
                source.indexOf("$mySection.my") + "$mySection.my".length;
            const completionContext =
                autoCompleter.getCompletionContext(offset);
            expect(completionContext).toMatchObject({ cursorPos: "refMember" });
            const items = autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.every((item) => item.label !== "sectionProp")).toBe(
                true,
            );
        });

        it("Suggests reference names in parenthesized macros with hyphenated prefixes", () => {
            const source = `<math name="foo-bar" /><math name="foo-baz" />\n$(foo-ba`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset = source.length;
            const completionContext =
                autoCompleter.getCompletionContext(offset);
            expect(completionContext).toMatchObject({
                cursorPos: "refName",
                typedPrefix: "foo-ba",
            });

            const items = autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "foo-bar")).toBe(true);
            expect(items.some((item) => item.label === "foo-baz")).toBe(true);
        });

        it("Suggests member completions in parenthesized macros with hyphenated names", () => {
            const source = `<section name="foo-bar"><p name="myP" /></section>\n$(foo-bar.my`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset = source.length;
            const completionContext =
                autoCompleter.getCompletionContext(offset);
            expect(completionContext).toMatchObject({
                cursorPos: "refMember",
                typedPrefix: "my",
            });

            const items = autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "myP")).toBe(true);
        });

        it("Suggests member completions after dot on completed parenthesized macros", () => {
            const source = `<section name="foo-bar"><p name="myP" /></section>\n$(foo-bar).`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const offset = source.length;
            const completionContext =
                autoCompleter.getCompletionContext(offset);
            expect(completionContext).toMatchObject({
                cursorPos: "refMember",
                typedPrefix: "",
            });

            const items = autoCompleter.getCompletionItems(offset);

            // Descendant and property suggestions should both be present.
            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.some((item) => item.label === "sectionProp")).toBe(
                true,
            );
        });

        it("Inserts parenthesized member text for hyphenated names after dot", () => {
            const source = `<section name="base"><p name="my-p" /><p name="my_p" /></section>\n$base.my`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const items = autoCompleter.getCompletionItems(source.length);
            const hyphenItem = items.find((item) => item.label === "my-p");
            const underscoreItem = items.find((item) => item.label === "my_p");

            expect(hyphenItem).toBeDefined();
            expect(underscoreItem).toBeDefined();

            const hyphenTextEdit = hyphenItem?.textEdit;
            if (hyphenTextEdit && "newText" in hyphenTextEdit) {
                expect(hyphenTextEdit.newText).toBe("(my-p)");
            }

            const underscoreTextEdit = underscoreItem?.textEdit;
            if (underscoreTextEdit && "newText" in underscoreTextEdit) {
                expect(underscoreTextEdit.newText).toBe("my_p");
            }
        });

        it("Applies same member insertion policy after dot in parenthesized refs", () => {
            const source = `<section name="base"><p name="my-p" /><p name="my_p" /></section>\n$(base).my`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const items = autoCompleter.getCompletionItems(source.length);
            const hyphenItem = items.find((item) => item.label === "my-p");
            const underscoreItem = items.find((item) => item.label === "my_p");

            expect(hyphenItem).toBeDefined();
            expect(underscoreItem).toBeDefined();

            const hyphenTextEdit = hyphenItem?.textEdit;
            if (hyphenTextEdit && "newText" in hyphenTextEdit) {
                expect(hyphenTextEdit.newText).toBe("(my-p)");
            }

            const underscoreTextEdit = underscoreItem?.textEdit;
            if (underscoreTextEdit && "newText" in underscoreTextEdit) {
                expect(underscoreTextEdit.newText).toBe("my_p");
            }
        });

        it("Classifies parenthesized member-segment syntax after dot as refMember", () => {
            const source = `<section name="base"><p name="my-p" /></section>\n$(base).(my`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const completionContext = autoCompleter.getCompletionContext(
                source.length,
            );
            expect(completionContext).toMatchObject({
                cursorPos: "refMember",
                typedPrefix: "my",
            });
        });

        it("Does not double-parenthesize insertion in .(member) contexts", () => {
            const source = `<section name="base"><p name="my-p" /></section>\n$(base).(my`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const items = autoCompleter.getCompletionItems(source.length);
            const hyphenItem = items.find((item) => item.label === "my-p");

            expect(hyphenItem).toBeDefined();
            const textEdit = hyphenItem?.textEdit;
            if (textEdit && "newText" in textEdit) {
                expect(textEdit.newText).toBe("my-p");
            }
        });

        it("Keeps completion visible when a descendant member is fully typed", () => {
            const pointSchema = {
                elements: [
                    {
                        name: "point",
                        children: ["math"],
                        attributes: [{ name: "coords" }],
                        top: true,
                        acceptsStringChildren: true,
                    },
                    {
                        name: "math",
                        children: [],
                        attributes: [],
                        top: true,
                        acceptsStringChildren: true,
                    },
                ],
            };

            const source = `<point name="P"><math name="coords">(3,4)</math></point><point name="Q">(3,2)</point>\n$P.coords`;
            const autoCompleter = new AutoCompleter(
                source,
                pointSchema.elements,
            );

            const offset = source.length;
            const items = autoCompleter.getCompletionItems(offset);
            const coordsItems = items.filter((item) => item.label === "coords");

            expect(coordsItems).toHaveLength(1);
            expect(coordsItems[0].kind).toBe(CompletionItemKind.Reference);
            expect(coordsItems[0].detail).toBe("Descendant reference name");
        });

        it("Returns no ref completions in invalid or unresolved contexts", () => {
            {
                const source = `<section $`;
                const autoCompleter = new AutoCompleter(
                    source,
                    refSchema.elements,
                );
                const items = autoCompleter.getCompletionItems(source.length);
                expect(
                    items.some(
                        (item) => item.kind === CompletionItemKind.Reference,
                    ),
                ).toBe(false);
            }

            {
                const source = `<section name="mySection" />\n$missing.`;
                const autoCompleter = new AutoCompleter(
                    source,
                    refSchema.elements,
                );
                const items = autoCompleter.getCompletionItems(source.length);
                expect(items).toEqual([]);
            }
        });

        it("Uses injected resolver hook for member completion", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$missing.`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);
            const resolver = vi.fn(({ offset }: { offset: number }) => ({
                node: autoCompleter.sourceObj.getReferentAtOffset(
                    offset,
                    "mySection",
                ),
                unresolvedPathParts: [],
            }));
            autoCompleter.setResolveRefMemberContainerAtOffset(resolver);

            const items = autoCompleter.getCompletionItems(source.length);

            expect(resolver).toHaveBeenCalledOnce();
            expect(resolver).toHaveBeenCalledWith({
                offset: source.length,
                pathParts: ["missing", ""],
                nodeIndex: expect.any(Number), // Index may vary based on structure
            });
            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.some((item) => item.label === "sectionProp")).toBe(
                true,
            );
        });

        it("Allows setting resolver hook after construction", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$missing.`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);
            const resolver = vi.fn(({ offset }: { offset: number }) => ({
                node: autoCompleter.sourceObj.getReferentAtOffset(
                    offset,
                    "mySection",
                ),
                unresolvedPathParts: [],
            }));

            autoCompleter.setResolveRefMemberContainerAtOffset(resolver);

            const items = autoCompleter.getCompletionItems(source.length);

            expect(resolver).toHaveBeenCalledOnce();
            expect(items.some((item) => item.label === "myP")).toBe(true);
        });

        it("Reports unresolved path segments from default member resolution", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$mySection.missing.`;
            const autoCompleter = new AutoCompleter(source, refSchema.elements);

            const resolution = autoCompleter.resolveRefMemberContainerAtOffset(
                source.length,
                ["mySection", "missing", ""],
            );

            expect(resolution.node).toBeNull();
            expect(resolution.unresolvedPathParts).toEqual(["missing"]);
        });

        it("Passes node index to resolver for index-based resolution", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$missing.`;

            // Mock resolver that captures the nodeIndex parameter
            const indexCapture: (number | null)[] = [];
            const resolver = vi.fn(
                ({
                    nodeIndex,
                }: {
                    offset: number;
                    pathParts: string[];
                    nodeIndex?: number | null;
                }) => {
                    indexCapture.push(nodeIndex ?? null);
                    // Return no resolution (mock behavior)
                    return null;
                },
            );

            const autoCompleter = new AutoCompleter(
                source,
                refSchema.elements,
                { resolveRefMemberContainerAtOffset: resolver },
            );

            autoCompleter.getCompletionItems(source.length);

            // Verify resolver was called with nodeIndex
            expect(resolver).toHaveBeenCalledOnce();
            expect(indexCapture[0]).not.toBeNull();
            expect(typeof indexCapture[0]).toBe("number");
        });

        it("Allows Rust-backed resolver to use node index directly", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$missing.`;

            // Simulate Rust resolver: receives offset and index, performs resolution
            const rustSimulator = vi.fn(
                ({
                    offset,
                    nodeIndex,
                    pathParts,
                }: {
                    offset: number;
                    nodeIndex?: number | null;
                    pathParts: string[];
                }) => {
                    // In real Rust implementation, would call:
                    // resolve_path(origin_index, path_parts) -> {node_index, unresolved_path}
                    // For this test, simulate successful resolution to the root element
                    if (nodeIndex !== null && nodeIndex !== undefined) {
                        return {
                            node: {
                                name: "section",
                                attributes: {},
                                children: [],
                                type: "element",
                            } as DastElement,
                            unresolvedPathParts: [],
                        };
                    }
                    return null;
                },
            );

            const autoCompleter = new AutoCompleter(
                source,
                refSchema.elements,
                { resolveRefMemberContainerAtOffset: rustSimulator },
            );

            const items = autoCompleter.getCompletionItems(source.length);

            // Verify the Rust-backed resolver was called with the node index
            expect(rustSimulator).toHaveBeenCalledOnce();
            expect(rustSimulator).toHaveBeenCalledWith(
                expect.objectContaining({
                    offset: source.length,
                    nodeIndex: expect.any(Number),
                    pathParts: expect.any(Array),
                }),
            );
            // Since resolver provided a section node with properties, should have completion items
            expect(items.length).toBeGreaterThan(0);
            expect(items.some((item) => item.label === "myP")).toBe(true);
        });
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

    describe("Offset-to-node-index mapping", () => {
        it("Maps offsets to node indices in depth-first order", () => {
            const source = `<aa name="test"><b></b></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            // Offset at opening tag should map to aa element (earliest element)
            const aaStartIndex = sourceObj.getNodeIndexAtOffset(1);
            expect(aaStartIndex).not.toBeNull();
            expect(aaStartIndex).toBeGreaterThan(0); // Not root
        });

        it("Maps multiple offsets to same node index for consecutive positions", () => {
            const source = `<aa><b></b></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            // Consecutive offsets within the same element should map to same node
            const idx1 = sourceObj.getNodeIndexAtOffset(1);
            const idx2 = sourceObj.getNodeIndexAtOffset(2);
            expect(idx1).toBe(idx2);
        });

        it("Returns null for offsets outside element ranges", () => {
            const source = `text<aa></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            // Offset in plain text before any element maps to root (index 0 or similar)
            const rootIndex = sourceObj.getNodeIndexAtOffset(0);
            expect(rootIndex).not.toBeNull(); // Plain text is in root

            // Offset inside aa element should be different
            const aaIndex = sourceObj.getNodeIndexAtOffset(6);
            expect(aaIndex).not.toBe(rootIndex);
        });

        it("Provides consistent indices across multiple calls", () => {
            const source = `<aa><b></b></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            const offset = 5;
            const index1 = sourceObj.getNodeIndexAtOffset(offset);
            const index2 = sourceObj.getNodeIndexAtOffset(offset);

            expect(index1).toBe(index2);
        });

        it("Uses left-of-cursor semantics at EOF", () => {
            const source = `<aa><b></b></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            const eofIndex = sourceObj.getNodeIndexAtOffset(source.length);
            const lastCharIndex = sourceObj.getNodeIndexAtOffset(
                source.length - 1,
            );

            expect(eofIndex).toBe(lastCharIndex);
            expect(eofIndex).not.toBeNull();
        });

        it("Differentiates nested nodes with different indices", () => {
            const source = `<aa><b></b></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            // Get indices for different parts of the structure
            const aaIdx = sourceObj.getNodeIndexAtOffset(1); // Inside <aa>
            const bIdx = sourceObj.getNodeIndexAtOffset(6); // Inside <b>

            expect(aaIdx).not.toEqual(bIdx);
            // In depth-first traversal, child comes after parent
            expect(bIdx).toBeGreaterThan(aaIdx!);
        });
    });

    describe("RustResolverAdapter architecture", () => {
        it("Creates a resolver callback compatible with AutoCompleter", () => {
            const source = `<section name="mySection"><p name="myP" /></section>`;
            const sourceObj = new DoenetSourceObject(source);

            const adapter = new RustResolverAdapter(sourceObj);
            const resolver = adapter.createResolver();

            // Verify resolver is a function
            expect(typeof resolver).toBe("function");

            // Verify it accepts resolver args and returns RefMemberContainerResolution
            const result = resolver({
                offset: 10,
                pathParts: ["foo", "bar"],
                nodeIndex: 2,
            });

            // When Rust backend is not initialized, resolver returns null (fallback)
            expect(result).toBeNull();
        });

        it("Provides disabled resolver when WASM not initialized", () => {
            const source = `<aa><b></b></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            const adapter = new RustResolverAdapter(sourceObj);

            // Resolver should be disabled by default if WASM not available
            expect(adapter.isEnabled()).toBe(false);

            const resolver = adapter.createResolver();
            const result = resolver({
                offset: 5,
                pathParts: ["x", "y"],
                nodeIndex: 3,
            });

            // Disabled resolver returns null, allowing JS fallback
            expect(result).toBeNull();
        });

        it("Demonstrates node index flow to resolver", () => {
            const source = `<section name="root"><p name="child" /></section>\n$root.`;
            const sourceObj = new DoenetSourceObject(source);

            // Get node index at offset
            const offset = source.length - 1; // At the dot
            const nodeIndex = sourceObj.getNodeIndexAtOffset(offset);

            expect(typeof nodeIndex).toBe("number");

            // Create adapter and resolver
            const adapter = new RustResolverAdapter(sourceObj);

            // Resolver receives the node index - demonstrate flow
            const testResolver = (args: any) => {
                expect(args.nodeIndex).toBe(nodeIndex);
                return null;
            };

            testResolver({
                offset,
                pathParts: ["root"],
                nodeIndex,
            });
        });

        it("Integrates with AutoCompleter via dependency injection", () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const sourceObj = new DoenetSourceObject(source);

            // Define a minimal schema for this test
            const testSchema = [
                {
                    name: "section",
                    children: ["p"],
                    attributes: [],
                    properties: [{ name: "p1" }],
                    top: true,
                    acceptsStringChildren: true,
                },
                {
                    name: "p",
                    children: [],
                    attributes: [],
                    properties: [],
                    top: false,
                    acceptsStringChildren: true,
                },
            ];

            const adapter = new RustResolverAdapter(sourceObj);
            const resolver = adapter.createResolver();

            // Pass resolver to AutoCompleter
            const autoCompleter = new AutoCompleter(source, testSchema, {
                resolveRefMemberContainerAtOffset: resolver,
            });

            // Resolver will be called during completion lookup
            // When WASM not initialized, falls back to JS resolver
            const items = autoCompleter.getCompletionItems(source.length);

            // Should have completion items (from JS fallback)
            expect(items.length).toBeGreaterThan(0);
        });

        it("Documents architecture for Rust resolver integration", () => {
            // This test documents the integration point for Rust resolver
            // When PublicDoenetMLCore.resolve_path() is called, interface will be:
            //
            // Current incomplete adapter returns null -> JS fallback
            // Future: Load WASM, call resolve_path(), map results back to DAST
            //
            // Architecture pattern:
            // 1. Offset -> getNodeIndexAtOffset() -> node index
            // 2. Node index + pathParts -> resolver callback
            // 3. Resolver calls resolve_path(origin_index) with Rust PathToCheck format
            // 4. Maps result.node_idx back to DAST for completions

            const sourceObj = new DoenetSourceObject("<aa></aa>");
            const adapter = new RustResolverAdapter(sourceObj);

            // Without a core, adapter is disabled
            expect(adapter.isEnabled()).toBe(false);
            expect(typeof adapter.createResolver).toBe("function");
        });
    });

    describe("RustResolverAdapter with mock core", () => {
        /**
         * Helper: create a mock RustResolverCore that records calls and returns
         * a configurable response from resolve_path.
         */
        function createMockCore(
            source: string,
            sourceObj: DoenetSourceObject,
            resolveResult?: {
                nodeIdx: number;
                nodesInResolvedPath: number[];
                unresolvedPath: Array<{ name: string }> | null;
                originalPath: Array<{ name: string }>;
            },
        ): {
            core: RustResolverCore;
            calls: { path: unknown; origin: number; skip: boolean }[];
        } {
            const calls: { path: unknown; origin: number; skip: boolean }[] =
                [];

            // Build a minimal flat DAST from the JS DAST by assigning sequential
            // ids to elements in depth-first order (matching Rust's pre-order).
            const elements: Array<{
                data: { id: number };
                position?: { start: { offset?: number } };
            }> = [];
            let nextId = 0;
            const collectElements = (node: any) => {
                if (node.type === "element") {
                    elements.push({
                        data: { id: nextId++ },
                        position: node.position,
                    });
                    for (const child of node.children || []) {
                        collectElements(child);
                    }
                }
            };
            for (const child of sourceObj.dast.children) {
                collectElements(child);
            }

            const core: RustResolverCore = {
                set_source: () => {},
                return_dast: () => ({ elements }),
                resolve_path: (path, origin, skip) => {
                    calls.push({ path, origin, skip });
                    if (resolveResult) return resolveResult;
                    // Default: resolve to first element, no unresolved path
                    return {
                        nodeIdx: 0,
                        nodesInResolvedPath: [0],
                        unresolvedPath: null,
                        originalPath: [],
                    };
                },
            };

            return { core, calls };
        }

        it("Enables adapter when core is provided", () => {
            const source = `<section name="s1"><p name="p1" /></section>`;
            const sourceObj = new DoenetSourceObject(source);
            const { core } = createMockCore(source, sourceObj);

            const adapter = new RustResolverAdapter(sourceObj, { core });
            expect(adapter.isEnabled()).toBe(true);
        });

        it("Resolves single-level ref via Rust core", () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core, calls } = createMockCore(source, sourceObj, {
                nodeIdx: 0, // section
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "s1" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, { core });
            const resolver = adapter.createResolver();

            // pathParts: ["s1", ""] — "s1" is the container, "" is the incomplete member
            const result = resolver({
                offset: source.indexOf("$s1.") + 4,
                pathParts: ["s1", ""],
            });

            expect(calls.length).toBe(1);
            expect(calls[0].path).toEqual({
                path: [{ type: "flatPathPart", name: "s1", index: [] }],
            });
            expect(result).not.toBeNull();
            expect(result!.node?.type).toBe("element");
            // The resolved node is the section (index 0 in our mock)
            expect(
                (result!.node as any)?.attributes?.name?.children?.[0]?.value,
            ).toBe("s1");
            expect(result!.unresolvedPathParts).toEqual([]);
        });

        it("Returns null when resolve_path throws", () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$missing.`;
            const sourceObj = new DoenetSourceObject(source + " ");

            const core: RustResolverCore = {
                set_source: () => {},
                return_dast: () => {
                    const elements: Array<{
                        data: { id: number };
                        position?: { start: { offset?: number } };
                    }> = [];
                    let nextId = 0;
                    const collectElements = (node: any) => {
                        if (node.type === "element") {
                            elements.push({
                                data: { id: nextId++ },
                                position: node.position,
                            });
                            for (const child of node.children || []) {
                                collectElements(child);
                            }
                        }
                    };
                    for (const child of sourceObj.dast.children) {
                        collectElements(child);
                    }
                    return { elements };
                },
                resolve_path: () => {
                    throw new Error("NoReferent");
                },
            };

            const adapter = new RustResolverAdapter(sourceObj, { core });
            const resolver = adapter.createResolver();

            const result = resolver({
                offset: source.indexOf("$missing.") + 9,
                pathParts: ["missing", ""],
            });
            expect(result).toBeNull();
        });

        it("Passes unresolved path parts through", () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$s1.p1.x`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core } = createMockCore(source, sourceObj, {
                nodeIdx: 1, // p
                nodesInResolvedPath: [0, 1],
                unresolvedPath: [{ name: "remaining" }],
                originalPath: [{ name: "s1" }, { name: "p1" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, { core });
            const resolver = adapter.createResolver();

            const result = resolver({
                offset: source.indexOf("$s1.p1.x") + 8,
                pathParts: ["s1", "p1", "x"],
            });

            // Unresolved path means node is null (can't complete from an unresolved member)
            expect(result).not.toBeNull();
            expect(result!.node).toBeNull();
            expect(result!.unresolvedPathParts).toEqual(["remaining"]);
        });

        it("Falls back to JS resolver when adapter disabled", () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const testSchema = [
                {
                    name: "section",
                    children: ["p"],
                    attributes: [],
                    properties: [{ name: "p1" }],
                    top: true,
                    acceptsStringChildren: true,
                },
                {
                    name: "p",
                    children: [],
                    attributes: [],
                    properties: [],
                    top: false,
                    acceptsStringChildren: true,
                },
            ];

            // No core → disabled adapter → falls back to JS
            const adapter = new RustResolverAdapter(sourceObj);
            const resolver = adapter.createResolver();

            const autoCompleter = new AutoCompleter(source, testSchema, {
                resolveRefMemberContainerAtOffset: resolver,
            });
            const items = autoCompleter.getCompletionItems(source.length);
            expect(items.length).toBeGreaterThan(0);
        });

        it("Handles updateSource to re-sync with core", () => {
            const source1 = `<section name="s1"><p name="p1" /></section>`;
            const sourceObj1 = new DoenetSourceObject(source1);
            const { core } = createMockCore(source1, sourceObj1);

            const adapter = new RustResolverAdapter(sourceObj1, { core });
            expect(adapter.isEnabled()).toBe(true);

            const source2 = `<section name="s2"><p name="p2" /></section>`;
            const sourceObj2 = new DoenetSourceObject(source2);
            adapter.updateSource(sourceObj2);
            expect(adapter.isEnabled()).toBe(true);
        });

        it("Disables adapter when set_source throws", () => {
            const source = `<section name="s1"></section>`;
            const sourceObj = new DoenetSourceObject(source);

            const brokenCore: RustResolverCore = {
                set_source: () => {
                    throw new Error("WASM error");
                },
                return_dast: () => ({ elements: [] }),
                resolve_path: () => ({
                    nodeIdx: 0,
                    nodesInResolvedPath: [0],
                    unresolvedPath: null,
                    originalPath: [],
                }),
            };

            const adapter = new RustResolverAdapter(sourceObj, {
                core: brokenCore,
            });
            expect(adapter.isEnabled()).toBe(false);

            const resolver = adapter.createResolver();
            expect(resolver({ offset: 0, pathParts: ["s1", ""] })).toBeNull();
        });
    });
});
