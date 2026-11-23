import React from "react";
import type * as JSG from "jsxgraph";
import { Action, PointPropsInGraph } from "@doenet/doenetml-worker";
import { BasicComponent } from "../types";
import { GraphContext } from "./graph";
import { useAppDispatch } from "../../state/hooks";
import { coreActions } from "../../state/redux-slices/core";
import { numberFromSerializedAst } from "../../utils/math/math-expression-utils";
import {
    finite,
    onClick,
    setCoords,
    useGraphObjects,
} from "./jsxgraph/use-graph-objects";
import { look } from "./jsxgraph/look";

type PointData = {
    props: PointPropsInGraph & {
        /** Drawn hollow (an open endpoint, an unstable equilibrium). */
        open?: boolean;
        /** Whether a click switches `open` (`switchPoint`). */
        switchable?: boolean;
    };
};

/** A point. Dragging it moves it; clicking a `switchable` one switches
 * whether it is `open`, which is drawn hollow. */
export const PointInGraph: BasicComponent<PointData> = ({ node }) => {
    const board = React.useContext(GraphContext);
    const dispatch = useAppDispatch();
    const id = node.data.id;
    // Read when the point is clicked, after the props it was made with.
    const latest = React.useRef(node.data.props);
    latest.current = node.data.props;

    useGraphObjects(board, node.data.props, {
        ready: ({ x, y }) => x != null && y != null,
        create: (board, _props, resync) => {
            const point: JSG.Point = board.create(
                "point",
                [0, 0],
                look.point(),
            );
            point.on("drag", () => {
                const action: Action = {
                    component: "point",
                    actionName: "move",
                    componentIdx: id,
                    args: { x: point.X(), y: point.Y() },
                };
                dispatch(coreActions.dispatchAction(action));
            });
            point.on("up", resync);
            onClick(point, () => {
                if (!latest.current.switchable) {
                    return;
                }
                const action: Action = {
                    component: "point",
                    actionName: "switchPoint",
                    componentIdx: id,
                    args: {},
                };
                dispatch(coreActions.dispatchAction(action));
            });
            return {
                objects: [point],
                point,
                wasOffGraph: false,
                open: false,
                filled: {
                    fillColor: point.getAttribute("fillColor"),
                    highlightFillColor:
                        point.getAttribute("highlightFillColor"),
                },
            };
        },
        update: (made, props) => {
            const { point } = made;
            const open = props.open === true;
            if (open !== made.open) {
                point.setAttribute(open ? look.hollow() : made.filled);
                made.open = open;
            }
            const x = numberFromSerializedAst(props.x.math_object);
            const y = numberFromSerializedAst(props.y.math_object);
            if (point.hasLabel) {
                // Move the label with the point
                point.label!.needsUpdate = true;
                point.label!.update();
            }
            setCoords(point, x, y);
            // A point back from non-numeric coordinates reappears only with
            // a full update.
            if (made.wasOffGraph) {
                (point as any).fullUpdate();
            }
            made.wasOffGraph = !finite(x, y);
        },
    });
    return null;
};
