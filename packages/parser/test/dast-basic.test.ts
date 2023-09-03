import { glob } from "glob";
import { describe, expect, it } from "vitest";
import * as fs from "node:fs/promises";
import { parse, showCursor } from "../src/parser";
import { lezerToDast } from "../src/lezer-to-dast";
import { lezerToDast as lezerToDastNew } from "../src/lezer-to-dast/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import util from "util";
import { mergeAdjacentTextInArray } from "../src/dast-to-xml/utils";

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
            it(`${filename} prints correctly in Xml format and Doenet format`, async () => {
                const source = await fs.readFile(filepath, "utf-8");
                const dast = lezerToDastNew(source);
                const formattedXml = toXml(dast);
                const formattedDoenet = toXml(dast, { doenetSyntax: true });
                expect(formattedXml).toMatchSnapshot();
                expect(formattedDoenet).toMatchSnapshot();
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
                { type: "element", children: [], attributes: [], name: "m" },
                { type: "text", value: "bar" },
                { type: "text", value: "Foo" },
                { type: "element", children: [], attributes: [], name: "m" },
                { type: "text", value: "foo" },
            ]),
        ).toEqual([
            { type: "text", value: "foo" },
            { type: "element", children: [], attributes: [], name: "m" },
            { type: "text", value: "barFoo" },
            { type: "element", children: [], attributes: [], name: "m" },
            { type: "text", value: "foo" },
        ]);
    });
});
