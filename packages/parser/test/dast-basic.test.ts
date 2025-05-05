import { glob } from "glob";
import { describe, expect, it } from "vitest";
import * as fs from "node:fs/promises";
import { lezerToDast } from "../src/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import util from "util";
import {
    filterPositionInfo,
    mergeAdjacentTextInArray,
} from "../src/dast-to-xml/utils";
import { DastRoot, DastText } from "../src/types";
import {
    splitTextAtSpecialChars,
    splitTextNodeAt,
} from "../src/lezer-to-dast/gobble-function-arguments";
import { normalizeDocumentDast } from "../src/dast-normalize/normalize-dast";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("DAST", async () => {
    {
        // Regular parsing tests
        const files = glob
            .sync(new URL("./fragments/xml-*.doenet", import.meta.url).pathname)
            .filter((f) => !f.includes("-bad"));
        const fileMap: Record<string, string> = Object.fromEntries(
            files.map((f) => [f.split("/").pop(), f]),
        );

        for (const [filename, filepath] of Object.entries(fileMap)) {
            it(`${filename} prints correctly in Xml format and Doenet format`, async () => {
                const source = await fs.readFile(filepath, "utf-8");
                const dast = lezerToDast(source);
                const formattedXml = toXml(dast);
                const formattedDoenet = toXml(dast, { doenetSyntax: true });
                expect(formattedXml).toMatchSnapshot();
                expect(formattedDoenet).toMatchSnapshot();
            });
        }
    }
    {
        // Tests that identify parsing errors
        const files = glob.sync(
            new URL("./fragments/xml-bad*.doenet", import.meta.url).pathname,
        );
        const fileMap: Record<string, string> = Object.fromEntries(
            files.map((f) => [f.split("/").pop(), f]),
        );

        for (const [filename, filepath] of Object.entries(fileMap)) {
            it(`${filename} can parse badly formed Xml`, async () => {
                const source = await fs.readFile(filepath, "utf-8");
                const dast = lezerToDast(source);
                // We just don't want to throw any errors when printing
                const formattedXml = toXml(dast);
                const formattedDoenet = toXml(dast, { doenetSyntax: true });
                expect(formattedXml).toBeTypeOf("string");
                expect(formattedDoenet).toBeTypeOf("string");
            });
        }
    }

    it("preserves ampersands", () => {
        const cases = [
            { inStr: "a & b", outStrXml: "a &amp; b", outStrDoenet: "a & b" },
            {
                inStr: "a &b c",
                outStrXml: "a &amp;b c",
                outStrDoenet: "a &b c",
            },
            { inStr: "a &b", outStrXml: "a &amp;b", outStrDoenet: "a &b" },
            {
                inStr: "a &amp&amp;",
                outStrXml: "a &amp;amp&amp;",
                outStrDoenet: "a &amp;amp&",
            },
            {
                inStr: "&amp&#59;",
                outStrXml: "&amp;amp;",
                outStrDoenet: "&amp;amp;",
            },
        ];
        for (const { inStr, outStrXml, outStrDoenet } of cases) {
            const dast = lezerToDast(inStr);
            const formattedXml = toXml(dast);
            const formattedDoenet = toXml(dast, { doenetSyntax: true });
            expect(formattedXml).toBe(outStrXml);
            expect(formattedDoenet).toBe(outStrDoenet);
        }
    });

    it("preserves ampersands 2", () => {
        const dast: DastRoot = {
            type: "root",
            children: [
                {
                    type: "text",
                    value: "one&two",
                },
            ],
            sources: ["one&two"],
        };
        const formattedXml = toXml(dast);
        const formattedDoenet = toXml(dast, { doenetSyntax: true });
        expect(formattedXml).toBe(`one&amp;two`);
        expect(formattedDoenet).toBe(`one&two`);
    });

    it("preserves ampersands in attributes", () => {
        const dast: DastRoot = {
            type: "root",
            children: [
                {
                    type: "element",
                    name: "a",
                    attributes: {
                        attr: {
                            type: "attribute",
                            name: "attr",
                            children: [
                                {
                                    type: "text",
                                    value: "one&two",
                                },
                            ],
                        },
                    },
                    children: [],
                },
                {
                    type: "text",
                    value: "\n",
                },
            ],
            sources: [`<a attr="one&two" />`],
        };
        const formattedXml = toXml(dast).trim();
        const formattedDoenet = toXml(dast, { doenetSyntax: true }).trim();
        expect(formattedXml).toBe(`<a attr="one&amp;two" />`);
        expect(formattedDoenet).toBe(`<a attr="one&two" />`);
    });

    it("can merge adjacent text nodes", () => {
        expect(mergeAdjacentTextInArray([])).toEqual([]);
        expect(
            mergeAdjacentTextInArray([{ type: "text", value: "foo" }]),
        ).toEqual([{ type: "text", value: "foo" }]);
        expect(
            mergeAdjacentTextInArray([
                { type: "text", value: "foo" },
                { type: "text", value: "bar" },
            ]),
        ).toEqual([{ type: "text", value: "foobar" }]);
        expect(
            mergeAdjacentTextInArray([
                { type: "text", value: "foo" },
                { type: "text", value: "bar" },
                { type: "text", value: "Baz" },
            ]),
        ).toEqual([{ type: "text", value: "foobarBaz" }]);
        expect(
            mergeAdjacentTextInArray([
                { type: "text", value: "foo" },
                { type: "element", children: [], attributes: {}, name: "m" },
                { type: "text", value: "bar" },
                { type: "text", value: "Foo" },
                { type: "element", children: [], attributes: {}, name: "m" },
                { type: "text", value: "foo" },
            ]),
        ).toEqual([
            { type: "text", value: "foo" },
            { type: "element", children: [], attributes: {}, name: "m" },
            { type: "text", value: "barFoo" },
            { type: "element", children: [], attributes: {}, name: "m" },
            { type: "text", value: "foo" },
        ]);
    });
    it("Can split text nodes and preserve position information", () => {
        let source: string;
        let textNode: DastText;

        source = "hi there";
        textNode = lezerToDast(source).children[0] as DastText;
        expect(splitTextNodeAt(textNode, 2)).toMatchObject([
            {
                type: "text",
                value: "hi",
                position: {
                    start: { line: 1, column: 1, offset: 0 },
                    end: { line: 1, column: 3, offset: 2 },
                },
            },
            {
                type: "text",
                value: " ",
                position: {
                    start: { line: 1, column: 3, offset: 2 },
                    end: { line: 1, column: 4, offset: 3 },
                },
            },
            {
                type: "text",
                value: "there",
                position: {
                    start: { line: 1, column: 4, offset: 3 },
                    end: { line: 1, column: 9, offset: 8 },
                },
            },
        ]);

        source = "hi there";
        textNode = lezerToDast(source).children[0] as DastText;
        expect(splitTextNodeAt(textNode, 0)).toMatchObject([
            {
                type: "text",
                value: "",
                position: {
                    start: { line: 1, column: 1, offset: 0 },
                    end: { line: 1, column: 1, offset: 0 },
                },
            },
            {
                type: "text",
                value: "h",
                position: {
                    start: { line: 1, column: 1, offset: 0 },
                    end: { line: 1, column: 2, offset: 1 },
                },
            },
            {
                type: "text",
                value: "i there",
                position: {
                    start: { line: 1, column: 2, offset: 1 },
                    end: { line: 1, column: 9, offset: 8 },
                },
            },
        ]);

        source = "hi there\nhow are you";
        textNode = lezerToDast(source).children[0] as DastText;
        expect(splitTextNodeAt(textNode, 12)).toMatchObject([
            {
                type: "text",
                value: "hi there\nhow",
                position: {
                    start: { line: 1, column: 1, offset: 0 },
                    end: { line: 2, column: 4, offset: 12 },
                },
            },
            {
                type: "text",
                value: " ",
                position: {
                    start: { line: 2, column: 4, offset: 12 },
                    end: { line: 2, column: 5, offset: 13 },
                },
            },
            {
                type: "text",
                value: "are you",
                position: {
                    start: { line: 2, column: 5, offset: 13 },
                    end: { line: 2, column: 12, offset: 20 },
                },
            },
        ]);
    });
    it("Can split at /(),/ characters", () => {
        let source: string;
        let textNode: DastText;

        source = "hi (th, ere\n)";
        textNode = lezerToDast(source).children[0] as DastText;
        expect(
            filterPositionInfo(splitTextAtSpecialChars(textNode)),
        ).toMatchObject([
            { type: "text", value: "hi " },
            { type: "text", value: "(" },
            { type: "text", value: "th" },
            { type: "text", value: "," },
            { type: "text", value: " ere\n" },
            { type: "text", value: ")" },
        ]);
    });
    it("Produces DAST trees", () => {
        let source: string;

        source = `<m>foo</m>`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {},
                "children": [
                  {
                    "type": "text",
                    "value": "foo",
                  },
                ],
                "name": "m",
                "type": "element",
              },
            ],
            "sources": [
              "<m>foo</m>",
            ],
            "type": "root",
          }
        `);

        source = `<m />`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {},
                "children": [],
                "name": "m",
                "type": "element",
              },
            ],
            "sources": [
              "<m />",
            ],
            "type": "root",
          }
        `);

        source = `<m foo />`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {
                  "foo": {
                    "children": [],
                    "name": "foo",
                    "type": "attribute",
                  },
                },
                "children": [],
                "name": "m",
                "type": "element",
              },
            ],
            "sources": [
              "<m foo />",
            ],
            "type": "root",
          }
        `);

        source = `<m foo bar="baz" />`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {
                  "bar": {
                    "children": [
                      {
                        "type": "text",
                        "value": "baz",
                      },
                    ],
                    "name": "bar",
                    "type": "attribute",
                  },
                  "foo": {
                    "children": [],
                    "name": "foo",
                    "type": "attribute",
                  },
                },
                "children": [],
                "name": "m",
                "type": "element",
              },
            ],
            "sources": [
              "<m foo bar="baz" />",
            ],
            "type": "root",
          }
        `);

        source = `<m><z /></m>`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {},
                "children": [
                  {
                    "attributes": {},
                    "children": [],
                    "name": "z",
                    "type": "element",
                  },
                ],
                "name": "m",
                "type": "element",
              },
            ],
            "sources": [
              "<m><z /></m>",
            ],
            "type": "root",
          }
        `);

        source = `<m><![CDATA[hi there]]></m>`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "attributes": {},
                "children": [
                  {
                    "type": "cdata",
                    "value": "hi there",
                  },
                ],
                "name": "m",
                "type": "element",
              },
            ],
            "sources": [
              "<m><![CDATA[hi there]]></m>",
            ],
            "type": "root",
          }
        `);

        source = `<!DOCTYPE DoenetML>\n<m>foo</m>`;
        expect(filterPositionInfo(lezerToDast(source))).toMatchInlineSnapshot(`
          {
            "children": [
              {
                "name": "DoenetML",
                "public": null,
                "system": null,
                "type": "doctype",
              },
              {
                "type": "text",
                "value": "
          ",
              },
              {
                "attributes": {},
                "children": [
                  {
                    "type": "text",
                    "value": "foo",
                  },
                ],
                "name": "m",
                "type": "element",
              },
            ],
            "sources": [
              "<!DOCTYPE DoenetML>
          <m>foo</m>",
            ],
            "type": "root",
          }
        `);
    });
    it("converts Markdown text to HTML", () => {
        let source: string;
        let dast: ReturnType<typeof lezerToDast>;

        source = `*hi*\n\n# there!`;
        dast = lezerToDast(source);
        expect(toXml(normalizeDocumentDast(dast))).toEqual(
            "<document><p><em>hi</em></p><h1>there!</h1></document>",
        );
    });
});
