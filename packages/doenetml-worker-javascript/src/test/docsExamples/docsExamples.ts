import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { isErrorRecord } from "@doenet/utils";
import { createTestCore } from "../utils/test-core";
import { KNOWN_FAILURES } from "./knownFailures";

/**
 * Every DoenetML example in the docs loads (Doenet/DoenetML#2530).
 *
 * The docs render the code blocks of four languages through the core
 * (`packages/docs-nextra/scripts/wrap-doenet-*.ts`, wired up in
 * `next.config.mjs`): `doenet-example` (code and output),
 * `doenet-editor` and `doenet-editor-horiz` (an editor with its output) and
 * `doenet-viewer` (the output alone). A plain `doenet` block is syntax
 * highlighting only and is not loaded.
 *
 * Each example is loaded with `createTestCore`, and all its state variables
 * are worked out (`returnAllStateVariables`). It fails, named by its file and
 * the line of its code fence, if that throws or if the document has an error
 * diagnostic: an example that shows a red box is as broken to a reader as one
 * that does not load.
 *
 * An example that shows an error on purpose says so with the word
 * `expect-error` after the language (` ```doenet-example expect-error`); the
 * docs' renderers read only the language, so the word changes nothing there.
 * Such an example must have an error.
 *
 * An example that fails because of a bug in the core, not in the example, is
 * listed in `knownFailures.ts` with the issue that tracks it. It is run as a
 * test expected to fail (`it.fails`), so the list can't go stale: an
 * example that starts to load fails until it is taken off the list.
 */

/** The code block languages the docs render with the core. */
export const DOENETML_EXAMPLE_LANGUAGES = [
    "doenet-example",
    "doenet-editor",
    "doenet-editor-horiz",
    "doenet-viewer",
];

/** The word after the language of an example that shows an error. */
export const EXPECT_ERROR_MARKER = "expect-error";

export const DOCS_CONTENT_DIR = path.resolve(
    import.meta.dirname,
    "../../../../docs-nextra/content",
);

export type DocsExample = {
    /** The `.mdx` file, relative to the docs' `content` directory. */
    file: string;
    /** The 1-based line of the opening code fence. */
    line: number;
    lang: string;
    /** The words after the language on the code fence. */
    meta: string[];
    source: string;
};

/**
 * The DoenetML examples among the fenced code blocks of `content`, the text of
 * the `.mdx` file `file`. A fence is three or more backticks or tildes,
 * indented or not (one in a JSX element is indented); it is closed by a
 * fence of the same character at least as long. Each line of the block loses
 * as much of its indentation as the opening fence had, as in CommonMark.
 */
export function findDocsExamples(content: string, file: string) {
    const examples: DocsExample[] = [];
    const lines = content.split(/\r?\n/);
    let open:
        | {
              fence: string;
              indent: number;
              line: number;
              lang: string;
              meta: string[];
              body: string[];
          }
        | undefined;

    for (const [ind, text] of lines.entries()) {
        if (open === undefined) {
            const match = text.match(/^(\s*)(`{3,}|~{3,})\s*([^\s`]*)(.*)$/);
            if (match) {
                open = {
                    fence: match[2],
                    indent: match[1].length,
                    line: ind + 1,
                    lang: match[3],
                    meta: match[4].trim().split(/\s+/).filter(Boolean),
                    body: [],
                };
            }
            continue;
        }

        const close = text.match(/^\s*(`{3,}|~{3,})\s*$/);
        if (
            close &&
            close[1][0] === open.fence[0] &&
            close[1].length >= open.fence.length
        ) {
            if (DOENETML_EXAMPLE_LANGUAGES.includes(open.lang)) {
                examples.push({
                    file,
                    line: open.line,
                    lang: open.lang,
                    meta: open.meta,
                    source: open.body.join("\n"),
                });
            }
            open = undefined;
            continue;
        }

        const leading = text.match(/^\s*/)![0].length;
        open.body.push(text.slice(Math.min(leading, open.indent)));
    }

    if (open !== undefined && DOENETML_EXAMPLE_LANGUAGES.includes(open.lang)) {
        throw Error(`${file}:${open.line}: a code fence that is never closed`);
    }

    return examples;
}

/** The `.mdx` files under `dir`, relative to the docs' `content`, sorted. */
export function docsFiles(dir = "") {
    const files: string[] = [];
    function walk(relative: string) {
        const entries = fs
            .readdirSync(path.join(DOCS_CONTENT_DIR, relative), {
                withFileTypes: true,
            })
            .sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        for (const entry of entries) {
            const name = path.posix.join(relative, entry.name);
            if (entry.isDirectory()) {
                walk(name);
            } else if (entry.name.endsWith(".mdx")) {
                files.push(name);
            }
        }
    }
    walk(dir);
    return files;
}

/** The DoenetML examples in the `.mdx` files `files`. */
export function examplesInFiles(files: string[]) {
    return files.flatMap((file) =>
        findDocsExamples(
            fs.readFileSync(path.join(DOCS_CONTENT_DIR, file), "utf8"),
            file,
        ),
    );
}

/**
 * The examples of shard `shard` (1-based) of `numShards` of the files under
 * `dir`: the files in order, cut where the count of examples reaches each
 * `1/numShards` of the whole, so that the shards take about as long.
 */
export function examplesOfShard(dir: string, shard: number, numShards: number) {
    const byFile = docsFiles(dir).map((file) => examplesInFiles([file]));
    const total = byFile.reduce((a, c) => a + c.length, 0);
    const examples: DocsExample[] = [];
    let before = 0;
    for (const fileExamples of byFile) {
        // the shard of a file is that of its first example
        const fileShard =
            Math.min(Math.floor((before * numShards) / total), numShards - 1) +
            1;
        if (fileShard === shard) {
            examples.push(...fileExamples);
        }
        before += fileExamples.length;
    }
    return examples;
}

/** The name an example is known by: its file and the line of its fence. */
export function exampleName(example: DocsExample) {
    return `${example.file}:${example.line}`;
}

/**
 * Load `example` and work out all its state variables. Throws, naming the
 * example, if that throws, if the document has an error and the example is
 * not marked `expect-error`, or if it has none and is.
 */
export async function loadDocsExample(example: DocsExample) {
    const name = exampleName(example);
    const expectError = example.meta.includes(EXPECT_ERROR_MARKER);

    let errors: string[];
    try {
        const { core } = await createTestCore({ doenetML: example.source });
        await core.returnAllStateVariables(false, true);
        errors = core
            .core!.diagnostics.filter(isErrorRecord)
            .map(
                (e: any) =>
                    `${e.code ?? "(no code)"} at line ${e.position?.start?.line ?? "?"} of the example: ${e.message}`,
            );
    } catch (e) {
        if (expectError) {
            return;
        }
        throw Error(
            `The docs example at ${name} (\`${example.lang}\`) does not load: ${e instanceof Error ? e.message : String(e)}`,
            { cause: e },
        );
    }

    if (expectError) {
        if (errors.length === 0) {
            throw Error(
                `The docs example at ${name} is marked \`${EXPECT_ERROR_MARKER}\` but has no error.`,
            );
        }
    } else if (errors.length > 0) {
        throw Error(
            `The docs example at ${name} (\`${example.lang}\`) has ${errors.length === 1 ? "an error" : `${errors.length} errors`}. If it shows an error on purpose, mark it \`${EXPECT_ERROR_MARKER}\` after the language.\n` +
                errors.map((e) => `- ${e}`).join("\n"),
        );
    }
}

/**
 * The tests of the examples `examples`: one per example, named by its file
 * and line, expected to fail if it is in `KNOWN_FAILURES`.
 */
export function describeDocsExamples(title: string, examples: DocsExample[]) {
    describe(`${title} @docsExamples`, () => {
        it("finds examples", () => {
            expect(examples.length).toBeGreaterThan(0);
        });
        for (const example of examples) {
            const name = exampleName(example);
            const test = name in KNOWN_FAILURES ? it.fails : it;
            test(name, async () => {
                await loadDocsExample(example);
            });
        }
    });
}
