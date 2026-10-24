import { describe, expect, it } from "vitest";
import {
    fieldFunctionFromDefinition,
    latticeRange,
    thinnedLatticeLines,
} from "./fieldLattice";

const grid = { dx: 1, dy: 1, xoffset: 0, yoffset: 0 };
const bounds = { xMin: -3, xMax: 3, yMin: -3, yMax: 3 };

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

describe("thinnedLatticeLines", () => {
    it("draws nothing for a spacing of zero or NaN", () => {
        for (const dx of [0, NaN]) {
            expect(thinnedLatticeLines(bounds, { ...grid, dx }, 2500)).toEqual({
                xs: [],
                ys: [],
                stride: 1,
            });
        }
    });

    // Past 2^53 an index plus a stride is the index again, so walking such a
    // lattice would never end: these hung, or ran out of memory, before.
    it("draws nothing, and finishes, when an index passes 2^53", () => {
        expect(
            thinnedLatticeLines(bounds, { ...grid, dx: 1e-20 }, 2500),
        ).toEqual({ xs: [], ys: [], stride: 1 });
        expect(
            thinnedLatticeLines(bounds, { ...grid, xoffset: 1e17 }, 2500),
        ).toEqual({ xs: [], ys: [], stride: 1 });
    });

    // No row lies between y = 0.2 and y = 0.8, so there is no point to draw,
    // but 6e12 columns do: `maxMarks` caps points, not lines, so these columns
    // were all walked before, which never finished.
    it("draws nothing, and finishes, when one axis has no lattice line", () => {
        expect(
            thinnedLatticeLines(
                { ...bounds, yMin: 0.2, yMax: 0.8 },
                { ...grid, dx: 1e-12 },
                2500,
            ),
        ).toEqual({ xs: [], ys: [], stride: 1 });
    });
});

/**
 * A field samples its function on a lattice and so always has both an `x` and a
 * `y` to hand it, but the function itself need not take two inputs: a
 * `<function>` child names its own variables, and one that names a single
 * variable is used as written. A one-input closure's second parameter is
 * `overrideDomain`, not an input, so these check that the lattice's `y` never
 * reaches it.
 */
describe("fieldFunctionFromDefinition", () => {
    /** `x/2`, restricted to (-2, 2), as the worker sends it. */
    const oneInputWithDomain = {
        functionType: "formula",
        formula: ["/", "x", 2],
        variables: ["x"],
        numInputs: 1,
        numOutputs: 1,
        domain: [["interval", ["tuple", -2, 2], ["tuple", false, false]]],
        component: 0,
    };

    /** `y - x`, the shape a bare expression is wrapped into. */
    const twoInputs = {
        functionType: "formula",
        formula: ["+", "y", ["-", "x"]],
        variables: ["x", "y"],
        numInputs: 2,
        numOutputs: 1,
        domain: null,
        component: 0,
    };

    it("passes both inputs to a two-input function", () => {
        expect(fieldFunctionFromDefinition(twoInputs)(3, 5)).toBeCloseTo(2, 10);
    });

    it("discards the second input of a one-input function", () => {
        expect(
            fieldFunctionFromDefinition(oneInputWithDomain)(1, 5),
        ).toBeCloseTo(0.5, 10);
    });

    it("keeps a one-input function's domain at every lattice row", () => {
        const f = fieldFunctionFromDefinition(oneInputWithDomain);
        // Were `y` passed positionally it would land on `overrideDomain`, and
        // every row but `y = 0` would be drawn outside the domain.
        for (const y of [-5, -1, 0, 1, 5]) {
            expect(f(3, y), `at y = ${y}`).toBeNaN();
        }
    });

    it("gives the NaN function for a definition with no function", () => {
        expect(fieldFunctionFromDefinition({})(3, 5)).toBeNaN();
    });
});
