import { describe, expect, it } from "vitest";
import {
    reserveForSlot,
    sameBox,
    SLOT_VERTICAL_STEP,
    SLOT_WIDTH_STEP,
} from "./mathSlotReserve";

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

    it("takes a whole step once a control outgrows its room", () => {
        const reserved = box(62, 20, 8);
        const grown = reserveForSlot({
            measured: box(63, 20, 8),
            reserved,
            editing: true,
        });
        expect(grown.width).eq(2 * SLOT_WIDTH_STEP);
        expect(grown.height).eq(reserved.height);
        expect(grown.depth).eq(reserved.depth);
    });

    it("leaves room even when a control lands exactly on a step", () => {
        // Otherwise the very next character would outgrow the reservation and
        // cost a re-typeset, which is what the steps exist to avoid.
        const reserved = reserveForSlot({
            measured: box(SLOT_WIDTH_STEP, SLOT_VERTICAL_STEP, 0),
            reserved: null,
            editing: true,
        });
        expect(reserved.width).eq(2 * SLOT_WIDTH_STEP);
        expect(reserved.height).eq(2 * SLOT_VERTICAL_STEP);
    });

    it("keeps several keystrokes inside one reservation", () => {
        let reserved = box(24, 20, 8);
        const grown = reserveForSlot({
            measured: box(25, 20, 8),
            reserved,
            editing: true,
        });
        expect(grown.width).eq(SLOT_WIDTH_STEP);
        reserved = grown;
        for (const width of [30, 36, 42, 47]) {
            reserved = reserveForSlot({
                measured: box(width, 20, 8),
                reserved,
                editing: true,
            });
            expect(sameBox(reserved, grown)).eq(true);
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
        expect(grown.width).eq(reserved.width);
        expect(grown.height).eq(3 * SLOT_VERTICAL_STEP);
        expect(grown.depth).eq(2 * SLOT_VERTICAL_STEP);
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
