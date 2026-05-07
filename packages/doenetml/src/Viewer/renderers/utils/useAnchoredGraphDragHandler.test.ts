import { describe, expect, it, vi } from "vitest";
import type { RefObject } from "react";

// jsxgraph reads `window`/`document` at module load. The helper imports
// JXG only for `COORDS_BY_USER`, so we stub the module here to avoid
// pulling in the browser env.
vi.mock("jsxgraph", () => ({ default: { COORDS_BY_USER: 1 } }));

import JXG from "jsxgraph";
import {
    attachAnchoredGraphDragHandlers,
    AttachAnchoredGraphDragHandlersParams,
} from "./useAnchoredGraphDragHandler";
import type { JXGEvent } from "../jsxgraph-distrib/types";
import type { PointerDragState } from "./pointerDragState";

// These tests cover the drag-handler closure only — the math that clamps a
// drag to the board's bounding box, and the difference between text-mode
// (clamp from `newJXG.size` + `anchorRel`) and image-mode (clamp from the
// `imageMode` getters with a smaller padding fraction and offset
// subtraction). The down/hit/up/keydown plumbing is action-name lookup;
// Cypress validates that end-to-end.

function makeRef<T>(value: T): RefObject<T> {
    return { current: value } as RefObject<T>;
}

function makePointerState(): PointerDragState {
    return {
        pointerAtDown: makeRef<[number, number] | null>(null),
        pointerIsDown: makeRef(false),
        pointerMovedSinceDown: makeRef(false),
        dragged: makeRef(false),
    };
}

function makeFakeBoard() {
    return {
        getBoundingBox: () => [-10, 10, 10, -10] as const,
        unitX: 50,
        unitY: 50,
        origin: { scrCoords: [1, 200, 200] as const },
    };
}

function makeFakeJXG(opts: {
    size?: [number, number];
    relativeUsrCoords?: [number, number, number];
}) {
    const handlers: Record<string, (e: JXGEvent) => void> = {};
    const setCoordinates = vi.fn();
    return {
        handlers,
        setCoordinates,
        element: {
            isDraggable: false,
            size: opts.size,
            relativeCoords: {
                usrCoords: opts.relativeUsrCoords ?? [1, 0, 0],
                setCoordinates,
            },
            on(event: string, handler: (e: JXGEvent) => void) {
                handlers[event] = handler;
            },
            off: vi.fn(),
        },
    };
}

function makeFakeAnchorPoint(opts: {
    x: number;
    y: number;
    scrCoords?: [number, number, number];
}) {
    return {
        X: () => opts.x,
        Y: () => opts.y,
        coords: {
            scrCoords: opts.scrCoords ?? [1, 200, 200],
            setCoordinates: vi.fn(),
        },
    };
}

function setup(
    overrides: Partial<AttachAnchoredGraphDragHandlersParams> = {},
    elementOpts: Parameters<typeof makeFakeJXG>[0] = {},
    anchorOpts: Parameters<typeof makeFakeAnchorPoint>[0] = { x: 0, y: 0 },
) {
    const board = makeFakeBoard();
    const fakeJXG = makeFakeJXG(elementOpts);
    const fakeAnchor = makeFakeAnchorPoint(anchorOpts);
    const callAction = vi.fn();
    const actions = {
        moveText: { actionName: "moveText", componentIdx: 1 },
        textFocused: { actionName: "textFocused", componentIdx: 1 },
        textClicked: { actionName: "textClicked", componentIdx: 1 },
        moveImage: { actionName: "moveImage", componentIdx: 1 },
        imageFocused: { actionName: "imageFocused", componentIdx: 1 },
        imageClicked: { actionName: "imageClicked", componentIdx: 1 },
    };
    const pointerState = makePointerState();
    const calculatedX = makeRef<number | null>(null);
    const calculatedY = makeRef<number | null>(null);

    const baseParams = {
        board: board as any,
        newJXG: fakeJXG.element as any,
        newAnchorPoint: fakeAnchor as any,
        pointerState,
        pointAtDown: makeRef<number[] | null>(null),
        calculatedX,
        calculatedY,
        fixed: makeRef(false),
        fixLocation: makeRef(false),
        lastPositionFromCore: makeRef<number[] | null>([0, 0]),
        componentIdx: 1,
        actions,
        callAction,
        actionNames: {
            move: "moveText",
            focused: "textFocused",
            clicked: "textClicked",
        },
    };

    const params = {
        ...baseParams,
        ...overrides,
    } as AttachAnchoredGraphDragHandlersParams;

    attachAnchoredGraphDragHandlers(params);

    return {
        params,
        fakeJXG,
        fakeAnchor,
        pointerState,
        calculatedX,
        calculatedY,
        callAction,
        actions,
    };
}

describe("attachAnchoredGraphDragHandlers — drag-handler clamp math", () => {
    it("text mode: clamps a leftward pointer drag to the left edge of the board with 0.04 padding", () => {
        // size=[100,50] px / unit=50 → width=2, height=1 user coords.
        // anchor "middle"/"middle" → offsetx=-1, offsety=-0.5.
        // padding=0.04 * (xMax-xMin)=20 → 0.8.
        // xminAdjusted = -10 + 0.8 - (-1) - 2 = -10.2.
        // Pointer drag delta sends element to userX=-16, which clamps.
        const env = setup(
            {
                anchorRel: makeRef<[string, string] | null>([
                    "middle",
                    "middle",
                ]),
            },
            { size: [100, 50] },
        );
        env.pointerState.pointerAtDown.current = [200, 200];
        env.params.pointAtDown.current = [1, 100, 100];

        env.fakeJXG.handlers["drag"]({
            type: "pointermove",
            x: -500,
            y: 200,
        } as JXGEvent);

        expect(env.calculatedX.current).toBeCloseTo(-10.2, 10);
        expect(env.calculatedY.current).toBeCloseTo(2, 10);
        expect(env.pointerState.dragged.current).toBe(true);
        expect(env.callAction).toHaveBeenCalledWith({
            action: env.actions.moveText,
            args: {
                x: env.calculatedX.current,
                y: env.calculatedY.current,
                transient: true,
                skippable: true,
            },
        });
        // Text-mode resets relativeCoords to [0, 0].
        expect(env.fakeJXG.setCoordinates).toHaveBeenCalledWith(
            JXG.COORDS_BY_USER,
            [0, 0],
        );
    });

    it("text mode: keyboard drag uses anchor + relativeCoords source and clamps to the right edge", () => {
        // Non-pointer event: source is newAnchorPoint.X() + relativeCoords.usrCoords[1] (no offset subtraction in text mode).
        const env = setup(
            {
                anchorRel: makeRef<[string, string] | null>([
                    "middle",
                    "middle",
                ]),
            },
            { size: [100, 50], relativeUsrCoords: [1, 0, 0] },
            { x: 11.5, y: 0 },
        );

        env.fakeJXG.handlers["drag"]({
            type: "keydown",
            x: 0,
            y: 0,
        } as JXGEvent);

        // Source: 11.5 + 0 = 11.5. xmaxAdjusted = 10 - 0.8 - (-1) = 10.2 → clamped.
        expect(env.calculatedX.current).toBeCloseTo(10.2, 10);
        expect(env.calculatedY.current).toBeCloseTo(0, 10);
        // Non-pointer always exceeds drag threshold.
        expect(env.pointerState.dragged.current).toBe(true);
    });

    it("image mode: pointer drag uses 0.01 padding and the imageMode getters", () => {
        // imageMode size=[4, 2] user coords, offset=[-2, -1] (centered).
        // padding=0.01 * (xMax-xMin)=20 → 0.2.
        // xminAdjusted = -10 + 0.2 - (-2) - 4 = -11.8.
        const env = setup(
            {
                imageMode: {
                    getCurrentSize: () => [4, 2],
                    getCurrentOffset: () => [-2, -1],
                },
                actionNames: {
                    move: "moveImage",
                    focused: "imageFocused",
                    clicked: "imageClicked",
                },
            },
            { relativeUsrCoords: [1, -2, -1] },
        );

        env.pointerState.pointerAtDown.current = [200, 200];
        env.params.pointAtDown.current = [1, 100, 100];

        env.fakeJXG.handlers["drag"]({
            type: "pointermove",
            x: -500,
            y: 200,
        } as JXGEvent);

        // Same pointer arithmetic as test 1 → userX=-16, userY=2.
        // Clamps to -11.8 (image-mode), proving the imageMode size/offset
        // getters were read instead of newJXG.size and that paddingFraction
        // defaulted to 0.01 rather than text-mode's 0.04.
        expect(env.calculatedX.current).toBeCloseTo(-11.8, 10);
        expect(env.calculatedY.current).toBeCloseTo(2, 10);
        expect(env.callAction).toHaveBeenCalledWith({
            action: env.actions.moveImage,
            args: {
                x: env.calculatedX.current,
                y: env.calculatedY.current,
                transient: true,
                skippable: true,
            },
        });
        // Image-mode targets relativeCoords with the offset, not [0, 0].
        expect(env.fakeJXG.setCoordinates).toHaveBeenCalledWith(
            JXG.COORDS_BY_USER,
            [-2, -1],
        );
    });

    it("image mode: keyboard drag subtracts offset in the non-pointer source", () => {
        // Image's relativeCoords carry the offset directly (unlike text).
        // Without offset subtraction, calculatedX would be 5 + (-2) = 3.
        // With image-mode subtraction: 5 + (-2) - (-2) = 5.
        const env = setup(
            {
                imageMode: {
                    getCurrentSize: () => [4, 2],
                    getCurrentOffset: () => [-2, -1],
                },
                actionNames: {
                    move: "moveImage",
                    focused: "imageFocused",
                    clicked: "imageClicked",
                },
            },
            { relativeUsrCoords: [1, -2, -1] },
            { x: 5, y: 0 },
        );

        env.fakeJXG.handlers["drag"]({
            type: "keydown",
            x: 0,
            y: 0,
        } as JXGEvent);

        expect(env.calculatedX.current).toBeCloseTo(5, 10);
        expect(env.calculatedY.current).toBeCloseTo(0, 10);
    });

    it("respects a custom imageMode.paddingFraction override", () => {
        // Override padding to 0.1 (20 * 0.1 = 2). xminAdjusted = -10 + 2 - 0 - 4 = -12.
        const env = setup(
            {
                imageMode: {
                    getCurrentSize: () => [4, 2],
                    getCurrentOffset: () => [0, 0],
                    paddingFraction: 0.1,
                },
                actionNames: {
                    move: "moveImage",
                    focused: "imageFocused",
                    clicked: "imageClicked",
                },
            },
            { relativeUsrCoords: [1, 0, 0] },
            { x: -50, y: 0 },
        );

        env.fakeJXG.handlers["drag"]({
            type: "keydown",
            x: 0,
            y: 0,
        } as JXGEvent);

        expect(env.calculatedX.current).toBeCloseTo(-12, 10);
    });
});
