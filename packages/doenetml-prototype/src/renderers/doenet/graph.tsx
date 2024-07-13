import React from "react";
import {
    VscChevronDown,
    VscChevronLeft,
    VscChevronRight,
    VscChevronUp,
    VscScreenNormal,
    VscTarget,
    VscZoomIn,
    VscZoomOut,
} from "react-icons/vsc";
import * as JSG from "jsxgraph";
import { JSXGraph } from "jsxgraph";
import { BasicComponent } from "../types";
import "./graph.css";
import { Toolbar, ToolbarItem } from "@ariakit/react";
import { Element } from "../element";

(window as any).JSG = JSG;

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
            renderer: "svg",
        });
        board.options.text.display = "internal";

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
            <NavButtons board={board} />
        </div>
    );
};

function NavButtons({ board }: { board: JSG.Board | null }) {
    if (!board) {
        return "No Board";
    }
    return (
        <div className="jsxgraph-nav-buttons">
            <Toolbar className="toolbar grouped-buttons">
                <ToolbarItem
                    className="button"
                    title="Zoom Out"
                    onClick={() => {
                        board.zoomOut();
                    }}
                >
                    <VscZoomOut />
                </ToolbarItem>
                <ToolbarItem
                    className="button"
                    title="Reset Zoom"
                    onClick={() => {
                        board.zoom100();
                    }}
                >
                    <VscScreenNormal />
                </ToolbarItem>
                <ToolbarItem
                    className="button"
                    title="Zoom In"
                    onClick={() => {
                        board.zoomIn();
                    }}
                >
                    <VscZoomIn />
                </ToolbarItem>
            </Toolbar>
            <Toolbar className="toolbar pan-buttons">
                <ToolbarItem
                    className="button west"
                    title="Pan Left"
                    onClick={() => {
                        board.clickLeftArrow();
                    }}
                >
                    <VscChevronLeft />
                </ToolbarItem>
                <ToolbarItem
                    className="button east"
                    title="Pan Right"
                    onClick={() => {
                        board.clickRightArrow();
                    }}
                >
                    <VscChevronRight />
                </ToolbarItem>
                <ToolbarItem
                    className="button north"
                    title="Pan Down"
                    onClick={() => {
                        board.clickDownArrow();
                    }}
                >
                    <VscChevronUp />
                </ToolbarItem>
                <ToolbarItem
                    className="button south"
                    title="Pan Up"
                    onClick={() => {
                        board.clickUpArrow();
                    }}
                >
                    <VscChevronDown />
                </ToolbarItem>
                <ToolbarItem
                    className="button center"
                    title="Center"
                    onClick={() => {
                        const [xmin, ymax, xmax, ymin] = board.getBoundingBox();
                        const width = xmax - xmin;
                        const height = ymax - ymin;

                        board.setBoundingBox([
                            -width / 2,
                            height / 2,
                            width / 2,
                            -height / 2,
                        ]);
                    }}
                >
                    <VscTarget />
                </ToolbarItem>
            </Toolbar>
        </div>
    );
}
