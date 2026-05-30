import { describe, expect, it } from "vitest";
import { AutoCompleter } from "../auto-completer";
import type { RustResolverAdapter } from "../auto-completer/rust-resolver-adapter";
import type { DastElement } from "@doenet/parser";
import {
    computeContextHelp,
    computeContextHelpForCompletion,
    type ContextHelpCompletion,
} from "./computeContextHelp";
import type { HelpContent } from "./types";

// Default `new AutoCompleter(source)` already binds the bundled doenetSchema
// + aliasedElements, so alias resolution and other cross-element behaviours
// are exercised against the same data the editor consumes at runtime.
//
// The helpers are `async` because `computeContextHelp` awaits the resolver
// call inside `helpForRefMemberByName`. To keep these unit tests focused
// on schema-walking behaviour without spinning up a real Rust resolver,
// each completer gets a lightweight stub adapter that implements the
// minimum surface AutoCompleter calls into — `resolveRefMemberContainerAtOffset`
// (length-1 resolution via `getReferentAtOffset`, descendant names from the
// DAST tree) and `getDerivedRepeatNames` (always `[]`).  Resolver-specific
// semantics like `takesIndex` blocking belong in `computeContextHelp.resolver.test.ts`,
// which uses the real `RustResolverAdapter` with a mock `ResolverCore`.
function attachStubAdapter(completer: AutoCompleter) {
    const stub = {
        async resolveRefMemberContainerAtOffset(
            offset: number,
            pathParts: string[],
        ) {
            // Match the legacy JS fallback's scope: length-2 chains only.
            // Longer chains are deliberately left unresolved so the help
            // layer surfaces `unsupportedRefChain` for them, mirroring the
            // pre-LSP behaviour the existing tests assert.  Multi-part /
            // takesIndex semantics live in the resolver-backed test file,
            // where a real `RustResolverAdapter` with a mock `ResolverCore`
            // exercises the proper rust-side resolution.
            if (pathParts.length !== 2) {
                return { node: null, visibleDescendantNames: [] };
            }
            const headName = pathParts[0];
            if (!headName) return { node: null, visibleDescendantNames: [] };
            const containerNode =
                completer.sourceObj.getReferentAtOffset(offset, headName) ??
                null;
            if (!containerNode) {
                return { node: null, visibleDescendantNames: [] };
            }
            const visibleDescendantNames =
                completer.sourceObj.getUniqueDescendantNamesForNode(
                    containerNode as DastElement,
                );
            return { node: containerNode, visibleDescendantNames };
        },
        getDerivedRepeatNames(_offset: number) {
            return [] as Array<{ name: string; element: DastElement }>;
        },
    };
    completer.setRustResolverAdapter(stub as unknown as RustResolverAdapter);
    return completer;
}

async function helpAt(source: string, offset: number): Promise<HelpContent> {
    return await computeContextHelp(
        attachStubAdapter(new AutoCompleter(source)),
        offset,
    );
}

async function helpForCompletionAt(
    source: string,
    offset: number,
    completion: ContextHelpCompletion,
): Promise<HelpContent> {
    return await computeContextHelpForCompletion(
        attachStubAdapter(new AutoCompleter(source)),
        offset,
        completion,
    );
}

describe("computeContextHelp — element help", () => {
    it("returns element help when cursor is mid-tag-name", async () => {
        const source = `<math>x</math>`;
        // Offset 3 lands between 'a' and 't' inside the opening tag name.
        const help = await helpAt(source, 3);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "math",
            docsSlug: "math",
        });
        if (help.kind === "element") {
            expect(help.summary).toBeTruthy();
        }
    });

    it("returns element help when cursor is on closing tag name", async () => {
        const source = `<math>x</math>`;
        // Offset right after `</`, inside "math".
        const offset = source.indexOf("</math") + 3;
        expect((await helpAt(source, offset)).kind).toBe("element");
    });

    it("returns none for an unknown component", async () => {
        const source = `<unknownThing/>`;
        const offset = source.indexOf("unknownThing") + 3;
        expect((await helpAt(source, offset)).kind).toBe("none");
    });

    it("returns body suggestions for cursor in element body content", async () => {
        const source = `<math>x</math>`;
        // Offset 6 is between `>` and `x`.
        const help = await helpAt(source, 6);
        expect(help.kind).toBe("suggestions");
        if (help.kind === "suggestions") {
            expect(help.context).toEqual({ elementName: "math" });
        }
    });

    it("resolves elements case-insensitively and displays the canonical name", async () => {
        const source = `<MaTh>x</MaTh>`;
        const help = await helpAt(source, 3);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "math",
            docsSlug: "math",
        });
    });
});

describe("computeContextHelp — attribute help", () => {
    it("returns attribute help with description and defaultValue", async () => {
        const source = `<point draggable="true"/>`;
        const offset = source.indexOf("draggable") + 3;
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "point",
            attributeName: "draggable",
            defaultValue: true,
        });
        if (help.kind === "attribute") {
            expect(help.description).toBeTruthy();
        }
    });

    it("returns attribute help when cursor is inside the attribute value", async () => {
        const source = `<math simplify="full"/>`;
        // Cursor between 'f' and 'u' of "full".
        const offset = source.indexOf('"full') + 2;
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "attribute",
            attributeName: "simplify",
        });
    });

    it("keeps attribute help when cursor sits right after `=` on a partial attribute", async () => {
        // Regression: lezer reports `cursorPosition: openTag` once the cursor
        // crosses the `=` boundary on an incomplete attribute, but the cursor
        // is still inside the attribute's position range — help should
        // continue to show the attribute description.
        const source = `<math simplify=`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "math",
            attributeName: "simplify",
        });
    });

    it("keeps attribute help right after the opening quote of an empty value", async () => {
        const source = `<math simplify="`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "math",
            attributeName: "simplify",
        });
    });

    it("keeps attribute help on an unquoted partial value (`simplify=f`)", async () => {
        // Parser tokenizes `simplify=f` as TWO attributes — `simplify` (with
        // `=` baked in) and bogus `f`. `attributeAtOffset` detects the `=`
        // spillover and returns the preceding `simplify`, so the help panel
        // tracks the attribute the user is actually trying to value.
        const source = `<math simplify=f`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "math",
            attributeName: "simplify",
        });
    });

    it("keeps attribute help on a longer unquoted partial value (`simplify=ff`)", async () => {
        const source = `<math simplify=ff`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "math",
            attributeName: "simplify",
        });
    });

    it("keeps attribute help on a complete unquoted value (`simplify=full`)", async () => {
        const source = `<math simplify=full`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "math",
            attributeName: "simplify",
        });
    });

    it("keeps attribute help when whitespace follows `=` (`simplify= full`)", async () => {
        // The unquoted-spillover heuristic must walk back over whitespace to
        // find the `=` from the preceding attribute. Without this, the bogus
        // `full` attribute looks unrelated and the panel falls back to math.
        const source = `<math simplify= full`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "math",
            attributeName: "simplify",
        });
    });

    it("keeps attribute help when whitespace surrounds `=` (`simplify = full`)", async () => {
        // #1197 stripped-pair fallback variant: parser strips both halves
        // of the bare-value pair, so `attributeAtOffset` walks back from
        // the `=` to find the assign-half identifier. The identifier
        // lookup must skip whitespace before scanning backward —
        // otherwise `source[equalsOffset - 1]` is a space and the panel
        // falls back to element help on `<math simplify = full>`.
        const source = `<math simplify = full`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "math",
            attributeName: "simplify",
        });
    });

    it("keeps attribute help via the bare-value-after-`=` fallback when no attribute contains the cursor", async () => {
        // Mirrors the fallback documented in `get-completion-items.ts` for
        // states where the typed bare value doesn't fall inside any
        // attribute's position range. The walk-back to `=` recovers the
        // attribute the value belongs to.
        const source = `<math simplify=  `;
        const help = await helpAt(source, source.length);
        if (help.kind === "attribute") {
            expect(help.elementName).toBe("math");
            expect(help.attributeName).toBe("simplify");
        } else {
            // If the parser already keeps the cursor inside `simplify`'s
            // range in this state, the primary find returns it directly
            // and we never hit the fallback — also acceptable.
            expect(help).toMatchObject({
                kind: "element",
                elementName: "math",
            });
        }
    });

    it("falls back to element help when cursor is in whitespace inside the open tag", async () => {
        // `<math |` — cursor in the open tag but not in any attribute. We
        // previously returned NONE; now we return the element help so the
        // panel doesn't blank out.
        const source = `<math `;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "math",
        });
    });

    it("falls back to element help when cursor is on an unknown attribute name", async () => {
        // `<math bad` — `bad` isn't a math attribute. Rather than blanking
        // the panel, show element help so the user can still see what
        // `<math>` is.
        const source = `<math bad`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "math",
        });
    });

    it("falls back to element help on an unknown attribute with an unquoted value (`bad=foo`)", async () => {
        const source = `<math bad=foo`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "math",
        });
    });

    it("shows element help across every cursor position in `<math bad=foo`", async () => {
        // Defends every offset inside the open tag against blanking, so
        // moving the cursor around in an unknown-attribute context keeps
        // the user oriented on the element.
        const source = `<math bad=foo`;
        // Start after `<math` (offset 5, the space) through end of source.
        for (let offset = 5; offset <= source.length; offset++) {
            const help = await helpAt(source, offset);
            expect(help.kind).toBe("element");
            if (help.kind === "element") {
                expect(help.elementName).toBe("math");
            }
        }
    });

    it("prefers autocompleteValues over values for boolean-aliased enums", async () => {
        // `simplify` is a string enum that also accepts "true"/"false" via
        // valueForTrue / valueForFalse. The help should surface the enum
        // values only — not the boolean aliases that are merged into `values`.
        const source = `<math simplify="full"/>`;
        const offset = source.indexOf("simplify") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.allowedValues).toBeDefined();
        const allowedValueStrings = help.allowedValues?.map((v) => v.value);
        expect(allowedValueStrings).toContain("none");
        expect(allowedValueStrings).not.toContain("true");
        expect(allowedValueStrings).not.toContain("false");
    });

    it("omits allowedValues for pure boolean primitives", async () => {
        // Boolean primitives have a synthesized `values: ["true","false"]`
        // but no `autocompleteValues`. The help panel intentionally drops
        // the "Allowed values" row here — the attribute description already
        // conveys true/false. Regression guard against re-introducing a
        // `?? values.map(...)` fallback in `computeContextHelp`.
        const source = `<point draggable="true"/>`;
        const offset = source.indexOf("draggable") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.allowedValues).toBeUndefined();
    });

    it("resolves attributes case-insensitively and displays the canonical name", async () => {
        const source = `<point DrAgGaBlE="true"/>`;
        const offset = source.indexOf("DrAgGaBlE") + 3;
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "point",
            attributeName: "draggable",
        });
    });

    it("preserves an explicit null defaultValue", async () => {
        // <slider initialValue> declares `defaultValue: null` to mean
        // "no initial value". The help pipeline must surface the null
        // through to the panel (which then chooses to hide the Default
        // row entirely rather than render a misleading value).
        const source = `<slider initialValue="3"/>`;
        const offset = source.indexOf("initialValue") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.defaultValue).toBeNull();
    });
});

describe("computeContextHelp — activeDefault on style attributes (#1198)", () => {
    it("surfaces the resolved styleDefinition value as activeDefault on a per-component style attribute", async () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="square"/>
            </setup>
            <point markerStyle="circle"/>
        `;
        // Cursor inside the `<point markerStyle=…>` attribute name.
        const offset = source.indexOf("markerStyle", source.indexOf("<point"));
        const help = await helpAt(source, offset + 3);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.activeDefault).toEqual({
            value: "square",
            styleNumber: 1,
        });
    });

    it("uses the built-in preset for the resolved styleNumber when no ancestor <styleDefinition> overrides it", async () => {
        // styleNumber=3's built-in preset has markerStyle="triangle". With no
        // ancestor styleDefinition to override it, the active default is the
        // preset itself — distinct from the schema's static fallback (which
        // is undefined for per-component style overrides), so we still surface
        // it so authors can see what their override would replace.
        const source = `<point styleNumber="3" markerStyle="circle"/>`;
        const offset = source.indexOf("markerStyle") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.activeDefault).toEqual({
            value: "triangle",
            styleNumber: 3,
        });
    });

    it("excludes the current <styleDefinition> from its own activeDefault lookup", async () => {
        // Authoring inside a <styleDefinition> — the active default should
        // tell the author "what would styleNumber=2 resolve to without this
        // block", which is the built-in styleNumber=2 preset (markerStyle =
        // 'square').
        const source = `
            <setup>
                <styleDefinition styleNumber="2" markerStyle="diamond"/>
            </setup>
        `;
        const offset = source.indexOf("markerStyle") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.activeDefault).toEqual({
            value: "square",
            styleNumber: 2,
        });
    });

    it("does not set activeDefault for non-style attributes (e.g. <point draggable>)", async () => {
        const source = `<point draggable="true"/>`;
        const offset = source.indexOf("draggable") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.activeDefault).toBeUndefined();
    });

    it("inside <styleDefinition>, derives *ColorWord from same-block *Color when cursor is on the word", async () => {
        // The author has set markerColor="#FF0000" but not markerColorWord;
        // cursor on markerColorWord. The runtime would derive the word from
        // the color via `addMissingColorWordsToStyleDefinition`, so the
        // active default should show that derived word — NOT the inherited
        // preset's stale word.
        const source = `<setup><styleDefinition styleNumber="1" markerColor="#FF0000" markerColorWord=""/></setup>`;
        // Cursor anywhere inside the markerColorWord attribute name.
        const offset = source.indexOf("markerColorWord") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.activeDefault).toEqual({
            value: "red",
            styleNumber: 1,
        });
    });

    it("inside <styleDefinition>, exclude is per-attribute: other authored values still contribute", async () => {
        // Authoring inside <styleDefinition lineWidth="6" markerStyle="diamond"/>,
        // cursor on markerStyle. lineWidth is NOT excluded, so it still
        // applies; but markerStyle excludes itself and falls back to the
        // preset's "circle".  This validates the refined exclude semantics
        // — pre-refactor, the entire styleDefinition was excluded and
        // lineWidth=6 would have been lost.  Now we surface "circle" for
        // the active default of markerStyle while lineWidth=6 stays in the
        // resolver's cumulative map (visible only via the resolver API;
        // the help payload exposes just the queried attribute).
        const source = `<setup><styleDefinition styleNumber="1" lineWidth="6" markerStyle="diamond"/></setup>`;
        const offset = source.indexOf("markerStyle") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.activeDefault).toEqual({
            value: "circle",
            styleNumber: 1,
        });
    });
});

describe("computeContextHelp — styleBreakdown on styleNumber / inside <styleDefinition> (#1204)", () => {
    it("populates styleBreakdown when cursor is on a graphical component's styleNumber attribute", async () => {
        const source = `<point styleNumber="3"/>`;
        const offset = source.indexOf("styleNumber") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.attributeName).toBe("styleNumber");
        expect(help.styleBreakdown).toBeDefined();
        expect(help.styleBreakdown!.styleNumber).toBe(3);
        const byKey = new Map(
            help.styleBreakdown!.entries.map((e) => [e.key, e]),
        );
        // <point> is marker-only — its breakdown should include marker* keys
        // (style/size/color/etc.) and nothing from line* / fill* prefixes.
        expect(byKey.has("markerStyle")).toBe(true);
        expect(byKey.has("markerSize")).toBe(true);
        expect(byKey.has("markerColor")).toBe(true);
        expect(byKey.has("lineWidth")).toBe(false);
        expect(byKey.has("fillOpacity")).toBe(false);
        // styleNumber=3 preset overrides markerStyle to "triangle".
        expect(byKey.get("markerStyle")?.value).toBe("triangle");
    });

    it("uses line + fill prefixes for a polygon's styleNumber breakdown", async () => {
        const source = `<polygon styleNumber="2"/>`;
        const offset = source.indexOf("styleNumber") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute" || !help.styleBreakdown) {
            expect.fail("expected attribute help with styleBreakdown");
            return;
        }
        const keys = new Set(help.styleBreakdown.entries.map((e) => e.key));
        expect(keys.has("lineWidth")).toBe(true);
        expect(keys.has("lineColor")).toBe(true);
        expect(keys.has("fillColor")).toBe(true);
        expect(keys.has("fillOpacity")).toBe(true);
        // marker prefix isn't in polygon's override schema — confirm we
        // don't accidentally surface marker* keys here.
        expect(keys.has("markerStyle")).toBe(false);
        expect(keys.has("markerColor")).toBe(false);
    });

    it("populates styleBreakdown for any attribute inside a <styleDefinition>", async () => {
        // Cursor on the markerStyle attribute name of a <styleDefinition>.
        // The breakdown row shows the full resolved listing for the active
        // styleNumber so authors see what the styleDefinition produces
        // (separate from the per-attribute "Active default" row).
        const source = `<setup><styleDefinition styleNumber="2" markerStyle="diamond"/></setup>`;
        const offset = source.indexOf("markerStyle") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute" || !help.styleBreakdown) {
            expect.fail("expected attribute help with styleBreakdown");
            return;
        }
        expect(help.styleBreakdown.styleNumber).toBe(2);
        const byKey = new Map(
            help.styleBreakdown.entries.map((e) => [e.key, e]),
        );
        // Inside <styleDefinition> the breakdown is unfiltered — line/marker/
        // fill/text/highContrast/background prefixes all show up.
        expect(byKey.has("markerStyle")).toBe(true);
        expect(byKey.has("lineColor")).toBe(true);
        expect(byKey.has("fillOpacity")).toBe(true);
        expect(byKey.has("textColor")).toBe(true);
        // Authored value wins over the styleNumber=2 preset's "square".
        expect(byKey.get("markerStyle")?.value).toBe("diamond");
    });

    it("does not populate styleBreakdown for a non-styleNumber attribute on a graphical component", async () => {
        // markerStyle on a <point> still gets `activeDefault` (#1198), but the
        // breakdown row is reserved for the styleNumber attribute / inside-
        // <styleDefinition> cases per the issue's scope.
        const source = `<point markerStyle="square"/>`;
        const offset = source.indexOf("markerStyle") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.styleBreakdown).toBeUndefined();
    });

    it("does not populate styleBreakdown for styleNumber on a component with no style override categories", async () => {
        // <math> has a styleNumber attribute (inherited from BaseComponent)
        // but no per-component style overrides — its breakdown filter would
        // be empty, so we skip the row entirely.
        const source = `<math styleNumber="2">x</math>`;
        const offset = source.indexOf("styleNumber") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.styleBreakdown).toBeUndefined();
    });

    it("breakdown reflects ancestor <styleDefinition> overrides at the cursor's scope", async () => {
        // styleNumber=1 preset has markerStyle="circle"; the ancestor
        // styleDefinition overrides it to "square". The breakdown at the
        // <point>'s styleNumber cursor should show the override.
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="square"/>
            </setup>
            <point styleNumber="1"/>
        `;
        const offset = source.indexOf("styleNumber", source.indexOf("<point"));
        const help = await helpAt(source, offset + 3);
        if (help.kind !== "attribute" || !help.styleBreakdown) {
            expect.fail("expected attribute help with styleBreakdown");
            return;
        }
        const markerStyleEntry = help.styleBreakdown.entries.find(
            (e) => e.key === "markerStyle",
        );
        expect(markerStyleEntry?.value).toBe("square");
    });

    it("populates an unfiltered breakdown for cursor on styleNumber of a <styleDefinition>", async () => {
        // <styleDefinition>'s schema lists every style attribute, so the
        // inside-<styleDefinition> branch fires (and skips the per-component
        // prefix filter). The breakdown should reflect the styleNumber the
        // <styleDefinition> itself is defining.
        const source = `<setup><styleDefinition styleNumber="4" markerStyle="diamond"/></setup>`;
        const offset = source.indexOf("styleNumber") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute" || !help.styleBreakdown) {
            expect.fail("expected attribute help with styleBreakdown");
            return;
        }
        expect(help.styleBreakdown.styleNumber).toBe(4);
        const byKey = new Map(
            help.styleBreakdown.entries.map((e) => [e.key, e]),
        );
        // styleNumber=4 preset has markerStyle="diamond"; the authored block
        // also says "diamond" — both paths agree, so we see "diamond".
        expect(byKey.get("markerStyle")?.value).toBe("diamond");
        // All prefixes present (no per-component filter).
        expect(byKey.has("lineWidth")).toBe(true);
        expect(byKey.has("fillColor")).toBe(true);
        expect(byKey.has("textColor")).toBe(true);
    });

    it("inside <styleDefinition>, breakdown INCLUDES the cursor's own attribute (unlike activeDefault)", async () => {
        // The two rows answer different questions:
        //   - activeDefault: "what would this resolve to without THIS attribute"
        //   - styleBreakdown: "what does this styleDefinition produce in total"
        // The breakdown must mirror the styleDefinition's authored value, not
        // exclude it like activeDefault does.
        const source = `<setup><styleDefinition styleNumber="1" markerStyle="diamond"/></setup>`;
        const offset = source.indexOf("markerStyle") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        // activeDefault excludes the current attribute → falls back to preset.
        expect(help.activeDefault).toEqual({
            value: "circle",
            styleNumber: 1,
        });
        // styleBreakdown does NOT exclude → shows authored value.
        const markerStyleEntry = help.styleBreakdown?.entries.find(
            (e) => e.key === "markerStyle",
        );
        expect(markerStyleEntry?.value).toBe("diamond");
    });
});

describe("computeContextHelp — styleBreakdown on <styleDefinition> tag name (#1204)", () => {
    it("populates styleBreakdown when cursor is on the <styleDefinition> opening tag name", async () => {
        // Cursor inside the tag-name token (not on an attribute) — element
        // help fires. The breakdown should still appear so authors who land
        // on the tag itself see what the styleDefinition resolves to without
        // having to click into a specific attribute.
        const source = `<setup><styleDefinition styleNumber="3" markerStyle="diamond"/></setup>`;
        // Offset between 's' and 't' of "styleDefinition" — squarely inside
        // the open tag name.
        const offset = source.indexOf("styleDefinition") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "element") {
            expect.fail(`expected element help, got ${help.kind}`);
            return;
        }
        expect(help.elementName).toBe("styleDefinition");
        expect(help.styleBreakdown).toBeDefined();
        expect(help.styleBreakdown!.styleNumber).toBe(3);
        const byKey = new Map(
            help.styleBreakdown!.entries.map((e) => [e.key, e]),
        );
        // Authored markerStyle wins over the styleNumber=3 preset's "triangle".
        expect(byKey.get("markerStyle")?.value).toBe("diamond");
        // Unfiltered breakdown — every prefix's keys come through.
        expect(byKey.has("lineColor")).toBe(true);
        expect(byKey.has("fillOpacity")).toBe(true);
        expect(byKey.has("textColor")).toBe(true);
    });

    it("defaults to styleNumber 1 when the <styleDefinition> has no styleNumber attribute", async () => {
        // Mirrors the runtime: a `<styleDefinition>` without an explicit
        // styleNumber defines styleNumber=1.  The breakdown should reflect
        // that, not skip the row.
        const source = `<setup><styleDefinition markerStyle="square"/></setup>`;
        const offset = source.indexOf("styleDefinition") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "element" || !help.styleBreakdown) {
            expect.fail("expected element help with styleBreakdown");
            return;
        }
        expect(help.styleBreakdown.styleNumber).toBe(1);
        const markerStyleEntry = help.styleBreakdown.entries.find(
            (e) => e.key === "markerStyle",
        );
        expect(markerStyleEntry?.value).toBe("square");
    });

    it("populates styleBreakdown when cursor is on the closing </styleDefinition> tag name", async () => {
        // `closeTagName` shares the element-help path with `openTagName`;
        // the breakdown should appear in both so cursor placement at either
        // end of the element is equally useful.
        const source = `<setup><styleDefinition styleNumber="2"></styleDefinition></setup>`;
        const offset = source.indexOf("</styleDefinition") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "element" || !help.styleBreakdown) {
            expect.fail("expected element help with styleBreakdown");
            return;
        }
        expect(help.styleBreakdown.styleNumber).toBe(2);
        // styleNumber=2 preset's markerStyle is "square".
        const markerStyleEntry = help.styleBreakdown.entries.find(
            (e) => e.key === "markerStyle",
        );
        expect(markerStyleEntry?.value).toBe("square");
    });

    it("does not populate styleBreakdown on non-<styleDefinition> element help", async () => {
        // Cursor on `<point>`'s tag name — element help fires, but the
        // breakdown row is reserved for <styleDefinition> in the element
        // branch.  (The styleNumber attribute on <point> still gets a
        // breakdown via the attribute branch — different trigger.)
        const source = `<point styleNumber="3"/>`;
        const offset = source.indexOf("point") + 2;
        const help = await helpAt(source, offset);
        if (help.kind !== "element") {
            expect.fail(`expected element help, got ${help.kind}`);
            return;
        }
        expect(help.styleBreakdown).toBeUndefined();
    });

    it("element help on a <styleDefinition> autocomplete row (no node yet) omits the breakdown", async () => {
        // The `component`-kind autocomplete branch in `computeContextHelpForCompletion`
        // resolves the schema entry against itself with no surrounding node,
        // so there's no DAST node to feed into the resolver — the breakdown
        // is correctly absent.  Sanity-checks that we didn't accidentally
        // wire context through a branch that doesn't have it.
        const source = `<`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "styleDefinition",
            type: "component",
        });
        if (help.kind !== "element") {
            expect.fail(`expected element help, got ${help.kind}`);
            return;
        }
        expect(help.elementName).toBe("styleDefinition");
        expect(help.styleBreakdown).toBeUndefined();
    });
});

describe("computeContextHelp — property reference (refMember)", () => {
    it("returns property help when cursor is at end of $ref.property", async () => {
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "property",
            elementName: "math",
        });
        if (help.kind === "property") {
            expect(help.propertyName.toLowerCase()).toBe("displaydecimals");
            expect(help.description).toBeTruthy();
        }
    });

    it("returns property help when cursor is in the middle of the property name", async () => {
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        // Cursor inside "display|Decimals".
        const offset = source.indexOf("displayDecimals") + 7;
        expect((await helpAt(source, offset)).kind).toBe("property");
    });

    it("returns property help when cursor is at the start of the property name", async () => {
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        // Cursor right after the dot, before any character of the property.
        const offset = source.indexOf(".displayDecimals") + 1;
        expect((await helpAt(source, offset)).kind).toBe("property");
    });

    it("returns none for unknown property names", async () => {
        const source = `<math name="m">x</math>\n$m.notARealProperty`;
        expect((await helpAt(source, source.length)).kind).toBe("none");
    });

    it("returns none when the referent name doesn't match any element", async () => {
        const source = `<math>x</math>\n$nonexistent.coords`;
        expect((await helpAt(source, source.length)).kind).toBe("none");
    });

    it("returns an unsupportedRefChain placeholder for multi-part chains the resolver can't walk", async () => {
        // Length-3 chain with no resolver-backed answer — the stub adapter
        // returns `{ node: null }`, and `helpForRefMemberByName` surfaces
        // the placeholder so a user staring at `$a.b.c` knows *something*
        // about the cursor position rather than getting a blank panel.
        // With a real resolver wired in (the LSP path), most chains in
        // this shape do resolve through to real help — see
        // `computeContextHelp.resolver.test.ts`.
        const source = `<math name="m">x</math>\n$m.foo.displayDecimals`;
        expect((await helpAt(source, source.length)).kind).toBe(
            "unsupportedRefChain",
        );
    });
});

describe("computeContextHelp — bare ref ($name)", () => {
    it("returns refName help when cursor is on a bare $name", async () => {
        const source = `<math name="m">x</math>\n$m`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "m",
            // For bare refs the displayed chain is just the ref name itself.
            displayPath: "m",
            targetElementName: "math",
        });
        if (help.kind === "refName") {
            // <math> starts at offset 0 — line 1.
            expect(help.line).toBe(1);
        }
    });

    it("returns refName help when cursor is mid-identifier on $myName", async () => {
        const source = `<math name="myName">x</math>\n$myName`;
        // Cursor between 'y' and 'N' inside "myName" of the ref.
        const offset = source.length - 4;
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "myName",
            targetElementName: "math",
        });
    });

    it("treats $m.displayDecimals as one unit: same property help on the name segment as on the member", async () => {
        // A reference and its member chain are a single unit — placing the
        // cursor on `m` (the name segment) yields the same help as placing it
        // on `displayDecimals` (the member): it's a reference to the
        // displayDecimals property either way.
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        // Cursor right after the 'm', before the '.'.
        const onName = source.indexOf("$m") + 2;
        const onMember = source.length;
        const helpName = await helpAt(source, onName);
        const helpMember = await helpAt(source, onMember);
        expect(helpName.kind).toBe("property");
        expect(helpName).toEqual(helpMember);
        if (helpName.kind === "property") {
            expect(helpName.propertyName.toLowerCase()).toBe("displaydecimals");
            expect(helpName.displayPath).toBe("m.displayDecimals");
        }
    });

    it("returns an indeterminate unresolvedRef for a $name that doesn't resolve without a resolver", async () => {
        // The stub adapter exposes no authoritative resolver, so the help
        // layer must not claim "no referent" — it surfaces the hedged
        // indeterminate state instead of a definite verdict.
        const source = `<math>x</math>\n$nonexistent`;
        const help = await helpAt(source, source.length);
        expect(help).toEqual({
            kind: "unresolvedRef",
            displayPath: "nonexistent",
            reason: "indeterminate",
        });
    });

    it("resolves a bare $name inside <matrix> to the aliased row element", async () => {
        // <row name="r"> inside <matrix> sugars to matrixRow. Reference help
        // names the referent's authored tag ("row") but, unlike element help,
        // carries no component summary or docs link — the panel frames a
        // reference around the reference concept, not the target's page.
        const source = `<matrix>\n  <row name="r">1 2 3</row>\n</matrix>\n$r`;
        const help = await helpAt(source, source.length);
        if (help.kind !== "refName") {
            expect.fail(`expected refName help, got ${help.kind}`);
            return;
        }
        expect(help.refName).toBe("r");
        expect(help.targetElementName).toBe("row");
    });

    it("reports the line where the referent is defined", async () => {
        const source = `<p>intro</p>\n<p>more</p>\n<math name="m">x</math>\n$m`;
        const help = await helpAt(source, source.length);
        if (help.kind !== "refName") {
            expect.fail(`expected refName help, got ${help.kind}`);
            return;
        }
        // <math> sits on line 3 in the authored source.
        expect(help.line).toBe(3);
    });

    it("shows reference help when the cursor is on a $ref inside an attribute value", async () => {
        // `extend="$m"`: the cursor sits on the `$m` reference inside the
        // attribute value. Reference help (what it points at + where) takes
        // precedence over `extend` attribute help.
        const source = `<math name="m">x</math>\n<math extend="$m"/>`;
        const offset = source.lastIndexOf("$m") + 1; // on the 'm' of $m
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "m",
            targetElementName: "math",
            line: 1,
        });
    });
});

describe("computeContextHelp — refMember resolving to a named descendant", () => {
    it("returns refName help when $sec.bi resolves to a named child element", async () => {
        const source = `<section name="sec"><booleanInput name="bi"/></section>\n$sec.bi`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "bi",
            displayPath: "sec.bi",
            targetElementName: "booleanInput",
        });
    });

    it("treats $sec.bi as one unit: same descendant help on the sec segment as on bi", async () => {
        // Placing the cursor on the `sec` segment yields the same help as on
        // `bi` — the whole `$sec.bi` chain is one reference, resolving to the
        // booleanInput descendant either way.
        const source = `<section name="sec"><booleanInput name="bi"/></section>\n$sec.bi`;
        const onSec = source.indexOf("$sec") + 2; // inside "sec"
        const onBi = source.length; // inside "bi"
        const helpSec = await helpAt(source, onSec);
        const helpBi = await helpAt(source, onBi);
        expect(helpSec).toEqual(helpBi);
        expect(helpSec).toMatchObject({
            kind: "refName",
            refName: "bi",
            displayPath: "sec.bi",
            targetElementName: "booleanInput",
        });
    });

    it("falls through to property help when no named descendant matches", async () => {
        // `displayDecimals` is a math property; <math> has no descendants
        // named "displayDecimals", so the existing property branch handles
        // it and we get property help, not refName help.
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        const help = await helpAt(source, source.length);
        expect(help.kind).toBe("property");
    });

    it("prefers a named descendant over a same-named property (descendants shadow properties)", async () => {
        // Construct a case where the property name is shadowed by a child
        // element with the same name. <section> has a `hidden` property
        // (inherited from base components); a child element named "hidden"
        // shadows the property under runtime ref-resolution rules.
        const source = `<section name="sec"><booleanInput name="hidden"/></section>\n$sec.hidden`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "hidden",
            targetElementName: "booleanInput",
        });
    });
});

describe("computeContextHelp — hyphenated names in $(...) macros", () => {
    it("resolves a hyphenated bare ref name with cursor mid-identifier", async () => {
        // The rightward identifier scan must use the macro char class
        // (`[A-Za-z0-9_-]`) when the cursor sits inside `$(...)`, so a cursor
        // between the `o` of "foo" and the `-` of "-bar" still captures the
        // full "foo-bar" rather than truncating at `-`. The displayed path
        // wraps the hyphenated segment in parens so the sentence reads
        // `$(foo-bar) references <math> ...`.
        const source = `<math name="foo-bar">x</math>\n$(foo-bar)`;
        const offset = source.indexOf("foo-bar)") + 3; // between 'foo' and '-bar'
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "foo-bar",
            displayPath: "(foo-bar)",
            targetElementName: "math",
        });
    });

    it("resolves a hyphenated descendant name in $(base).(my-p) with cursor mid-identifier", async () => {
        // `$(base).(my-p)` should resolve to the descendant `<p name="my-p"/>`,
        // not truncate at the hyphen and fall through to property lookup.
        // Only the hyphenated segment is wrapped in parens.
        const source = `<section name="base"><p name="my-p"/></section>\n$(base).(my-p)`;
        const offset = source.indexOf("my-p)") + 2; // between 'my' and '-p'
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "my-p",
            displayPath: "base.(my-p)",
            targetElementName: "p",
        });
    });
});

describe("computeContextHelp — indexed path segments in displayPath", () => {
    it("preserves a bracket index on the prefix segment of $rep[1].myMath", async () => {
        // The JS-only fallback in helpForRefMember ignores takesIndex
        // semantics, so it incidentally resolves the descendant
        // `<math name="myMath"/>` here. The rendered sentence should still
        // match what the author wrote — preserving the `[1]` on the prefix
        // segment — rather than dropping the index to "rep.myMath". With
        // a Rust adapter attached (the LSP path), this same assertion will
        // hold via the proper resolver-backed lookup.
        const source = `<repeatForSequence name="rep"><math name="myMath">x</math></repeatForSequence>\n$rep[1].myMath`;
        const help = await helpAt(source, source.length);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "myMath",
            displayPath: "rep[1].myMath",
            targetElementName: "math",
        });
    });
});

describe("computeContextHelp — childAliases (sugar redirection)", () => {
    it("redirects <row> inside <matrix> to matrixRow help", async () => {
        const source = `<matrix>\n  <row>1 2 3</row>\n</matrix>`;
        const offset = source.indexOf("<row>") + 2;
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "element",
            // The author wrote <row>, so display "row" — but the docs link
            // and summary come from matrixRow.
            elementName: "row",
            docsSlug: "row_matrix",
        });
        if (help.kind === "element") {
            expect(help.summary).toMatch(/matrix/i);
        }
    });

    it("redirects <column> inside <matrix> to matrixColumn help", async () => {
        const source = `<matrix>\n  <column>1 2 3</column>\n</matrix>`;
        const offset = source.indexOf("<column>") + 2;
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "column",
            // The author wrote <column>, so display "column" — but the docs link
            // and summary come from matrixColumn.
            docsSlug: "column_matrix",
        });
    });

    it("uses tabular row help when <row> is NOT inside <matrix>", async () => {
        const source = `<tabular>\n  <row>cell</row>\n</tabular>`;
        const offset = source.indexOf("<row>") + 2;
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "element",
            elementName: "row",
            docsSlug: "row_table",
        });
    });

    it("routes attribute lookup through the alias target", async () => {
        // matrixRow extends MathList, so it has `functionSymbols`. Tabular
        // <row> does not. If alias redirection is wired into the attribute
        // path, this attribute resolves to non-none.
        const source = `<matrix>\n  <row functionSymbols="f">x</row>\n</matrix>`;
        const offset = source.indexOf("functionSymbols") + 3;
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "attribute",
            attributeName: "functionSymbols",
        });
    });

    it("routes $ref.property lookup through the alias target", async () => {
        // `maxNumber` lives on matrixRow (math-list semantics), not on the
        // canonical tabular `row` entry. Without alias-aware property
        // resolution, $r.maxNumber inside <matrix> would surface no help —
        // disagreeing with the autocomplete dropdown, which IS alias-aware.
        const source = `<matrix>\n  <row name="r">1 2 3</row>\n</matrix>\n$r.maxNumber`;
        const help = await helpAt(source, source.length);
        if (help.kind !== "property") {
            expect.fail(`expected property help, got ${help.kind}`);
            return;
        }
        expect(help.elementName).toBe("row"); // authored name preserved
        expect(help.propertyName.toLowerCase()).toBe("maxnumber");
        expect(help.description).toBeTruthy();
        // The full authored chain is carried for the panel sentence.
        expect(help.displayPath).toBe("r.maxNumber");
    });

    it("returns none for a $ref.property whose name only exists on the canonical entry when alias is in scope", async () => {
        // `rowNum` is a tabular-row property. Inside <matrix>, the `<row>`
        // is sugared to matrixRow, which has no `rowNum`. Returning none
        // (rather than the misleading tabular description) keeps the panel
        // honest about what's in scope.
        const source = `<matrix>\n  <row name="r">1 2 3</row>\n</matrix>\n$r.rowNum`;
        expect((await helpAt(source, source.length)).kind).toBe("none");
    });
});

describe("computeContextHelp — docsSlug propagation", () => {
    it("emits the default componentName-based slug when no override is set", async () => {
        const source = `<math>x</math>`;
        const help = await helpAt(source, 3);
        if (help.kind === "element") {
            expect(help.docsSlug).toBe("math");
        } else {
            expect.fail(`expected element help, got ${help.kind}`);
        }
    });

    it("emits the override slug for components with explicit docsSlug", async () => {
        const source = `<answer>$x</answer>`;
        const help = await helpAt(source, 3);
        if (help.kind === "element") {
            expect(help.docsSlug).toBe("answer1");
        } else {
            expect.fail(`expected element help, got ${help.kind}`);
        }
    });

    it("attribute help carries the owning element's docsSlug", async () => {
        const source = `<point draggable="true"/>`;
        const offset = source.indexOf("draggable") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.docsSlug).toBe("point");
    });

    it("attribute help on alias-redirected child uses the alias target's slug", async () => {
        // `<row>` inside `<matrix>` is sugared to `<matrixRow>`. Help text
        // and the docs link must follow the alias so the link goes to the
        // matrixRow page, not the unrelated tabular row page.
        const source = `<matrix>\n  <row functionSymbols="f">x</row>\n</matrix>`;
        const offset = source.indexOf("functionSymbols") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.docsSlug).toBe("row_matrix");
    });

    it("property reference help carries the authored chain and container line, not a docs slug", async () => {
        // Property references are framed around the reference, so the payload
        // drops the container's docsSlug and instead carries the authored
        // chain plus the container's source line for the panel sentence.
        const source = `<math name="m">x</math>\n$m.displayDecimals`;
        const help = await helpAt(source, source.length);
        if (help.kind !== "property") {
            expect.fail(`expected property help, got ${help.kind}`);
            return;
        }
        expect(help.displayPath).toBe("m.displayDecimals");
        // <math name="m"> sits on line 1.
        expect(help.line).toBe(1);
        expect(help).not.toHaveProperty("docsSlug");
    });
});

describe("computeContextHelpForCompletion", () => {
    it("returns element help for a `component`-kind completion when cursor is not in a refMember context", async () => {
        // `<a|` — author is typing an element name. The CodeMirror LSP plugin
        // tags element-schema rows with `type: "component"` (see
        // `deriveCompletionType` in `extensions/lsp/plugin.ts`). The
        // dispatcher should treat this as an element lookup.
        const source = `<a`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "abs",
            type: "component",
        });
        expect(help).toMatchObject({
            kind: "element",
            elementName: "abs",
        });
    });

    it("returns refMember property help for a `refproperty`-kind completion inside a refMember context", async () => {
        // `$m.|` — element-property completions surface here tagged
        // `type: "refproperty"`; disambiguation comes from the cursor's
        // completion context (refMember vs body).
        const source = `<math name="m">x</math>\n$m.`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "displayDecimals",
            type: "refproperty",
        });
        expect(help).toMatchObject({
            kind: "property",
            elementName: "math",
        });
        if (help.kind === "property") {
            expect(help.propertyName.toLowerCase()).toBe("displaydecimals");
        }
    });

    it("returns attribute help for an `enum`-kind attribute-name completion", async () => {
        const source = `<math `;
        const help = await helpForCompletionAt(source, source.length, {
            label: "simplify",
            type: "enum",
        });
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "math",
            attributeName: "simplify",
        });
    });

    it("returns attribute help for a `value`-kind attribute-value completion (no per-value help)", async () => {
        const source = `<math simplify="`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "full",
            type: "value",
        });
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "math",
            attributeName: "simplify",
        });
    });

    it("falls back to element help for a `value`-kind completion on an unknown attribute (`<math bad=foo`)", async () => {
        // When the user types `<math bad=foo`, the autocomplete fires with
        // a value-kind row (`"foo"`) highlighted. The cursor-driven path
        // would show element help here; the completion path must agree
        // rather than blanking out.
        const source = `<math bad=foo`;
        const help = await helpForCompletionAt(source, source.length, {
            label: '"foo"',
            type: "value",
        });
        expect(help).toMatchObject({
            kind: "element",
            elementName: "math",
        });
    });

    it("falls back to element help for an `enum`-kind completion on an unknown attribute name", async () => {
        // Defensive: if a producer ever surfaces an unknown attribute label
        // in an enum-kind completion, we shouldn't blank the panel.
        const source = `<math `;
        const help = await helpForCompletionAt(source, source.length, {
            label: "definitelyNotARealAttribute",
            type: "enum",
        });
        expect(help).toMatchObject({
            kind: "element",
            elementName: "math",
        });
    });

    it("returns attribute help for a `value`-kind completion on an unquoted partial value", async () => {
        // Autocomplete fires for `<math simplify=f|` even though there's no
        // opening quote — the help panel should still resolve back through
        // the unquoted-spillover detection to show `simplify` help.
        const source = `<math simplify=f`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "full",
            type: "value",
        });
        expect(help).toMatchObject({
            kind: "attribute",
            elementName: "math",
            attributeName: "simplify",
        });
    });

    it("returns refName help for a `reference`-kind completion", async () => {
        const source = `<math name="m">x</math>\n$`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "m",
            type: "reference",
        });
        expect(help).toMatchObject({
            kind: "refName",
            refName: "m",
            targetElementName: "math",
        });
    });

    it("strips a leading `$` from reference completion labels defensively", async () => {
        const source = `<math name="m">x</math>\n$`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "$m",
            type: "reference",
        });
        expect(help).toMatchObject({
            kind: "refName",
            refName: "m",
            targetElementName: "math",
        });
    });

    it("returns snippet help with description and template text for a snippet completion", async () => {
        // `answer-labeled` is a stable snippet in the bundled set (see
        // packages/static-assets/src/generated/completion-snippets.json).
        const source = ``;
        const help = await helpForCompletionAt(source, 0, {
            label: "answer-labeled",
            type: "snippet",
        });
        if (help.kind !== "snippet") {
            expect.fail(`expected snippet help, got ${help.kind}`);
            return;
        }
        expect(help.snippetKey).toBe("answer-labeled");
        expect(help.elementName).toBe("answer");
        expect(help.description).toBeTruthy();
        expect(help.snippetText).toContain("<answer");
        expect(help.snippetText).toContain("<label>");
    });

    it("returns element help for a close-tag `closetag`-kind completion (`/math>`)", async () => {
        // The plugin tags close-tag rows `type: "closetag"` with labels like
        // `/math>`. The dispatcher must recognize the `/` prefix and resolve
        // through the surrounding element rather than treating the label as
        // an element name.
        const source = `<math>x`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "/math>",
            type: "closetag",
        });
        expect(help).toMatchObject({
            kind: "element",
            elementName: "math",
        });
    });

    it("returns refName help for a `reference`-kind `name[]` completion (takesIndex)", async () => {
        // For `takesIndex` referents (repeat, select, …) the LSP emits an
        // extra `name[]` row alongside the bare `name` row. Both should
        // resolve to the same target.
        const source = `<repeatForSequence name="rep"><math>x</math></repeatForSequence>\n$`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "rep[]",
            type: "reference",
        });
        expect(help).toMatchObject({
            kind: "refName",
            refName: "rep",
            targetElementName: "repeatForSequence",
        });
    });

    it("returns NONE for an unknown completion label", async () => {
        const source = `<a`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "definitelyNotAnElement",
            type: "component",
        });
        expect(help.kind).toBe("none");
    });

    it("returns NONE for a completion with no type", async () => {
        const source = `<a`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "abs",
        });
        expect(help.kind).toBe("none");
    });
});

describe("computeContextHelp — repeat-introduced names (valueName/indexName)", () => {
    it("returns refName help with derivedFrom for a valueName binding", async () => {
        // `$v` inside the repeat body resolves to the iteration value;
        // `getReferentAtOffset` misses it (no `name="v"` anywhere), so the
        // derived-repeat fallback supplies the binding info. Pure AST —
        // works without any resolver attached.
        const source = `<repeatForSequence name="rep" from="1" to="3" valueName="v">$v</repeatForSequence>`;
        const offset = source.indexOf("$v") + 2;
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "v",
            targetElementName: "repeatForSequence",
            derivedFrom: {
                role: "valueName",
                ownerElementName: "repeatForSequence",
                ownerLine: 1,
            },
        });
    });

    it("returns refName help with derivedFrom for an indexName binding on <repeat>", async () => {
        const source = `<repeat name="rep" for="1 2 3" indexName="i">$i</repeat>`;
        const offset = source.indexOf("$i") + 2;
        const help = await helpAt(source, offset);
        expect(help).toMatchObject({
            kind: "refName",
            refName: "i",
            targetElementName: "repeat",
            derivedFrom: { role: "indexName", ownerElementName: "repeat" },
        });
    });

    it("returns an indeterminate unresolvedRef when a derived name is referenced outside its repeat scope", async () => {
        // `$v` after the repeat closes is out of scope — neither the
        // named-element walk nor the derived-repeat walk finds it. With no
        // authoritative resolver attached (stub adapter), the help layer
        // hedges with `indeterminate` rather than asserting "no referent".
        const source = `<repeatForSequence name="rep" from="1" to="3" valueName="v"><math>x</math></repeatForSequence>\n$v`;
        const help = await helpAt(source, source.length);
        expect(help).toEqual({
            kind: "unresolvedRef",
            displayPath: "v",
            reason: "indeterminate",
        });
    });

    it("returns derivedFrom for a `reference`-kind completion on a valueName row", async () => {
        // Mirrors how the autocomplete dropdown surfaces the binding. Both
        // the cursor-driven and completion-driven help paths feed through
        // `helpForRefNameByName`, so the derivedFrom annotation appears for
        // both — the panel agrees with the highlighted row.
        const source = `<repeatForSequence name="rep" from="1" to="3" valueName="v">$</repeatForSequence>`;
        const offset = source.indexOf("$") + 1;
        const help = await helpForCompletionAt(source, offset, {
            label: "v",
            type: "reference",
        });
        expect(help).toMatchObject({
            kind: "refName",
            refName: "v",
            derivedFrom: { role: "valueName" },
        });
    });

    it("returns derivedFrom for a `reference`-kind completion at $r[1].| highlighting valueName `v`", async () => {
        // The user's #1086 regression report: at `$r[1].` with the
        // autocomplete dropdown open and the `v` row highlighted (down-arrowed
        // but not yet inserted), the help panel was blank because the
        // `reference`-kind branch routed through `helpForRefNameByName` —
        // which then looked up `v` as a bare ref from the cursor's position
        // (OUTSIDE the repeat) and found no enclosing ancestor with
        // `valueName="v"`.  Routing through `helpForRefMemberByName` in
        // `refMember` context resolves through the container instead, and
        // the derived-repeat-on-container fallback recovers the help.
        const source = `<repeatForSequence name="r" from="1" to="5" valueName="v"><p><math name="myMath" simplify>2$v</math></p></repeatForSequence>\n$r[1].`;
        const help = await helpForCompletionAt(source, source.length, {
            label: "v",
            type: "reference",
        });
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
});

describe("computeContextHelp — functionNamesBreakdown on <mathInput> (#1205)", () => {
    it("populates functionNamesBreakdown when cursor is on additionalFunctionNames", async () => {
        const source = `<mathInput additionalFunctionNames="erf" removedFunctionNames="min"/>`;
        const offset = source.indexOf("additionalFunctionNames") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute" || !help.functionNamesBreakdown) {
            expect.fail("expected attribute help with functionNamesBreakdown");
            return;
        }
        expect(help.functionNamesBreakdown.added).toEqual(["erf"]);
        expect(help.functionNamesBreakdown.removed).toEqual(["min"]);
        const names = new Set(help.functionNamesBreakdown.names);
        // Authored addition is in the effective list, authored removal is not,
        // and untouched defaults like `sin` and `max` survive the merge.
        expect(names.has("erf")).toBe(true);
        expect(names.has("min")).toBe(false);
        expect(names.has("sin")).toBe(true);
        expect(names.has("max")).toBe(true);
    });

    it("populates functionNamesBreakdown when cursor is on removedFunctionNames", async () => {
        const source = `<mathInput additionalFunctionNames="erf" removedFunctionNames="min max"/>`;
        const offset = source.indexOf("removedFunctionNames") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute" || !help.functionNamesBreakdown) {
            expect.fail("expected attribute help with functionNamesBreakdown");
            return;
        }
        expect(help.functionNamesBreakdown.removed).toEqual(["min", "max"]);
        const names = new Set(help.functionNamesBreakdown.names);
        expect(names.has("min")).toBe(false);
        expect(names.has("max")).toBe(false);
        expect(names.has("erf")).toBe(true);
        expect(names.has("sin")).toBe(true);
    });

    it("works when only one of the two attributes is authored", async () => {
        const source = `<mathInput removedFunctionNames="min"/>`;
        const offset = source.indexOf("removedFunctionNames") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute" || !help.functionNamesBreakdown) {
            expect.fail("expected attribute help with functionNamesBreakdown");
            return;
        }
        expect(help.functionNamesBreakdown.added).toEqual([]);
        expect(help.functionNamesBreakdown.removed).toEqual(["min"]);
        expect(help.functionNamesBreakdown.names).not.toContain("min");
        expect(help.functionNamesBreakdown.names).toContain("sin");
    });

    it("does not populate functionNamesBreakdown on unrelated attributes", async () => {
        const source = `<mathInput prefill="x"/>`;
        const offset = source.indexOf("prefill") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute") {
            expect.fail(`expected attribute help, got ${help.kind}`);
            return;
        }
        expect(help.functionNamesBreakdown).toBeUndefined();
    });

    it("resetFunctionNames overrides the other two attributes", async () => {
        const source = `<mathInput additionalFunctionNames="erf" removedFunctionNames="cos" resetFunctionNames="sin tan"/>`;
        const offset = source.indexOf("resetFunctionNames") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute" || !help.functionNamesBreakdown) {
            expect.fail("expected attribute help with functionNamesBreakdown");
            return;
        }
        // `reset` carries the verbatim authored list and signals override.
        expect(help.functionNamesBreakdown.reset).toEqual(["sin", "tan"]);
        // `names` matches `reset` — defaults and add/remove are ignored.
        expect(help.functionNamesBreakdown.names).toEqual(["sin", "tan"]);
        // The authored deltas are still surfaced on the payload (inactive),
        // so the panel can show what the author wrote.
        expect(help.functionNamesBreakdown.added).toEqual(["erf"]);
        expect(help.functionNamesBreakdown.removed).toEqual(["cos"]);
    });

    it("empty resetFunctionNames disables auto-formatting entirely", async () => {
        const source = `<mathInput resetFunctionNames=""/>`;
        const offset = source.indexOf("resetFunctionNames") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute" || !help.functionNamesBreakdown) {
            expect.fail("expected attribute help with functionNamesBreakdown");
            return;
        }
        // Authored empty reset is distinct from absent: the effective list
        // is empty (no identifier auto-formats), matching the runtime's
        // `defaultValue: null` semantics.
        expect(help.functionNamesBreakdown.reset).toEqual([]);
        expect(help.functionNamesBreakdown.names).toEqual([]);
    });

    it("omits the reset field when resetFunctionNames is absent", async () => {
        const source = `<mathInput additionalFunctionNames="erf"/>`;
        const offset = source.indexOf("additionalFunctionNames") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "attribute" || !help.functionNamesBreakdown) {
            expect.fail("expected attribute help with functionNamesBreakdown");
            return;
        }
        expect(help.functionNamesBreakdown.reset).toBeUndefined();
    });
});

describe("computeContextHelp — body / top-level suggestions", () => {
    it("returns a sized, totalled suggestions payload for a <section> body", async () => {
        const source = `<section>\n  \n</section>`;
        // Offset on the blank middle line, inside the section body.
        const offset = source.indexOf("\n  \n") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        expect(help.context).toEqual({ elementName: "section" });
        expect(help.suggested.length).toBeGreaterThan(0);
        expect(help.suggested.length).toBeLessThanOrEqual(6);
        // The full allowed-children set is much larger than the shown subset,
        // so the panel can point at Ctrl+Space for the rest.
        expect(help.totalAllowed).toBeGreaterThan(help.suggested.length);
    });

    it("suggests top-level components for a cursor in empty top-level whitespace", async () => {
        const source = `\n\n`;
        const help = await helpAt(source, 1);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        expect(help.context).toEqual({ topLevel: true });
        expect(help.suggested.length).toBeGreaterThan(0);
        expect(help.suggested.length).toBeLessThanOrEqual(6);
    });

    it("carries each suggestion's casing, summary, and docsSlug", async () => {
        const source = `<section>\n  \n</section>`;
        const offset = source.indexOf("\n  \n") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        const first = help.suggested[0];
        expect(first).toBeDefined();
        expect(first.summary).toBeTruthy();
        expect(first.docsSlug).toBeTruthy();
    });

    it("drops adapter-only children from <number> body suggestions", async () => {
        // <point>, <function>, <mathInput> are allowed inside <number> only
        // because they adapt to <math> (childBuckets bucket 2). They're rarely
        // typed literally inside a number, so they must not crowd out the
        // natural direct children (<math>, <number>, <text>).
        const source = `<number>\n  \n</number>`;
        const offset = source.indexOf("\n  \n") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        const names = help.suggested.map((s) => s.name);
        expect(names).not.toContain("point");
        expect(names).not.toContain("function");
        expect(names).not.toContain("mathInput");
        // Direct children survive.
        expect(names).toContain("math");
        expect(names).toContain("number");
        expect(names).toContain("text");
    });

    it("does NOT treat the cursor inside a close tag's </ as body", async () => {
        // `<mathInput><|/mathInput>` — the cursor is one character into the
        // `</` of the close tag, NOT between the tags. The help should be
        // element help for `<mathInput>`, not body-suggestions.
        const source = `<mathInput></mathInput>`;
        const offset = source.indexOf("</") + 1;
        const help = await helpAt(source, offset);
        expect(help.kind).toBe("element");
        if (help.kind === "element") {
            expect(help.elementName).toBe("mathInput");
        }
    });

    it("reports no allowed children for <variantControl> body", async () => {
        // `<variantControl>` accepts no element children and no string
        // children — the panel uses this to say so rather than pointing at
        // Ctrl+Space (which would have nothing to offer).
        const source = `<variantControl>\n  \n</variantControl>`;
        const offset = source.indexOf("\n  \n") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        expect(help.totalAllowed).toBe(0);
        expect(help.acceptsStringChildren).toBe(false);
        expect(help.suggested).toEqual([]);
    });

    it("flags acceptsStringChildren for containers that take text", async () => {
        // `<math>` accepts string children and many element children, so
        // the panel should emit `acceptsStringChildren: true` alongside
        // the (positive) totalAllowed count.
        const source = `<math>\n  \n</math>`;
        const offset = source.indexOf("\n  \n") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        expect(help.acceptsStringChildren).toBe(true);
        expect(help.totalAllowed).toBeGreaterThan(0);
    });

    it("treats the cursor between adjacent open and close tags as body", async () => {
        // `<mathInput></mathInput>` with the cursor right between `>` and
        // `</` — the exact spot the autocompleter parks the cursor after
        // inserting a tag pair. The panel must show suggestions for what to
        // put inside, not element help for `<mathInput>` itself.
        const source = `<mathInput></mathInput>`;
        const offset = source.indexOf("</");
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(
                `expected suggestions help between adjacent tags, got ${help.kind}`,
            );
            return;
        }
        expect(help.context).toEqual({ elementName: "mathInput" });
    });

    it("surfaces the curated picks first inside a <module> body", async () => {
        // <module>'s override list seeds the top of the suggestions with the
        // niche-but-relevant `<moduleAttributes>` plus a handful of common
        // children, in the declared order.
        const source = `<module>\n  \n</module>`;
        const offset = source.indexOf("\n  \n") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        expect(help.suggested.slice(0, 5).map((s) => s.name)).toEqual([
            "moduleAttributes",
            "section",
            "graph",
            "p",
            "function",
        ]);
    });

    it("surfaces the curated picks first inside a <moduleAttributes> body", async () => {
        const source = `<module><moduleAttributes>\n  \n</moduleAttributes></module>`;
        const offset = source.indexOf("\n  \n") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        expect(help.suggested.slice(0, 5).map((s) => s.name)).toEqual([
            "number",
            "math",
            "text",
            "boolean",
            "point",
        ]);
    });

    it("surfaces the curated picks first inside a <setup> body", async () => {
        // <setup>'s override puts <select*> components ahead of the basic
        // value-producing components.
        const source = `<setup>\n  \n</setup>`;
        const offset = source.indexOf("\n  \n") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        // The override is longer than MAX_SUGGESTIONS (6) — so the panel
        // shows the first 6 entries of the override list, in declared order:
        // the four <select*> generators followed by the two <repeat*> ones.
        expect(help.suggested.slice(0, 6).map((s) => s.name)).toEqual([
            "select",
            "selectFromSequence",
            "selectPrimeNumbers",
            "selectRandomNumbers",
            "repeat",
            "repeatForSequence",
        ]);
    });

    it("lifts global favorites past niche direct children in <section>", async () => {
        // <section>'s direct (bucket-0) children are niche
        // (cascadeMessage/feedbackDefinition/setup/styleDefinition/title/
        // variantControl); without the favorites tier they'd dominate the
        // top 6 and push beginner-relevant inherited children like <p>
        // off-panel. With favorites, <p>/<title>/<math>/… lift to the top.
        const source = `<section>\n  \n</section>`;
        const offset = source.indexOf("\n  \n") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        const names = help.suggested.map((s) => s.name);
        // <title> leads via the inherited `_sectioningComponent` override.
        expect(names[0]).toBe("title");
        // <p> still surfaces via the global favorites tier.
        expect(names).toContain("p");
        // Niche bucket-0 children should be pushed past the favorites and not
        // appear in the panel's top 6.
        expect(names).not.toContain("variantControl");
        expect(names).not.toContain("feedbackDefinition");
    });

    it("never surfaces an adapter-rank element in <p> body suggestions", async () => {
        const source = `<p>\n  \n</p>`;
        const offset = source.indexOf("\n  \n") + 3;
        const help = await helpAt(source, offset);
        if (help.kind !== "suggestions") {
            expect.fail(`expected suggestions help, got ${help.kind}`);
            return;
        }
        const completer = attachStubAdapter(new AutoCompleter(source));
        const ranks = completer._getChildRanks("p");
        for (const s of help.suggested) {
            const bucket = ranks[s.name] ?? ranks[s.name.toLowerCase()] ?? 0;
            expect(bucket).toBeLessThan(2);
        }
    });
});
