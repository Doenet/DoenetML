import { describe, expect, it } from "vitest";
import {
    CircularCheckMarks,
    ON_PATH,
    PASSED,
} from "../../core/dependencies/circularCheckMarks";

describe("CircularCheckMarks", () => {
    it("keeps one mark per (outer, inner) pair", () => {
        const marks = new CircularCheckMarks<number>();
        expect(marks.get(3, "value")).toBeUndefined();
        expect(marks.size).eq(0);

        marks.set(3, "value", ON_PATH);
        marks.set(3, "text", PASSED);
        marks.set(4, "value", PASSED);
        expect(marks.get(3, "value")).eq(ON_PATH);
        expect(marks.get(3, "text")).eq(PASSED);
        expect(marks.get(4, "value")).eq(PASSED);
        expect(marks.get(4, "text")).toBeUndefined();
        expect(marks.size).eq(3);

        // the same pair again replaces, it does not add
        marks.set(3, "value", PASSED);
        expect(marks.get(3, "value")).eq(PASSED);
        expect(marks.size).eq(3);
    });

    it("deletes a pair and clears everything", () => {
        const marks = new CircularCheckMarks<string>();
        marks.set("stateVariable", "1|value", PASSED);
        marks.set("stateVariable", "2|value", PASSED);
        marks.set("expandComposite", "5", PASSED);

        marks.delete("stateVariable", "1|value");
        expect(marks.get("stateVariable", "1|value")).toBeUndefined();
        expect(marks.get("stateVariable", "2|value")).eq(PASSED);
        expect(marks.size).eq(2);

        // deleting what is not there is a no-op, for either level
        marks.delete("stateVariable", "9|value");
        marks.delete("determineDependencies", "9|value");
        expect(marks.size).eq(2);

        marks.clear();
        expect(marks.size).eq(0);
        expect(marks.get("expandComposite", "5")).toBeUndefined();
    });

    it("tells an index key from the string of it", () => {
        // Component indices are numbers in the state-variable marks; a
        // string "3" is a different key, as it is for a Map.
        const marks = new CircularCheckMarks<number | string>();
        marks.set(3, "value", PASSED);
        expect(marks.get("3", "value")).toBeUndefined();
    });
});
