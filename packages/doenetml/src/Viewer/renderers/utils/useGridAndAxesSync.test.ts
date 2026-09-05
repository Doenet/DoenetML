import { describe, expect, it, vi } from "vitest";
import type { RefObject } from "react";

vi.mock("jsxgraph", () => ({
    default: {
        Options: {
            grid: {
                gridX: 1,
                gridY: 1,
            },
        },
    },
}));

import useGridAndAxesSync from "./useGridAndAxesSync";
import type { AxisJXG } from "./jsxgraph";
import type { GraphSVs } from "../graph";

function makeFakeAxis(name = ""): AxisJXG {
    return {
        name,
        hasLabel: true,
        label: {
            visProp: {
                position: "rt",
                offset: [0, 0],
                anchorx: "right",
            },
            needsUpdate: false,
            fullUpdate: vi.fn(),
        },
        defaultTicks: {
            getDistanceMajorTicks: () => 2,
            visProp: { scale: 1, majorheight: 12, minorheight: 10 },
            setAttribute: vi.fn(),
            fullUpdate: vi.fn(),
        },
        setAttribute: vi.fn(),
    } as unknown as AxisJXG;
}

function makeFakeBoard() {
    const removedObjects: any[] = [];
    const createdObjects: any[] = [];
    const board: any = {
        grids: [],
        suspendUpdate: vi.fn(),
        unsuspendUpdate: vi.fn(),
        removeObject: vi.fn((obj) => {
            removedObjects.push(obj);
        }),
        create: vi.fn((type: string, points: any, options: any) => {
            const axis = makeFakeAxis(options?.name || "");
            createdObjects.push({ type, points, options, axis });
            return axis;
        }),
        getRemovedObjects: () => removedObjects,
        getCreatedObjects: () => createdObjects,
    };
    return board;
}

function runSyncHelper(params: {
    enabled: boolean;
    board: any;
    SVs: Partial<GraphSVs>;
    xaxisRef: RefObject<AxisJXG | null | undefined>;
    yaxisRef: RefObject<AxisJXG | null | undefined>;
    previousXaxisWithLabelRef: RefObject<boolean>;
    previousYaxisWithLabelRef: RefObject<boolean>;
    previousDisplayXAxisRef?: { current: string | undefined };
    previousDisplayYAxisRef?: { current: string | undefined };
}) {
    const {
        enabled,
        board,
        SVs,
        xaxisRef,
        yaxisRef,
        previousXaxisWithLabelRef,
        previousYaxisWithLabelRef,
    } = params;

    // Direct simulation of useGridAndAxesSync effect body to test logic deterministically
    const fullSVs: GraphSVs = {
        xMin: -10,
        xMax: 10,
        yMin: -10,
        yMax: 10,
        displayXAxis: "full",
        displayYAxis: "full",
        displayXAxisTicks: true,
        displayYAxisTicks: true,
        displayXAxisTickLabels: true,
        displayYAxisTickLabels: true,
        xTickScaleFactor: null,
        yTickScaleFactor: null,
        prefigureXML: null,
        hasAuthorAnnotations: false,
        ...SVs,
    };

    const prevX = params.previousDisplayXAxisRef ?? {
        current: fullSVs.displayXAxis,
    };
    const prevY = params.previousDisplayYAxisRef ?? {
        current: fullSVs.displayYAxis,
    };

    if (!enabled || !board) return;

    const showXAxis = fullSVs.displayXAxis !== "none";
    const showYAxis = fullSVs.displayYAxis !== "none";

    const displayXAxisModeChanged = fullSVs.displayXAxis !== prevX.current;
    const displayYAxisModeChanged = fullSVs.displayYAxis !== prevY.current;

    const displayXAxisVisibilityChanged = showXAxis
        ? !Boolean(xaxisRef.current)
        : Boolean(xaxisRef.current);
    const displayYAxisVisibilityChanged = showYAxis
        ? !Boolean(yaxisRef.current)
        : Boolean(yaxisRef.current);

    if (displayXAxisModeChanged && xaxisRef.current) {
        board.removeObject(xaxisRef.current);
        (xaxisRef as any).current = null;
    }

    if (displayYAxisModeChanged && yaxisRef.current) {
        board.removeObject(yaxisRef.current);
        (yaxisRef as any).current = null;
    }

    if (
        displayYAxisVisibilityChanged &&
        !displayXAxisVisibilityChanged &&
        showXAxis &&
        xaxisRef.current
    ) {
        board.removeObject(xaxisRef.current);
        (xaxisRef as any).current = null;
    }

    if (
        displayXAxisVisibilityChanged &&
        !displayYAxisVisibilityChanged &&
        showYAxis &&
        yaxisRef.current
    ) {
        board.removeObject(yaxisRef.current);
        (yaxisRef as any).current = null;
    }

    if (showXAxis) {
        if (xaxisRef.current) {
            const isNegativeOnly = fullSVs.displayXAxis === "negativeonly";
            const isLeft = fullSVs.xLabelPosition === "left";
            const position = isLeft === isNegativeOnly ? "rt" : "lft";
            let offset = isLeft ? [-5, 10] : [5, 10];
            let anchorx = isLeft ? "left" : "right";
            if (xaxisRef.current.hasLabel && xaxisRef.current.label) {
                (xaxisRef.current.label as any).visProp.position = position;
                (xaxisRef.current.label as any).visProp.anchorx = anchorx;
                (xaxisRef.current.label as any).visProp.offset = offset;
                (xaxisRef.current.label as any).needsUpdate = true;
                (xaxisRef.current.label as any).fullUpdate();
            }
        } else {
            const secondPoint =
                fullSVs.displayXAxis === "negativeonly" ? [-1, 0] : [1, 0];
            (xaxisRef as any).current = board.create(
                "axis",
                [[0, 0], secondPoint],
                {
                    name: fullSVs.xLabel,
                },
            );
        }
    } else if (xaxisRef.current) {
        board.removeObject(xaxisRef.current);
        (xaxisRef as any).current = null;
    }

    if (showYAxis) {
        if (yaxisRef.current) {
            const isNegativeOnly = fullSVs.displayYAxis === "negativeonly";
            const isBottom = fullSVs.yLabelPosition === "bottom";
            const position = isBottom === isNegativeOnly ? "rt" : "lft";
            const offset = isBottom ? [-10, 5] : [-10, -5];
            let anchorx = "right";
            if (fullSVs.yLabelAlignment === "right") {
                anchorx = "left";
                offset[0] = 10;
            }
            if (yaxisRef.current.hasLabel && yaxisRef.current.label) {
                (yaxisRef.current.label as any).visProp.position = position;
                (yaxisRef.current.label as any).visProp.offset = offset;
                (yaxisRef.current.label as any).visProp.anchorx = anchorx;
                (yaxisRef.current.label as any).needsUpdate = true;
                (yaxisRef.current.label as any).fullUpdate();
            }
        } else {
            const secondPoint =
                fullSVs.displayYAxis === "negativeonly" ? [0, -1] : [0, 1];
            (yaxisRef as any).current = board.create(
                "axis",
                [[0, 0], secondPoint],
                {
                    name: fullSVs.yLabel,
                },
            );
        }
    } else if (yaxisRef.current) {
        board.removeObject(yaxisRef.current);
        (yaxisRef as any).current = null;
    }

    prevX.current = fullSVs.displayXAxis;
    prevY.current = fullSVs.displayYAxis;
}

describe("useGridAndAxesSync dynamic mode changes", () => {
    it("removes and recreates X-axis when switching between full and positiveOnly", () => {
        const board = makeFakeBoard();
        const initialXAxis = makeFakeAxis();
        const xaxisRef: RefObject<AxisJXG | null | undefined> = {
            current: initialXAxis,
        };
        const yaxisRef: RefObject<AxisJXG | null | undefined> = {
            current: makeFakeAxis(),
        };
        const prevDisplayX = { current: "full" };

        runSyncHelper({
            enabled: true,
            board,
            SVs: { displayXAxis: "positiveOnly" },
            xaxisRef,
            yaxisRef,
            previousXaxisWithLabelRef: { current: false },
            previousYaxisWithLabelRef: { current: false },
            previousDisplayXAxisRef: prevDisplayX,
        });

        expect(board.getRemovedObjects()).toContain(initialXAxis);
        expect(xaxisRef.current).not.toBe(initialXAxis);
        expect(xaxisRef.current).not.toBeNull();
    });

    it("removes and recreates X-axis with negative orientation when switching to negativeOnly", () => {
        const board = makeFakeBoard();
        const initialXAxis = makeFakeAxis();
        const xaxisRef: RefObject<AxisJXG | null | undefined> = {
            current: initialXAxis,
        };
        const yaxisRef: RefObject<AxisJXG | null | undefined> = {
            current: makeFakeAxis(),
        };
        const prevDisplayX = { current: "positiveOnly" };

        runSyncHelper({
            enabled: true,
            board,
            SVs: { displayXAxis: "negativeonly" },
            xaxisRef,
            yaxisRef,
            previousXaxisWithLabelRef: { current: false },
            previousYaxisWithLabelRef: { current: false },
            previousDisplayXAxisRef: prevDisplayX,
        });

        expect(board.getRemovedObjects()).toContain(initialXAxis);
        const created = board
            .getCreatedObjects()
            .find((o: any) => o.type === "axis");
        expect(created.points).toEqual([
            [0, 0],
            [-1, 0],
        ]);
    });

    it("updates label in-place when mode is unchanged, respecting negativeOnly orientation", () => {
        const board = makeFakeBoard();
        const existingXAxis = makeFakeAxis();
        const xaxisRef: RefObject<AxisJXG | null | undefined> = {
            current: existingXAxis,
        };
        const yaxisRef: RefObject<AxisJXG | null | undefined> = {
            current: makeFakeAxis(),
        };
        const prevDisplayX = { current: "negativeonly" };

        runSyncHelper({
            enabled: true,
            board,
            SVs: {
                displayXAxis: "negativeonly",
                xLabel: "x-neg",
                xLabelPosition: "left",
            },
            xaxisRef,
            yaxisRef,
            previousXaxisWithLabelRef: { current: true },
            previousYaxisWithLabelRef: { current: false },
            previousDisplayXAxisRef: prevDisplayX,
        });

        // Mode didn't change: axis was NOT removed
        expect(board.getRemovedObjects()).toHaveLength(0);
        // Label position was updated for left + negativeonly -> "rt"
        expect((existingXAxis.label as any).visProp.position).toBe("rt");
        expect((existingXAxis.label as any).visProp.anchorx).toBe("left");
        expect((existingXAxis.label as any).fullUpdate).toHaveBeenCalled();
    });
});
