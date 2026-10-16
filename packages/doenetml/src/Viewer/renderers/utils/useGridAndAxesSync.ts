import { useEffect, useRef, type RefObject } from "react";
import JXG from "jsxgraph";
import {
    applyAxisTickHeights,
    createXAxis,
    createYAxis,
    type AxisJXG,
} from "./jsxgraph";
import type { JXGBoard } from "../jsxgraph-distrib/types";
import type { GraphSVs } from "../graph";

interface UseGridAndAxesSyncParams {
    enabled: boolean;
    board: JXGBoard | null;
    SVs: GraphSVs;
    xaxisRef: RefObject<AxisJXG | null | undefined>;
    yaxisRef: RefObject<AxisJXG | null | undefined>;
    previousXaxisWithLabelRef: RefObject<boolean>;
    previousYaxisWithLabelRef: RefObject<boolean>;
}

export default function useGridAndAxesSync({
    enabled,
    board,
    SVs,
    xaxisRef,
    yaxisRef,
    previousXaxisWithLabelRef,
    previousYaxisWithLabelRef,
}: UseGridAndAxesSyncParams) {
    const previousDisplayXAxisRef = useRef<string | undefined>(
        SVs.displayXAxis,
    );
    const previousDisplayYAxisRef = useRef<string | undefined>(
        SVs.displayYAxis,
    );

    useEffect(() => {
        if (!enabled || !board) {
            return;
        }

        // Keep JSXGraph grid state aligned with current SVs.
        if (Array.isArray(SVs.grid)) {
            const gridParamsChanged =
                JXG.Options.grid.gridX !== SVs.grid[0] ||
                JXG.Options.grid.gridY !== SVs.grid[1];
            if (gridParamsChanged) {
                JXG.Options.grid.gridX = SVs.grid[0];
                JXG.Options.grid.gridY = SVs.grid[1];
                if (board.grids.length > 0) {
                    board.removeObject(board.grids[0]);
                    board.grids = [];
                }
            }
            if (board.grids.length === 0) {
                board.create("grid", [], {
                    gridX: SVs.grid[0],
                    gridY: SVs.grid[1],
                });
            }
        } else if (board.grids.length > 0) {
            board.removeObject(board.grids[0]);
            board.grids = [];
        }

        // Keep axis tick heights synchronized with current grid mode and tick-visibility SVs.
        applyAxisTickHeights({
            grid: SVs.grid,
            xaxisRef,
            yaxisRef,
            displayXAxisTicks: SVs.displayXAxisTicks,
            displayYAxisTicks: SVs.displayYAxisTicks,
        });

        const showXAxis = SVs.displayXAxis !== "none";
        const showYAxis = SVs.displayYAxis !== "none";

        const displayXAxisModeChanged =
            SVs.displayXAxis !== previousDisplayXAxisRef.current;
        const displayYAxisModeChanged =
            SVs.displayYAxis !== previousDisplayYAxisRef.current;

        const displayXAxisVisibilityChanged = showXAxis
            ? !Boolean(xaxisRef.current)
            : Boolean(xaxisRef.current);
        const displayYAxisVisibilityChanged = showYAxis
            ? !Boolean(yaxisRef.current)
            : Boolean(yaxisRef.current);

        if (displayXAxisModeChanged && xaxisRef.current) {
            board.removeObject(xaxisRef.current);
            xaxisRef.current = null;
        }

        if (displayYAxisModeChanged && yaxisRef.current) {
            board.removeObject(yaxisRef.current);
            yaxisRef.current = null;
        }

        // If one axis changed visibility (shown <-> hidden), the other axis's
        // `drawZero` tick configuration may have changed and needs recreation.
        if (
            displayYAxisVisibilityChanged &&
            !displayXAxisVisibilityChanged &&
            showXAxis &&
            xaxisRef.current
        ) {
            board.removeObject(xaxisRef.current);
            xaxisRef.current = null;
        }

        if (
            displayXAxisVisibilityChanged &&
            !displayYAxisVisibilityChanged &&
            showYAxis &&
            yaxisRef.current
        ) {
            board.removeObject(yaxisRef.current);
            yaxisRef.current = null;
        }

        // Reconcile x-axis existence and label/tick presentation.
        if (showXAxis) {
            if (xaxisRef.current) {
                const xaxisWithLabel = Boolean(SVs.xLabel);

                if (xaxisWithLabel !== previousXaxisWithLabelRef.current) {
                    xaxisRef.current.setAttribute({
                        withlabel: xaxisWithLabel,
                    });
                    previousXaxisWithLabelRef.current = xaxisWithLabel;
                }
                xaxisRef.current.name = SVs.xLabel;
                xaxisRef.current.defaultTicks.setAttribute({
                    drawLabels: SVs.displayXAxisTickLabels,
                });
                // Invariant: JSXgraph keeps `hasLabel` and `label` in lockstep,
                // so the second clause only narrows the type — it never gates
                // out a state that should be reachable.
                if (xaxisRef.current.hasLabel && xaxisRef.current.label) {
                    const isNegativeOnly = SVs.displayXAxis === "negativeonly";
                    const isLeft = SVs.xLabelPosition === "left";
                    const position = isLeft === isNegativeOnly ? "rt" : "lft";
                    let offset = isLeft ? [-5, 10] : [5, 10];
                    let anchorx = isLeft ? "left" : "right";
                    xaxisRef.current.label.visProp.position = position;
                    xaxisRef.current.label.visProp.anchorx = anchorx;
                    xaxisRef.current.label.visProp.offset = offset;
                    xaxisRef.current.label.needsUpdate = true;
                    xaxisRef.current.label.fullUpdate();
                }
            } else {
                createXAxis({
                    theBoard: board,
                    SVs,
                    xaxisRef,
                    previousXaxisWithLabelRef,
                });
            }
        } else if (xaxisRef.current) {
            board.removeObject(xaxisRef.current);
            xaxisRef.current = null;
        }

        // Reconcile y-axis existence and label/tick presentation.
        if (showYAxis) {
            if (yaxisRef.current) {
                const yaxisWithLabel = Boolean(SVs.yLabel);

                if (yaxisWithLabel !== previousYaxisWithLabelRef.current) {
                    yaxisRef.current.setAttribute({
                        withlabel: yaxisWithLabel,
                    });
                    previousYaxisWithLabelRef.current = yaxisWithLabel;
                }
                yaxisRef.current.name = SVs.yLabel;
                yaxisRef.current.defaultTicks.setAttribute({
                    drawLabels: SVs.displayYAxisTickLabels,
                });
                // Invariant: see x-axis above — `hasLabel` ⇒ `label` defined.
                if (yaxisRef.current.hasLabel && yaxisRef.current.label) {
                    const isNegativeOnly = SVs.displayYAxis === "negativeonly";
                    const isBottom = SVs.yLabelPosition === "bottom";
                    const position = isBottom === isNegativeOnly ? "rt" : "lft";
                    const offset = isBottom ? [-10, 5] : [-10, -5];
                    let anchorx = "right";
                    if (SVs.yLabelAlignment === "right") {
                        anchorx = "left";
                        offset[0] = 10;
                    }
                    yaxisRef.current.label.visProp.position = position;
                    yaxisRef.current.label.visProp.offset = offset;
                    yaxisRef.current.label.visProp.anchorx = anchorx;
                    yaxisRef.current.label.needsUpdate = true;
                    yaxisRef.current.label.fullUpdate();
                }
            } else {
                createYAxis({
                    theBoard: board,
                    SVs,
                    yaxisRef,
                    previousYaxisWithLabelRef,
                });
            }
        } else if (yaxisRef.current) {
            board.removeObject(yaxisRef.current);
            yaxisRef.current = null;
        }

        previousDisplayXAxisRef.current = SVs.displayXAxis;
        previousDisplayYAxisRef.current = SVs.displayYAxis;
    });
}
