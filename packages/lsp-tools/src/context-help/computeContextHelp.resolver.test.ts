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

    it("resolves a 3-part chain with a leading bracket index ($rep[1].myPoint.x)", async () => {
        // Companion to the takesIndex-block tests: with `[1]` supplying the
        // index, the same chain resolves all the way through to a property
        // of `<point>` (`x`).  Confirms the resolver path produces the help
        // the JS-only fallback couldn't (and that we don't regress it while
        // tightening the unindexed case).  `point.x` is the canonical
        // multi-part-chain shape the PR changeset advertises.
        const source = `<repeatForSequence name="rep" from="1" to="3"><point name="myPoint">(1,2)</point></repeatForSequence>\n$rep[1].myPoint.x`;
        const completer = await buildCompleterWithAdapter(source, {
            // Tell the mock resolver it lands on <point>; the adapter
            // matches by source position and exposes its properties.
            resolveResult: {
                nodeIdx: 1, // point (repeatForSequence is 0, point is 1)
                nodesInResolvedPath: [0, 1],
                unresolvedPath: null,
                originalPath: [{ name: "rep" }, { name: "myPoint" }],
            },
            takesIndexComponentTypes: new Set(["repeatForSequence"]),
        });
        const help = await computeContextHelp(completer, source.length);
        // `x` is a point property; the chain renders with the authored
        // bracket index preserved.
        expect(help).toMatchObject({
            kind: "property",
            elementName: "point",
        });
        if (help.kind === "property") {
            expect(help.propertyName.toLowerCase()).toBe("x");
        }
    });

    it("resolves $r[1].v to the repeat's valueName binding with derivedFrom", async () => {
        // `$r[1].v` is the most subtle case in the resolver-backed set:
        // the adapter chops the last segment so the resolver only walks
        // `["r"]`, landing on the `<repeatForSequence>` (the resolved part
        // HAS an index, so the takesIndex-with-index branch of
        // `_resolveRefMemberContainer` runs and augments
        // `visibleDescendantNames` with the repeat's `valueName`/`indexName`).
        // The help layer then needs to know `v` is a derived-repeat binding
        // — `getNamedDescendant` misses it (no `name="v"` anywhere) and
        // `findSchemaProperty(repeatForSequence, "v")` misses it too.  The
        // derived-repeat-on-container fallback recovers the help so the
        // panel agrees with the autocomplete dropdown that offered `.v`.
        const source = `<repeatForSequence name="r" from="1" to="5" valueName="v"><p><math name="myMath" simplify>2$v</math></p></repeatForSequence>\n$r[1].v`;
        const completer = await buildCompleterWithAdapter(source, {
            resolveResult: {
                nodeIdx: 0, // repeatForSequence (the only takesIndex composite)
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "r" }],
            },
            takesIndexComponentTypes: new Set(["repeatForSequence"]),
        });
        const help = await computeContextHelp(completer, source.length);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "v",
            displayPath: "r[1].v",
            targetElementName: "repeatForSequence",
            derivedFrom: {
                role: "valueName",
                ownerElementName: "repeatForSequence",
                ownerLine: 1,
            },
        });
    });

    it("returns NONE when option branches resolve the same descendant name to different component types", async () => {
        // Heterogeneous wrapper branches: `<option><math name="t">` and
        // `<option><text name="t">`. The resolver still puts "t" in
        // `visibleDescendantNames` (it's unique within each `<option>`),
        // so `resolveRefMemberDescendantHelp` is called and the
        // composite-wrapper fallback fires. But the matches across
        // branches disagree on component type — the help layer can't
        // tell whether the runtime will pick the `<math>` or the
        // `<text>` branch (`<option>` index isn't propagated to the
        // help call site; the resolver landed on `<select>` itself).
        // The fallback returns null and the panel goes blank, rather
        // than guessing at the schema and surfacing wrong help.
        // Tightens the fix from #1182 in response to a Copilot review.
        const source = `<select name="s"><option><math name="t">x</math></option><option><text name="t">b</text></option></select>\n$s[1].t`;
        const completer = await buildCompleterWithAdapter(source, {
            resolveResult: {
                nodeIdx: 0, // <select>
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "s" }],
            },
            takesIndexComponentTypes: new Set(["select"]),
        });
        const help = await computeContextHelp(completer, source.length);
        expect(help).toEqual({ kind: "none" });
    });

    it("resolves $vector.head.x via the indexAliases chase (issue #1180)", async () => {
        // `head` is an array state variable on `<vector>` with
        // `indexAliases: [["x","y","z"]]` (Vector.js:1730). The runtime
        // resolver can't walk through `head` as a named descendant (it's a
        // state variable, not an element), so the resolver returns
        // `unresolvedPath: ["head"]` with the vector as the partially
        // resolved node. The help layer then chases `x` against the alias
        // table for dim 0 and surfaces an `arrayEntry` payload.
        const source = `<vector name="v" />\n$v.head.x`;
        const completer = await buildCompleterWithAdapter(source, {
            resolveResult: {
                nodeIdx: 0, // <vector>; "head" is reported as unresolved
                nodesInResolvedPath: [0],
                unresolvedPath: [{ name: "head" }],
                originalPath: [{ name: "v" }, { name: "head" }],
            },
        });
        const help = await computeContextHelp(completer, source.length);
        expect(help).toMatchObject({
            kind: "arrayEntry",
            elementName: "vector",
            arrayName: "head",
            aliasPath: ["x"],
            arrayHasIndex: false,
        });
        if (help.kind === "arrayEntry") {
            expect(help.description).toBeTruthy();
        }
    });

    it("resolves $line.points[1].x via the indexAliases chase (issue #1180)", async () => {
        // `points` is a 2-dim array on `<line>` with
        // `indexAliases: [[], ["x","y","z"]]`. The `[1]` consumes the
        // outer dim, then `.x` resolves against the inner dim's alias
        // table. The resolver fails on `points` (state variable) and the
        // chase consumes both dims.
        const source = `<line name="l" through="(0,0) (1,1)" />\n$l.points[1].x`;
        const completer = await buildCompleterWithAdapter(source, {
            resolveResult: {
                nodeIdx: 0, // <line>; "points" is reported as unresolved
                nodesInResolvedPath: [0],
                unresolvedPath: [{ name: "points" }],
                originalPath: [{ name: "l" }, { name: "points" }],
            },
        });
        const help = await computeContextHelp(completer, source.length);
        expect(help).toMatchObject({
            kind: "arrayEntry",
            elementName: "line",
            arrayName: "points",
            aliasPath: ["x"],
            arrayHasIndex: true,
        });
    });

    it("resolves $circle.center.y via the indexAliases chase (issue #1180)", async () => {
        // `center` is a 1-dim array on `<circle>` with
        // `indexAliases: [["x","y","z"]]` (Circle.js). Same shape as the
        // `$vector.head.x` case — confirms the chase isn't vector-specific.
        const source = `<circle name="c" />\n$c.center.y`;
        const completer = await buildCompleterWithAdapter(source, {
            resolveResult: {
                nodeIdx: 0,
                nodesInResolvedPath: [0],
                unresolvedPath: [{ name: "center" }],
                originalPath: [{ name: "c" }, { name: "center" }],
            },
        });
        const help = await computeContextHelp(completer, source.length);
        expect(help).toMatchObject({
            kind: "arrayEntry",
            elementName: "circle",
            arrayName: "center",
            aliasPath: ["y"],
            arrayHasIndex: false,
        });
    });

    it("returns NONE for $vector.head.hidden — non-alias name on an array prop must not resolve (issue #1180)", async () => {
        // The design constraint: never chase through `SchemaProperty.type`
        // to expose `<point>`'s own properties. `hidden` IS a property of
        // `<point>` (head's `type`), but it isn't in `head`'s alias table
        // — so the runtime doesn't resolve `$vector.head.hidden` and the
        // help layer must agree.
        const source = `<vector name="v" />\n$v.head.hidden`;
        const completer = await buildCompleterWithAdapter(source, {
            resolveResult: {
                nodeIdx: 0,
                nodesInResolvedPath: [0],
                unresolvedPath: [{ name: "head" }],
                originalPath: [{ name: "v" }, { name: "head" }],
            },
        });
        const help = await computeContextHelp(completer, source.length);
        // For a chain of length > 2 the help layer falls back to the
        // `unsupportedRefChain` placeholder when nothing matches — the
        // panel renders an explanatory message rather than going blank.
        expect(help).toEqual({ kind: "unsupportedRefChain" });
    });

    it("returns NONE for $text.value.latex — non-array property doesn't trigger the chase (issue #1180)", async () => {
        // `value` on `<text>` isn't an array, so the chase short-circuits
        // even though `latex` would be a sensible-looking continuation.
        // Confirms the gating on `isArray + indexAliases` works.
        const source = `<text name="t">hi</text>\n$t.value.latex`;
        const completer = await buildCompleterWithAdapter(source, {
            resolveResult: {
                nodeIdx: 0,
                nodesInResolvedPath: [0],
                unresolvedPath: [{ name: "value" }],
                originalPath: [{ name: "t" }, { name: "value" }],
            },
        });
        const help = await computeContextHelp(completer, source.length);
        expect(help).toEqual({ kind: "unsupportedRefChain" });
    });

    it("resolves $s[1].t on a <select> whose option branches each declare the same descendant name", async () => {
        // Two `<option>` branches each declare `<text name="t">`. The
        // resolver walks wrapper children transparently
        // (`collectNamesFromCompositeChildren`) so "t" lands in
        // `visibleDescendantNames` — but `getNamedDescendant` on the
        // `<select>` returns null because "t" isn't uniquely addressable.
        // The composite-wrapper fallback in `resolveRefMemberDescendantHelp`
        // walks `<option>` / `<case>` / `<else>` subtrees and returns the
        // first match: sibling-replicated descendants of those wrappers
        // share schemas, so either match yields the right help payload.
        // Closes #1179.
        const source = `<select name="s"><option><text name="t">a</text></option><option><text name="t">b</text></option></select>\n$s[1].t`;
        const completer = await buildCompleterWithAdapter(source, {
            resolveResult: {
                nodeIdx: 0, // <select>
                nodesInResolvedPath: [0],
                unresolvedPath: null,
                originalPath: [{ name: "s" }],
            },
            takesIndexComponentTypes: new Set(["select"]),
        });
        const help = await computeContextHelp(completer, source.length);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "t",
            displayPath: "s[1].t",
            targetElementName: "text",
        });
    });
});
