import { describe, expect, it } from "vitest";
import {
    addShadowNumberDisplayAttributes,
    buildNumberDisplayParameters,
    gatherRawNumberDisplayFixedResponseAttributes,
} from "../../utils/numberDisplay";

describe("numberDisplay utility", () => {
    it("returns expected formatter params", () => {
        expect(
            buildNumberDisplayParameters({
                padZeros: false,
                displayDigits: 6,
                displayDecimals: 4,
                avoidScientificNotation: false,
            }),
        ).eqls({});

        expect(
            buildNumberDisplayParameters({
                padZeros: true,
                displayDigits: 6,
                displayDecimals: 4,
                avoidScientificNotation: true,
            }),
        ).eqls({
            padToDecimals: 4,
            padToDigits: 6,
            avoidScientificNotation: true,
        });
    });

    it("collects unresolved number-display attributes from list source chain", () => {
        const leaf = {
            attributes: {
                fixed: { type: "unresolved", stateValues: { value: true } },
                displayDigits: {
                    type: "unresolved",
                    stateValues: { value: 8 },
                },
            },
            doenetAttributes: {
                extendListViaComposite: 10,
            },
        };

        const source = {
            attributes: {
                padZeros: {
                    type: "unresolved",
                    stateValues: { value: true },
                },
                displayDecimals: {
                    type: "unresolved",
                    stateValues: { value: 3 },
                },
            },
            doenetAttributes: {},
        };

        const components = {
            10: {
                stateValues: {
                    extendIdx: 20,
                },
            },
            20: source,
        };

        const attrs: Record<string, any> =
            gatherRawNumberDisplayFixedResponseAttributes(leaf, components);

        expect(Object.keys(attrs).sort()).eqls([
            "displayDigits",
            "fixed",
            "padZeros",
        ]);
        expect(attrs.displayDigits.type).eq("unresolved");
        expect(attrs.fixed.type).eq("unresolved");
        expect(attrs.padZeros.type).eq("unresolved");
    });

    it("adds shadow attributes from source public SV descriptions", () => {
        const attributes: Record<string, any> = {
            displayDigits: { component: { componentIdx: 1 } },
        };

        const n = addShadowNumberDisplayAttributes({
            nComponents: 100,
            stateIdInfo: { prefix: "s_", num: 1 },
            source: { componentType: "numberList", componentIdx: 50 },
            compositeIdx: 60,
            attributes,
            componentInfoObjects: {
                publicStateVariableInfo: {
                    numberList: {
                        stateVariableDescriptions: {
                            displayDigits: {
                                createComponentOfType: "integer",
                            },
                            displayDecimals: {
                                createComponentOfType: "integer",
                            },
                            padZeros: { createComponentOfType: "boolean" },
                            avoidScientificNotation: {
                                createComponentOfType: "boolean",
                            },
                        },
                    },
                },
            },
        });

        expect(n).eq(102);
        expect(attributes.displayDigits).toBeDefined();
        expect(attributes.displayDecimals).toBeUndefined();
        expect(attributes.padZeros.component.componentIdx).eq(100);
        expect(attributes.avoidScientificNotation.component.componentIdx).eq(
            101,
        );
    });
});
