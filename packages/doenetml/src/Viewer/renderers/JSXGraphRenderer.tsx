// @ts-nocheck
import React, { useEffect, useRef, useState } from "react";
// @ts-ignore
import JXG from "jsxgraph";
import {
    addNavigationButtons,
    createXAxis,
    createYAxis,
} from "./utils/jsxgraph";
import useJSXGraphBoardSync from "./utils/useJSXGraphBoardSync";

export default function JSXGraphRenderer({
    id,
    SVs,
    children,
    ignoreUpdate,
    actions,
    callAction,
    BoardContext,
    surfaceStyle,
}) {
    const [board, setBoard] = useState(null);

    const previousDimensions = useRef(null);
    const previousBoundingbox = useRef(null);
    const xaxis = useRef(null);
    const yaxis = useRef(null);
    const settingBoundingBox = useRef(false);
    const boardJustInitialized = useRef(false);

    const previousShowNavigation = useRef(false);
    const previousXaxisWithLabel = useRef(null);
    const previousYaxisWithLabel = useRef(null);

    const showNavigation = SVs.showNavigation && !SVs.fixAxes;

    useEffect(() => {
        const boundingbox = [SVs.xMin, SVs.yMax, SVs.xMax, SVs.yMin];
        previousBoundingbox.current = boundingbox;

        JXG.Options.layer.numlayers = 100;
        JXG.Options.navbar.highlightFillColor = "var(--canvasText)";
        JXG.Options.navbar.strokeColor = "var(--canvasText)";

        let haveFixedGrid = false;
        if (Array.isArray(SVs.grid)) {
            haveFixedGrid = true;
            JXG.Options.grid.gridX = SVs.grid[0];
            JXG.Options.grid.gridY = SVs.grid[1];
        }

        const newBoard = window.JXG.JSXGraph.initBoard(id, {
            boundingbox,
            axis: false,
            showCopyright: false,
            showNavigation: false,
            zoom: { wheel: !SVs.fixAxes, needShift: true },
            pan: { enabled: !SVs.fixAxes, needShift: false },
            grid: haveFixedGrid,
        });

        newBoard.itemsRenderedLowQuality = {};

        newBoard.on("boundingbox", () => {
            if (!settingBoundingBox.current) {
                const newBoundingbox = newBoard.getBoundingBox();
                const [xMin, yMax, xMax, yMin] = newBoundingbox;

                const xscale = Math.abs(xMax - xMin);
                const yscale = Math.abs(yMax - yMin);
                const diffs = newBoundingbox.map((v, i) =>
                    Math.abs(v - previousBoundingbox.current[i]),
                );
                if (
                    Math.max(
                        diffs[0] / xscale,
                        diffs[1] / yscale,
                        diffs[2] / xscale,
                        diffs[3] / yscale,
                    ) > 1e-12
                ) {
                    previousBoundingbox.current = newBoundingbox;
                    callAction({
                        action: actions.changeAxisLimits,
                        args: { xMin, xMax, yMin, yMax },
                        baseVariableValue: newBoundingbox,
                    });
                }
            }
        });

        setBoard(newBoard);

        previousDimensions.current = {
            width: parseFloat(surfaceStyle.width),
            aspectRatio: SVs.aspectRatio,
        };

        if (SVs.displayXAxis) {
            createXAxis({
                theBoard: newBoard,
                SVs,
                xaxisRef: xaxis,
                previousXaxisWithLabelRef: previousXaxisWithLabel,
            });
        }

        if (SVs.displayYAxis) {
            createYAxis({
                theBoard: newBoard,
                SVs,
                yaxisRef: yaxis,
                previousYaxisWithLabelRef: previousYaxisWithLabel,
            });
        }

        boardJustInitialized.current = true;
        previousShowNavigation.current = showNavigation;

        function keyFocusOutListener(evt) {
            const id_node = evt.target.id;
            if (id_node === "") {
                return false;
            }

            const el_id = id_node.replace(id + "_", "");
            const el = newBoard.select(el_id);
            el.triggerEventHandlers?.(["keyfocusout"], [evt]);
        }

        newBoard.containerObj.addEventListener("focusout", keyFocusOutListener);

        function keyDownListener(evt) {
            const id_node = evt.target.id;
            if (id_node === "") {
                return false;
            }

            const el_id = id_node.replace(id + "_", "");
            const el = newBoard.select(el_id);
            el.triggerEventHandlers?.(["keydown"], [evt]);
        }

        newBoard.containerObj.addEventListener("keydown", keyDownListener);

        return () => {
            const container = newBoard.containerObj;
            container?.removeEventListener("focusout", keyFocusOutListener);
            container?.removeEventListener("keydown", keyDownListener);
            newBoard.off("boundingbox");

            // Ensure board-level handlers/objects are torn down on unmount.
            if (window?.JXG?.JSXGraph?.freeBoard) {
                window.JXG.JSXGraph.freeBoard(newBoard);
            }
        };
    }, []);

    useEffect(() => {
        if (board && showNavigation) {
            addNavigationButtons({ board, id });
        }
    }, [board]);

    useJSXGraphBoardSync({
        board,
        id,
        SVs,
        ignoreUpdate,
        showNavigation,
        surfaceStyle,
        previousDimensionsRef: previousDimensions,
        previousBoundingboxRef: previousBoundingbox,
        xaxisRef: xaxis,
        yaxisRef: yaxis,
        settingBoundingBoxRef: settingBoundingBox,
        boardJustInitializedRef: boardJustInitialized,
        previousShowNavigationRef: previousShowNavigation,
        previousXaxisWithLabelRef: previousXaxisWithLabel,
        previousYaxisWithLabelRef: previousYaxisWithLabel,
    });

    return (
        <>
            <div id={id} className="jxgbox" style={surfaceStyle} />
            {board ? (
                <BoardContext.Provider value={board}>
                    {children}
                </BoardContext.Provider>
            ) : null}
        </>
    );
}
