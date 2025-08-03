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
import { Action, GraphPropsInText } from "@doenet/doenetml-worker";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { arrayEq } from "../../utils/array";

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

type GraphData = { props: GraphPropsInText };
type BoundingBox = [x1: number, y1: number, x2: number, y2: number];

export const Graph: BasicComponent<GraphData> = ({ node }) => {
    const boardId = "jsxgraph-board-" + node.data.id;
    const boardRef = React.useRef<HTMLDivElement>(null);
    const [board, setBoard] = React.useState<JSG.Board | null>(null);
    const [xaxis, setXaxis] = React.useState<JSG.Axis | null>(null);
    const [yaxis, setYaxis] = React.useState<JSG.Axis | null>(null);
    const previousBoundingBox = React.useRef<BoundingBox | null>(null);

    const dispatch = useAppDispatch();

    React.useLayoutEffect(() => {
        if (!boardRef.current) {
            return;
        }

        const boundingBox: BoundingBox = [
            node.data.props.xMin,
            node.data.props.yMax,
            node.data.props.xMax,
            node.data.props.yMin,
        ];
        previousBoundingBox.current = boundingBox;

        const board = JSXGraph.initBoard(boardRef.current, {
            axis: false,
            grid: false,
            showNavigation: false,
            showCopyright: false,
            boundingBox: boundingBox,
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
                    strokeColor: "var(--canvasText)",
                    strokeWidth: 1,
                },
                highlight: false,
                strokeColor: "var(--canvasText)",
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
                    strokeColor: "var(--canvasText)",
                    strokeWidth: 1,
                },
                highlight: false,
                strokeColor: "var(--canvasText)",
            },
        );
        setYaxis(yaxis);

        board.on("boundingbox", () => {
            const newBoundingBox = board.getBoundingBox();
            const [xMin, yMax, xMax, yMin] = newBoundingBox;

            // look for a change in bounding box that isn't due to round-off error
            const xScale = Math.abs(xMax - xMin);
            const yScale = Math.abs(yMax - yMin);
            const diffs = newBoundingBox.map((v, i) =>
                Math.abs(v - (previousBoundingBox.current?.[i] ?? 0)),
            );
            const eps = 1e-12;
            if (
                diffs[0] / xScale > eps ||
                diffs[1] / yScale > eps ||
                diffs[2] / xScale > eps ||
                diffs[3] / yScale > eps
            ) {
                previousBoundingBox.current = newBoundingBox;

                const action: Action = {
                    component: "graph",
                    actionName: "changeBoundingBox",
                    componentIdx: node.data.id,
                    args: { xMin, xMax, yMin, yMax },
                };
                dispatch(coreActions.dispatchAction(action));
            }
        });

        setBoard(board);

        return () => {
            board.off("boundingbox");
        };
    }, [boardRef]);

    const boundingBox: BoundingBox = [
        node.data.props.xMin,
        node.data.props.yMax,
        node.data.props.xMax,
        node.data.props.yMin,
    ];

    if (
        board &&
        (!previousBoundingBox.current ||
            !arrayEq(boundingBox, previousBoundingBox.current))
    ) {
        board.setBoundingBox(boundingBox);
        // seem to need to call fullUpdate to get the ticks correct
        board.fullUpdate();

        previousBoundingBox.current = boundingBox;
    }

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
                        const [xMin, yMax, xMax, yMin] = board.getBoundingBox();
                        const width = xMax - xMin;
                        const height = yMax - yMin;

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
