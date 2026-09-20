import { describe, expect, it } from "vitest";
import { stripAlignmentMarkers } from "../../utils/math";

describe("stripAlignmentMarkers @group4", () => {
    it("removes a bare ampersand", () => {
        expect(stripAlignmentMarkers("q & = \\sin(x)")).eq("q  = \\sin(x)");
    });

    it("removes the \\amp macro", () => {
        expect(stripAlignmentMarkers("q \\amp = \\sin(x)")).eq("q  = \\sin(x)");
    });

    it("removes a marker from every row", () => {
        expect(stripAlignmentMarkers("q & = x\\\\ y \\amp = z")).eq(
            "q  = x\\\\ y  = z",
        );
    });

    it("leaves a longer control sequence that starts with amp alone", () => {
        expect(stripAlignmentMarkers("\\ampersand \\amplitude")).eq(
            "\\ampersand \\amplitude",
        );
    });

    it("leaves an escaped ampersand alone", () => {
        expect(stripAlignmentMarkers("a \\& b")).eq("a \\& b");
        expect(stripAlignmentMarkers("a \\& b & = c")).eq("a \\& b  = c");
    });

    it("reads a row break as a break, not as an escape", () => {
        // The `\` of `\\` is spent on the row break, so the `&` that follows
        // opens the next row and is a marker, and `amp` is plain letters.
        expect(stripAlignmentMarkers("x = y\\\\&= z")).eq("x = y\\\\= z");
        expect(stripAlignmentMarkers("x = y\\\\amp")).eq("x = y\\\\amp");
    });

    it("leaves a string with no markers unchanged", () => {
        expect(stripAlignmentMarkers("\\sin(x) + 1")).eq("\\sin(x) + 1");
        expect(stripAlignmentMarkers("")).eq("");
    });
});
