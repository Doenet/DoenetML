import { describe, expect, it } from "vitest";
import { getSelfReferentialFallbackPropName } from "../../utils/copy";

// Simple mock of componentInfoObjects.
// isInheritedComponentType: exact match plus the real-world subtypes we need.
const componentInfoObjects = {
    isInheritedComponentType({
        inheritedComponentType,
        baseComponentType,
    }: {
        inheritedComponentType: string;
        baseComponentType: string;
    }) {
        if (inheritedComponentType === baseComponentType) {
            return true;
        }
        // coords extends math (as in the real codebase)
        if (
            baseComponentType === "math" &&
            inheritedComponentType === "coords"
        ) {
            return true;
        }
        // mrow extends m
        if (baseComponentType === "m" && inheritedComponentType === "mrow") {
            return true;
        }
        return false;
    },
    publicStateVariableInfo: {
        // Point: value is an alias to coords (coords-typed, inherits from math)
        point: {
            stateVariableDescriptions: {
                coords: { createComponentOfType: "coords" },
                latex: { createComponentOfType: "latex" },
            },
            aliases: {
                value: { target: "coords" },
            },
        },
        // Math: value is math-typed directly
        mathSource: {
            stateVariableDescriptions: {
                value: { createComponentOfType: "math" },
                latex: { createComponentOfType: "latex" },
                text: { createComponentOfType: "text" },
            },
            aliases: {},
        },
        // Text: value is text-typed directly
        textSource: {
            stateVariableDescriptions: {
                value: { createComponentOfType: "text" },
            },
            aliases: {},
        },
        // No value at all
        noValue: {
            stateVariableDescriptions: {
                someOther: { createComponentOfType: "boolean" },
            },
            aliases: {},
        },
    },
};

const makeAncestors = (...types: { type: string; transparent?: boolean }[]) =>
    types.map(({ type, transparent = false }) => ({
        componentClass: {
            componentType: type,
            treatAsComponentForRecursiveReplacements: transparent,
        },
    }));

describe("getSelfReferentialFallbackPropName", () => {
    it("returns 'value' for point inside label context (coords inherits math)", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: makeAncestors({ type: "label" }),
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("value");
    });

    it("returns 'value' for point inside text context", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: makeAncestors({ type: "text" }),
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("value");
    });

    it("returns 'value' for point inside math context", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: makeAncestors({ type: "math" }),
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("value");
    });

    it("returns 'value' for point inside m context", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: makeAncestors({ type: "m" }),
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("value");
    });

    it("returns 'value' for point inside md context", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: makeAncestors({ type: "md" }),
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("value");
    });

    it("walks through transparent composites (group) to find context", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: makeAncestors(
                    { type: "group", transparent: true },
                    { type: "label" },
                ),
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("value");
    });

    it("treats mrow (subtype of m) as a recognised context", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: makeAncestors({ type: "mrow" }),
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("value");
    });

    it("stops at non-transparent ancestor before reaching label", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: makeAncestors(
                    { type: "point" },
                    { type: "label" },
                ),
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).toBeUndefined();
    });

    it("returns undefined when no recognised context ancestor is found", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: makeAncestors({ type: "boolean" }),
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).toBeUndefined();
    });

    it("returns undefined when source has no value state variable", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: makeAncestors({ type: "label" }),
                componentInfoObjects,
                replacementSourceComponentType: "noValue",
            }),
        ).toBeUndefined();
    });
});
