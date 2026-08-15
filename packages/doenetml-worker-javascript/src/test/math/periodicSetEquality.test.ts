import { describe, expect, it } from "vitest";
import me from "math-expressions";
import periodicSetEquality from "../../utils/periodicSetEquality";

/**
 * `<periodicSet>` grading, at the module rather than the document level: this
 * is the function `checkEquality` calls, and the credit it returns is the
 * credit the student gets.
 *
 * The offsets a student types are `<math>`es, so any of them can be an
 * expression with no value. `evaluate_to_constant` answers `null` for those,
 * and `null` is `0` to the modular arithmetic below — so an answer made
 * entirely of free variables looked like it started on the set and collected
 * partial credit. The legacy engine answered `NaN`, which fails that test.
 */
describe("periodicSetEquality @group3", () => {
    /** `…, -3, 0, 3, 6, …` */
    const set = me.fromAst([
        "periodic_set",
        ["tuple", 0, 3, -Infinity, Infinity],
    ]);

    function credit(offered: any, match_partial = true) {
        return periodicSetEquality(set, me.fromAst(offered), { match_partial });
    }

    it("awards nothing for offsets that are not constants", () => {
        // The control: the same shape of answer, with numbers in it, still
        // scores — so a function that always answered `false` would fail here.
        expect(credit(["list", 0, 3, 6])).greaterThan(0);

        // ...and a wholly symbolic list scores nothing. `0` here is what the
        // bug produced: `mod(null - 0, 3)` is `0`, i.e. "the first offset is
        // on the set", so the answer was credited for one element out of
        // three.
        expect(credit(["list", "y", "z", "w"])).eq(false);
        expect(credit(["list", "y", "z", "w"], false)).eq(false);
        // An offset that only *looks* like it cancels is equally not a
        // constant: `evaluate_to_constant` does not cancel first.
        expect(credit(["list", ["+", "x", ["-", "x"]], "z", "w"])).eq(false);
    });

    it("still credits the constant prefix of a partly symbolic answer", () => {
        // Not a stricter rule than the old one, only a correct one: the match
        // loop counts a consecutive run from the first offset, so an answer
        // whose *first* offset is on the set keeps the credit it earned even
        // though a later one has no value. This is what the legacy engine did,
        // and refusing the whole list would have been a regression.
        const partial = credit(["list", 0, "y", 6]);
        expect(partial).greaterThan(0);
        expect(partial).lessThan(credit(["list", 0, 3, 6]) as number);
    });
});
