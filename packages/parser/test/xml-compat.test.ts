import { glob } from "glob";
import { describe, expect, it } from "vitest";
import * as fs from "node:fs/promises";
import { parse, showCursor } from "../src/parser";

describe("Xml files parse correctly", async () => {
    const files = glob
        .sync(new URL("./fragments/xml-*.doenet", import.meta.url).pathname)
        .filter((f) => !f.includes("-bad"));
    const fileMap: Record<string, string> = Object.fromEntries(
        files.map((f) => [f.split("/").pop(), f]),
    );

    for (const [filename, filepath] of Object.entries(fileMap)) {
        it(`${filename} parses correctly`, async () => {
            const source = await fs.readFile(filepath, "utf-8");
            const parsed = parse(source);
            expect(showCursor(parsed)).toMatchSnapshot();
        });
    }
});
