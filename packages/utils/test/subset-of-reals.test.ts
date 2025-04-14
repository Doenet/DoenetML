import { describe, expect, it } from "vitest";
import util from "util";
import {
    ClosedInterval,
    ClosedOpenInterval,
    EmptySet,
    OpenClosedInterval,
    OpenInterval,
    RealLine,
    Singleton,
    Union,
} from "../src/math/subset-of-reals";
import {
    mathExpressionFromSubsetValue,
    serializedComponentsReviver,
} from "../src";

const origLog = console.log;
console.log = (...args) => {
    origLog(...args.map((x) => util.inspect(x, false, 10, true)));
};

describe("subset of reals", () => {
    it("stringify and revive", () => {
        const subsets = [
            EmptySet(),
            RealLine(),
            Singleton(4),
            OpenInterval(-4, 5),
            ClosedInterval(8, 11),
            OpenClosedInterval(-9, -4),
            ClosedOpenInterval(-1, 6),
            Union([
                Singleton(-5),
                OpenClosedInterval(-3, 2),
                ClosedInterval(4, 6),
            ]),
        ];

        for (const subset of subsets) {
            expect(
                JSON.parse(
                    JSON.stringify(subset),
                    serializedComponentsReviver,
                ).equals(subset),
            ).eq(true);
        }
    });

    it("merge subsets", () => {
        const interval1 = Union([
            OpenInterval(3, 4),
            ClosedInterval(4, 6),
            ClosedOpenInterval(-1, 3),
            Singleton(3),
        ]);
        expect(interval1.equals(ClosedInterval(-1, 6))).eq(true);
        expect(
            mathExpressionFromSubsetValue({
                subsetValue: interval1,
                variable: "x",
            }).toString(),
        ).eq("[ -1, 6 ]");

        const union1 = Union([
            OpenInterval(3, 4),
            ClosedInterval(4, 6),
            ClosedOpenInterval(-1, 3),
        ]);
        expect(union1.equals(ClosedInterval(-1, 6))).eq(false);
        expect(
            union1.equals(
                Union([ClosedOpenInterval(-1, 3), OpenClosedInterval(3, 6)]),
            ),
        ).eq(true);
        expect(
            mathExpressionFromSubsetValue({
                subsetValue: union1,
                variable: "x",
            }).toString(),
        ).eq("[ -1, 3 ) ∪ ( 3, 6 ]");
    });
});
