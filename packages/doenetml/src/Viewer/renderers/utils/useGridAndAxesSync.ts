import { useEffect, type RefObject } from "react";
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
    useEffect(() => {
        if (!enabled || !board) {
            return;
        }

        // Keep JSXGraph grid state aligned with current SVs.
        if (
            Array.isArray(SVs.grid) ||
            SVs.grid === "dense" ||
            SVs.grid === "medium"
        ) {
            const fixedGrid = Array.isArray(SVs.grid);
            const gridX = fixedGrid ? SVs.grid[0] : null;
            const gridY = fixedGrid ? SVs.grid[1] : null;
            const gridMode = fixedGrid ? "fixed" : SVs.grid;
            const majorStep = fixedGrid
                ? [gridX, gridY]
                : [
                      xaxisRef.current?.defaultTicks.getDistanceMajorTicks() ??
                          "auto",
                      yaxisRef.current?.defaultTicks.getDistanceMajorTicks() ??
                          "auto",
                  ];
            const currentGrid = (board as any).doenetGrid;
            const gridParamsChanged =
                JXG.Options.grid.gridX !== gridX ||
                JXG.Options.grid.gridY !== gridY ||
                currentGrid?.doenetGridMode !== gridMode ||
                currentGrid?.doenetGridMajorStep?.[0] !== majorStep[0] ||
                currentGrid?.doenetGridMajorStep?.[1] !== majorStep[1];
            if (gridParamsChanged) {
                JXG.Options.grid.gridX = gridX;
                JXG.Options.grid.gridY = gridY;
                if (currentGrid) {
                    board.removeObject(
                        [currentGrid, currentGrid.minorGrid].filter(Boolean),
                    );
                    (board as any).doenetGrid = null;
                } else if (board.grids.length > 0) {
                    board.removeObject(board.grids.slice(0, 2));
                    board.grids = [];
                }
            }
            if (!(board as any).doenetGrid) {
                const isDenseGrid = SVs.grid === "dense";
                const grid = board.create("grid", [], {
                    gridX,
                    gridY,
                    majorStep,
                    minorElements: isDenseGrid ? 4 : 0,
                    visible: true,
                    strokeColor: "var(--graphGrid)",
                    strokeOpacity: 1,
                    major: {
                        visible: true,
                        strokeColor: "var(--graphGrid)",
                        strokeOpacity: 1,
                    },
                    minor: {
                        visible: isDenseGrid,
                        strokeColor: "var(--graphGrid)",
                        strokeOpacity: 1,
                    },
                });
                grid.setAttribute({ visible: true });
                grid.minorGrid?.setAttribute({ visible: isDenseGrid });
                grid.doenetGridMode = gridMode;
                grid.doenetGridMajorStep = majorStep;
                (board as any).doenetGrid = grid;
            }
            const activeGrid = (board as any).doenetGrid;
            // `visible` is inherited by the minor curve, so set the major
            // curve directly and then restore the mode-specific minor state.
            activeGrid.visProp.visible = true;
            activeGrid.needsUpdate = true;
            activeGrid.minorGrid?.setAttribute({
                visible: SVs.grid === "dense",
            });
        } else if ((board as any).doenetGrid) {
            const currentGrid = (board as any).doenetGrid;
            board.removeObject(
                [currentGrid, currentGrid.minorGrid].filter(Boolean),
            );
            (board as any).doenetGrid = null;
        } else if (board.grids.length > 0) {
            board.removeObject(board.grids.slice(0, 2));
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
                // Invariant: JSXgraph keeps `hasLabel` and `label` in lockstep,
                // so the second clause only narrows the type — it never gates
                // out a state that should be reachable.
                if (xaxisRef.current.hasLabel && xaxisRef.current.label) {
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
                // Invariant: see x-axis above — `hasLabel` ⇒ `label` defined.
                if (yaxisRef.current.hasLabel && yaxisRef.current.label) {
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
