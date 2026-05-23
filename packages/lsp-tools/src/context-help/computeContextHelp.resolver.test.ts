/**
 * Resolver-backed context-help tests — exercise `computeContextHelp` with a
 * `RustResolverAdapter` wired into the `AutoCompleter`, mirroring how the
 * LSP server runs it.  The companion `computeContextHelp.test.ts` covers
 * the no-adapter / JS-only path; this file is where multi-part chains and
 * `takesIndex` semantics are asserted.
 *
 * The mock `ResolverCore` lets us script what the rust core would return,
 * so these tests stay browser-worker-free.
 */
import { describe, expect, it } from "vitest";
import { AutoCompleter } from "../auto-completer";
import { RustResolverAdapter } from "../auto-completer/rust-resolver-adapter";
import type { ResolverCore } from "../auto-completer/rust-resolver-adapter";
import { DoenetSourceObject } from "../doenet-source-object";
import { computeContextHelp } from "./computeContextHelp";

/**
 * Build a minimal `ResolverCore` from the JS DAST: assign pre-order ids to
 * elements and return `resolveResult` from `resolvePath`.  Matches the
 * helper used by `doenet-auto-complete.test.ts > RustResolverAdapter with
 * mock core`.
 */
function createMockCore(
    sourceObj: DoenetSourceObject,
    resolveResult?: {
        nodeIdx: number;
        nodesInResolvedPath: number[];
        unresolvedPath: Array<{ name: string }> | null;
        originalPath: Array<{ name: string }>;
    },
): ResolverCore {
    const elements: Array<{
        data: { id: number };
        position?: { start: { offset?: number } };
    }> = [];
    let nextId = 0;
    const collect = (node: any) => {
        if (node.type === "element") {
            elements.push({
                data: { id: nextId++ },
                position: node.position,
            });
            for (const child of node.children ?? []) collect(child);
        }
    };
    for (const child of sourceObj.dast.children) collect(child);

    return {
        setSource: async () => {},
        setFlags: async () => {},
        returnDast: async () => ({ elements }),
        resolvePath: async () => {
            if (resolveResult) return resolveResult;
            return {
                nodeIdx: 0,
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [],
            };
        },
    };
}

async function buildCompleterWithAdapter(
    source: string,
    options: {
        resolveResult?: Parameters<typeof createMockCore>[1];
        takesIndexComponentTypes?: Set<string>;
    } = {},
) {
    const completer = new AutoCompleter(source);
    const core = createMockCore(completer.sourceObj, options.resolveResult);
    const adapter = new RustResolverAdapter(completer.sourceObj, {
        core,
        takesIndexComponentTypes: options.takesIndexComponentTypes,
    });
    await adapter.init();
    completer.setRustResolverAdapter(adapter);
    return completer;
}

describe("computeContextHelp — resolver-backed takesIndex semantics", () => {
    it("returns NONE for unindexed access through a takesIndex composite ($rep.myMath)", async () => {
        // <repeatForSequence> declares `takesIndex`; the runtime resolver
        // blocks `$rep.myMath` (no bracket index) because the repeat creates
        // an array of instances and member access needs to pick one.  Help
        // must follow the same rule — the JS fallback previously surfaced
        // misleading help here.  Issue #1086 verification checklist item 1.
        //
        // Adapter chops the last segment, so for pathParts ["rep", "myMath"]
        // the resolver only walks ["rep"] — and on a `takesIndex` composite
        // without an index the adapter returns `{ node: rep, descendants: [] }`.
        // The JS fallback in `helpForRefMemberByName` then re-finds `rep` and
        // surfaces `myMath` as a descendant — the bug we're fixing.
        const source = `<repeatForSequence name="rep" from="1" to="3"><math name="myMath">x</math></repeatForSequence>\n$rep.myMath`;
        const completer = await buildCompleterWithAdapter(source, {
            resolveResult: {
                nodeIdx: 0, // rep
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "rep" }],
            },
            takesIndexComponentTypes: new Set(["repeatForSequence"]),
        });
        const help = await computeContextHelp(completer, source.length);
        expect(help).toEqual({ kind: "none" });
    });

    it("resolves a 3-part chain with a leading bracket index ($rep[1].myMath.x)", async () => {
        // Companion to the takesIndex-block tests: with `[1]` supplying the
        // index, the same chain resolves all the way through to a property
        // of `<math>` (`x`).  Confirms the resolver path produces the help
        // the JS-only fallback couldn't (and that we don't regress it while
        // tightening the unindexed case).
        const source = `<repeatForSequence name="rep" from="1" to="3"><math name="myMath">x</math></repeatForSequence>\n$rep[1].myMath.x`;
        const completer = await buildCompleterWithAdapter(source, {
            // Tell the mock resolver it lands on <math>; the adapter
            // matches by source position and exposes its properties.
            resolveResult: {
                nodeIdx: 1, // math (repeatForSequence is 0, math is 1)
                nodesInResolvedPath: [0, 1],
                unresolvedPath: null,
                originalPath: [{ name: "rep" }, { name: "myMath" }],
            },
            takesIndexComponentTypes: new Set(["repeatForSequence"]),
        });
        const help = await computeContextHelp(completer, source.length);
        // `x` is a math property; the chain renders with the authored
        // bracket index preserved.
        expect(help).toMatchObject({
            kind: "property",
            elementName: "math",
        });
        if (help.kind === "property") {
            expect(help.propertyName.toLowerCase()).toBe("x");
        }
    });
});
