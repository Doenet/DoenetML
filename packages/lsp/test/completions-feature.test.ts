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

/** Register the completion handler against `documentInfo` and return it. */
function getCompletionHandler(documentInfo: Map<string, unknown>) {
    let completionHandler:
        | ((params: any) => Promise<Array<{ label: string; kind: number }>>)
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
        const getCompletionItems = vi.fn(() => [{ label: "graph", kind: 10 }]);

        const documentInfo = new Map([
            [
                uri,
                {
                    autoCompleter: {
                        getCompletionContext: () => ({ cursorPos: "body" }),
                        getCompletionItems,
                    },
                    additionalDiagnostics: [],
                    rustState: "unavailable",
                    rustAdapter: undefined,
                },
            ],
        ]);

        let completionHandler:
            | ((params: any) => Promise<Array<{ label: string; kind: number }>>)
            | undefined;
        const connection = {
            onCompletion: (handler: any) => {
                completionHandler = handler;
            },
            onCompletionResolve: () => {},
        };

        addDocumentCompletionSupport(connection as any, documentInfo as any);

        const items = await completionHandler!({
            textDocument: { uri },
            position: { line: 0, character: 1 },
        });

        expect(items).toEqual([{ label: "graph", kind: 10 }]);
        expect(getCompletionItems).toHaveBeenCalledOnce();
    });

    it("gates ref completions when Rust is unavailable", async () => {
        const uri = "file:///test.doenet";
        const getCompletionItems = vi.fn(() => [{ label: "x", kind: 18 }]);

        const documentInfo = new Map([
            [
                uri,
                {
                    autoCompleter: {
                        getCompletionContext: () => ({
                            cursorPos: "refMember",
                        }),
                        getCompletionItems,
                    },
                    additionalDiagnostics: [],
                    rustState: "unavailable",
                    rustAdapter: undefined,
                },
            ],
        ]);

        let completionHandler:
            | ((params: any) => Promise<Array<{ label: string; kind: number }>>)
            | undefined;
        const connection = {
            onCompletion: (handler: any) => {
                completionHandler = handler;
            },
            onCompletionResolve: () => {},
        };

        addDocumentCompletionSupport(connection as any, documentInfo as any);

        const items = await completionHandler!({
            textDocument: { uri },
            position: { line: 0, character: 8 },
        });

        expect(items).toEqual([]);
        expect(getCompletionItems).not.toHaveBeenCalled();
    });

    it("waits for the rust boot before answering a ref completion", async () => {
        const uri = "file:///test.doenet";
        const getCompletionItems = vi.fn(() => [{ label: "coords", kind: 18 }]);

        let resolveRustReady!: () => void;
        const rustReady = new Promise<void>((resolve) => {
            resolveRustReady = resolve;
        });

        const docEntry = {
            autoCompleter: {
                getCompletionContext: () => ({ cursorPos: "refMember" }),
                getCompletionItems,
            },
            additionalDiagnostics: [],
            rustState: "initializing",
            rustAdapter: undefined as unknown,
            rustReady,
        };
        const completionHandler = getCompletionHandler(
            new Map([[uri, docEntry]]),
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

        expect(await pending).toEqual([{ label: "coords", kind: 18 }]);
        expect(getCompletionItems).toHaveBeenCalledOnce();
    });

    it("falls back to [] if the rust boot exceeds the wait cap", async () => {
        vi.useFakeTimers();
        const uri = "file:///test.doenet";
        const getCompletionItems = vi.fn(() => [{ label: "coords", kind: 18 }]);

        const docEntry = {
            autoCompleter: {
                getCompletionContext: () => ({ cursorPos: "refMember" }),
                getCompletionItems,
            },
            additionalDiagnostics: [],
            rustState: "initializing",
            rustAdapter: undefined,
            // A broken worker never settles `rustReady`.
            rustReady: new Promise<void>(() => {}),
        };
        const completionHandler = getCompletionHandler(
            new Map([[uri, docEntry]]),
        );

        const pending = completionHandler({
            textDocument: { uri },
            position: { line: 0, character: 8 },
        });
        await vi.advanceTimersByTimeAsync(5_000);

        expect(await pending).toEqual([]);
        expect(getCompletionItems).not.toHaveBeenCalled();
    });
});
