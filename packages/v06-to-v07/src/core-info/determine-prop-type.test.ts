import { describe, expect, it, vi } from "vitest";
import { describeProp, determinePropType } from "./determine-prop-type";

const Mock = vi.fn();
vi.stubGlobal("postMessage", Mock);
vi.mock("hyperformula");

type Mapping = {
    componentType: string;
    prop: string;
    propType: string;
    nIndices?: number;
};

describe("propType tests", async () => {
    it("return correct type", async () => {
        const expectedMappings: Mapping[] = [
            {
                componentType: "point",
                prop: "x",
                propType: "math",
            },
            {
                componentType: "point",
                prop: "coords",
                propType: "coords",
            },
            {
                componentType: "point",
                prop: "xs",
                propType: "math",
            },
            {
                componentType: "point",
                prop: "hidden",
                propType: "boolean",
            },
            {
                componentType: "spreadsheet",
                prop: "cells",
                propType: "cellBlock",
            },
            {
                componentType: "spreadsheet",
                prop: "column1",
                propType: "column",
            },
            {
                componentType: "spreadsheet",
                prop: "row1",
                propType: "row",
            },
            {
                componentType: "parabola",
                prop: "vertex",
                propType: "point",
            },
            {
                componentType: "polygon",
                prop: "vertices",
                propType: "point",
            },
            {
                componentType: "polygon",
                prop: "vertex1",
                propType: "point",
            },
        ];

        for (const mapping of expectedMappings) {
            expect(determinePropType(mapping.componentType, mapping.prop)).eq(
                mapping.propType,
            );
        }
    });

    it("arrayIndices", async () => {
        const expectedMappings: Mapping[] = [
            {
                componentType: "point",
                prop: "xs",
                nIndices: 1,
                propType: "math",
            },
            {
                componentType: "spreadsheet",
                prop: "cells",
                nIndices: 1,
                propType: "row",
            },
            {
                componentType: "spreadsheet",
                prop: "cells",
                nIndices: 2,
                propType: "cell",
            },
            {
                componentType: "parabola",
                prop: "vertex",
                nIndices: 1,
                propType: "math",
            },
            {
                componentType: "polygon",
                prop: "vertices",
                nIndices: 1,
                propType: "point",
            },
            {
                componentType: "polygon",
                prop: "vertices",
                nIndices: 2,
                propType: "math",
            },
        ];

        for (const mapping of expectedMappings) {
            expect(
                determinePropType(
                    mapping.componentType,
                    mapping.prop,
                    mapping.nIndices,
                ),
            ).eq(
                mapping.propType,
                `Expected ${mapping.componentType}.${mapping.prop} with ${mapping.nIndices} indices to equal ${mapping.propType}`,
            );
        }
    });

    it("tells whether a prop copies to several components", async () => {
        const expected: [string, string, number, boolean][] = [
            // A whole array is one component per entry...
            ["polygon", "vertices", 0, true],
            ["point", "xs", 0, true],
            ["cobwebPolyline", "iterateValues", 0, true],
            // ...unless its outermost dimension is wrapped into one component.
            ["matrix", "matrix", 0, false],
            // Indexing down to an entry, or naming one, gives a single component.
            ["polygon", "vertices", 1, false],
            ["point", "xs", 1, false],
            ["polygon", "vertex1", 0, false],
            ["point", "x", 0, false],
            ["point", "coords", 0, false],
        ];
        for (const [componentType, prop, nIndices, isMultiple] of expected) {
            expect(describeProp(componentType, prop, nIndices).isMultiple).eq(
                isMultiple,
                `${componentType}.${prop} with ${nIndices} indices`,
            );
        }
    });
});
