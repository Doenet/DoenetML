import { describe, expect, it } from "vitest";
import { preprocessAttributesObject } from "../../utils/attributes";
import type { AttributeDefinition } from "../../utils/dast/types";

describe("preprocessAttributesObject", () => {
    it("lower-cases each validValues entry's value when toLowerCase is set, without touching descriptions", () => {
        const attrs: Record<string, AttributeDefinition<unknown>> = {
            mode: {
                toLowerCase: true,
                validValues: [
                    { value: "Block", description: "Block Display Mode." },
                    {
                        value: "Inline",
                        description: "Inline With Surrounding Text.",
                    },
                ],
            },
        };

        const result = preprocessAttributesObject(attrs);

        expect(result.mode.validValues).toEqual([
            { value: "block", description: "Block Display Mode." },
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
                validValues: [
                    { value: "ON", description: "Turned on." },
                    { value: "OFF", description: "Turned off." },
                ],
            },
        };

        const result = preprocessAttributesObject(attrs);

        expect(result.flag.defaultValue).toBe("off");
        expect(result.flag.valueForTrue).toBe("on");
        expect(result.flag.valueForFalse).toBe("off");
        expect(result.flag.validValues).toEqual([
            { value: "on", description: "Turned on." },
            { value: "off", description: "Turned off." },
        ]);
    });

    it("leaves validValues casing intact when toLowerCase is not set", () => {
        const attrs: Record<string, AttributeDefinition<unknown>> = {
            mode: {
                validValues: [
                    {
                        value: "CamelCase",
                        description: "Original casing.",
                    },
                    {
                        value: "PascalCase",
                        description: "Preserved Casing.",
                    },
                ],
            },
        };

        const result = preprocessAttributesObject(attrs);

        expect(result.mode.validValues).toEqual([
            { value: "CamelCase", description: "Original casing." },
            { value: "PascalCase", description: "Preserved Casing." },
        ]);
    });

    it("throws when a validValues entry is a bare string (plain-JS bypass of the type contract)", () => {
        const attrs: Record<string, AttributeDefinition<unknown>> = {
            mode: {
                // Cast — the type system forbids this, but a plain-JS
                // component declaration could still slip through.
                validValues: ["block"] as unknown as {
                    value: string;
                    description: string;
                }[],
            },
        };

        expect(() => preprocessAttributesObject(attrs)).toThrow(
            /Invalid validValues entry for attribute `mode`/,
        );
    });
});
