import { describe, expect, it } from "vitest";
import { reserveForSlot, sameBox } from "./mathSlotReserve";

const box = (width: number, height: number, depth: number) => ({
    width,
    height,
    depth,
});

describe("reserveForSlot", () => {
    it("reserves exactly what a control that is not being edited measures", () => {
        const measured = box(37, 14, 5);
        expect(
            reserveForSlot({ measured, reserved: null, editing: false }),
        ).toEqual(measured);
        expect(
            reserveForSlot({
                measured,
                reserved: box(96, 24, 12),
                editing: false,
            }),
        ).toEqual(measured);
    });

    it("keeps the room already reserved while a control still fits it", () => {
        // Beginning to type must not itself move the expression: the field is
        // exactly as big as the box it was given, so nothing has to change.
        const reserved = box(62, 20, 8);
        expect(
            reserveForSlot({
                measured: box(62, 20, 8),
                reserved,
                editing: true,
            }),
        ).toEqual(reserved);
        expect(
            reserveForSlot({
                measured: box(40, 14, 2),
                reserved,
                editing: true,
            }),
        ).toEqual(reserved);
    });

    it("grows exactly as much as the control does", () => {
        let reserved = box(62, 20, 8);
        for (const width of [63, 70, 84, 91]) {
            reserved = reserveForSlot({
                measured: box(width, 20, 8),
                reserved,
                editing: true,
            });
            expect(reserved).toEqual(box(width, 20, 8));
        }
    });

    it("does not shrink while a control is being edited", () => {
        const reserved = box(96, 36, 24);
        expect(
            reserveForSlot({
                measured: box(20, 14, 4),
                reserved,
                editing: true,
            }),
        ).toEqual(reserved);
    });

    it("grows one direction without disturbing the others", () => {
        const reserved = box(96, 24, 12);
        // A fraction: taller and deeper, no wider.
        const grown = reserveForSlot({
            measured: box(50, 26, 18),
            reserved,
            editing: true,
        });
        expect(grown).toEqual(box(96, 26, 18));
        // More text: wider, no taller.
        const wider = reserveForSlot({
            measured: box(110, 20, 8),
            reserved: grown,
            editing: true,
        });
        expect(wider).toEqual(box(110, 26, 18));
    });
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
