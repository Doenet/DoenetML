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
import type { RustResolverCore } from "../src";
import { doenetSchema } from "@doenet/static-assets/schema";
import { CompletionItemKind } from "vscode-languageserver/browser";

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
    mod.initSync(wasmBytes);
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

function createCoreAndAdapter(source: string) {
    const core = PublicDoenetMLCore.new() as RustResolverCore;
    core.set_flags("{}");
    const sourceObj = new DoenetSourceObject(source);
    const adapter = new RustResolverAdapter(sourceObj, {
        core,
        takesIndexComponentTypes: takesIndexSet,
    });
    return { core, sourceObj, adapter };
}

function createCompleterWithAdapter(
    source: string,
    options?: { includeAdditionalRefNames?: boolean },
) {
    const sourceObj = new DoenetSourceObject();
    sourceObj.setSource(source + " ");
    const core = PublicDoenetMLCore.new() as RustResolverCore;
    core.set_flags("{}");
    const adapter = new RustResolverAdapter(sourceObj, {
        core,
        takesIndexComponentTypes: takesIndexSet,
    });
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
        it("simple $name. resolution returns the named element", () => {
            const source = `<section name="s1"><p name="p1">hello</p></section>\n$s1.`;
            const { adapter } = createCoreAndAdapter(source);

            expect(adapter.isEnabled()).toBe(true);

            const resolver = adapter.createResolver();
            const result = resolver({
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

        it("multi-level $a.b. resolves through nested names", () => {
            const source = `<section name="outer"><section name="inner"><p name="target">text</p></section></section>\n$outer.inner.`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = resolver({
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

        it("non-existent ref returns null", () => {
            const source = `<section name="s1"><p name="p1" /></section>\n$noexist.`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = resolver({
                offset: source.indexOf("$noexist.") + "$noexist.".length,
                pathParts: ["noexist", ""],
            });

            expect(result).toBeNull();
        });

        it("updateSource re-syncs and resolves correctly", () => {
            const source1 = `<section name="s1"><p name="p1" /></section>\n$s1.`;
            const { adapter } = createCoreAndAdapter(source1);

            const source2 = `<section name="s2"><p name="p1" /></section>\n$s2.`;
            const sourceObj2 = new DoenetSourceObject(source2);
            adapter.updateSource(sourceObj2);

            const resolver = adapter.createResolver();

            const oldResult = resolver({
                offset: source2.indexOf("$s2.") + 4,
                pathParts: ["s1", ""],
            });
            expect(oldResult).toBeNull();

            const newResult = resolver({
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

        it("Rust resolver resolves basic refs", () => {
            const source = `<section name="sec"><p name="para">stuff</p></section>\n$sec.`;
            const sourceObj = new DoenetSourceObject(source);

            const core = PublicDoenetMLCore.new() as RustResolverCore;
            core.set_flags("{}");
            const adapter = new RustResolverAdapter(sourceObj, { core });
            const resolver = adapter.createResolver();
            const rustResult = resolver({
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

        it("visibleDescendantNames respects ChildrenInvisibleToTheirGrandparents for <repeat>", () => {
            // "inside" is a child of <repeat>, which is
            // ChildrenInvisibleToTheirGrandparents.  From the section's
            // perspective, "inside" is NOT directly visible — it must be
            // reached via $sec.rep.inside, not $sec.inside.
            const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$sec.`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = resolver({
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

        it("visibleDescendantNames is empty for takesIndex element (repeat)", () => {
            // When resolving $sec.rep., the <repeat> is the container,
            // but repeat has takesIndex so descendants should NOT be
            // offered as dot-completions (use $rep[1].inside instead).
            const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$sec.rep.`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = resolver({
                offset: source.indexOf("$sec.rep.") + "$sec.rep.".length,
                pathParts: ["sec", "rep", ""],
            });

            expect(result).not.toBeNull();
            expect(result!.visibleDescendantNames).toBeDefined();
            // takesIndex means no dot-access descendants
            expect(result!.visibleDescendantNames).toEqual([]);
        });

        it("isNameAddressableFromOffset filters $name completions by visibility", () => {
            // "inside" is a child of <repeat>, which has
            // ChildrenInvisibleToTheirGrandparents.  From OUTSIDE the repeat,
            // $inside should NOT be addressable.  From INSIDE, it should.
            const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math>$ins</repeat></section>\n$ins`;
            const { adapter } = createCoreAndAdapter(source);

            // Cursor at the trailing "$ins" (outside repeat) — "inside" is NOT addressable
            const outsideOffset = source.lastIndexOf("$ins") + 1;
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "inside"),
            ).toBe(false);
            // "sec" and "rep" should still be addressable from outside
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "sec"),
            ).toBe(true);
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "rep"),
            ).toBe(true);

            // Cursor at the first "$ins" (inside repeat) — "inside" IS addressable
            const insideOffset = source.indexOf("$ins") + 1;
            expect(
                adapter.isNameAddressableFromOffset(insideOffset, "inside"),
            ).toBe(true);
        });

        it("getCompletionItems excludes $inside outside repeat but includes it inside repeat", () => {
            // End-to-end test: wire isNameAddressable into an AutoCompleter
            // and verify the actual completion list.

            // --- Outside the repeat: bare `$` lists all names ---
            {
                // Use bare `$` so prefix is empty and all names are returned.
                const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$`;
                const { completer } = createCompleterWithAdapter(source);

                const items = completer.getCompletionItems(source.length);
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
                const { completer } = createCompleterWithAdapter(source);

                const items = completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                // "inside" is the only name matching prefix "ins", but it's
                // invisible from outside the repeat → no completions.
                expect(labels).not.toContain("inside");
                expect(labels).toHaveLength(0);
            }

            // --- Inside the repeat: `$ins` matches "inside" ---
            {
                const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math>$ins</repeat></section>`;
                const { completer } = createCompleterWithAdapter(source);

                const offset = source.indexOf("$ins") + "$ins".length;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("inside");
            }
        });

        it("$name[] snippet offered for takesIndex elements (repeat, select)", () => {
            // "rep" is a repeat (takesIndex) — should offer "rep[]" snippet
            {
                const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$rep`;
                const { completer } = createCompleterWithAdapter(source);
                const items = completer.getCompletionItems(source.length);
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
                const { completer } = createCompleterWithAdapter(source);
                const items = completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("sec");
                expect(labels).not.toContain("sec[]");
            }
        });

        it("repeat valueName/indexName appear in completions inside repeat", () => {
            // Inside repeat with valueName="v" indexName="i": $v and $i should appear
            {
                const source = `<repeat valueName="v" indexName="i"><math>$</math></repeat>`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.indexOf("$") + 1;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("v");
                expect(labels).toContain("i");
            }

            // Outside repeat: $v should NOT appear
            {
                const source = `<repeat valueName="v" indexName="i"><math>x</math></repeat>\n$`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const items = completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).not.toContain("v");
                expect(labels).not.toContain("i");
            }
        });

        it("repeatForSequence valueName/indexName appear in completions", () => {
            // repeatForSequence with valueName/indexName
            {
                const source = `<repeatForSequence valueName="val" indexName="idx"><math>$</math></repeatForSequence>`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.indexOf("$") + 1;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("val");
                expect(labels).toContain("idx");
            }

            // Only valueName specified
            {
                const source = `<repeat valueName="v"><math>$</math></repeat>`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.indexOf("$") + 1;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("v");
                // Default indexName is not injected
                expect(labels).not.toContain("i");
            }

            // Nested repeats: inner names visible inside, outer names also visible
            {
                const source = `<repeat valueName="outer"><repeat valueName="inner"><math>$</math></repeat></repeat>`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.indexOf("$") + 1;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("inner");
                expect(labels).toContain("outer");
            }

            // Between nested repeats: inner name NOT visible, outer IS
            {
                const source = `<repeat valueName="outer"><repeat valueName="inner"><math>x</math></repeat>$</repeat>`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.indexOf("$") + 1;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("outer");
                expect(labels).not.toContain("inner");
            }
        });

        it("does not crash on empty source", () => {
            const { adapter } = createCoreAndAdapter("");
            expect(adapter.isEnabled()).toBe(false);
        });

        it("does not crash on source with no elements (text only)", () => {
            const { adapter } = createCoreAndAdapter("a");
            expect(adapter.isEnabled()).toBe(false);
        });

        it("does not crash on incomplete element markup", () => {
            const { adapter } = createCoreAndAdapter("<a");
            // May or may not be enabled depending on how the Rust core
            // handles the incomplete element, but must not throw.
            expect(typeof adapter.isEnabled()).toBe("boolean");
        });

        it("recovers after blank document receives first element", () => {
            // Simulates: blank document → user types "<p>"
            const core = PublicDoenetMLCore.new() as RustResolverCore;
            core.set_flags("{}");
            const sourceObj = new DoenetSourceObject("");
            const adapter = new RustResolverAdapter(sourceObj, { core });
            expect(adapter.isEnabled()).toBe(false);

            // User types "<p name='x'>hi</p>"
            sourceObj.setSource('<p name="x">hi</p>');
            adapter.updateSource(sourceObj);
            expect(adapter.isEnabled()).toBe(true);
        });

        // ---- conditionalContent / select sugar visibility ----

        it("isNameAddressableFromOffset returns false for names inside sugared conditionalContent from outside", () => {
            // In raw DAST, <math name="inside"> is a direct child of <conditionalContent>.
            // At runtime, sugar wraps it in <case><group>…</group></case>, hiding it.
            const source = `<conditionalContent name="cc" condition="$x"><math name="inside">x</math></conditionalContent>\n$ins`;
            const { adapter } = createCoreAndAdapter(source);

            const outsideOffset = source.lastIndexOf("$ins") + 1;
            // "inside" should NOT be addressable from outside cc
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "inside"),
            ).toBe(false);
            // "cc" SHOULD be addressable from outside
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "cc"),
            ).toBe(true);
        });

        it("isNameAddressableFromOffset returns false for names inside sugared select from outside", () => {
            const source = `<select name="sel"><math name="x">1</math><math name="y">2</math></select>\n$x`;
            const { adapter } = createCoreAndAdapter(source);

            const outsideOffset = source.lastIndexOf("$x") + 1;
            // "x" and "y" should NOT be addressable from outside select
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "x"),
            ).toBe(false);
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "y"),
            ).toBe(false);
            // "sel" SHOULD be addressable
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "sel"),
            ).toBe(true);
        });

        it("names inside conditionalContent are accessible from INSIDE the cc", () => {
            const source = `<conditionalContent name="cc" condition="$x"><math name="inside">x</math>$ins</conditionalContent>`;
            const { adapter } = createCoreAndAdapter(source);

            const insideOffset = source.indexOf("$ins") + 1;
            expect(
                adapter.isNameAddressableFromOffset(insideOffset, "inside"),
            ).toBe(true);
        });

        it("explicit case name is still addressable from outside conditionalContent", () => {
            const source = `<conditionalContent name="cc"><case name="positiveCase" condition="true"><text>hello</text></case></conditionalContent>\n$pos`;
            const { adapter } = createCoreAndAdapter(source);

            const outsideOffset = source.lastIndexOf("$pos") + 1;
            // "positiveCase" is a direct child of cc — should be addressable
            expect(
                adapter.isNameAddressableFromOffset(
                    outsideOffset,
                    "positiveCase",
                ),
            ).toBe(true);
            // "cc" also addressable
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "cc"),
            ).toBe(true);
        });

        it("end-to-end: getCompletionItems omits names inside sugared cc from outside", () => {
            // Outside cc: "inside" should not be offered
            {
                const source = `<conditionalContent name="cc" condition="$x"><math name="inside">x</math></conditionalContent>\n$`;
                const { completer } = createCompleterWithAdapter(source);
                const items = completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("cc");
                expect(labels).not.toContain("inside");
            }

            // Outside select: "x" should not be offered
            {
                const source = `<select name="sel"><math name="x">1</math></select>\n$`;
                const { completer } = createCompleterWithAdapter(source);
                const items = completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("sel");
                expect(labels).not.toContain("x");
            }
        });

        it("visibleDescendantNames for $cc. includes names from explicit case children", () => {
            // <text name="animal"> is inside <case>, which normally blocks
            // visibility in the Rust resolver.  But for cc member access,
            // we walk through case/else transparently.
            const source = `<conditionalContent name="cc"><case condition="true"><text name="animal">dog</text></case><else><text name="animal">cat</text></else></conditionalContent>\n$cc.`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = resolver({
                offset: source.indexOf("$cc.") + "$cc.".length,
                pathParts: ["cc", ""],
            });

            expect(result).not.toBeNull();
            expect(result!.visibleDescendantNames).toBeDefined();
            expect(result!.visibleDescendantNames).toContain("animal");
        });

        it("visibleDescendantNames for $cc. includes names from mixed case children", () => {
            // Two cases with different unique names + one shared name
            const source = `<conditionalContent name="cc"><case condition="true"><text name="a">1</text><text name="shared">s</text></case><case condition="false"><text name="b">2</text><text name="shared">s</text></case></conditionalContent>\n$cc.`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = resolver({
                offset: source.indexOf("$cc.") + "$cc.".length,
                pathParts: ["cc", ""],
            });

            expect(result).not.toBeNull();
            expect(result!.visibleDescendantNames).toContain("a");
            expect(result!.visibleDescendantNames).toContain("b");
            expect(result!.visibleDescendantNames).toContain("shared");
        });

        it("visibleDescendantNames for $cc. excludes ambiguous names within a single case", () => {
            // "dup" appears twice in the SAME case → not contributed by that case
            // It appears once in the other case → still contributed
            const source = `<conditionalContent name="cc"><case condition="true"><text name="dup">1</text><text name="dup">2</text></case><case condition="false"><text name="dup">3</text></case></conditionalContent>\n$cc.`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = resolver({
                offset: source.indexOf("$cc.") + "$cc.".length,
                pathParts: ["cc", ""],
            });

            expect(result).not.toBeNull();
            // "dup" is unique in the second case, so it should be included
            expect(result!.visibleDescendantNames).toContain("dup");
        });

        it("visibleDescendantNames for sugared cc (no explicit case) includes children", () => {
            // Sugared form: children are direct, not wrapped in case/else
            const source = `<conditionalContent name="cc" condition="true"><math name="m1">1</math><math name="m2">2</math></conditionalContent>\n$cc.`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = resolver({
                offset: source.indexOf("$cc.") + "$cc.".length,
                pathParts: ["cc", ""],
            });

            expect(result).not.toBeNull();
            expect(result!.visibleDescendantNames).toContain("m1");
            expect(result!.visibleDescendantNames).toContain("m2");
        });

        // ---- Index bracket parsing & pathPartHasIndex wiring ----

        it("$sel[1]. with pathPartHasIndex shows descendants inside select options", () => {
            const source = `<select name="sel"><option><math name="a">1</math></option><option><math name="b">2</math></option></select>\n$sel[1].`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            // Without per-part index info (bare $sel.) — descendants suppressed
            const noIndex = resolver({
                offset: source.indexOf("$sel[1].") + "$sel[1].".length,
                pathParts: ["sel", ""],
            });
            expect(noIndex).not.toBeNull();
            expect(noIndex!.visibleDescendantNames).toEqual([]);

            // With per-part index info — descendants should be visible
            const withIndex = resolver({
                offset: source.indexOf("$sel[1].") + "$sel[1].".length,
                pathParts: ["sel", ""],
                pathPartHasIndex: [true, false],
            });
            expect(withIndex).not.toBeNull();
            expect(withIndex!.visibleDescendantNames).toContain("a");
            expect(withIndex!.visibleDescendantNames).toContain("b");
        });

        it("$rep[2]. with pathPartHasIndex shows descendants inside repeat", () => {
            const source = `<repeat name="rep" numRepetitions="3"><math name="inner">x</math></repeat>\n$rep[2].`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            // Without per-part index info — descendants suppressed
            const noIndex = resolver({
                offset: source.indexOf("$rep[2].") + "$rep[2].".length,
                pathParts: ["rep", ""],
            });
            expect(noIndex).not.toBeNull();
            expect(noIndex!.visibleDescendantNames).toEqual([]);

            // With per-part index info — descendants visible
            const withIndex = resolver({
                offset: source.indexOf("$rep[2].") + "$rep[2].".length,
                pathParts: ["rep", ""],
                pathPartHasIndex: [true, false],
            });
            expect(withIndex).not.toBeNull();
            expect(withIndex!.visibleDescendantNames).toContain("inner");
        });

        it("context parser strips bracket indices and sets pathPartHasIndex", () => {
            // $sel[1]. should show descendants of select option children
            // but NOT properties of select (the referent is a child, not the select)
            {
                const source = `<select name="sel"><option><math name="a">1</math></option><option><math name="b">2</math></option></select>\n$sel[1].`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                // Should include descendant names from inside options
                expect(labels).toContain("a");
                expect(labels).toContain("b");
                // Should NOT include properties of the select element itself
                const kinds = items.map((i) => i.kind);
                expect(kinds).not.toContain(CompletionItemKind.Property);
            }

            // $sel. (no index) should NOT show descendants, only properties
            {
                const source = `<select name="sel"><option><math name="a">1</math></option></select>\n$sel.`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).not.toContain("a");
            }

            // $sec[1]. where sec is a section (NOT takesIndex) — should return nothing
            {
                const source = `<section name="sec"><math name="m">x</math></section>\n$sec[1].`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = completer.getCompletionItems(offset);
                expect(items).toHaveLength(0);
            }

            // $rep[1].myMath. — deeper path through indexed composite
            // The resolved node is myMath (a math), so we should see its
            // descendants (dec) AND math properties, NOT blocked by pathPartHasIndex.
            {
                const source = `<repeatForSequence name="rep"><math name="myMath">x<math name="dec">y</math></math></repeatForSequence>\n$rep[1].myMath.`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = completer.getCompletionItems(offset);
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
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = completer.getCompletionItems(offset);
                expect(items).toHaveLength(0);
            }

            // $rep[1]. should include valueName/indexName as completions
            {
                const source = `<repeat name="rep" valueName="v" indexName="i"><math name="m">x</math></repeat>\n$rep[1].`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("v");
                expect(labels).toContain("i");
                expect(labels).toContain("m");
            }

            // $rep. (no index) should NOT include valueName/indexName
            {
                const source = `<repeat name="rep" valueName="v" indexName="i"><math name="m">x</math></repeat>\n$rep.`;
                const { completer } = createCompleterWithAdapter(source, {
                    includeAdditionalRefNames: true,
                });
                const offset = source.length;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).not.toContain("v");
                expect(labels).not.toContain("i");
                // descendants also suppressed without index
                expect(labels).not.toContain("m");
            }
        });

        it("select without index suppresses descendant-name completions", () => {
            // For direct member access ($sel.), select is takesIndex so
            // descendant names should be suppressed.
            const source = `<select name="sel"><option><math name="m">1</math></option></select>\n$sel.`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = resolver({
                offset: source.indexOf("$sel.") + "$sel.".length,
                pathParts: ["sel", ""],
            });
            expect(result).not.toBeNull();
            // select takesIndex, so without per-part index info, descendants suppressed
            expect(result!.visibleDescendantNames).toEqual([]);
        });

        // ---- $$ function refs and partial resolution ----

        it("$$ triggers refName completions just like $", () => {
            // $$f should show named elements
            {
                const source = `<function name="f">x^2</function>\n$$f`;
                const { completer } = createCompleterWithAdapter(source);
                const items = completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("f");
            }

            // $$ alone should trigger completions
            {
                const source = `<function name="f">x^2</function>\n$$`;
                const { completer } = createCompleterWithAdapter(source);
                const items = completer.getCompletionItems(source.length);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("f");
            }
        });

        it("partial resolution returns null node when path is invalid", () => {
            // $s.nonexistent. — "s" resolves to section, "nonexistent" fails.
            // The path is invalid so no completions should be offered.
            const source = `<section name="s"><p name="p1" /></section>\n$s.nonexistent.`;
            const { adapter } = createCoreAndAdapter(source);
            const resolver = adapter.createResolver();

            const result = resolver({
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

        it("isNameAddressableFromOffset returns false for names inside repeatForSequence from outside", () => {
            const source = `<repeatForSequence name="rep"><math name="myMath">x</math></repeatForSequence>\n$my`;
            const { adapter } = createCoreAndAdapter(source);

            const outsideOffset = source.lastIndexOf("$my") + 1;
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "myMath"),
            ).toBe(false);
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "rep"),
            ).toBe(true);
        });

        it("names inside repeatForSequence are accessible from INSIDE", () => {
            const source = `<repeatForSequence name="rep"><math name="myMath">x</math>$my</repeatForSequence>`;
            const { adapter } = createCoreAndAdapter(source);

            const insideOffset = source.indexOf("$my") + 1;
            expect(
                adapter.isNameAddressableFromOffset(insideOffset, "myMath"),
            ).toBe(true);
        });

        it("end-to-end: getCompletionItems omits names inside repeatForSequence from outside", () => {
            const source = `<repeatForSequence name="rep"><math name="myMath">x</math></repeatForSequence>\n$`;
            const { completer } = createCompleterWithAdapter(source);
            const items = completer.getCompletionItems(source.length);
            const labels = items.map((i) => i.label);
            expect(labels).toContain("rep");
            expect(labels).toContain("rep[]");
            expect(labels).not.toContain("myMath");
        });

        it("isNameAddressableFromOffset returns false for names inside else from outside", () => {
            // Raw DAST keeps <else> as-is (sugar is not applied in the LSP).
            // Adding "else" to CHILDREN_INVISIBLE means its children are
            // hidden from grandparent scopes in the resolver.
            const source = `<conditionalContent name="cc"><case condition="true"><text name="caseChild">a</text></case><else><text name="elseChild">b</text></else></conditionalContent>\n$`;
            const { adapter } = createCoreAndAdapter(source);

            const outsideOffset = source.lastIndexOf("$") + 1;
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "caseChild"),
            ).toBe(false);
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "elseChild"),
            ).toBe(false);
            expect(
                adapter.isNameAddressableFromOffset(outsideOffset, "cc"),
            ).toBe(true);
        });
    },
);
