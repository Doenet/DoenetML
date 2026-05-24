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
            { name: "head", hasIndex: false },
            { name: "x", hasIndex: false },
        ]);
        expect(out).toEqual({ dim: 1, numDims: 1, aliasPath: ["x"] });
    });

    it("consumes dim 0 by bracket index (line.points[1])", () => {
        const out = walkIndexAliases(POINTS, [
            { name: "points", hasIndex: true },
        ]);
        // After [1] we've consumed dim 0 but dim 1 is still open — partial
        // walk; the autocomplete path uses this to offer x/y/z next.
        expect(out).toEqual({ dim: 1, numDims: 2, aliasPath: [] });
    });

    it("walks line.points[1].x to full consumption", () => {
        const out = walkIndexAliases(POINTS, [
            { name: "points", hasIndex: true },
            { name: "x", hasIndex: false },
        ]);
        expect(out).toEqual({ dim: 2, numDims: 2, aliasPath: ["x"] });
    });

    it("rejects an unknown alias name (vector.head.hidden)", () => {
        expect(
            walkIndexAliases(HEAD, [
                { name: "head", hasIndex: false },
                { name: "hidden", hasIndex: false },
            ]),
        ).toBeNull();
    });

    it("rejects too many segments for the array's dims", () => {
        expect(
            walkIndexAliases(HEAD, [
                { name: "head", hasIndex: false },
                { name: "x", hasIndex: false },
                { name: "y", hasIndex: false },
            ]),
        ).toBeNull();
    });

    it("rejects non-array properties (text.value)", () => {
        expect(
            walkIndexAliases(VALUE_NOT_ARRAY, [
                { name: "value", hasIndex: false },
                { name: "latex", hasIndex: false },
            ]),
        ).toBeNull();
    });

    it("rejects array props without an indexAliases table", () => {
        expect(
            walkIndexAliases(ARRAY_WITHOUT_ALIASES, [
                { name: "kids", hasIndex: false },
                { name: "x", hasIndex: false },
            ]),
        ).toBeNull();
    });
});

describe("chaseIndexAliases — requires full dim consumption", () => {
    it("succeeds when every dim is consumed", () => {
        expect(
            chaseIndexAliases(HEAD, [
                { name: "head", hasIndex: false },
                { name: "x", hasIndex: false },
            ]),
        ).toEqual({ aliasPath: ["x"] });
    });

    it("fails when dims remain (line.points[1] — partial)", () => {
        expect(
            chaseIndexAliases(POINTS, [{ name: "points", hasIndex: true }]),
        ).toBeNull();
    });

    it("rejects an unknown alias (vector.head.hidden)", () => {
        expect(
            chaseIndexAliases(HEAD, [
                { name: "head", hasIndex: false },
                { name: "hidden", hasIndex: false },
            ]),
        ).toBeNull();
    });
});

describe("deepestArrayEntryType", () => {
    it("returns the leaf entry's type for a 1-dim array", () => {
        expect(deepestArrayEntryType(HEAD)).toBe("point");
    });

    it("returns the deepest entry's type for a 2-dim array", () => {
        expect(deepestArrayEntryType(POINTS)).toBe("math");
    });

    it("returns undefined when no indexedArrayDescription is present", () => {
        expect(deepestArrayEntryType(ARRAY_WITHOUT_ALIASES)).toBeUndefined();
    });
});
