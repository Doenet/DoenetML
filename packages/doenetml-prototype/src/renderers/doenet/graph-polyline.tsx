import React from "react";
import type * as JSG from "jsxgraph";
import { Action } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { GraphContext } from "./graph";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import {
    finite,
    isPoints,
    onClick,
    refresh,
    setCoords,
    setVisible,
    useGraphObjects,
    xy,
} from "./jsxgraph/use-graph-objects";
import { look } from "./jsxgraph/look";

type PolylineData = {
    props: {
        numericalVertices: [number, number][];
        /** The points a curve is drawn through, each a handle a drag
         * moves (`moveThroughPoint`). */
        numericalThroughPoints?: [number, number][];
        /** Drawn dashed (an unstable equilibrium curve). */
        dashed?: boolean;
        /** Whether a click switches `dashed` (`switchCurve`). */
        switchable?: boolean;
    };
};

/**
 * A polyline through its vertices. Its vertices are points drawn, and
 * dragged, on their own; the polyline itself is not dragged. A function's
 * curve is drawn the same way, through its samples; a curve through points
 * has a handle at each, which a drag moves, and an equilibrium curve is
 * dashed while it is unstable, which a click on a switchable one switches.
 */
export const PolylineInGraph: BasicComponent<PolylineData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    const id = node.data.id;
    // Read when the curve is clicked, after the props it was made with.
    const latest = React.useRef(node.data.props);
    latest.current = node.data.props;
    const nThrough = node.data.props.numericalThroughPoints?.length ?? 0;

    useGraphObjects(board, node.data.props, {
        ready: ({ numericalVertices }) => isPoints(numericalVertices),
        // A handle per through point: made anew when their number changes.
        remake: nThrough,
        create: (board, _props, resync) => {
            const curve: JSG.Curve = board.create("curve", [[], []], {
                ...look.line(),
                fixed: true,
            });
            onClick(curve, () => {
                if (!latest.current.switchable) {
                    return;
                }
                const action: Action = {
                    component: node.name,
                    actionName: "switchCurve",
                    componentIdx: id,
                    args: {},
                };
                dispatch(coreActions.dispatchAction(action));
            });
            const handles = Array.from({ length: nThrough }, (_, i) => {
                const handle: JSG.Point = board.create(
                    "point",
                    [0, 0],
                    look.vertex(),
                );
                handle.on("drag", () => {
                    const action: Action = {
                        component: node.name,
                        actionName: "moveThroughPoint",
                        componentIdx: id,
                        args: { throughPointInd: i, throughPoint: xy(handle) },
                    };
                    dispatch(coreActions.dispatchAction(action));
                });
                handle.on("up", resync);
                return handle;
            });
            return { objects: [curve, ...handles], curve, handles };
        },
        update: (
            { curve, handles },
            { numericalVertices, numericalThroughPoints, dashed },
        ) => {
            curve.dataX = numericalVertices.map(([x]) => x);
            curve.dataY = numericalVertices.map(([, y]) => y);
            const dash = dashed ? 2 : 0;
            if (curve.getAttribute("dash") !== dash) {
                curve.setAttribute({ dash });
            }
            refresh(curve);
            handles.forEach((handle, i) => {
                const [x, y] = numericalThroughPoints?.[i] ?? [NaN, NaN];
                setVisible(handle, finite(x, y));
                setCoords(handle, x, y);
            });
        },
    });
    return null;
};
