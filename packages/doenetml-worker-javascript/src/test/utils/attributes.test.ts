import { describe, expect, it } from "vitest";
import {
    preprocessAttributesObject,
    validateListItemsAgainstValidValues,
} from "../../utils/attributes";
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

describe("validateListItemsAgainstValidValues", () => {
    const validValues = [
        { value: "top", description: "Align to the top." },
        { value: "middle", description: "Center." },
        { value: "bottom", description: "Align to the bottom." },
    ];

    it("keeps all items when every item is allowed", () => {
        const result = validateListItemsAgainstValidValues({
            items: ["top", "bottom", "middle"],
            validValues,
            attribute: "valigns",
        });
        expect(result.value).toEqual(["top", "bottom", "middle"]);
        expect(result.diagnostics).toEqual([]);
    });

    it("drops invalid items and reports them in a single diagnostic", () => {
        const result = validateListItemsAgainstValidValues({
            items: ["top", "sideways", "bottom", "diagonal"],
            validValues,
            attribute: "valigns",
        });
        expect(result.value).toEqual(["top", "bottom"]);
        expect(result.diagnostics).toHaveLength(1);
        expect(result.diagnostics[0].type).toBe("info");
        expect(result.diagnostics[0].message).toContain("`sideways`");
        expect(result.diagnostics[0].message).toContain("`diagonal`");
        expect(result.diagnostics[0].message).toContain("valigns");
        // The runtime diagnostic does not enumerate the allowed values (that
        // would show the lower-cased copy when toLowerCase is set); the
        // canonical-cased list lives in the schema-driven editor surfaces.
        expect(result.diagnostics[0].message).not.toContain("`middle`");
    });

    it("uses singular wording for a single invalid item", () => {
        const result = validateListItemsAgainstValidValues({
            items: ["top", "sideways"],
            validValues,
            attribute: "valigns",
        });
        expect(result.value).toEqual(["top"]);
        expect(result.diagnostics[0].message).toContain("Invalid value `");
        expect(result.diagnostics[0].message).not.toContain("Invalid values");
    });

    it("lower-cases and trims items before matching when toLowerCase is set", () => {
        const result = validateListItemsAgainstValidValues({
            items: ["  TOP ", "Middle"],
            validValues,
            toLowerCase: true,
            attribute: "valigns",
        });
        expect(result.value).toEqual(["top", "middle"]);
        expect(result.diagnostics).toEqual([]);
    });

    it("does not lower-case when toLowerCase is not set", () => {
        const result = validateListItemsAgainstValidValues({
            items: ["TOP", "top"],
            validValues,
            attribute: "valigns",
        });
        expect(result.value).toEqual(["top"]);
        expect(result.diagnostics).toHaveLength(1);
        expect(result.diagnostics[0].message).toContain("`TOP`");
    });

    it("trims items even when toLowerCase is not set", () => {
        const result = validateListItemsAgainstValidValues({
            items: ["  top  ", "bottom"],
            validValues,
            attribute: "valigns",
        });
        expect(result.value).toEqual(["top", "bottom"]);
        expect(result.diagnostics).toEqual([]);
    });

    it("treats non-string items as invalid and echoes the original value", () => {
        const result = validateListItemsAgainstValidValues({
            items: ["top", 5, null],
            validValues,
            attribute: "valigns",
        });
        expect(result.value).toEqual(["top"]);
        expect(result.diagnostics).toHaveLength(1);
        expect(result.diagnostics[0].message).toContain("`5`");
        expect(result.diagnostics[0].message).toContain("`null`");
    });

    it("returns an empty result with no diagnostics for an empty list", () => {
        const result = validateListItemsAgainstValidValues({
            items: [],
            validValues,
            attribute: "valigns",
        });
        expect(result.value).toEqual([]);
        expect(result.diagnostics).toEqual([]);
    });
});
