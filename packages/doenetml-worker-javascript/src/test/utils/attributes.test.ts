import { describe, expect, it } from "vitest";
import { preprocessAttributesObject } from "../../utils/attributes";
import type { AttributeDefinition } from "../../utils/dast/types";

describe("preprocessAttributesObject", () => {
    it("normalizes a mix of string and object entries and lower-cases values without touching descriptions", () => {
        const attrs: Record<string, AttributeDefinition<unknown>> = {
            mode: {
                toLowerCase: true,
                validValues: [
                    "Block",
                    {
                        value: "Inline",
                        description: "Inline With Surrounding Text.",
                    },
                ],
            },
        };

        const result = preprocessAttributesObject(attrs);

        expect(result.mode.validValues).toEqual([
            { value: "block" },
            {
                value: "inline",
                description: "Inline With Surrounding Text.",
            },
        ]);
    });

    it("lower-cases defaultValue, valueForTrue, and valueForFalse when toLowerCase is set", () => {
        const attrs: Record<string, AttributeDefinition<unknown>> = {
            flag: {
                toLowerCase: true,
                defaultValue: "OFF",
                valueForTrue: "ON",
                valueForFalse: "OFF",
                validValues: ["ON", "OFF"],
            },
        };

        const result = preprocessAttributesObject(attrs);

        expect(result.flag.defaultValue).toBe("off");
        expect(result.flag.valueForTrue).toBe("on");
        expect(result.flag.valueForFalse).toBe("off");
        expect(result.flag.validValues).toEqual([
            { value: "on" },
            { value: "off" },
        ]);
    });

    it("normalizes validValues even when toLowerCase is not set, and preserves casing on both values and descriptions", () => {
        const attrs: Record<string, AttributeDefinition<unknown>> = {
            mode: {
                validValues: [
                    "CamelCase",
                    { value: "PascalCase", description: "Preserved Casing." },
                ],
            },
        };

        const result = preprocessAttributesObject(attrs);

        expect(result.mode.validValues).toEqual([
            { value: "CamelCase" },
            { value: "PascalCase", description: "Preserved Casing." },
        ]);
    });

    it("is idempotent — a second pass leaves an already-normalized spec unchanged", () => {
        const attrs: Record<string, AttributeDefinition<unknown>> = {
            mode: {
                toLowerCase: true,
                validValues: [
                    "Block",
                    {
                        value: "Inline",
                        description: "Inline With Surrounding Text.",
                    },
                ],
            },
        };

        const first = preprocessAttributesObject(attrs);
        const firstSnapshot = JSON.parse(
            JSON.stringify(first.mode.validValues),
        );
        const second = preprocessAttributesObject(first);

        expect(second.mode.validValues).toEqual(firstSnapshot);
    });
});
