/**
 * Focused unit tests for `features/completions.ts` gating behavior.
 *
 * These tests verify the policy split between:
 * - non-ref completion contexts (which should remain available when Rust is unavailable), and
 * - Rust-dependent `$ref` contexts (which should be gated until Rust is ready).
 *
 * This file intentionally mocks the connection and document info map so
 * regressions in completion gating are caught without needing full worker
 * integration.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { addDocumentCompletionSupport } from "../src/features/completions";
import {
    CompletionItemKind,
    type CompletionItem,
    type CompletionList,
} from "vscode-languageserver-protocol";

function createDocumentEntry(
    getCompletionContext: () => unknown,
    getCompletionItems: () => CompletionItem[],
    rustState: "ready" | "initializing" | "unavailable" = "unavailable",
    rustAdapter?: unknown,
    rustReady?: Promise<void>,
) {
    return {
        autoCompleter: {
            getCompletionContext,
            getCompletionItems,
        },
        additionalDiagnostics: [],
        rustState,
        rustAdapter,
        ...(rustReady ? { rustReady } : {}),
    };
}

function createDocumentInfo(
    uri: string,
    documentEntry: ReturnType<typeof createDocumentEntry>,
) {
    return new Map([[uri, documentEntry]]);
}

/** Register the completion handler against `documentInfo` and return it. */
function getCompletionHandler(documentInfo: Map<string, unknown>) {
    let completionHandler:
        | ((params: any) => Promise<CompletionItem[] | CompletionList>)
        | undefined;
    const connection = {
        onCompletion: (handler: any) => {
            completionHandler = handler;
        },
        onCompletionResolve: () => {},
    };
    addDocumentCompletionSupport(connection as any, documentInfo as any);
    return completionHandler!;
}

describe("addDocumentCompletionSupport", () => {
    afterEach(() => {
        vi.useRealTimers();
    });
    it("allows non-ref completions when Rust is unavailable", async () => {
        const uri = "file:///test.doenet";
        const getCompletionItems = vi.fn(() => [
            { label: "graph", kind: CompletionItemKind.Property },
        ]);
        const completionHandler = getCompletionHandler(
            createDocumentInfo(
                uri,
                createDocumentEntry(
                    () => ({ cursorPos: "body" }),
                    getCompletionItems,
                ),
            ),
        );

        const items = await completionHandler!({
            textDocument: { uri },
            position: { line: 0, character: 1 },
        });

        expect(items).toEqual([
            { label: "graph", kind: CompletionItemKind.Property },
        ]);
        expect(getCompletionItems).toHaveBeenCalledOnce();
    });

    it("gates ref completions when Rust is unavailable", async () => {
        const uri = "file:///test.doenet";
        const getCompletionItems = vi.fn(() => [
            { label: "x", kind: CompletionItemKind.Reference },
        ]);
        const completionHandler = getCompletionHandler(
            createDocumentInfo(
                uri,
                createDocumentEntry(
                    () => ({ cursorPos: "refMember" }),
                    getCompletionItems,
                ),
            ),
        );

        const items = await completionHandler!({
            textDocument: { uri },
            position: { line: 0, character: 8 },
        });

        expect(items).toEqual([]);
        expect(getCompletionItems).not.toHaveBeenCalled();
    });

    it("waits for the rust boot before answering a ref completion", async () => {
        const uri = "file:///test.doenet";
        const getCompletionItems = vi.fn(() => [
            { label: "coords", kind: CompletionItemKind.Reference },
        ]);

        let resolveRustReady!: () => void;
        const rustReady = new Promise<void>((resolve) => {
            resolveRustReady = resolve;
        });

        const docEntry = createDocumentEntry(
            () => ({ cursorPos: "refMember" }),
            getCompletionItems,
            "initializing",
            undefined,
            rustReady,
        );
        const completionHandler = getCompletionHandler(
            createDocumentInfo(uri, docEntry),
        );

        // Handler is invoked while Rust is still initializing — it must not
        // answer with [] (which would close the editor's completion session),
        // it must wait for `rustReady`.
        const pending = completionHandler({
            textDocument: { uri },
            position: { line: 0, character: 8 },
        });

        // The boot finishes: Rust becomes ready, then `rustReady` settles.
        docEntry.rustState = "ready";
        docEntry.rustAdapter = {};
        resolveRustReady();

        expect(await pending).toEqual([
            { label: "coords", kind: CompletionItemKind.Reference },
        ]);
        expect(getCompletionItems).toHaveBeenCalledOnce();
    });

    it("falls back to [] if the rust boot exceeds the wait cap", async () => {
        vi.useFakeTimers();
        const uri = "file:///test.doenet";
        const getCompletionItems = vi.fn(() => [
            { label: "coords", kind: CompletionItemKind.Reference },
        ]);

        const docEntry = createDocumentEntry(
            () => ({ cursorPos: "refMember" }),
            getCompletionItems,
            "initializing",
            undefined,
            // A broken worker never settles `rustReady`.
            new Promise<void>(() => {}),
        );
        const completionHandler = getCompletionHandler(
            createDocumentInfo(uri, docEntry),
        );

        const pending = completionHandler({
            textDocument: { uri },
            position: { line: 0, character: 8 },
        });
        await vi.advanceTimersByTimeAsync(5_000);

        expect(await pending).toEqual([]);
        expect(getCompletionItems).not.toHaveBeenCalled();
    });

    it("marks close-tag completions incomplete so VS Code re-requests them", async () => {
        const uri = "file:///test.doenet";
        const getCompletionItems = vi.fn(() => [
            {
                label: "/text>",
                kind: CompletionItemKind.Property,
                filterText: "</text>",
                textEdit: {
                    newText: "</text>",
                    range: {
                        start: { line: 0, character: 5 },
                        end: { line: 0, character: 7 },
                    },
                },
            },
        ]);

        const completionHandler = getCompletionHandler(
            createDocumentInfo(
                uri,
                createDocumentEntry(
                    () => ({ cursorPos: "body" }),
                    getCompletionItems,
                ),
            ),
        );

        const items = await completionHandler({
            textDocument: { uri },
            position: { line: 0, character: 7 },
        });

        expect(items).toEqual({
            isIncomplete: true,
            items: [
                {
                    label: "/text>",
                    kind: CompletionItemKind.Property,
                    filterText: "</text>",
                    textEdit: {
                        newText: "</text>",
                        range: {
                            start: { line: 0, character: 5 },
                            end: { line: 0, character: 7 },
                        },
                    },
                },
            ],
        });
    });

    it("does not mark close-tag-shaped items incomplete when they lack a textEdit", async () => {
        const uri = "file:///test.doenet";
        const getCompletionItems = vi.fn(() => [
            {
                label: "/text>",
                kind: CompletionItemKind.Property,
                filterText: "</text>",
            },
        ]);

        const completionHandler = getCompletionHandler(
            createDocumentInfo(
                uri,
                createDocumentEntry(
                    () => ({ cursorPos: "body" }),
                    getCompletionItems,
                ),
            ),
        );

        const items = await completionHandler({
            textDocument: { uri },
            position: { line: 0, character: 7 },
        });

        expect(items).toEqual([
            {
                label: "/text>",
                kind: CompletionItemKind.Property,
                filterText: "</text>",
            },
        ]);
    });

    it("marks `<`-prefixed snippet completions incomplete so VS Code refreshes their textEdit range", async () => {
        const uri = "file:///test.doenet";
        const getCompletionItems = vi.fn(() => [
            {
                label: "answer-skeleton",
                kind: CompletionItemKind.Snippet,
                filterText: "<answer-skeleton",
                textEdit: {
                    newText: '<answer name="ans" />',
                    range: {
                        start: { line: 0, character: 0 },
                        end: { line: 0, character: 1 },
                    },
                },
            },
        ]);

        const completionHandler = getCompletionHandler(
            createDocumentInfo(
                uri,
                createDocumentEntry(
                    () => ({ cursorPos: "openTagName" }),
                    getCompletionItems,
                ),
            ),
        );

        const items = await completionHandler({
            textDocument: { uri },
            position: { line: 0, character: 1 },
        });

        expect(items).toEqual({
            isIncomplete: true,
            items: [
                {
                    label: "answer-skeleton",
                    kind: CompletionItemKind.Snippet,
                    filterText: "<answer-skeleton",
                    textEdit: {
                        newText: '<answer name="ans" />',
                        range: {
                            start: { line: 0, character: 0 },
                            end: { line: 0, character: 1 },
                        },
                    },
                },
            ],
        });
    });
});
