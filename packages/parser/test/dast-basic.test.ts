import { glob } from "glob";
import { describe, expect, it } from "vitest";
import * as fs from "node:fs/promises";
import { parse, showCursor } from "../src/parser";
import { lezerToDast } from "../src/lezer-to-dast";
import { lezerToDast as lezerToDastNew } from "../src/lezer-to-dast/lezer-to-dast";
import { toXml } from "../src/dast-to-xml/dast-util-to-xml";
import util from "util";

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
});
