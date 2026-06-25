import { describe, expect, it } from "vitest";
// Required to use a worker inside a test
import "@vitest/web-worker";
// @ts-ignore
import LSPWorker from "../src/index?worker";
import util from "util";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { initWorker } from "./utils/init-message-connection";
import { DOENET_LSP_METHODS } from "@doenet/lsp-tools";
import type {
    CompletionItem,
    Diagnostic,
} from "vscode-languageserver-protocol";

// File URL for the built core webworker bundle, used when a test needs to
// exercise rust-backed completions.  Without this the LSP marks the rust
// resolver as "unavailable" and ref/member completions return [].
const coreWorkerFileUrl = pathToFileURL(
    path.resolve(import.meta.dirname, "../../doenetml-worker/dist/index.js"),
).href;

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

async function waitForCompletions(
    lspConn: Awaited<ReturnType<typeof initWorker>>["lspConn"],
    textDocument: { uri: string },
    position: { line: number; character: number },
): Promise<CompletionItem[]> {
    const maxAttempts = 40;
    for (let i = 0; i < maxAttempts; i++) {
        const completionResult = await lspConn.getCompletion({
            textDocument,
            position,
        });
        const completions = Array.isArray(completionResult)
            ? completionResult
            : (completionResult?.items ?? []);
        if (completions.length > 0) {
            return completions;
        }
        await new Promise((resolve) => setTimeout(resolve, 50));
    }
    return [];
}

describe("Doenet Language Server", async () => {
    it("can initialize language server as a webworker", async () => {
        const worker: Worker = new LSPWorker();
        const lspConn = (await initWorker(worker)).lspConn;
        await lspConn.textDocumentOpened({
            textDocument: {
                uri: "file:///test.doenet",
                languageId: "doenet",
                version: 1,
                text: "<graph xxx />",
            },
        });
        const diags = await new Promise((resolve) => {
            lspConn.onDiagnostics((params) => {
                resolve(params);
            });
        });
        expect(diags).toMatchInlineSnapshot(`
          {
            "diagnostics": [
              {
                "message": "Element \`<graph>\` doesn't have an attribute called \`xxx\`.",
                "range": {
                  "end": {
                    "character": 10,
                    "line": 0,
                  },
                  "start": {
                    "character": 7,
                    "line": 0,
                  },
                },
                "severity": 2,
              },
            ],
            "uri": "file:///test.doenet",
          }
        `);
    });
    it("can get completions", async () => {
        const worker: Worker = new LSPWorker();
        const lspConn = (await initWorker(worker)).lspConn;
        await lspConn.textDocumentOpened({
            textDocument: {
                uri: "file:///test.doenet",
                languageId: "doenet",
                version: 1,
                text: "<gra  ",
            },
        });
        const diags = await waitForCompletions(
            lspConn,
            {
                uri: "file:///test.doenet",
            },
            {
                line: 0,
                character: 3,
            },
        );
        expect(diags).toMatchInlineSnapshot(`
          [
            {
              "documentation": {
                "kind": "markdown",
                "value": "A subsection of paragraphs (rendered at heading level 4)",
              },
              "kind": 10,
              "label": "paragraphs",
              "sortText": "1:1-999-1-999-1-paragraphs-0-999-paragraphs",
            },
            {
              "documentation": {
                "kind": "markdown",
                "value": "Renders an orbital diagram showing electrons in atomic orbitals as up/down arrows in boxes",
              },
              "kind": 10,
              "label": "orbitalDiagram",
              "sortText": "1:1-999-1-999-1-orbitaldiagram-0-999-orbitaldiagram",
            },
            {
              "documentation": {
                "kind": "markdown",
                "value": "An interactive widget where students fill in an orbital diagram by adding boxes, rows, and up/down arrows (block-level; does not inherit from Input)",
              },
              "kind": 10,
              "label": "orbitalDiagramInput",
              "sortText": "1:1-999-1-999-1-orbitaldiagraminput-0-999-orbitaldiagraminput",
            },
            {
              "documentation": {
                "kind": "markdown",
                "value": "A 2D coordinate-axis graph",
              },
              "kind": 10,
              "label": "graph",
              "sortText": "0:1-999-0-002-1-graph-0-999-graph",
            },
          ]
        `);
    });
    it("can get completions after update", async () => {
        const worker: Worker = new LSPWorker();
        const lspConn = (await initWorker(worker)).lspConn;
        await lspConn.textDocumentOpened({
            textDocument: {
                uri: "file:///test.doenet",
                languageId: "doenet",
                version: 1,
                text: "",
            },
        });
        await lspConn.textDocumentChanged({
            textDocument: { uri: "file:///test.doenet", version: 2 },
            contentChanges: [
                {
                    text: "<gra  ",
                    range: {
                        start: { character: 0, line: 0 },
                        end: { line: Number.MAX_SAFE_INTEGER, character: 0 },
                    },
                },
            ],
        });
        const diags = await waitForCompletions(
            lspConn,
            {
                uri: "file:///test.doenet",
            },
            {
                line: 0,
                character: 3,
            },
        );
        expect(diags).toMatchInlineSnapshot(`
          [
            {
              "documentation": {
                "kind": "markdown",
                "value": "A subsection of paragraphs (rendered at heading level 4)",
              },
              "kind": 10,
              "label": "paragraphs",
              "sortText": "1:1-999-1-999-1-paragraphs-0-999-paragraphs",
            },
            {
              "documentation": {
                "kind": "markdown",
                "value": "Renders an orbital diagram showing electrons in atomic orbitals as up/down arrows in boxes",
              },
              "kind": 10,
              "label": "orbitalDiagram",
              "sortText": "1:1-999-1-999-1-orbitaldiagram-0-999-orbitaldiagram",
            },
            {
              "documentation": {
                "kind": "markdown",
                "value": "An interactive widget where students fill in an orbital diagram by adding boxes, rows, and up/down arrows (block-level; does not inherit from Input)",
              },
              "kind": 10,
              "label": "orbitalDiagramInput",
              "sortText": "1:1-999-1-999-1-orbitaldiagraminput-0-999-orbitaldiagraminput",
            },
            {
              "documentation": {
                "kind": "markdown",
                "value": "A 2D coordinate-axis graph",
              },
              "kind": 10,
              "label": "graph",
              "sortText": "0:1-999-0-002-1-graph-0-999-graph",
            },
          ]
        `);
    });

    // Skipped: `@vitest/web-worker` does not implement the worker-global
    // `addEventListener` that `Comlink.expose` requires inside the spawned
    // CoreWorker, so the LSP cannot wire up its rust-core sub-worker in this
    // test environment.  The per-document isolation this test was written to
    // verify is now structurally provided by `getRustCore()` returning a
    // fresh sub-worker per document; covered end-to-end via Cypress.
    it.skip("keeps ref-member completions isolated across documents", async () => {
        const worker: Worker = new LSPWorker();
        const lspConn = (await initWorker(worker, coreWorkerFileUrl)).lspConn;

        const uriA = "file:///doc-a.doenet";
        const uriB = "file:///doc-b.doenet";
        const textA = `<section name="secA"><p name="fromA">A</p></section>\n$secA.`;
        const textB = `<section name="secB"><p name="fromB">B</p></section>\n$secB.`;

        await lspConn.textDocumentOpened({
            textDocument: {
                uri: uriA,
                languageId: "doenet",
                version: 1,
                text: textA,
            },
        });
        await lspConn.textDocumentOpened({
            textDocument: {
                uri: uriB,
                languageId: "doenet",
                version: 1,
                text: textB,
            },
        });

        const completionA1 = await waitForCompletions(
            lspConn,
            { uri: uriA },
            { line: 1, character: 6 },
        );

        expect(completionA1.some((item) => item.label === "fromA")).toBe(true);
        expect(completionA1.some((item) => item.label === "fromB")).toBe(false);

        await lspConn.textDocumentChanged({
            textDocument: { uri: uriB, version: 2 },
            contentChanges: [
                {
                    text: `<section name="secB"><p name="fromB2">B</p></section>\n$secB.`,
                    range: {
                        start: { character: 0, line: 0 },
                        end: { line: Number.MAX_SAFE_INTEGER, character: 0 },
                    },
                },
            ],
        });

        const completionA2 = await waitForCompletions(
            lspConn,
            { uri: uriA },
            { line: 1, character: 6 },
        );

        expect(completionA2.some((item) => item.label === "fromA")).toBe(true);
        expect(completionA2.some((item) => item.label === "fromB2")).toBe(
            false,
        );
    });

    it("can supply external diagnostics", async () => {
        const worker: Worker = new LSPWorker();
        const { lspConn, workerConn } = await initWorker(worker);
        await lspConn.textDocumentOpened({
            textDocument: {
                uri: "file:///test2.doenet",
                languageId: "doenet",
                version: 1,
                text: "<document>\n\n</document>\n",
            },
        });

        let numLoops = 0;
        let diagsPromise = new Promise((resolve) => {
            lspConn.onDiagnostics((params) => {
                resolve(params);
            });
        });
        let diags: { uri: string; diagnostics: Diagnostic[] } | undefined =
            undefined;

        const diagnostic: Diagnostic = {
            message: "This is an external diagnostic",
            range: {
                start: { character: 1, line: 1 },
                end: { character: 2, line: 2 },
            },
            severity: 1,
        };
        workerConn.sendRequest(DOENET_LSP_METHODS.setAdditionalDiagnostics, {
            uri: "file:///test2.doenet",
            additionalDiagnostics: [diagnostic],
        });
        // Diagnostics may not be sent back immediately; we loop until we get them
        while (numLoops < 10 && (diags = (await diagsPromise) as any)) {
            numLoops++;
            if (diags.diagnostics.length > 0) {
                break;
            }
            diagsPromise = new Promise((resolve) => {
                lspConn.onDiagnostics((params) => {
                    resolve(params);
                });
            });
        }

        expect(diags).toMatchObject({
            diagnostics: [
                {
                    message: "This is an external diagnostic",
                    range: {
                        end: {
                            character: 2,
                            line: 2,
                        },
                        start: {
                            character: 1,
                            line: 1,
                        },
                    },
                    severity: 1,
                },
            ],
            uri: "file:///test2.doenet",
        });
    });

    it("merges external diagnostics with existing diagnostics", async () => {
        const worker: Worker = new LSPWorker();
        const { lspConn, workerConn } = await initWorker(worker);
        const uri = "file:///test-merge.doenet";
        const perWaitTimeoutMs = 1500;

        const waitForDiagnosticsEvent = async (timeoutMs: number) => {
            return (await Promise.race([
                new Promise((resolve) => {
                    lspConn.onDiagnostics((params) => {
                        resolve(params);
                    });
                }),
                new Promise((_, reject) => {
                    setTimeout(() => {
                        reject(
                            new Error(
                                `Timed out after ${timeoutMs}ms waiting for publishDiagnostics event`,
                            ),
                        );
                    }, timeoutMs);
                }),
            ])) as { uri: string; diagnostics: Diagnostic[] };
        };

        await lspConn.textDocumentOpened({
            textDocument: {
                uri,
                languageId: "doenet",
                version: 1,
                text: "<graph xxx />",
            },
        });

        // First, verify we receive the existing validation diagnostic.
        const initialDiags = await waitForDiagnosticsEvent(perWaitTimeoutMs);

        expect(initialDiags.uri).toBe(uri);
        expect(initialDiags.diagnostics.length).toBeGreaterThan(0);

        const externalMessage = "This is an external diagnostic for merge";
        const externalDiagnostic: Diagnostic = {
            message: externalMessage,
            range: {
                start: { character: 1, line: 0 },
                end: { character: 2, line: 0 },
            },
            severity: 1,
        };

        workerConn.sendRequest(DOENET_LSP_METHODS.setAdditionalDiagnostics, {
            uri,
            additionalDiagnostics: [externalDiagnostic],
        });

        // Diagnostics may be published multiple times; loop until we receive merged diagnostics.
        let mergedDiagnostics: Diagnostic[] = [];
        for (let loop = 0; loop < 10; loop++) {
            const nextDiags = await waitForDiagnosticsEvent(perWaitTimeoutMs);

            if (nextDiags.uri !== uri) {
                continue;
            }

            const hasExternal = nextDiags.diagnostics.some(
                (diag) => diag.message === externalMessage,
            );
            const hasNonExternal = nextDiags.diagnostics.some(
                (diag) => diag.message !== externalMessage,
            );
            if (hasExternal && hasNonExternal) {
                mergedDiagnostics = nextDiags.diagnostics;
                break;
            }
        }

        if (mergedDiagnostics.length === 0) {
            throw new Error(
                "Did not observe merged diagnostics (external + existing) within expected diagnostic publish window",
            );
        }

        expect(mergedDiagnostics.length).toBeGreaterThan(1);
        expect(
            mergedDiagnostics.some((diag) => diag.message === externalMessage),
        ).toBe(true);
        expect(
            mergedDiagnostics.some((diag) => diag.message !== externalMessage),
        ).toBe(true);
    });

    it("completion items include snippet entries with textEdit", async () => {
        const worker: Worker = new LSPWorker();
        const lspConn = (await initWorker(worker)).lspConn;
        await lspConn.textDocumentOpened({
            textDocument: {
                uri: "file:///test-snippet.doenet",
                languageId: "doenet",
                version: 1,
                text: "<",
            },
        });
        const completions = await waitForCompletions(
            lspConn,
            {
                uri: "file:///test-snippet.doenet",
            },
            {
                line: 0,
                character: 1,
            },
        );

        // The test schema should have some elements
        // Check that we get completion items back
        expect(completions.length).toBeGreaterThan(0);

        // Look for any items that might be snippets (they should have textEdit)
        const itemsWithTextEdit = completions.filter((item) => item.textEdit);
        // Since snippets are a supported feature, require at least one such item
        expect(itemsWithTextEdit.length).toBeGreaterThan(0);
        // Verify snippet items have the expected structure
        itemsWithTextEdit.forEach((item) => {
            expect(item.textEdit).toHaveProperty("newText");
            expect(item.textEdit).toHaveProperty("range");
        });

        const markerSnippet = itemsWithTextEdit.find(
            (item) => item.label === "multiple-choice-answer",
        );
        expect(markerSnippet).toBeDefined();
        expect(markerSnippet?.data).toEqual({
            snippetCursor: {
                selectionStartOffset: expect.any(Number),
                selectionEndOffset: expect.any(Number),
            },
        });
    });
});
