/**
 * Unit tests for the static styleDefinition resolver (issue #1198).
 *
 * Anchors the LSP's "active default" hint against the same rules the worker
 * applies at runtime: ancestor `<styleDefinition>` blocks merge over the
 * built-in numbered presets, the leaf's styleNumber selects which slot to
 * read, and the inside-`<styleDefinition>` lookup excludes the styleDefinition
 * itself so authors see what their *peers* contribute rather than a tautology.
 */
import { describe, expect, it } from "vitest";
import { DoenetSourceObject } from "../doenet-source-object";
import type { DastElement } from "@doenet/parser";
import {
    detectStylePrefixesFromAttributes,
    relevantStyleKeysForPrefixes,
    resolveActiveStyle,
    resolveActiveStyleAttributeValue,
    resolveActiveStyleBreakdown,
    resolveActiveStyleNumber,
} from "./resolve-active-style";

/**
 * Find the first descendant element matching `name` (BFS — matches what an
 * author would point at first). The static resolver works in element-name
 * terms, so the helper avoids hand-walking the DAST in every test case.
 */
function findElement(sourceObj: DoenetSourceObject, name: string): DastElement {
    const queue: any[] = [sourceObj.dast];
    while (queue.length > 0) {
        const node = queue.shift();
        if (!node) continue;
        if (node.type === "element" && node.name === name) return node;
        if (Array.isArray(node.children)) {
            queue.push(...node.children);
        }
    }
    throw new Error(`No <${name}> element found in source`);
}

describe("resolveActiveStyleNumber", () => {
    it("defaults to 1 when nothing in the ancestor chain sets styleNumber", () => {
        const sourceObj = new DoenetSourceObject(`<point name="p"/>`);
        const point = findElement(sourceObj, "point");
        expect(resolveActiveStyleNumber(sourceObj, point)).toBe(1);
    });

    it("reads styleNumber off the element itself", () => {
        const sourceObj = new DoenetSourceObject(`<point styleNumber="3"/>`);
        const point = findElement(sourceObj, "point");
        expect(resolveActiveStyleNumber(sourceObj, point)).toBe(3);
    });

    it("inherits styleNumber from an ancestor (fallBackToParentStateVariable)", () => {
        const sourceObj = new DoenetSourceObject(
            `<section styleNumber="4"><point/></section>`,
        );
        const point = findElement(sourceObj, "point");
        expect(resolveActiveStyleNumber(sourceObj, point)).toBe(4);
    });

    it("reads its own styleNumber on a <styleDefinition>", () => {
        const sourceObj = new DoenetSourceObject(
            `<setup><styleDefinition styleNumber="5" markerStyle="square"/></setup>`,
        );
        const sd = findElement(sourceObj, "styleDefinition");
        expect(resolveActiveStyleNumber(sourceObj, sd)).toBe(5);
    });

    it("falls back to 1 when styleNumber is a macro reference (we don't evaluate macros)", () => {
        const sourceObj = new DoenetSourceObject(`<point styleNumber="$n"/>`);
        const point = findElement(sourceObj, "point");
        expect(resolveActiveStyleNumber(sourceObj, point)).toBe(1);
    });
});

describe("resolveActiveStyle — built-in presets", () => {
    it("returns the built-in styleNumber=1 preset (markerStyle='circle') when no styleDefinition is in scope", () => {
        const sourceObj = new DoenetSourceObject(`<point/>`);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved).not.toBeNull();
        expect(resolved!.styleNumber).toBe(1);
        expect(resolved!.style.markerStyle).toBe("circle");
        expect(resolved!.style.lineWidth).toBe(4);
    });

    it("returns the built-in styleNumber=3 preset (markerStyle='triangle') for styleNumber='3'", () => {
        const sourceObj = new DoenetSourceObject(`<point styleNumber="3"/>`);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.styleNumber).toBe(3);
        expect(resolved!.style.markerStyle).toBe("triangle");
        expect(resolved!.style.lineWidth).toBe(3);
    });

    it("falls back to DEFAULT_STYLE_VALUES for an unknown styleNumber (no built-in preset for 9)", () => {
        const sourceObj = new DoenetSourceObject(`<point styleNumber="9"/>`);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.styleNumber).toBe(9);
        // Assert against a field where the preset path and the bare-fallback
        // path differ. styleNumber=1's preset runs through
        // `addMissingColorWordsToStyleDefinition`, so its `lineColorWord`
        // is the word derived from `#1f5dff`. The unknown-styleNumber
        // fallback skips that derivation and `resolveStyleDefinition` fills
        // the missing word with `""`. Asserting on `markerStyle="circle"`
        // alone wouldn't distinguish the paths since both seeds share it.
        expect(resolved!.style.lineColorWord).toBe("");
    });
});

describe("resolveActiveStyle — ancestor <styleDefinition> merge", () => {
    it("applies a <setup><styleDefinition>... block from the document scope", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="square" lineWidth="2"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.styleNumber).toBe(1);
        expect(resolved!.style.markerStyle).toBe("square");
        expect(resolved!.style.lineWidth).toBe(2);
    });

    it("walks a legacy <styleDefinitions> (plural) wrapper inside <setup>", () => {
        const source = `
            <setup>
                <styleDefinitions>
                    <styleDefinition styleNumber="1" markerStyle="diamond"/>
                </styleDefinitions>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.style.markerStyle).toBe("diamond");
    });

    it("only applies the styleDefinition with the matching styleNumber", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="square"/>
                <styleDefinition styleNumber="2" markerStyle="diamond"/>
            </setup>
            <point styleNumber="2"/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.styleNumber).toBe(2);
        // styleNumber=2 wins; built-in styleNumber=2 preset (square) is then
        // overridden by the authored "diamond".
        expect(resolved!.style.markerStyle).toBe("diamond");
    });

    it("merges deeper ancestors over shallower ones (closer-wins)", () => {
        const source = `
            <section>
                <setup>
                    <styleDefinition styleNumber="1" markerStyle="square" lineWidth="2"/>
                </setup>
                <subsection>
                    <setup>
                        <styleDefinition styleNumber="1" markerStyle="diamond"/>
                    </setup>
                    <point/>
                </subsection>
            </section>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        // The inner <subsection> overrides markerStyle, but the outer's
        // lineWidth=2 survives because nothing deeper touches it.
        expect(resolved!.style.markerStyle).toBe("diamond");
        expect(resolved!.style.lineWidth).toBe(2);
    });

    it("last-wins for same-styleNumber siblings within one ancestor", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="square"/>
                <styleDefinition styleNumber="1" markerStyle="diamond"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.style.markerStyle).toBe("diamond");
    });

    it("normalizes attribute text: numbers parse as numbers, booleans parse as booleans", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" lineWidth="7" markerFilled="false"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.style.lineWidth).toBe(7);
        expect(resolved!.style.markerFilled).toBe(false);
    });

    it("lowercases text attribute values to match StyleDefinitions.js runtime normalization", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="SQUARE"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.style.markerStyle).toBe("square");
    });
});

describe("resolveActiveStyle — exclude attribute", () => {
    it("excludes only the queried attribute, leaving the rest of the block in effect", () => {
        // Authoring inside <styleDefinition markerStyle="diamond" lineWidth="6"/>,
        // cursor on markerStyle. The active default for markerStyle should
        // be the inherited preset (this block doesn't contribute markerStyle
        // any more), but lineWidth=6 still applies (other attributes on the
        // block weren't dropped).
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="diamond" lineWidth="6"/>
            </setup>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const sd = findElement(sourceObj, "styleDefinition");
        const resolved = resolveActiveStyle(sourceObj, sd, {
            excludeAttribute: { node: sd, attributeName: "markerStyle" },
        });
        expect(resolved!.style.markerStyle).toBe("circle");
        expect(resolved!.style.lineWidth).toBe(6);
    });

    it("still picks up peer <styleDefinition> values when excluding an attribute on the current node", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="square"/>
                <styleDefinition styleNumber="1" lineWidth="6"/>
            </setup>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const sds = sourceObj.dast.children
            .filter(
                (c): c is DastElement =>
                    c.type === "element" && c.name === "setup",
            )[0]
            .children.filter(
                (c): c is DastElement =>
                    c.type === "element" && c.name === "styleDefinition",
            );
        const peerExcluded = resolveActiveStyle(sourceObj, sds[1], {
            excludeAttribute: { node: sds[1], attributeName: "lineWidth" },
        });
        // Peer (sibling) supplies markerStyle, lineWidth on the current
        // node is excluded so it falls back to the preset.
        expect(peerExcluded!.style.markerStyle).toBe("square");
        expect(peerExcluded!.style.lineWidth).toBe(4);
    });

    it("matches excludeAttribute.attributeName case-insensitively", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="diamond"/>
            </setup>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const sd = findElement(sourceObj, "styleDefinition");
        const resolved = resolveActiveStyle(sourceObj, sd, {
            excludeAttribute: { node: sd, attributeName: "MARKERSTYLE" },
        });
        expect(resolved!.style.markerStyle).toBe("circle");
    });
});

describe("resolveActiveStyle — runtime per-block derivation", () => {
    it("derives *ColorWord from the same-block *Color when only the color is authored", () => {
        // The runtime's `addMissingColorWordsToStyleDefinition` fills in
        // markerColorWord whenever markerColor is set but the word isn't,
        // overriding any inherited word. The LSP resolver must do the same
        // or the active default for markerColorWord would lag behind.
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerColor="#FF0000"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        // The hex itself comes through verbatim.
        expect(resolved!.style.markerColor).toBe("#ff0000");
        // The word is derived from the hex via colorValueToWord — for
        // pure red the canonical word should be "red".
        expect(resolved!.style.markerColorWord).toBe("red");
    });

    it("preserves an explicit *ColorWord when both the color and the word are authored on the same block", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerColor="#FF0000" markerColorWord="crimson"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.style.markerColorWord).toBe("crimson");
    });

    it("falls back to derivation when excluding the explicit *ColorWord (cursor-on-word case)", () => {
        // Authoring inside <styleDefinition markerColor="#FF0000" markerColorWord="custom"/>,
        // cursor on markerColorWord — the active default should reflect
        // "what would this resolve to if I removed markerColorWord", which
        // is the word derived from the color, not the inherited preset.
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerColor="#FF0000" markerColorWord="custom"/>
            </setup>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const sd = findElement(sourceObj, "styleDefinition");
        const resolved = resolveActiveStyle(sourceObj, sd, {
            excludeAttribute: { node: sd, attributeName: "markerColorWord" },
        });
        expect(resolved!.style.markerColorWord).toBe("red");
    });

    it('derives lineWidthWord from same-block lineWidth (lineWidth=2 → "" )', () => {
        // The styleNumber=1 preset has lineWidthWord="thick", but a block
        // setting lineWidth=2 derives lineWidthWord="" (2 is neither thick
        // (>=4) nor thin (<=1)). The LSP must show the derived value.
        const source = `
            <setup>
                <styleDefinition styleNumber="1" lineWidth="2"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.style.lineWidth).toBe(2);
        expect(resolved!.style.lineWidthWord).toBe("");
    });

    it('derives markerStyleWord from same-block markerStyle (triangleUp → "triangle")', () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="triangleUp"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.style.markerStyle).toBe("triangleup");
        // `markerStyle` "triangle*" → markerStyleWord "triangle".
        expect(resolved!.style.markerStyleWord).toBe("triangle");
    });

    it("fills missing dark-mode color from same-block light-mode color", () => {
        // The runtime's `addMissingChildStyleColorFields` derives an accessible
        // dark-mode color from the light-mode color (lightening it until it
        // clears WCAG AA on the dark canvas) when the dark value isn't explicit
        // on the block.
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerColor="#FF0000"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const resolved = resolveActiveStyle(sourceObj, point);
        expect(resolved!.style.markerColorDarkMode).toBe("#ff3333");
        expect(resolved!.style.markerColorWordDarkMode).toBe("red");
    });
});

describe("resolveActiveStyleAttributeValue", () => {
    it("returns the resolved value and source styleNumber for a known style attribute", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="2" markerStyle="diamond"/>
            </setup>
            <point styleNumber="2"/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const result = resolveActiveStyleAttributeValue(
            sourceObj,
            point,
            "markerStyle",
        );
        expect(result).toEqual({ value: "diamond", styleNumber: 2 });
    });

    it("matches the attribute name case-insensitively", () => {
        const sourceObj = new DoenetSourceObject(`<point/>`);
        const point = findElement(sourceObj, "point");
        const result = resolveActiveStyleAttributeValue(
            sourceObj,
            point,
            "MARKERSTYLE",
        );
        expect(result?.value).toBe("circle");
    });

    it("returns undefined for non-style attributes (no spurious activeDefault for things like draggable)", () => {
        const sourceObj = new DoenetSourceObject(`<point draggable="true"/>`);
        const point = findElement(sourceObj, "point");
        const result = resolveActiveStyleAttributeValue(
            sourceObj,
            point,
            "draggable",
        );
        expect(result).toBeUndefined();
    });

    it("attaches colorWord for a hex color attribute (built-in styleNumber=1 default lineColor)", () => {
        // Built-in styleNumber=1 ships lineColor="#1f5dff"; the resolver
        // should ride along the styleDefinition's own number (1) and pair
        // the hex with whatever word `colorValueToWord` derives.
        const sourceObj = new DoenetSourceObject(
            `<setup><styleDefinition styleNumber="1"/></setup>`,
        );
        const sd = findElement(sourceObj, "styleDefinition");
        const result = resolveActiveStyleAttributeValue(
            sourceObj,
            sd,
            "lineColor",
            { excludeAttribute: { node: sd, attributeName: "lineColor" } },
        );
        expect(result?.value).toBe("#1f5dff");
        // The derived word is whatever the nearest-canonical-color lookup
        // returns; just assert it's present and not the raw hex.
        expect(typeof result?.colorWord).toBe("string");
        expect(result?.colorWord).not.toBe(result?.value);
    });

    it("suppresses colorWord when the value already IS a CSS named color", () => {
        // <styleDefinition lineColor="red"/> excluded from itself falls back
        // to the styleNumber=1 preset (a hex) — to actually exercise the
        // named-color path, point the resolver at an ancestor whose authored
        // styleDefinition supplies the named color.
        const source = `
            <setup>
                <styleDefinition styleNumber="1" lineColor="red"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const result = resolveActiveStyleAttributeValue(
            sourceObj,
            point,
            "lineColor",
        );
        expect(result?.value).toBe("red");
        // "red" → "red" — no point repeating the word in parens.
        expect(result?.colorWord).toBeUndefined();
    });

    it("does not attach colorWord for *Word color attributes (already the word)", () => {
        // lineColorWord is itself a word; we don't compute a "word of the
        // word".  Built-in styleNumber=1's lineColorWord derives to a CSS
        // name, but the active-default surface should leave colorWord
        // unset on the *Word keys.
        const sourceObj = new DoenetSourceObject(
            `<setup><styleDefinition styleNumber="1"/></setup>`,
        );
        const sd = findElement(sourceObj, "styleDefinition");
        const result = resolveActiveStyleAttributeValue(
            sourceObj,
            sd,
            "lineColorWord",
            { excludeAttribute: { node: sd, attributeName: "lineColorWord" } },
        );
        // The word itself comes back, but no `colorWord` companion is set.
        expect(typeof result?.value).toBe("string");
        expect(result?.colorWord).toBeUndefined();
    });

    it("does not attach colorWord for non-color style attributes", () => {
        const sourceObj = new DoenetSourceObject(
            `<setup><styleDefinition styleNumber="1"/></setup>`,
        );
        const sd = findElement(sourceObj, "styleDefinition");
        const result = resolveActiveStyleAttributeValue(
            sourceObj,
            sd,
            "markerStyle",
            { excludeAttribute: { node: sd, attributeName: "markerStyle" } },
        );
        expect(result?.colorWord).toBeUndefined();
    });
});

describe("detectStylePrefixesFromAttributes / relevantStyleKeysForPrefixes", () => {
    it("detects the marker prefix from a point's per-component override attributes", () => {
        // `<point>` declares only `markerStyle` / `markerSize` / `markerFilled`
        // in its override schema. All three share the `marker` prefix, so the
        // detection collapses to a single-prefix set.
        const prefixes = detectStylePrefixesFromAttributes([
            "markerStyle",
            "markerSize",
            "markerFilled",
        ]);
        expect(prefixes).toEqual(new Set(["marker"]));
    });

    it("detects line + fill prefixes from a polygon's override attributes", () => {
        const prefixes = detectStylePrefixesFromAttributes([
            "lineStyle",
            "lineWidth",
            "fillOpacity",
        ]);
        expect(prefixes).toEqual(new Set(["line", "fill"]));
    });

    it("ignores non-style attribute names", () => {
        const prefixes = detectStylePrefixesFromAttributes([
            "draggable",
            "labelIsName",
            "markerStyle",
        ]);
        expect(prefixes).toEqual(new Set(["marker"]));
    });

    it("matches attribute names case-insensitively", () => {
        const prefixes = detectStylePrefixesFromAttributes([
            "MARKERSTYLE",
            "linewidth",
        ]);
        expect(prefixes).toEqual(new Set(["marker", "line"]));
    });

    it("expands marker prefix to every marker* key including colors", () => {
        const keys = relevantStyleKeysForPrefixes(new Set(["marker"]));
        // Sanity-check the inclusion side: every key returned starts with
        // "marker" (case-insensitive — the canonical keys are camelCase).
        for (const k of keys) {
            expect(k.toLowerCase().startsWith("marker")).toBe(true);
        }
        // Spot-check key expected members the help panel cares about: the
        // override-only attributes (style/size/filled) plus the
        // `<styleDefinition>`-only color attributes.
        expect(keys).toContain("markerStyle");
        expect(keys).toContain("markerSize");
        expect(keys).toContain("markerFilled");
        expect(keys).toContain("markerColor");
        expect(keys).toContain("markerColorDarkMode");
        expect(keys).toContain("markerColorWord");
        expect(keys).toContain("markerOpacity");
        // And that nothing from a different prefix leaks in.
        expect(keys).not.toContain("lineColor");
        expect(keys).not.toContain("fillOpacity");
    });

    it("returns the empty array for an empty prefix set", () => {
        expect(relevantStyleKeysForPrefixes(new Set())).toEqual([]);
    });

    it("preserves styleAttributes declaration order", () => {
        // The breakdown UI relies on a stable, semantically-grouped order
        // (line* together, then marker*, etc.). The expansion should walk
        // `styleAttributes` in its declaration order, not sort lexically.
        const keys = relevantStyleKeysForPrefixes(new Set(["line", "marker"]));
        // First line* run must come fully before the first marker* run.
        const firstMarkerIdx = keys.findIndex((k) =>
            k.toLowerCase().startsWith("marker"),
        );
        const lastLineIdx =
            keys.length -
            1 -
            [...keys]
                .reverse()
                .findIndex((k) => k.toLowerCase().startsWith("line"));
        expect(firstMarkerIdx).toBeGreaterThan(lastLineIdx);
    });
});

describe("resolveActiveStyleBreakdown", () => {
    it("returns every relevant key for the active styleNumber (no filter → full listing)", () => {
        // Unfiltered breakdown — used inside `<styleDefinition>` where the
        // help panel should mirror every key the styleNumber resolves to.
        const sourceObj = new DoenetSourceObject(
            `<setup><styleDefinition styleNumber="1"/></setup>`,
        );
        const sd = findElement(sourceObj, "styleDefinition");
        const breakdown = resolveActiveStyleBreakdown(sourceObj, sd);
        expect(breakdown.styleNumber).toBe(1);
        // styleNumber=1's built-in preset populates every key, so we should
        // see a sizable listing — exact count tracks the preset, so just
        // assert it's nontrivial and includes a representative mix.
        expect(breakdown.entries.length).toBeGreaterThan(20);
        const byKey = new Map(breakdown.entries.map((e) => [e.key, e]));
        expect(byKey.get("markerStyle")?.value).toBe("circle");
        expect(byKey.get("lineWidth")?.value).toBe(4);
        expect(byKey.get("lineColor")?.value).toBeTruthy();
    });

    it("filters to includeKeys when supplied (per-component dispatch)", () => {
        const sourceObj = new DoenetSourceObject(`<point/>`);
        const point = findElement(sourceObj, "point");
        const breakdown = resolveActiveStyleBreakdown(sourceObj, point, {
            includeKeys: ["markerStyle", "markerSize", "markerColor"],
        });
        expect(breakdown.styleNumber).toBe(1);
        expect(breakdown.entries.map((e) => e.key).sort()).toEqual(
            ["markerColor", "markerSize", "markerStyle"].sort(),
        );
    });

    it("attaches colorWord for hex color attributes in the breakdown", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerColor="#FF0000"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const breakdown = resolveActiveStyleBreakdown(sourceObj, point, {
            includeKeys: ["markerColor"],
        });
        expect(breakdown.entries).toHaveLength(1);
        const entry = breakdown.entries[0];
        expect(entry.value).toBe("#ff0000");
        expect(entry.colorWord).toBe("red");
    });

    it("does not attach colorWord on *Word keys (already the word)", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerColor="#FF0000"/>
            </setup>
            <point/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const breakdown = resolveActiveStyleBreakdown(sourceObj, point, {
            includeKeys: ["markerColorWord"],
        });
        expect(breakdown.entries).toHaveLength(1);
        const entry = breakdown.entries[0];
        expect(entry.value).toBe("red");
        expect(entry.colorWord).toBeUndefined();
    });

    it("walks ancestor <styleDefinition> blocks before filling the breakdown", () => {
        // styleNumber=2's preset has markerStyle="square"; an ancestor
        // styleDefinition overrides it to "diamond". The breakdown should
        // reflect the override, not the preset.
        const source = `
            <setup>
                <styleDefinition styleNumber="2" markerStyle="diamond"/>
            </setup>
            <point styleNumber="2"/>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const point = findElement(sourceObj, "point");
        const breakdown = resolveActiveStyleBreakdown(sourceObj, point, {
            includeKeys: ["markerStyle"],
        });
        expect(breakdown.styleNumber).toBe(2);
        expect(breakdown.entries[0].value).toBe("diamond");
    });

    it("silently drops unknown keys passed via includeKeys", () => {
        const sourceObj = new DoenetSourceObject(`<point/>`);
        const point = findElement(sourceObj, "point");
        const breakdown = resolveActiveStyleBreakdown(sourceObj, point, {
            includeKeys: [
                "markerStyle",
                // @ts-expect-error — exercising the unknown-key path
                "notARealStyleKey",
            ],
        });
        expect(breakdown.entries.map((e) => e.key)).toEqual(["markerStyle"]);
    });

    it("entries follow styleAttributes declaration order, not the includeKeys order", () => {
        // The help panel relies on a stable order; passing keys in reverse
        // shouldn't surface them reversed. lineWidth declares before
        // markerStyle in styleAttributes, so it must come first.
        const sourceObj = new DoenetSourceObject(`<point/>`);
        const point = findElement(sourceObj, "point");
        const breakdown = resolveActiveStyleBreakdown(sourceObj, point, {
            includeKeys: ["markerStyle", "lineWidth"],
        });
        expect(breakdown.entries.map((e) => e.key)).toEqual([
            "lineWidth",
            "markerStyle",
        ]);
    });
});
