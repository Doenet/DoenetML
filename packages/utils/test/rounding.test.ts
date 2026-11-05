import { describe, expect, it } from "vitest";
import me from "math-expressions";
import { roundForDisplay } from "../src/math/rounding";

const dependencyValues = {
    displayDigits: 3,
    displayDecimals: 1,
    displaySmallAsZero: 1e-14,
};

describe("roundForDisplay", () => {
    it("keeps a multi-character string tree as a single symbol", () => {
        expect(roundForDisplay({ value: "apple", dependencyValues }).tree).eq(
            "apple",
        );
        expect(
            roundForDisplay({ value: "hello world", dependencyValues }).tree,
        ).eq("hello world");
    });

    it("rounds numbers in a bare tree", () => {
        expect(roundForDisplay({ value: 3.14159, dependencyValues }).tree).eq(
            3.14,
        );
        expect(
            roundForDisplay({ value: ["+", "xy", 1.234567], dependencyValues })
                .tree,
        ).eqls(["+", "xy", 1.23]);
    });

    it("rounds numbers in an expression", () => {
        expect(
            roundForDisplay({
                value: me.fromAst(["*", 2.71828, "x"]),
                dependencyValues,
            }).tree,
        ).eqls(["*", 2.72, "x"]);
    });

    it("sets small values to zero", () => {
        expect(roundForDisplay({ value: 1e-20, dependencyValues }).tree).eq(0);
    });
});
