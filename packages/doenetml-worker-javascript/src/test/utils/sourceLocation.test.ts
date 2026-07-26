import { describe, expect, it } from "vitest";
import type { Position } from "@doenet/utils";
import { doenetMLStringForReference } from "../../utils/sourceLocation";

const doenetML = `<point name="p" /><text extend="$p.styleDescription[1]" />`;
const secondDoc = `<text name="t">a different document entirely</text>`;

/** A path part spanning `[start, end)` of a document, as the resolver hands it back. */
function part(start: number, end: number, sourceDoc?: number) {
    const at = (offset: number): Position["start"] => ({
        line: 1,
        column: offset + 1,
        offset,
    });
    return { position: { start: at(start), end: at(end) }, sourceDoc };
}

// The `p` and the `styleDescription[1]` of `$p.styleDescription[1]`, at their
// offsets in `doenetML`.
const namePart = part(33, 34);
const propPart = part(35, 54);

// `doenetMLStringForReference` is the only way a diagnostic can name a
// reference back to the author, and the sites that call it all treat `""` as
// "say nothing at all". Which inputs produce `""` is therefore behavior, not
// an implementation detail: a change that made it return a partial string
// instead would turn silence into a warning quoting half a reference.
describe("doenetMLStringForReference @group4", () => {
    it("spans the first part's start to the last part's end", () => {
        // The reference is everything from the first part to the last,
        // including the `.` between them that is part of neither. The leading
        // `$` is left to the caller.
        expect(doenetMLStringForReference([namePart, propPart], [doenetML])).eq(
            "p.styleDescription[1]",
        );
        // Only the ends are read, so a positionless part between them is no
        // obstacle.
        expect(
            doenetMLStringForReference([namePart, {}, propPart], [doenetML]),
        ).eq("p.styleDescription[1]");
    });

    it("reads from the document the reference's first part names", () => {
        expect(
            doenetMLStringForReference([part(6, 10, 1)], [doenetML, secondDoc]),
        ).eq("name");
        // No `sourceDoc` means document 0, which is what a single-document
        // activity leaves the field as.
        expect(doenetMLStringForReference([part(1, 6)], [doenetML])).eq(
            "point",
        );
    });

    it("says nothing when there is no path", () => {
        expect(doenetMLStringForReference(undefined, [doenetML])).eq("");
        expect(doenetMLStringForReference(null, [doenetML])).eq("");
        expect(doenetMLStringForReference([], [doenetML])).eq("");
    });

    it("says nothing when an end of the path carries no position", () => {
        // What a composite builds rather than a document supplies: `<repeat>`
        // synthesizes `originalPath` entries with no `position` at all.
        expect(doenetMLStringForReference([{}], [doenetML])).eq("");
        expect(doenetMLStringForReference([namePart, {}], [doenetML])).eq("");
        expect(doenetMLStringForReference([{}, propPart], [doenetML])).eq("");
    });

    it("says nothing when the source it names is not there", () => {
        expect(doenetMLStringForReference([namePart], undefined)).eq("");
        expect(doenetMLStringForReference([part(33, 34, 4)], [doenetML])).eq(
            "",
        );
    });
});
