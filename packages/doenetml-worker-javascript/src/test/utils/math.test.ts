import { describe, expect, it } from "vitest";
import { UNSPECIFIED_COMPONENT } from "../../utils/math";

describe("UNSPECIFIED_COMPONENT", () => {
    /**
     * The marker's whole defence against colliding with an author's own
     * `unspecifiedComponent` variable is a **U+E000** prefix, and its own
     * docstring warns that the prefix is invisible in most editors and in
     * `git diff` — the literal reads as a bare identifier unless you look at
     * the bytes.
     *
     * Nothing else in the suite can notice if it is lost. `line.test.ts` is the
     * only other test that mentions the marker, and it imports this constant
     * and compares it against itself, so it stays green either way: a paste
     * that drops the prefix silently re-opens the collision.
     *
     * Both expectations are written with an explicit `\uE000` escape rather than
     * with the character itself, so that this file states the invariant
     * *visibly* — a test for an invisible character must not be invisible too.
     */
    it("keeps its invisible private-use-area prefix", () => {
        // The code point first, because it is the assertion whose *failure* is
        // readable: dropping the prefix reports `expected 117 to be 57344`,
        // where the string comparison below can only report that
        // `'unspecifiedComponent'` is not `'unspecifiedComponent'`.
        expect(UNSPECIFIED_COMPONENT.codePointAt(0)).toBe(0xe000);
        expect(UNSPECIFIED_COMPONENT).toBe("\uE000unspecifiedComponent");
        // …and so is not the bare name an author could type into a `<math>`
        // with `splitSymbols="false"`.
        expect(UNSPECIFIED_COMPONENT).not.toBe("unspecifiedComponent");
    });
});
