import { describe, expect, it } from "vitest";
import { niceTickStep } from "../../utils/prefigure/chart/scale";

describe("chart scale @group4", () => {
    it("takes the step a span asks for whatever the engine's powers of ten", () => {
        // A span of five times a ladder value asks for exactly that value. On
        // Node 22, `10 ** -5` is `9.999999999999999e-6`, so a power of ten
        // computed rather than parsed normalized `0.00005` to just above 5 and
        // climbed a rung, to `0.0001` (#2490). Spans either side of 1 are
        // checked too, since the exponent is read differently there.
        const cases: [number, number][] = [
            [0.00025, 0.00005],
            [0.0002, 0.00005],
            [2.5, 0.5],
            [25, 5],
            [250, 50],
            [10, 2],
            [0.1, 0.02],
            [3, 1],
            [0.0003, 0.0001],
        ];
        for (const [span, step] of cases) {
            expect(niceTickStep(span, 0), `span ${span}`).eq(step);
        }
    });

    it("keeps a usable step for a subnormal span", () => {
        // Below the smallest power of ten a double holds, there is no round
        // step, and the step is the rough one rather than 0.
        const step = niceTickStep(Number.MIN_VALUE, 0);
        expect(step).toBeGreaterThan(0);
    });
});
