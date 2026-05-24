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
import {
    AutoCompleter,
    DOENET_LSP_METHODS,
    type RustResolverAdapter,
} from "@doenet/lsp-tools";
import type { DastElement } from "@doenet/parser";
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
        contextHelp: handlers[DOENET_LSP_METHODS.contextHelp],
        contextHelpForCompletion:
            handlers[DOENET_LSP_METHODS.contextHelpForCompletion],
    };
}

/**
 * Drain the microtask queue so any promise that didn't await an external
 * signal would have settled by now.  Used by the rust-boot-wait tests to
 * assert the handler is *still pending* before `rustReady` resolves —
 * without this, a buggy handler that returned synchronously could fool
 * the test by settling on the next microtask before `await pending`.
 */
async function flushMicrotasks() {
    for (let i = 0; i < 10; i++) {
        await Promise.resolve();
    }
}

/**
 * Minimal `RustResolverAdapter` stand-in for tests that need
 * `resolveRefMemberContainerAtOffset` to return a real container — e.g.
 * the rust-boot-wait tests, which prove that once `rustReady` settles
 * the handler picks up the (now-wired) adapter and produces real
 * resolver-backed help rather than a NONE shape.
 *
 * Restricted to `$head.member` (length-2) chains: walks the AST for the
 * head segment via `getReferentAtOffset` and reports an empty
 * `visibleDescendantNames`, so the help layer falls through to
 * schema-property lookup on the container.  This mirrors the
 * length-2-only stub used in `@doenet/lsp-tools`'s own context-help
 * tests; resolver-specific multi-part semantics are tested there with
 * the real adapter + a mock `ResolverCore`.
 */
function makeMemberRefStubAdapter(
    completer: AutoCompleter,
): RustResolverAdapter {
    const stub = {
        async resolveRefMemberContainerAtOffset(
            offset: number,
            pathParts: string[],
        ) {
            if (pathParts.length !== 2) {
                return { node: null, visibleDescendantNames: [] };
            }
            const headName = pathParts[0];
            if (!headName) return { node: null, visibleDescendantNames: [] };
            const node =
                completer.sourceObj.getReferentAtOffset(offset, headName) ??
                null;
            return { node, visibleDescendantNames: [] };
        },
        getDerivedRepeatNames(_offset: number) {
            return [] as Array<{ name: string; element: DastElement }>;
        },
    };
    return stub as unknown as RustResolverAdapter;
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

    it("waits for the rust boot, then uses the resolver to answer a refMember query", async () => {
        const uri = "file:///t.doenet";
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        let resolveRustReady!: () => void;
        const rustReady = new Promise<void>((resolve) => {
            resolveRustReady = resolve;
        });
        const autoCompleter = new AutoCompleter(source);
        const docEntry = {
            autoCompleter,
            additionalDiagnostics: [],
            rustState: "initializing",
            rustAdapter: undefined as unknown,
            rustReady,
        };
        const { contextHelp } = registerHandlers(new Map([[uri, docEntry]]));

        // Fire the request while rust is still initializing.  The handler
        // must wait for `rustReady` rather than bailing immediately —
        // otherwise it would close the help session before the resolver
        // can answer.  Track settled-ness via a `.then` callback so we
        // can prove the request is still pending below.
        let settled = false;
        const pending = contextHelp({
            uri,
            offset: source.length,
        }).then((r) => {
            settled = true;
            return r;
        });

        // Drain microtasks so any handler that returned synchronously
        // (without awaiting `rustReady`) would have settled by now.  A
        // correct handler is suspended inside `Promise.race([rustReady,
        // setTimeout(...)])`; neither leg has fired, so `settled` stays
        // false.  This is the assertion the original test was missing —
        // without it, resolving `rustReady` before `await pending` would
        // mask a handler that ignored the wait.
        await flushMicrotasks();
        expect(settled).toBe(false);

        // Boot completes — wire the adapter in (mirrors what
        // `validate.ts` does once the rust core finishes spawning),
        // then settle `rustReady` to release the handler's await.
        // Wiring before resolving makes the intent explicit; the
        // ordering itself doesn't matter (the handler can't resume
        // until we yield), but reading the test this way makes the
        // "now real resolver answers are available" step obvious.
        docEntry.rustState = "ready";
        docEntry.rustAdapter = {};
        autoCompleter.setRustResolverAdapter(
            makeMemberRefStubAdapter(autoCompleter),
        );
        resolveRustReady();

        const result = await pending;
        expect(settled).toBe(true);
        // Resolver-backed property help: with the adapter now wired,
        // `$m.displayDecimals` resolves to the `<math>` referent and
        // surfaces the `displayDecimals` schema property.  Pre-wait
        // (no adapter) the same payload would be NONE — confirming
        // the wait genuinely lets the resolver answer.
        expect(result).toMatchObject({
            kind: "property",
            elementName: "math",
        });
        if ((result as any).kind === "property") {
            expect((result as any).propertyName.toLowerCase()).toBe(
                "displaydecimals",
            );
        }
    });

    it("returns NONE for refMember queries when rust is unavailable", async () => {
        // Post-Option-2 (the JS fallback removed), the resolver is the
        // sole source of truth for member resolution.  Without an adapter
        // the help layer correctly returns NONE rather than the
        // descendant-walking surface that produced wrong help for
        // `$rep.myMath` (issue #1086 verification checklist item 1).
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
        expect(result).toEqual({ kind: "none" });
    });

    it("times out the rust-boot wait and returns NONE for refMember queries", async () => {
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
        // Past the cap the handler computes with whatever's ready — no
        // adapter means no resolution → NONE.  The point is graceful
        // degradation: a broken worker doesn't hang the request.
        expect(result).toEqual({ kind: "none" });
    });
});

describe("addContextHelpSupport — doenet/contextHelpForCompletion", () => {
    afterEach(() => {
        vi.useRealTimers();
    });

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

    it("waits for the rust boot, then uses the resolver to answer a refMember completion query", async () => {
        // Mirrors the cursor-side `waits for the rust boot...` test —
        // the wait helper is shared between the two RPCs, so a regression
        // there must be caught on both code paths.  The dropdown's
        // highlighted-row help should not resolve before the resolver
        // has had a chance to answer; otherwise the panel commits a
        // stale NONE while the dropdown shows real completions.
        const uri = "file:///t.doenet";
        const source = `<math name="m">x</math>\n$m.`;
        let resolveRustReady!: () => void;
        const rustReady = new Promise<void>((resolve) => {
            resolveRustReady = resolve;
        });
        const autoCompleter = new AutoCompleter(source);
        const docEntry = {
            autoCompleter,
            additionalDiagnostics: [],
            rustState: "initializing",
            rustAdapter: undefined as unknown,
            rustReady,
        };
        const { contextHelpForCompletion } = registerHandlers(
            new Map([[uri, docEntry]]),
        );

        let settled = false;
        const pending = contextHelpForCompletion({
            uri,
            offset: source.length,
            completion: { label: "displayDecimals", type: "property" },
        }).then((r) => {
            settled = true;
            return r;
        });

        // Same pendingness assertion as the cursor-side test — without
        // this, a handler that ignored `rustReady` and resolved on the
        // next microtask would still pass because `resolveRustReady()`
        // runs before `await pending`.
        await flushMicrotasks();
        expect(settled).toBe(false);

        // Boot completes — wire the adapter in, then settle `rustReady`.
        docEntry.rustState = "ready";
        docEntry.rustAdapter = {};
        autoCompleter.setRustResolverAdapter(
            makeMemberRefStubAdapter(autoCompleter),
        );
        resolveRustReady();

        const result = await pending;
        expect(settled).toBe(true);
        // Resolver-backed property help for the highlighted completion
        // row — the `property`-kind branch routes through
        // `helpForRefMemberByName` with the row's label as the member,
        // resolves the head via the now-wired adapter, and looks up
        // `displayDecimals` on the `<math>` schema.
        expect(result).toMatchObject({
            kind: "property",
            elementName: "math",
        });
        if ((result as any).kind === "property") {
            expect((result as any).propertyName.toLowerCase()).toBe(
                "displaydecimals",
            );
        }
    });

    it("times out the rust-boot wait and returns NONE for refMember completion queries", async () => {
        // Mirrors the cursor-side timeout test.  A broken worker only
        // settles `rustReady` after the spawn timeout — far past what a
        // completion should hang on — so past the 5 s cap the handler
        // computes with whatever's ready and surfaces a NONE rather than
        // wedging the popup's help.
        vi.useFakeTimers();
        const uri = "file:///t.doenet";
        const source = `<math name="m">x</math>\n$m.`;
        const docEntry = {
            autoCompleter: new AutoCompleter(source),
            additionalDiagnostics: [],
            rustState: "initializing",
            rustAdapter: undefined,
            // Broken worker — never settles.
            rustReady: new Promise<void>(() => {}),
        };
        const { contextHelpForCompletion } = registerHandlers(
            new Map([[uri, docEntry]]),
        );
        const pending = contextHelpForCompletion({
            uri,
            offset: source.length,
            completion: { label: "displayDecimals", type: "property" },
        });
        await vi.advanceTimersByTimeAsync(5_000);
        const result = await pending;
        expect(result).toEqual({ kind: "none" });
    });
});
