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
    resolveActiveStyle,
    resolveActiveStyleAttributeValue,
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
        // DEFAULT_STYLE_VALUES — same shape as styleNumber=1's defaults.
        expect(resolved!.style.markerStyle).toBe("circle");
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

describe("resolveActiveStyle — exclude self", () => {
    it("excludes the queried <styleDefinition>'s own values so the active default reflects only peers/presets", () => {
        const source = `
            <setup>
                <styleDefinition styleNumber="1" markerStyle="diamond" lineWidth="6"/>
            </setup>
        `;
        const sourceObj = new DoenetSourceObject(source);
        const sd = findElement(sourceObj, "styleDefinition");
        const resolved = resolveActiveStyle(sourceObj, sd, { excludeNode: sd });
        // The styleDefinition itself sets markerStyle=diamond, but the resolver
        // is asked to ignore *self* — so we fall back to the built-in
        // styleNumber=1 preset (circle / lineWidth=4).
        expect(resolved!.style.markerStyle).toBe("circle");
        expect(resolved!.style.lineWidth).toBe(4);
    });

    it("still picks up peer <styleDefinition> values when excluding self", () => {
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
            excludeNode: sds[1],
        });
        // Peer supplies markerStyle, lineWidth falls back to built-in (the
        // queried styleDefinition's own value is excluded).
        expect(peerExcluded!.style.markerStyle).toBe("square");
        expect(peerExcluded!.style.lineWidth).toBe(4);
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
});
