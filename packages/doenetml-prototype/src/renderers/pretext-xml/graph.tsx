import React from "react";
import * as JSG from "jsxgraph";
import { JSXGraph } from "jsxgraph";
import { BasicComponent } from "../types";
import { Element } from "../element";

export const GraphContext = React.createContext<JSG.Board | null>(null);

/**
 * Which layer each type of element is to be drawn on. These layers determine what shows up on top of what.
 *
 *  NOTE: there can be at most 10 different layer offsets,
 *  given that the DoenetML layer is multiplied by 10 and added to these offsets
 */
export const LAYER_OFFSETS = {
    base: 0,
    image: 1,
    line: 2,
    vertex: 3,
    controlPoint: 4,
    point: 5,
    text: 6,
};

export const Graph: BasicComponent = ({ node }) => {
    const boardId = "jsxgraph-board-" + node.data.id;
    const boardRef = React.useRef<HTMLDivElement>(null);
    const [board, setBoard] = React.useState<JSG.Board | null>(null);
    const [xaxis, setXaxis] = React.useState<JSG.Axis | null>(null);
    const [yaxis, setYaxis] = React.useState<JSG.Axis | null>(null);

    React.useLayoutEffect(() => {
        if (!boardRef.current) {
            return;
        }
        const board = JSXGraph.initBoard(boardRef.current, {
            axis: false,
            grid: false,
            showNavigation: false,
            showCopyright: false,
            boundingBox: [-5, 5, 5, -5],
            // Sometimes needed to keep the board from continually expanding
            resize: { enabled: false, throttle: 100 },
        });

        const xaxis = board.create(
            "axis",
            [
                [0, 0],
                [1, 0],
            ],
            {
                ticks: {
                    visible: true,
                    majorHeight: 10,
                    minorHeight: 5,
                    strokeColor: "var(--canvastext)",
                    strokeWidth: 1,
                },
                highlight: false,
                strokeColor: "var(--canvastext)",
            },
        );
        setXaxis(xaxis);
        const yaxis = board.create(
            "axis",
            [
                [0, 0],
                [0, 1],
            ],
            {
                ticks: {
                    visible: true,
                    majorHeight: 10,
                    minorHeight: 5,
                    strokeColor: "var(--canvastext)",
                    strokeWidth: 1,
                },
                highlight: false,
                strokeColor: "var(--canvastext)",
            },
        );
        setYaxis(yaxis);

        setBoard(board);
    }, [boardRef]);

    const elementChildrenIds = React.useMemo(
        () =>
            node.children
                .filter((n) => typeof n === "object" && "id" in n)
                .map((n) => (n as any).id) as number[],
        [node.children],
    );

    return (
        <div className="graph-container">
            <div
                className="jsxgraph-container"
                id={boardId}
                ref={boardRef}
            ></div>
            <GraphContext.Provider value={board}>
                {elementChildrenIds.map((id) => (
                    <Element key={id} id={id} constraint="graph" />
                ))}
            </GraphContext.Provider>
        </div>
    );
};
