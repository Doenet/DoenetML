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

function createCoreAndAdapter(source: string) {
    const core = PublicDoenetMLCore.new() as RustResolverCore;
    core.set_flags("{}");
    const sourceObj = new DoenetSourceObject(source);
    const adapter = new RustResolverAdapter(sourceObj, { core });
    return { core, sourceObj, adapter };
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

        it("Rust resolver produces same result as JS fallback for basic refs", () => {
            const source = `<section name="sec"><p name="para">stuff</p></section>\n$sec.`;
            const sourceObj = new DoenetSourceObject(source);

            const acJS = new AutoCompleter();
            acJS.setSource(source);
            const jsResult = acJS.resolveRefMemberContainerAtOffset(
                source.indexOf("$sec.") + 5,
                ["sec", ""],
            );

            const core = PublicDoenetMLCore.new() as RustResolverCore;
            core.set_flags("{}");
            const adapter = new RustResolverAdapter(sourceObj, { core });
            const resolver = adapter.createResolver();
            const rustResult = resolver({
                offset: source.indexOf("$sec.") + 5,
                pathParts: ["sec", ""],
            });

            expect(rustResult).not.toBeNull();
            expect(jsResult.node?.type).toBe("element");
            expect(rustResult!.node?.type).toBe("element");
            expect(
                (jsResult.node as any)?.attributes?.name?.children?.[0]?.value,
            ).toBe("sec");
            expect(
                (rustResult!.node as any)?.attributes?.name?.children?.[0]
                    ?.value,
            ).toBe("sec");
            expect(rustResult!.unresolvedPathParts).toEqual(
                jsResult.unresolvedPathParts,
            );
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

        it("visibleDescendantNames includes hidden names when resolved via the repeat itself", () => {
            // When resolving $sec.rep., the <repeat> is the container,
            // and "inside" IS visible from it.
            const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$sec.rep.`;
            const { adapter } = createCoreAndAdapter(source);

            const resolver = adapter.createResolver();
            const result = resolver({
                offset: source.indexOf("$sec.rep.") + "$sec.rep.".length,
                pathParts: ["sec", "rep", ""],
            });

            expect(result).not.toBeNull();
            expect(result!.visibleDescendantNames).toBeDefined();
            // "inside" IS visible when accessed through the repeat
            expect(result!.visibleDescendantNames).toContain("inside");
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

            function makeCompleterWithAdapter(source: string) {
                const completer = new AutoCompleter(source);
                const core = PublicDoenetMLCore.new() as RustResolverCore;
                core.set_flags("{}");
                const adapter = new RustResolverAdapter(completer.sourceObj, {
                    core,
                });
                completer.setResolveRefMemberContainerAtOffset(
                    adapter.createResolver(),
                );
                completer.setIsNameAddressable((offset, name) =>
                    adapter.isNameAddressableFromOffset(offset, name),
                );
                return { completer, adapter };
            }

            // --- Outside the repeat: bare `$` lists all names ---
            {
                // Use bare `$` so prefix is empty and all names are returned.
                const source = `<section name="sec"><repeat name="rep"><math name="inside">x</math></repeat></section>\n$`;
                const { completer } = makeCompleterWithAdapter(source);

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
                const { completer } = makeCompleterWithAdapter(source);

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
                const { completer } = makeCompleterWithAdapter(source);

                const offset = source.indexOf("$ins") + "$ins".length;
                const items = completer.getCompletionItems(offset);
                const labels = items.map((i) => i.label);
                expect(labels).toContain("inside");
            }
        });
    },
);
