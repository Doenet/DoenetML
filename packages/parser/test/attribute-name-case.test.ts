import { describe, expect, it } from "vitest";
import { attributeNameCaseCorrections } from "../src/attribute-name-case";

/**
 * The rule the parser and the core share for an attribute written in
 * another case (D51): given the component's spelling, for one release, with
 * `doenet-w0197`.
 */
describe("attributeNameCaseCorrections", () => {
    it("gives an attribute in another case the spelling it differs from only in case", () => {
        expect(
            attributeNameCaseCorrections({
                written: ["xmin", "SIMPLIFY", "name"],
                known: ["xMin", "simplify", "name"],
            }),
        ).toEqual([
            { written: "xmin", corrected: "xMin" },
            { written: "SIMPLIFY", corrected: "simplify" },
        ]);
    });

    it("leaves one also written in the spelling, given to an earlier one, or matching two", () => {
        expect(
            attributeNameCaseCorrections({
                written: ["xMin", "xmin"],
                known: ["xMin"],
            }),
        ).toEqual([]);
        expect(
            attributeNameCaseCorrections({
                written: ["xmin", "XMIN"],
                known: ["xMin"],
            }),
        ).toEqual([{ written: "xmin", corrected: "xMin" }]);
        // `A` is known as written
        expect(
            attributeNameCaseCorrections({
                written: ["A"],
                known: ["a", "A"],
            }),
        ).toEqual([]);
        expect(
            attributeNameCaseCorrections({
                written: ["AB"],
                known: ["ab", "aB"],
            }),
        ).toEqual([]);
    });

    it("leaves a namespaced one, and one whose spelling is excluded", () => {
        expect(
            attributeNameCaseCorrections({
                written: ["XMLNS:foo", "Name"],
                known: ["xmlns:foo", "name"],
                exclude: ["name"],
            }),
        ).toEqual([]);
    });
});
