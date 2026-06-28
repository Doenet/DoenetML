import { describe, expect, it } from "vitest";
import { getSelfReferentialFallbackPropName } from "../../components/abstract/Copy";

const componentInfoObjects = {
    isInheritedComponentType({
        inheritedComponentType,
        baseComponentType,
    }: {
        inheritedComponentType: string;
        baseComponentType: string;
    }) {
        return inheritedComponentType === baseComponentType;
    },
    publicStateVariableInfo: {
        point: {
            stateVariableDescriptions: {
                latex: {},
                text: {},
            },
        },
        textOnly: {
            stateVariableDescriptions: {
                text: {},
            },
        },
    },
};

describe("copy self-reference fallback selection", () => {
    it("prefers latex in label context, including through transparent composites", () => {
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

    it("prefers text in the closest text context", () => {
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

    it("falls back to text in label context when latex is unavailable", () => {
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

    it("stops at non-transparent components before reaching label or text", () => {
        expect(
            getSelfReferentialFallbackPropName({
                componentAncestors: [
                    {
                        componentClass: {
                            componentType: "math",
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
