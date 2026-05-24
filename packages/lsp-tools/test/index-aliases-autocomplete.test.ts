/**
 * Autocomplete tests for the `indexAliases` chase in
 * `auto-completer/methods/get-completion-items.ts`. The dual of the help
 * tests in `src/context-help/computeContextHelp.resolver.test.ts` — when
 * the cursor sits in `$container.arrayProp.` context the dropdown should
 * surface the alias names (`x`, `y`, `z` for `<vector>.head`) as
 * Reference-kind completions. Issue #1180.
 */
import { describe, expect, it } from "vitest";
import type { CompletionItem } from "vscode-languageserver/browser";
import { CompletionItemKind } from "vscode-languageserver/browser";
import { AutoCompleter } from "../src/auto-completer";
import type {
    RefMemberContainerResolution,
    RustResolverAdapter,
} from "../src/auto-completer";

type StubResult = Omit<RefMemberContainerResolution, "visibleDescendantNames"> &
    Partial<Pick<RefMemberContainerResolution, "visibleDescendantNames">>;

/**
 * Wire a stub adapter that returns a scripted `RefMemberContainerResolution`.
 * Mirrors the help-side mock — we don't need a real rust core for these
 * tests, just a way to claim "vector resolved; head is unresolved."
 */
function adapterReturning(
    completer: AutoCompleter,
    result: StubResult,
): AutoCompleter {
    const stub = {
        async resolveRefMemberContainerAtOffset() {
            return {
                visibleDescendantNames: [],
                ...result,
            };
        },
        getDerivedRepeatNames() {
            return [];
        },
    };
    completer.setRustResolverAdapter(stub as unknown as RustResolverAdapter);
    return completer;
}

function labelsOfKind(
    items: CompletionItem[],
    kind: CompletionItemKind,
): string[] {
    return items.filter((i) => i.kind === kind).map((i) => i.label);
}

describe("autocomplete — indexAliases chase (#1180)", () => {
    it("offers x/y/z for $vector.head.", async () => {
        const source = `<vector name="v" />\n$v.head.`;
        const completer = new AutoCompleter(source);
        const vector = completer.sourceObj.getReferentAtOffset(
            source.indexOf("$v.head."),
            "v",
        );
        expect(vector).not.toBeNull();
        adapterReturning(completer, {
            node: null,
            partiallyResolvedNode: vector,
            unresolvedPathParts: ["head"],
        });

        const items = await completer.getCompletionItems(source.length);
        const aliasLabels = labelsOfKind(items, CompletionItemKind.Reference);
        expect(aliasLabels).toEqual(expect.arrayContaining(["x", "y", "z"]));
    });

    it("filters aliases by typed prefix ($vector.head.x_ partial)", async () => {
        const source = `<vector name="v" />\n$v.head.x`;
        const completer = new AutoCompleter(source);
        const vector = completer.sourceObj.getReferentAtOffset(
            source.indexOf("$v.head.x"),
            "v",
        );
        adapterReturning(completer, {
            node: null,
            partiallyResolvedNode: vector,
            unresolvedPathParts: ["head"],
        });

        // Cursor at end — typedPrefix is "x"; only x should remain.
        const items = await completer.getCompletionItems(source.length);
        const aliasLabels = labelsOfKind(items, CompletionItemKind.Reference);
        expect(aliasLabels).toEqual(["x"]);
    });

    it("offers x/y/z for $line.points[1]. (bracket index consumes outer dim)", async () => {
        const source = `<line name="l" through="(0,0) (1,1)" />\n$l.points[1].`;
        const completer = new AutoCompleter(source);
        const line = completer.sourceObj.getReferentAtOffset(
            source.indexOf("$l.points"),
            "l",
        );
        adapterReturning(completer, {
            node: null,
            partiallyResolvedNode: line,
            unresolvedPathParts: ["points"],
        });

        const items = await completer.getCompletionItems(source.length);
        const aliasLabels = labelsOfKind(items, CompletionItemKind.Reference);
        expect(aliasLabels).toEqual(expect.arrayContaining(["x", "y", "z"]));
    });

    it("returns no completions for $vector.head.bogus. — invalid name halts the chase", async () => {
        const source = `<vector name="v" />\n$v.head.bogus.`;
        const completer = new AutoCompleter(source);
        const vector = completer.sourceObj.getReferentAtOffset(
            source.indexOf("$v.head.bogus"),
            "v",
        );
        adapterReturning(completer, {
            node: null,
            partiallyResolvedNode: vector,
            // The resolver walks vector.head.bogus → unresolved is the tail
            // starting at the first failed segment ("head").
            unresolvedPathParts: ["head", "bogus"],
        });

        const items = await completer.getCompletionItems(source.length);
        // "bogus" is neither an index nor an alias — chase short-circuits
        // and yields nothing, rather than falling through to descendant or
        // property completions that don't apply on an array slot.
        expect(items).toEqual([]);
    });

    it("returns no completions for $text.value. — non-array property doesn't trigger the chase", async () => {
        // `value` on `<text>` isn't an array, so `walkIndexAliases` rejects
        // it. The autocomplete branch returns `null` from the helper and
        // the caller emits `[]`, which is the right thing for a path the
        // resolver already declared unresolvable.
        const source = `<text name="t">hi</text>\n$t.value.`;
        const completer = new AutoCompleter(source);
        const text = completer.sourceObj.getReferentAtOffset(
            source.indexOf("$t.value"),
            "t",
        );
        adapterReturning(completer, {
            node: null,
            partiallyResolvedNode: text,
            unresolvedPathParts: ["value"],
        });

        const items = await completer.getCompletionItems(source.length);
        expect(items).toEqual([]);
    });

    it("offers nothing when every dim is already consumed ($vector.head.x.)", async () => {
        // The chase walks `head.x` successfully (1-dim head, "x" consumes
        // dim 0). No remaining dims means no further aliases to offer —
        // and we return `[]` rather than falling through.
        const source = `<vector name="v" />\n$v.head.x.`;
        const completer = new AutoCompleter(source);
        const vector = completer.sourceObj.getReferentAtOffset(
            source.indexOf("$v.head.x"),
            "v",
        );
        adapterReturning(completer, {
            node: null,
            partiallyResolvedNode: vector,
            unresolvedPathParts: ["head", "x"],
        });

        const items = await completer.getCompletionItems(source.length);
        expect(items).toEqual([]);
    });
});
