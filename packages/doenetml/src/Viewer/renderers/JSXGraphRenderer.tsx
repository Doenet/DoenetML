import React, { useEffect, useRef, useState, Context } from "react";
// @ts-ignore
import JXG from "jsxgraph";
import {
    addNavigationButtons,
    createXAxis,
    createYAxis,
    type AxisJXG,
} from "./utils/jsxgraph";
import useJSXGraphBoardSync from "./utils/useJSXGraphBoardSync";
import { JXGBoard } from "./jsxgraph-distrib/types";
import { GraphSVs } from "./graph";
import { CallActionArgs, RendererAction } from "../useDoenetRenderer";

interface JSXGraphRendererProps {
    id: string;
    SVs: GraphSVs;
    children: React.ReactNode;
    ignoreUpdate: boolean;
    actions: Record<string, RendererAction>;
    callAction: (argObj: CallActionArgs) => void;
    BoardContext: Context<JXGBoard | null>;
    surfaceStyle: React.CSSProperties;
}

export default function JSXGraphRenderer({
    id,
    SVs,
    children,
    ignoreUpdate,
    actions,
    callAction,
    BoardContext,
    surfaceStyle,
}: JSXGraphRendererProps) {
    const [board, setBoard] = useState<JXGBoard | null>(null);

    const previousBoundingbox = useRef<number[]>([0, 0, 0, 0]);
    const xaxis = useRef<AxisJXG | null | undefined>(null);
    const yaxis = useRef<AxisJXG | null | undefined>(null);
    const settingBoundingBox = useRef<boolean>(false);
    const boardJustInitialized = useRef<boolean>(false);

    const previousShowNavigation = useRef<boolean>(false);
    const previousXaxisWithLabel = useRef<boolean>(false);
    const previousYaxisWithLabel = useRef<boolean>(false);

    const showNavigation = Boolean(SVs.showNavigation && !SVs.fixAxes);

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

        const newBoard: JXGBoard = (window as any).JXG.JSXGraph.initBoard(id, {
            boundingbox,
            axis: false,
            showCopyright: false,
            showNavigation: false,
            zoom: { wheel: !SVs.fixAxes, needShift: true },
            pan: { enabled: !SVs.fixAxes, needShift: false },
            grid: haveFixedGrid,
        });

        (newBoard as any).itemsRenderedLowQuality = {};

        newBoard.on("boundingbox", () => {
            if (!settingBoundingBox.current) {
                const newBoundingbox = newBoard.getBoundingBox();
                const [xMin, yMax, xMax, yMin] = newBoundingbox;

                const xscale = Math.abs(xMax - xMin);
                const yscale = Math.abs(yMax - yMin);
                const diffs = newBoundingbox.map((v: number, i: number) =>
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

        function keyFocusOutListener(evt: FocusEvent) {
            const id_node = (evt.target as HTMLElement).id;
            if (id_node === "") {
                return false;
            }

            const el_id = id_node.replace(id + "_", "");
            const el = (newBoard as any).select(el_id);
            el.triggerEventHandlers?.(["keyfocusout"], [evt]);
        }

        (newBoard as any).containerObj.addEventListener(
            "focusout",
            keyFocusOutListener,
        );

        function keyDownListener(evt: KeyboardEvent) {
            const id_node = (evt.target as HTMLElement).id;
            if (id_node === "") {
                return false;
            }

            const el_id = id_node.replace(id + "_", "");
            const el = (newBoard as any).select(el_id);
            el.triggerEventHandlers?.(["keydown"], [evt]);
        }

        (newBoard as any).containerObj.addEventListener(
            "keydown",
            keyDownListener,
        );

        return () => {
            const container = (newBoard as any).containerObj;
            container?.removeEventListener("focusout", keyFocusOutListener);
            container?.removeEventListener("keydown", keyDownListener);
            newBoard.off("boundingbox");
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
