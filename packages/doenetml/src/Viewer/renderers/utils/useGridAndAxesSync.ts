// @ts-nocheck
import { useEffect } from "react";
// @ts-ignore
import JXG from "jsxgraph";
import {
    applyAxisTickHeights,
    createXAxis,
    createYAxis,
    setMinorTicks,
} from "./jsxgraph";

export default function useGridAndAxesSync({
    enabled,
    board,
    SVs,
    xaxisRef,
    yaxisRef,
    previousXaxisWithLabelRef,
    previousYaxisWithLabelRef,
}) {
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

        // Update tick display style after any grid-mode changes.
        applyAxisTickHeights({ grid: SVs.grid, xaxisRef, yaxisRef });

        const displayXAxisChanged = SVs.displayXAxis
            ? !Boolean(xaxisRef.current)
            : Boolean(xaxisRef.current);
        const displayYAxisChanged = SVs.displayYAxis
            ? !Boolean(yaxisRef.current)
            : Boolean(yaxisRef.current);

        if (displayYAxisChanged && !displayXAxisChanged && SVs.displayXAxis) {
            board.removeObject(xaxisRef.current);
            xaxisRef.current = null;
        }

        if (displayXAxisChanged && !displayYAxisChanged && SVs.displayYAxis) {
            board.removeObject(yaxisRef.current);
            yaxisRef.current = null;
        }

        // Reconcile x-axis existence and label/tick presentation.
        if (SVs.displayXAxis) {
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
                setMinorTicks(xaxisRef.current);
                if (xaxisRef.current.hasLabel) {
                    let position = "rt";
                    let offset = [5, 10];
                    let anchorx = "right";
                    if (SVs.xLabelPosition === "left") {
                        position = "lft";
                        anchorx = "left";
                        offset = [-5, 10];
                    }
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
        if (SVs.displayYAxis) {
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
                setMinorTicks(yaxisRef.current);
                if (yaxisRef.current.hasLabel) {
                    let position = "rt";
                    let offset = [-10, -5];
                    let anchorx = "right";
                    if (SVs.yLabelPosition === "bottom") {
                        position = "lft";
                        offset[1] = 5;
                    }
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
    });
}
