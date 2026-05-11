import { describe, expect, it } from "vitest";
import { normalizeValidValues } from "../../utils/validValues";

describe("normalizeValidValues", () => {
    it("returns an empty array when the input is undefined", () => {
        expect(normalizeValidValues<string>(undefined)).toEqual([]);
    });

    it("wraps bare string entries into {value}", () => {
        expect(normalizeValidValues(["block", "inline"])).toEqual([
            { value: "block" },
            { value: "inline" },
        ]);
    });

    it("passes through object entries unchanged", () => {
        const input = [
            { value: "block", description: "On its own line." },
            { value: "inline", description: "Inline with text." },
        ];
        expect(normalizeValidValues(input)).toEqual(input);
    });

    it("handles a mixed array of strings and objects", () => {
        expect(
            normalizeValidValues<string>([
                "tiny",
                { value: "small", description: "30% of the width." },
                "medium",
            ]),
        ).toEqual([
            { value: "tiny" },
            { value: "small", description: "30% of the width." },
            { value: "medium" },
        ]);
    });
});
