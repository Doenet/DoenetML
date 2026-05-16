import { describe, expect, it } from "vitest";
import me from "math-expressions";
import { normalizeMathExpression } from "../src";

describe("normalizeMathExpression", () => {
    it("fully simplifies an nth root, pulling out all factors given positivity assumptions", () => {
        const value = me.fromText("nthroot(a^7*b^6*c^28, 5)");
        const assumptions = me.fromText("a > 0 and b > 0 and c > 0");

        const simplified = normalizeMathExpression({
            value,
            simplify: "full",
            assumptions,
        });

        // a^7 = a^5 * a^2, b^6 = b^5 * b, c^28 = c^25 * c^3,
        // so a, b, and c^5 should all be pulled out of the fifth root.
        const expected = me.fromText("a*b*c^5 * nthroot(a^2*b*c^3, 5)");

        expect(simplified.equalsViaSyntax(expected)).toBe(true);
    });
});
