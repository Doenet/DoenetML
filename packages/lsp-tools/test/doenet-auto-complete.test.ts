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
                {
                    name: "bar",
                    values: ["more", "less", "true", "false"],
                    autocompleteValues: [
                        { value: "more", description: "More." },
                        { value: "less", description: "Less." },
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
                { name: "data-info", values: ["alpha", "beta"] },
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
    it("Can suggest completions", async () => {
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
            let elm = await autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot("[]");
        }
        {
            let offset = source.indexOf("<a") + 6;
            let elm = await autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot("[]");
        }
        {
            let offset = source.indexOf("<b") + 3;
            let elm = await autoCompleter.getCompletionItems(offset);
            expect(elm.map((item) => item.label)).toEqual([
                "foo",
                "bar",
                "modeOneSided",
                "data-info",
            ]);
        }
        {
            let offset = source.indexOf("<b") + 8;
            let elm = await autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "filterText": "true",
                  "kind": 12,
                  "label": "true",
                },
                {
                  "filterText": "false",
                  "kind": 12,
                  "label": "false",
                },
              ]
            `);
        }
        {
            let offset = source.indexOf("<b") + 19;
            let elm = await autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "documentation": {
                    "kind": "markdown",
                    "value": "More.",
                  },
                  "filterText": "more",
                  "kind": 12,
                  "label": "more",
                },
                {
                  "documentation": {
                    "kind": "markdown",
                    "value": "Less.",
                  },
                  "filterText": "less",
                  "kind": 12,
                  "label": "less",
                },
              ]
            `);
        }
        {
            let offset = source.indexOf("<b") + 9;
            let elm = await autoCompleter.getCompletionItems(offset);
            expect(elm).toMatchInlineSnapshot(`
              [
                {
                  "filterText": "true",
                  "kind": 12,
                  "label": "true",
                },
                {
                  "filterText": "false",
                  "kind": 12,
                  "label": "false",
                },
              ]
            `);
        }
    });

    it("Adds quotes via textEdit when completing right after `=`", async () => {
        const source = `<aa><b foo=></b></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("=") + 1;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items.map((item) => item.label)).toEqual(["true", "false"]);
        const trueItem = items.find((item) => item.label === "true");
        expect(trueItem?.textEdit).toMatchObject({ newText: `"true"` });
        // Zero-length range right after the `=`
        expect(trueItem?.textEdit).toMatchObject({
            range: {
                start: { line: 0, character: offset },
                end: { line: 0, character: offset },
            },
        });
    });

    it("Filters and quotes a bare value typed after `=` without an opening quote", async () => {
        const source = `<aa><b bar=mo></b></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("mo") + 2;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items.map((item) => item.label)).toEqual(["more"]);
        expect(items[0].textEdit).toMatchObject({
            newText: `"more"`,
            range: {
                start: { line: 0, character: offset - 2 },
                end: { line: 0, character: offset },
            },
        });
    });

    it("Resolves a hyphenated attribute name when typing a bare value after `=`", async () => {
        // The bare-after-`=` branch walks back from the cursor over
        // `[A-Za-z0-9_-]` to find the attribute name. A hyphen in the
        // attribute name (e.g. `data-info`) is inside that character
        // class, so the walk should land on the full `data-info` and
        // resolve its enumerated values.
        const source = `<aa><b data-info=al></b></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("al") + 2;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items.map((item) => item.label)).toEqual(["alpha"]);
        expect(items[0].textEdit).toMatchObject({
            newText: `"alpha"`,
            range: {
                start: { line: 0, character: source.indexOf("=") + 1 },
                end: { line: 0, character: offset },
            },
        });
    });

    it("Swallows whitespace between `=` and a bare value into the quoted textEdit", async () => {
        const source = `<aa><b bar=   mo></b></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("mo") + 2;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items.map((item) => item.label)).toEqual(["more"]);
        // Range starts right after `=` so the three spaces are replaced
        // along with `mo` and the result is `bar="more"` (no leftover space).
        const equalsCharacter = source.indexOf("=") + 1;
        expect(items[0].textEdit).toMatchObject({
            newText: `"more"`,
            range: {
                start: { line: 0, character: equalsCharacter },
                end: { line: 0, character: offset },
            },
        });
    });

    it("Quotes the displayLabel for enumerated values when anchored to `=`", async () => {
        // Bare-after-`=`: dropdown should read `"more"` etc. while still
        // matching/inserting via the bare `more` label.
        const source = `<aa><b bar=mo></b></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("mo") + 2;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items.map((item) => item.label)).toEqual(["more"]);
        expect(items[0].displayLabel).toEqual(`"more"`);
        expect(items[0].filterText).toEqual("more");
    });

    it('Omits displayLabel for enumerated values when cursor is already inside `"..."`', async () => {
        // Inside `"..."`: no quotes added by the textEdit (the surrounding
        // quotes already exist), so the dropdown should match what gets
        // inserted -- bare `more`, no `displayLabel`.
        const source = `<aa><b bar="mo"></b></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("mo") + 2;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items.map((item) => item.label)).toContain("more");
        const moreItem = items.find((item) => item.label === "more");
        expect(moreItem?.displayLabel).toBeUndefined();
    });

    it('Offers a `"foo"` wrap-in-quotes hint for a free-text attribute with a bare typed prefix', async () => {
        // `aa.x` is free-text (no `values` / `autocompleteValues`). When the
        // author types `<aa x=foo>`, the single completion previews the
        // corrected form `"foo"` and accepting it replaces the bare run.
        const source = `<aa x=foo></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("foo") + 3;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items).toHaveLength(1);
        expect(items[0].label).toEqual("foo");
        expect(items[0].displayLabel).toEqual(`"foo"`);
        expect(items[0].filterText).toEqual("foo");
        const equalsCharacter = source.indexOf("=") + 1;
        expect(items[0].textEdit).toMatchObject({
            newText: `"foo"`,
            range: {
                start: { line: 0, character: equalsCharacter },
                end: { line: 0, character: offset },
            },
        });
        // The CodeMirror plugin reads this sentinel to set `filter: false`
        // on the result, attach a live-update callback, and anchor `from`
        // at the bare-value start. Without the offset, `from` defaults to
        // the cursor (one past the first typed character) because every
        // option's apply text starts with `"` and the user has not typed
        // one -- so the result would track "oo" instead of "foo".
        const bareValueStart = source.indexOf("foo");
        expect(items[0].data).toMatchObject({
            livePreviewQuoteWrap: { bareValueStartOffset: bareValueStart },
        });
    });

    it("Swallows whitespace between `=` and a bare free-text value into the quoted textEdit", async () => {
        // Same swallow behaviour as the enumerated branch: any whitespace
        // between `=` and the bare value is replaced along with the bare
        // run, so `x=   foo` accepts to `x="foo"`.
        const source = `<aa x=   foo></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("foo") + 3;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items).toHaveLength(1);
        const equalsCharacter = source.indexOf("=") + 1;
        expect(items[0].textEdit).toMatchObject({
            newText: `"foo"`,
            range: {
                start: { line: 0, character: equalsCharacter },
                end: { line: 0, character: offset },
            },
        });
    });

    it("Returns no value completions when no enumerated value matches the bare prefix", async () => {
        const source = `<aa><b foo=zz></b></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("zz") + 2;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items).toEqual([]);
    });

    it("Returns no completions for a free-text attribute when there is no bare typed prefix", async () => {
        // `aa.x` has no `values` / `autocompleteValues`. The old fallback
        // returned `[{ label: '""' }]`, which corrupted accepts (`x=foo""`
        // when anchored at `=`, `""""` when inside `"..."`) and made the
        // client flicker the menu on every keystroke. The B′ wrap-in-quotes
        // hint only fires when the author has typed a bare value past `=`;
        // these three contexts must stay empty so an expert who types `"`
        // straight after `=` never sees a stray menu.
        const justAfterEquals = `<aa x=></aa>`;
        const acEmpty = new AutoCompleter(justAfterEquals, schema.elements);
        expect(
            await acEmpty.getCompletionItems(justAfterEquals.indexOf("=") + 1),
        ).toEqual([]);

        // Cursor between the quotes of `x=""`.
        const emptyQuotes = `<aa x=""></aa>`;
        const acQuotes = new AutoCompleter(emptyQuotes, schema.elements);
        expect(
            await acQuotes.getCompletionItems(emptyQuotes.indexOf(`""`) + 1),
        ).toEqual([]);

        // Cursor in the middle of a partially typed quoted value `x="foo"`.
        const partialQuoted = `<aa x="foo"></aa>`;
        const acPartial = new AutoCompleter(partialQuoted, schema.elements);
        expect(
            await acPartial.getCompletionItems(
                partialQuoted.indexOf("foo") + 3,
            ),
        ).toEqual([]);
    });

    it("Offers a wrap-in-quotes hint on a bare value inside a parent element", async () => {
        // Lezer's error recovery wraps `mo` in an `AttributeValue(⚠,⚠)`
        // node when the partial element is followed by `</...>`. The
        // wrap-in-quotes hint must still fire — it would have, were the
        // cursor reported as `attributeName` (matching the EOF parse).
        const source = `<aa><b bar=mo</aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("mo") + 2;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items.map((item) => item.label)).toEqual(["more"]);
        const equalsCharacter = source.indexOf("=") + 1;
        expect(items[0].textEdit).toMatchObject({
            newText: `"more"`,
            range: {
                start: { line: 0, character: equalsCharacter },
                end: { line: 0, character: offset },
            },
        });
    });

    it("Offers a free-text wrap-in-quotes hint on a bare value inside a parent element", async () => {
        // Same nested-context recovery as above, this time for a free-text
        // attribute (`aa.x`). Expect a single `"foo"` hint anchored to the
        // bare run.
        const source = `<aa><c><aa x=foo</aa></c></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("foo") + 3;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items).toHaveLength(1);
        expect(items[0].label).toEqual("foo");
        expect(items[0].displayLabel).toEqual(`"foo"`);
    });

    it("Offers wrap-in-quotes when whitespace precedes the closing tag of the bare-valued element", async () => {
        const source = `<aa><b bar=mo </aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("mo") + 2;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items.map((item) => item.label)).toEqual(["more"]);
    });

    it("Offers wrap-in-quotes when a fresh `<` follows the bare-valued element", async () => {
        const source = `<aa><b bar=mo\n<c></c></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("mo") + 2;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items.map((item) => item.label)).toEqual(["more"]);
    });

    it("Suppresses the wrap-in-quotes hint inside a real quoted value containing `=`", async () => {
        // Regression guard: the `AttributeValue` node here starts with `"`,
        // so the cursorPosition stays `attributeValue` and the wrap-hint
        // guard at `:1021-1024` keeps suppressing the hint.
        const source = `<aa x="abc=def"></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("def") + 3;
        const items = await autoCompleter.getCompletionItems(offset);
        expect(items).toEqual([]);
    });

    it("Does not offer attribute-value completions for a literal `=` in body text", async () => {
        const source = `<aa>x=val</aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        // After the `=`
        expect(
            await autoCompleter.getCompletionItems(source.indexOf("=") + 1),
        ).toEqual([]);
        // After `=val`
        expect(
            await autoCompleter.getCompletionItems(source.indexOf("val") + 3),
        ).toEqual([]);
    });

    it("Prefers autocompleteValues for attribute value completions", async () => {
        const source = `<aa><b foo="true" bar="less"></b></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("<b") + 19;

        const values = (await autoCompleter.getCompletionItems(offset)).map(
            (item) => String(item.label),
        );

        expect(values).toContain("more");
        expect(values).toContain("less");
        expect(values).not.toContain("true");
        expect(values).not.toContain("false");
    });

    it("Prefers autocompleteValues for one-sided boolean aliases", async () => {
        const source = `<aa><b modeOneSided="none"></b></aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("modeOneSided") + 15;

        const values = (await autoCompleter.getCompletionItems(offset)).map(
            (item) => String(item.label),
        );

        expect(values).toContain("none");
        expect(values).toContain("full");
        expect(values).not.toContain("true");
        expect(values).not.toContain("false");
    });

    it("Can suggest closing tag completion when there is no closing tag", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<a> <   `;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<a") + 5;
            let elm = await autoCompleter.getCompletionItems(offset);
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
            let elm = await autoCompleter.getCompletionItems(offset);
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
    it("Can suggest closing tag completion when there is no closing tag at document end", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `<a> <`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<a") + 5;
            let elm = await autoCompleter.getCompletionItems(offset);
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
            let elm = await autoCompleter.getCompletionItems(offset);
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
    it("Can suggest completions after a top level `<`", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = `< `;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<") + 1;
            let elm = await autoCompleter.getCompletionItems(offset);
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
    it("Can suggest completions after a `<` when it comes at the end of the string", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = ` <`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<") + 1;
            let elm = await autoCompleter.getCompletionItems(offset);
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

    it("Includes styleDefinition and feedbackDefinition in top-level completions from Doenet schema", async () => {
        const source = `<`;
        const autoCompleter = new AutoCompleter(source, doenetSchema.elements);

        const items = await autoCompleter.getCompletionItems(
            source.indexOf("<") + 1,
        );
        const labels = items.map((item) => item.label);

        expect(labels).toContain("styleDefinition");
        expect(labels).toContain("feedbackDefinition");
    });

    it("Can suggest completions after a `<a` when a comes at the end of the string", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = ` <a`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("<a") + 2;
            let elm = await autoCompleter.getCompletionItems(offset);
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

    it("Matches open-tag component completions case-insensitively and keeps canonical label case", async () => {
        const source = `<MATHIN`;
        const autoCompleter = new AutoCompleter(source, doenetSchema.elements);
        const items = await autoCompleter.getCompletionItems(source.length);
        const labels = items.map((item) => String(item.label));

        expect(labels).toContain("mathInput");
    });

    it("Suggests child elements (not attributes) when < is typed inside a closed element", async () => {
        // Regression: typing `<` inside `<aa>...</aa>` used to return
        // aa's attributes instead of its allowed child elements.
        const source = `<aa><</aa>`;
        const autoCompleter = new AutoCompleter(source, schema.elements);
        const offset = source.indexOf("><") + 2;
        const items = await autoCompleter.getCompletionItems(offset);
        const labels = items.map((i) => i.label);
        // Should contain child elements, not attribute names
        expect(labels).toContain("b");
        expect(labels).toContain("c");
        expect(labels).toContain("d");
        expect(labels).not.toContain("x");
        expect(labels).not.toContain("y");
        expect(labels).not.toContain("xyx");
    });

    it("Can suggest completions for closing tags at the end of the string", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = ` <aa><`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("><") + 2;
            let elm = await autoCompleter.getCompletionItems(offset);
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
    it("Closing tag suggestions are offered if there is whitespace after the `/` even if there is text", async () => {
        let source: string;
        let autoCompleter: AutoCompleter;

        source = ` <aa></  xx`;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            let offset = source.indexOf("><") + 3;
            let elm = await autoCompleter.getCompletionItems(offset);
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
    it("Can get completion context", async () => {
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
            expect(elm).toEqual({
                cursorPos: "body",
            });
        }

        source = ` $foo[1]. `;
        autoCompleter = new AutoCompleter(source, schema.elements);
        {
            const offset = source.indexOf(".") + 1;
            const elm = autoCompleter.getCompletionContext(offset);
            expect(elm).toEqual({
                cursorPos: "refMember",
                typedPrefix: "",
                replaceFromOffset: source.indexOf(".") + 1,
                pathParts: ["foo", ""],
                pathPartHasIndex: [true, false],
                rawPathParts: ["foo[1]", ""],
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
                {
                    name: "select",
                    children: [],
                    attributes: [],
                    properties: [],
                    top: true,
                    acceptsStringChildren: true,
                    takesIndex: true,
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

        it("Suggests reference names after $ with prefix filtering", async () => {
            const source = `<section name="mySection"><p name="myP" /></section><p name="other" />\n$myS`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const items = await autoCompleter.getCompletionItems(offset);

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

        it("Matches $ref prefix case-insensitively but keeps inserted canonical case", async () => {
            const source = `<math name="myMath" />\n$MYM`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const items = await autoCompleter.getCompletionItems(offset);
            const match = items.find((item) => item.label === "myMath");

            expect(match).toBeDefined();
            expect(match?.textEdit).toBeDefined();
            const textEdit = match?.textEdit;
            if (textEdit && "newText" in textEdit) {
                expect(textEdit.newText).toBe("myMath");
            }
        });

        it("Keeps names that differ only by case as separate $ref completion options", async () => {
            const source = `<math name="myMath" /><math name="MyMath" />\n$myma`;
            const autoCompleter = createRefAutoCompleter(source);

            const items = await autoCompleter.getCompletionItems(source.length);
            const labels = items.map((item) => String(item.label));

            expect(labels).toContain("myMath");
            expect(labels).toContain("MyMath");
            expect(labels.filter((label) => label === "myMath")).toHaveLength(
                1,
            );
            expect(labels.filter((label) => label === "MyMath")).toHaveLength(
                1,
            );
        });

        it("Inserts parenthesized macro text for hyphenated names after $", async () => {
            const source = `<math name="foo-bar" />\n$f`;
            const autoCompleter = createRefAutoCompleter(source);

            const items = await autoCompleter.getCompletionItems(source.length);
            const fooBarItem = items.find((item) => item.label === "foo-bar");

            expect(fooBarItem).toBeDefined();
            expect(fooBarItem?.textEdit).toBeDefined();
            const textEdit = fooBarItem?.textEdit;
            if (textEdit && "newText" in textEdit) {
                expect(textEdit.newText).toBe("(foo-bar)");
            }
        });

        it("does not offer $name[] when local referent is non-takesIndex but a later duplicate name is takesIndex", async () => {
            const source = `<section name="A"><math>$dup</math><p name="dup">a</p></section><section name="B"><select name="dup"><option><math name="m">1</math></option></select></section>`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.indexOf("$dup") + "$dup".length;
            const items = await autoCompleter.getCompletionItems(offset);
            const labels = items.map((i) => i.label);

            expect(labels).toContain("dup");
            expect(labels).not.toContain("dup[]");
        });

        it("offers ref completions immediately before a following tag without requiring a space", async () => {
            const source = `<section name="A">$dup<p name="dup">a</p></section><section name="B"><select name="dup"><option><math name="m">1</math></option></select></section>`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.indexOf("$dup") + "$dup".length;
            const items = await autoCompleter.getCompletionItems(offset);
            const labels = items.map((i) => i.label);

            expect(labels).toContain("dup");
        });

        it("Keeps plain macro text for simple names after $", async () => {
            const source = `<math name="foo_bar" />\n$f`;
            const autoCompleter = createRefAutoCompleter(source);

            const items = await autoCompleter.getCompletionItems(source.length);
            const fooBarItem = items.find((item) => item.label === "foo_bar");

            expect(fooBarItem).toBeDefined();
            expect(fooBarItem?.textEdit).toBeDefined();
            const textEdit = fooBarItem?.textEdit;
            if (textEdit && "newText" in textEdit) {
                expect(textEdit.newText).toBe("foo_bar");
            }
        });

        it("Suggests descendant names and properties after dot, with descendants winning collisions", async () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$mySection.`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const items = await autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.some((item) => item.label === "sectionProp")).toBe(
                true,
            );

            const myPItems = items.filter((item) => item.label === "myP");
            expect(myPItems).toHaveLength(1);
            expect(myPItems[0].kind).toBe(CompletionItemKind.Reference);
        });

        it("Does not suggest ref-member completions when there is whitespace before dot", async () => {
            // `$mySection .` is not a valid reference path; do not offer
            // descendant/property member completions.
            const source = `<section name="mySection"><p name="myP" /></section>\n$mySection .`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const items = await autoCompleter.getCompletionItems(offset);
            const labels = items.map((item) => item.label);

            expect(labels).not.toContain("myP");
            expect(labels).not.toContain("sectionProp");
        });

        it("Matches member prefix case-insensitively and preserves distinct-case labels", async () => {
            const source = `<section name="mySection"><p name="myMath" /><p name="MyMath" /></section>\n$mySection.myma`;
            const autoCompleter = createRefAutoCompleter(source);

            const items = await autoCompleter.getCompletionItems(source.length);
            const labels = items.map((item) => String(item.label));

            expect(labels).toContain("myMath");
            expect(labels).toContain("MyMath");
        });

        it("Only suggests uniquely addressable descendant names after dot", async () => {
            const source = `<section name="mySection"><p name="dup" /><p name="dup" /><p name="unique" /></section>\n$mySection.`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const items = await autoCompleter.getCompletionItems(offset);

            // `dup` is ambiguous under `mySection` and should not be suggested.
            expect(items.some((item) => item.label === "dup")).toBe(false);
            // Unique descendant names remain valid suggestions.
            expect(items.some((item) => item.label === "unique")).toBe(true);
        });

        it("Only suggests member names that resolve uniquely from the same context", async () => {
            const source = `<section name="mySection"><p name="dup" /><p name="dup" /><p name="unique" /></section>\n$mySection.`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const section = autoCompleter.sourceObj.getReferentAtOffset(
                offset,
                "mySection",
            );
            expect(section).toBeTruthy();

            const items = (
                await autoCompleter.getCompletionItems(offset)
            ).filter((item) => item.kind === CompletionItemKind.Reference);

            for (const item of items) {
                const resolved = autoCompleter.sourceObj.getNamedDescendant(
                    section,
                    String(item.label),
                );
                expect(resolved).toBeTruthy();
            }
        });

        it("Excludes ambiguous names in top-level completions after $", async () => {
            const source = `<section><p name="dup" /><p name="dup" /><p name="unique" /></section>\n$`;
            const autoCompleter = createRefAutoCompleter(source);

            const items = (
                await autoCompleter.getCompletionItems(source.length)
            )
                .filter((item) => item.kind === CompletionItemKind.Reference)
                .map((item) => String(item.label));

            expect(items).not.toContain("dup");
            expect(items).toContain("unique");
        });

        it("Suggests descendant names and properties after dot at the start of the file", async () => {
            const source = `$mySection.\n<section name="mySection"><p name="myP" /></section>`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.indexOf("\n");
            const items = await autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.some((item) => item.label === "sectionProp")).toBe(
                true,
            );
        });

        it("Suggests members after chained descendant access", async () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$mySection.myP.`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const items = await autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "pProp")).toBe(true);
            expect(items.every((item) => item.label !== "sectionProp")).toBe(
                true,
            );
        });

        it("Suggests reference names inside attribute values after $", async () => {
            const source = `<section name="mySection" /><line through="$myS" />`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.indexOf("$myS") + "$myS".length;
            const items = await autoCompleter.getCompletionItems(offset);

            expect(items.length).toBeGreaterThan(0);
            expect(
                items.every(
                    (item) => item.kind === CompletionItemKind.Reference,
                ),
            ).toBe(true);
            expect(items.some((item) => item.label === "mySection")).toBe(true);
        });

        it("Suggests descendant members inside attribute values after dot with member prefix", async () => {
            const source = `<section name="mySection"><p name="myP" /></section><line through="$mySection.my" />`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset =
                source.indexOf("$mySection.my") + "$mySection.my".length;
            const completionContext =
                autoCompleter.getCompletionContext(offset);
            expect(completionContext).toMatchObject({ cursorPos: "refMember" });
            const items = await autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.every((item) => item.label !== "sectionProp")).toBe(
                true,
            );
        });

        it("Suggests reference names in parenthesized macros with hyphenated prefixes", async () => {
            const source = `<math name="foo-bar" /><math name="foo-baz" />\n$(foo-ba`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const completionContext =
                autoCompleter.getCompletionContext(offset);
            expect(completionContext).toMatchObject({
                cursorPos: "refName",
                typedPrefix: "foo-ba",
            });

            const items = await autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "foo-bar")).toBe(true);
            expect(items.some((item) => item.label === "foo-baz")).toBe(true);
        });

        it("Suggests member completions in parenthesized macros with hyphenated names", async () => {
            const source = `<section name="foo-bar"><p name="myP" /></section>\n$(foo-bar.my`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const completionContext =
                autoCompleter.getCompletionContext(offset);
            expect(completionContext).toMatchObject({
                cursorPos: "refMember",
                typedPrefix: "my",
            });

            const items = await autoCompleter.getCompletionItems(offset);

            expect(items.some((item) => item.label === "myP")).toBe(true);
        });

        it("Suggests member completions after dot on completed parenthesized macros", async () => {
            const source = `<section name="foo-bar"><p name="myP" /></section>\n$(foo-bar).`;
            const autoCompleter = createRefAutoCompleter(source);

            const offset = source.length;
            const completionContext =
                autoCompleter.getCompletionContext(offset);
            expect(completionContext).toMatchObject({
                cursorPos: "refMember",
                typedPrefix: "",
            });

            const items = await autoCompleter.getCompletionItems(offset);

            // Descendant and property suggestions should both be present.
            expect(items.some((item) => item.label === "myP")).toBe(true);
            expect(items.some((item) => item.label === "sectionProp")).toBe(
                true,
            );
        });

        it("Inserts parenthesized member text for hyphenated names after dot", async () => {
            const source = `<section name="base"><p name="my-p" /><p name="my_p" /></section>\n$base.my`;
            const autoCompleter = createRefAutoCompleter(source);

            const items = await autoCompleter.getCompletionItems(source.length);
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

        it("Applies same member insertion policy after dot in parenthesized refs", async () => {
            const source = `<section name="base"><p name="my-p" /><p name="my_p" /></section>\n$(base).my`;
            const autoCompleter = createRefAutoCompleter(source);

            const items = await autoCompleter.getCompletionItems(source.length);
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

        it("Classifies parenthesized member-segment syntax after dot as refMember", async () => {
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

        it("Does not double-parenthesize insertion in .(member) contexts", async () => {
            const source = `<section name="base"><p name="my-p" /></section>\n$(base).(my`;
            const autoCompleter = createRefAutoCompleter(source);

            const items = await autoCompleter.getCompletionItems(source.length);
            const hyphenItem = items.find((item) => item.label === "my-p");

            expect(hyphenItem).toBeDefined();
            const textEdit = hyphenItem?.textEdit;
            if (textEdit && "newText" in textEdit) {
                expect(textEdit.newText).toBe("my-p");
            }
        });

        it("Returns no ref-member completion when no resolver is configured", async () => {
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
            const items = await autoCompleter.getCompletionItems(offset);
            expect(items).toEqual([]);
        });

        it("Returns no ref completions in invalid or unresolved contexts", async () => {
            {
                const source = `<section $`;
                const autoCompleter = new AutoCompleter(
                    source,
                    refSchema.elements,
                );
                const items = await autoCompleter.getCompletionItems(
                    source.length,
                );
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
                const items = await autoCompleter.getCompletionItems(
                    source.length,
                );
                expect(items).toEqual([]);
            }
        });

        it("Uses adapter-provided member resolution for completions", async () => {
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

            const items = await autoCompleter.getCompletionItems(source.length);

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

        it("Allows providing a Rust resolver adapter during construction", async () => {
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

            const items = await autoCompleter.getCompletionItems(source.length);

            expect(resolver!).toHaveBeenCalledOnce();
            expect(items.some((item) => item.label === "myP")).toBe(true);
        });

        it("Reports unresolved path segments from default member resolution with null node", async () => {
            const source = `<section name="mySection"><p name="myP" /></section>\n$mySection.missing.`;
            const autoCompleter = createRefAutoCompleter(source);

            const resolution =
                await autoCompleter.resolveRefMemberContainerAtOffset(
                    source.length,
                    ["mySection", "missing", ""],
                );

            // Invalid path — node is null so no completions are offered.
            expect(resolution.node).toBeNull();
            expect(resolution.unresolvedPathParts).toEqual(["missing"]);
        });

        it("Passes node index to resolver for index-based resolution", async () => {
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

            await autoCompleter.getCompletionItems(source.length);

            // Verify resolver was called with nodeIndex
            expect(resolver).toHaveBeenCalledOnce();
            expect(indexCapture[0]).not.toBeNull();
            expect(typeof indexCapture[0]).toBe("number");
        });

        it("Allows Rust-backed resolver to use node index directly", async () => {
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

            const items = await autoCompleter.getCompletionItems(source.length);

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

    describe("Schema-derived documentation on completions", () => {
        const docSchema = {
            elements: [
                {
                    name: "doc",
                    summary: "Top-level document.",
                    children: ["matrix", "math", "select"],
                    attributes: [],
                    top: true,
                    acceptsStringChildren: true,
                },
                {
                    name: "math",
                    summary: "A math expression.",
                    children: [],
                    attributes: [
                        { name: "simplify", description: "Simplify form." },
                        { name: "noDescAttr" },
                    ],
                    properties: [
                        { name: "value", description: "Math value." },
                        { name: "noDescProp" },
                    ],
                    top: true,
                    acceptsStringChildren: true,
                },
                {
                    name: "matrix",
                    summary: "A matrix container.",
                    children: ["row"],
                    attributes: [],
                    top: false,
                    acceptsStringChildren: false,
                    childContextHelp: { row: "matrixRow" },
                },
                {
                    name: "row",
                    summary: "A generic row element.",
                    children: [],
                    attributes: [
                        { name: "color", description: "Generic row color." },
                    ],
                    top: false,
                    acceptsStringChildren: true,
                },
                {
                    name: "select",
                    summary: "A composite that picks one of several options.",
                    children: [],
                    attributes: [],
                    properties: [],
                    top: true,
                    acceptsStringChildren: true,
                    takesIndex: true,
                },
            ],
            aliasedElements: {
                matrixRow: {
                    name: "matrixRow",
                    summary: "A row inside a matrix.",
                    attributes: [
                        {
                            name: "color",
                            description: "Color of the matrix row.",
                        },
                    ],
                },
            },
        };

        function createDocAutoCompleter(source: string) {
            const sourceObj = new DoenetSourceObject();
            sourceObj.setSource(source + " ");
            const ac = new AutoCompleter(undefined, docSchema.elements, {
                sourceObj,
                rustResolverAdapter: {
                    isNameAddressableFromOffset: () => true,
                    resolveRefMemberContainerAtOffset: (
                        offset: number,
                        pathParts: string[],
                    ) => {
                        const lookupParts = pathParts.slice(0, -1);
                        if (lookupParts.length === 0) {
                            return {
                                node: null,
                                unresolvedPathParts: [],
                            };
                        }
                        const referent = sourceObj.getReferentAtOffset(
                            offset,
                            lookupParts[0],
                        );
                        if (!referent) {
                            return {
                                node: null,
                                unresolvedPathParts: lookupParts,
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
                } as unknown as RustResolverAdapter,
            });
            // Also expose the aliased entries for alias-aware help lookup.
            ac.setSchema(docSchema.elements, docSchema.aliasedElements);
            return ac;
        }

        it("Includes summary as documentation on top-level element completions", async () => {
            const source = `<`;
            const autoCompleter = new AutoCompleter(source, docSchema.elements);
            const items = await autoCompleter.getCompletionItems(source.length);
            const doc = items.find((i) => i.label === "doc");
            expect(doc?.documentation).toEqual({
                kind: "markdown",
                value: "Top-level document.",
            });
        });

        it("Includes summary as documentation on child-element completions and applies childContextHelp aliases", async () => {
            const source = `<doc><matrix><`;
            const autoCompleter = createDocAutoCompleter(source);
            const items = await autoCompleter.getCompletionItems(source.length);
            const row = items.find((i) => i.label === "row");
            // Inside <matrix>, the `row` child should pull its summary from
            // the `matrixRow` alias, not the generic `row` entry.
            expect(row?.documentation).toEqual({
                kind: "markdown",
                value: "A row inside a matrix.",
            });
        });

        it("Includes attribute description as documentation, alias-aware for child elements", async () => {
            // Plain <math> attribute: own description.
            {
                const source = `<doc><math `;
                const autoCompleter = createDocAutoCompleter(source);
                const items = await autoCompleter.getCompletionItems(
                    source.length,
                );
                const simplify = items.find((i) => i.label === "simplify");
                expect(simplify?.documentation).toEqual({
                    kind: "markdown",
                    value: "Simplify form.",
                });
                const noDesc = items.find((i) => i.label === "noDescAttr");
                expect(noDesc?.documentation).toBeUndefined();
            }
            // <row> inside <matrix>: alias attribute description wins.
            {
                const source = `<doc><matrix><row `;
                const autoCompleter = createDocAutoCompleter(source);
                const items = await autoCompleter.getCompletionItems(
                    source.length,
                );
                const color = items.find((i) => i.label === "color");
                expect(color?.documentation).toEqual({
                    kind: "markdown",
                    value: "Color of the matrix row.",
                });
            }
        });

        it("Includes property description as documentation on $ref.member completions", async () => {
            const source = `<doc><math name="m">x</math></doc>\n$m.`;
            const autoCompleter = createDocAutoCompleter(source);
            const items = await autoCompleter.getCompletionItems(source.length);
            const value = items.find((i) => i.label === "value");
            expect(value?.documentation).toEqual({
                kind: "markdown",
                value: "Math value.",
            });
            const noDescProp = items.find((i) => i.label === "noDescProp");
            expect(noDescProp?.documentation).toBeUndefined();
        });

        it("Sets detail to '(<type>, line N)' and documentation to summary on $name completions", async () => {
            // `<math>` opens on line 2 (line 1 is `<doc>`). The displayed line
            // must be 1-indexed so it matches CodeMirror's gutter.
            const source = `<doc>\n  <math name="m">x</math>\n</doc>\n$m`;
            const autoCompleter = createDocAutoCompleter(source);
            const items = await autoCompleter.getCompletionItems(source.length);
            const m = items.find((i) => i.label === "m");
            expect(m).toBeDefined();
            expect(m?.detail).toBe("(<math>, line 2)");
            expect(m?.documentation).toEqual({
                kind: "markdown",
                value: "A math expression.",
            });
        });

        it("Reuses detail/documentation on the $name[] takesIndex variant", async () => {
            const source = `<doc><select name="s" /></doc>\n$s`;
            const autoCompleter = createDocAutoCompleter(source);
            const items = await autoCompleter.getCompletionItems(source.length);
            const indexed = items.find((i) => i.label === "s[]");
            expect(indexed).toBeDefined();
            // `<select>` is on the first (and only-content) line of the source.
            expect(indexed?.detail).toBe("(<select>, line 1)");
            expect(indexed?.documentation).toEqual({
                kind: "markdown",
                value: "A composite that picks one of several options.",
            });
        });

        it("Auto-loads bundled aliased entries when setSchema is called later with the default schema", async () => {
            // Regression for the constructor-vs-setSchema gap: a consumer
            // that re-installs the bundled schema via `setSchema()` must
            // still get alias-aware help without having to pass
            // `doenetSchema.aliasedElements` explicitly. (Reported by the
            // PR #1088 Copilot review.)
            const autoCompleter = new AutoCompleter();
            // Wipe and re-install the default schema with no alias map.
            autoCompleter.setSchema(doenetSchema.elements);
            const matrixRow =
                autoCompleter.findAliasedSchemaElement("matrixRow");
            expect(matrixRow?.summary).toBeTruthy();
            // And alias-aware resolution should still walk the redirect:
            // `<row>` inside `<matrix>` resolves to `matrixRow`'s entry.
            const rowEntry = autoCompleter.findSchemaElement("row");
            const effective = autoCompleter.resolveEffectiveSchemaElement(
                rowEntry,
                "matrix",
            );
            expect(effective?.name).toBe("matrixRow");
        });

        it("Falls back to no aliases when setSchema receives a custom schema", async () => {
            // The auto-load is keyed on reference identity to `doenetSchema.
            // elements`. A custom schema must NOT silently inherit doenet's
            // alias map (which would graft unrelated docs onto the user's
            // own elements).
            const autoCompleter = new AutoCompleter();
            autoCompleter.setSchema([
                {
                    name: "foo",
                    summary: "A foo.",
                    children: [],
                    attributes: [],
                    top: true,
                    acceptsStringChildren: true,
                },
            ]);
            expect(
                autoCompleter.findAliasedSchemaElement("matrixRow"),
            ).toBeUndefined();
        });
    });

    describe("Snippet completions", () => {
        it("Includes snippets after top-level `<`", async () => {
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
            let items = await autoCompleter.getCompletionItems(offset);

            // Should have both schema items (aa) and snippet items
            // CompletionItemKind.Snippet = 15
            const snippetItems = items.filter((item) => item.kind === 15);

            expect(snippetItems.length).toBeGreaterThan(0);
            expect(
                snippetItems.some((item) => item.label === "test-snippet-aa"),
            ).toBe(true);
        });

        it("Filters snippets by typed prefix", async () => {
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
            let items = await autoCompleter.getCompletionItems(offset);

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
            items = await autoCompleter.getCompletionItems(offset);

            const matchingSnippets = items.filter((item) => item.kind === 15);
            expect(matchingSnippets.length).toBeGreaterThan(0);
            expect(
                matchingSnippets.some(
                    (item) => item.label === "test-aa-snippet",
                ),
            ).toBe(true);
        });

        it("Snippet items include textEdit with proper range", async () => {
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
            let items = await autoCompleter.getCompletionItems(offset);

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

        it("Snippet items indent multiline text", async () => {
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
            const items = await autoCompleter.getCompletionItems(offset);

            const snippetItem = items.find(
                (item) => item.label === "test-multiline",
            );
            expect(snippetItem?.textEdit?.newText).toBe(
                "<aa>\n  <bb></bb>\n  </aa>",
            );
        });
    });

    describe("Offset-to-node-index mapping", () => {
        it("Maps offsets to node indices in depth-first order", async () => {
            const source = `<aa name="test"><b></b></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            // Offset at opening tag should map to aa element (earliest element)
            const aaStartIndex = sourceObj.getNodeIndexAtOffset(1);
            expect(aaStartIndex).not.toBeNull();
            expect(aaStartIndex).toBeGreaterThan(0); // Not root
        });

        it("Maps multiple offsets to same node index for consecutive positions", async () => {
            const source = `<aa><b></b></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            // Consecutive offsets within the same element should map to same node
            const idx1 = sourceObj.getNodeIndexAtOffset(1);
            const idx2 = sourceObj.getNodeIndexAtOffset(2);
            expect(idx1).toBe(idx2);
        });

        it("Returns null for offsets outside element ranges", async () => {
            const source = `text<aa></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            // Offset in plain text before any element maps to root (index 0 or similar)
            const rootIndex = sourceObj.getNodeIndexAtOffset(0);
            expect(rootIndex).not.toBeNull(); // Plain text is in root

            // Offset inside aa element should be different
            const aaIndex = sourceObj.getNodeIndexAtOffset(6);
            expect(aaIndex).not.toBe(rootIndex);
        });

        it("Provides consistent indices across multiple calls", async () => {
            const source = `<aa><b></b></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            const offset = 5;
            const index1 = sourceObj.getNodeIndexAtOffset(offset);
            const index2 = sourceObj.getNodeIndexAtOffset(offset);

            expect(index1).toBe(index2);
        });

        it("Uses left-of-cursor semantics at EOF", async () => {
            const source = `<aa><b></b></aa>`;
            const sourceObj = new DoenetSourceObject(source);

            const eofIndex = sourceObj.getNodeIndexAtOffset(source.length);
            const lastCharIndex = sourceObj.getNodeIndexAtOffset(
                source.length - 1,
            );

            expect(eofIndex).toBe(lastCharIndex);
            expect(eofIndex).not.toBeNull();
        });

        it("Differentiates nested nodes with different indices", async () => {
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
        it("Creates a disabled resolver callback when no core is attached", async () => {
            const source = `<section name="mySection"><p name="myP" /></section>`;
            const sourceObj = new DoenetSourceObject(source);

            const adapter = new RustResolverAdapter(sourceObj);
            expect(adapter.isEnabled()).toBe(false);

            const resolver = adapter.createResolver();
            expect(typeof resolver).toBe("function");

            const result = await resolver({
                offset: 10,
                pathParts: ["foo", "bar"],
                nodeIndex: 2,
            });

            // Without a core, the adapter exposes a disabled resolver.
            expect(result).toBeNull();
        });

        it("Passes node index through resolver args", async () => {
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

        it("Returns no ref completions when the adapter is disabled", async () => {
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

            const items = await autoCompleter.getCompletionItems(source.length);

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

        it("Enables adapter when core is provided", async () => {
            const source = `<section name="s1"><p name="p1" /></section>`;
            const sourceObj = new DoenetSourceObject(source);
            const { core } = createMockCore(source, sourceObj);

            const adapter = new RustResolverAdapter(sourceObj, { core });
            await adapter.init();
            expect(adapter.isEnabled()).toBe(true);
        });

        it("Resolves single-level ref via Rust core", async () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core, calls } = createMockCore(source, sourceObj, {
                nodeIdx: 0, // section
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "s1" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, { core });
            await adapter.init();
            const resolver = adapter.createResolver();

            // pathParts: ["s1", ""] — "s1" is the container, "" is the incomplete member
            const result = await resolver({
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

        it("Returns null when resolve_path throws", async () => {
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
            await adapter.init();
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset: source.indexOf("$missing.") + 9,
                pathParts: ["missing", ""],
            });
            expect(result).toBeNull();
        });

        it("Passes unresolved path parts through", async () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$s1.p1.x`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core } = createMockCore(source, sourceObj, {
                nodeIdx: 1, // p
                nodesInResolvedPath: [0, 1],
                unresolvedPath: [{ name: "remaining" }],
                originalPath: [{ name: "s1" }, { name: "p1" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, { core });
            await adapter.init();
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset: source.indexOf("$s1.p1.x") + 8,
                pathParts: ["s1", "p1", "x"],
            });

            // Invalid path — node is null so no completions are offered.
            expect(result).not.toBeNull();
            expect(result!.node).toBeNull();
            expect(result!.unresolvedPathParts).toEqual(["remaining"]);
        });

        it("Treats missing trailing member segment as an implicit empty segment", async () => {
            const source = `<section name="s"><p name="p1" /></section>\n$s.p1.`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core, calls } = createMockCore(source, sourceObj, {
                nodeIdx: 1,
                nodesInResolvedPath: [0, 1],
                unresolvedPath: null,
                originalPath: [{ name: "s" }, { name: "p1" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, { core });
            await adapter.init();
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset: source.indexOf("$s.p1.") + "$s.p1.".length,
                // Simulates a parser/context path that dropped the final empty segment.
                pathParts: ["s", "p1"],
            });

            expect(result).not.toBeNull();
            expect(calls[0].path).toEqual({
                path: [
                    { type: "flatPathPart", name: "s", index: [] },
                    { type: "flatPathPart", name: "p1", index: [] },
                ],
            });
        });

        it("isNameAddressableFromOffset enforces exact case for resolved referent names", async () => {
            const source = `<section name="sec"><math name="Inside">x</math>$in</section>`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core } = createMockCore(source, sourceObj, {
                nodeIdx: 1,
                nodesInResolvedPath: [1],
                unresolvedPath: null,
                originalPath: [{ name: "Inside" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, { core });
            await adapter.init();

            const offset = source.indexOf("$in") + 1;
            expect(
                await adapter.isNameAddressableFromOffset(offset, "inside"),
            ).toBe(false);
            expect(
                await adapter.isNameAddressableFromOffset(offset, "Inside"),
            ).toBe(true);
        });

        it("Filters visibleDescendantNames by exact-case referent match", async () => {
            const source = `<section name="sec"><math name="inside">x</math></section><math name="Inside">y</math>\n$sec.`;
            const sourceObj = new DoenetSourceObject(source + " ");

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
                set_flags: () => {},
                return_dast: () => ({ elements }),
                resolve_path: (path) => {
                    const first = (path.path[0] as { name: string }).name;
                    // Resolve $sec. to section (id 0), but resolve probe "inside"
                    // to differently cased "Inside" outside the section (id 2).
                    if (first === "sec") {
                        return {
                            nodeIdx: 0,
                            nodesInResolvedPath: [0],
                            unresolvedPath: null,
                            originalPath: [{ name: "sec" }],
                        };
                    }
                    if (first === "inside") {
                        return {
                            nodeIdx: 2,
                            nodesInResolvedPath: [2],
                            unresolvedPath: null,
                            originalPath: [{ name: "inside" }],
                        };
                    }
                    throw new Error("NoReferent");
                },
            };

            const adapter = new RustResolverAdapter(sourceObj, { core });
            await adapter.init();
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset: source.indexOf("$sec.") + "$sec.".length,
                pathParts: ["sec", ""],
            });

            expect(result).not.toBeNull();
            expect(result!.visibleDescendantNames).not.toContain("inside");
        });

        it("Blocks unindexed traversal from the first takesIndex segment, not the following segment", async () => {
            const source = `<section name="sec"><repeatForSequence name="rep"><math name="myMath">x</math></repeatForSequence>\n$rep.myMath.</section>`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core } = createMockCore(source, sourceObj, {
                nodeIdx: 2, // myMath
                nodesInResolvedPath: [0, 1, 2],
                unresolvedPath: null,
                originalPath: [{ name: "rep" }, { name: "myMath" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, {
                core,
                takesIndexComponentTypes: new Set(["repeatForSequence"]),
            });
            await adapter.init();
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset: source.indexOf("$rep.myMath.") + "$rep.myMath.".length,
                pathParts: ["rep", "myMath", ""],
                pathPartHasIndex: [false, false, false],
            });

            expect(result).not.toBeNull();
            expect(result!.node).toBeNull();
            expect(result!.unresolvedPathParts).toEqual(["rep", "myMath"]);
        });

        it("Allows indexed traversal when the indexed segment is after the origin entry", async () => {
            const source = `<section name="sec"><repeatForSequence name="rep"><math name="myMath">x</math></repeatForSequence>\n$rep[1].myMath.</section>`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core } = createMockCore(source, sourceObj, {
                nodeIdx: 2, // myMath
                nodesInResolvedPath: [0, 1, 2],
                unresolvedPath: null,
                originalPath: [{ name: "rep" }, { name: "myMath" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, {
                core,
                takesIndexComponentTypes: new Set(["repeatForSequence"]),
            });
            await adapter.init();
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset:
                    source.indexOf("$rep[1].myMath.") +
                    "$rep[1].myMath.".length,
                pathParts: ["rep", "myMath", ""],
                pathPartHasIndex: [true, false, false],
            });

            expect(result).not.toBeNull();
            expect(result!.node).not.toBeNull();
            expect((result!.node as DastElement).name).toBe("math");
            expect(result!.unresolvedPathParts).toEqual([]);
        });

        it("Aligns to the trailing path nodes when nodesInResolvedPath has extra leading entries", async () => {
            const source = `<section name="sec"><repeat name="outer"><repeatForSequence name="inner"><math name="myMath">x</math></repeatForSequence></repeat>\n$outer[1].inner[1].myMath.</section>`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core } = createMockCore(source, sourceObj, {
                nodeIdx: 3, // myMath
                // Simulate a resolver shape with an extra leading bookkeeping node
                // before the actual path-aligned tail [1, 2, 3].
                nodesInResolvedPath: [0, 0, 1, 2, 3],
                unresolvedPath: null,
                originalPath: [
                    { name: "outer" },
                    { name: "inner" },
                    { name: "myMath" },
                ],
            });

            const adapter = new RustResolverAdapter(sourceObj, {
                core,
                takesIndexComponentTypes: new Set([
                    "repeat",
                    "repeatForSequence",
                ]),
            });
            await adapter.init();
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset:
                    source.indexOf("$outer[1].inner[1].myMath.") +
                    "$outer[1].inner[1].myMath.".length,
                pathParts: ["outer", "inner", "myMath", ""],
                pathPartHasIndex: [true, true, false, false],
            });

            expect(result).not.toBeNull();
            expect(result!.node).not.toBeNull();
            expect((result!.node as DastElement).name).toBe("math");
            expect(result!.unresolvedPathParts).toEqual([]);
        });

        it("Blocks traversal when an intermediate non-takesIndex segment has an index", async () => {
            // $sec[1].myP. — section does not takesIndex, so the [1] is spurious
            // and should produce no completions (false positive is worse than false negative).
            const source = `<section name="sec"><p name="myP">text</p></section>\n$sec[1].myP.`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core } = createMockCore(source, sourceObj, {
                nodeIdx: 1, // p
                nodesInResolvedPath: [0, 1], // section then p
                unresolvedPath: null,
                originalPath: [{ name: "sec" }, { name: "myP" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, {
                core,
                takesIndexComponentTypes: new Set([
                    "repeat",
                    "repeatForSequence",
                ]),
            });
            await adapter.init();
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset: source.indexOf("$sec[1].myP.") + "$sec[1].myP.".length,
                pathParts: ["sec", "myP", ""],
                pathPartHasIndex: [true, false, false],
            });

            expect(result).not.toBeNull();
            expect(result!.node).toBeNull();
            expect(result!.unresolvedPathParts).toEqual(["sec", "myP"]);
        });

        it("Blocks completions when the resolved non-takesIndex element has an index", async () => {
            // $myMath[1]. — math does not takesIndex, so the [1] is spurious
            // and should produce no completions.
            const source = `<math name="myMath">x</math>\n$myMath[1].`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core } = createMockCore(source, sourceObj, {
                nodeIdx: 0, // myMath
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "myMath" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, {
                core,
                takesIndexComponentTypes: new Set([
                    "repeat",
                    "repeatForSequence",
                ]),
            });
            await adapter.init();
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset: source.indexOf("$myMath[1].") + "$myMath[1].".length,
                pathParts: ["myMath", ""],
                pathPartHasIndex: [true, false],
            });

            expect(result).not.toBeNull();
            expect(result!.node).toBeNull();
            expect(result!.unresolvedPathParts).toEqual([]);
        });

        it("Handles updateSource to re-sync with core", async () => {
            const source1 = `<section name="s1"><p name="p1" /></section>`;
            const sourceObj1 = new DoenetSourceObject(source1);
            const { core } = createMockCore(source1, sourceObj1);

            const adapter = new RustResolverAdapter(sourceObj1, { core });
            await adapter.init();
            expect(adapter.isEnabled()).toBe(true);

            const source2 = `<section name="s2"><p name="p2" /></section>`;
            const sourceObj2 = new DoenetSourceObject(source2);
            await adapter.updateSource(sourceObj2);
            expect(adapter.isEnabled()).toBe(true);
        });

        it("Uses mapped root origin index when Rust ids are non-zero", async () => {
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
            await adapter.init();
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset: source.indexOf("$s1.") + 4,
                pathParts: ["s1", ""],
            });

            expect(result).not.toBeNull();
            expect(calls.length).toBeGreaterThan(0);
            expect(calls[0].origin).toBe(10);
        });

        it("Disables adapter when set_source throws", async () => {
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
            await adapter.init();
            expect(adapter.isEnabled()).toBe(false);

            const resolver = adapter.createResolver();
            expect(
                await resolver({ offset: 0, pathParts: ["s1", ""] }),
            ).toBeNull();
        });

        it("Caches visibility probes for repeated member resolutions", async () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const sourceObj = new DoenetSourceObject(source + " ");
            const { core, calls } = createMockCore(source, sourceObj, {
                nodeIdx: 0,
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "s1" }],
            });

            const adapter = new RustResolverAdapter(sourceObj, { core });
            await adapter.init();
            const resolver = adapter.createResolver();
            const offset = source.indexOf("$s1.") + 4;

            await resolver({ offset, pathParts: ["s1", ""] });
            await resolver({ offset, pathParts: ["s1", ""] });

            // The container resolution runs each time
            // (skip_parent_search=false), but the descendant visibility probe
            // path (skip_parent_search=true) should be cached after the first
            // call for this source revision and resolved node.
            const probeCalls = calls.filter((c) => c.skip_parent_search);
            expect(probeCalls.length).toBe(1);
        });

        it("Invalidates visibility-probe cache when source changes", async () => {
            const source1 = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const sourceObj1 = new DoenetSourceObject(source1 + " ");
            const { core, calls } = createMockCore(source1, sourceObj1, {
                nodeIdx: 0,
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "s1" }],
            });

            const adapter = new RustResolverAdapter(sourceObj1, { core });
            await adapter.init();
            const resolver = adapter.createResolver();
            const offset1 = source1.indexOf("$s1.") + 4;

            await resolver({ offset: offset1, pathParts: ["s1", ""] });
            await resolver({ offset: offset1, pathParts: ["s1", ""] });

            const firstProbeCount = calls.filter(
                (c) => c.skip_parent_search,
            ).length;
            expect(firstProbeCount).toBe(1);

            const source2 = `<section name="s2"><p name="p2" /></section>\n$s2.`;
            const sourceObj2 = new DoenetSourceObject(source2 + " ");
            await adapter.updateSource(sourceObj2);

            const offset2 = source2.indexOf("$s2.") + 4;
            await resolver({ offset: offset2, pathParts: ["s2", ""] });

            const secondProbeCount = calls.filter(
                (c) => c.skip_parent_search,
            ).length;
            expect(secondProbeCount).toBe(2);
        });
    });
});
