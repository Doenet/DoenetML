/**
 * Unit tests for the shared `walkIndexAliases` / `chaseIndexAliases`
 * helpers in `src/auto-completer/index-aliases.ts`. These don't hit the
 * resolver or autocomplete; they pin the alias-table walking rules
 * directly so a regression in the algorithm shows up here first.
 * Issue #1180.
 */
import { describe, expect, it } from "vitest";
import {
    chaseIndexAliases,
    deepestArrayEntryType,
    walkIndexAliases,
} from "../src/auto-completer/index-aliases";
import type { SchemaProperty } from "../src/auto-completer";

// Mirror Vector.head: 1-dim, alias names x/y/z for the only dim.
const HEAD: SchemaProperty = {
    name: "head",
    type: "math",
    isArray: true,
    numDimensions: 1,
    indexAliases: [["x", "y", "z"]],
    indexedArrayDescription: [{ isArray: false, type: "point" }],
    description: "Coordinates of the vector's head.",
};

// Mirror Line.points: 2-dim, outer dim numeric-only, inner dim x/y/z.
const POINTS: SchemaProperty = {
    name: "points",
    type: "math",
    isArray: true,
    numDimensions: 2,
    indexAliases: [[], ["x", "y", "z"]],
    indexedArrayDescription: [
        { isArray: true, type: "point", numDimensions: 1 },
        { isArray: false, type: "math" },
    ],
    description: "Vertices of the line.",
};

// Mirror Curve.controlVectors: 3-dim, outer two dims numeric-only, inner
// dim x/y/z. Real chains like `$c.controlVectors[0][2].x` put TWO bracket
// indices on a single authored segment, so we test that explicitly here.
const CONTROL_VECTORS: SchemaProperty = {
    name: "controlVectors",
    type: "math",
    isArray: true,
    numDimensions: 3,
    indexAliases: [[], [], ["x", "y", "z"]],
    indexedArrayDescription: [
        { isArray: true, type: "vector", numDimensions: 2 },
        { isArray: true, type: "vector", numDimensions: 1 },
        { isArray: false, type: "vector" },
    ],
    description: "The Bezier control vectors at each through-point.",
};

const VALUE_NOT_ARRAY: SchemaProperty = {
    name: "value",
    type: "text",
    isArray: false,
    description: "Text value.",
};

const ARRAY_WITHOUT_ALIASES: SchemaProperty = {
    name: "kids",
    isArray: true,
    numDimensions: 1,
    description: "No alias table on this one.",
};

describe("walkIndexAliases — schema-walking rules (#1180)", () => {
    it("consumes dim 0 by alias name (vector.head.x)", () => {
        const out = walkIndexAliases(HEAD, [
            { name: "head", numIndices: 0 },
            { name: "x", numIndices: 0 },
        ]);
        expect(out).toEqual({ dim: 1, numDims: 1, aliasPath: ["x"] });
    });

    it("consumes dim 0 by bracket index (line.points[1])", () => {
        const out = walkIndexAliases(POINTS, [
            { name: "points", numIndices: 1 },
        ]);
        // After [1] we've consumed dim 0 but dim 1 is still open — partial
        // walk; the autocomplete path uses this to offer x/y/z next.
        expect(out).toEqual({ dim: 1, numDims: 2, aliasPath: [] });
    });

    it("walks line.points[1].x to full consumption", () => {
        const out = walkIndexAliases(POINTS, [
            { name: "points", numIndices: 1 },
            { name: "x", numIndices: 0 },
        ]);
        expect(out).toEqual({ dim: 2, numDims: 2, aliasPath: ["x"] });
    });

    it("consumes multiple bracket indices on one segment (curve.controlVectors[0][2])", () => {
        // 3D array, segment carries TWO `[...]` groups — both consume
        // dims, leaving dim 2 (x/y/z) open for the next segment.
        const out = walkIndexAliases(CONTROL_VECTORS, [
            { name: "controlVectors", numIndices: 2 },
        ]);
        expect(out).toEqual({ dim: 2, numDims: 3, aliasPath: [] });
    });

    it("walks curve.controlVectors[0][2].x to full consumption", () => {
        const out = walkIndexAliases(CONTROL_VECTORS, [
            { name: "controlVectors", numIndices: 2 },
            { name: "x", numIndices: 0 },
        ]);
        expect(out).toEqual({ dim: 3, numDims: 3, aliasPath: ["x"] });
    });

    it("rejects too many bracket indices on the first segment (3 on a 2D array)", () => {
        expect(
            walkIndexAliases(POINTS, [{ name: "points", numIndices: 3 }]),
        ).toBeNull();
    });

    it("rejects an unknown alias name (vector.head.hidden)", () => {
        expect(
            walkIndexAliases(HEAD, [
                { name: "head", numIndices: 0 },
                { name: "hidden", numIndices: 0 },
            ]),
        ).toBeNull();
    });

    it("rejects too many segments for the array's dims", () => {
        expect(
            walkIndexAliases(HEAD, [
                { name: "head", numIndices: 0 },
                { name: "x", numIndices: 0 },
                { name: "y", numIndices: 0 },
            ]),
        ).toBeNull();
    });

    it("rejects non-array properties (text.value)", () => {
        expect(
            walkIndexAliases(VALUE_NOT_ARRAY, [
                { name: "value", numIndices: 0 },
                { name: "latex", numIndices: 0 },
            ]),
        ).toBeNull();
    });

    it("rejects array props without an indexAliases table", () => {
        expect(
            walkIndexAliases(ARRAY_WITHOUT_ALIASES, [
                { name: "kids", numIndices: 0 },
                { name: "x", numIndices: 0 },
            ]),
        ).toBeNull();
    });
});

describe("chaseIndexAliases — requires full dim consumption", () => {
    it("succeeds when every dim is consumed", () => {
        expect(
            chaseIndexAliases(HEAD, [
                { name: "head", numIndices: 0 },
                { name: "x", numIndices: 0 },
            ]),
        ).toEqual({ aliasPath: ["x"] });
    });

    it("succeeds on a multi-bracket segment (controlVectors[0][2].x)", () => {
        expect(
            chaseIndexAliases(CONTROL_VECTORS, [
                { name: "controlVectors", numIndices: 2 },
                { name: "x", numIndices: 0 },
            ]),
        ).toEqual({ aliasPath: ["x"] });
    });

    it("fails when dims remain (line.points[1] — partial)", () => {
        expect(
            chaseIndexAliases(POINTS, [{ name: "points", numIndices: 1 }]),
        ).toBeNull();
    });

    it("rejects an unknown alias (vector.head.hidden)", () => {
        expect(
            chaseIndexAliases(HEAD, [
                { name: "head", numIndices: 0 },
                { name: "hidden", numIndices: 0 },
            ]),
        ).toBeNull();
    });
});

describe("deepestArrayEntryType", () => {
    it("returns the leaf scalar type for a 1-dim array (head → point)", () => {
        // 1D array — `indexedArrayDescription` has one entry; the leaf
        // and the slice coincide.
        expect(deepestArrayEntryType(HEAD)).toBe("point");
    });

    it("returns the leaf scalar type for a 2-dim array (points → math)", () => {
        // 2D array — the leaf is the scalar after both dims are consumed
        // (`points[1].x` is a `<math>`), NOT the inner-slice type ("point"
        // for `points[1]`). This is what the panel shows as `Type:`.
        expect(deepestArrayEntryType(POINTS)).toBe("math");
    });

    it("returns the leaf scalar type for a 3-dim array (controlVectors → vector)", () => {
        // 3D `Curve.controlVectors` — leaf type is "vector", the scalar
        // after all three dims are consumed (`controlVectors[0][2].x`).
        expect(deepestArrayEntryType(CONTROL_VECTORS)).toBe("vector");
    });

    it("returns undefined when no indexedArrayDescription is present", () => {
        expect(deepestArrayEntryType(ARRAY_WITHOUT_ALIASES)).toBeUndefined();
    });
});
