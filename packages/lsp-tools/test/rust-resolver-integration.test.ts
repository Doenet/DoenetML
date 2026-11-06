/**
 * Integration tests that exercise `RustResolverAdapter` with a **real**
 * `PublicDoenetMLCore` WASM instance.
 *
 * These tests are skipped when the WASM module cannot be loaded (e.g. when
 * the worker-rust package has not been built).
 */
import { describe, expect, it } from "vitest";
import { DoenetSourceObject } from "../src/doenet-source-object";
import { AutoCompleter, RustResolverAdapter } from "../src";
import type { ResolverCore } from "../src";
import { doenetSchema } from "@doenet/static-assets/schema";
import { CompletionItemKind } from "vscode-languageserver/browser";
import { computeContextHelp } from "../src/context-help/computeContextHelp";
import { getElementNameAttributeValue } from "../src/auto-completer/rust-resolver-adapter";

// --------------- WASM bootstrap (skips if unavailable) ---------------

let PublicDoenetMLCore: any;
let wasmAvailable = false;

try {
    // Synchronous import check — vitest evaluates this at module load time.
    const mod = await import("@doenet/doenetml-worker-rust");
    const fs = await import("node:fs");
    const path = await import("node:path");
    const wasmPath = path.resolve(
        import.meta.dirname,
        "../../doenetml-worker-rust/dist/lib_doenetml_worker_bg.wasm",
    );
    const wasmBytes = fs.readFileSync(wasmPath);
    mod.initSync({ module: wasmBytes });
    PublicDoenetMLCore = mod.PublicDoenetMLCore;
    wasmAvailable = true;
} catch (e) {
    console.warn(
        "Skipping WASM integration tests — could not load WASM:",
        (e as Error).message,
    );
}

// --------------- helpers ---------------

/** Build a static takesIndex lookup from the real DoenetML schema. */
const takesIndexSet = new Set(
    doenetSchema.elements
        .filter((el: any) => el.takesIndex)
        .map((el: any) => el.name as string),
);

/**
 * Present the snake_case WASM `PublicDoenetMLCore` as the camelCase
 * {@link ResolverCore} the adapter expects.  In production the adapter talks
 * to the Comlink-proxied `CoreWorker` (already camelCase); this test-only
 * shim lets the same adapter run directly against the in-process WASM.
 */
function wrapWasmCore(wasm: any): ResolverCore {
    return {
        setSource: async ({ source, dast }) => wasm.set_source(dast, source),
        setFlags: async ({ flags }) => wasm.set_flags(JSON.stringify(flags)),
        returnDast: async () => wasm.return_dast(),
        returnNormalizedDastRoot: async () =>
            wasm.return_normalized_dast_root(),
        resolvePath: async ({ path, origin, skipParentSearch }) =>
            wasm.resolve_path(path, origin, skipParentSearch),
    };
}

async function createCoreAndAdapter(source: string) {
    const core = wrapWasmCore(PublicDoenetMLCore.new());
    const sourceObj = new DoenetSourceObject(source);
    const adapter = new RustResolverAdapter(sourceObj, {
        core,
        takesIndexComponentTypes: takesIndexSet,
    });
    await adapter.init();
    return { core, sourceObj, adapter };
}

async function createCompleterWithAdapter(
    source: string,
    options?: { includeAdditionalRefNames?: boolean },
) {
    const sourceObj = new DoenetSourceObject();
    sourceObj.setSource(source + " ");
    const core = wrapWasmCore(PublicDoenetMLCore.new());
    const adapter = new RustResolverAdapter(sourceObj, {
        core,
        takesIndexComponentTypes: takesIndexSet,
    });
    await adapter.init();
    const completer = new AutoCompleter(undefined, undefined, {
        sourceObj,
        rustResolverAdapter: adapter,
        getAdditionalRefNames: options?.includeAdditionalRefNames
            ? (offset) => adapter.getDerivedRepeatNames(offset)
            : undefined,
    });
    return { completer, adapter };
}

// --------------- tests ---------------

describe.skipIf(!wasmAvailable)(
    "RustResolverAdapter integration (real WASM)",
    () => {
        it("simple $name. resolution returns the named element", async () => {
            const source = `<section name="s1"><p name="p1">hello</p></section>\n$s1.`;
            const { adapter } = await createCoreAndAdapter(source);

            expect(adapter.isEnabled()).toBe(true);

            const resolver = adapter.createResolver();
            const result = await resolver({
                offset: source.indexOf("$s1.") + 4,
                pathParts: ["s1", ""],
            });

            expect(result).not.toBeNull();
            expect(result!.node?.type).toBe("element");
            expect(
                (result!.node as any)?.attributes?.name?.children?.[0]?.value,
            ).toBe("s1");
            expect(result!.unresolvedPathParts).toEqual([]);
        });

        it("multi-level $a.b. resolves through nested names", async () => {
            const source = `<section name="outer"><section name="inner"><p name="target">text</p></section></section>\n$outer.inner.`;
            const { adapter } = await createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = await resolver({
                offset:
                    source.indexOf("$outer.inner.") + "$outer.inner.".length,
                pathParts: ["outer", "inner", ""],
            });

            expect(result).not.toBeNull();
            expect(result!.node?.type).toBe("element");
            expect(
                (result!.node as any)?.attributes?.name?.children?.[0]?.value,
            ).toBe("inner");
            expect(result!.unresolvedPathParts).toEqual([]);
        });

        it("non-existent ref returns null", async () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$noexist.`;
            const { adapter } = await createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = await resolver({
                offset: source.indexOf("$noexist.") + "$noexist.".length,
                pathParts: ["noexist", ""],
            });

            expect(result).toBeNull();
        });

        it("updateSource re-syncs and resolves correctly", async () => {
            const source1 = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const { adapter } = await createCoreAndAdapter(source1);

            const source2 = `<section name="s2"><p name="p1" /></section>\n$s2.`;
            const sourceObj2 = new DoenetSourceObject(source2);
            await adapter.updateSource(sourceObj2);

            const resolver = adapter.createResolver();

            const oldResult = await resolver({
                offset: source2.indexOf("$s2.") + 4,
                pathParts: ["s1", ""],
            });
            expect(oldResult).toBeNull();

            const newResult = await resolver({
                offset: source2.indexOf("$s2.") + 4,
                pathParts: ["s2", ""],
            });
            expect(newResult).not.toBeNull();
            expect(newResult!.node?.type).toBe("element");
            expect(
                (newResult!.node as any)?.attributes?.name?.children?.[0]
                    ?.value,
            ).toBe("s2");
        });

        it("Rust resolver resolves basic refs", async () => {
            const source = `<section name="sec"><p name="para">stuff</p></section>\n$sec.`;
            const sourceObj = new DoenetSourceObject(source);

            const core = wrapWasmCore(PublicDoenetMLCore.new());
            const adapter = new RustResolverAdapter(sourceObj, { core });
            await adapter.init();
            const resolver = adapter.createResolver();
            const rustResult = await resolver({
                offset: source.indexOf("$sec.") + 5,
                pathParts: ["sec", ""],
            });

            expect(rustResult).not.toBeNull();
            expect(rustResult!.node?.type).toBe("element");
            expect(
                (rustResult!.node as any)?.attributes?.name?.children?.[0]
                    ?.value,
            ).toBe("sec");
            expect(rustResult!.unresolvedPathParts).toEqual([]);
        });

        it("resolves a reference written inside a reference's index brackets", async () => {
            // An element written between index brackets (#1909) is not a child
            // of anything, so the adapter's offset table used to have no entry
            // for it: a cursor inside it found no origin and every reference
            // written there resolved to null. The control is the same markup
            // written as an ordinary child, which has always resolved.
            const inParagraph = (inner: string) =>
                `<section name="sec"><numberList name="nums">1 2 3</numberList>\n<p>${inner}</p></section>`;

            const results = [];
            for (const source of [
                inParagraph(`$nums[<indexOf target="2">$nums.</indexOf>]`),
                inParagraph(`<indexOf target="2">$nums.</indexOf>`),
            ]) {
                const { adapter } = await createCoreAndAdapter(source);
                const offset = source.lastIndexOf("$nums.") + "$nums.".length;
                const result = await adapter.createResolver()({
                    offset,
                    pathParts: ["nums", ""],
                });
                expect(result).not.toBeNull();
                expect(
                    (result!.node as any)?.attributes?.name?.children?.[0]
                        ?.value,
                ).toBe("nums");
                expect(result!.unresolvedPathParts).toEqual([]);
                results.push(result!.node);
            }
            expect(results[0]).toEqual(results[1]);
        });

        it("visibleDescendantNames respects ChildrenInvisibleToTheirGrandparents for <repeat>", async () => {
            // "inside" is a child of <repeat>, which is
            // ChildrenInvisibleToTheirGrandparents.  From the section's
            // perspective, "inside" is NOT directly visible — it must be
            // reached via $sec.rep.inside, not $sec.inside.
            const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$sec.`;
            const { adapter } = await createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = await resolver({
                offset: source.indexOf("$sec.") + 5,
                pathParts: ["sec", ""],
            });

            expect(result).not.toBeNull();
            expect(result!.visibleDescendantNames).toBeDefined();
            // "rep" should be visible (it is a direct child of section)
            expect(result!.visibleDescendantNames).toContain("rep");
            // "inside" should NOT be visible from section (hidden behind repeat)
            expect(result!.visibleDescendantNames).not.toContain("inside");
        });

        it("visibleDescendantNames is empty for takesIndex element (repeat)", async () => {
            // When resolving $sec.rep., the <repeat> is the container,
            // but repeat has takesIndex so descendants should NOT be
            // offered as dot-completions (use $rep[1].inside instead).
            const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$sec.rep.`;
            const { adapter } = await createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = await resolver({
                offset: source.indexOf("$sec.rep.") + "$sec.rep.".length,
                pathParts: ["sec", "rep", ""],
            });

            expect(result).not.toBeNull();
            expect(result!.visibleDescendantNames).toBeDefined();
            // takesIndex means no dot-access descendants
            expect(result!.visibleDescendantNames).toEqual([]);
        });

        it("isNameAddressableFromOffset filters $name completions by visibility", async () => {
            // "inside" is a child of <repeat>, which has
            // ChildrenInvisibleToTheirGrandparents.  From OUTSIDE the repeat,
            // $inside should NOT be addressable.  From INSIDE, it should.
            const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math>$ins</repeat></section>\n$ins`;
            const { adapter } = await createCoreAndAdapter(source);

            // Cursor at the trailing "$ins" (outside repeat) — "inside" is NOT addressable
            const outsideOffset = source.lastIndexOf("$ins") + 1;
            expect(
                await adapter.isNameAddressableFromOffset(
                    outsideOffset,
                    "inside",
                ),
            ).toBe(false);
            // "sec" and "rep" should still be addressable from outside
            expect(
                await adapter.isNameAddressableFromOffset(outsideOffset, "sec"),
            ).toBe(true);
            expect(
                await adapter.isNameAddressableFromOffset(outsideOffset, "rep"),
            ).toBe(true);

            // Cursor at the first "$ins" (inside repeat) — "inside" IS addressable
            const insideOffset = source.indexOf("$ins") + 1;
            expect(
                await adapter.isNameAddressableFromOffset(
                    insideOffset,
                    "inside",
                ),
            ).toBe(true);
        });

        it("getCompletionItems excludes $inside outside repeat but includes it inside repeat", async () => {
            // End-to-end test: wire isNameAddressable into an AutoCompleter
            // and verify the actual completion list.

            // --- Outside the repeat: bare `$` lists all names ---
            {
                // Use bare `$` so prefix is empty and all names are returned.
                const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$`;
                const { completer } = await createCompleterWithAdapter(source);

                const items = await completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                // "sec" and "rep" are visible at root
                expect(labels).toContain("sec");
                expect(labels).toContain("rep");
                // "inside" is hidden behind repeat
                expect(labels).not.toContain("inside");
            }

            // --- Outside the repeat: `$ins` prefix matches only "inside" ---
            {
                const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$ins`;
                const { completer } = await createCompleterWithAdapter(source);

                const items = await completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                // "inside" is the only name matching prefix "ins", but it's
                // invisible from outside the repeat → no completions.
                expect(labels).not.toContain("inside");
                expect(labels).toHaveLength(0);
            }

            // --- Inside the repeat: `$ins` matches "inside" ---
            {
                const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math>$ins</repeat></section>`;
                const { completer } = await createCompleterWithAdapter(source);

                const offset = source.indexOf("$ins") + "$ins".length;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("inside");
            }
        });

        it("$name[] snippet offered for takesIndex elements (repeat, select)", async () => {
            // "rep" is a repeat (takesIndex) — should offer "rep[]" snippet
            {
                const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$rep`;
                const { completer } = await createCompleterWithAdapter(source);
                const items = await completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("rep");
                expect(labels).toContain("rep[]");
                // The rep[] item should use snippet cursor protocol
                const snippetItem = items.find((i) => i.label === "rep[]");
                expect(snippetItem).toBeDefined();
                expect(snippetItem!.data).toEqual({
                    snippetCursor: { caretOffset: 4 }, // cursor between [ and ]
                });
            }

            // "sec" is a section (NOT takesIndex) — should NOT offer "sec[]"
            {
                const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$sec`;
                const { completer } = await createCompleterWithAdapter(source);
                const items = await completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("sec");
                expect(labels).not.toContain("sec[]");
            }

            // A hyphenated name needs the `$(…)` form, and the index is part
            // of the path segment, so it goes inside the parentheses:
            // `$(my-rep[])`. `$(my-rep)[]` would end the macro at its `)` and
            // leave `[]` as literal text.
            {
                const source = `<section name="sec"><repeat name="my-rep"><math name="inside">x</math></repeat></section>\n$my`;
                const { completer } = await createCompleterWithAdapter(source);
                const items = await completer.getCompletionItems(source.length);
                const snippetItem = items.find((i) => i.label === "my-rep[]");
                expect(snippetItem).toBeDefined();
                const textEdit = snippetItem!.textEdit;
                expect(textEdit && "newText" in textEdit).toBe(true);
                if (textEdit && "newText" in textEdit) {
                    expect(textEdit.newText).toBe("(my-rep[])");
                }
                expect(snippetItem!.data).toEqual({
                    // Offset 8 of `(my-rep[])` is its `]`, so the caret lands
                    // between the brackets, with the closing `)` after them.
                    snippetCursor: { caretOffset: 8 },
                });
            }
        });

        it("repeat valueName/indexName appear in completions inside repeat", async () => {
            // Inside repeat with valueName="v" indexName="i": $v and $i should appear
            {
                const source = `<repeat valueName="v" indexName="i"><math>$</math></repeat>`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.indexOf("$") + 1;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("v");
                expect(labels).toContain("i");
            }

            // Outside repeat: $v should NOT appear
            {
                const source = `<repeat valueName="v" indexName="i"><math>x</math></repeat>\n$`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const items = await completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).not.toContain("v");
                expect(labels).not.toContain("i");
            }
        });

        it("mixed-case component types are treated case-sensitively by resolver semantics", async () => {
            // Completion matching can be case-insensitive, but semantic behavior
            // of parsed component types must remain case-sensitive.

            // `<Repeat>` should not inherit canonical `repeat` takesIndex behavior,
            // so indexed member access should be invalid.
            {
                const source = `<Repeat name="rep" valueName="v" indexName="i"><Math name="m">x</Math></Repeat>\n$rep[1].`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const items = await completer.getCompletionItems(source.length);
                expect(items).toEqual([]);
            }

            // Unindexed access should not inject repeat-derived names because
            // `<Repeat>` is not the canonical `repeat` component type.
            {
                const source = `<Repeat name="rep" valueName="v" indexName="i"><Math name="m">x</Math></Repeat>\n$rep.`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const items = await completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).not.toContain("m");
                expect(labels).not.toContain("v");
                expect(labels).not.toContain("i");
            }
        });

        it("repeatForSequence valueName/indexName appear in completions", async () => {
            // repeatForSequence with valueName/indexName
            {
                const source = `<repeatForSequence valueName="val" indexName="idx"><math>$</math></repeatForSequence>`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.indexOf("$") + 1;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("val");
                expect(labels).toContain("idx");
            }

            // Only valueName specified
            {
                const source = `<repeat valueName="v"><math>$</math></repeat>`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.indexOf("$") + 1;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("v");
                // Default indexName is not injected
                expect(labels).not.toContain("i");
            }

            // Nested repeats: inner names visible inside, outer names also visible
            {
                const source = `<repeat valueName="outer"><repeat valueName="inner"><math>$</math></repeat></repeat>`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.indexOf("$") + 1;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("inner");
                expect(labels).toContain("outer");
            }

            // Between nested repeats: inner name NOT visible, outer IS
            {
                const source = `<repeat valueName="outer"><repeat valueName="inner"><math>x</math></repeat>$</repeat>`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.indexOf("$") + 1;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("outer");
                expect(labels).not.toContain("inner");
            }
        });

        it("does not crash on empty source", async () => {
            const { adapter } = await createCoreAndAdapter("");
            expect(adapter.isEnabled()).toBe(false);
        });

        it("does not crash on source with no elements (text only)", async () => {
            const { adapter } = await createCoreAndAdapter("a");
            expect(adapter.isEnabled()).toBe(false);
        });

        it("does not crash on incomplete element markup", async () => {
            const { adapter } = await createCoreAndAdapter("<a");
            // May or may not be enabled depending on how the Rust core
            // handles the incomplete element, but must not throw.
            expect(typeof adapter.isEnabled()).toBe("boolean");
        });

        it("recovers after blank document receives first element", async () => {
            // Simulates: blank document → user types "<p>"
            const core = wrapWasmCore(PublicDoenetMLCore.new());
            const sourceObj = new DoenetSourceObject("");
            const adapter = new RustResolverAdapter(sourceObj, { core });
            expect(adapter.isEnabled()).toBe(false);

            // User types "<p name='x'>hi</p>"
            sourceObj.setSource('<p name="x">hi</p>');
            await adapter.updateSource(sourceObj);
            expect(adapter.isEnabled()).toBe(true);
        });

        // ---- names in the branches of conditionalContent / select ----
        //
        // A name declared in the cases of a `<conditionalContent>` or the
        // options of a one-pick `<select>` is visible outside the container
        // when every branch declares it with the same tag (D13, D22, issue
        // #2455). Otherwise it is missing at run time (`doenet-w0183` /
        // `doenet-w0184`), and autocomplete leaves it out.

        /** Labels `$` completion offers at the end of `source`. */
        async function refNameLabels(source: string) {
            const { completer } = await createCompleterWithAdapter(source);
            const items = await completer.getCompletionItems(source.length);
            return items.map((i) => i.label);
        }

        /** `visibleDescendantNames` for `pathParts` at the end of `source`. */
        async function memberNames(
            source: string,
            pathParts: string[],
            pathPartHasIndex?: boolean[],
        ) {
            const { adapter } = await createCoreAndAdapter(source);
            const result = await adapter.createResolver()({
                offset: source.length,
                pathParts,
                pathPartHasIndex,
            });
            return result;
        }

        it("a name in the one case of a sugared conditionalContent is addressable from outside", async () => {
            // Sugar wraps the children in one `<case>`; with no `<else>`, the
            // name is in every case, and names nothing while none is active.
            const source = `<conditionalContent name="cc" condition="$x"><math name="inside">x</math></conditionalContent>\n$ins`;
            const { adapter } = await createCoreAndAdapter(source);

            const outsideOffset = source.lastIndexOf("$ins") + 1;
            expect(
                await adapter.isNameAddressableFromOffset(
                    outsideOffset,
                    "inside",
                ),
            ).toBe(true);
            expect(
                await adapter.isNameAddressableFromOffset(outsideOffset, "cc"),
            ).toBe(true);
        });

        it("offers a name every case and the else declare with one tag (issue example)", async () => {
            const source = `<booleanInput name="b"/>
<conditionalContent name="cc">
  <case condition="$b"><math name="x">1</math></case>
  <else><math name="x">2</math></else>
</conditionalContent>
<p>$`;
            const { completer } = await createCompleterWithAdapter(source);
            const items = await completer.getCompletionItems(source.length);
            const x = items.find((i) => i.label === "x");
            expect(x).toBeDefined();
            // The detail describes the first branch's declaration.
            expect(x!.detail).toBe("(<math>, line 3)");
            expect(items.map((i) => i.label)).toEqual(
                expect.arrayContaining(["b", "cc", "x"]),
            );
        });

        it("offers a name every case declares when there is no else", async () => {
            const labels = await refNameLabels(
                `<conditionalContent><case condition="true"><text name="t">a</text></case><case condition="false"><text name="t">b</text></case></conditionalContent>\n$`,
            );
            expect(labels).toContain("t");
        });

        it("leaves out a name a branch lacks (w0183)", async () => {
            const labels = await refNameLabels(
                `<conditionalContent><case condition="true"><math name="x">1</math></case><else><math name="y">2</math></else></conditionalContent>\n$`,
            );
            expect(labels).not.toContain("x");
            expect(labels).not.toContain("y");
        });

        it("leaves out a name branches declare with different tags (w0184)", async () => {
            const labels = await refNameLabels(
                `<conditionalContent><case condition="true"><math name="x">1</math></case><else><text name="x">2</text></else></conditionalContent>\n$`,
            );
            expect(labels).not.toContain("x");
        });

        it("leaves out a name a branch declares twice", async () => {
            const labels = await refNameLabels(
                `<conditionalContent><case condition="true"><math name="x">1</math><math name="x">3</math></case><else><math name="x">2</math></else></conditionalContent>\n$`,
            );
            expect(labels).not.toContain("x");
        });

        it("leaves out a branch name also declared outside the container (ambiguous)", async () => {
            const labels = await refNameLabels(
                `<math name="x">0</math><conditionalContent><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent>\n$`,
            );
            expect(labels).not.toContain("x");
        });

        it("offers a name found through a group in each branch", async () => {
            const labels = await refNameLabels(
                `<conditionalContent><case condition="true"><group><math name="x">1</math></group></case><else><p><math name="x">2</math></p></else></conditionalContent>\n$`,
            );
            expect(labels).toContain("x");
        });

        it("offers a name every branch of a nested conditionalContent declares", async () => {
            const labels = await refNameLabels(
                `<conditionalContent><case condition="true"><conditionalContent><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent></case><else><math name="x">3</math></else></conditionalContent>\n$`,
            );
            expect(labels).toContain("x");
        });

        it("offers a name every option of a one-pick select declares", async () => {
            for (const picks of ["", ` numToSelect="1"`]) {
                const labels = await refNameLabels(
                    `<select name="s"${picks}><option><math name="x">1</math></option><option><math name="x">2</math></option></select>\n$`,
                );
                expect(labels).toContain("s");
                expect(labels).toContain("x");
            }
        });

        it("$s. for a one-pick select lists the names every option shares", async () => {
            const source = `<select name="s"><option><math name="x">1</math><math name="y">1</math></option><option><math name="x">2</math></option></select>\n$s.`;
            const result = await memberNames(source, ["s", ""]);
            expect(result!.visibleDescendantNames).toEqual(["x"]);
        });

        it("keeps the option names of a select that picks several private", async () => {
            for (const picks of [` numToSelect="2"`, ` numToSelect="$n"`]) {
                const labels = await refNameLabels(
                    `<number name="n">1</number><select name="s"${picks}><option><math name="x">1</math></option><option><math name="x">2</math></option></select>\n$`,
                );
                expect(labels).toContain("s");
                expect(labels).not.toContain("x");
            }
        });

        it("isNameAddressableFromOffset returns false for a select child that is not an option", async () => {
            // `selectSugar` wraps only text and references in options, so a
            // `<math>` written beside them is not an option.
            const source = `<select name="sel"><math name="x">1</math><math name="y">2</math></select>\n$x`;
            const { adapter } = await createCoreAndAdapter(source);

            const outsideOffset = source.lastIndexOf("$x") + 1;
            expect(
                await adapter.isNameAddressableFromOffset(outsideOffset, "x"),
            ).toBe(false);
            expect(
                await adapter.isNameAddressableFromOffset(outsideOffset, "y"),
            ).toBe(false);
            expect(
                await adapter.isNameAddressableFromOffset(outsideOffset, "sel"),
            ).toBe(true);
        });

        it("names inside conditionalContent are accessible from INSIDE the cc", async () => {
            const source = `<conditionalContent name="cc" condition="$x"><math name="inside">x</math>$ins</conditionalContent>`;
            const { adapter } = await createCoreAndAdapter(source);

            const insideOffset = source.indexOf("$ins") + 1;
            expect(
                await adapter.isNameAddressableFromOffset(
                    insideOffset,
                    "inside",
                ),
            ).toBe(true);
        });

        it("explicit case name is still addressable from outside conditionalContent", async () => {
            const source = `<conditionalContent name="cc"><case name="positiveCase" condition="true"><text>hello</text></case></conditionalContent>\n$pos`;
            const { adapter } = await createCoreAndAdapter(source);

            const outsideOffset = source.lastIndexOf("$pos") + 1;
            expect(
                await adapter.isNameAddressableFromOffset(
                    outsideOffset,
                    "positiveCase",
                ),
            ).toBe(true);
            expect(
                await adapter.isNameAddressableFromOffset(outsideOffset, "cc"),
            ).toBe(true);
        });

        it("classifyReferenceFromOffset finds a branch name only when every branch declares it", async () => {
            const shared = `<conditionalContent name="cc"><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent>\n$x`;
            const { adapter: sharedAdapter } =
                await createCoreAndAdapter(shared);
            expect(
                await sharedAdapter.classifyReferenceFromOffset(shared.length, [
                    "x",
                ]),
            ).toBe("found");
            expect(
                await sharedAdapter.classifyReferenceFromOffset(shared.length, [
                    "cc",
                    "x",
                ]),
            ).toBe("found");

            const lacking = `<conditionalContent name="cc"><case condition="true"><math name="x">1</math></case><else><math name="y">2</math></else></conditionalContent>\n$x`;
            const { adapter: lackingAdapter } =
                await createCoreAndAdapter(lacking);
            expect(
                await lackingAdapter.classifyReferenceFromOffset(
                    lacking.length,
                    ["x"],
                ),
            ).not.toBe("found");
        });

        it("resolveBranchNameForHelp describes the first branch's declaration", async () => {
            const source = `<conditionalContent><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent>\n$x`;
            const { completer } = await createCompleterWithAdapter(source);
            const help = await completer.resolveBranchNameForHelp(
                source.length,
                "x",
            );
            expect(help?.referent.name).toBe("math");
            expect(help?.line).toBe(1);

            const lacking = `<conditionalContent><case condition="true"><math name="x">1</math></case><else><math name="y">2</math></else></conditionalContent>\n$x`;
            const { completer: lackingCompleter } =
                await createCompleterWithAdapter(lacking);
            expect(
                await lackingCompleter.resolveBranchNameForHelp(
                    lacking.length,
                    "x",
                ),
            ).toBeNull();
        });

        it("visibleDescendantNames for $cc. lists the names every branch shares", async () => {
            const source = `<conditionalContent name="cc"><case condition="true"><text name="animal">dog</text></case><else><text name="animal">cat</text></else></conditionalContent>\n$cc.`;
            const result = await memberNames(source, ["cc", ""]);
            expect(result!.visibleDescendantNames).toEqual(["animal"]);
        });

        it("visibleDescendantNames for $cc. leaves out names only some branches declare", async () => {
            const source = `<conditionalContent name="cc"><case condition="true"><text name="a">1</text><text name="shared">s</text></case><case condition="false"><text name="b">2</text><text name="shared">s</text></case></conditionalContent>\n$cc.`;
            const result = await memberNames(source, ["cc", ""]);
            expect(result!.visibleDescendantNames).toContain("shared");
            expect(result!.visibleDescendantNames).not.toContain("a");
            expect(result!.visibleDescendantNames).not.toContain("b");
        });

        it("visibleDescendantNames for $cc. leaves out names with different tags or declared twice in a branch", async () => {
            const source = `<conditionalContent name="cc"><case condition="true"><text name="dup">1</text><text name="dup">2</text><math name="typed">1</math></case><case condition="false"><text name="dup">3</text><text name="typed">t</text></case></conditionalContent>\n$cc.`;
            const result = await memberNames(source, ["cc", ""]);
            expect(result!.visibleDescendantNames).not.toContain("dup");
            expect(result!.visibleDescendantNames).not.toContain("typed");
        });

        it("visibleDescendantNames for sugared cc (no explicit case) includes children", async () => {
            const source = `<conditionalContent name="cc" condition="true"><math name="m1">1</math><math name="m2">2</math></conditionalContent>\n$cc.`;
            const result = await memberNames(source, ["cc", ""]);
            expect(result!.visibleDescendantNames).toContain("m1");
            expect(result!.visibleDescendantNames).toContain("m2");
        });

        it("visibleDescendantNames for sugared cc excludes ambiguous direct child names", async () => {
            const source = `<conditionalContent name="cc" condition="true"><math name="dup">1</math><math name="dup">2</math><math name="unique">3</math></conditionalContent>\n$cc.`;
            const result = await memberNames(source, ["cc", ""]);
            expect(result!.visibleDescendantNames).toContain("unique");
            expect(result!.visibleDescendantNames).not.toContain("dup");
        });

        it("$g. for a branch name resolves to its declaration and lists what every branch's shares", async () => {
            const source = `<conditionalContent><case condition="true"><group name="g"><math name="m">1</math></group></case><else><group name="g"><math name="m">2</math><text name="t">t</text></group></else></conditionalContent>\n$g.`;
            const result = await memberNames(source, ["g", ""]);
            expect(result!.node?.name).toBe("group");
            expect(result!.visibleDescendantNames).toEqual(["m"]);

            // and through the container's name
            const named = source
                .replace(
                    "<conditionalContent>",
                    `<conditionalContent name="cc">`,
                )
                .replace("$g.", "$cc.g.");
            const throughName = await memberNames(named, ["cc", "g", ""]);
            expect(throughName!.node?.name).toBe("group");
            expect(throughName!.visibleDescendantNames).toEqual(["m"]);
        });

        it("$sec. lists a name every branch of a container inside sec declares", async () => {
            const cc = (a: string, b: string) =>
                `<conditionalContent><case condition="true">${a}</case><else>${b}</else></conditionalContent>`;
            const shared = `<section name="sec">${cc('<math name="x">1</math>', '<math name="x">2</math>')}</section>\n$sec.`;
            const result = await memberNames(shared, ["sec", ""]);
            expect(result!.visibleDescendantNames).toContain("x");

            // Not when a branch lacks it, the tags differ, or it is also
            // declared beside the container (ambiguous).
            for (const doc of [
                `<section name="sec">${cc('<math name="x">1</math>', '<math name="z">2</math>')}</section>\n$sec.`,
                `<section name="sec">${cc('<math name="x">1</math>', '<text name="x">2</text>')}</section>\n$sec.`,
                `<section name="sec">${cc('<math name="x">1</math>', '<math name="x">2</math>')}<math name="x">3</math></section>\n$sec.`,
            ]) {
                const other = await memberNames(doc, ["sec", ""]);
                expect(other!.visibleDescendantNames).not.toContain("x");
            }

            // Help for `$sec.x` describes the first branch's declaration.
            const helpSource = shared.replace("$sec.", "$sec.x");
            const { completer } = await createCompleterWithAdapter(helpSource);
            const help = await computeContextHelp(completer, helpSource.length);
            expect(help).toMatchObject({
                kind: "refName",
                refName: "x",
                targetElementName: "math",
            });
        });

        it("$x. for a branch name the branches do not share resolves to nothing", async () => {
            const source = `<conditionalContent><case condition="true"><group name="g"/></case><else><p name="g"/></else></conditionalContent>\n$g.`;
            const result = await memberNames(source, ["g", ""]);
            expect(result?.node ?? null).toBeNull();
        });

        it("$x.value. for a branch name leaves the property unresolved on the declaration", async () => {
            const source = `<conditionalContent><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent>\n$x.value.`;
            const result = await memberNames(source, ["x", "value", ""]);
            expect(result!.node).toBeNull();
            expect(result!.unresolvedPathParts).toEqual(["value"]);
            expect(result!.partiallyResolvedNode?.name).toBe("math");
        });

        it("$g.h. hops through several names every branch declares", async () => {
            const branch = (n: number) =>
                `<group name="g"><group name="h"><math name="m">${n}</math></group></group>`;
            const source = `<conditionalContent><case condition="true">${branch(1)}</case><else>${branch(2)}</else></conditionalContent>\n$g.h.`;
            const result = await memberNames(source, ["g", "h", ""]);
            expect(result!.node?.name).toBe("group");
            expect(getElementNameAttributeValue(result!.node!)).toBe("h");
            expect(result!.visibleDescendantNames).toEqual(["m"]);
        });

        it("blocks a hop through a branch container inside a repeat reached without an index", async () => {
            const branch = (n: number) =>
                `<group name="x"><math name="y">${n}</math></group>`;
            const source = `<repeat name="r" for="1 2" valueName="v"><conditionalContent><case condition="true">${branch(1)}</case><else>${branch(2)}</else></conditionalContent></repeat>\n$r.x.`;
            const unindexed = await memberNames(source, ["r", "x", ""]);
            expect(unindexed?.node ?? null).toBeNull();

            const indexed = await memberNames(
                source.replace("$r.x.", "$r[1].x."),
                ["r", "x", ""],
                [true, false, false],
            );
            expect(indexed!.node?.name).toBe("group");
            expect(indexed!.visibleDescendantNames).toEqual(["y"]);
        });

        it("$s[2].x. hops through the options of a select that picks several", async () => {
            const option = (n: number) =>
                `<option><group name="x"><math name="y">${n}</math></group></option>`;
            const source = `<select name="s" numToSelect="2">${option(1)}${option(2)}</select>\n$s[2].x.`;
            const indexed = await memberNames(
                source,
                ["s", "x", ""],
                [true, false, false],
            );
            expect(indexed!.node?.name).toBe("group");
            expect(indexed!.visibleDescendantNames).toEqual(["y"]);

            // Without the index, a select that picks several names no
            // option.
            const unindexed = await memberNames(
                source.replace("$s[2].x.", "$s.x."),
                ["s", "x", ""],
            );
            expect(unindexed?.node ?? null).toBeNull();
        });

        it("does not read a container or branch tag written in another case as one", async () => {
            // The runtime knows no `<ConditionalContent>` or
            // `<conditionalcontent>` (`doenet-e0002`), and `$cc.x` names
            // nothing. The core reads `<ConditionalContent>` as no branch
            // container, and takes `<conditionalcontent>` as one.
            for (const tag of ["ConditionalContent", "conditionalcontent"]) {
                const source = `<${tag} name="cc"><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></${tag}>\n$`;
                expect(await refNameLabels(source)).not.toContain("x");
                const result = await memberNames(`${source}cc.`, ["cc", ""]);
                expect(result?.visibleDescendantNames ?? []).not.toContain("x");
                const below = await memberNames(
                    `<section name="sec">${source.slice(0, -2)}</section>\n$sec.`,
                    ["sec", ""],
                );
                expect(below?.visibleDescendantNames ?? []).not.toContain("x");
            }
            // An `<Else>` is no branch (`doenet-e0002`), so its `x` is
            // ambiguous with the case's (`doenet-w0105` for `$cc.x`).
            const source = `<conditionalContent name="cc"><case condition="true"><math name="x">1</math></case><Else><math name="x">2</math></Else></conditionalContent>\n$`;
            expect(await refNameLabels(source)).not.toContain("x");
            const result = await memberNames(`${source}cc.`, ["cc", ""]);
            expect(result?.visibleDescendantNames).toEqual([]);
        });

        it("leaves out a branch name also declared beside the branches", async () => {
            // The runtime reports the child beside the branches
            // (`doenet-w0107`) and finds both its `x` and the branches'
            // (`doenet-w0105`), through the container or from outside.
            for (const [container, branches] of [
                [
                    `<conditionalContent name="c">`,
                    `<case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else>`,
                ],
                [
                    `<select name="c">`,
                    `<option><math name="x">1</math></option><option><math name="x">2</math></option>`,
                ],
            ]) {
                const close = container.startsWith("<select")
                    ? "</select>"
                    : "</conditionalContent>";
                const source = `${container}${branches}<math name="x">3</math><math name="w">4</math>${close}\n$`;
                expect(await refNameLabels(source)).not.toContain("x");
                const result = await memberNames(`${source}c.`, ["c", ""]);
                expect(result?.visibleDescendantNames).toEqual([]);
                const below = await memberNames(
                    `<section name="sec">${source.slice(0, -2)}</section>\n$sec.`,
                    ["sec", ""],
                );
                expect(below?.visibleDescendantNames ?? []).not.toContain("x");
                // Without the child beside them, the branches share `x`.
                const valid = await memberNames(
                    `${container}${branches}${close}\n$c.`,
                    ["c", ""],
                );
                expect(valid?.visibleDescendantNames).toEqual(["x"]);
            }
            // Beside the cases of a container nested in a case, it is
            // ambiguous with the case's own `x` (`doenet-w0105`).
            const nested = `<conditionalContent name="c"><case condition="true"><math name="x">1</math><conditionalContent><case condition="true"><text>a</text></case><math name="x">9</math></conditionalContent></case><else><math name="x">2</math></else></conditionalContent>`;
            expect(await refNameLabels(`${nested}\n$`)).not.toContain("x");
            const throughC = await memberNames(`${nested}\n$c.`, ["c", ""]);
            expect(throughC?.visibleDescendantNames).toEqual([]);
            const below = await memberNames(
                `<section name="sec">${nested}</section>\n$sec.`,
                ["sec", ""],
            );
            expect(below?.visibleDescendantNames ?? []).not.toContain("x");
        });

        it("counts no name a copy brings in a container written with copy or extend", async () => {
            // The runtime resolves `$x` and `$y` here (`[7]`, `[1]`, no
            // diagnostics): what `<conditionalContent extend>` copies
            // declares nothing a reference from outside it sees. `x` is
            // the first element, the resolve origin, so the ambiguity
            // guard runs for it.
            const base = `<math name="x">7</math><conditionalContent name="cc"><case condition="true"><math name="y">1</math></case></conditionalContent><conditionalContent extend="$cc"/>`;
            expect(await refNameLabels(`${base}\n$`)).toEqual(
                expect.arrayContaining(["x", "y", "cc"]),
            );
            // In a case, beside that case's own `x` (runtime: `[3]`).
            const inBranch = `<section name="a"><conditionalContent name="base"><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent></section><section name="b"><conditionalContent><case condition="true"><math name="x">3</math><conditionalContent extend="$a.base"/></case><else><math name="x">4</math></else></conditionalContent><p>$`;
            expect(await refNameLabels(inBranch)).toContain("x");
            // Its own children still count when they name it: the runtime
            // finds both `x`s (`doenet-w0105`).
            const own = `<math name="x">7</math><conditionalContent name="cc"><case condition="true"><math name="y">1</math></case></conditionalContent><conditionalContent copy="$cc"><math name="x">9</math></conditionalContent>\n$`;
            expect(await refNameLabels(own)).not.toContain("x");
        });

        it("leaves out a branch name of a container hidden by sugar", async () => {
            // In the children of a `<conditionalContent extend>`, `$z`
            // names nothing (`doenet-e0057`); beside a select's options it
            // resolves but is reported (`doenet-w0107`), and is left out
            // as other content there is. `w`, in the copied container's
            // case, resolves (`[1]`).
            const extended = `<conditionalContent name="base"><case condition="true"><math name="w">1</math></case></conditionalContent><conditionalContent extend="$base"><conditionalContent><case condition="true"><point name="z">(1,2)</point></case><else><point name="z">(3,4)</point></else></conditionalContent></conditionalContent>`;
            const stray = `<select name="s"><math name="m">1</math><conditionalContent><case condition="true"><point name="z">(1,2)</point></case><else><point name="z">(3,4)</point></else></conditionalContent><option><math name="q">1</math></option></select>`;
            for (const source of [extended, stray]) {
                const labels = await refNameLabels(`${source}\n<p>$`);
                expect(labels).not.toContain("z");
                const member = await memberNames(`${source}\n<p>$z.`, [
                    "z",
                    "",
                ]);
                expect(member?.node ?? null).toBeNull();
                const below = await memberNames(
                    `<section name="sec">${source}</section>\n$sec.`,
                    ["sec", ""],
                );
                expect(below?.visibleDescendantNames ?? []).not.toContain("z");
            }
            expect(await refNameLabels(`${extended}\n<p>$`)).toContain("w");
        });

        it("resolves no member of a branch name ambiguous at the cursor", async () => {
            // Two containers whose branches share `x`, or one beside a
            // `<point name="x">`: the runtime reports `$x` and `$x.x`
            // (`doenet-w0105`). The first container is the resolve
            // origin, which the core's tie-break would pick.
            const cc = (name: string, a: string, b: string) =>
                `<conditionalContent name="${name}"><case condition="true">${a}</case><else>${b}</else></conditionalContent>`;
            for (const source of [
                cc(
                    "c1",
                    `<point name="x">(1,2)</point>`,
                    `<point name="x">(3,4)</point>`,
                ) +
                    cc(
                        "c2",
                        `<point name="x">(5,6)</point>`,
                        `<point name="x">(7,8)</point>`,
                    ),
                cc(
                    "c1",
                    `<point name="x">(1,2)</point>`,
                    `<point name="x">(3,4)</point>`,
                ) + `<point name="x">(5,6)</point>`,
            ]) {
                const result = await memberNames(`${source}\n<p>$x.`, [
                    "x",
                    "",
                ]);
                expect(result?.node ?? null).toBeNull();
                const reference = `${source}\n<p>$x`;
                const { adapter } = await createCoreAndAdapter(reference);
                expect(
                    await adapter.classifyReferenceFromOffset(
                        reference.length,
                        ["x"],
                    ),
                ).toBe("multiple");
            }
            const groups =
                cc(
                    "c1",
                    `<group name="x"><math name="m"/></group>`,
                    `<group name="x"><math name="m"/></group>`,
                ) +
                cc(
                    "c2",
                    `<group name="x"><math name="m"/></group>`,
                    `<group name="x"><math name="m"/></group>`,
                );
            const result = await memberNames(`${groups}\n<p>$x.`, ["x", ""]);
            expect(result?.visibleDescendantNames ?? []).toEqual([]);
            // Alone, the container's `x` resolves.
            const alone = cc(
                "c1",
                `<point name="x">(1,2)</point>`,
                `<point name="x">(3,4)</point>`,
            );
            const single = await memberNames(`${alone}\n<p>$x.`, ["x", ""]);
            expect(single?.node?.name).toBe("point");
        });

        it("checks the index on each name after a branch container", async () => {
            // A select of two picks in every branch: `$s[1].x` resolves
            // (runtime `[1][2]`, no diagnostics).
            const selects = `<conditionalContent><case condition="true"><select name="s" numToSelect="2"><option><math name="x">1</math></option><option><math name="x">2</math></option></select></case><else><select name="s" numToSelect="2"><option><math name="x">3</math></option><option><math name="x">4</math></option></select></else></conditionalContent>\n<p>$`;
            const s1 = await memberNames(
                `${selects}s[1].`,
                ["s", ""],
                [true, false],
            );
            expect(s1?.visibleDescendantNames).toEqual(["x"]);
            const s1x = await memberNames(
                `${selects}s[1].x.`,
                ["s", "x", ""],
                [true, false, false],
            );
            expect(s1x?.node?.name).toBe("math");
            // Without the index, the picks are not read through.
            const sx = await memberNames(`${selects}s.x.`, ["s", "x", ""]);
            expect(sx?.node ?? null).toBeNull();
            // An index into a section names nothing (`doenet-w0180`),
            // bare or through a named container.
            const sections = `<conditionalContent name="cc"><case condition="true"><section name="sec"><group name="g"><math name="m">1</math></group></section></case><else><section name="sec"><group name="g"><math name="m">2</math></group></section></else></conditionalContent>\n<p>$`;
            const bare = await memberNames(
                `${sections}sec[1].g.`,
                ["sec", "g", ""],
                [true, false, false],
            );
            expect(bare?.node ?? null).toBeNull();
            const named = await memberNames(
                `${sections}cc.sec[1].g.`,
                ["cc", "sec", "g", ""],
                [false, true, false, false],
            );
            expect(named?.node ?? null).toBeNull();
            // Without it, `$sec.g.m` resolves (runtime `[1]`).
            const valid = await memberNames(`${sections}sec.g.`, [
                "sec",
                "g",
                "",
            ]);
            expect(valid?.visibleDescendantNames).toEqual(["m"]);
        });

        it("leaves out content written beside the branches", async () => {
            // A `<conditionalContent>` child beside its `<case>`s is not a
            // case (the runtime reports it invalid, `doenet-w0107`), and
            // the children of a `<conditionalContent extend>` are not
            // content of it (`doenet-e0057`).
            for (const source of [
                `<conditionalContent><case condition="true"><math name="x">1</math></case><math name="y">5</math></conditionalContent>\n$`,
                `<conditionalContent name="c0"><math name="x">1</math></conditionalContent><conditionalContent extend="$c0"><math name="y">5</math></conditionalContent>\n$`,
            ]) {
                const { adapter } = await createCoreAndAdapter(source);
                expect(
                    await adapter.isNameAddressableFromOffset(
                        source.length,
                        "y",
                    ),
                ).toBe(false);
            }
        });

        it("leaves out a branch name the cursor's scope also declares in another element", async () => {
            // The adapter resolves from an element near the cursor (the
            // `<p>` here), which the core's "resolve back to the child"
            // tie-break then prefers; from the reference itself, `x` is
            // ambiguous.
            const cc = `<conditionalContent><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent>`;
            for (const source of [
                `<p><group><math name="x">0</math></group></p>${cc}\n$`,
                `${cc}<p><group><math name="x">0</math></group></p>\n$`,
            ]) {
                const labels = await refNameLabels(source);
                expect(labels).not.toContain("x");
            }
        });

        it("context help for a bare branch name describes the first branch's declaration", async () => {
            const source = `<conditionalContent><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent>\n$x`;
            const { completer } = await createCompleterWithAdapter(source);
            const help = await computeContextHelp(completer, source.length);
            expect(help).toMatchObject({
                kind: "refName",
                refName: "x",
                targetElementName: "math",
            });
        });

        it("end-to-end: $cc. offers the shared name and $x. offers its properties", async () => {
            const source = `<conditionalContent name="cc"><case condition="true"><math name="x">1</math></case><else><math name="x">2</math></else></conditionalContent>\n$cc.`;
            const labels = await refNameLabels(source);
            expect(labels).toContain("x");

            const props = await refNameLabels(source.replace("$cc.", "$x."));
            // A math's properties, such as `value`.
            expect(props).toContain("value");
        });

        // ---- Index bracket parsing & pathPartHasIndex wiring ----

        it("$sel[1]. with pathPartHasIndex shows descendants inside select options", async () => {
            // Use `numToSelect="2"` so the bare $sel. case still exercises
            // the takesIndex-without-index suppression (issue #1181's implicit
            // single-index shorthand would otherwise resurface descendants).
            // After an index into its picks, a select of any number of picks
            // shows one option there, so the names every option declares
            // with one tag are offered (D27, issue #2455), and a name only
            // one option declares is not.
            const source = `<select name="sel" numToSelect="2"><option><math name="a">1</math><math name="b">1</math></option><option><math name="a">2</math><text name="b">2</text></option></select>\n$sel[1].`;
            const { adapter } = await createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            // Without per-part index info (bare $sel.) — descendants suppressed
            const noIndex = await resolver({
                offset: source.indexOf("$sel[1].") + "$sel[1].".length,
                pathParts: ["sel", ""],
            });
            expect(noIndex).not.toBeNull();
            expect(noIndex!.visibleDescendantNames).toEqual([]);

            // With per-part index info — descendants should be visible
            const withIndex = await resolver({
                offset: source.indexOf("$sel[1].") + "$sel[1].".length,
                pathParts: ["sel", ""],
                pathPartHasIndex: [true, false],
            });
            expect(withIndex).not.toBeNull();
            expect(withIndex!.visibleDescendantNames).toEqual(["a"]);
        });

        it("$rep[2]. with pathPartHasIndex shows descendants inside repeat", async () => {
            const source = `<repeat name="rep" numRepetitions="3"><math name="inner">x</math></repeat>\n$rep[2].`;
            const { adapter } = await createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            // Without per-part index info — descendants suppressed
            const noIndex = await resolver({
                offset: source.indexOf("$rep[2].") + "$rep[2].".length,
                pathParts: ["rep", ""],
            });
            expect(noIndex).not.toBeNull();
            expect(noIndex!.visibleDescendantNames).toEqual([]);

            // With per-part index info — descendants visible
            const withIndex = await resolver({
                offset: source.indexOf("$rep[2].") + "$rep[2].".length,
                pathParts: ["rep", ""],
                pathPartHasIndex: [true, false],
            });
            expect(withIndex).not.toBeNull();
            expect(withIndex!.visibleDescendantNames).toContain("inner");
        });

        it("context parser strips bracket indices and sets pathPartHasIndex", async () => {
            // $sel[1]. should show descendants of select option children
            // but NOT properties of select (the referent is a child, not the select)
            {
                const source = `<select name="sel"><option><math name="a">1</math></option><option><math name="a">2</math></option></select>\n$sel[1].`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                // Should include the name every option declares
                expect(labels).toContain("a");
                // Should NOT include properties of the select element itself
                const kinds = items.map((i) => i.kind);
                expect(kinds).not.toContain(CompletionItemKind.Property);
            }

            // $sel. (no index) should NOT show descendants, only properties.
            // Use numToSelect="2" so the issue #1181 implicit-single-index
            // shorthand does NOT kick in (otherwise `$sel.a` would correctly
            // resolve like `$sel[1].a`).
            {
                const source = `<select name="sel" numToSelect="2"><option><math name="a">1</math></option><option><math name="a">2</math></option></select>\n$sel.`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).not.toContain("a");
            }

            // $sec[1]. where sec is a section (NOT takesIndex) — should return nothing
            {
                const source = `<section name="sec"><math name="m">x</math></section>\n$sec[1].`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                expect(items).toHaveLength(0);
            }

            // $rep[1].myMath. — deeper path through indexed composite
            // The resolved node is myMath (a math), so we should see its
            // descendants (dec) AND math properties, NOT blocked by pathPartHasIndex.
            {
                const source = `<repeatForSequence name="rep"><math name="myMath">x<math name="dec">y</math></math></repeatForSequence>\n$rep[1].myMath.`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                // Descendant of myMath
                expect(labels).toContain("dec");
                // Properties of math should also appear
                const propertyItems = items.filter(
                    (i) => i.kind === CompletionItemKind.Property,
                );
                expect(propertyItems.length).toBeGreaterThan(0);
            }

            // $rep.myMath. — unindexed traversal through takesIndex composite
            // should be blocked.
            {
                const source = `<repeatForSequence name="rep"><math name="myMath">x<math name="dec">y</math></math></repeatForSequence>\n$rep.myMath.`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                expect(items).toHaveLength(0);
            }

            // $sec.rep[1]. — the resolved terminal segment ("rep") is a
            // takesIndex composite AND carries an index.  This is an indirect
            // path (three segments: sec / rep[1] / <empty>), so rep is not
            // the root of the ref.  The behavior should be the same as the
            // direct case $rep[1].: the index means the cursor is after a
            // replacement child of unknown type, so descendant names should
            // be offered but schema properties of repeatForSequence should
            // NOT (they describe the composite, not its unknown replacement).
            {
                const source = `<section name="sec"><repeatForSequence name="rep"><math name="myMath">x</math></repeatForSequence></section>\n$sec.rep[1].`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                // Descendant names of the replacement are visible.
                expect(labels).toContain("myMath");
                // Schema properties of repeatForSequence must NOT appear —
                // the indexed form dereferences a replacement child of
                // unknown component type.
                const propertyItems = items.filter(
                    (i) => i.kind === CompletionItemKind.Property,
                );
                expect(propertyItems).toHaveLength(0);
            }

            // The same indexed traversal should also work when the ref is
            // resolved from inside an enclosing element whose node becomes the
            // origin in the Rust resolver output.
            {
                const source = `<section name="sec"><repeatForSequence name="rep"><math name="myMath">x<math name="dec">y</math></math></repeatForSequence>\n$rep[1].myMath.</section>`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset =
                    source.indexOf("$rep[1].myMath.") +
                    "$rep[1].myMath.".length;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("dec");
                const propertyItems = items.filter(
                    (i) => i.kind === CompletionItemKind.Property,
                );
                expect(propertyItems.length).toBeGreaterThan(0);
            }

            // Two nested takesIndex composites should both require indices,
            // and the doubly-indexed path should still resolve through to the
            // concrete math target and its descendants.
            {
                const source = `<repeat name="outer" numRepetitions="2"><repeatForSequence name="inner"><math name="myMath">x<math name="dec">y</math></math></repeatForSequence></repeat>\n$outer[1].inner[1].myMath.`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("dec");
                const propertyItems = items.filter(
                    (i) => i.kind === CompletionItemKind.Property,
                );
                expect(propertyItems.length).toBeGreaterThan(0);
            }

            // If the first takesIndex segment is indexed but a later
            // takesIndex segment is not, traversal should still be blocked at
            // the unindexed segment.
            {
                const source = `<repeat name="outer" numRepetitions="2"><repeatForSequence name="inner"><math name="myMath">x<math name="dec">y</math></math></repeatForSequence></repeat>\n$outer[1].inner.myMath.`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                expect(items).toHaveLength(0);
            }

            // $rep[1]. should include valueName/indexName as completions
            {
                const source = `<repeat name="rep" valueName="v" indexName="i"><math name="m">x</math></repeat>\n$rep[1].`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("v");
                expect(labels).toContain("i");
                expect(labels).toContain("m");
            }

            // $rep. (no index) should NOT include valueName/indexName
            {
                const source = `<repeat name="rep" valueName="v" indexName="i"><math name="m">x</math></repeat>\n$rep.`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).not.toContain("v");
                expect(labels).not.toContain("i");
                // descendants also suppressed without index
                expect(labels).not.toContain("m");
            }
        });

        it("Blocks completions when a non-takesIndex segment has a spurious index", async () => {
            // $sec[1].myP. — section is not takesIndex, so the [1] is invalid.
            // Prefer false negative over false positive.
            {
                const source = `<section name="sec"><p name="myP">hello</p></section>\n$sec[1].myP.`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                expect(items).toHaveLength(0);
            }

            // $myMath[1]. — math is not takesIndex, so the [1] is invalid.
            {
                const source = `<math name="myMath">x</math>\n$myMath[1].`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                expect(items).toHaveLength(0);
            }

            // $rep[1].myMath[1]. — rep (repeat) is takesIndex so $rep[1] is
            // valid. But myMath (math) is not takesIndex, so myMath[1] is
            // invalid and completions should be suppressed.
            {
                const source = `<repeat name="rep"><math name="myMath">x</math></repeat>\n$rep[1].myMath[1].`;
                const { completer } = await createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = await completer.getCompletionItems(offset);
                expect(items).toHaveLength(0);
            }
        });

        it("select without index suppresses descendant-name completions", async () => {
            // For direct member access ($sel.), select is takesIndex so
            // descendant names should be suppressed.  Use `numToSelect="2"`
            // so the issue #1181 implicit-single-index shorthand does NOT
            // apply (otherwise the resolver correctly surfaces `m` as a
            // descendant, like `$sel[1].m`).
            const source = `<select name="sel" numToSelect="2"><option><math name="m">1</math></option><option><math name="m">2</math></option></select>\n$sel.`;
            const { adapter } = await createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = await resolver({
                offset: source.indexOf("$sel.") + "$sel.".length,
                pathParts: ["sel", ""],
            });
            expect(result).not.toBeNull();
            // select takesIndex, so without per-part index info, descendants suppressed
            expect(result!.visibleDescendantNames).toEqual([]);
        });

        // ---- $$ function refs and partial resolution ----

        it("$$ triggers refName completions just like $", async () => {
            // $$f should show named elements
            {
                const source = `<function name="f">x^2</function>\n$$f`;
                const { completer } = await createCompleterWithAdapter(source);
                const items = await completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("f");
            }

            // $$ alone should trigger completions
            {
                const source = `<function name="f">x^2</function>\n$$`;
                const { completer } = await createCompleterWithAdapter(source);
                const items = await completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("f");
            }
        });

        it("partial resolution returns null node when path is invalid", async () => {
            // $s.nonexistent. — "s" resolves to section, "nonexistent" fails.
            // The path is invalid so no completions should be offered.
            const source = `<section name="s"><p name="p1" /></section>\n$s.nonexistent.`;
            const { adapter } = await createCoreAndAdapter(source);
            const resolver = adapter.createResolver();

            const result = await resolver({
                offset:
                    source.indexOf("$s.nonexistent.") +
                    "$s.nonexistent.".length,
                pathParts: ["s", "nonexistent", ""],
            });

            expect(result).not.toBeNull();
            // Node is null — invalid path
            expect(result!.node).toBeNull();
            // Unresolved parts reported
            expect(result!.unresolvedPathParts.length).toBeGreaterThan(0);
        });

        // ---- repeatForSequence / else visibility ----

        it("isNameAddressableFromOffset returns false for names inside repeatForSequence from outside", async () => {
            const source = `<repeatForSequence name="rep"><math name="myMath">x</math></repeatForSequence>\n$my`;
            const { adapter } = await createCoreAndAdapter(source);

            const outsideOffset = source.lastIndexOf("$my") + 1;
            expect(
                await adapter.isNameAddressableFromOffset(
                    outsideOffset,
                    "myMath",
                ),
            ).toBe(false);
            expect(
                await adapter.isNameAddressableFromOffset(outsideOffset, "rep"),
            ).toBe(true);
        });

        it("names inside repeatForSequence are accessible from INSIDE", async () => {
            const source = `<repeatForSequence name="rep"><math name="myMath">x</math>$my</repeatForSequence>`;
            const { adapter } = await createCoreAndAdapter(source);

            const insideOffset = source.indexOf("$my") + 1;
            expect(
                await adapter.isNameAddressableFromOffset(
                    insideOffset,
                    "myMath",
                ),
            ).toBe(true);
        });

        it("end-to-end: getCompletionItems omits names inside repeatForSequence from outside", async () => {
            const source = `<repeatForSequence name="rep"><math name="myMath">x</math></repeatForSequence>\n$`;
            const { completer } = await createCompleterWithAdapter(source);
            const items = await completer.getCompletionItems(source.length);
            const labels = items.map((i) => i.label);
            expect(labels).toContain("rep");
            expect(labels).toContain("rep[]");
            expect(labels).not.toContain("myMath");
        });

        it("isNameAddressableFromOffset returns false for names inside else from outside", async () => {
            // Each name is declared in only one branch, so it names nothing
            // from outside (`doenet-w0183`) and is left out.
            const source = `<conditionalContent name="cc"><case condition="true"><text name="caseChild">a</text></case><else><text name="elseChild">b</text></else></conditionalContent>\n$`;
            const { adapter } = await createCoreAndAdapter(source);

            const outsideOffset = source.lastIndexOf("$") + 1;
            expect(
                await adapter.isNameAddressableFromOffset(
                    outsideOffset,
                    "caseChild",
                ),
            ).toBe(false);
            expect(
                await adapter.isNameAddressableFromOffset(
                    outsideOffset,
                    "elseChild",
                ),
            ).toBe(false);
            expect(
                await adapter.isNameAddressableFromOffset(outsideOffset, "cc"),
            ).toBe(true);
        });

        it("member completion resolves a name that repeats once per sibling scope", async () => {
            // The same `name="P"` appears in each <exercise>.  Resolution has
            // to start from inside the exercise holding the cursor, or the
            // parent-scope walk sees both points and throws NonUniqueReferent.
            const source = `<exercise><graph><point name="P">(3,4)</point></graph>$P.</exercise>\n<exercise><graph><point name="P" styleNumber="2">(2,2)</point></graph>$P.</exercise>`;
            const { completer } = await createCompleterWithAdapter(source);

            const secondExerciseStart = source.lastIndexOf("<exercise>");
            const cases = [
                {
                    refOffset: source.indexOf("$P.") + 3,
                    pointOffset: source.indexOf("<point"),
                },
                {
                    refOffset: source.lastIndexOf("$P.") + 3,
                    pointOffset: source.lastIndexOf("<point"),
                },
            ];
            // Guard the fixture: the two points really are in different
            // exercises, so the offset assertions below can tell them apart.
            expect(cases[0].pointOffset).toBeLessThan(secondExerciseStart);
            expect(cases[1].pointOffset).toBeGreaterThan(secondExerciseStart);

            for (const { refOffset, pointOffset } of cases) {
                const resolved =
                    await completer.resolveRefMemberContainerAtOffset(
                        refOffset,
                        ["P", ""],
                        [false, false],
                    );
                expect(resolved.node?.name).toBe("point");
                // The point in the *same* exercise as the reference, not the other.
                expect(resolved.node?.position?.start?.offset).toBe(
                    pointOffset,
                );
                expect(resolved.unresolvedPathParts).toEqual([]);

                const items = await completer.getCompletionItems(refOffset);
                expect(items.map((item) => item.label)).toContain(
                    "styleDescription",
                );
            }
        });
    },
);
