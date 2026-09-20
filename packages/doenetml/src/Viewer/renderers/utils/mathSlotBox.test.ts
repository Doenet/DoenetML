import { describe, expect, it } from "vitest";
import { sameBox } from "./mathSlotBox";

const box = (width: number, height: number, depth: number) => ({
    width,
    height,
    depth,
});

describe("sameBox", () => {
    it("treats two absent boxes as the same and one absent as different", () => {
        expect(sameBox(null, null)).eq(true);
        expect(sameBox(null, box(1, 2, 3))).eq(false);
    });

    it("compares every dimension", () => {
        expect(sameBox(box(1, 2, 3), box(1, 2, 3))).eq(true);
        expect(sameBox(box(1, 2, 3), box(1, 2, 4))).eq(false);
    });
});
