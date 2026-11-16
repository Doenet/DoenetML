import fs from "node:fs";
import path from "node:path";
import { describe, expect, it, vi } from "vitest";
import {
    docsFiles,
    exampleName,
    examplesInFiles,
    examplesOfShard,
    findDocsExamples,
    loadDocsExample,
} from "./docsExamples";
import { KNOWN_FAILURES } from "./knownFailures";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

describe("Finding the docs examples @docsExamples", () => {
    it("finds the code blocks of the four languages, with their line and marker", () => {
        const content = [
            "# Title", // 1
            "",
            "```doenet-example", // 3
            "<p>one</p>",
            "```",
            "```doenet", // 6: highlighting only
            "<p>not loaded</p>",
            "```",
            "<Tabs>", // 9
            "    ```doenet-editor-horiz expect-error", // 10
            "    <graph>",
            "      <point/>",
            "    </graph>",
            "    ```",
            "</Tabs>",
            "````doenet-viewer", // 16: a longer fence holds a shorter one
            "```",
            "````",
            "~~~doenet-editor", // 19
            "<p>tilde</p>",
            "~~~",
        ].join("\n");

        const examples = findDocsExamples(content, "f.mdx");
        expect(
            examples.map(({ line, lang, meta, source }) => ({
                line,
                lang,
                meta,
                source,
            })),
        ).eqls([
            {
                line: 3,
                lang: "doenet-example",
                meta: [],
                source: "<p>one</p>",
            },
            {
                line: 10,
                lang: "doenet-editor-horiz",
                meta: ["expect-error"],
                source: "<graph>\n  <point/>\n</graph>",
            },
            {
                line: 16,
                lang: "doenet-viewer",
                meta: [],
                source: "```",
            },
            {
                line: 19,
                lang: "doenet-editor",
                meta: [],
                source: "<p>tilde</p>",
            },
        ]);
    });

    it("rejects an example whose fence is never closed", () => {
        expect(() =>
            findDocsExamples("```doenet-example\n<p/>\n", "f.mdx"),
        ).toThrow("f.mdx:1");
    });

    it("an example fails with an error unless marked, and when marked without one", async () => {
        const example = (source: string, meta: string[] = []) => ({
            file: "f.mdx",
            line: 1,
            lang: "doenet-example",
            meta,
            source,
        });
        // `<foo />` is not a component: an error
        await expect(loadDocsExample(example("<foo />"))).rejects.toThrow(
            "f.mdx:1 (`doenet-example`) has an error",
        );
        await loadDocsExample(example("<foo />", ["expect-error"]));
        await loadDocsExample(example("<p>hi</p>"));
        await expect(
            loadDocsExample(example("<p>hi</p>", ["expect-error"])),
        ).rejects.toThrow("marked `expect-error` but has no error");
    });

    it("the test files take every example once", () => {
        // What each test file in this folder loads, read from its source:
        // each `examplesOfShard(dir, shard, numShards)` it calls, and the
        // examples outside `reference/` if it filters for them as
        // `others.test.ts` does. So a test file deleted, or a shard number
        // changed, leaves examples out or takes some twice.
        const testFiles = fs
            .readdirSync(import.meta.dirname)
            .filter(
                (file) =>
                    file.endsWith(".test.ts") &&
                    file !== "findDocsExamples.test.ts",
            );
        const inTestFiles = testFiles.flatMap((file) => {
            const source = fs.readFileSync(
                path.join(import.meta.dirname, file),
                "utf8",
            );
            const shards = [
                ...source.matchAll(
                    /examplesOfShard\(\s*"([^"]*)",\s*(\d+),\s*(\d+)\s*,?\s*\)/g,
                ),
            ].flatMap(([, dir, shard, numShards]) =>
                examplesOfShard(dir, Number(shard), Number(numShards)),
            );
            const others = source.includes('!file.startsWith("reference/")')
                ? examplesInFiles(
                      docsFiles().filter(
                          (file) => !file.startsWith("reference/"),
                      ),
                  )
                : [];
            return [...shards, ...others].map(exampleName);
        });
        const all = examplesInFiles(docsFiles()).map(exampleName);

        expect(all.length).toBeGreaterThan(1000);
        expect([...inTestFiles].sort()).eqls([...all].sort());
    });

    it("every known failure is a docs example", () => {
        const all = new Set(examplesInFiles(docsFiles()).map(exampleName));
        for (const name of Object.keys(KNOWN_FAILURES)) {
            expect(all.has(name), name).toBe(true);
        }
    });
});
