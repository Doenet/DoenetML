import { describe, expect, it } from "vitest";
import { resolveStyleDefinition } from "@doenet/utils";
import {
    buildBaseAttributes,
    buildDragHandleAttributes,
    buildFilledShapeAttributes,
    buildLineLikeAttributes,
} from "./buildGraphicalAttributes";

/**
 * JSXgraph lowercases an attribute object with `JXG.keysToLowerCase` before
 * merging it into the defaults, and that walk visits the keys in reverse
 * insertion order — so two spellings of one attribute collapse onto the
 * first-written one and the later "override" is silently dropped. Every object
 * a renderer hands to `board.create(...)` must therefore be free of keys that
 * differ only by case.
 */
function expectNoKeysDifferingOnlyByCase(attributes: Record<string, any>) {
    const keys = Object.keys(attributes);
    const lowercased = new Set(keys.map((key) => key.toLowerCase()));
    expect(lowercased.size, `distinct keys among ${keys.join(", ")}`).toBe(
        keys.length,
    );
}

const SVs = {
    labelForGraph: "v",
    hidden: false,
    layer: 3,
    selectedStyle: resolveStyleDefinition({}),
};

/** Attributes of a visible line-family element that is fixed and fix-located. */
function buildElementAttributes() {
    return buildLineLikeAttributes({
        SVs,
        layerOffset: 2,
        fixed: true,
        fixLocation: true,
        darkMode: "light",
    });
}

describe("attribute builders", () => {
    it("produce no keys that differ only by case", () => {
        const args = {
            SVs,
            layerOffset: 2,
            fixed: false,
            fixLocation: false,
            darkMode: "light" as const,
        };

        expectNoKeysDifferingOnlyByCase(buildBaseAttributes(args));
        expectNoKeysDifferingOnlyByCase(buildLineLikeAttributes(args));
        expectNoKeysDifferingOnlyByCase(buildFilledShapeAttributes(args));
    });
});

describe("buildDragHandleAttributes", () => {
    it("turns off the label it inherits from the element", () => {
        const elementAttributes = buildElementAttributes();
        expect(elementAttributes.withlabel).toBe(true);

        const handleAttributes = buildDragHandleAttributes({
            elementAttributes,
            layer: 42,
            darkMode: "light",
            showInfoBox: true,
        });

        // The handles inherit the element's `name`, so the suppression has to
        // land: a second spelling (`withLabel: false`) would be dropped by
        // JSXgraph and every handle would draw its own untypeset copy of the
        // element's label.
        expect(handleAttributes.name).toBe("v");
        expect(handleAttributes.withlabel).toBe(false);
        expectNoKeysDifferingOnlyByCase(handleAttributes);
    });

    it("makes the handles transparent, unfixed, and highlightable", () => {
        const handleAttributes = buildDragHandleAttributes({
            elementAttributes: buildElementAttributes(),
            layer: 42,
            darkMode: "dark",
            showInfoBox: false,
        });

        expect(handleAttributes.fillColor).toBe("none");
        expect(handleAttributes.strokeColor).toBe("none");
        expect(handleAttributes.highlightStrokeColor).toBe("none");
        // Only the hover highlight shows a handle, and it tracks dark mode.
        expect(handleAttributes.highlightFillColor).toBe("#b0b0b0");
        // The element is fixed and fix-located, but its handles stay draggable.
        expect(handleAttributes.fixed).toBe(false);
        expect(handleAttributes.highlight).toBe(true);
        expect(handleAttributes.layer).toBe(42);
        expect(handleAttributes.showInfoBox).toBe(false);
    });

    it("inherits the element's visibility rather than forcing one", () => {
        // Callers that show only some of the handles — a vector whose head is
        // draggable but whose tail is not, a polyline with fixed vertices —
        // layer their own `visible` on top of what the builder returns.
        const handleAttributes = buildDragHandleAttributes({
            elementAttributes: buildElementAttributes(),
            layer: 42,
            darkMode: "light",
            showInfoBox: true,
        });

        expect(handleAttributes.visible).toBe(true);
    });
});
