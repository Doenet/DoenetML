/**
 * Cross-layer integration tests for the implicit-single-index shorthand on
 * the select family.  Issue #1181.
 *
 * The rule: when a `<select numToSelect="1">` (or any select-family member
 * with the count attribute absent or trimmed-equal to "1") is referenced as
 * `$s.t`, the autocomplete dropdown surfaces descendant names and the
 * context-help panel returns the same help payload it would for `$s[1].t`.
 *
 * These tests run against the **real** WASM resolver so the autocomplete and
 * context-help paths share an identical resolver view — that's what makes the
 * "agree-by-construction" claim from the issue actually hold.  The companion
 * unit tests in `test/select-family.test.ts` cover the textual predicate in
 * isolation.
 */
import { describe, expect, it } from "vitest";
import { DoenetSourceObject } from "../src/doenet-source-object";
import { AutoCompleter, RustResolverAdapter } from "../src";
import type { ResolverCore } from "../src";
import { computeContextHelp } from "../src/context-help/computeContextHelp";
import { doenetSchema } from "@doenet/static-assets/schema";
import { CompletionItemKind } from "vscode-languageserver/browser";

// --------------- WASM bootstrap (skips if unavailable) ---------------

let PublicDoenetMLCore: any;
let wasmAvailable = false;

try {
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

const takesIndexSet = new Set(
    doenetSchema.elements
        .filter((el: any) => el.takesIndex)
        .map((el: any) => el.name as string),
);

function wrapWasmCore(wasm: any): ResolverCore {
    return {
        setSource: async ({ source, dast }) => wasm.set_source(dast, source),
        setFlags: async ({ flags }) => wasm.set_flags(JSON.stringify(flags)),
        returnDast: async () => wasm.return_dast(),
        resolvePath: async ({ path, origin, skipParentSearch }) =>
            wasm.resolve_path(path, origin, skipParentSearch),
    };
}

async function buildCompleter(source: string) {
    const sourceObj = new DoenetSourceObject(source);
    const completer = new AutoCompleter(source);
    const core = wrapWasmCore(PublicDoenetMLCore.new());
    const adapter = new RustResolverAdapter(sourceObj, {
        core,
        takesIndexComponentTypes: takesIndexSet,
    });
    await adapter.init();
    completer.setRustResolverAdapter(adapter);
    return { completer, adapter };
}

/** All completion labels at `offset` after autocomplete runs. */
async function completionLabels(source: string): Promise<string[]> {
    const { completer } = await buildCompleter(source);
    const items = await completer.getCompletionItems(source.length);
    return items.map((i) => i.label);
}

/** Just the descendant-reference labels (`CompletionItemKind.Reference`). */
async function referenceLabels(source: string): Promise<string[]> {
    const { completer } = await buildCompleter(source);
    const items = await completer.getCompletionItems(source.length);
    return items
        .filter((i) => i.kind === CompletionItemKind.Reference)
        .map((i) => i.label);
}

(wasmAvailable ? describe : describe.skip)(
    "implicit-single-index shorthand on the select family (#1181)",
    () => {
        // ---------- Layer 2: autocomplete ----------

        describe("autocomplete offers descendants for $s. when implicit-single-index applies", () => {
            it("default numToSelect (attribute absent)", async () => {
                const source = `<select name="s"><option><text name="t">a</text></option></select>\n$s.`;
                const labels = await referenceLabels(source);
                expect(labels).toContain("t");
            });

            it('numToSelect="1"', async () => {
                const source = `<select name="s" numToSelect="1"><option><text name="t">a</text></option></select>\n$s.`;
                const labels = await referenceLabels(source);
                expect(labels).toContain("t");
            });

            it('numToSelect=" 1 " (whitespace trimmed)', async () => {
                const source = `<select name="s" numToSelect=" 1 "><option><text name="t">a</text></option></select>\n$s.`;
                const labels = await referenceLabels(source);
                expect(labels).toContain("t");
            });

            it("selectFromSequence default", async () => {
                // selectFromSequence doesn't have named options to surface,
                // but the implicit-single-index decision must still flip the
                // takesIndex guard so the codepath doesn't suppress upstream
                // schema lookups.  Bare $s. still produces non-empty items.
                const source = `<selectFromSequence name="s" from="1" to="5" />\n$s.`;
                const labels = await completionLabels(source);
                expect(labels.length).toBeGreaterThan(0);
            });

            it("samplePrimeNumbers default uses numSamples", async () => {
                // numSamples (not numToSelect) is the count attribute here —
                // confirms the SELECT_FAMILY mapping picks the right one.
                // samplePrimeNumbers has no named-child shape, so the
                // implicit-single-index branch flips the takesIndex gate
                // but exposes zero descendant references; schema properties
                // still come through, so `labels` is non-empty.
                const source = `<samplePrimeNumbers name="s" />\n$s.`;
                const labels = await completionLabels(source);
                expect(labels.length).toBeGreaterThan(0);
                const refs = await referenceLabels(source);
                expect(refs).toEqual([]);
            });
        });

        describe("autocomplete continues to suppress descendants when the strict rule doesn't apply", () => {
            it('numToSelect="2"', async () => {
                const source = `<select name="s" numToSelect="2"><option><text name="t">a</text></option><option><text name="t">b</text></option></select>\n$s.`;
                const labels = await referenceLabels(source);
                expect(labels).not.toContain("t");
            });

            it('numToSelect="$n" (dynamic — strict rule rejects)', async () => {
                const source = `<number name="n">1</number><select name="s" numToSelect="$n"><option><text name="t">a</text></option></select>\n$s.`;
                const labels = await referenceLabels(source);
                expect(labels).not.toContain("t");
            });

            it('numToSelect="01" (non-canonical literal — strict rule rejects)', async () => {
                const source = `<select name="s" numToSelect="01"><option><text name="t">a</text></option></select>\n$s.`;
                const labels = await referenceLabels(source);
                expect(labels).not.toContain("t");
            });

            it('numToSelect="1.0" (non-canonical literal — strict rule rejects)', async () => {
                const source = `<select name="s" numToSelect="1.0"><option><text name="t">a</text></option></select>\n$s.`;
                const labels = await referenceLabels(source);
                expect(labels).not.toContain("t");
            });

            it('NumToSelect="2" (non-canonical attribute case) still rejects — case-insensitive lookup', async () => {
                // Worker resolves attribute names case-insensitively, so a
                // case-sensitive DAST lookup would mis-treat this as
                // "attribute absent" → shorthand applies → descendants
                // surfaced that the worker won't resolve.  The shared
                // case-insensitive helper closes that gap.
                const source = `<select name="s" NumToSelect="2"><option><text name="t">a</text></option><option><text name="t">b</text></option></select>\n$s.`;
                const labels = await referenceLabels(source);
                expect(labels).not.toContain("t");
            });
        });

        // ---------- Layer 3: context help ----------

        describe("context help returns the same refName payload as $s[1].t", () => {
            it("default numToSelect", async () => {
                const source = `<select name="s"><option><text name="t">a</text></option></select>\n$s.t`;
                const { completer } = await buildCompleter(source);
                const help = await computeContextHelp(completer, source.length);
                expect(help).toMatchObject({
                    kind: "refName",
                    refName: "t",
                    displayPath: "s.t",
                    targetElementName: "text",
                });
            });

            it('numToSelect="1"', async () => {
                const source = `<select name="s" numToSelect="1"><option><text name="t">a</text></option></select>\n$s.t`;
                const { completer } = await buildCompleter(source);
                const help = await computeContextHelp(completer, source.length);
                expect(help).toMatchObject({
                    kind: "refName",
                    refName: "t",
                    displayPath: "s.t",
                });
            });

            it('numToSelect="2" returns no help (shorthand off)', async () => {
                const source = `<select name="s" numToSelect="2"><option><text name="t">a</text></option><option><text name="t">b</text></option></select>\n$s.t`;
                const { completer } = await buildCompleter(source);
                const help = await computeContextHelp(completer, source.length);
                expect(help).toEqual({ kind: "none" });
            });

            it('numToSelect="$n" (dynamic) returns no help (strict rule)', async () => {
                const source = `<number name="n">1</number><select name="s" numToSelect="$n"><option><text name="t">a</text></option></select>\n$s.t`;
                const { completer } = await buildCompleter(source);
                const help = await computeContextHelp(completer, source.length);
                expect(help).toEqual({ kind: "none" });
            });
        });

        // ---------- Agree-by-construction ----------

        describe("autocomplete and context-help agree on every case", () => {
            // For each row, the dropdown's offer of `t` and the help panel's
            // non-NONE payload must match: either both surface `t` (shorthand
            // applies) or neither does (shorthand rejected).
            const cases: Array<{
                label: string;
                tag: string;
                attrs: string;
                shouldResolve: boolean;
            }> = [
                {
                    label: "select / no count attribute",
                    tag: "select",
                    attrs: "",
                    shouldResolve: true,
                },
                {
                    label: 'select / numToSelect="1"',
                    tag: "select",
                    attrs: ' numToSelect="1"',
                    shouldResolve: true,
                },
                {
                    label: 'select / numToSelect=" 1 "',
                    tag: "select",
                    attrs: ' numToSelect=" 1 "',
                    shouldResolve: true,
                },
                {
                    label: 'select / numToSelect="2"',
                    tag: "select",
                    attrs: ' numToSelect="2"',
                    shouldResolve: false,
                },
                {
                    label: 'select / numToSelect="01"',
                    tag: "select",
                    attrs: ' numToSelect="01"',
                    shouldResolve: false,
                },
                {
                    label: 'select / numToSelect="1.0"',
                    tag: "select",
                    attrs: ' numToSelect="1.0"',
                    shouldResolve: false,
                },
            ];

            for (const { label, tag, attrs, shouldResolve } of cases) {
                it(label, async () => {
                    // Single option suffices for the resolve-vs-block decision
                    // even when shouldResolve is false (the count attribute
                    // tells the rule what to do, not the option count).
                    const optionBody =
                        tag === "select"
                            ? `<option><text name="t">a</text></option><option><text name="t">b</text></option>`
                            : "";
                    const completeSource = `<${tag} name="s"${attrs}>${optionBody}</${tag}>\n$s.t`;
                    const cursorOffset = completeSource.length;

                    const offersAutocomplete = (
                        await referenceLabels(
                            completeSource.replace(/\.t$/, "."),
                        )
                    ).includes("t");

                    const { completer } = await buildCompleter(completeSource);
                    const help = await computeContextHelp(
                        completer,
                        cursorOffset,
                    );
                    const helpSurfaced = help.kind === "refName";

                    expect({ offersAutocomplete, helpSurfaced }).toEqual({
                        offersAutocomplete: shouldResolve,
                        helpSurfaced: shouldResolve,
                    });
                });
            }
        });
    },
);
