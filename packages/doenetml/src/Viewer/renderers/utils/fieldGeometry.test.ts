import { describe, expect, it } from "vitest";
import {
    buildSlopeFieldData,
    buildVectorFieldData,
    latticeRange,
} from "./fieldGeometry";

const grid = { dx: 1, dy: 1, xoffset: 0, yoffset: 0 };
const bounds = { xMin: -3, xMax: 3, yMin: -3, yMax: 3 };
const square = { unitX: 20, unitY: 20 };

describe("latticeRange", () => {
    it("includes only lattice points inside the bounds", () => {
        expect(latticeRange(bounds, grid)).toEqual({
            minXind: -3,
            maxXind: 3,
            minYind: -3,
            maxYind: 3,
        });
    });

    it("respects spacing and offset", () => {
        expect(
            latticeRange(
                { xMin: -1, xMax: 5, yMin: 0, yMax: 1 },
                { dx: 2, dy: 1, xoffset: 0.5, yoffset: 0 },
            ),
        ).toEqual({ minXind: -0, maxXind: 2, minYind: 0, maxYind: 1 });
    });

    it("is indifferent to the sign of the spacing", () => {
        expect(latticeRange(bounds, { ...grid, dx: -1, dy: -1 })).toEqual(
            latticeRange(bounds, grid),
        );
    });
});

describe("buildSlopeFieldData", () => {
    const opts = {
        bounds,
        grid,
        scale: square,
        markLength: 10,
        maxMarks: 5000,
    };

    it("emits three entries per mark with a NaN pen-up between marks", () => {
        const { dataX, dataY, numMarks } = buildSlopeFieldData({
            f: () => 1,
            ...opts,
        });

        expect(numMarks).toBe(49); // 7x7 lattice
        expect(dataX).toHaveLength(147);
        expect(dataY).toHaveLength(147);

        for (let i = 0; i < dataX.length; i++) {
            if (i % 3 === 2) {
                expect(Number.isNaN(dataX[i])).toBe(true);
                expect(Number.isNaN(dataY[i])).toBe(true);
            } else {
                expect(Number.isFinite(dataX[i])).toBe(true);
                expect(Number.isFinite(dataY[i])).toBe(true);
            }
        }
    });

    it("straddles each lattice point, which is the tangent line's midpoint", () => {
        const { dataX, dataY } = buildSlopeFieldData({
            f: (x, y) => x - y,
            ...opts,
        });

        for (let i = 0; i < dataX.length; i += 3) {
            const midX = (dataX[i] + dataX[i + 1]) / 2;
            const midY = (dataY[i] + dataY[i + 1]) / 2;
            // Every lattice point here is an integer pair.
            expect(midX).toBeCloseTo(Math.round(midX), 10);
            expect(midY).toBeCloseTo(Math.round(midY), 10);
            // The slope at the midpoint is what the mark is drawn for.
            const slope = (dataY[i + 1] - dataY[i]) / (dataX[i + 1] - dataX[i]);
            expect(slope).toBeCloseTo(midX - midY, 10);
        }
    });

    it("draws every mark at the same pixel length regardless of slope", () => {
        const { dataX, dataY } = buildSlopeFieldData({
            f: (x, y) => x * y, // strongly varying slope
            ...opts,
        });

        const lengths: number[] = [];
        for (let i = 0; i < dataX.length; i += 3) {
            lengths.push(
                Math.hypot(
                    (dataX[i + 1] - dataX[i]) * square.unitX,
                    (dataY[i + 1] - dataY[i]) * square.unitY,
                ),
            );
        }

        for (const len of lengths) {
            expect(len).toBeCloseTo(10, 10);
        }
    });

    it("keeps constant pixel length on non-square axes", () => {
        const scale = { unitX: 40, unitY: 8 };
        const { dataX, dataY } = buildSlopeFieldData({
            f: (x) => x,
            ...opts,
            scale,
        });

        for (let i = 0; i < dataX.length; i += 3) {
            const len = Math.hypot(
                (dataX[i + 1] - dataX[i]) * scale.unitX,
                (dataY[i + 1] - dataY[i]) * scale.unitY,
            );
            expect(len).toBeCloseTo(10, 10);
        }
    });

    it("matches the hand-rolled formula when axes are square", () => {
        // The classic DoenetML idiom is 0.25/sqrt(1+s^2) in user units, i.e. a
        // total length of 0.5 user units. With unitX = unitY = 20 px/unit that
        // is 10 px, so the two must agree exactly.
        const f = (x: number) => x * Math.sin(x);
        const { dataX, dataY } = buildSlopeFieldData({ f, ...opts });

        const x = -3;
        const y = -3;
        const s = f(x);
        const d = 0.25 / Math.sqrt(1 + s * s);

        expect(dataX[0]).toBeCloseTo(x - d, 12);
        expect(dataX[1]).toBeCloseTo(x + d, 12);
        expect(dataY[0]).toBeCloseTo(y - d * s, 12);
        expect(dataY[1]).toBeCloseTo(y + d * s, 12);
    });

    it("skips lattice points where the function is undefined", () => {
        const { numMarks } = buildSlopeFieldData({
            f: (x) => (x < 0 ? NaN : 1),
            ...opts,
        });
        expect(numMarks).toBe(28); // x = 0..3 only, 4 columns x 7 rows
    });

    it("coarsens the lattice to the tightest stride that meets maxMarks", () => {
        const wide = { xMin: -100, xMax: 100, yMin: -100, yMax: 100 };
        const { numMarks, stride } = buildSlopeFieldData({
            f: () => 1,
            ...opts,
            bounds: wide,
            maxMarks: 400,
        });

        // 201 lattice lines per axis: a stride of 11 keeps 19 of them each way,
        // for 361 marks, and the next stride down would keep 21 x 21 = 441.
        expect(stride).toBe(11);
        expect(numMarks).toBe(361);
    });

    it("keeps the coarsened lattice on multiples of the stride", () => {
        // Anchoring on the lattice index rather than on the first visible line
        // is what keeps a coarsened field still as the graph is panned.
        const { dataX, stride } = buildSlopeFieldData({
            f: () => 1,
            ...opts,
            bounds: { xMin: -100, xMax: 100, yMin: -100, yMax: 100 },
            maxMarks: 400,
        });

        expect(stride).toBeGreaterThan(1);
        for (let i = 0; i < dataX.length; i += 3) {
            // grid.dx is 1 with no offset, so x is the lattice index.
            const center = (dataX[i] + dataX[i + 1]) / 2;
            expect(Math.abs(Math.round(center) % stride)).toBe(0);
        }
    });

    it("respects maxMarks on a lattice with far more columns than rows", () => {
        // Rounding each axis's kept count up independently is what makes a
        // lopsided lattice the hard case for the cap: sqrt(total / cap) is 9
        // here, which would keep 1112 x 1 marks.
        const { numMarks, stride } = buildSlopeFieldData({
            f: () => 1,
            ...opts,
            bounds: { xMin: -5000, xMax: 5000, yMin: -1, yMax: 1 },
            maxMarks: 400,
        });

        // 10,001 columns of 3 rows: only a stride of 26 or more fits the cap,
        // and it collapses the three rows to one.
        expect(stride).toBe(26);
        expect(numMarks).toBe(385);
    });

    it("still bounds the lattice when maxMarks is not a usable cap", () => {
        // A cap below 1 can never be met — every stride keeps at least one mark
        // of a non-empty lattice — so it has to be clamped rather than searched
        // for, or an unusable `maxMarks` would lift the only bound on the work.
        for (const maxMarks of [0, -5, NaN, 0.5]) {
            const { numMarks } = buildSlopeFieldData({
                f: () => 1,
                ...opts,
                bounds: { xMin: -100, xMax: 100, yMin: -100, yMax: 100 },
                maxMarks,
            });
            expect(numMarks).toBeLessThanOrEqual(4);
        }
    });

    it("draws the same marks for a negative spacing as for a positive one", () => {
        const positive = buildSlopeFieldData({ f: (x) => x, ...opts });
        const negative = buildSlopeFieldData({
            f: (x) => x,
            ...opts,
            grid: { ...grid, dx: -1, dy: -1 },
        });

        expect(negative.numMarks).toBe(positive.numMarks);
        expect([...negative.dataX].sort()).toEqual([...positive.dataX].sort());
    });

    it("returns nothing for degenerate bounds", () => {
        const { numMarks, dataX } = buildSlopeFieldData({
            f: () => 1,
            ...opts,
            bounds: { xMin: NaN, xMax: NaN, yMin: NaN, yMax: NaN },
        });
        expect(numMarks).toBe(0);
        expect(dataX).toHaveLength(0);
    });
});

describe("buildVectorFieldData", () => {
    const opts = {
        bounds,
        grid,
        scale: square,
        markLength: 12,
        maxMarks: 5000,
        normalize: true,
    };

    it("emits nine entries per arrow: shaft plus two barbs", () => {
        const { dataX, numMarks } = buildVectorFieldData({
            u: () => 1,
            v: () => 0,
            ...opts,
        });

        expect(numMarks).toBe(49);
        expect(dataX).toHaveLength(49 * 9);
        for (let i = 2; i < dataX.length; i += 3) {
            expect(Number.isNaN(dataX[i])).toBe(true);
        }
    });

    it("puts each arrow's tail on the lattice point it was sampled at", () => {
        // The arrow represents the vector at that point, so it must start
        // there rather than straddle it the way a slope mark does.
        const { dataX, dataY } = buildVectorFieldData({
            u: (x, y) => y,
            v: (x, y) => -x,
            ...opts,
        });

        for (let i = 0; i < dataX.length; i += 9) {
            const tailX = dataX[i];
            const tailY = dataY[i];
            // Every lattice point here is an integer pair.
            expect(tailX).toBeCloseTo(Math.round(tailX), 10);
            expect(tailY).toBeCloseTo(Math.round(tailY), 10);
            // The shaft points along (y, -x) as sampled at the tail.
            const shaftX = dataX[i + 1] - tailX;
            const shaftY = dataY[i + 1] - tailY;
            expect(shaftX * -tailX - shaftY * tailY).toBeCloseTo(0, 10);
        }
    });

    it("normalizes every arrow to the same pixel length", () => {
        const { dataX, dataY } = buildVectorFieldData({
            u: (x, y) => x,
            v: (x, y) => y,
            ...opts,
        });

        for (let i = 0; i < dataX.length; i += 9) {
            const len = Math.hypot(
                (dataX[i + 1] - dataX[i]) * square.unitX,
                (dataY[i + 1] - dataY[i]) * square.unitY,
            );
            expect(len).toBeCloseTo(12, 10);
        }
    });

    it("scales arrows by magnitude when not normalized, longest at markLength", () => {
        const { dataX, dataY } = buildVectorFieldData({
            u: (x, y) => x,
            v: () => 0,
            ...opts,
            normalize: false,
        });

        const lengths: number[] = [];
        for (let i = 0; i < dataX.length; i += 9) {
            lengths.push(
                Math.hypot(
                    (dataX[i + 1] - dataX[i]) * square.unitX,
                    (dataY[i + 1] - dataY[i]) * square.unitY,
                ),
            );
        }

        expect(Math.max(...lengths)).toBeCloseTo(12, 10);
        // |u| = |x| ranges over 0..3, so lengths must vary.
        expect(Math.min(...lengths)).toBeLessThan(12);
    });

    it("sizes each barb in proportion to the arrow it terminates", () => {
        // A fixed pixel barb would be half the length of the shortest arrows in
        // a magnitude-scaled field, and invisible on the longest.
        const { dataX, dataY } = buildVectorFieldData({
            u: (x) => x,
            v: () => 0,
            ...opts,
            normalize: false,
            barbFraction: 0.25,
        });

        for (let i = 0; i < dataX.length; i += 9) {
            const shaft = Math.hypot(
                (dataX[i + 1] - dataX[i]) * square.unitX,
                (dataY[i + 1] - dataY[i]) * square.unitY,
            );
            for (const off of [3, 6]) {
                const len = Math.hypot(
                    (dataX[i + off + 1] - dataX[i + off]) * square.unitX,
                    (dataY[i + off + 1] - dataY[i + off]) * square.unitY,
                );
                expect(len).toBeCloseTo(0.25 * shaft, 10);
            }
        }
    });

    it("skips zero vectors", () => {
        const { numMarks } = buildVectorFieldData({
            u: () => 0,
            v: () => 0,
            ...opts,
        });
        expect(numMarks).toBe(0);
    });
});
