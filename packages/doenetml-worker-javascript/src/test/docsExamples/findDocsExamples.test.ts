import { describe, expect, it } from "vitest";
import {
    docsFiles,
    exampleName,
    examplesInFiles,
    examplesOfShard,
    findDocsExamples,
} from "./docsExamples";
import { KNOWN_FAILURES } from "./knownFailures";

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

    it("the test files take every example once", () => {
        const all = examplesInFiles(docsFiles()).map(exampleName);
        const inTestFiles = [
            ...[1, 2, 3, 4].flatMap((shard) =>
                examplesOfShard("reference", shard, 4),
            ),
            ...examplesInFiles(
                docsFiles().filter((file) => !file.startsWith("reference/")),
            ),
        ].map(exampleName);

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
