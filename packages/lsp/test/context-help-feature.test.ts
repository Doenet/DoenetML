/**
 * Focused unit tests for `features/context-help.ts` — the LSP-hosted
 * version of the editor's context-sensitive help (issue #1086 / Option 4).
 *
 * These tests mock the connection + documentInfo, but use a real
 * `AutoCompleter` so the help payload matches what `computeContextHelp`
 * would produce in the editor.  Resolver-backed behaviour (multi-part
 * chains) is covered by `@doenet/lsp-tools`'s own integration tests; here
 * we focus on the RPC handler's policy: missing-doc fallback, rust-boot
 * race, and error-path graceful degradation.
 */
import { afterEach, describe, expect, it, vi } from "vitest";
import { AutoCompleter } from "@doenet/lsp-tools";
import { addContextHelpSupport } from "../src/features/context-help";

type Handler = (params: any) => Promise<any>;

/**
 * Register the two context-help request handlers and return them as a
 * `{ contextHelp, contextHelpForCompletion }` map.
 */
function registerHandlers(documentInfo: Map<string, unknown>) {
    const handlers: Record<string, Handler> = {};
    const connection = {
        onRequest: (method: string, handler: Handler) => {
            handlers[method] = handler;
        },
        console: { warn: () => {} },
    };
    addContextHelpSupport(connection as any, documentInfo as any);
    return {
        contextHelp: handlers["doenet/contextHelp"],
        contextHelpForCompletion: handlers["doenet/contextHelpForCompletion"],
    };
}

describe("addContextHelpSupport — doenet/contextHelp", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    it("returns NONE when the document is not known", async () => {
        const { contextHelp } = registerHandlers(new Map());
        const result = await contextHelp({
            uri: "file:///missing.doenet",
            offset: 0,
        });
        expect(result).toEqual({ kind: "none" });
    });

    it("returns element help when cursor is on an element name", async () => {
        const uri = "file:///t.doenet";
        const source = `<math>x</math>`;
        const documentInfo = new Map([
            [
                uri,
                {
                    autoCompleter: new AutoCompleter(source),
                    additionalDiagnostics: [],
                    rustState: "unavailable",
                    rustAdapter: undefined,
                },
            ],
        ]);
        const { contextHelp } = registerHandlers(documentInfo);
        const result = await contextHelp({ uri, offset: 3 });
        expect(result).toMatchObject({
            kind: "element",
            elementName: "math",
        });
    });

    it("waits for the rust boot before answering a refMember query", async () => {
        const uri = "file:///t.doenet";
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        let resolveRustReady!: () => void;
        const rustReady = new Promise<void>((resolve) => {
            resolveRustReady = resolve;
        });
        const docEntry = {
            autoCompleter: new AutoCompleter(source),
            additionalDiagnostics: [],
            rustState: "initializing",
            rustAdapter: undefined as unknown,
            rustReady,
        };
        const { contextHelp } = registerHandlers(new Map([[uri, docEntry]]));

        // Fire the request while rust is still initializing.
        const pending = contextHelp({ uri, offset: source.length });

        // Boot completes — adapter becomes ready and rustReady settles.
        docEntry.rustState = "ready";
        docEntry.rustAdapter = {};
        resolveRustReady();

        const result = await pending;
        // Even with the JS-only fallback (no rust adapter wired into the
        // completer here), a 2-part chain resolves to property help via
        // `getReferentAtOffset`.  The point of this test is the race —
        // the handler didn't bail before the wait settled.
        expect(result).toMatchObject({
            kind: "property",
            elementName: "math",
        });
    });

    it("returns help via the JS fallback even when rust is unavailable", async () => {
        const uri = "file:///t.doenet";
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        const documentInfo = new Map([
            [
                uri,
                {
                    autoCompleter: new AutoCompleter(source),
                    additionalDiagnostics: [],
                    rustState: "unavailable",
                    rustAdapter: undefined,
                },
            ],
        ]);
        const { contextHelp } = registerHandlers(documentInfo);
        const result = await contextHelp({ uri, offset: source.length });
        // 2-part chain — JS fallback in `computeContextHelp` covers this.
        expect(result).toMatchObject({
            kind: "property",
            elementName: "math",
        });
    });

    it("times out the rust-boot wait and still answers (JS fallback)", async () => {
        vi.useFakeTimers();
        const uri = "file:///t.doenet";
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        const docEntry = {
            autoCompleter: new AutoCompleter(source),
            additionalDiagnostics: [],
            rustState: "initializing",
            rustAdapter: undefined,
            // Broken worker — never settles.
            rustReady: new Promise<void>(() => {}),
        };
        const { contextHelp } = registerHandlers(new Map([[uri, docEntry]]));
        const pending = contextHelp({ uri, offset: source.length });
        await vi.advanceTimersByTimeAsync(5_000);
        const result = await pending;
        // Past the cap, the handler falls through to compute with whatever's
        // ready — here the JS fallback yields property help, not NONE.
        expect(result).toMatchObject({ kind: "property" });
    });
});

describe("addContextHelpSupport — doenet/contextHelpForCompletion", () => {
    it("returns NONE for missing documents", async () => {
        const { contextHelpForCompletion } = registerHandlers(new Map());
        const result = await contextHelpForCompletion({
            uri: "file:///missing.doenet",
            offset: 0,
            completion: { label: "abs", type: "property" },
        });
        expect(result).toEqual({ kind: "none" });
    });

    it("returns element help for a `property`-kind completion in a non-ref context", async () => {
        const uri = "file:///t.doenet";
        const source = `<a`;
        const documentInfo = new Map([
            [
                uri,
                {
                    autoCompleter: new AutoCompleter(source),
                    additionalDiagnostics: [],
                    rustState: "unavailable",
                    rustAdapter: undefined,
                },
            ],
        ]);
        const { contextHelpForCompletion } = registerHandlers(documentInfo);
        const result = await contextHelpForCompletion({
            uri,
            offset: source.length,
            completion: { label: "abs", type: "property" },
        });
        expect(result).toMatchObject({
            kind: "element",
            elementName: "abs",
        });
    });
});
