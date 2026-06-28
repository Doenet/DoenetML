import { describe, expect, it } from "vitest";
import { getSelfReferentialFallbackPropName } from "../../components/abstract/Copy";

// Simple mock: exact-match plus the real-world subtype relationships we need.
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
        // coords extends math, mrow extends m
        if (
            baseComponentType === "math" &&
            inheritedComponentType === "coords"
        ) {
            return true;
        }
        if (baseComponentType === "m" && inheritedComponentType === "mrow") {
            return true;
        }
        return false;
    },
    publicStateVariableInfo: {
        point: {
            stateVariableDescriptions: {
                latex: { createComponentOfType: "latex" },
                text: { createComponentOfType: "text" },
            },
        },
        mathSource: {
            stateVariableDescriptions: {
                value: { createComponentOfType: "math" },
                latex: { createComponentOfType: "latex" },
                text: { createComponentOfType: "text" },
            },
        },
        textOnly: {
            stateVariableDescriptions: {
                text: { createComponentOfType: "text" },
            },
        },
    },
};

describe("copy self-reference fallback selection", () => {
    it("prefers latex-typed var in label context, including through transparent composites", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "group",
                            treatAsComponentForRecursiveReplacements: true,
                        },
                    },
                    {
                        componentClass: {
                            componentType: "label",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                ],
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("latex");
    });

    it("prefers text-typed var in text context", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "text",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                    {
                        componentClass: {
                            componentType: "label",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                ],
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("text");
    });

    it("prefers math-typed var in math context, falling back to text-typed", () => {
        // mathSource has value (math-typed) — should prefer it
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "math",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                ],
                componentInfoObjects,
                replacementSourceComponentType: "mathSource",
            }),
        ).eq("value");

        // point has no math-typed var — should fall back to text-typed
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "math",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                ],
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("text");
    });

    it("prefers latex-typed var in m context (inline math)", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "m",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                ],
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("latex");
    });

    it("prefers latex-typed var in md context (display math)", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "md",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                ],
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("latex");
    });

    it("treats mrow (subtype of m) as latex context", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "mrow",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                ],
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).eq("latex");
    });

    it("falls back to text-typed in label context when no latex-typed var exists", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "label",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                ],
                componentInfoObjects,
                replacementSourceComponentType: "textOnly",
            }),
        ).eq("text");
    });

    it("returns undefined when no context is detected", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "point",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                ],
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).toBeUndefined();
    });

    it("stops at non-transparent component before reaching label context", () => {
        // point is opaque, so the outer label context is invisible
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "point",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                    {
                        componentClass: {
                            componentType: "label",
                            treatAsComponentForRecursiveReplacements: false,
                        },
                    },
                ],
                componentInfoObjects,
                replacementSourceComponentType: "point",
            }),
        ).toBeUndefined();
    });
});
