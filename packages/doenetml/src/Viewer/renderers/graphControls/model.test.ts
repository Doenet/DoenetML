import { describe, expect, it } from "vitest";
import {
    assertKnownGraphControlType,
    sortGraphControlsForDisplay,
    type GraphControlItem,
} from "./model";

function mockControl(
    controlType: GraphControlItem["controlType"],
    componentIdx: number,
    controlOrder: number,
): GraphControlItem {
    return {
        controlType,
        componentIdx,
        controlOrder,
    } as GraphControlItem;
}

describe("graph controls model", () => {
    it("accepts all supported control types", () => {
        expect(assertKnownGraphControlType("point")).toBe("point");
        expect(assertKnownGraphControlType("circle")).toBe("circle");
        expect(assertKnownGraphControlType("triangle")).toBe("triangle");
        expect(assertKnownGraphControlType("rectangle")).toBe("rectangle");
        expect(assertKnownGraphControlType("regularPolygon")).toBe(
            "regularPolygon",
        );
        expect(assertKnownGraphControlType("polygon")).toBe("polygon");
        expect(assertKnownGraphControlType("lineSegment")).toBe("lineSegment");
        expect(assertKnownGraphControlType("vector")).toBe("vector");
    });

    it("throws for unsupported control types", () => {
        expect(() => assertKnownGraphControlType("ellipse")).toThrow(
            /Unsupported controlType "ellipse"/,
        );
    });

    it("orders controls by slot semantics while preserving tie order", () => {
        const controls: GraphControlItem[] = [
            mockControl("point", 1, 3),
            mockControl("vector", 2, 1),
            mockControl("point", 3, 0),
            mockControl("circle", 4, 2),
            mockControl("point", 5, 3),
        ];

        const sorted = sortGraphControlsForDisplay(controls);

        expect(sorted.map((x) => x.componentIdx)).toEqual([2, 4, 1, 5, 3]);
    });
});
