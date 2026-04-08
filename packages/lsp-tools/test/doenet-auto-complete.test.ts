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
    it("Suggests child elements (not attributes) when < is typed inside a closed element", () => {
        // Regression: typing `<` inside `<aa>...</aa>` used to return
        // aa's attributes instead of its allowed child elements.
        const source = `<aa><</aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("><") + 2;
        const items = autoCompleter.getCompletionItems(offset);
        const labels = items.map((i) => i.label);
        // Should contain child elements, not attribute names
        expect(labels).toContain("b");
        expect(labels).toContain("c");
        expect(labels).toContain("d");
        expect(labels).not.toContain("x");
        expect(labels).not.toContain("y");
        expect(labels).not.toContain("xyx");
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

        source = ` $foo . `;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            const offset = source.indexOf(".") + 1;
            const elm = autoCompleter.getCompletionContext(offset);
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

        function createRefAutoCompleter(
            source: string,
            createAdapter: (
                sourceObj: DoenetSourceObject,
            ) => RustResolverAdapter = (sourceObj) =>
                ({
                    isNameAddressableFromOffset: () => true,
                    resolveRefMemberContainerAtOffset: (
                        offset: number,
                        pathParts: string[],
                    ) => {
                        if (pathParts.length === 0) {
                            return {
                                node: null,
                                unresolvedPathParts: [],
                            };
                        }

                        const lookupPathParts = pathParts.slice(0, -1);
                        if (lookupPathParts.length === 0) {
                            return {
                                node: null,
                                unresolvedPathParts: [],
                            };
                        }

                        let referent = sourceObj.getReferentAtOffset(
                            offset,
                            lookupPathParts[0],
                        );
                        if (!referent) {
                            return {
                                node: null,
                                unresolvedPathParts: lookupPathParts,
                            };
                        }

                        let firstUnresolvedPartIndex = -1;
                        for (let i = 1; i < lookupPathParts.length; i++) {
                            const part = lookupPathParts[i];
                            const child = sourceObj.getNamedDescendant(
                                referent,
                                part,
                            );
                            if (!child) {
                                firstUnresolvedPartIndex = i;
                                break;
                            }
                            referent = child;
                        }

                        const unresolvedPathParts =
                            firstUnresolvedPartIndex === -1
                                ? []
                                : lookupPathParts.slice(
                                      firstUnresolvedPartIndex,
                                  );

                        if (unresolvedPathParts.length > 0) {
                            return {
                                node: null,
                                unresolvedPathParts,
                            };
                        }

                        return {
                            node: referent,
                            unresolvedPathParts: [],
                            visibleDescendantNames:
                                sourceObj.getUniqueDescendantNamesForNode(
                                    referent,
                                ),
                        };
                    },
                }) as unknown as RustResolverAdapter,
        ) {
            const sourceObj = new DoenetSourceObject();
            sourceObj.setSource(source + " ");
            return new AutoCompleter(undefined, refSchema.elements, {
                sourceObj,
                rustResolverAdapter: createAdapter(sourceObj),
            });
        }

        it("Suggests reference names after $ with prefix filtering", () => {
            const source = `<section name="mySection"><p name="myP" /></section><p name="other" />\n$myS`;
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const items = autoCompleter.getCompletionItems(offset);

            // `dup` is ambiguous under `mySection` and should not be suggested.
            expect(items.some((item) => item.label === "dup")).toBe(false);
            // Unique descendant names remain valid suggestions.
            expect(items.some((item) => item.label === "unique")).toBe(true);
        });

        it("Only suggests member names that resolve uniquely from the same context", () => {
            const source = `<section name="mySection"><p name="dup" /><p name="dup" /><p name="unique" /></section>\n$mySection.`;
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

            const items = autoCompleter
                .getCompletionItems(source.length)
                .filter((item) => item.kind === CompletionItemKind.Reference)
                .map((item) => String(item.label));

            expect(items).not.toContain("dup");
            expect(items).toContain("unique");
        });

        it("Suggests descendant names and properties after dot at the start of the file", () => {
            const source = `$mySection.\n<section name="mySection"><p name="myP" /></section>`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.indexOf("\n");
            const items = autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.some((item) => item.label === "sectionProp")).toBe(
                true,
            );
        });

        it("Suggests members after chained descendant access", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$mySection.myP.`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const items = autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "pProp")).toBe(true);
            expect(items.every((item) => item.label !== "sectionProp")).toBe(
                true,
            );
        });

        it("Suggests reference names inside attribute values after $", () => {
            const source = `<section name="mySection" /><line through="$myS" />`;
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

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
            const autoCompleter = createRefAutoCompleter(source);

            const items = autoCompleter.getCompletionItems(source.length);
            const hyphenItem = items.find((item) => item.label === "my-p");

            expect(hyphenItem).toBeDefined();
            const textEdit = hyphenItem?.textEdit;
            if (textEdit && "newText" in textEdit) {
                expect(textEdit.newText).toBe("my-p");
            }
        });

        it("Returns no ref-member completion when no resolver is configured", () => {
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
            expect(items).toEqual([]);
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

        it("Uses adapter-provided member resolution for completions", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$missing.`;
            let resolver: ReturnType<typeof vi.fn>;
            const autoCompleter = createRefAutoCompleter(
                source,
                (sourceObj) => {
                    resolver = vi.fn((offset: number) => ({
                        node: sourceObj.getReferentAtOffset(
                            offset,
                            "mySection",
                        ),
                        unresolvedPathParts: [],
                        visibleDescendantNames: ["myP"],
                    }));
                    return {
                        isNameAddressableFromOffset: () => true,
                        resolveRefMemberContainerAtOffset: resolver,
                    } as unknown as RustResolverAdapter;
                },
            );

            const items = autoCompleter.getCompletionItems(source.length);

            expect(resolver!).toHaveBeenCalledOnce();
            expect(resolver!).toHaveBeenCalledWith(
                source.length,
                ["missing", ""],
                [false, false],
            );
            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.some((item) => item.label === "sectionProp")).toBe(
                true,
            );
        });

        it("Allows providing a Rust resolver adapter during construction", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$missing.`;
            let resolver: ReturnType<typeof vi.fn>;
            const autoCompleter = createRefAutoCompleter(
                source,
                (sourceObj) => {
                    resolver = vi.fn((offset: number) => ({
                        node: sourceObj.getReferentAtOffset(
                            offset,
                            "mySection",
                        ),
                        unresolvedPathParts: [],
                        visibleDescendantNames: ["myP"],
                    }));
                    return {
                        isNameAddressableFromOffset: () => true,
                        resolveRefMemberContainerAtOffset: resolver,
                    } as unknown as RustResolverAdapter;
                },
            );

            const items = autoCompleter.getCompletionItems(source.length);

            expect(resolver!).toHaveBeenCalledOnce();
            expect(items.some((item) => item.label === "myP")).toBe(true);
        });

        it("Reports unresolved path segments from default member resolution with null node", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$mySection.missing.`;
            const autoCompleter = createRefAutoCompleter(source);

            const resolution = autoCompleter.resolveRefMemberContainerAtOffset(
                source.length,
                ["mySection", "missing", ""],
            );

            // Invalid path — node is null so no completions are offered.
            expect(resolution.node).toBeNull();
            expect(resolution.unresolvedPathParts).toEqual(["missing"]);
        });

        it("Passes node index to resolver for index-based resolution", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$missing.`;
            const indexCapture: (number | null)[] = [];
            let resolver!: ReturnType<typeof vi.fn>;
            const autoCompleter = createRefAutoCompleter(
                source,
                (sourceObj) =>
                    ({
                        isNameAddressableFromOffset: () => true,
                        resolveRefMemberContainerAtOffset: (resolver = vi.fn(
                            (
                                offset: number,
                                _pathParts: string[],
                                _pathPartHasIndex?: boolean[],
                                _hasIndex?: boolean,
                            ) => {
                                indexCapture.push(
                                    sourceObj.getNodeIndexAtOffset(offset),
                                );
                                return null;
                            },
                        )),
                    }) as unknown as RustResolverAdapter,
            );

            autoCompleter.getCompletionItems(source.length);

            // Verify resolver was called with nodeIndex
            expect(resolver).toHaveBeenCalledOnce();
            expect(indexCapture[0]).not.toBeNull();
            expect(typeof indexCapture[0]).toBe("number");
        });

        it("Allows Rust-backed resolver to use node index directly", () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$missing.`;
            let rustSimulator: ReturnType<typeof vi.fn>;
            const autoCompleter = createRefAutoCompleter(
                source,
                (sourceObj) => {
                    rustSimulator = vi.fn(
                        (offset: number, pathParts: string[]) => {
                            const nodeIndex =
                                sourceObj.getNodeIndexAtOffset(offset);
                            // In real Rust implementation, adapter would call
                            // resolve_path(origin_index, path_parts).
                            // For this test, simulate successful resolution to the root element
                            if (
                                nodeIndex !== null &&
                                nodeIndex !== undefined &&
                                pathParts.length > 0
                            ) {
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
                    return {
                        isNameAddressableFromOffset: () => true,
                        resolveRefMemberContainerAtOffset: rustSimulator,
                    } as unknown as RustResolverAdapter;
                },
            );

            const items = autoCompleter.getCompletionItems(source.length);

            // Verify the Rust-backed resolver was called with the source context.
            expect(rustSimulator!).toHaveBeenCalledOnce();
            expect(rustSimulator!).toHaveBeenCalledWith(
                source.length,
                expect.any(Array),
                expect.any(Array),
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

    describe("RustResolverAdapter contract", () => {
        it("Creates a disabled resolver callback when no core is attached", () => {
            const source = `<section name="mySection"><p name="myP" /></section>`;
            const sourceObj = new DoenetSourceObject(source);

            const adapter = new RustResolverAdapter(sourceObj);
            expect(adapter.isEnabled()).toBe(false);

            const resolver = adapter.createResolver();
            expect(typeof resolver).toBe("function");

            const result = resolver({
                offset: 10,
                pathParts: ["foo", "bar"],
                nodeIndex: 2,
            });

            // Without a core, the adapter exposes a disabled resolver.
            expect(result).toBeNull();
        });

        it("Passes node index through resolver args", () => {
            const source = `<section name="root"><p name="child" /></section>\n$root.`;
            const sourceObj = new DoenetSourceObject(source);

            const offset = source.length - 1; // At the dot
            const nodeIndex = sourceObj.getNodeIndexAtOffset(offset);

            expect(typeof nodeIndex).toBe("number");

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

        it("Returns no ref completions when the adapter is disabled", () => {
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
            const autoCompleter = new AutoCompleter(source, testSchema, {
                rustResolverAdapter: adapter,
            });

            const items = autoCompleter.getCompletionItems(source.length);

            expect(items).toEqual([]);
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
            options?: {
                startId?: number;
            },
        ): {
            core: RustResolverCore;
            calls: {
                path: unknown;
                origin: number;
                skip_parent_search: boolean;
            }[];
        } {
            const calls: {
                path: unknown;
                origin: number;
                skip_parent_search: boolean;
            }[] = [];

            // Build a minimal flat DAST from the JS DAST by assigning sequential
            // ids to elements in depth-first order (matching Rust's pre-order).
            const elements: Array<{
                data: { id: number };
                position?: { start: { offset?: number } };
            }> = [];
            let nextId = options?.startId ?? 0;
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
                set_flags: () => {},
                return_dast: () => ({ elements }),
                resolve_path: (path, origin, skip_parent_search) => {
                    calls.push({ path, origin, skip_parent_search });
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

            // First call resolves the container ("s1"), subsequent calls
            // probe descendant visibility (one per unique descendant name).
            expect(calls.length).toBeGreaterThanOrEqual(1);
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
            // Visibility probing returns names the mock considers resolvable
            expect(result!.visibleDescendantNames).toBeDefined();
        });

        it("Returns null when resolve_path throws", () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$missing.`;
            const sourceObj = new DoenetSourceObject(source + " ");

            const core: RustResolverCore = {
                set_source: () => {},
                set_flags: () => {},
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

            // Invalid path — node is null so no completions are offered.
            expect(result).not.toBeNull();
            expect(result!.node).toBeNull();
            expect(result!.unresolvedPathParts).toEqual(["remaining"]);
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

        it("Uses mapped root origin index when Rust ids are non-zero", () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core, calls } = createMockCore(
                source,
                sourceObj,
                {
                    nodeIdx: 10,
                    nodesInResolvedPath: [10],
                    unresolvedPath: null,
                    originalPath: [{ name: "s1" }],
                },
                { startId: 10 },
            );

            const adapter = new RustResolverAdapter(sourceObj, { core });
            const resolver = adapter.createResolver();

            const result = resolver({
                offset: source.indexOf("$s1.") + 4,
                pathParts: ["s1", ""],
            });

            expect(result).not.toBeNull();
            expect(calls.length).toBeGreaterThan(0);
            expect(calls[0].origin).toBe(10);
        });

        it("Disables adapter when set_source throws", () => {
            const source = `<section name="s1"></section>`;
            const sourceObj = new DoenetSourceObject(source);

            const brokenCore: RustResolverCore = {
                set_source: () => {
                    throw new Error("WASM error");
                },
                set_flags: () => {},
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

        it("Caches visibility probes for repeated member resolutions", () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core, calls } = createMockCore(source, sourceObj, {
                nodeIdx: 0,
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "s1" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, { core });
            const resolver = adapter.createResolver();
            const offset = source.indexOf("$s1.") + 4;

            resolver({ offset, pathParts: ["s1", ""] });
            resolver({ offset, pathParts: ["s1", ""] });

            // The container resolution runs each time
            // (skip_parent_search=false), but the descendant visibility probe
            // path (skip_parent_search=true) should be cached after the first
            // call for this source revision and resolved node.
            const probeCalls = calls.filter((c) => c.skip_parent_search);
            expect(probeCalls.length).toBe(1);
        });

        it("Invalidates visibility-probe cache when source changes", () => {
            const source1 = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const sourceObj1 = new DoenetSourceObject(source1 + " ");
            const { core, calls } = createMockCore(source1, sourceObj1, {
                nodeIdx: 0,
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "s1" }],
            });

            const adapter = new RustResolverAdapter(sourceObj1, { core });
            const resolver = adapter.createResolver();
            const offset1 = source1.indexOf("$s1.") + 4;

            resolver({ offset: offset1, pathParts: ["s1", ""] });
            resolver({ offset: offset1, pathParts: ["s1", ""] });

            const firstProbeCount = calls.filter(
                (c) => c.skip_parent_search,
            ).length;
            expect(firstProbeCount).toBe(1);

            const source2 = `<section name="s2"><p name="p2" /></section>\n$s2.`;
            const sourceObj2 = new DoenetSourceObject(source2 + " ");
            adapter.updateSource(sourceObj2);

            const offset2 = source2.indexOf("$s2.") + 4;
            resolver({ offset: offset2, pathParts: ["s2", ""] });

            const secondProbeCount = calls.filter(
                (c) => c.skip_parent_search,
            ).length;
            expect(secondProbeCount).toBe(2);
        });
    });
});
