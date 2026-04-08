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
import { describe, expect, it, vi } from "vitest";
import { addDocumentCompletionSupport } from "../src/features/completions";

describe("addDocumentCompletionSupport", () => {
    it("allows non-ref completions when Rust is unavailable", () => {
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
            | ((params: any) => Array<{ label: string; kind: number }>)
            | undefined;
        const connection = {
            onCompletion: (handler: any) => {
                completionHandler = handler;
            },
            onCompletionResolve: () => {},
        };

        addDocumentCompletionSupport(connection as any, documentInfo as any);

        const items = completionHandler!({
            textDocument: { uri },
            position: { line: 0, character: 1 },
        });

        expect(items).toEqual([{ label: "graph", kind: 10 }]);
        expect(getCompletionItems).toHaveBeenCalledOnce();
    });

    it("gates ref completions when Rust is unavailable", () => {
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
            | ((params: any) => Array<{ label: string; kind: number }>)
            | undefined;
        const connection = {
            onCompletion: (handler: any) => {
                completionHandler = handler;
            },
            onCompletionResolve: () => {},
        };

        addDocumentCompletionSupport(connection as any, documentInfo as any);

        const items = completionHandler!({
            textDocument: { uri },
            position: { line: 0, character: 8 },
        });

        expect(items).toEqual([]);
        expect(getCompletionItems).not.toHaveBeenCalled();
    });
});
