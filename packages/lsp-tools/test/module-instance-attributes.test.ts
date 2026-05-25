/**
 * Cross-layer integration tests for per-instance `<module>` attribute
 * validation (issue #1154 out-of-scope extension).
 *
 * For a `<module copy="$x" .../>` (or `extend=`) site, the LSP resolves
 * `$x` via the real WASM resolver and consults the target module's
 * `<moduleAttributes>` block to decide which attribute names are valid.
 * These tests pin both the validation diagnostics (`getSchemaViolations`)
 * and the completion dropdown (`getCompletionItems`) against the same
 * resolver view so they can't drift apart.
 *
 * The pure-helper tests in `test/module-attributes.test.ts` cover the
 * DAST helpers in isolation; this file covers the end-to-end behavior
 * through the precompute pass on `AutoCompleter`.
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
        // Pre-expansion source-level DAST; used by the adapter to map
        // reference-making composites (like `<module copy="$x">`) that
        // are id-less in the post-expansion flat DAST.
        returnNormalizedDastRoot: async () =>
            wasm.return_normalized_dast_root(),
        resolvePath: async ({ path, origin, skipParentSearch }) =>
            wasm.resolve_path(path, origin, skipParentSearch),
    };
}

async function buildCompleter(source: string) {
    // Crucially, the AutoCompleter and the RustResolverAdapter must
    // share the SAME `DoenetSourceObject` — otherwise the adapter builds
    // its `_dastElementToRustIndex` map against a different parsed DAST
    // than the elements `_refreshModuleInstanceAttributes` later looks up,
    // and every lookup misses (falling through to the root-origin
    // fallback and silently losing scope context).  Production wires
    // them this way at `packages/lsp/src/features/validate.ts`.
    const completer = new AutoCompleter(source);
    const core = wrapWasmCore(PublicDoenetMLCore.new());
    const adapter = new RustResolverAdapter(completer.sourceObj, {
        core,
        takesIndexComponentTypes: takesIndexSet,
    });
    await adapter.init();
    completer.setRustResolverAdapter(adapter);
    return { completer, adapter, sourceObj: completer.sourceObj };
}

/** Run validation and return the diagnostic messages that mention an
 *  attribute called `attrName` on `<module>`. Case-insensitive match on
 *  the attribute name, because the warning message uses the *normalized*
 *  canonical-cased name when the attribute exists in some other element's
 *  schema (e.g. `center` is normalized from `CENTER`), and the raw
 *  author-typed name otherwise. */
async function moduleAttrDiagnostics(source: string, attrName: string) {
    const { completer } = await buildCompleter(source);
    const diags = await completer.getSchemaViolations();
    const lowered = attrName.toLowerCase();
    return diags
        .map((d) => d.message)
        .filter((m) => {
            if (!/Element `<module>`/.test(m)) return false;
            const match = m.match(/attribute called `([^`]+)`/);
            return match != null && match[1].toLowerCase() === lowered;
        });
}

(wasmAvailable ? describe : describe.skip)(
    "per-instance <module> attribute validation (#1154)",
    () => {
        describe("validation: copy/extend resolves to a <module> with <moduleAttributes>", () => {
            it("declared attribute names do not warn", async () => {
                // Canonical docs example shape from
                // packages/docs-nextra/pages/reference/module.mdx:20-62.
                const source = `<setup><module name="drawBalloon"><moduleAttributes><point name="center">(0,0)</point><number name="color">2</number><number name="radius">4</number></moduleAttributes></module></setup>
<module copy="$drawBalloon" center="(-5,0)" color="1" radius="3" />`;
                expect(await moduleAttrDiagnostics(source, "center")).toEqual(
                    [],
                );
                expect(await moduleAttrDiagnostics(source, "color")).toEqual(
                    [],
                );
                expect(await moduleAttrDiagnostics(source, "radius")).toEqual(
                    [],
                );
            });

            it("undeclared attribute still warns", async () => {
                const source = `<setup><module name="m"><moduleAttributes><text name="declared">x</text></moduleAttributes></module></setup>
<module copy="$m" undeclared="x" />`;
                expect(
                    await moduleAttrDiagnostics(source, "undeclared"),
                ).toHaveLength(1);
            });

            it("canonical <module> attributes (name, hide) still accepted", async () => {
                const source = `<setup><module name="m"><moduleAttributes><text name="t">x</text></moduleAttributes></module></setup>
<module copy="$m" name="instance" hide />`;
                expect(await moduleAttrDiagnostics(source, "name")).toEqual([]);
                expect(await moduleAttrDiagnostics(source, "hide")).toEqual([]);
            });

            it("declared attribute matches case-insensitively (runtime semantics)", async () => {
                // Author declared `Center` (mixed case); the copy uses
                // lowercase `center`.  The runtime lowercases at
                // ModuleAttributes.js:107-108; the LSP mirrors that.
                const source = `<setup><module name="m"><moduleAttributes><point name="Center">(0,0)</point></moduleAttributes></module></setup>
<module copy="$m" CENTER="(1,1)" />`;
                expect(await moduleAttrDiagnostics(source, "CENTER")).toEqual(
                    [],
                );
            });

            it("extend= behaves the same as copy=", async () => {
                const source = `<setup><module name="m"><moduleAttributes><text name="kept">x</text></moduleAttributes></module></setup>
<module extend="$m" kept="y" undeclared="x" />`;
                expect(await moduleAttrDiagnostics(source, "kept")).toEqual([]);
                expect(
                    await moduleAttrDiagnostics(source, "undeclared"),
                ).toHaveLength(1);
            });
        });

        describe("validation: no augmentation when target doesn't qualify", () => {
            it("unresolved reference: warning still fires for any author-defined attr", async () => {
                const source = `<module copy="$missing" item="x" />`;
                expect(
                    await moduleAttrDiagnostics(source, "item"),
                ).toHaveLength(1);
            });

            it("reference resolves to a non-<module>: no augmentation", async () => {
                const source = `<text name="t">hi</text>
<module copy="$t" item="x" />`;
                expect(
                    await moduleAttrDiagnostics(source, "item"),
                ).toHaveLength(1);
            });

            it("target <module> has no <moduleAttributes>: no augmentation", async () => {
                const source = `<setup><module name="m"><text>body</text></module></setup>
<module copy="$m" item="x" />`;
                expect(
                    await moduleAttrDiagnostics(source, "item"),
                ).toHaveLength(1);
            });

            it("chain reference whose target isn't a <module>: no augmentation", async () => {
                const source = `<setup><module name="m"><moduleAttributes><text name="item">x</text></moduleAttributes><text name="sub">x</text></module></setup>
<module copy="$m.sub" item="x" />`;
                // Multi-segment paths ARE resolved (issue #1154 follow-up
                // for `$s.m`), but the target-must-be-a-`<module>` guard
                // still rejects when the resolved element is something
                // else — here `$m.sub` resolves to the `<text name="sub">`
                // inside the module, so no augmentation applies and the
                // unknown-attribute warning fires correctly.
                expect(
                    await moduleAttrDiagnostics(source, "item"),
                ).toHaveLength(1);
            });

            it('bracket-bearing segment (`copy="$s[0].m"`): conservatively skipped', async () => {
                // Bracket-bearing segments stay out-of-scope for the
                // textual predicate — the runtime's takesIndex semantics
                // under a sectioning parent are subtle enough that "exact-
                // match the simple textual cases" remains the right rule.
                // Authors who need bracketed access can keep using the
                // canonical attribute list.
                const source = `<section name="s"><module name="m"><moduleAttributes><text name="kept">x</text></moduleAttributes></module></section>
<module copy="$s[0].m" kept="x" />`;
                expect(
                    await moduleAttrDiagnostics(source, "kept"),
                ).toHaveLength(1);
            });
        });

        describe("validation: resolver scoping rules (#1154 follow-up)", () => {
            // These mirror the user-reported scenarios in #1154 / PR #1188:
            // the LSP must use the *same* origin scope the runtime would,
            // not always fall back to the document root.  Falling back to
            // root means `<module copy="$m">` inside a section picks an
            // arbitrary `m` (whichever has the smallest rust id), so two
            // sections with same-named modules but DIFFERENT declared
            // attributes would silently agree on either's declarations.

            it("inner `$m` resolves to the SIBLING module (declared attr accepted)", async () => {
                // Two sibling sections, each with a `<module name="m">`.
                // s1's m declares `n`; s2's m declares `k` (DIFFERENT).
                // Inside s1, `<module copy="$m" n="3">` must resolve to s1's
                // m (n is declared there) — root-origin resolution would
                // pick whichever m comes first and we'd accept the wrong
                // attribute set.
                const source = `<section name="s1">
<module name="m"><moduleAttributes><number name="n">1</number></moduleAttributes></module>
<module copy="$m" n="3" />
</section>
<section name="s2">
<module name="m"><moduleAttributes><number name="k">1</number></moduleAttributes></module>
<module copy="$m" k="3" />
</section>`;
                expect(await moduleAttrDiagnostics(source, "n")).toEqual([]);
                expect(await moduleAttrDiagnostics(source, "k")).toEqual([]);
            });

            it("inner `$m` rejects attrs declared only by the OTHER section's m", async () => {
                // Mirror image of the above: writing `k` inside s1 (where
                // only `n` is declared) must warn, even though s2's m
                // declares `k`.
                const source = `<section name="s1">
<module name="m"><moduleAttributes><number name="n">1</number></moduleAttributes></module>
<module copy="$m" k="3" />
</section>
<section name="s2">
<module name="m"><moduleAttributes><number name="k">1</number></moduleAttributes></module>
</section>`;
                expect(await moduleAttrDiagnostics(source, "k")).toHaveLength(
                    1,
                );
            });

            it("`$s1.m` from outside resolves to s1's module unambiguously", async () => {
                const source = `<section name="s1">
<module name="m"><moduleAttributes><number name="n">1</number></moduleAttributes></module>
</section>
<section name="s2">
<module name="m"><moduleAttributes><number name="k">1</number></moduleAttributes></module>
</section>
<module copy="$s1.m" n="3" />`;
                expect(await moduleAttrDiagnostics(source, "n")).toEqual([]);
            });

            it("user-reported full source: scoping + ambiguity all work together", async () => {
                // Verbatim from the user's follow-up on PR #1188.  Three
                // sections; two of them share the name `s2`.  Each section
                // has a sibling `<module copy="$m">` that must resolve to
                // its OWN section's `m`.  Outside, `$s1.m` resolves; `$s2.m`
                // is ambiguous and must NOT augment.  Every inner `m`
                // declares `n`, so the inner copies should accept `n=`
                // (scope resolves to the right section); the outer `$s2.m`
                // copy must warn on `n=` (ambiguous → no augmentation).
                const source = `<section name="s1">
<module name="m"><moduleAttributes><number name="n">1</number></moduleAttributes></module>
<module copy="$m" n="3" />
</section>
<section name="s2">
<module name="m"><moduleAttributes><number name="n">1</number></moduleAttributes></module>
<module copy="$m" n="3" />
</section>
<section name="s2">
<module name="m"><moduleAttributes><number name="n">1</number></moduleAttributes></module>
<module copy="$m" n="3" />
</section>
<module copy="$s1.m" n="3" />
<module copy="$s2.m" n="3" />`;
                const { completer } = await buildCompleter(source);
                const diags = await completer.getSchemaViolations();
                const nWarnings = diags
                    .map((d) => d.message)
                    .filter(
                        (m) =>
                            /Element `<module>`/.test(m) &&
                            /attribute called `n`/.test(m),
                    );
                // Exactly one warning: the outer `<module copy="$s2.m" n="3" />`.
                // The three inner copies and the `$s1.m` copy all augment.
                expect(nWarnings).toHaveLength(1);
            });

            it("ambiguous `$s2.m` (two sibling sections share a name) gets no augmentation", async () => {
                // Two `<section name="s2">` siblings make `$s2` ambiguous
                // at root; the resolver should fail (or not yield a single
                // target), so per-instance augmentation must not apply and
                // the warning fires.
                const source = `<section name="s2">
<module name="m"><moduleAttributes><number name="kept">1</number></moduleAttributes></module>
</section>
<section name="s2">
<module name="m"><moduleAttributes><number name="kept">1</number></moduleAttributes></module>
</section>
<module copy="$s2.m" kept="3" />`;
                expect(
                    await moduleAttrDiagnostics(source, "kept"),
                ).toHaveLength(1);
            });
        });

        describe("validation: multi-segment references (`$s.m`)", () => {
            it('`copy="$s.m"` through a <section> resolves and augments declared attrs', async () => {
                // The exact source the user reported as missing
                // augmentation before this commit landed.
                const source = `<section name="s">
<module name="m">
  <moduleAttributes>
    <number name="n">1</number>
  </moduleAttributes>
  <number>2$n</number>
</module>
<module copy="$s.m" n="3" />
</section>`;
                expect(await moduleAttrDiagnostics(source, "n")).toEqual([]);
            });

            it("undeclared attribute on a $s.m site still warns", async () => {
                const source = `<section name="s">
<module name="m"><moduleAttributes><number name="n">1</number></moduleAttributes></module>
<module copy="$s.m" undeclared="x" />
</section>`;
                expect(
                    await moduleAttrDiagnostics(source, "undeclared"),
                ).toHaveLength(1);
            });

            it('deeper chain `copy="$outer.s.m"` works through nested sections', async () => {
                const source = `<section name="outer">
<section name="s">
<module name="m"><moduleAttributes><number name="kept">1</number></moduleAttributes></module>
</section>
</section>
<module copy="$outer.s.m" kept="9" />`;
                expect(await moduleAttrDiagnostics(source, "kept")).toEqual([]);
            });
        });

        describe("validation: canonical docs example end-to-end", () => {
            it("packages/docs-nextra/pages/reference/module.mdx example has no spurious <module> attribute warnings", async () => {
                // The verbatim example from
                // packages/docs-nextra/pages/reference/module.mdx:19-60.
                // This is the source the docs ship as the canonical
                // module-with-author-attributes pattern; issue #1154
                // was opened because LSP validation flagged
                // `center` / `color` / `radius` on the three copy sites
                // as unknown attributes.  After per-instance augmentation,
                // there must be zero `Element \`<module>\` doesn't have an
                // attribute called ...` warnings on any of those sites.
                const source = `<setup>
<module name="drawBalloon">
  <moduleAttributes>
     <point name="center">(0,2)</point>
     <number name="color">2</number>
     <number name="radius">4</number>
  </moduleAttributes>

  <lineSegment
    endpoints="($center.x, $center.y - $radius) (1,-7)"
    styleNumber="5"
  />
  <circle
    center="$center"
    radius="$radius"
    styleNumber="$color"
    filled
  />
</module>
</setup>

<graph
    ymin="-8"
    ymax="8"
    displayXAxis="false"
    displayYAxis="false">
  <shortDescription>A graph of balloons</shortDescription>
  <module copy="$drawBalloon"/>
  <module
    copy="$drawBalloon"
    center="(-5,0)"
    color="1"
  />
  <module
    copy="$drawBalloon"
    center="(5,1)"
    color="3"
    radius="3"
  />
</graph>`;
                const { completer } = await buildCompleter(source);
                const diags = await completer.getSchemaViolations();
                const moduleAttrWarnings = diags
                    .map((d) => d.message)
                    .filter(
                        (m) =>
                            /Element `<module>`/.test(m) &&
                            /attribute called `/.test(m),
                    );
                expect(moduleAttrWarnings).toEqual([]);
            });
        });

        describe("validation: definition sites are unaffected", () => {
            it("the <module name=...> definition itself triggers no per-instance check", async () => {
                // Definition site has no copy/extend, so it shouldn't even
                // attempt per-instance resolution.  We assert there are no
                // spurious warnings on <module> here.
                const source = `<setup><module name="m"><moduleAttributes><text name="t">x</text></moduleAttributes></module></setup>`;
                const { completer } = await buildCompleter(source);
                const diags = await completer.getSchemaViolations();
                const moduleDiags = diags.filter((d) =>
                    /<module>/.test(d.message),
                );
                expect(moduleDiags).toEqual([]);
            });
        });

        describe("completion: attribute-name dropdown for <module copy=...>", () => {
            it("offers declared names alongside canonical ones", async () => {
                // Cursor right after the space inside the open tag — the
                // attribute-name completion branch fires here.
                const source = `<setup><module name="m"><moduleAttributes><point name="center">(0,0)</point><number name="color">2</number></moduleAttributes></module></setup>
<module copy="$m" `;
                const { completer } = await buildCompleter(source);
                const items = await completer.getCompletionItems(source.length);
                const labels = items
                    .filter((i) => i.kind === CompletionItemKind.Enum)
                    .map((i) => i.label);
                // Author-declared names.
                expect(labels).toContain("center");
                expect(labels).toContain("color");
                // Canonical <module> attributes still present.
                expect(labels).toContain("name");
                expect(labels).toContain("hide");
            });

            it("without copy=, only canonical attributes are offered", async () => {
                const source = `<setup><module name="m"><moduleAttributes><text name="item">x</text></moduleAttributes></module></setup>
<module `;
                const { completer } = await buildCompleter(source);
                const items = await completer.getCompletionItems(source.length);
                const labels = items
                    .filter((i) => i.kind === CompletionItemKind.Enum)
                    .map((i) => i.label);
                expect(labels).not.toContain("item");
                expect(labels).toContain("name");
            });

            it("offers no declared names when the reference doesn't resolve", async () => {
                const source = `<module copy="$missing" `;
                const { completer } = await buildCompleter(source);
                const items = await completer.getCompletionItems(source.length);
                const labels = items
                    .filter((i) => i.kind === CompletionItemKind.Enum)
                    .map((i) => i.label);
                // Canonical still there, no synthesized entries.
                expect(labels).toContain("name");
                // The descriptor we synthesize on declared entries would be
                // absent — assert any label isn't a leftover from a stale
                // augmentation by spot-checking a sentinel name we never
                // declared anywhere.
                expect(labels).not.toContain("balloonShape");
            });
        });

        describe("context-help on declared attributes", () => {
            it("returns an attribute help payload when the cursor sits on a per-instance declared attribute", async () => {
                // Reproduces the user-reported follow-up: the cursor is
                // inside the `n` attribute on the copy site; the help
                // panel previously returned NONE because `helpForAttribute`
                // only consulted the canonical/alias schema entry.
                const source = `<module name="m"><moduleAttributes><number name="n">1</number></moduleAttributes></module>
<module copy="$m" n="3" />`;
                const { completer } = await buildCompleter(source);
                // Offset inside the `n` attribute name on the copy site.
                const offset = source.indexOf('n="3"');
                const help = await computeContextHelp(completer, offset);
                expect(help.kind).toBe("attribute");
                if (help.kind !== "attribute") return;
                expect(help.elementName).toBe("module");
                expect(help.attributeName.toLowerCase()).toBe("n");
                expect(help.description).toBe(
                    "Author-declared module attribute",
                );
            });

            it("still returns canonical help for canonical attributes on the same site", async () => {
                const source = `<module name="m"><moduleAttributes><number name="n">1</number></moduleAttributes></module>
<module copy="$m" name="instance" n="3" />`;
                const { completer } = await buildCompleter(source);
                const offset = source.indexOf('name="instance"');
                const help = await computeContextHelp(completer, offset);
                expect(help.kind).toBe("attribute");
                if (help.kind !== "attribute") return;
                expect(help.attributeName.toLowerCase()).toBe("name");
                // Canonical entries have their real description, NOT the
                // synthesized placeholder.
                expect(help.description).not.toBe(
                    "Author-declared module attribute",
                );
            });

            it("returns NONE for an unknown attribute when the reference doesn't resolve", async () => {
                const source = `<module copy="$missing" wibble="x" />`;
                const { completer } = await buildCompleter(source);
                const offset = source.indexOf("wibble");
                const help = await computeContextHelp(completer, offset);
                // No per-instance augmentation, no canonical match: fall
                // back to element-level help (the help layer's existing
                // "keep something on screen" behavior) rather than a
                // synthesized attribute payload.
                expect(help.kind).not.toBe("attribute");
            });
        });

        describe("precompute coalescing (sourceRevision)", () => {
            it("two getSchemaViolations() calls in a row issue resolveBarePathAtOrigin once per site", async () => {
                const source = `<setup><module name="m"><moduleAttributes><text name="t">x</text></moduleAttributes></module></setup>
<module copy="$m" t="x" />`;
                const { completer, adapter } = await buildCompleter(source);

                // Spy on the bridge call.  Two consecutive runs without an
                // edit must collapse to one resolution (and Promise.all
                // batches simultaneous instances in each refresh).
                let callCount = 0;
                const orig = adapter.resolveBarePathAtOrigin.bind(adapter);
                adapter.resolveBarePathAtOrigin = (async (...args: any[]) => {
                    callCount++;
                    return (orig as any)(...args);
                }) as any;

                await completer.getSchemaViolations();
                const afterFirst = callCount;
                await completer.getSchemaViolations();
                const afterSecond = callCount;

                expect(afterFirst).toBe(1);
                expect(afterSecond).toBe(1);
            });
        });
    },
);
