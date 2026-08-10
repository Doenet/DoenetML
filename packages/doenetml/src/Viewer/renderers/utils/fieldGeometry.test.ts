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

    it("coarsens the lattice instead of exceeding maxMarks", () => {
        const wide = { xMin: -100, xMax: 100, yMin: -100, yMax: 100 };
        const { numMarks, stride } = buildSlopeFieldData({
            f: () => 1,
            ...opts,
            bounds: wide,
            maxMarks: 400,
        });

        expect(stride).toBeGreaterThan(1);
        expect(numMarks).toBeLessThanOrEqual(400);
        expect(numMarks).toBeGreaterThan(0);
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

    it("still bounds the lattice when maxMarks is not a positive number", () => {
        for (const maxMarks of [0, -5, NaN]) {
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

    it("scales arrows by magnitude when not normalized, capped at markLength", () => {
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

    it("keeps barbs a constant pixel length independent of arrow length", () => {
        const { dataX, dataY } = buildVectorFieldData({
            u: (x) => x,
            v: () => 0,
            ...opts,
            normalize: false,
            barbLength: 5,
        });

        for (let i = 0; i < dataX.length; i += 9) {
            if (!Number.isFinite(dataX[i + 3])) continue;
            for (const off of [3, 6]) {
                const len = Math.hypot(
                    (dataX[i + off + 1] - dataX[i + off]) * square.unitX,
                    (dataY[i + off + 1] - dataY[i + off]) * square.unitY,
                );
                expect(len).toBeCloseTo(5, 10);
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
